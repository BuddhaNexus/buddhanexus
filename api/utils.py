import re
from time import strftime, gmtime


def get_language_from_filename(filename):
    if re.search(r"(TD|acip|kl[0-9])", filename):
        return "tib"
    elif re.search(r"(_[TX])", filename):
        return "chn"
    else:
        return "pli"


def get_regex_test(limitcollection, language):
    teststring = []
    if language == "tib" or language == "chn":
        for file in limitcollection:
            teststring.append("^" + file)
    elif language == "pli":
        for file in limitcollection:
            if number_exists(file):
                teststring.append("^" + file + ":")
            else:
                teststring.append("^" + file + "[0-9\-]")
    return teststring


def number_exists(s):
    return any(i.isdigit() for i in s)

def get_future_date() -> str:
    """
    :return: RFC1123 formatted string representing a date sometime in year 2099.
    """
    return strftime("%a, %d %b %Y %H:%M:%S +0000", gmtime(4095088747))
