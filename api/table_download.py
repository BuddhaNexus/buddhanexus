"""
This file contains the functions needed to create Excel
worksheets for download
"""

import re
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
    limit_collection,
    folio,
):
    """
    Creates an Excel workbook with data given
    """
    # Create a workbook and add a worksheet.
    workbook = xlsxwriter.Workbook(
        "download/" + file_name + "_download.xlsx",
        {"constant_memory": True, "use_zip64": True},
    )
    worksheet = workbook.add_worksheet()
    worksheet.set_landscape()
    worksheet.center_horizontally()
    worksheet.set_margins(0.1, 0.1, 0.4, 0.4)
    worksheet.hide_gridlines(2)

    header_fields = [
        "Role",
        "Text number",
        "Full text name",
        get_segment_field(query.result[0]["src_lang"]),
        "Length",
        "Score",
        "Match text",
    ]

    filters_fields = (
        [get_segment_field(query.result[0]["src_lang"]), folio],
        ["Similarity Score", score],
        ["Min. Match Length", par_length],
        ["Nr. Co-occurances", co_occ],
        ["Sorting Method", sort_method],
        ["Filters", " ".join(map(str, limit_collection))],
        ["Max. number of results", "10,000"],
    )

    # Defining formats
    worksheet.set_row(0, 30)
    worksheet.set_row(1, 25)
    worksheet.set_row(12, 50)
    worksheet.set_column("A:A", 8)
    worksheet.set_column("B:B", 13)
    worksheet.set_column("C:C", 30)
    worksheet.set_column("D:D", 6)
    worksheet.set_column("E:E", 7)
    worksheet.set_column("F:F", 7)
    worksheet.set_column("G:G", 100)

    (
        title_format,
        subtitle_format,
        filters_format,
        header_format,
        filter_values_format,
        inquiry_text_cell_segments,
        inquiry_text_cell_numbers,
        hit_text_cell_segments,
        hit_text_cell_numbers,
        inbetween_row_format,
    ) = add_formatting_workbook(workbook)

    full_root_filename = get_displayname(file_name, query.result[0]["src_lang"])
    # Writing header
    worksheet.insert_image("D4", "buddhanexus_smaller.jpg")
    worksheet.merge_range(
        0, 0, 0, 5, "Matches table download for " + full_root_filename[1], title_format
    )
    worksheet.merge_range(1, 0, 1, 5, full_root_filename[0], subtitle_format)

    row = 3
    for filter_type, filter_value in filters_fields:
        worksheet.write(row, 1, str(filter_value), filter_values_format)
        worksheet.write(row, 2, str(filter_type), filters_format)
        row += 1

    col = 0
    for item in header_fields:
        worksheet.write(12, col, item, header_format)
        col += 1

    row = 13
    # Iterate over the data and write it out row by row.
    for parallel in query.result:

        (
            root_segment_nr,
            root_segment_text,
            par_text_number,
            par_text_name,
            par_segment_nr,
            par_segment_text,
        ) = get_spreadsheet_values(parallel, query.result[0]["src_lang"])

        worksheet.write(row, 0, "Inquiry", inquiry_text_cell_segments)
        worksheet.write(row, 1, full_root_filename[1], inquiry_text_cell_segments)
        worksheet.write(row, 2, full_root_filename[0], inquiry_text_cell_segments)
        worksheet.write(row, 3, root_segment_nr, inquiry_text_cell_segments)
        worksheet.write(row, 4, parallel["root_length"], inquiry_text_cell_numbers)
        worksheet.write(row, 5, parallel["score"], inquiry_text_cell_numbers)
        worksheet.write(row, 6, root_segment_text, inquiry_text_cell_segments)

        worksheet.write(row + 1, 0, "Hit", hit_text_cell_segments)
        worksheet.write(row + 1, 1, par_text_number, hit_text_cell_segments)
        worksheet.write(row + 1, 2, par_text_name, hit_text_cell_segments)
        worksheet.write(row + 1, 3, par_segment_nr, hit_text_cell_segments)
        worksheet.write(row + 1, 4, parallel["par_length"], hit_text_cell_numbers)
        worksheet.write(row + 1, 5, parallel["score"], hit_text_cell_numbers)
        worksheet.write(row + 1, 6, par_segment_text, hit_text_cell_segments)

        worksheet.set_row(row + 2, 1, inbetween_row_format)
        row += 3

    workbook.close()
    return "download/" + file_name + "_download.xlsx"


