from pydantic import BaseModel
from typing import List, Union


class File(BaseModel):
    displayName: str
    filename: str
    category: str
    search_field: str


class FilesOutput(BaseModel):
    results: List[File]


class CategoryBase(BaseModel):
    categoryname: str
    categorydisplayname: str


class Category(CategoryBase):
    files: List[File]


class CollectionBase(BaseModel):
    collection: str


class Collection(CollectionBase):
    categories: List[Category]


class CollectionWithLanguage(BaseModel):
    collectionlanguage: str
    collectionkey: str
    collectionname: str


class GraphCollection(CollectionBase):
    collectiondisplayname: Union[str, None] = None


class CollectionsOutput(BaseModel):
    result: List[CollectionWithLanguage]


class GraphCollectionOutput(BaseModel):
    result: List[GraphCollection]


class SideBarOutput(BaseModel):
    navigationmenudata: List[Collection]
