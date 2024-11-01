from pydantic import BaseModel
from typing import List, Union, Optional


class GraphFilters(BaseModel):
    """
    Filters for graph
    """

    par_length: int = 0
    score: int = 0
    include_collections: Optional[List[str]]


class GraphInput(BaseModel):
    filename: str
    filters: GraphFilters


class GraphData(BaseModel):
    piegraphdata: List[List[Union[str, int]]]
    histogramgraphdata: List[List[Union[str, int]]] = None


class GraphViewOutput(BaseModel):
    __root__: GraphData
