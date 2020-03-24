QUERY_SEARCH_TIB = """
FOR d IN search_index_tib_view 
    SEARCH PHRASE(d.search_string_precise, @search_string, 'tibetan_analyzer') 
    RETURN d
"""

QUERY_SEARCH_SKT_PLI = """
FOR d IN search_index_skt_pli_view 
    SEARCH PHRASE(d.search_string_precise, @search_string, 'sanskrit_analyzer') 
    RETURN d
"""


QUERY_SEARCH = """
LET chinese_results = (
    FOR d IN search_index_chn_view 
        SEARCH PHRASE(d.search_string_precise, @search_string, 'text_zh') 
        RETURN d
    )

let tibetan_precise_results = (
    FOR d IN search_index_tib_view 
        SEARCH PHRASE(d.search_string_precise, @search_string, 'tibetan_analyzer') 
        RETURN d
    )
let tibetan_fuzzy_results = (
    FOR d IN search_index_tib_fuzzy_view 
        SEARCH PHRASE(d.search_string_precise, @search_string, 'tibetan_fuzzy_analyzer') 
        RETURN d
    )
let skt_pli_results = (
    FOR d IN search_index_skt_pli_view 
        SEARCH PHRASE(d.search_string_precise, @search_string, 'sanskrit_analyzer') 
        RETURN d
    )
let skt_pli_results_fuzzy = (
    FOR d IN search_index_skt_pli_view 
        SEARCH PHRASE(d.search_string_fuzzy, @search_string_fuzzy, 'sanskrit_analyzer') 
        RETURN d
    )
RETURN FLATTEN([chinese_results, tibetan_precise_results,tibetan_fuzzy_results,skt_pli_results,skt_pli_results_fuzzy])
"""

