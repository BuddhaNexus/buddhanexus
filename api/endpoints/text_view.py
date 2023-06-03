from fastapi import APIRouter, Query
from ..queries import main_queries
from ..colormaps import calculate_color_maps_text_view, calculate_color_maps_middle_view
from .endpoint_utils import execute_query
from typing import List, Dict
from ..utils import (
    get_collection_files_regex,
    get_start_integer,
)

router = APIRouter()

@router.get("/middle/")
async def get_parallels_for_middle(parallel_ids: List[str]):
    """
    :return: List of parallels for text view (middle)
    """
    query_result = execute_query(main_queries.QUERY_PARALLELS_FOR_MIDDLE_TEXT,
        bind_vars={
            "parallel_ids": parallel_ids
        },
    )
    print(query_result[0])
    return calculate_color_maps_middle_view(query_result.result[0])

@router.get("/text-parallels/")
async def get_file_text_segments_and_parallels(
    file_name: str,
    active_segment: str = "none",
    score: int = 0,
    par_length: int = 0,
    limit_collection: List[str] = Query([]),
    multi_lingual: List[str] = Query([]),
):
    """
    Endpoint for text view. Returns preformatted text segments and ids of the corresponding parallels.
    """
    parallel_ids_type = "parallel_ids"
    if len(limit_collection) > 0:
        parallel_ids_type = "parallel_ids"

    start_int = 0
    if active_segment != "none":
        start_int = get_start_integer(active_segment)

    limitcollection_positive, limitcollection_negative = get_collection_files_regex(
        limit_collection
    )
    current_bind_vars = {
        "parallel_ids_type": parallel_ids_type,
        "filename": file_name,
        "limit": 800,
        "startint": start_int,
        "score": score,
        "parlength": par_length,
        "multi_lingual": multi_lingual,
        "limitcollection_positive": limitcollection_positive,
        "limitcollection_negative": limitcollection_negative,
    }
    text_segments_query_result = execute_query(main_queries.QUERY_TEXT_AND_PARALLELS,
        bind_vars=current_bind_vars,
    )
    data_with_colormaps = calculate_color_maps_text_view(text_segments_query_result.result[0])
    return data_with_colormaps
    
