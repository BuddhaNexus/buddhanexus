from fastapi import APIRouter, Query
from typing import Any
from .endpoint_utils import execute_query
from ..queries import utils_queries
from .models.utils_models import *

router = APIRouter()


@router.post("/count-matches/", response_model=CountMatchesOutput)
async def get_counts_for_file(input: CountMatchesInput) -> Any:
    """
    Returns number of filtered parallels
    """

    query_graph_result = execute_query(
        utils_queries.QUERY_COUNT_MATCHES,
        bind_vars={
            "filename": input.filename,
            "score": input.filters.score,
            "parlength": input.filters.par_length,
            "filter_include_files": input.filters.include_files,
            "filter_exclude_files": input.filters.exclude_files,
            "filter_include_categories": input.filters.include_categories,
            "filter_exclude_categories": input.filters.exclude_categories,
            "filter_include_collections": input.filters.include_collections,
            "filter_exclude_collections": input.filters.exclude_collections,
        },
    )
    return {"parallel_count": query_graph_result.result[0]}


@router.get("/folios/", response_model=FolioOutput)
async def get_folios_for_file(
    filename: str = Query(
        ..., description="File name of the text for which folios should be fetched."
    ),
) -> Any:
    """
    Returns number of folios (TIB) / facsimiles (CHN) /
    suttas/PTS nrs/segments (PLI) / segments (SKT)
    """
    query_result = execute_query(
        utils_queries.QUERY_FOLIOS,
        bind_vars={"filename": filename},
    )
    return {"folios": query_result.result[0]}


def get_displayname(segmentnr):
    """
    Downloads the displaynames for the worksheet
    """
    filename = segmentnr.split(":")[0]
    query_result = execute_query(
        utils_queries.QUERY_DISPLAYNAME,
        bind_vars={"filename": filename},
    )
    return query_result.result[0]


@router.get("/displayname/", response_model=DisplayNameOutput)
async def get_displayname_for_segmentnr(
    segmentnr: str = Query(
        ..., description="Segmentnr for which the displayname should be fetched."
    ),
) -> Any:
    """
    Returns the displayname for a given segmentnr or filename
    """
    return {"displayname": get_displayname(segmentnr)}
