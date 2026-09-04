"""
CrimeNexus Dataset Integrity Verification Script
Checks referential integrity, cryptographic SHA-256 evidence matches,
and JSON/CSV schemas across all generated assets.
"""

import os
import csv
import json
import hashlib

WORKSPACE = os.path.dirname(os.path.abspath(__file__))
SYNTHETIC_DIR = os.path.join(WORKSPACE, "synthetic_data")
EVIDENCE_DIR = os.path.join(WORKSPACE, "sample_evidence")
DATABASE_DIR = os.path.join(WORKSPACE, "database")

errors = []
warnings = []

# 1. Verify Sample Evidence & SHA-256 Hashes
evidence_csv_path = os.path.join(SYNTHETIC_DIR, "evidence.csv")
with open(evidence_csv_path, "r", encoding="utf-8") as f:
    evidence_records = list(csv.DictReader(f))

print(f"--- 1. Verifying Evidence Cryptographic Integrity ({len(evidence_records)} files) ---")
for ev in evidence_records:
    file_name = ev["file_name"]
    expected_hash = ev["sha256_hash"]
    actual_path = os.path.join(EVIDENCE_DIR, file_name)
    if not os.path.exists(actual_path):
        errors.append(f"Missing evidence file: {actual_path}")
        continue
    with open(actual_path, "rb") as f:
        actual_hash = hashlib.sha256(f.read()).hexdigest()
    if actual_hash != expected_hash:
        errors.append(f"Hash mismatch for {file_name}: expected {expected_hash}, got {actual_hash}")
    else:
        print(f"  [PASS] {file_name}: SHA-256 matches ({actual_hash[:16]}...)")

# 2. Load all CSVs into dicts of ID sets
def load_csv(name, id_col):
    path = os.path.join(SYNTHETIC_DIR, name)
    if not os.path.exists(path):
        errors.append(f"Missing CSV file: {path}")
        return [], set()
    with open(path, "r", encoding="utf-8") as f:
        rows = list(csv.DictReader(f))
        id_set = {r[id_col] for r in rows if r[id_col]}
        return rows, id_set

cases_rows, case_ids = load_csv("cases.csv", "case_id")
people_rows, people_ids = load_csv("people.csv", "person_id")
phones_rows, phone_ids = load_csv("phones.csv", "phone_id")
accounts_rows, account_ids = load_csv("accounts.csv", "account_id")
transactions_rows, txn_ids = load_csv("transactions.csv", "transaction_id")
cdr_rows, cdr_ids = load_csv("cdr.csv", "cdr_id")
vehicles_rows, vehicle_ids = load_csv("vehicles.csv", "vehicle_id")
devices_rows, device_ids = load_csv("devices.csv", "device_id")
indicators_rows, indicator_ids = load_csv("cyber_indicators.csv", "indicator_id")
locations_rows, location_ids = load_csv("locations.csv", "location_id")
evidence_rows, evidence_ids = load_csv("evidence.csv", "evidence_id")

print(f"\n--- 2. Dataset Entity Counts ---")
print(f"  Cases: {len(cases_rows)}")
print(f"  People: {len(people_rows)}")
print(f"  Phones: {len(phones_rows)}")
print(f"  Accounts: {len(accounts_rows)}")
print(f"  Transactions: {len(transactions_rows)}")
print(f"  CDR Records: {len(cdr_rows)}")
print(f"  Vehicles: {len(vehicles_rows)}")
print(f"  Devices: {len(devices_rows)}")
print(f"  Cyber Indicators: {len(indicators_rows)}")
print(f"  Locations: {len(locations_rows)}")
print(f"  Evidence: {len(evidence_rows)}")

# 3. Foreign Key Checks
print(f"\n--- 3. Verifying Referential Integrity (Foreign Keys) ---")

for r in people_rows:
    if r["primary_case_id"] and r["primary_case_id"] not in case_ids:
        errors.append(f"Person {r['person_id']} has invalid primary_case_id: {r['primary_case_id']}")

for r in phones_rows:
    if r["registered_owner_id"] and r["registered_owner_id"] not in people_ids:
        errors.append(f"Phone {r['phone_id']} has invalid registered_owner_id: {r['registered_owner_id']}")

for r in accounts_rows:
    if r["account_holder_id"] and r["account_holder_id"] not in people_ids:
        errors.append(f"Account {r['account_id']} has invalid account_holder_id: {r['account_holder_id']}")

