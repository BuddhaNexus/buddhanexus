from fastapi import APIRouter, Query, Depends
from ..queries import main_queries
from ..colormaps import calculate_color_maps_text_view, calculate_color_maps_middle_view
from .endpoint_utils import execute_query
from typing import List, Dict
from ..utils import (
    create_cleaned_limit_collection,
    get_start_integer,
)
from .models.shared import MiddleInput, TextParallelsInput

router = APIRouter()


@router.post("/middle/")
async def get_parallels_for_middle(input: MiddleInput):
    """
    :return: List of parallels for text view (middle)
    """
    query_result = execute_query(
        main_queries.QUERY_PARALLELS_FOR_MIDDLE_TEXT,
        bind_vars={"parallel_ids": input.parallel_ids},
    )    
    return calculate_color_maps_middle_view(query_result.result[0])


@router.post("/text-parallels/")
async def get_file_text_segments_and_parallels(input: TextParallelsInput):
    """
    Endpoint for text view. Returns preformatted text segments and ids of the corresponding parallels.
    """
    parallel_ids_type = "parallel_ids"
    start_int = 0
    if input.active_segment != "none":
        start_int = get_start_integer(input.active_segment)

    limitcollection_positive = create_cleaned_limit_collection(input.limits.collection_positive + input.limits.file_positive) 
    limitcollection_negative = create_cleaned_limit_collection(input.limits.collection_negative + input.limits.file_negative)     
    current_bind_vars = {
        "parallel_ids_type": parallel_ids_type,
        "filename": input.file_name,
        "limit": 800,
        "startint": start_int,
        "score": input.score,
        "parlength": input.par_length,
        "multi_lingual": input.multi_lingual,
        "limitcollection_positive": limitcollection_positive,
        "limitcollection_negative": limitcollection_negative,
    }

    text_segments_query_result = execute_query(
        main_queries.QUERY_TEXT_AND_PARALLELS,
        bind_vars=current_bind_vars,
    )
    
    data_with_colormaps = calculate_color_maps_text_view(
        text_segments_query_result.result[0]
    )
    return data_with_colormaps
