"""
This file contains the functions needed to create Excel
worksheets for download
"""

from io import BytesIO
import re
from fastapi import Response
import xlsxwriter
from .utils import shorten_segment_names
from .endpoints.utils import get_displayname


def run_table_download(query, file_values):
    """
    Creates an Excel workbook with data given
    """
    # Create a workbook and add a worksheet.
    file = BytesIO()
    workbook = xlsxwriter.Workbook(
        file,
        {"use_zip64": True, "in_memory": True},
    )
    worksheet = workbook.add_worksheet()
    worksheet.set_landscape()
    worksheet.center_horizontally()
    worksheet.set_margins(0.1, 0.1, 0.4, 0.4)
    worksheet.hide_gridlines(2)

    spreadsheet_fields = get_spreadsheet_fields(file_values[6], file_values)

    # Defining formats
    worksheet.set_row(0, 30)
    worksheet.set_row(1, 25)
    worksheet.set_row(12, 50)
    worksheet.set_column("A:A", 8)
    worksheet.set_column("B:B", 25)
    worksheet.set_column("C:C", 30)
    worksheet.set_column("D:D", 6)
    worksheet.set_column("E:E", 7)
    worksheet.set_column("F:F", 7)
    worksheet.set_column("G:G", 100)

    workbook_formats = add_formatting_workbook(workbook)

    full_root_filename = get_displayname(file_values[0])
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
        spreadsheet_values = get_spreadsheet_values(parallel)

        worksheet.write(row, 0, "Inquiry", workbook_formats[5])
        worksheet.write(row, 1, full_root_filename[1], workbook_formats[5])
        worksheet.write(row, 2, full_root_filename[0], workbook_formats[5])
        worksheet.write(row, 3, spreadsheet_values[0], workbook_formats[5])
        worksheet.write(row, 4, parallel["root_length"], workbook_formats[6])
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
    return Response(
        file.getvalue(),
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={
            "Content-Disposition": "attachment; filename=buddhanexus_download.xlsx"
        },
    )


def get_spreadsheet_fields(lang, file_values):
    """
    create header and filter fields for spreadsheet
    """

    segment_field = get_segment_field(lang, file_values[0])

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
        [segment_field, file_values[5]],
        ["Similarity Score", file_values[1]],
        ["Min. Match Length", file_values[2]],
        ["Sorting Method", file_values[3]],
        ["Filters", file_values[4]],
        ["Max. number of results", "20,000"],
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

    inquiry_text_number = workbook.add_format(
        {"text_wrap": True, "font_size": 10, "bold": True}
    )
    hit_text_number = workbook.add_format(
        {"align": "center", "font_size": 9, "text_wrap": True}
    )

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
        inquiry_text_number,
        hit_text_number,
    )


def get_segment_field(lang, filename):
    """
    The segment field is named differently for different languages
    """
    segment_field = "Segments"
    if lang == "bo":
        segment_field = "Folio"
    elif lang == "pa" and not re.search(r"^(anya|tika|atk)", filename):
        segment_field = "PTS nr"
    elif lang == "zh":
        segment_field = "Facsimile"

    return segment_field


def get_spreadsheet_values(parallel):
    """
    Calculate correct values for spreadsheet from the parallel given
    """
    root_segment_nr = shorten_segment_names(parallel["root_segnr"]).split(":")[1]
    root_segment_text_joined = " ".join(parallel["root_seg_text"])
    root_offset_beg = parallel["root_offset_beg"]
    try:
        root_offset_end = len(root_segment_text_joined) - (
            len(parallel["root_seg_text"][-1]) - parallel["root_offset_end"]
        )
        root_segment_text = root_segment_text_joined[root_offset_beg:root_offset_end]
    except IndexError:
        root_segment_text = root_segment_text_joined

    par_segment_nr = shorten_segment_names(parallel["par_segnr"]).split(":")[1]

    par_segment_text_joined = " ".join(parallel["par_segment"])
    par_offset_beg = parallel["par_offset_beg"]
    try:
        par_offset_end = len(par_segment_text_joined) - (
            len(parallel["par_segment"][-1]) - parallel["par_offset_end"]
        )
        par_segment_text = par_segment_text_joined[par_offset_beg:par_offset_end]
    except IndexError:
        par_segment_text = par_segment_text_joined

    par_displayname = parallel["par_displayname"]
    par_textname = parallel["par_textname"]

    return (
        root_segment_nr,
        root_segment_text,
        par_textname,
        par_displayname,
        par_segment_nr,
        par_segment_text,
    )


def run_numbers_download(categories, segments, file_values):
    """
    Creates an Excel workbook with data given for the numbers view
    """
    # Create a workbook and add a worksheet.
    file = BytesIO()
    workbook = xlsxwriter.Workbook(
        file,
        {"use_zip64": True, "in_memory": True},
    )
    worksheet = workbook.add_worksheet()
    worksheet.set_landscape()
    worksheet.center_horizontally()
    worksheet.set_margins(0.1, 0.1, 0.4, 0.4)

    spreadsheet_fields = get_spreadsheet_fields(file_values[6], file_values)

    # Defining formats
    worksheet.set_row(0, 30)
    worksheet.set_row(1, 25)
    worksheet.set_row(12, 25)
    worksheet.set_row(13, 25)
    worksheet.set_column("A:FZ", 25)
    worksheet.freeze_panes(0, 1)

    workbook_formats = add_formatting_workbook(workbook)

    full_root_filename = get_displayname(file_values[0])
    # Writing header
    worksheet.insert_image("A4", "buddhanexus_smaller.jpg")
    worksheet.merge_range(
        0,
        1,
        0,
        4,
        "Matches numbers download for " + full_root_filename[1],
        workbook_formats[0],
    )
    worksheet.merge_range(1, 1, 1, 4, full_root_filename[0], workbook_formats[1])

    row = 3
    for item in spreadsheet_fields[1]:
        worksheet.write(row, 2, str(item[1]), workbook_formats[4])
        worksheet.write(row, 3, str(item[0]), workbook_formats[2])
        row += 1

    worksheet.write(
        12, 0, get_segment_field(file_values[6], file_values[0]), workbook_formats[3]
    )

    categories_list = []
    col = 1
    for item in categories:
        worksheet.write(12, col, item["id"], workbook_formats[3])
        categories_list.append(item["id"])
        col += 1

    worksheet.write(13, 0, "", workbook_formats[10])
    col = 1
    for item in categories:
        worksheet.write(13, col, item["displayName"], workbook_formats[10])
        col += 1

    row = 14
    # Iterate over the data and write it out row by row.
    for item in segments:
        worksheet.write(row, 0, item["segmentnr"], workbook_formats[11])

        for key, value in get_category_dict(item["parallels"], categories_list).items():
            worksheet.write(row, key, "\n".join(sorted(value)), workbook_formats[12])

        row += 1

    workbook.close()
    return Response(
        file.getvalue(),
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={
            "Content-Disposition": "attachment; filename=buddhanexus_download.xlsx"
        },
    )


def get_category_dict(segment_parallels, categories_list):
    """
    Calculates which items go in which column of the spreadsheet
    """
    category_dict = {}
    for parallel in segment_parallels:
        if not parallel or not isinstance(parallel, dict):
            continue
        category = parallel.get("category")
        if not category:
            continue
        try:
            category_index = categories_list.index(category) + 1
        except ValueError:
            print("cannot find in categories list: ", category)
            continue

        if not category_index in category_dict:
            category_dict[category_index] = []

        par_segnr = parallel.get("par_segnr")
        if not par_segnr:
            continue
        category_dict[category_index].append(shorten_segment_names(par_segnr))

    return category_dict
