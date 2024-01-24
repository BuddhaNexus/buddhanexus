"""
Utility methods for interacting with the database
"""

import os

from pyArango.collection import Collection
from pyArango.connection import Connection, Database

DB_NAME = os.environ["ARANGO_BASE_DB_NAME"]

def get_db() -> Database:
    """
    Returns database instance
    """
    return Connection(
        username=os.environ["ARANGO_USER"],
        password=os.environ["ARANGO_ROOT_PASSWORD"],
        arangoURL=f"http://{os.environ['ARANGO_HOST']}:{os.environ['ARANGO_PORT']}",
    )[DB_NAME]


def get_collection(collection_name) -> Collection:
    """
    Returns single collection from the database
    """
    return get_db()[collection_name]
