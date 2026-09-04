"""
CrimeNexus Synthetic Data Foundation Generator
SIH26189 — AI-Powered Criminal Network Analysis System
Generates synthetic data, sample evidence, and database schemas (PostgreSQL / Supabase + Neo4j mappings).
"""

import os
import csv
import json
import hashlib
from datetime import datetime

WORKSPACE = os.path.dirname(os.path.abspath(__file__))
SYNTHETIC_DIR = os.path.join(WORKSPACE, "synthetic_data")
EVIDENCE_DIR = os.path.join(WORKSPACE, "sample_evidence")
DATABASE_DIR = os.path.join(WORKSPACE, "database")

os.makedirs(SYNTHETIC_DIR, exist_ok=True)
os.makedirs(EVIDENCE_DIR, exist_ok=True)
os.makedirs(DATABASE_DIR, exist_ok=True)

# -----------------------------------------------------------------------------
# 1. GENERATE SAMPLE EVIDENCE FILES FIRST (To extract exact SHA-256)
# -----------------------------------------------------------------------------

fir_content = """================================================================================
FIRST INFORMATION REPORT (Under Section 154 Cr.P.C. / Section 173 BNSS)
CRIME / INCIDENT REPORT - REGION A (NCR JURISDICTION)
CYBER CRIME POLICE STATION, GURUGRAM
================================================================================

1. District: Gurugram Commissionerate
   Police Station: Cyber Crime Police Station (Region Code: REG-NCR)
   FIR No: 0018/2026
   Date & Time of FIR: 09-JUN-2026 18:30:00 IST
   Acts & Sections: IT Act 2000 (Sec 66C, 66D) r/w BNS 2023 (Sec 318(4), 61(2))

2. Complainant / Informant Details:
   Name: Vikramaditya Rathore (PER-108)
   Designation: Chief Financial Officer, Zenith Technologies Ltd.
   Office Address: Cyber City Phase II, Tower C, Gurugram, Haryana - 122002
   Contact Phone: +919810011808

3. Occurrence of Offence:
   Day & Date: Tuesday, 09-JUN-2026
   Time: Between 11:15:00 IST and 14:30:00 IST
   Place of Occurrence: Virtual / Electronic Domain & Zenith Corporate Banking Portal

4. Details of Suspects / Accused (As per preliminary cyber inquiry):
   - Unknown operator claiming to be 'Audit Desk' / alias 'Viper'
   - Registered Caller MSISDN: +919811002233
   - Primary Beneficiary: Suman Roy (PER-104) holding Account #9988220144 at Royal Crest Bank
   - Intermediary Coordinator: Contact identified as 'Broker D' / Devrat Sharma (PER-103)

5. Incident Narrative / Statement of Complainant:
   "On 09 June 2026 at approximately 11:15 IST, our finance treasury desk received a spear-phishing email ostensibly from our Managing Director requesting urgent authorization for an offshore vendor clearance. The link directed our accounts manager to a replica portal hosted on 'secure-zenithcorp-auth.com'. Upon credential entry, unauthorized two-factor tokens were intercepted.
   At 14:10 IST, an unauthorized RTGS transfer of INR 1,00,00,000 (One Crore Indian Rupees) was executed from our Zenith Corporate Current Account (ACC-1001 at Apex Global Bank) to beneficiary account ACC-2201 (Royal Crest Bank, Cyber Hub Branch, A/C: 9988220144, Holder: Suman Roy).
   When our finance team detected the discrepancy and attempted a recall, the funds were already subdivided and moved across multiple secondary accounts within minutes. We request immediate freeze, tracing of digital footprints, and strict legal action against the syndicate."

6. Digital Indicators & Technical Artifacts Extracted:
   - Malicious Domain: secure-zenithcorp-auth.com
   - Associated Command IP: 198.51.100.45 (Originating ASN: 45102 CloudHost VPS)
   - Secondary Webhook IP: 203.0.113.88
   - Spoofed Header Sender: ceo-office@zenithcorp-internal.com
   - Intercepted Calling Number: +919811002233 (IMSI: 404450198234222)
   - Initial Destination Account: ACC-2201 (IFSC: RCBL0001042)

7. Investigating Officer:
   Inspector Amitav Sen (Badge: NCR-CYBER-044)
   Lead Case Officer: Inspector Vikram Batra (INV-NCR-101)
   Signature / Electronic Dispatch Seal: [VERIFIED DIGITAL DISPATCH REG-NCR-2026-0906]
================================================================================
"""

str_content = """================================================================================
FINANCIAL INTELLIGENCE UNIT (FIU-IND) / SUSPICIOUS TRANSACTION REPORT (STR)
CONFIDENTIAL INVESTIGATIVE ADVISORY - ECONOMIC OFFENCES WING
REGION CODE: REG-MUM (WESTERN REGION, MUMBAI)
================================================================================

1. Reference ID: STR-2026-MUM-88912
   Reporting Entity: Imperial Trust Bank, Nariman Point Branch, Mumbai
   Date of Advisory: 08-AUG-2026 11:00:00 IST
   Case Reference: Operation ShadowLedge / Case #CR-2026-MUM-041

2. Subject Account Under Review:
   Account Name: Apex Trade Solutions Pvt Ltd
   Account Number: 4455770199 (System ID: ACC-7701)
   Account Type: Corporate Current Account
   IFSC: ITBL0005511
   Date of Incorporation / Onboarding: 20-AUG-2025
   Registered Director: Anita D'Souza (PER-107, PAN: CKSPD5541L)
   Registered Address: Unit 412, Nariman Bhavan, Nariman Point, Mumbai - 400021

3. Transactional Alert & Anomaly Trigger:
   On 07-AUG-2026 at 15:30:00 IST, Account 4455770199 received a single high-value RTGS credit:
   - Inward RTGS Amount: INR 50,00,000.00 (Fifty Lakhs)
   - Transaction Reference: TXN_552 (Core Banking UTR: ITBL2026080700552)
   - Originating Account: ACC-7702 (Imperial Trust Bank, Bandra West, A/C: 4455770288)
   - Remitter: Devrat Sharma (PER-103)
   - Narration: 'Trade advances Apex Trade Ref TXN_552'

4. Immediate Rapid Dissipation Pattern:
   Within 105 minutes of receipt (at 17:15:00 IST), Account 4455770199 initiated an outward RTGS transfer:
   - Outward Amount: INR 45,00,000.00 (TXN-1012)
   - Beneficiary Account: ACC-7703 (Western Coastal Bank, Fort Branch)
   - Beneficiary Name: Tariq Merchant (PER-105, Hawala operative)
   - Narration: 'Logistics settlement invoice 8891'
   Subsequently on 10-AUG-2026, Account ACC-7703 routed INR 10,00,00,000 via SWIFT (TXN-1013) to offshore entity in Deira, Dubai (ACC-7705, Farooq Sheikh).

5. Red Flags & Investigative Observations:
   - Pass-through Velocity: 90% of funds transferred out within 2 hours.
   - Physical Site Inspection: Physical inspection of Unit 412 Nariman Bhavan conducted on 08-AUG-2026 revealed the office space locked with no physical trading goods, inventory, or employees.
   - Cross-Jurisdiction Link: Originating remitter Devrat Sharma is currently flagged as a high-interest person of interest in NCR Cyber Crime Case #CR-2026-NCR-018 (Operation PhishNet).
   - Flagged under PMLA 2002 Sections 3 and 4 for systematic layering of fraudulent proceeds.

6. Reporting Nodal Officer:
   Rajendra Prasad, Chief Anti-Money Laundering Officer (CAMLO)
   Imperial Trust Bank Financial Crime Division, Mumbai
================================================================================
"""

cdr_dump_content = """cdr_id,caller_phone_id,caller_msisdn,receiver_phone_id,receiver_msisdn,call_timestamp,duration_seconds,call_type,cell_tower_id,imei,imsi,location_label
CDR-1001,PH-1002,+919811002233,PH-1001,+919811001122,2026-06-09 11:05:00,245,VOICE,T-4401,358941098234222,404450198234222,Sector 44 Gurugram
CDR-1002,PH-1001,+919811001122,PH-1003,+919820003344,2026-06-09 11:20:00,410,VOICE,T-4401,358941098234111,404450198234111,Sector 44 Gurugram
CDR-1003,PH-1003,+919820003344,PH-1004,+919811004455,2026-06-09 13:45:00,180,VOICE,T-4401,358941098234333,404200198234333,Sector 44 Gurugram
CDR-1004,PH-1002,+919811002233,PH-1008,+919810011808,2026-06-09 14:15:00,312,VOICE,T-4401,358941098234222,404450198234222,Sector 44 Gurugram
CDR-1005,PH-9908,+919811009988,PH-1003,+919820003344,2026-06-09 14:50:00,95,VOICE,T-4401,358941098239908,404450198239908,Sector 44 Gurugram
CDR-1006,PH-1003,+919820003344,PH-1012,+919811001212,2026-06-09 15:10:00,145,VOICE,T-4401,358941098234333,404200198234333,Sector 44 Gurugram
CDR-1007,PH-1001,+919811001122,PH-1003,+919820003344,2026-06-11 09:30:00,520,VOICE,T-4401,358941098234111,404450198234111,Sector 44 Gurugram
CDR-1008,PH-1003,+919820003344,PH-1005,+919820005566,2026-06-11 12:00:00,680,VOICE,T-2001,358941098234333,404200198234333,Worli Mumbai
CDR-1009,PH-1005,+919820005566,PH-1007,+919820007788,2026-08-07 14:00:00,310,VOICE,T-2001,358941098234555,404200198234555,Worli Mumbai
CDR-1010,PH-1003,+919820003344,PH-1007,+919820007788,2026-08-07 15:15:00,195,VOICE,T-2001,358941098234333,404200198234333,Bandra Mumbai
CDR-1011,PH-1005,+919820005566,PH-1006,+919820006677,2026-08-07 16:30:00,440,VOICE,T-2001,358941098234555,404200198234555,Worli Mumbai
CDR-1012,PH-1006,+919820006677,PH-1013,+919820001313,2026-08-07 17:00:00,120,VOICE,T-2002,358941098234666,404200198234666,Kurla Mumbai
CDR-1013,PH-1005,+919820005566,PH-1011,+971501234567,2026-08-09 20:15:00,890,VOICE,T-2001,358941098234555,404200198234555,Worli Mumbai
CDR-1014,PH-1010,+919811000010,PH-9908,+919811009988,2026-05-28 16:10:00,45,SMS,T-4402,358941098234010,404450198234010,Udyog Vihar Gurugram
"""

evidence_files = {
    "FIR_2026_018_PhishNet.txt": fir_content.strip() + "\n",
    "Bank_STR_Advisory_ApexTrade.txt": str_content.strip() + "\n",
    "Telecom_CDR_TowerDump_T4401.csv": cdr_dump_content.strip() + "\n"
}

computed_hashes = {}
for filename, content in evidence_files.items():
    file_path = os.path.join(EVIDENCE_DIR, filename)
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    with open(file_path, "rb") as f:
        computed_hashes[filename] = hashlib.sha256(f.read()).hexdigest()
    print(f"Created {filename} -> SHA-256: {computed_hashes[filename]}")

# -----------------------------------------------------------------------------
# 2. SYNTHETIC DATA ENTITIES
# -----------------------------------------------------------------------------

# A. regions & investigators (for seed & DB schema)
regions = [
    {"region_id": "REG-NCR", "region_name": "Northern Capital Region (NCR)", "state": "Delhi / Haryana", "jurisdiction_notes": "Covers Gurugram, Delhi, and Noida cyber police commissionerates"},
    {"region_id": "REG-MUM", "region_name": "Western Coastal Region", "state": "Maharashtra", "jurisdiction_notes": "Covers Mumbai Police Cyber Crime & EOW jurisdictions"},
    {"region_id": "REG-BLR", "region_name": "Southern Tech Corridor", "state": "Karnataka", "jurisdiction_notes": "Covers Bengaluru Cyber Command & CID"}
]

