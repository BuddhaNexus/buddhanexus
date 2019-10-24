query_file_segments_parallels = """
    FOR file IN files
        FILTER file._key == @filename
        LET result = (
            FOR segmentnr IN file.segmentnrs
                LET seg_parallels = (
                    FOR segment IN segments
                    FILTER segment._key == segmentnr
                    FOR segment_id IN segment.parallel_ids
                        FOR p IN parallels
                           FILTER p._key == segment_id
                           LET filtertest = (
                                FOR item IN @limitcollection
                                    RETURN REGEX_TEST(p.par_segnr[0], item)
                                )
                            LET filternr = (@limitcollection != []) ? POSITION(filtertest, true) : true
                            FILTER filternr == true
                            FILTER p.score >= @score
                            FILTER p.par_length >= @parlength
                            FILTER p["co-occ"] <= @coocc
                            RETURN p.par_segnr
                )
                RETURN seg_parallels[0] ? 
                    { "segmentnr": segmentnr, "parallels": seg_parallels } :
                    { "segmentnr": segmentnr }
        )
        RETURN result
"""

query_collection_names = """
RETURN (
    FOR category IN menu_categories
        FILTER category.language == @language
        SORT category.categorynr
        FOR collection_key IN @collections
            FILTER category["category"] == collection_key
            RETURN { [category["category"]]: category.categoryname }
)
"""

query_files_for_language = """
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

query_files_for_category = """
FOR category IN menu_categories
    FILTER category.language == @language
    SORT category.categorynr
    FOR catfile IN category.files
        RETURN {filename: catfile,
                categoryname: UPPER(catfile)}
"""

query_categories_for_language = """
FOR category IN menu_categories
    FILTER category.language == @language
    SORT category.categorynr
    LET categorynamepart = SPLIT( category.categoryname, [ "—", "(" ] )[0]
    RETURN {category: category.category,
            categoryname: CONCAT_SEPARATOR(" ",UPPER(category.category),categorynamepart)}
"""

query_graph_data = """
RETURN MERGE(
    FOR p IN parallels
        FILTER p.filename == @filename
        FILTER p.score >= @score
        FILTER p.par_length >= @parlength
        FILTER p["co-occ"] <= @coocc
        COLLECT textname = SPLIT(p.par_segnr[0],":")[0] WITH COUNT INTO length
        RETURN { [textname] : length }
        )
"""

query_categories_per_collection = """
FOR collection IN menu_collections
    FILTER collection.collection == @collection
    FILTER collection.language == @language
    RETURN collection.categories
"""

query_sorted_category_list = """
FOR category IN menu_categories
    FILTER category.language == @language
    SORT category.categorynr
    RETURN category.category
"""

query_files_per_category = """
FOR category IN menu_categories
    FILTER category.category == @category
    FILTER category.language == @language
    SORT category.categorynr
    FOR catfile IN category.files
        FOR file IN files
            FILTER file._key == catfile
            RETURN { filename: file._key,
                     parallelcount: file.parallelcount }
"""

query_all_collections = """
FOR menu IN menu_collections
    RETURN { collectionname : menu.collection,
             collectionlanguage: menu.language,
             collectionkey: menu._key }
"""
