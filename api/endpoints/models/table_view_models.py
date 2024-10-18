from pydantic import BaseModel
from typing import List
from .general_models import GeneralInput, FullNames, FullText, Filters, Union

"""
The table view has a problem with null integers being returned
for Pali as long as the wrong dataset still exists.
The `Union[str, None] = None` can be replaced by `str` when this is resolved.
"""


class Segment(BaseModel):
    par_segnr_range: Union[str, None] = None
    par_full_names: FullNames
    root_full_names: FullNames
    root_segnr_range: Union[str, None] = None
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
    download_data: str = "table"


class TableDownloadOutput(BaseModel):
    __root__: bytes
