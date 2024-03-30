from pydantic import BaseModel
from typing import List


class Parallel(BaseModel):
    segmentnr: str
    displayName: str
    fileName: str
    category: str


class Segment(BaseModel):
    segmentnr: str
    parallels: List[Parallel]


class NumbersViewOutput(BaseModel):
    __root__: List[Segment]


class MenuItem(BaseModel):
    id: str
    displayName: str


class MenuOutput(BaseModel):
    __root__: List[MenuItem]
