def build_query_search(
    query_languages,
    filters=None,
    max_limit=1000,
):
    """
    Build a modular AQL search query based on requested languages.

    :param query_languages: list of language codes, e.g. ['zh', 'bo', 'sa', 'pa']
    :param filters: dict with filter arrays if needed, e.g.
                    {
                      "filter_include_files": [],
                      "filter_exclude_files": [],
                      "filter_include_categories": [],
                      "filter_exclude_categories": [],
                      "filter_include_collections": [],
                      "filter_exclude_collections": [],
                      ...
                    }
    :param max_limit: max number of documents per language sub-query
    :return: an AQL query string
    """

    # Provide default empty lists if no filters passed
    if filters is None:
        filters = {}

    # Helper to generate the repeated filter code
    def filter_clauses():
        return f"""
        FILTER LENGTH(@filter_include_files) == 0 OR d.filename IN @filter_include_files
        FILTER LENGTH(@filter_exclude_files) == 0 OR d.filename NOT IN @filter_exclude_files
        FILTER LENGTH(@filter_include_categories) == 0 OR d.category IN @filter_include_categories
        FILTER LENGTH(@filter_exclude_categories) == 0 OR d.category NOT IN @filter_exclude_categories
        FILTER LENGTH(@filter_include_collections) == 0 OR d.collection IN @filter_include_collections
        FILTER LENGTH(@filter_exclude_collections) == 0 OR d.collection NOT IN @filter_exclude_collections"""

    # We map each language code to:
    # - the AQL view name
    # - the AQL field to PHRASE-search on
    # - the analyzer to use
    # - possibly a second "fuzzy" version if needed
    # Adjust this dictionary as needed for your project.
    language_map = {
        "zh": [
            {
                "view": "search_index_zh_view",
                "phrase_field": "d.original",
                "analyzer": "text_zh",
                "bind_var": "@search_string_zh",
            }
        ],
        "bo": [
            {
                "view": "search_index_bo_view",
                "phrase_field": "d.analyzed",
                "analyzer": "tibetan_fuzzy_analyzer",
                "bind_var": "@search_string_bo",
            }
        ],
        "sa": [
            # normal Sanskrit
            {
                "view": "search_index_sa_view",
                "phrase_field": "d.analyzed",
                "analyzer": "sanskrit_analyzer",
                "bind_var": "@search_string_sa",
            },
            # fuzzy Sanskrit example
            {
                "view": "search_index_sa_view",
                "phrase_field": "d.analyzed",
                "analyzer": "sanskrit_analyzer",
                "bind_var": "@search_string_sa_fuzzy",
            },
        ],
        "pa": [
            {
                "view": "search_index_pa_view",
                "phrase_field": "d.analyzed",
                "analyzer": "pali_analyzer",
                "bind_var": "@search_string_pa",
            }
        ],
    }

    # Build sub-queries only for languages actually requested
    subqueries = []
    for lang in query_languages:
        if lang not in language_map:
            continue

        for entry in language_map[lang]:
            # Wrap each subquery in parentheses and RETURN
            subquery = f"""(
                FOR d IN {entry['view']}
                    SEARCH PHRASE({entry['phrase_field']}, {entry['bind_var']}, '{entry['analyzer']}')
                    LIMIT {max_limit}{filter_clauses()}
                    RETURN d
            )"""
            subqueries.append(subquery)

    # If no subqueries were built, you might return an empty result
    # or a fallback search, depending on your application’s needs.
    if not subqueries:
        return """
        RETURN []
        """

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

