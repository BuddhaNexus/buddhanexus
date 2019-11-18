"""
This file contains all FastAPI endpoints for Buddhanexus.

Todo:
- Split into smaller feature-based folders
  (https://fastapi.tiangolo.com/tutorial/bigger-applications/)
"""

import re
from typing import Dict, List
from urllib.parse import unquote

from fastapi import FastAPI, HTTPException, Query
from pyArango.theExceptions import DocumentNotFoundError, AQLQueryError
from starlette.middleware.cors import CORSMiddleware

from models_api import ParallelsCollection
from .db_queries import (
    QUERY_TEXT_SEARCH,
    QUERY_TEXT_AND_PARALLELS,
    QUERY_PARALELLS_FOR_MIDDLE_TEXT,
    QUERY_TABLE_VIEW,
    QUERY_FILES_FOR_LANGUAGE,
    QUERY_FILE_SEGMENTS_PARALLELS,
    QUERY_COLLECTION_NAMES,
    QUERY_FILES_FOR_CATEGORY,
    QUERY_CATEGORIES_FOR_LANGUAGE,
    QUERY_GRAPH_DATA,
    QUERY_SORTED_CATEGORY_LIST,
    QUERY_CATEGORIES_PER_COLLECTION,
    QUERY_ALL_COLLECTIONS,
    QUERY_TOTAL_NUMBERS,
)
from .db_actions import get_files_per_category_from_db
from .utils import get_language_from_filename, get_collection_files_regex
from .db_connection import get_collection, get_db

APP = FastAPI(title="Buddha Nexus Backend", version="0.1.0", openapi_prefix="/api")

APP.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

COLLECTION_PATTERN = r"^(pli-tv-b[ui]-vb|[A-Z]+[0-9]+|[a-z\-]+)"


@APP.get("/")
def root() -> object:
    """
    Root API endpoint
    :return: The response (json object)
    """
    return {"message": "Visit /docs to view the documentation"}


@APP.get("/segments/{lang}/count")
async def get_segment_count(lang: str):
    """
    Returns number of segments in language
    """
    try:
        collection = get_collection(lang)
        return {"count": collection.count()}
    except KeyError as error:
        return error


@APP.get("/segments/{lang}/{key}")
async def get_segment(lang: str, key: str) -> Dict[str, str]:
    """
    Returns segment object given its ID and language
    :param lang: Segment language
    :param key: Segment ID
    """
    try:
        collection = get_collection(lang)
        segment = collection[key]
        return {
            "segmentnr": segment["segmentnr"],
            "segment": segment["segment"],
            "lang": segment["lang"],
        }
    except (DocumentNotFoundError, KeyError) as error:
        return error


@APP.get("/parallels/{root_segnr}")
async def get_parallels_for_root_seg_nr(root_segnr: str):
    """
    Returns parallels for given root_segnr.
    :return: List of paralllel objects
    """
    aql = f"""
    FOR p IN parallels 
        FILTER '{root_segnr}' IN p.root_segnr 
        RETURN p
    """
    try:
        query_result = get_db().AQLQuery(query=aql)
        return query_result.result
    except (DocumentNotFoundError, KeyError) as error:
        return error


@APP.post("/parallels-for-middle/")
async def get_parallels_for_middle(parallels: ParallelsCollection):
    """
    :return: List of parallels for text view (middle)
    """
    language = get_language_from_filename(parallels.file_name)
    query_result = get_db().AQLQuery(
        query=QUERY_PARALELLS_FOR_MIDDLE_TEXT,
        bindVars={
            "parallel_ids": parallels.parallelIDList,
            "score": parallels.score,
            "parlength": parallels.par_length,
            "coocc": parallels.co_occ,
            "limitcollection": get_collection_files_regex(
                parallels.limit_collection, language
            ),
        },
    )
    return {"parallels": query_result.result}


