from fastapi import APIRouter
from ..queries import text_view_queries
from ..colormaps import calculate_color_maps_text_view, calculate_color_maps_middle_view
from .endpoint_utils import execute_query
from typing import Any
from ..utils import get_page_for_segment
from shared.utils import get_filename_from_segmentnr
from .models.text_view_models import (
    TextParallelsInput,
    TextViewLeftOutput,
    TextViewMiddleInput,
    TextViewMiddleOutput,
)
from ..cache_config import cached_endpoint, CACHE_TIMES

router = APIRouter()


@router.post("/middle/", response_model=TextViewMiddleOutput)
@cached_endpoint(expire=CACHE_TIMES["LONG"])
async def get_parallels_for_middle(input: TextViewMiddleInput) -> Any:
    """
    :return: List of parallels for text view (middle)
    """
    query_result = execute_query(
        text_view_queries.QUERY_PARALLELS_FOR_MIDDLE_TEXT,
        bind_vars={"parallel_ids": input.parallel_ids},
    )
    return calculate_color_maps_middle_view(query_result.result[0])


@router.post("/text-parallels/", response_model=TextViewLeftOutput)
#@cached_endpoint(expire=CACHE_TIMES["LONG"])
async def get_file_text_segments_and_parallels(input: TextParallelsInput) -> Any:
    """
    Endpoint for text view. Returns preformatted text segments and ids of the corresponding parallels.
    """
    filename = input.filename
    parallel_ids_type = "parallel_ids"
    page = input.page
    active_match = None
    # active_segment is used to scroll to and highlight the segment in the text view
    if input.active_segment != "none":
        page = get_page_for_segment(input.active_segment)
        filename = get_filename_from_segmentnr(input.active_segment)    
    # active_match_id bypasses page, filename and active_segement in order to highlight the active match in the text view
    if input.active_match_id:
        query_result = execute_query(
            text_view_queries.QUERY_GET_MATCH_BY_ID,
            bind_vars={"active_match_id": input.active_match_id},
        )        
        active_match = query_result.result[0]
        page = get_page_for_segment(active_match["par_segnr"][0])
        filename = get_filename_from_segmentnr(active_match["par_segnr"][0])
    number_of_total_pages = execute_query(
        text_view_queries.QUERY_GET_NUMBER_OF_PAGES,
        bind_vars={
            "filename": filename,
        },
    ).result[0]
    if page >= number_of_total_pages:
        return {"page": page, "total_pages": number_of_total_pages, "items": []}
    current_bind_vars = {
        "filename": filename,
        "page": page,
        "score": input.filters.score,
        "parlength": input.filters.par_length,
        "multi_lingual": input.filters.languages,
        "filter_include_files": input.filters.include_files,
        "filter_include_categories": input.filters.include_categories,
        "filter_include_collections": input.filters.include_collections,
        "filter_exclude_files": input.filters.exclude_files,
        "filter_exclude_categories": input.filters.exclude_categories,
        "filter_exclude_collections": input.filters.exclude_collections,
    }

    text_segments_query_result = execute_query(
        text_view_queries.QUERY_TEXT_AND_PARALLELS,
        bind_vars=current_bind_vars,
    )
    data_with_colormaps = calculate_color_maps_text_view(
        text_segments_query_result.result[0],
        active_match=active_match,
    )

    return {
        "page": page,
        "total_pages": number_of_total_pages,
        "items": data_with_colormaps,
    }
