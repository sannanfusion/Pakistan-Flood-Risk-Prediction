from flask import Flask, jsonify
from flask_cors import CORS
import os
import pandas as pd

def create_app():
    app = Flask(__name__)
    CORS(app)

    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    DATA_PATH = os.path.join(BASE_DIR, "data", "processed", "final_output.csv")

    # -------------------------------
    # Health Check
    # -------------------------------
    @app.route("/api/health")
    def health():
        return jsonify({"status": "ok"})

    # -------------------------------
    # REAL PROVINCE DATA FROM CSV
    # -------------------------------
    @app.route("/api/provinces")
    def provinces():
        if not os.path.exists(DATA_PATH):
            return jsonify({"error": "No processed data found"}), 500

        df = pd.read_csv(DATA_PATH)

        provinces = []

        for _, row in df.iterrows():
            provinces.append({
                "name": row["region"],
                "risk": row["risk"],
                "rainfall": float(row["rainfall_mm"]),
                "rainfall7day": float(row["rainfall_7day"])
            })

        return jsonify({"provinces": provinces})

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)