def add_formatting_workbook(workbook):
    """
    creates formats to the workbook
    """
    title_format = workbook.add_format(
        {
            "bold": True,
            "font_size": 16,
            "font_color": "#7c3a00",
            "align": "center",
            "text_wrap": True,
        }
    )
    subtitle_format = workbook.add_format(
        {
            "bold": True,
            "font_size": 14,
            "align": "center",
            "font_color": "#7c3a00",
            "text_wrap": True,
        }
    )
    filters_format = workbook.add_format(
        {"bold": True, "font_size": 10, "font_color": "#7c3a00", "text_wrap": True}
    )
    header_format = workbook.add_format(
        {
            "text_wrap": True,
            "align": "center",
            "valign": "top",
            "bold": True,
            "font_size": 12,
            "font_color": "#7c3a00",
            "bg_color": "#ffdaa1",
        }
    )
    filter_values_format = workbook.add_format({"align": "center", "text_wrap": True})

    inquiry_text_cell_segments = workbook.add_format(
        {"text_wrap": True, "bg_color": "white"}
    )
    inquiry_text_cell_numbers = workbook.add_format(
        {"align": "center", "bg_color": "white"}
    )
    hit_text_cell_segments = workbook.add_format(
        {"text_wrap": True, "bg_color": "#ffeed4"}
    )
    hit_text_cell_numbers = workbook.add_format(
        {"align": "center", "bg_color": "#ffeed4"}
    )

    inbetween_row_format = workbook.add_format({"bg_color": "white"})

    return (
        title_format,
        subtitle_format,
        filters_format,
        header_format,
        filter_values_format,
        inquiry_text_cell_segments,
        inquiry_text_cell_numbers,
        hit_text_cell_segments,
        hit_text_cell_numbers,
        inbetween_row_format,
    )


def get_segment_field(lang):
    """
    The segment field is named differently for different languages
    """
    segment_field = "segments"
    if lang == "tib":
        segment_field = "Folio"
    if lang == "pli":
        segment_field = "PTS nr"
    if lang == "chn":
        segment_field = "facsimile"

    return segment_field


def get_spreadsheet_values(parallel, lang):
    """
    Calculate correct values for spreadsheet from the parallel given
    """
    root_segment_nr = parallel["root_segnr"][0].split(":")[1]
    if lang == "tib":
        root_segment_nr = root_segment_nr.split("-")[0]
    elif len(parallel["root_segnr"]) > 1:
        root_segment_nr += (
            "–" + parallel["root_segnr"][len(parallel["root_segnr"]) - 1].split(":")[1]
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
            "–" + parallel["par_segnr"][len(parallel["par_segnr"]) - 1].split(":")[1]
        )

    par_segment_text_joined = " ".join(parallel["par_segment"])
    par_offset_beg = parallel["par_offset_beg"]
    try:
        par_offset_end = len(par_segment_text_joined) - (
            len(parallel["par_segment"][-1]) - parallel["par_offset_end"]
        )
        par_segment_text = par_segment_text_joined[par_offset_beg:par_offset_end]
    except IndexError:
        par_segment_text = par_segment_text_joined

    par_text_name = ""
    par_text_number = ""
    par_text_list = get_displayname(parallel["par_segnr"][0], lang)
    if par_text_list:
        par_text_name = par_text_list[0]
        par_text_number = par_text_list[1]

    return (
        root_segment_nr,
        root_segment_text,
        par_text_number,
        par_text_name,
        par_segment_nr,
        par_segment_text,
    )


def get_displayname(segmentnr, lang):
    """
    Downloads the displaynames for the worksheet
    """
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
    return full_name
