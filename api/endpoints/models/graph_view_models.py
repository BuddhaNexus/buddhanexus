from pydantic import BaseModel
from typing import List, Union


class GraphInput(BaseModel):
    filename: str = ""
    score: int = 0
    par_length: int = 0
    target_collection: list = []


class GraphViewOutput(BaseModel):
    piegraphdata: List[List[Union[str, int]]]
    histogramgraphdata: List[List[Union[str, int]]]
