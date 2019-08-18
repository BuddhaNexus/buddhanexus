import io
import os

import urlfetch
from pyArango.connection import Connection
from pyArango.database import Database
from tqdm import trange
from joblib import Parallel as ParallelJobRunner, delayed

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


def execute_in_parallel(task, items, threads) -> None:
    """
    Execute arbitrary function over a collection of items in parallel or synchronously.

    :param task: Function to invoke
    :param items: Items to iterate over, item will be passed as argument to function
    :param threads: number of CPU threads to spawn
    """
    if threads == 1:
        [task(items[i]) for i in trange(len(items))]
    else:
        ParallelJobRunner(n_jobs=threads)(
            delayed(lambda i: task(items[i]))(i) for i in trange(len(items))
        )
