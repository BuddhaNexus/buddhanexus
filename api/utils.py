import re
from datetime import datetime, timedelta
from time import mktime
from wsgiref.handlers import format_date_time


def get_language_from_filename(filename):
    if re.search(r"(TD|acip|kl[0-9])", filename):
        return "tib"
    elif re.search(r"(_[TX])", filename):
        return "chn"
    else:
        return "pli"


# TODO: Give this method a more specific name
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


def get_date_plus_months(months: int) -> str:
    """
    :return: RFC1123 formatted string representing a date sometime in year 2099.
    """
    date_after_month = datetime.now() + timedelta(365 / 12 * months)
    stamp = mktime(date_after_month.timetuple())
    return format_date_time(stamp)
