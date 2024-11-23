import pytest
from fastapi.testclient import TestClient
from api.endpoints.graph_view import router
from api.endpoints.models.graph_view_models import GraphInput
from tests.config.test_data import FILENAMES
from fastapi import FastAPI


@pytest.fixture
def app():
    app = FastAPI()
    app.include_router(router)
    return app

@pytest.fixture
def client(app):
    return TestClient(app)

def test_graph_view_success(client: TestClient):
    filename = FILENAMES[0]
    print(f"\nTesting graph view with filename: {filename}")
    test_input = {
        "filename": filename,
        "filters": {
            "score": 30,
            "par_length": 30,
            "include_collections": []
        }
    }

    response = client.post("/graph-view/", json=test_input)
    
    assert response.status_code == 200
    response_data = response.json()
    
    # Assert response data exists and has required fields
    assert response_data is not None
    assert "piegraphdata" in response_data, "Response missing piegraphdata field"
    assert "histogramgraphdata" in response_data, "Response missing histogramgraphdata field"
    
    assert len(response_data["piegraphdata"]) > 0
    assert len(response_data["histogramgraphdata"]) > 0
    
    # Verify the structure of the response
    assert isinstance(response_data["piegraphdata"], list)
    assert isinstance(response_data["histogramgraphdata"], list)
    
    # Verify each item in the lists is properly formatted
    for item in response_data["piegraphdata"]:
        assert len(item) == 2
        assert isinstance(item[0], str)
        assert isinstance(item[1], (str, int))

    for item in response_data["histogramgraphdata"]:
        assert len(item) == 2
        assert isinstance(item[0], str)
        assert isinstance(item[1], (str, int))

def test_graph_view_invalid_input(client: TestClient):
    invalid_filename = "nonexistent.json"
    print(f"\nTesting graph view with invalid filename: {invalid_filename}")
    invalid_input = {
        "filename": invalid_filename,
        "filters": {
            "score": -1,  # Invalid score
            "par_length": 0,  # Invalid length
            "include_collections": None  # Invalid collections
        }
    }
    
    response = client.post("/graph-view/", json=invalid_input)
    assert response.status_code == 422

def test_graph_view_all_filenames(client: TestClient):
    results = {
        'success': [],
        'failed': []
    }
    
    for filename in FILENAMES:
        try:
            test_input = {
                "filename": filename,
                "filters": {
                    "score": 30,
                    "par_length": 30,
                    "include_collections": []
                }
            }

            response = client.post("/graph-view/", json=test_input)
            response_data = response.json()
            
            # Run all assertions
            assert response.status_code == 200, f"Bad status code for {filename}"
            assert response_data is not None, f"Response data is None for {filename}"
            assert "piegraphdata" in response_data, f"Response missing piegraphdata field for {filename}"
            assert "histogramgraphdata" in response_data, f"Response missing histogramgraphdata field for {filename}"
            assert response_data["piegraphdata"] is not None, f"Piegraphdata is None for {filename}"
            assert len(response_data["piegraphdata"]) > 0, f"Empty piegraphdata for {filename}"
            
            if response_data["histogramgraphdata"] is not None:
                assert len(response_data["histogramgraphdata"]) > 0, f"Empty histogramgraphdata for {filename}"
            
            # If we get here, all assertions passed
            results['success'].append(filename)
            
        except Exception as e:
            results['failed'].append({
                'filename': filename,
                'error': str(e)
            })
    
    # Print summary after all tests are complete
    print("\n=== Test Summary ===")
    print(f"\nSuccessful files ({len(results['success'])}):")
    for filename in results['success']:
        print(f"✓ {filename}")
    
    if results['failed']:
        print(f"\nFailed files ({len(results['failed'])}):")
        for failure in results['failed']:
            print(f"✗ {failure['filename']}")
            print(f"  Error: {failure['error']}")
    
    # If any tests failed, raise an assertion error with the summary
    if results['failed']:
        failed_files = [f['filename'] for f in results['failed']]
        raise AssertionError(f"Tests failed for files: {', '.join(failed_files)}")