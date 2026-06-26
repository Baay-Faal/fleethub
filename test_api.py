import urllib.request
import json
import sys

login_data = json.dumps({"email": "admin@fleethub.com", "password": "admin123"}).encode('utf-8')
req = urllib.request.Request("http://127.0.0.1:8000/api/v1/auth/login/", data=login_data, headers={'Content-Type': 'application/json'})
try:
    with urllib.request.urlopen(req) as f:
        token = json.loads(f.read())['access']
except Exception as e:
    print("Login failed:", e)
    sys.exit(1)

veh_data = json.dumps({
    "immatriculation": "TEST-123",
    "marque": "Renault",
    "modele": "Clio",
    "annee": 2024,
    "statut": "DISPONIBLE",
    "type_vehicule": "VOITURE",
    "motorisation": "ESSENCE",
    "date_achat": "2024-01-01",
    "prix_achat": "0.00",
    "vin": "VIN-123",
    "expiration_assurance": "2030-01-01",
    "expiration_controle_technique": "2030-01-01"
}).encode('utf-8')

req2 = urllib.request.Request("http://127.0.0.1:8000/api/v1/vehicules/", data=veh_data, headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {token}'})
try:
    with urllib.request.urlopen(req2) as f:
        print(f.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print("Error:", e.code)
    print(e.read().decode('utf-8'))
