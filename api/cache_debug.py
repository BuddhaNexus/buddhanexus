from functools import wraps
import logging

logger = logging.getLogger(__name__)

def debug_cache(func):
    @wraps(func)
    async def wrapper(*args, **kwargs):
        logger.info(f"Cache debug - Function: {func.__name__}")
        logger.info(f"Cache debug - Args: {args}")
        logger.info(f"Cache debug - Kwargs: {kwargs}")
        result = await func(*args, **kwargs)
        logger.info(f"Cache debug - Result type: {type(result)}")
        return result
    return wrapper