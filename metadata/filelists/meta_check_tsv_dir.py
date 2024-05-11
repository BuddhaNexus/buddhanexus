import pandas as pd

from pathlib import Path

NOT_IN_META_DIR_NAME = "_nometa"

def path_to_filename(path: Path) -> str:
    return (path.stem).split("$")[0]

def meta_filter_tsv_dir(metadir, lang, target):
    """this funtion check a directory containing TSV files in accordance with the metadata list
    the files that are not in the metadata are moved to another folder with a suffix fro  variable NOT_IN_META_DIR_NAME
    """
    target_dir = Path(target)
    if not target_dir.exists():
        print(f"{target_dir} does not exist")
        return
    nometa_dir = target_dir.parent / (target_dir.name + NOT_IN_META_DIR_NAME)
    Path.mkdir(nometa_dir, exist_ok=True)
    df = pd.read_json(f"{metadir}{lang}-files.json")
    meta_filenames = df["filename"].to_list()
    target_paths = list(target_dir.glob("*.tsv"))
    target_names = set()
    moved_names = []
    for p in target_paths:
        fn = path_to_filename(p)
        target_names.add(fn)
        if fn not in meta_filenames:
            p.rename(nometa_dir / p.name)
            moved_names.append(p.name)
    print("target_paths: ", len(list(target_paths)))
    print("target_names: ", len(target_names))
    print("meta_filenames: ", len(meta_filenames))
    print(f"Found {len(moved_names)} TSV files in {target_dir} without {lang.upper()} metadata. All moved to {nometa_dir}")

    metanames_without_tsv = [fn for fn in meta_filenames if fn not in target_names]
    print(f"Found {len(metanames_without_tsv)} filenames in {lang.upper()} metadata without TSV pair in {target_dir}:")
    [print(f"{fn}") for fn in metanames_without_tsv]
