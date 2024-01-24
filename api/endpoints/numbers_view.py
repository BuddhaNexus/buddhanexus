from fastapi import APIRouter
import re
from ..utils import (
    get_language_from_file_name,
    get_sort_key,
    collect_segment_results,
    get_folio_regex,
    create_cleaned_limit_collection,
)
from .endpoint_utils import execute_query
from ..queries import main_queries, menu_queries
from .models.shared import GeneralInput

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
                    result_dic[segment_nr].append(
                        {
                            "segments": par_segnr,
                            "text_name": table_result["par_full_names"]["text_name"],
                            "link1": table_result["par_full_names"]["link1"],
                            "link2": table_result["par_full_names"]["link2"],
                        }
                    )
                else:
                    result_dic[segment_nr] = [table_result["par_segnr"]]
    result = []
    for segment_nr, value in result_dic.items():
        entry = {"segmentnr": segment_nr, "parallels": value}
        result.append(entry)
    return result


@router.post("/numbers")
async def get_numbers_view(input: GeneralInput):
    """
    Endpoint for numbers view. Input parameters are the same as for table view.
    """

    limitcollection_include = create_cleaned_limit_collection(
        input.limits.category_include + input.limits.file_include
    )
    limitcollection_exclude = create_cleaned_limit_collection(
        input.limits.category_exclude + input.limits.file_exclude
    )

    language = get_language_from_file_name(input.file_name)

    query_result = execute_query(
        main_queries.QUERY_TABLE_VIEW,
        bind_vars={
            "file_name": input.file_name,
            "score": input.score,
            "parlength": input.par_length,
            "sortkey": get_sort_key(input.sort_method),
            "limitcollection_include": limitcollection_include,
            "limitcollection_exclude": limitcollection_exclude,
            "page": input.page,
            "folio": input.folio,
        },
    )
    segments_result, collection_keys = collect_segment_results(
        create_numbers_view_data(
            query_result.result, get_folio_regex(language, input.file_name, input.folio)
        )
    )
    collections = execute_query(
        menu_queries.QUERY_COLLECTION_NAMES,
        bind_vars={
            "collections": collection_keys,
            "language": language,
        },
    ).result

    return {"segments": segments_result, "collections": collections}
