from pydantic import BaseModel

class Limits(BaseModel):
    """
    Limits for parallels
    """

    limit_category_include: list
    limit_category_exclude: list
    limit_file_include: list
    limit_file_exclude: list
    
class GeneralInput(BaseModel):
    filename: str
    score: int = 0
    par_length: int = 0
    limits: Limits
    page: int = 0
    sort_method: str = "parallels_sorted_by_src_pos"
    folio: str = ""

class TableDownloadInput(GeneralInput):
    download_data: str

class MultiLangInput(BaseModel):
    filename: str
    score: int = 0
    multi_lingual: list = []
    page: int = 0
    folio: str = ""

class SearchInput(BaseModel):
    search_string: str
    limits: Limits

class MenuInput(BaseModel):
    language: str

class LinksInput(BaseModel):    
    file_name: str = ""
    segmentnr: str = ""

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

class FoliosInput(BaseModel):
    file_name: str = ""
    folio: str = ""

class TaggerInput(BaseModel):
    sanskrit_string: str 

class AvailableLanguesInput(BaseModel):
    filename: str