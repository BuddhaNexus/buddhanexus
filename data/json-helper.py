import json
import re
files = open('skt-files.json','rb')
categories = open('skt-categories.json','rb')

data_files = json.load(files)
data_categories = json.load(categories)

# nygbtxt = open('nygb-files.txt','r')


for category in data_categories:
    category['files'] = list(dict.fromkeys(category['files']))

# c = 4305
# for line in nygbtxt:
#     line = re.sub(r'.*NY','NY',line).strip()
#     stripped_name = line.replace('NY','')
#     fileentry = {'displayName': stripped_name, 'textname': line, 'filename': line, 'category': 'NY', 'filenr':c}
#     c += 1
#     data_files.append(fileentry)
new_data = []
for current_file in data_files:
    category = current_file['category']
    if not (category == 'NY' and 'NY' in current_file['displayName']):
        new_data.append(current_file)

with open('skt-categories.json', 'w') as outfile:
    json.dump(data_categories, outfile, indent=4,ensure_ascii=False)

# with open('tib-files.json', 'w') as outfile:
#     json.dump(new_data, outfile, indent=4,ensure_ascii=False)
    
