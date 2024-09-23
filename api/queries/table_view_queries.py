"""
Contains all database queries related to table view.
"""

QUERY_TABLE_VIEW = """
FOR f IN parallels_sorted_file
    FILTER f._key == @file_name
    FOR current_parallel in f.@sortkey
        FOR p in parallels
            FILTER p._key == current_parallel
            LET folios = (
                FOR segmentnr IN p.root_segnr
                    FOR segment IN segments
                        FILTER segment._key == segmentnr
                        RETURN segment.folio
            )
            FILTER LENGTH(@folio) == 0 OR @folio IN FOLIOS[*]
            FILTER p.score * 100 >= @score
            FILTER p.par_length >= @parlength
            FILTER LENGTH(@limitcollection_include) == 0 OR (p.par_category IN @limitcollection_include OR p.par_filename IN @limitcollection_include)
            FILTER LENGTH(@limitcollection_exclude) == 0 OR (p.par_category NOT IN @limitcollection_exclude AND p.par_filename NOT IN @limitcollection_exclude)
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
                score: p.score * 100,
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
            LET folios = (
                FOR segnr IN p.root_segnr
                    FOR segment IN segments
                        FILTER segment._key == segnr
                        RETURN segment.folio
            )
            FILTER LENGTH(@folio) == 0 OR @folio IN folios[*]
            FILTER p.score * 100 >= @score
            FILTER p.par_length >= @parlength
            FILTER LENGTH(@limitcollection_include) == 0 OR (p.par_category IN @limitcollection_include OR p.par_filename IN @limitcollection_include)
            FILTER LENGTH(@limitcollection_exclude) == 0 OR (p.par_category NOT IN @limitcollection_exclude AND p.par_filename NOT IN @limitcollection_exclude)
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
                score: p.score * 100,
                src_lang: p.src_lang
            }
"""

QUERY_NUMBERS_VIEW = """
FOR file IN files
    FILTER file._key == @file_name
    LET selected_folio_segmentnr = (
        FOR segmentnr in segments
            FILTER segmentnr.filename == @file_name
            FILTER segmentnr.folio == @folio
            RETURN segmentnr.segmentnr
    )

    LET current_segments = (
        LET startIndex = POSITION(file.segment_keys, selected_folio_segmentnr[0], true)
        LET subArray = SLICE(file.segment_keys, startIndex)
        FOR segmentnr IN subArray
            FOR segment in segments
                FILTER segment._key == segmentnr
                LET parallel_ids = (
                    FOR p IN parallels
                        FILTER segmentnr IN p.root_segnr
                        RETURN p._key
                        )
                FILTER LENGTH(parallel_ids) > 0
                LIMIT 100 * @page,100
                LET parallels = (
                    FOR parallel_id IN parallel_ids
                        FOR p IN parallels
                            FILTER p._key == parallel_id
                            FILTER p.score * 100 >= @score
                            FILTER p.par_length >= @parlength
                            FILTER LENGTH(@limitcollection_include) == 0 OR (p.par_category IN @limitcollection_include OR p.par_filename IN @limitcollection_include)
                            FILTER LENGTH(@limitcollection_exclude) == 0 OR (p.par_category NOT IN @limitcollection_exclude AND p.par_filename NOT IN @limitcollection_exclude)

                            LET par_full_names = (
                                FOR f in files
                                    FILTER f._key == p.par_filename
                                    RETURN {"displayName": f.displayName,
                                    "fileName": f.filename,
                                    "category": f.category}
                                )
                            RETURN {
                                par_segnr: p.par_segnr,
                                par_full_names: par_full_names[0] || {}
                            }
                )
                FILTER LENGTH(parallels) > 0
                RETURN {
                    segmentnr: segment.segmentnr,
                    parallels: parallels
                }
        )
RETURN current_segments
"""

QUERY_NUMBERS_DOWNLOAD = """
FOR file IN files
    FILTER file._key == @file_name
    LET current_segments = (
        FOR segmentnr IN file.segment_keys
            FOR segment in segments
                FILTER segment._key == segmentnr
                LET parallel_ids = (
                    FOR p IN parallels
                        FILTER segmentnr IN p.root_segnr
                        RETURN p._key
                        )
                FILTER LENGTH(parallel_ids) > 0
                LET parallels = (
                    FOR parallel_id IN parallel_ids
                        FOR p IN parallels
                            FILTER p._key == parallel_id
                            FILTER p.score * 100 >= @score
                            FILTER p.par_length >= @parlength
                            FILTER LENGTH(@limitcollection_include) == 0 OR (p.par_category IN @limitcollection_include OR p.par_filename IN @limitcollection_include)
                            FILTER LENGTH(@limitcollection_exclude) == 0 OR (p.par_category NOT IN @limitcollection_exclude AND p.par_filename NOT IN @limitcollection_exclude)
                            LET category = (
                                FOR f in files
                                    FILTER f._key == p.par_filename
                                    RETURN f.category
                                )
                            RETURN {
                                par_segnr: p.par_segnr,
                                category: category[0] || {}
                            }
                )
                FILTER LENGTH(parallels) > 0
                LIMIT 20000
                RETURN {
                    segmentnr: segment.segmentnr,
                    parallels: parallels
                }
        )
RETURN current_segments
"""
