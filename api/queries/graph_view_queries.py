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
    FOR current_parallel IN SLICE(target_file.parallels_randomized, 0, 2500)
        LET p = DOCUMENT(parallels, current_parallel)
            FILTER p.score * 100 >= @score
            FILTER p.par_length >= @parlength
            RETURN p
)

FOR p IN current_parallels
    FOR file IN files
        FILTER file.filename == p.par_filename
        FILTER LENGTH(@targetcollection) == 0 OR file.collection IN @targetcollection
        LET categorylist = (
            RETURN {
                "category": file.category,
                "parlength": p.par_length
                }
        )
    
FOR item IN categorylist
COLLECT category = item.category 
AGGREGATE total_length = SUM(item.parlength)
SORT total_length DESC
RETURN [category, total_length]
"""
