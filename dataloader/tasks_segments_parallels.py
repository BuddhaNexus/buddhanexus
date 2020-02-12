import json
import os
import re
import random
import sys
from collections import Counter, OrderedDict

from arango import DocumentInsertError, IndexCreateError
from arango.database import StandardDatabase

import queries.menu_queries
from dataloader_constants import (
    DEFAULT_LANGS,
    COLLECTION_PARALLELS,
    COLLECTION_SEGMENTS,
    COLLECTION_FILES,
    COLLECTION_FILES_PARALLEL_COUNT,
    COLLECTION_REGEX,
    COLLECTION_CATEGORIES_PARALLEL_COUNT,
    GRAPH_FILES_SEGMENTS,
    EDGE_COLLECTION_FILE_HAS_SEGMENTS,
)
from dataloader_models import Parallel, Segment, MenuItem
from dataloader_utils import (
    get_database,
    should_download_file,
    execute_in_parallel,
    get_segments_and_parallels_from_gzipped_remote_file,
    get_collection_list_for_language,
    get_categories_for_language_collection,
)

# allow importing from api directory
PACKAGE_PARENT = ".."
SCRIPT_DIR = os.path.dirname(
    os.path.realpath(os.path.join(os.getcwd(), os.path.expanduser(__file__)))
)
sys.path.append(os.path.normpath(os.path.join(SCRIPT_DIR, PACKAGE_PARENT)))

from api.queries import main_queries, menu_queries
from api.utils import get_language_from_filename

collection_pattern = "^(pli-tv-b[ui]-vb|XX|OT|[A-Z]+[0-9]+|[a-z\-]+)"


def create_files_segments_graph() -> None:
    db = get_database()
    graph = db.create_graph(GRAPH_FILES_SEGMENTS)
    # Files -> Segments
    graph.create_edge_definition(
        edge_collection=EDGE_COLLECTION_FILE_HAS_SEGMENTS,
        from_vertex_collections=[COLLECTION_FILES],
        to_vertex_collections=[COLLECTION_SEGMENTS],
    )


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
    create_files_segments_graph()


def load_segments_and_parallels_data_from_menu_file(
    menu_file_json, lang: str, root_url: str
) -> None:
    file_url = f"{root_url}{lang}/{menu_file_json['filename']}.json.gz"
    db = get_database()

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
        load_file_parallel_counts(
            menu_file_json, totallengthcount, totalfilelengthcount, db
        )

    if parallels:
        load_parallels(parallels, db)


def load_segments(segments: list, all_parallels: list, db: StandardDatabase) -> list:
    """ Returns list of segment numbers. """
    segmentnrs = []
    segmentnr_parallel_ids_dic = {}
    parallel_total_list = []
    parallel_file_total_list = []

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
                collection_key = re.search(COLLECTION_REGEX, parallel["par_segnr"][0])
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
            segmentnr = load_segment(segment, segment_count, parallel_ids, db)
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
    json_segment: Segment, count: int, parallel_ids: list, db: StandardDatabase
) -> str:
    """
    Given a single segment object, load it into the `segments` collection.

    :param json_segment: Segment JSON data
    :param count: Incrementing number of segments
    :param parallel_ids: Array of IDs of parallels of which segment is root
    :param db: ArangoDB database object
    :return: Segment nr
    """
    collection = db.collection(COLLECTION_SEGMENTS)
    try:
        doc = {
            "_key": json_segment["segnr"],
            "_id": f'segments/{json_segment["segnr"]}',
            "segnr": json_segment["segnr"],
            "segtext": json_segment["segtext"],
            "lang": json_segment["lang"],
            "position": json_segment["position"],
            "count": count,
            "parallel_ids": parallel_ids,
        }
        collection.insert(doc)
    except (KeyError, AttributeError) as e:
        print("Could not load segment. Error: ", e)
    except DocumentInsertError as e:
        print(f"Could not save segment {json_segment['segnr']}. Error: ", e)

    return json_segment["segnr"]


def load_file_parallel_counts(
    file: MenuItem,
    total_length_count: list,  # TODO: this is not typed correctly
    total_file_length_count: list,  # TODO: same as above
    db: StandardDatabase,
):
    db_collection = db.collection(COLLECTION_FILES_PARALLEL_COUNT)
    sorted_total_file_length_count = sorted(
        total_file_length_count.items(), key=lambda kv: kv[1], reverse=True
    )

    doc = {
        "_key": file["filename"],
        "category": file["category"],
        "language": get_language_from_filename(file["filename"]),
        "filenr": file["filenr"],
        "totallengthcount": total_length_count,
        "totalfilelengthcount": OrderedDict(sorted_total_file_length_count),
        "totallength": sum(total_length_count.values()),
    }
    try:
        db_collection.add_hash_index(["category"], unique=False)
        db_collection.insert(doc)
    except (DocumentInsertError, IndexCreateError) as e:
        print("Could not load file. Error: ", e)


