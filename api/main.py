"""
This file contains all FastAPI endpoints for Buddhanexus.

Todo:
- Split into smaller feature-based folders
  (https://fastapi.tiangolo.com/tutorial/bigger-applications/)
"""

import re
from typing import Dict, List

from fastapi import FastAPI, HTTPException, Query
from pyArango.theExceptions import DocumentNotFoundError, AQLQueryError
from starlette.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from models_api import ParallelsCollection
from .db_queries import (
    QUERY_FILE_SEGMENTS_PARALLELS,
    QUERY_COLLECTION_NAMES,
    QUERY_FILES_FOR_LANGUAGE,
    QUERY_CATEGORIES_FOR_LANGUAGE,
    QUERY_FILES_FOR_CATEGORY,
    QUERY_TEXT_SEGMENTS,
    QUERY_TEXT_SEARCH,
    QUERY_PARALLELS_FOR_LEFT_TEXT,
    QUERY_GRAPH_DATA,
    QUERY_TABLE_VIEW,
    QUERY_ALL_COLLECTIONS,
    QUERY_TOTAL_NUMBERS,
    QUERY_SORTED_CATEGORY_LIST,
    QUERY_CATEGORIES_PER_COLLECTION,
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
    except KeyError as e:
        return e


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
    except (DocumentNotFoundError, KeyError) as e:
        return e


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
    except (DocumentNotFoundError, KeyError) as e:
        return e


@APP.post("/parallels-for-left/")
async def get_parallels_for_root_seg_nr(parallels: ParallelsCollection):
    """
    :return: List of parallels
    """
    language = get_language_from_filename(parallels.file_name)
    query_result = get_db().AQLQuery(
        query=QUERY_PARALLELS_FOR_LEFT_TEXT,
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
        language = get_language_from_filename(file_name)
        db = get_db()
        segments_query = db.AQLQuery(
            query=QUERY_FILE_SEGMENTS_PARALLELS,
            bindVars={
                "filename": file_name,
                "score": score,
                "parlength": par_length,
                "coocc": co_occ,
                "limitcollection": get_collection_files_regex(
                    limit_collection, language
                ),
            },
        )
        collection_keys = []
        result = []
        parallel_count = 0
        for segment in segments_query.result:
            if "parallels" in segment:
                for parallel in segment["parallels"]:
                    parallel_count += 1
                    for seg_nr in parallel:
                        collection_key = re.search(COLLECTION_PATTERN, seg_nr)
                        if (
                            collection_key
                            and collection_key.group() not in collection_keys
                        ):
                            collection_keys.append(collection_key.group())
                result.append(segment)

        collections = db.AQLQuery(
            query=QUERY_COLLECTION_NAMES,
            bindVars={"collections": collection_keys, "language": language},
        )

        return {
            "collections": collections.result[0],
            "segments": result,
            "parallel_count": parallel_count,
        }

    except DocumentNotFoundError as e:
        print(e)
        raise HTTPException(status_code=404, detail="Item not found")
    except AQLQueryError as e:
        print("AQLQueryError: ", e)
        raise HTTPException(status_code=400, detail=e.errors)
    except KeyError as e:
        print("KeyError: ", e)
        raise HTTPException(status_code=400)


@APP.get("/files/{file_name}/table")
async def get_table_view(
    file_name: str,
    score: int = 0,
    par_length: int = 0,
    co_occ: int = 0,
    limit_collection: List[str] = Query([]),
    page: int = 0,
    # "sortmethod"
):
    try:
        language = get_language_from_filename(file_name)
        db = get_db()
        query = db.AQLQuery(
            query=QUERY_TABLE_VIEW,
            bindVars={
                "filename": file_name,
                "score": score,
                "parlength": par_length,
                "coocc": co_occ,
                "limitcollection": get_collection_files_regex(
                    limit_collection, language
                ),
                "page": page
                # "sortmethod"
            },
        )
        return query.result[0]

    except KeyError as e:
        print("KeyError: ", e)
        raise HTTPException(status_code=400)


@APP.get("/menus/{language}")
async def get_files_for_menu(language: str):
    try:
        db = get_db()
        language_menu_query_result = db.AQLQuery(
            query=QUERY_FILES_FOR_LANGUAGE,
            batchSize=10000,
            bindVars={"language": language},
        )
        return {"result": language_menu_query_result.result}

    except DocumentNotFoundError as e:
        print(e)
        raise HTTPException(status_code=404, detail="Item not found")
    except AQLQueryError as e:
        print("AQLQueryError: ", e)
        raise HTTPException(status_code=400, detail=e.errors)
    except KeyError as e:
        print("KeyError: ", e)
        raise HTTPException(status_code=400)


@APP.get("/menus/filter/{language}")
async def get_files_for_filter_menu(language: str):
    try:
        db = get_db()
        file_filter_query_result = db.AQLQuery(
            query=QUERY_FILES_FOR_CATEGORY,
            batchSize=10000,
            bindVars={"language": language},
        )
        return {"filteritems": file_filter_query_result.result}

    except DocumentNotFoundError as e:
        print(e)
        raise HTTPException(status_code=404, detail="Item not found")
    except AQLQueryError as e:
        print("AQLQueryError: ", e)
        raise HTTPException(status_code=400, detail=e.errors)
    except KeyError as e:
        print("KeyError: ", e)
        raise HTTPException(status_code=400)


@APP.get("/menus/category/{language}")
async def get_categories_for_filter_menu(language: str):
    try:
        db = get_db()
        category_filter_query_result = db.AQLQuery(
            query=QUERY_CATEGORIES_FOR_LANGUAGE,
            batchSize=500,
            bindVars={"language": language},
        )
        return {"categoryitems": category_filter_query_result.result}

    except DocumentNotFoundError as e:
        print(e)
        raise HTTPException(status_code=404, detail="Item not found")
    except AQLQueryError as e:
        print("AQLQueryError: ", e)
        raise HTTPException(status_code=400, detail=e.errors)
    except KeyError as e:
        print("KeyError: ", e)
        raise HTTPException(status_code=400)


@APP.get("/files/{file_name}/textleft")
async def get_file_text_segments(file_name: str, active_segment: str = "none"):
    try:
        db = get_db()
        text_segments_query_result = db.AQLQuery(
            query=QUERY_TEXT_SEGMENTS,
            batchSize=100000,
            bindVars={"filename": file_name},
        )
        if active_segment == "none":
            result = text_segments_query_result.result[:100]
        else:
            c = 0
            for segment in text_segments_query_result.result:
                if segment["segnr"] == active_segment:
                    break
                else:
                    c += 1
            beg = c - 100
            if beg < 0:
                beg = 0
            end = c + 100
            result = text_segments_query_result.result[beg:end]
        return {"textleft": result}
    except DocumentNotFoundError as e:
        print(e)
        raise HTTPException(status_code=404, detail="Item not found")
    except AQLQueryError as e:
        print("AQLQueryError: ", e)
        raise HTTPException(status_code=400, detail=e.errors)
    except KeyError as e:
        print("KeyError: ", e)
        raise HTTPException(status_code=400)


@APP.get("/files/{file_name}/searchtext")
async def search_file_text_segments(file_name: str, search_string: str):
    try:
        search_string = search_string.lower()
        db = get_db()
        text_segments_query_result = db.AQLQuery(
            query=QUERY_TEXT_SEARCH,
            batchSize=100000,
            bindVars={
                "filename": file_name,
                "search_string": "%" + search_string + "%",
            },
        )
        print("FILE NAME", file_name)
        print("SEARCH STRING", search_string)
        return {"result": text_segments_query_result.result}
    except DocumentNotFoundError as e:
        print(e)
        raise HTTPException(status_code=404, detail="Item not found")
    except AQLQueryError as e:
        print("AQLQueryError: ", e)
        raise HTTPException(status_code=400, detail=e.errors)
    except KeyError as e:
        print("KeyError: ", e)
        raise HTTPException(status_code=400)


@APP.get("/files/{file_name}/graph")
async def get_graph_for_file(
    file_name: str,
    score: int = 0,
    par_length: int = 0,
    co_occ: int = 0,
    target_collection: List[str] = Query([]),
):
    try:
        language = get_language_from_filename(file_name)
        db = get_db()
        query_graph_result = db.AQLQuery(
            query=QUERY_GRAPH_DATA,
            batchSize=100000,
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

            if collection_key:
                collection = collection_key.group()
                if collection not in total_collection_dict.keys():
                    total_collection_dict[collection] = count_this_parallel
                else:
                    total_collection_dict[collection] += count_this_parallel
                if collection not in collection_keys:
                    collection_keys.append(collection)

        # find the proper full names vor each collection
        collections = db.AQLQuery(
            query=QUERY_COLLECTION_NAMES,
            bindVars={"collections": collection_keys, "language": language},
        )

        collections_with_full_name = {}
        for collection_result in collections.result[0]:
            collections_with_full_name.update(collection_result)

        parallel_graph_name_list = {}
        for key in total_collection_dict:
            parallel_graph_name_list.update(
                {
                    key
                    + " "
                    + collections_with_full_name[key]: total_collection_dict[key]
                }
            )

        # returns a list of the data as needed by Google Graphs
        return {
            "graphdata": list(map(list, parallel_graph_name_list.items())),
            "parallel_count": parallel_count,
        }

    except DocumentNotFoundError as e:
        print(e)
        raise HTTPException(status_code=404, detail="Item not found")
    except AQLQueryError as e:
        print("AQLQueryError: ", e)
        raise HTTPException(status_code=400, detail=e.errors)
    except KeyError as e:
        print("KeyError: ", e)
        raise HTTPException(status_code=400)


@APP.get("/visual/{searchterm}")
async def get_graph_for_file(
    searchterm: str, language: str, selected: List[str] = Query([])
):
    try:
        db = get_db()
        counted_parallels = []
        searchtype = "category"
        if re.search("^[A-Z][a-z]+$", searchterm):
            searchtype = "collection"

        # get a sorted list of categories to get the results in the right order
        query_full_selected_category_dict = db.AQLQuery(
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
                for categoryname in selected_category_dict.keys():
                    if categoryname in parallel_count.keys():
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
            query_collection_list = db.AQLQuery(
                query=QUERY_CATEGORIES_PER_COLLECTION,
                bindVars={
                    "searchterm": language + "_" + searchterm,
                    "language": language,
                },
            )

            for cat, catname in query_collection_list.result[0].items():
                all_files = get_files_per_category_from_db(language + "_" + cat)

                total_parlist = {}
                for filename in all_files:
                    parallel_count = filename["totallengthcount"]
                    for categoryname in selected_category_dict.keys():
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
                            "L_" + cat + " " + catname,
                            "R_" + key + " " + selected_category_dict[key],
                            value,
                        ]
                    )

        return {"graphdata": counted_parallels}

    except DocumentNotFoundError as e:
        print(e)
        raise HTTPException(status_code=404, detail="Item not found")
    except AQLQueryError as e:
        print("AQLQueryError: ", e)
        raise HTTPException(status_code=400, detail=e.errors)
    except KeyError as e:
        print("KeyError: ", e)
        raise HTTPException(status_code=400)


@APP.get("/collections")
async def get_all_collections():
    try:
        db = get_db()
        collections_query_result = db.AQLQuery(query=QUERY_ALL_COLLECTIONS)
        return {"result": collections_query_result.result}

    except DocumentNotFoundError as e:
        print(e)
        raise HTTPException(status_code=404, detail="Item not found")
    except AQLQueryError as e:
        print("AQLQueryError: ", e)
        raise HTTPException(status_code=400, detail=e.errors)
    except KeyError as e:
        print("KeyError: ", e)
        raise HTTPException(status_code=400)


@APP.get("/parallels/{file_name}/count")
async def get_counts_for_file(
    file_name: str,
    score: int = 0,
    par_length: int = 0,
    co_occ: int = 0,
    limit_collection: List[str] = Query([]),
):
    try:
        language = get_language_from_filename(file_name)
        db = get_db()
        query_graph_result = db.AQLQuery(
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
    except DocumentNotFoundError as e:
        print(e)
        raise HTTPException(status_code=404, detail="Item not found")
    except AQLQueryError as e:
        print("AQLQueryError: ", e)
        raise HTTPException(status_code=400, detail=e.errors)
    except KeyError as e:
        print("KeyError: ", e)
        raise HTTPException(status_code=400)
