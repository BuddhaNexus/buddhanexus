from pydantic import BaseModel
from typing import List, Optional
from .general_models import Limits

"""
Search results are not yet working so the below needs to 
be updated accordingly
"""


class SearchInput(BaseModel):
    search_string: str
    language: str = ""
    limits: Optional[Limits]


class SearchResults(BaseModel):
    original: str
    stemmed: str
    category: str
    language: str
    segment_nr: str
    full_names: str


class SearchOutput(BaseModel):
    __root__: List[SearchResults]
