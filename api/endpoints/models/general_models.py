from pydantic import BaseModel
from typing import Optional, Union, List
from enum import Enum


class Languages(str, Enum):
    all = "all"
    tibetan = "bo"
    sanskrit = "sa"
    pali = "pa"
    chinese = "zh"


class Sortmethod(str, Enum):
    position = "position"
    quotedtext = "quotedtext"
    length = "length"
    length2 = "length2"


class Filters(BaseModel):
    """
    Filters for matches
    """
    par_length: int = 0
    score: int = 0
    languages: Optional[List[Languages]]

    include_files: Optional[List[str]] = []
    exclude_files: Optional[List[str]] = []

    include_categories: Optional[List[str]] = []
    exclude_categories: Optional[List[str]] = []

    include_collections: Optional[List[str]] = []
    exclude_collections: Optional[List[str]] = []


class GeneralInput(BaseModel):
    filename: str
    filters: Optional[Filters]
    page: int = 0
    sort_method: Sortmethod = Sortmethod.position
    folio: str = ""


class FullText(BaseModel):
    text: Union[str, None] = None
    highlightColor: Union[int, None] = 0


class FullNames(BaseModel):
    display_name: Union[str, None] = None
    text_name: Union[str, None] = None
