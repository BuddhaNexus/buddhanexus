query_file_segments_parallels = """
    FOR file in files
        FILTER file._key == @filename
        LET result = (
            FOR segmentnr IN file.segmentnrs
                LET seg_parallels = (
                    FOR segment IN segments
                    FILTER segment._key == segmentnr
                    FOR segment_id IN segment.parallel_ids
                        FOR p IN parallels
                           LET filtertest = (
                                FOR item IN @limitcollection
                                    RETURN REGEX_TEST(p.par_segnr[0], item)
                                )
                            LET filternr = (@limitcollection != []) ? POSITION(filtertest, true) : true
                            FILTER filternr == true
                            FILTER p._key == segment_id
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
RETURN MERGE(
    FOR category IN menu_categories
        FOR collection_key in @collections
            FILTER category["category"] == collection_key
            RETURN { [category["category"]]: category.categoryname }
)
"""

query_items_for_menu = """
FOR category in menu_categories
    FILTER category.language == @language
    FOR catfile in category.files
        FOR file in files
            FILTER file._key == catfile
            RETURN {filenr: file.filenr,
                    displayName: file.displayName,
                    textname: file.textname,
                    filename: file.filename,
                    category: file.category}
"""

query_items_for_category_menu = """
FOR category in menu_categories
    FILTER category.language == @language
    RETURN {categorynr: category.categorynr,
            category: category.category}
"""