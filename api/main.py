from typing import List

from fastapi import FastAPI, Path, Query
from pydantic import BaseModel
from pyArango.connection import *

from .db_connection import get_collection
from .models import Segment

app = FastAPI()


@app.get("/")
def root():
    return {"message": "Visit /docs to view the documentation"}


@app.get("/segments/count/{lang}")
async def get_segment_count(lang: str):
    try:
        collection = get_collection(lang)
        return {"count": collection.count()}
    except KeyError:
        return {"error": {"code": 404, "message": f"Collection {lang} not found."}}


@app.get("/segments/{lang}/{key}")
async def get_segment(lang: str, key: str) -> Segment:
    # try:
    collection = get_collection(lang)
    # collection[]
