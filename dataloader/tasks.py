from invoke import task
from pyArango.connection import *

from constants import (
    DB_NAME,
    COLLECTION_NAMES,
    DEFAULT_SOURCE_URL,
    COLLECTION_SEGMENTS,
    COLLECTION_PARALLELS,
    COLLECTION_FILES,
    COLLECTION_MENU_COLLECTIONS,
    COLLECTION_MENU_CATEGORIES,
)
from data_parser import (
    populate_collections_from_menu_files,
    populate_menu_collections,
    populate_menu_categories,
)
from utils import get_db_connection


@task
def create_db(c):
    """
    Create empty database with name specified in the .env file

    :param c: invoke.py context object
    :return: None
    """
    try:
        conn = get_db_connection()
        conn.createDatabase(name=DB_NAME)
        print(f"created {DB_NAME} database")
    except CreationError as e:
        print("Error creating the database: ", e)


@task(help={"collections": "Array of collections you'd like to create"})
def create_collections(c, collections=COLLECTION_NAMES):
    """
    Create empty collections in database

    :param c: invoke.py context object
    :param collections: Array of collection names to be created
    :return: None
    """
    db = get_db_connection()[DB_NAME]
    for name in collections:
        try:
            db.createCollection(name=name)
        except CreationError as e:
            print("Error creating collection: ", e)
    print(f"created {collections} collections")


@task
def clean_all_collections(c):
    """
    Clear all the database collections completely.

    :param c: invoke.py context object
    :return: None
    """
    db = get_db_connection()[DB_NAME]
    for name in COLLECTION_NAMES:
        db[name].empty()
    print("all collections cleaned.")


@task
def clean_segment_collections(c):
    """
    Clear the segment database collections completely.

    :param c: invoke.py context object
    :return: None
    """
    db = get_db_connection()[DB_NAME]
    for name in (COLLECTION_SEGMENTS, COLLECTION_PARALLELS, COLLECTION_FILES):
        db[name].empty()
    print("segment collections cleaned.")


@task
def clean_menu_collections(c):
    """
    Clear the menu database collections completely.

    :param c: invoke.py context object
    :return: None
    """
    db = get_db_connection()[DB_NAME]
    for name in (COLLECTION_MENU_COLLECTIONS, COLLECTION_MENU_CATEGORIES):
        db[name].empty()
    print("menu data collections cleaned.")


@task(clean_segment_collections)
def load_segment_source_files(c, root_url=DEFAULT_SOURCE_URL, threads=1):
    """
    Download, parse and load source data into database collections.

    :param c: invoke.py context object
    :param root_url: URL to the server where source files are stored
    :param threads: Number of CPU threads to use when loading the source
    :return: None
    """
    print(
        f"Loading source files from {root_url} using {threads} {'threads' if threads > 1 else 'thread'}."
    )

    populate_collections_from_menu_files(root_url, threads)

    print("Segment data loading completed.")


@task(clean_menu_collections)
def load_menu_files(c):
    print(
        "Loading menu files into database collections from inside this git repository. "
    )
    populate_menu_collections()
    populate_menu_categories()

    print("Menu data loading completed.")
