import json, os
import collections

FILELISTS_DIR = "../data/filelists/"

files_json = "../data/tib-files.json"
filelist_txt = "../data/filelists/tib_all_tsv_2024-01-30.txt"

cat_json = "../data/tib-categories.json"


with open(files_json, "r") as f:
    files_dict_list = json.load(f)
    print(len(files_dict_list))

# erase ids and "~" in the names
for d in files_dict_list:
    d["filenr"] = 0
    d["category"] = d["category"].replace("~", "")

# deduplicate list of dicts
# https://stackoverflow.com/questions/9427163/remove-duplicate-dict-in-list-in-python
dedup_list = [dict(t) for t in {tuple(d.items()) for d in files_dict_list}]
print(len(dedup_list))

sorted(dedup_list, key=lambda d: d["filename"])
for i, d in enumerate(dedup_list):
    d["filenr"] = i
    
with open(FILELISTS_DIR + "deduplicated_tib-files.json", "w+") as f:
    json.dump(dedup_list, f, indent=4)
