import xlsxwriter

def run_table_download(query,file_name,score,par_length, co_occ, sort_method, limitcollection_positive,limitcollection_negative):
    file_location = "download/" + file_name + "_download.xlsx"
    lang = query.result[0]['src_lang']
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
    header_fields = [
        "Inquiry text name",
        inquiry_segment_field,
        "Inquiry match length",
        "Inquiry match text",
        "Hit text name",
        hit_segment_field,        
        "Hit match length",
        "Match score",
        "Hit match text",
    ]
    filters_fields = (
        ["Similarity Score: ", score],
        ["Min. Match Length: ", par_length],
        ["Nr. Co-occurances: ", co_occ],
        ["Sorting Method: ", sort_method],
        ["Exclude filter: ", limitcollection_negative],
        ["Include filter: ", limitcollection_positive],
    )
    segment_field_width = 35
    if lang == "tib":
        segment_field_width = 16 
    # Defining formats
    worksheet.set_row(0, 30)
    worksheet.set_row(1, 20)
    worksheet.set_row(10, 40)
    worksheet.set_column("A:A", 30)
    worksheet.set_column("B:B", segment_field_width)
    worksheet.set_column("C:C", 16)
    worksheet.set_column("D:D", 50)
    worksheet.set_column("E:E", 30)
    worksheet.set_column("F:F", segment_field_width)
    worksheet.set_column("G:G", 16)
    worksheet.set_column("H:H", 16)
    worksheet.set_column("I:I", 50)
    
    subtitle_format = workbook.add_format(
        {"bold": True, "font_size": 16, "font_color": "#7c3a00"}
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

    # Writing header
    worksheet.insert_image("A1", "buddhanexus_small.jpg")
    worksheet.write(
        0, 1, "Matches table download for " + file_name.upper(), subtitle_format
    )

    row = 3
    for filter_type, filter_value in filters_fields:
        worksheet.write(row, 1, str(filter_type), filters_format)
        worksheet.write(row, 2, str(filter_value), filter_values_format)
        row += 1

    col = 0
    for item in header_fields:
        worksheet.write(10, col, item, header_format)
        col += 1

    row = 11
    # Iterate over the data and write it out row by row.
    for parallel in query.result:
        root_segment_nr = parallel["root_segnr"][0]
        if len(parallel["root_segnr"]) > 1:
            root_segment_nr += (
                "–" + parallel["root_segnr"][len(parallel["root_segnr"]) - 1]
            )
        if lang == "tib":
            root_segment_nr = parallel["root_segnr"][0].split(':')[1].split('-')[0]
        root_segment_text = " ".join(parallel["root_seg_text"])
        root_offset_beg = parallel['root_offset_beg']
        root_offset_end = len(root_segment_text) - (len(parallel["root_seg_text"][-1]) - parallel['root_offset_end'])
        root_segment_text = root_segment_text[root_offset_beg:root_offset_end]

        par_segment_nr = parallel["par_segnr"][0]
        if len(parallel["par_segnr"]) > 1:
            par_segment_nr += (
                "–" + parallel["par_segnr"][len(parallel["par_segnr"]) - 1]
            )
        if lang == "tib":
            par_segment_nr = parallel["par_segnr"][0].split(':')[1].split('-')[0]            
        par_segment_text = " ".join(parallel["par_segment"])
        par_offset_beg = parallel['par_offset_beg']
        par_offset_end = len(par_segment_text) - (len(parallel["par_segment"][-1]) - parallel['par_offset_end'])
        par_segment_text = par_segment_text[par_offset_beg:par_offset_end]
        root_text_name = parallel["root_segnr"][0].split(':')[0]
        par_text_name = parallel["par_segnr"][0].split(':')[0]
        
        
        text_cell_segments = workbook.add_format(
            {"valign": "vjustify", "text_wrap": True}
        )
        text_cell_text = workbook.add_format(
            {"valign": "vjustify", "text_wrap": True}
        )
        text_cell_numbers = workbook.add_format(
            {"align": "center", "valign": "vjustify"}
        )
        if (row % 2) == 0:
            text_cell_segments.set_bg_color("#ffeed4")
            text_cell_numbers.set_bg_color("#ffeed4")
            text_cell_text.set_bg_color("#ffeed4")
        else:
            text_cell_segments.set_bg_color("white")
            text_cell_numbers.set_bg_color("white")
            text_cell_text.set_bg_color("white")

        worksheet.write(row, 0, root_text_name, text_cell_segments)
        worksheet.write(row, 1, root_segment_nr, text_cell_segments)
        worksheet.write(row, 2, parallel["root_length"], text_cell_numbers)
        worksheet.write(row, 3, root_segment_text, text_cell_text)
        worksheet.write(row, 4, par_text_name, text_cell_segments)
        worksheet.write(row, 5, par_segment_nr, text_cell_segments)
        worksheet.write(row, 6, parallel["par_length"], text_cell_numbers)
        worksheet.write(row, 7, parallel["score"], text_cell_numbers)
        worksheet.write(row, 8, par_segment_text, text_cell_text)
        row += 1

    workbook.close()
    # Bogus filelink return
    return file_location
