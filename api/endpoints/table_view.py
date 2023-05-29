from fastapi import APIRouter, Query, HTTPException
from ..db_connection import get_db
from ..utils import get_collection_files_regex
from ..colormaps import calculate_color_maps_table_view
from ..utils import (
    get_language_from_filename, 
    get_sort_key, 
    collect_segment_results, 
    create_numbers_view_data,
    get_folio_regex    
)
from .endpoint_utils import execute_query
from ..queries import main_queries, menu_queries
from ..table_download import run_table_download, run_numbers_download

from typing import List

router = APIRouter()

@router.get("/files/{file_name}/table")
async def get_table_view(
    file_name: str,
    score: int = 0,
    par_length: int = 0,
    limit_collection: List[str] = Query([]),
    page: int = 0,
    sort_method: str = "position",
    folio: str = "",
):
    """
    Endpoint for the table view. Accepts filters.
    :return: List of segments and parallels for the table view.
    """
    limitcollection_positive, limitcollection_negative = get_collection_files_regex(
        limit_collection
    )
    query_result = execute_query(main_queries.QUERY_TABLE_VIEW,                            
            bindVars={
                "filename": file_name,
                "score": score,
                "parlength": par_length,
                "sortkey": get_sort_key(sort_method),
                "limitcollection_positive": limitcollection_positive,
                "limitcollection_negative": limitcollection_negative,
                "page": page,
                "folio": folio,
            }
        )
    return calculate_color_maps_table_view(query_result.result)

@router.get("/files/{file_name}/tabledownload")
async def get_table_download(
    file_name: str,
    score: int = 0,
    par_length: int = 0,
    limit_collection: List[str] = Query([]),
    sort_method: str = "position",
    folio: str = "",
    download_data: str = "table",
):
    """
    Endpoint for the download table. Accepts filters.
    :return: List of segments and parallels for the downloaded table view.
    """
    language = get_language_from_filename(file_name)
    limit_collection_regex = get_collection_files_regex(limit_collection)

    query_result = execute_query(main_queries.QUERY_TABLE_DOWNLOAD,                           
            bindVars={
                "filename": file_name,
                "score": score,
                "parlength": par_length,
                "sortkey": get_sort_key(sort_method),
                "limitcollection_positive": limit_collection_regex[0],
                "limitcollection_negative": limit_collection_regex[1],
                "folio": folio,
            }
        )
    

    if download_data == "table":
        return run_table_download(
            query_result,
            [
                file_name,
                score,
                par_length,
                sort_method,
                limit_collection,
                folio,
                language,
            ],
        )        
    
    segment_collection_results = collect_segment_results(
        create_numbers_view_data(
            query_result.result, get_folio_regex(language, file_name, folio)
        )
    )

    collections_result = execute_query(menu_queries.QUERY_COLLECTION_NAMES,
        bindVars={
            "collections": segment_collection_results[1],
            "language": language,
        }
    ).result[0]
    
    return run_numbers_download(
        collections_result,
        segment_collection_results[0],
        [
            file_name,
            score,
            par_length,
            sort_method,
            limit_collection,
            folio,
            language,
        ],
    )

@router.get("/files/{file_name}/multilang")
async def get_multilang(
    file_name: str,
    multi_lingual: List[str] = Query([]),
    folio: str = "",
    page: int = 0,
    score: int = 0,
):
    """
    Endpoint for the multilingual table view. Accepts Parallel languages
    :return: List of segments and parallels for the table view.
    """
    query_result = execute_query(main_queries.QUERY_MULTILINGUAL,
        bindVars={
            "filename": file_name,
            "multi_lingual": multi_lingual,
            "page": page,
            "score": score,
            "folio": folio,
        }
    )
    return query_result.result