for r in transactions_rows:
    if r["sender_account_id"] not in account_ids:
        errors.append(f"Transaction {r['transaction_id']} has invalid sender_account_id: {r['sender_account_id']}")
    if r["receiver_account_id"] not in account_ids:
        errors.append(f"Transaction {r['transaction_id']} has invalid receiver_account_id: {r['receiver_account_id']}")
    if r["evidence_id"] and r["evidence_id"] not in evidence_ids:
        errors.append(f"Transaction {r['transaction_id']} has invalid evidence_id: {r['evidence_id']}")

for r in cdr_rows:
    if r["caller_phone_id"] not in phone_ids:
        errors.append(f"CDR {r['cdr_id']} has invalid caller_phone_id: {r['caller_phone_id']}")
    if r["receiver_phone_id"] not in phone_ids:
        errors.append(f"CDR {r['cdr_id']} has invalid receiver_phone_id: {r['receiver_phone_id']}")
    if r["location_id"] and r["location_id"] not in location_ids:
        errors.append(f"CDR {r['cdr_id']} has invalid location_id: {r['location_id']}")
    if r["reference_evidence_id"] and r["reference_evidence_id"] not in evidence_ids:
        errors.append(f"CDR {r['cdr_id']} has invalid reference_evidence_id: {r['reference_evidence_id']}")

for r in vehicles_rows:
    if r["owner_id"] and r["owner_id"] not in people_ids:
        errors.append(f"Vehicle {r['vehicle_id']} has invalid owner_id: {r['owner_id']}")
    if r["last_seen_location_id"] and r["last_seen_location_id"] not in location_ids:
        errors.append(f"Vehicle {r['vehicle_id']} has invalid last_seen_location_id: {r['last_seen_location_id']}")

for r in devices_rows:
    if r["owner_id"] and r["owner_id"] not in people_ids:
        errors.append(f"Device {r['device_id']} has invalid owner_id: {r['owner_id']}")

for r in indicators_rows:
    if r["associated_device_id"] and r["associated_device_id"] not in device_ids:
        errors.append(f"Indicator {r['indicator_id']} has invalid associated_device_id: {r['associated_device_id']}")
    if r["associated_person_id"] and r["associated_person_id"] not in people_ids:
        errors.append(f"Indicator {r['indicator_id']} has invalid associated_person_id: {r['associated_person_id']}")
    if r["reference_evidence_id"] and r["reference_evidence_id"] not in evidence_ids:
        errors.append(f"Indicator {r['indicator_id']} has invalid reference_evidence_id: {r['reference_evidence_id']}")

for r in evidence_rows:
    if r["case_id"] not in case_ids:
        errors.append(f"Evidence {r['evidence_id']} has invalid case_id: {r['case_id']}")

if not errors:
    print("  [PASS] All 11 entity tables passed referential integrity checks!")

# 4. Check Ground Truth JSON Structure
print(f"\n--- 4. Verifying ground_truth.json Structure ---")
gt_path = os.path.join(SYNTHETIC_DIR, "ground_truth.json")
with open(gt_path, "r", encoding="utf-8") as f:
    gt = json.load(f)

required_gt_keys = [
    "cases_overview",
    "network_communities",
    "bridge_nodes",
    "chronological_reconstruction_events",
    "intentional_contradictions",
    "investigation_gaps",
    "legal_provisions_mapping"
]
for k in required_gt_keys:
    if k not in gt:
        errors.append(f"Missing key in ground_truth.json: {k}")
    else:
        print(f"  [PASS] Key '{k}' present (items: {len(gt[k])})")

# 5. Check Database Files
print(f"\n--- 5. Verifying Database Schema & Seed Files ---")
schema_path = os.path.join(DATABASE_DIR, "schema.sql")
seed_path = os.path.join(DATABASE_DIR, "seed.sql")

if os.path.exists(schema_path) and os.path.getsize(schema_path) > 1000:
    print(f"  [PASS] database/schema.sql exists ({os.path.getsize(schema_path)} bytes)")
else:
    errors.append("database/schema.sql missing or too small")

if os.path.exists(seed_path) and os.path.getsize(seed_path) > 1000:
    print(f"  [PASS] database/seed.sql exists ({os.path.getsize(seed_path)} bytes)")
else:
    errors.append("database/seed.sql missing or too small")

# Final Report
print(f"\n=======================================================")
if errors:
    print(f"FAILED: {len(errors)} errors found:")
    for e in errors:
        print(f"  - {e}")
    exit(1)
else:
    print("SUCCESS: All verification tests PASSED! 100% integrity.")
    print("=======================================================")
