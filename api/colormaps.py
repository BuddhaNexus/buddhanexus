"""
This file holds the functions for creating the colormaps.
"""


def create_segmented_text(text, colormap, matchmap):
    """create segmented text"""
    result_segments = []
    current_segment = ""
    last_matches = matchmap[0]
    last_matches = [x for x in last_matches if x is not None]
    last_matches.sort()
    last_color = colormap[0]
    # consider using: for i, _ in enumerate(text):
    for i in range(len(text)):
        current_color = colormap[i]
        current_matches = matchmap[i]
        current_matches = [x for x in current_matches if x is not None]
        current_matches.sort()
        if current_matches != last_matches:
            result_segments.append(
                {
                    "text": current_segment,
                    "highlightColor": last_color,
                    "matches": last_matches,
                }
            )
            current_segment = ""
        current_segment += text[i]
        last_matches = current_matches
        last_matches.sort()
        last_color = current_color
    result_segments.append(
        {"text": current_segment, "highlightColor": last_color, "matches": last_matches}
    )
    return result_segments


def create_segmented_text_color_only(text, colormap):
    """create segmented text color"""
    result_segments = []
    current_segment = ""
    last_color = colormap[0]
    # consider using: for i, _ in enumerate(text):
    for i in range(len(text)):
        current_color = colormap[i]
        if current_color != last_color:
            result_segments.append(
                {"text": current_segment, "highlightColor": last_color}
            )
            current_segment = ""
        current_segment += text[i]
        last_color = current_color
    result_segments.append({"text": current_segment, "highlightColor": last_color})
    return result_segments


def calculate_color_maps_text_view(data):
    """calculates the color maps for the text view"""
    textleft = data["textleft"]
    parallels_dict = dict(zip(data["parallel_ids"], data["parallels"]))
    print("parallels_dict", len(parallels_dict))
    for entry in textleft:
        # initialize with zeros
        segtext_len = len(entry["segtext"])
        current_colormap = [
            0
        ] * segtext_len  # this variable holds the ints for the colors of each character
        current_matchmap = [[None]] * segtext_len
        # this variable holds the ids of the parallels that are present at each character
        # now add the color layer
        for parallel_id in entry["parallel_ids"]:
            current_parallel = parallels_dict.get(parallel_id)
            if current_parallel is None:
                continue

            start = 0
            end = segtext_len
            if current_parallel["root_segnr"][0] == entry["segnr"]:
                start = current_parallel["root_offset_beg"]
            if current_parallel["root_segnr"][-1] == entry["segnr"]:
                end = current_parallel["root_offset_end"]
            # it is embarassing that we need to do this,
            # this should be dealt with at data-loader level
            end = min(end, segtext_len)
            for item in range(start, end):
                current_colormap[item] += 1
                if id not in current_matchmap[item]:
                    current_matchmap[item].append(id)

        entry["segtext"] = create_segmented_text(
            entry["segtext"], current_colormap, current_matchmap
        )

    for entry in textleft:
        del entry["parallel_ids"]

    return textleft


def calculate_color_maps_table_view(data):
    """calculates the color maps for the table view"""
    for entry in data:
        # it is _not_ nice that we need to test for the length of these elements;
        # it should be dealt with at data-loader level...
        if len(entry["root_seg_text"]) > 0 and len(entry["par_segment"]) > 0:
            join_element_root = ""
            join_element_par = ""
            if entry["src_lang"] == "tib":
                join_element_root = " "
            if entry["tgt_lang"] == "tib":
                join_element_par = " "

            root_fulltext = join_element_root.join(entry["root_seg_text"])
            root_colormap = [0] * len(root_fulltext)

            root_end = len(root_fulltext) - (
                len(entry["root_seg_text"][-1]) - entry["root_offset_end"]
            )
            if root_end > len(root_fulltext):
                root_end = len(root_fulltext)
            root_start = entry["root_offset_beg"]
            root_colormap[root_start:root_end] = [1] * (root_end - root_start)
            root_fulltext = create_segmented_text_color_only(
                root_fulltext, root_colormap
            )
            entry["root_fulltext"] = root_fulltext

            par_fulltext = join_element_par.join(entry["par_segment"])
            par_colormap = [0] * len(par_fulltext)
            par_end = len(par_fulltext) - (
                len(entry["par_segment"][-1]) - entry["par_offset_end"]
            )
            if par_end > len(par_fulltext):
                par_end = len(par_fulltext)
            par_start = entry["par_offset_beg"]
            par_colormap[par_start:par_end] = [1] * (par_end - par_start)
            par_fulltext = create_segmented_text_color_only(par_fulltext, par_colormap)
            entry["par_fulltext"] = par_fulltext
            del entry["par_segment"]
            del entry["root_seg_text"]
            del entry["root_offset_beg"]
            del entry["root_offset_end"]
            del entry["par_offset_beg"]
            del entry["par_offset_end"]
            del entry["par_pos_beg"]
    return data


def calculate_color_maps_middle_view(data):
    """same procdeure as table-view but we ommit the inquiry text data"""
    for entry in data:
        print("entry", entry)
        # it is _not_ nice that we need to test for the length of these elements;
        # it should be dealt with at data-loader level...
        if len(entry["par_segtext"]) > 0:
            join_element_par = ""
            if entry["tgt_lang"] == "tib":
                join_element_par = " "
            par_fulltext = join_element_par.join(entry["par_segtext"])
            par_colormap = [0] * len(par_fulltext)
            par_end = len(par_fulltext) - (
                len(entry["par_segtext"][-1]) - entry["par_offset_end"]
            )
            if par_end > len(par_fulltext):
                par_end = len(par_fulltext)
            par_start = entry["par_offset_beg"]
            par_colormap[par_start:par_end] = [1] * (par_end - par_start)
            par_fulltext = create_segmented_text_color_only(par_fulltext, par_colormap)
            entry["par_fulltext"] = par_fulltext
            del entry["par_offset_beg"]
            del entry["par_offset_end"]
    return data
