from fastapi import APIRouter, Query
from typing import Any
from .endpoint_utils import execute_query
from ..queries import menu_queries
from .helpers.menu_helpers import structure_menu_data

from .models.menus_models import (
    GraphCollectionOutput,
    MetadataOutput
)
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
    print(query_sidebar_menu.result)
    structured_menu_data = structure_menu_data(query_sidebar_menu.result)
    return {"metadata": structured_menu_data}


@router.get("/graphcollections/", response_model=GraphCollectionOutput)
async def get_categories_for_filter_menu(
    language: str = Query(..., description="language to be used")
) -> Any:
    """
    Given a language, return list of collections for the filter menu
    of graph view and the input menus of the visual view.

    Input is the language string like "pli".
    Output is:

    ```
        {
          "result": [
            {
              "collection": "pli_Suttas-Early-1",
              "collectiondisplayname": "Suttas-Early-1"
            },
            {
              "collection": "pli_Suttas-Early-2",
              "collectiondisplayname": "Suttas-Early-2"
            },
            etc.
    ```

    Where "collection" is the value that needs to be returns to the backend once
    selected and "collectiondisplayname" is what displays in the dropdown menu:

    ```
        Suttas-Early-1
        Suttas-Early-2
        Suttas-Late-1
        etc.

    ```
    """
    query_result = execute_query(
        menu_queries.QUERY_COLLECTIONS_FOR_LANGUAGE, bind_vars={"language": language}
    )
    return {"result": query_result.result[0]}
