"""
Utilities for interacting with the database and other tasks
"""

import gzip
import io
import json
import re

from arango import ArangoClient
from arango.database import StandardDatabase
import urlfetch
from tqdm import trange
from joblib import Parallel as ParallelJobRunner, delayed

from dataloader_constants import (
    DB_NAME,
    LANG_PALI,
    LANG_TIBETAN,
    LANG_SANSKRIT,
    LANG_CHINESE,
    LANG_ENGLISH,
    ARANGO_USER,
    ARANGO_PASSWORD,
    ARANGO_HOST,
    LANG_SANSKRIT,
)

def get_arango_client() -> ArangoClient:
    """ Get Arango Client instance """
    return ArangoClient(hosts=ARANGO_HOST)


def get_system_database() -> StandardDatabase:
    """ Return system database instance """
    client = get_arango_client()
    return client.db("_system", username=ARANGO_USER, password=ARANGO_PASSWORD)


def get_database() -> StandardDatabase:
    """ Return buddhanexus database instance """
    client = get_arango_client()
    return client.db(DB_NAME, username=ARANGO_USER, password=ARANGO_PASSWORD)


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
    t = trange(len(items), desc="Loading: ")
    if threads == 1:
        for i in t:
            desc = items[i]["displayName"]
            t.set_description("Loading: (%s)" % desc if desc else "...")
            task(items[i])
    else:

        def execute_task(i):
            desc = items[i]["displayName"]
            t.set_description("Loading: (%s)" % desc if desc else "...")
            task(items[i])

        ParallelJobRunner(n_jobs=threads)(
            delayed(lambda i: execute_task(i))(index) for index in t
        )


def should_download_file(file_lang: str, file_name: str) -> bool:
    """
    Limit source file set size to speed up loading process
    Can be controlled with the `LIMIT` environment variable.
    """
    # if file_lang == LANG_CHINESE:
    #     return True
    if file_lang == LANG_PALI and file_name.startswith('mn'):
        return True
    # if file_lang == LANG_SANSKRIT:
    #     return True
    # if file_lang == LANG_TIBETAN:
    #     return True
    if file_lang == LANG_ENGLISH and file_name.startswith('en-mn'):
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
    if "http" in file_url:
        file_bytes = get_remote_bytes(file_url)
    else:
        file_bytes = file_url
    try:
        with gzip.open(file_bytes) as f:
            parsed = json.loads(f.read())
            segments, parallels = parsed[:2]
            f.close()
            return [segments, parallels]
    except OSError as os_error:
        print(f"Could not load the gzipped file {file_url}. Error: ", os_error)
        return [None, None]


def get_collection_list_for_language(language, all_cols):
    total_collection_list = []
    for col in all_cols:
        if col["language"] == language:
            total_collection_list.append(col["collection"])
    return total_collection_list


def get_categories_for_language_collection(
    language_collection, query_collection_cursor
):
    for target in query_collection_cursor:
        if target["collection"] == language_collection:
            target_col_dict = {}
            for target_cat in target["categories"]:
                target_col_dict.update(target_cat)

            return target_col_dict


def get_language_name(language_key):
    if language_key == LANG_CHINESE:
        return "Chinese"
    elif language_key == LANG_TIBETAN:
        return "Tibetan"
    elif language_key == LANG_PALI:
        return "Pali"
    elif language_key == LANG_SANSKRIT:
        return "Sanskrit"
    elif language_key == LANG_ENGLISH:
        return "English"
    else:
        return "Unknown"


def atoi(text):
    return int(text) if text.isdigit() else text

def natural_keys(text):
    '''
        alist.sort(key=natural_keys) sorts in human order
        http://nedbatchelder.com/blog/200712/human_sorting.html
        (See Toothy's implementation in the comments)
        '''
    return [ atoi(c) for c in re.split(r'(\d+)', text) ]
