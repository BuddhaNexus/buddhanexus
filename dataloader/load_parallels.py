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

from dataloader_models import Match, validate_dict_list

from dataloader_constants import (
    COLLECTION_PARALLELS,
    COLLECTION_PARALLELS_SORTED_BY_FILE,
    MATCH_LIMIT,
)
from folios import get_folios_from_segment_keys

from utils import get_cat_from_segmentnr, should_download_file

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
        id = parallel["root_segnr"][0] + "_" + parallel["par_segnr"][0]
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
    parallels = json.load(gzip.open(path, "rt", encoding="utf-8")) # returns a list of dicts
    print(f"Validating {path}")
    if (validate_dict_list(path, Match, parallels)):
        print(f"Loading {path}")
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
        # process_file(os.path.join(folder, file), db)
    db_collection.add_hash_index(
        fields=[
            "root_filename",
            "par_filename",
            "root_category",
            "par_category",
            "src_lang",
            "par_lang",
        ],
        unique=False,
    )
    # add index for root_segnr on all list items
    db_collection.add_hash_index(fields=["root_segnr[*]"], unique=False)
    db_collection.add_hash_index(fields=["par_segnr[*]"], unique=False)

    pool.close()
    pool.join()


def load_sorted_parallels_file(path, lang, db_collection):
    print("Loading sorted parallels for file: ", path)
    current_files = json.load(gzip.open(path, "rt", encoding="utf-8")) # returns a list of dicts???
    for file in tqdm(current_files):
        if not should_download_file(file["filename"]):
            continue
        file["_key"] = file["filename"]
        file["lang"] = lang
        # print all keys of file
        file["parallels_sorted_by_src_pos"] = file["ids_sorted_by_root_segnr"][
            :MATCH_LIMIT
        ]
        file["parallels_sorted_by_tgt_pos"] = file["ids_sorted_by_par_segnr"][
            :MATCH_LIMIT
        ]
        file["parallels_sorted_by_length_src"] = file["ids_sorted_by_root_length"][
            :MATCH_LIMIT
        ]
        file["parallels_sorted_by_length_tgt"] = file["ids_sorted_by_par_length"][
            :MATCH_LIMIT
        ]
        file["parallels_randomized"] = file["ids_shuffled"][:MATCH_LIMIT]
        db_collection.insert(file, overwrite=True)


def load_sorted_parallels_for_language(folder, lang, db):
    """
    Given a folder with parallel json files, load them all into the `parallels` collection

    :param folder: Folder with parallel json files
    :param db: ArangoDB connection object
    :param number_of_threads: Number of threads to use for parallel loading
    """

    print("Loading sorted parallels for language: ", lang)
    db_collection = db.collection(COLLECTION_PARALLELS_SORTED_BY_FILE)
    # delete all parallels for this language
    db_collection.delete_many({"lang": lang})
    folder = os.path.join(folder, lang, "stats")
    files = os.listdir(folder)
    files = list(filter(lambda f: f.endswith("_stats.json.gz"), files))
    files = list(filter(lambda f: not "global" in f, files))
    for file in tqdm(files):
        load_sorted_parallels_file(os.path.join(folder, file), lang, db_collection)
    db_collection.add_hash_index(fields=["filename", "lang"])

    print("Done loading sorted parallels for language: ", lang)