investigators = [
    {"investigator_id": "INV-NCR-101", "region_id": "REG-NCR", "badge_number": "NCR-CYBER-044", "full_name": "Inspector Vikram Batra", "email": "v.batra@ncr.police.gov.in", "role": "Lead Cyber Investigator"},
    {"investigator_id": "INV-NCR-102", "region_id": "REG-NCR", "badge_number": "NCR-INTEL-089", "full_name": "Sub-Inspector Shalini Varma", "email": "s.varma@ncr.police.gov.in", "role": "Technical Intelligence Specialist"},
    {"investigator_id": "INV-MUM-204", "region_id": "REG-MUM", "badge_number": "MUM-EOW-112", "full_name": "Inspector Jayant Sawant", "email": "j.sawant@mumbaipolice.gov.in", "role": "Economic Offences Investigator"}
]

# B. cases.csv
cases = [
    {
        "case_id": "CASE-018",
        "case_number": "CR-2026-NCR-018",
        "title": "Operation PhishNet - Corporate Wire Fraud",
        "description": "Investigation into unauthorized spear-phishing attack and INR 1.0 Crore fraudulent RTGS transfer from Zenith Technologies Ltd corporate account into distributed mule accounts.",
        "category": "Financial Cyber Fraud",
        "status": "Active",
        "region_id": "REG-NCR",
        "lead_investigator_id": "INV-NCR-101",
        "incident_date": "2026-06-09 11:15:00",
        "created_at": "2026-06-09 18:30:00"
    },
    {
        "case_id": "CASE-041",
        "case_number": "CR-2026-MUM-041",
        "title": "Operation ShadowLedge - Hawala & Trade Shells",
        "description": "Cross-border illicit hawala layering and customs duty evasion investigation involving shell corporation Apex Trade Solutions and overseas bullion transfers.",
        "category": "Money Laundering & Hawala",
        "status": "Active",
        "region_id": "REG-MUM",
        "lead_investigator_id": "INV-MUM-204",
        "incident_date": "2026-07-22 09:00:00",
        "created_at": "2026-08-01 10:15:00"
    },
    {
        "case_id": "CASE-059",
        "case_number": "CR-2026-NCR-059",
        "title": "Operation DarkSIM - Fraudulent SIM Box Network",
        "description": "Illegal multi-channel SIM box terminal and forged identity SIM activation ring operating across NCR supplying burner lines to cyber syndicates.",
        "category": "Telecom & Identity Fraud",
        "status": "Active",
        "region_id": "REG-NCR",
        "lead_investigator_id": "INV-NCR-102",
        "incident_date": "2026-05-18 14:00:00",
        "created_at": "2026-05-20 16:45:00"
    }
]

# C. people.csv
people = [
    {
        "person_id": "PER-101",
        "full_name": "Rajesh Verma",
        "aliases": "Viper; Rajan",
        "role_designation": "Syndicate Leader / Phishing Boss",
        "dob": "1987-04-12",
        "gender": "Male",
        "nationality": "Indian",
        "id_document_type": "AADHAAR",
        "id_document_number": "XXXX-XXXX-4912",
        "address": "Flat 402, Neelkanth Heights, Sector 56, Gurugram, Haryana",
        "primary_case_id": "CASE-018",
        "region_id": "REG-NCR",
        "risk_level": "High"
    },
    {
        "person_id": "PER-102",
        "full_name": "Kunal Malhotra",
        "aliases": "Proxy; NullPtr",
        "role_designation": "Technical Infrastructure Admin",
        "dob": "1994-09-23",
        "gender": "Male",
        "nationality": "Indian",
        "id_document_type": "PAN",
        "id_document_number": "ABCPM1294K",
        "address": "House 112, Block B, Sushant Lok, Gurugram, Haryana",
        "primary_case_id": "CASE-018",
        "region_id": "REG-NCR",
        "risk_level": "High"
    },
    {
        "person_id": "PER-103",
        "full_name": "Devrat Sharma",
        "aliases": "The Accountant; Broker D",
        "role_designation": "Financial Broker & Mule Coordinator (Bridge)",
        "dob": "1982-11-05",
        "gender": "Male",
        "nationality": "Indian",
        "id_document_type": "PAN",
        "id_document_number": "BKDPS9921E",
        "address": "Flat 1204, Sea Breeze Towers, Bandra West, Mumbai, Maharashtra",
        "primary_case_id": "CASE-018",
        "region_id": "REG-NCR",
        "risk_level": "Critical"
    },
    {
        "person_id": "PER-104",
        "full_name": "Suman Roy",
        "aliases": "Mule One; Sunny",
        "role_designation": "Mule Account Holder",
        "dob": "2001-03-14",
        "gender": "Male",
        "nationality": "Indian",
        "id_document_type": "AADHAAR",
        "id_document_number": "XXXX-XXXX-8821",
        "address": "Room 14, Chawl No 3, Mahipalpur, New Delhi",
        "primary_case_id": "CASE-018",
        "region_id": "REG-NCR",
        "risk_level": "Medium"
    },
    {
        "person_id": "PER-105",
        "full_name": "Tariq Merchant",
        "aliases": "Al-Miraj; Merchant Saab",
        "role_designation": "Hawala Kingpin & Financier",
        "dob": "1975-08-19",
        "gender": "Male",
        "nationality": "Indian",
        "id_document_type": "PASSPORT",
        "id_document_number": "Z4819201",
        "address": "Penthouse 22, Ocean Crest, Worli, Mumbai, Maharashtra",
        "primary_case_id": "CASE-041",
        "region_id": "REG-MUM",
        "risk_level": "Critical"
    },
    {
        "person_id": "PER-106",
        "full_name": "Sameer Khan",
        "aliases": "Falcon; Sam",
        "role_designation": "Hawala Courier & Logistics Coordinator",
        "dob": "1990-01-28",
        "gender": "Male",
        "nationality": "Indian",
        "id_document_type": "AADHAAR",
        "id_document_number": "XXXX-XXXX-3341",
        "address": "Flat 301, Al-Noor Apt, Dongri, Mumbai, Maharashtra",
        "primary_case_id": "CASE-041",
        "region_id": "REG-MUM",
        "risk_level": "High"
    },
    {
        "person_id": "PER-107",
        "full_name": "Anita D'Souza",
        "aliases": "Director Anita",
        "role_designation": "Shell Company Director (Apex Trade)",
        "dob": "1985-06-17",
        "gender": "Female",
        "nationality": "Indian",
        "id_document_type": "PAN",
        "id_document_number": "CKSPD5541L",
        "address": "Flat 702, Marina Bay View, Colaba, Mumbai, Maharashtra",
        "primary_case_id": "CASE-041",
        "region_id": "REG-MUM",
        "risk_level": "High"
    },
    {
        "person_id": "PER-108",
        "full_name": "Vikramaditya Rathore",
        "aliases": "",
        "role_designation": "Victim - CFO Zenith Tech",
        "dob": "1973-12-01",
        "gender": "Male",
        "nationality": "Indian",
        "id_document_type": "PAN",
        "id_document_number": "AAAPR7890M",
        "address": "Villa 19, Magnolia Greens, Golf Course Rd, Gurugram, Haryana",
        "primary_case_id": "CASE-018",
        "region_id": "REG-NCR",
        "risk_level": "Low"
    },
    {
        "person_id": "PER-109",
        "full_name": "Priya Menon",
        "aliases": "",
        "role_designation": "Witness / Whistleblower (Accounts Manager)",
        "dob": "1992-05-15",
        "gender": "Female",
        "nationality": "Indian",
        "id_document_type": "AADHAAR",
        "id_document_number": "XXXX-XXXX-5521",
        "address": "Apt 501, Silver Oaks, DLF Phase 1, Gurugram, Haryana",
        "primary_case_id": "CASE-018",
        "region_id": "REG-NCR",
        "risk_level": "Low"
    },
    {
        "person_id": "PER-110",
        "full_name": "Gaurav Shinde",
        "aliases": "Volt; SIM-Babu",
        "role_designation": "SIM Box Operator & Fraudulent Activator",
        "dob": "1996-10-30",
        "gender": "Male",
        "nationality": "Indian",
        "id_document_type": "AADHAAR",
        "id_document_number": "XXXX-XXXX-9912",
        "address": "Plot 88, Udyog Vihar Phase 4, Gurugram, Haryana",
        "primary_case_id": "CASE-059",
        "region_id": "REG-NCR",
        "risk_level": "High"
    },
    {
        "person_id": "PER-111",
        "full_name": "Farooq Sheikh",
        "aliases": "Caspian",
        "role_designation": "Cross-Border Settlement Contact",
        "dob": "1979-02-11",
        "gender": "Male",
        "nationality": "Indian",
        "id_document_type": "PASSPORT",
        "id_document_number": "A8892104",
        "address": "Al-Rigga Tower 8, Deira, Dubai, UAE",
        "primary_case_id": "CASE-041",
        "region_id": "REG-MUM",
        "risk_level": "High"
    },
    {
        "person_id": "PER-112",
        "full_name": "Meera Joshi",
        "aliases": "Meera M",
        "role_designation": "Mule Recruiter & Campus Agent",
        "dob": "2000-07-09",
        "gender": "Female",
        "nationality": "Indian",
        "id_document_type": "AADHAAR",
        "id_document_number": "XXXX-XXXX-1172",
        "address": "Hostel Block 4, North Campus, New Delhi",
        "primary_case_id": "CASE-018",
        "region_id": "REG-NCR",
        "risk_level": "Medium"
    },
    {
        "person_id": "PER-113",
        "full_name": "Imran Qureshi",
        "aliases": "Driver Imran",
        "role_designation": "Cash Courier & Vehicle Driver",
        "dob": "1993-04-03",
        "gender": "Male",
        "nationality": "Indian",
        "id_document_type": "DRIVING_LICENSE",
        "id_document_number": "MH01-2018-00912",
        "address": "Chawl 9, Kurla West, Mumbai, Maharashtra",
        "primary_case_id": "CASE-041",
        "region_id": "REG-MUM",
        "risk_level": "Medium"
    },
    {
        "person_id": "PER-114",
        "full_name": "Ramesh Chandra",
        "aliases": "",
        "role_designation": "Dormant Account Holder / ID Theft Victim",
        "dob": "1968-11-22",
        "gender": "Male",
        "nationality": "Indian",
        "id_document_type": "VOTER_ID",
        "id_document_number": "DL/04/052/190822",
        "address": "Village Kheri, Jhajjar, Haryana",
        "primary_case_id": "CASE-018",
        "region_id": "REG-NCR",
        "risk_level": "Low"
    },
    {
        "person_id": "PER-115",
        "full_name": "Sunita Rao",
        "aliases": "",
        "role_designation": "Nominee Director / Shell Strawperson",
        "dob": "1989-08-14",
        "gender": "Female",
        "nationality": "Indian",
        "id_document_type": "AADHAAR",
        "id_document_number": "XXXX-XXXX-4432",
        "address": "Room 10, Ganesh Nagar, Wadala, Mumbai, Maharashtra",
        "primary_case_id": "CASE-041",
        "region_id": "REG-MUM",
        "risk_level": "Medium"
    }
]

