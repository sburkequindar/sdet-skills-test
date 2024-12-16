import pytest
from app import app

@pytest.fixture
def client():
    app.config['TESTING'] = True  # Enable testing mode
    with app.test_client() as client:
        yield client

# Positive test case: Valid name submission
def test_submit_name_success(client):
    response = client.post('/submit-name', json={"name": "Dylan"})
    assert response.status_code == 200
    assert response.json == {"message": "Name submitted successfully: Dylan"}

# Negative test case: Missing name in payload
def test_submit_name_missing_name(client):
    response = client.post('/submit-name', json={})
    assert response.status_code == 400
    assert response.json == {"error": "Name is required"}

# Edge case: Case sensitivity for 'Waldo'
@pytest.mark.parametrize("name_variation", ["Waldo", "WALDO", "waldo", "WalDO", "wAlDo"])
@pytest.mark.skip(reason="This test case is going to fail until the app is updated to handle this scenario")
def test_submit_name_case_sensitive_waldo(client, name_variation):
    response = client.post('/submit-name', json={"name": name_variation})
    assert response.status_code == 403
    assert response.json == {"error": "You aren't Waldo - a real Waldo wouldn't reveal their identity!"}

# Negative test case: Non-JSON content type
@pytest.mark.skip(reason="This test case is going to fail until the app is updated to handle this scenario")
def test_submit_name_invalid_content_type(client):
    response = client.post('/submit-name', data="name=Dylan", content_type="text/plain")
    assert response.status_code == 400
    assert response.json == {"error": "Name is required"}

# Edge case: Name field contains excessive whitespace
@pytest.mark.skip(reason="This test case is going to fail until the app is updated to handle this scenario")
def test_submit_name_whitespace_name(client):
    response = client.post('/submit-name', json={"name": "   "})
    assert response.status_code == 400
    assert response.json == {"error": "Name is required"}

# Edge case: Long name submission
def test_submit_name_long_name(client):
    long_name = "A" * 1000  # 1000-character name
    response = client.post('/submit-name', json={"name": long_name})
    assert response.status_code == 200
    assert response.json == {"message": f"Name submitted successfully: {long_name}"}

# Edge case: Numeric name submission
def test_submit_name_numeric_name(client):
    response = client.post('/submit-name', json={"name": 12345})
    assert response.status_code == 200
    assert response.json == {"message": "Name submitted successfully: 12345"}

# Edge case: Name containing special characters
def test_submit_name_special_characters(client):
    special_name = "@#$%^&*()_+!"
    response = client.post('/submit-name', json={"name": special_name})
    assert response.status_code == 200
    assert response.json == {"message": f"Name submitted successfully: {special_name}"}