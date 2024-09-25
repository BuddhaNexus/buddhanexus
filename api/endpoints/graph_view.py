from fastapi import APIRouter, Query
from .endpoint_utils import execute_query
from ..queries import graph_view_queries, menu_queries, utils_queries
from ..utils import (
    get_language_from_filename,
    get_cat_from_segmentnr,
)
import re
from typing import Any
from .models.graph_view_models import *

router = APIRouter()


@router.post("/graph-view/", response_model=GraphViewOutput)
async def get_graph_for_file(input: GraphInput) -> Any:
    """
    Endpoint for graph view.

    Input fields are:

    ```
        {
          "file_name": "",
          "score": 0,
          "par_length": 0,
          "target_collection": []
        }
    ```

    The "target_collection" input comes from a dropdown list that lists collections only.
    This comes from the `/menus/graphcollections/` endpoint. It is possible to choose
    more than one option, hence it is a list. F.i.

    ```
        ...
        "target_collection": ["pli_Suttas-Early-1", "pli_Vinaya"]
    ```

    "score", "par_length" and "file_name" are the same as for the other views.

    Output is f.i.:

    ```
        {
          "piegraphdata": [
            [
              "dn Dīghanikāya",
              "62063"
            ],
            [
              "mn Majjhimanikāya",
              "54783"
            ],
            [
              "an Aṅguttaranikāya",
              "24871"
            ],

            ...

            ]
          ],
          "histogramgraphdata": [
            [
              "Kūṭadanta Sutta (Dn 5)",
              "36982"
            ],
            [
              "Caṅkī Sutta (Mn 95)",
              "19661"
            ],
            [
              "Bhesajjakkhandhaka (Pli-tv-kd 6)",
              "7773"
            ],
            etc.
    ```
    """
    # todo sep/25: Here we should get explitiely the names of the target collections from the frontend, there should be no need to call any additional function
    #target_collection = create_cleaned_limit_collection(input.target_collection)

    query_graph_result = execute_query(
        graph_view_queries.QUERY_GRAPH_VIEW,
        bind_vars={
            "file_name": input.file_name,
            "score": input.score,
            "parlength": input.par_length,
            "targetcollection": target_collection,
        },
    )

    collection_keys = []
    total_collection_dict = {}
    total_histogram_dict = {}

    # extract a dictionary of collection numbers and number of parallels for each
    for parallel in query_graph_result.result:
        count_this_parallel = parallel["parlength"]
        target_file_name = re.sub("_[0-9][0-9][0-9]", "", parallel["textname"])
        if target_file_name in total_histogram_dict:
            total_histogram_dict[target_file_name] += count_this_parallel
        else:
            total_histogram_dict[target_file_name] = count_this_parallel

        collection_key = get_cat_from_segmentnr(target_file_name)

        if not collection_key:
            continue

        collection = collection_key
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
            "language": get_language_from_filename(input.file_name),
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
            utils_queries.QUERY_DISPLAYNAME,
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
        "histogramgraphdata": sorted(histogram_data, reverse=True, key=lambda x: x[1])[
            0:50
        ],
    }
