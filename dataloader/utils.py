"""
Utilities for interacting with the database and other tasks
"""

from arango import ArangoClient
from arango.database import StandardDatabase

from dataloader_constants import (
    DB_NAME,
    ARANGO_USER,
    ARANGO_PASSWORD,
    ARANGO_HOST,
)


def get_arango_client() -> ArangoClient:
    """Get Arango Client instance"""
    return ArangoClient(hosts=ARANGO_HOST)


def get_system_database() -> StandardDatabase:
    """Return system database instance"""
    client = get_arango_client()
    return client.db("_system", username=ARANGO_USER, password=ARANGO_PASSWORD)


def get_database() -> StandardDatabase:
    """Return buddhanexus database instance"""
    client = get_arango_client()
    return client.db(DB_NAME, username=ARANGO_USER, password=ARANGO_PASSWORD)


def sliding_window(data_list, window_size=3):
    """Generates sliding windows from a list."""
    return [
        data_list[i : i + window_size] for i in range(len(data_list) - window_size + 1)
    ]


def should_download_file(filename: str) -> bool:
    """
    Limit source file set size to speed up loading process
    Can be controlled with the `LIMIT` environment variable.
    """
    # if "T06" in filename:
    return True


def check_if_collection_exists(db, collection_name):
    collections = db.collections()
    for collection in collections:
        if collection["name"] == collection_name:
            return True


def check_if_view_exists(db, view_name):
    views = db.views()
    for view in views:
        if view["name"] == view_name:
            return True
