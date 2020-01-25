import os

from arango import DatabaseCreateError, CollectionCreateError
from invoke import task

from dataloader_constants import (
    DB_NAME,
    COLLECTION_NAMES,
    DEFAULT_SOURCE_URL,
    COLLECTION_SEGMENTS,
    COLLECTION_PARALLELS,
    COLLECTION_FILES,
    COLLECTION_MENU_COLLECTIONS,
    COLLECTION_MENU_CATEGORIES,
    COLLECTION_FILES_PARALLEL_COUNT,
    EDGE_COLLECTION_NAMES,
    COLLECTION_CATEGORIES_PARALLEL_COUNT,
)
from loader import (
    load_segment_data_from_menu_files,
    load_all_menu_collections,
    load_all_menu_categories,
    calculate_parallel_totals,
)
from dataloader_utils import get_database, get_system_database


@task
def create_db(c):
    """
    Create empty database with name specified in the .env file

    :param c: invoke.py context object
    """
    try:
        sys_db = get_system_database()
        sys_db.create_database(DB_NAME)
        print(f"created {DB_NAME} database")
    except DatabaseCreateError as e:
        print("Error creating the database: ", e)


@task(help={"collections": "Array of collections you'd like to create"})
def create_collections(
    c, collections=COLLECTION_NAMES, edge_collections=EDGE_COLLECTION_NAMES
):
    """
    Create empty collections in database

    :param c: invoke.py context object
    :param collections: Array of collection names to be created
    :param edge_collections: Array of edge collection names to be created
    """
    db = get_database()
    for name in collections:
        try:
            db.create_collection(name)
        except CollectionCreateError as e:
            print("Error creating collection: ", e)
    for name in edge_collections:
        try:
            db.create_collection(name, edge=True)
        except CollectionCreateError as e:
            print("Error creating edge collection: ", e)
    print(f"created {collections} collections")


@task
def clean_all_collections(c):
    """
    Clear all the database collections completely.

    :param c: invoke.py context object
    """
    db = get_database()
    for name in COLLECTION_NAMES:
        db.delete_collection(name)
    print("all collections cleaned.")


@task
def clean_totals_collection(c):
    """
    Clear the categories_parallel_count collection

    :param c: invoke.py context object
    """
    db = get_database()
    db.delete_collection(COLLECTION_CATEGORIES_PARALLEL_COUNT)
    print("totals collection cleaned.")


@task
def clean_segment_collections(c):
    """
    Clear the segment database collections completely.

    :param c: invoke.py context object
    """
    db = get_database()
    for name in (
        COLLECTION_SEGMENTS,
        COLLECTION_PARALLELS,
        COLLECTION_FILES,
        COLLECTION_FILES_PARALLEL_COUNT,
    ):
        db.delete_collection(name)
    print("segment collections cleaned.")


@task
def clean_menu_collections(c):
    """
    Clear the menu database collections completely.

    :param c: invoke.py context object
    """
    db = get_database()
    for name in (COLLECTION_MENU_COLLECTIONS, COLLECTION_MENU_CATEGORIES):
        db.delete_collection(name)
    print("menu data collections cleaned.")


@task
def load_segment_files(c, root_url=DEFAULT_SOURCE_URL, threaded=False):
    """
    Download, parse and load source data into database collections.

    :param c: invoke.py context object
    :param root_url: URL to the server where source files are stored
    :param threaded: If dataloading should use multithreading. Uses n-1 threads, where n = system hyperthreaded cpu count.
    """
    thread_count = os.cpu_count() - 1
    print(
        f"Loading source files from {root_url} using {f'{thread_count} threads' if threaded else '1 thread'}."
    )

    load_segment_data_from_menu_files(root_url, thread_count if threaded else 1)

    print("Segment data loading completed.")


@task()
def load_menu_files(c):
    print(
        "Loading menu files into database collections from inside this git repository. "
    )
    db = get_database()

    load_all_menu_collections(db)
    load_all_menu_categories(db)

    print("Menu data loading completed.")


@task
def calculate_collection_totals(c):
    print("Calculating collection totals from loaded data")
    calculate_parallel_totals()

    print("Parallel totals calculation completed.")
