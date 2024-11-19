import pytest
import logging
from tests.config.test_data import LANGUAGES
from fastapi.testclient import TestClient
from api.endpoints.menu import router
from fastapi import FastAPI
# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@pytest.fixture
def app():
    app = FastAPI()
    app.include_router(router)
    return app

@pytest.fixture
def client(app):
    return TestClient(app)

def test_menu_data(client):
    # Test for each supported language
    for language in LANGUAGES:
        response = client.get(f"/menudata/?language={language}")
        
        # Check status code and response structure
        assert response.status_code == 200
        data = response.json()
        assert "menudata" in data
        
        # Verify menudata is a non-empty list
        menudata = data["menudata"]
        assert isinstance(menudata, list)
        assert len(menudata) > 0
        
        # Check collection structure
        for collection in menudata:
            assert "collection" in collection
            assert "categories" in collection
            assert isinstance(collection["categories"], list)
            assert len(collection["categories"]) > 0
            
            # Check category structure and files
            for category in collection["categories"]:
                assert "category" in category
                assert "categorydisplayname" in category
                assert "categorysearch_field" in category
                assert "files" in category
                
                # Verify each category has at least 2 files
                files = category["files"]
                assert isinstance(files, list)
                assert len(files) >= 1
                
                # Check file structure
                for file in files:
                    assert "displayName" in file
                    assert "filename" in file
                    assert "search_field" in file

