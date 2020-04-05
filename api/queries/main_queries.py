"""
Contains all database queries related to segments and parallels found inside files.

Todo:
- When this gets too big (>300 lines), consider splitting this into
  several files inside a "queries" directory.

# Progress:
Rewrote 1/8 queries
"""

QUERY_ALL_SEGMENTS = """
FOR segment IN 1..1 OUTBOUND concat("files/", @filename) GRAPH 'files_segments'
    RETURN segment._key
"""

QUERY_SEGMENT_COUNT = """
FOR segment IN segments
    FILTER segment._key == @segmentnr
    RETURN segment.count
"""

# TODO: what is "selected"? Find better name
QUERY_COLLECTION_TOTALS = """
RETURN FLATTEN(
    FOR target in @selected
        FOR col IN categories_parallel_count
            FILTER col.sourcecollection == @sourcecollection
            FILTER col.targetcollection == target
            RETURN col.totallengthcount
        )
"""

QUERY_FILE_SEGMENTS_PARALLELS = """
FOR segment IN 1..1 OUTBOUND concat("files/", @filename) GRAPH 'files_segments'
    LET seg_parallels = (
        FOR p IN 1..1 OUTBOUND segment GRAPH 'files_segments'
            FILTER p.score >= @score
            FILTER p.par_length >= @parlength
            FILTER p["co-occ"] <= @coocc

            LET collection_filter_test = (
                FOR item IN @limitcollection_positive
                RETURN REGEX_TEST(p.par_segnr[0], item)
            )
            LET fits_collection = (@limitcollection_positive != [])
                ? POSITION(collection_filter_test, true)
                : true
            FILTER fits_collection == true
            LET collection_filter_test2 = (
                FOR item IN @limitcollection_negative
                RETURN REGEX_TEST(p.par_segnr[0], item)
            )
            LET fits_collection2 = (@limitcollection_negative != [])
                ? POSITION(collection_filter_test2, true)
                : false
            FILTER fits_collection2 == false

            RETURN p.par_segnr
    )
    RETURN { "segmentnr": segment._key, "parallels": seg_parallels[0] }
"""

# TODO: this query is slow because of sorting. Figure out how to sort more efficiently.
QUERY_TABLE_VIEW = """
FOR p IN parallels
    FILTER p.root_filename == @filename
    LIMIT 200000
    FILTER p.score >= @score
    FILTER p.par_length >= @parlength
    FILTER p["co-occ"] <= @coocc
    LET collection_filter_test = (
        FOR item IN @limitcollection_positive
        RETURN REGEX_TEST(p.par_segnr[0], item)
    )
    LET fits_collection = (@limitcollection_positive != [])
        ? POSITION(collection_filter_test, true)
        : true
    FILTER fits_collection == true
    LET collection_filter_test2 = (
        FOR item IN @limitcollection_negative
        RETURN REGEX_TEST(p.par_segnr[0], item)
    )
    LET fits_collection2 = (@limitcollection_negative != [])
        ? POSITION(collection_filter_test2, true)
        : false
    FILTER fits_collection2 == false
    SORT p.@sortkey @sortdirection
    LIMIT 50 * @page, 50
    let root_seg_text = (
        FOR segnr IN p.root_segnr
            FOR segment IN segments
                FILTER segment._key == segnr
                RETURN segment.segtext
    )
    let par_segment = (
        FOR segnr IN p.par_segnr
            FOR segment IN segments
                FILTER segment._key == segnr
                RETURN segment.segtext
    )
    RETURN {
        par_segnr: p.par_segnr,
        par_offset_beg: p.par_offset_beg,
        par_offset_end: p.par_offset_end,
        root_offset_beg: p.root_offset_beg,
        root_offset_end: p.root_offset_end-1,
        par_segment: par_segment,
        file_name: p.id,
        root_segnr: p.root_segnr,
        root_seg_text: root_seg_text,
        par_length: p.par_length,
        root_length: p.root_length,
        par_pos_beg: p.par_pos_beg,
        "co-occ": p["co-occ"],
        score: p.score
    }
"""


