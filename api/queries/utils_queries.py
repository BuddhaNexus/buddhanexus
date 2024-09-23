"""
Contains all database queries for various utils.

"""

QUERY_FOLIOS = """
FOR segment in segments
    FILTER segment.filename == @file_name
    COLLECT folio = segment.folio
    RETURN folio
"""

QUERY_PAGE_FOR_SEGMENT = """
FOR segment IN segments_pages
    FILTER segment.segmentnr == @segmentnr
    return segment.page
"""

QUERY_SEGMENT_FOR_FOLIO = """
RETURN FIRST(
    FOR segment IN segments
        FILTER segment.folio == @folio
        RETURN segment.segmentnr
)
"""



QUERY_COUNT_MATCHES = """
FOR p IN parallels
    FILTER p.root_filename == @file_name
            FILTER LENGTH(@limitcollection_include) == 0 OR (p.par_category IN @limitcollection_include OR p.par_filename IN @limitcollection_include)
            FILTER LENGTH(@limitcollection_exclude) == 0 OR (p.par_category NOT IN @limitcollection_exclude AND p.par_filename NOT IN @limitcollection_exclude)
    FILTER p.score * 100 >= @score
    FILTER p.par_length >= @parlength
    LIMIT 15000
    COLLECT WITH COUNT INTO length
    RETURN length
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