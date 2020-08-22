from arango.database import StandardDatabase
import gzip
import json
from tqdm import tqdm as tqdm
from dataloader_constants import (
    DEFAULT_LANGS,
    COLLECTION_SEARCH_INDEX_TIB,
    COLLECTION_SEARCH_INDEX_SKT,
    COLLECTION_SEARCH_INDEX_PLI,
    COLLECTION_SEARCH_INDEX_CHN,
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


def load_search_index_skt(path, db: StandardDatabase):
    with gzip.open(path) as f:
        print(f"\nLoading file index data sanskrit...")
        index_data = json.load(f)
        print(f"\nInserting file index data sanskrit into DB...")
        collection = db.collection(COLLECTION_SEARCH_INDEX_SKT)
        # we have to do this in chunk, otherwise it will fail with broken_pipe
        chunksize = 10000
        for i in tqdm(range(0, len(index_data), chunksize)):
            collection.insert_many(index_data[i : i + chunksize])
        print(f"\nDone loading index data sanskrit+pali...")
        print("\nDone creating View")

def load_search_index_pli(path, db: StandardDatabase):
    with gzip.open(path) as f:
        print(f"\nLoading file index data pali...")
        index_data = json.load(f)
        print(f"\nInserting file index data Pali into DB...")
        collection = db.collection(COLLECTION_SEARCH_INDEX_PLI)
        # we have to do this in chunk, otherwise it will fail with broken_pipe
        chunksize = 10000
        for i in tqdm(range(0, len(index_data), chunksize)):
            collection.insert_many(index_data[i : i + chunksize])
        print(f"\nDone loading index data sanskrit+pali...")
        print("\nDone creating View")

        

def load_search_index_tib(path, db: StandardDatabase):
    with gzip.open(path) as f:
        print(f"\nLoading file index data Tibetan...")
        index_data = json.load(f)
        print(f"\nInserting file index data Tibetan into DB...")
        collection = db.collection(COLLECTION_SEARCH_INDEX_TIB)
        # we have to do this in chunk, otherwise it will fail with broken_pipe
        chunksize = 10000
        for i in tqdm(range(0, len(index_data), chunksize)):
            collection.insert_many(index_data[i : i + chunksize])
        print(f"\nDone loading Tibetan index data...")
        print("\nDone creating View")


def load_search_index_chn(path, db: StandardDatabase):
    with gzip.open(path) as f:
        print(f"\nLoading file index data Chinese...")
        index_data = json.load(f)
        print(f"\nInserting file index data Chinese into DB...")
        collection = db.collection(COLLECTION_SEARCH_INDEX_CHN)
        chunksize = 10000
        for i in tqdm(range(0, len(index_data), chunksize)):
            collection.insert_many(index_data[i : i + chunksize])
        print(f"\nDone loading index data Chn...")

        print("\nDone creating View for Chinese")


def create_analyzers(db: StandardDatabase):
    db.create_analyzer(
        name=TIBETAN_ANALYZER,
        analyzer_type="text",
        properties={
            "locale": "en.utf-8",
            "stopwords": [],
            "accent": False,
            "stemming": False,
        },
        features=["position", "norm", "frequency"],
    )
    db.create_analyzer(
        name=TIBETAN_FUZZY_ANALYZER,
        analyzer_type="text",
        properties={
            "locale": "en.utf-8",
            "stopwords": tib_stopwords_list,
            "accent": False,
            "stemming": False,
        },
        features=["position", "norm", "frequency"],
    )

    db.create_analyzer(
        name=SANSKRIT_ANALYZER,
        analyzer_type="text",
        properties={
            "locale": "en.utf-8",
            "case": "none",
            "stopwords": skt_stopwords_list,
            "accent": True,
            "stemming": False,
        },
        features=["position", "norm", "frequency"],
    )

    db.create_analyzer(
        name=PALI_ANALYZER,
        analyzer_type="text",
        properties={
            "locale": "en.utf-8",
            "case": "none",
            "stopwords": pli_stopwords_list,
            "accent": True,
            "stemming": False,
        },
        features=["position", "norm", "frequency"],
    )
    
    
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
