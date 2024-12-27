QUERY_SEARCH = """
LET filesCollectionExists = COLLECTION_EXISTS("files")

LET chinese_results = (
    FOR d IN search_index_zh_view
        SEARCH PHRASE(d.original, @search_string_zh, 'text_zh')
        LIMIT 1000
        FILTER LENGTH(@filter_include_files) == 0 OR d.filename IN @filter_include_files
        FILTER LENGTH(@filter_exclude_files) == 0 OR d.filename NOT IN @filter_exclude_files
        FILTER LENGTH(@filter_include_categories) == 0 OR d.category IN @filter_include_categories
        FILTER LENGTH(@filter_exclude_categories) == 0 OR d.category NOT IN @filter_exclude_categories
        FILTER LENGTH(@filter_include_collections) == 0 OR d.collection IN @filter_include_collections
        FILTER LENGTH(@filter_exclude_collections) == 0 OR d.collection NOT IN @filter_exclude_collections
        RETURN d
)

LET tibetan_fuzzy_results = (
    FOR d IN search_index_bo_view
        SEARCH PHRASE(d.analyzed, @search_string_bo, 'tibetan_fuzzy_analyzer')
        LIMIT 1000
        FILTER LENGTH(@filter_include_files) == 0 OR d.filename IN @filter_include_files
        FILTER LENGTH(@filter_exclude_files) == 0 OR d.filename NOT IN @filter_exclude_files
        FILTER LENGTH(@filter_include_categories) == 0 OR d.category IN @filter_include_categories
        FILTER LENGTH(@filter_exclude_categories) == 0 OR d.category NOT IN @filter_exclude_categories
        FILTER LENGTH(@filter_include_collections) == 0 OR d.collection IN @filter_include_collections
        FILTER LENGTH(@filter_exclude_collections) == 0 OR d.collection NOT IN @filter_exclude_collections
        RETURN d
)

LET sanskrit_results = (
    FOR d IN search_index_sa_view
        SEARCH PHRASE(d.analyzed, @search_string_sa, 'sanskrit_analyzer')
        LIMIT 1000
        FILTER LENGTH(@filter_include_files) == 0 OR d.filename IN @filter_include_files
        FILTER LENGTH(@filter_exclude_files) == 0 OR d.filename NOT IN @filter_exclude_files
        FILTER LENGTH(@filter_include_categories) == 0 OR d.category IN @filter_include_categories
        FILTER LENGTH(@filter_exclude_categories) == 0 OR d.category NOT IN @filter_exclude_categories
        FILTER LENGTH(@filter_include_collections) == 0 OR d.collection IN @filter_include_collections
        FILTER LENGTH(@filter_exclude_collections) == 0 OR d.collection NOT IN @filter_exclude_collections
        RETURN d
)

LET sanskrit_results_fuzzy = (
    FOR d IN search_index_sa_view
        SEARCH PHRASE(d.analyzed, @search_string_sa_fuzzy, 'sanskrit_analyzer')
        LIMIT 1000
        FILTER LENGTH(@filter_include_files) == 0 OR d.filename IN @filter_include_files
        FILTER LENGTH(@filter_exclude_files) == 0 OR d.filename NOT IN @filter_exclude_files
        FILTER LENGTH(@filter_include_categories) == 0 OR d.category IN @filter_include_categories
        FILTER LENGTH(@filter_exclude_categories) == 0 OR d.category NOT IN @filter_exclude_categories
        FILTER LENGTH(@filter_include_collections) == 0 OR d.collection IN @filter_include_collections
        FILTER LENGTH(@filter_exclude_collections) == 0 OR d.collection NOT IN @filter_exclude_collections
        RETURN d
)

LET pali_results = (
    FOR d IN search_index_pa_view
        SEARCH PHRASE(d.analyzed, @search_string_pa, 'pali_analyzer')
        LIMIT 1000
        FILTER LENGTH(@filter_include_files) == 0 OR d.filename IN @filter_include_files
        FILTER LENGTH(@filter_exclude_files) == 0 OR d.filename NOT IN @filter_exclude_files
        FILTER LENGTH(@filter_include_categories) == 0 OR d.category IN @filter_include_categories
        FILTER LENGTH(@filter_exclude_categories) == 0 OR d.category NOT IN @filter_exclude_categories
        FILTER LENGTH(@filter_include_collections) == 0 OR d.collection IN @filter_include_collections
        FILTER LENGTH(@filter_exclude_collections) == 0 OR d.collection NOT IN @filter_exclude_collections
        RETURN d
)

LET results = FLATTEN([
    chinese_results,
    tibetan_fuzzy_results,
    sanskrit_results,
    sanskrit_results_fuzzy,
    pali_results
])

LET results_with_names = (
    FOR r IN results
        LET fileInfo = (
            filesCollectionExists
            ? (
                FOR file IN files
                    FILTER file._key == r.filename
                    RETURN {
                        "display_name": file.displayName,
                        "text_name": file.textname,
                        "link1": file.link,
                        "link2": file.link2
                    }
            )
            : []
        )
        RETURN {
            original: r.original,
            stemmed: r.analyzed,
            category: r.category,
            language: r.lang,
            segment_nr: r.segmentnr,
            full_names: LENGTH(fileInfo) > 0 ? fileInfo[0] : {}
        }
)

RETURN results_with_names
"""
