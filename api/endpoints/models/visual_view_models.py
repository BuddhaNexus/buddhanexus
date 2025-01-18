from pydantic import BaseModel
from typing import List, Union
from .general_models import Languages


class VisualViewInput(BaseModel):
    inquiry: str
    hit: List[str]
    language: Languages
    page: int = 0


class VisualViewData(BaseModel):
    totalpages: int = 1
    graphdata: List[List[Union[str, str, int]]]


class VisualViewOutput(BaseModel):
    __root__: VisualViewData
