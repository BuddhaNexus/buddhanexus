from fastapi import APIRouter
from .endpoint_utils import execute_query
from ..queries import graph_view_queries
from typing import Any
from .models.graph_view_models import *

router = APIRouter()


@router.post("/graph-view/", response_model=GraphViewOutput)
async def get_graph_for_file(input: GraphInput) -> Any:
    """
    Endpoint for graph view.

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
            "score": input.filters.score,
            "parlength": input.filters.par_length,
            "filter_include_collections": input.filters.include_collections,
        },
    )

    return query_graph_result.result[0]
