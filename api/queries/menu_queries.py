QUERY_FILES_FOR_LANGUAGE = """
FOR file IN 3..3 OUTBOUND concat("languages/", @language) GRAPH 'collections_categories'
    SORT file.filenr
    FILTER file
    RETURN {
        displayName: file.displayName,
        textname: file.textname,
        filename: file.filename,
        category: file.category
    }
"""

QUERY_FILES_FOR_CATEGORY = """
FOR category IN 2..2 OUTBOUND concat("languages/", @language) GRAPH 'collections_categories'
    SORT category.categorynr
    FOR file in 1..1 OUTBOUND category._id GRAPH 'collections_categories'
        FILTER file
        RETURN {
            filename: file.filename,
            categoryname: UPPER(file.filename)
        }
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
FOR collection IN 1..1 OUTBOUND concat("languages/", @language) GRAPH 'collections_categories'
    LET categories = (
        FOR category IN 1..1 OUTBOUND collection._id GRAPH 'collections_categories'
            SORT category.categorynr
            LET catname = SPLIT(category.categoryname,["—","("])[0]
            LET filelist = (
                FOR file IN 1..1 OUTBOUND category._id GRAPH 'collections_categories'
                    SORT file.filenr
                    FILTER file
                    RETURN { filename: file.filename, displayname: file.displayName }
            )
            RETURN {
                categoryname: category.category,
                categorydisplayname: catname,
                files: filelist
            }
    )
    RETURN {
        collection: collection.collection,
        categories: categories
    }
"""


QUERY_ALL_COLLECTIONS = """
FOR menu IN menu_collections
    RETURN {
        collectionname : menu.collection,
        collectionlanguage: menu.language,
        collectionkey: menu._key
    }
"""

QUERY_CATEGORIES_PER_COLLECTION = """
FOR lang IN languages
    FOR collection IN 1..1 OUTBOUND concat("languages/", lang._key) GRAPH 'collections_categories'
            LET categories = (
                FOR category IN 1..1 OUTBOUND collection._id GRAPH 'collections_categories'
                    SORT category.categorynr
                    LET catname = SPLIT(category.categoryname,["—","("])[0]
                    RETURN {[category["category"]]: catname }
        )
        RETURN { collection: collection._key, language: collection.language, categories: categories }
"""

QUERY_ONE_COLLECTION = """
FOR category IN 1..1 OUTBOUND concat("menu_collections/", @collectionkey) GRAPH 'collections_categories'
    RETURN category.category
"""
