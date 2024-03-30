from pydantic import BaseModel
from typing import List, Union, Optional


class FullText(BaseModel):
    text: str
    highlightColor: int
    matches: list = []


class TextItem(BaseModel):
    segnr: str
    segtext: List[FullText]


class TextViewLeftOutput(BaseModel):
    __root__: List[TextItem]


class MiddleViewFullText(BaseModel):
    text: str
    highlightColor: int


"""
The middle view has a problem with null integers being returned
for Pali as long as the wrong dataset still exists.
par_offset_beg and par_offset_end can be removed as soon as this is better.
par_fulltext can then be made un-optional
"""


class Segment(BaseModel):
    par_segnr: list
    display_name: Union[str, None] = None
    tgt_lang: str
    par_offset_beg: Optional[int]
    par_offset_end: Optional[int]
    par_segtext: list = []
    file_name: str
    score: int
    length: int
    par_fulltext: Optional[List[MiddleViewFullText]]


class TextViewMiddleOutput(BaseModel):
    __root__: List[Segment]
