import pytest
import logging
from fastapi.testclient import TestClient
from api.endpoints.table_view import router
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
        "sort_method": "position",
        "page": 0
    }

def validate_response_structure(data: list):
    """Validate the structure of the table view response."""
    assert isinstance(data, list), "Response should be a list"
    assert len(data) > 0, "Response should not be empty"
    
    first_item = data[0]
    # Check required fields based on the table view models
    assert "par_segnr_range" in first_item
    assert "par_full_names" in first_item
    assert "root_full_names" in first_item
    assert "root_segnr_range" in first_item
    assert "par_length" in first_item
    assert "root_length" in first_item
    assert "score" in first_item
    assert "src_lang" in first_item
    assert "tgt_lang" in first_item
    assert "root_fulltext" in first_item
    assert "par_fulltext" in first_item
    
    # Validate text segments
    assert isinstance(first_item["root_fulltext"], list)
    assert isinstance(first_item["par_fulltext"], list)
    
    # Check text segment structure
    if len(first_item["root_fulltext"]) > 0:
        first_text = first_item["root_fulltext"][0]
        assert "text" in first_text
        assert "highlightColor" in first_text

@pytest.mark.parametrize("filename", FILENAMES)
def test_get_table_view(client, filename):
    """Test the table view endpoint with different filenames."""
    logger.info(f"Testing table view endpoint with filename: {filename}")
    
    try:
        response = client.post(
            "/table/", 
            json=create_request_payload(filename)
        )
        assert response.status_code == 200
        validate_response_structure(response.json())
        
        logger.info(f"✅ Test passed for filename: {filename}")
        
    except Exception as e:
        logger.error(f"❌ Test failed for filename: {filename}")
        logger.error(f"Error: {str(e)}")
        raise

def test_invalid_request(client):
    """Test the table view endpoint with invalid request data."""
    invalid_payload = {
        "filename": "nonexistent_file",
        "filters": {
            "score": -1,  # Invalid score
            "par_length": -1,  # Invalid length
            "languages": ["invalid_language"]
        }
    }
    
    response = client.post("/table/", json=invalid_payload)
    assert response.status_code == 422  # Validation error