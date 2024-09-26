"""
This code loads the segments for the files into the database.
"""

from collections import defaultdict
import os
import sys
import natsort
import multiprocessing
import time
import pandas as pd
from tqdm import tqdm as tqdm

from dataloader_constants import (
    PAGE_SIZE,
    COLLECTION_SEARCH_INDEX_BO,
    COLLECTION_SEARCH_INDEX_SA,
    COLLECTION_SEARCH_INDEX_PA,
    COLLECTION_SEARCH_INDEX_ZH,
    SEGMENT_URLS,
    COLLECTION_SEGMENTS,
    COLLECTION_SEGMENTS_PAGES,
    COLLECTION_FILES,
    LANG_PALI,
    LANG_SANSKRIT,
    LANG_TIBETAN,
    LANG_CHINESE,
    METADATA_URLS,
)

from utils import (
    check_if_collection_exists,
    get_database,
    should_download_file,
    sliding_window,
)

# allow importing from api directory
PACKAGE_PARENT = ".."
SCRIPT_DIR = os.path.dirname(
    os.path.realpath(os.path.join(os.getcwd(), os.path.expanduser(__file__)))
)
sys.path.append(os.path.normpath(os.path.join(SCRIPT_DIR, PACKAGE_PARENT)))

from api.utils import (
    get_cat_from_segmentnr,
    get_language_from_file_name,
    get_filename_from_segmentnr,
)


def process_file_group_helper(args):
    loader_instance, file_group = args
    for file in file_group:
        loader_instance._process_file(file)


