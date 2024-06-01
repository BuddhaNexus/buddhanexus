import json

from arango import DocumentInsertError, DocumentUpdateError, IndexCreateError
from arango.collection import StandardCollection, EdgeCollection
from arango.database import StandardDatabase

from utils import get_language_name
from dataloader_validator import validate_json, METADATA_DIR

from dataloader_constants import (
    COLLECTION_MENU_COLLECTIONS,
    DEFAULT_LANGS,
    COLLECTION_MENU_CATEGORIES,
    COLLECTION_LANGUAGES,
)


def load_menu_collection(
    menu_collection: dict,
    language: str,
    collection_count: int,
    collections_db_collection: StandardCollection,
):
    # Create document
    doc = {
        "_key": f"{language}_{menu_collection['collection']}",
        "language": language,
        "collectionnr": collection_count,
        "categories": menu_collection["categories"],
        "collection": menu_collection["collection"],
    }

    try:
        # Create vertex documents..
        collections_db_collection.insert(doc)

    except DocumentInsertError as e:
        print(doc["_key"])
        print("Could not load menu collection. Error: ", e)


def load_all_menu_collections(db: StandardDatabase):
    collections_db_collection = db.collection(COLLECTION_MENU_COLLECTIONS)
    languages_db_collection = db.collection(COLLECTION_LANGUAGES)
    # edge collections:

    for language in DEFAULT_LANGS:
        try:
            languages_db_collection.update(
                {"_key": language, "name": get_language_name(language)}
            )
        except DocumentUpdateError as e:
            languages_db_collection.insert(
                {"_key": language, "name": get_language_name(language)}
            )

        collections_filepath = (
            f"{METADATA_DIR}{language}-collections.json"  # TODO: no hardcoding
        )
        collections_schema = (
            f"{METADATA_DIR}/schemas/collections.json"  # TODO: no hardcoding
        )
        if not validate_json(
            collections_schema, collections_filepath
        ):  # TODO: no hardcoding
            return

        with open(collections_filepath) as file:
            print(f"Loading menu collections in {language}...")
            collections = json.load(file)
            collection_count = 0
            for collection in collections:
                load_menu_collection(
                    collection,
                    language,
                    collection_count,
                    collections_db_collection,
                )
                collection_count += 1
            print("✓")


def load_menu_category(
    menu_category, category_count, language, categories_db_collection
):
    doc = {
        "_key": f'{language}_{menu_category["category"]}',
        "language": language,
        "categorynr": category_count,
    }
    files = menu_category["files"]
    del menu_category["files"]
    doc.update(menu_category)
    try:
        categories_db_collection.insert(doc)
        categories_db_collection.add_hash_index(["category"], unique=False)

    except DocumentInsertError as e:
        print(f"Could not load menu category {menu_category['category']}. Error: ", e)
    except IndexCreateError as e:
        print("Could create category index. Error: ", e)


def load_all_menu_categories(db: StandardDatabase):
    categories_db_collection = db.collection(COLLECTION_MENU_CATEGORIES)
    for language in DEFAULT_LANGS:
        categories_filepath = (
            f"{METADATA_DIR}{language}-categories.json"  # TODO: no hardcoding
        )
        categories_schema = (
            f"{METADATA_DIR}/schemas/categories.json"  # TODO: no hardcoding
        )
        if not validate_json(categories_schema, categories_filepath):
            return
        with open(categories_filepath) as f:
            print(f"Loading menu categories in {language}...")
            categories = json.load(f)
            category_count = 0
            for category in categories:
                load_menu_category(
                    category,
                    category_count,
                    language,
                    categories_db_collection,
                )
                category_count += 1
            print("✓")
