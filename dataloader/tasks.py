import os
from pyArango.connection import *
from invoke import task


@task
def createdb(c, docs=False, bytecode=False, extra=""):
    print("creating database: texts")
    conn = Connection(
        username=os.environ["ARANGO_USER"],
        password=os.environ["ARANGO_PASS"],
        arangoURL=f"http://{os.environ['ARANGO_HOST']}:{os.environ['ARANGO_PORT']}",
    )
    db = conn.createDatabase(name="texts")
    print("created 'texts' database")
    pali_collection = db.createCollection(name="Pali")
    print("created Pali collection")
