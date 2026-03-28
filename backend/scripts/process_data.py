"""
process_data.py — Data Processing & Feature Engineering
=========================================================
Loads raw NASA rainfall data, computes rolling aggregates,
assigns flood risk levels, and saves the final output.

Input:  backend/data/raw/pakistan_rainfall.csv
Output: backend/data/processed/final_output.csv

Risk logic (based on 7-day rolling rainfall in mm):
  > 120 mm  →  high
  > 60 mm   →  medium
  else      →  low
"""

import os
import sys
import pandas as pd

# ---------------------------------------------------------------------------
# Paths (relative to this script's location)
# ---------------------------------------------------------------------------
SCRIPT_DIR  = os.path.dirname(os.path.abspath(__file__))
RAW_PATH    = os.path.join(SCRIPT_DIR, "..", "data", "raw", "pakistan_rainfall.csv")
OUTPUT_DIR  = os.path.join(SCRIPT_DIR, "..", "data", "processed")
OUTPUT_PATH = os.path.join(OUTPUT_DIR, "final_output.csv")


def classify_risk(rainfall_7day: float) -> str:
    """Assign flood risk level based on 7-day cumulative rainfall."""
    if rainfall_7day > 120:
        return "high"
    elif rainfall_7day > 60:
        return "medium"
    else:
        return "low"


def main():
    print("=" * 60)
    print("  ⚙️   Pakistan Flood Data — Processing Pipeline")
    print("=" * 60)
    print()

    # ------------------------------------------------------------------
    # 1. Load raw data
    # ------------------------------------------------------------------
    raw_path = os.path.abspath(RAW_PATH)
    if not os.path.exists(raw_path):
        print(f"  ❌  Raw data not found: {raw_path}")
        print("      Run fetch_rainfall.py first!")
        sys.exit(1)

    df = pd.read_csv(raw_path, parse_dates=["date"])
    print(f"  📂  Loaded: {raw_path}")
    print(f"      Shape: {df.shape}")
    print(f"      Columns: {list(df.columns)}")
    print(f"      Date range: {df['date'].min()} → {df['date'].max()}")
    print(f"      Regions: {df['region'].nunique()} — {sorted(df['region'].unique())}")
    print()

    # ------------------------------------------------------------------
    # 2. Clean & sort
    # ------------------------------------------------------------------
    # Drop any rows with missing rainfall
    before = len(df)
    df = df.dropna(subset=["rainfall_mm"])
    dropped = before - len(df)
    if dropped > 0:
        print(f"  🧹  Dropped {dropped} rows with missing rainfall")

    # Ensure non-negative rainfall
    df["rainfall_mm"] = df["rainfall_mm"].clip(lower=0)

    # Sort by region then date (required for rolling calculations)
    df = df.sort_values(["region", "date"]).reset_index(drop=True)
    print(f"  ✅  Cleaned & sorted: {len(df)} rows")
    print()

    # ------------------------------------------------------------------
    # 3. Feature engineering — rolling aggregates per region
    # ------------------------------------------------------------------
    print("  📐  Computing rolling aggregates ...")

    # Group by region and compute rolling sums
    df["rainfall_3day"] = (
        df.groupby("region")["rainfall_mm"]
          .transform(lambda x: x.rolling(window=3, min_periods=1).sum())
          .round(2)
    )

    df["rainfall_7day"] = (
        df.groupby("region")["rainfall_mm"]
          .transform(lambda x: x.rolling(window=7, min_periods=1).sum())
          .round(2)
    )

    df["rainfall_30day"] = (
        df.groupby("region")["rainfall_mm"]
          .transform(lambda x: x.rolling(window=30, min_periods=1).sum())
          .round(2)
    )

    # Rainfall spike: today's rain vs. 7-day average (how unusual is today?)
    df["rainfall_7day_avg"] = (
        df.groupby("region")["rainfall_mm"]
          .transform(lambda x: x.rolling(window=7, min_periods=1).mean())
          .round(2)
    )
    df["rainfall_spike"] = (df["rainfall_mm"] - df["rainfall_7day_avg"]).round(2)

    print(f"      Added columns: rainfall_3day, rainfall_7day, rainfall_30day, rainfall_spike")
    print()

    # ------------------------------------------------------------------
    # 4. Extract latest data per region & assign risk
    # ------------------------------------------------------------------
    print("  🎯  Extracting latest data per region ...")

    # Get the most recent row for each region
    latest = (
        df.sort_values("date")
          .groupby("region")
          .tail(1)
          .copy()
    )

    # Assign risk level
    latest["risk"] = latest["rainfall_7day"].apply(classify_risk)

    # Select output columns
    output = latest[[
        "region",
        "date",
        "rainfall_mm",
        "rainfall_3day",
        "rainfall_7day",
        "rainfall_30day",
        "rainfall_spike",
        "risk",
    ]].sort_values("region").reset_index(drop=True)

    print()
    print("  ┌─────────────────────────────────────────────────────┐")
    print("  │          LATEST RISK ASSESSMENT BY PROVINCE         │")
    print("  └─────────────────────────────────────────────────────┘")
    print()
    print(output.to_string(index=False))
    print()

    # Risk summary
    risk_counts = output["risk"].value_counts()
    print("  📊  Risk distribution:")
    for level in ["high", "medium", "low"]:
        count = risk_counts.get(level, 0)
        emoji = {"high": "🔴", "medium": "🟡", "low": "🟢"}[level]
        print(f"      {emoji}  {level}: {count} province(s)")
    print()

    # ------------------------------------------------------------------
    # 5. Save full processed dataset + latest summary
    # ------------------------------------------------------------------
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    # Save the latest summary (for the API & dashboard)
    output.to_csv(OUTPUT_PATH, index=False)
    print(f"  💾  Latest summary saved: {os.path.abspath(OUTPUT_PATH)}")

    # Also save the full time-series with features (for ML training in Step 5)
    full_output_path = os.path.join(OUTPUT_DIR, "rainfall_features.csv")
    df.to_csv(full_output_path, index=False)
    print(f"  💾  Full features saved: {os.path.abspath(full_output_path)}")
    print(f"      Shape: {df.shape} ({df.shape[0]} rows × {df.shape[1]} columns)")

    print()
    print("  ✅  Processing complete!\n")


if __name__ == "__main__":
    main()
