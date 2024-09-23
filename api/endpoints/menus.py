from fastapi import APIRouter, Query
from typing import Any
from .endpoint_utils import execute_query
from ..queries import menu_queries
from .helpers.menu_helpers import structure_menu_data, add_searchfield
import unidecode
from .models.menus_models import (
    FilesOutput,
    CollectionsOutput,
    GraphCollectionOutput,
    SideBarOutput,
)

router = APIRouter()


@router.get("/files/", response_model=FilesOutput)
async def get_files_for_menu(
    language: str = Query(..., description="language to be used")
) -> Any:
    """
    Endpoint that returns list of file IDs in a given language or
    all files available in multilang if the language is multi.
    """
    menu_query = menu_queries.QUERY_FILES_FOR_LANGUAGE
    bind_vars = {"language": language}
    query_result = execute_query(menu_query, bind_vars)
    query_result = add_searchfield(query_result.result)
    return {"results": query_result}

@router.get("/collections/", response_model=CollectionsOutput)
async def get_all_collections() -> Any:
    """
    Returns list of all available collections.
    """
    collections_query_result = execute_query(menu_queries.QUERY_ALL_COLLECTIONS)
    print(collections_query_result.result)
    return {"result": collections_query_result.result}


@router.get("/sidebar/", response_model=SideBarOutput)
async def get_data_for_sidebar_menu(
    language: str = Query(..., description="language to be used")
) -> Any:
    """
    Endpoint for sidebar menu
    """
    menu_query = menu_queries.QUERY_TOTAL_DATA
    current_bind_vars = {"lang": language}

    query_sidebar_menu = execute_query(menu_query, current_bind_vars)
    print(query_sidebar_menu.result)
    structured_menu_data = structure_menu_data(query_sidebar_menu.result)
    return {"navigationmenudata": structured_menu_data}


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
