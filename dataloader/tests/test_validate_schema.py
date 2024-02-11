from dataloader_models import Match, Segment, validate_df, validate_dict_list
import json
from pydantic import TypeAdapter, ValidationError
from typing import List
import gzip
import pandas as pd
import os

json_path = "/home/wo/bn/buddhanexus/json/pli/an1.json.gz"
tsv_path = "/home/wo/bn/buddhanexus/tsv/pli/an1.tsv"
parallels = json.load(gzip.open(json_path, "rt", encoding="utf-8"))
file_df = pd.read_csv(tsv_path, sep="\t")

# ta = TypeAdapter(List[Match])

if (validate_df(json_path, Segment, file_df)):
    print("TSV SUCCESS!!!")
    
if (validate_dict_list(json_path, Match, parallels)):
    print("JSON SUCCESS!!!")