from pydantic import BaseModel
from typing import List, Optional
from .general_models import Limits


class CountMatchesInput(BaseModel):
    file_name: str = ""
    score = 0
    par_length = 0
    limits: Optional[Limits]


class CountMatchesOutput(BaseModel):
    parallel_count: int

class FolioOutput(BaseModel):
    folios: List


class DisplayNameOutput(BaseModel):
    displayname: list


class LanguageOutput(BaseModel):
    langList: list
