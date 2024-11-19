"""
Contains query for the total menudata.

"""

QUERY_TOTAL_DATA = """
FOR file IN files
    FILTER file.lang == @lang
    FILTER !(file.segment_keys == [])
    SORT file.filenr ASC
    LET category_info = FIRST(
        FOR cat IN category_names
        FILTER cat.category == file.category AND cat.lang == @lang
        RETURN cat.displayName
    )
    LET file_without_segment_keys = UNSET(file, 'segment_keys')
    RETURN MERGE(file_without_segment_keys, { 
        category_display_name: category_info || file.category 
    })
"""