# D. phones.csv
phones = [
    {"phone_id": "PH-1001", "phone_number": "+919811001122", "imei": "358941098234111", "imsi": "404450198234111", "carrier": "Airtel", "registered_owner_id": "PER-101", "status": "Active", "activated_date": "2025-01-10"},
    {"phone_id": "PH-1002", "phone_number": "+919811002233", "imei": "358941098234222", "imsi": "404450198234222", "carrier": "Reliance Jio", "registered_owner_id": "PER-102", "status": "Active", "activated_date": "2025-03-15"},
    {"phone_id": "PH-1003", "phone_number": "+919820003344", "imei": "358941098234333", "imsi": "404200198234333", "carrier": "Vodafone Idea", "registered_owner_id": "PER-103", "status": "Active", "activated_date": "2024-06-20"},
    {"phone_id": "PH-1004", "phone_number": "+919811004455", "imei": "358941098234444", "imsi": "404450198234444", "carrier": "Airtel", "registered_owner_id": "PER-104", "status": "Active", "activated_date": "2026-02-01"},
    {"phone_id": "PH-1005", "phone_number": "+919820005566", "imei": "358941098234555", "imsi": "404200198234555", "carrier": "Reliance Jio", "registered_owner_id": "PER-105", "status": "Active", "activated_date": "2023-11-10"},
    {"phone_id": "PH-1006", "phone_number": "+919820006677", "imei": "358941098234666", "imsi": "404200198234666", "carrier": "Vodafone Idea", "registered_owner_id": "PER-106", "status": "Active", "activated_date": "2025-04-12"},
    {"phone_id": "PH-1007", "phone_number": "+919820007788", "imei": "358941098234777", "imsi": "404200198234777", "carrier": "Airtel", "registered_owner_id": "PER-107", "status": "Active", "activated_date": "2024-08-19"},
    {"phone_id": "PH-1008", "phone_number": "+919810011808", "imei": "358941098234888", "imsi": "404450198234888", "carrier": "Reliance Jio", "registered_owner_id": "PER-108", "status": "Active", "activated_date": "2022-05-10"},
    {"phone_id": "PH-1009", "phone_number": "+919810011909", "imei": "358941098234999", "imsi": "404450198234999", "carrier": "Airtel", "registered_owner_id": "PER-109", "status": "Active", "activated_date": "2023-01-14"},
    {"phone_id": "PH-1010", "phone_number": "+919811000010", "imei": "358941098234010", "imsi": "404450198234010", "carrier": "BSNL", "registered_owner_id": "PER-110", "status": "Active", "activated_date": "2025-09-01"},
    {"phone_id": "PH-1011", "phone_number": "+971501234567", "imei": "358941098234011", "imsi": "424020198234011", "carrier": "Etisalat", "registered_owner_id": "PER-111", "status": "Active", "activated_date": "2024-01-01"},
    {"phone_id": "PH-1012", "phone_number": "+919811001212", "imei": "358941098234012", "imsi": "404450198234012", "carrier": "Reliance Jio", "registered_owner_id": "PER-112", "status": "Active", "activated_date": "2026-01-15"},
    {"phone_id": "PH-1013", "phone_number": "+919820001313", "imei": "358941098234013", "imsi": "404200198234013", "carrier": "Airtel", "registered_owner_id": "PER-113", "status": "Active", "activated_date": "2025-05-18"},
    {"phone_id": "PH-1014", "phone_number": "+919811001414", "imei": "358941098234014", "imsi": "404450198234014", "carrier": "BSNL", "registered_owner_id": "PER-114", "status": "Suspended", "activated_date": "2023-08-01"},
    {"phone_id": "PH-9908", "phone_number": "+919811009988", "imei": "358941098239908", "imsi": "404450198239908", "carrier": "Reliance Jio", "registered_owner_id": "", "status": "Active", "activated_date": "2026-06-01"}
]

# E. accounts.csv
accounts = [
    {"account_id": "ACC-1001", "account_number": "1009823411", "bank_name": "Apex Global Bank", "branch": "Cyber City Gurugram", "ifsc_code": "AGBL0001092", "account_holder_id": "PER-108", "account_type": "Current", "balance": "45230000.00", "status": "Active", "opened_date": "2021-04-10"},
    {"account_id": "ACC-2201", "account_number": "9988220144", "bank_name": "Royal Crest Bank", "branch": "Cyber Hub Gurugram", "ifsc_code": "RCBL0001042", "account_holder_id": "PER-104", "account_type": "Savings", "balance": "150000.00", "status": "Frozen", "opened_date": "2026-02-15"},
    {"account_id": "ACC-3301", "account_number": "2233440112", "bank_name": "State Bank of Commerce", "branch": "Nehru Place New Delhi", "ifsc_code": "SBOC0002104", "account_holder_id": "PER-112", "account_type": "Savings", "balance": "42000.00", "status": "Active", "opened_date": "2026-01-20"},
    {"account_id": "ACC-3302", "account_number": "2233440223", "bank_name": "State Bank of Commerce", "branch": "Sector 18 Noida", "ifsc_code": "SBOC0003310", "account_holder_id": "PER-114", "account_type": "Savings", "balance": "12500.00", "status": "Frozen", "opened_date": "2026-03-05"},
    {"account_id": "ACC-3303", "account_number": "5544110334", "bank_name": "Hindustan Mercantile Bank", "branch": "Sector 29 Gurugram", "ifsc_code": "HMBL0004501", "account_holder_id": "PER-101", "account_type": "Current", "balance": "320000.00", "status": "Frozen", "opened_date": "2025-11-12"},
    {"account_id": "ACC-3304", "account_number": "5544110445", "bank_name": "Hindustan Mercantile Bank", "branch": "MI Road Jaipur", "ifsc_code": "HMBL0008802", "account_holder_id": "PER-104", "account_type": "Savings", "balance": "84000.00", "status": "Active", "opened_date": "2026-04-10"},
    {"account_id": "ACC-7701", "account_number": "4455770199", "bank_name": "Imperial Trust Bank", "branch": "Nariman Point Mumbai", "ifsc_code": "ITBL0005511", "account_holder_id": "PER-107", "account_type": "Current", "balance": "18450000.00", "status": "Under_Investigation", "opened_date": "2025-08-20"},
    {"account_id": "ACC-7702", "account_number": "4455770288", "bank_name": "Imperial Trust Bank", "branch": "Bandra West Mumbai", "ifsc_code": "ITBL0005544", "account_holder_id": "PER-103", "account_type": "Current", "balance": "7620000.00", "status": "Active", "opened_date": "2024-10-15"},
    {"account_id": "ACC-7703", "account_number": "6677880199", "bank_name": "Western Coastal Bank", "branch": "Fort Mumbai", "ifsc_code": "WCBL0007812", "account_holder_id": "PER-105", "account_type": "Current", "balance": "39400000.00", "status": "Active", "opened_date": "2023-05-18"},
    {"account_id": "ACC-7704", "account_number": "6677880288", "bank_name": "Western Coastal Bank", "branch": "Crawford Market Mumbai", "ifsc_code": "WCBL0007815", "account_holder_id": "PER-106", "account_type": "Savings", "balance": "540000.00", "status": "Active", "opened_date": "2025-02-11"},
    {"account_id": "ACC-7705", "account_number": "9911220033", "bank_name": "Emirates Gulf National Bank", "branch": "Deira Dubai", "ifsc_code": "EGNB0009911", "account_holder_id": "PER-111", "account_type": "Offshore", "balance": "124000000.00", "status": "Active", "opened_date": "2022-09-01"},
    {"account_id": "ACC-8809", "account_number": "7788990011", "bank_name": "Federal Union Bank", "branch": "Chandni Chowk Delhi", "ifsc_code": "FUBL0003019", "account_holder_id": "", "account_type": "Savings", "balance": "2500000.00", "status": "Frozen", "opened_date": "2026-05-01"}
]

# F. transactions.csv
transactions = [
    # Event 1: 09 June 2026 - Initial Heist
    {"transaction_id": "TXN-1001", "sender_account_id": "ACC-1001", "receiver_account_id": "ACC-2201", "amount": "10000000.00", "currency": "INR", "transaction_type": "RTGS", "channel": "Corporate NetBanking", "timestamp": "2026-06-09 14:10:00", "reference_narration": "Vendor Invoice Clearance Ref ZEN-9981", "evidence_id": "EVD-001"},
    # Mule Layering (Event 2 Part 1)
    {"transaction_id": "TXN-1002", "sender_account_id": "ACC-2201", "receiver_account_id": "ACC-3301", "amount": "2000000.00", "currency": "INR", "transaction_type": "IMPS", "channel": "Mobile Banking", "timestamp": "2026-06-09 14:35:00", "reference_narration": "Sub-disbursement Batch A1", "evidence_id": "EVD-001"},
    {"transaction_id": "TXN-1003", "sender_account_id": "ACC-2201", "receiver_account_id": "ACC-3302", "amount": "2000000.00", "currency": "INR", "transaction_type": "IMPS", "channel": "Mobile Banking", "timestamp": "2026-06-09 14:40:00", "reference_narration": "Sub-disbursement Batch A2", "evidence_id": "EVD-001"},
    {"transaction_id": "TXN-1004", "sender_account_id": "ACC-2201", "receiver_account_id": "ACC-3303", "amount": "2000000.00", "currency": "INR", "transaction_type": "NEFT", "channel": "Mobile Banking", "timestamp": "2026-06-09 14:45:00", "reference_narration": "Sub-disbursement Batch A3", "evidence_id": "EVD-001"},
    {"transaction_id": "TXN-1005", "sender_account_id": "ACC-2201", "receiver_account_id": "ACC-3304", "amount": "1500000.00", "currency": "INR", "transaction_type": "IMPS", "channel": "Mobile Banking", "timestamp": "2026-06-09 14:50:00", "reference_narration": "Sub-disbursement Batch A4", "evidence_id": "EVD-001"},
    {"transaction_id": "TXN-1006", "sender_account_id": "ACC-2201", "receiver_account_id": "ACC-8809", "amount": "2500000.00", "currency": "INR", "transaction_type": "RTGS", "channel": "NetBanking", "timestamp": "2026-06-09 14:55:00", "reference_narration": "Consulting settlement", "evidence_id": "EVD-001"},
    # Aggregation to Broker Devrat Sharma (Event 2 Part 2: 11 June)
    {"transaction_id": "TXN-1007", "sender_account_id": "ACC-3301", "receiver_account_id": "ACC-7702", "amount": "1800000.00", "currency": "INR", "transaction_type": "NEFT", "channel": "Internet Banking", "timestamp": "2026-06-11 10:15:00", "reference_narration": "Advisory commission trf", "evidence_id": "EVD-003"},
    {"transaction_id": "TXN-1008", "sender_account_id": "ACC-3302", "receiver_account_id": "ACC-7702", "amount": "1900000.00", "currency": "INR", "transaction_type": "NEFT", "channel": "Internet Banking", "timestamp": "2026-06-11 10:25:00", "reference_narration": "Professional fees clearing", "evidence_id": "EVD-003"},
    {"transaction_id": "TXN-1009", "sender_account_id": "ACC-3303", "receiver_account_id": "ACC-7702", "amount": "1900000.00", "currency": "INR", "transaction_type": "RTGS", "channel": "Corporate Banking", "timestamp": "2026-06-11 10:40:00", "reference_narration": "Investment return tranche 1", "evidence_id": "EVD-003"},
    {"transaction_id": "TXN-1010", "sender_account_id": "ACC-3304", "receiver_account_id": "ACC-7702", "amount": "1400000.00", "currency": "INR", "transaction_type": "IMPS", "channel": "Mobile Banking", "timestamp": "2026-06-11 11:00:00", "reference_narration": "Settlement dev", "evidence_id": "EVD-003"},
    # Event 3: Cross-Case Bridge (TXN_552 on 07 August 2026 linking Case 018 to Case 041)
    {"transaction_id": "TXN-1011", "sender_account_id": "ACC-7702", "receiver_account_id": "ACC-7701", "amount": "5000000.00", "currency": "INR", "transaction_type": "RTGS", "channel": "NetBanking", "timestamp": "2026-08-07 15:30:00", "reference_narration": "Trade advances Apex Trade Ref TXN_552", "evidence_id": "EVD-002"},
    # Hawala & Offshore Integration
    {"transaction_id": "TXN-1012", "sender_account_id": "ACC-7701", "receiver_account_id": "ACC-7703", "amount": "4500000.00", "currency": "INR", "transaction_type": "RTGS", "channel": "Corporate Banking", "timestamp": "2026-08-07 17:15:00", "reference_narration": "Logistics settlement invoice 8891", "evidence_id": "EVD-002"},
    {"transaction_id": "TXN-1013", "sender_account_id": "ACC-7703", "receiver_account_id": "ACC-7705", "amount": "100000000.00", "currency": "INR", "transaction_type": "SWIFT", "channel": "Treasury Wire", "timestamp": "2026-08-10 12:00:00", "reference_narration": "Bullion import LC 44102 Dubai", "evidence_id": "EVD-002"},
    {"transaction_id": "TXN-1014", "sender_account_id": "ACC-7703", "receiver_account_id": "ACC-7704", "amount": "800000.00", "currency": "INR", "transaction_type": "IMPS", "channel": "Mobile Banking", "timestamp": "2026-08-10 14:20:00", "reference_narration": "Local operational disbursement", "evidence_id": "EVD-002"}
]

