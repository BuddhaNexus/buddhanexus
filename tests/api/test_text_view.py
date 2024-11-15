import pytest
import logging
from fastapi.testclient import TestClient
from api.endpoints.text_view import router
from fastapi import FastAPI
from tests.config.test_data import FILENAMES

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

def create_request_payload(filename: str) -> dict:
    """Create a standard request payload for testing."""
    return {
        "filename": filename,
        "folio": "",
        "active_segment": "none",
        "filters": {
            "par_length": 0,
            "score": 0,
            "languages": ["all"],
            "include_files": [],
            "exclude_files": [],
            "include_categories": [],
            "exclude_categories": [],
            "include_collections": []
        },
        "page": 0
    }

def validate_response_structure(data: dict):
    """Validate the structure of the response."""
    assert "page" in data
    assert "total_pages" in data
    assert "items" in data
    assert isinstance(data["items"], list)
    assert len(data["items"]) > 1  # Ensure we have multiple items
    
    # Add check for total matches
    total_matches = sum(
        len(segment["matches"]) 
        for item in data["items"] 
        for segment in item["segtext"]
    )
    assert total_matches > 0, "No matches found in the response"
    
    first_item = data["items"][0]
    assert "segnr" in first_item
    assert "segtext" in first_item
    assert isinstance(first_item["segtext"], list)
    
    first_segtext = first_item["segtext"][0]
    assert "text" in first_segtext
    assert "highlightColor" in first_segtext
    assert "matches" in first_segtext

@pytest.mark.parametrize("filename", FILENAMES)
def test_get_file_text_segments_and_parallels(client, filename):
    """Test the text-parallels endpoint with different filenames."""
    logger.info(f"Testing text-parallels endpoint with filename: {filename}")
    
    try:
        response = client.post(
            "/text-parallels/", 
            json=create_request_payload(filename)
        )
        assert response.status_code == 200
        validate_response_structure(response.json())
        
        logger.info(f"✅ Test passed for filename: {filename}")
        
    except Exception as e:
        logger.error(f"❌ Test failed for filename: {filename}")
        logger.error(f"Error: {str(e)}")
        raise