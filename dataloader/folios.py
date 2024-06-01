import re

from dataloader_constants import LANG_CHINESE, LANG_TIBETAN, LANG_PALI, LANG_SANSKRIT


def get_folios_from_segment_keys(segment_keys, lang):
    folios = []
    if lang == LANG_CHINESE:
        last_num = ""
        for segment_key in segment_keys:
            num = segment_key.split("_")[1].split(":")[0]
            if num != last_num:
                folios.append({"num": num, "segment_nr": segment_key})
                last_num = num
    elif lang == LANG_TIBETAN:
        last_num = ""
        for segment_key in segment_keys:
            num = segment_key.split(":")[1].split("-")[0]
            if num != last_num:
                folios.append({"num": num, "segment_nr": segment_key})
                last_num = num
    elif lang == LANG_PALI:
        last_num = ""
        for segment_key in segment_keys:
            num = segment_key.split(":")[1].split(".")[0].split("_")[0]
            if re.search(r"^(anya|tika|atk)", segment_key):
                if num.endswith("0") and num != last_num:
                    folios.append({"num": num, "segment_nr": segment_key})
                    last_num = num
            else:
                if num != last_num:
                    folios.append({"num": num, "segment_nr": segment_key})
                    last_num = num
    elif lang == LANG_SANSKRIT:
        last_num = ""
        for segment_key in segment_keys:
            if re.search(r"^(K14dhppat|K10udanav|K10uvs)", segment_key):
                num = segment_key.split(":")[1].split("_")[1]
                if num != last_num:
                    folios.append({"num": num, "segment_nr": segment_key})
                    last_num = num
            else:
                num = segment_key.split(":")[1].split(".")[0].split("_")[0]
                if num.endswith("0") and num != last_num:
                    folios.append({"num": num, "segment_nr": segment_key})
                    last_num = num

    return folios
