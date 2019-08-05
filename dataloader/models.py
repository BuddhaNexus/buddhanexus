from typing import List


class Parallel:
    probability: int
    parlength: int
    parlang: str
    par_offset_beg: int
    par_offset_end: int
    parsegnr: List[str]
    parsegment: List[str]
    root_offset_beg: int
    root_offset_end: int
    root_segnr: List[str]


class Segment:
    segmentnr: str
    segment: str
    lang: str
    paralells: List[Parallel]