QUERY_TEXT_AND_PARALLELS = """
FOR file IN files
    FILTER file._key == @filename
    LET segments = (
        FOR segmentnr IN file.segment_keys
            LIMIT @startint, @limit
            FOR segment in segments
                FILTER segment._key == segmentnr
                RETURN {
                    segnr: segment.segnr,
                    segtext: segment.segtext,
                    parallel_ids: segment.parallel_ids
                }
        )

LET parallel_ids = UNIQUE(FLATTEN(
    FOR segment in segments
        RETURN segment.parallel_ids
))

let parallels =  (
    FOR parallel_id IN parallel_ids
        FOR p IN parallels
            FILTER p._key == parallel_id
            FILTER p.score >= @score
            FILTER p.par_length >= @parlength
            FILTER p["co-occ"] <= @coocc
            LET filtertest = (
                FOR item IN @limitcollection_positive
                    RETURN REGEX_TEST(p.par_segnr[0], item)
                )
                LET filternr = (@limitcollection_positive != []) ? POSITION(filtertest, true) : true
                FILTER filternr == true
                LET filtertest2 = (
                    FOR item IN @limitcollection_negative
                        RETURN REGEX_TEST(p.par_segnr[0], item)
                    )
                    LET filternr2 = (@limitcollection_negative != []) ? POSITION(filtertest2, true) : false
                    FILTER filternr2 == false
                    LIMIT 100000
                    RETURN {
                        root_offset_beg: p.root_offset_beg,
                        root_offset_end: p.root_offset_end,
                        root_segnr : p.root_segnr,
                        id: p._key
                    }
    )
RETURN {
    textleft: segments,
    parallel_ids: parallel_ids,
    parallels: parallels
}
"""

# todo
QUERY_PARALLELS_FOR_MIDDLE_TEXT = """
LET parallel_ids = (
    FOR segment in segments
        FILTER segment._key == @segmentnr
        RETURN segment.parallel_ids
    )

FOR parallel_id IN FLATTEN(parallel_ids)
    FOR p IN parallels
        FILTER p._key == parallel_id
        FILTER p.score >= @score
        FILTER p.par_length >= @parlength
        FILTER p["co-occ"] <= @coocc
        LET filtertest = (
            FOR item IN @limitcollection_positive
                RETURN REGEX_TEST(p.par_segnr[0], item)
            )
            LET filternr = (@limitcollection_positive != []) ? POSITION(filtertest, true) : true
            FILTER filternr == true
            LET filtertest2 = (
                FOR item IN @limitcollection_negative
                    RETURN REGEX_TEST(p.par_segnr[0], item)
                )
                LET filternr2 = (@limitcollection_negative != []) ? POSITION(filtertest2, true) : false
                FILTER filternr2 == false
                LET par_segtext = (
                    FOR segnr IN p.par_segnr
                        FOR segment IN segments
                            FILTER segment._key == segnr
                            RETURN segment.segtext
                   )
            RETURN {
                par_segnr: p.par_segnr,
                par_offset_beg: p.par_offset_beg,
                par_offset_end: p.par_offset_end,
                root_offset_beg: p.root_offset_beg,
                root_offset_end: p.root_offset_end-1,
                par_segtext: par_segtext,
                file_name: p.id,
                root_segnr: p.root_segnr,
                par_length: p.par_length,
                par_pos_beg: p.par_pos_beg,
                score: p.score,
                "co-occ": p["co-occ"]
            }
"""

# todo
QUERY_GRAPH_VIEW = """
LET filter_target = FLATTEN(
    FOR target_item IN @targetcollection
        FOR category IN 1..1 OUTBOUND concat("menu_collections/", target_item) GRAPH 'collections_categories'
            RETURN category.category
    )
FOR p IN parallels
    FILTER p.root_filename == @filename
    LIMIT 15000
    FILTER p.score >= @score
    FILTER p.par_length >= @parlength
    FILTER p["co-occ"] <= @coocc
    LET filtertest = (
        FOR item IN filter_target
            RETURN REGEX_TEST(p.par_segnr[0], CONCAT("^",item,"[^y]"))
        )
    LET filternr = (filter_target != []) ? POSITION(filtertest, true) : true
    FILTER filternr == true
    RETURN { "textname": SPLIT(p.par_segnr[0],":")[0], "parlength": p.par_length}
"""

# todo
QUERY_TOTAL_NUMBERS = """
FOR p IN parallels
    FILTER p.root_filename == @filename
    LET filtertest = (
        FOR item IN @limitcollection_positive
            RETURN REGEX_TEST(p.par_segnr[0], item)
        )
        LET filternr = (@limitcollection_positive != []) ? POSITION(filtertest, true) : true
        FILTER filternr == true
        LET filtertest2 = (
            FOR item IN @limitcollection_negative
                RETURN REGEX_TEST(p.par_segnr[0], item)
            )
            LET filternr2 = (@limitcollection_negative != []) ? POSITION(filtertest2, true) : false
            FILTER filternr2 == false
            FILTER p.score >= @score
            FILTER p.par_length >= @parlength
            FILTER p["co-occ"] <= @coocc
            LIMIT 15000
            COLLECT WITH COUNT INTO length
RETURN length
"""

# todo
QUERY_TEXT_SEARCH = """
FOR file IN files
    FILTER file._key == @filename
    FOR segment_key IN file.segment_keys
        FOR segment in segments
            FILTER segment._key == segment_key
            FILTER LIKE(segment.segtext, @search_string, true)
            RETURN { segnr: segment.segnr,
                     segtext: segment.segtext,
                     parallel_ids: segment.parallel_ids }
"""
