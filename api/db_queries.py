query_file_segments_parallels = """
FOR file IN files
    FILTER file._key == @filename

    FOR segmentnr IN file.segmentnrs
        LET seg_parallels = (
            FOR segment IN segments
                FILTER segment._key == segmentnr
                FOR parallel_id IN segment.parallel_ids
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
                        RETURN p.par_segnr
            )
        RETURN seg_parallels[0] ? 
            { "segmentnr": segmentnr, "parallels": seg_parallels } :
            { "segmentnr": segmentnr }
"""

query_table_view = """
LET file_parallels = (
    FOR p IN parallels
        FILTER p.root_filename == @filename
        FILTER p.score >= @score
        FILTER p.par_length >= @parlength
        FILTER p["co-occ"] <= @coocc
        LET collection_filter_test = (
            FOR item IN @limitcollection
            RETURN REGEX_TEST(p.par_segnr[0], item)
        )
        LET fits_collection = (@limitcollection != []) 
            ? POSITION(collection_filter_test, true) 
            : true
        FILTER fits_collection == true
        SORT p.@sortkey DESC
        LIMIT 50 * @page, 50
        RETURN {
            par_segnr: p.par_segnr, 
            par_offset_beg: p.par_offset_beg, 
            par_offset_end: p.par_offset_end, 
            root_offset_beg: p.root_offset_beg, 
            root_offset_end: p.root_offset_end-1, 
            par_segment: p.par_segtext, 
            file_name: p.id, 
            root_segnr: p.root_segnr, 
            root_seg_text: p.root_segtext,
            par_length: p.par_length, 
            par_pos_beg: p.par_pos_beg,
            score: p.score
        }
    )
RETURN {
    parallels: file_parallels
    }
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
            FILTER LIKE(segment.segtext, @search_string, true)
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
                RETURN { root_offset_beg: p.root_offset_beg,
                         root_offset_end: p.root_offset_end,
                         root_segnr : p.root_segnr,
                         id: p._key }
)
"""

query_parallels_for_middle_text = """
RETURN (
    FOR parallel_id IN @parallel_ids
        FOR p IN parallels 
            FILTER p._key == parallel_id
            RETURN p
)
"""




query_graph_data = """
LET target = FLATTEN(
    FOR targetitem IN @targetcollection
        FOR collection IN menu_collections
            FILTER collection._key == targetitem
            RETURN collection.categories
        )
FOR p IN parallels
    FILTER p.root_filename == @filename
    LIMIT 15000
    FILTER p.score >= @score
    FILTER p.par_length >= @parlength
    FILTER p["co-occ"] <= @coocc
    LET filtertest = (
        FOR item IN target
            RETURN REGEX_TEST(p.par_segnr[0], CONCAT("^",item))
        )
    LET filternr = (target != []) ? POSITION(filtertest, true) : true
    FILTER filternr == true
    RETURN { "textname": SPLIT(p.par_segnr[0],":")[0], "parlength": p.par_length}
"""

query_total_numbers = """
FOR p IN parallels
    FILTER p.root_filename == @filename
    LET filtertest = (
        FOR item IN @limitcollection
            RETURN REGEX_TEST(p.par_segnr[0], item)
        )
        LET filternr = (@limitcollection != []) ? POSITION(filtertest, true) : true
        FILTER filternr == true
        FILTER p.score >= @score
        FILTER p.par_length >= @parlength
        FILTER p["co-occ"] <= @coocc
        LIMIT 10001
        COLLECT WITH COUNT INTO length
RETURN length
"""


query_categories_per_collection = """
RETURN MERGE(
    FOR collection IN menu_collections
        FILTER collection._key == @searchterm
        FOR col_category IN collection.categories
            FOR category IN menu_categories
                FILTER category.category == col_category
                FILTER category.language == @language
                LET catname = SPLIT(category.categoryname,["—","("])[0]
                RETURN { [category["category"]]: catname }
)
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
