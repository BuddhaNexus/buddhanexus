from pydantic import BaseModel
from typing import List


class CountMatchesOutput(BaseModel):
    parallel_count: int


class Segment(BaseModel):
    num: str
    segment_nr: str


class FolioOutput(BaseModel):
    folios: List[Segment]


class DisplayNameOutput(BaseModel):
    displayname: list


class LanguageOutput(BaseModel):
    langList: list
