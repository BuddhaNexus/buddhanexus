import re
from typing import Dict, List

from fastapi import FastAPI, HTTPException, Query
from pyArango.theExceptions import DocumentNotFoundError, AQLQueryError
from starlette.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from .db_queries import (
    query_file_segments_parallels,
    query_collection_names,
    query_files_for_language,
    query_categories_for_language,
    query_files_for_category,
    query_text_segments,
    query_text_search,
    query_parallels_for_left_text,
    query_parallels_for_middle_text,
    query_graph_data,
    query_table_view,
    query_all_collections,
    query_total_numbers,
    query_sorted_category_list,
    query_categories_per_collection
)
from .db_actions import get_files_per_category_from_db
from .utils import get_language_from_filename, get_regex_test
from .db_connection import get_collection, get_db

app = FastAPI(title="Buddha Nexus Backend", version="0.1.0", openapi_prefix="/api")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

collection_pattern = "^(pli-tv-b[ui]-vb|[A-Z]+[0-9]+|[a-z\-]+)"


@app.get("/")
def root():
    return {"message": "Visit /docs to view the documentation"}


@app.get("/segments/{lang}/count")
async def get_segment_count(lang: str):
    try:
        collection = get_collection(lang)
        return {"count": collection.count()}
    except KeyError as e:
        return e


@app.get("/segments/{lang}/{key}")
async def get_segment(lang: str, key: str) -> Dict[str, str]:
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


@app.get("/parallels/{root_segnr}")
async def get_parallels_for_root_seg_nr(root_segnr: str):
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


class parallelItem(BaseModel):
    parallelIDList: list
    score: int
    par_length: int
    co_occ: int
    limit_collection: list
    file_name: str


@app.post("/parallels-for-left/")
async def get_parallels_for_root_seg_nr(parallels: parallelItem):
    language = get_language_from_filename(parallels.file_name)
    query_result = get_db().AQLQuery(
        query=query_parallels_for_left_text,
        bindVars={
            "parallel_ids": parallels.parallelIDList,
            "score": parallels.score,
            "parlength": parallels.par_length,
            "coocc": parallels.co_occ,
            "limitcollection": get_regex_test(parallels.limit_collection, language),
        },
    )
    return {"parallels": query_result.result}

class parallelItemMiddle(BaseModel):
    parallelIDList: list

@app.post("/parallels-for-middle/")
async def get_parallels_for_middle(parallels: parallelItemMiddle):
    query_result = get_db().AQLQuery(
        query=query_parallels_for_middle_text,
        bindVars={
            "parallel_ids": parallels.parallelIDList,
        },
    )
    return {"parallels": query_result.result}



