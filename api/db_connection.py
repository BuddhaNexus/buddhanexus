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
        username=os.environ["ARANGO_USER_API"],
        password=os.environ["ARANGO_ROOT_PASSWORD_API"],
        arangoURL=f"http://{os.environ['ARANGO_HOST_API']}:{os.environ['ARANGO_PORT_API']}",
    )[DB_NAME]


def get_collection(collection_name) -> Collection:
    """
    Returns single collection from the database
    """
    return get_db()[collection_name]
