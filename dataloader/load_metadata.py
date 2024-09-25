"""
This file contains the code to load the complete metadata from the metadata files into the database.
"""

import pandas as pd
from typing import List
from arango.database import StandardDatabase
from dataloader_constants import COLLECTION_FILES, COLLECTION_CATEGORY_NAMES
from utils import (
    should_download_file,
    get_language_from_file_name,
    get_filename_from_segmentnr,
)


def load_metadata_from_files(paths: List[str], db: StandardDatabase) -> None:
    """
    Load metadata from JSON files into the database.

    Args:
    paths (List[str]): List of file paths to load metadata from.
    db (StandardDatabase): Database instance to load data into.
    """
    collection = db.collection(COLLECTION_FILES)

    for path in paths:
        try:
            print(f"Loading metadata from {path}...")
            df = pd.read_json(path)
            df["filename"] = df["filename"].apply(
                get_filename_from_segmentnr
            )  # this is to remove duplicate parts of the same file
            df = df.drop_duplicates(subset=["filename"])
            df = df[
                ["filename", "displayName", "category", "collection", "textname"]
            ]  # metadata might contain more data; we are only interested in these columns
            df["lang"] = df["filename"].apply(get_language_from_file_name)
            df["filenr"] = df.index
            df["segment_keys"] = df["filenr"].apply(lambda x: [])
            # df['_id'] = df['filename']
            df_dict = df.to_dict("records")
            print("created dict")
            collection.import_bulk(df.to_dict("records"))
            print(f"Loaded {len(df)} metadata entries from {path}.")
        except Exception as e:
            print(f"Error loading metadata from {path}: {str(e)}")

    collection.add_hash_index(fields=["filename"], unique=True)
    collection.add_hash_index(fields=["category"], unique=False)
    collection.add_hash_index(fields=["collection"], unique=False)
    collection.add_hash_index(fields=["lang"], unique=False)


def load_category_names(paths: List[str], db: StandardDatabase) -> None:
    """
    Load category names from JSON files into the database.

    Args:
    paths (List[str]): List of file paths to load category names from.
    db (StandardDatabase): Database instance to load data into.
    """
    collection = db.collection(COLLECTION_CATEGORY_NAMES)

    for path in paths:
        try:
            df = pd.read_json(path)
            df["lang"] = get_language_from_file_name(path)
            collection.import_bulk(df.to_dict("records"))
            print(f"Loaded {len(df)} category names from {path}.")

        except Exception as e:
            print(f"Error loading category names from {path}: {str(e)}")

    collection.add_hash_index(fields=["category"], unique=False)
