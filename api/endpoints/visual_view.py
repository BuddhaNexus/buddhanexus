from fastapi import APIRouter, Query
from .endpoint_utils import execute_query
from ..queries import visual_view_queries
from ..utils import create_cleaned_limit_collection
import re
from typing import Any
from .models.visual_view_models import *

router = APIRouter()


@router.post("/visual-view/", response_model=VisualViewOutput)
async def get_visual_view(input: VisualViewInput) -> Any:
    """
    Endpoint for visual view
    """

    hitcollections = create_cleaned_limit_collection(input.hit_collections)
    visualview_results = []

    if re.search(r'^[a-z]{3}_', input.inquiry_collection):
        inquirycollection = create_cleaned_limit_collection([input.inquiry_collection])
        query_visual_category_result = execute_query(
            visual_view_queries.QUERY_VISUAL_CATEGORY_VIEW,
            bind_vars={
                "inquirycollection": inquirycollection,
                "hitcollections": hitcollections,
            },
        )
        visualview_results = query_visual_category_result.result
    else:
        inquirycollection = execute_query(
            visual_view_queries.QUERY_FILES_FOR_ONE_CATEGORY,
            bind_vars={
                "category": input.inquiry_collection
            },
        ).result
        if len(inquirycollection) == 0:
            inquirycollection = [input.inquiry_collection]

        query_visual_file_result = execute_query(
            visual_view_queries.QUERY_VISUAL_FILE_VIEW,
            bind_vars={
                "inquirycollection": inquirycollection,
                "hitcollections": hitcollections,
            },
        )
        visualview_results = query_visual_file_result.result

    # returns a list of the data as needed by Google Graphs

    return visualview_results
