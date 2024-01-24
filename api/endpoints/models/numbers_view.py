from pydantic import BaseModel
from typing import List
from .shared import Limits


class SegmentResult(BaseModel):
    # Define the structure of a segment result here
    pass


class Collections(BaseModel):
    # Define the structure of a collection here
    pass


class NumbersViewOutput(BaseModel):
    collections: List[Collections]
    segments: List[SegmentResult]
