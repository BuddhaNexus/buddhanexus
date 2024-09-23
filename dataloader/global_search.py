"""
Here we create the search index and analyzers for the global search in the text elements.
"""

from arango.database import StandardDatabase
from tqdm import tqdm as tqdm
from dataloader_constants import (
    SA_STOPWORDS_URL,
    BO_STOPWORDS_URL,
    PA_STOPWORDS_URL,
    VIEW_SEARCH_INDEX_BO,
    VIEW_SEARCH_INDEX_BO_FUZZY,
    VIEW_SEARCH_INDEX_PA,
    VIEW_SEARCH_INDEX_SA,
    VIEW_SEARCH_INDEX_ZH,
    TIBETAN_ANALYZER,
    TIBETAN_FUZZY_ANALYZER,
    SANSKRIT_ANALYZER,
    PALI_ANALYZER,
    CHINESE_ANALYZER,
    ANALYZER_NAMES,
)

from utils import check_if_view_exists
from views_properties import (
    PROPERTIES_SEARCH_INDEX_BO,
    PROPERTIES_SEARCH_INDEX_BO_FUZZY,
    PROPERTIES_SEARCH_INDEX_SA,
    PROPERTIES_SEARCH_INDEX_PA,
    PROPERTIES_SEARCH_INDEX_ZH,
)

def get_stopwords_list(path):
    stopwords = []
    with open(path) as file:
        for line in file:
            stopwords.append(line.strip())
    return stopwords

bo_stopwords_list = get_stopwords_list(SA_STOPWORDS_URL)
sa_stopwords_list = get_stopwords_list(BO_STOPWORDS_URL)
pa_stopwords_list = get_stopwords_list(PA_STOPWORDS_URL)

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
    STOPWORDS = sa_stopwords_list
    ACCENT = True


class AnalyzerPali(AnalyzerBase):
    ANALYZER_NAME = PALI_ANALYZER
    CASE = "none"
    STOPWORDS = pa_stopwords_list
    ACCENT = True


class AnalyzerTibetan(AnalyzerBase):
    ANALYZER_NAME = TIBETAN_ANALYZER
    CASE = "none"
    STOPWORDS = []
    ACCENT = False


class AnalyzerTibetanFuzzy(AnalyzerBase):
    ANALYZER_NAME = TIBETAN_FUZZY_ANALYZER
    CASE = "none"
    STOPWORDS = bo_stopwords_list
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
    if "bo" in langs:
        create_search_view(
            db, VIEW_SEARCH_INDEX_BO, PROPERTIES_SEARCH_INDEX_BO, "Tibetan"
        )
        create_search_view(
            db,
            VIEW_SEARCH_INDEX_BO_FUZZY,
            PROPERTIES_SEARCH_INDEX_BO_FUZZY,
            "Tibetan Fuzzy",
        )
    if "sa" in langs:
        create_search_view(
            db, VIEW_SEARCH_INDEX_SA, PROPERTIES_SEARCH_INDEX_SA, "Sanskrit"
        )
    if "pa" in langs:
        create_search_view(
            db, VIEW_SEARCH_INDEX_PA, PROPERTIES_SEARCH_INDEX_PA, "Pali"
        )
    if "zh" in langs:
        create_search_view(
            db, VIEW_SEARCH_INDEX_ZH, PROPERTIES_SEARCH_INDEX_ZH, "Chinese"
        )
