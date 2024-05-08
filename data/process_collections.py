import pandas as pd 
import os 
import natsort
tsv_path = "../tsv/tib/"

tib_categories = pd.read_json('tib-categories.json')

# sort by category in natural order
tib_categories = tib_categories.sort_values(by='category', key=lambda x: natsort.index_natsorted(x))
tib_categories.to_json('tib-categories.json', orient='records', indent=4)






quit()
# for all rows with category beginning with TZ, replace "TDZ" in filename with the category
for index, row in tib_categories.iterrows():
    if row['category'][:2] == "TZ":
        category = row['category']
        filename = row['filename']
        new_filename = filename.replace("-Terdzo", "")        
        tib_categories.at[index, 'filename'] = new_filename

tib_categories.to_json('tib-files-new.json', orient='records', indent=4)