# G. cdr.csv
cdr = [
    {"cdr_id": "CDR-1001", "caller_phone_id": "PH-1002", "receiver_phone_id": "PH-1001", "call_timestamp": "2026-06-09 11:05:00", "duration_seconds": 245, "call_type": "VOICE", "cell_tower_id": "T-4401", "location_id": "LOC-102", "reference_evidence_id": "EVD-003"},
    {"cdr_id": "CDR-1002", "caller_phone_id": "PH-1001", "receiver_phone_id": "PH-1003", "call_timestamp": "2026-06-09 11:20:00", "duration_seconds": 410, "call_type": "VOICE", "cell_tower_id": "T-4401", "location_id": "LOC-101", "reference_evidence_id": "EVD-003"},
    {"cdr_id": "CDR-1003", "caller_phone_id": "PH-1003", "receiver_phone_id": "PH-1004", "call_timestamp": "2026-06-09 13:45:00", "duration_seconds": 180, "call_type": "VOICE", "cell_tower_id": "T-4401", "location_id": "LOC-103", "reference_evidence_id": "EVD-003"},
    {"cdr_id": "CDR-1004", "caller_phone_id": "PH-1002", "receiver_phone_id": "PH-1008", "call_timestamp": "2026-06-09 14:15:00", "duration_seconds": 312, "call_type": "VOICE", "cell_tower_id": "T-4401", "location_id": "LOC-102", "reference_evidence_id": "EVD-003"},
    {"cdr_id": "CDR-1005", "caller_phone_id": "PH-9908", "receiver_phone_id": "PH-1003", "call_timestamp": "2026-06-09 14:50:00", "duration_seconds": 95, "call_type": "VOICE", "cell_tower_id": "T-4401", "location_id": "LOC-104", "reference_evidence_id": "EVD-003"},
    {"cdr_id": "CDR-1006", "caller_phone_id": "PH-1003", "receiver_phone_id": "PH-1012", "call_timestamp": "2026-06-09 15:10:00", "duration_seconds": 145, "call_type": "VOICE", "cell_tower_id": "T-4401", "location_id": "LOC-103", "reference_evidence_id": "EVD-003"},
    {"cdr_id": "CDR-1007", "caller_phone_id": "PH-1001", "receiver_phone_id": "PH-1003", "call_timestamp": "2026-06-11 09:30:00", "duration_seconds": 520, "call_type": "VOICE", "cell_tower_id": "T-4401", "location_id": "LOC-101", "reference_evidence_id": "EVD-003"},
    {"cdr_id": "CDR-1008", "caller_phone_id": "PH-1003", "receiver_phone_id": "PH-1005", "call_timestamp": "2026-06-11 12:00:00", "duration_seconds": 680, "call_type": "VOICE", "cell_tower_id": "T-2001", "location_id": "LOC-202", "reference_evidence_id": "EVD-003"},
    {"cdr_id": "CDR-1009", "caller_phone_id": "PH-1005", "receiver_phone_id": "PH-1007", "call_timestamp": "2026-08-07 14:00:00", "duration_seconds": 310, "call_type": "VOICE", "cell_tower_id": "T-2001", "location_id": "LOC-201", "reference_evidence_id": "EVD-002"},
    {"cdr_id": "CDR-1010", "caller_phone_id": "PH-1003", "receiver_phone_id": "PH-1007", "call_timestamp": "2026-08-07 15:15:00", "duration_seconds": 195, "call_type": "VOICE", "cell_tower_id": "T-2001", "location_id": "LOC-202", "reference_evidence_id": "EVD-002"},
    {"cdr_id": "CDR-1011", "caller_phone_id": "PH-1005", "receiver_phone_id": "PH-1006", "call_timestamp": "2026-08-07 16:30:00", "duration_seconds": 440, "call_type": "VOICE", "cell_tower_id": "T-2001", "location_id": "LOC-201", "reference_evidence_id": "EVD-002"},
    {"cdr_id": "CDR-1012", "caller_phone_id": "PH-1006", "receiver_phone_id": "PH-1013", "call_timestamp": "2026-08-07 17:00:00", "duration_seconds": 120, "call_type": "VOICE", "cell_tower_id": "T-2002", "location_id": "LOC-203", "reference_evidence_id": "EVD-002"},
    {"cdr_id": "CDR-1013", "caller_phone_id": "PH-1005", "receiver_phone_id": "PH-1011", "call_timestamp": "2026-08-09 20:15:00", "duration_seconds": 890, "call_type": "VOICE", "cell_tower_id": "T-2001", "location_id": "LOC-201", "reference_evidence_id": "EVD-002"},
    {"cdr_id": "CDR-1014", "caller_phone_id": "PH-1010", "receiver_phone_id": "PH-9908", "call_timestamp": "2026-05-28 16:10:00", "duration_seconds": 45, "call_type": "SMS", "cell_tower_id": "T-4402", "location_id": "LOC-104", "reference_evidence_id": "EVD-003"}
]

# H. vehicles.csv
vehicles = [
    {"vehicle_id": "VEH-101", "registration_number": "HR26-DK-9011", "make": "Hyundai", "model": "Creta", "color": "Phantom Black", "vehicle_type": "SUV", "owner_id": "PER-101", "last_seen_location_id": "LOC-101", "last_seen_timestamp": "2026-06-09 17:00:00"},
    {"vehicle_id": "VEH-102", "registration_number": "DL01-CS-4421", "make": "Honda", "model": "City", "color": "White Orchid", "vehicle_type": "Sedan", "owner_id": "PER-102", "last_seen_location_id": "LOC-102", "last_seen_timestamp": "2026-06-09 16:30:00"},
    {"vehicle_id": "VEH-103", "registration_number": "MH02-FJ-3301", "make": "Toyota", "model": "Fortuner", "color": "Silver Metallic", "vehicle_type": "SUV", "owner_id": "PER-103", "last_seen_location_id": "LOC-202", "last_seen_timestamp": "2026-08-07 18:00:00"},
    {"vehicle_id": "VEH-104", "registration_number": "MH01-CD-7788", "make": "Mercedes-Benz", "model": "E-Class", "color": "Obsidian Black", "vehicle_type": "Sedan", "owner_id": "PER-105", "last_seen_location_id": "LOC-201", "last_seen_timestamp": "2026-08-07 19:30:00"},
    {"vehicle_id": "VEH-105", "registration_number": "MH03-BW-5512", "make": "Maruti Suzuki", "model": "Ertiga", "color": "Grey", "vehicle_type": "MUV", "owner_id": "PER-106", "last_seen_location_id": "LOC-203", "last_seen_timestamp": "2026-08-07 17:45:00"},
    {"vehicle_id": "VEH-106", "registration_number": "MH01-TR-9122", "make": "Mahindra", "model": "Bolero Maxi Truck", "color": "White", "vehicle_type": "Cash Van", "owner_id": "PER-113", "last_seen_location_id": "LOC-204", "last_seen_timestamp": "2026-08-08 04:30:00"}
]

# I. devices.csv
devices = [
    {"device_id": "DEV-101", "device_type": "Laptop", "make_model": "Lenovo ThinkPad X1 Carbon", "os": "Ubuntu 24.04 LTS", "mac_address": "00:1A:2B:3C:4D:5E", "imei": "", "owner_id": "PER-102", "last_ip": "198.51.100.45", "status": "Seized"},
    {"device_id": "DEV-102", "device_type": "Smartphone", "make_model": "Apple iPhone 15 Pro", "os": "iOS 17.5", "mac_address": "A4:83:E7:12:34:56", "imei": "358941098234111", "owner_id": "PER-101", "last_ip": "203.0.113.88", "status": "Active"},
    {"device_id": "DEV-103", "device_type": "Smartphone", "make_model": "Samsung Galaxy S24 Ultra", "os": "Android 14", "mac_address": "3C:52:82:78:90:12", "imei": "358941098234333", "owner_id": "PER-103", "last_ip": "198.51.100.89", "status": "Active"},
    {"device_id": "DEV-104", "device_type": "Laptop", "make_model": "Apple MacBook Pro 16", "os": "macOS Sonoma", "mac_address": "F0:18:98:AA:BB:CC", "imei": "", "owner_id": "PER-107", "last_ip": "198.51.100.99", "status": "Active"},
    {"device_id": "DEV-105", "device_type": "SIM Box Gateway", "make_model": "Dinstar UC2000-VG 32Port", "os": "Embedded Linux", "mac_address": "00:26:8B:11:22:33", "imei": "", "owner_id": "PER-110", "last_ip": "192.0.2.77", "status": "Seized"},
    {"device_id": "DEV-106", "device_type": "Smartphone", "make_model": "OnePlus 12", "os": "OxygenOS 14", "mac_address": "70:28:8B:55:66:77", "imei": "358941098234555", "owner_id": "PER-105", "last_ip": "203.0.113.150", "status": "Active"}
]

# J. cyber_indicators.csv
cyber_indicators = [
    {"indicator_id": "IND-101", "indicator_type": "IP", "value": "198.51.100.45", "threat_score": 95, "associated_device_id": "DEV-101", "associated_person_id": "PER-102", "first_seen": "2026-05-15 00:00:00", "last_seen": "2026-06-09 14:15:00", "reference_evidence_id": "EVD-001"},
    {"indicator_id": "IND-102", "indicator_type": "DOMAIN", "value": "secure-zenithcorp-auth.com", "threat_score": 98, "associated_device_id": "DEV-101", "associated_person_id": "PER-102", "first_seen": "2026-05-20 10:00:00", "last_seen": "2026-06-10 18:00:00", "reference_evidence_id": "EVD-001"},
    {"indicator_id": "IND-103", "indicator_type": "EMAIL", "value": "ceo-office@zenithcorp-internal.com", "threat_score": 90, "associated_device_id": "DEV-101", "associated_person_id": "PER-102", "first_seen": "2026-06-09 11:15:00", "last_seen": "2026-06-09 11:15:00", "reference_evidence_id": "EVD-001"},
    {"indicator_id": "IND-104", "indicator_type": "IP", "value": "203.0.113.88", "threat_score": 85, "associated_device_id": "DEV-102", "associated_person_id": "PER-101", "first_seen": "2026-06-01 08:00:00", "last_seen": "2026-06-09 15:30:00", "reference_evidence_id": "EVD-001"},
    {"indicator_id": "IND-105", "indicator_type": "IP", "value": "198.51.100.89", "threat_score": 80, "associated_device_id": "DEV-103", "associated_person_id": "PER-103", "first_seen": "2026-06-11 10:00:00", "last_seen": "2026-08-07 16:00:00", "reference_evidence_id": "EVD-002"},
    {"indicator_id": "IND-106", "indicator_type": "DOMAIN", "value": "apextradesolutions-in.com", "threat_score": 75, "associated_device_id": "DEV-104", "associated_person_id": "PER-107", "first_seen": "2025-09-01 12:00:00", "last_seen": "2026-08-15 18:00:00", "reference_evidence_id": "EVD-002"},
    {"indicator_id": "IND-107", "indicator_type": "CRYPTO_WALLET", "value": "0x71C8A991E8832A15B06440212001F99C5D4E89B1", "threat_score": 92, "associated_device_id": "DEV-106", "associated_person_id": "PER-105", "first_seen": "2026-01-10 14:00:00", "last_seen": "2026-08-12 11:30:00", "reference_evidence_id": "EVD-002"}
]

