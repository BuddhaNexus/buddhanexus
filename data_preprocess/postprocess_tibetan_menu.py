import sys
import re
import gzip
import json

filename = "tib-files.json"    

tibetan_tab = 'tib_catalog.tab'
tib_dic = {}
for line in open(tibetan_tab,'rt'):
    entries = line.split('\t')
    #print(entries)
    lhasa = entries[2].strip()
    derge = entries[5].strip()
    tib_dic[derge] = lhasa


def process_file(filename):
    with open(filename,'rt') as f:
        files = json.load(f)
        for current_file in files:
            if "acip" in current_file['displayName']:
                current_derge = current_file['textname']
                if current_derge in tib_dic.keys():
                    current_file['displayName'] = current_file['displayName'] + " " + tib_dic[current_derge]
                    current_file['textname'] = current_file['textname'] + " " + tib_dic[current_derge]
        with open(filename[:-5] +"_corrected.json", 'w') as outfile:        
            json.dump(files, outfile,indent=4,ensure_ascii=False)



            
process_file(filename)
