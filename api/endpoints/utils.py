from fastapi import APIRouter, Query
from .endpoint_utils import execute_query
from ..queries import main_queries
from ..utils import get_collection_files_regex
from ..search import search_utils
from typing import List

router = APIRouter()


@router.get("/count-matches/")
async def get_counts_for_file(
    file_name: str,
    score: int = 0,
    par_length: int = 0,
    limit_collection: List[str] = Query([]),
):
    """
    Returns number of filtered parallels
    """
    limitcollection_positive, limitcollection_negative = get_collection_files_regex(
        limit_collection
    )
    query_graph_result = execute_query(
        main_queries.QUERY_COUNT_MATCHES,
        bind_vars={
            "filename": file_name,
            "score": score,
            "parlength": par_length,
            "limitcollection_positive": limitcollection_positive,
            "limitcollection_negative": limitcollection_negative,
        },
    )
    return {"parallel_count": query_graph_result.result[0]}


@router.get("/folios/")
async def get_folios_for_file(file_name: str):
    """
    Returns number of folios (TIB) / facsimiles (CHN) /
    suttas/PTS nrs/segments (PLI) / segments (SKT)
    """
    query_graph_result = execute_query(
        main_queries.QUERY_FOLIOS,
        bind_vars={"filename": file_name},
    )
    folios = query_graph_result.result[0]
    return {"folios": folios}


@router.get("/sanskrittagger/")
async def tag_sanskrit(sanskrit_string: str):
    """
    Stemming + Tagging for Sanskrit
    :return: String with tagged Sanskrit
    """
    result = search_utils.tag_sanskrit(sanskrit_string).replace("\n", " # ")
    return {"tagged": result}


@router.get("/available-languages/")
async def get_multilingual(filename: str):
    """
    Returns a list of the available languages of matches for the given file.
    """
    query_result = {"langList": []}
    query_displayname = execute_query(
        main_queries.QUERY_MULTILINGUAL_LANGS,
        bind_vars={"filename": filename},
        raw_results=True,
    )
    query_result = {"langList": query_displayname.result[0]}
    return query_result
