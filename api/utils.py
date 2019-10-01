import re


def get_language_from_filename(filename):
    if re.search(r"(TD|acip|kl[0-9])", filename):
        return "tib"
    elif re.search(r"(_[TX])", filename):
        return "chn"
    else:
        return "pli"


def get_language_from_languagename(language):
    if language == 'pali':
        return 'pli'
    elif language == 'tibetan':
        return 'tib'
    elif language == 'chinese':
        return 'chn'
    else:
        return 'skt'
