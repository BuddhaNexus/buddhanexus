QUERY_SEARCH = """
LET chinese_results = (
    FOR d IN search_index_chn_view
        SEARCH PHRASE(d.search_string_precise, @search_string_chn, 'text_zh')
        LIMIT 1000
        FILTER LENGTH(@limitcollection_include) == 0 OR (d.category IN @limitcollection_include OR d.file_name IN @limitcollection_include)
        FILTER LENGTH(@limitcollection_exclude) == 0 OR (d.category NOT IN @limitcollection_exclude AND d.file_name NOT IN @limitcollection_exclude)
        RETURN d
    )

let tibetan_fuzzy_results = (
    FOR d IN search_index_tib_fuzzy_view
        SEARCH PHRASE(d.search_string_fuzzy, @search_string_tib, 'tibetan_fuzzy_analyzer')
        LIMIT 1000
        FILTER LENGTH(@limitcollection_include) == 0 OR (d.category IN @limitcollection_include OR d.file_name IN @limitcollection_include)
        FILTER LENGTH(@limitcollection_exclude) == 0 OR (d.category NOT IN @limitcollection_exclude AND d.file_name NOT IN @limitcollection_exclude)
        RETURN d
    )
let skt_results = (
    FOR d IN search_index_skt_view
        SEARCH PHRASE(d.search_string_precise, @search_string_skt, 'sanskrit_analyzer')
        LIMIT 1000
        FILTER LENGTH(@limitcollection_include) == 0 OR (d.category IN @limitcollection_include OR d.file_name IN @limitcollection_include)
        FILTER LENGTH(@limitcollection_exclude) == 0 OR (d.category NOT IN @limitcollection_exclude AND d.file_name NOT IN @limitcollection_exclude)
        RETURN d
    )
let skt_results_fuzzy = (
    FOR d IN search_index_skt_view
        SEARCH PHRASE(d.search_string_fuzzy, @search_string_skt_fuzzy, 'sanskrit_analyzer')
        LIMIT 1000
        FILTER LENGTH(@limitcollection_include) == 0 OR (d.category IN @limitcollection_include OR d.file_name IN @limitcollection_include)
        FILTER LENGTH(@limitcollection_exclude) == 0 OR (d.category NOT IN @limitcollection_exclude AND d.file_name NOT IN @limitcollection_exclude)
        RETURN d
    )

let pli_results = (
    FOR d IN search_index_pli_view
        SEARCH PHRASE(d.search_string_fuzzy, @search_string_pli, 'pali_analyzer')
        LIMIT 1000
        FILTER LENGTH(@limitcollection_include) == 0 OR (d.category IN @limitcollection_include OR d.file_name IN @limitcollection_include)
        FILTER LENGTH(@limitcollection_exclude) == 0 OR (d.category NOT IN @limitcollection_exclude AND d.file_name NOT IN @limitcollection_exclude)
        RETURN d
    )
LET results = FLATTEN([chinese_results, tibetan_fuzzy_results,skt_results,skt_results_fuzzy,pli_results])

LET combined_results = (
    FOR result IN results
        LET multilang_parallel_ids = (
            FOR segment IN segments
                FILTER segment._key == result.segment_nr[1]
                RETURN segment.parallel_ids_multi
            )
        LET multilang_results = (
            FOR parallel_id IN FLATTEN(multilang_parallel_ids)
                FOR p in parallels_multi
                    FILTER p._key == parallel_id
                    RETURN {
                        root_segnr : p.root_segnr,
                        par_segnr : p.par_segnr,
                        root_string : p.root_string,
                        par_string : p.par_string
                        }
            )
        RETURN [result,multilang_results]
    )

RETURN combined_results
"""
