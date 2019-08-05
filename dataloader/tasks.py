import os
from json import JSONDecodeError
import json

from pyArango.connection import *
from invoke import task

from models import Segment

DB_NAME = "buddha-nexus"


def get_db_connection():
    return Connection(
        username=os.environ["ARANGO_USER"],
        password=os.environ["ARANGO_PASS"],
        arangoURL=f"http://{os.environ['ARANGO_HOST']}:{os.environ['ARANGO_PORT']}",
    )


def load_segment_to_db(json_data: Segment):
    db = get_db_connection()[DB_NAME]
    segment_lang = json_data["lang"]
    collection = db[segment_lang]
    doc = collection.createDocument()
    doc["segmentnr"] = json_data["segmentnr"]
    doc["segment"] = json_data["segment"]
    doc["parallels"] = json_data["parallels"]
    doc.save()
    print("Saved collection for segment: ", json_data["segment"])


@task
def create_db(c):
    try:
        conn = get_db_connection()
        conn.createDatabase(name=DB_NAME)
        print(f"created {DB_NAME} database")
    except CreationError as e:
        print("Error creating the database: ", e)


@task()
def create_collections(c, langs=("chn", "skt", "tib")):
    db = get_db_connection()[DB_NAME]
    try:
        for lang in langs:
            db.createCollection(name=lang)
    except CreationError as e:
        print("Error creating collection: ", e)
    print(f"created {langs} collections")


@task
def load_segments(c, path="./example.json"):
    db = get_db_connection()["texts"]
    with open(path, "r") as f:
        try:
            data = json.loads(f.read())
            for segment in data:
                load_segment_to_db(segment)
        except JSONDecodeError:
            print("Error loading the segment in file: ", path)
