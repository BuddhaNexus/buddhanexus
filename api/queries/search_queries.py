QUERY_SEARCH = """
LET chinese_results = (
    FOR d IN search_index_chn_view
        SEARCH PHRASE(d.original, @search_string_chn, 'text_zh')
        LIMIT 1000
        FILTER LENGTH(@limitcollection_include) == 0 OR (d.category IN @limitcollection_include OR d.filename IN @limitcollection_include)
        FILTER LENGTH(@limitcollection_exclude) == 0 OR (d.category NOT IN @limitcollection_exclude AND d.filename NOT IN @limitcollection_exclude)
        RETURN d
    )

let tibetan_fuzzy_results = (
    FOR d IN search_index_tib_fuzzy_view
        SEARCH PHRASE(d.stemmed, @search_string_tib, 'tibetan_fuzzy_analyzer')
        LIMIT 1000
        FILTER LENGTH(@limitcollection_include) == 0 OR (d.category IN @limitcollection_include OR d.filename IN @limitcollection_include)
        FILTER LENGTH(@limitcollection_exclude) == 0 OR (d.category NOT IN @limitcollection_exclude AND d.filename NOT IN @limitcollection_exclude)
        RETURN d
    )
let skt_results = (
    FOR d IN search_index_skt_view
        SEARCH PHRASE(d.original, @search_string_skt, 'sanskrit_analyzer')
        LIMIT 1000
        FILTER LENGTH(@limitcollection_include) == 0 OR (d.category IN @limitcollection_include OR d.filename IN @limitcollection_include)
        FILTER LENGTH(@limitcollection_exclude) == 0 OR (d.category NOT IN @limitcollection_exclude AND d.filename NOT IN @limitcollection_exclude)
        RETURN d
    )
let skt_results_fuzzy = (
    FOR d IN search_index_skt_view
        SEARCH PHRASE(d.stemmed, @search_string_skt_fuzzy, 'sanskrit_analyzer')
        LIMIT 1000
        FILTER LENGTH(@limitcollection_include) == 0 OR (d.category IN @limitcollection_include OR d.filename IN @limitcollection_include)
        FILTER LENGTH(@limitcollection_exclude) == 0 OR (d.category NOT IN @limitcollection_exclude AND d.filename NOT IN @limitcollection_exclude)
        RETURN d
    )

let pli_results = (
    FOR d IN search_index_pli_view
        SEARCH PHRASE(d.stemmed, @search_string_pli, 'pali_analyzer')
        LIMIT 1000
        FILTER LENGTH(@limitcollection_include) == 0 OR (d.category IN @limitcollection_include OR d.filename IN @limitcollection_include)
        FILTER LENGTH(@limitcollection_exclude) == 0 OR (d.category NOT IN @limitcollection_exclude AND d.filename NOT IN @limitcollection_exclude)
        RETURN d
    )
LET results = FLATTEN([chinese_results, tibetan_fuzzy_results,skt_results,skt_results_fuzzy,pli_results])

LET results_with_names = (
    FOR r IN results
    LET full_names = (
      FOR file in files
        FILTER file._key == r.filename
        RETURN {
          "display_name": file.displayName,
          "text_name": file.textname,
          "link1": file.link,
          "link2": file.link2
        }
    )
    RETURN {
        original: r.original,
        stemmed: r.stemmed,
        category: r.category,
        language: r.language,
        segment_nr: r.segment_nr,
        full_names: full_names[0]
    }
)    

RETURN results_with_names

"""
