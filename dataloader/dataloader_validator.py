from pathlib import Path
import json
from jsonschema import validate
from jsonschema.exceptions import ValidationError
from argparse import ArgumentParser
import os

METADATA_ROOT = "../data/"
METADATA_SCHEMAS = METADATA_ROOT + "schemas/"


def validate_json(schema_path, doc_path):
    with open(Path(schema_path)) as f:
        schema = json.load(f)

    with open(Path(doc_path)) as f:
        doc = json.load(f)

    try:
        validate(instance=doc, schema=schema)
        print(f"Validating {doc_path}: OK")
        return True
    except ValidationError as e:
        print(e.message)
        print(f"ERROR: failed to validate collection: {doc_path}: ")
        return False


def main(args):
    data_path = args.metadatapath if args.metadatapath else METADATA_ROOT
    data_path = Path(data_path)
    print(os.getcwd())
    schemas_path = Path(METADATA_SCHEMAS)

    schemas = schemas_path.glob("*")
    for schema in schemas:
        suffix = schema.name
        docs = data_path.glob(f"*-{suffix}")
        for doc in docs:
            validate_json(schema, doc)


if __name__ == "__main__":

    parser = ArgumentParser()
    parser.add_argument(
        "--metadatapath",
    )
    args = parser.parse_args()
    main(args)
