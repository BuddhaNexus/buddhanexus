import os
import re
from collections import Counter
from pyArango.connection import *

from constants import (
    DEFAULT_LANGS,
    COLLECTION_PARALLELS,
    COLLECTION_SEGMENTS,
    COLLECTION_FILES,
    COLLECTION_MENU_COLLECTIONS,
    COLLECTION_MENU_CATEGORIES,
)
from models_dataloader import Parallel, Segment, MenuItem
from utils import (
    get_database,
    execute_in_parallel,
    should_download_file,
    get_segments_and_parallels_from_gzipped_remote_file,
)

collection_pattern = "^(pli-tv-b[ui]-vb|[A-Z]+[0-9]+|[a-z\-]+)"

def load_segment_data_from_menu_files(root_url: str, threads: int):
    for language in DEFAULT_LANGS:
        with open(f"../data/{language}-files.json") as f:
            print(f"\nLoading segment data from menu files in {language}:...")
            files_data = json.load(f)

            filtered_file_data = (
                [
                    file
                    for file in files_data
                    if should_download_file(language, file["filename"])
                ]
                if os.environ["TESTING_LIMIT"]
                else files_data
            )

            execute_in_parallel(
                lambda item: load_segments_and_parallels_data_from_menu_file(
                    item, lang=language, root_url=root_url
                ),
                filtered_file_data,
                threads,
            )


def load_segments_and_parallels_data_from_menu_file(
    menu_file_json, lang: str, root_url: str
) -> None:
    file_url = f"{root_url}{lang}/{menu_file_json['filename']}.json.gz"
    db = get_database()

    print("Loading file: ", menu_file_json["filename"])

    if not file_url.endswith("gz"):
        print(f"{file_url} is not a gzip file. Ignoring.")
        return

    [segments, parallels] = get_segments_and_parallels_from_gzipped_remote_file(
        file_url
    )

    segmentnrs = []
    if segments:
        segmentnrs, parallelcount = load_segments(segments, parallels, db)

    load_files_collection(menu_file_json, segmentnrs, parallelcount, db)
    load_parallels(parallels, db)


def load_segments(segments: list, all_parallels: list, connection: Connection) -> list:
    """ Returns list of segment numbers. """
    segmentnrs = []
    segmentnr_parallel_ids_dic = {}
    parallel_keys = []
    for parallel in all_parallels:
        if not parallel['id'] in parallel_keys:
            parallel_keys.append(parallel['id'])
        for segmentnr in parallel['root_segnr']:
            if not segmentnr in segmentnr_parallel_ids_dic.keys():
                segmentnr_parallel_ids_dic[segmentnr] = [parallel['id']]
            else:
                segmentnr_parallel_ids_dic[segmentnr].append(parallel['id'])
                
    parallel_total_list = []
    collection_key = ""
    for segment in segments:
        parallel_ids = []
        if segment['segnr'] in segmentnr_parallel_ids_dic.keys():
            parallel_ids = segmentnr_parallel_ids_dic[segment['segnr']]
        segmentnr = load_segment(segment, parallel_ids, connection)
        segmentnrs.append(segmentnr)

    for parallel in all_parallels:
        if parallel and parallel["par_segnr"]:
            collection_key = re.search(collection_pattern, parallel["par_segnr"][0])
            parallel_total_list.append(collection_key.group())

    parallelcount = Counter(parallel_total_list)

    return segmentnrs, parallelcount


def load_segment(
    json_segment: Segment, parallel_ids: list, connection: Connection
) -> str:
    """
    Given a single segment object, load it into the `segments` collection.

    :param json_segment: Segment JSON data
    :param parallel_ids: Array of IDs of parallels of which segment is root
    :param connection: ArangoDB database object
    :return: Segment nr
    """
    collection = connection[COLLECTION_SEGMENTS]
    doc = collection.createDocument()
    try:
        doc._key = json_segment["segnr"]
        doc._id = f'segments/{json_segment["segnr"]}'
        doc["segnr"] = json_segment["segnr"]
        doc["segtext"] = json_segment["segtext"]
        doc["lang"] = json_segment["lang"]
        doc["position"] = json_segment["position"]
        doc["parallel_ids"] = parallel_ids
    except KeyError as e:
        print("Could not load segment. Error: ", e)

    try:
        doc.save()
    except CreationError as e:
        print(f"Could not save segment {doc._key}. Error: ", e)

    return json_segment["segnr"]


def load_files_collection(file: MenuItem, segmentnrs: list, parallelcount: list, connection: Connection):
    collection = connection[COLLECTION_FILES]
    doc = collection.createDocument()
    doc._key = file["filename"]
    doc.set(file)
    doc["segmentnrs"] = segmentnrs
    doc["parallelcount"] = parallelcount
    try:
        doc.save()
    except CreationError as e:
        print("Could not load file. Error: ", e)


def load_parallels(json_parallels: [Parallel], connection: Connection) -> None:
    """
    Given an array of parallel objects, load them all into the `parallels` collection

    :param json_parallels: Array of parallel objects to be loaded as-they-are.
    :param connection: ArangoDB connection object
    """
    collection = connection[COLLECTION_PARALLELS]
    for parallel in json_parallels:
        doc = collection.createDocument()
        parallel_id = f"parallels/{parallel['id']}"
        doc._key = parallel["id"]
        doc._id = parallel_id
        doc["filename"] = parallel["id"].split(":")[0]
        doc.set(parallel)
        try:
            doc.save()
        except CreationError as e:
            print(f"Could not save parallel {parallel}. Error: ", e)


def load_menu_collection(menu_collection, language, db):
    db_collection = db[COLLECTION_MENU_COLLECTIONS]
    doc = db_collection.createDocument()
    doc._key = f"{language}_{menu_collection['collection']}"
    doc.set(menu_collection)
    doc["language"] = language
    try:
        doc.save()
    except CreationError as e:
        print("Could not load menu collection. Error: ", e)


def load_all_menu_collections():
    db = get_database()
    for language in DEFAULT_LANGS:
        with open(f"../data/{language}-collections.json") as f:
            print(f"Loading menu collections in {language}...")
            collections = json.load(f)
            for collection in collections:
                load_menu_collection(collection, language, db)
            print("✓")


def load_menu_category(menu_category, category_count, language, db):
    db_collection = db[COLLECTION_MENU_CATEGORIES]
    doc = db_collection.createDocument()
    doc._key = f'{language}_{menu_category["category"]}'
    doc.set(menu_category)
    doc["language"] = language
    doc["categorynr"] = category_count
    try:
        doc.save()
    except CreationError as e:
        print("Could not load menu category. Error: ", e)


def load_all_menu_categories():
    db = get_database()
    for language in DEFAULT_LANGS:
        with open(f"../data/{language}-categories.json") as f:
            print(f"Loading menu categories in {language}...")
            categories = json.load(f)
            category_count = 0
            for category in categories:
                load_menu_category(category, category_count, language, db)
                category_count += 1
            print("✓")
