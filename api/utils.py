"""
Various utilities for interacting with data in API queries.
"""

import re
from typing import List

from .queries import menu_queries
from .db_connection import get_db

COLLECTION_PATTERN = r"^(pli-tv-b[ui]-vb|XX|OT|NY|[A-Z]+[0-9]+|[a-z\-]+)"


def get_language_from_filename(filename) -> str:
    """
    Given the file ID, returns its language.
    :param filename: The key of the file
    :return: Language of the file
    """
    lang = "pli"
    if re.search(r"[DH][0-9][0-9][0-9]", filename):
        lang = "tib"
    elif re.search(r"(u$|u:|^Y)", filename):
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
        if re.search("[a-z]+_[A-Z][a-z]+[a-z1-2EL-]+$", file):
            query = get_db().AQLQuery(
                query=menu_queries.QUERY_ONE_COLLECTION,
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


def get_folio_regex(language, file_name, folio) -> str:
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