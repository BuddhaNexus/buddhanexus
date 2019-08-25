query_file_segments_parallels = """
    FOR file in files
        FILTER file._key == @filename
        LET result = (
            FOR segmentnr IN file.segmentnrs
                LET seg_parallels = (
                    FOR segment IN segments
                    FILTER segment._key == segmentnr
                    RETURN segment.parallel_ids[0]
                )
                RETURN seg_parallels[0] ? 
                    { "segmentnr": segmentnr, "parallels": seg_parallels } :
                    { "segmentnr": segmentnr }
        )
        RETURN result
"""
