from arango.database import StandardDatabase
from collections import defaultdict
import os 
import multiprocessing
import gzip
import pandas as pd 
import natsort
from tqdm import tqdm as tqdm
from dataloader_constants import (
    COLLECTION_SEARCH_INDEX_TIB,
    COLLECTION_SEARCH_INDEX_SKT,
    COLLECTION_SEARCH_INDEX_PLI,
    COLLECTION_SEARCH_INDEX_CHN,
    COLLECTION_FILES,
    SKT_TSV_DATA_PATH,
    PLI_TSV_DATA_PATH,
    TIB_TSV_DATA_PATH,
    CHN_TSV_DATA_PATH,
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
    COLLECTION_SEGMENTS,
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

def sliding_window(data_list, window_size=3):
    """Generates sliding windows from a list."""
    return [data_list[i:i+window_size] for i in range(len(data_list) - window_size + 1)]

def get_filename_from_segmentnr(segmentnr):
    return segmentnr.split(":")[0]

tib_stopwords_list = get_stopwords_list("../data/tib_stopwords.txt")
skt_stopwords_list = get_stopwords_list("../data/skt_stopwords.txt")
pli_stopwords_list = get_stopwords_list("../data/pli_stopwords.txt")

def process_file_group_helper(args):
    loader_instance, file_group = args
    for file in file_group:
        loader_instance._process_file(file)

class LoadSegmentsBase:
    SEARCH_COLLECTION_NAME: str
    DATA_PATH: str
    def _load_segments(self, file_df, db) -> None:        
        segments = [
            {"segnr": segnr, "segtext": original}
            for segnr, original in zip(file_df["segmentnr"], file_df["original"])
        ]        
        db.collection(COLLECTION_SEGMENTS).insert_many(segments)
        #segnrs = [segment["segnr"] for segment in segments]
        #filename = get_filename_from_segmentnr(segnrs[0])
        # check if filename is in collection
        #current_file = db.collection(COLLECTION_FILES).get(filename)
        #if current_file:            
        #    current_file['segment_keys'] += segnrs
        #    db.collection(COLLECTION_FILES).update(current_file)
        #else:
        #    db.collection(COLLECTION_FILES).insert(
        #        {"_key": filename, 
        #         "filename": filename, 
        #         "segment_keys": segnrs})
        

    def _load_segments_to_search_index(self, file_df, db) -> None:
        segmentnrs = sliding_window(file_df["segmentnr"].tolist(), 3)
        originals = sliding_window(file_df["original"].tolist(), 3)
        stems = sliding_window(file_df["stemmed"].tolist(), 3)
        search_index_entries = []
        for segnr, original, stem in zip(segmentnrs, originals, stems):
            if self.LANG == "chn":
                original = "".join(original)
                stem = "".join(stem)
            else:
                original = " ".join(original)
                stem = " ".join(stem)            
            category = get_cat_from_segmentnr(segnr[1])
            
            search_index_entries.append(
                {                    
                    "segment_nr": segnr,
                    "original": original,
                    "stemmed": stem,
                    "category": category,
                }
            )
        db.collection(self.SEARCH_COLLECTION_NAME).insert_many(search_index_entries)
        
    def _process_file(self, file):
        db = get_database()
        file_df = pd.read_csv(os.path.join(self.DATA_PATH, file), sep="\t")
        self._load_segments(file_df, db)
        self._load_segments_to_search_index(file_df, db)

    def load(self, number_of_threads: int = 1) -> None:
        # print existing collections        
        # only create collection if it does not exist
        db = get_database()
        if not check_if_collection_exists(db, self.SEARCH_COLLECTION_NAME):
            db.create_collection(self.SEARCH_COLLECTION_NAME)
        if not check_if_collection_exists(db, COLLECTION_SEGMENTS):
            db.create_collection(COLLECTION_SEGMENTS)
            db.collection(COLLECTION_SEGMENTS).add_hash_index(fields=["segnr"])

        category_files = defaultdict(list)
        if os.path.isdir(self.DATA_PATH):
            for file in os.listdir(self.DATA_PATH):
                if file.endswith(".tsv"):
                    category = get_cat_from_segmentnr(file)
                    print(category, file)
                    category_files[category].append(file)
                    if number_of_threads == 1:
                        self._process_file(file)

        # Process the grouped files
        if number_of_threads > 1:
            with multiprocessing.Pool(number_of_threads) as pool:
                # Adjusted this section
                file_groups = list(category_files.values())
                pool.map(process_file_group_helper, [(self, file_group) for file_group in file_groups])


        print("DONE LOADING DATA")


        


class LoadSegmentsSanskrit(LoadSegmentsBase):
    SEARCH_COLLECTION_NAME = COLLECTION_SEARCH_INDEX_SKT
    DATA_PATH = SKT_TSV_DATA_PATH
    LANG = "skt"    


class LoadSegmentsPali(LoadSegmentsBase):
    SEARCH_COLLECTION_NAME = COLLECTION_SEARCH_INDEX_PLI
    DATA_PATH = PLI_TSV_DATA_PATH
    LANG = "pli"


class LoadSegmentsTibetan(LoadSegmentsBase):
    SEARCH_COLLECTION_NAME = COLLECTION_SEARCH_INDEX_TIB
    DATA_PATH = TIB_TSV_DATA_PATH
    LANG = "tib"


class LoadSegmentsChinese(LoadSegmentsBase):
    SEARCH_COLLECTION_NAME = COLLECTION_SEARCH_INDEX_CHN
    DATA_PATH = CHN_TSV_DATA_PATH
    LANG = "chn"


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
