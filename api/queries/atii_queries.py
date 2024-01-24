QUERY_AUTHOR_COMPOSED_LINES_LENGTH = """
let filelist = (
    for file IN files
        FILTER file.@role == @author
        let segment_lengths = (
            for csegment in file.segment_keys
                for rsegment in segments
                    FILTER rsegment._key == csegment
                    return LENGTH(rsegment.segtext)

        )
        return {
            category: file.category,
            file_name: file.file_name,
            total_length: SUM(segment_lengths)
            }
)
return filelist
"""

QUERY_AUTHOR_MATCHES = """
let parallel_list = (
    for p IN parallels
        LET root_author = (
            for file in files
            FILTER file.file_name == p.file_name
            RETURN file.@role
        )
        LET par_author = (
            for file in files
                FILTER file.file_name == p.par_file_name
                RETURN file.@role
            )
        return {
            root_author: root_author,
            par_author: par_author,
            length: p.par_length,
            par_category: p.par_category,
            root_file_name: p.root_file_name,
            par_file_name: p.par_file_name,
        }
)
return parallel_list
"""