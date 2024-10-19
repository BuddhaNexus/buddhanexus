from fastapi import APIRouter
from typing import Any
from ..db_connection import get_db
from ..search import search_utils
from ..queries import search_queries
from .models.search_models import SearchOutput, SearchInput
from .endpoint_utils import execute_query
from ..colormaps import calculate_color_maps_search

router = APIRouter()


@router.post("/search/", response_model=SearchOutput)
async def get_search_results(input: SearchInput) -> Any:
    """
    Returns search results for given search string.
    :return: List of search results
    """
    result = []
    search_string = input.search_string.lower()
    search_strings = search_utils.preprocess_search_string(
        search_string[:300], input.filters.languages
    )
    print("SEARCH STRINGS", search_strings)
    query_search = execute_query(
        search_queries.QUERY_SEARCH,
        bind_vars={
            "search_string_bo": search_strings["bo"],
            "search_string_zh": search_strings["zh"],
            "search_string_sa": search_strings["sa"],
            "search_string_pa": search_strings["pa"],
            "search_string_sa_fuzzy": search_strings["sa_fuzzy"],
            "filter_include_files": input.filters.include_files,
            "filter_exclude_files": input.filters.exclude_files,
            "filter_include_categories": input.filters.include_categories,
            "filter_exclude_categories": input.filters.exclude_categories,
            "filter_include_collections": input.filters.include_collections,
            "filter_exclude_collections": input.filters.exclude_collections,
        },
    )
    query_result = query_search.result[0]
    # print("SEARCH RESULT BEFORE POSTPROCESSING", query_result)
    result = search_utils.postprocess_results(
        search_strings,
        query_result,
    )
    # print("SEARCH RESULT AFTER POSTPROCESSING 1", result)
    results = calculate_color_maps_search(result)
    # print("SEARCH RESULT AFTER POSTPROCESSING 2", results)
    return {"searchResults": result}
