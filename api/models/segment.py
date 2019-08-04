from typing import List

from pydantic import BaseModel

from api.models.parallel import Parallel


class Segment(BaseModel):
    segmentnr: str
    segment: str
    lang: str
    paralells: List[Parallel]
