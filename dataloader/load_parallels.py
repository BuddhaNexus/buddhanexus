import json
import os
import gzip
import sys
from tqdm import tqdm as tqdm
from arango import DocumentInsertError, IndexCreateError
from arango.database import StandardDatabase
import multiprocessing
from utils import should_download_file, get_database
from time import sleep
from itertools import islice

from dataloader_models import Match, validate_dict_list
from dataloader_constants import (
    COLLECTION_PARALLELS,
    COLLECTION_PARALLELS_SORTED_BY_FILE,
    COLLECTION_FILES,
)

from shared.utils import (
    get_cat_from_segmentnr,
    get_filename_from_segmentnr,
)


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
        root_filename = get_filename_from_segmentnr(parallel["root_segnr"][0])
        par_filename = get_filename_from_segmentnr(parallel["par_segnr"][0])
        parallel["_id"] = parallel["id"]
        parallel["_key"] = parallel["id"]
        parallel["root_category"] = category_root
        parallel["par_category"] = category_parallel
        if root_filename in files_lookup:
            parallel["root_collection"] = files_lookup[root_filename]
        if par_filename in files_lookup:
            parallel["par_collection"] = files_lookup[par_filename]
        parallel["par_filename"] = par_filename
        # here we delete some things that we don't need in the DB:
        del parallel["id"]
        del parallel["par_segtext"]
        del parallel["root_segtext"]
        del parallel["par_string"]
        del parallel["root_string"]
        parallel["root_filename"] = root_filename
        parallels_to_be_inserted.append(parallel)

    chunksize = 1000
    for i in range(0, len(parallels_to_be_inserted), chunksize):
        try:
            db_collection.insert_many(parallels_to_be_inserted[i : i + chunksize])
        except (DocumentInsertError, IndexCreateError) as e:
            print(f"Could not save parallel {parallel}. Error: ", e)
    print("Done loading parallels")


def process_file(path, _):
    print("Processing file: ", path)
    db = get_database()
    
    chunk_size = 10000
    with gzip.open(path, 'rt', encoding='utf-8') as f:
        while True:
            # Read chunk_size lines and parse each as JSON
            chunk = list(map(json.loads, islice(f, chunk_size)))
            if not chunk:  # End of file
                break
                
            print(f"Validating chunk from {path}")
            if validate_dict_list(path, Match, chunk):
                print(f"Loading chunk from {path}")
                load_parallels(chunk, db)
            else:
                print(f"Validation failed for chunk from {path}")


def load_parallels_for_language(folder, lang, db, number_of_threads):
    """
    Given a folder with parallel json files, load them all into the `parallels` collection

    :param folder: Folder with parallel json files
    :param db: ArangoDB connection object
    :param number_of_threads: Number of threads to use for parallel loading
    """
    db_collection_files = db.collection(COLLECTION_FILES)
    db_collection = db.collection(COLLECTION_PARALLELS)
    # delete all parallels for this language
    db_collection.delete_many({"src_lang": lang})
    folder = os.path.join(folder, lang)
    files_db = db_collection_files.find({"lang": lang})
    global files_lookup
    files_lookup = {
        file["_key"]: file["collection"] for file in files_db if "collection" in file
    }

    files = os.listdir(folder)
    files = list(filter(lambda f: f.endswith(".ndjson.gz"), files))
    pool = multiprocessing.Pool(number_of_threads)
    async_results = []
    for file in files:
        print(f"Looping over file {file}")
        result = pool.apply_async(process_file, args=(os.path.join(folder, file), None))
        async_results.append(result)

    for result in async_results:
        result.get()

    db_collection.add_hash_index(
        fields=[
            "root_filename",
            "par_filename",
            "root_category",
            "par_category",
            "src_lang",
            "tgt_lang",
        ],
        unique=False,
    )
    # add index for root_segnr on all list items
    db_collection.add_hash_index(fields=["root_segnr[*]"], unique=False)
    db_collection.add_hash_index(fields=["par_segnr[*]"], unique=False)

    pool.close()
    pool.join()


def clean_parallels_for_language(lang, db):
    db_collection = db.collection(COLLECTION_PARALLELS)
    db_collection.delete_many({"src_lang": lang})
    print(f"Deleted all parallels for language {lang}")


def load_sorted_parallels_file(path, lang, db_collection):
    print("Loading sorted parallels for file: ", path)
    file = json.load(gzip.open(path, "rt", encoding="utf-8"))
    
    if not should_download_file(file["filename"]):
        return
        
    filename = get_filename_from_segmentnr(file["filename"])
    file["_key"] = filename
    file["lang"] = lang
    
    try:
        db_collection.insert(file, overwrite=True)
    except DocumentInsertError as e:
        print(f"Insert failed: {e}")
        raise


def load_sorted_parallels_for_language(folder, lang, db):
    """
    Given a folder with parallel json files, load them all into the `parallels` collection

    :param folder: Folder with parallel json files
    :param db: ArangoDB connection object
    """
    # create a dictionary with filename as key and collection as value for all files of current language
    print("Loading sorted parallels for language: ", lang)
    db_collection = db.collection(COLLECTION_PARALLELS_SORTED_BY_FILE)
    # delete all parallels for this language
    db_collection.delete_many({"lang": lang})

    folder = os.path.join(folder, lang, "stats")

    files = os.listdir(folder)
    files = list(filter(lambda f: f.endswith("_stats.json.gz"), files))
    files = list(filter(lambda f: not "global" in f, files))

    # Create a pool of 10 workers
    pool = multiprocessing.Pool(10)
    
    # Create arguments for each file
    args = [(os.path.join(folder, file), lang) for file in files]
    
    # Process files in parallel using pool.starmap
    list(tqdm(
        pool.imap_unordered(
            lambda x: load_sorted_parallels_file(*x, db.collection(COLLECTION_PARALLELS_SORTED_BY_FILE)),
            args
        ),
        total=len(files)
    ))
    
    pool.close()
    pool.join()
    
    # Add index after all files are loaded
    db.collection(COLLECTION_PARALLELS_SORTED_BY_FILE).add_hash_index(fields=["filename", "lang"])

    print("Done sorted parallels for language: ", lang)
