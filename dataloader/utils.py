import io
import os

import urlfetch
from pyArango.connection import Connection
from pyArango.database import Database

from constants import DB_NAME


def get_db_connection() -> Connection:
    """ Get database connection """
    return Connection(
        username=os.environ["ARANGO_USER"],
        password=os.environ["ARANGO_PASS"],
        arangoURL=f"http://{os.environ['ARANGO_HOST']}:{os.environ['ARANGO_PORT']}",
    )


def get_database() -> Connection:
    return get_db_connection()[DB_NAME]


def get_remote_bytes(file_url) -> io.BytesIO:
    """
    Download remote file and return its bytes object
    :param file_url: URL to the file
    :return:
    """
    result = urlfetch.fetch(file_url)
    return io.BytesIO(result.content)
