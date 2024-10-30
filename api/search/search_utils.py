import re
import buddhanexus_lang_analyzer.translate_for_website as bn_translate
from fuzzysearch import levenshtein_ngram
import pyewts

bn_analyzer = bn_translate.analyzer()
bo_converter = pyewts.pyewts()
from aksharamukha import transliterate


def preprocess_search_string(search_string, language):
    bo = ""
    zh = ""
    sa = ""
    pa = ""

    # test if string contains Tibetan characters
    search_string = search_string.strip()
    search_string = re.sub(
        "@[0-9a-b+]+", "", search_string
    )  # remove possible bo folio numbers
    search_string = re.sub(
        "/+", "", search_string
    )  # just in case we have some sort of danda in the search query
    search_string = re.sub(
        " +", " ", search_string
    )  # search is very sensitive to whitespace
    if re.search("[\u0F00-\u0FDA]", search_string):
        bo = bo_converter.toWylie(search_string).strip()
        sa = bo
    else:
        if bn_translate.check_if_sanskrit(search_string):
            sa = transliterate.process("autodetect", "IAST", search_string)
        else:
            sa = search_string
        sa = sa.lower()

    # sa_fuzzy also tests if a string contains bo/zh letters; if so, it returns an empty string
    sa_fuzzy = bn_analyzer.stem_sanskrit(sa)
    pa = bn_analyzer.stem_pali(search_string)
    # if sa_fuzzy detected the string to be Tibetan/Chinese or the unicode2wylie transliteration was successful, do this:
    if sa_fuzzy == "" or bo != "":
        if bo == "":
            bo = search_string
        bo_preprocessed = bo.replace("’", "'")
        bo = bn_analyzer.stem_tibetan(bo_preprocessed)
        zh = search_string
    else:
        sa = search_string

    if language == "sa":
        bo = zh = pa = ""
    elif language == "bo":
        zh = pa = ""
    elif language == "zh":
        bo = pa = ""
    elif language == "pa":
        bo = zh = ""
    return {"sa": sa, "sa_fuzzy": sa_fuzzy, "bo": bo, "pa": pa, "zh": zh}


def get_offsets(search_string, segment_text):
    allowed_distance = 0
    max_distance = len(search_string) / 5
    match = []
    while len(match) == 0 and allowed_distance <= max_distance:
        match = list(
            levenshtein_ngram.find_near_matches_levenshtein_ngrams(
                search_string, segment_text, max_l_dist=allowed_distance
            )
        )
        allowed_distance += 1
    if match:
        match = match[0]
        beg = match.start
        end = match.end
        distance = match.dist
        middle_position = len(segment_text) / 2
        centeredness = (abs(beg - middle_position) + abs(end - middle_position)) / 2
        return beg, end, centeredness, distance


def remove_duplicate_results(results):
    results_by_segnr = {}
    for current_result in results:
        for segment_nr in current_result["segment_nr"]:
            if not segment_nr in results_by_segnr:
                results_by_segnr[segment_nr] = [current_result]
            else:
                results_by_segnr[segment_nr].append(current_result)
    for current_result in results:
        for current_segnr in current_result["segment_nr"]:
            for query_result in results_by_segnr[current_segnr]:
                if not query_result["segment_nr"][0] == current_result["segment_nr"][0]:
                    if (
                        current_result["centeredness"] >= query_result["centeredness"]
                        and not "disabled" in query_result
                    ):
                        current_result["disabled"] = True
    return_results = []
    for result in results:
        if not "disabled" in result:
            return_results.append(result)
    return return_results


def process_result(result, search_string):
    try:
        beg, end, centeredness, distance = get_offsets(
            search_string, result["original"]
        )
        result["offset_beg"] = beg
        result["offset_end"] = end
        result["distance"] = distance
        result["centeredness"] = centeredness
        result["similarity"] = 100
        if distance != 0:
            result["similarity"] = 100 - distance / len(search_string)
        result["segment_nr"] = result["segment_nr"][0]
        return result
    except (RuntimeError, TypeError, NameError):
        pass


def postprocess_results(search_strings, results):
    new_results = []
    search_string = search_strings["sa"]
    for result in results:
        result["original"] = re.sub(
            "@[0-9a-b+]+", "", result["original"]
        )  # remove possible bo folio numbers
        new_results.append(process_result(result, search_string))

    results = [x for x in new_results if x is not None]
    results = [x for x in results if "centeredness" in x]
    results = remove_duplicate_results(results)
    # results = filter_results_by_collection(results, limitcollection_include)
    results = remove_duplicate_results(results)
    results = [i for n, i in enumerate(results) if i not in results[n + 1 :]]
    # First sort according to string similarity, next sort if multilang is present; the idea is that first the multilang results are shown, then the other with increasing distance
    results = sorted(results, key=lambda i: i["distance"])
    results = results[::-1]
    return results[:200]  # make sure we return a fixed number of results
