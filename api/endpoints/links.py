from fastapi import APIRouter
from .endpoint_utils import execute_query
from ..queries import main_queries
from ..links import get_links
from .models.shared import LinksInput

router = APIRouter()


@router.get("/external/")
async def get_external_links(input: LinksInput):
    """
    Returns the external links for a given filename or segmentnr.
    """
    file_name = input.file_name
    if len(input.segmentnr) > 0:
        file_name = input.segmentnr.split(":")[0]
    query_links = execute_query(
        main_queries.QUERY_LINK, bind_vars={"filename": file_name}, raw_results=True
    )
    return get_links(file_name, query_links)
