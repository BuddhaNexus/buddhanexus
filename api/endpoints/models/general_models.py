from pydantic import BaseModel
from typing import Optional, Union, List
from enum import Enum

class FilterTypes(str, Enum):
    """
    Possible filter types
    """
    collection = "collection"
    category = "category"
    file = "file"
    

class FilterItem(BaseModel):
    filter_value: str
    filter_type: FilterTypes

class Filters(BaseModel):
    """
    Filters for matches
    """
    include: Optional[List[FilterItem]]
    exclude: Optional[List[FilterItem]]


class GeneralInput(BaseModel):
    file_name: str
    score: int = 0
    par_length: int = 0
    filters: Optional[Filters]
    page: int = 0
    sort_method: str = "position"
    folio: str = ""


class FullText(BaseModel):
    text: Union[str, None] = None
    highlightColor: Union[int, None] = 0


class FullNames(BaseModel):
    display_name: Union[str, None] = None
    text_name: Union[str, None] = None
    link1: Union[str, None] = None
    link2: Union[str, None] = None
