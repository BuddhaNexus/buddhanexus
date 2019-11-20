"""
Utilities for interacting with the database and other tasks
"""

import gzip
import io
import json
import os
import re

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
    """ Return database instance """
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
        for i in trange(len(items)):
            task(items[i])
    else:
        ParallelJobRunner(n_jobs=threads)(
            delayed(lambda i: task(items[i]))(i) for i in trange(len(items))
        )


def should_download_file(file_lang: str, file_name: str) -> bool:
    """
    Limit source file set size to speed up loading process
    Can be controlled with the `LIMIT` environment variable.
    """
    if file_lang == LANG_PALI and file_name.startswith("mn"):
        return True
    if file_lang == LANG_CHINESE and file_name.startswith('T31'):
        return True
    if file_lang == LANG_TIBETAN and file_name.startswith("T06TD402"):
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
            segments, parallels = parsed[:2]
            f.close()
            return [segments, parallels]
    except OSError as os_error:
        print(f"Could not load the gzipped file {file_url}. Error: ", os_error)
        return [None, None]


def get_segments_and_parallels_from_gzipped_local_file(file_path: str) -> list:
    """
    Give file path as parameter, then:
    1. Open file
    2. Unpack it in memory
    3. Return segments and parallels

    :param file_path: path to the gzipped file
    """

    try:
        with gzip.open(file_path, "rt") as f:
            parsed = json.loads(f.read())
            segments, parallels = parsed[:2]
            f.close()
            return [segments, parallels]
    except OSError as os_error:
        print(f"Could not load the gzipped local file {file_path}. Error: ", os_error)
        return [None, None]


def get_language_from_filename(filename):
    if re.search(r"(TD|acip|kl[0-9])", filename):
        return "tib"
    elif re.search(r"(_[TX])", filename):
        return "chn"
    else:
        return "pli"
