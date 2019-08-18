import io
import os
import gzip

from joblib import Parallel as ParallelJobRunner, delayed

import urlfetch
import htmllistparse
from tqdm import trange
from invoke import task
from pyArango.connection import *

from db_collections import COLLECTION_NAMES, COLLECTION_SEGMENTS, COLLECTION_PARALLELS
from models import Segment, Parallel


DB_NAME = os.environ["ARANGO_BASE_DB_NAME"]
DEFAULT_SOURCE_URL = os.environ["SOURCE_FILES_URL"]

DEFAULT_LANGS = ("chn", "skt", "tib")


def get_db_connection():
    return Connection(
        username=os.environ["ARANGO_USER"],
        password=os.environ["ARANGO_PASS"],
        arangoURL=f"http://{os.environ['ARANGO_HOST']}:{os.environ['ARANGO_PORT']}",
    )


@task
def create_db(c):
    try:
        conn = get_db_connection()
        conn.createDatabase(name=DB_NAME)
        print(f"created {DB_NAME} database")
    except CreationError as e:
        print("Error creating the database: ", e)


@task()
def create_collections(c, collections=COLLECTION_NAMES):
    db = get_db_connection()[DB_NAME]
    try:
        for name in collections:
            db.createCollection(name=name)
    except CreationError as e:
        print("Error creating collection: ", e)
    print(f"created {collections} collections")


@task
def clean_collections(c):
    db = get_db_connection()[DB_NAME]
    for name in COLLECTION_NAMES:
        db[name].empty()
    print("all collections cleaned.")


def load_parallels_to_db(json_parallels: [Parallel], connection: Connection) -> None:
    collection = connection[COLLECTION_PARALLELS]
    for parallel in json_parallels:
        doc = collection.createDocument()
        doc._key = parallel["id"]
        doc.set(parallel)
        try:
            doc.save()
        except CreationError as e:
            print(f"Could not save parallel {parallel}. Error: ", e)


def load_segment_to_db(json_segment: Segment, connection: Connection) -> None:
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


def load_gzipfile_into_db(dir_url, file_name):
    file_url = f"{dir_url}{file_name}"
    if not file_url.endswith("gz"):
        print(f"{file_name} is not a gzip file. Ignoring.")
        return
    result = urlfetch.fetch(file_url)
    file_stream = io.BytesIO(result.content)

    with gzip.open(file_stream) as f:
        parsed = json.loads(f.read())
        segments, parallels = parsed
        db = get_db_connection()[DB_NAME]
        for segment in segments:
            load_segment_to_db(segment, db)
        load_parallels_to_db(parallels, db)
        f.close()


def load_dir_file(dir_url, dir_files, threads):
    try:
        if threads == 1:
            [
                load_gzipfile_into_db(dir_url, dir_files[i].name)
                for i in trange(len(dir_files))
            ]
        else:
            ParallelJobRunner(n_jobs=threads)(
                delayed(lambda i: load_gzipfile_into_db(dir_url, dir_files[i].name))(i)
                for i in trange(len(dir_files))
            )
    except ConnectionError as e:
        print("Connection Error: ", e)


# Temporary limit to speed up file loading:
def should_download_file(language, file_name):
    # if language == "chn" and file_name.startswith("T01_T0082"):
    #     return True
    if language == "tib" and file_name.startswith("T06"):
        return True
    else:
        return False


@task(clean_collections)
def load_source_files(c, url=DEFAULT_SOURCE_URL, threads=1):
    print(
        f"Loading source files from {url} using {threads} {'threads' if threads > 1 else 'thread'}."
    )
    cwd, listing = htmllistparse.fetch_listing(url, timeout=30)
    for directory in listing:
        print(f"loading {directory.name} files:")
        dir_url = f"{url}{directory.name}"
        _, dir_files = htmllistparse.fetch_listing(dir_url, timeout=30)

        filtered_files = (
            [
                file
                for file in dir_files
                if should_download_file(directory.name[:3], file.name)
            ]
            if os.environ["TESTING_LIMIT"]
            else dir_files
        )

        load_dir_file(dir_url, filtered_files, threads)
        print("Data loading completed.")
