"""
Contains all database queries related to graph view.

"""

QUERY_GRAPH_VIEW = """
LET target_file = FIRST(
    FOR f IN parallels_sorted_file
        FILTER f.filename == @filename
        RETURN f
)

LET current_parallels = (
    LENGTH(@filter_include_collections) == 0
    ? (
        FOR current_parallel IN SLICE(target_file.parallels_randomized, 0, 2500)
            LET p = DOCUMENT(parallels, current_parallel)
                FILTER p.score * 100 >= @score
                FILTER p.par_length >= @parlength
                FILTER LENGTH(@filter_include_collections) == 0 OR p.par_collection IN @filter_include_collections
                RETURN p
    )
    :
    (
        FOR current_parallel IN target_file.parallels_randomized
            LET p = DOCUMENT(parallels, current_parallel)
                FILTER p.score * 100 >= @score
                FILTER p.par_length >= @parlength
                FILTER LENGTH(@filter_include_collections) == 0 OR p.par_collection IN @filter_include_collections
                RETURN p
    )
)

LET fileslist = (
    FOR p IN current_parallels
        FOR file IN files
            FILTER file.filename == p.par_filename
            FOR cat in category_names
                FILTER cat.category == file.category
                FILTER cat.lang == file.lang
            RETURN {
                "category": CONCAT(UPPER(cat.lang),"_", file.category, " ", cat.displayName),
                "parlength": p.par_length,
                "displayname": CONCAT(file.displayName, " (", UPPER(cat.lang), " ", file.textname, ")")
                }
        )

LET piegraphdata = (
    FOR item IN fileslist
    COLLECT category = item.category
    AGGREGATE total_length = SUM(item.parlength)
    SORT total_length DESC
    RETURN [category, total_length]
)

LET histogramgraphdata = (
    LENGTH(fileslist) < 2500
    ? (
        FOR item IN fileslist
        COLLECT displayname = item.displayname
        AGGREGATE total_length = SUM(item.parlength)
        SORT total_length DESC
        RETURN [displayname, total_length]
    )
    : null
)

RETURN {"piegraphdata": piegraphdata,
        "histogramgraphdata": histogramgraphdata}
"""
