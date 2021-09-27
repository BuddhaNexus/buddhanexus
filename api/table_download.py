import xlsxwriter

from .queries import main_queries
from .db_connection import get_db


def run_table_download(
    query,
    file_name,
    score,
    par_length,
    co_occ,
    sort_method,
    limitcollection_positive,
    limitcollection_negative,
    folio,
):
    file_location = "download/" + file_name + "_download.xlsx"
    lang = query.result[0]["src_lang"]
    # Create a workbook and add a worksheet.
    workbook = xlsxwriter.Workbook(
        file_location,
        {"constant_memory": True, "use_zip64": True},
    )
    worksheet = workbook.add_worksheet()

    inquiry_segment_field = "Inquiry text segments"
    hit_segment_field = "Hit text segments"
    if lang == "tib":
        inquiry_segment_field = "Inquiry text folio"
        hit_segment_field = "Hit text folio"
    if lang == "pli":
        inquiry_segment_field = "Inquiry text PTS nr"
        hit_segment_field = "Hit text PTS nr"
    if lang == "chn":
        inquiry_segment_field = "Inquiry text facsimile"
        hit_segment_field = "Hit text facsimile"
    header_fields = [
        inquiry_segment_field,
        "Inquiry match length",
        "Inquiry match text",
        "Hit text name",
        "Hit text number",
        hit_segment_field,
        "Hit match length",
        "Match score",
        "Hit match text",
    ]
    filters_fields = (
        [inquiry_segment_field, folio],
        ["Similarity Score", score],
        ["Min. Match Length", par_length],
        ["Nr. Co-occurances", co_occ],
        ["Sorting Method", sort_method],
        ["Exclude filter", limitcollection_negative],
        ["Include filter", limitcollection_positive],
        ["Max. number of results", "10,000"],
    )

    # Defining formats
    worksheet.set_row(0, 30)
    worksheet.set_row(1, 25)
    worksheet.set_row(12, 50)
    worksheet.set_column("A:A", 16)
    worksheet.set_column("B:B", 10)
    worksheet.set_column("C:C", 50)
    worksheet.set_column("D:D", 20)
    worksheet.set_column("E:E", 10)
    worksheet.set_column("F:F", 16)
    worksheet.set_column("G:G", 10)
    worksheet.set_column("H:H", 10)
    worksheet.set_column("I:I", 50)

    title_format = workbook.add_format(
        {"bold": True, "font_size": 16, "font_color": "#7c3a00"}
    )
    subtitle_format = workbook.add_format(
        {"bold": True, "font_size": 14, "font_color": "#7c3a00"}
    )
    filters_format = workbook.add_format(
        {"bold": True, "font_size": 10, "font_color": "#7c3a00"}
    )
    header_format = workbook.add_format(
        {
            "text_wrap": True,
            "valign": "top",
            "bold": True,
            "font_size": 12,
            "font_color": "#7c3a00",
            "bg_color": "#ffdaa1",
        }
    )
    filter_values_format = workbook.add_format({"align": "center"})

    full_root_filename = get_displayname(file_name, lang)
    # Writing header
    worksheet.insert_image("D4", "buddhanexus_smaller.jpg")
    worksheet.write(
        0, 1, "Matches table download for " + full_root_filename[1], title_format
    )
    worksheet.write(1, 1, full_root_filename[0], subtitle_format)

    row = 3
    for filter_type, filter_value in filters_fields:
        worksheet.write(row, 0, str(filter_value), filter_values_format)
        worksheet.write(row, 1, str(filter_type), filters_format)
        row += 1

    col = 0
    for item in header_fields:
        worksheet.write(12, col, item, header_format)
        col += 1

    row = 13
    # Iterate over the data and write it out row by row.
    for parallel in query.result:
        root_segment_nr = parallel["root_segnr"][0].split(":")[1]
        if lang == "tib":
            root_segment_nr = root_segment_nr.split("-")[0]
        elif len(parallel["root_segnr"]) > 1:
            root_segment_nr += (
                "–"
                + parallel["root_segnr"][len(parallel["root_segnr"]) - 1].split(":")[1]
            )
        root_segment_text = " ".join(parallel["root_seg_text"])
        root_offset_beg = parallel["root_offset_beg"]
        root_offset_end = len(root_segment_text) - (
            len(parallel["root_seg_text"][-1]) - parallel["root_offset_end"]
        )
        root_segment_text = root_segment_text[root_offset_beg:root_offset_end]

        par_segment_nr = parallel["par_segnr"][0].split(":")[1]
        if lang == "tib":
            par_segment_nr = par_segment_nr.split("-")[0]
        elif len(parallel["par_segnr"]) > 1:
            par_segment_nr += (
                "–"
                + parallel["par_segnr"][len(parallel["par_segnr"]) - 1].split(":")[1]
            )

        par_segment_text = " ".join(parallel["par_segment"])
        par_offset_beg = parallel["par_offset_beg"]
        try:
            par_offset_end = len(par_segment_text) - (
                len(parallel["par_segment"][-1]) - parallel["par_offset_end"]
            )
            par_segment_text = par_segment_text[par_offset_beg:par_offset_end]
        except:
            par_segment_text = par_segment_text

        par_text_name = ""
        par_text_number = ""
        par_text_list = get_displayname(parallel["par_segnr"][0], lang)
        if par_text_list:
            par_text_name = par_text_list[0]
            par_text_number = par_text_list[1]

        text_cell_segments = workbook.add_format(
            {"valign": "vjustify", "text_wrap": True}
        )
        text_cell_numbers = workbook.add_format(
            {"align": "center", "valign": "vjustify"}
        )
        if (row % 2) == 0:
            text_cell_segments.set_bg_color("#ffeed4")
            text_cell_numbers.set_bg_color("#ffeed4")
        else:
            text_cell_segments.set_bg_color("white")
            text_cell_numbers.set_bg_color("white")

        worksheet.write(row, 0, root_segment_nr, text_cell_segments)
        worksheet.write(row, 1, parallel["root_length"], text_cell_numbers)
        worksheet.write(row, 2, root_segment_text, text_cell_segments)
        worksheet.write(row, 3, par_text_name, text_cell_segments)
        worksheet.write(row, 4, par_text_number, text_cell_segments)
        worksheet.write(row, 5, par_segment_nr, text_cell_segments)
        worksheet.write(row, 6, parallel["par_length"], text_cell_numbers)
        worksheet.write(row, 7, parallel["score"], text_cell_numbers)
        worksheet.write(row, 8, par_segment_text, text_cell_segments)
        row += 1

    workbook.close()
    return file_location


def get_displayname(segmentnr, lang):
    filename = segmentnr.split(":")[0]
    if lang == "chn":
        filename = re.sub(r"_[0-9]+", "", filename)
    full_name = ""
    database = get_db()
    query_displayname = database.AQLQuery(
        query=main_queries.QUERY_DISPLAYNAME,
        bindVars={"filename": filename},
    )

    if query_displayname.result:
        full_name = query_displayname.result[0]
    print(full_name)
    return full_name
