from typing import List

from fastapi import FastAPI, Path, Query
from pydantic import BaseModel


class Parallel(BaseModel):
    probability: int
    parlength: int
    parlang: str  # todo: create language enum type
    par_offset_beg: int
    par_offset_end: int
    parsegnr: List[str]
    parsegment: List[str]
    root_offset_beg: int
    root_offset_end: int
    root_segnr: List[str]


class Segment(BaseModel):
    segmentnr: str
    segment: str
    lang: str
    paralells: List[Parallel]


class Item(BaseModel):
    name: str
    description: str = None
    price: float
    tax: float = None


app = FastAPI()


@app.get("/")
def root():
    return {"message": "Hello World"}


@app.get("/items/{item_id}")
async def read_item(
    item_id: str = Path(..., title="The ID of the item to get"), q: str = Query(None)
):
    results = {"item_id": item_id}
    if q:
        results.update({"q": q})
    return results


@app.put("/items/{item_id}")
def update_item(item_id: int, item: Segment):
    return {"item_price": item.price, "item_id": item_id}


@app.post("/items/")
async def create_item(item: Item):
    return item
