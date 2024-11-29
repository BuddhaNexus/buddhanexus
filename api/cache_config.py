from typing import Dict, Any
from fastapi_cache import FastAPICache
from fastapi_cache.backends.redis import RedisBackend
from fastapi_cache.decorator import cache
from fastapi_cache.coder import JsonCoder
from redis import asyncio as aioredis
import logging
from .endpoints.models.menu_models import MenudataOutput
from functools import wraps
import json

logger = logging.getLogger(__name__)

# Cache expiration times in seconds
CACHE_TIMES = {
    "SHORT": 300,  # 5 minutes
    "MEDIUM": 3600,  # 1 hour
    "LONG": 864000,  # 10 days
}

class CustomJsonCoder(JsonCoder):
    def decode(self, value: Any) -> Any:
        logger.info(f"Starting decode of value type: {type(value)}")
        try:
            # If we got a string (due to decode_responses=True), parse it directly
            if isinstance(value, str):
                decoded = json.loads(value)
            else:
                decoded = super().decode(value)
                
            logger.info(f"Successfully decoded to type: {type(decoded)}")
            
            if isinstance(decoded, dict) and 'menudata' in decoded:
                logger.info("Converting dict to MenudataOutput")
                return MenudataOutput(**decoded)
            
            logger.warning(f"Unexpected data format: {type(decoded)}")
            return decoded
            
        except Exception as e:
            logger.error(f"Decode error: {str(e)}", exc_info=True)
            raise

    def encode(self, value: Any) -> str:  # Changed return type to str
        logger.info(f"Starting encode of type: {type(value)}")
        try:
            if isinstance(value, MenudataOutput):
                value = value.dict()
            
            # Return string directly since Redis is configured for decoded responses
            return json.dumps(value)
        except Exception as e:
            logger.error(f"Encode error: {str(e)}", exc_info=True)
            raise

def make_cache_key_builder():
    def cache_key_builder(
        func,
        namespace: str = "",
        request: Any = None,
        response: Any = None,
        *args,
        **kwargs,
    ) -> str:
        logger.info("Building cache key...")
        
        # Remove the prefix from namespace if it exists
        namespace = namespace.replace("buddhanexus-cache:", "")
        
        components = [
            "buddhanexus-cache",  # Only add prefix once
            namespace,
            func.__module__ if not isinstance(func, dict) else func.get("module", "unknown"),
            func.__name__ if not isinstance(func, dict) else func.get("name", "unknown")
        ]
        
        # Simplify kwargs handling
        if kwargs:
            actual_kwargs = kwargs.get('kwargs', kwargs)
            for k, v in sorted(actual_kwargs.items()):
                components.append(f"{k}={v}")
        
        # Join components and log the key
        cache_key = ":".join(str(component) for component in components)
        logger.info(f"Cache key being used: {cache_key}")
        
        return cache_key

    return cache_key_builder

def cached_endpoint(expire: int = CACHE_TIMES["MEDIUM"]):
    def wrapper(func):
        @wraps(func)
        async def debug_wrapper(*args, **kwargs):
            # Generate cache key
            key_builder = make_cache_key_builder()
            cache_key = key_builder(func, namespace="api", kwargs=kwargs)
            logger.info(f"Attempting to retrieve from cache: {cache_key}")
            
            try:
                # Connect to Redis
                redis = await aioredis.from_url(
                    "redis://redis:6379",
                    encoding="utf8",
                    decode_responses=True
                )
                
                # Check if key exists
                exists = await redis.exists(cache_key)
                logger.info(f"Cache key exists: {exists}")
                
                if exists:
                    # Get cached value
                    cached_value = await redis.get(cache_key)
                    logger.info(f"Retrieved cached value of length: {len(cached_value) if cached_value else 0}")
                    
                    if cached_value:
                        try:
                            # Attempt to decode
                            decoded = CustomJsonCoder().decode(cached_value)
                            logger.info(f"Successfully decoded cached value of type: {type(decoded)}")
                            return decoded
                        except Exception as e:
                            logger.error(f"Failed to decode cached value: {str(e)}")
                    else:
                        logger.warning("Cache key exists but value is None")
                
                # If we get here, either no cache or failed to decode
                logger.info("Cache miss - calling original function")
                result = await func(*args, **kwargs)
                
                # Store in cache
                try:
                    encoded = CustomJsonCoder().encode(result)
                    await redis.set(cache_key, encoded, ex=expire)
                    logger.info(f"Stored new result in cache with TTL: {expire}")
                except Exception as e:
                    logger.error(f"Failed to store in cache: {str(e)}")
                
                return result
                
            except Exception as e:
                logger.error(f"Cache operation failed: {str(e)}")
                # Fallback to original function
                return await func(*args, **kwargs)
                
        return debug_wrapper
    return wrapper