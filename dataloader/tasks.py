import io
import os
import gzip

from joblib import Parallel, delayed

import urlfetch
import htmllistparse
from tqdm import trange
from invoke import task
from pyArango.connection import *

from models import Segment

DB_NAME = "buddha-nexus"
DEFAULT_LANGS = ("chn", "skt", "tib")
DEFAULT_SOURCE_URL = "http://buddhist-db.de/vimala/suttas/"


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
def create_collections(c, langs=DEFAULT_LANGS):
    db = get_db_connection()[DB_NAME]
    try:
        for lang in langs:
            db.createCollection(name=lang)
    except CreationError as e:
        print("Error creating collection: ", e)
    print(f"created {langs} collections")


@task
def clean_collections(c):
    db = get_db_connection()[DB_NAME]
    for lang in DEFAULT_LANGS:
        db[lang].empty()
    print("all collections cleaned.")


def load_segment_to_db(json_data: Segment):
    db = get_db_connection()[DB_NAME]
    segment_lang = json_data["lang"]
    collection = db[segment_lang]
    doc = collection.createDocument()
    doc["segmentnr"] = json_data["segmentnr"]
    doc["segment"] = json_data["segment"]
    doc["parallels"] = json_data["parallels"]
    doc.save()


def load_gzipfile_into_db(dir_url, file_name):
    file_url = f"{dir_url}{file_name}"
    if not file_url.endswith("gz"):
        return
    result = urlfetch.fetch(file_url)
    file_stream = io.BytesIO(result.content)
    with gzip.open(file_stream) as f:
        parsed = json.loads(f.read())
        for segment in parsed:
            load_segment_to_db(segment)
        f.close()


def load_dir_file(dir_url, dir_files, threads):
    try:
        if threads == 1:
            [
                load_gzipfile_into_db(dir_url, dir_files[i].name)
                for i in trange(len(dir_files))
            ]
        else:
            Parallel(n_jobs=threads)(
                delayed(lambda i: load_gzipfile_into_db(dir_url, dir_files[i].name))(i)
                for i in trange(len(dir_files))
            )
    except ConnectionError as e:
        print("Connection Error: ", e)


# Temporary limit to speed up file loading:
def should_download_file(language, file_name):
    if language == "chn" and file_name.startswith("T31"):
        return True
    elif language == "tib" and file_name.startswith("T06"):
        return True
    else:
        return False


@task(clean_collections)
def load_source_files(c, url=DEFAULT_SOURCE_URL, threads=1):
    print(f"Loading source files from {url} using {threads} threads.")
    cwd, listing = htmllistparse.fetch_listing(url, timeout=30)
    for directory in listing:
        print(f"loading {directory.name} files:")
        dir_url = f"{url}{directory.name}"
        _, dir_files = htmllistparse.fetch_listing(dir_url, timeout=30)

        # Todo remove testing filter
        filtered_files = [file for file in dir_files if should_download_file(directory.name[:3], file.name)]

        load_dir_file(dir_url, filtered_files, threads)
