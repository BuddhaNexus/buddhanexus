from pydantic import BaseModel
from typing import List, Union


class Files(BaseModel):
    displayName: str
    textname: str
    filename: str
    category: str
    available_lang: Union[str, None] = None
    search_field: str


class FilesOutput(BaseModel):
    results: List[Files]


class CategoryFiles(BaseModel):
    filename: str
    categoryname: Union[str, None] = None
    displayname: Union[str, None] = None
    search_field: Union[str, None] = None


class FilterOutput(BaseModel):
    filteritems: List[CategoryFiles]


class Category(BaseModel):
    category: Union[str, None] = None
    categoryname: Union[str, None] = None


class CategoryOutput(BaseModel):
    categoryitems: List[Category]


class Collection(BaseModel):
    collectionname: str
    collectionlanguage: str
    collectionkey: str


class CollectionsOutput(BaseModel):
    result: List[Collection]


class AllFilesForCategory(BaseModel):
    file_name: str
    textname: str
    displayname: str


class AllCategories(BaseModel):
    categoryname: str
    categorydisplayname: str
    files: List[AllFilesForCategory]


class SideBar(BaseModel):
    collection: str
    categories: List[AllCategories]


class SideBarOutput(BaseModel):
    navigationmenudata: List[SideBar]


class GraphCollection(BaseModel):
    collection: Union[str, None] = None
    collectiondisplayname: Union[str, None] = None


class GraphCollectionOutput(BaseModel):
    result: List[GraphCollection]
