"""
Contains all database queries related to segments and parallels found inside files.

Todo:
- When this gets too big (>300 lines), consider splitting this into
  several files inside a "queries" directory.

# Progress: Rewrote 1/8 queries
"""

QUERY_FOLIOS = """
FOR file IN files
    FILTER file._key == @file_name
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
    FILTER f._key == @file_name
    FOR current_parallel in f.@sortkey
        FOR p in parallels
            FILTER p._key == current_parallel
            FILTER LENGTH(@folio) == 0 OR @folio IN p.folios[*]
            FILTER p.score * 100 >= @score
            FILTER p.par_length >= @parlength
            FILTER LENGTH(@limitcollection_include) == 0 OR (p.par_category IN @limitcollection_include OR p.par_file_name IN @limitcollection_include)
            FILTER LENGTH(@limitcollection_exclude) == 0 OR (p.par_category NOT IN @limitcollection_exclude AND p.par_file_name NOT IN @limitcollection_exclude)
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
            LET par_full_names = (
                FOR file in files
                    FILTER file._key == p.par_filename
                    RETURN {"display_name": file.displayName,
                    "text_name": file.textname,
                    "link1": file.link,
                    "link2": file.link2}
                )
            LET root_full_names = (
                FOR file in files
                    FILTER file._key == p.root_filename
                    RETURN {"display_name": file.displayName,
                    "text_name": file.textname,
                    "link1": file.link,
                    "link2": file.link2}
                )
            LIMIT 100 * @page,100
            RETURN {
                par_segnr: p.par_segnr,
                par_offset_beg: p.par_offset_beg,
                par_offset_end: p.par_offset_end,
                root_offset_beg: p.root_offset_beg,
                root_offset_end: p.root_offset_end,
                par_segment: par_segment,
                par_full_names: par_full_names[0] || {},
                root_full_names: root_full_names[0],
                file_name: p.id,
                root_segnr: p.root_segnr,
                root_seg_text: root_seg_text,
                par_length: p.par_length,
                root_length: p.root_length,
                par_pos_beg: p.par_pos_beg,
                score: p.score,
                src_lang: p.src_lang,
                tgt_lang: p.tgt_lang
            }
"""

QUERY_TABLE_DOWNLOAD = """
FOR f IN parallels_sorted_file
    FILTER f._key == @file_name
    FOR current_parallel in f.@sortkey
        FOR p in parallels
            FILTER p._key == current_parallel
            FILTER LENGTH(@folio) == 0 OR @folio IN p.folios[*]
            FILTER p.score >= @score
            FILTER p.par_length >= @parlength
            FILTER LENGTH(@limitcollection_include) == 0 OR (p.par_category IN @limitcollection_include OR p.par_file_name IN @limitcollection_include)
            FILTER LENGTH(@limitcollection_exclude) == 0 OR (p.par_category NOT IN @limitcollection_exclude AND p.par_file_name NOT IN @limitcollection_exclude)


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
            LET file_name1 = REGEX_REPLACE(p.par_segnr[0],":.*","")
            LET file_name = REGEX_REPLACE(file_name1,"_[0-9]+","")
            let displayname = (
                FOR file IN files
                    FILTER file._key == file_name
                    return file.displayName
            )
            LIMIT 20000
            RETURN {
                par_segnr: p.par_segnr,
                par_segment: par_segment,
                par_displayname: displayname,
                root_segnr: p.root_segnr,
                root_seg_text: root_seg_text,
                root_offset_beg: p.root_offset_beg,
                root_offset_end: p.root_offset_end,
                par_offset_beg: p.par_offset_beg,
                par_offset_end: p.par_offset_end,
                par_length: p.par_length,
                root_length: p.root_length,
                score: p.score,
                src_lang: p.src_lang
            }
"""

