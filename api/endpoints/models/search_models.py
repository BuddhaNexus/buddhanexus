from pydantic import BaseModel
from typing import List, Optional
from .general_models import FullNames, FullText, Languages

"""
Search results are not yet working so the below needs to 
be updated accordingly
"""

class SearchFilters(BaseModel):
    """
    Filters for search
    """
    language: Languages
    include_files: Optional[List[str]] = []
    exclude_files: Optional[List[str]] = []

    include_categories: Optional[List[str]] = []
    exclude_categories: Optional[List[str]] = []

    include_collections: Optional[List[str]] = []
    exclude_collections: Optional[List[str]] = []


class SearchInput(BaseModel):
    search_string: str
    filters: SearchFilters


class SearchResults(BaseModel):
    category: str
    language: str
    segment_nr: str
    full_names: FullNames
    similarity: int
    segtext: List[FullText]


class SearchOutput(BaseModel):
    searchResults: List[SearchResults]
