""" This module provides the links for each filename """

import re
from .utils import get_language_from_filename


def get_links(filename, links_query):
    """get links for each file name"""
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
    lang = get_language_from_filename(filename)

    # for Tibetan, we serve links to BDRC and RKTS
    if lang == "bo" and not filename.startswith(
        "BO_N"
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
    if lang == "sa":
        if "gretil" in link1:
            gretil = link1
        elif "dsbc" in link1:
            dsbc = link1
        sc_link = link2

    # for Chinese, we serve links to CBETA, SC and CBC
    if lang == "zh":
        cbeta = (
            "https://cbetaonline.dila.edu.tw/" + filename + "_001"
        )  # why did we do this on the frontend:  re.sub(filename, "_[TX]", "n")
        sc_link = link2
        cbc_filename = filename[0] + filename[4:]
        cbc = "https://dazangthings.nz/cbc/text/" + cbc_filename

    if lang == "pa":
        vri = link1 or "https://tipitaka.org/romn/"
        if not re.search("^tika|^anya|^atk", filename):
            sc_link = "https://suttacentral.net/" + filename

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
