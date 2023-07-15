from fastapi import APIRouter, Query
from .endpoint_utils import execute_query
from ..queries import menu_queries
router = APIRouter()


@router.get("/files/")
async def get_files_for_menu(language: str = Query(..., description="language to be used")):
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
    return {"results": query_result.result}


@router.get("/filter/")
async def get_files_for_filter_menu(language: str = Query(..., description="language to be used")):
    """
    Given a language, return list of files for the category menu
    """
    query_result = execute_query(
        menu_queries.QUERY_FILES_FOR_CATEGORY, {"language": language}
    )
    return {"filteritems": query_result.result}


@router.get("/category/")
async def get_categories_for_filter_menu(language: str = Query(..., description="language to be used")):
    """
    Given a language, return list of categories for the filter menu
    """
    query_result = execute_query(
        menu_queries.QUERY_CATEGORIES_FOR_LANGUAGE,
        {"language": language},
    )

    return {"categoryitems": query_result.result}


@router.get("/collections/")
async def get_all_collections():
    """
    Returns list of all available collections.
    """
    collections_query_result = execute_query(menu_queries.QUERY_ALL_COLLECTIONS)
    return {"result": collections_query_result.result}


@router.get("/sidebar/")
async def get_data_for_sidebar_menu(language: str = Query(..., description="language to be used")):
    """
    Endpoint for sidebar menu
    """

    if input.language == "multi":
        menu_query = menu_queries.QUERY_FILES_FOR_MULTILANG
        current_bind_vars = {}
    else:
        menu_query = menu_queries.QUERY_TOTAL_MENU
        current_bind_vars = {"language": language}

    query_sidebar_menu = execute_query(menu_query, current_bind_vars)
    return {"navigationmenudata": query_sidebar_menu.result}
