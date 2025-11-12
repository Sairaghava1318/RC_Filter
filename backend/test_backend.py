import requests
import json

BASE_URL = "http://localhost:8000"

# Test health endpoint
print("Testing health endpoint...")
try:
    response = requests.get(f"{BASE_URL}/health")
    print(f"✓ Health check: {response.json()}")
except Exception as e:
    print(f"✗ Health check failed: {e}")

# Test single gain calculation
print("\nTesting /api/rc-gain endpoint...")
try:
    response = requests.post(f"{BASE_URL}/api/rc-gain", json={
        "frequency": 1000,
        "filter_type": "low-pass"
    })
    print(f"✓ Single gain calculation: {json.dumps(response.json(), indent=2)}")
except Exception as e:
    print(f"✗ Gain calculation failed: {e}")

# Test frequency sweep
print("\nTesting /api/sweep endpoint...")
try:
    response = requests.post(f"{BASE_URL}/api/sweep", json={
        "frequency": 1000,
        "filter_type": "low-pass"
    })
    data = response.json()
    print(f"✓ Frequency sweep generated {len(data['frequencies'])} points")
    print(f"  Frequencies: {data['frequencies'][:3]}... (first 3)")
    print(f"  Gains (dB): {data['gains_db'][:3]}... (first 3)")
except Exception as e:
    print(f"✗ Frequency sweep failed: {e}")

print("\n✅ All backend tests completed!")
