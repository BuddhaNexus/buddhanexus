from pydantic import BaseModel
from typing import List, Union


class Parallel(BaseModel):
    segmentnr: Union[str, None] = None
    displayName: Union[str, None] = None
    fileName: Union[str, None] = None
    category: Union[str, None] = None


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
