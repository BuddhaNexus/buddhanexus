from pydantic import BaseModel


class Parallel(BaseModel):
     segmentnr: str
     displayName: str
     fileName: str
     category: str

class Segment(BaseModel):
    segmentnr: str
    parallels: list = [Parallel]

class NumbersViewOutput(BaseModel):
    list = [Segment]

class MenuItem(BaseModel):
    id: str
    displayName: str

class MenuOutput(BaseModel):
    list = [MenuItem]
