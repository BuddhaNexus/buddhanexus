import json
import re
import os
tibdata = json.load(open('tib-files.json','rb'))


# nygb_data = open('nygb-liste.txt','r')
# nykm_data = open('nykm-liste.txt','r')
# tib_files = json.load(file) 

# result = ""
# for entry in tib_files:
#     result += entry['filename'] + "\t" + entry['displayName'] + "\t" + entry['gretil_link'] + "\n"
    
result = ''



for entry in tibdata:
    lhasa = ""
    derge = ""
    for element in entry['filename'].split('_'):
        if "D" in element:
            derge += element + " "
        if "H" in element:
            lhasa += element + " "
    bn_link = "https://buddhanexus.net/tib/text/" + entry['filename']
    result += derge + "\t" + lhasa + "\t" + bn_link + "\n"

with open("buddhanexus_files.csv", 'w') as file:
    file.write(result)

    
# for file in os.listdir("/home/basti/data/tibetan/txt-processed/"):
#     filename = os.fsdecode(file).replace(".txt","")
#     if filename not in filename_dic:
#         print(filename)

# if not os.path.isfile("/home/basti/data/tibetan/txt-processed/" + entry['filename'] + ".txt"):
#         print(entry['filename'])
    # if not re.search(r"[a-z]+", entry['displayName']):
    #     print(entry['displayName'])
    #     #derge,lhasa =

#print(result)

# c = 4281
# for line in nygb_data:
#     filename,textname = line.split('\t')
#     entry = {
#         "displayName": textname.strip(),
#         "textname": filename,
#         "filename": filename,
#         "category": "NY",
#         "filenr": c,
#         }
#     print(entry)
#     tib_files.append(entry)
#     c += 1
        

# def get_gretil_link(filename):
#     return_line = ""
#     for line in gretil_list:
#         if filename + ".htm" in line:
#             line = re.sub("^[^\=]+=\"","",line)
#             line = re.sub("\".*","",line)
#             return_line = "http://gretil.sub.uni-goettingen.de/" + line
#     if return_line == "":
#         print(filename)
#     return return_line

# # filename = "brsphutu"
# # get_gretil_link(filename)


# for entry in file_data:
#     filename = entry['filename']
#     filename = re.sub("^[A-Z]+[0-9]+","",filename)
#     filename = re.sub("^[A-Z]+","",filename)
#     gretil_link = get_gretil_link(filename)
#     entry['gretil_link'] = gretil_link

# with open("skt-files1.json", 'w') as json_file:
#     json.dump(file_data,json_file,indent=4,ensure_ascii=False)


    
