"""
Contains all database queries used by buddhanexus.

Todo:
- When this gets too big (>300 lines), consider splitting this into
  several files inside a "queries" directory.
"""

QUERY_FILE_SEGMENTS_PARALLELS = """
FOR file IN files
    FILTER file._key == @filename
    FOR segmentnr IN file.segmentnrs
        LET seg_parallels = (
            FOR segment IN segments
                FILTER segment._key == segmentnr
                FOR parallel_id IN segment.parallel_ids
                    FOR p IN parallels
                        FILTER p._key == parallel_id
                        LET collection_filter_test = (
                            FOR item IN @limitcollection_positive
                            RETURN REGEX_TEST(p.par_segnr[0], item)
                        )
                        LET fits_collection = (@limitcollection_positive != [])
                            ? POSITION(collection_filter_test, true)
                            : true
                        FILTER fits_collection == true
                        LET collection_filter_test2 = (
                            FOR item IN @limitcollection_negative
                            RETURN REGEX_TEST(p.par_segnr[0], item)
                        )
                        LET fits_collection2 = (@limitcollection_negative != [])
                            ? POSITION(collection_filter_test2, true)
                            : false
                        FILTER fits_collection2 == false
                        FILTER p.score >= @score
                        FILTER p.par_length >= @parlength
                        FILTER p["co-occ"] <= @coocc
                        RETURN p.par_segnr
            )
        RETURN seg_parallels[0] ?
            { "segmentnr": segmentnr, "parallels": seg_parallels } :
            { "segmentnr": segmentnr }
"""

QUERY_TABLE_VIEW = """
LET file_parallels = (
    FOR p IN parallels
        FILTER p.root_filename == @filename
        LIMIT 200000
        FILTER p.score >= @score
        FILTER p.par_length >= @parlength
        FILTER p["co-occ"] <= @coocc
        LET collection_filter_test = (
            FOR item IN @limitcollection_positive
            RETURN REGEX_TEST(p.par_segnr[0], item)
        )
        LET fits_collection = (@limitcollection_positive != [])
            ? POSITION(collection_filter_test, true)
            : true
        FILTER fits_collection == true
        LET collection_filter_test2 = (
            FOR item IN @limitcollection_negative
            RETURN REGEX_TEST(p.par_segnr[0], item)
        )
        LET fits_collection2 = (@limitcollection_negative != [])
            ? POSITION(collection_filter_test2, true)
            : false
        FILTER fits_collection2 == false
        SORT p.@sortkey @sortdirection
        LIMIT 50 * @page, 50
        let root_seg_text = (
            FOR segnr IN p.root_segnr
                FOR segment IN segments
                    FILTER segment._key == segnr
                    RETURN segment.segtext
        )
        let par_segment = (
            FOR segnr IN p.par_segnr
                FOR segment IN segments
                    FILTER segment._key == segnr
                    RETURN segment.segtext
        )
        RETURN {
            par_segnr: p.par_segnr,
            par_offset_beg: p.par_offset_beg,
            par_offset_end: p.par_offset_end,
            root_offset_beg: p.root_offset_beg,
            root_offset_end: p.root_offset_end-1,
            par_segment: par_segment,
            file_name: p.id,
            root_segnr: p.root_segnr,
            root_seg_text: root_seg_text,
            par_length: p.par_length,
            root_length: p.root_length,
            par_pos_beg: p.par_pos_beg,
            "co-occ": p["co-occ"],
            score: p.score
        }
    )
RETURN {
    parallels: file_parallels
}
"""

QUERY_COLLECTION_NAMES = """
RETURN (
    FOR category IN menu_categories
        FILTER category.language == @language
        SORT category.categorynr
        FOR collection_key IN @collections
            FILTER category["category"] == collection_key
            RETURN { [category["category"]]: category.categoryname }
)
"""

QUERY_FILES_FOR_LANGUAGE = """
FOR category IN menu_categories
    FILTER category.language == @language
    FOR catfile IN category.files
        FOR file IN files
            FILTER file._key == catfile
            SORT file.filenr
            RETURN {displayName: file.displayName,
                    textname: file.textname,
                    filename: file.filename,
                    category: file.category}
"""

QUERY_FILES_FOR_CATEGORY = """
FOR category IN menu_categories
    FILTER category.language == @language
    SORT category.categorynr
    FOR catfile IN category.files
        RETURN {filename: catfile,
                categoryname: UPPER(catfile)}
"""

