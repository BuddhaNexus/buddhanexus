"""
Here we create the search index and analyzers for the global search in the text elements.
"""

from arango.database import StandardDatabase
from tqdm import tqdm as tqdm
from dataloader_constants import (
    VIEW_SEARCH_INDEX_TIB,
    VIEW_SEARCH_INDEX_TIB_FUZZY,
    VIEW_SEARCH_INDEX_PLI,
    VIEW_SEARCH_INDEX_SKT,
    VIEW_SEARCH_INDEX_CHN,
    TIBETAN_ANALYZER,
    TIBETAN_FUZZY_ANALYZER,
    SANSKRIT_ANALYZER,
    PALI_ANALYZER,
    CHINESE_ANALYZER,
    ANALYZER_NAMES,
)

from utils import check_if_view_exists
from views_properties import (
    PROPERTIES_SEARCH_INDEX_TIB,
    PROPERTIES_SEARCH_INDEX_TIB_FUZZY,
    PROPERTIES_SEARCH_INDEX_SKT,
    PROPERTIES_SEARCH_INDEX_PLI,
    PROPERTIES_SEARCH_INDEX_CHN,
)


def get_stopwords_list(path):
    stopwords = []
    with open(path) as file:
        for line in file:
            stopwords.append(line.strip())
    return stopwords


tib_stopwords_list = get_stopwords_list("../data/tib_stopwords.txt")
skt_stopwords_list = get_stopwords_list("../data/skt_stopwords.txt")
pli_stopwords_list = get_stopwords_list("../data/pli_stopwords.txt")


class AnalyzerBase:
    ANALYZER_NAME: str
    CASE: str
    STOPWORDS: list
    ACCENT: bool

    def create_analyzer(self, db: StandardDatabase):
        db.create_analyzer(
            name=self.ANALYZER_NAME,
            analyzer_type="text",
            properties={
                "locale": "en.utf-8",
                "case": self.CASE,
                "stopwords": self.STOPWORDS,
                "accent": self.ACCENT,
                "stemming": False,
            },
            features=["position", "norm", "frequency"],
        )


class AnalyzerSanskrit(AnalyzerBase):
    ANALYZER_NAME = SANSKRIT_ANALYZER
    CASE = "none"
    STOPWORDS = skt_stopwords_list
    ACCENT = True


class AnalyzerPali(AnalyzerBase):
    ANALYZER_NAME = PALI_ANALYZER
    CASE = "none"
    STOPWORDS = pli_stopwords_list
    ACCENT = True


class AnalyzerTibetan(AnalyzerBase):
    ANALYZER_NAME = TIBETAN_ANALYZER
    CASE = "none"
    STOPWORDS = []
    ACCENT = False


class AnalyzerTibetanFuzzy(AnalyzerBase):
    ANALYZER_NAME = TIBETAN_FUZZY_ANALYZER
    CASE = "none"
    STOPWORDS = tib_stopwords_list
    ACCENT = False


class AnalyzerChinese(AnalyzerBase):
    ANALYZER_NAME = CHINESE_ANALYZER
    CASE = "none"
    STOPWORDS = []
    ACCENT = False


def create_analyzers(db: StandardDatabase):
    Analyzer = AnalyzerTibetan()
    Analyzer.create_analyzer(db)
    Analyzer = AnalyzerTibetanFuzzy()
    Analyzer.create_analyzer(db)
    Analyzer = AnalyzerSanskrit()
    Analyzer.create_analyzer(db)
    Analyzer = AnalyzerPali()
    Analyzer.create_analyzer(db)


def clean_analyzers(db: StandardDatabase):
    for analyzer in ANALYZER_NAMES:
        if analyzer in db.analyzers():
            db.delete_analyzer(analyzer)


def create_search_view(
    db: StandardDatabase, view_name: str, view_properties: dict, language: str
):
    """Helper function to create a search view for a specified language."""
    print(f"\nCreating {language} search views...")
    if check_if_view_exists(db, view_name):
        db.delete_view(view_name)
    db.create_arangosearch_view(name=view_name, properties=view_properties)


def create_search_views(db: StandardDatabase, langs=[]):
    if "tib" in langs:
        create_search_view(
            db, VIEW_SEARCH_INDEX_TIB, PROPERTIES_SEARCH_INDEX_TIB, "Tibetan"
        )
        create_search_view(
            db,
            VIEW_SEARCH_INDEX_TIB_FUZZY,
            PROPERTIES_SEARCH_INDEX_TIB_FUZZY,
            "Tibetan Fuzzy",
        )
    if "skt" in langs:
        create_search_view(
            db, VIEW_SEARCH_INDEX_SKT, PROPERTIES_SEARCH_INDEX_SKT, "Sanskrit"
        )
    if "pli" in langs:
        create_search_view(
            db, VIEW_SEARCH_INDEX_PLI, PROPERTIES_SEARCH_INDEX_PLI, "Pali"
        )
    if "chn" in langs:
        create_search_view(
            db, VIEW_SEARCH_INDEX_CHN, PROPERTIES_SEARCH_INDEX_CHN, "Chinese"
        )
