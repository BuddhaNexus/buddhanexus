from fastapi import APIRouter, Query
from typing import Any
from .endpoint_utils import execute_query
from ..queries import utils_queries
from ..utils import create_cleaned_limit_collection
from ..search import search_utils
from .models.utils_models import *

router = APIRouter()


@router.post("/count-matches/", response_model=CountMatchesOutput)
async def get_counts_for_file(input: CountMatchesInput) -> Any:

    """
    Returns number of filtered parallels
    """
    limitcollection_include = create_cleaned_limit_collection(
        input.limits.category_include + input.limits.file_include
    )
    limitcollection_exclude = create_cleaned_limit_collection(
        input.limits.category_exclude + input.limits.file_exclude
    )

    query_graph_result = execute_query(
        utils_queries.QUERY_COUNT_MATCHES,
        bind_vars={
            "file_name": input.file_name,
            "score": input.score,
            "parlength": input.par_length,
            "limitcollection_include": limitcollection_include,
            "limitcollection_exclude": limitcollection_exclude,
        },
    )
    return {"parallel_count": query_graph_result.result[0]}


@router.get("/folios/", response_model=FolioOutput)
async def get_folios_for_file(
    file_name: str = Query(
        ..., description="File name of the text for which folios should be fetched."
    ),
) -> Any:
    """
    Returns number of folios (TIB) / facsimiles (CHN) /
    suttas/PTS nrs/segments (PLI) / segments (SKT)
    """
    query_graph_result = execute_query(
        utils_queries.QUERY_FOLIOS,
        bind_vars={"file_name": file_name},
    )
    folios = query_graph_result.result[0]
    return {"folios": folios}


def get_displayname(segmentnr):

    """
    Downloads the displaynames for the worksheet
    """
    file_name = segmentnr.split(":")[0]
    query_graph_result = execute_query(
        utils_queries.QUERY_DISPLAYNAME,
        bind_vars={"filename": file_name},
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


"""
Tagger is not used on the new site?
"""


@router.get("/sanskrittagger/")
async def tag_sanskrit(
    sanskrit_string: str = Query(..., description="Sanskrit string to be tagged.")
):
    """
    IS THIS FUNCTION BEING USED?
    Stemming + Tagging for Sanskrit
    :return: String with tagged Sanskrit
    """
    result = search_utils.tag_sanskrit(sanskrit_string).replace("\n", " # ")
    return {"tagged": result}


@router.get("/available-languages/", response_model=LanguageOutput)
async def get_multilingual(
    file_name: str = Query(
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
        bind_vars={"file_name": file_name},
        raw_results=True,
    )
    query_result = {"langList": query_displayname.result[0]}
    return query_result
