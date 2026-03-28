"""
fetch_rainfall.py — NASA POWER API Data Ingestion
===================================================
Fetches daily precipitation (PRECTOTCORR) for all 6 Pakistan provinces
from the NASA POWER API and saves a combined CSV.

Output: backend/data/raw/pakistan_rainfall.csv

API Docs: https://power.larc.nasa.gov/docs/services/api/
Parameter: PRECTOTCORR = Precipitation Corrected (mm/day)
"""

import os
import sys
import time
import requests
import pandas as pd
from datetime import datetime, timedelta

# ---------------------------------------------------------------------------
# Province coordinates (one representative point per province)
# ---------------------------------------------------------------------------
PROVINCES = {
    "Sindh":              {"lat": 26.0,  "lon": 68.5},
    "Punjab":             {"lat": 31.0,  "lon": 72.5},
    "KPK":                {"lat": 34.5,  "lon": 71.5},
    "Balochistan":        {"lat": 28.5,  "lon": 65.0},
    "Gilgit-Baltistan":   {"lat": 35.8,  "lon": 75.0},
    "Azad Kashmir":       {"lat": 33.9,  "lon": 73.8},
}

# NASA POWER API base URL
BASE_URL = "https://power.larc.nasa.gov/api/temporal/daily/point"

# How many years of data to fetch (more data = better ML training)
YEARS_BACK = 3


def fetch_province_rainfall(province_name: str, lat: float, lon: float,
                            start_date: str, end_date: str) -> pd.DataFrame:
    """
    Fetch daily rainfall for a single province from NASA POWER API.

    Returns a DataFrame with columns: [date, rainfall_mm, region]
    """
    params = {
        "parameters":  "PRECTOTCORR",
        "community":   "RE",           # Renewable Energy community (works for precip)
        "longitude":   lon,
        "latitude":    lat,
        "start":       start_date,
        "end":         end_date,
        "format":      "JSON",
    }

    print(f"  📡  Fetching {province_name} ({lat}, {lon}) ...")
    print(f"       Date range: {start_date} → {end_date}")

    try:
        response = requests.get(BASE_URL, params=params, timeout=60)
        print(f"       HTTP status: {response.status_code}")

        if response.status_code != 200:
            print(f"  ❌  API error for {province_name}: {response.status_code}")
            print(f"       Response: {response.text[:300]}")
            return pd.DataFrame()

        data = response.json()

        # Extract the daily precipitation values
        precip_data = data["properties"]["parameter"]["PRECTOTCORR"]

        # Convert to DataFrame
        records = []
        for date_str, value in precip_data.items():
            # NASA uses -999.0 for missing values
            if value < 0:
                value = 0.0
            records.append({
                "date": date_str,
                "rainfall_mm": round(value, 2),
                "region": province_name,
            })

        df = pd.DataFrame(records)

        # Convert date string (YYYYMMDD) to proper datetime
        df["date"] = pd.to_datetime(df["date"], format="%Y%m%d")

        print(f"  ✅  {province_name}: {len(df)} days fetched")
        print(f"       Sample:\n{df.head(3).to_string(index=False)}\n")

        return df

    except requests.exceptions.Timeout:
        print(f"  ⏱️  Timeout for {province_name} — retrying once ...")
        time.sleep(5)
        try:
            response = requests.get(BASE_URL, params=params, timeout=90)
            if response.status_code == 200:
                data = response.json()
                precip_data = data["properties"]["parameter"]["PRECTOTCORR"]
                records = []
                for date_str, value in precip_data.items():
                    if value < 0:
                        value = 0.0
                    records.append({
                        "date": date_str,
                        "rainfall_mm": round(value, 2),
                        "region": province_name,
                    })
                df = pd.DataFrame(records)
                df["date"] = pd.to_datetime(df["date"], format="%Y%m%d")
                print(f"  ✅  {province_name} (retry): {len(df)} days fetched")
                return df
        except Exception:
            pass
        print(f"  ❌  Failed for {province_name} after retry")
        return pd.DataFrame()

    except Exception as e:
        print(f"  ❌  Error for {province_name}: {e}")
        return pd.DataFrame()


def main():
    print("=" * 60)
    print("  🌧️  Pakistan Rainfall Data — NASA POWER API Fetcher")
    print("=" * 60)
    print()

    # Date range: last N years up to yesterday
    end_dt = datetime.now() - timedelta(days=1)
    start_dt = end_dt - timedelta(days=365 * YEARS_BACK)
    start_date = start_dt.strftime("%Y%m%d")
    end_date = end_dt.strftime("%Y%m%d")

    print(f"  📅  Fetching {YEARS_BACK} years: {start_date} → {end_date}")
    print(f"  🗺️   Provinces: {len(PROVINCES)}")
    print()

    # Fetch data for all provinces
    all_frames = []
    for province_name, coords in PROVINCES.items():
        df = fetch_province_rainfall(
            province_name,
            coords["lat"],
            coords["lon"],
            start_date,
            end_date,
        )
        if not df.empty:
            all_frames.append(df)

        # Be polite to NASA's API — small delay between requests
        time.sleep(2)

    if not all_frames:
        print("\n  ❌  No data fetched from any province. Check your internet connection.")
        sys.exit(1)

    # Combine all provinces into one DataFrame
    combined = pd.concat(all_frames, ignore_index=True)
    combined = combined.sort_values(["region", "date"]).reset_index(drop=True)

    print("=" * 60)
    print(f"  📊  Combined dataset shape: {combined.shape}")
    print(f"  📊  Regions: {combined['region'].nunique()}")
    print(f"  📊  Date range: {combined['date'].min()} → {combined['date'].max()}")
    print(f"  📊  Total records: {len(combined)}")
    print()
    print("  Sample (first 5 rows):")
    print(combined.head().to_string(index=False))
    print()
    print("  Per-region row counts:")
    print(combined.groupby("region").size().to_string())
    print()

    # Save to CSV
    output_dir = os.path.join(os.path.dirname(__file__), "..", "data", "raw")
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, "pakistan_rainfall.csv")
    combined.to_csv(output_path, index=False)

    print(f"  💾  Saved to: {os.path.abspath(output_path)}")
    print("  ✅  Done!\n")


if __name__ == "__main__":
    main()
