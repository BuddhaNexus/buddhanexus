import re


def get_language_from_filename(filename):
    if re.search(r"(TD|acip|kl[0-9])", filename):
        return "tib"
    elif re.search(r"(_[TX])", filename):
        return "chn"
    else:
        return "pli"


def create_teststring(limitcollection,language):
    teststring = []
    if language == "tib" or language == "chn":
        for item in limitcollection:
            teststring.append("^"+item)
    elif language == "pli":
        for item in limitcollection:
            if number_exists(item):
                teststring.append("^"+item+":")
            else:
                teststring.append("^"+item+"[0-9]")
    return teststring

def number_exists(s):
    return any(i.isdigit() for i in s)