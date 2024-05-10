QUERY_FILES_FOR_LANGUAGE = """
FOR file IN files
    FILTER file.language == @language
    FILTER file.displayName != null
    SORT file.filenr
    RETURN {
        displayName: file.displayName,        
        textname: file.textname,
        filename: file.filename,
        category: file.category,
        available_lang: file.available_lang
    }
"""

QUERY_FILES_FOR_MULTILANG = """
FOR file in files
    FILTER LENGTH(file.available_lang) > 0
    SORT file.language, file.filename ASC
    RETURN {
        filelanguage: file.language,
        displayName: file.displayName,
        search_field: file.search_field,
        textname: file.textname,
        filename: file.filename,
        category: file.category,
        available_lang: file.available_lang
    }
"""

QUERY_FILES_FOR_CATEGORY = """
FOR file IN files
        FILTER file.language == @language
        SORT file.filenr
        RETURN {
            filename: file.filename,
            categoryname: file.textname,
            displayname: file.displayName,
            search_field: file.search_field
        }
"""

QUERY_CATEGORIES_FOR_LANGUAGE = """
LET total_collection = (
    FOR collection menu_collections
        FILTER collection.language == @language
        SORT collection.collectionnr
        LET categories = (
            for collection_category in collection.categories
                FOR category IN menu_categories
                    FILTER category.category == collection_category                                
                    LET categorynamepart = SPLIT( category.categoryname, [ "—", "(" ] )[0]
                    LET categoryname = CONCAT_SEPARATOR(" ",categorynamepart,CONCAT("(",UPPER(category.category),")"))
                    RETURN {
                        category: category.category,
                        categoryname: CONCAT("• ",categoryname)
                }
            SORT category.categorynr
        )
        RETURN APPEND(
            [{ category: collection._key, categoryname: CONCAT(UPPER(collection.collection), " (ALL)") }],
            categories
        )
    )
RETURN FLATTEN(total_collection)
"""

QUERY_TOTAL_MENU = """
FOR collection IN menu_collections
    filter collection.language == @language
    LET categories = (
        FOR categories in collection.categories
            FOR category IN menu_categories
                FILTER category.language == @language
                FILTER category.category == categories 
                SORT category.categorynr
                LET catname = SPLIT(category.categoryname,["—","("])[0]
                LET filelist = (
                    FOR file IN files
                        FILTER file.language == category.language
                        FILTER file.category == category.category
                        SORT file.filenr
                        FILTER file
                        RETURN { file_name: file.filename, textname: file.textname, displayname: file.displayName, available_lang : file.available_lang}
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
    }"""


QUERY_ALL_COLLECTIONS = """
FOR menu IN menu_collections
    RETURN {
        collectionname : menu.collection,
        collectionlanguage: menu.language,
        collectionkey: menu._key
    }
"""

QUERY_ONE_COLLECTION = """
FOR collection in menu_collections
    FILTER collection._key == @collectionkey
    RETURN collection.categories
"""

QUERY_COLLECTION_NAMES = """
RETURN (
    FOR category IN menu_categories
        FILTER category.language == @language
        SORT category.categorynr
        FOR collection_key IN @collections
            FILTER category["category"] == collection_key
            RETURN {
                [category["category"]]: category.categoryname
            }
)
"""

QUERY_CATEGORIES_PER_LANGUAGE = """
FOR category IN menu_categories
    FILTER category.language == @language
    SORT category.categorynr
    RETURN {
        id: category["category"],
        displayName: category.categoryname
    }
"""

QUERY_FILES_PER_CATEGORY = """
FOR file IN files_parallel_count
    FILTER file.category == @category
    FILTER file.language == @language
    FOR file_name in files
        FILTER file_name._key == file._key
        SORT file.filenr
        RETURN {
            file_name: file._key,
            displayName: file_name.displayName,
            totallengthcount: file.totallengthcount
        }
"""
