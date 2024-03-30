from pydantic import BaseModel
from typing import List

"""
THE GRAPH VIEW IS NOT WORKING. NEEDS TOTAL REVAMP!
"""


class Segment(BaseModel):
    segmentnr: str
    weight: int


class GraphViewOutput(BaseModel):
    __root__: List[Segment]
