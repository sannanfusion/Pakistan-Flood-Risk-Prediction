import os
import sys
import pandas as pd

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
RAW_PATH = os.path.join(SCRIPT_DIR, "..", "data", "raw", "pakistan_rainfall.csv")
OUTPUT_DIR = os.path.join(SCRIPT_DIR, "..", "data", "processed")
OUTPUT_PATH = os.path.join(OUTPUT_DIR, "final_output.csv")

# ---------------------------
# IMPROVED RISK LOGIC
# ---------------------------
def classify_risk(row):
    r7 = row["rainfall_7day"]
    r30 = row["rainfall_30day"]
    spike = row["rainfall_spike"]

    if r7 > 80 or spike > 20:
        return "high"
    elif r7 > 30 or r30 > 100:
        return "medium"
    else:
        return "low"

def main():
    print("\n🚀 PROCESSING STARTED\n")

    if not os.path.exists(RAW_PATH):
        print("❌ Raw file not found!")
        sys.exit(1)

    df = pd.read_csv(RAW_PATH, parse_dates=["date"])

    # CLEAN
    df = df.dropna(subset=["rainfall_mm"])
    df["rainfall_mm"] = df["rainfall_mm"].clip(lower=0)
    df = df.sort_values(["region", "date"])

    # FEATURES
    df["rainfall_7day"] = df.groupby("region")["rainfall_mm"].transform(lambda x: x.rolling(7, 1).sum())
    df["rainfall_30day"] = df.groupby("region")["rainfall_mm"].transform(lambda x: x.rolling(30, 1).sum())
    df["rainfall_7day_avg"] = df.groupby("region")["rainfall_mm"].transform(lambda x: x.rolling(7, 1).mean())
    df["rainfall_spike"] = df["rainfall_mm"] - df["rainfall_7day_avg"]

    # LATEST
    latest = df.sort_values("date").groupby("region").tail(1).copy()

    print("\n📊 DEBUG VALUES:\n")
    print(latest[["region", "rainfall_7day", "rainfall_30day", "rainfall_spike"]])

    # RISK
    latest["risk"] = latest.apply(classify_risk, axis=1)

    output = latest[[
        "region",
        "date",
        "rainfall_mm",
        "rainfall_7day",
        "rainfall_30day",
        "rainfall_spike",
        "risk"
    ]]

    print("\n🎯 FINAL OUTPUT:\n")
    print(output)

    os.makedirs(OUTPUT_DIR, exist_ok=True)
    output.to_csv(OUTPUT_PATH, index=False)

    print("\n💾 Saved at:", OUTPUT_PATH)
    print("\n✅ DONE\n")

if __name__ == "__main__":
    main()