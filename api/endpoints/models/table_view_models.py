from pydantic import BaseModel
from typing import List
from .general_models import GeneralInput, FullNames, FullText


class Segment(BaseModel):
    par_segnr_range: str
    par_full_names: FullNames
    root_full_names: FullNames
    file_name: str
    root_segnr_range: str
    par_length: int
    root_length: int
    score: int
    src_lang: str
    tgt_lang: str
    root_fulltext: List[FullText] = []
    par_fulltext: List[FullText] = []


class TableViewOutput(BaseModel):
    __root__: List[Segment]


class TableDownloadInput(GeneralInput):
    download_data: str


class TableDownloadOutput(BaseModel):
    __root__: str