@APP.get("/files/{file_name}/segments")
async def get_segments_for_file(
    file_name: str,
    score: int = 0,
    par_length: int = 0,
    co_occ: int = 0,
    limit_collection: List[str] = Query([]),
):
    """
    Returns filtered segments belonging to a specified file.
    :return: List of segments
    """
    try:
        database = get_db()
        segments_query = database.AQLQuery(
            query=QUERY_FILE_SEGMENTS_PARALLELS,
            bindVars={
                "filename": file_name,
                "score": score,
                "parlength": par_length,
                "coocc": co_occ,
                "limitcollection": get_collection_files_regex(
                    limit_collection, get_language_from_filename(file_name)
                ),
            },
        )
        collection_keys = []
        segments_result = []
        parallel_count = 0
        for segment in segments_query.result:
            if "parallels" not in segment:
                continue
            for parallel in segment["parallels"]:
                parallel_count += 1
                for seg_nr in parallel:
                    collection_key = re.search(COLLECTION_PATTERN, seg_nr)
                    if collection_key and collection_key.group() not in collection_keys:
                        collection_keys.append(collection_key.group())
            segments_result.append(segment)

        return {
            "collections": database.AQLQuery(
                query=QUERY_COLLECTION_NAMES,
                bindVars={
                    "collections": collection_keys,
                    "language": get_language_from_filename(file_name),
                },
            ).result[0],
            "segments": segments_result,
            "parallel_count": parallel_count,
        }

    except DocumentNotFoundError as error:
        print(error)
        raise HTTPException(status_code=404, detail="Item not found")
    except AQLQueryError as error:
        print("AQLQueryError: ", error)
        raise HTTPException(status_code=400, detail=error.errors)
    except KeyError as error:
        print("KeyError: ", error)
        raise HTTPException(status_code=400)


@APP.get("/files/{file_name}/table")
async def get_table_view(
    file_name: str,
    score: int = 0,
    par_length: int = 0,
    co_occ: int = 0,
    limit_collection: List[str] = Query([]),
    page: int = 0,
    sort_method: str = "position",
):
    """
    Endpoint for the table view. Accepts filters.
    :return: List of segments and parallels for the table view.
    """
    try:
        sort_key = ""
        sort_direction = "DESC"
        if sort_method == "position":
            sort_key = "root_pos_beg"
            sort_direction = "ASC"
        if sort_method == "quoted-text":
            sort_key = "par_pos_beg"
            sort_direction = "ASC"
        if sort_method == "length":
            sort_key = "root_length"
        if sort_method == "length2":
            sort_key = "par_length"

        query = get_db().AQLQuery(
            query=QUERY_TABLE_VIEW,
            bindVars={
                "filename": file_name,
                "score": score,
                "parlength": par_length,
                "coocc": co_occ,
                "sortdirection": sort_direction,
                "sortkey": sort_key,
                "limitcollection": get_collection_files_regex(
                    limit_collection, get_language_from_filename(file_name)
                ),
                "page": page,
            },
        )
        return query.result[0]

    except KeyError as error:
        print("KeyError: ", error)
        raise HTTPException(status_code=400)


@APP.get("/menus/{language}")
async def get_files_for_menu(language: str):
    """
    Endpoint that returns list of file IDs in a given language
    """
    try:
        language_menu_query_result = get_db().AQLQuery(
            query=QUERY_FILES_FOR_LANGUAGE,
            batchSize=10000,
            bindVars={"language": language},
        )
        return {"result": language_menu_query_result.result}

    except DocumentNotFoundError as error:
        print(error)
        raise HTTPException(status_code=404, detail="Item not found")
    except AQLQueryError as error:
        print("AQLQueryError: ", error)
        raise HTTPException(status_code=400, detail=error.errors)
    except KeyError as error:
        print("KeyError: ", error)
        raise HTTPException(status_code=400)


@APP.get("/menus/filter/{language}")
async def get_files_for_filter_menu(language: str):
    """
    Given a language, return list of files for the category menu
    """
    try:
        file_filter_query_result = get_db().AQLQuery(
            query=QUERY_FILES_FOR_CATEGORY,
            batchSize=10000,
            bindVars={"language": language},
        )
        return {"filteritems": file_filter_query_result.result}

    except DocumentNotFoundError as error:
        print(error)
        raise HTTPException(status_code=404, detail="Item not found")
    except AQLQueryError as error:
        print("AQLQueryError: ", error)
        raise HTTPException(status_code=400, detail=error.errors)
    except KeyError as error:
        print("KeyError: ", error)
        raise HTTPException(status_code=400)


