from fastapi import APIRouter, Query
from .endpoint_utils import execute_query
from ..queries import main_queries
from ..links import get_links

router = APIRouter()


@router.get("/external/")
async def get_external_links(file_name: str = Query(...), 
                             segmentnr: str = Query(None)):
    """
    Returns the external links for a given file_name or segmentnr.
    """    
    if segmentnr is not None:
        file_name = segmentnr.split(":")[0]
    query_links = execute_query(
        main_queries.QUERY_LINK, bind_vars={"file_name": file_name}, raw_results=True
    )
    return get_links(file_name, query_links)
