from fastapi import APIRouter
from ..db_connection import get_db
from ..utils import create_cleaned_limit_collection
from ..search import search_utils
from ..queries import search_queries
from .models.shared import SearchInput
from .endpoint_utils import execute_query

router = APIRouter()


@router.post("/search/")
async def get_search_results(input: SearchInput):
    """
    Returns search results for given search string.
    :return: List of search results
    """
    limitcollection_include = create_cleaned_limit_collection(
        input.limits.category_include + input.limits.file_include
    )
    limit_collection_exclude = create_cleaned_limit_collection(
        input.limits.category_exclude + input.limits.file_exclude
    )
    result = []
    search_string = input.search_string.lower()
    search_strings = search_utils.preprocess_search_string(search_string[:300])
    print("LIMIT COLLECTION INCLUDE", limitcollection_include)
    print("LIMIT COLLECTION EXCLUDE", limit_collection_exclude)
    query_search = execute_query(
        search_queries.QUERY_SEARCH,
        bind_vars={
            "search_string_tib": search_strings["tib"],
            "search_string_chn": search_strings["chn"],
            "search_string_skt": search_strings["skt"],
            "search_string_pli": search_strings["pli"],
            "search_string_skt_fuzzy": search_strings["skt_fuzzy"],
            "limitcollection_include": limitcollection_include,
            "limitcollection_exclude": limit_collection_exclude,
        },
    )
    query_result = query_search.result[0]
    result = search_utils.postprocess_results(
        search_strings,
        query_result,
    )
    return {"searchResults": result}
