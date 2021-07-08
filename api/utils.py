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


def get_language_from_filename(filename) -> str:
    """
    Given the file ID, returns its language.
    :param filename: The key of the file
    :return: Language of the file
    """
    lang = "pli"
    if re.search(r"[DH][0-9][0-9][0-9]|NK|NG", filename):
        lang = "tib"
    elif re.search(r"(u$|u:|^Y|^XX)", filename):
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
        if re.search("([a-z]+_[A-Z][a-z]+[a-z1-2EL-]+$)|tib_Ny", file):
            query = get_db().AQLQuery(
                query=menu_queries.QUERY_ONE_COLLECTION,
                batchSize=1000,
                bindVars={"collectionkey": file.replace("!", "")},
            )
            for item in query.result:
                if "!" not in file:
                    new_limit_collection.append(item)
                else:
                    new_limit_collection.append("!" + item)
        else:
            new_limit_collection.append(file)

    return new_limit_collection


def get_collection_files_regex(limit_collection, language) -> List:
    """
    Returns a regular expression list for use in arangodb queries
    :param limit_collection: The list of collections to limit to
    :param language: The desired language
    :return: The regular expressions to test if resource belongs to a given collection
    if a collection is prefixed with !, we exclude it from the results!
    """
    new_limit_collection = create_cleaned_limit_collection(limit_collection)

    teststring_positive = []
    teststring_negative = []
    if language in ("tib", "chn", "skt"):
        for file in new_limit_collection:
            if "!" not in file:
                teststring_positive.append("^" + file)
            else:
                teststring_negative.append("^" + file.replace("!", ""))
    elif language == "pli":
        for file in new_limit_collection:
            if "!" not in file:
                if number_exists(file) or ("pm" in file) or ("dhp" in file):
                    teststring_positive.append("^" + file + ":")
                else:
                    teststring_positive.append("^" + file + r"[0-9\-]")
            else:
                if number_exists(file) or ("pm" in file):
                    teststring_negative.append("^" + file.replace("!", "") + ":")
                else:
                    teststring_negative.append("^" + file.replace("!", "") + r"[0-9\-]")

    return [teststring_positive, teststring_negative]


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



def create_numbers_view_data(table_results,folio_regex):
    """
    This function converts the table-view output into a format that is usable for the numbers-view.
    """
    result_dic = {}
    for table_result in table_results:
        for segment_nr in table_result['root_segnr']:
            if re.search(folio_regex,segment_nr):
                if segment_nr in result_dic:
                    result_dic[segment_nr].append(table_result['par_segnr'])
                else:
                    result_dic[segment_nr] = [table_result['par_segnr']]
    result = []
    for segment_nr in result_dic.items():
        entry = { "segmentnr": segment_nr,
                  "parallels": result_dic[segment_nr]}
        result.append(entry)
    return result

def get_folio_regex(language, file_name, folio) -> str:
    """
    Creates a regular expression for use in the AD Queries based on the language and
    file so as to match the segment numbers therein.
    """
    start_folio = ""
    if folio:
        if language == 'pli':
            if re.search(r"^(anya|tika|atk)", file_name):
                start_folio = file_name + ":" + folio[:-1] + "[0-9][._]"
            else:
                start_folio = file_name + ":" + folio + "[._]"
        elif language == 'skt':
            if re.search(r"^(XXdhppat)", file_name):
                start_folio = file_name + ":pdhp_" + folio + "_"
            elif re.search(r"^(S10udanav)", file_name):
                start_folio = file_name + ":uv_" + folio + "_"
            elif re.search(r"^(OT)", file_name):
                start_folio = file_name + ":" + folio + "_"
            else:
                start_folio = file_name + ":" + folio[:-1] + "[0-9](_[0-9]+)*$"
        elif language == 'tib':
            start_folio = file_name + ":" + folio + "-"
        elif language == 'chn':
            start_folio = file_name + "_" + folio + ":"

    return start_folio

def add_source_information(filename,query_result):
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
            bindVars={
                "filename": filename
            },
            rawResults=True
        )
        source_id =  query_source_information.result[0]['source_id']
        source_string =  query_source_information.result[0]['source_string']
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
            "segnr":"source:0",
            "segtext": source_string,
            "position": -1,
            "lang": "eng",
            "parallel_ids": []
            }
        query_result['textleft'].insert(0,source_segment)
        query_result['textleft'] = query_result['textleft'][:800]
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
            bindVars={"segmentnr": active_segment},
        )
        if text_segment_count_query_result.result:
            start_int = text_segment_count_query_result.result[0] - 400

    except DocumentNotFoundError as error:
        print(error)
        raise HTTPException(status_code=404, detail="Active Segment Item not found") from error
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
            bindVars={"filename": file_name},
        )

        if text_segments_query_result.result:
            return text_segments_query_result.result[0]['filetext']

        return []

    except DocumentNotFoundError as error:
        print(error)
        raise HTTPException(status_code=404, detail="QUERY_FILE_TEXT Item not found") from error
    except AQLQueryError as error:
        print("AQLQueryError: ", error)
        raise HTTPException(status_code=400, detail=error.errors) from error
    except KeyError as error:
        print("KeyError: ", error)
        raise HTTPException(status_code=400) from error
