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

from dataloader_utils import get_cat_from_segmentnr, check_if_collection_exists
from dataloader_utils import get_database
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
        print("ANALYZER_NAMES", self.ANALYZER_NAME)
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


def create_search_views(db: StandardDatabase):
    print(f"\nCreating Sanskrit search views...")
    db.create_arangosearch_view(
        name=VIEW_SEARCH_INDEX_SKT, properties=PROPERTIES_SEARCH_INDEX_SKT
    )
    print(f"\nCreating Pali search views...")
    db.create_arangosearch_view(
        name=VIEW_SEARCH_INDEX_PLI, properties=PROPERTIES_SEARCH_INDEX_PLI
    )

    print(f"\nCreating Tibetan search views...")
    db.create_arangosearch_view(
        name=VIEW_SEARCH_INDEX_TIB, properties=PROPERTIES_SEARCH_INDEX_TIB
    )
    db.create_arangosearch_view(
        name=VIEW_SEARCH_INDEX_TIB_FUZZY,
        properties=PROPERTIES_SEARCH_INDEX_TIB_FUZZY,
    )

    print(f"\nCreating Chinese search view...")
    db.create_arangosearch_view(
        name=VIEW_SEARCH_INDEX_CHN, properties=PROPERTIES_SEARCH_INDEX_CHN
    )


