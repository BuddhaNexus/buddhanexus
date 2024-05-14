"""
Contains all database queries related to graph view.

"""


QUERY_GRAPH_VIEW = """
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
    FILTER LENGTH(@targetcollection) == 0 OR (p.par_category IN @targetcollection)
    RETURN {
        "textname": SPLIT(p.par_segnr[0],":")[0],
        "parlength": p.par_length
    }
"""
