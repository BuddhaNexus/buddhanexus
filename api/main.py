"""
This file contains all FastAPI endpoints for Buddhanexus.
"""

import os

from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from .endpoints import (
    search,
    table_view,
    text_view,
    numbers_view,
    graph_view,
    menu,
    utils,
    links,
    download,
)

API_PREFIX = "/api-db" if os.environ["PROD"] == "1" else "/api-db"

APP = FastAPI(title="BuddhaNexus Backend", version="0.2.1", openapi_prefix=API_PREFIX)

APP.add_middleware(
    CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"]
)

APP.include_router(search.router)
APP.include_router(graph_view.router)
APP.include_router(download.router)
APP.include_router(table_view.router, prefix="/table-view")
APP.include_router(text_view.router, prefix="/text-view")
APP.include_router(numbers_view.router, prefix="/numbers-view")
APP.include_router(links.router, prefix="/links")
APP.include_router(utils.router, prefix="/utils")
APP.include_router(menu.router)


@APP.get("/")
def root() -> object:
    """
    Root API endpoint
    :return: The response (json object)
    """
    return {"message": "Visit /docs to view the documentation"}
