from typing import List

from pydantic import BaseModel


class Parallel(BaseModel):
    probability: int
    parlength: int
    parlang: str  # todo: create language enum type
    par_offset_beg: int
    par_offset_end: int
    parsegnr: List[str]
    parsegment: List[str]
    root_offset_beg: int
    root_offset_end: int
    root_segnr: List[str]


class Segment(BaseModel):
    segmentnr: str
    segment: str
    lang: str
    paralells: List[Parallel]
