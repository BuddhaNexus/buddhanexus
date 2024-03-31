from pydantic import BaseModel
from typing import List

"""
THE GRAPH VIEW IS NOT WORKING. NEEDS TOTAL REVAMP!
"""


class GraphInput(BaseModel):
    file_name: str = ""
    score: int = 0
    par_length: int = 0
    target_collection: list = []


class Segment(BaseModel):
    segmentnr: str
    weight: int


class GraphViewOutput(BaseModel):
    __root__: List[Segment]
