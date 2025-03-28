from fastapi import APIRouter, Query
from typing import Any
from .endpoint_utils import execute_query
from ..queries import menu_queries
from .helpers.menu_helpers import structure_menu_data
from .models.menu_models import MenudataOutput
from ..cache_config import cached_endpoint, CACHE_TIMES
import logging

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("/menudata/", response_model=MenudataOutput)
@cached_endpoint(expire=CACHE_TIMES["LONG"])
async def get_data_for_sidebar_menu(
    language: str = Query(..., description="language to be used")
) -> MenudataOutput:
    """Endpoint for Menudata, formerly known as the sidebar menu."""
    try:
        menu_query = menu_queries.QUERY_TOTAL_DATA
        current_bind_vars = {"lang": language}

        query_result = execute_query(menu_query, current_bind_vars)
        structured_menu_data = structure_menu_data(query_result.result, language)

        return MenudataOutput(menudata=structured_menu_data)
    except Exception as e:
        logger.error(f"Error in get_data_for_sidebar_menu: {str(e)}")
        raise
