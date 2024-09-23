"""
Models for data 
"""

from typing import List
from enum import Enum
from pydantic import BaseModel, Field, ValidationError


class Lang(str, Enum):
    tibetan = "bo"
    sanskrit = "sa"
    chinese = "zh"
    pali = "pa"


class Match(BaseModel):
    """
    The base model of a Parallel object
    """

    id: str = Field(..., min_length=1)
    score: float
    par_length: int
    root_length: int
    inquiry_pos_beg: int
    inquiry_pos_end: int
    target_pos_beg: int
    target_pos_end: int
    root_segnr: List[str]
    par_segnr: List[str]
    root_segtext: List[str]
    par_segtext: List[str]
    root_string: str = Field(..., min_length=1)
    par_string: str = Field(..., min_length=1)
    root_offset_beg: int
    root_offset_end: int
    par_offset_beg: int
    par_offset_end: int
    src_lang: Lang
    tgt_lang: Lang


class Segment(BaseModel):
    """
    The base model of a segment object
    """

    segmentnr: str = Field(..., min_length=1)  # Globally unique ID for segment
    original: str = Field(..., min_length=1)  # Text content of segment
    stemmed: str = Field(..., min_length=1)  # Text content of segment
    # lang: Lang  # language name


def validate_dict(path, model, dictionary):
    # print(dictionary)
    try:
        _ = model(**dictionary)
        return True
    except ValidationError as e:
        print(f"Failed in {path} to validate record: {dictionary}\n{e}")
        return False


def validate_dict_list(path, model, dictionary_list):
    print(f"Validating {path}")
    return any([validate_dict(path, model, dct) for dct in dictionary_list])


def validate_df(path, model, df):
    return validate_dict_list(path, model, df.to_dict(orient="records"))
