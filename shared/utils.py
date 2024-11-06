import re

def get_cat_from_segmentnr(segmentnr):
    """
    retrieves the category code from the segmentnumber
    Note that this function is also used in the dataloader and cannot be
    replaced by a query function.
    """
    return segmentnr.split("_")[1]


def get_filename_from_segmentnr(segnr):
    """
    Get the base filename from a segment number.
    Note that this function is also used in the dataloader and cannot be
    replaced by a query function.
    """
    segnr = segnr.replace(".json", "")
    if "ZH_" in segnr:
        segnr = re.sub("_[0-9]+:", ":", segnr)
    else:
        segnr = re.sub(r"\$[0-9]+", "", segnr)
    return segnr.split(":")[0]


def get_language_from_filename(filename) -> str:
    """
    Given the file ID, returns its language.
    :param filename: The key of the file
    :return: Language of the file
    """
    lang = "unknown"
    if filename.startswith("BO_"):
        lang = "bo"
    elif filename.startswith("PA_"):
        lang = "pa"
    elif filename.startswith("SA_"):
        lang = "sa"
    elif filename.startswith("ZH_"):
        lang = "zh"
    else:
        print("ERROR: Language not found for filename: ", filename)
    return lang