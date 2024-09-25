from fastapi import APIRouter, Query, Depends
from ..queries import text_view_queries
from ..colormaps import calculate_color_maps_text_view, calculate_color_maps_middle_view
from .endpoint_utils import execute_query
from typing import Any
from ..utils import (
    arrange_filter_data,
    get_page_for_segment,
    get_filename_from_segmentnr,
    get_segment_for_folio
)
from .models.text_view_models import *

router = APIRouter()


@router.post("/middle/", response_model=TextViewMiddleOutput)
async def get_parallels_for_middle(input: TextViewMiddleInput) -> Any:
    """
    :return: List of parallels for text view (middle)
    """
    query_result = execute_query(
        text_view_queries.QUERY_PARALLELS_FOR_MIDDLE_TEXT,
        bind_vars={"parallel_ids": input.parallel_ids},
    )
    return calculate_color_maps_middle_view(query_result.result[0])

@router.post("/text-parallels/", response_model=TextViewLeftOutputV2)
async def get_file_text_segments_and_parallels(input: TextParallelsInput) -> Any:
    """
    Endpoint for text view. Returns preformatted text segments and ids of the corresponding parallels.
    """
    filename = input.file_name
    parallel_ids_type = "parallel_ids"
    page_number = input.page_number
    print("ALL INPUTS", input)
    if input.active_segment != "none":
        page_number = get_page_for_segment(input.active_segment)
        filename = get_filename_from_segmentnr(input.active_segment)
    filters_include, filters_exclude = arrange_filter_data(input.filters)

    number_of_total_pages = execute_query(
        text_view_queries.QUERY_GET_NUMBER_OF_PAGES,
        bind_vars={
            "file_name": filename,
        },
    ).result[0]
    print("TOTAL PAGES", number_of_total_pages)
    if page_number >= number_of_total_pages:
        return {
            "page": page_number,
            "total_pages": number_of_total_pages,
            "items": []
        }
    current_bind_vars = {
        "file_name": filename,
        "page_number": page_number,
        "score": input.score,
        "parlength": input.par_length,
        "multi_lingual": input.multi_lingual,
        "filter_include_files": filters_include["files"],
        "filter_include_categories": filters_include["categories"],
        "filter_include_collections": filters_include["collections"],
        "filter_exclude_files": filters_exclude["files"],
        "filter_exclude_categories": filters_exclude["categories"],
        "filter_exclude_collections": filters_exclude["collections"],
    }

    text_segments_query_result = execute_query(
        text_view_queries.QUERY_TEXT_AND_PARALLELS,
        bind_vars=current_bind_vars,
    )

    data_with_colormaps = calculate_color_maps_text_view(
        text_segments_query_result.result[0]
    )
    
    return {
        "page": page_number,
        "total_pages": number_of_total_pages,
        "items": data_with_colormaps}