from pydantic import BaseModel
from fastapi import Query

class Limits(BaseModel):
    """
    Limits for parallels
    """

    collection_positive: list = []
    collection_negative: list = []
    file_positive: list = []
    file_negative: list = []
    
class GeneralInput(BaseModel):
    file_name: str
    score: int = 0
    par_length: int = 0
    limits: Limits
    page: int = 0
    sort_method: str = "position"
    folio: str = ""

class TableDownloadInput(BaseModel):
    file_name: str
    score: int = 0
    par_length: int = 0
    limits: Limits
    sort_method: str = "position"
    folio: str = ""
    download_data: str = "table"

class MultiLangInput(BaseModel):
    file_name: str
    score: int = 0
    multi_lingual: list = []
    page: int = 0
    folio: str = ""

class SearchInput(BaseModel):
    search_string: str
    limits: Limits

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
    limits: Limits
    multi_lingual: list = []

class CountMatchesInput(BaseModel):
    file_name: str = ""
    score = 0
    par_length = 0
    limits: Limits
