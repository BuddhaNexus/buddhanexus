from fastapi import APIRouter, Query, HTTPException
from ..db_connection import get_db
from ..colormaps import calculate_color_maps_table_view
from ..utils import (
    get_language_from_filename, 
    arrange_filter_data,
    get_sort_key, 
)
from .numbers_view import create_numbers_view_data
from .endpoint_utils import execute_query
from ..queries import table_view_queries, menu_queries
from ..table_download import run_table_download, run_numbers_download
from .models.general_models import GeneralInput
from .models.table_view_models import TableDownloadInput
from typing import List

router = APIRouter()

def collect_segment_results(segments) -> List:
    """
    Query results are analyzed based on what collection they are part of and put in the
    relevant category thereof. Returns the results and the keys to the collections.
    """
    collection_keys = []
    segments_result = []
    for segment in segments:
        if "parallels" not in segment or segment["parallels"] is None:
            continue
        for parallel in segment["parallels"]:
            for seg_nr in parallel:
                collection_key = re.search(COLLECTION_PATTERN, seg_nr)
                if collection_key and collection_key.group() not in collection_keys:
                    collection_keys.append(collection_key.group())
        segments_result.append(segment)

    return segments_result, collection_keys


@router.post("/table")
async def get_table_view(input: GeneralInput
):
    """
    Endpoint for the table view. Accepts filters.
    :return: List of segments and parallels for the table view.
    """
    filter_include, filter_exclude = arrange_filter_data(input.filters)
    query_result = execute_query(table_view_queries.QUERY_TABLE_VIEW,                            
            bind_vars={
                "filename": input.file_name,
                "score": input.score,
                "parlength": input.par_length,
                "sortkey": input.get_sort_key(input.sort_method),
                "filter_include_files": filter_include["files"],
                "filter_exclude_files": filter_exclude["files"],
                "filter_include_categories": filter_include["categories"],
                "filter_exclude_categories": filter_exclude["categories"],
                "filter_include_collections": filter_include["collections"],
                "filter_exclude_collections": filter_exclude["collections"],
                "page": input.page,
                "folio": input.folio,
            }
        )
    return calculate_color_maps_table_view(query_result.result)

@router.post("/download")
async def get_table_download(input: TableDownloadInput):
    """
    Endpoint for the download table. Accepts filters.
    :return: List of segments and parallels for the downloaded table view.
    """
    filter_include, filter_exclude = arrange_filter_data(input.filters)
    language = get_language_from_filename(input.file_name)

    query_result = execute_query(table_view_queries.QUERY_TABLE_DOWNLOAD,                           
            bind_vars={
                "filename": input.file_name,
                "score": input.score,
                "parlength": input.par_length,
                "sortkey": input.get_sort_key(input.sort_method),
                "filter_include_files": filter_include["files"],
                "filter_exclude_files": filter_exclude["files"],
                "filter_include_categories": filter_include["categories"],
                "filter_exclude_categories": filter_exclude["categories"],
                "filter_include_collections": filter_include["collections"],
                "filter_exclude_collections": filter_exclude["collections"],
                "folio": input.folio,
            }
        )
    

    if input.download_data == "table":
        return run_table_download(
            query_result,
            [
                input.file_name,
                input.score,
                input.par_length,
                input.sort_method,
                [],
                input.folio,
                language,
            ],
        )        
    
    segment_collection_results = collect_segment_results(
        create_numbers_view_data(
            query_result.result, get_folio_regex(language, input.file_name, input.folio)
        )
    )

    collections_result = execute_query(menu_queries.QUERY_COLLECTION_NAMES,
        bind_vars={
            "collections": segment_collection_results[1],
            "language": language,
        }
    ).result[0]
    
    return run_numbers_download(
        collections_result,
        segment_collection_results[0],
        [
            input.file_name,
            input.score,
            input.par_length,
            input.sort_method,
            input.limit_collection,
            input.folio,
            language,
        ],
    )
