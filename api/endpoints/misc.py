from fastapi import APIRouter, Query
from .endpoint_utils  import execute_query
from ..queries import main_queries, menu_queries
from ..utils import get_language_from_filename
from typing import List
import re 

router = APIRouter()


@router.get("/parallels/{file_name}/count")
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
    query_graph_result = get_db().AQLQuery(
        query=main_queries.QUERY_TOTAL_NUMBERS,
        batchSize=100000,
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
    query_graph_result = get_db().AQLQuery(
        query=main_queries.QUERY_FOLIOS,
        batchSize=100000,
        bind_vars={"filename": file_name},
    )
    folios = query_graph_result.result[0]
    return {"folios": folios}

