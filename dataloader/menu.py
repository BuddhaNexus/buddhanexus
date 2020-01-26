import json

from arango import DocumentInsertError, IndexCreateError
from arango.collection import StandardCollection, EdgeCollection
from arango.database import StandardDatabase

from dataloader_constants import (
    COLLECTION_MENU_COLLECTIONS,
    DEFAULT_LANGS,
    COLLECTION_MENU_CATEGORIES,
    EDGE_COLLECTION_COLLECTION_HAS_CATEGORIES,
    GRAPH_COLLECTIONS_CATEGORIES,
)


def create_edge_collection_has_categories(
    menu_collection: StandardCollection,
    edge_db_collection: EdgeCollection,
    language: str,
) -> None:
    for category_name in menu_collection["categories"]:
        edge_db_collection.insert(
            {
                "_from": f"{COLLECTION_MENU_COLLECTIONS}/{menu_collection['_key']}",
                "_to": f"{COLLECTION_MENU_CATEGORIES}/{language}_{category_name}",
            }
        )


def create_collections_categories_graph(db: StandardDatabase) -> None:
    graph = db.create_graph(GRAPH_COLLECTIONS_CATEGORIES)
    graph.create_edge_definition(
        edge_collection=EDGE_COLLECTION_COLLECTION_HAS_CATEGORIES,
        from_vertex_collections=[COLLECTION_MENU_COLLECTIONS],
        to_vertex_collections=[COLLECTION_MENU_CATEGORIES],
    )


def load_menu_collection(
    menu_collection: StandardCollection,
    language: str,
    collection_count: int,
    collections_db_collection: StandardCollection,
    edge_db_collection: EdgeCollection,
):
    doc = {
        "_key": f"{language}_{menu_collection['collection']}",
        "language": language,
        "collectionnr": collection_count,
    }
    doc.update(menu_collection)

    try:
        collections_db_collection.insert(doc)
        create_edge_collection_has_categories(doc, edge_db_collection, language)
    except DocumentInsertError as e:
        print("Could not load menu collection. Error: ", e)


def load_all_menu_collections(db: StandardDatabase):
    collections_db_collection = db.collection(COLLECTION_MENU_COLLECTIONS)
    edge_db_collection = db.collection(EDGE_COLLECTION_COLLECTION_HAS_CATEGORIES)
    for language in DEFAULT_LANGS:
        with open(f"../data/{language}-collections.json") as file:
            print(f"Loading menu collections in {language}...")
            collections = json.load(file)
            collection_count = 0
            for collection in collections:
                load_menu_collection(
                    collection,
                    language,
                    collection_count,
                    collections_db_collection,
                    edge_db_collection,
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
    doc.update(menu_category)
    try:
        categories_db_collection.insert(doc)
        categories_db_collection.add_hash_index(["category"], unique=False)
    except DocumentInsertError as e:
        print("Could not load menu category. Error: ", e)
    except IndexCreateError as e:
        print("Could create category index. Error: ", e)


def load_all_menu_categories(db: StandardDatabase):
    categories_db_collection = db.collection(COLLECTION_MENU_CATEGORIES)
    for language in DEFAULT_LANGS:
        with open(f"../data/{language}-categories.json") as f:
            print(f"Loading menu categories in {language}...")
            categories = json.load(f)
            category_count = 0
            for category in categories:
                load_menu_category(
                    category, category_count, language, categories_db_collection
                )
                category_count += 1
            print("✓")