QUERY_CATEGORIES_FOR_LANGUAGE = """
    LET totalcollection = (
        FOR collection IN menu_collections
            FILTER collection.language == @language
            SORT collection.collectionnr
            LET language = collection.language
            LET categorylist = (
            FOR col_category IN collection.categories
                FOR category IN menu_categories
                    FILTER category.category == col_category
                    FILTER category.language == language
                    SORT category.categorynr
                    LET categorynamepart = SPLIT( category.categoryname, [ "—", "(" ] )[0]
                    LET categoryname = CONCAT_SEPARATOR(" ",categorynamepart,CONCAT("(",UPPER(category.category),")"))
                    RETURN {category: category.category,
                            categoryname: CONCAT("• ",categoryname)}
                    )
            RETURN APPEND([{ category: collection._key,
                     categoryname: CONCAT(UPPER(collection.collection), " (ALL)")}],
                     categorylist)
        )
    RETURN FLATTEN(totalcollection)
"""

QUERY_TEXT_SEARCH = """
FOR file IN files
    FILTER file._key == @filename
    FOR segmentnr IN file.segmentnrs
        FOR segment in segments
            FILTER segment._key == segmentnr
            FILTER LIKE(segment.segtext, @search_string, true)
            RETURN { segnr: segment.segnr,
                     segtext: segment.segtext,
                     parallel_ids: segment.parallel_ids }
"""

QUERY_SEGMENT_COUNT = """
FOR segment IN segments
    FILTER segment._key == @segmentnr
    RETURN segment.count

"""

QUERY_TEXT_AND_PARALLELS = """
FOR file IN files
    FILTER file._key == @filename
    let segments = (
        FOR segmentnr IN file.segmentnrs
            LIMIT @startint, @limit
            FOR segment in segments
                FILTER segment._key == segmentnr
                RETURN { segnr: segment.segnr,
                         segtext: segment.segtext,
                         parallel_ids: segment.parallel_ids }
        )

let parallel_ids = UNIQUE(FLATTEN(
     FOR segment in segments
          RETURN segment.parallel_ids
))

let parallels =  (
    FOR parallel_id IN parallel_ids
        FOR p IN parallels
            FILTER p._key == parallel_id
            FILTER p.score >= @score
            FILTER p.par_length >= @parlength
            FILTER p["co-occ"] <= @coocc
            LET filtertest = (
                FOR item IN @limitcollection_positive
                    RETURN REGEX_TEST(p.par_segnr[0], item)
                )
                LET filternr = (@limitcollection_positive != []) ? POSITION(filtertest, true) : true
                FILTER filternr == true
                LET filtertest2 = (
                    FOR item IN @limitcollection_negative
                        RETURN REGEX_TEST(p.par_segnr[0], item)
                    )
                    LET filternr2 = (@limitcollection_negative != []) ? POSITION(filtertest2, true) : false
                    FILTER filternr2 == false
                    RETURN { root_offset_beg: p.root_offset_beg,
                             root_offset_end: p.root_offset_end,
                             root_segnr : p.root_segnr,
                             id: p._key }
    )
RETURN { textleft: segments,
         parallel_ids: parallel_ids,
         parallels: parallels}
"""

QUERY_PARALELLS_FOR_MIDDLE_TEXT = """
RETURN (
    FOR parallel_id IN @parallel_ids
        FOR p IN parallels
            FILTER p._key == parallel_id
            FILTER p.score >= @score
            FILTER p.par_length >= @parlength
            FILTER p["co-occ"] <= @coocc
            LET filtertest = (
                FOR item IN @limitcollection_positive
                    RETURN REGEX_TEST(p.par_segnr[0], item)
                )
                LET filternr = (@limitcollection_positive != []) ? POSITION(filtertest, true) : true
                FILTER filternr == true
                LET filtertest2 = (
                    FOR item IN @limitcollection_negative
                        RETURN REGEX_TEST(p.par_segnr[0], item)
                    )
                    LET filternr2 = (@limitcollection_negative != []) ? POSITION(filtertest2, true) : false
                    FILTER filternr2 == false
                    let par_segtext = (
                        FOR segnr IN p.par_segnr
                            FOR segment IN segments
                                FILTER segment._key == segnr
                                RETURN segment.segtext
                       )
                RETURN {
                    par_segnr: p.par_segnr,
                    par_offset_beg: p.par_offset_beg,
                    par_offset_end: p.par_offset_end,
                    root_offset_beg: p.root_offset_beg,
                    root_offset_end: p.root_offset_end-1,
                    par_segtext: par_segtext,
                    file_name: p.id,
                    root_segnr: p.root_segnr,
                    par_length: p.par_length,
                    par_pos_beg: p.par_pos_beg,
                    score: p.score,
                    "co-occ": p["co-occ"]
                }
)
"""

