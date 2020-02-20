QUERY_SEARCH = """
FOR d IN search_index_view 
    SEARCH PHRASE(d.search_string_precise, @search_string, 'text_en') 
    RETURN d
"""

QUERY_SEARCH_CHINESE = """
FOR d IN search_index_chn_view 
    SEARCH PHRASE(d.search_string_precise, @search_string, 'text_zh') 
    RETURN d
"""
