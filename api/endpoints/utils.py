from fastapi import APIRouter, Query
from typing import Any
from .endpoint_utils import execute_query
from ..queries import utils_queries
from ..search import search_utils
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
            "score": input.score,
            "parlength": input.par_length,
            "filter_include_files": filter_include["files"],
            "filter_exclude_files": filter_exclude["files"],
            "filter_include_categories": filter_include["categories"],
            "filter_exclude_categories": filter_exclude["categories"],
            "filter_include_collections": filter_include["collections"],
            "filter_exclude_collections": filter_exclude["collections"],
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
    query_graph_result = execute_query(
        utils_queries.QUERY_FOLIOS,
        bind_vars={"filename": filename},
    )
    print(query_graph_result.result)
    folios = query_graph_result.result
    return {"folios": folios}


def get_displayname(segmentnr):
    """
    Downloads the displaynames for the worksheet
    """
    filename = segmentnr.split(":")[0]
    query_graph_result = execute_query(
        utils_queries.QUERY_DISPLAYNAME,
        bind_vars={"filename": filename},
    )
    displayname = query_graph_result.result[0]
    return displayname


@router.get("/displayname/", response_model=DisplayNameOutput)
async def get_displayname_for_segmentnr(
    segmentnr: str = Query(
        ..., description="Segmentnr for which the displayname should be fetched."
    ),
) -> Any:
    """
    Returns the displayname for a given segmentnr
    """
    return {"displayname": get_displayname(segmentnr)}


@router.get("/available-languages/", response_model=LanguageOutput)
async def get_multilingual(
    filename: str = Query(
        ...,
        description="File name of the text for which the available languages should be fetched.",
    )
) -> Any:
    """
    Returns a list of the available languages of matches for the given file.
    """
    query_result = {"langList": []}
    query_displayname = execute_query(
        utils_queries.QUERY_MULTILINGUAL_LANGS,
        bind_vars={"filename": filename},
        raw_results=True,
    )
    query_result = {"langList": query_displayname.result[0]}
    return query_result
