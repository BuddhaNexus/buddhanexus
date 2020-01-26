"""
Contains façade functions that return data queried from the database
"""

from queries.db_queries import QUERY_FILES_PER_CATEGORY
from .db_connection import get_db


def get_files_per_category_from_db(search_term, language):
    """
    :param category_key: The category ID.
    :return: List of file names
    :rtype: object
    """

    files_per_category = get_db().AQLQuery(
        query=QUERY_FILES_PER_CATEGORY,
        batchSize=100000,
        bindVars={"searchterm": search_term, "language": language},
    )
    return files_per_category.result
