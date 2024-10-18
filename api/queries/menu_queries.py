# QUERY_FILES_FOR_LANGUAGE = """
# FOR file IN files
#     FILTER file.lang == @language
#     FILTER file.displayName != null
#     SORT file.filenr
#     RETURN {
#         displayName: file.displayName,
#         textname: file.textname,
#         filename: file.filename,
#         category: file.category
#     }
# """

QUERY_TOTAL_DATA = """
FOR file IN files
    FILTER file.lang == @lang
    SORT file.filenr
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


# QUERY_ALL_COLLECTIONS = """
# FOR file IN files
#     FILTER file.lang != null
#     COLLECT collection = file.collection, language = file.lang
#     RETURN {
#         collectionname: collection,
#         collectionlanguage: language,
#         collectionkey: language + "_" + collection
#     }
# """

# QUERY_COLLECTION_NAMES = "RETURN category_names"

QUERY_CATEGORIES_PER_LANGUAGE = """
FOR cat IN category_names
    FILTER cat.lang == @language
    RETURN {
        id: cat.category,
        displayName: cat.displayName
    }
"""
