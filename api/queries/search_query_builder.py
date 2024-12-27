from api.utils import get_existing_views


# we could import this from dataloader_constants, but oh gosh this leads to circular imports and is no fun to debug for now.
VIEW_SEARCH_INDEX_BO = "search_index_bo_view"   
VIEW_SEARCH_INDEX_BO_FUZZY = "search_index_bo_fuzzy_view"   
VIEW_SEARCH_INDEX_SA = "search_index_sa_view"
VIEW_SEARCH_INDEX_PA = "search_index_pa_view"
VIEW_SEARCH_INDEX_ZH = "search_index_zh_view"

class SearchQueryBuilder:
    def __init__(self, db):
        self.db = db
        self.view_status = get_existing_views(db, [
            VIEW_SEARCH_INDEX_BO,
            VIEW_SEARCH_INDEX_SA, 
            VIEW_SEARCH_INDEX_PA,
            VIEW_SEARCH_INDEX_ZH
        ])
        # lets hardcode the view names for now
        self.view_status = {
            VIEW_SEARCH_INDEX_BO: True,
            VIEW_SEARCH_INDEX_BO_FUZZY: True,
            VIEW_SEARCH_INDEX_SA: False,
            VIEW_SEARCH_INDEX_PA: False,
            VIEW_SEARCH_INDEX_ZH: False
        }
        
    def build_language_query(self, view_name, analyzer, field="analyzed"):
        # Extract language code from view name (e.g., 'bo' from 'search_index_bo_view')
        lang_code = view_name.split('_')[2]
        query = f"""
        FOR d IN {view_name}
            SEARCH PHRASE(d.{field}, @search_string_{lang_code}, '{analyzer}')
            LIMIT 1000
            FILTER LENGTH(@include_files) == 0 OR d.filename IN @include_files
            FILTER LENGTH(@exclude_files) == 0 OR d.filename NOT IN @exclude_files
            FILTER LENGTH(@include_categories) == 0 OR d.category IN @include_categories 
            FILTER LENGTH(@exclude_categories) == 0 OR d.category NOT IN @exclude_categories
            FILTER LENGTH(@include_collections) == 0 OR d.collection IN @include_collections
            FILTER LENGTH(@exclude_collections) == 0 OR d.collection NOT IN @exclude_collections
            RETURN d
        """
        print(f"Generated query for {view_name} with parameter @search_string_{lang_code}")
        return query

    def build_search_query(self, search_strings):
        query_parts = []
        
        # Declare all bind parameters at the start
        query = """
        LET include_files = @include_files
        LET exclude_files = @exclude_files
        LET include_categories = @include_categories
        LET exclude_categories = @exclude_categories
        LET include_collections = @include_collections
        LET exclude_collections = @exclude_collections
        LET search_string_sa = @search_string_sa
        LET search_string_bo = @search_string_bo
        LET search_string_pa = @search_string_pa
        LET search_string_zh = @search_string_zh
        """
        
        if self.view_status[VIEW_SEARCH_INDEX_ZH] and search_strings.get("zh"):
            query_parts.append(("chinese_results", 
                              self.build_language_query(VIEW_SEARCH_INDEX_ZH, "text_zh", "original")))
            
        if self.view_status[VIEW_SEARCH_INDEX_BO] and search_strings.get("bo"):
            query_parts.append(("tibetan_results",
                              self.build_language_query(VIEW_SEARCH_INDEX_BO, "tibetan_fuzzy_analyzer")))
        
        if self.view_status[VIEW_SEARCH_INDEX_BO_FUZZY] and search_strings.get("bo"):
            query_parts.append(("tibetan_fuzzy_results",
                              self.build_language_query(VIEW_SEARCH_INDEX_BO_FUZZY, "tibetan_fuzzy_analyzer")))
            
        if self.view_status[VIEW_SEARCH_INDEX_SA] and search_strings.get("sa"):
            query_parts.append(("sanskrit_results",
                              self.build_language_query(VIEW_SEARCH_INDEX_SA, "sanskrit_analyzer")))
            # Add fuzzy Sanskrit search
            if search_strings.get("sa_fuzzy"):
                query_parts.append(("sanskrit_results_fuzzy",
                                  self.build_language_query(VIEW_SEARCH_INDEX_SA, "sanskrit_analyzer")))
            
        if self.view_status[VIEW_SEARCH_INDEX_PA] and search_strings.get("pa"):
            query_parts.append(("pali_results",
                              self.build_language_query(VIEW_SEARCH_INDEX_PA, "pali_analyzer")))

        # Add all subqueries
        query += "\n".join([f"LET {name} = ({subquery})" for name, subquery in query_parts])
        
        # Add results combination and full names lookup
        result_names = [name for name, _ in query_parts]
        query += f"""
        LET results = FLATTEN([{', '.join(result_names)}])
        
        LET results_with_names = (
            FOR r IN results
                LET full_names = (
                    FOR file in files
                        FILTER file._key == r.filename
                        RETURN {{
                            "display_name": file.displayName,
                            "text_name": file.textname,
                            "link1": file.link,
                            "link2": file.link2
                        }}
                )
                RETURN {{
                    original: r.original,
                    stemmed: r.stemmed,
                    category: r.category,
                    language: r.language,
                    segment_nr: r.segment_nr,
                    full_names: full_names[0]
                }}
        )
        
        RETURN results_with_names
        """
        
        return query 