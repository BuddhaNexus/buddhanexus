query_file_segments_parallels = """
    FOR file in files
        FILTER file._key == @filename
        LET result = (
            FOR segmentnr IN file.segmentnrs
                LET seg_parallels = (
                    FOR segment IN segments
                    FILTER segment._key == segmentnr
                    FOR segment_id IN segment.parallel_ids
                        FOR p IN parallels
                            FILTER p._key == segment_id
                            RETURN { 
                                "parsegnr": p.par_segnr, 
                                "probability": p.score,
                                "parlength": p.par_length,
                                "co-occ": p["co-occ"]
                            }
                )
                RETURN seg_parallels[0] ? 
                    { "segmentnr": segmentnr, "parallels": seg_parallels } :
                    { "segmentnr": segmentnr }
        )
        RETURN result
"""

query_collection_names = """
RETURN MERGE(
    FOR category IN menu_categories
        FOR collection_key in @collections
            FILTER category["category"] == collection_key
            RETURN { [category["category"]]: category.categoryname }
)
"""
