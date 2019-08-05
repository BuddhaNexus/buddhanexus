from fastapi import FastAPI, Path, Query
from pydantic import BaseModel

from models import Segment


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
