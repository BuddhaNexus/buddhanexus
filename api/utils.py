"""
Various utilities for interacting with data in API queries.
"""

import re
from urllib.parse import unquote
from fastapi import HTTPException
from pyArango.theExceptions import DocumentNotFoundError, AQLQueryError
from .queries import utils_queries, text_view_queries
from .db_connection import get_db


def prettify_score(score):
    """
    if score is a floating point number <= 1, return it as an int scaled by 100
    """
    if isinstance(score, float) and score <= 1:
        return int(score * 100)
    return score


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


def shorten_segment_names(segments):
    """
    Returns a shortened version of a range of segments
    """
    first_segment = re.sub("-[0-9]+", "", segments[0])
    last_segment = re.sub("-[0-9]+", "", segments[-1])
    shortened_segment = first_segment
    if not first_segment == last_segment:
        shortened_segment += "–" + last_segment.split(":")[1]
    return shortened_segment


def get_sort_key(sort_method) -> str:
    """
    Returns the correct sort_key for table and numbers queries
    """
    sort_key = ""
    if sort_method == "position":
        sort_key = "parallels_sorted_by_src_pos"
    if sort_method == "quoted-text":
        sort_key = "parallels_sorted_by_tgt_pos"
    if sort_method == "length":
        sort_key = "parallels_sorted_by_length_src"
    if sort_method == "length2":
        sort_key = "parallels_sorted_by_length_tgt"
    return sort_key


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


def number_exists(input_string) -> bool:
    """
    Simple utility to check if string has number characters.
    :param input_string: the string to test
    :return: `True` if the string contains numbers.
    """
    return any(char.isdigit() for char in input_string)


def add_source_information(filename, query_result):
    """
    Checks if a special source string is stored in the database.
    If not, it will return a generic message based on a regex pattern.
    Currently only works for SKT.
    TODO: We might want to add this to Pali/Chn/Tib as well in the future!
    """
    lang = get_language_from_filename(filename)
    if lang == "sa":
        query_source_information = get_db().AQLQuery(
            query=utils_queries.QUERY_SOURCE,
            bindVars={"filename": filename},
            rawResults=True,
        )
        source_id = query_source_information.result[0]["source_id"]
        source_string = query_source_information.result[0]["source_string"]
        if source_id == "GRETIL":
            source_string = """The source of this text is GRETIL
                               (Göttingen Register of Electronic Texts in Indian Languages).
                               Click on the link above to access the original etext
                               with full header Information."""
        if source_id == "DSBC":
            source_string = """The source of this text is the Digital
                               Sanskrit Buddhist Canon project at the University of the West.
                               Click on the link above to access the
                               original etext with full header Information."""
        source_segment = {
            "segnr": "source:0",
            "segtext": source_string,
            "position": -1,
            "lang": "eng",
            "parallel_ids": [],
        }
        query_result["textleft"].insert(0, source_segment)
        query_result["textleft"] = query_result["textleft"][:800]
    return query_result


def get_page_for_segment(active_segment):
    """
    Gets the page number for a given segment.
    """
    active_segment = unquote(active_segment)
    page_for_segment = get_db().AQLQuery(
        query=utils_queries.QUERY_PAGE_FOR_SEGMENT,
        bindVars={"segmentnr": active_segment},
    )
    return page_for_segment.result[0]


def get_segment_for_folio(folio):
    """
    Gets the segment number for a given folio.
    """
    segment_for_folio = get_db().AQLQuery(
        query=utils_queries.QUERY_SEGMENT_FOR_FOLIO,
        bindVars={"folio": folio},
    )
    return segment_for_folio.result


def get_file_text(filename):
    """
    Gets file segments and numbers only from start_int onwards with max 800 segments.
    """
    try:
        text_segments_query_result = get_db().AQLQuery(
            query=text_view_queries.QUERY_FILE_TEXT,
            bindVars={"filename": filename},
        )

        if text_segments_query_result.result:
            return text_segments_query_result.result[0]["filetext"]

        return []

    except DocumentNotFoundError as error:
        print(error)
        raise HTTPException(
            status_code=404, detail="QUERY_FILE_TEXT Item not found"
        ) from error
    except AQLQueryError as error:
        print("AQLQueryError: ", error)
        raise HTTPException(status_code=400, detail=error.errors) from error
    except KeyError as error:
        print("KeyError: ", error)
        raise HTTPException(status_code=400) from error


def get_cat_from_segmentnr(segmentnr):
    """
    retrieves the category code from the segmentnumber
    Note that this function is also used in the dataloader and cannot be
    replaced by a query function.
    """
    return segmentnr.split("_")[1]
