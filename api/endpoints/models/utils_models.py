from pydantic import BaseModel
from typing import List, Optional
from .general_models import Filters


class CountMatchesInput(BaseModel):
    file_name: str = ""
    score = 0
    par_length = 0
    filters: Optional[Filters]


class CountMatchesOutput(BaseModel):
    parallel_count: int


class FolioOutput(BaseModel):
    folios: List


class DisplayNameOutput(BaseModel):
    displayname: list


class LanguageOutput(BaseModel):
    langList: list
