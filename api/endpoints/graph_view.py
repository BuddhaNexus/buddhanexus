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
          "filename": "",
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
        "target_collection": ["Suttas-Early-1", "Vinaya"]
    ```

    "score", "par_length" and "filename" are the same as for the other views.

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

    If the histogramgraphdata is null, it means that the dataset is too large to display the histogram.
    Please display a message asking the user to use the filters to reduce the dataset size.
    """

    query_graph_result = execute_query(
        graph_view_queries.QUERY_GRAPH_VIEW,
        bind_vars={
            "filename": input.filename,
            "score": input.score,
            "parlength": input.par_length,
            "targetcollection": input.target_collection,
        },
    )

    return query_graph_result.result[0]
