from fastapi import APIRouter, Query
from typing import Any
from .endpoint_utils import execute_query
from ..queries import menu_queries
import unidecode
from .models.menus_models import *

router = APIRouter()


def add_searchfield(results):
    for result in results:
        result["search_field"] = (
            result["displayName"]
            + " "
            + unidecode.unidecode(result["displayName"]).lower()
            + " "
            + result["textname"]
        )
    return results


@router.get("/files/", response_model=FilesOutput)
async def get_files_for_menu(
    language: str = Query(..., description="language to be used")
) -> Any:
    """
    Endpoint that returns list of file IDs in a given language or
    all files available in multilang if the language is multi.
    """
    if language == "multi":
        menu_query = menu_queries.QUERY_FILES_FOR_MULTILANG
        bind_vars = {}
    else:
        menu_query = menu_queries.QUERY_FILES_FOR_LANGUAGE
        bind_vars = {"language": language}
    query_result = execute_query(menu_query, bind_vars)
    query_result = add_searchfield(query_result.result)
    return {"results": query_result}


@router.get("/filter/", response_model=FilterOutput)
async def get_files_for_filter_menu(
    language: str = Query(..., description="language to be used")
) -> Any:
    """
    Given a language, return list of files for the category menu
    """
    query_result = execute_query(
        menu_queries.QUERY_FILES_FOR_CATEGORY, {"language": language}
    )
    return {"filteritems": query_result.result}


@router.get("/category/", response_model=CategoryOutput)
async def get_categories_for_filter_menu(
    language: str = Query(..., description="language to be used")
) -> Any:
    """
    Given a language, return list of categories for the filter menu
    in text view, table view and numbers view.

    Input is the language string like "pli".
    Output is:

    ```
        {
          "categoryitems": [
            {
              "category": "pli_Suttas-Early-1",
              "categoryname": "SUTTAS-EARLY-1 (ALL)"
            },
            {
              "category": "dn",
              "categoryname": "• Dīghanikāya (DN)"
            },
            {
              "category": "mn",
              "categoryname": "• Majjhimanikāya (MN)"
            },
            etc.
    ```

    Where "category" is the value that needs to be returns to the backend once
    selected and "categoryname" is what displays in the dropdown menu:

    ```
        SUTTAS-EARLY-1 (ALL)
        • Dīghanikāya (DN)
        • Majjhimanikāya (MN)
        etc.

    ```
    """
    query_result = execute_query(
        menu_queries.QUERY_CATEGORIES_FOR_LANGUAGE,
        {"language": language},
    )

    return {"categoryitems": query_result.result[0]}


@router.get("/collections/", response_model=CollectionsOutput)
async def get_all_collections() -> Any:
    """
    Returns list of all available collections.
    """
    collections_query_result = execute_query(menu_queries.QUERY_ALL_COLLECTIONS)
    return {"result": collections_query_result.result}


@router.get("/sidebar/", response_model=SideBarOutput)
async def get_data_for_sidebar_menu(
    language: str = Query(..., description="language to be used")
) -> Any:
    """
    Endpoint for sidebar menu
    """
    if language == "multi":
        menu_query = menu_queries.QUERY_FILES_FOR_MULTILANG
        current_bind_vars = {}
    else:
        menu_query = menu_queries.QUERY_TOTAL_MENU
        current_bind_vars = {"language": language}

    query_sidebar_menu = execute_query(menu_query, current_bind_vars)
    return {"navigationmenudata": query_sidebar_menu.result}


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
