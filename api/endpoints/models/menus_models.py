from pydantic import BaseModel
from typing import List, Union


class File(BaseModel):
    displayName: str
    filename: str
    category: str
    search_field: str


class CategoryBase(BaseModel):
    category: str
    categorydisplayname: str


class Category(CategoryBase):
    files: List[File]


class CollectionBase(BaseModel):
    collection: str
    collectiondisplayname: str


class Collection(CollectionBase):
    categories: List[Category]


class GraphCollectionOutput(BaseModel):
    __root__: list


class MetadataOutput(BaseModel):
    metadata: List[Collection]
