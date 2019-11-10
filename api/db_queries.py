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
// get all segment IDs in file 
// @todo: replace by `file_segments` collection
LET file_segmentnrs = (
    FOR file IN files
        FILTER file._key == @filename
        RETURN file.segmentnrs
)[0]

LET file_segments = (
    FOR segmentnr IN file_segmentnrs
        FOR segment IN segments
            FILTER segment._key == segmentnr
            RETURN segment
)

LET file_parallels = (
    FOR segment IN file_segments
        FOR segment_parallel_id IN segment.parallel_ids
            FOR p IN parallels
                FILTER p._key == segment_parallel_id
                LET collection_filter_test = (
                    FOR item IN @limitcollection
                    RETURN REGEX_TEST(p.par_segnr[0], item)
                )
                LET fits_collection = (@limitcollection != []) 
                    ? POSITION(collection_filter_test, true) 
                    : true
                FILTER fits_collection == true
                FILTER p.score >= @score
                FILTER p.par_length >= @parlength
                FILTER p["co-occ"] <= @coocc
                LIMIT 50 * @page, 50
                RETURN {
                    par_segnr: p.par_segnr, 
                    par_offset_beg: p.par_offset_beg, 
                    par_offset_end: p.par_offset_end, 
                    par_segment: p.par_segtext, 
                    file_name: p.id, 
                    root_lang: segment.lang,
                    root_segnr: p.root_segnr, 
                    root_seg_text: p.root_segtext,
                    par_length: p.par_length, 
                    par_pos_beg: p.par_pos_beg,
                    score: p.score
                }
)

RETURN {
    parallels: file_parallels,
    parallel_count: COUNT(file_parallels)
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
LET parids = SORTED_UNIQUE(FLATTEN(
    FOR file IN files
        FILTER file._key == @filename
        FOR segmentnr IN file.segmentnrs
            FOR segment IN segments
            FILTER segment._key == segmentnr
            RETURN segment.parallel_ids
))

FOR segment_id IN parids
    FOR p IN parallels
        FILTER p._key == segment_id
        FILTER p.score >= @score
        FILTER p.par_length >= @parlength
        FILTER p["co-occ"] <= @coocc
        RETURN { "textname": SPLIT(p.par_segnr[0],":")[0], "parlength": p.par_length }
"""
