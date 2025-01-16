from pydantic import BaseModel
from typing import List, Union


class VisualViewInput(BaseModel):
    inquiry: str
    hit: List[str]


class VisualViewOutput(BaseModel):
    graphdata: List[List[Union[str, str, int]]]
