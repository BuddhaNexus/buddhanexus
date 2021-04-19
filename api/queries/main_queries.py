"""
Contains all database queries related to segments and parallels found inside files.

Todo:
- When this gets too big (>300 lines), consider splitting this into
  several files inside a "queries" directory.

# Progress:
Rewrote 1/8 queries
"""

QUERY_FOLIOS = """
FOR file IN files
    FILTER file._key == @filename
    RETURN file.folios
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

QUERY_TABLE_VIEW = """
FOR f IN parallels_sorted_file
    FILTER f._key == @filename
    FOR current_parallel in f.@sortkey 
        FOR p in parallels
            FILTER p._key == current_parallel
            LET folio_regex_test = (
                FOR current_segnr IN p.root_segnr
                RETURN REGEX_TEST(current_segnr, @start_folio)
            )
            FILTER POSITION(folio_regex_test, true)
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
            LET root_seg_text = (
                FOR segnr IN p.root_segnr
                    FOR segment IN segments
                        FILTER segment._key == segnr
                        RETURN segment.segtext
            )
            LET par_segment = (
                FOR segnr IN p.par_segnr
                    FOR segment IN segments
                        FILTER segment._key == segnr
                        RETURN segment.segtext
            )
            LIMIT 100 * @page,100
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

QUERY_MULTILINGUAL = """
LET parallel_ids = (
    FOR file IN files
        FILTER file._key == @filename
        FOR segmentnr IN file.segment_keys
            FOR segment in segments
                FILTER segment._key == segmentnr
                RETURN segment.parallel_ids_multi
        )

FOR parallel_id IN UNIQUE(FLATTEN(parallel_ids))
    FOR p IN parallels_multi
        FILTER p._key == parallel_id
        LET folio_regex_test = (
            FOR current_segnr IN p.root_segnr
            RETURN REGEX_TEST(current_segnr, @start_folio)
        )
        FILTER LIKE(p.root_string, @search_string, true) || LIKE(p.par_string, @search_string, true)
        FILTER POSITION(folio_regex_test, true)
        FILTER POSITION(@multi_lingual, p.tgt_lang)
        FILTER p.score >= @score
        LIMIT 100 * @page,100
        RETURN {
            par_segnr: [p.par_segnr[0]],
            par_offset_beg: 0,
            par_offset_end: 0,
            root_offset_beg: 0,
            root_offset_end: 0,
            par_segment: [p.par_string],
            file_name: p.id,
            root_segnr: [p.root_segnr[0]],
            root_seg_text: [p.root_string],
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
                    parallel_ids: APPEND(segment.@parallel_ids_type, segment.parallel_ids_multi)
                }
        )

LET parallel_ids = UNIQUE(FLATTEN(
    FOR segment in segments
        RETURN segment.parallel_ids
))

LET parallels =  (
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
            FILTER POSITION(@multi_lingual, p.tgt_lang)
            LIMIT 100000
            RETURN {
                root_offset_beg: p.root_offset_beg,
                root_offset_end: p.root_offset_end,
                root_segnr : p.root_segnr,
                id: p._key
            }
    )

LET parallels_multi =  (
    FOR parallel_id IN parallel_ids
        FOR p IN parallels_multi
            FILTER p._key == parallel_id
            FILTER POSITION(@multi_lingual, p.tgt_lang)
            FILTER p.score >= @score
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
    parallels: APPEND(parallels, parallels_multi)
}
"""

QUERY_PARALLELS_FOR_MIDDLE_TEXT = """
LET parallel_ids = (
    FOR segment in segments
        FILTER segment._key == @segmentnr
        RETURN APPEND(segment.parallel_ids, segment.parallel_ids_multi)
    )

LET parallels = (
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
            FILTER POSITION(@multi_lingual, p.tgt_lang)

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
                "co-occ": p["co-occ"],
                lang: p.tgt_lang,
                length: p.par_length
            }
)

LET parallels_multi = (
    FOR parallel_id IN FLATTEN(parallel_ids)
        FOR p IN parallels_multi
            FILTER p._key == parallel_id
            FILTER p.score >= @score
            FILTER POSITION(@multi_lingual,p.tgt_lang)
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
)

LET return_parallels = (
    for p in parallels
        SORT p.score DESC, p.length DESC

        return p
    )

RETURN APPEND(parallels_multi,return_parallels)
"""

QUERY_GRAPH_VIEW = """
LET filter_target = FLATTEN(
    FOR target_item IN @targetcollection
        FOR category IN 1..1 OUTBOUND concat("menu_collections/", target_item) GRAPH 'collections_categories'
            RETURN category.category
    )

FOR f in parallels_sorted_file
    filter f._key == @filename
    LET current_parallels = (
    for current_parallel in slice(f.parallels_randomized,0,2500)
        for p in parallels
            filter p._key == current_parallel
            return p 
    )

FOR p IN current_parallels
    FILTER p.score >= @score
    FILTER p.par_length >= @parlength
    FILTER p["co-occ"] <= @coocc
    LET filtertest = (
        FOR item IN filter_target
            RETURN REGEX_TEST(p.par_segnr[0], CONCAT("^",item,"[^y]"))
    )
    FILTER  true IN filtertest || filtertest == []
    RETURN {
        "textname": SPLIT(p.par_segnr[0],":")[0],
        "parlength": p.par_length,
        "filtertest":filtertest
    }"""

QUERY_TOTAL_NUMBERS = """
FOR p IN parallels
    FILTER p.root_filename == @filename
    LET filtertest = (
        FOR item IN @limitcollection_positive
            RETURN REGEX_TEST(p.par_segnr[0], item)
    )
    FILTER (@limitcollection_positive != []) ? POSITION(filtertest, true) : true
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

QUERY_DISPLAYNAME = """
FOR file IN files
    FILTER file._key == @filename
    RETURN [file.displayName, file.textname, file.gretil_link]
"""

QUERY_LINK = """
FOR file IN files
    FILTER file._key == @filename
    RETURN file.link
"""

QUERY_SOURCE = """
FOR file IN files
    FILTER file._key == @filename
    RETURN {
        source_id: file.source,
        source_string: file.source_string
   }
"""


QUERY_MULTILINGUAL_LANGS = """
FOR file IN files
    FILTER file._key == @filename
    RETURN UNIQUE(FLATTEN([file.language, file.available_lang]))
"""
