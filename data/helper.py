import json

json_file = open('tib-categories.json')
data = json.load(json_file)

for category in data:
    print(len(category['files']))
    category['files'] = list(dict.fromkeys(category['files']))
    print(len(category['files']))

    

with open('tib-categories.json', 'w') as outfile:
    json.dump(data, outfile)