@app.get("/files/{file_name}/segments")
async def get_segments_for_file(
    file_name: str,
    score: int = 0,
    par_length: int = 0,
    co_occ: int = 0,
    limit_collection: List[str] = Query([]),
):
    # TODO: enable caching, add etag header
    try:
        language = get_language_from_filename(file_name)
        db = get_db()
        segments_query = db.AQLQuery(
            query=query_file_segments_parallels,
            bindVars={
                "filename": file_name,
                "score": score,
                "parlength": par_length,
                "coocc": co_occ,
                "limitcollection": get_regex_test(limit_collection, language),
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
                        collection_key = re.search(collection_pattern, seg_nr)
                        if (
                            collection_key
                            and collection_key.group() not in collection_keys
                        ):
                            collection_keys.append(collection_key.group())
                result.append(segment)

        collections = db.AQLQuery(
            query=query_collection_names,
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


@app.get("/files/{file_name}/table")
async def get_table_view(
    file_name: str,
    score: int = 0,
    par_length: int = 0,
    co_occ: int = 0,
    limit_collection: List[str] = Query([]),
    page: int = 0,
    sort_method: str = 'position',

):
    try:
        print("CURRENT SORTING METHOD",sort_method)
        sort_key = ''
        if sort_method == 'position':
            sort_key = "root_pos_beg"
        if sort_method == 'quoted-text':
            sort_key = "par_pos_beg"
        if sort_method == 'length':
            sort_key = "root_length"
        if sort_method == 'length2':
            sort_key = "par_length"

            
        language = get_language_from_filename(file_name)
        db = get_db()
        query = db.AQLQuery(
            query=query_table_view,
            bindVars={
                "filename": file_name,
                "score": score,
                "parlength": par_length,
                "coocc": co_occ,
                "sortkey": sort_key,                
                "limitcollection": get_regex_test(limit_collection, language),
                "page": page
                # "sortmethod"
            },
        )
        return query.result[0]

    except KeyError as e:
        print("KeyError: ", e)
        raise HTTPException(status_code=400)


@app.get("/menus/{language}")
async def get_files_for_menu(language: str):
    try:
        db = get_db()
        language_menu_query_result = db.AQLQuery(
            query=query_files_for_language,
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


@app.get("/menus/filter/{language}")
async def get_files_for_filter_menu(language: str):
    try:
        db = get_db()
        file_filter_query_result = db.AQLQuery(
            query=query_files_for_category,
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


@app.get("/menus/category/{language}")
async def get_categories_for_filter_menu(language: str):
    try:
        db = get_db()
        category_filter_query_result = db.AQLQuery(
            query=query_categories_for_language,
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


@app.get("/files/{file_name}/textleft")
async def get_file_text_segments(file_name: str, active_segment: str = "none"):
    start_int = 0
    if active_segment != 'none':
        start_int = int(active_segment.split(':')[1].split('_')[0]) - 100
    if start_int < 0:
        start_int = 0 
    try:
        db = get_db()
        text_segments_query_result = db.AQLQuery(
            query=query_text_segments,
            bindVars={"filename": file_name,
                      "start_int": start_int},
        )
        return {"textleft": text_segments_query_result.result}
    except DocumentNotFoundError as e:
        print(e)
        raise HTTPException(status_code=404, detail="Item not found")
    except AQLQueryError as e:
        print("AQLQueryError: ", e)
        raise HTTPException(status_code=400, detail=e.errors)
    except KeyError as e:
        print("KeyError: ", e)
        raise HTTPException(status_code=400)


@app.get("/files/{file_name}/searchtext")
async def search_file_text_segments(file_name: str, search_string: str):
    try:
        search_string = search_string.lower()
        db = get_db()
        text_segments_query_result = db.AQLQuery(
            query=query_text_search,
            batchSize=100000,
            bindVars={"filename": file_name, "search_string": "%"+search_string+"%"},
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


@app.get("/files/{file_name}/graph")
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
            query=query_graph_data,
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
            collection_key = re.search(collection_pattern, parallel["textname"])

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
            query=query_collection_names,
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


@app.get("/visual/{searchterm}")
async def get_graph_for_file(
    searchterm: str,
    language: str,
    selected: List[str] = Query([]),
):
    try:
        db = get_db()
        counted_parallels = []
        searchtype = 'category'
        if re.search("^[A-Z][a-z]+$", searchterm):
            searchtype = "collection"

        # get a sorted list of categories to get the results in the right order
        query_full_selected_category_dict = db.AQLQuery(
            query=query_sorted_category_list,
            bindVars={
                "language": language,
                "selected": selected,
            },
        )
        selected_category_dict = {}
        for category in query_full_selected_category_dict.result:
            selected_category_dict.update(category)

        # check if the search is for a catagory (i.e. T06) or for a collection (i.e. Tengyur)
        if searchtype == "category":
            all_files = get_files_per_category_from_db(language+"_"+searchterm)

            for filename in all_files:
                parallel_count = filename["totallengthcount"]
                for categoryname in selected_category_dict.keys():
                    if categoryname in parallel_count.keys():
                        counted_parallels.append([filename["filename"],"R_"+categoryname+" "+selected_category_dict[categoryname],parallel_count[categoryname]])
                    else:
                        counted_parallels.append([filename["filename"],"R_"+categoryname+" "+selected_category_dict[categoryname],0])

        # if the search is for a collection, a list of categories for that collection
        # is iterated over and the results for each file added.
        elif searchtype == "collection":
            query_collection_list = db.AQLQuery(
                query=query_categories_per_collection,
                bindVars={
                    "searchterm": language+"_"+searchterm,
                    "language": language
                },
            )

            for cat, catname in query_collection_list.result[0].items():
                all_files = get_files_per_category_from_db(language+"_"+cat)

                total_parlist = {}
                for filename in all_files:
                    parallel_count = filename["totallengthcount"]
                    for categoryname in selected_category_dict.keys():
                        if categoryname not in total_parlist.keys():
                            if categoryname not in parallel_count.keys():
                                total_parlist[categoryname] = 0
                            else:
                                total_parlist[categoryname] = parallel_count[categoryname]
                        elif categoryname in parallel_count.keys():
                                total_parlist[categoryname] += parallel_count[categoryname]

                for key, value in total_parlist.items():
                    counted_parallels.append(["L_"+cat+" "+catname, "R_"+key+" "+selected_category_dict[key], value])

        return { "graphdata" : counted_parallels }

    except DocumentNotFoundError as e:
        print(e)
        raise HTTPException(status_code=404, detail="Item not found")
    except AQLQueryError as e:
        print("AQLQueryError: ", e)
        raise HTTPException(status_code=400, detail=e.errors)
    except KeyError as e:
        print("KeyError: ", e)
        raise HTTPException(status_code=400)


@app.get("/collections")
async def get_all_collections():
    try:
        db = get_db()
        collections_query_result = db.AQLQuery(
            query=query_all_collections
        )
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


@app.get("/parallels/{file_name}/count")
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
            query=query_total_numbers,
            batchSize=100000,
            bindVars={
                "filename": file_name,
                "score": score,
                "parlength": par_length,
                "coocc": co_occ,
                "limitcollection": limit_collection,
            },
        )
        return {
            "parallel_count": query_graph_result.result,
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
