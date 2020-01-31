import os
import re
import random
from collections import Counter, OrderedDict
from pyArango.connection import *
from constants import (
    DEFAULT_LANGS,
    COLLECTION_PARALLELS,
    COLLECTION_SEGMENTS,
    COLLECTION_FILES,
    COLLECTION_MENU_COLLECTIONS,
    COLLECTION_MENU_CATEGORIES,
    COLLECTION_FILES_PARALLELCOUNT,
    COLLECTION_CATEGORIES_PARALLELCOUNT,
)
from models_dataloader import Parallel, Segment, MenuItem
from utils import (
    get_database,
    execute_in_parallel,
    should_download_file,
    get_segments_and_parallels_from_gzipped_remote_file,
    get_segments_and_parallels_from_gzipped_local_file,
)

import sys

PACKAGE_PARENT = ".."
SCRIPT_DIR = os.path.dirname(
    os.path.realpath(os.path.join(os.getcwd(), os.path.expanduser(__file__)))
)
sys.path.append(os.path.normpath(os.path.join(SCRIPT_DIR, PACKAGE_PARENT)))

from api.db_actions import get_files_per_category_from_db
from api.db_connection import get_db
from api.utils import get_language_from_filename
from api.db_queries import QUERY_CATEGORIES_PER_COLLECTION

collection_pattern = "^(pli-tv-b[ui]-vb|XX|OT|[A-Z]+[0-9]+|[a-z\-]+)"


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

    if segments:
        segmentnrs, totallengthcount, totalfilelengthcount = load_segments(
            segments, parallels, db
        )
        load_files_collection(menu_file_json, segmentnrs, db)
        load_files_parallelcounts(
            menu_file_json, totallengthcount, totalfilelengthcount, db
        )

    if parallels:
        load_parallels(parallels, db)


def load_segments(segments: list, all_parallels: list, connection: Connection) -> list:
    """ Returns list of segment numbers. """
    segmentnrs = []
    segmentnr_parallel_ids_dic = {}
    parallel_total_list = []
    parallel_file_total_list = []
    collection_key = ""

    for parallel in all_parallels:
        if isinstance(
            parallel, dict
        ):  # this relates to a strange bug in the generated data, I hope I can fix it in the future.
            if parallel["root_segnr"]:
                for segmentnr in parallel["root_segnr"]:
                    if not segmentnr in segmentnr_parallel_ids_dic.keys():
                        segmentnr_parallel_ids_dic[segmentnr] = [parallel["id"]]
                    else:
                        segmentnr_parallel_ids_dic[segmentnr].append(parallel["id"])

            if parallel["par_segnr"]:
                collection_key = re.search(collection_pattern, parallel["par_segnr"][0])
                if collection_key:
                    parallel_total_list.append(
                        {collection_key.group(): parallel["root_length"]}
                    )

                parallel_file_key = parallel["par_segnr"][0].split(":")[0]
                parallel_file_total_list.append(
                    {parallel_file_key: parallel["root_length"]}
                )

    segment_count = 0
    for segment in segments:
        parallel_ids = []
        if isinstance(segment, dict):
            if segment["segnr"] in segmentnr_parallel_ids_dic.keys():
                parallel_ids = segmentnr_parallel_ids_dic[segment["segnr"]]
            segmentnr = load_segment(segment, segment_count, parallel_ids, connection)
            segmentnrs.append(segmentnr)
            segment_count += 1

    totallengthcount = Counter()
    for totalcount in parallel_total_list:
        totallengthcount += Counter(totalcount)

    totalfilelengthcount = Counter()
    for totalparallelcount in parallel_file_total_list:
        totalfilelengthcount += Counter(totalparallelcount)

    return segmentnrs, totallengthcount, totalfilelengthcount


