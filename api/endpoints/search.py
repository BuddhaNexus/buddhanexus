from fastapi import APIRouter
from typing import Any
from ..search import search_utils
from .models.search_models import SearchOutput, SearchInput
from .endpoint_utils import execute_query
from ..colormaps import calculate_color_maps_search
from api.queries.search_query_builder import build_query_search
from ..db_connection import get_db

router = APIRouter()


@router.post("/search/", response_model=SearchOutput)
async def search(search_input: SearchInput):
    db = get_db()
    # Execute query with preprocessed search strings
    search_strings = search_utils.preprocess_search_string(
        search_input.search_string, 
        search_input.filters.language
    )

    # Prepare query languages based on which search strings are non-empty
    #query_languages = [lang for lang, string in search_strings.items() if string]
    query_languages = ["sa", "bo", "zh", "pa"] # for debugging purposes, when only parts of the search indicies are loaded, we can limit the query to the parts that are loaded via hardcoding the languages
    # Prepare filter parameters for query builder
    if search_input.filters.language != "all":
        query_languages = [search_input.filters.language]
    print(f"[search] search_strings: {search_strings}")
    filter_params = {
        "filter_include_files": search_input.filters.include_files,
        "filter_exclude_files": search_input.filters.exclude_files,
        "filter_include_categories": search_input.filters.include_categories,
        "filter_exclude_categories": search_input.filters.exclude_categories,
        "filter_include_collections": search_input.filters.include_collections,
        "filter_exclude_collections": search_input.filters.exclude_collections,
        "search_string_sa": search_strings["sa"],
        "search_string_sa_fuzzy": search_strings["sa_fuzzy"],
        "search_string_bo": search_strings["bo"],
        "search_string_zh": search_strings["zh"],
        "search_string_pa": search_strings["pa"],
    }

    # Build the query using the query builder
    query = build_query_search(
        query_languages=query_languages,
        filters=filter_params,
        max_limit=1000
    )
    print(f"[search] query: {query}")
    # Execute query with bind variables from filter_params
    result = execute_query(query, bind_vars=filter_params)    
    result = result.result[0]
    processed_results = search_utils.postprocess_results(search_strings, result)
    processed_results = calculate_color_maps_search(processed_results)
    return {"searchResults": processed_results}
