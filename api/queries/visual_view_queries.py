"""
Contains all database queries related to visual view.

"""


QUERY_VISUAL_CATEGORY_VIEW = """
LET category_stats = (
    FOR f IN global_stats_categories
        FILTER f._key IN @inquirycollection
        LET categorynr = (
            FOR cat IN menu_categories
                FILTER cat.category == f._key
                RETURN cat.categorynr
        )
        LET filteredKeys = ATTRIBUTES(f.stats)
        LET filteredValues = VALUES(f.stats)
        LET validHitCollections = @hitcollections[* FILTER CURRENT IN filteredKeys]
        LET filteredPairs = ZIP(filteredKeys, filteredValues)
        RETURN {
            collection: f._key,
            categorynr: categorynr,
            stats: ZIP(
                validHitCollections, 
                validHitCollections[* RETURN filteredPairs[CURRENT]]
            )
        }
)
    
LET order = @hitcollections
    
FOR doc IN category_stats
    SORT doc.categorynr[0] ASC
    FOR key IN order
        FILTER HAS(doc.stats, key)
        RETURN [doc.collection, key, doc.stats[key]]
"""


QUERY_FILES_FOR_ONE_CATEGORY = """
FOR file IN files
    FILTER file.category == @category
    SORT file.filenr
    RETURN file.filename
"""


QUERY_VISUAL_FILE_VIEW = """
LET files_stats = (
    FOR f IN global_stats_files
        FILTER f._key IN @inquirycollection
        LET filenr = (
            FOR file IN files
                FILTER file._key == f._key
                RETURN file.filenr
        )
        LET filteredKeys = ATTRIBUTES(f.stats)
        LET filteredValues = VALUES(f.stats)
        LET validHitCollections = @hitcollections[* FILTER CURRENT IN filteredKeys]
        LET filteredPairs = ZIP(filteredKeys, filteredValues)
        RETURN {
            collection: f._key,
            filenr: filenr,
            stats: ZIP(
                validHitCollections, 
                validHitCollections[* RETURN filteredPairs[CURRENT]]
            )
        }
)
    
LET order = @hitcollections
    
FOR doc IN files_stats
    SORT doc.filenr[0] ASC
    FOR key IN order
        FILTER HAS(doc.stats, key)
        RETURN [doc.collection, key, doc.stats[key]]
"""
