from invoke import task
from pyArango.connection import *

from constants import DB_NAME, COLLECTION_NAMES, DEFAULT_SOURCE_URL
from data_parser import get_db_connection, populate_all_collections_from_menu_files


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
    try:
        for name in collections:
            db.createCollection(name=name)
    except CreationError as e:
        print("Error creating collection: ", e)
    print(f"created {collections} collections")


@task
def clean_collections(c):
    """
    Clear the database collections completely.

    :param c: invoke.py context object
    :return: None
    """
    db = get_db_connection()[DB_NAME]
    for name in COLLECTION_NAMES:
        db[name].empty()
    print("all collections cleaned.")


@task(clean_collections)
def load_source_files(c, root_url=DEFAULT_SOURCE_URL, threads=1):
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

    populate_all_collections_from_menu_files(root_url, threads)

    print("Data loading completed.")
