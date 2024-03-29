from pydantic import BaseModel
from typing import Optional


class Limits(BaseModel):
    """
    Limits for parallels
    """
    category_include: list = []
    category_exclude: list = []
    file_include: list = []
    file_exclude: list = []


class GeneralInput(BaseModel):
    file_name: str
    score: int = 0
    par_length: int = 0
    limits: Optional[Limits]
    page: int = 0
    sort_method: str = "position"
    folio: str = ""


class TableDownloadInput(GeneralInput):
    download_data: str


class MultiLangInput(BaseModel):
    file_name: str
    score: int = 0
    multi_lingual: list = []
    page: int = 0
    folio: str = ""


class SearchInput(BaseModel):
    search_string: str
    language: str = ""
    limits: Optional[Limits]


class MenuInput(BaseModel):
    file_name: str


class GraphInput(BaseModel):
    file_name: str = ""
    score: int = 0
    par_length: int = 0
    target_collection: list = []


class MiddleInput(BaseModel):
    parallel_ids: list


class TextParallelsInput(BaseModel):
    file_name: str = ""
    active_segment: str = "none"
    score: int = 0
    par_length: int = 0
    limits: Optional[Limits]
    multi_lingual: list = []


class CountMatchesInput(BaseModel):
    file_name: str = ""
    score = 0
    par_length = 0
    limits: Optional[Limits]

