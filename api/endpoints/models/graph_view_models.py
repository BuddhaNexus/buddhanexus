from pydantic import BaseModel
from typing import List, Union


class GraphInput(BaseModel):
    filename: str = ""
    score: int = 0
    par_length: int = 0
    target_collection: List[str] = []


class GraphData(BaseModel):
    piegraphdata: List[List[Union[str, int]]]
    histogramgraphdata: List[List[Union[str, int]]] = None


class GraphViewOutput(BaseModel):
    __root__: GraphData
