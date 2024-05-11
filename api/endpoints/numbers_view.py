from fastapi import APIRouter, Query
import re
from typing import Any
from ..utils import (
    get_language_from_file_name,
    create_cleaned_limit_collection,
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
                    )[0]
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

    limitcollection_include = create_cleaned_limit_collection(
        input.limits.category_include + input.limits.file_include
    )
    limitcollection_exclude = create_cleaned_limit_collection(
        input.limits.category_exclude + input.limits.file_exclude
    )

    folio = input.folio
    if not input.folio:
        folio = 0

    query_result = execute_query(
        table_view_queries.QUERY_NUMBERS_VIEW,
        bind_vars={
            "file_name": input.file_name,
            "score": input.score,
            "parlength": input.par_length,
            "limitcollection_include": limitcollection_include,
            "limitcollection_exclude": limitcollection_exclude,
            "page": input.page,
            "folio": folio,
        },
    )

    segments_result = create_numbers_view_data(query_result.result)

    return segments_result


@router.get("/categories/", response_model=MenuOutput)
async def get_categories_for_numbers_view(
    file_name: str = Query(..., description="Filename to be used")
) -> Any:
    """
    Endpoint that returns list of categories for the given language
    """
    language = get_language_from_file_name(file_name)
    query_result = execute_query(
        menu_queries.QUERY_CATEGORIES_PER_LANGUAGE,
        bind_vars={"language": language},
    )
    return query_result.result
