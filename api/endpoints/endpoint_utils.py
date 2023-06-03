from fastapi import HTTPException

from pyArango.theExceptions import DocumentNotFoundError, AQLQueryError
from ..db_connection import get_db

def execute_query(query, bind_vars=None, batch_size=100000, raw_results=False):    
    """
    Execute a database query and handle exceptions
    """
    try:
        db_query_result = get_db().AQLQuery(
            query=query, batchSize=batch_size, bindVars=bind_vars or {},
            rawResults=raw_results
        )        
        return db_query_result
    except DocumentNotFoundError as error:
        print(error)
        raise HTTPException(status_code=404, detail="Item not found") from error
    except AQLQueryError as error:
        print("AQLQueryError: ", error)
        raise HTTPException(status_code=400, detail=error.errors) from error
    except KeyError as error:
        print("KeyError: ", error)
        raise HTTPException(status_code=400) from error