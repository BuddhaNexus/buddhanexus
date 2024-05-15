import json
import os
import gzip
import sys
from tqdm import tqdm as tqdm
from arango import DocumentInsertError, IndexCreateError

from dataloader_constants import (
    GLOBAL_STATS_CATEGORIES,
    GLOBAL_STATS_FILES,
)


def load_global_stats_for_language(folder, lang, db):
    """
    global stats are precalculated and fount at json/{lang}/stats/global_stats.json
    :param lang: language code
    :param db: ArangoDB connection object
    :param number_of_threads: Number of threads to use for parallel loading
    """
    db_collection_categories = db.collection(GLOBAL_STATS_CATEGORIES)
    db_collection_files = db.collection(GLOBAL_STATS_FILES)
    global_stats_file = f"{folder}/{lang}/stats/global_stats.json.gz"
    with gzip.open(global_stats_file, "r") as f:
        global_stats = json.load(f)
    try:
        print(global_stats.keys())
        # insert global stats into the database based on the keys in categories and files
        for key in tqdm(global_stats["collections"]):
            db_collection_categories.insert(
                {"_key": key, "lang": lang, "stats": global_stats["collections"][key]}
            )
        for key in tqdm(global_stats["files"]):
            db_collection_files.insert(
                {"_key": key, "lang": lang, "stats": global_stats["files"][key]}
            )
    except DocumentInsertError as e:
        print(f"Error inserting global stats for {lang}: {e}")
        return False
    return True
