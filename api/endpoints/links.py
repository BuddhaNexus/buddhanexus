from fastapi import APIRouter, Query
from typing import Any
from .endpoint_utils import execute_query
from ..queries import utils_queries
from ..links import get_links
from .models.links_models import LinksOutput

router = APIRouter()


@router.get("/external/", response_model=LinksOutput)
async def get_external_links(filename: str = Query(...)) -> Any:
    """
    Returns the external links for a given filename or segmentnr.
    """
    query_links = execute_query(
        utils_queries.QUERY_LINK, bind_vars={"filename": filename}, raw_results=True
    )
    return get_links(filename, query_links)
