"""
Contains all database queries related to graph view.

"""


QUERY_GRAPH_VIEW = """
LET filter_target = FLATTEN(
    FOR target_item IN @targetcollection
        FOR category IN 1..1 OUTBOUND concat("menu_collections/", target_item) GRAPH 'collections_categories'
            RETURN category.category
    )

FOR f in parallels_sorted_file
    filter f._key == @file_name
    LET current_parallels = (
    for current_parallel in slice(f.parallels_randomized,0,2500)
        for p in parallels
            filter p._key == current_parallel
            return p
    )

FOR p IN current_parallels
    FILTER p.score * 100 >= @score
    FILTER p.par_length >= @parlength
    LET filtertest = (
        FOR item IN filter_target
            RETURN REGEX_TEST(p.par_segnr[0], CONCAT("^",item,"[^y]"))
    )
    FILTER  true IN filtertest || filtertest == []
    RETURN {
        "textname": SPLIT(p.par_segnr[0],":")[0],
        "parlength": p.par_length,
        "filtertest":filtertest
    }"""
