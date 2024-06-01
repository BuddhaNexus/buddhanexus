from fastapi import APIRouter, Query
from typing import Any
from .endpoint_utils import execute_query
from ..queries import utils_queries
from ..links import get_links
from .models.links_models import LinksOutput

router = APIRouter()


@router.get("/external/", response_model=LinksOutput)
async def get_external_links(
    file_name: str = Query(...), segmentnr: str = Query(None)
) -> Any:
    """
    Returns the external links for a given file_name or segmentnr.
    """
    if segmentnr is not None:
        file_name = segmentnr.split(":")[0]
    query_links = execute_query(
        utils_queries.QUERY_LINK, bind_vars={"file_name": file_name}, raw_results=True
    )
    return get_links(file_name, query_links)
