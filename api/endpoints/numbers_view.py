from fastapi import APIRouter, Query
import re
from typing import Any
from ..utils import (
    get_language_from_filename,
    shorten_segment_names,
)
from .endpoint_utils import execute_query

from ..queries import table_view_queries, menu_queries

from .models.general_models import GeneralInput
from .models.numbers_view_models import MenuOutput, NumbersViewOutput

router = APIRouter()


def create_numbers_view_data(table_results):
    """
    This function converts the table-view output into a format
    that is usable for the numbers-view.
    """
    result_list = []
    for result in table_results[0]:
        parallels_list = []
        if result["parallels"]:
            for parallel in result["parallels"]:
                if parallel["par_full_names"]:
                    parallel_dic = {}
                    parallel_dic["segmentnr"] = shorten_segment_names(
                        parallel["par_segnr"]
                    )
                    parallel_dic["displayName"] = parallel["par_full_names"][
                        "displayName"
                    ]
                    parallel_dic["fileName"] = parallel["par_full_names"]["fileName"]
                    parallel_dic["category"] = parallel["par_full_names"]["category"]
                    parallels_list.append(parallel_dic)

            if parallels_list:
                result_list.append(
                    {"segmentnr": result["segmentnr"], "parallels": parallels_list}
                )

    return result_list


@router.post("/numbers/", response_model=NumbersViewOutput)
async def get_numbers_view(input: GeneralInput) -> Any:
    """
    Endpoint for numbers view.
    """

    folio = input.folio
    if not input.folio:
        folio = 0

    query_result = execute_query(
        table_view_queries.QUERY_NUMBERS_VIEW,
        bind_vars={
            "filename": input.filename,
            "score": input.score,
            "parlength": input.par_length,
            "filter_include_files": input.filters.include_files,
            "filter_exclude_files": input.filters.exclude_files,
            "filter_include_categories": input.filters.include_categories,
            "filter_exclude_categories": input.filters.exclude_categories,
            "filter_include_collections": input.filters.include_collections,
            "filter_exclude_collections": input.filters.exclude_collections,
            "page": input.page,
            "folio": folio,
        },
    )

    segments_result = create_numbers_view_data(query_result.result)

    return segments_result


@router.get("/categories/", response_model=MenuOutput)
async def get_categories_for_numbers_view(
    filename: str = Query(..., description="Filename to be used")
) -> Any:
    """
    Endpoint that returns list of categories for the given language
    """
    language = get_language_from_filename(filename)
    query_result = execute_query(
        menu_queries.QUERY_CATEGORIES_PER_LANGUAGE,
        bind_vars={"language": language},
    )
    return query_result.result
