"""
This file contains all FastAPI endpoints for Buddhanexus.

Todo:
- Split into smaller feature-based folders
  (https://fastapi.tiangolo.com/tutorial/bigger-applications/)
"""

import re
import os
from typing import Dict, List
from urllib.parse import unquote

from fastapi import FastAPI, HTTPException, Query
from pyArango.theExceptions import DocumentNotFoundError, AQLQueryError
from starlette.middleware.cors import CORSMiddleware

from .models_api import ParallelsCollection
from .queries import menu_queries, main_queries
from .utils import (
    get_language_from_filename,
    get_collection_files_regex,
    collect_segment_results,
)
from .db_connection import get_collection, get_db

API_PREFIX = "/api" if os.environ["PROD"] == "1" else ""

APP = FastAPI(title="Buddha Nexus Backend", version="0.2.1", openapi_prefix=API_PREFIX)

APP.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

COLLECTION_PATTERN = r"^(pli-tv-b[ui]-vb|XX|OT|NY|[A-Z]+[0-9]+|[a-z\-]+)"


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
    limitcollection_positive, limitcollection_negative = get_collection_files_regex(
        parallels.limit_collection, language
    )
    query_result = get_db().AQLQuery(
        query=main_queries.QUERY_PARALELLS_FOR_MIDDLE_TEXT,
        bindVars={
            "segmentnr": parallels.segmentnr,
            "score": parallels.score,
            "parlength": parallels.par_length,
            "coocc": parallels.co_occ,
            "limitcollection_positive": limitcollection_positive,
            "limitcollection_negative": limitcollection_negative,
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
    limitcollection_positive, limitcollection_negative = get_collection_files_regex(
        limit_collection, get_language_from_filename(file_name)
    )

    try:
        database = get_db()
        segments_query = database.AQLQuery(
            query=main_queries.QUERY_FILE_SEGMENTS_PARALLELS,
            batchSize=10000,
            bindVars={
                "filename": file_name,
                "score": score,
                "parlength": par_length,
                "coocc": co_occ,
                "limitcollection_positive": limitcollection_positive,
                "limitcollection_negative": limitcollection_negative,
            },
        )
        segments_result, collection_keys = collect_segment_results(
            segments_query.result
        )

        return {
            "collections": database.AQLQuery(
                query=main_queries.QUERY_COLLECTION_NAMES,
                bindVars={
                    "collections": collection_keys,
                    "language": get_language_from_filename(file_name),
                },
            ).result[0],
            "segments": segments_result,
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
    limitcollection_positive, limitcollection_negative = get_collection_files_regex(
        limit_collection, get_language_from_filename(file_name)
    )
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
            query=main_queries.QUERY_TABLE_VIEW,
            bindVars={
                "filename": file_name,
                "score": score,
                "parlength": par_length,
                "coocc": co_occ,
                "sortdirection": sort_direction,
                "sortkey": sort_key,
                "limitcollection_positive": limitcollection_positive,
                "limitcollection_negative": limitcollection_negative,
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
            query=menu_queries.QUERY_FILES_FOR_LANGUAGE,
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
            query=menu_queries.QUERY_FILES_FOR_CATEGORY,
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
            query=menu_queries.QUERY_CATEGORIES_FOR_LANGUAGE,
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
        try:
            text_segment_count_query_result = get_db().AQLQuery(
                query=main_queries.QUERY_SEGMENT_COUNT,
                bindVars={"segmentnr": active_segment},
            )
            start_int = text_segment_count_query_result.result[0] - 100
        except DocumentNotFoundError as error:
            print(error)
            raise HTTPException(status_code=404, detail="Item not found")
        except AQLQueryError as error:
            print("AQLQueryError: ", error)
            raise HTTPException(status_code=400, detail=error.errors)
        except KeyError as error:
            print("KeyError: ", error)
            raise HTTPException(status_code=400)
    if start_int < 0:
        start_int = 0
    limitcollection_positive, limitcollection_negative = get_collection_files_regex(
        limit_collection, get_language_from_filename(file_name)
    )
    try:
        text_segments_query_result = get_db().AQLQuery(
            query=main_queries.QUERY_TEXT_AND_PARALLELS,
            bindVars={
                "filename": file_name,
                "limit": limit,
                "startint": start_int,
                "score": score,
                "parlength": par_length,
                "coocc": co_occ,
                "limitcollection_positive": limitcollection_positive,
                "limitcollection_negative": limitcollection_negative,
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
            query=main_queries.QUERY_TEXT_SEARCH,
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
        query=main_queries.QUERY_GRAPH_VIEW,
        batchSize=15000,
        bindVars={
            "filename": file_name,
            "score": score,
            "parlength": par_length,
            "coocc": co_occ,
            "targetcollection": target_collection,
        },
    )

    collection_keys = []
    total_collection_dict = {}
    total_histogram_dict = {}

    # extract a dictionary of collection numbers and number of parallels for each
    for parallel in query_graph_result.result:
        count_this_parallel = parallel["parlength"]
        target_filename = parallel["textname"]
        if target_filename in total_histogram_dict.keys():
            total_histogram_dict[target_filename] += count_this_parallel
        else:
            total_histogram_dict[target_filename] = count_this_parallel

        collection_key = re.search(COLLECTION_PATTERN, target_filename)

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
        query=main_queries.QUERY_COLLECTION_NAMES,
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

    unsorted_graphdata_list = list(map(list, parallel_graph_name_list.items()))

    histogram_data = []
    for name, count in total_histogram_dict.items():
        histogram_data.append([name, count])

    # returns a list of the data as needed by Google Graphs
    return {
        "piegraphdata": sorted(
            unsorted_graphdata_list, reverse=True, key=lambda x: x[1]
        ),
        "histogramgraphdata": sorted(histogram_data, reverse=True, key=lambda x: x[1]),
    }


@APP.get("/visual/{searchterm}")
async def get_visual_view_for_file(
    searchterm: str, language: str, selected: List[str] = Query([])
):
    """
    Endpoint for visual view
    """
    database = get_db()
    languagesearchterm = language + "_" + searchterm
    query_collection_list = database.AQLQuery(
        query=main_queries.QUERY_COLLECTION_TOTALS,
        bindVars={"sourcecollection": languagesearchterm, "selected": selected},
    )
    graphdata = []
    if len(selected) == 1 or re.search(r"^[A-Z][a-z]+$", searchterm):
        graphdata = query_collection_list.result[0]
    else:
        query_results = query_collection_list.result[0]
        query_results_keys = []
        for key in query_results:
            if not key[0] in query_results_keys:
                query_results_keys.append(key[0])

        for key in query_results_keys:
            for result_item in query_results:
                if result_item[0] == key:
                    graphdata.append(result_item)

    return {"graphdata": graphdata}


@APP.get("/collections")
async def get_all_collections():
    """
    Returns list of all available collections.
    """
    try:
        collections_query_result = get_db().AQLQuery(
            query=menu_queries.QUERY_ALL_COLLECTIONS
        )
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
    limitcollection_positive, limitcollection_negative = get_collection_files_regex(
        limit_collection, get_language_from_filename(file_name)
    )
    query_graph_result = get_db().AQLQuery(
        query=main_queries.QUERY_TOTAL_NUMBERS,
        batchSize=100000,
        bindVars={
            "filename": file_name,
            "score": score,
            "parlength": par_length,
            "coocc": co_occ,
            "limitcollection_positive": limitcollection_positive,
            "limitcollection_negative": limitcollection_negative,
        },
    )
    return {"parallel_count": query_graph_result.result}


@APP.get("/files/{file_name}/folios")
async def get_folios_for_file(file_name: str):
    """
    Returns number of folios (TIB) / facsimiles (CHN) / suttas (PLI)
    """
    lang = get_language_from_filename(file_name)
    folios = []
    if lang == "skt" or (
        lang == "pli" and not re.search(r"(^[as]n[0-9]|^dhp)", file_name)
    ):
        return

    query_graph_result = get_db().AQLQuery(
        query=main_queries.QUERY_ALL_SEGMENTS,
        batchSize=100000,
        bindVars={"filename": file_name},
    )
    segments = query_graph_result.result[0]
    first_segment = segments[0]
    last_segment = segments[-1]
    if lang == "chn":
        first_num = int(first_segment.split(":")[1].split("-")[0])
        last_num = int(last_segment.split(":")[1].split("-")[0])
        folios = list(range(first_num, last_num + 1))
    elif lang == "tib":
        first_num = int(first_segment.split(":")[1].split("-")[0][:-1])
        last_num = int(last_segment.split(":")[1].split("-")[0][:-1])
        first_folio = first_segment.split(":")[1].split("-")[0]
        last_folio = last_segment.split(":")[1].split("-")[0]
        folios.append(first_folio)
        if "a" in first_folio:
            folios.append(first_folio.replace("a", "b"))
        for number in list(range(first_num + 1, last_num)):
            folios.append(str(number) + "a")
            folios.append(str(number) + "b")
        if "b" in last_folio:
            folios.append(last_folio.replace("b", "a"))
        folios.append(last_folio)
    elif lang == "pli":
        for segment in segments:
            suttanr = segment.split(".")[0]
            if suttanr not in folios:
                folios.append(suttanr)

    return {"folios": folios}


@APP.get("/menus/sidebar/{language}")
async def get_data_for_sidebar_menu(language: str):
    """
    Endpoint for sidebar menu
    """
    database = get_db()
    query_sidebar_menu = database.AQLQuery(
        query=menu_queries.QUERY_TOTAL_MENU, bindVars={"language": language}
    )

    return {"navigationmenudata": query_sidebar_menu.result}
