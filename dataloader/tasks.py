import os
import gzip
from arango import (
    DatabaseCreateError,
    CollectionCreateError,
    CollectionDeleteError,
    GraphDeleteError,
)
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
)

from segments_parallels import (
    load_segment_data_from_menu_files,
    create_indices,
    calculate_parallel_totals
)

from global_search_function import (
    load_search_index_skt_pli,
    load_search_index_tib,
    load_search_index_chn,
    create_analyzers,
    clean_analyzers
)

from menu import (
    load_all_menu_collections,
    load_all_menu_categories,
    create_collections_categories_graph
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
def load_segment_files(c, root_url=DEFAULT_SOURCE_URL, threaded=False):
    """
    Download, parse and load source data into database collections.

    :param c: invoke.py context object
    :param root_url: URL to the server where source files are stored
    :param threaded: If dataloading should use multithreading. Uses n-1 threads, where n = system hyperthreaded cpu count.
    """
    thread_count = os.cpu_count() - 15
    print(
        f"Loading source files from {root_url} using {f'{thread_count} threads' if threaded else '1 thread'}."
    )

    load_segment_data_from_menu_files(root_url, thread_count if threaded else 1)

    print("Segment data loading completed.")

@task
def build_search_index(c, index_url_skt_pli=DEFAULT_SOURCE_URL + "/search_index_sanskrit_pali.json.gz",
                       index_url_tib=DEFAULT_SOURCE_URL + "/search_index_tibetan.json.gz",
                       index_url_chn=DEFAULT_SOURCE_URL + "/search_index_chn.json.gz"):
    """
    Load index data for search index from path defined in .env.
    """
    db = get_database()
    create_analyzers(db)
    collections = INDEX_COLLECTION_NAMES
    for name in collections:
        db.create_collection(name)
    load_search_index_skt_pli(index_url_skt_pli,db)
    load_search_index_chn(index_url_chn,db)
    load_search_index_tib(index_url_tib,db)
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
    clean_analyzers(db)
    print("search index cleaned.")
    

@task
def clean_all_collections(c):
    """
    Clear all the database collections completely.

    :param c: invoke.py context object
    """
    db = get_database()
    try:
        clean_menu_collections(c)
        for name in COLLECTION_NAMES:
            db.delete_collection(name)
        for name in EDGE_COLLECTION_NAMES:
            db.delete_collection(name)
        db.delete_graph(GRAPH_COLLECTIONS_CATEGORIES)
    except CollectionDeleteError as e:
        print("Error deleting collection %s: " % name, e)
    except GraphDeleteError:
        print("couldn't remove graph. It probably doesn't exist.")

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
    for name in (
        COLLECTION_MENU_COLLECTIONS,
        COLLECTION_MENU_CATEGORIES,
        COLLECTION_LANGUAGES,
        EDGE_COLLECTION_LANGUAGE_HAS_COLLECTIONS,
        EDGE_COLLECTION_COLLECTION_HAS_CATEGORIES,
        EDGE_COLLECTION_CATEGORY_HAS_FILES,
    ):
        try:
            db.delete_collection(name)
        except CollectionDeleteError:
            print("couldn't remove object. It probably doesn't exist.")
    try:
        db.delete_graph(GRAPH_COLLECTIONS_CATEGORIES)
    except GraphDeleteError:
        print("couldn't remove object. It probably doesn't exist.")

    print("menu data collections cleaned.")


@task()
def load_menu_files(c):
    create_collections(
        c,
        [COLLECTION_MENU_COLLECTIONS, COLLECTION_MENU_CATEGORIES, COLLECTION_LANGUAGES],
    )
    print(
        "Loading menu files into database collections from inside this git repository. "
    )
    db = get_database()

    load_all_menu_categories(db)
    load_all_menu_collections(db)
    create_collections_categories_graph(db)

    print("Menu data loading completed.")


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
