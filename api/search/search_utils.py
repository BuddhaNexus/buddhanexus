import re
import buddhanexus_lang_analyzer.translate_for_website as bn_translate
import time 
from fuzzysearch import levenshtein_ngram

bn_analyzer = bn_translate.analyzer()

def preprocess_search_string(search_string):
    search_string_fuzzy = ""
    if not  re.search(u'[\u4e00-\u9fff]', search_string):
        search_string_fuzzy = bn_analyzer.stem_sanskrit(search_string)
    return search_string, search_string_fuzzy

def tag_sanskrit(sanskrit_string):
    return bn_analyzer.tag_sanskrit(sanskrit_string[:150])

def get_offsets(search_string, segment_text):
    allowed_distance = 0
    match = []
    while len(match) == 0:        
        match = list(levenshtein_ngram.find_near_matches_levenshtein_ngrams(search_string,segment_text, max_l_dist=allowed_distance))
        allowed_distance += 1
    match = match[0]
    beg = match.start
    end = match.end
    distance = match.dist
    middle_position = len(segment_text) / 2
    centeredness = (abs(beg-middle_position)+
                    abs(end-middle_position)) / 2
    return beg, end, centeredness, distance

def remove_duplicate_results(results):
    results_by_segnr = {}
    for current_result in results:
        for query_result in results:
            if not set(current_result['segment_nr']).isdisjoint(query_result['segment_nr']):
                if current_result['centeredness'] < query_result['centeredness']:
                    results.remove(query_result)
    return results
                


def postprocess_results(search_string, results):
    for result in results:
        beg, end, centeredness,distance = get_offsets(search_string,result['search_string_precise'])
        result['offset_beg'] = beg
        result['offset_end'] = end
        result['centeredness'] = centeredness
        result['distance'] = distance
    results = remove_duplicate_results(results)
    results = remove_duplicate_results(results) # yes, we have to do this twice to make sure that no duplicates remain 
    results = sorted(results, key = lambda i: i['distance']) 
    return results
