"""
Contains all database queries for text-view and middle text view.
"""

QUERY_GET_NUMBER_OF_PAGES = """
FOR file IN files
    FILTER file.filename == @filename
    RETURN LENGTH(file.segment_pages)
"""


QUERY_TEXT_AND_PARALLELS = """
FOR file IN files
    FILTER file.filename == @filename
    LET page_segments = (
        FOR segmentnr IN (file.segment_pages[@page] ? file.segment_pages[@page] : [])
            FOR segment IN segments
                FILTER segment.segmentnr == segmentnr
                LET parallel_ids = (
                    FOR p IN parallels
                        FILTER segmentnr IN p.root_segnr
                        FILTER p.score * 100 >= @score
                        FILTER p.par_length >= @parlength
                        FILTER LENGTH(@filter_include_files) == 0 OR p.par_filename IN @filter_include_files
                        FILTER LENGTH(@filter_exclude_files) == 0 OR p.par_filename NOT IN @filter_exclude_files
                        FILTER LENGTH(@filter_include_categories) == 0 OR p.par_category IN @filter_include_categories
                        FILTER LENGTH(@filter_exclude_categories) == 0 OR p.par_category NOT IN @filter_exclude_categories
                        FILTER LENGTH(@filter_include_collections) == 0 OR p.par_collection IN @filter_include_collections
                        FILTER LENGTH(@filter_exclude_collections) == 0 OR p.par_collection NOT IN @filter_exclude_collections
                        FILTER "all" IN @multi_lingual OR POSITION(@multi_lingual, p.tgt_lang)
                        RETURN p._key
                )
                RETURN {
                    segnr: segment.segmentnr,
                    segtext: segment.original,
                    parallel_ids: parallel_ids
                }
    )

    LET parallel_ids = UNIQUE(FLATTEN(
        FOR segment IN page_segments
            RETURN segment.parallel_ids
    ))

    LET parallels = (
        FOR parallel_id IN parallel_ids
            FOR p IN parallels
                FILTER p._key == parallel_id
                FILTER p.score * 100 >= @score
                FILTER p.par_length >= @parlength
                FILTER LENGTH(@filter_include_files) == 0 OR p.par_filename IN @filter_include_files
                FILTER LENGTH(@filter_exclude_files) == 0 OR p.par_filename NOT IN @filter_exclude_files
                FILTER LENGTH(@filter_include_categories) == 0 OR p.par_category IN @filter_include_categories
                FILTER LENGTH(@filter_exclude_categories) == 0 OR p.par_category NOT IN @filter_exclude_categories
                FILTER LENGTH(@filter_include_collections) == 0 OR p.par_collection IN @filter_include_collections
                FILTER LENGTH(@filter_exclude_collections) == 0 OR p.par_collection NOT IN @filter_exclude_collections
                FILTER "all" IN @multi_lingual OR POSITION(@multi_lingual, p.tgt_lang)
                LIMIT 100000
                RETURN {
                    root_offset_beg: p.root_offset_beg,
                    root_offset_end: p.root_offset_end,
                    root_segnr: p.root_segnr,
                    id: p._key
                }
    )

    RETURN {
        textleft: page_segments,
        parallel_ids: parallel_ids,
        parallels: parallels
    }
"""

QUERY_PARALLELS_FOR_MIDDLE_TEXT = """
LET parallels = (
    FOR parallel_id IN @parallel_ids
        FOR p IN parallels
            FILTER p.filename == parallel_id

            LET par_segtext = (
                FOR segnr IN p.par_segnr
                    FOR segment IN segments
                        FILTER segment.segmentnr == segnr
                        RETURN segment.original
               )

            LET par_full_name = (
                FOR file in files
                    FILTER file._key == p.par_filename
                    RETURN file.displayName
                )

            RETURN {
                par_segnr: p.par_segnr,
                display_name: par_full_name[0],
                tgt_lang: p.tgt_lang,
                par_offset_beg: p.par_offset_beg,
                par_offset_end: p.par_offset_end,
                par_segtext: par_segtext,
                filename: p.id,
                score: p.score * 100,
                length: p.par_length
            }
)

LET parallels_multi = (
    FOR parallel_id IN @parallel_ids
        FOR p IN parallels_multi
            FILTER p._key == parallel_id
            LET par_segtext = (
                FOR segnr IN p.par_segnr
                    FOR segment IN segments
                        FILTER segment.segmentnr == segnr
                        RETURN segment.segtext
            )

            LET par_full_name = (
                FOR file in files
                    FILTER file._key == p.par_filename
                    RETURN file.displayName
                )

            RETURN {
                par_segnr: p.par_segnr,
                display_name: par_full_name[0],
                tgt_lang: p.tgt_lang,
                par_offset_beg: p.par_offset_beg,
                par_offset_end: p.par_offset_end,
                par_segtext: par_segtext,
                filename: p.id,
                score: p.score * 100,
                length: p.par_length
            }
)

LET return_parallels = (
    for p in parallels
        SORT p.score DESC, p.length DESC
        return p
    )

RETURN APPEND(parallels_multi,return_parallels)
"""