@APP.get("/menus/category/{language}")
async def get_categories_for_filter_menu(language: str):
    """
    Given a language, return list of categories for the filter menu
    """
    try:
        category_filter_query_result = get_db().AQLQuery(
            query=QUERY_CATEGORIES_FOR_LANGUAGE,
            batchSize=500,
            bindVars={"language": language},
        )
        return {"categoryitems": category_filter_query_result.result}

    except DocumentNotFoundError as error:
        print(error)
        raise HTTPException(status_code=404, detail="Item not found")
    except AQLQueryError as error:
        print("AQLQueryError: ", error)
        raise HTTPException(status_code=400, detail=error.errors)
    except KeyError as error:
        print("KeyError: ", error)
        raise HTTPException(status_code=400)


@APP.get("/files/{file_name}/textandparallels")
async def get_file_text_segments_and_parallels(
    file_name: str,
    active_segment: str = "none",
    score: int = 0,
    par_length: int = 0,
    co_occ: int = 0,
    limit_collection: List[str] = Query([]),
):
    """
    Endpoint for text view
    """
    start_int = 0
    limit = 200
    if active_segment != "none":
        active_segment = unquote(active_segment)
        start_int = int(active_segment.split(":")[1].split("_")[0]) - 100
    if start_int < 0:
        start_int = 0
    try:
        text_segments_query_result = get_db().AQLQuery(
            query=QUERY_TEXT_AND_PARALLELS,
            bindVars={
                "filename": file_name,
                "limit": limit,
                "start_int": start_int,
                "score": score,
                "parlength": par_length,
                "coocc": co_occ,
                "limitcollection": limit_collection,
            },
        )
        return text_segments_query_result.result[0]

    except DocumentNotFoundError as error:
        print(error)
        raise HTTPException(status_code=404, detail="Item not found")
    except AQLQueryError as error:
        print("AQLQueryError: ", error)
        raise HTTPException(status_code=400, detail=error.errors)
    except KeyError as error:
        print("KeyError: ", error)
        raise HTTPException(status_code=400)


@APP.get("/files/{file_name}/searchtext")
async def search_file_text_segments(file_name: str, search_string: str):
    """
    Searches segments in given file for a search_string.
    """
    try:
        search_string = search_string.lower()
        text_segments_query_result = get_db().AQLQuery(
            query=QUERY_TEXT_SEARCH,
            batchSize=100000,
            bindVars={
                "filename": file_name,
                "search_string": "%" + search_string + "%",
            },
        )
        return {"result": text_segments_query_result.result}

    except DocumentNotFoundError as error:
        print(error)
        raise HTTPException(status_code=404, detail="Item not found")
    except AQLQueryError as error:
        print("AQLQueryError: ", error)
        raise HTTPException(status_code=400, detail=error.errors)
    except KeyError as error:
        print("KeyError: ", error)
        raise HTTPException(status_code=400)


@APP.get("/files/{file_name}/graph")
# pylint: disable=too-many-locals
async def get_graph_for_file(
    file_name: str,
    score: int = 0,
    par_length: int = 0,
    co_occ: int = 0,
    target_collection: List[str] = Query([]),
):
    """
    Endpoint for graph view
    """
    database = get_db()
    query_graph_result = database.AQLQuery(
        query=QUERY_GRAPH_DATA,
        batchSize=15000,
        bindVars={
            "filename": file_name,
            "score": score,
            "parlength": par_length,
            "coocc": co_occ,
            "targetcollection": target_collection,
        },
    )

    parallel_count = 0
    collection_keys = []
    total_collection_dict = {}

    # extract a dictionary of collection numbers and number of parallels for each
    for parallel in query_graph_result.result:
        count_this_parallel = parallel["parlength"]
        parallel_count += count_this_parallel
        collection_key = re.search(COLLECTION_PATTERN, parallel["textname"])

        if not collection_key:
            continue

        collection = collection_key.group()
        if collection not in total_collection_dict.keys():
            total_collection_dict[collection] = count_this_parallel
        else:
            total_collection_dict[collection] += count_this_parallel
        if collection not in collection_keys:
            collection_keys.append(collection)

    # find the proper full names vor each collection
    collections = database.AQLQuery(
        query=QUERY_COLLECTION_NAMES,
        bindVars={
            "collections": collection_keys,
            "language": get_language_from_filename(file_name),
        },
    )

    collections_with_full_name = {}
    for collection_result in collections.result[0]:
        collections_with_full_name.update(collection_result)

    parallel_graph_name_list = {}
    for key in total_collection_dict:
        parallel_graph_name_list.update(
            {key + " " + collections_with_full_name[key]: total_collection_dict[key]}
        )

    # returns a list of the data as needed by Google Graphs
    return {
        "graphdata": list(map(list, parallel_graph_name_list.items())),
        "parallel_count": parallel_count,
    }


