import json
import os
filename = "tib-files.json"
already_existing_filenames = []    
def process_file(filename):
    with open(filename,'rt') as f:
        files = json.load(f)
        for entry,next_entry in zip(files,files[1:]):
            textname = entry['textname']
            already_existing_filenames.append(textname)
            count = already_existing_filenames.count(textname)
            if count > 1:
                if len(entry['textname'].split()) == 2:
                    derge, lhasa = entry['textname'].split()
                    entry['textname'] = derge + "-" + str(count) + " " + lhasa + "-" + str(count)
                    entry['displayName'] = derge + "-" + str(count) + " " + lhasa + "-" + str(count)
                    print(entry['textname'])
        with open("tib-files-fixed.json", 'w') as outfile:        
            json.dump(files, outfile,indent=4,ensure_ascii=False)



process_file(filename)
