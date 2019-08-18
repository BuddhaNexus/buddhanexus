import gzip
import io
import os
from urllib.request import urlopen

import urlfetch
from pyArango.connection import *
from tqdm import trange
from joblib import Parallel as ParallelJobRunner, delayed

from constants import COLLECTION_PARALLELS, COLLECTION_SEGMENTS, COLLECTION_FILES
from models_dataloader import Parallel, Segment, MenuItem
from utils import get_remote_bytes, get_db_connection, get_database


def load_parallels_into_db(json_parallels: [Parallel], connection: Connection) -> None:
    """
    Given an array of parallel objects, load them all into the `parallels` collection

    :param json_parallels: Array of parallel objects to be loaded as-they-are.
    :param connection: ArangoDB connection object
    """
    collection = connection[COLLECTION_PARALLELS]
    for parallel in json_parallels:
        doc = collection.createDocument()
        doc._key = parallel["id"]
        doc.set(parallel)
        try:
            doc.save()
        except CreationError as e:
            print(f"Could not save parallel {parallel}. Error: ", e)


def load_segment_into_db(json_segment: Segment, connection: Connection) -> str:
    """
    Given a single segment object, load it into the `segments` collection.

    :param json_segment: Segment JSON data
    :param connection: ArangoDB database object
    :return: Segment nr
    """
    collection = connection[COLLECTION_SEGMENTS]
    doc = collection.createDocument()
    try:
        doc._key = json_segment["segnr"]
        doc["segnr"] = json_segment["segnr"]
        doc["segtext"] = json_segment["segtext"]
        doc["lang"] = json_segment["lang"]
        doc["position"] = json_segment["position"]
    except KeyError as e:
        print("Could not load segment. Error: ", e)

    try:
        doc.save()
    except CreationError as e:
        print(f"Could not save segment {doc._key}. Error: ", e)

    return json_segment["segnr"]


def load_segments_into_db(segments: list, connection: Connection) -> list:
    """ Returns list of segment numbers. """
    segmentnrs = []
    for segment in segments:
        segmentnr = load_segment_into_db(segment, connection)
        segmentnrs.append(segmentnr)

    return segmentnrs


def load_file_into_db(file: MenuItem, segmentnrs: list, connection: Connection):
    collection = connection[COLLECTION_FILES]
    doc = collection.createDocument()
    doc._key = file["filename"]
    doc.set(file)
    doc["segmentnrs"] = segmentnrs
    doc.save()


def parse_gzipfile(file_url: str) -> list:
    """
    Given a url to a .gz file:
    1. Download the file
    2. Unpack in memory
    3. Extract segments and parallels
    4. Load into appropriate collections

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


def get_menu_file(url: str) -> [MenuItem]:
    with urlopen(url) as file:
        return json.loads(file.read().decode())


def load_menu_item(menu_item, lang: str, root_url: str) -> None:
    file_url = f"{root_url}{lang}/{menu_item['filename']}.json.gz"

    if not should_download_file(lang, menu_item["filename"]):
        return

    db = get_database()
    print("Loading file: ", menu_item["filename"])

    if not file_url.endswith("gz"):
        print(f"{file_url} is not a gzip file. Ignoring.")
        return

    [segments, parallels] = parse_gzipfile(file_url)
    segmentnrs = []
    if segments:
        segmentnrs = load_segments_into_db(segments, db)
    load_file_into_db(menu_item, segmentnrs, db)
    load_parallels_into_db(parallels, db)


def should_download_file(file_lang: str, file_name: str) -> bool:
    """
    (temporary) Limit source file set size to speed up loading process
    Can be controlled with the `LIMIT` environment variable.
    """

    # if language == "chn" and file_name.startswith("T01_T0082"):
    #     return True
    if file_lang == "tib" and file_name.startswith("T06"):
        return True
    else:
        return False


# def load_dir_file(dir_url, dir_files, threads):
#     """
#     Invoke
#
#     :param dir_url:
#     :param dir_files:
#     :param threads:
#     :return:
#     """
#     try:
#         if threads == 1:
#             [
#                 load_gzipfile_into_db(f"{dir_url}{dir_files[i].name}")
#                 for i in trange(len(dir_files))
#             ]
#         else:
#             ParallelJobRunner(n_jobs=threads)(
#                 delayed(
#                     lambda i: load_gzipfile_into_db(f"{dir_url}{dir_files[i].name}")
#                 )(i)
#                 for i in trange(len(dir_files))
#             )
#     except ConnectionError as e:
#         print("Connection Error: ", e)
