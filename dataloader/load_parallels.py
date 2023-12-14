import json
import os
import re
import gzip
import random
import sys
from tqdm import tqdm as tqdm
from arango import DocumentInsertError, IndexCreateError
from arango.database import StandardDatabase
import multiprocessing
import natsort

from dataloader_constants import (
    LANG_PALI,
    LANG_CHINESE,
    LANG_TIBETAN,
    LANG_SANSKRIT,
    COLLECTION_PARALLELS,
    COLLECTION_FILES,
    COLLECTION_PARALLELS_SORTED_BY_FILE,
)

from dataloader_models import Parallel, Segment, MenuItem
from dataloader_utils import (
    get_cat_from_segmentnr,
    natural_keys,
)

# allow importing from api directory
PACKAGE_PARENT = ".."
SCRIPT_DIR = os.path.dirname(
    os.path.realpath(os.path.join(os.getcwd(), os.path.expanduser(__file__)))
)
sys.path.append(os.path.normpath(os.path.join(SCRIPT_DIR, PACKAGE_PARENT)))

from api.queries import menu_queries
from api.utils import get_language_from_file_name



def get_folios_from_segment_keys(segment_keys, lang):
    folios = []
    if lang == LANG_CHINESE:
        last_num = ""
        for segment_key in segment_keys:
            num = segment_key.split("_")[1].split(":")[0]
            if num != last_num:
                folios.append({"num": num, "segment_nr": segment_key})
                last_num = num
    elif lang == LANG_TIBETAN:
        last_num = ""
        for segment_key in segment_keys:
            num = segment_key.split(":")[1].split("-")[0]
            if num != last_num:
                folios.append({"num": num, "segment_nr": segment_key})
                last_num = num
    elif lang == LANG_PALI:
        last_num = ""
        for segment_key in segment_keys:
            num = segment_key.split(":")[1].split(".")[0].split("_")[0]
            if re.search(r"^(anya|tika|atk)", segment_key):
                if num.endswith("0") and num != last_num:
                    folios.append({"num": num, "segment_nr": segment_key})
                    last_num = num
            else:
                if num != last_num:
                    folios.append({"num": num, "segment_nr": segment_key})
                    last_num = num
    elif lang == LANG_SANSKRIT:
        last_num = ""
        for segment_key in segment_keys:
            if re.search(r"^(K14dhppat|K10udanav|K10uvs)", segment_key):
                num = segment_key.split(":")[1].split("_")[1]
                if num != last_num:
                    folios.append({"num": num, "segment_nr": segment_key})
                    last_num = num
            else:
                num = segment_key.split(":")[1].split(".")[0].split("_")[0]
                if num.endswith("0") and num != last_num:
                    folios.append({"num": num, "segment_nr": segment_key})
                    last_num = num

    return folios

def load_parallels(parallels, db: StandardDatabase) -> None:
    """
    Given an array of parallel objects, load them all into the `parallels` collection

    :param json_parallels: Array of parallel objects to be loaded as-they-are.
    :param db: ArangoDB connection object
    """
    

    db_collection = db.collection(COLLECTION_PARALLELS)
    parallels_to_be_inserted = []

    for parallel in parallels:
        category_root = get_cat_from_segmentnr(parallel["root_segnr"][0])
        category_parallel = get_cat_from_segmentnr(parallel["par_segnr"][0])
        folios_list = get_folios_from_segment_keys(
            parallel["root_segnr"], parallel["src_lang"]
        )
        folios = []
        for folio in folios_list:
            folios.append(folio["num"])

        root_filename = parallel["root_segnr"][0].split(":")[0]
        root_filename = re.sub("_[0-9][0-9][0-9]", "", root_filename)
        par_filename = parallel["par_segnr"][0].split(":")[0]
        par_filename = re.sub("_[0-9][0-9][0-9]", "", par_filename)
        id = parallel['root_segnr'][0] + "_" + parallel['par_segnr'][0]        
        parallel["_id"] = id
        parallel["_key"] = id
        parallel["folios"] = folios
        parallel["root_category"] = category_root
        parallel["par_category"] = category_parallel
        parallel["par_filename"] = par_filename
        # here we delete some things that we don't need in the DB:
        del parallel["par_segtext"]
        del parallel["root_segtext"]
        del parallel["par_string"]
        del parallel["root_string"]
        # todo: delete the root_filename key after it's not needed anymore
        parallel["root_filename"] = root_filename
        parallels_to_be_inserted.append(parallel)
    chunksize = 10000
    for i in range(0, len(parallels_to_be_inserted), chunksize):
        try:
            db_collection.insert_many(parallels_to_be_inserted[i : i + chunksize])
        except (DocumentInsertError, IndexCreateError) as e:
            print(f"Could not save parallel {parallel}. Error: ", e)


