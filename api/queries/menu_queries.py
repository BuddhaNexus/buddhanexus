QUERY_FILES_FOR_LANGUAGE = """
FOR category IN menu_categories
    FILTER category.language == @language
    FOR catfile IN category.files
        FOR file IN files
            FILTER file._key == catfile
            SORT file.filenr
            RETURN {displayName: file.displayName,
                    textname: file.textname,
                    filename: file.filename,
                    category: file.category}
"""

QUERY_FILES_FOR_CATEGORY = """
FOR category IN menu_categories
    FILTER category.language == @language
    SORT category.categorynr
    FOR catfile IN category.files
        RETURN {filename: catfile,
                categoryname: UPPER(catfile)}
"""


QUERY_CATEGORIES_FOR_LANGUAGE = """
LET total_collection = (
    FOR collection IN 1..1 OUTBOUND CONCAT("languages/", @language) GRAPH 'collections_categories' OPTIONS { "uniqueVertices": "global", "bfs": true }
        SORT collection.collectionnr
        LET categorylist = (
            FOR category IN 1..1 OUTBOUND collection._id GRAPH 'collections_categories'
                SORT category.categorynr
                LET categorynamepart = SPLIT( category.categoryname, [ "—", "(" ] )[0]
                LET categoryname = CONCAT_SEPARATOR(" ",categorynamepart,CONCAT("(",UPPER(category.category),")"))
                RETURN {
                    category: category.category,
                    categoryname: CONCAT("• ",categoryname)
                }
        )
        RETURN APPEND([{
                category: collection._key,
                categoryname: CONCAT(UPPER(collection.collection), " (ALL)")
            }],
            categorylist
        )
    )
RETURN FLATTEN(total_collection)
"""

QUERY_TOTAL_MENU = """
    FOR collection IN menu_collections
        FILTER collection.language == @language
        LET categorylist = (
        FOR col_category IN collection.categories
            FOR category IN menu_categories
                FILTER category.category == col_category
                FILTER category.language == @language
                SORT category.categorynr
                LET catname = SPLIT(category.categoryname,["—","("])[0]
                LET filelist = (
                    FOR cat_file IN category.files
                        FOR file in files
                            FILTER file._key == cat_file
                            SORT file.filenr
                            RETURN {filename: file.filename,
                                    displayname: file.displayName}
                )
                RETURN {categoryname: category.category,
                        categorydisplayname: catname,
                        files: filelist}
                )
        RETURN { collection: collection.collection,
                 categories: categorylist }
"""

QUERY_ALL_COLLECTIONS = """
FOR menu IN menu_collections
    RETURN { collectionname : menu.collection,
             collectionlanguage: menu.language,
             collectionkey: menu._key }
"""

QUERY_CATEGORIES_PER_COLLECTION = """
    FOR collection IN menu_collections
        LET language = collection.language
        LET categorylist = (
        FOR col_category IN collection.categories
            FOR category IN menu_categories
                FILTER category.category == col_category
                FILTER category.language == language
                SORT category.categorynr
                LET catname = SPLIT(category.categoryname,["—","("])[0]
                RETURN {[category["category"]]: catname }
                )
        RETURN { collection: collection._key,
                 language: language,
                 categories: categorylist }
"""

QUERY_ONE_COLLECTION = """
    FOR collection IN menu_collections
        FILTER collection._key == @collectionkey
        RETURN collection.categories
"""
