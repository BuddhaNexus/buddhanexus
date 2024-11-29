from fastapi import APIRouter, Query, Response
from typing import Any
from .endpoint_utils import execute_query
from ..queries import menu_queries
from .helpers.menu_helpers import structure_menu_data
from time import time
from .models.menu_models import MenudataOutput
from ..cache_config import cached_endpoint, CACHE_TIMES
from ..cache_debug import debug_cache
import logging

# Configure logging
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

# Add a stream handler if not already present
if not logger.handlers:
    handler = logging.StreamHandler()
    handler.setFormatter(logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s'))
    logger.addHandler(handler)

router = APIRouter()

@router.get("/menudata/", response_model=MenudataOutput)
@cached_endpoint(expire=CACHE_TIMES["LONG"])
@debug_cache
async def get_data_for_sidebar_menu(
    language: str = Query(..., description="language to be used")
) -> MenudataOutput:
    """Endpoint for Menudata, formerly known as the sidebar menu."""
    logger.info("=" * 50)
    logger.info(f"CACHE MISS - Fetching fresh menu data for language: {language}")
    
    logger.info("=" * 50)
    
    try:
        start_time = time()
        menu_query = menu_queries.QUERY_TOTAL_DATA
        current_bind_vars = {"lang": language}

        query_sidebar_menu = execute_query(menu_query, current_bind_vars)
        logger.info(f"Time taken to execute query: {time() - start_time:.2f} seconds")
        
        structured_menu_data = structure_menu_data(query_sidebar_menu.result)
        logger.info(f"Total time taken: {time() - start_time:.2f} seconds")
        
        return MenudataOutput(menudata=structured_menu_data)
    except Exception as e:
        logger.error(f"Error in get_data_for_sidebar_menu: {str(e)}")
        raise
