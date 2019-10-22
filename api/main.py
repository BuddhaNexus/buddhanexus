import re
from typing import Dict, List

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
        for parallel in query_graph_result.result[0].keys():
            count_this_parallel = query_graph_result.result[0][parallel]
            parallel_count += count_this_parallel
            collection_key = re.search(collection_pattern, parallel)

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
            parallel_graph_name_list.update({collections_with_full_name[key] : total_collection_dict[key]})

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


@app.get("/visual/{searchterm}")
async def get_graph_for_file(
    searchterm: str,
    searchtype: str,
    language: str,
):
    try:
        db = get_db()
        total_parallel_count = []

        # get a sorted list of categories to get the results in the right order
        query_full_category_list = db.AQLQuery(
            query=query_sorted_category_list,
            bindVars={
                "language": language,
            },
        )

        # check if the search is for a catagory (i.e. T06) or for a collection (i.e. Tengyur)
        if searchtype == "category":
            filecount = get_query_files_per_category(searchterm, language)

            for filename in filecount:
                parallel_count = filename["parallelcount"]
                for categoryname in query_full_category_list.result:
                    if categoryname in parallel_count.keys():
                        total_parallel_count.append([filename["filename"],categoryname,parallel_count[categoryname]])
                    else:
                        total_parallel_count.append([filename["filename"],categoryname,0])

        # if the search is for a collection, a list of categories for that collection
        # is iterated over and the results for each file added.
        elif searchtype == "collection":
            query_collection_list = db.AQLQuery(
                query=query_categories_per_collection,
                bindVars={
                    "collection": searchterm,
                    "language": language,
                },
            )

            for cat in query_collection_list.result[0]:
                filecount = get_query_files_per_category(cat, language)

                total_parlist = {}
                for filename in filecount:
                    parallel_count = filename["parallelcount"]
                    for categoryname in query_full_category_list.result:
                        if categoryname not in total_parlist.keys():
                            if categoryname not in parallel_count.keys():
                                total_parlist[categoryname] = 0
                            else:
                                total_parlist[categoryname] = parallel_count[categoryname]
                        elif categoryname in parallel_count.keys():
                                total_parlist[categoryname] += parallel_count[categoryname]

                for key,value in total_parlist.items():
                    total_parallel_count.append([cat,key,value])

        return total_parallel_count

    except DocumentNotFoundError as e:
        print(e)
        raise HTTPException(status_code=404, detail="Item not found")
    except AQLQueryError as e:
        print("AQLQueryError: ", e)
        raise HTTPException(status_code=400, detail=e.errors)
    except KeyError as e:
        print("KeyError: ", e)
        raise HTTPException(status_code=400)


# supporting function to return a list of files in the respective category
def get_query_files_per_category(
    searchterm: str,
    language: str,
):

    db = get_db()
    query_parallelcount_per_category = db.AQLQuery(
        query=query_files_per_category,
        bindVars={
            "category": searchterm,
            "language": language,
        },
    )

    return query_parallelcount_per_category.result
