from fastapi import APIRouter, Query, HTTPException
from typing import Any
from ..db_connection import get_db
from ..colormaps import calculate_color_maps_table_view
from ..utils import (
    get_language_from_filename,
    get_sort_key,
    arrange_filter_data,
)
from .numbers_view import create_numbers_view_data
from .endpoint_utils import execute_query
from ..queries import table_view_queries, menu_queries
from ..table_download import run_table_download, run_numbers_download
from .models.general_models import GeneralInput
from .models.table_view_models import *
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


@router.post("/table/", response_model=TableViewOutput)
async def get_table_view(input: GeneralInput) -> Any:
    """
    Endpoint for the table view. Accepts filters.
    :return: List of segments and parallels for the table view.

    sort_method options:

        "position": "By Position in Inquiry Text"

            (matches sorted by segment number position in the root text (default))

        "quotedtext": "By Position in Hit Text(s)"

            (matches sorted by segment number position in the target/quoted text)

        "length": "By Length of match in Inquiry Text (beginning with the longest)"

            (matches sorted by match-length in the root text

        "length2": "By Length of match in Hit Text (beginning with the longest)"

            (matches sorted by match-length in the target/quoted text)
    """
    query_result = execute_query(
        table_view_queries.QUERY_TABLE_VIEW,
        bind_vars={
            "filename": input.filename,
            "score": input.filters.score,
            "parlength": input.filters.par_length,
            "sortkey": get_sort_key(input.sort_method),
            "filter_include_files": input.filters.include_files,
            "filter_exclude_files": input.filters.exclude_files,
            "filter_include_categories": input.filters.include_categories,
            "filter_exclude_categories": input.filters.exclude_categories,
            "filter_include_collections": input.filters.include_collections,
            "filter_exclude_collections": input.filters.exclude_collections,
            "page": input.page,
            "folio": input.folio,
        },
    )
    return calculate_color_maps_table_view(query_result.result)


@router.post("/download/", response_model=TableDownloadOutput)
async def get_table_download(input: TableDownloadInput) -> Any:
    """
    Endpoint for the download table. Accepts filters.
    :return: List of segments and parallels for the downloaded table view.

    "sort_method" can be:
        "position": matches sorted by segment number position in the root text (default).
        "quotedtext": matches sorted by segment number position in the target/quoted text.
        "length": matches sorted by match-length in the root text.
        "length2": matches sorted by match-length in the target/quoted text.

    "download_data" is either "table" or "numbers" depending on the type of output required.
    When a download is requested in table-view mode, this should be set to "table" (default).
    When a download is requested in numbers-view mode, this should be set to "numbers".
    """
    filters_display = arrange_filter_data(input.filters)
    language = get_language_from_filename(input.filename)

    if input.download_data == "table":
        query_result = execute_query(
            table_view_queries.QUERY_TABLE_DOWNLOAD,
            bind_vars={
                "filename": input.filename,
                "score": input.filters.score,
                "parlength": input.filters.par_length,
                "sortkey": get_sort_key(input.sort_method),
                "filter_include_files": input.filters.include_files,
                "filter_exclude_files": input.filters.exclude_files,
                "filter_include_categories": input.filters.include_categories,
                "filter_exclude_categories": input.filters.exclude_categories,
                "filter_include_collections": input.filters.include_collections,
                "filter_exclude_collections": input.filters.exclude_collections,
                "folio": input.folio,
            },
        )

        return run_table_download(
            query_result,
            [
                input.filename,
                input.filters.score,
                input.filters.par_length,
                input.sort_method,
                filters_display,
                input.folio,
                language,
            ],
        )

    else:
        query_result = execute_query(
            table_view_queries.QUERY_NUMBERS_DOWNLOAD,
            bind_vars={
                "filename": input.filename,
                "score": input.filters.score,
                "parlength": input.filters.par_length,
                "filter_include_files": input.filters.include_files,
                "filter_exclude_files": input.filters.exclude_files,
                "filter_include_categories": input.filters.include_categories,
                "filter_exclude_categories": input.filters.exclude_categories,
                "filter_include_collections": input.filters.include_collections,
                "filter_exclude_collections": input.filters.exclude_collections,
            },
        )

        categories_result = execute_query(
            menu_queries.QUERY_CATEGORIES_PER_LANGUAGE,
            bind_vars={"language": language},
        )

        return run_numbers_download(
            categories_result.result,
            query_result.result[0],
            [
                input.filename,
                input.filters.score,
                input.filters.par_length,
                input.sort_method,
                filters_display,
                "All",
                language,
            ],
        )

    return
