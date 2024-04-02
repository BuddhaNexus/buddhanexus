from pydantic import BaseModel
from typing import List, Optional
from .general_models import Limits, FullNames, FullText

"""
Search results are not yet working so the below needs to 
be updated accordingly
"""

class SearchInput(BaseModel):
    search_string: str
    language: str = ""
    limits: Optional[Limits]


class SearchResults(BaseModel):
    category: str
    language: str
    segment_nr: str
    full_names: FullNames
    similarity: int
    segtext: List[FullText]


class SearchOutput(BaseModel):
    __root__: Optional[List[SearchResults]] = None
