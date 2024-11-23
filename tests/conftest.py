import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from api.endpoints.text_view import router
from api.db_connection import get_db

@pytest.fixture(scope="session")
def app():
    app = FastAPI()
    app.include_router(router)
    return app

@pytest.fixture(scope="session")
def client(app):
    return TestClient(app)

@pytest.fixture(scope="session")
def db():
    """Get ArangoDB connection for tests"""
    return get_db()

@pytest.fixture(autouse=True)
async def setup_test_db(db):
    """Setup test database before each test"""
    # Add any setup code here
    yield
    # Add any cleanup code here