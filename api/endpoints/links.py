from fastapi import APIRouter
from .endpoint_utils  import execute_query
from ..queries import main_queries
from ..links import get_links

router = APIRouter()

@router.get("/external/")
async def get_external_links(file_name: str = "", 
                             segmentnr: str = ""):
    """
    Returns the external links for a given filename or segmentnr.
    """
    if len(segmentnr) > 0:
        file_name = segmentnr.split(":")[0]    
    query_links = execute_query(main_queries.QUERY_LINK, bind_vars={"filename": file_name}, raw_results=True)
    return get_links(file_name, query_links)

