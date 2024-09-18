"""
Contains all database queries related to visual view.

"""


QUERY_VISUAL_CATEGORY_VIEW = """
LET hitcollection_details = (
    FOR item IN @hitcollections
        FOR cat in menu_categories
            FILTER cat.category == item
            RETURN {
                    hitcategory: item,
                    displayname: cat.categoryname
            }
)

LET category_stats = (
    FOR f IN global_stats_categories
        FILTER f._key IN @inquirycollection
        LET categorydetails = (
            FOR cat IN menu_categories
                FILTER cat.category == f._key
                RETURN {ordernr: cat.categorynr,
                        displayname: cat.categoryname}
        )
        LET filteredKeys = ATTRIBUTES(f.stats)
        LET filteredValues = VALUES(f.stats)
        LET validHitCollections = @hitcollections[* FILTER CURRENT IN filteredKeys]
        LET filteredPairs = ZIP(filteredKeys, filteredValues)
        RETURN {
            collection: f._key,
            ordernr: categorydetails[0].ordernr,
            displayname: categorydetails[0].displayname,
            stats: ZIP(
                validHitCollections, 
                validHitCollections[* RETURN filteredPairs[CURRENT]]
            )
        }
)
    
LET order = @hitcollections
    
FOR doc IN category_stats
    SORT doc.ordernr ASC
    FOR key IN order
        FILTER HAS(doc.stats, key)
        LET output_category = (
        FOR cat IN hitcollection_details
            FILTER cat.hitcategory == key
            RETURN CONCAT(cat.displayname," (", cat.hitcategory,")")
        )
        RETURN [CONCAT(doc.displayname," (", doc.collection,")"), output_category[0], doc.stats[key]]
"""


QUERY_FILES_FOR_ONE_CATEGORY = """
FOR file IN files
    FILTER file.category == @category
    SORT file.filenr
    RETURN file.filename
"""


QUERY_VISUAL_FILE_VIEW = """
LET hitcollection_details = (
    FOR item IN @hitcollections
        FOR cat in menu_categories
            FILTER cat.category == item
            RETURN {
                    hitcategory: item,
                    displayname: cat.categoryname
            }
)

LET files_stats = (
    FOR f IN global_stats_files
        FILTER f._key IN @inquirycollection
        LET filedetails = (
            FOR file IN files
                FILTER file._key == f._key
                RETURN {ordernr: file.filenr,
                        displayname: file.displayName}
        )
        LET filteredKeys = ATTRIBUTES(f.stats)
        LET filteredValues = VALUES(f.stats)
        LET validHitCollections = @hitcollections[* FILTER CURRENT IN filteredKeys]
        LET filteredPairs = ZIP(filteredKeys, filteredValues)
        RETURN {
            collection: f._key,
            ordernr: filedetails[0].ordernr,
            displayname: filedetails[0].displayname,
            stats: ZIP(
                validHitCollections, 
                validHitCollections[* RETURN filteredPairs[CURRENT]]
            )
        }
)
    
LET order = @hitcollections
    
FOR doc IN files_stats
    SORT doc.ordernr ASC
    FOR key IN order
        FILTER HAS(doc.stats, key)
        LET output_category = (
        FOR cat IN hitcollection_details
            FILTER cat.hitcategory == key
            RETURN CONCAT(cat.displayname," (", cat.hitcategory,")")
        )
        RETURN [CONCAT(doc.displayname," (", doc.collection,")"), output_category[0], doc.stats[key]]
"""