class LoadSegmentsBase:
    SEARCH_COLLECTION_NAME: str

    def __init__(self) -> None:
        self.metadata = self._init_metadata()
        self.DATA_PATH = SEGMENT_URLS[self.LANG] + "segments/"

    def _init_metadata(self):
        df = pd.read_json(METADATA_URLS[self.LANG])
        return df.set_index("filename").to_dict(orient="index")

    def _load_segments(self, segments_df, db) -> None:
        # print(f"DEBUG: segments[:3]: {segments[:3]}")
        db.collection(COLLECTION_SEGMENTS).delete_many({"lang": self.LANG})
        db.collection(COLLECTION_SEGMENTS).insert_many(segments_df.to_dict("records"))

        db.collection(COLLECTION_SEGMENTS).add_hash_index(
            fields=["segmentnr", "lang", "filename", "category", "collection"],
            unique=False,
        )
        db.collection(COLLECTION_SEGMENTS_PAGES).add_hash_index(fields=["segmentnr"])
        filename = segments_df["filename"].iloc[0]

        current_file_cursor = db.collection(COLLECTION_FILES).find(
            {"filename": filename}
        )
        current_file = next(current_file_cursor, None)

        segnrs = segments_df["segmentnr"].tolist()
        filename = segments_df["filename"].iloc[0]

        if current_file:
            current_file["segment_keys"] += segnrs
            db.collection(COLLECTION_FILES).update(current_file)
        else:
            db.collection(COLLECTION_FILES).insert(
                {"_key": filename, "filename": filename, "segment_keys": segnrs}
            )

    def _load_segments_to_search_index(self, file_df, db) -> None:
        """
        Loads the segments to the search index, which are separate lists that use a sliding window of 3 segments to enable search queries that are longer than one sentence.
        """
        segmentnrs = sliding_window(file_df["segmentnr"].tolist(), 3)
        originals = sliding_window(file_df["original"].tolist(), 3)
        stems = sliding_window(file_df["analyzed"].tolist(), 3)
        search_index_entries = []
        for segnr, original, stem in zip(segmentnrs, originals, stems):
            if self.LANG == "chn":
                original = "".join(original)
                stem = "".join(stem)
            else:

                original = " ".join(original)
                stem = " ".join(stem)
            category = get_cat_from_segmentnr(segnr[1])

            search_index_entries.append(
                {
                    "segmentnr": segnr,
                    "original": original,
                    "analyzed": stem,
                    "category": category,
                    "lang": self.LANG,
                    "filename": get_filename_from_segmentnr(segnr[1]),
                }
            )
        db.collection(self.SEARCH_COLLECTION_NAME).delete_many({"lang": self.LANG})

        db.collection(self.SEARCH_COLLECTION_NAME).insert_many(search_index_entries)

        db.collection(self.SEARCH_COLLECTION_NAME).add_hash_index(
            fields=["segmentnr", "lang"]
        )

    def _process_file(self, file):
        metadata_reference_filename = file.replace(".json", "")
        if metadata_reference_filename not in self.metadata:
            print(f"ERROR: file not in metadata: { file }")
            print(f"metadata_reference_filename: {metadata_reference_filename}")
            return
        print(f"Processing file: { file }")
        db = get_database()
        try:
            file_df = pd.read_json(os.path.join(self.DATA_PATH, file))
            file_df["lang"] = self.LANG
            file_df["filename"] = metadata_reference_filename
            file_df["category"] = self.metadata[metadata_reference_filename]["category"]
            file_df["collection"] = self.metadata[metadata_reference_filename][
                "collection"
            ]
            self._load_segments(file_df, db)
            self._load_segments_to_search_index(file_df, db)
        except Exception as e:
            print(f"Error while processing file {file}: {e}")

    def load(self, number_of_threads: int = 1) -> None:
        # only create collection if it does not exist
        db = get_database()
        if not check_if_collection_exists(db, self.SEARCH_COLLECTION_NAME):
            db.create_collection(self.SEARCH_COLLECTION_NAME)
        if not check_if_collection_exists(db, COLLECTION_SEGMENTS):
            db.create_collection(COLLECTION_SEGMENTS)
            db.collection(COLLECTION_SEGMENTS).add_hash_index(fields=["segmentnr"])

        category_files = defaultdict(list)
        print(f"Loading Segments from: {self.DATA_PATH}")
        if os.path.isdir(self.DATA_PATH):
            all_files = sorted(
                [f for f in os.listdir(self.DATA_PATH) if f.endswith(".json")]
            )
            print(f"Found {len(all_files)} with .json extention")
            for file in all_files:
                if should_download_file(file):
                    category = get_cat_from_segmentnr(file)
                    category_files[category].append(file)
                    if number_of_threads == 1:
                        self._process_file(file)
        else:
            print(f"Could not find {self.DATA_PATH}")

        # Process the grouped files
        if number_of_threads > 1:
            with multiprocessing.Pool(number_of_threads) as pool:

                file_groups = list(category_files.values())
                pool.map(
                    process_file_group_helper,
                    [(self, file_group) for file_group in file_groups],
                )
        # for reasons beyound my ability to comprehend, the multihtreaded version is broken and throws a strange 'request missing' error
        else:
            for file_group in tqdm(list(category_files.values())):
                process_file_group_helper((self, file_group))
        print("DONE LOADING SEGMENT DATA")
        self._sort_segnrs()

    def _sort_segnrs(self):
        time_before = time.time()
        """
        This sorts the segmentnrs per file, as we don't know their order yet when loading them.
        """
        db = get_database()
        print("\nSorting segment numbers...")
        collection_segments = db.collection(COLLECTION_SEGMENTS)
        collection_segments_pages = db.collection(COLLECTION_SEGMENTS_PAGES)
        collection_files = db.collection(COLLECTION_FILES)
        segments_by_file = {}

        segments = collection_segments.find({"lang": self.LANG})
        folios = []
        for segment in tqdm(segments):
            filename = get_filename_from_segmentnr(segment["segmentnr"])
            if filename not in segments_by_file:
                segments_by_file[filename] = []
            segments_by_file[filename].append(segment["segmentnr"])
            folios.append(segment["folio"])

        for filename in tqdm(segments_by_file):
            segments_sorted = natsort.natsorted(segments_by_file[filename])
            lang = get_language_from_file_name(filename)
            # in order to save some grief on the frontend, we paginate the segments arbitrarily
            page_size = 400
            segments_paginated = [
                segments_sorted[i : i + PAGE_SIZE]
                for i in range(0, len(segments_sorted), PAGE_SIZE)
            ]

            segments_paginated = {
                count: page for count, page in enumerate(segments_paginated)
            }

            segments_paginated_to_be_inserted = []
            for page in segments_paginated:
                current_segments = [
                    {"segmentnr": seg, "page": page} for seg in segments_paginated[page]
                ]
                segments_paginated_to_be_inserted += current_segments

            collection_segments_pages.insert_many(segments_paginated_to_be_inserted)
            # get file where 'textname' equals to filename
            files = list(collection_files.find({"filename": filename}))
            if len(files) > 0:
                file = files[0]
                file["segment_keys"] = segments_sorted
                file["segment_pages"] = segments_paginated
                file["lang"] = lang
                file["folios"] = folios
                collection_files.update(file)
            else:
                # if we don't have metadata for a file, this will end in an orphaned file in the db. For cempletion sake, we will insert this anyway, but its a bad sign.
                print(f"Could not find file {filename} in db.")
                file = {
                    "_key": filename,
                    "filename": filename,
                    "lang": lang,
                    "folios": folios,
                    "segment_keys": segments_sorted,
                    "segment_pages": segments_paginated,
                }
                collection_files.insert(file)
        print("Done sorting segment numbers.")
        print(
            f"Time taken to sort segment numbers: {time.time() - time_before:.2f} seconds."
        )

    def clean(self):
        db = get_database()
        print(f"Cleaning segments for language: {self.LANG}.")
        db.collection(COLLECTION_SEGMENTS).delete_many({"language": self.LANG})


class LoadSegmentsSanskrit(LoadSegmentsBase):
    SEARCH_COLLECTION_NAME = COLLECTION_SEARCH_INDEX_SA
    LANG = LANG_SANSKRIT


class LoadSegmentsPali(LoadSegmentsBase):
    SEARCH_COLLECTION_NAME = COLLECTION_SEARCH_INDEX_PA
    LANG = LANG_PALI


class LoadSegmentsTibetan(LoadSegmentsBase):
    SEARCH_COLLECTION_NAME = COLLECTION_SEARCH_INDEX_BO
    LANG = LANG_TIBETAN


class LoadSegmentsChinese(LoadSegmentsBase):
    SEARCH_COLLECTION_NAME = COLLECTION_SEARCH_INDEX_ZH
    LANG = LANG_CHINESE
