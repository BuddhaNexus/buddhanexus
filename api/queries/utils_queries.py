"""
Contains all database queries for various utils.

"""

QUERY_FOLIOS = """
FOR file in files
    FILTER file._key == @filename
    RETURN file.folios
"""

QUERY_PAGE_FOR_SEGMENT = """
FOR segment IN segments_pages
    FILTER segment.segmentnr == @segmentnr
    return segment.page
"""

QUERY_SEGMENT_FOR_FOLIO = """
FOR segment IN segments
    FILTER segment.filename == @filename
    FILTER segment.folio == @folio
    LIMIT 1
    return segment.segmentnr
"""


QUERY_COUNT_MATCHES = """
FOR p IN parallels
    FILTER p.root_filename == @filename

    FILTER LENGTH(@filter_include_files) == 0 OR p.par_filename IN @filter_include_files
    FILTER LENGTH(@filter_exclude_files) == 0 OR p.par_filename NOT IN @filter_exclude_files

    FILTER LENGTH(@filter_include_categories) == 0 OR p.par_category IN @filter_include_categories
    FILTER LENGTH(@filter_exclude_categories) == 0 OR p.par_category NOT IN @filter_exclude_categories

    FILTER LENGTH(@filter_include_collections) == 0 OR p.par_collection IN @filter_include_collections
    FILTER LENGTH(@filter_exclude_collections) == 0 OR p.par_collection NOT IN @filter_exclude_collections

    FILTER p.score * 100 >= @score
    FILTER p.par_length >= @parlength
    LIMIT 15000
    COLLECT WITH COUNT INTO length
    RETURN length
"""

QUERY_DISPLAYNAME = """
FOR file IN files
    FILTER file.filename == @filename
    RETURN [file.displayName, file.textname]
"""

QUERY_LINK = """
FOR file IN files
    FILTER file._key == @filename
    RETURN [file.link, file.link2]
"""
