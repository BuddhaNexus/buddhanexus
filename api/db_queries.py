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

query_text_segments = """
FOR file IN files
    FILTER file._key == @filename
    FOR segmentnr IN file.segmentnrs
        FOR segment in segments
            FILTER segment._key == segmentnr
            RETURN { segnr: segment.segnr,
                     segtext: segment.segtext,
                     parallel_ids: segment.parallel_ids }
"""

query_text_search = """
FOR file IN files
    FILTER file._key == @filename
    FOR segmentnr IN file.segmentnrs
        FOR segment in segments
            FILTER segment._key == segmentnr
            FILTER CONTAINS(segment.segtext, @search_string)
            RETURN { segnr: segment.segnr,
                     segtext: segment.segtext,
                     parallel_ids: segment.parallel_ids }
"""

query_parallels_for_left_text = """
RETURN (
    FOR parallel_id IN @parallel_ids
        FOR p IN parallels 
            FILTER p._key == parallel_id
            LET filtertest = (
                FOR item IN @limitcollection
                    RETURN REGEX_TEST(p.par_segnr[0], item)
                )
                LET filternr = (@limitcollection != []) ? POSITION(filtertest, true) : true
                FILTER filternr == true
                FILTER p.score >= @score
                FILTER p.par_length >= @parlength
                FILTER p["co-occ"] <= @coocc
                RETURN p
)
"""

query_graph_data = """
FOR p IN parallels
    FILTER p.filename == @filename
    FILTER p.score >= @score
    FILTER p.par_length >= @parlength
    FILTER p["co-occ"] <= @coocc
    LET textname = SPLIT(p.par_segnr[0],":")[0]
    RETURN { textname : textname,
             parlength : p.par_length }
"""

query_categories_per_collection = """
FOR collection IN menu_collections
    FILTER collection._key == @searchterm
    RETURN collection.categories
"""

query_sorted_category_list = """
FOR target IN @selected
    FOR collection IN menu_collections
        FILTER collection._key == target
        FOR category IN collection.categories
            FOR menucategory IN menu_categories
                FILTER menucategory.category == category
                FILTER menucategory.language == @language
                SORT menucategory.categorynr
                LET catname = SPLIT(menucategory.categoryname,["—","("])[0]
                RETURN { [menucategory.category] : catname }
"""

query_files_per_category = """
FOR category IN menu_categories
    FILTER category._key == @searchterm
    SORT category.categorynr
    FOR catfile IN category.files
        FOR file IN files
            FILTER file._key == catfile
            RETURN { filename: file._key,
                     totallengthcount: file.totallengthcount }
"""

query_all_collections = """
FOR menu IN menu_collections
    RETURN { collectionname : menu.collection,
             collectionlanguage: menu.language,
             collectionkey: menu._key }
"""