QUERY_NUMBERS_VIEW = """
FOR f IN parallels_sorted_file
    FILTER f._key == @file_name
    FOR current_parallel in f.@sortkey
        FOR p in parallels
            FILTER p._key == current_parallel
            FILTER LENGTH(@folio) == 0 OR @folio IN p.folios[*]
            FILTER p.score * 100 >= @score
            FILTER p.par_length >= @parlength
            FILTER LENGTH(@limitcollection_include) == 0 OR (p.par_category IN @limitcollection_include OR p.par_file_name IN @limitcollection_include)
            FILTER LENGTH(@limitcollection_exclude) == 0 OR (p.par_category NOT IN @limitcollection_exclude AND p.par_file_name NOT IN @limitcollection_exclude)
            LET par_full_names = (
                FOR file in files
                    FILTER file._key == p.par_filename
                    RETURN {"displayName": file.displayName,
                    "fileName": file.filename,
                    "category": file.category}
                )
            LIMIT 500 * @page,500
            RETURN {
                root_segnr: p.root_segnr,
                par_segnr: p.par_segnr,
                par_full_names: par_full_names[0] || {}
            }
"""


QUERY_MULTILINGUAL = """
LET parallel_ids = (
    FOR file IN files
        FILTER file._key == @file_name
        FOR segmentnr IN file.segment_keys
            FOR segment in segments
                FILTER segment._key == segmentnr
                RETURN segment.parallel_ids_multi
        )

FOR parallel_id IN UNIQUE(FLATTEN(parallel_ids))
    FOR p IN parallels_multi
        FILTER p._key == parallel_id
        FILTER LENGTH(@folio) == 0 OR @folio IN p.folios[*]
        FILTER LIKE(p.root_string, @search_string, true) || LIKE(p.par_string, @search_string, true)
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
            score: p.score
        }
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

QUERY_TEXT_AND_PARALLELS = """
FOR file IN files
    FILTER file._key == @file_name
    LET current_segments = (
        FOR segmentnr IN file.segment_keys
            LIMIT @startint, @limit
            FOR segment in segments
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
        )

LET parallel_ids = UNIQUE(FLATTEN(
    FOR segment in current_segments
        RETURN segment.parallel_ids
))

LET parallels =  (
    FOR parallel_id IN parallel_ids
        FOR p IN parallels
            FILTER p._key == parallel_id
            FILTER p.score >= @score
            FILTER p.par_length >= @parlength
            FILTER LENGTH(@limitcollection_include) == 0 OR (p.par_category IN @limitcollection_include OR p.par_file_name IN @limitcollection_include)
            FILTER LENGTH(@limitcollection_exclude) == 0 OR (p.par_category NOT IN @limitcollection_exclude AND p.par_file_name NOT IN @limitcollection_exclude)

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
    textleft: current_segments,
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

            RETURN {
                par_segnr: p.par_segnr,
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
            RETURN {
                par_segnr: p.par_segnr,
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

QUERY_GRAPH_VIEW = """
LET filter_target = FLATTEN(
    FOR target_item IN @targetcollection
        FOR category IN 1..1 OUTBOUND concat("menu_collections/", target_item) GRAPH 'collections_categories'
            RETURN category.category
    )

FOR f in parallels_sorted_file
    filter f._key == @file_name
    LET current_parallels = (
    for current_parallel in slice(f.parallels_randomized,0,2500)
        for p in parallels
            filter p._key == current_parallel
            return p
    )

FOR p IN current_parallels
    FILTER p.score >= @score
    FILTER p.par_length >= @parlength
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

QUERY_COUNT_MATCHES = """
FOR p IN parallels
    FILTER p.root_filename == @file_name
            FILTER LENGTH(@limitcollection_include) == 0 OR (p.par_category IN @limitcollection_include OR p.par_file_name IN @limitcollection_include)
            FILTER LENGTH(@limitcollection_exclude) == 0 OR (p.par_category NOT IN @limitcollection_exclude AND p.par_file_name NOT IN @limitcollection_exclude)
    FILTER p.score >= @score
    FILTER p.par_length >= @parlength
    LIMIT 15000
    COLLECT WITH COUNT INTO length
    RETURN length
"""

QUERY_TEXT_SEARCH = """
FOR file IN files
    FILTER file._key == @file_name
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
    FILTER file.filename == @filename
    RETURN [file.displayName, file.textname, file.link, file.link2]
"""

QUERY_LINK = """
FOR file IN files
    FILTER file._key == @file_name
    RETURN [file.link, file.link2]
"""

QUERY_SOURCE = """
FOR file IN files
    FILTER file._key == @file_name
    RETURN {
        source_id: file.source,
        source_string: file.source_string
   }
"""

QUERY_MULTILINGUAL_LANGS = """
FOR file IN files
    FILTER file._key == @file_name
    RETURN UNIQUE(FLATTEN([file.language, file.available_lang]))
"""