QUERY_GRAPH_DATA = """
LET target = FLATTEN(
    FOR targetitem IN @targetcollection
        FOR collection IN menu_collections
            FILTER collection._key == targetitem
            RETURN collection.categories
        )
FOR p IN parallels
    FILTER p.root_filename == @filename
    LIMIT 15000
    FILTER p.score >= @score
    FILTER p.par_length >= @parlength
    FILTER p["co-occ"] <= @coocc
    LET filtertest = (
        FOR item IN target
            RETURN REGEX_TEST(p.par_segnr[0], CONCAT("^",item,"[^y]"))
        )
    LET filternr = (target != []) ? POSITION(filtertest, true) : true
    FILTER filternr == true
    RETURN { "textname": SPLIT(p.par_segnr[0],":")[0], "parlength": p.par_length}
"""

QUERY_TOTAL_NUMBERS = """
FOR p IN parallels
    FILTER p.root_filename == @filename
    LET filtertest = (
        FOR item IN @limitcollection_positive
            RETURN REGEX_TEST(p.par_segnr[0], item)
        )
        LET filternr = (@limitcollection_positive != []) ? POSITION(filtertest, true) : true
        FILTER filternr == true
        LET filtertest2 = (
            FOR item IN @limitcollection_negative
                RETURN REGEX_TEST(p.par_segnr[0], item)
            )
            LET filternr2 = (@limitcollection_negative != []) ? POSITION(filtertest2, true) : false
            FILTER filternr2 == false
            FILTER p.score >= @score
            FILTER p.par_length >= @parlength
            FILTER p["co-occ"] <= @coocc
            LIMIT 15000
            COLLECT WITH COUNT INTO length
RETURN length
"""

QUERY_COLLECTION_TOTALS = """
RETURN FLATTEN(
    FOR target in @selected
        FOR col IN categories_parallelcount
            FILTER col.sourcecollection == @sourcecollection
            FILTER col.targetcollection == target
            RETURN col.totallengthcount
            )
"""

QUERY_FILES_PER_CATEGORY = """
FOR file IN files_parallelcount
    FILTER file.category == @searchterm
    FILTER file.language == @language
    SORT file.filenr
    RETURN { filename: file._key,
             totallengthcount: file.totallengthcount }
"""

QUERY_ALL_COLLECTIONS = """
FOR menu IN menu_collections
    RETURN { collectionname : menu.collection,
             collectionlanguage: menu.language,
             collectionkey: menu._key }
"""

QUERY_CATEGORIES_PER_COLLECTION = """
    FOR collection IN menu_collections
        LET language = collection.language
        LET categorylist = (
        FOR col_category IN collection.categories
            FOR category IN menu_categories
                FILTER category.category == col_category
                FILTER category.language == language
                SORT category.categorynr
                LET catname = SPLIT(category.categoryname,["—","("])[0]
                RETURN {[category["category"]]: catname }
                )
        RETURN { collection: collection._key,
                 language: language,
                 categories: categorylist }
"""

QUERY_ONE_COLLECTION = """
    FOR collection IN menu_collections
        FILTER collection._key == @collectionkey
        RETURN collection.categories
"""

QUERY_TOTAL_MENU = """
    FOR collection IN menu_collections
        FILTER collection.language == @language
        LET categorylist = (
        FOR col_category IN collection.categories
            FOR category IN menu_categories
                FILTER category.category == col_category
                FILTER category.language == @language
                SORT category.categorynr
                LET catname = SPLIT(category.categoryname,["—","("])[0]
                LET filelist = (
                    FOR cat_file IN category.files
                        FOR file in files
                            FILTER file._key == cat_file
                            SORT file.filenr
                            RETURN {filename: file.filename,
                                    displayname: file.displayName}
                )
                RETURN {categoryname: category.category,
                        categorydisplayname: catname,
                        files: filelist}
                )
        RETURN { collection: collection.collection,
                 categories: categorylist }
"""
