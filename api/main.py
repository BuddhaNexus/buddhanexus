import re
from typing import Dict, List

from fastapi import FastAPI, HTTPException, Query
from pyArango.theExceptions import DocumentNotFoundError, AQLQueryError
from starlette.middleware.cors import CORSMiddleware

from .db_queries import query_file_segments_parallels, query_collection_names, query_items_for_menu, query_items_for_category_menu
from .utils import get_language_from_filename
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
    file_name: str,
    score: int = 0,
    par_length: int = 0,
    co_occ: int = 0,
    limit_collection: List[str] = Query([]),
):
    try:
        db = get_db()
        query_result = db.AQLQuery(
            query=query_file_segments_parallels,
            bindVars={
                "filename": file_name,
                "score": score,
                "parlength": par_length,
                "coocc": co_occ,
                "limitcollection": limit_collection,
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
                        collection_key = re.search(r"^([A-Z]+[0-9]+|[a-z\-]*)", seg_nr)
                        if (
                            collection_key
                            and collection_key.group() not in collection_keys
                        ):
                            collection_keys.append(collection_key.group())
                result.append(segment)

        collections = db.AQLQuery(
            query=query_collection_names,
            bindVars={
                "collections": collection_keys,
                "language": get_language_from_filename(file_name),
            },
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
async def get_items_for_menu(language: str):
    try:
        languageId = getLanguageId(language)
        db = get_db()
        menu_query_result = db.AQLQuery(
            query=query_items_for_menu,
            bindVars={"language": languageId}
        )
        return {"menuitems": menu_query_result.result}

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
async def get_items_for_category_menu(language: str):
    try:
        languageId = getLanguageId(language)
        db = get_db()
        category_menu_query_result = db.AQLQuery(
            query=query_items_for_category_menu,
            bindVars={"language": languageId}
        )
        return {"categoryitems": category_menu_query_result.result}

    except DocumentNotFoundError as e:
        print(e)
        raise HTTPException(status_code=404, detail="Item not found")
    except AQLQueryError as e:
        print("AQLQueryError: ", e)
        raise HTTPException(status_code=400, detail=e.errors)
    except KeyError as e:
        print("KeyError: ", e)
        raise HTTPException(status_code=400)


def getLanguageId(language):
    languageId = ''
    if language == 'pali':
        languageId = 'pli'
    if language == 'tibetan':
        languageId = 'tib'
    if language == 'chinese':
        languageId = 'chn'
    if language == 'sanskrit':
        languageId = 'skt'
    return languageId