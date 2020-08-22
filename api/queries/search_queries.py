QUERY_SEARCH = """
LET chinese_results = (
    FOR d IN search_index_chn_view
        SEARCH PHRASE(d.search_string_precise, @search_string_chn, 'text_zh')
        LIMIT 1000
        RETURN d
    )

let tibetan_fuzzy_results = (
    FOR d IN search_index_tib_fuzzy_view
        SEARCH PHRASE(d.search_string_fuzzy, @search_string_tib, 'tibetan_fuzzy_analyzer')
        LIMIT 1000
        RETURN d
    )
let skt_results = (
    FOR d IN search_index_skt_view
        SEARCH PHRASE(d.search_string_precise, @search_string_skt, 'sanskrit_analyzer')
        LIMIT 1000
        RETURN d
    )
let skt_results_fuzzy = (
    FOR d IN search_index_skt_view
        SEARCH PHRASE(d.search_string_fuzzy, @search_string_skt_fuzzy, 'sanskrit_analyzer')
        LIMIT 1000
        RETURN d
    )

let pli_results = (
    FOR d IN search_index_pli_view
        SEARCH PHRASE(d.search_string_fuzzy, @search_string_pli, 'pali_analyzer')
        LIMIT 1000
        RETURN d
    )


RETURN FLATTEN([chinese_results, tibetan_fuzzy_results,skt_results,skt_results_fuzzy,pli_results])
"""
