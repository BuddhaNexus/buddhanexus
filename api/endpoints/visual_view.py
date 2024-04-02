from fastapi import APIRouter, Query
from .endpoint_utils import execute_query
from ..queries import main_queries
from typing import List
import re

router = APIRouter()


@router.get("/visual-view/")
async def get_visual_view_for_file(
    # TODO: what is "selected"? Find better name
    searchterm: str,
    language: str,
    selected: List[str] = Query([]),
):
    """
    This view might be discontinued.
    Endpoint for visual view
    """

    language_search_term = language + "_" + searchterm
    query_collection_list = execute_query(
        main_queries.QUERY_COLLECTION_LIST,
        bind_vars={"sourcecollection": language_search_term, "selected": selected},
    )
    graph_data = []
    if len(selected) == 1 or re.search(r"^[A-Z][a-z]+$", searchterm):
        graph_data = query_collection_list.result[0]
    else:
        query_results = query_collection_list.result[0]
        query_results_keys = []
        for key in query_results:
            if not key[0] in query_results_keys:
                query_results_keys.append(key[0])

        for key in query_results_keys:
            for result_item in query_results:
                if result_item[0] == key:
                    graph_data.append(result_item)

    return {"graphdata": graph_data}
