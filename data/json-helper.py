import json
import re
files = open('tib-files.json','rb')
categories = open('tib-categories.json','rb')

data_files = json.load(files)
data_categories = json.load(categories)

nygbtxt = open('nygb-files.txt','r')

c = 4305
for line in nygbtxt:
    line = re.sub(r'.*NY','NY',line).strip()
    stripped_name = line.replace('NY','')
    fileentry = {'displayName': line, 'textname': line, 'filename': line, 'category': 'NY', 'filenr':c}
    c += 1
    data_files.append(fileentry)

for current_file in data_files:
    category = current_file['category']
    for current_category in data_categories:
        if current_category['category'] == category:
            current_category['files'].append(current_file['filename'])

with open('tib-categories.json', 'w') as outfile:
    json.dump(data_categories, outfile, indent=4,ensure_ascii=False)

with open('tib-files.json', 'w') as outfile:
    json.dump(data_files, outfile, indent=4,ensure_ascii=False)
    
