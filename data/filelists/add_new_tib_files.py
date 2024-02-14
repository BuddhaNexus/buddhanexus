import json, os
import collections
import re
FILELISTS_DIR = "../data/filelists/"

files_json ="../data/filelists/deduplicated_tib-files.json"
filelist_txt = "../data/filelists/tib_all_tsv_2024-01-30.txt"

cat_json = "../data/tib-categories.json"

with open(files_json, "r") as f:
    files_obj_list = json.load(f)
old_file_names = [obj["filename"] for obj in files_obj_list]


def get_filename(line):
    line = line.strip()
    line = os.path.splitext(line)[0]
    line = line.split("$")[0]
    return line

with open(filelist_txt, "r") as f:
    new_files = [get_filename(line) for line in f]
deduplicated_new = list(set(new_files))
    
print ("All files in new list :", len(new_files))
print ("Unique files in new list:", len(deduplicated_new))



new_filenames = sorted([fn for fn in deduplicated_new if fn not in old_file_names])

cats_of_new_files = [
    "(K06)",
    "(K08)",
    "(K10)",
    "(K12)",
    "(NK)",
    "(T[0-9]{1,2})",
    "(TZ[0-9]{1,2})",
    "(TZ)-"
]

def startswithregex(patter, string):
    """if strings starts with patern which should have it pattern to return as the first group
    E.g. we are looking for files starting with T[0-9]- but want to get return only T1, T2 without "-"
    """

    raw_string = r"{}.*".format(patter)
    if match := re.match(raw_string, string):
        # print(match.groups()[0])
        return match.groups()[0]
    return None

def startswithregex_list(patter_list, string):
    """Does this with a list of patterns
    and all newly found patterns
    """
    res = []
    for patter in patter_list:
        if match := startswithregex(patter, string):
            res.append(match)
    if not len(res) == 1:
        print(res, string)
        assert False
    return res[0]
    


# Make sure all new categeories are there
assert len([f for f in new_filenames if not startswithregex_list(cats_of_new_files, f)]) == 0


with open(cat_json, "r") as f:
    categories_obj_list = json.load(f)
cat_dict = {}
for item in categories_obj_list:
   category = item['category']
   cat_dict[category] = item

def get_filename(new_filename, category):
    res = new_filename[len(category):]
    if res.startswith("-"):
        res = res[1:]
    return res

new_texts_appended = 0
newly_created_cats = []
count_files_added_to_new_cats = 0
count_files_added_to_old_cats = 0
file_was_in_old_cat = 0
last_filenr = files_obj_list[-1]["filenr"] + 1
for new_filename in new_filenames:
    for category_pattern in cats_of_new_files:
        if category := startswithregex(category_pattern, new_filename):
            # print(">>> category", category)
            new_obj = {
                "category": category,
                "textname": get_filename(new_filename, category),
                "filename": new_filename,
                "alt_filename": new_filename,
                "displayName": new_filename,
                "filenr": last_filenr,
            }
            last_filenr += 1
            files_obj_list.append(new_obj)
            new_texts_appended += 1
            if category in cat_dict:
                if not new_filename in cat_dict[category]["files"]:
                    if category not in newly_created_cats:
                        count_files_added_to_old_cats += 1
                    else:
                        count_files_added_to_new_cats += 1
                    cat_dict[category]["files"].append(new_filename)
                else:
                    file_was_in_old_cat += 1
            else:
                newly_created_cats.append(category)
                count_files_added_to_new_cats += 1
                cat_dict[category] = {
                    "category": category,
                    "files": [new_filename],
                    "categoryname": category
                }

new_files_path = FILELISTS_DIR + "newest-tib-files.json"
new_categories_path = FILELISTS_DIR + "newest-tib-categories.json"
print(f"new_texts_appended: {new_texts_appended}")
print(f"newly_created_cats: {newly_created_cats}")
print(f"count_files_added_to_new_cats: {count_files_added_to_new_cats}")
print(f"count_files_added_to_old_cats: {count_files_added_to_old_cats}")
print(f"file_was_in_old_cat: {file_was_in_old_cat}")
print(f"count_files_added_to_new_cats + count_files_added_to_old_cats + file_was_in_old_cat = {count_files_added_to_new_cats + count_files_added_to_old_cats + file_was_in_old_cat}")
print()
print(f"new_files_path: {new_files_path}")
print(f"new_categories_path: {new_categories_path}")
new_categories_obj_list = [value for value in cat_dict.values()]


with open(new_files_path, "w+") as f:
    json.dump(files_obj_list, f, indent=4)
with open(new_categories_path, "w+") as f:
    json.dump(new_categories_obj_list, f, indent=4)
