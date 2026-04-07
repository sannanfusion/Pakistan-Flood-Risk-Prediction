from flask import Flask, jsonify
from flask_cors import CORS
from datetime import datetime, timedelta
import requests
import pandas as pd

def create_app():
    app = Flask(__name__)
    CORS(app)

    # ==============================
    # ✅ NASA REAL RAINFALL FUNCTION
    # ==============================
    def get_nasa_rainfall(lat, lon):
        try:
            url = f"https://power.larc.nasa.gov/api/temporal/daily/point?parameters=PRECTOTCORR&community=AG&longitude={lon}&latitude={lat}&start=20260101&end=20260107&format=JSON"
            response = requests.get(url)
            data = response.json()

            values = data["properties"]["parameter"]["PRECTOTCORR"].values()
            rainfall_7day = sum(values)

            return round(rainfall_7day, 2)

        except:
            return 70

    # ==============================
    # ✅ PAST RAINFALL (REAL TREND)
    # ==============================
    def get_past_rainfall(lat, lon):
        try:
            url = f"https://power.larc.nasa.gov/api/temporal/daily/point?parameters=PRECTOTCORR&community=AG&longitude={lon}&latitude={lat}&start=20260325&end=20260401&format=JSON"
            res = requests.get(url).json()

            values = list(res["properties"]["parameter"]["PRECTOTCORR"].values())
            return values

        except:
            return [50, 60, 55, 70, 65, 80, 75]

    # ==============================
    # ✅ NDMA LOAD FROM CSV
    # ==============================
    def load_ndma_data():
        try:
            df = pd.read_csv("data/ndma_data.csv")

            ndma_dict = {}
            for _, row in df.iterrows():
                ndma_dict[row["province"]] = {
                    "deaths": row["deaths"],
                    "injured": row["injured"],
                    "houses": row["houses"]
                }

            return ndma_dict

        except:
            return {}

    # ==============================
    # HEALTH CHECK
    # ==============================
    @app.route("/api/health")
    def health():
        return jsonify({"status": "ok"})

    # ==============================
    # MAIN API
    # ==============================
    @app.route("/api/all")
    def get_all():
        try:
            provinces = [
                {"name": "Punjab", "lat": 31.0, "lon": 72.5},
                {"name": "Sindh", "lat": 26.0, "lon": 68.5},
                {"name": "KPK", "lat": 34.5, "lon": 71.5},
                {"name": "Balochistan", "lat": 28.5, "lon": 65.0},
            ]

            ndma_data = load_ndma_data()

            result = []
            alerts = []

            # ==============================
            # ✅ PROVINCE LOOP
            # ==============================
            for p in provinces:
                rainfall = get_nasa_rainfall(p["lat"], p["lon"])

                ndma = ndma_data.get(p["name"], {})
                deaths = ndma.get("deaths", 0)
                houses = ndma.get("houses", 0)

                score = rainfall + (deaths * 0.2) + (houses / 10000)

                # ✅ SIMPLE PREDICTION
                trend = 15
                prediction = rainfall + (trend * 1.2)

                if score > 130:
                    risk = "high"
                elif score > 80:
                    risk = "medium"
                else:
                    risk = "low"

                alert_active = risk == "high"

                result.append({
                    "id": p["name"].lower(),
                    "name": p["name"],
                    "riskLevel": risk,
                    "riskScore": round(score, 2),
                    "rainfall7Day": rainfall,
                    "prediction": round(prediction, 2),
                    "deaths": deaths,
                    "housesDamaged": houses,
                    "alertActive": alert_active
                })

                if alert_active:
                    alerts.append({
                        "id": str(len(alerts) + 1),
                        "region": p["name"],
                        "level": risk,
                        "message": "⚠️ High flood risk based on rainfall + NDMA impact",
                        "timestamp": datetime.utcnow().isoformat(),
                        "isNew": True
                    })

            # ==============================
            # ✅ RAINFALL TREND (ONLY ONCE)
            # ==============================
            rainfall_trend = []

            # 👉 Punjab ka data use kar rahe hain (simple + clean)
            past_data = get_past_rainfall(31.0, 72.5)

            for i, val in enumerate(past_data):
                rainfall_trend.append({
                    "date": (datetime.utcnow() - timedelta(days=i)).strftime("%Y-%m-%d"),
                    "rainfall": val,
                    "predicted": val + 10,
                    "threshold": 80
                })

            return jsonify({
                "provinces": result,
                "alerts": alerts,
                "rainfallTrend": rainfall_trend
            })

        except Exception as e:
            return jsonify({"error": str(e)}), 500

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=5000)