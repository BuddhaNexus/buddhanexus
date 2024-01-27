from fastapi import APIRouter, Query
from .endpoint_utils import execute_query
from ..queries import main_queries
from ..utils import create_cleaned_limit_collection
from ..search import search_utils
from .models.shared import CountMatchesInput

router = APIRouter()


@router.post("/count-matches/")
async def get_counts_for_file(input: CountMatchesInput):

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
        main_queries.QUERY_COUNT_MATCHES,
        bind_vars={
            "file_name": input.file_name,
            "score": input.score,
            "parlength": input.par_length,
            "limitcollection_include": limitcollection_include,
            "limitcollection_exclude": limitcollection_exclude,
        },
    )
    return {"parallel_count": query_graph_result.result[0]}


@router.get("/folios/")
async def get_folios_for_file(
    file_name: str = Query(
        ..., description="File name of the text for which folios should be fetched."
    ),
):
    """
    Returns number of folios (TIB) / facsimiles (CHN) /
    suttas/PTS nrs/segments (PLI) / segments (SKT)
    """
    query_graph_result = execute_query(
        main_queries.QUERY_FOLIOS,
        bind_vars={"file_name": file_name},
    )
    print(query_graph_result.result)
    folios = query_graph_result.result[0]
    return {"folios": folios}


@router.get("/sanskrittagger/")
async def tag_sanskrit(
    sanskrit_string: str = Query(..., description="Sanskrit string to be tagged.")
):
    """
    Stemming + Tagging for Sanskrit
    :return: String with tagged Sanskrit
    """
    result = search_utils.tag_sanskrit(sanskrit_string).replace("\n", " # ")
    return {"tagged": result}


@router.get("/available-languages/")
async def get_multilingual(
    file_name: str = Query(
        ...,
        description="File name of the text for which the available languages should be fetched.",
    )
):
    """
    Returns a list of the available languages of matches for the given file.
    """
    query_result = {"langList": []}
    query_displayname = execute_query(
        main_queries.QUERY_MULTILINGUAL_LANGS,
        bind_vars={"file_name": file_name},
        raw_results=True,
    )
    query_result = {"langList": query_displayname.result[0]}
    return query_result
