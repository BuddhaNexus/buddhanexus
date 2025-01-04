from fastapi import APIRouter
from typing import Any
from ..search import search_utils
from .models.search_models import SearchOutput, SearchInput
from .endpoint_utils import execute_query
from ..colormaps import calculate_color_maps_search
from api.queries.search_query_builder import build_query_search

router = APIRouter()


@router.post("/search/", response_model=SearchOutput)
async def search(search_input: SearchInput):
    # Process search string only for requested language
    search_strings = search_utils.preprocess_search_string(
        search_input.search_string, search_input.filters.language
    )

    # Determine which languages to search
    query_languages = (
        ["sa", "bo", "pa"]
        if search_input.filters.language == "all"
        else [search_input.filters.language]
    )

    # Build filter parameters with only relevant search strings
    filter_params = {
        "filter_include_files": search_input.filters.include_files or [],
        "filter_exclude_files": search_input.filters.exclude_files or [],
        "filter_include_categories": search_input.filters.include_categories or [],
        "filter_exclude_categories": search_input.filters.exclude_categories or [],
        "filter_include_collections": search_input.filters.include_collections or [],
        "filter_exclude_collections": search_input.filters.exclude_collections or [],
    }

    # Only add search strings for requested languages
    for lang in query_languages:
        if lang in search_strings:
            filter_params[f"search_string_{lang}"] = search_strings[lang]
            if lang == "sa" and "sa_fuzzy" in search_strings:
                filter_params["search_string_sa_fuzzy"] = search_strings["sa_fuzzy"]

    # Create bind variables dictionary
    bind_variables = {
        "search_string_sa": search_strings["sa"] if "sa" in search_strings else None,
        "search_string_sa_fuzzy": (
            search_strings["sa_fuzzy"] if "sa_fuzzy" in search_strings else None
        ),
        "search_string_bo": search_strings["bo"] if "bo" in search_strings else None,
        "search_string_pa": search_strings["pa"] if "pa" in search_strings else None,
        "search_string_zh": search_strings["zh"] if "zh" in search_strings else None,
    }

    # Remove None values from bind_variables
    bind_variables = {k: v for k, v in bind_variables.items() if v is not None}

    # Build and execute query
    query = build_query_search(
        query_languages=query_languages,
        bind_variables=bind_variables,
        filters=filter_params,
        max_limit=1000,
    )

    result = execute_query(query, bind_vars=filter_params)
    result = result.result[0]

    # Post-process results
    processed_results = search_utils.postprocess_results(search_strings, result)
    processed_results = calculate_color_maps_search(processed_results)

    return {"searchResults": processed_results}
