"""
This file contains the code to load the text metadata from the menu files into the database.
"""

from arango.database import StandardDatabase
import json
from dataloader_constants import COLLECTION_FILES, METADATA_DIR
from utils import (
    should_download_file
)
from api.utils import get_cat_from_segmentnr


def load_text_metadata_from_menu_files(langs: list, db: StandardDatabase):
    collection = db.collection(COLLECTION_FILES)
    for language in langs:
        with open(f"{METADATA_DIR}{language}-files.json") as f:
            print(f"\nLoading text meta data from menu files in {language}:...")
            files_data = json.load(f)
            filtered_file_data = [
                file for file in files_data if should_download_file(file["filename"])
            ]

            # add language attribute to each entry
            filtered_file_data = [
                {**file, **{"_key": file["filename"]}} for file in filtered_file_data
            ]
            filtered_file_data = [
                {**file, **{"segment_keys": []}} for file in filtered_file_data
            ]

            filtered_file_data = [
                {**file, **{"language": language}} for file in filtered_file_data
            ]

            # add category attribute to each entry
            filtered_file_data = [
                {**file, **{"category": get_cat_from_segmentnr(file["filename"])}}
                for file in filtered_file_data
            ]

            collection.insert_many(filtered_file_data)
            print(f"Loaded {len(filtered_file_data)} meta data from {language}.")

    collection.add_hash_index(fields=["filename"], unique=True)
    collection.add_hash_index(fields=["category"], unique=False)
