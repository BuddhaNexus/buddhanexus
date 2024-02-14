import json, os
import collections

FILELISTS_DIR = "../data/filelists/"

files_json = "../data/tib-files.json"

cat_json = "../data/tib-categories.json"


with open(files_json, "r") as f:
    old_files_dict_list = json.load(f)
    print(len(old_files_dict_list))

terdzo_counter = 0
pair_counter = 0
terdzo_no_pair = []
terdzo_pairs = []

# erase ids and "~" in the names
for d0 in old_files_dict_list:
    d0["filenr"] = 0
    if d0["filename"].startswith("TDZ-Terdzo-"):
        found_pair = False
        terdzo_counter += 1
        true_name = d0["filename"].replace("TDZ-Terdzo-", "")
        # print(true_name)
        for d1 in old_files_dict_list:
            if d1["textname"] == true_name:
                pair_counter += 1
                found_pair = True
                terdzo_pairs.append(true_name)
        if not found_pair:
            terdzo_no_pair.append(true_name)
print(f"all terdzo: {terdzo_counter}")
print(f"terdzo pairs: {pair_counter}")
print(f"no pair: {len(terdzo_no_pair)}")
print(f"with pair: {len(terdzo_pairs)}")

no_terdzo_no_pair = 0

new_files_dict_list = []

for d0 in old_files_dict_list:
    if d0["filename"].startswith("TDZ-Terdzo-"):
        # d0 is Terdzo! does it have a pair?
        true_name = d0["filename"].replace("TDZ-Terdzo-", "")
        if true_name in terdzo_pairs:
            # yes
            # so we find its pair
            for d1 in old_files_dict_list:
                if d1["textname"] == true_name:
                    # found so we copy what we need
                    d1["link"] = d0["link"]
                    d1["displayName"] = d0["displayName"]
                    new_files_dict_list.append(d1)
        else:
            d0["textname"] = true_name
            # d0["alt_filename"] = d0["category"] + "-" + true_name
            new_files_dict_list.append(d0)
    else:
        # it has to be textname not filename!!!!!!!!!!!!!!!!!
        if not d0["textname"] in terdzo_pairs:
            no_terdzo_no_pair += 1
            new_files_dict_list.append(d0)
            

print(f"no_terdzo_no_pair: {no_terdzo_no_pair}")

print(f"new len: {len(new_files_dict_list)}") 
new_dedup_list = [dict(t) for t in {tuple(d.items()) for d in new_files_dict_list}]
print(f"new dedup: {len(new_dedup_list)}")
assert len(new_dedup_list) == len(new_files_dict_list)


# make sure the final count of entries is less by the number of pairs
assert len(new_files_dict_list) == len(old_files_dict_list) - len(terdzo_pairs)

sorted(new_files_dict_list, key=lambda d: d["filename"])
for i, d0 in enumerate(new_files_dict_list):
    d0["filenr"] = i
    
with open(FILELISTS_DIR + "no_terdzo_tib-files.json", "w+") as f:
    json.dump(new_files_dict_list, f, indent=4)
