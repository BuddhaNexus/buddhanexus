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
    if re.search(r"(TD|acip|kl[0-9]|NY)", filename):
        return "tib"
    if re.search(r"(u$|u:|^Y)", filename):
        return "skt"
    if re.search(r"(_[TX])", filename):
        return "chn"
    return "pli"


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
    if language in ("tib", "chn"):
        for file in new_limit_collection:
            if "!" not in file:
                teststring_positive.append("^" + file)
            else:
                teststring_negative.append("^" + file.replace("!", ""))
    elif language == "pli":
        for file in new_limit_collection:
            if "!" not in file:
                if number_exists(file) or ("pm" in file):
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
        if "parallels" not in segment:
            continue
        for parallel in segment["parallels"]:
            for seg_nr in parallel:
                collection_key = re.search(COLLECTION_PATTERN, seg_nr)
                if collection_key and collection_key.group() not in collection_keys:
                    collection_keys.append(collection_key.group())
        segments_result.append(segment)

    return segments_result, collection_keys
