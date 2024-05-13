"""
Contains all database queries for text-view and middle text view.
"""


QUERY_FILE_TEXT = """
FOR file IN files
    FILTER file._key == @file_name
    LET segments = (
        FOR segmentnr IN file.segment_keys
            FOR segment in segments
                FILTER segment._key == segmentnr
                RETURN {
                    segnr: segment.segnr,
                    segtext: segment.segtext
                }
        )

RETURN {
    filetext: segments
}
"""

QUERY_GET_NUMBER_OF_PAGES = """
FOR file IN files
    FILTER file._key == @file_name
    RETURN LENGTH(file.segment_pages)
"""


QUERY_TEXT_AND_PARALLELS = """
FOR file IN files
    FILTER file._key == @file_name
    LET page_segments = (        
        LENGTH(file.segment_pages[@page_number] ? file.segment_pages[@page_number] : []) > 0 ?
        (
            FOR segmentnr IN file.segment_pages[@page_number]
                FOR segment IN segments
                    FILTER segment._key == segmentnr
                    LET parallel_ids = (
                        FOR p IN parallels
                            FILTER segmentnr IN p.root_segnr
                            RETURN p._key
                    )
                    RETURN {
                        segnr: segment.segnr,
                        segtext: segment.segtext,
                        parallel_ids: parallel_ids
                    }
        ) : []
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
            FILTER LENGTH(@limitcollection_include) == 0 OR (p.par_category IN @limitcollection_include OR p.par_filename IN @limitcollection_include)
            FILTER LENGTH(@limitcollection_exclude) == 0 OR (p.par_category NOT IN @limitcollection_exclude AND p.par_filename NOT IN @limitcollection_exclude)
            FILTER POSITION(@multi_lingual, p.tgt_lang)
            LIMIT 100000
            RETURN {
                root_offset_beg: p.root_offset_beg,
                root_offset_end: p.root_offset_end,
                root_segnr : p.root_segnr,
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
            FILTER p._key == parallel_id

            LET par_segtext = (
                FOR segnr IN p.par_segnr
                    FOR segment IN segments
                        FILTER segment._key == segnr
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
                file_name: p.id,
                score: p.score,
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
                        FILTER segment._key == segnr
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
                file_name: p.id,
                score: p.score,
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
