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
    DEFAULT_SOURCE_URL,
    DEFAULT_TSV_URL,
    LANG_TIBETAN,
    LANG_PALI,
    LANG_CHINESE,
    LANG_SANSKRIT,
    DEFAULT_LANGS,
)

from load_segments import (
    LoadSegmentsSanskrit,
    LoadSegmentsPali,
    LoadSegmentsTibetan,
    LoadSegmentsChinese,
)

from global_search import (
    create_analyzers,
    clean_analyzers,
    create_search_views,
)

from load_parallels import (
    load_parallels_for_language,
    load_sorted_parallels_for_language,
    clean_parallels_for_language
)

from load_stats import load_global_stats_for_language

from tasks_menu import (
    load_all_menu_collections,
    load_all_menu_categories,
)

from utils import get_database, get_system_database

from clean_database import (
    clean_search_index_db,
    clean_all_collections_db,
    clean_global_stats_db,
    clean_segment_collections_db,
    clean_menu_collections_db,
    clean_all_lang_db,
)

from load_texts import load_text_data_from_menu_files

SEGMENT_LOADERS = {
        "skt": LoadSegmentsSanskrit,
        "pli": LoadSegmentsPali,
        "tib": LoadSegmentsTibetan,
        "chn": LoadSegmentsChinese,
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
def create_collections(
    c, collections=COLLECTION_NAMES
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
    print(f"created {collections} collections")


@task
def load_text_segments(c, root_url=DEFAULT_TSV_URL, lang=DEFAULT_LANGS, threaded=True):
    """
    Load texts and their segments into the database

    :param c: invoke.py context object
    :param root_url: URL to the server where source files are stored
    :param threaded: If dataloading should use multithreading. Uses n-1 threads, where n = system hyperthreaded cpu count.
    """
    db = get_database()
    number_of_threads = os.cpu_count()
    # this is a hack to work around the way parameters are passed via invoke
    if lang != DEFAULT_LANGS:
        lang = ["".join(lang)]
    print(
        f"Loading source files from {root_url} using {f'{number_of_threads} threads' if threaded else '1 thread'}."
    )

    load_text_data_from_menu_files(lang, db)
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
def load_parallels(c, root_url=DEFAULT_SOURCE_URL, lang=DEFAULT_LANGS, threaded=True):
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
def load_global_stats(c, root_url=DEFAULT_SOURCE_URL, lang=DEFAULT_LANGS):
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



@task
def load_multi_files(c, root_url=DEFAULT_SOURCE_URL, threaded=False):
    """
    Download, parse and load multilingual data into database collections.

    :param c: invoke.py context object
    :param root_url: URL to the server where source files are stored
    :param threaded: If dataloading should use multithreading. Uses n-1 threads, where n = system hyperthreaded cpu count.
    """
    thread_count = 1  # os.cpu_count() - 1
    # this is a hack to work around the way parameters are passed via invoke
    load_multilingual_parallels(root_url, thread_count if threaded else 1)
    print("Multi-lingual data loading completed.")


@task
def clean_multi_data(c):
    """
    Clear the multilingual data from the database

    :param c: invoke.py context object
    """
    clean_multi()


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


def clean_pali(c):
    """
    Clear all the pali data from the database.
    :param c: invoke.py context object
    """
    db = get_database()
    current_name = ""
    try:
        for name in COLLECTION_NAMES:
            current_name = name
            db.delete_collection(name)
    except CollectionDeleteError as e:
        print("Error deleting collection %s: " % current_name, e)

    print("all collections cleaned.")


@task
def clean_totals_collection(c):
    """
    Clear the categories_parallel_count collection

    :param c: invoke.py context object
    """
    clean_totals_collection_db()


@task
def clean_segment_collections(c):
    """
    Clear the segment database collections completely.

    :param c: invoke.py context object
    """
    clean_segment_collections_db()


@task
def clean_menu_collections(c):
    """
    Clear the menu database collections completely.

    :param c: invoke.py context object
    """
    clean_menu_collections_db()


@task
def clean_tibetan(c):
    """
    Clear tibetan segments collections completely.

    :param c: invoke.py context object
    """
    clean_all_lang_db(LANG_TIBETAN)


@task
def clean_sanskrit(c):
    """
    Clear sanskrit segments collections completely.

    :param c: invoke.py context object
    """
    clean_all_lang_db(LANG_SANSKRIT)


@task
def clean_pali(c):
    """
    Clear pali segments collections completely.

    :param c: invoke.py context object
    """
    clean_all_lang_db(LANG_PALI)


@task
def clean_chinese(c):
    """
    Clear chinese segments collections completely.

    :param c: invoke.py context object
    """
    clean_all_lang_db(LANG_CHINESE)


@task()
def load_menu_files(c):
    print("Loading menu collections...")
    db = get_database()
    load_all_menu_categories(db)
    load_all_menu_collections(db)
    

    print("Menu data loading completed!")


@task
def add_sources(c):
    db = get_database()
    print("adding source information")
    load_sources(db, DEFAULT_SOURCE_URL)


@task
def calculate_collection_totals(c):
    print("Calculating collection totals from loaded data")
    calculate_parallel_totals()

    print("Parallel totals calculation completed.")
