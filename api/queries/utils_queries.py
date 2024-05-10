"""
Contains all database queries for various utils.

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
        FOR col IN global_stats
            FILTER col.sourcecollection == @sourcecollection
            FILTER col.targetcollection == target
            RETURN col.totallengthcount
        )
"""

QUERY_COUNT_MATCHES = """
FOR p IN parallels
    FILTER p.root_filename == @file_name
            FILTER LENGTH(@limitcollection_include) == 0 OR (p.par_category IN @limitcollection_include OR p.par_filename IN @limitcollection_include)
            FILTER LENGTH(@limitcollection_exclude) == 0 OR (p.par_category NOT IN @limitcollection_exclude AND p.par_filename NOT IN @limitcollection_exclude)
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
