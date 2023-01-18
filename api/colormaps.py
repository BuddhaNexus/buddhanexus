import time 

def calculate_color_maps_text_view(data):
    time_before = time.time()
    textleft = data['textleft']
    parallel_ids = data['parallel_ids']
    parallels = data['parallels']

    parallels_dict = {}    
    for id, parallel in zip(parallel_ids, parallels):
        parallels_dict[id] = parallel
    
    for entry in textleft:
        # initialize with zeros 
        current_colormap = [0] * len(entry['segtext'])
        
        # now add the color layer 
        for id in entry['parallel_ids']:
            if id in parallels_dict:
                current_parallel = parallels_dict[id]
                start = 0 
                end = len(current_colormap)                
                if current_parallel['root_segnr'][0] == entry['segnr']:
                    start = current_parallel['root_offset_beg']
                if current_parallel['root_segnr'][-1] == entry['segnr']:
                    end = current_parallel['root_offset_end']
                current_colormap[start:end] = [v+1 for v in current_colormap[start:end]]
            else:
                print("Warning: parallel id", id, "not found in parallels_dict")
        entry['color_map'] = current_colormap
        del(entry['parallel_ids'])
    time_after = time.time()
    print("Time to calculate color maps: ", time_after - time_before)
    return textleft

def calculate_color_maps_table_view(data):

    for entry in data:
        join_element_root = ""
        join_element_par = ""
        if entry['src_lang'] == "tib":
            join_element_root = " "
        if entry['tgt_lang'] == "tib":
            join_element_par = " "
        root_fulltext = join_element_root.join(entry['root_seg_text'])
        root_colormap = [0] * len(root_fulltext)
        root_end = len(root_fulltext) - (len(entry['root_seg_text'][-1]) - entry['root_offset_end']) 
        if root_end > len(root_fulltext):
            root_end = len(root_fulltext)
        root_start = entry['root_offset_beg']
        root_colormap[root_start:root_end] = [1] * (root_end - root_start)
        entry['root_color_map'] = root_colormap
        entry['root_fulltext'] = root_fulltext

        par_fulltext = join_element_par.join(entry['par_segment'])
        par_colormap = [0] * len(par_fulltext)


        par_end = len(par_fulltext) - (len(entry['par_segment'][-1]) - entry['par_offset_end'])
        if par_end > len(par_fulltext):
            par_end = len(par_fulltext)
        par_start = entry['par_offset_beg']
        par_colormap[par_start:par_end] = [1] * (par_end - par_start)
        print(entry)
        print("LEN PAR FULLTEXT", len(par_fulltext))
        print("LEN PAR COLORMAP", len(par_colormap))
        print("PAR END", par_end)
        entry['par_color_map'] = par_colormap
        entry['par_fulltext'] = par_fulltext


        print("PAR FULLTEXT", entry['par_fulltext'])
        par_test_string = ""
        for c in range(len(par_colormap)):
            if par_colormap[c] == 1:
                par_test_string += par_fulltext[c]
        print("PAR TEST STRING", par_test_string)
        
        root_test_string = ""
        for c in range(len(root_colormap)):
            if root_colormap[c] == 1:
                root_test_string += root_fulltext[c]
        print("ROOT TEST STRING", root_test_string)
        print("ROOT FULLTEXT", entry['root_fulltext'], "\n\n")
        del(entry['par_segment'])
        del(entry['root_seg_text'])
        del(entry['root_offset_beg'])
        del(entry['root_offset_end'])
        del(entry['par_offset_beg'])
        del(entry['par_offset_end'])
    return data


