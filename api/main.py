import re
from typing import Dict, List
from collections import Counter
from fastapi import FastAPI, HTTPException, Query
from pyArango.theExceptions import DocumentNotFoundError, AQLQueryError
from starlette.middleware.cors import CORSMiddleware
from starlette.responses import Response

from .db_queries import (
    query_file_segments_parallels,
    query_collection_names,
    query_files_for_language,
    query_categories_for_language,
    query_files_for_category,
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
                        collection_key = re.search(
                            r"^(pli-tv-b[ui]-vb|[A-Z]+[0-9]+|[a-z\-]+)", seg_nr
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
            query=query_files_for_language, bindVars={"language": language}
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
            query=query_files_for_category, bindVars={"language": language}
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
            query=query_categories_for_language, bindVars={"language": language}
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
            bindVars={
                "filename": file_name,
                "score": score,
                "parlength": par_length,
                "coocc": co_occ,
            },
        )
        parallel_count = 0
        collection_keys = []
        total_collection_key_list = []
        for parallel in query_graph_result.result:
            parallel_count += 1
            collection_key = re.search(
                r"^(pli-tv-b[ui]-vb|[A-Z]+[0-9]+|[a-z\-]+)", parallel
            )
            if (collection_key):
                total_collection_key_list.append(collection_key.group())
                if (collection_key.group() not in collection_keys):
                    collection_keys.append(collection_key.group())

        collections = db.AQLQuery(
            query=query_collection_names,
            bindVars={"collections": collection_keys, "language": language},
        )

        collections_with_full_name = {}
        for collection_result in collections.result[0]:
            collections_with_full_name.update(collection_result)

        datalist = Counter(total_collection_key_list)

        parallel_graph_name_list = {}
        for key in datalist:
            parallel_graph_name_list.update({collections_with_full_name[key] : datalist[key]})
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
