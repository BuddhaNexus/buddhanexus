from fastapi import APIRouter, Query, HTTPException, Depends
from ..db_connection import get_db
from ..utils import (
    get_language_from_filename,
    get_sort_key,
    collect_segment_results,
    create_numbers_view_data,
    get_folio_regex,
    create_cleaned_limit_collection
)
from .endpoint_utils import execute_query
from ..queries import main_queries, menu_queries
from ..models_api import Limits

from typing import List

router = APIRouter()


def create_numbers_view_data(table_results, folio_regex):
    """
    This function converts the table-view output into a format that is usable for the numbers-view.
    """
    result_dic = {}
    for table_result in table_results:
        for segment_nr in table_result["root_segnr"]:
            if re.search(folio_regex, segment_nr):
                if segment_nr in result_dic:
                    par_segnr = table_result["par_segnr"]
                    if len(par_segnr) > 1:
                        par_segnr = [par_segnr[0], par_segnr[-1]]
                    result_dic[segment_nr].append({"segments": par_segnr, 
                                                   "text_name": table_result["par_full_names"]['text_name'],
                                                   "link1": table_result["par_full_names"]['link1'],
                                                   "link2": table_result["par_full_names"]['link2']})
                else:
                    result_dic[segment_nr] = [table_result["par_segnr"]]
    result = []
    for segment_nr, value in result_dic.items():
        entry = {"segmentnr": segment_nr, "parallels": value}
        result.append(entry)
    return result


@router.get("/numbers")
async def get_numbers_view(
    filename: str,
    score: int = 0,
    par_length: int = 0,
    limits: Limits = Depends(),
    page: int = 0,
    sort_method: str = "parallels_sorted_by_src_pos",
    folio: str = "",
):
    """
    Endpoint for numbers view. Input parameters are the same as for table view.
    """

    limitcollection_positive = create_cleaned_limit_collection(limits.collection_positive + limits.file_positive)
    limitcollection_negative = create_cleaned_limit_collection(limits.collection_negative + limits.file_negative)

    language = get_language_from_filename(filename)

    query_result = execute_query(main_queries.QUERY_TABLE_VIEW,                            
            bind_vars={
                "filename": filename,
                "score": score,
                "parlength": par_length,
                "sortkey": get_sort_key(sort_method),
                "limitcollection_positive": limitcollection_positive,
                "limitcollection_negative": limitcollection_negative,
                "page": page,
                "folio": folio,
            }
        )
    segments_result, collection_keys = collect_segment_results(
        create_numbers_view_data(
            query_result.result, get_folio_regex(language, filename, folio)
        )
    )
    collections = execute_query(
        menu_queries.QUERY_COLLECTION_NAMES,
        bind_vars={
            "collections": collection_keys,
            "language": language,
        }).result

    return {
        "collections": collections,
        "segments": segments_result,
    }