# K. locations.csv
locations = [
    {"location_id": "LOC-101", "label": "Syndicate Safehouse NCR", "address": "Flat 402, Neelkanth Heights, Sector 56", "city": "Gurugram", "state": "Haryana", "country": "India", "latitude": "28.4312", "longitude": "77.0984"},
    {"location_id": "LOC-102", "label": "Tech Server Hideout", "address": "House 112, Block B, Sushant Lok", "city": "Gurugram", "state": "Haryana", "country": "India", "latitude": "28.4601", "longitude": "77.0725"},
    {"location_id": "LOC-103", "label": "Mule Drop Location", "address": "Room 14, Chawl No 3, Mahipalpur", "city": "New Delhi", "state": "Delhi", "country": "India", "latitude": "28.5492", "longitude": "77.1213"},
    {"location_id": "LOC-104", "label": "Illegal SIM Box Facility", "address": "Plot 88, Udyog Vihar Phase 4", "city": "Gurugram", "state": "Haryana", "country": "India", "latitude": "28.5021", "longitude": "77.0811"},
    {"location_id": "LOC-105", "label": "Zenith Corp Headquarters", "address": "Tower C, Cyber City Phase II", "city": "Gurugram", "state": "Haryana", "country": "India", "latitude": "28.4952", "longitude": "77.0891"},
    {"location_id": "LOC-201", "label": "Hawala Operations Head Office", "address": "Penthouse 22, Ocean Crest, Worli", "city": "Mumbai", "state": "Maharashtra", "country": "India", "latitude": "19.0144", "longitude": "72.8179"},
    {"location_id": "LOC-202", "label": "Broker Financial Suite", "address": "Flat 1204, Sea Breeze Towers, Bandra West", "city": "Mumbai", "state": "Maharashtra", "country": "India", "latitude": "19.0596", "longitude": "72.8295"},
    {"location_id": "LOC-203", "label": "Apex Trade Shell Office", "address": "Unit 412, Nariman Bhavan, Nariman Point", "city": "Mumbai", "state": "Maharashtra", "country": "India", "latitude": "18.9281", "longitude": "72.8228"},
    {"location_id": "LOC-204", "label": "Cash Transshipment Godown", "address": "Plot 14B, Kurla Industrial Estate", "city": "Mumbai", "state": "Maharashtra", "country": "India", "latitude": "19.0726", "longitude": "72.8845"},
    {"location_id": "LOC-301", "label": "Overseas Bullion Clearing", "address": "Al-Rigga Tower 8, Deira", "city": "Dubai", "state": "Dubai", "country": "UAE", "latitude": "25.2631", "longitude": "55.3214"}
]

# L. evidence.csv
evidence = [
    {
        "evidence_id": "EVD-001",
        "case_id": "CASE-018",
        "title": "Police FIR & Technical Cyber Incident Report",
        "file_name": "FIR_2026_018_PhishNet.txt",
        "file_type": "text/plain",
        "storage_path": "evidence/CASE-018/FIR_2026_018_PhishNet.txt",
        "sha256_hash": computed_hashes["FIR_2026_018_PhishNet.txt"],
        "source_type": "Police FIR & Victim Report",
        "uploaded_by": "INV-NCR-101",
        "uploaded_at": "2026-06-09 18:45:00",
        "verified": True,
        "fabric_tx_id": "fabric-tx-ncr-88190204",
        "summary_record": "Initial formal complaint by CFO Vikramaditya Rathore detailing unauthorized INR 1.0 Cr RTGS debit and phishing indicators."
    },
    {
        "evidence_id": "EVD-002",
        "case_id": "CASE-041",
        "title": "Financial Intelligence Unit STR & KYC Audit Report",
        "file_name": "Bank_STR_Advisory_ApexTrade.txt",
        "file_type": "text/plain",
        "storage_path": "evidence/CASE-041/Bank_STR_Advisory_ApexTrade.txt",
        "sha256_hash": computed_hashes["Bank_STR_Advisory_ApexTrade.txt"],
        "source_type": "FIU Suspicious Transaction Report",
        "uploaded_by": "INV-MUM-204",
        "uploaded_at": "2026-08-08 11:30:00",
        "verified": True,
        "fabric_tx_id": "fabric-tx-mum-44910212",
        "summary_record": "Banking advisory highlighting INR 50L transfer (TXN_552) from Devrat Sharma into shell firm Apex Trade Solutions and instant cash layering."
    },
    {
        "evidence_id": "EVD-003",
        "case_id": "CASE-018",
        "title": "Telephony Cell Tower Dump - Sector 44 Gurugram",
        "file_name": "Telecom_CDR_TowerDump_T4401.csv",
        "file_type": "text/csv",
        "storage_path": "evidence/CASE-018/Telecom_CDR_TowerDump_T4401.csv",
        "sha256_hash": computed_hashes["Telecom_CDR_TowerDump_T4401.csv"],
        "source_type": "Telecom Regulatory CDR Extraction",
        "uploaded_by": "INV-NCR-102",
        "uploaded_at": "2026-06-12 14:00:00",
        "verified": True,
        "fabric_tx_id": "fabric-tx-ncr-99201411",
        "summary_record": "Nodal tower extraction confirming suspect telephony interactions and contradicting suspect Rajesh Verma alibi."
    }
]

# Write all CSV files
csv_exports = [
    ("cases.csv", cases),
    ("people.csv", people),
    ("phones.csv", phones),
    ("accounts.csv", accounts),
    ("transactions.csv", transactions),
    ("cdr.csv", cdr),
    ("vehicles.csv", vehicles),
    ("devices.csv", devices),
    ("cyber_indicators.csv", cyber_indicators),
    ("locations.csv", locations),
    ("evidence.csv", evidence)
]

for filename, dataset in csv_exports:
    target_path = os.path.join(SYNTHETIC_DIR, filename)
    with open(target_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=list(dataset[0].keys()))
        writer.writeheader()
        writer.writerows(dataset)
    print(f"Wrote {target_path} ({len(dataset)} records)")

# -----------------------------------------------------------------------------
# 3. GROUND TRUTH JSON
# -----------------------------------------------------------------------------

