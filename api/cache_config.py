from typing import Dict, Any
from fastapi_cache import FastAPICache
from fastapi_cache.backends.redis import RedisBackend
from fastapi_cache.decorator import cache
from redis import asyncio as aioredis

# Cache expiration times in seconds
# keep in mind that the cache is invalidated every time we restart the server 
CACHE_TIMES = {
    "SHORT": 300,  # 5 minutes
    "MEDIUM": 3600,  # 1 hour
    "LONG": 864000,  # 10 days
}

async def init_cache():
    """Initialize Redis cache"""
    redis = aioredis.from_url(
        "redis://redis:6379", 
        encoding="utf8",
        decode_responses=False
    )
    FastAPICache.init(RedisBackend(redis), prefix="buddhanexus-cache")

def make_cache_key_builder():
    def cache_key_builder(
        func,
        namespace: str = "",
        request: Any = None,
        response: Any = None,
        *args,
        **kwargs,
    ):
        cache_key = f"{namespace}:{func.__module__}:{func.__name__}:"
        if args:
            cache_key += ":".join(str(arg) for arg in args)
        if kwargs:
            cache_key += ":".join(f"{k}={v}" for k, v in sorted(kwargs.items()))
        return cache_key
    return cache_key_builder

def cached_endpoint(expire: int = CACHE_TIMES["MEDIUM"]):
    return cache(
        expire=expire,
        key_builder=make_cache_key_builder()
    )