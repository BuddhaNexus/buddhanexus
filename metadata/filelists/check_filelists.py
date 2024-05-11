import json, os
import collections

FILELISTS_DIR = "../data/filelists/"

files_json ="../data/tib-files.json"
filelist_txt = "../data/filelists/tib_all_tsv_2024-01-30.txt"

cat_json = "../data/tib-categories.json"

def write_list(str_list, output_file_name):
    with open(output_file_name, "w+") as f:
        for string in str_list:
            f.write(string + "\n")

with open(files_json, "r") as f:
    files_obj_list = json.load(f)
    files_from_json = [obj["filename"] for obj in files_obj_list]
duplicates = [{"duplicate_filename": item, "count": count} for item, count 
                in collections.Counter(files_from_json).items() 
                if count > 1]
sorted(duplicates, key=lambda d: d["duplicate_filename"])
print("duplicates in json:", duplicates, "\n")
with open(FILELISTS_DIR + "duplicates.txt", "w+") as f:
    json.dump(duplicates, f, indent=4)

def get_filename(line):
    line = line.strip()
    line = os.path.splitext(line)[0]
    line = line.split("$")[0]
    return line

with open(filelist_txt, "r") as f:
    files_from_txt = [get_filename(line) for line in f]
    files_from_txt = list(set(files_from_txt))

unique_for_json = sorted([fn for fn in files_from_json if fn not in files_from_txt])
unique_for_txt = sorted([fn for fn in files_from_txt if fn not in files_from_json])

print("unique_for_json: ", unique_for_json)
print("unique_for_txt: ", unique_for_txt)

write_list(unique_for_json, FILELISTS_DIR + "unique_for_json.txt")
write_list(unique_for_txt, FILELISTS_DIR + "unique_for_txt.txt")

def add_new_texts(files_obj_list,
                    categories_obj_list,
                    new_filenames_list,
                    category,
                    new_files_path,
                    new_categories_path
                ):
    number = files_obj_list[-1]["filenr"] + 1
    new_filenames_list = [fn for fn in new_filenames_list if fn.startswith("TZ-")]
    for filename in new_filenames_list:
        new_obj = {
            "category": category,
            "textname": filename,
            "filename": filename,
            "alt_filename": filename,
            "displayName": filename,
            "filenr": number
        }
        number += 1
        files_obj_list.append(new_obj)
    new_cat_obj = {
        "category": category,
        "files": new_filenames_list,
        "categoryname": category
    }
    categories_obj_list.append(new_cat_obj)
    with open(new_files_path, "w+") as f:
        json.dump(files_obj_list, f, indent=4)
    with open(new_categories_path, "w+") as f:
        json.dump(categories_obj_list, f, indent=4)

with open(cat_json, "r") as f:
    categories_obj_list = json.load(f)
        

add_new_texts(files_obj_list,
                categories_obj_list,
                unique_for_txt,
                "TZ",
                FILELISTS_DIR + "new-tib-files.json",
                FILELISTS_DIR + "new-tib-categories.json"
            )