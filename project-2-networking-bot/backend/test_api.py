import requests
import json

def test_health():
    """Test health endpoint"""
    try:
        response = requests.get("http://localhost:8000/health")
        print(f"Health Status Code: {response.status_code}")
        print(f"Health Response: {response.json()}")
    except Exception as e:
        print(f"Health Error: {e}")

def test_agent():
    """Test agent endpoint"""
    try:
        response = requests.get("http://localhost:8000/test-agent")
        print(f"Agent Test Status Code: {response.status_code}")
        print(f"Agent Test Response: {json.dumps(response.json(), indent=2)}")
    except Exception as e:
        print(f"Agent Test Error: {e}")

def test_outreach_endpoint():
    url = "http://localhost:8000/outreach"
    test_data = {
        "platform": "twitter",
        "interaction_stage": "social_reply",
        "tone": "casual",
        "char_limit": 280,
        "input": "Reply to Alex's thread about cold-start in recommender systems; last tweet asks 'what lightweight tricks have you used?'"
    }
    try:
        response = requests.post(url, json=test_data)
        print(f"Outreach Status Code: {response.status_code}")
        print(f"Outreach Response: {json.dumps(response.json(), indent=2)}")
    except Exception as e:
        print(f"Outreach Error: {e}")

if __name__ == "__main__":
    print("=== Testing API ===")
    test_health()
    print("\n=== Testing Agent ===")
    test_agent()
    print("\n=== Testing Outreach ===")
    test_outreach_endpoint()
