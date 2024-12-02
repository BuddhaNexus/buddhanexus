import json
import logging
from functools import wraps
from typing import Any

from fastapi_cache.coder import JsonCoder
from redis import asyncio as aioredis

from .endpoints.models.menu_models import MenudataOutput

logger = logging.getLogger(__name__)

# Cache expiration times in seconds
CACHE_TIMES = {
    "SHORT": 300,  # 5 minutes
    "MEDIUM": 3600,  # 1 hour
    "LONG": 864000,  # 10 days
}


class CustomJsonCoder(JsonCoder):
    """Custom JSON encoder/decoder that handles MenudataOutput objects and Redis interactions."""

    @staticmethod
    def decode(value: bytes) -> Any:
        logger.info("Starting decode of value type: %s", type(value))
        try:
            if isinstance(value, bytes):
                decoded_str = value.decode('utf-8')
            elif isinstance(value, str):
                decoded_str = value
            else:
                raise ValueError(f"Unsupported type: {type(value)}")

            decoded = json.loads(decoded_str)
            logger.info("Successfully decoded to type: %s", type(decoded))

            if isinstance(decoded, dict) and "menudata" in decoded:
                logger.info("Converting dict to MenudataOutput")
                return MenudataOutput(**decoded)

            logger.warning("Unexpected data format: %s", type(decoded))
            return decoded

        except Exception as e:
            logger.error("Decode error: %s", str(e), exc_info=True)
            raise

    @staticmethod
    def encode(value: Any) -> bytes:
        logger.info("Starting encode of type: %s", type(value))
        try:
            if isinstance(value, MenudataOutput):
                value = value.dict()
            json_str = json.dumps(value)
            return json_str.encode('utf-8')
        except Exception as e:
            logger.error("Encode error: %s", str(e), exc_info=True)
            raise


def make_cache_key_builder():
    """Creates a function that builds consistent cache keys for Redis storage."""
    def cache_key_builder(
        func,
        namespace: str = "",
        **kwargs,
    ) -> str:
        logger.info("Building cache key...")

        # Remove the prefix from namespace if it exists
        namespace = namespace.replace("buddhanexus-cache:", "")

        components = [
            "buddhanexus-cache",
            namespace,
            (
                func.__module__
                if not isinstance(func, dict)
                else func.get("module", "unknown")
            ),
            (
                func.__name__
                if not isinstance(func, dict)
                else func.get("name", "unknown")
            ),
        ]

        # Simplify kwargs handling
        if kwargs:
            actual_kwargs = kwargs.get("kwargs", kwargs)
            for k, v in sorted(actual_kwargs.items()):
                components.append(f"{k}={v}")

        cache_key = ":".join(str(component) for component in components)
        logger.info("Cache key being used: %s", cache_key)

        return cache_key

    return cache_key_builder


def cached_endpoint(expire: int = CACHE_TIMES["MEDIUM"]):
    """
    Decorator that implements Redis-based caching for API endpoints.
    Ignores client cache settings.
    
    Args:
        expire: Cache expiration time in seconds
    """
    def wrapper(func):
        @wraps(func)
        async def debug_wrapper(*args, **kwargs):
            key_builder = make_cache_key_builder()
            # Remove any cache-related query params from kwargs
            if 'kwargs' in kwargs:
                kwargs['kwargs'] = {
                    k: v for k, v in kwargs['kwargs'].items() 
                    if not k.lower().startswith('cache-')
                }
            
            cache_key = key_builder(func, namespace="api", kwargs=kwargs)
            logger.info("Attempting to retrieve from cache: %s", cache_key)

            try:
                redis = await aioredis.from_url(
                    "redis://redis:6379", encoding="utf8", decode_responses=True
                )

                exists = await redis.exists(cache_key)
                if exists:
                    cached_value = await redis.get(cache_key)
                    if cached_value:
                        try:
                            return CustomJsonCoder.decode(cached_value)
                        except ValueError as e:
                            logger.error("Failed to decode cached value: %s", str(e))

                result = await func(*args, **kwargs)
                try:
                    encoded = CustomJsonCoder.encode(result)
                    await redis.set(cache_key, encoded, ex=expire)
                except ValueError as e:
                    logger.error("Failed to store in cache: %s", str(e))

                return result

            except ConnectionError as e:
                logger.error("Cache operation failed: %s", str(e))
                return await func(*args, **kwargs)

        return debug_wrapper
    return wrapper