ground_truth = {
    "project": "CrimeNexus (SIH26189)",
    "version": "1.0.0",
    "description": "Master investigation ground truth mapping synthetic criminal network, hidden cross-case links, bridge brokers, contradictions, and gaps.",
    "cases_overview": [
        {
            "case_id": "CASE-018",
            "name": "Operation PhishNet",
            "jurisdiction": "REG-NCR (Gurugram / Delhi)",
            "primary_focus": "Spear-phishing credential harvesting, corporate CEO fraud, mule account dispersal."
        },
        {
            "case_id": "CASE-041",
            "name": "Operation ShadowLedge",
            "jurisdiction": "REG-MUM (Mumbai)",
            "primary_focus": "Hawala layering, trade-based money laundering (TBML), shell companies, offshore UAE transfers."
        },
        {
            "case_id": "CASE-059",
            "name": "Operation DarkSIM",
            "jurisdiction": "REG-NCR (Gurugram)",
            "primary_focus": "SIM box gateways, automated SMS spoofing, fraudulent identity pre-activated SIM lines."
        }
    ],
    "network_communities": {
        "community_1_cyber_phishing": {
            "name": "NCR Cyber Phishing Syndicate",
            "primary_case": "CASE-018",
            "members": ["PER-101", "PER-102", "PER-104", "PER-112", "PER-114"],
            "description": "Orchestrates technical infrastructure (Kunal DEV-101), impersonation calls, and campus student mule recruitment (Meera PER-112)."
        },
        "community_2_hawala_laundering": {
            "name": "Mumbai Trade & Hawala Ring",
            "primary_case": "CASE-041",
            "members": ["PER-105", "PER-106", "PER-107", "PER-111", "PER-113", "PER-115"],
            "description": "Operates front company Apex Trade Solutions (Anita PER-107), cash logistics couriers (Sameer PER-106, Imran PER-113), and Dubai bullion conduit (Farooq PER-111)."
        },
        "community_3_telecom_infrastructure": {
            "name": "NCR Rogue Telecom Hub",
            "primary_case": "CASE-059",
            "members": ["PER-110"],
            "description": "Operates multi-port SIM box equipment supplying burner MSISDNs like PH-9908 to cyber operatives."
        }
    },
    "bridge_nodes": [
        {
            "person_id": "PER-103",
            "name": "Devrat Sharma",
            "alias": "The Accountant / Broker D",
            "role": "Strategic Money Broker & Mule Manager",
            "centrality_role": "High betweenness centrality broker bridging NCR cyber syndicate (Case 018) with Mumbai hawala ring (Case 041).",
            "bridge_evidence": [
                {
                    "relationship": "Collects funds from Case 018 mule accounts (TXN-1007, 1008, 1009, 1010) on 11-JUN-2026 into ACC-7702.",
                    "cross_case_bridge_transfer": "Transfers INR 50,00,000 via TXN_552 (TXN-1011) on 07-AUG-2026 into Apex Trade Solutions ACC-7701 (Case 041).",
                    "telephony_bridge": "Calls Tariq Merchant PH-1005 (CDR-1008) and Anita D'Souza PH-1007 (CDR-1010)."
                }
            ]
        }
    ],
    "chronological_reconstruction_events": [
        {
            "event_number": 1,
            "timestamp": "2026-06-09 14:10:00",
            "case_id": "CASE-018",
            "narration": "Unauthorized spear-phishing RTGS transfer: Zenith Corporate account ACC-1001 debited for INR 1,00,00,000 into Suman Roy mule account ACC-2201.",
            "evidence_reference": "EVD-001 (Record #1 / TXN-1001)",
            "graph_delta": ["Node: PER-108", "Node: ACC-1001", "Node: PER-104", "Node: ACC-2201", "Edge: ACC-1001 -[TRANSFERRED]-> ACC-2201"]
        },
        {
            "event_number": 2,
            "timestamp": "2026-06-09 14:35:00 - 14:55:00",
            "case_id": "CASE-018",
            "narration": "Layering tranche: Account ACC-2201 disperses INR 1.0 Crore across five secondary accounts (ACC-3301, ACC-3302, ACC-3303, ACC-3304, ACC-8809).",
            "evidence_reference": "EVD-001 (TXN-1002 through TXN-1006)",
            "graph_delta": ["Nodes: ACC-3301..ACC-8809", "Edges: TRANSFERRED to all 5 mule accounts"]
        },
        {
            "event_number": 3,
            "timestamp": "2026-06-11 10:15:00 - 11:00:00",
            "case_id": "CASE-018",
            "narration": "Aggregation: Mule accounts transfer INR 70,00,000 into Broker Devrat Sharma's account ACC-7702.",
            "evidence_reference": "EVD-003 (TXN-1007 through TXN-1010)",
            "graph_delta": ["Node: PER-103", "Node: ACC-7702", "Edges: Mule accounts -[TRANSFERRED]-> ACC-7702"]
        },
        {
            "event_number": 4,
            "timestamp": "2026-06-11 12:00:00",
            "case_id": "CASE-018 / CASE-041",
            "narration": "Telephony cross-connect: Devrat Sharma (Gurugram/Mumbai) coordinates with Hawala operative Tariq Merchant in Mumbai.",
            "evidence_reference": "EVD-003 (CDR-1008)",
            "graph_delta": ["Edge: PH-1003 -[CALLED]-> PH-1005"]
        },
        {
            "event_number": 5,
            "timestamp": "2026-08-07 15:30:00",
            "case_id": "CASE-018 -> CASE-041",
            "narration": "Signature Cross-Case Link: Devrat Sharma executes TXN_552 sending INR 50,00,000 to shell company Apex Trade Solutions (ACC-7701).",
            "evidence_reference": "EVD-002 (TXN-1011 / Record #552)",
            "graph_delta": ["Edge: ACC-7702 -[TRANSFERRED]-> ACC-7701 (Crosses Case 018 to Case 041)"]
        },
        {
            "event_number": 6,
            "timestamp": "2026-08-07 17:15:00",
            "case_id": "CASE-041",
            "narration": "Rapid shell dissipation: Anita D'Souza routes INR 45,00,000 from Apex Trade ACC-7701 to Tariq Merchant ACC-7703.",
            "evidence_reference": "EVD-002 (TXN-1012)",
            "graph_delta": ["Edge: ACC-7701 -[TRANSFERRED]-> ACC-7703"]
        },
        {
            "event_number": 7,
            "timestamp": "2026-08-10 12:00:00",
            "case_id": "CASE-041",
            "narration": "Offshore Hawala exit: Tariq Merchant transfers INR 10,00,00,000 via SWIFT wire to Farooq Sheikh in Dubai for bullion clearing.",
            "evidence_reference": "EVD-002 (TXN-1013)",
            "graph_delta": ["Node: PER-111", "Node: ACC-7705", "Edge: ACC-7703 -[TRANSFERRED]-> ACC-7705"]
        }
    ],
    "intentional_contradictions": [
        {
            "contradiction_id": "CONTRA-01",
            "title": "Alibi Contradiction - Rajesh Verma Physical Location",
            "entity_id": "PER-101",
            "description": "In written police interrogation statement, suspect Rajesh Verma stated he was in Mumbai attending a wedding during the heist on 09-JUN-2026. However, CDR-1002 and CDR-1007 record his phone PH-1001 connected to Cell Tower T-4401 in Gurugram Sector 44 during the exact commission of the wire fraud.",
            "conflicting_sources": [
                {"source": "Interrogation Statement", "claim": "Present in Mumbai, Maharashtra"},
                {"source": "CDR Extraction EVD-003 / Record CDR-1002", "claim": "Active on Tower T-4401 Sector 44 Gurugram at 11:20:00 IST"}
            ],
            "investigative_action": "Issue formal request for cell tower triangulation and CCTV retrieval at Sector 44 intersection."
        },
        {
            "contradiction_id": "CONTRA-02",
            "title": "Beneficiary Account KYC vs. NetBanking Login IP",
            "entity_id": "ACC-3304",
            "description": "Beneficiary account ACC-3304 is registered under branch MI Road Jaipur with residential address in Rajasthan. However, web transaction authentication IP 203.0.113.88 maps directly to cyber hideout LOC-101 / LOC-102 in Gurugram/Noida.",
            "conflicting_sources": [
                {"source": "Bank KYC Record", "claim": "Resident in Jaipur, Rajasthan"},
                {"source": "Cyber Indicator IND-104 & Core Banking Session Log", "claim": "Originating IP 203.0.113.88 (Noida / NCR subnet)"}
            ],
            "investigative_action": "Subpoena ISP session logs and examine remote desktop / proxy tool usage on DEV-102."
        }
    ],
    "investigation_gaps": [
        {
            "gap_id": "GAP-01",
            "title": "Unidentified Beneficiary Account Owner",
            "entity_id": "ACC-8809",
            "description": "Account ACC-8809 at Federal Union Bank received INR 25,00,000 from the initial heist proceeds (TXN-1006). The account_holder_id is NULL as the account was opened using forged voter identification that does not correspond to any verified national identity.",
            "status": "Unresolved Missing Link",
            "recommended_step": "Issue Section 91 CrPC / Section 94 BNSS notice to Federal Union Bank for branch video CCTV and account opening biometric logs."
        },
        {
            "gap_id": "GAP-02",
            "title": "Unattributed Burner Phone Number in Heist Coordination",
            "entity_id": "PH-9908",
            "description": "MSISDN +919811009988 had multiple short-duration calls with broker Devrat Sharma (CDR-1005) immediately after fund transfers, and received activation SMS from SIM box DEV-105 (CDR-1014). The registered_owner_id is NULL.",
            "status": "Unresolved Link to SIM Box Ring",
            "recommended_step": "Cross-reference IMEI 358941098239908 against seized inventory in Case 059 (Operation DarkSIM)."
        }
    ],
    "legal_provisions_mapping": {
        "IT_Act_2000": [
            {"section": "Section 66C", "description": "Identity theft - unauthorized use of electronic signature, password, or unique identification feature."},
            {"section": "Section 66D", "description": "Cheating by personation by using computer resource or communication device."}
        ],
        "Bharatiya_Nyaya_Sanhita_2023": [
            {"section": "Section 318(4)", "description": "Cheating and dishonestly inducing delivery of property (formerly IPC Section 420)."},
            {"section": "Section 61(2)", "description": "Criminal conspiracy to commit punishable offences (formerly IPC Section 120B)."}
        ],
        "PMLA_2002": [
            {"section": "Section 3 & Section 4", "description": "Offence of money-laundering and punishment - projection of tainted property and proceeds of crime as untainted property through layering."}
        ]
    }
}

with open(os.path.join(SYNTHETIC_DIR, "ground_truth.json"), "w", encoding="utf-8") as f:
    json.dump(ground_truth, f, indent=2)
print("Wrote synthetic_data/ground_truth.json")

# -----------------------------------------------------------------------------
# 4. DATABASE SCHEMA (PostgreSQL / Supabase + Row-Level Security)
# -----------------------------------------------------------------------------

