"""
Models for API resources, as required by FastAPI
"""

from typing import List

from pydantic import BaseModel


class Parallel(BaseModel):
    """
    The base model of a Parallel object
    """

    score: int
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
    """
    The base model of a segment object
    """

    segmentnr: str  # Globally unique ID for segment
    segment: str  # Text content of segment
    lang: str  # language name


class ParallelsCollection(BaseModel):
    """
    Collection of multiple parallels with the same characteristics
    """
    segmentnr: str
    score: int
    par_length: int
    co_occ: int
    limit_collection: list
    file_name: str
