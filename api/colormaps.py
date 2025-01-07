"""
This file holds the functions for creating the colormaps.
"""

from .utils import shorten_segment_names, prettify_score


def create_segmented_text(text, colormap, matchmap, active_map):
    """Create segmented text based on the given colormap and matchmap."""

    def filter_and_sort(matches):
        """Filter out None values and sort the matches."""
        return sorted([x for x in matches if x is not None])

    result_segments = []
    current_segment = ""
    last_matches = filter_and_sort(matchmap[0])
    last_color = colormap[0]
    last_active_match = active_map[0]
    for i, char in enumerate(text):
        current_color = colormap[i]
        current_matches = filter_and_sort(matchmap[i])
        current_active_match = active_map[i]
        if current_matches != last_matches:
            result_segments.append(
                {
                    "text": current_segment,
                    "highlightColor": last_color,
                    "matches": last_matches,
                    "is_active_match": last_active_match,
                }
            )
            current_segment = ""

        current_segment += char
        last_matches = current_matches
        last_color = current_color
        last_active_match = current_active_match
    # Add the last segment
    result_segments.append(
        {
            "text": current_segment,
            "highlightColor": last_color,
            "matches": last_matches,
            "is_active_match": last_active_match,
        }
    )
    return result_segments


def create_segmented_text_color_only(text, colormap):
    """create segmented text color"""
    result_segments = []
    current_segment = ""
    last_color = colormap[0]
    for i, _ in enumerate(text):
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


def abbreviate(text):
    """Abbreviates long matches with an ellipsis"""
    newtext = ""
    if len(text) > 300:
        newtext = text[:50] + " … " + text[-50:]
    else:
        newtext = text
    return newtext


def calculate_color_maps_text_view(data, active_match=None):
    """calculates the color maps for the text view"""
    textleft = data["textleft"]
    parallels_dict = dict(zip(data["parallel_ids"], data["parallels"]))
    active_flag = False
    for entry in textleft:
        # initialize with zeros
        segtext_len = len(entry["segtext"])
        current_colormap = [0] * segtext_len
        current_active_map = [False] * segtext_len
        current_matchmap = [[] for _ in range(segtext_len)]
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
                if parallel_id not in current_matchmap[item]:
                    current_matchmap[item].append(parallel_id)
        # when an active match is present, we need to highlight the corresponding segment,
        # since we cannot be 100% sure that the right match is present in the database.
        if active_match:
            start = 0
            end = segtext_len
            if active_match["par_segnr"][0] == entry["segnr"]:
                start = active_match["par_offset_beg"]
                active_flag = True
            if active_match["par_segnr"][-1] == entry["segnr"]:
                end = active_match["par_offset_end"]
            end = min(end, segtext_len)
            if active_flag:
                for item in range(start, end):
                    current_colormap[item] += 1
                    current_active_map[item] = True
                if active_match["par_segnr"][-1] == entry["segnr"]:
                    active_flag = False
        entry["segtext"] = create_segmented_text(
            entry["segtext"], current_colormap, current_matchmap, current_active_map
        )

    for entry in textleft:
        del entry["parallel_ids"]

    return textleft


def calculate_color_maps_table_view(data):
    """calculates the color maps for the table view"""

    for entry in data:
        join_element_root = ""
        join_element_par = ""
        if not entry["src_lang"] == "zh":
            join_element_root = " "
        if not entry["tgt_lang"] == "zh":
            join_element_par = " "

        root_fulltext = join_element_root.join(entry["root_seg_text"])
        root_colormap = [0] * len(root_fulltext)

        root_end = len(root_fulltext) - (
            len(entry["root_seg_text"][-1]) - entry["root_offset_end"]
        )
        root_end = min(root_end, len(root_fulltext))
        root_start = entry["root_offset_beg"]
        root_colormap[root_start:root_end] = [1] * (root_end - root_start)
        root_fulltext = create_segmented_text_color_only(root_fulltext, root_colormap)
        entry["root_fulltext"] = root_fulltext

        par_fulltext = join_element_par.join(entry["par_segment"])
        par_colormap = [0] * len(par_fulltext)
        par_end = len(par_fulltext) - (
            len(entry["par_segment"][-1]) - entry["par_offset_end"]
        )
        par_end = min(par_end, len(par_fulltext))
        par_start = entry["par_offset_beg"]
        par_colormap[par_start:par_end] = [1] * (par_end - par_start)
        par_fulltext = create_segmented_text_color_only(par_fulltext, par_colormap)
        entry["par_fulltext"] = par_fulltext
        entry["par_segnr_range"] = shorten_segment_names(entry["par_segnr"])
        entry["root_segnr_range"] = shorten_segment_names(entry["root_segnr"])
        entry["score"] = prettify_score(entry["score"])
        del entry["par_segment"]
        del entry["root_seg_text"]
        del entry["root_offset_beg"]
        del entry["root_offset_end"]
        del entry["par_offset_beg"]
        del entry["par_offset_end"]
        del entry["par_pos_beg"]
        del entry["par_segnr"]
        del entry["root_segnr"]

    return data


def calculate_color_maps_middle_view(data):
    """same procdeure as table-view but we ommit the inquiry text data"""
    for entry in data:
        # it is _not_ nice that we need to test for the length of these elements;
        # it should be dealt with at data-loader level...
        if len(entry["par_segtext"]) > 0:
            join_element_par = ""
            if not entry["tgt_lang"] == "zh":
                join_element_par = " "
            par_fulltext = join_element_par.join(entry["par_segtext"])
            par_colormap = [0] * len(par_fulltext)
            par_end = len(par_fulltext) - (
                len(entry["par_segtext"][-1]) - entry["par_offset_end"]
            )
            par_end = min(par_end, len(par_fulltext))
            par_start = entry["par_offset_beg"]
            par_colormap[par_start:par_end] = [1] * (par_end - par_start)
            par_fulltext = create_segmented_text_color_only(par_fulltext, par_colormap)
            entry["par_fulltext"] = par_fulltext
            entry["score"] = prettify_score(entry["score"])
            entry["par_segnr_range"] = shorten_segment_names(entry["par_segnr"])
            entry["par_segnr"] = entry["par_segnr"][0]
            del entry["par_offset_beg"]
            del entry["par_offset_end"]
        else:
            print(entry)
    return data


def calculate_color_maps_search(data):
    """takes the search results and calculates the color maps for the search"""
    for entry in data:
        text = entry["original"]
        colormap = [0] * len(text)
        beg = entry["offset_beg"]
        end = entry["offset_end"]
        colormap[beg:end] = [1] * (end - beg)
        entry["segtext"] = create_segmented_text_color_only(text, colormap)
        del entry["offset_beg"]
        del entry["offset_end"]
        del entry["original"]
        del entry["stemmed"]
        del entry["centeredness"]
        del entry["distance"]
    return data
