from fastapi import APIRouter, Query, HTTPException
from ..db_connection import get_db
from ..utils import get_collection_files_regex
from ..utils import (
    get_language_from_filename,
    get_sort_key,
    collect_segment_results,
    create_numbers_view_data,
    get_folio_regex,
)
from .endpoint_utils import execute_query
from ..queries import main_queries, menu_queries
from ..table_download import run_table_download, run_numbers_download

from typing import List

router = APIRouter()


@router.get("/numbers")
async def get_numbers_view(
    file_name: str,
    score: int = 0,
    par_length: int = 0,
    limit_collection: List[str] = Query([]),
    page: int = 0,
    sort_method: str = "position",
    folio: str = "",
):
    """
    Endpoint for numbers view. Input parameters are the same as for table view.
    """

    limitcollection_positive, limitcollection_negative = get_collection_files_regex(
        limit_collection
    )
    language = get_language_from_filename(file_name)

    query_result = execute_query(
        main_queries.QUERY_TABLE_VIEW,
        bind_vars={
            "filename": file_name,
            "score": score,
            "parlength": par_length,
            "sortkey": get_sort_key(sort_method),
            "limitcollection_positive": limitcollection_positive,
            "limitcollection_negative": limitcollection_negative,
            "page": page,
            "folio": folio,
        },
    )
    segments_result, collection_keys = collect_segment_results(
        create_numbers_view_data(
            query_result.result, get_folio_regex(language, file_name, folio)
        )
    )
    collections = execute_query(
        menu_queries.QUERY_COLLECTION_NAMES,
        bind_vars={
            "collections": collection_keys,
            "language": language,
        },
    ).result
    return {
        "collections": collections,
        "segments": segments_result,
    }
