import re
import buddhanexus_lang_analyzer.translate_for_website as bn_translate
from fuzzysearch import levenshtein_ngram
import pyewts
from aksharamukha import transliterate

bn_analyzer = bn_translate.analyzer()
tib_converter = pyewts.pyewts()

def preprocess_search_string(search_string):
    tib = ""
    chn = ""
    skt = ""
    pli = ""
    # test if string contains Tibetan characters
    if  re.search("[\u0F00-\u0FDA]",search_string):
        tib = tib_converter.toWylie(search_string).strip()
        skt = tib
    else:
        if bn_translate.check_if_sanskrit(search_string):
            skt = transliterate.process('autodetect', 'IAST', search_string)
        else:
            skt = search_string
        skt = skt.lower()
        
    # skt_fuzzy also tests if a string contains tib/chn letters; if so, it returns an empty string 
    skt_fuzzy = bn_analyzer.stem_sanskrit(skt)
    pli = bn_analyzer.stem_pali(search_string)
    # if skt_fuzzy detected the string to be Tibetan/Chinese or the unicode2wylie transliteration was successful, do this: 
    if skt_fuzzy == "" or tib != "":
        if tib == "":
            tib = search_string
        tib_preprocessed = tib.replace("’", "'")
        tib = bn_analyzer.stem_tibetan(tib_preprocessed)#.replace("ba\n","ba")
        chn = search_string
    return {"skt": skt,
            "skt_fuzzy":skt_fuzzy,
            "tib": tib,
            "pli": pli,            
            "chn": chn}

def tag_sanskrit(sanskrit_string):
    return bn_analyzer.tag_sanskrit(sanskrit_string[:150].lower())

def get_offsets(search_string, segment_text):
    allowed_distance = 0
    max_distance = len(search_string) / 5
    match = []
    while len(match) == 0 and allowed_distance <= max_distance:
        match = list(levenshtein_ngram.find_near_matches_levenshtein_ngrams(search_string,segment_text, max_l_dist=allowed_distance))
        allowed_distance += 1
    if match:
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
        for segment_nr in current_result['segment_nr']:
            if not segment_nr in results_by_segnr:
                results_by_segnr[segment_nr] = [current_result]
            else:
                results_by_segnr[segment_nr].append(current_result)    
    for current_result in results:
        for current_segnr in current_result['segment_nr']:
            for query_result in results_by_segnr[current_segnr]:
                if not query_result['segment_nr'][0] == current_result['segment_nr'][0]:
                    if current_result['centeredness'] >= query_result['centeredness'] and not 'disabled' in query_result:
                        current_result['disabled'] = True
    return_results = []
    for result in results:
        if not "disabled" in result:
            return_results.append(result)
    return return_results
                
def process_result(result_pair,search_string):
    result,multilang_results = result_pair
    try:
        beg, end, centeredness,distance = get_offsets(search_string,result['search_string_precise'])
        result['offset_beg'] = beg
        result['offset_end'] = end
        result['centeredness'] = centeredness
        result['distance'] = distance
        result['multilang_results'] = multilang_results
        return result
    except (RuntimeError, TypeError, NameError):
        pass

def postprocess_results(search_strings, results):
    search_string = search_strings['skt']
    print("SEARCH STRING",search_string)
    new_results = []
    for result in results:
        new_results.append(process_result(result,search_string))
        
    results = [x for x in new_results if x is not None]    
    results = [x for x in results if 'centeredness' in x]
    results = remove_duplicate_results(results)
    results = [i for n, i in enumerate(results) if i not in results[n + 1:]]
    # First sort according to string similarity, next sort if multilang is present; the idea is that first the multilang results are shown, then the other with increasing distance
    results = sorted(results, key = lambda i: i['distance'])
    results = results[::-1]
    results = sorted(results, key = lambda i: len(i['multilang_results']))
    results = results[::-1]
    return results[:200] # make sure we return a fixed number of results

def process_multilang_result(result_list,search_strings):
    if search_string == '':
        return result_list
    
    for result in result_list:
        if search_string in result["root_seg_text"][0]:
            beg,end, = get_offsets(search_string,result["root_seg_text"][0])[:2]
            result['root_offset_beg'] = beg
            result['root_offset_end'] = end
        if search_string in result["par_segment"][0]:
            beg,end, = get_offsets(search_string,result["par_segment"][0])[:2]
            result['par_offset_beg'] = beg
            result['par_offset_end'] = end        
    return result_list
