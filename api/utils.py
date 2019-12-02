"""
Various utilities for interacting with data in API queries.
"""

import re

from typing import List


def get_language_from_filename(filename) -> str:
    """
    Given the file ID, returns its language.
    :param filename: The key of the file
    :return: Language of the file
    """
    if re.search(r"(TD|acip|kl[0-9])", filename):
        return "tib"
    if re.search(r"(_[TX])", filename):
        return "chn"
    return "pli"


def get_collection_files_regex(limit_collection, language) -> List:
    """
    Returns a regular expression list for use in arangodb queries
    :param limit_collection: The list of collections to limit to
    :param language: The desired language
    :return: The regular expressions to test if resource belongs to a given collection
    if a collection is prefixed with !, we exclude it from the results!
    """
    teststring_positive = []
    teststring_negative = []
    if language in ("tib", "chn"):
        for file in limit_collection:
            if not "!" in file:
                teststring_positive.append("^" + file)
            else:
                teststring_negative.append("^" + file.replace("!",""))
                
    # TODO: We need to make the exclusion pattern from above work with pāli; I don't yet understand the naming scheme in pāli well enough to do this confidently, maybe Vimala you can have a look?
    elif language == "pli":
        for file in limit_collection:
            if number_exists(file):
                teststring.append("^" + file + ":")
            else:
                teststring.append("^" + file + r"[0-9\-]")
    return [teststring_positive,teststring_negative]


def number_exists(input_string) -> bool:
    """
    Simple utility to check if string has number characters.
    :param input_string: the string to test
    :return: `True` if the string contains numbers.
    """
    return any(char.isdigit() for char in input_string)
