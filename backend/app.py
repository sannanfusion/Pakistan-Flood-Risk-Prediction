"""
Pakistan Flood Risk Prediction — Flask Backend
================================================
Main application entry point.

This server provides:
  - /api/health          → Health check
  - /api/provinces       → Province-level risk data
  - /api/predict         → ML-based flood risk prediction  (Step 6)
  - /api/rainfall/<id>   → Historical rainfall for a region (Step 2-3)
"""

from flask import Flask, jsonify
from flask_cors import CORS
import os

# ---------------------------------------------------------------------------
# App factory
# ---------------------------------------------------------------------------

def create_app():
    app = Flask(__name__)

    # Allow the React dev-server (localhost:5173 / 8080) to call this API
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # ------------------------------------------------------------------
    # Health-check endpoint
    # ------------------------------------------------------------------
    @app.route("/api/health", methods=["GET"])
    def health():
        return jsonify({
            "status": "ok",
            "service": "Pakistan Flood Risk Prediction API",
            "version": "1.0.0",
        })

    # ------------------------------------------------------------------
    # Province summary (static for now — will become dynamic in Step 3)
    # ------------------------------------------------------------------
    @app.route("/api/provinces", methods=["GET"])
    def get_provinces():
        """Return province-level flood risk overview."""
        provinces = [
            {
                "id": "sindh",
                "name": "Sindh",
                "riskLevel": "high",
                "riskScore": 82,
                "rainfall7Day": 145,
                "rainfall30Day": 380,
                "riverDischarge": 18500,
                "riverDischargeThreshold": 15000,
                "population": 47900000,
                "historicalFloods": 8,
                "lastFloodDate": "2022-08-15",
                "alertActive": True,
                "coordinates": {"lat": 26.0, "lng": 68.5},
                "districts": [
                    {"name": "Sukkur",    "riskScore": 91, "riskLevel": "high"},
                    {"name": "Larkana",   "riskScore": 85, "riskLevel": "high"},
                    {"name": "Dadu",      "riskScore": 78, "riskLevel": "high"},
                    {"name": "Hyderabad", "riskScore": 65, "riskLevel": "medium"},
                    {"name": "Thatta",    "riskScore": 72, "riskLevel": "high"},
                ],
            },
            {
                "id": "punjab",
                "name": "Punjab",
                "riskLevel": "high",
                "riskScore": 76,
                "rainfall7Day": 120,
                "rainfall30Day": 310,
                "riverDischarge": 16200,
                "riverDischargeThreshold": 14000,
                "population": 110000000,
                "historicalFloods": 7,
                "lastFloodDate": "2023-07-20",
                "alertActive": True,
                "coordinates": {"lat": 31.0, "lng": 72.5},
                "districts": [
                    {"name": "Muzaffargarh", "riskScore": 88, "riskLevel": "high"},
                    {"name": "Rajanpur",     "riskScore": 84, "riskLevel": "high"},
                    {"name": "D.G. Khan",    "riskScore": 79, "riskLevel": "high"},
                    {"name": "Lahore",       "riskScore": 45, "riskLevel": "medium"},
                    {"name": "Multan",       "riskScore": 62, "riskLevel": "medium"},
                ],
            },
            {
                "id": "kpk",
                "name": "Khyber Pakhtunkhwa",
                "riskLevel": "medium",
                "riskScore": 58,
                "rainfall7Day": 95,
                "rainfall30Day": 240,
                "riverDischarge": 9800,
                "riverDischargeThreshold": 12000,
                "population": 35500000,
                "historicalFloods": 6,
                "lastFloodDate": "2022-08-28",
                "alertActive": False,
                "coordinates": {"lat": 34.5, "lng": 71.5},
                "districts": [
                    {"name": "Swat",      "riskScore": 72, "riskLevel": "high"},
                    {"name": "Nowshera",   "riskScore": 65, "riskLevel": "medium"},
                    {"name": "Charsadda",  "riskScore": 60, "riskLevel": "medium"},
                    {"name": "Peshawar",   "riskScore": 42, "riskLevel": "medium"},
                ],
            },
            {
                "id": "balochistan",
                "name": "Balochistan",
                "riskLevel": "medium",
                "riskScore": 52,
                "rainfall7Day": 68,
                "rainfall30Day": 180,
                "riverDischarge": 4200,
                "riverDischargeThreshold": 6000,
                "population": 12300000,
                "historicalFloods": 5,
                "lastFloodDate": "2022-07-10",
                "alertActive": False,
                "coordinates": {"lat": 28.5, "lng": 65.0},
                "districts": [
                    {"name": "Lasbela",    "riskScore": 68, "riskLevel": "medium"},
                    {"name": "Jaffarabad", "riskScore": 63, "riskLevel": "medium"},
                    {"name": "Nasirabad",  "riskScore": 55, "riskLevel": "medium"},
                    {"name": "Quetta",     "riskScore": 30, "riskLevel": "low"},
                ],
            },
            {
                "id": "gb",
                "name": "Gilgit-Baltistan",
                "riskLevel": "low",
                "riskScore": 35,
                "rainfall7Day": 42,
                "rainfall30Day": 120,
                "riverDischarge": 3100,
                "riverDischargeThreshold": 5000,
                "population": 1800000,
                "historicalFloods": 3,
                "lastFloodDate": "2021-06-15",
                "alertActive": False,
                "coordinates": {"lat": 35.8, "lng": 75.0},
                "districts": [
                    {"name": "Gilgit", "riskScore": 38, "riskLevel": "low"},
                    {"name": "Skardu", "riskScore": 32, "riskLevel": "low"},
                    {"name": "Hunza",  "riskScore": 28, "riskLevel": "low"},
                ],
            },
            {
                "id": "ajk",
                "name": "Azad Kashmir",
                "riskLevel": "medium",
                "riskScore": 48,
                "rainfall7Day": 78,
                "rainfall30Day": 195,
                "riverDischarge": 5400,
                "riverDischargeThreshold": 7000,
                "population": 4000000,
                "historicalFloods": 4,
                "lastFloodDate": "2022-08-05",
                "alertActive": False,
                "coordinates": {"lat": 33.9, "lng": 73.8},
                "districts": [
                    {"name": "Muzaffarabad", "riskScore": 55, "riskLevel": "medium"},
                    {"name": "Neelum",       "riskScore": 48, "riskLevel": "medium"},
                    {"name": "Mirpur",       "riskScore": 38, "riskLevel": "low"},
                ],
            },
        ]

        return jsonify({"provinces": provinces})

    return app


# ---------------------------------------------------------------------------
# Run the server
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    app = create_app()
    port = int(os.environ.get("PORT", 5000))
    print(f"\n  🌊  Flood Risk API running at http://localhost:{port}")
    print(f"  📡  Health check:  http://localhost:{port}/api/health")
    print(f"  🗺️   Provinces:    http://localhost:{port}/api/provinces\n")
    app.run(debug=True, host="0.0.0.0", port=port)
