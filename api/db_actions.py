from .db_queries import query_files_per_category
from .db_connection import get_db

def get_files_per_category_from_db(search_term):
    files_per_category = get_db().AQLQuery(
        query=query_files_per_category,
        batchSize=100000,
        bindVars={
            "searchterm": search_term,
        },
    )
    return files_per_category.result