schema_sql = """-- ============================================================================
-- CrimeNexus (SIH26189) - Supabase PostgreSQL Database Schema
-- Architecture: Supabase Application Data Platform + Dedicated Knowledge Graph
-- Includes: Multi-region isolation, Row-Level Security (RLS), and Audit Trail
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------------------------------
-- 1. REGIONS & ACCESS CONTROL
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS regions (
    region_id VARCHAR(32) PRIMARY KEY,
    region_name VARCHAR(128) NOT NULL,
    state VARCHAR(64) NOT NULL,
    jurisdiction_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS investigators (
    investigator_id VARCHAR(32) PRIMARY KEY,
    region_id VARCHAR(32) NOT NULL REFERENCES regions(region_id),
    badge_number VARCHAR(64) NOT NULL UNIQUE,
    full_name VARCHAR(128) NOT NULL,
    email VARCHAR(128) NOT NULL UNIQUE,
    role VARCHAR(64) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 2. INVESTIGATION CASES
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cases (
    case_id VARCHAR(32) PRIMARY KEY,
    case_number VARCHAR(64) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(64) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'Active',
    region_id VARCHAR(32) NOT NULL REFERENCES regions(region_id),
    lead_investigator_id VARCHAR(32) REFERENCES investigators(investigator_id),
    incident_date TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 3. EVIDENCE & REPOSITORY REGISTRATION
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS evidence (
    evidence_id VARCHAR(32) PRIMARY KEY,
    case_id VARCHAR(32) NOT NULL REFERENCES cases(case_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(64) NOT NULL,
    storage_path VARCHAR(512) NOT NULL,
    sha256_hash VARCHAR(64) NOT NULL,
    source_type VARCHAR(128) NOT NULL,
    uploaded_by VARCHAR(32) REFERENCES investigators(investigator_id),
    uploaded_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    verified BOOLEAN DEFAULT TRUE,
    fabric_tx_id VARCHAR(128),
    summary_record TEXT
);

-- -----------------------------------------------------------------------------
-- 4. PHYSICAL & LOGICAL ENTITIES
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS locations (
    location_id VARCHAR(32) PRIMARY KEY,
    label VARCHAR(128) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(64) NOT NULL,
    state VARCHAR(64) NOT NULL,
    country VARCHAR(64) NOT NULL DEFAULT 'India',
    latitude NUMERIC(9, 6),
    longitude NUMERIC(9, 6)
);

CREATE TABLE IF NOT EXISTS people (
    person_id VARCHAR(32) PRIMARY KEY,
    full_name VARCHAR(128) NOT NULL,
    aliases VARCHAR(255),
    role_designation VARCHAR(128),
    dob DATE,
    gender VARCHAR(16),
    nationality VARCHAR(32) DEFAULT 'Indian',
    id_document_type VARCHAR(32),
    id_document_number VARCHAR(64),
    address TEXT,
    primary_case_id VARCHAR(32) REFERENCES cases(case_id),
    region_id VARCHAR(32) NOT NULL REFERENCES regions(region_id),
    risk_level VARCHAR(32) DEFAULT 'Medium',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS phones (
    phone_id VARCHAR(32) PRIMARY KEY,
    phone_number VARCHAR(32) NOT NULL UNIQUE,
    imei VARCHAR(32),
    imsi VARCHAR(32),
    carrier VARCHAR(64),
    registered_owner_id VARCHAR(32) REFERENCES people(person_id),
    status VARCHAR(32) DEFAULT 'Active',
    activated_date DATE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS accounts (
    account_id VARCHAR(32) PRIMARY KEY,
    account_number VARCHAR(64) NOT NULL UNIQUE,
    bank_name VARCHAR(128) NOT NULL,
    branch VARCHAR(128) NOT NULL,
    ifsc_code VARCHAR(32) NOT NULL,
    account_holder_id VARCHAR(32) REFERENCES people(person_id),
    account_type VARCHAR(32) NOT NULL,
    balance NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(32) DEFAULT 'Active',
    opened_date DATE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS transactions (
    transaction_id VARCHAR(32) PRIMARY KEY,
    sender_account_id VARCHAR(32) NOT NULL REFERENCES accounts(account_id),
    receiver_account_id VARCHAR(32) NOT NULL REFERENCES accounts(account_id),
    amount NUMERIC(15, 2) NOT NULL,
    currency VARCHAR(8) DEFAULT 'INR',
    transaction_type VARCHAR(32) NOT NULL,
    channel VARCHAR(64) NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL,
    reference_narration TEXT,
    evidence_id VARCHAR(32) REFERENCES evidence(evidence_id)
);

CREATE TABLE IF NOT EXISTS cdr (
    cdr_id VARCHAR(32) PRIMARY KEY,
    caller_phone_id VARCHAR(32) NOT NULL REFERENCES phones(phone_id),
    receiver_phone_id VARCHAR(32) NOT NULL REFERENCES phones(phone_id),
    call_timestamp TIMESTAMPTZ NOT NULL,
    duration_seconds INTEGER NOT NULL,
    call_type VARCHAR(16) NOT NULL DEFAULT 'VOICE',
    cell_tower_id VARCHAR(32) NOT NULL,
    location_id VARCHAR(32) REFERENCES locations(location_id),
    reference_evidence_id VARCHAR(32) REFERENCES evidence(evidence_id)
);

CREATE TABLE IF NOT EXISTS vehicles (
    vehicle_id VARCHAR(32) PRIMARY KEY,
    registration_number VARCHAR(32) NOT NULL UNIQUE,
    make VARCHAR(64) NOT NULL,
    model VARCHAR(64) NOT NULL,
    color VARCHAR(32) NOT NULL,
    vehicle_type VARCHAR(32) NOT NULL,
    owner_id VARCHAR(32) REFERENCES people(person_id),
    last_seen_location_id VARCHAR(32) REFERENCES locations(location_id),
    last_seen_timestamp TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS devices (
    device_id VARCHAR(32) PRIMARY KEY,
    device_type VARCHAR(64) NOT NULL,
    make_model VARCHAR(128) NOT NULL,
    os VARCHAR(64),
    mac_address VARCHAR(32),
    imei VARCHAR(32),
    owner_id VARCHAR(32) REFERENCES people(person_id),
    last_ip VARCHAR(64),
    status VARCHAR(32) DEFAULT 'Active'
);

CREATE TABLE IF NOT EXISTS cyber_indicators (
    indicator_id VARCHAR(32) PRIMARY KEY,
    indicator_type VARCHAR(32) NOT NULL, -- 'IP', 'DOMAIN', 'EMAIL', 'CRYPTO_WALLET'
    value VARCHAR(255) NOT NULL,
    threat_score INTEGER CHECK (threat_score BETWEEN 0 AND 100),
    associated_device_id VARCHAR(32) REFERENCES devices(device_id),
    associated_person_id VARCHAR(32) REFERENCES people(person_id),
    first_seen TIMESTAMPTZ,
    last_seen TIMESTAMPTZ,
    reference_evidence_id VARCHAR(32) REFERENCES evidence(evidence_id)
);

-- Cross-case entity junction table
CREATE TABLE IF NOT EXISTS case_entities (
    id SERIAL PRIMARY KEY,
    case_id VARCHAR(32) NOT NULL REFERENCES cases(case_id) ON DELETE CASCADE,
    entity_type VARCHAR(32) NOT NULL,
    entity_id VARCHAR(32) NOT NULL,
    relation_role VARCHAR(64),
    confidence NUMERIC(4, 2) DEFAULT 1.00,
    flagged_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(case_id, entity_type, entity_id)
);

-- Tamper-evident Audit Trail
CREATE TABLE IF NOT EXISTS audit_logs (
    audit_id VARCHAR(32) PRIMARY KEY,
    case_id VARCHAR(32) REFERENCES cases(case_id),
    evidence_id VARCHAR(32) REFERENCES evidence(evidence_id),
    action_type VARCHAR(64) NOT NULL, -- 'UPLOAD', 'ACCESS', 'VERIFY', 'RECONSTRUCT', 'EXPORT'
    performed_by VARCHAR(32) REFERENCES investigators(investigator_id),
    region_id VARCHAR(32) NOT NULL REFERENCES regions(region_id),
    details JSONB,
    sha256_hash VARCHAR(64),
    fabric_block_id VARCHAR(64),
    fabric_tx_id VARCHAR(128),
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 5. INDEXES FOR HIGH-VELOCITY SEARCH
-- -----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_cases_region ON cases(region_id);
CREATE INDEX IF NOT EXISTS idx_people_region ON people(region_id);
CREATE INDEX IF NOT EXISTS idx_phones_msisdn ON phones(phone_number);
CREATE INDEX IF NOT EXISTS idx_accounts_number ON accounts(account_number);
CREATE INDEX IF NOT EXISTS idx_txn_timestamp ON transactions(timestamp);
CREATE INDEX IF NOT EXISTS idx_cdr_timestamp ON cdr(call_timestamp);
CREATE INDEX IF NOT EXISTS idx_indicators_value ON cyber_indicators(value);
CREATE INDEX IF NOT EXISTS idx_evidence_sha256 ON evidence(sha256_hash);

-- -----------------------------------------------------------------------------
-- 6. SUPABASE ROW LEVEL SECURITY (RLS) POLICIES
-- -----------------------------------------------------------------------------
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE people ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Regional Isolation
-- Note: In Supabase production, auth.jwt() ->> 'region_id' provides the active investigator region.
CREATE POLICY regional_cases_isolation ON cases
    FOR ALL
    USING (
        region_id = COALESCE(current_setting('request.jwt.claim.region_id', true), region_id)
        OR current_setting('request.jwt.claim.role', true) = 'federal_taskforce'
    );

CREATE POLICY regional_evidence_isolation ON evidence
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM cases
            WHERE cases.case_id = evidence.case_id
            AND (
                cases.region_id = COALESCE(current_setting('request.jwt.claim.region_id', true), cases.region_id)
                OR current_setting('request.jwt.claim.role', true) = 'federal_taskforce'
            )
        )
    );

CREATE POLICY regional_people_isolation ON people
    FOR ALL
    USING (
        region_id = COALESCE(current_setting('request.jwt.claim.region_id', true), region_id)
        OR current_setting('request.jwt.claim.role', true) = 'federal_taskforce'
    );

CREATE POLICY regional_audit_isolation ON audit_logs
    FOR ALL
    USING (
        region_id = COALESCE(current_setting('request.jwt.claim.region_id', true), region_id)
        OR current_setting('request.jwt.claim.role', true) = 'federal_taskforce'
    );

-- -----------------------------------------------------------------------------
-- 7. NEO4J KNOWLEDGE GRAPH PROJECTION CONTRACT (Cypher Reference)
-- -----------------------------------------------------------------------------
/*
Neo4j Graph Cypher Ingestion Queries (Executed by FastAPI ingestion worker):

// 1. Ingest Nodes
LOAD CSV WITH HEADERS FROM 'file:///people.csv' AS row
MERGE (p:Person {id: row.person_id})
SET p.name = row.full_name, p.risk = row.risk_level, p.region = row.region_id;

LOAD CSV WITH HEADERS FROM 'file:///accounts.csv' AS row
MERGE (a:Account {id: row.account_id})
SET a.number = row.account_number, a.bank = row.bank_name, a.balance = toFloat(row.balance);

LOAD CSV WITH HEADERS FROM 'file:///phones.csv' AS row
MERGE (ph:Phone {id: row.phone_id})
SET ph.msisdn = row.phone_number, ph.carrier = row.carrier;

LOAD CSV WITH HEADERS FROM 'file:///cases.csv' AS row
MERGE (c:Case {id: row.case_id})
SET c.number = row.case_number, c.title = row.title, c.region = row.region_id;

// 2. Ingest Relationships
LOAD CSV WITH HEADERS FROM 'file:///transactions.csv' AS row
MATCH (s:Account {id: row.sender_account_id})
MATCH (r:Account {id: row.receiver_account_id})
CREATE (s)-[:TRANSFERRED {
    id: row.transaction_id,
    amount: toFloat(row.amount),
    timestamp: row.timestamp,
    evidence_id: row.evidence_id
}]->(r);

LOAD CSV WITH HEADERS FROM 'file:///cdr.csv' AS row
MATCH (c:Phone {id: row.caller_phone_id})
MATCH (r:Phone {id: row.receiver_phone_id})
CREATE (c)-[:CALLED {
    id: row.cdr_id,
    duration: toInteger(row.duration_seconds),
    timestamp: row.call_timestamp,
    tower: row.cell_tower_id
}]->(r);

LOAD CSV WITH HEADERS FROM 'file:///accounts.csv' AS row
WHERE row.account_holder_id IS NOT NULL AND row.account_holder_id <> ''
MATCH (p:Person {id: row.account_holder_id})
MATCH (a:Account {id: row.account_id})
CREATE (p)-[:OWNS_ACCOUNT]->(a);

LOAD CSV WITH HEADERS FROM 'file:///phones.csv' AS row
WHERE row.registered_owner_id IS NOT NULL AND row.registered_owner_id <> ''
MATCH (p:Person {id: row.registered_owner_id})
MATCH (ph:Phone {id: row.phone_id})
CREATE (p)-[:USES_PHONE]->(ph);
*/
"""

with open(os.path.join(DATABASE_DIR, "schema.sql"), "w", encoding="utf-8") as f:
    f.write(schema_sql.strip() + "\n")
print("Wrote database/schema.sql")

# -----------------------------------------------------------------------------
# 5. DATABASE SEED SQL
# -----------------------------------------------------------------------------

def sql_quote(val):
    if val is None or val == "":
        return "NULL"
    if isinstance(val, (int, float)):
        return str(val)
    if isinstance(val, bool):
        return "TRUE" if val else "FALSE"
    # Escaping single quotes
    s = str(val).replace("'", "''")
    return f"'{s}'"

seed_sql_lines = [
    "-- ============================================================================",
    "-- CrimeNexus (SIH26189) - Synthetic Seed Data",
    "-- Complete database seed matching synthetic_data CSVs and sample evidence",
    "-- ============================================================================\n",
    "-- 1. Regions",
]

for r in regions:
    seed_sql_lines.append(f"INSERT INTO regions (region_id, region_name, state, jurisdiction_notes) VALUES ({sql_quote(r['region_id'])}, {sql_quote(r['region_name'])}, {sql_quote(r['state'])}, {sql_quote(r['jurisdiction_notes'])}) ON CONFLICT (region_id) DO NOTHING;")

seed_sql_lines.append("\n-- 2. Investigators")
for inv in investigators:
    seed_sql_lines.append(f"INSERT INTO investigators (investigator_id, region_id, badge_number, full_name, email, role) VALUES ({sql_quote(inv['investigator_id'])}, {sql_quote(inv['region_id'])}, {sql_quote(inv['badge_number'])}, {sql_quote(inv['full_name'])}, {sql_quote(inv['email'])}, {sql_quote(inv['role'])}) ON CONFLICT (investigator_id) DO NOTHING;")

seed_sql_lines.append("\n-- 3. Cases")
for c in cases:
    seed_sql_lines.append(f"INSERT INTO cases (case_id, case_number, title, description, category, status, region_id, lead_investigator_id, incident_date, created_at) VALUES ({sql_quote(c['case_id'])}, {sql_quote(c['case_number'])}, {sql_quote(c['title'])}, {sql_quote(c['description'])}, {sql_quote(c['category'])}, {sql_quote(c['status'])}, {sql_quote(c['region_id'])}, {sql_quote(c['lead_investigator_id'])}, {sql_quote(c['incident_date'])}, {sql_quote(c['created_at'])}) ON CONFLICT (case_id) DO NOTHING;")

seed_sql_lines.append("\n-- 4. Locations")
for loc in locations:
    seed_sql_lines.append(f"INSERT INTO locations (location_id, label, address, city, state, country, latitude, longitude) VALUES ({sql_quote(loc['location_id'])}, {sql_quote(loc['label'])}, {sql_quote(loc['address'])}, {sql_quote(loc['city'])}, {sql_quote(loc['state'])}, {sql_quote(loc['country'])}, {loc['latitude']}, {loc['longitude']}) ON CONFLICT (location_id) DO NOTHING;")

seed_sql_lines.append("\n-- 5. Evidence")
for ev in evidence:
    seed_sql_lines.append(f"INSERT INTO evidence (evidence_id, case_id, title, file_name, file_type, storage_path, sha256_hash, source_type, uploaded_by, uploaded_at, verified, fabric_tx_id, summary_record) VALUES ({sql_quote(ev['evidence_id'])}, {sql_quote(ev['case_id'])}, {sql_quote(ev['title'])}, {sql_quote(ev['file_name'])}, {sql_quote(ev['file_type'])}, {sql_quote(ev['storage_path'])}, {sql_quote(ev['sha256_hash'])}, {sql_quote(ev['source_type'])}, {sql_quote(ev['uploaded_by'])}, {sql_quote(ev['uploaded_at'])}, {sql_quote(ev['verified'])}, {sql_quote(ev['fabric_tx_id'])}, {sql_quote(ev['summary_record'])}) ON CONFLICT (evidence_id) DO NOTHING;")

