import re

def preprocess_search_string(search_string):
    lang = 'any'
    # first we need to determine the language of the search string
    if re.search(u'[\u4e00-\u9fff]', search_string):
        lang = 'chn'
    search_string_fuzzy = search_string
    return search_string, search_string_fuzzy, lang


def postprocess_results(search_string, results):
    # for result in results:        
    return results
