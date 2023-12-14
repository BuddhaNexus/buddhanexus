from arango.database import StandardDatabase
import json 
from dataloader_constants import COLLECTION_FILES, COLLECTION_SEGMENTS
from dataloader_utils import should_download_file, get_filename_from_segmentnr, get_cat_from_segmentnr
import natsort
from tqdm import tqdm
import os
import re
import sys

PACKAGE_PARENT = ".."
SCRIPT_DIR = os.path.dirname(
    os.path.realpath(os.path.join(os.getcwd(), os.path.expanduser(__file__)))
)
sys.path.append(os.path.normpath(os.path.join(SCRIPT_DIR, PACKAGE_PARENT)))
from api.utils import get_language_from_file_name


def get_folios_from_segment_keys(segment_keys, lang):
    folios = []
    if lang == "chn":
        last_num = ""
        for segment_key in segment_keys:
            num = segment_key.split("_")[1].split(":")[0]
            if num != last_num:
                folios.append({"num": num, "segment_nr": segment_key})
                last_num = num
    elif lang == "tib":
        last_num = ""
        for segment_key in segment_keys:
            num = segment_key.split(":")[1].split("-")[0]
            if num != last_num:
                folios.append({"num": num, "segment_nr": segment_key})
                last_num = num
    elif lang == "pli":
        last_num = ""
        for segment_key in segment_keys:
            num = segment_key.split(":")[1].split(".")[0].split("_")[0]
            if re.search(r"^(anya|tika|atk)", segment_key):
                if num.endswith("0") and num != last_num:
                    folios.append({"num": num, "segment_nr": segment_key})
                    last_num = num
            else:
                if num != last_num:
                    folios.append({"num": num, "segment_nr": segment_key})
                    last_num = num
    elif lang == "skt":
        last_num = ""
        for segment_key in segment_keys:
            if re.search(r"^(K14dhppat|K10udanav|K10uvs)", segment_key):
                num = segment_key.split(":")[1].split("_")[1]
                if num != last_num:
                    folios.append({"num": num, "segment_nr": segment_key})
                    last_num = num
            else:
                num = segment_key.split(":")[1].split(".")[0].split("_")[0]
                if num.endswith("0") and num != last_num:
                    folios.append({"num": num, "segment_nr": segment_key})
                    last_num = num

    return folios


def load_file_data_from_menu_files(langs: list, db: StandardDatabase):
    collection = db.collection(COLLECTION_FILES)
    for language in langs:
        with open(f"../data/{language}-files.json") as f:
            print(f"\nLoading segment data from menu files in {language}:...")
            files_data = json.load(f)
            filtered_file_data = [
                    file
                    for file in files_data
                    if should_download_file(language, file["filename"])
                ]
            
            filtered_file_data = [{**file, **{"_key": file["filename"]}} for file in filtered_file_data ]            
            filtered_file_data = [{**file, **{"segment_keys": []}} for file in filtered_file_data ]

            filtered_file_data = [{**file, **{"language": language}} for file in filtered_file_data ]

            collection.insert_many(filtered_file_data)
            print(f"Loaded {len(filtered_file_data)} files from {language}.")
    collection.add_hash_index(fields=["filename"], unique=True)
    collection.add_hash_index(fields=["category"], unique=False)

def sort_segnrs(db: StandardDatabase):
    print("\nSorting segment numbers...")
    collection_segments = db.collection(COLLECTION_SEGMENTS)
    collection_files = db.collection(COLLECTION_FILES)
    files = {}    
    for segment in tqdm(collection_segments.all()):
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
        if file:            
            file["segment_keys"] = files[filename]
            file['lang'] = lang
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


        

                        