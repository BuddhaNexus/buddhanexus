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
