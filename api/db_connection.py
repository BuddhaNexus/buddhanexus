import os

from pyArango.collection import Collection
from pyArango.connection import *

DB_NAME = os.environ["ARANGO_BASE_DB_NAME"]


def get_db() -> Database:
    return Connection(
        username=os.environ["ARANGO_USER"],
        password=os.environ["ARANGO_PASS"],
        arangoURL=f"http://{os.environ['ARANGO_HOST']}:{os.environ['ARANGO_PORT']}",
    )[DB_NAME]


def get_collection(name) -> Collection:
    return get_db()[name]
