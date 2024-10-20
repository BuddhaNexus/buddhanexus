from pydantic import BaseModel
from typing import List, Union, Optional
from .general_models import Filters, FullText


class TextParallelsInput(BaseModel):
    filename: str
    folio: str = ""
    active_segment: Optional[str] = "none"
    filters: Optional[Filters]
    page: int = 0


class FullMatchText(FullText):
    matches: list = []


class TextItem(BaseModel):
    segnr: str
    segtext: List[FullMatchText]


class TextViewLeftOutput(BaseModel):
    page: int
    total_pages: int
    items: List[TextItem]


class TextViewMiddleInput(BaseModel):
    parallel_ids: list


"""
The middle view has a problem with null integers being returned
for Pali as long as the wrong dataset still exists.
par_offset_beg and par_offset_end can be removed as soon as this is better.
par_fulltext can then be made un-optional
"""


class Segment(BaseModel):
    par_segnr_range: str
    display_name: Union[str, None] = None
    tgt_lang: str
    par_offset_beg: Optional[int]
    par_offset_end: Optional[int]
    par_segtext: list = []
    filename: str
    score: int
    length: int
    par_fulltext: Optional[List[FullText]]


class TextViewMiddleOutput(BaseModel):
    __root__: List[Segment]
