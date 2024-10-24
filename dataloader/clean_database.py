from arango import (
    DatabaseCreateError,
    CollectionCreateError,
    CollectionDeleteError,
    GraphDeleteError,
)
from arango.database import StandardDatabase
from tqdm import tqdm as tqdm

from global_search import clean_analyzers

from dataloader_constants import (
    COLLECTION_NAMES,
    INDEX_COLLECTION_NAMES,
    INDEX_VIEW_NAMES,
    COLLECTION_SEGMENTS,
    COLLECTION_PARALLELS,
    COLLECTION_PARALLELS_SORTED_BY_FILE,
    COLLECTION_FILES,
    COLLECTION_LANGUAGES,
    GLOBAL_STATS_CATEGORIES,
    GLOBAL_STATS_FILES,
)

from utils import get_database, get_system_database


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
    except GraphDeleteError as e:
        print("couldn't remove graph. It probably doesn't exist.", e)

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


def clean_segment_collections_db():
    """
    Clear the segment database collections completely.
    """
    db = get_database()
    for name in (
        COLLECTION_SEGMENTS,
        COLLECTION_PARALLELS,
        COLLECTION_FILES,
        COLLECTION_FILES_PARALLEL_COUNT,
    ):
        empty_collection(name, db)
    print("segment collections cleaned.")


def clean_metadata_db():
    """
    Clear the metadata database collections completely.
    """
    db = get_database()
    db.delete_collection(COLLECTION_METADATA)
    print("metadata data collection cleaned.")


def clean_all_lang_db(current_lang):
    print("Cleaning data for language", current_lang)
    db = get_database()

    segments_collection = db.collection(COLLECTION_SEGMENTS)
    segments_collection.delete_match({"lang": current_lang})

    parallels_collection = db.collection(COLLECTION_PARALLELS)
    parallels_collection.delete_match({"src_lang": current_lang})

    parallels_sorted_collection = db.collection(COLLECTION_PARALLELS_SORTED_BY_FILE)
    parallels_sorted_collection.delete_match({"lang": current_lang})

    menu_categories_collection = db.collection(COLLECTION_MENU_CATEGORIES)
    menu_categories_collection.delete_match({"language": current_lang})

    menu_collections_collection = db.collection(COLLECTION_MENU_COLLECTIONS)
    menu_collections_collection.delete_match({"language": current_lang})

    parallels_count_collection = db.collection(COLLECTION_FILES_PARALLEL_COUNT)
    parallels_count_collection.delete_match({"language": current_lang})

    files_collection = db.collection(COLLECTION_FILES)
    files_collection.delete_match({"language": current_lang})
    print("Cleaning data done.")


def clean_paralels_lang_db(current_lang):
    print("Cleaning data for language", current_lang)
    db = get_database()

    parallels_collection = db.collection(COLLECTION_PARALLELS)
    parallels_collection.delete_match({"src_lang": current_lang})

    parallels_sorted_collection = db.collection(COLLECTION_PARALLELS_SORTED_BY_FILE)
    parallels_sorted_collection.delete_match({"lang": current_lang})

    parallels_count_collection = db.collection(COLLECTION_FILES_PARALLEL_COUNT)
    parallels_count_collection.delete_match({"language": current_lang})

    print("Cleaning data done.")
