from fastapi import APIRouter, Query
from .endpoint_utils  import execute_query
from ..queries import main_queries
from ..utils import create_cleaned_limit_collection
from ..search import search_utils
from .models.shared import CountMatchesInput

router = APIRouter()


@router.get("/count-matches/")
async def get_counts_for_file(input: CountMatchesInput):
    
    """
    Returns number of filtered parallels
    """
    limitcollection_positive = create_cleaned_limit_collection(input.limits.collection_positive + input.limits.file_positive)
    limitcollection_negative = create_cleaned_limit_collection(input.limits.collection_negative + input.limits.file_negative)

    query_graph_result = execute_query(
        main_queries.QUERY_COUNT_MATCHES,
        bind_vars={
            "filename": input.file_name,
            "score": input.score,
            "parlength": input.par_length,
            "limitcollection_positive": limitcollection_positive,
            "limitcollection_negative": limitcollection_negative,
        },
    )
    return {"parallel_count": query_graph_result.result[0]}


@router.get("/folios/")
async def get_folios_for_file(file_name: str = Query(..., description="File name of the text for which folios should be fetched."),
                              ):
    """
    Returns number of folios (TIB) / facsimiles (CHN) /
    suttas/PTS nrs/segments (PLI) / segments (SKT)
    """
    query_graph_result = execute_query(
        main_queries.QUERY_FOLIOS,
        bind_vars={"filename": file_name},
    )
    folios = query_graph_result.result[0]
    return {"folios": folios}


@router.get("/sanskrittagger/")
async def tag_sanskrit(sanskrit_string: str = Query(..., description="Sanskrit string to be tagged.")):
    """
    Stemming + Tagging for Sanskrit
    :return: String with tagged Sanskrit
    """
    result = search_utils.tag_sanskrit(sanskrit_string).replace("\n", " # ")
    return {"tagged": result}


@router.get("/available-languages/")
async def get_multilingual(filename: str = Query(..., description="File name of the text for which the available languages should be fetched.")):
    """
    Returns a list of the available languages of matches for the given file.
    """
    query_result = {"langList": []}
    query_displayname = execute_query(
        main_queries.QUERY_MULTILINGUAL_LANGS,
        bind_vars={"filename": filename},
        raw_results=True,
    )
    query_result = {"langList": query_displayname.result[0]}
    return query_result
