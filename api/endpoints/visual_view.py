from fastapi import APIRouter
from .endpoint_utils import execute_query
from ..queries import visual_view_queries
from typing import Any
from .models.visual_view_models import *
from ..cache_config import cached_endpoint, CACHE_TIMES
from ..utils import test_is_collection

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

    if test_is_collection(input.inquiry):
        query_visual_result = execute_query(
            visual_view_queries.QUERY_VISUAL_COLLECTION_VIEW,
            bind_vars={
                "inquiry_collection": input.inquiry,
                "hit_collection": input.hit,
                "lang": input.language,
            },
        )

    else:
        query_visual_result = execute_query(
            visual_view_queries.QUERY_VISUAL_CATEGORY_VIEW,
            bind_vars={
                "inquiry_collection": input.inquiry,
                "hit_collection": input.hit,
                "lang": input.language,
            },
        )

    return {"graphdata": query_visual_result.result}
