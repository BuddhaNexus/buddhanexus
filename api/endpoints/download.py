from fastapi import APIRouter
from typing import Any
from ..utils import (
    get_sort_key,
    arrange_filter_data,
)
from shared.utils import get_language_from_filename
from .endpoint_utils import execute_query
from ..queries import table_view_queries, numbers_view_queries
from ..download import run_table_download, run_numbers_download
from .models.download_models import *

router = APIRouter()


@router.post("/download/", response_model=DownloadOutput)
async def get_table_download(input: DownloadInput) -> Any:
    """
    Endpoint for the download table & numbers view. Accepts filters.
    :return: List of segments and parallels for the downloaded table- and numbers view.

    sort_method options:

        "position": "By Position in Inquiry Text"

            (matches sorted by segment number position in the root text (default))

        "quotedtext": "By Position in Hit Text(s)"

            (matches sorted by segment number position in the target/quoted text)

        "length": "By Length of match in Inquiry Text (beginning with the longest)"

            (matches sorted by match-length in the root text

        "length2": "By Length of match in Hit Text (beginning with the longest)"

            (matches sorted by match-length in the target/quoted text)

    "download_data" options:

        "table": a download is requested in table-view mode. (default)

        "numbers": a download is requested in numbers-view mode.

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
            numbers_view_queries.QUERY_NUMBERS_DOWNLOAD,
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
            numbers_view_queries.QUERY_CATEGORIES_PER_LANGUAGE,
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
