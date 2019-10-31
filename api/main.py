import re
from typing import Dict, List

from fastapi import FastAPI, HTTPException, Query
from pyArango.theExceptions import DocumentNotFoundError, AQLQueryError
from starlette.middleware.cors import CORSMiddleware
from starlette.responses import Response
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
    query_graph_data,
)
from .utils import get_language_from_filename, get_regex_test, get_future_date
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
    parallelIDList : list 
    score : int
    par_length : int
    co_occ : int
    limit_collection : list
    file_name : str


@app.post("/parallels-for-left/")
async def get_parallels_for_root_seg_nr(parallels : parallelItem):
    parallelIDList = parallels.parallelIDList
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
    return { "parallels" : query_result.result }
    

@app.get("/files/{file_name}/segments")
async def get_segments_for_file(
    response: Response,
    file_name: str,
    score: int = 0,
    par_length: int = 0,
    co_occ: int = 0,
    limit_collection: List[str] = Query([]),
):
    response.headers["Expires"] = get_future_date()
    response.headers["Cache-Control"] = 'public'
    try:
        language = get_language_from_filename(file_name)
        db = get_db()
        query_result = db.AQLQuery(
            query=query_file_segments_parallels,
            bindVars={
                "filename": file_name,
                "score": score,
                "parlength": par_length,
                "coocc": co_occ,
                "limitcollection": get_regex_test(limit_collection, language),
            },
        )
        segments = query_result.result[0] if query_result.result else []
        collection_keys = []
        result = []
        parallel_count = 0
        for segment in segments:
            if "parallels" in segment:
                for parallel in segment["parallels"]:
                    parallel_count += 1
                    for seg_nr in parallel:
                        collection_key = re.search(collection_pattern, seg_nr
                        )
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


@app.get("/menus/{language}")
async def get_files_for_menu(language: str):
    try:
        db = get_db()
        language_menu_query_result = db.AQLQuery(
            query=query_files_for_language, batchSize=10000, bindVars={"language": language}
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
            query=query_files_for_category, batchSize=10000, bindVars={"language": language}
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
            query=query_categories_for_language, batchSize=500, bindVars={"language": language}
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
async def get_file_text_segments(file_name: str,
                                 active_segment: str = "none"):
    try:
        db = get_db()
        text_segments_query_result = db.AQLQuery(
            query=query_text_segments, 
            batchSize=100000, 
            bindVars={"filename": file_name}
        )
        result = []
        if active_segment == "none":
            result = text_segments_query_result.result[:100]
        else:
            c = 0
            for segment in text_segments_query_result.result:
                if segment['segnr'] == active_segment:
                    break
                else:
                    c += 1
            beg = c - 100
            if beg < 0:
                beg = 0
            end = c+100
            result = text_segments_query_result.result[beg:end]
        return { "textleft" : result }
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
async def search_file_text_segments(file_name: str,
                                    search_string: str):
    try:
        search_string = search_string.lower()
        db = get_db()
        text_segments_query_result = db.AQLQuery(
            query=query_text_search, 
            batchSize=100000, 
            bindVars={"filename": file_name,
                      "search_string": search_string
            }
        )
        print("FILE NAME",file_name)
        print("SEARCH STRING", search_string)
        return { "result" : text_segments_query_result.result}    
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
    limit_collection: List[str] = Query([]),
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

            if (collection_key):
                collection = collection_key.group()
                if collection not in total_collection_dict.keys():
                    total_collection_dict[collection] = count_this_parallel
                else:
                    total_collection_dict[collection] += count_this_parallel
                if (collection not in collection_keys):
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
            parallel_graph_name_list.update({key+" "+collections_with_full_name[key] : total_collection_dict[key]})

        # returns a list of the data as needed by Google Graphs
        return { "graphdata" : list(map(list, parallel_graph_name_list.items())),
                 "parallel_count": parallel_count }

    except DocumentNotFoundError as e:
        print(e)
        raise HTTPException(status_code=404, detail="Item not found")
    except AQLQueryError as e:
        print("AQLQueryError: ", e)
        raise HTTPException(status_code=400, detail=e.errors)
    except KeyError as e:
        print("KeyError: ", e)
        raise HTTPException(status_code=400)
