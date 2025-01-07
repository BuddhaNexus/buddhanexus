import re
import buddhanexus_lang_analyzer.translate_for_website as bn_translate
from dharmamitra_sanskrit_grammar import DharmamitraSanskritProcessor
import buddhanexus_lang_analyzer.translate_for_website as bn_translate
from fuzzysearch import levenshtein_ngram
import pyewts

sanskrit_processor = DharmamitraSanskritProcessor()

bn_analyzer = bn_translate.analyzer()
bo_converter = pyewts.pyewts()
from aksharamukha import transliterate


def preprocess_search_string(search_string, language):
    result = {"search_string_unprocessed": search_string}

    search_string = _clean_search_string(search_string)

    if language == "all":
        result.update(_process_all_languages(search_string))
    else:
        result.update(_process_single_language(search_string, language))

    return result


def _clean_search_string(search_string):
    search_string = search_string.strip()
    search_string = search_string.replace("ṁ", "ṃ")
    search_string = re.sub("@[0-9a-b+]+", "", search_string)
    search_string = re.sub("/+", "", search_string)
    search_string = re.sub(" +", " ", search_string)
    return search_string


def _process_single_language(search_string, language):
    result = {}

    if language == "bo":
        result["bo"], result["bo_fuzzy"] = _process_tibetan(search_string)
    elif language == "sa":
        result["sa"], result["sa_fuzzy"] = _process_sanskrit(search_string)
    elif language == "pa":
        result["pa"], result["pa_fuzzy"] = _process_pali(search_string)
    elif language == "zh":
        result["zh"] = _process_chinese(search_string)

    return result


def _process_all_languages(search_string):
    result = {}

    if re.search("[\u0F00-\u0FDA]", search_string):
        result["bo"], result["bo_fuzzy"] = _process_tibetan(search_string)
        result["sa"] = result["bo"]
    else:
        if bn_translate.check_if_sanskrit(search_string):
            sa, sa_fuzzy = _process_sanskrit(search_string)
            result["sa"] = sa
            result["sa_fuzzy"] = sa_fuzzy
            pa, pa_fuzzy = _process_pali(search_string)
            result["pa"] = pa
            result["pa_fuzzy"] = pa_fuzzy
            if sa_fuzzy == "":
                result["bo"], result["bo_fuzzy"] = _process_tibetan(search_string)
                result["zh"] = search_string
        else:
            result["sa"] = search_string
            result["zh"] = search_string
            pa, pa_fuzzy = _process_pali(search_string)
            result["pa"] = pa
            result["pa_fuzzy"] = pa_fuzzy
            result["bo"], result["bo_fuzzy"] = _process_tibetan(search_string)

    return result


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
    # Create a dict to track best result per segment number
    best_results = {}

    # First pass - find best result for each segment number
    for result in results:
        segment_nrs = result["segment_nr"]
        centeredness = result["centeredness"]

        for seg_nr in segment_nrs:
            if seg_nr not in best_results or centeredness < best_results[seg_nr][1]:
                best_results[seg_nr] = (result, centeredness)

    # Second pass - mark results as disabled if they're not the best for any of their segments
    for result in results:
        should_disable = True
        for seg_nr in result["segment_nr"]:
            if best_results[seg_nr][0] is result:
                should_disable = False
                break
        if should_disable:
            result["disabled"] = True

    for result in results:
        result["segment_nr"] = result["segment_nr"][0]

    # Return only non-disabled results
    return [result for result in results if "disabled" not in result]


def process_result(result, search_string):
    try:
        beg, end, centeredness, distance = get_offsets(
            search_string.lower(), result["original"].lower()
        )

        result["offset_beg"] = beg
        result["offset_end"] = end
        result["distance"] = distance
        result["centeredness"] = centeredness
        result["similarity"] = 100
        if distance != 0:
            result["similarity"] = 100 - distance / len(search_string)

        return result
    except (RuntimeError, TypeError, NameError):
        pass


def postprocess_results(search_strings, results):
    new_results = []
    search_string = search_strings["search_string_unprocessed"]
    for result in results:
        result["original"] = re.sub(
            "@[0-9a-b+]+", "", result["original"]
        )  # remove possible bo folio numbers
        processed = process_result(result, search_string)
        if processed:
            new_results.append(processed)
    results = [x for x in new_results if x is not None]
    results = [x for x in results if "centeredness" in x]
    results = remove_duplicate_results(results)
    results = sorted(results, key=lambda i: i["distance"])
    results = results[::-1]
    return results[:200]  # make sure we return a fixed number of results


def _process_sanskrit(search_string):
    try:
        search_string = transliterate.process("autodetect", "IAST", search_string)
        search_string = search_string.lower()
    except Exception:
        pass

    try:
        sa_fuzzy = sanskrit_processor.process_batch(
            [search_string], mode="unsandhied", output_format="string"
        )[0]
    except Exception:
        sa_fuzzy = ""

    return search_string, sa_fuzzy if sa_fuzzy else search_string


def _process_tibetan(search_string):
    bo_wylie = search_string
    if re.search("[\u0F00-\u0FDA]", search_string):
        bo_wylie = bo_converter.toWylie(search_string)

    try:
        bo_fuzzy = bn_analyzer.process_bo(bo_wylie)
    except Exception:
        bo_fuzzy = bo_wylie

    return bo_wylie, bo_fuzzy


def _process_pali(search_string):
    try:
        search_string = transliterate.process("autodetect", "IAST", search_string)
        search_string = search_string.lower()
    except Exception:
        pass

    try:
        pa_fuzzy = sanskrit_processor.process_batch(
            [search_string], mode="unsandhied", output_format="string"
        )[0]
    except Exception:
        pa_fuzzy = ""

    return search_string, pa_fuzzy if pa_fuzzy else search_string


def _process_chinese(search_string):
    # For now, just return the cleaned string
    return search_string
