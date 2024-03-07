""" This module provides the links for each file_name """
import re
from .utils import get_language_from_file_name


def get_links(file_name, links_query):
    """get links for each file name"""
    print("get_links", file_name, links_query)
    if len(links_query.result) < 1:
        return {
            "bdrc": False,
            "rkts": False,
            "gretil": False,
            "dsbc": False,
            "cbeta": False,
            "suttacentral": False,
            "cbc": False,
            "vri": False,
        }

    links_query_result = links_query.result[0]
    link1 = links_query_result[0]
    link2 = links_query_result[1]
    bdrc = False
    rkts = False
    gretil = False
    dsbc = False
    cbeta = False
    sc_link = False
    cbc = False
    vri = False
    lang = get_language_from_file_name(file_name)

    # for Tibetan, we serve links to BDRC and RKTS
    if lang == "tib" and not file_name.startswith(
        "N"
    ):  # We exclude N files from external linking
        bdrc = link1
        rkts = bdrc.replace(
            "http://purl.bdrc.io/resource/WA0RK", "http://purl.rkts.eu/resource/WKT"
        )
        rkts = rkts.replace(
            "http://purl.bdrc.io/resource/WA0RT",
            "https://www.istb.univie.ac.at/kanjur/rktsneu/verif/verif3.php?id=",
        )

    # for Sanskrit, we serve links to Gretil and DSBC and SC
    if lang == "skt":
        if "gretil" in link1:
            gretil = link1
        elif "dsbc" in link1:
            dsbc = link1
        sc_link = link2

    # for Chinese, we serve links to CBETA, SC and CBC
    if lang == "chn":
        cbeta = (
            "https://cbetaonline.dila.edu.tw/" + file_name + "_001"
        )  # why did we do this on the frontend:  re.sub(file_name, "_[TX]", "n")
        sc_link = link2
        cbc_file_name = file_name[0] + file_name[4:]
        cbc = "https://dazangthings.nz/cbc/text/" + cbc_file_name

    if lang == "pli":
        if re.search("^tika|^anya|^atk", file_name):
            vri = "https://www.tipitaka.org/romn/" + file_name
        else:
            sc_link = "https://suttacentral.net/" + file_name

    return {
        "bdrc": bdrc,
        "rkts": rkts,
        "gretil": gretil,
        "dsbc": dsbc,
        "cbeta": cbeta,
        "suttacentral": sc_link,
        "cbc": cbc,
        "vri": vri,
    }
