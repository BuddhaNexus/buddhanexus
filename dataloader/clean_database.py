from arango import CollectionDeleteError

from global_search import clean_analyzers

from dataloader_constants import (
    COLLECTION_NAMES,
    INDEX_COLLECTION_NAMES,
    INDEX_VIEW_NAMES,
    GLOBAL_STATS_CATEGORIES,
    GLOBAL_STATS_FILES,
)

from utils import get_database


def clean_search_index_db():
    """
    Clear all the search index views and collections.
    """
    db = get_database()
    try:
        for name in INDEX_COLLECTION_NAMES:
            if db.has_collection(name):
                db.delete_collection(name)
        for name in INDEX_VIEW_NAMES:
            if name in db.views():
                db.delete_view(name)
    except CollectionDeleteError as e:
        print("Error deleting collection %s: " % name, e)
    clean_analyzers(db)
    print("search index cleaned.")


def clean_all_collections_db():
    """
    Clear all the database collections completely.
    """
    db = get_database()
    current_name = ""
    try:
        for name in COLLECTION_NAMES:
            current_name = name
            print("deleting collection", name)
            db.delete_collection(name)
    except CollectionDeleteError as e:
        print("Error deleting collection %s: " % current_name, e)

    print("all collections cleaned.")


def clean_global_stats_db():
    """
    Clear global stats data
    """
    db = get_database()
    db.delete_collection(GLOBAL_STATS_CATEGORIES)
    db.create_collection(GLOBAL_STATS_CATEGORIES)
    db.delete_collection(GLOBAL_STATS_FILES)
    db.create_collection(GLOBAL_STATS_FILES)
    print("global stats data cleaned.")
