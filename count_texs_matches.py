import json
import gzip
import os
from tqdm import tqdm
import multiprocessing

tib_path = "/mnt/code/buddhanexus/json/tib/"
chn_path = "/mnt/code/buddhanexus/json/chn/"
skt_path = "/mnt/code/buddhanexus/json/skt/"


def count_file(filepath):
    jfile = gzip.open(filepath, "r")
    data = json.load(jfile)
    total = 0
    for segment in data[0]:
        total += len(segment["segtext"])
    return total


def count_path(path):
    total_length = 0
    filelist = []
    for file in tqdm(os.listdir(path)):
        filename = os.fsdecode(file)
        filepath = path + filename
        filelist.append(filepath)
    pool = multiprocessing.Pool(processes=16)
    total_results = pool.map(count_file, filelist)
    pool.close()
    total_length += sum(total_results)
    print("TOTAL SYLLABLES", total_length)


count_path(chn_path)
