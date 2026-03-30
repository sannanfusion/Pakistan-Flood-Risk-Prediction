from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd
import os

def create_app():
    app = Flask(__name__)
    CORS(app)

    # Path to processed data
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    DATA_PATH = os.path.join(BASE_DIR, "data", "processed", "final_output.csv")

    @app.route("/api/health", methods=["GET"])
    def health():
        return jsonify({"status": "ok"})

    @app.route("/api/provinces", methods=["GET"])
    def get_provinces():
        try:
            df = pd.read_csv(DATA_PATH)

            provinces = []

            for _, row in df.iterrows():
                provinces.append({
                    "name": row["region"],
                    "riskLevel": row["risk"],
                    "riskScore": round(row["rainfall_7day"], 2),
                    "rainfall": row["rainfall_mm"]
                })

            return jsonify({"provinces": provinces})

        except Exception as e:
            return jsonify({"error": str(e)}), 500

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=5000)