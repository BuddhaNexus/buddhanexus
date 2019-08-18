from typing import List

from pydantic import BaseModel


class Parallel(BaseModel):
    probability: int
    parlength: int
    parlang: str  # Language of parallel
    par_offset_beg: int
    par_offset_end: int
    parsegnr: List[str]  # Segment(s) the parallel is referring to.
    parsegment: List[str]  # Content of the referred segments
    root_offset_beg: int
    root_offset_end: int
    root_segnr: List[str]


class Segment(BaseModel):
    segmentnr: str  # Globally unique ID for segment
    segment: str  # Text content of segment
    lang: str  # language name
