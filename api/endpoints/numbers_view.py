from fastapi import APIRouter, Query
from typing import Any
from ..utils import (
    shorten_segment_names,
)
from shared.utils import get_language_from_filename
from .endpoint_utils import execute_query
from ..queries import numbers_view_queries
from .models.general_models import GeneralInput
from .models.numbers_view_models import MenuOutput, NumbersViewOutput
from ..cache_config import cached_endpoint, CACHE_TIMES

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
                if parallel:
                    parallel_dic = {}
                    parallel_dic["segmentnr"] = shorten_segment_names(
                        parallel["par_segnr"]
                    )
                    parallel_dic["displayName"] = parallel["displayName"]
                    parallel_dic["fileName"] = parallel["fileName"]
                    parallel_dic["category"] = parallel["category"]
                    parallels_list.append(parallel_dic)

            if parallels_list:
                result_list.append(
                    {"segmentnr": result["segmentnr"], "parallels": parallels_list}
                )

    return result_list


@router.post("/numbers/", response_model=NumbersViewOutput)
@cached_endpoint(expire=CACHE_TIMES["LONG"])
async def get_numbers_view(input: GeneralInput) -> Any:
    """
    Endpoint for numbers view.
    """

    query_result = execute_query(
        numbers_view_queries.QUERY_NUMBERS_VIEW,
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
            "page": input.page,
            "folio": input.folio,
        },
    )

    segments_result = create_numbers_view_data(query_result.result)

    return segments_result


@router.get("/categories/", response_model=MenuOutput)
@cached_endpoint(expire=CACHE_TIMES["LONG"])
async def get_categories_for_numbers_view(
    filename: str = Query(..., description="Filename to be used")
) -> Any:
    """
    Endpoint that returns list of categories for the given language
    """
    language = get_language_from_filename(filename)
    query_result = execute_query(
        numbers_view_queries.QUERY_CATEGORIES_PER_LANGUAGE,
        bind_vars={"language": language},
    )
    return query_result.result
