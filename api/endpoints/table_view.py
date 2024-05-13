from fastapi import APIRouter
from ..colormaps import calculate_color_maps_table_view
from ..utils import (
    create_cleaned_limit_collection,
    get_sort_key,
    get_language_from_file_name,
)
from typing import Any
from .endpoint_utils import execute_query
from ..queries import table_view_queries, menu_queries
from ..table_download import run_table_download, run_numbers_download
from .models.general_models import GeneralInput
from .models.table_view_models import *
from .numbers_view import create_numbers_view_data

router = APIRouter()


@router.post("/table/", response_model=TableViewOutput)
async def get_table_view(input: GeneralInput) -> Any:
    """
    Endpoint for the table view. Accepts filters.
    :return: List of segments and parallels for the table view.
    """
    limitcollection_include = create_cleaned_limit_collection(
        input.limits.category_include + input.limits.file_include
    )
    limitcollection_exclude = create_cleaned_limit_collection(
        input.limits.category_exclude + input.limits.file_exclude
    )

    sortkey = get_sort_key(input.sort_method)
    query_result = execute_query(
        table_view_queries.QUERY_TABLE_VIEW,
        bind_vars={
            "file_name": input.file_name,
            "score": input.score,
            "parlength": input.par_length,
            "sortkey": sortkey,
            "limitcollection_include": limitcollection_include,
            "limitcollection_exclude": limitcollection_exclude,
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
    """
    language = get_language_from_file_name(input.file_name)
    limitcollection_include = create_cleaned_limit_collection(
        input.limits.category_include + input.limits.file_include
    )
    limitcollection_exclude = create_cleaned_limit_collection(
        input.limits.category_exclude + input.limits.file_exclude
    )

    if input.download_data == "table":
        query_result = execute_query(
            table_view_queries.QUERY_TABLE_DOWNLOAD,
            bind_vars={
                "file_name": input.file_name,
                "score": input.score,
                "parlength": input.par_length,
                "sortkey": get_sort_key(input.sort_method),
                "limitcollection_include": limitcollection_include,
                "limitcollection_exclude": limitcollection_exclude,
                "folio": input.folio,
            },
        )

        return run_table_download(
            query_result,
            [
                input.file_name,
                input.score,
                input.par_length,
                input.sort_method,
                input.limits,
                input.folio,
                language,
            ],
        )

    else:
        query_result = execute_query(
            table_view_queries.QUERY_NUMBERS_DOWNLOAD,
            bind_vars={
                "file_name": input.file_name,
                "score": input.score,
                "parlength": input.par_length,
                "limitcollection_include": limitcollection_include,
                "limitcollection_exclude": limitcollection_exclude,
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
                input.file_name,
                input.score,
                input.par_length,
                input.sort_method,
                input.limits,
                "All",
                language,
            ],
        )

    return

#  The below function doesn't seem to be used any more!

# @router.post("/multilang/", response_model=TableViewOutput)
# async def get_multilang(input: MultiLangInput) -> Any:
#     """
#     Endpoint for the multilingual table view. Accepts Parallel languages
#     :return: List of segments and parallels for the table view.
#     """
#     query_result = execute_query(
#         table_view_queries.QUERY_MULTILINGUAL,
#         bind_vars={
#             "file_name": input.file_name,
#             "multi_lingual": input.multi_lingual,
#             "page": input.page,
#             "score": input.score,
#             "folio": input.folio,
#         },
#     )
#     return query_result.result
