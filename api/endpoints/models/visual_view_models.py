from pydantic import BaseModel
from typing import List, Union
from .general_models import Languages


class VisualViewInput(BaseModel):
    inquiry: str
    hit: List[str]
    language: Languages


class VisualViewOutput(BaseModel):
    graphdata: List[List[Union[str, str, int]]]
