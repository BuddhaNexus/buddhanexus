from arango.database import StandardDatabase
import gzip
import json
import ijson
from tqdm import tqdm as tqdm
from dataloader_constants import (
    DEFAULT_LANGS,
    COLLECTION_SEARCH_INDEX_TIB,
    COLLECTION_SEARCH_INDEX_SKT,
    COLLECTION_SEARCH_INDEX_PLI,
    COLLECTION_SEARCH_INDEX_CHN,

    SKT_SEARCH_DATA_PATH,
    PLI_SEARCH_DATA_PATH,
    TIB_SEARCH_DATA_PATH,
    CHN_SEARCH_DATA_PATH,

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

from dataloader_utils import get_cat_from_segmentnr

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


class SearchIndexBase:
    COLLECTION_NAME: str
    DATA_PATH: str

    def load_search_index(self, db: StandardDatabase):
        with gzip.open(self.DATA_PATH, 'rb') as f:
            current_entries = []
            db.create_collection(self.COLLECTION_NAME)
            collection = db.collection(self.COLLECTION_NAME) 
            print(f"\nLoading file index data from {self.DATA_PATH}...")
            for entry in tqdm(ijson.items(f, 'item')):
                entry["category"] = get_cat_from_segmentnr(entry["segment_nr"][0])                
                entry['filename'] = entry['filename'].split('/')[-1]
                current_entries.append(entry)
                if len(current_entries) > 10000:
                    collection.insert_many(current_entries)
                    current_entries = []
            collection.insert_many(current_entries)
            print(f"\nDone loading index data from {self.DATA_PATH}.")

class SearchIndexSanskrit(SearchIndexBase):
    COLLECTION_NAME = COLLECTION_SEARCH_INDEX_SKT
    DATA_PATH = SKT_SEARCH_DATA_PATH

class SearchIndexPali(SearchIndexBase):
    COLLECTION_NAME = COLLECTION_SEARCH_INDEX_PLI
    DATA_PATH = PLI_SEARCH_DATA_PATH

class SearchIndexTibetan(SearchIndexBase):
    COLLECTION_NAME = COLLECTION_SEARCH_INDEX_TIB
    DATA_PATH = TIB_SEARCH_DATA_PATH

class SearchIndexChinese(SearchIndexBase):
    COLLECTION_NAME = COLLECTION_SEARCH_INDEX_CHN
    DATA_PATH = CHN_SEARCH_DATA_PATH

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

#class AnalyzerChinese(AnalyzerBase):
#    ANALYZER_NAME = CHINESE_ANALYZER
#    CASE = "none"
#    STOPWORDS = []
#    ACCENT = False    
    
def create_analyzers(db: StandardDatabase):
    Analyzer = AnalyzerTibetan()
    Analyzer.create_analyzer(db)
    Analyzer = AnalyzerTibetanFuzzy()
    Analyzer.create_analyzer(db)
    Analyzer = AnalyzerSanskrit()
    Analyzer.create_analyzer(db)
    Analyzer = AnalyzerPali()
    Analyzer.create_analyzer(db)

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
    
    

def clean_analyzers(db: StandardDatabase):
    for analyzer in ANALYZER_NAMES:
        db.delete_analyzer(analyzer)
