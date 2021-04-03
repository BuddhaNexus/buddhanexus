import multiprocessing
import json
import re
import os
import gzip 

from arango.database import StandardDatabase

from dataloader_constants import (
    COLLECTION_PARALLELS_MULTI,
    COLLECTION_SEGMENTS,
    COLLECTION_FILES
)

from dataloader_utils import (
    get_database
)

def should_download_file(filename):
    #if "D0543" in filename:
    return True


def load_multilingual_parallels(root_url: str, threads: int):
    """
    Iterates over all the files in json/multi and loads them into the a separate collection.
    """
    root_url = root_url + "multi/"
    filename_list = []
    for current_file in os.listdir(root_url):
        filename = os.fsdecode(current_file)
        if should_download_file(filename):
            filename_list.append(root_url + filename)
    pool = multiprocessing.Pool(processes=threads)
    pool.map(load_multilingual_file, filename_list)
    pool.close()

def update_filename(filename,tgt_lang,db):
    filename = re.sub("_[0-9][0-9][0-9]","",filename)
    """
    Adds the available languages to the file entry for menus etc.
    """
    db_file_collection = db.collection(COLLECTION_FILES)
    current_file = db_file_collection.get(filename)
    if 'available_lang' in current_file:
        current_file['available_lang'].append(tgt_lang)
    else:
        current_file['available_lang'] = [tgt_lang]
    db_file_collection.update(current_file)

def load_multilingual_file(filepath):
    db = get_database()
    db_multi_collection = db.collection(COLLECTION_PARALLELS_MULTI)
    db_segments_collection = db.collection(COLLECTION_SEGMENTS)

    print("Loading", filepath)
    with gzip.open(filepath, 'r') as current_file:
        json_data = json.load(current_file)
        if len(json_data) > 0:
            filename = json_data[0]['root_segnr'][0].split(':')[0]
            tgt_lang = json_data[0]['tgt_lang']
            update_filename(filename,tgt_lang,db)

            for parallel in json_data:
                parallel["_key"] = parallel["id"]
            try:
                db_multi_collection.insert_many(json_data)
            except (DocumentInsertError, IndexCreateError) as e:
                print(f"Could not save multilingual parallels. Error: ", e)    
            add_multi_parallels_to_segments(json_data, db_segments_collection)

        
def add_multi_parallels_to_segments(parallels, db_segments_collection):
    for parallel in parallels:
        for segment_nr in parallel['root_segnr']:
            current_doc = db_segments_collection.get(segment_nr)
            try: 
                if current_doc:
                    if 'parallel_ids_multi' in current_doc:
                        current_doc['parallel_ids_multi'].append(parallel['id'])
                        current_doc['parallel_ids_multi'] = list(dict.fromkeys(current_doc['parallel_ids_multi']))
                    else:
                        current_doc['parallel_ids_multi'] = [parallel['id']]
                    db_segments_collection.update(current_doc)
            except (KeyError, AttributeError) as e:
                print("Could not load multilingual parallels into segment. Error: ", e)
            except DocumentInsertError as e:
                print(f"Could not save multilingual segment {segment_nr}. Error: ", e)


def clean_multi():
    """
    Deletes the multilingual data from the db.
    """
    db = get_database()
    db.delete_collection(COLLECTION_PARALLELS_MULTI)
    db_file_collection = db.collection(COLLECTION_FILES)
    db_segments_collection = db.collection(COLLECTION_SEGMENTS)
    files = db_file_collection.all()
    for file in files:
        if "available_lang" in file:
            if len(file['available_lang']) > 0:
                segment_nrs = file['segment_keys']
                for segment_nr in segment_nrs:
                    current_doc = db_segments_collection.get(segment_nr)
                    try:
                        if current_doc:
                            current_doc['parallel_ids_multi'] = []
                            db_segments_collection.update(current_doc)
                    except (KeyError, AttributeError) as e:
                        print("Could not remove multilingual parallels from segment. Error: ", e)
                    except DocumentInsertError as e:
                        print(f"Could not remove multilingual segment {segment_nr}. Error: ", e)
                file['available_lang'] = []
                db_file_collection.update(file)
