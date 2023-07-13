"""
Various utilities for interacting with data in API queries.
"""

import re
from typing import List
from urllib.parse import unquote
from fastapi import HTTPException
from pyArango.theExceptions import DocumentNotFoundError, AQLQueryError

from .queries import menu_queries, main_queries
from .db_connection import get_db

COLLECTION_PATTERN = r"^(pli-tv-b[ui]-vb|XX|OT|NG|[A-Z]+[0-9]+|[a-z\-]+)"


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
    lang = "pli"
    if re.search(r"[DH][0-9][0-9][0-9]|NK|NG", filename):
        lang = "tib"
    elif re.search(r"(u$|u:|^Y|^XX|sc$|sc:)", filename):
        lang = "skt"
    elif re.search(r"[TX][0-9][0-9]n[0-9]", filename):
        lang = "chn"
    return lang


def create_cleaned_limit_collection(limit_collection) -> List:
    """
    Check if limit_collection is a category or entire collection.
    If a collection, fetch all the categories in that collection and add that to the
    new_limit_collection
    """
    new_limit_collection = []
    for file in limit_collection:
        if re.search("([a-z]+_[A-Z][a-z]+[a-z1-2EL-]+$)|tib_NyKM", file):
            query = get_db().AQLQuery(
                query=menu_queries.QUERY_ONE_COLLECTION,
                batchSize=1000,
                bind_vars={"collectionkey": file.replace("!", "")},
            )
            for item in query.result:
                    new_limit_collection.append(item)
        else:
            if (
                "tib_NyGB" in file
            ):  # this is a collection-specific hack and things like this should never be done
                new_limit_collection.append("NG")
            else:
                new_limit_collection.append(file)
    return new_limit_collection


def number_exists(input_string) -> bool:
    """
    Simple utility to check if string has number characters.
    :param input_string: the string to test
    :return: `True` if the string contains numbers.
    """
    return any(char.isdigit() for char in input_string)


def collect_segment_results(segments) -> List:
    """
    Query results are analyzed based on what collection they are part of and put in the
    relevant category thereof. Returns the results and the keys to the collections.
    """
    collection_keys = []
    segments_result = []
    for segment in segments:
        if "parallels" not in segment or segment["parallels"] is None:
            continue
        for parallel in segment["parallels"]:
            for seg_nr in parallel:
                collection_key = re.search(COLLECTION_PATTERN, seg_nr)
                if collection_key and collection_key.group() not in collection_keys:
                    collection_keys.append(collection_key.group())
        segments_result.append(segment)

    return segments_result, collection_keys






def get_folio_regex(language, file_name, folio) -> str:
    """
    Creates a regular expression for use in the AD Queries based on the language and
    file so as to match the segment numbers therein.
    """
    start_folio = ""
    if folio:
        if language == "pli":
            if re.search(r"^(anya|tika|atk)", file_name):
                start_folio = file_name + ":" + folio[:-1] + "[0-9][._]"
            else:
                start_folio = file_name + ":" + folio + "[._]"
        elif language == "skt":
            if re.search(r"^(K14dhppat)", file_name):
                start_folio = file_name + ":pdhp_" + folio + "_"
            elif re.search(r"^(K10udanav)", file_name):
                start_folio = file_name + ":uv_" + folio + "_"
            elif re.search(r"^(K10uvs)", file_name):
                start_folio = file_name + ":uvs_" + folio + "_"
            else:
                start_folio = file_name + ":" + folio[:-1] + "[0-9](_[0-9]+)*$"
        elif language == "tib":
            start_folio = file_name + ":" + folio + "-"
        elif language == "chn":
            start_folio = file_name + "_" + folio + ":"
    return start_folio


def add_source_information(filename, query_result):
    """
    Checks if a special source string is stored in the database.
    If not, it will return a generic message based on a regex pattern.
    Currently only works for SKT.
    TODO: We might want to add this to Pali/Chn/Tib as well in the future!
    """
    lang = get_language_from_filename(filename)
    if lang == "skt":
        query_source_information = get_db().AQLQuery(
            query=main_queries.QUERY_SOURCE,
            bind_vars={"filename": filename},
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


def get_start_integer(active_segment):
    """
    Gets start integer for the folio segment that is called for.
    """
    start_int = 0
    active_segment = unquote(active_segment)
    try:
        text_segment_count_query_result = get_db().AQLQuery(
            query=main_queries.QUERY_SEGMENT_COUNT,
            bind_vars={"segmentnr": active_segment},
        )
        if text_segment_count_query_result.result:
            start_int = text_segment_count_query_result.result[0] - 400

    except DocumentNotFoundError as error:
        print(error)
        raise HTTPException(
            status_code=404, detail="Active Segment Item not found"
        ) from error
    except AQLQueryError as error:
        print("AQLQueryError: ", error)
        raise HTTPException(status_code=400, detail=error.errors) from error
    except KeyError as error:
        print("KeyError: ", error)
        raise HTTPException(status_code=400) from error

    start_int = max(start_int, 0)

    return start_int


def get_file_text(file_name):
    """
    Gets file segments and numbers only from start_int onwards with max 800 segments.
    """
    try:
        text_segments_query_result = get_db().AQLQuery(
            query=main_queries.QUERY_FILE_TEXT,
            bind_vars={"filename": file_name},
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
