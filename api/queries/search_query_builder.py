def build_query_search(query_languages, bind_variables, filters=None, max_limit=1000):
    """
    Build search query for specified languages only

    Args:
        query_languages: List of language codes to search
        bind_variables: Dict of bind variables that will be available in the query
        filters: Optional filters to apply
        max_limit: Maximum number of results per language
    """
    if not query_languages:
        return "RETURN []"

    # Helper to generate the repeated filter code - only if filters are provided
    def filter_clauses():
        if not filters:
            return ""

        return f"""
        FILTER LENGTH(@filter_include_files) == 0 OR d.filename IN @filter_include_files
        FILTER LENGTH(@filter_exclude_files) == 0 OR d.filename NOT IN @filter_exclude_files
        FILTER LENGTH(@filter_include_categories) == 0 OR d.category IN @filter_include_categories
        FILTER LENGTH(@filter_exclude_categories) == 0 OR d.category NOT IN @filter_exclude_categories
        FILTER LENGTH(@filter_include_collections) == 0 OR d.collection IN @filter_include_collections
        FILTER LENGTH(@filter_exclude_collections) == 0 OR d.collection NOT IN @filter_exclude_collections"""

    # Map of language configurations
    language_configs = {
        "sa": [
            # normal Sanskrit
            {
                "view": "search_index_sa_view",
                "phrase_field": "d.analyzed",
                "analyzer": "sanskrit_analyzer",
                "bind_var": "@search_string_sa",
            },
            # fuzzy Sanskrit
            {
                "view": "search_index_sa_view",
                "phrase_field": "d.analyzed",
                "analyzer": "sanskrit_analyzer",
                "bind_var": "@search_string_sa_fuzzy",
            },
        ],
        "bo": [
            # normal Tibetan
            {
                "view": "search_index_bo_view",
                "phrase_field": "d.original",
                "analyzer": "tibetan_analyzer",
                "bind_var": "@search_string_bo",
            },
            # fuzzy Tibetan
            {
                "view": "search_index_bo_fuzzy_view",
                "phrase_field": "d.analyzed",
                "analyzer": "tibetan_fuzzy_analyzer",
                "bind_var": "@search_string_bo_fuzzy",
            }
        ],
        "pa": [
            # normal Pali
            {
                "view": "search_index_pa_view",
                "phrase_field": "d.original",
                "analyzer": "pali_analyzer",
                "bind_var": "@search_string_pa",
            },
            # fuzzy Pali
            {
                "view": "search_index_pa_view",
                "phrase_field": "d.analyzed",
                "analyzer": "pali_analyzer",
                "bind_var": "@search_string_pa_fuzzy",
            }
        ],
        "zh": [
            {
                "view": "search_index_zh_view",
                "phrase_field": "d.original",
                "analyzer": "text_zh",
                "bind_var": "@search_string_zh",
            }
        ],
    }

    # Build sub-queries only for languages actually requested and have search strings
    subqueries = []
    for lang in query_languages:
        if lang not in language_configs:
            continue

        for config in language_configs[lang]:
            # Skip this configuration if we don't expect to have the bind variable
            bind_var = config["bind_var"].replace(
                "@", ""
            )  # Remove @ from bind variable name
            if bind_var not in bind_variables:  # Add this check
                continue

            subquery = f"""(
                FOR d IN {config['view']}
                    SEARCH PHRASE({config['phrase_field']}, {config['bind_var']}, '{config['analyzer']}')
                    LIMIT {max_limit}{filter_clauses()}
                    RETURN d
            )"""
            subqueries.append(subquery)

    # If no subqueries were built, return empty result
    if not subqueries:
        return "RETURN []"

    # Combine the sub-queries into a single FLATTEN
    subqueries_combined = ",\n        ".join(subqueries)
    query = f"""
    LET combined_subqueries = FLATTEN([
        {subqueries_combined}
    ])

    LET results_with_names = (
        FOR r IN combined_subqueries
            LET full_names = (
                FOR file in files
                    FILTER file._key == r.filename
                    RETURN {{
                        "display_name": file.displayName,
                        "text_name": file.textname,
                        "link1": file.link,
                        "link2": file.link2
                    }}
            )
            RETURN {{
                original: r.original,
                stemmed: r.analyzed,
                category: r.category,
                language: r.lang,
                segment_nr: r.segmentnr,
                full_names: FIRST(full_names)
            }}
    )

    RETURN results_with_names
    """
    return query
