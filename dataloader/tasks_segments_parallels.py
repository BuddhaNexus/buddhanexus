import json
import os
import re
import gzip
import random
import sys
import unidecode
from collections import Counter, OrderedDict
from tqdm import tqdm as tqdm
from arango import DocumentInsertError, IndexCreateError
from arango.database import StandardDatabase

from dataloader_constants import (
    DEFAULT_LANGS,
    LANG_PALI,
    LANG_CHINESE,
    LANG_TIBETAN,
    LANG_SANSKRIT,

    COLLECTION_PARALLELS,
    COLLECTION_PARALLELS_SORTED_BY_FILE,
    COLLECTION_SEGMENTS,
    COLLECTION_FILES,
    COLLECTION_FILES_PARALLEL_COUNT,
    COLLECTION_REGEX,
    COLLECTION_CATEGORIES_PARALLEL_COUNT,
)

from dataloader_models import Parallel, Segment, MenuItem
from dataloader_utils import (
    get_database,
    should_download_file,
    execute_in_parallel,
    get_cat_from_segmentnr,
    get_segments_and_parallels_from_gzipped_remote_file,
    get_collection_list_for_language,
    get_categories_for_language_collection,
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


def load_segment_data_from_menu_files(root_url: str, threads: int, langs: list):
    for language in langs:
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
        segment_keys, totallengthcount, totalfilelengthcount = load_segments(
            segments, parallels, db
        )
        load_files_collection(menu_file_json, segment_keys, lang, db)
        load_file_parallel_counts(
            menu_file_json, totallengthcount, totalfilelengthcount, db
        )

    if parallels:
        load_parallels(parallels, db)
        load_parallels_sorted(parallels, db, menu_file_json["filename"])


def load_segments(segments: list, all_parallels: list, db: StandardDatabase) -> list:
    """Returns list of segment numbers."""
    segment_keys = []
    segmentnr_parallel_ids_dic = {}
    segmentnr_parallel_ids_dic_limited = {}
    parallel_total_list = []
    parallel_file_total_list = []

    for parallel in all_parallels:
        if isinstance(
            parallel, dict
        ):  # this relates to a strange bug in the generated data, I hope I can fix it in the future. TODO 4/20: check if this problem still exists, maybe we can get rid of it
            if parallel["root_segnr"]:
                for segment_key in parallel["root_segnr"]:
                    if segment_key not in segmentnr_parallel_ids_dic.keys():
                        segmentnr_parallel_ids_dic[segment_key] = [parallel["id"]]
                    else:
                        segmentnr_parallel_ids_dic[segment_key].append(parallel["id"])
                    # the limited-dic collects only the first 10 parallels, because we don't need more for the text-view.
                    if parallel["co-occ"] <= 20:
                        if segment_key not in segmentnr_parallel_ids_dic_limited.keys():
                            segmentnr_parallel_ids_dic_limited[segment_key] = [
                                parallel["id"]
                            ]
                        else:
                            segmentnr_parallel_ids_dic_limited[segment_key].append(
                                parallel["id"]
                            )

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
        parallel_ids_limited = []
        if isinstance(segment, dict):
            if segment["segnr"] in segmentnr_parallel_ids_dic.keys():
                parallel_ids = segmentnr_parallel_ids_dic[segment["segnr"]]
            if segment["segnr"] in segmentnr_parallel_ids_dic_limited.keys():
                parallel_ids_limited = segmentnr_parallel_ids_dic_limited[
                    segment["segnr"]
                ]

            # Loads segment into database
            # todo: remove parallel_ids table
            segment_key = load_segment(
                segment, segment_count, parallel_ids, parallel_ids_limited, db
            )

            segment_keys.append(segment_key)
            segment_count += 1
    totallengthcount = Counter()
    for totalcount in parallel_total_list:
        totallengthcount += Counter(totalcount)

    totalfilelengthcount = Counter()
    for totalparallelcount in parallel_file_total_list:
        totalfilelengthcount += Counter(totalparallelcount)

    return segment_keys, totallengthcount, totalfilelengthcount


def load_segment(
    json_segment: Segment,
    count: int,
    parallel_ids: list,
    parallel_ids_limited: list,
    db: StandardDatabase,
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
            "parallel_ids_limited": parallel_ids_limited,
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
        "language": get_language_from_file_name(file["filename"]),
        "filenr": file["filenr"],
        "totallengthcount": total_length_count,
        "totalfilelengthcount": OrderedDict(sorted_total_file_length_count),
        "totallength": sum(total_length_count.values()),
    }
    try:
        db_collection.add_hash_index(["category"], unique=False)
        if db_collection.get(file["filename"]):
            db_collection.delete(file["filename"])
        db_collection.insert(doc)
    except (DocumentInsertError, IndexCreateError) as e:
        print("Could not load file. Error: ", e)


def load_files_collection(
    file: MenuItem, segment_keys: list, lang: str, db: StandardDatabase
):
    files_db_collection = db.collection(COLLECTION_FILES)
    file_key = file["filename"]
    folios = get_folios_from_segment_keys(segment_keys, lang)
    search_field = (
        file["textname"]
        + " "
        + file["displayName"]
        + " ("
        + unidecode.unidecode(file["displayName"])
        + ")"
    )
    doc = {
        "_key": file_key,
        "segment_keys": segment_keys,
        "folios": folios,
        "language": lang,
        "search_field": search_field,
    }
    doc.update(file)
    try:
        files_db_collection.insert(doc)
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
    root_file_parallel_edges_to_be_inserted = []

    collection_query_cursor = db.aql.execute(
        menu_queries.QUERY_CATEGORIES_PER_COLLECTION
    )
    collections = [doc for doc in collection_query_cursor]

    for parallel in json_parallels:
        if isinstance(parallel, dict):
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

            parallel_id = f"parallels/{parallel['id']}"
            parallel["_key"] = parallel["id"]
            parallel["_id"] = parallel_id
            parallel["folios"] = folios
            parallel["root_category"] = category_root
            parallel["par_category"] = category_parallel
            parallel["par_filename"] = par_filename
            # here we delete some things that we don't need in the DB:
            del parallel["par_pos_end"]
            del parallel["root_pos_end"]
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


def load_parallels_sorted(
    json_parallels: [Parallel], db: StandardDatabase, filename: str
) -> None:
    """
    Given an array of parallel objects, load them all into the `sorted parallels` collection presorted.

    :param json_parallels: Array of parallel objects to be loaded as-they-are.
    :param db: ArangoDB connection object

    """

    db_collection_sorted = db.collection(COLLECTION_PARALLELS_SORTED_BY_FILE)
    # I wonder if this can be done more efficiently, a lot of spaghetti code...
    parallels_sorted_by_src_position = sorted(
        json_parallels, key=lambda k: k["root_pos_beg"]
    )
    ids_sorted_by_src_position = list(
        map(lambda parallel: parallel["id"], parallels_sorted_by_src_position)
    )

    parallels_sorted_by_tgt_position = sorted(
        json_parallels, key=lambda k: natural_keys(k["par_segnr"][0])
    )
    ids_sorted_by_tgt_position = list(
        map(lambda parallel: parallel["id"], parallels_sorted_by_tgt_position)
    )

    parallels_sorted_by_length_par = sorted(
        json_parallels, key=lambda k: k["par_length"]
    )
    ids_sorted_by_length_par = list(
        map(lambda parallel: parallel["id"], parallels_sorted_by_length_par)
    )

    parallels_sorted_by_length_root = sorted(
        json_parallels, key=lambda k: k["root_length"]
    )
    ids_sorted_by_length_root = list(
        map(lambda parallel: parallel["id"], parallels_sorted_by_length_root)
    )

    ids_sorted_by_length_par.reverse()
    ids_sorted_by_length_root.reverse()

    ids_sorted_random = ids_sorted_by_length_root
    random.shuffle(ids_sorted_random)

    src_lang = json_parallels[0]["src_lang"]
    try:
        db_collection_sorted.insert(
            {
                "_key": filename,
                "filename": filename,
                "lang": src_lang,
                "parallels_sorted_by_src_pos": ids_sorted_by_src_position,
                "parallels_sorted_by_tgt_pos": ids_sorted_by_tgt_position,
                "parallels_sorted_by_length_src": ids_sorted_by_length_root,
                "parallels_randomized": ids_sorted_random,
                "parallels_sorted_by_length_tgt": ids_sorted_by_length_par,
            }
        )
    except (DocumentInsertError, IndexCreateError) as e:
        print(f"Could not save sorted parallel for {filename}. Error: ", e)


def create_indices(db: StandardDatabase):
    db_collection = db.collection(COLLECTION_PARALLELS)
    db_collection.add_hash_index(["root_filename"], unique=False)
    db_collection.add_hash_index(["src_lang"], unique=False)
    db_collection.add_hash_index(["par_category"], unique=False)
    db_collection.add_hash_index(["root_category"], unique=False)
    db_collection.add_hash_index(["root_segnr"], unique=False)    

    db_collection = db.collection(COLLECTION_FILES)
    db_collection.add_hash_index(["language"], unique=False)
    db_collection.add_hash_index(["category"], unique=False)


def load_sources(db: StandardDatabase, root_url):
    source_json_path = root_url + "sources.json"
    db_file_collection = db.collection(COLLECTION_FILES)
    with open(source_json_path, "rb") as f:
        source_list = json.load(f)
    for entry in source_list:
        filename = entry["filename"]
        current_file = db_file_collection.get(filename)
        if current_file:
            current_file["source_string"] = entry["source"]
            print(current_file)
            db_file_collection.update(current_file)


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
                    menu_queries.QUERY_FILES_PER_CATEGORY,
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

            displayFileName = filename["filename"]
            if language == "skt" or language == "pli":
                displayFileName = filename["displayName"] + " (" + displayFileName + ")"

            new_paralllel_entry = [
                displayFileName,
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
