from pathlib import Path
import json
from jsonschema import validate
from jsonschema.exceptions import ValidationError
from argparse import ArgumentParser


def validate_file(schema_path, doc_path):
    with open(schema_path) as f:
        schema = json.load(f)

    with open(doc_path) as f:
        doc = json.load(f)
        
    try:
        validate(instance=doc, schema=schema)
        print(f"Validating {doc_path}: ok")
    except ValidationError as e:
        print("failed: ", e.message)


def main(args):
    data_path = args.datapath
    data_path = Path(data_path)
    print(data_path)
    schemas_path = data_path / "schemas"

    schemas = schemas_path.glob("*.json")
    for schema in schemas:
        suffix = schema.name
        docs = data_path.glob(f"*-{suffix}")
        for doc in docs:
            validate_file(schema, doc)


if __name__ == "__main__":

    parser = ArgumentParser()
    parser.add_argument("--datapath",)
    args = parser.parse_args()
    main(args)