def load_segment(
    json_segment: Segment, count: int, parallel_ids: list, connection: Connection
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
        doc["count"] = count
        doc["parallel_ids"] = parallel_ids
    except KeyError as e:
        print("Could not load segment. Error: ", e)

    try:
        doc.save()
    except CreationError as e:
        print(f"Could not save segment {doc._key}. Error: ", e)

    return json_segment["segnr"]


def load_files_parallelcounts(
    file: MenuItem,
    totallengthcount: list,
    totalfilelengthcount: list,
    connection: Connection,
):
    collection = connection[COLLECTION_FILES_PARALLELCOUNT]
    doc = collection.createDocument()
    doc._key = file["filename"]
    doc["category"] = file["category"]
    doc["language"] = get_language_from_filename(file["filename"])
    doc["filenr"] = file["filenr"]
    doc["totallengthcount"] = totallengthcount
    sorted_totalfilelengthcount = sorted(
        totalfilelengthcount.items(), key=lambda kv: kv[1], reverse=True
    )
    doc["totalfilelengthcount"] = OrderedDict(sorted_totalfilelengthcount)
    doc["totallength"] = sum(totallengthcount.values())
    collection.ensureHashIndex(["category"], unique=False)
    try:
        doc.save()
    except CreationError as e:
        print("Could not load file. Error: ", e)


def load_files_collection(file: MenuItem, segmentnrs: list, connection: Connection):
    collection = connection[COLLECTION_FILES]
    doc = collection.createDocument()
    doc._key = file["filename"]
    doc.set(file)
    doc["segmentnrs"] = segmentnrs
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
    parallels_to_be_inserted = []
    for parallel in json_parallels:
        if isinstance(parallel, dict):
            parallel_id = f"parallels/{parallel['id']}"
            parallel["_key"] = parallel["id"]
            parallel["_id"] = parallel_id
            # here we delete some things that we don't need in the DB:
            del parallel["par_pos_end"]
            del parallel["root_pos_end"]
            del parallel["par_segtext"]
            del parallel["root_segtext"]
            del parallel["par_string"]
            del parallel["root_string"]
            parallel["root_filename"] = parallel["root_segnr"][0].split(":")[0]
            parallels_to_be_inserted.append(parallel)
    random.shuffle(parallels_to_be_inserted)
    chunksize = 10000  # 10000 for Tibetan, 100000 for Chinese
    for x in range(0, len(parallels_to_be_inserted), chunksize):
        try:
            collection.importBulk(parallels_to_be_inserted[x : x + chunksize])
        except CreationError as e:
            print(f"Could not save parallel {parallel}. Error: ", e)
    # I am not shure if this is the right place to add the index...
    collection.ensureHashIndex(["root_filename"], unique=False)


def load_menu_collection(menu_collection, language, collection_count, db):
    db_collection = db[COLLECTION_MENU_COLLECTIONS]
    doc = db_collection.createDocument()
    doc._key = f"{language}_{menu_collection['collection']}"
    doc.set(menu_collection)
    doc["language"] = language
    doc["collectionnr"] = collection_count
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
            collection_count = 0
            for collection in collections:
                load_menu_collection(collection, language, collection_count, db)
                collection_count += 1
            print("✓")


def load_menu_category(menu_category, category_count, language, db):
    db_collection = db[COLLECTION_MENU_CATEGORIES]
    doc = db_collection.createDocument()
    doc._key = f'{language}_{menu_category["category"]}'
    doc.set(menu_category)
    doc["language"] = language
    doc["categorynr"] = category_count
    db_collection.ensureHashIndex(["category"], unique=False)
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


def calculate_parallel_totals():
    # This function goes over all the data and groups it into totals for the visual view
    # This takes some time to run on the full dataset.
    database = get_db()
    query_collection_list = database.AQLQuery(query=QUERY_CATEGORIES_PER_COLLECTION,)

    # for each collection, the totals to each other collection of that same language are calculated
    for sourcecol in query_collection_list.result:
        language = sourcecol["language"]
        sourcecollection = sourcecol["collection"]
        sourcecol_dict = {}
        for sourcecat in sourcecol["categories"]:
            sourcecol_dict.update(sourcecat)

        language_collection_list = get_collection_list_for_language(
            language, query_collection_list.result
        )

        for targetcollection in language_collection_list:
            selected_category_dict = get_categories_for_language_collection(
                targetcollection, query_collection_list.result
            )

            counted_parallels = []
            for cat, catname in sourcecol_dict.items():
                all_files = get_files_per_category_from_db(cat, language)

                add_category_totals_to_db(
                    all_files, cat, targetcollection, selected_category_dict, language
                )

                total_parlist = {}
                for filename in all_files:
                    parallel_count = filename["totallengthcount"]
                    for categoryname in selected_category_dict:
                        if categoryname not in total_parlist.keys():
                            if categoryname not in parallel_count.keys():
                                total_parlist[categoryname] = 0
                            else:
                                total_parlist[categoryname] = parallel_count[
                                    categoryname
                                ]
                        elif categoryname in parallel_count.keys():
                            total_parlist[categoryname] += parallel_count[categoryname]

                for key, value in total_parlist.items():
                    counted_parallels.append(
                        [
                            catname + " (" + cat + ")",
                            selected_category_dict[key].rstrip() + "_(" + key + ")",
                            value,
                        ]
                    )

            load_parallelcounts(sourcecollection, targetcollection, counted_parallels)


def add_category_totals_to_db(
    all_files, category, targetcollection, selected_category_dict, language
):
    # for each collection, the totals of each category in that collection
    # to each other collection of that same language are calculated
    counted_parallels = []
    for filename in all_files:
        file_counted_parallels = []
        file_counted_parallels_no_zeros = []
        parallel_count = filename["totallengthcount"]
        for categoryname in selected_category_dict:
            weight_value = 0
            if categoryname in parallel_count:
                weight_value = parallel_count[categoryname]
            new_paralllel_entry = [
                filename["filename"],
                selected_category_dict[categoryname].rstrip()
                + "_("
                + categoryname
                + ")",
                weight_value,
            ]
            file_counted_parallels.append(new_paralllel_entry)
            if weight_value > 0:
                file_counted_parallels_no_zeros.append(new_paralllel_entry)
        load_parallelcounts(
            language + "_" + filename["filename"],
            targetcollection,
            file_counted_parallels_no_zeros,
        )
        counted_parallels += file_counted_parallels
    load_parallelcounts(language + "_" + category, targetcollection, counted_parallels)


def load_parallelcounts(sourcename: str, targetname: str, totallengthcount: list):
    if totallengthcount:
        connection = get_database()
        collection = connection[COLLECTION_CATEGORIES_PARALLELCOUNT]
        doc = collection.createDocument()
        doc._key = sourcename + "_" + targetname
        doc["sourcecollection"] = sourcename
        doc["targetcollection"] = targetname
        doc["totallengthcount"] = totallengthcount
        collection.ensureHashIndex(["sourcecollection"], unique=False)
        try:
            doc.save()
        except CreationError as e:
            print("Could not load file. Error: ", e)


def get_collection_list_for_language(language, allcols):
    total_collection_list = []
    for col in allcols:
        if col["language"] == language:
            total_collection_list.append(col["collection"])
    return total_collection_list


def get_categories_for_language_collection(language_collection, targetcol):
    for target in targetcol:
        if target["collection"] == language_collection:
            targetcol_dict = {}
            for targetcat in target["categories"]:
                targetcol_dict.update(targetcat)

            return targetcol_dict
