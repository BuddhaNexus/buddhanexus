from pydantic import BaseModel
from typing import List


class File(BaseModel):
    displayName: str
    filename: str
    search_field: str


class CategoryBase(BaseModel):
    category: str
    categorydisplayname: str


class Category(CategoryBase):
    files: List[File]


class CollectionBase(BaseModel):
    collection: str


class Collection(CollectionBase):
    categories: List[Category]


class MenudataOutput(BaseModel):
    menudata: List[Collection]
