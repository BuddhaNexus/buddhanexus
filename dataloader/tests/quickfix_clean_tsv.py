import pandas as pd
from pathlib import Path
from tqdm import tqdm

src_dir = "tsv_old/pli/"

dest_dir = "tsv/pli/"


dest_path = Path(dest_dir)
dest_path.mkdir(exist_ok=True, parents=True)

src_path = Path(src_dir)
all_files = src_path.glob("*.tsv")

# print(list(all_files))

for filepath in tqdm(list(all_files)):
    filename = filepath.stem.split(".")[0]
    df = pd.read_csv(filepath, sep="\t", names=["segmentnr", "original", "stemmed"])
    df.dropna(subset=["stemmed"], inplace=True)
    assert len(df[pd.isnull(df["stemmed"])]) == 0
    destination = dest_path / (filename + ".tsv")
    # print(destination)
    df.to_csv(dest_path / (filename + ".tsv"), sep="\t", index=False)