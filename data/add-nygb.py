import json
import re
import os


#tib_files = json.load(open('tib-files.json','rb'))
tib_categories = json.load(open('tib-categories.json','rb'))

nygb_data = open('nygb-liste.txt','r')
nykm_data = open('nykm-liste.txt','r')

result = ""

ny_files = []
c = 4281
for line in nygb_data:
    filename,textname = line.split('\t')
    entry = {
        "displayName": textname.strip(),
        "textname": filename,
        "filename": filename,
        "category": "NY",
        "filenr": c,
        }
    ny_files.append(filename)
    print(entry)
    tib_files.append(entry)
    c += 1
ny_category = {
    "category": "NY",
    "categoryname": "NY",
    "files": ny_files
    }
tib_categories.append(ny_category)
list_of_kn_volumes = ""
last_nk_volume = ""

nk_files = []
for line in nykm_data:
    entries = line.split('\t')
    filename,textname = entries[:2]
    volume = filename.split(")")[0] + ")"
    volume = "NK" + volume

    if volume != last_nk_volume:
        list_of_kn_volumes += volume + "\n"

        new_category = {
            "category": last_nk_volume,
            "categoryname": last_nk_volume,
            "files": nk_files
        }
        tib_categories.append(new_category)
        last_nk_volume = volume
        nk_files = []
    nk_files.append(filename)
    entry = {
        "displayName": textname.strip(),
        "textname": filename,
        "filename": filename,
        "category": volume,
        "filenr": c,
        }
    tib_files.append(entry)
    c += 1
    
with open("tib-categories1.json", 'w') as json_file:
    json.dump(tib_categories,json_file,indent=4,ensure_ascii=False)
