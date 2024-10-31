"""
Contains all database queries related to numbers view.
"""

QUERY_NUMBERS_VIEW = """
FOR file IN files
    FILTER file._key == @filename
    LET selected_folio_segmentnr = (
        FOR segmentnr in file.segment_keys
            FOR segment in segments
                FILTER segment.segmentnr == segmentnr
                FILTER segment.folio == @folio
            RETURN segment.segmentnr
    )

    LET current_segments = (
        LET startIndex = POSITION(file.segment_keys, selected_folio_segmentnr[0], true)
        LET subArray = SLICE(file.segment_keys, startIndex)
        FOR segmentnr IN subArray
            FOR segment in segments
                FILTER segment.segmentnr == segmentnr
                LET parallel_ids = (
                    FOR p IN parallels
                        FILTER p.root_filename == @filename
                        FILTER segment.segmentnr IN p.root_segnr
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

                            FILTER LENGTH(@filter_include_files) == 0 OR p.par_filename IN @filter_include_files
                            FILTER LENGTH(@filter_exclude_files) == 0 OR p.par_filename NOT IN @filter_exclude_files

                            FILTER LENGTH(@filter_include_categories) == 0 OR p.par_category IN @filter_include_categories
                            FILTER LENGTH(@filter_exclude_categories) == 0 OR p.par_category NOT IN @filter_exclude_categories

                            FILTER LENGTH(@filter_include_collections) == 0 OR p.par_collection IN @filter_include_collections
                            FILTER LENGTH(@filter_exclude_collections) == 0 OR p.par_collection NOT IN @filter_exclude_collections

                            LET par_full_names = (
                                FOR f in files
                                    FILTER f._key == p.par_filename
                                    RETURN {"displayName": f.displayName,
                                    "fileName": f.filename,
                                    "category": f.category}
                                )
                            RETURN {
                                par_segnr: p.par_segnr,
                                par_full_names: par_full_names
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
    FILTER file._key == @filename
    LET current_segments = (
        FOR segmentnr IN file.segment_keys
            FOR segment in segments
                FILTER segment.segmentnr == segmentnr
                LET parallel_ids = (
                    FOR p IN parallels
                        FILTER p.root_filename == @filename
                        FILTER segment.segmentnr IN p.root_segnr
                        RETURN p._key
                        )
                FILTER LENGTH(parallel_ids) > 0
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

QUERY_CATEGORIES_PER_LANGUAGE = """
FOR cat IN category_names
    FILTER cat.lang == @language
    RETURN {
        id: cat.category,
        displayName: cat.displayName
    }
"""
