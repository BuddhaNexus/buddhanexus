from typing import List

class Segment(dict):
    segnr: str
    segtext: str
    lang: str
    position: int


# todo: check if up to date
class Parallel(dict):
    score: int
    parlength: int
    parlang: str  # Language of parallel
    par_offset_beg: int
    par_offset_end: int
    parsegnr: List[str]  # Segment(s) the parallel is referring to.
    parsegment: List[str]  # Content of the referred segments
    root_offset_beg: int
    root_offset_end: int
    root_segnr: List[str]

# todo: check if up to date
class MenuItem(dict):
    searchString: str  # "K01acip-k_lha_sa-001-001 D0001"
    textname: str  # "D0001
    filename: str  # "K01acip-k_lha_sa-001-001",
    category: str  # "K01"
    filenr: int  # number of file in language