seed_sql_lines.append("\n-- 6. People")
for p in people:
    seed_sql_lines.append(f"INSERT INTO people (person_id, full_name, aliases, role_designation, dob, gender, nationality, id_document_type, id_document_number, address, primary_case_id, region_id, risk_level) VALUES ({sql_quote(p['person_id'])}, {sql_quote(p['full_name'])}, {sql_quote(p['aliases'])}, {sql_quote(p['role_designation'])}, {sql_quote(p['dob'])}, {sql_quote(p['gender'])}, {sql_quote(p['nationality'])}, {sql_quote(p['id_document_type'])}, {sql_quote(p['id_document_number'])}, {sql_quote(p['address'])}, {sql_quote(p['primary_case_id'])}, {sql_quote(p['region_id'])}, {sql_quote(p['risk_level'])}) ON CONFLICT (person_id) DO NOTHING;")

seed_sql_lines.append("\n-- 7. Phones")
for ph in phones:
    owner = sql_quote(ph['registered_owner_id']) if ph['registered_owner_id'] else "NULL"
    seed_sql_lines.append(f"INSERT INTO phones (phone_id, phone_number, imei, imsi, carrier, registered_owner_id, status, activated_date) VALUES ({sql_quote(ph['phone_id'])}, {sql_quote(ph['phone_number'])}, {sql_quote(ph['imei'])}, {sql_quote(ph['imsi'])}, {sql_quote(ph['carrier'])}, {owner}, {sql_quote(ph['status'])}, {sql_quote(ph['activated_date'])}) ON CONFLICT (phone_id) DO NOTHING;")

seed_sql_lines.append("\n-- 8. Accounts")
for acc in accounts:
    holder = sql_quote(acc['account_holder_id']) if acc['account_holder_id'] else "NULL"
    seed_sql_lines.append(f"INSERT INTO accounts (account_id, account_number, bank_name, branch, ifsc_code, account_holder_id, account_type, balance, status, opened_date) VALUES ({sql_quote(acc['account_id'])}, {sql_quote(acc['account_number'])}, {sql_quote(acc['bank_name'])}, {sql_quote(acc['branch'])}, {sql_quote(acc['ifsc_code'])}, {holder}, {sql_quote(acc['account_type'])}, {acc['balance']}, {sql_quote(acc['status'])}, {sql_quote(acc['opened_date'])}) ON CONFLICT (account_id) DO NOTHING;")

seed_sql_lines.append("\n-- 9. Transactions")
for txn in transactions:
    ev_id = sql_quote(txn['evidence_id']) if txn['evidence_id'] else "NULL"
    seed_sql_lines.append(f"INSERT INTO transactions (transaction_id, sender_account_id, receiver_account_id, amount, currency, transaction_type, channel, timestamp, reference_narration, evidence_id) VALUES ({sql_quote(txn['transaction_id'])}, {sql_quote(txn['sender_account_id'])}, {sql_quote(txn['receiver_account_id'])}, {txn['amount']}, {sql_quote(txn['currency'])}, {sql_quote(txn['transaction_type'])}, {sql_quote(txn['channel'])}, {sql_quote(txn['timestamp'])}, {sql_quote(txn['reference_narration'])}, {ev_id}) ON CONFLICT (transaction_id) DO NOTHING;")

seed_sql_lines.append("\n-- 10. CDR")
for c in cdr:
    loc_id = sql_quote(c['location_id']) if c['location_id'] else "NULL"
    ev_id = sql_quote(c['reference_evidence_id']) if c['reference_evidence_id'] else "NULL"
    seed_sql_lines.append(f"INSERT INTO cdr (cdr_id, caller_phone_id, receiver_phone_id, call_timestamp, duration_seconds, call_type, cell_tower_id, location_id, reference_evidence_id) VALUES ({sql_quote(c['cdr_id'])}, {sql_quote(c['caller_phone_id'])}, {sql_quote(c['receiver_phone_id'])}, {sql_quote(c['call_timestamp'])}, {c['duration_seconds']}, {sql_quote(c['call_type'])}, {sql_quote(c['cell_tower_id'])}, {loc_id}, {ev_id}) ON CONFLICT (cdr_id) DO NOTHING;")

seed_sql_lines.append("\n-- 11. Vehicles")
for v in vehicles:
    owner = sql_quote(v['owner_id']) if v['owner_id'] else "NULL"
    loc = sql_quote(v['last_seen_location_id']) if v['last_seen_location_id'] else "NULL"
    tstamp = sql_quote(v['last_seen_timestamp']) if v['last_seen_timestamp'] else "NULL"
    seed_sql_lines.append(f"INSERT INTO vehicles (vehicle_id, registration_number, make, model, color, vehicle_type, owner_id, last_seen_location_id, last_seen_timestamp) VALUES ({sql_quote(v['vehicle_id'])}, {sql_quote(v['registration_number'])}, {sql_quote(v['make'])}, {sql_quote(v['model'])}, {sql_quote(v['color'])}, {sql_quote(v['vehicle_type'])}, {owner}, {loc}, {tstamp}) ON CONFLICT (vehicle_id) DO NOTHING;")

seed_sql_lines.append("\n-- 12. Devices")
for d in devices:
    owner = sql_quote(d['owner_id']) if d['owner_id'] else "NULL"
    imei = sql_quote(d['imei']) if d['imei'] else "NULL"
    seed_sql_lines.append(f"INSERT INTO devices (device_id, device_type, make_model, os, mac_address, imei, owner_id, last_ip, status) VALUES ({sql_quote(d['device_id'])}, {sql_quote(d['device_type'])}, {sql_quote(d['make_model'])}, {sql_quote(d['os'])}, {sql_quote(d['mac_address'])}, {imei}, {owner}, {sql_quote(d['last_ip'])}, {sql_quote(d['status'])}) ON CONFLICT (device_id) DO NOTHING;")

seed_sql_lines.append("\n-- 13. Cyber Indicators")
for ind in cyber_indicators:
    dev = sql_quote(ind['associated_device_id']) if ind['associated_device_id'] else "NULL"
    per = sql_quote(ind['associated_person_id']) if ind['associated_person_id'] else "NULL"
    ev = sql_quote(ind['reference_evidence_id']) if ind['reference_evidence_id'] else "NULL"
    seed_sql_lines.append(f"INSERT INTO cyber_indicators (indicator_id, indicator_type, value, threat_score, associated_device_id, associated_person_id, first_seen, last_seen, reference_evidence_id) VALUES ({sql_quote(ind['indicator_id'])}, {sql_quote(ind['indicator_type'])}, {sql_quote(ind['value'])}, {ind['threat_score']}, {dev}, {per}, {sql_quote(ind['first_seen'])}, {sql_quote(ind['last_seen'])}, {ev}) ON CONFLICT (indicator_id) DO NOTHING;")

seed_sql_lines.append("\n-- 14. Case Entities Junction")
case_entity_rows = [
    ("CASE-018", "PERSON", "PER-101", "Primary Suspect / Mastermind", 0.96),
    ("CASE-018", "PERSON", "PER-102", "Technical Infrastructure Operator", 0.94),
    ("CASE-018", "PERSON", "PER-103", "Financial Layering Coordinator (Bridge)", 0.91),
    ("CASE-018", "PERSON", "PER-104", "Primary Mule Account Holder", 0.98),
    ("CASE-018", "PERSON", "PER-108", "Corporate Victim CFO", 1.00),
    ("CASE-018", "ACCOUNT", "ACC-1001", "Victim Corporate Account Debited", 1.00),
    ("CASE-018", "ACCOUNT", "ACC-2201", "Primary Heist Receiver Account", 1.00),
    ("CASE-041", "PERSON", "PER-105", "Hawala Kingpin & Controller", 0.97),
    ("CASE-041", "PERSON", "PER-106", "Logistics Courier", 0.90),
    ("CASE-041", "PERSON", "PER-107", "Shell Company Director", 0.95),
    ("CASE-041", "PERSON", "PER-103", "Intermediary Remitter (Bridge)", 0.89),
    ("CASE-041", "ACCOUNT", "ACC-7701", "Shell Layering Pass-through Account", 0.95),
    ("CASE-041", "ACCOUNT", "ACC-7703", "Hawala Clearing Account", 0.96),
    ("CASE-059", "PERSON", "PER-110", "SIM Box Operator", 0.99),
    ("CASE-059", "DEVICE", "DEV-105", "Seized 32-Port Gateway", 1.00)
]
for ce in case_entity_rows:
    seed_sql_lines.append(f"INSERT INTO case_entities (case_id, entity_type, entity_id, relation_role, confidence) VALUES ({sql_quote(ce[0])}, {sql_quote(ce[1])}, {sql_quote(ce[2])}, {sql_quote(ce[3])}, {ce[4]}) ON CONFLICT (case_id, entity_type, entity_id) DO NOTHING;")

seed_sql_lines.append("\n-- 15. Audit Logs")
audit_rows = [
    ("AUD-001", "CASE-018", "EVD-001", "UPLOAD", "INV-NCR-101", "REG-NCR", json.dumps({"action": "FIR and complainant statement uploaded"}), computed_hashes["FIR_2026_018_PhishNet.txt"], "blk-ncr-10401", "tx-fabric-ncr-01", "2026-06-09 18:45:00"),
    ("AUD-002", "CASE-018", "EVD-001", "VERIFY", "INV-NCR-101", "REG-NCR", json.dumps({"status": "SHA-256 match verified against Hyperledger ledger"}), computed_hashes["FIR_2026_018_PhishNet.txt"], "blk-ncr-10402", "tx-fabric-ncr-02", "2026-06-09 18:46:12"),
    ("AUD-003", "CASE-018", "EVD-003", "UPLOAD", "INV-NCR-102", "REG-NCR", json.dumps({"action": "Nodal CDR extraction uploaded"}), computed_hashes["Telecom_CDR_TowerDump_T4401.csv"], "blk-ncr-10512", "tx-fabric-ncr-03", "2026-06-12 14:00:00"),
    ("AUD-004", "CASE-041", "EVD-002", "UPLOAD", "INV-MUM-204", "REG-MUM", json.dumps({"action": "FIU STR Banking report registered"}), computed_hashes["Bank_STR_Advisory_ApexTrade.txt"], "blk-mum-88120", "tx-fabric-mum-01", "2026-08-08 11:30:00")
]
for a in audit_rows:
    seed_sql_lines.append(f"INSERT INTO audit_logs (audit_id, case_id, evidence_id, action_type, performed_by, region_id, details, sha256_hash, fabric_block_id, fabric_tx_id, timestamp) VALUES ({sql_quote(a[0])}, {sql_quote(a[1])}, {sql_quote(a[2])}, {sql_quote(a[3])}, {sql_quote(a[4])}, {sql_quote(a[5])}, {sql_quote(a[6])}::jsonb, {sql_quote(a[7])}, {sql_quote(a[8])}, {sql_quote(a[9])}, {sql_quote(a[10])}) ON CONFLICT (audit_id) DO NOTHING;")

with open(os.path.join(DATABASE_DIR, "seed.sql"), "w", encoding="utf-8") as f:
    f.write("\n".join(seed_sql_lines) + "\n")
print("Wrote database/seed.sql")
print("\nAll files successfully generated!")
