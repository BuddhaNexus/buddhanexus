from fastapi import APIRouter
from typing import Any
from ..search import search_utils
from ..queries import search_queries
from .models.search_models import SearchOutput, SearchInput
from .endpoint_utils import execute_query
from ..colormaps import calculate_color_maps_search
from time import time
from api.queries.search_query_builder import SearchQueryBuilder
from ..db_connection import get_db

router = APIRouter()


@router.post("/search/", response_model=SearchOutput)
async def search(search_input: SearchInput):
    db = get_db()
    
    # Build search query
    query_builder = SearchQueryBuilder(db)
    
    # Execute query with preprocessed search strings
    search_strings = search_utils.preprocess_search_string(
        search_input.search_string, 
        search_input.filters.language
    )
    
    query = query_builder.build_search_query(search_strings)
    print(f"[search] query: {query}")

    # Remove language from filters before passing to query
    filters_dict = search_input.filters.dict()
    filters_dict.pop('language', None)
    
    # Pass all search strings to bind variables
    result = execute_query(
        query,
        bind_vars={
            "search_string_sa": search_strings["sa"],
            "search_string_bo": search_strings["bo"], 
            "search_string_pa": search_strings["pa"],
            "search_string_zh": search_strings["zh"],
            **filters_dict
        }
    )
    processed_results = search_utils.postprocess_results(search_strings, result)
    
    return {"searchResults": processed_results}
