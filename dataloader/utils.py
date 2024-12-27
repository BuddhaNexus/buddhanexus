"""
Utilities for interacting with the database and other tasks
"""

from arango import ArangoClient
from arango.database import StandardDatabase
from arango.response import Response
from arango.http import HTTPClient
from requests.adapters import HTTPAdapter
from requests import Session
from requests.packages.urllib3.util.retry import Retry
import logging

from dataloader_constants import (
    DB_NAME,
    ARANGO_USER,
    ARANGO_PASSWORD,
    ARANGO_HOST,
)


class BuddhanexusHTTPClient(HTTPClient):
    """Custom HTTP client for Buddhanexus with retry strategy. We need this because the newer ArangoDB versions are more strict about the default timeout settigns and the only way to solve it is by reimplementing the HTTPClient."""

    def __init__(self):
        self._logger = logging.getLogger('buddhanexus_logger')

    def create_session(self, host):
        session = Session()
        
        # Enable retries
        retry_strategy = Retry(
            total=3,
            backoff_factor=1,
            status_forcelist=[429, 500, 502, 503, 504],
            allowed_methods=["HEAD", "GET", "OPTIONS"]
        )
        http_adapter = HTTPAdapter(max_retries=retry_strategy)
        session.mount('https://', http_adapter)
        session.mount('http://', http_adapter)
        
        return session

    def send_request(self, session, method, url, params=None, data=None, headers=None, auth=None):
        self._logger.debug(f'Sending request to {url}')
        
        response = session.request(
            method=method,
            url=url,
            params=params,
            data=data,
            headers=headers,
            auth=auth,
            timeout=6000  # 6000 seconds timeout
        )
        self._logger.debug(f'Got {response.status_code}')
        
        return Response(
            method=response.request.method,
            url=response.url,
            headers=response.headers,
            status_code=response.status_code,
            status_text=response.reason,
            raw_body=response.text
        )


def get_arango_client() -> ArangoClient:
    """Get Arango Client instance with custom HTTP client"""
    return ArangoClient(
        hosts=ARANGO_HOST,
        http_client=BuddhanexusHTTPClient()
    )


def get_system_database() -> StandardDatabase:
    """Return system database instance"""
    client = get_arango_client()
    return client.db("_system", username=ARANGO_USER, password=ARANGO_PASSWORD)


def get_database() -> StandardDatabase:
    """Return buddhanexus database instance"""
    client = get_arango_client()
    return client.db(DB_NAME, username=ARANGO_USER, password=ARANGO_PASSWORD)


def sliding_window(data_list, window_size=3):
    """Generates sliding windows from a list."""
    return [
        data_list[i : i + window_size] for i in range(len(data_list) - window_size + 1)
    ]


def should_download_file(filename: str) -> bool:
    """
    Limit source file set size to speed up loading process
    Can be controlled with the `LIMIT` environment variable.
    """
    #if "T06" in filename:
    return True
    


def check_if_collection_exists(db, collection_name):
    collections = db.collections()
    for collection in collections:
        if collection["name"] == collection_name:
            return True


def check_if_view_exists(db, view_name):
    views = db.views()
    for view in views:
        if view["name"] == view_name:
            return True
