import re
from .utils import get_language_from_filename
def get_links(filename, links_query):
    if links_query.result == []:
        return {"bdrc": False, "rkts": False, "gretil": False, "dsbc": False, "cbeta": False, "suttacentral": False, "cbc": False, "vri": False}

    links_query_result = links_query.result[0]
    link1 = links_query_result[0]
    link2 = links_query_result[1]
    bdrc = False
    rkts = False
    gretil = False
    dsbc = False
    cbeta = False
    sc = False
    cbc = False
    vri = False
    lang = get_language_from_filename(filename)

    # for Tibetan, we serve links to BDRC and RKTS
    if lang == "tib" and not filename.startswith("N"): # We exclude N files from external linking
        bdrc = link1
        rkts = bdrc.replace('http://purl.bdrc.io/resource/WA0RK',
                            'http://purl.rkts.eu/resource/WKT')
        rkts = rkts.replace('http://purl.bdrc.io/resource/WA0RT',
                            'https://www.istb.univie.ac.at/kanjur/rktsneu/verif/verif3.php?id=')

    # for Sanskrit, we serve links to Gretil and DSBC and SC
    if lang == "skt":
        if "gretil" in link1:
            gretil = link1
        elif "dsbc" in link1:
            dsbc = link1
        sc = link2

    # for Chinese, we serve links to CBETA, SC and CBC
    if lang == "chn":
        cbeta = "https://cbetaonline.dila.edu.tw/" + filename + "_001" # why did we do this on the frontend:  re.sub(filename, "_[TX]", "n")
        sc = link2
        cbc_filename = filename[0] + filename[4:]
        cbc = "https://dazangthings.nz/cbc/text/" + cbc_filename

    if lang == "pli":
        if re.search("^tika|^anya|^atk", filename):
            vri = "https://www.tipitaka.org/romn/" + filename
        else:
            sc = "https://suttacentral.net/" + filename

    return {"bdrc": bdrc, "rkts": rkts, "gretil": gretil, "dsbc": dsbc, "cbeta": cbeta, "suttacentral": sc, "cbc": cbc, "vri": vri}








