QUERY_SEARCH = """
FOR d IN search_index_view 
    SEARCH PHRASE(d.search_string_precise, @search_string, 'text_en') 
    RETURN d
"""
