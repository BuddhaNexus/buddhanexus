from fastapi import APIRouter
from typing import Any
from ..search import search_utils
from ..queries import search_queries
from .models.search_models import SearchOutput, SearchInput
from .endpoint_utils import execute_query
from ..colormaps import calculate_color_maps_search
from time import time

router = APIRouter()


@router.post("/search/", response_model=SearchOutput)
async def get_search_results(input: SearchInput) -> Any:
    """
    Returns search results for given search string.
    :return: List of search results
    """
    start_time = time()

    search_string = input.search_string.lower()
    search_strings = search_utils.preprocess_search_string(
        search_string[:300], input.filters.language
    )
    print(f"[{time() - start_time:.3f}s] Preprocessing search string completed")

    print("SEARCH STRINGS", search_strings)
    
    query_start = time()
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
    print(f"[{time() - query_start:.3f}s] Database query completed")
    print("LENGTH OF QUERY RESULT", len(query_search.result[0]))
    query_result = query_search.result[0]
    
    postprocess_start = time()
    result = search_utils.postprocess_results(
        search_strings,
        query_result,
    )
    print(f"[{time() - postprocess_start:.3f}s] Post-processing completed")

    colormap_start = time()
    results = calculate_color_maps_search(result)
    print(f"[{time() - colormap_start:.3f}s] Color mapping completed")
    
    print(f"[{time() - start_time:.3f}s] Total search time")
    
    return {"searchResults": result}
