import re
from fuzzysearch import find_near_matches

def preprocess_search_string(search_string):
    lang = 'any'
    # first we need to determine the language of the search string
    if re.search(u'[\u4e00-\u9fff]', search_string):
        lang = 'chn'
    search_string_fuzzy = search_string
    return search_string, search_string_fuzzy, lang

def get_offsets(search_string, segment_text):
    allowed_distance = 1
    # it makes sense to allow for a slightly larger variation on longer queries
    if len(search_string) > 20:
        allowed_distance = len(test_query) * 0.1
    match = find_near_matches(search_string,segment_text, max_l_dist=allowed_distance)[0]
    beg = match.start
    end = match.end
    middle_position = len(segment_text) / 2
    centeredness = (abs(beg-middle_position)+
                    abs(end-middle_position)) / 2
    return beg, end, centeredness

def remove_duplicate_results(results):
    results_by_segnr = {}
    for current_result in results:
        for query_result in results:
            if set(current_result['segment_nr']).isdisjoint(query_result['segment_nr']):
                if current_result['centeredness'] < query_result['centeredness']:
                    results.remove(query_result)
    return results
                


def postprocess_results(search_string, results):
    for result in results:
        beg, end, centeredness = get_offsets(search_string,result['search_string_precise'])
        result['offset_beg'] = beg
        result['offset_end'] = end
        result['centeredness'] = centeredness
    results = remove_duplicate_results(results)
    return results



