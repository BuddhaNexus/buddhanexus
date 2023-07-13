from fastapi import APIRouter, Query
from .endpoint_utils import execute_query
from ..queries import main_queries, menu_queries
from ..utils import get_language_from_filename
from typing import List
import re

router = APIRouter()

COLLECTION_PATTERN = r"^(pli-tv-b[ui]-vb|XX|OT|NG|[A-Z]+[0-9]+|[a-z\-]+)"


@router.get("/graph-view/")
# pylint: disable=too-many-locals
async def get_graph_for_file(
    file_name: str,
    score: int = 0,
    par_length: int = 0,
    target_collection: List[str] = Query([]),
):
    """
    Endpoint for graph view
    """

    query_graph_result = execute_query(
        main_queries.QUERY_GRAPH_VIEW,
        bind_vars={
            "filename": file_name,
            "score": score,
            "parlength": par_length,
            "targetcollection": target_collection,
        },
    )

    collection_keys = []
    total_collection_dict = {}
    total_histogram_dict = {}

    # extract a dictionary of collection numbers and number of parallels for each
    for parallel in query_graph_result.result:
        count_this_parallel = parallel["parlength"]
        target_filename = re.sub("_[0-9][0-9][0-9]", "", parallel["textname"])
        if target_filename in total_histogram_dict:
            total_histogram_dict[target_filename] += count_this_parallel
        else:
            total_histogram_dict[target_filename] = count_this_parallel

        collection_key = re.search(COLLECTION_PATTERN, target_filename)

        if not collection_key:
            continue

        collection = collection_key.group()
        if collection not in total_collection_dict:
            total_collection_dict[collection] = count_this_parallel
        else:
            total_collection_dict[collection] += count_this_parallel
        if collection not in collection_keys:
            collection_keys.append(collection)

    # find the proper full names vor each collection
    collections = execute_query(
        menu_queries.QUERY_COLLECTION_NAMES,
        bind_vars={
            "collections": collection_keys,
            "language": get_language_from_filename(file_name),
        },
    )
    collections_with_full_name = {}
    for collection_result in collections.result[0]:
        collections_with_full_name.update(collection_result)

    parallel_graph_name_list = {}
    for key, value in total_collection_dict.items():
        parallel_graph_name_list.update(
            {key + " " + collections_with_full_name[key]: value}
        )

    unsorted_graphdata_list = list(map(list, parallel_graph_name_list.items()))

    histogram_data = []
    for name, count in total_histogram_dict.items():
        displayname = name
        query_displayname = execute_query(
            main_queries.QUERY_DISPLAYNAME,
            bind_vars={"filename": name},
            raw_results=True,
        )
        displayname_results = query_displayname.result
        if displayname_results:
            displayname = (
                displayname_results[0][0] + " (" + displayname_results[0][1] + ")"
            )

        histogram_data.append([displayname, count])

    # returns a list of the data as needed by Google Graphs
    return {
        "piegraphdata": sorted(
            unsorted_graphdata_list, reverse=True, key=lambda x: x[1]
        ),
        "histogramgraphdata": sorted(histogram_data, reverse=True, key=lambda x: x[1]),
    }
