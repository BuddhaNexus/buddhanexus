from fastapi import APIRouter
from .endpoint_utils import execute_query
from ..queries import visual_view_queries
from typing import Any
from .models.visual_view_models import *
from ..cache_config import cached_endpoint, CACHE_TIMES

router = APIRouter()


@router.post("/visual-view/", response_model=VisualViewOutput)
@cached_endpoint(expire=CACHE_TIMES["LONG"])
async def get_visual_graph_data(input: VisualViewInput) -> Any:
    """
    Endpoint for visual view.

    Output is f.i.:

    ```
    "graphdata": [
            [
              "Khuddakapāṭha (kp)",
              "Dīghanikāya_(dn)",
              1094
            ],
            [
              "Khuddakapāṭha (kp)",
              "Majjhimanikāya_(mn)"
              5042
            ],

            ...

            ]
          ]
    ```

    """

    query_visual_result = execute_query(
        graph_view_queries.QUERY_VISUAL_VIEW,
        bind_vars={
            "inquiry": input.inquiry,
            "hit": input.hit,
        },
    )

    return query_visual_result.result[0]
