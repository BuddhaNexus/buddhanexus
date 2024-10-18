from fastapi import APIRouter, Query
from typing import Any
from .endpoint_utils import execute_query
from ..queries import menu_queries
from .helpers.menu_helpers import structure_menu_data

from .models.menus_models import MetadataOutput

router = APIRouter()


@router.get("/metadata/", response_model=MetadataOutput)
async def get_data_for_sidebar_menu(
    language: str = Query(..., description="language to be used")
) -> Any:
    """
    Endpoint for Metadata, formerly known as the sidebar menu.
    """
    menu_query = menu_queries.QUERY_TOTAL_DATA
    current_bind_vars = {"lang": language}

    query_sidebar_menu = execute_query(menu_query, current_bind_vars)
    structured_menu_data = structure_menu_data(query_sidebar_menu.result)
    return {"metadata": structured_menu_data}
