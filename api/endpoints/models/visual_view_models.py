from pydantic import BaseModel
from typing import List, Union


class VisualViewInput(BaseModel):
    inquiry_collection: str = ""
    hit_collections: list = []


class VisualViewOutput(BaseModel):
    __root__: List[List[Union[str, str, int]]]