def process_file(path, db):
    print("Processing file: ", path)
    parallels = json.load(gzip.open(path, "rt", encoding="utf-8"))
    load_parallels(parallels, db)

def load_parallels_from_folder(folder, db, number_of_threads):
    """
    Given a folder with parallel json files, load them all into the `parallels` collection

    :param folder: Folder with parallel json files
    :param db: ArangoDB connection object
    :param number_of_threads: Number of threads to use for parallel loading
    """
    files = os.listdir(folder)
    files = list(filter(lambda f: f.endswith(".json.gz"), files))
    pool = multiprocessing.Pool(number_of_threads)
    for file in files:
        pool.apply_async(process_file, args=(os.path.join(folder, file), db))
        #process_file(os.path.join(folder, file), db)
    pool.close()
    pool.join()


def sort_and_extract_ids(parallels, key, natural=True):
    """Helper function to sort parallels and extract their IDs."""
    if natural:
        sorted_parallels = natsort.natsorted(parallels, key=key)
    else:
        sorted_parallels = sorted(parallels, key=key)
    return [p["_id"] for p in sorted_parallels]

def sort_parallels_for_file(data):
    filename, db = data
    print("Sorting parallels for file: ", filename)
    collection_parallels = db.collection(COLLECTION_PARALLELS)
    parallels = list(collection_parallels.find({"root_filename": filename}))
    print(parallels[:100])
    ids_sorted_by_src_pos = sort_and_extract_ids(parallels, key=lambda x: x["root_segnr"][0])
    ids_sorted_by_tgt_pos = sort_and_extract_ids(parallels, key=lambda x: x["par_segnr"][0])
    ids_sorted_by_length_src = sort_and_extract_ids(parallels, key=lambda x: x["root_length"], natural=False)
    ids_sorted_by_length_tgt = sort_and_extract_ids(parallels, key=lambda x: x["par_length"], natural=False)
    ids_randomized = random.sample(ids_sorted_by_src_pos, len(ids_sorted_by_src_pos))
    
    lang = get_language_from_file_name(filename)
    return {
        "filename": filename,
        "lang": lang,
        "parallels_sorted_by_src_pos": ids_sorted_by_src_pos,
        "parallels_sorted_by_tgt_pos": ids_sorted_by_tgt_pos,
        "parallels_sorted_by_length_src": ids_sorted_by_length_src,
        "parallels_sorted_by_length_tgt": ids_sorted_by_length_tgt,
        "parallels_randomized": ids_randomized,
    }

def chunks(lst, n):
    """Yield successive n-sized chunks from lst."""
    for i in range(0, len(lst), n):
        yield lst[i:i + n]

def sort_parallels(db: StandardDatabase):
    print("\nSorting parallels...")

    collection_files = db.collection(COLLECTION_FILES)
    collection_parallels_sorted = db.collection(COLLECTION_PARALLELS_SORTED_BY_FILE)

    filenames = [[file["filename"], db] for file in tqdm(collection_files.all())]
    # keep only filenames that contain T06
    filenames = [f for f in filenames if "T06" in f[0]]

    pool = multiprocessing.Pool(12)

    # Process in chunks of 20
    for chunk in tqdm(chunks(filenames, 20)):
        # Using list() here ensures that the pool processes all items in the current chunk before moving on
        results = list(tqdm(pool.imap_unordered(sort_parallels_for_file, chunk), total=len(chunk)))
        collection_parallels_sorted.insert_many(results)

    pool.close()
    pool.join()

    print("Done sorting parallels.")