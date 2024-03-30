from pydantic import BaseModel


class LinksOutput(BaseModel):
    bdrc: bool
    rkts: bool
    gretil: bool
    dsbc: bool
    cbeta: bool
    suttacentral: bool
    cbc: bool
    vri: bool
