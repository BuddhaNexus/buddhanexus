"""
This code loads the segments for the files into the database.
"""

from collections import defaultdict
import os
import natsort
import multiprocessing
import re
import time
import pandas as pd
from tqdm import tqdm as tqdm
from arango.database import StandardDatabase
from dataloader_models import Segment, validate_df

from dataloader_constants import (
    METADATA_DIR,
    COLLECTION_SEARCH_INDEX_TIB,
    COLLECTION_SEARCH_INDEX_SKT,
    COLLECTION_SEARCH_INDEX_PLI,
    COLLECTION_SEARCH_INDEX_CHN,
    SKT_TSV_DATA_PATH,
    PLI_TSV_DATA_PATH,
    TIB_TSV_DATA_PATH,
    CHN_TSV_DATA_PATH,
    COLLECTION_SEGMENTS,
    COLLECTION_SEGMENTS_PAGES,
    COLLECTION_FILES,
)

from utils import (
    check_if_collection_exists,
    get_database,
    should_download_file,
)
from api.utils import (
    get_cat_from_segmentnr,
    get_language_from_file_name,
    get_filename_from_segmentnr,
)
from folios import get_folios_from_segment_keys


def sliding_window(data_list, window_size=3):
    """Generates sliding windows from a list."""
    return [
        data_list[i : i + window_size] for i in range(len(data_list) - window_size + 1)
    ]


def process_file_group_helper(args):
    loader_instance, file_group = args
    for file in file_group:
        loader_instance._process_file(file)


class LoadSegmentsBase:
    SEARCH_COLLECTION_NAME: str
    DATA_PATH: str

    def __init__(self) -> None:
        self.metadata_file_list = self._init_metadata_file_list()

    def _init_metadata_file_list(self):
        df = pd.read_json(f"{METADATA_DIR}{self.LANG}-files.json")
        return df["filename"].to_list()

    def _load_segments(self, file_df, db) -> None:
        segments = [
            {
                "_key": segnr,
                "segnr": segnr,
                "segtext": original,
                "language": self.LANG,
                "filename": get_filename_from_segmentnr(segnr),
            }
            for segnr, original in zip(file_df["segmentnr"], file_df["original"])
        ]
        # print(f"DEBUG: segments[:3]: {segments[:3]}")
        db.collection(COLLECTION_SEGMENTS).delete_many({"language": self.LANG})
        db.collection(COLLECTION_SEGMENTS).insert_many(segments)
        db.collection(COLLECTION_SEGMENTS).add_hash_index(fields=["segnr", "language"])
        db.collection(COLLECTION_SEGMENTS_PAGES).add_hash_index(fields=["segnr"])

        segnrs = [segment["segnr"] for segment in segments]
        filename = get_filename_from_segmentnr(segnrs[0])
        # hack as this filename breaks the DB
        if "K12D0505B" in filename:
            return
        # check if filename is in collection
        current_file = db.collection(COLLECTION_FILES).get(filename)
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
        stems = sliding_window(file_df["stemmed"].tolist(), 3)
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
                    "segment_nr": segnr,
                    "original": original,
                    "stemmed": stem,
                    "category": category,
                    "language": self.LANG,
                    "file_name": get_filename_from_segmentnr(segnr[1]),
                }
            )
        db.collection(self.SEARCH_COLLECTION_NAME).delete_many({"language": self.LANG})

        db.collection(self.SEARCH_COLLECTION_NAME).insert_many(search_index_entries)

        db.collection(self.SEARCH_COLLECTION_NAME).add_hash_index(
            fields=["segment_nr", "language"]
        )

    def _process_file(self, file):
        metadata_reference_filename = file.split(".tsv")[0].split("$")[0]
        # n0 and n1 only appear in chinese files, we need to remove folio numbers for these as well
        if "n0" in metadata_reference_filename or "n1" in metadata_reference_filename or "n2" in metadata_reference_filename:
            metadata_reference_filename = re.sub(r"_[0-9][0-9][0-9abcdef]", "", metadata_reference_filename)
        if metadata_reference_filename not in self.metadata_file_list:
            print(f"ERROR: file not in metadata: { file }")
            print(f"metadata_reference_filename: {metadata_reference_filename}")
            return
        print(f"Processing file: { file }")
        db = get_database()
        try:
            file_df = pd.read_csv(os.path.join(self.DATA_PATH, file), sep="\t")
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
            db.collection(COLLECTION_SEGMENTS).add_hash_index(fields=["segnr"])

        category_files = defaultdict(list)
        print(f"Loading Segments from: {self.DATA_PATH}")
        if os.path.isdir(self.DATA_PATH):
            all_files = sorted(
                [f for f in os.listdir(self.DATA_PATH) if f.endswith(".tsv")]
            )
            print(f"Found {len(all_files)} with .tsv extention")
            for file in all_files:
                if file.endswith(".tsv") and should_download_file(file):
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
        print("DONE LOADING DATA")
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

        segments = collection_segments.find({"language": self.LANG})

        for segment in tqdm(segments):
            filename = get_filename_from_segmentnr(segment["segnr"])
            if filename not in segments_by_file:
                segments_by_file[filename] = []
            segments_by_file[filename].append(segment["segnr"])

        for filename in tqdm(segments_by_file):
            segments_sorted = natsort.natsorted(segments_by_file[filename])
            lang = get_language_from_file_name(filename)
            folios = get_folios_from_segment_keys(segments_sorted, lang)

            page_size = 400
            segments_paginated = [
                segments_sorted[i : i + page_size]
                for i in range(0, len(segments_sorted), page_size)
            ]

            segments_paginated = {
                count: page for count, page in enumerate(segments_paginated)
            }

            segments_paginated_to_be_inserted = []
            for page in segments_paginated:
                current_segments = [
                    {"segnr": seg, "page": page} for seg in segments_paginated[page]
                ]
                segments_paginated_to_be_inserted += current_segments

            collection_segments_pages.insert_many(segments_paginated_to_be_inserted)

            file = collection_files.get(filename)
            # this is a hack since arango doesn't permit [] in keys; we need to fix the data!
            if not "=[" in filename:
                if file:
                    file["segment_keys"] = segments_sorted
                    file["segment_pages"] = segments_paginated
                    file["language"] = lang
                    file["folios"] = folios
                    collection_files.update(file)
                else:
                    print(f"Could not find file {filename} in db.")
                    file = {
                        "_key": filename,
                        "filename": filename,
                        "language": lang,
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
    SEARCH_COLLECTION_NAME = COLLECTION_SEARCH_INDEX_SKT
    DATA_PATH = SKT_TSV_DATA_PATH
    LANG = "skt"


class LoadSegmentsPali(LoadSegmentsBase):
    SEARCH_COLLECTION_NAME = COLLECTION_SEARCH_INDEX_PLI
    DATA_PATH = PLI_TSV_DATA_PATH
    LANG = "pli"


class LoadSegmentsTibetan(LoadSegmentsBase):
    SEARCH_COLLECTION_NAME = COLLECTION_SEARCH_INDEX_TIB
    DATA_PATH = TIB_TSV_DATA_PATH
    LANG = "tib"


class LoadSegmentsChinese(LoadSegmentsBase):
    SEARCH_COLLECTION_NAME = COLLECTION_SEARCH_INDEX_CHN
    DATA_PATH = CHN_TSV_DATA_PATH
    LANG = "chn"
