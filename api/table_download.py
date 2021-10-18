"""
This file contains the functions needed to create Excel
worksheets for download
"""

import re
import xlsxwriter

from .queries import main_queries
from .db_connection import get_db

COLLECTION_PATTERN = r"^(pli-tv-b[ui]-vb|XX|OT|NG|[A-Z]+[0-9]+|[a-z\-]+)"


def run_table_download(query, file_values):
    """
    Creates an Excel workbook with data given
    """
    # Create a workbook and add a worksheet.
    file_location = "download/" + file_values[0] + "_download.xlsx"
    lang = file_values[7]
    workbook = xlsxwriter.Workbook(
        file_location,
        {"constant_memory": True, "use_zip64": True},
    )
    worksheet = workbook.add_worksheet()
    worksheet.set_landscape()
    worksheet.center_horizontally()
    worksheet.set_margins(0.1, 0.1, 0.4, 0.4)
    worksheet.hide_gridlines(2)

    spreadsheet_fields = get_spreadsheet_fields(lang, file_values)

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

    workbook_formats = add_formatting_workbook(workbook)

    full_root_filename = get_displayname(file_values[0], lang)
    # Writing header
    worksheet.insert_image("D4", "buddhanexus_smaller.jpg")
    worksheet.merge_range(
        0,
        0,
        0,
        5,
        "Matches table download for " + full_root_filename[1],
        workbook_formats[0],
    )
    worksheet.merge_range(1, 0, 1, 5, full_root_filename[0], workbook_formats[1])

    row = 3
    for item in spreadsheet_fields[1]:
        worksheet.write(row, 1, str(item[1]), workbook_formats[4])
        worksheet.write(row, 2, str(item[0]), workbook_formats[2])
        row += 1

    col = 0
    for item in spreadsheet_fields[0]:
        worksheet.write(12, col, item, workbook_formats[3])
        col += 1

    row = 13
    # Iterate over the data and write it out row by row.
    for parallel in query.result:

        spreadsheet_values = get_spreadsheet_values(parallel, lang)

        worksheet.write(row, 0, "Inquiry", workbook_formats[5])
        worksheet.write(row, 1, full_root_filename[1], workbook_formats[5])
        worksheet.write(row, 2, full_root_filename[0], workbook_formats[5])
        worksheet.write(row, 3, spreadsheet_values[0], workbook_formats[5])
        worksheet.write(row, 4, parallel["root_length"], workbook_formats[6])
        worksheet.write(row, 5, parallel["score"], workbook_formats[6])
        worksheet.write(row, 6, spreadsheet_values[1], workbook_formats[5])

        worksheet.write(row + 1, 0, "Hit", workbook_formats[7])
        worksheet.write(row + 1, 1, spreadsheet_values[2], workbook_formats[7])
        worksheet.write(row + 1, 2, spreadsheet_values[3], workbook_formats[7])
        worksheet.write(row + 1, 3, spreadsheet_values[4], workbook_formats[7])
        worksheet.write(row + 1, 4, parallel["par_length"], workbook_formats[8])
        worksheet.write(row + 1, 5, parallel["score"], workbook_formats[8])
        worksheet.write(row + 1, 6, spreadsheet_values[5], workbook_formats[7])

        worksheet.set_row(row + 2, 1, workbook_formats[9])
        row += 3

    workbook.close()
    return file_location


def get_spreadsheet_fields(lang, file_values):
    """
    create header and filter fields for spreadsheet
    """

    segment_field = get_segment_field(lang)

    header_fields = [
        "Role",
        "Text number",
        "Full text name",
        segment_field,
        "Length",
        "Score",
        "Match text",
    ]

    filters_fields = (
        [segment_field, file_values[6]],
        ["Similarity Score", file_values[1]],
        ["Min. Match Length", file_values[2]],
        ["Nr. Co-occurances", file_values[3]],
        ["Sorting Method", file_values[4]],
        ["Filters", " ".join(map(str, file_values[5]))],
        ["Max. number of results", "10,000"],
    )

    return (header_fields, filters_fields)


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
    small_header_format = workbook.add_format(
        {
            "text_wrap": True,
            "align": "center",
            "valign": "top",
            "bold": True,
            "font_size": 10,
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
        small_header_format,
    )


def get_segment_field(lang):
    """
    The segment field is named differently for different languages
    """
    segment_field = "Segments"
    if lang == "tib":
        segment_field = "Folio"
    if lang == "pli":
        segment_field = "PTS nr"
    if lang == "chn":
        segment_field = "Facsimile"

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


def run_numbers_download(collections, segments, file_values):
    """
    Creates an Excel workbook with data given for the numbers view
    """
    # Create a workbook and add a worksheet.
    file_location = "download/" + file_values[0] + "_download.xlsx"
    lang = file_values[7]
    workbook = xlsxwriter.Workbook(
        file_location,
        {"constant_memory": True, "use_zip64": True},
    )
    worksheet = workbook.add_worksheet()
    worksheet.set_landscape()
    worksheet.center_horizontally()
    worksheet.set_margins(0.1, 0.1, 0.4, 0.4)

    spreadsheet_fields = get_spreadsheet_fields(lang, file_values)

    # Defining formats
    worksheet.set_row(0, 30)
    worksheet.set_row(1, 25)
    worksheet.set_row(12, 25)
    worksheet.set_row(13, 25)
    worksheet.set_column("A:FZ", 20)

    workbook_formats = add_formatting_workbook(workbook)

    full_root_filename = get_displayname(file_values[0], lang)
    # Writing header
    worksheet.insert_image("A4", "buddhanexus_smaller.jpg")
    worksheet.merge_range(
        0,
        0,
        0,
        5,
        "Matches numbers download for " + full_root_filename[1],
        workbook_formats[0],
    )
    worksheet.merge_range(1, 0, 1, 5, full_root_filename[0], workbook_formats[1])

    row = 3
    for item in spreadsheet_fields[1]:
        worksheet.write(row, 2, str(item[1]), workbook_formats[4])
        worksheet.write(row, 3, str(item[0]), workbook_formats[2])
        row += 1

    worksheet.write(12, 0, get_segment_field(lang), workbook_formats[3])

    collections_list = []
    col = 1
    for collection in collections:
        for key in collection.keys():
            worksheet.write(12, col, key, workbook_formats[3])
            collections_list.append(key)
            col += 1

    worksheet.write(13, 0, "", workbook_formats[10])
    col = 1
    for collection in collections:
        for value in collection.values():
            worksheet.write(13, col, value, workbook_formats[10])
            col += 1

    inquiry_text_number = workbook.add_format({"text_wrap": True, "font_size": 10})
    hit_text_numbers = workbook.add_format(
        {"align": "center", "font_size": 9, "text_wrap": True}
    )

    row = 14
    # Iterate over the data and write it out row by row.
    for segment in segments:
        worksheet.write(row, 0, segment["segmentnr"], inquiry_text_number)

        collection_dict = {}
        for parallel in segment["parallels"]:
            collection_key = re.search(COLLECTION_PATTERN, parallel[0])
            collection_index = collections_list.index(collection_key.group()) + 1

            if not collection_index in collection_dict.keys():
                collection_dict[collection_index] = []

            if len(parallel) > 1:
                collection_dict[collection_index].append(
                    parallel[0] + "–" + parallel[len(parallel) - 1]
                )
            else:
                collection_dict[collection_index].append(parallel[0])

        for key, value in collection_dict.items():
            worksheet.write(row, key, "\n".join(sorted(value)), hit_text_numbers)

        row += 1

    workbook.close()
    return file_location
