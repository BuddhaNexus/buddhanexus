from pydantic import BaseModel
from typing import List, Optional
from .general_models import Filters, FullNames, FullText

"""
Search results are not yet working so the below needs to 
be updated accordingly
"""


class SearchInput(BaseModel):
    search_string: str
    language: str = ""
    filters: Optional[Filters]


class SearchResults(BaseModel):
    category: str
    language: str
    segment_nr: str
    full_names: FullNames
    similarity: int
    segtext: List[FullText]


class SearchOutput(BaseModel):
    searchResults: List[SearchResults]