@APP.get("/visual/{searchterm}")
# pylint: disable=too-many-locals,too-many-branches,too-many-nested-blocks
async def get_visual_view_for_file(
    searchterm: str, language: str, selected: List[str] = Query([])
):
    """
    Endpoint for visual view
    """
    database = get_db()
    counted_parallels = []
    searchtype = "category"
    if re.search("^[A-Z][a-z]+$", searchterm):
        searchtype = "collection"

    # get a sorted list of categories to get the results in the right order
    query_full_selected_category_dict = database.AQLQuery(
        query=QUERY_SORTED_CATEGORY_LIST,
        bindVars={"language": language, "selected": selected},
    )
    selected_category_dict = {}
    for category in query_full_selected_category_dict.result:
        selected_category_dict.update(category)

    # check if the search is for a catagory (i.e. T06) or for a collection (i.e. Tengyur)
    if searchtype == "category":
        all_files = get_files_per_category_from_db(language + "_" + searchterm)

        for filename in all_files:
            parallel_count = filename["totallengthcount"]
            for categoryname in selected_category_dict:
                if categoryname in parallel_count:
                    counted_parallels.append(
                        [
                            filename["filename"],
                            "R_"
                            + categoryname
                            + " "
                            + selected_category_dict[categoryname],
                            parallel_count[categoryname],
                        ]
                    )
                else:
                    counted_parallels.append(
                        [
                            filename["filename"],
                            "R_"
                            + categoryname
                            + " "
                            + selected_category_dict[categoryname],
                            0,
                        ]
                    )

    # if the search is for a collection, a list of categories for that collection
    # is iterated over and the results for each file added.
    elif searchtype == "collection":
        query_collection_list = database.AQLQuery(
            query=QUERY_CATEGORIES_PER_COLLECTION,
            bindVars={"searchterm": language + "_" + searchterm, "language": language},
        )

        for cat, catname in query_collection_list.result[0].items():
            all_files = get_files_per_category_from_db(language + "_" + cat)

            total_parlist = {}
            for filename in all_files:
                parallel_count = filename["totallengthcount"]
                for categoryname in selected_category_dict:
                    if categoryname not in total_parlist.keys():
                        if categoryname not in parallel_count.keys():
                            total_parlist[categoryname] = 0
                        else:
                            total_parlist[categoryname] = parallel_count[categoryname]
                    elif categoryname in parallel_count.keys():
                        total_parlist[categoryname] += parallel_count[categoryname]

            for key, value in total_parlist.items():
                counted_parallels.append(
                    [
                        "L_" + cat + " " + catname,
                        "R_" + key + " " + selected_category_dict[key],
                        value,
                    ]
                )

    return {"graphdata": counted_parallels}


@APP.get("/collections")
async def get_all_collections():
    """
    Returns list of all available collections.
    """
    try:
        collections_query_result = get_db().AQLQuery(query=QUERY_ALL_COLLECTIONS)
        return {"result": collections_query_result.result}

    except DocumentNotFoundError as error:
        print(error)
        raise HTTPException(status_code=404, detail="Item not found")
    except AQLQueryError as error:
        print("AQLQueryError: ", error)
        raise HTTPException(status_code=400, detail=error.errors)
    except KeyError as error:
        print("KeyError: ", error)
        raise HTTPException(status_code=400)


@APP.get("/parallels/{file_name}/count")
async def get_counts_for_file(
    file_name: str,
    score: int = 0,
    par_length: int = 0,
    co_occ: int = 0,
    limit_collection: List[str] = Query([]),
):
    """
    Returns number of filtered parallels
    """
    query_graph_result = get_db().AQLQuery(
        query=QUERY_TOTAL_NUMBERS,
        batchSize=100000,
        bindVars={
            "filename": file_name,
            "score": score,
            "parlength": par_length,
            "coocc": co_occ,
            "limitcollection": limit_collection,
        },
    )
    return {"parallel_count": query_graph_result.result}
