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
from folios import get_folios_from_segment_keys

from dataloader_models import Parallel, Segment, MenuItem
from utils import (
    get_cat_from_segmentnr,
    should_download_file
)

# allow importing from api directory
PACKAGE_PARENT = ".."
SCRIPT_DIR = os.path.dirname(
    os.path.realpath(os.path.join(os.getcwd(), os.path.expanduser(__file__)))
)
sys.path.append(os.path.normpath(os.path.join(SCRIPT_DIR, PACKAGE_PARENT)))

from api.queries import menu_queries
from utils import get_language_from_file_name




def load_parallels(parallels, db: StandardDatabase) -> None:
    """
    Given an array of parallel objects, load them all into the `parallels` collection

    :param json_parallels: Array of parallel objects to be loaded as-they-are.
    :param db: ArangoDB connection object
    """
    

    db_collection = db.collection(COLLECTION_PARALLELS)
    parallels_to_be_inserted = []

    for parallel in parallels:
        if not should_download_file(parallel["root_segnr"][0]):
            continue
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

def load_parallels_for_language(folder, lang, db, number_of_threads):
    """
    Given a folder with parallel json files, load them all into the `parallels` collection

    :param folder: Folder with parallel json files
    :param db: ArangoDB connection object
    :param number_of_threads: Number of threads to use for parallel loading
    """
    db_collection = db.collection(COLLECTION_PARALLELS)
    # delete all parallels for this language
    db_collection.delete_many({"src_lang": lang})
    folder = os.path.join(folder, lang)
    files = os.listdir(folder)
    files = list(filter(lambda f: f.endswith(".json.gz"), files))
    pool = multiprocessing.Pool(number_of_threads)
    for file in files:
        pool.apply_async(process_file, args=(os.path.join(folder, file), db))
        #process_file(os.path.join(folder, file), db)    
    db_collection.add_hash_index(fields=['root_segnr', 'par_segnr', 'root_filename', 'par_filename', 'root_category', 'par_category', 'src_lang'])
    pool.close()
    pool.join()


def sort_and_extract_ids(parallels, key, natural=True):
    """Helper function to sort parallels and extract their IDs."""
    if natural:
        sorted_parallels = natsort.natsorted(parallels, key=key)
    else:
        sorted_parallels = sorted(parallels, key=key)
    return [p["_key"] for p in sorted_parallels]

def sort_parallels_for_file(data):
    filename, db = data
    print("Sorting parallels for file: ", filename)
    collection_parallels = db.collection(COLLECTION_PARALLELS)
    parallels = list(collection_parallels.find({"root_filename": filename}))
        
    ids_sorted_by_src_pos = sort_and_extract_ids(parallels, key=lambda x: x["root_segnr"][0])
    ids_sorted_by_tgt_pos = sort_and_extract_ids(parallels, key=lambda x: x["par_segnr"][0])
    ids_sorted_by_length_src = sort_and_extract_ids(parallels, key=lambda x: x["root_length"], natural=False)
    ids_sorted_by_length_tgt = sort_and_extract_ids(parallels, key=lambda x: x["par_length"], natural=False)
    ids_randomized = random.sample(ids_sorted_by_src_pos, len(ids_sorted_by_src_pos))
    
    lang = get_language_from_file_name(filename)
    return {
        "_key": filename,
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
    filenames = [f for f in filenames if should_download_file(f[0])]

    pool = multiprocessing.Pool(4)

    # Process in chunks of 20
    for chunk in tqdm(chunks(filenames, 50)):
        # Using list() here ensures that the pool processes all items in the current chunk before moving on
        results = list(tqdm(pool.imap_unordered(sort_parallels_for_file, chunk), total=len(chunk)))
        collection_parallels_sorted.insert_many(results)
        
    # add hash index on filename
    collection_parallels_sorted.add_hash_index(fields=['filename', 'lang'])
    pool.close()
    pool.join()

    print("Done sorting parallels.")