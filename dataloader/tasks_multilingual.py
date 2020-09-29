import multiprocessing
import json
import os
import gzip 

from arango.database import StandardDatabase

from dataloader_constants import (
    COLLECTION_PARALLELS_MULTI,
    COLLECTION_SEGMENTS
)

from dataloader_utils import (
    get_database
)

def load_multilingual_parallels(root_url: str, threads: int):
    """
    Iterates over all the files in json/multi and loads them into the a separate collection.
    """
    root_url = root_url + "multi/"
    filename_list = []
    for current_file in os.listdir(root_url):
        filename = os.fsdecode(current_file)
        filename_list.append(root_url + filename)
    pool = multiprocessing.Pool(processes=threads)
    pool.map(load_multilingual_file, filename_list)
    pool.close()


def load_multilingual_file(filepath):
    db = get_database()
    db_multi_collection = db.collection(COLLECTION_PARALLELS_MULTI)
    db_segments_collection = db.collection(COLLECTION_SEGMENTS)
    print("Loading", filepath)
    with gzip.open(filepath, 'r') as current_file:
        json_data = json.load(current_file)
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
    Currently, the multilingual parallel ids remain attached to the segment-ids. 
    """
    db = get_database()
    db.delete_collection(COLLECTION_PARALLELS_MULTI)
