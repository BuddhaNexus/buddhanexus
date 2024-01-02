"""
This code loads the segments for the files into the database.
"""

from collections import defaultdict
import os 
import natsort
import multiprocessing
import pandas as pd 
from tqdm import tqdm as tqdm
from arango.database import StandardDatabase

from dataloader_constants import (
    COLLECTION_SEARCH_INDEX_TIB,
    COLLECTION_SEARCH_INDEX_SKT,
    COLLECTION_SEARCH_INDEX_PLI,
    COLLECTION_SEARCH_INDEX_CHN,
    SKT_TSV_DATA_PATH,
    PLI_TSV_DATA_PATH,
    TIB_TSV_DATA_PATH,
    CHN_TSV_DATA_PATH,
    COLLECTION_SEGMENTS,
    COLLECTION_FILES,
)

from utils import (
    get_cat_from_segmentnr, 
    get_language_from_file_name,
    check_if_collection_exists, 
    get_database, 
    should_download_file
)

from folios import get_folios_from_segment_keys

def sliding_window(data_list, window_size=3):
    """Generates sliding windows from a list."""
    return [data_list[i:i+window_size] for i in range(len(data_list) - window_size + 1)]

def get_filename_from_segmentnr(segmentnr):
    return segmentnr.split(":")[0]

def process_file_group_helper(args):
    loader_instance, file_group = args
    for file in file_group:
        loader_instance._process_file(file)

class LoadSegmentsBase:
    SEARCH_COLLECTION_NAME: str
    DATA_PATH: str
    def _load_segments(self, file_df, db) -> None:        
        segments = [
            {"_key": segnr,
            "segnr": segnr, 
             "segtext": original,
             "language": self.LANG}
            for segnr, original in zip(file_df["segmentnr"], file_df["original"])
        ]        
        db.collection(COLLECTION_SEGMENTS).delete_many({"language": self.LANG})
        db.collection(COLLECTION_SEGMENTS).insert_many(segments)
        db.collection(COLLECTION_SEGMENTS).add_hash_index(fields=["segnr", "language"])

        segnrs = [segment["segnr"] for segment in segments]
        filename = get_filename_from_segmentnr(segnrs[0])
        # hack as this filename breaks the DB 
        if "K12D0505B" in filename:
            return
        # check if filename is in collection
        current_file = db.collection(COLLECTION_FILES).get(filename)
        if current_file:
            current_file['segment_keys'] += segnrs
            db.collection(COLLECTION_FILES).update(current_file)
        else:
            db.collection(COLLECTION_FILES).insert(
                {"_key": filename, 
                 "filename": filename, 
                 "segment_keys": segnrs})
        

    def _load_segments_to_search_index(self, file_df, db) -> None:
        """
        Loads the segments to the search index, which are separate lists that use a sliding window of 3 segments to enable search queries that are longer than one sentence. 
        """
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
                    "language": self.LANG,
                }
            )
        db.collection(self.SEARCH_COLLECTION_NAME).delete_many({"language": self.LANG})

        db.collection(self.SEARCH_COLLECTION_NAME).insert_many(search_index_entries)
        
        db.collection(self.SEARCH_COLLECTION_NAME).add_hash_index(fields=["segment_nr", "language"])
        
    def _process_file(self, file):
        db = get_database()
        file_df = pd.read_csv(os.path.join(self.DATA_PATH, file), sep="\t")
        self._load_segments(file_df, db)
        self._load_segments_to_search_index(file_df, db)

    def load(self, number_of_threads: int = 1) -> None:        
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
                if file.endswith(".tsv") and should_download_file(file):
                    category = get_cat_from_segmentnr(file)
                    category_files[category].append(file)
                    if number_of_threads == 1:
                        self._process_file(file)

        # Process the grouped files
        if number_of_threads > 1:
            with multiprocessing.Pool(number_of_threads) as pool:
                
                file_groups = list(category_files.values())
                pool.map(process_file_group_helper, [(self, file_group) for file_group in file_groups])
        # for reasons beyound my ability to comprehend, the multihtreaded version is broken and throws a strange 'request missing' error 
        else:
            for file_group in tqdm(list(category_files.values())):
                process_file_group_helper((self, file_group))
        print("DONE LOADING DATA")
        self._sort_segnrs()
        

    def _sort_segnrs(self):
        db = get_database()
        print("\nSorting segment numbers...")
        collection_segments = db.collection(COLLECTION_SEGMENTS)
        collection_files = db.collection(COLLECTION_FILES)
        files = {}    
        segments = collection_segments.find({"language": self.LANG})
        for segment in tqdm(segments):
            filename = get_filename_from_segmentnr(segment["segnr"])            
            if filename not in files:
                files[filename] = []
            files[filename].append(segment["segnr"])    
        for filename in tqdm(files):
            files[filename] = natsort.natsorted(files[filename])        
            lang = get_language_from_file_name(filename)
            folios = get_folios_from_segment_keys(files[filename], lang)     
            print(filename)           
            file = collection_files.get(filename)
            # this is a hack since arango doesn't permit [] in keys; we need to fix the data!
            if not "=[" in filename:
                if file:            
                    file["segment_keys"] = files[filename]
                    file['language'] = lang
                    file['folios'] = folios            
                    collection_files.update(file)
                else:
                    print(f"Could not find file {filename} in db.")
                    file = {"_key": filename, 
                            "filename": filename,  
                            "language": lang,
                            "folios": folios,                    
                            "segment_keys": files[filename]}
                    collection_files.insert(file)
        print("Done sorting segment numbers.")


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




        
