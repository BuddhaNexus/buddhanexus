from fastapi import APIRouter, Query, Depends
from ..queries import text_view_queries
from ..colormaps import calculate_color_maps_text_view, calculate_color_maps_middle_view
from .endpoint_utils import execute_query
from typing import List, Dict
from ..utils import (
    create_cleaned_limit_collection,
    get_page_for_segment, 
    get_filename_from_segmentnr
)
from .models.shared import MiddleInput, TextParallelsInput

router = APIRouter()


@router.post("/middle/")
async def get_parallels_for_middle(input: MiddleInput):
    """
    :return: List of parallels for text view (middle)
    """
    query_result = execute_query(
        text_view_queries.QUERY_PARALLELS_FOR_MIDDLE_TEXT,
        bind_vars={"parallel_ids": input.parallel_ids},
    )
    return calculate_color_maps_middle_view(query_result.result[0])


@router.post("/text-parallels/")
async def get_file_text_segments_and_parallels(input: TextParallelsInput):
    """
    Endpoint for text view. Returns preformatted text segments and ids of the corresponding parallels.
    """
    print(input)
    filename = input.file_name
    parallel_ids_type = "parallel_ids"
    page_number = input.page_number    
    if input.active_segment != "none":
        page_number = get_page_for_segment(input.active_segment)
        filename = get_filename_from_segmentnr(input.active_segment)

    limitcollection_include = create_cleaned_limit_collection(
        input.limits.category_include + input.limits.file_include
    )
    limitcollection_exclude = create_cleaned_limit_collection(
        input.limits.category_exclude + input.limits.file_exclude
    )
    number_of_total_pages = execute_query(
        text_view_queries.QUERY_GET_NUMBER_OF_PAGES,
        bind_vars={
            "file_name": filename,
        },
    ).result[0]
    if page_number > number_of_total_pages:
        return []

    current_bind_vars = {
        "file_name": filename,
        "page_number": page_number,        
        "score": input.score,
        "parlength": input.par_length,
        "multi_lingual": input.multi_lingual,
        "limitcollection_include": limitcollection_include,
        "limitcollection_exclude": limitcollection_exclude,
    }

    text_segments_query_result = execute_query(
        text_view_queries.QUERY_TEXT_AND_PARALLELS,
        bind_vars=current_bind_vars,
    )
    data_with_colormaps = calculate_color_maps_text_view(
        text_segments_query_result.result[0]
    )
    for entry in data_with_colormaps:
        entry["page"] = page_number
    return data_with_colormaps
