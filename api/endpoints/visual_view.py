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
    Endpoint for visual view.

    Input is as follows:

    ```
        {
          "inquiry_collection": "",
          "hit_collections": []
        }
    ```

    "inquiry_collection" input comes from a dropdown list that lists collections only.
    This comes from the `/menus/graphcollections/` endpoint.

    "hit_collections" also uses the same `/menus/graphcollections/` input but here it is
    possible to choose more than one option, hence it is a list.

    F.i

    ```
        {
          "inquiry_collection": "pli_Suttas-Early-1",
          "hit_collections": ["pli_Suttas-Early-2"]
        }
    ```

    Generates an output:

    ```
        [
          [
            "Dīghanikāya (dn)",
            "Khuddakapāṭha (kp)",
            "49864"
          ],
          [
            "Dīghanikāya (dn)",
            "Dhammapada (dhp)",
            "52645"
          ],
          etc.
    ```

    When the first sankey-chart is generated, you can click on the collections on the left
    top open them. The "hit_collections" remain the same but the "inquiry_collection" changes
    to the value of the clicked item (between brackets). F.i. in the above example, clicking on
    "Dīghanikāya (dn)" will generate the request for:

    ```
        {
          "inquiry_collection": "dn",
          "hit_collections": ["pli_Suttas-Early-2"]
        }
    ```

    Which outputs:

    ```
        [
          [
            "Brahmajāla Sutta (dn1)",
            "Khuddakapāṭha (kp)",
            "55916"
          ],
          [
            "Brahmajāla Sutta (dn1)",
            "Udāna (ud)",
            "57381"
          ],
          etc.
    ```

    The sankey-chart is then updated with the new data.

    Then clicking on "Brahmajāla Sutta (dn1)" generates the request for:

    ```
        {
          "inquiry_collection": "dn1",
          "hit_collections": ["pli_Suttas-Early-2"]
        }
    ```

    Which provides the next dataset for the new updated sankey-chart.

    When then clicking on "Brahmajāla Sutta (dn1)" again opens the file "dn1" in
    text-view mode.
    """

    hitcollections = create_cleaned_limit_collection(input.hit_collections)
    visualview_results = []

    if re.search(r"^[a-z]{3}_", input.inquiry_collection):
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
            bind_vars={"category": input.inquiry_collection},
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
