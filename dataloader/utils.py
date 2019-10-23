import gzip
import io
import json
import os

import urlfetch
from pyArango.connection import Connection
from tqdm import trange
from joblib import Parallel as ParallelJobRunner, delayed

from constants import DB_NAME, LANG_PALI, LANG_TIBETAN, LANG_CHINESE


def get_db_connection() -> Connection:
    """ Get database connection """
    return Connection(
        username=os.environ["ARANGO_USER"],
        password=os.environ["ARANGO_ROOT_PASSWORD"],
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


def should_download_file(file_lang: str, file_name: str) -> bool:
    """
    Limit source file set size to speed up loading process
    Can be controlled with the `LIMIT` environment variable.
    """
    # if file_lang == LANG_PALI and file_name.startswith("dn"):
    #     return True
    if file_lang == LANG_CHINESE and file_name.startswith("T300"):
        return True
    elif file_lang == LANG_TIBETAN:
        return True
    else:
        return False


def get_segments_and_parallels_from_gzipped_remote_file(file_url: str) -> list:
    """
    Given a url to a .gz file:
    1. Download the file
    2. Unpack it in memory
    3. Return segments and parallels

    :param file_url: URL to the gzipped file
    """
    file_bytes = get_remote_bytes(file_url)
    try:
        with gzip.open(file_bytes) as f:
            parsed = json.loads(f.read())
            segments, parallels = parsed
            f.close()
            return [segments, parallels]
    except OSError as os_error:
        print(f"Could not load the gzipped file {file_url}. Error: ", os_error)
        return [None, None]
