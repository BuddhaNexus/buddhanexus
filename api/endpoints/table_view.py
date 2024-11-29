from fastapi import APIRouter
from typing import Any
from ..colormaps import calculate_color_maps_table_view
from ..utils import get_sort_key
from .endpoint_utils import execute_query
from ..queries import table_view_queries
from .models.general_models import GeneralInput
from .models.table_view_models import *
from ..cache_config import cached_endpoint, CACHE_TIMES

router = APIRouter()


@router.post("/table/", response_model=TableViewOutput)
@cached_endpoint(expire=CACHE_TIMES["LONG"])
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
