from pydantic import BaseModel
from typing import List, Optional
from .general_models import Filters


class CountMatchesInput(BaseModel):
    filename: str
    filters: Optional[Filters]


class CountMatchesOutput(BaseModel):
    parallel_count: int


class FolioOutput(BaseModel):
    folios: List


class DisplayNameOutput(BaseModel):
    displayname: List[str]

class ActiveSegmentOutput(BaseModel):
    active_segment: str

class LanguageOutput(BaseModel):
    langList: list
