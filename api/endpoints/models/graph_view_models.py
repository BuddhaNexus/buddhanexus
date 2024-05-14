from pydantic import BaseModel
from typing import List, Dict, Tuple, Union

"""
THE GRAPH VIEW IS NOT WORKING. NEEDS TOTAL REVAMP!
"""


class GraphInput(BaseModel):
    file_name: str = ""
    score: int = 0
    par_length: int = 0
    target_collection: list = []


class GraphViewOutput(BaseModel):
    piegraphdata: List[List[Union[str, int]]]
    histogramgraphdata: List[List[Union[str, int]]]
