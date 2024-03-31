from pydantic import BaseModel
from typing import List, Union


class FullNames(BaseModel):
    display_name: str
    text_name: str
    link1: Union[str, None] = None
    link2: Union[str, None] = None


class FullText(BaseModel):
    text: str
    highlightColor: int


class Segment(BaseModel):
    par_segnr: list
    par_full_names: FullNames
    root_full_names: FullNames
    file_name: str
    root_segnr: list
    par_length: int
    root_length: int
    score: int
    src_lang: str
    tgt_lang: str
    root_fulltext: List[FullText]
    par_fulltext: List[FullText]


class TableViewOutput(BaseModel):
    __root__: List[Segment]


class TableDownloadInput(BaseModel):
    download_data: str


class MultiLangInput(BaseModel):
    file_name: str
    score: int = 0
    multi_lingual: list = []
    page: int = 0
    folio: str = ""
