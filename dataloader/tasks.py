import os
from arango import (
    DatabaseCreateError,
    CollectionCreateError,
    CollectionDeleteError,
)

from invoke import task

from dataloader_constants import (
    DB_NAME,
    COLLECTION_NAMES,
    DEFAULT_MATCH_URL,
    LANG_TIBETAN,
    LANG_PALI,
    LANG_CHINESE,
    LANG_SANSKRIT,
    DEFAULT_LANGS,
    METADATA_URLS,
    CATEGORY_NAMES_URLS,
)

from load_segments import (
    LoadSegmentsSanskrit,
    LoadSegmentsPali,
    LoadSegmentsTibetan,
    LoadSegmentsChinese,
)

from global_search import (
    create_analyzers,
    create_search_views,
)

from load_parallels import (
    load_parallels_for_language,
    load_sorted_parallels_for_language,
    clean_parallels_for_language,
)

from load_stats import load_global_stats_for_language
from utils import get_database, get_system_database

from clean_database import (
    clean_search_index_db,
    clean_all_collections_db,
    clean_global_stats_db,
    clean_segment_collections_db,
)

from load_metadata import load_metadata_from_files, load_category_names

SEGMENT_LOADERS = {
    LANG_PALI: LoadSegmentsPali,
    LANG_TIBETAN: LoadSegmentsTibetan,
    LANG_CHINESE: LoadSegmentsChinese,
    LANG_SANSKRIT: LoadSegmentsSanskrit,
}


@task
def create_db(c):
    """
    Create empty database with name specified in the .env file

    am c: invoke.py context object
    """
    try:
        sys_db = get_system_database()
        sys_db.create_database(DB_NAME)
        print(f"created {DB_NAME} database")
    except DatabaseCreateError as e:
        print("Error creating the database: ", e)


@task(help={"collections": "Array of collections you'd like to create"})
def create_collections(c, collections=COLLECTION_NAMES):
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
    print(f"created {collections} collections")


@task
def load_metadata(c):
    """
    Load metadata from JSON files into the database.

    :param c: invoke.py context object
    """
    db = get_database()
    load_metadata_from_files(METADATA_URLS.values(), db)
    load_category_names(CATEGORY_NAMES_URLS.values(), db)


@task
def load_text_segments(c, lang=DEFAULT_LANGS, threaded=True):
    """
    Load texts and their segments into the database

    :param c: invoke.py context object
    :param root_url: URL to the server where source files are stored
    :param threaded: If dataloading should use multithreading. Uses n-1 threads, where n = system hyperthreaded cpu count.
    """
    db = get_database()

    number_of_threads = 1
    if threaded:
        number_of_threads = os.cpu_count() - 1
    # this is a hack to work around the way parameters are passed via invoke
    if lang != DEFAULT_LANGS:
        lang = ["".join(lang)]

    for l in lang:
        print("LANG: ", l)
        SegmentLoaderClass = SEGMENT_LOADERS.get(l)
        if SegmentLoaderClass:
            loader = SegmentLoaderClass()
            loader.load(number_of_threads=number_of_threads)
    print("Segment data loading completed.")
    print("Creating analyzers and search views...")
    create_analyzers(db)
    create_search_views(db, lang)
    print("Analyzers and search views created.")


@task
def clean_text_segments(c, lang=DEFAULT_LANGS):
    """
    Clear the text segments from the database

    :param c: invoke.py context object
    """
    db = get_database()
    if lang != DEFAULT_LANGS:
        lang = ["".join(lang)]
    for l in lang:
        print("CLeaning segments for language: ", l)
        SegmentLoaderClass = SEGMENT_LOADERS.get(l)
        if SegmentLoaderClass:
            loader = SegmentLoaderClass()
            loader.clean()
            print("Text segment data cleaned for language ", l)


@task
def load_parallels(c, root_url=DEFAULT_MATCH_URL, lang=DEFAULT_LANGS, threaded=True):
    thread_count = os.cpu_count()
    if lang != DEFAULT_LANGS:
        lang = ["".join(lang)]
    print(
        f"Loading parallel files from {root_url} using {f'{thread_count} threads' if threaded else '1 thread'}."
    )
    db = get_database()
    for clang in lang:
        print("LANG: ", clang)
        load_parallels_for_language(
            root_url, clang, db, thread_count if threaded else 1
        )
        load_sorted_parallels_for_language(root_url, clang, db)


@task
def clean_parallels(c, lang=DEFAULT_LANGS):
    db = get_database()
    if lang != DEFAULT_LANGS:
        lang = ["".join(lang)]
    for l in lang:
        clean_parallels_for_language(l, db)
        print("Parallel data cleaned for language ", l)


@task
def load_global_stats(c, root_url=DEFAULT_MATCH_URL, lang=DEFAULT_LANGS):
    db = get_database()
    if lang != DEFAULT_LANGS:
        lang = ["".join(lang)]
    for l in lang:
        print("Loading global stats for language: ", l)
        load_global_stats_for_language(root_url, l, db)
        print("Global stats loaded for language ", l)


@task
def clean_global_stats(c):
    clean_global_stats_db()


# Is this still needed????
@task
def clean_search_index(c):
    """
    Clear all the search index views and collections.
    :param c: invoke.py context object
    """
    clean_search_index_db()


@task
def clean_all_collections(c):
    """
    Clear all the database collections completely.

    :param c: invoke.py context object
    """
    clean_all_collections_db()


# Is this still needed???
@task
def clean_totals_collection(c):
    """
    Clear the categories_parallel_count collection

    :param c: invoke.py context object
    """
    clean_totals_collection_db()


# Is this still needed???
@task
def clean_segment_collections(c):
    """
    Clear the segment database collections completely.

    :param c: invoke.py context object
    """
    clean_segment_collections_db()
