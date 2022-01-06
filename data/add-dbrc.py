import json
import re
import os


#tib_files = json.load(open('tib-files.json','rb'))
tib_categories = json.load(open('tib-categories.json','rb'))

bdrc_data = open('BN-BDRC.csv','r')
result = ""
bn_bdrc_dict = {}

for line in bdrc_data:
    bn,bdrc_link = line.split(',')
    bn = bn.replace("https://buddhanexus.net/tib/text/","")
    bn_bdrc_dict[bn] = bdrc_link


tib_files = json.load(open('tib-files.json','rb'))
for entry in tib_files:
    filename = entry['filename']
    if filename in bn_bdrc_dict:
        entry['bdrc_link'] = bn_bdrc_dict[filename]
    else:
        
        stripped_filename = re.sub(r"-[0-9]+_","_",entry['filename'])
        stripped_filename = re.sub(r"-[0-9]+$","",stripped_filename)
        if 'D0001' in entry['filename']:
            print(stripped_filename)
            print(bn_bdrc_dict[stripped_filename])
        if stripped_filename in bn_bdrc_dict:
            entry['bdrc_link'] = bn_bdrc_dict[stripped_filename]
        if re.search("D|H",stripped_filename) and not 'bdrc_link' in entry:
            print(entry['filename'])
        
    
    
with open("tib-files1.json", 'w') as json_file:
    json.dump(tib_files,json_file,indent=4,ensure_ascii=False)
