"""
Contains query for the total menudata and for the numbers view category list.

"""

QUERY_TOTAL_DATA = """
FOR file IN files
    FILTER file.lang == @lang
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


QUERY_CATEGORIES_PER_LANGUAGE = """
FOR cat IN category_names
    FILTER cat.lang == @language
    RETURN {
        id: cat.category,
        displayName: cat.displayName
    }
"""
