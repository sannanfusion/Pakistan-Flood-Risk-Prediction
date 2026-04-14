import urllib.request
import json
import time

print("=== TESTING: Do values change between requests? ===\n")

# First request
r1 = urllib.request.urlopen("https://pakistan-flood-risk-prediction.onrender.com/api/all")
d1 = json.loads(r1.read())

time.sleep(1)

# Second request
r2 = urllib.request.urlopen("https://pakistan-flood-risk-prediction.onrender.com/api/all")
d2 = json.loads(r2.read())

print(f"{'Province':<22} | {'Request 1':>12} | {'Request 2':>12} | {'Changed?':>8}")
print("-" * 65)

for p1, p2 in zip(d1["provinces"], d2["provinces"]):
    s1 = p1["riskScore"]
    s2 = p2["riskScore"]
    changed = "YES" if s1 != s2 else "same"
    print(f"{p1['name']:<22} | Score: {s1:>4} | Score: {s2:>4} | {changed:>8}")

print("\nDistrict-level check (Sindh):")
for dd1, dd2 in zip(d1["provinces"][0]["districts"], d2["provinces"][0]["districts"]):
    c = "YES" if dd1["riskScore"] != dd2["riskScore"] else "same"
    print(f"  {dd1['name']:<18} | {dd1['riskScore']:>3} vs {dd2['riskScore']:>3} | {c}")

print(f"\nRiver discharge (Punjab): {d1['provinces'][1]['riverDischarge']} vs {d2['provinces'][1]['riverDischarge']}")
print(f"Rainfall trend[0]: {d1['rainfallTrend'][0]['predicted']} vs {d2['rainfallTrend'][0]['predicted']}")
