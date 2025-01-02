"""
Contains all database queries related to numbers view.
"""

QUERY_NUMBERS_VIEW = """
FOR file IN files
    FILTER file._key == @filename
    LET selected_folio_segmentnr = FIRST(
        FOR segment in segments
            FILTER segment.folio == @folio
            FILTER segment.segmentnr IN file.segment_keys
            RETURN segment.segmentnr
    )

    LET startIndex = POSITION(file.segment_keys, selected_folio_segmentnr, true)
    LET relevant_segments = SLICE(file.segment_keys, startIndex, 100 * (@page + 1))


    LET parallels_data = (
        FOR segmentnr IN relevant_segments
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

                LET file_info = FIRST(
                    FOR f in files
                        FILTER f._key == p.par_filename
                        RETURN {
                            displayName: f.displayName,
                            fileName: f.filename,
                            category: f.category,
                            par_segnr: p.par_segnr
                        }
                )

                COLLECT segment_nr = POSITION(relevant_segments, segmentnr, true) INTO grouped_parallels

                RETURN {
                    segmentnr: relevant_segments[segment_nr],
                    parallels: grouped_parallels[*].file_info
                }
    )

    RETURN parallels_data
"""

QUERY_NUMBERS_DOWNLOAD = """
FOR file IN files
    FILTER file._key == @filename
    LET current_segments = (
        FOR segmentnr IN file.segment_keys
            FOR p IN parallels
                FILTER p.root_filename == @filename
                FILTER segmentnr IN p.root_segnr
                FILTER p.score * 100 >= @score
                FILTER p.par_length >= @parlength
                FILTER LENGTH(@filter_include_files) == 0 OR p.par_filename IN @filter_include_files
                FILTER LENGTH(@filter_exclude_files) == 0 OR p.par_filename NOT IN @filter_exclude_files
                FILTER LENGTH(@filter_include_categories) == 0 OR p.par_category IN @filter_include_categories
                FILTER LENGTH(@filter_exclude_categories) == 0 OR p.par_category NOT IN @filter_exclude_categories
                FILTER LENGTH(@filter_include_collections) == 0 OR p.par_collection IN @filter_include_collections
                FILTER LENGTH(@filter_exclude_collections) == 0 OR p.par_collection NOT IN @filter_exclude_collections

                LET file_info = FIRST(
                    FOR f in files
                        FILTER f._key == p.par_filename
                        RETURN {
                            displayName: f.displayName,
                            fileName: f.filename,
                            category: f.category,
                            par_segnr: p.par_segnr[0]
                        }
                )

                COLLECT segment_nr = POSITION(relevant_segments, segmentnr, true) INTO grouped_parallels

                RETURN {
                    segmentnr: relevant_segments[segment_nr],
                    parallels: grouped_parallels[*].file_info
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
