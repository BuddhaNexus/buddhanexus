from fastapi import APIRouter, Query
from ..db_connection import get_db
from ..utils import get_collection_files_regex
from ..search import search_utils
from ..queries import search_queries
from typing import List, AnyStr

router = APIRouter()


@router.get("/search/")
async def get_search_results(
    search_string: str, limit_collection: List[str] = Query([])
):
    """
    Returns search results for given search string.
    :return: List of search results
    """
    limitcollection_positive, limit_collection_negative = get_collection_files_regex(
        limit_collection
    )

    database = get_db()
    result = []
    search_string = search_string.lower()
    search_strings = search_utils.preprocess_search_string(search_string[:150])
    query_search = database.AQLQuery(
        query=search_queries.QUERY_SEARCH,
        bind_vars={
            "search_string_tib": search_strings["tib"],
            "search_string_chn": search_strings["chn"],
            "search_string_skt": search_strings["skt"],
            "search_string_pli": search_strings["pli"],
            "search_string_skt_fuzzy": search_strings["skt_fuzzy"],
            "limitcollection_positive": limitcollection_positive,
            "limitcollection_negative": limit_collection_negative,
        },
        batchSize=300,
        rawResults=True,
    )
    query_result = query_search.result[0]
    result = search_utils.postprocess_results(
        search_strings,
        query_result,
    )
    return {"searchResults": result}
