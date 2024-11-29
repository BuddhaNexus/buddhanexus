from pydantic import BaseModel
from typing import List, Dict, Any


class File(BaseModel):
    displayName: str
    filename: str
    search_field: str


class CategoryBase(BaseModel):
    category: str
    categorydisplayname: str
    categorysearch_field: str


class Category(CategoryBase):
    files: List[File]


class CollectionBase(BaseModel):
    collection: str


class Collection(CollectionBase):
    categories: List[Category]


class MenudataOutput(BaseModel):
    menudata: List[Dict[str, Any]]

    class Config:
        json_encoders = {
            # Add any custom encoders if needed
        }
