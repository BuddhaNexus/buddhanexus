import os
from arango import (
    DatabaseCreateError,
    CollectionCreateError,
    CollectionDeleteError,
    GraphDeleteError,
)
from arango.database import StandardDatabase
from invoke import task

from dataloader_constants import (
    DB_NAME,
    COLLECTION_NAMES,
    INDEX_COLLECTION_NAMES,
    INDEX_VIEW_NAMES,
    DEFAULT_SOURCE_URL,
    COLLECTION_SEGMENTS,
    COLLECTION_PARALLELS,
    COLLECTION_FILES,
    COLLECTION_MENU_COLLECTIONS,
    COLLECTION_MENU_CATEGORIES,
    COLLECTION_FILES_PARALLEL_COUNT,
    EDGE_COLLECTION_NAMES,
    COLLECTION_CATEGORIES_PARALLEL_COUNT,
    EDGE_COLLECTION_COLLECTION_HAS_CATEGORIES,
    GRAPH_COLLECTIONS_CATEGORIES,
    COLLECTION_LANGUAGES,
    EDGE_COLLECTION_LANGUAGE_HAS_COLLECTIONS,
    EDGE_COLLECTION_CATEGORY_HAS_FILES,
    GRAPH_FILES_SEGMENTS,
    GRAPH_FILES_PARALLELS,
    EDGE_COLLECTION_FILE_HAS_SEGMENTS,
    EDGE_COLLECTION_SEGMENT_HAS_PARALLELS,
)
from tasks_segments_parallels import (
    load_segment_data_from_menu_files,
    create_indices,
    load_search_index,
    load_search_index_chn,
    calculate_parallel_totals,
)
from tasks_menu import (
    load_all_menu_collections,
    load_all_menu_categories,
    create_collections_categories_graph,
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
            print(f"Error creating collection {name}: ", e)
    for name in edge_collections:
        try:
            db.create_collection(name, edge=True)
        except CollectionCreateError as e:
            print("Error creating edge collection: ", e)
    print(f"created {collections} collections")


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


@task
def build_search_index(
    c,
    index_url=DEFAULT_SOURCE_URL + "/search_index.json.gz",
    index_url_chn=DEFAULT_SOURCE_URL + "/search_index_chn.json.gz",
):
    """
    Load index data for search index from path defined in .env.
    """
    db = get_database()
    collections = INDEX_COLLECTION_NAMES
    for name in collections:
        db.create_collection(name)
    load_search_index(index_url, db)
    load_search_index_chn(index_url_chn, db)
    print("Search index data loading completed.")


@task
def clean_search_index(c):
    """
    Clear all the search index views and collections.
    :param c: invoke.py context object
    """
    db = get_database()
    try:
        for name in INDEX_COLLECTION_NAMES:
            db.delete_collection(name)
        for name in INDEX_VIEW_NAMES:
            db.delete_view(name)

    except CollectionDeleteError as e:
        print("Error deleting collection %s: " % name, e)

    print("search index cleaned.")


@task
def clean_all_collections(c):
    """
    Clear all the database collections completely.

    :param c: invoke.py context object
    """
    db = get_database()
    current_name = ""
    try:
        for name in COLLECTION_NAMES:
            current_name = name
            db.delete_collection(name)
        for name in EDGE_COLLECTION_NAMES:
            current_name = name
            db.delete_collection(name)
        db.delete_graph(GRAPH_COLLECTIONS_CATEGORIES)
        db.delete_graph(GRAPH_FILES_SEGMENTS)
        db.delete_graph(GRAPH_FILES_PARALLELS)
    except CollectionDeleteError as e:
        print("Error deleting collection %s: " % current_name, e)
    except GraphDeleteError as e:
        print("couldn't remove graph. It probably doesn't exist.", e)

    print("all collections cleaned.")


@task
def clean_totals_collection(c):
    """
    Clear the categories_parallel_count collection

    :param c: invoke.py context object
    """
    db = get_database()
    db.delete_collection(COLLECTION_CATEGORIES_PARALLEL_COUNT)
    db.create_collection(COLLECTION_CATEGORIES_PARALLEL_COUNT)
    print("totals collection cleaned.")


def empty_collection(collection_name: str, db: StandardDatabase, edge: bool = False):
    try:
        db.delete_collection(collection_name)
        db.create_collection(collection_name, edge=edge)
    except CollectionDeleteError:
        print(
            f"couldn't remove collection: {collection_name}. It probably doesn't exist."
        )
    except CollectionCreateError:
        print(f"couldn't create collection: {collection_name}")


@task
def clean_segment_collections(c):
    """
    Clear the segment database collections completely.

    :param c: invoke.py context object
    """
    db = get_database()

    try:
        db.delete_graph(GRAPH_FILES_SEGMENTS)
        db.delete_graph(GRAPH_FILES_PARALLELS)
        for name in (
            COLLECTION_SEGMENTS,
            COLLECTION_PARALLELS,
            COLLECTION_FILES,
            COLLECTION_FILES_PARALLEL_COUNT,
        ):
            empty_collection(name, db)
        for name in (
            EDGE_COLLECTION_FILE_HAS_SEGMENTS,
            EDGE_COLLECTION_SEGMENT_HAS_PARALLELS,
        ):
            empty_collection(name, db, edge=True)
    except (GraphDeleteError, CollectionDeleteError):
        print(
            f"couldn't remove graph: {GRAPH_FILES_SEGMENTS}. It probably doesn't exist."
        )
    print("segment collections cleaned.")


@task
def clean_menu_collections(c):
    """
    Clear the menu database collections completely.

    :param c: invoke.py context object
    """
    db = get_database()
    try:
        db.delete_graph(GRAPH_COLLECTIONS_CATEGORIES)
        for name in (
            COLLECTION_MENU_COLLECTIONS,
            COLLECTION_MENU_CATEGORIES,
            COLLECTION_LANGUAGES,
        ):
            empty_collection(name, db)
        for name in (
            EDGE_COLLECTION_LANGUAGE_HAS_COLLECTIONS,
            EDGE_COLLECTION_COLLECTION_HAS_CATEGORIES,
            EDGE_COLLECTION_CATEGORY_HAS_FILES,
        ):
            empty_collection(name, db, edge=True)
    except (GraphDeleteError, CollectionDeleteError):
        print(
            f"couldn't remove object {GRAPH_COLLECTIONS_CATEGORIES}. It probably doesn't exist."
        )
    print("menu data collections cleaned.")


@task()
def load_menu_files(c):
    print("Loading menu collections...")
    db = get_database()
    load_all_menu_categories(db)
    load_all_menu_collections(db)
    create_collections_categories_graph(db)

    print("Menu data loading completed!")


@task
def add_indicies(c):
    db = get_database()
    print("Creating Indices")
    create_indices(db)
    print("Creation of indices done.")


@task
def calculate_collection_totals(c):
    print("Calculating collection totals from loaded data")
    calculate_parallel_totals()

    print("Parallel totals calculation completed.")
