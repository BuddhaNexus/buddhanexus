from fastapi import APIRouter, Query
from typing import Any
from .endpoint_utils import execute_query
from ..queries import menu_queries
from .helpers.menu_helpers import structure_menu_data
from time import time
from .models.menu_models import MenudataOutput
from fastapi_cache.decorator import cache
from ..cache_config import cached_endpoint, CACHE_TIMES

router = APIRouter()


@router.get("/menudata/", response_model=MenudataOutput)
@cached_endpoint(expire=CACHE_TIMES["LONG"])
async def get_data_for_sidebar_menu(
    language: str = Query(..., description="language to be used")
) -> Any:
    """
    Endpoint for Menudata, formerly known as the sidebar menu.
    """
    start_time = time()
    menu_query = menu_queries.QUERY_TOTAL_DATA
    current_bind_vars = {"lang": language}

    query_sidebar_menu = execute_query(menu_query, current_bind_vars)
    print(f"Time taken to execute query: {time() - start_time} seconds")
    structured_menu_data = structure_menu_data(query_sidebar_menu.result)
    print(f"Time taken to structure menu data: {time() - start_time} seconds")
    return {"menudata": structured_menu_data}