def load_files_collection(file: MenuItem, segment_keys: list, db: StandardDatabase):
    files_db_collection = db.collection(COLLECTION_FILES)
    file_segments_edge_collection = db.collection(EDGE_COLLECTION_FILE_HAS_SEGMENTS)
    file_key = file["filename"]
    doc = {"_key": file_key, "segment_keys": segment_keys}
    doc.update(file)

    try:
        files_db_collection.insert(doc)

        # insert n documents at a time
        BATCH_SIZE = 1000
        batched_edge_docs = []
        for i, segment_key in enumerate(segment_keys):
            edge_doc = {
                "_from": f"{COLLECTION_FILES}/{file_key}",
                "_to": f"{COLLECTION_SEGMENTS}/{segment_key}",
            }
            batched_edge_docs.append(edge_doc)
            if i % BATCH_SIZE == 0:
                file_segments_edge_collection.insert_many(batched_edge_docs)
                batched_edge_docs = []
        # insert the remaining documents
        file_segments_edge_collection.insert_many(batched_edge_docs)
    except DocumentInsertError as e:
        print("Could not load file. Error: ", e)


def load_parallels(json_parallels: [Parallel], db: StandardDatabase) -> None:
    """
    Given an array of parallel objects, load them all into the `parallels` collection

    :param json_parallels: Array of parallel objects to be loaded as-they-are.
    :param db: ArangoDB connection object
    """
    db_collection = db.collection(COLLECTION_PARALLELS)
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
    db_collection.add_hash_index(["root_filename"], unique=False)
    chunksize = 10000  # 10000 for Tibetan, 100000 for Chinese

    for x in range(0, len(parallels_to_be_inserted), chunksize):
        try:
            db_collection.insert_many(parallels_to_be_inserted[x : x + chunksize])
        except (DocumentInsertError, IndexCreateError) as e:
            print(f"Could not save parallel {parallel}. Error: ", e)


def create_indices():
    collection = connection[COLLECTION_PARALLELS]
    collection.ensureHashIndex(["root_filename"], unique=False)


# TODO: Refactor this function. Split into smaller chunks.
def calculate_parallel_totals():
    # This function goes over all the data and groups it into totals for the visual view
    # This takes some time to run on the full dataset.
    db = get_database()
    collection_query_cursor = db.aql.execute(
        menu_queries.QUERY_CATEGORIES_PER_COLLECTION
    )
    collections = [doc for doc in collection_query_cursor]

    # for each collection, the totals to each other collection of that same language are calculated
    for col in collections:
        language = col["language"]
        source_collection = col["collection"]
        source_col_dict = {}
        for source_cat in col["categories"]:
            source_col_dict.update(source_cat)

        language_collection_list = get_collection_list_for_language(
            language, collections
        )

        for target_collection in language_collection_list:
            selected_category_dict = get_categories_for_language_collection(
                target_collection, collections
            )

            counted_parallels = []
            for category, cat_name in source_col_dict.items():
                all_files_cursor = db.aql.execute(
                    queries.menu_queries.QUERY_FILES_PER_CATEGORY,
                    batch_size=100000,
                    bind_vars={"category": category, "language": language},
                )
                all_files = [doc for doc in all_files_cursor]

                add_category_totals_to_db(
                    all_files,
                    category,
                    target_collection,
                    selected_category_dict,
                    language,
                )

                total_par_list = {}
                for filename in all_files:
                    parallel_count = filename["totallengthcount"]
                    for categoryname in selected_category_dict:
                        if categoryname not in total_par_list.keys():
                            if categoryname not in parallel_count.keys():
                                total_par_list[categoryname] = 0
                            else:
                                total_par_list[categoryname] = parallel_count[
                                    categoryname
                                ]
                        elif categoryname in parallel_count.keys():
                            total_par_list[categoryname] += parallel_count[categoryname]

                for key, value in total_par_list.items():
                    counted_parallels.append(
                        [
                            cat_name + " (" + category + ")",
                            selected_category_dict[key].rstrip() + "_(" + key + ")",
                            value,
                        ]
                    )

            load_parallel_counts(
                source_collection, target_collection, counted_parallels
            )


def add_category_totals_to_db(
    all_files, category, target_collection, selected_category_dict, language
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
        load_parallel_counts(
            language + "_" + filename["filename"],
            target_collection,
            file_counted_parallels_no_zeros,
        )
        counted_parallels += file_counted_parallels

    load_parallel_counts(
        language + "_" + category, target_collection, counted_parallels
    )


def load_parallel_counts(source_name: str, target_name: str, total_length_count: list):
    if total_length_count:
        db = get_database()
        collection = db.collection(COLLECTION_CATEGORIES_PARALLEL_COUNT)
        doc = {
            "_key": source_name + "_" + target_name,
            "sourcecollection": source_name,
            "targetcollection": target_name,
            "totallengthcount": total_length_count,
        }
        try:
            collection.add_hash_index(["sourcecollection"], unique=False)
            collection.insert(doc)
        except (DocumentInsertError, IndexCreateError) as e:
            print("Could not load file. Error: ", e)
