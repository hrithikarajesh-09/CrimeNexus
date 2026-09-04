import groundTruth from '../../synthetic_data/ground_truth.json';

// Raw data structured matching CSVs & Ground Truth
export const RAW_DATASET = {
  cases: [
    {
      case_id: "CASE-018",
      case_number: "FIR/0018/2026",
      title: "Operation PhishNet - Zenith Cyber Heist",
      category: "Cyber Fraud / Corporate Spear-Phishing",
      jurisdiction: "REG-NCR",
      region_name: "Gurugram / NCR",
      registration_date: "2026-06-09",
      status: "Active Investigation",
      investigator_id: "INV-NCR-101",
      investigator_name: "Inspector Vikram Batra",
      description: "Spear-phishing credential harvesting targeting CFO Vikramaditya Rathore of Zenith Technologies Ltd. Illegal RTGS transfer of ₹1,00,00,000 to mule accounts and rapid multi-tier layering.",
      stats: { evidence: 8, people: 15, phones: 8, accounts: 6, vehicles: 4, devices: 4 }
    },
    {
      case_id: "CASE-041",
      case_number: "STR/88912/2026",
      title: "Operation ShadowLedge - Apex Trade TBML Ring",
      category: "Hawala / Trade-Based Money Laundering",
      jurisdiction: "REG-MUM",
      region_name: "Mumbai Commissionerate",
      registration_date: "2026-08-08",
      status: "Active Investigation",
      investigator_id: "INV-MUM-204",
      investigator_name: "ACP Sameer Deshmukh",
      description: "Suspicious financial activity and over-invoicing via front company Apex Trade Solutions Pvt Ltd. Intercepted ₹50,00,000 inward RTGS from NCR broker Devrat Sharma, routed offshore to Dubai bullion trade.",
      stats: { evidence: 6, people: 8, phones: 5, accounts: 7, vehicles: 2, devices: 3 }
    },
    {
      case_id: "CASE-059",
      case_number: "FIR/0059/2026",
      title: "Operation DarkSIM - Rogue SIM Box Syndicate",
      category: "Telecom Cyber Infrastructure / Identity Fraud",
      jurisdiction: "REG-NCR",
      region_name: "Gurugram / NCR",
      registration_date: "2026-08-15",
      status: "Active Investigation",
      investigator_id: "INV-NCR-102",
      investigator_name: "Inspector Neha Sharma",
      description: "Illegal 64-port SIM box gateway hardware operating out of Sector 44 Gurugram. Pre-activated SIM cards used for OTP interception and fraud caller spoofing.",
      stats: { evidence: 4, people: 4, phones: 12, accounts: 2, vehicles: 1, devices: 8 }
    }
  ],

  people: [
    { person_id: "PER-101", name: "Rajesh Verma", alias: "Viper / Cyber Lead", role: "Primary Suspect / Cyber Ring Operator", primary_case_id: "CASE-018", phone: "+919811001122", nationality: "Indian", risk_score: 94, location: "Gurugram, HR", pan: "ABCPV9012K" },
    { person_id: "PER-102", name: "Kunal Shah", alias: "Coder K", role: "Technical Infrastructure Specialist", primary_case_id: "CASE-018", phone: "+919811002233", nationality: "Indian", risk_score: 88, location: "Noida, UP", pan: "KSHPK4410P" },
    { person_id: "PER-103", name: "Devrat Sharma", alias: "The Accountant / Broker D", role: "Strategic Money Broker & Mule Coordinator", primary_case_id: "CASE-018", phone: "+919811003344", nationality: "Indian", risk_score: 96, location: "Delhi / Mumbai", pan: "DSRPS3311L", is_bridge: true },
    { person_id: "PER-104", name: "Suman Roy", alias: "Mule Alpha", role: "Primary Mule Account Holder", primary_case_id: "CASE-018", phone: "+919811004455", nationality: "Indian", risk_score: 75, location: "Gurugram, HR", pan: "SMRPS1122M" },
    { person_id: "PER-105", name: "Tariq Merchant", alias: "Goldman", role: "Hawala Syndicate Operator", primary_case_id: "CASE-041", phone: "+919822005566", nationality: "Indian", risk_score: 92, location: "Mumbai, MH", pan: "TMKPM9901A" },
    { person_id: "PER-106", name: "Sameer Kazi", alias: "Courier S", role: "Cash Logistics Courier", primary_case_id: "CASE-041", phone: "+919822006677", nationality: "Indian", risk_score: 82, location: "Mumbai, MH", pan: "SKZPK7712B" },
    { person_id: "PER-107", name: "Anita D'Souza", alias: "Director Anita", role: "Shell Company Director (Apex Trade)", primary_case_id: "CASE-041", phone: "+919822007788", nationality: "Indian", risk_score: 85, location: "Mumbai, MH", pan: "CKSPD5541L" },
    { person_id: "PER-108", name: "Vikramaditya Rathore", alias: "Complainant CFO", role: "Victim CFO (Zenith Tech)", primary_case_id: "CASE-018", phone: "+919810011808", nationality: "Indian", risk_score: 10, location: "Gurugram, HR", pan: "VRTPR8821Z" },
    { person_id: "PER-110", name: "Rohan Kapoor", alias: "SIM Handler", role: "Telecom SIM Box Operator", primary_case_id: "CASE-059", phone: "+919908001100", nationality: "Indian", risk_score: 79, location: "Gurugram, HR", pan: "RKPRK3312Q" },
    { person_id: "PER-111", name: "Farooq Sheikh", alias: "Dubai Bullion Dealer", role: "Offshore Clearing Agent", primary_case_id: "CASE-041", phone: "+971501234567", nationality: "UAE / NRI", risk_score: 91, location: "Dubai, UAE", pan: "FOREIGN_REG" },
    { person_id: "PER-112", name: "Meera Nair", alias: "Student Mule", role: "Sub-Mule Account Provider", primary_case_id: "CASE-018", phone: "+919811008899", nationality: "Indian", risk_score: 64, location: "Faridabad, HR", pan: "MNRPM8812D" }
  ],

  phones: [
    { phone_id: "PH-1001", msisdn: "+919811001122", owner_id: "PER-101", owner_name: "Rajesh Verma", imei: "867452039182741", carrier: "Airtel NCR" },
    { phone_id: "PH-1002", msisdn: "+919811002233", owner_id: "PER-102", owner_name: "Kunal Shah", imei: "867452039182742", carrier: "Jio NCR" },
    { phone_id: "PH-1003", msisdn: "+919811003344", owner_id: "PER-103", owner_name: "Devrat Sharma", imei: "867452039182743", carrier: "Airtel NCR/MUM" },
    { phone_id: "PH-1004", msisdn: "+919811004455", owner_id: "PER-104", owner_name: "Suman Roy", imei: "867452039182744", carrier: "Vi NCR" },
    { phone_id: "PH-1005", msisdn: "+919822005566", owner_id: "PER-105", owner_name: "Tariq Merchant", imei: "867452039182745", carrier: "Jio Mumbai" },
    { phone_id: "PH-1007", msisdn: "+919822007788", owner_id: "PER-107", owner_name: "Anita D'Souza", imei: "867452039182747", carrier: "Airtel Mumbai" },
    { phone_id: "PH-9908", msisdn: "+919811009988", owner_id: null, owner_name: "Unregistered Burner SIM", imei: "358941098239908", carrier: "Rogue SIM Box Line" }
  ],

  accounts: [
    { account_id: "ACC-1001", account_number: "001199884401", bank_name: "Apex Global Bank", holder_id: "PER-108", holder_name: "Zenith Technologies Ltd", balance: "₹4,50,00,000", type: "Corporate Current" },
    { account_id: "ACC-2201", account_number: "9988220144", bank_name: "Royal Crest Bank", holder_id: "PER-104", holder_name: "Suman Roy", balance: "₹1,20,000", type: "Savings Mule" },
    { account_id: "ACC-3301", account_number: "5544110022", bank_name: "State Commercial Bank", holder_id: "PER-112", holder_name: "Meera Nair", balance: "₹15,000", type: "Student Mule" },
    { account_id: "ACC-7702", account_number: "4455770288", bank_name: "Imperial Trust Bank", holder_id: "PER-103", holder_name: "Devrat Sharma", balance: "₹78,50,000", type: "Broker Collection" },
    { account_id: "ACC-7701", account_number: "4455770199", bank_name: "Imperial Trust Bank", holder_id: "PER-107", holder_name: "Apex Trade Solutions", balance: "₹12,40,000", type: "Corporate Shell" },
    { account_id: "ACC-7703", account_number: "4455770311", bank_name: "Merchants Co-op Bank", holder_id: "PER-105", holder_name: "Tariq Merchant", balance: "₹2,10,00,000", type: "Hawala Clearing" },
    { account_id: "ACC-7705", account_number: "AE9820011902", bank_name: "Emirates National Bank", holder_id: "PER-111", holder_name: "Farooq Sheikh", balance: "AED 5,200,000", type: "Offshore SWIFT" },
    { account_id: "ACC-8809", account_number: "7711223399", bank_name: "Federal Union Bank", holder_id: null, holder_name: "UNIDENTIFIED (Forged Voter ID)", balance: "₹25,00,000", type: "Unclaimed Mule" }
  ],

  transactions: [
    { transaction_id: "TXN-1001", timestamp: "2026-06-09 14:10:00", sender_acc: "ACC-1001", sender_name: "Zenith Tech", receiver_acc: "ACC-2201", receiver_name: "Suman Roy", amount: "₹1,00,00,000", type: "RTGS (Heist)", case_id: "CASE-018", evidence_id: "EVD-001" },
    { transaction_id: "TXN-1002", timestamp: "2026-06-09 14:35:00", sender_acc: "ACC-2201", sender_name: "Suman Roy", receiver_acc: "ACC-3301", receiver_name: "Meera Nair", amount: "₹20,00,000", type: "IMPS Layering", case_id: "CASE-018", evidence_id: "EVD-001" },
    { transaction_id: "TXN-1007", timestamp: "2026-06-11 10:15:00", sender_acc: "ACC-3301", sender_name: "Meera Nair", receiver_acc: "ACC-7702", receiver_name: "Devrat Sharma", amount: "₹18,00,000", type: "NEFT Aggregation", case_id: "CASE-018", evidence_id: "EVD-003" },
    { transaction_id: "TXN_552", transaction_code: "TXN-1011", timestamp: "2026-08-07 15:30:00", sender_acc: "ACC-7702", sender_name: "Devrat Sharma (Broker)", receiver_acc: "ACC-7701", receiver_name: "Apex Trade Solutions", amount: "₹50,00,000", type: "RTGS Cross-Case Bridge", case_id: "CASE-018 -> CASE-041", evidence_id: "EVD-002", is_cross_case: true },
    { transaction_id: "TXN-1012", timestamp: "2026-08-07 17:15:00", sender_acc: "ACC-7701", sender_name: "Apex Trade Solutions", receiver_acc: "ACC-7703", receiver_name: "Tariq Merchant", amount: "₹45,00,000", type: "RTGS Internal Transfer", case_id: "CASE-041", evidence_id: "EVD-002" },
    { transaction_id: "TXN-1013", timestamp: "2026-08-10 12:00:00", sender_acc: "ACC-7703", sender_name: "Tariq Merchant", receiver_acc: "ACC-7705", receiver_name: "Farooq Sheikh (Dubai)", amount: "₹10,00,00,000", type: "SWIFT Offshore Hawala", case_id: "CASE-041", evidence_id: "EVD-002" }
  ],

  cdr: [
    { cdr_id: "CDR-1001", timestamp: "2026-06-09 11:15:00", caller_phone: "PH-1002", caller_name: "Kunal Shah", receiver_phone: "PH-1001", receiver_name: "Rajesh Verma", duration: "142 sec", tower_id: "T-4401 Gurugram Sec 44" },
    { cdr_id: "CDR-1002", timestamp: "2026-06-09 11:20:00", caller_phone: "PH-1001", caller_name: "Rajesh Verma", receiver_phone: "PH-1004", receiver_name: "Suman Roy", duration: "85 sec", tower_id: "T-4401 Gurugram Sec 44" },
    { cdr_id: "CDR-1008", timestamp: "2026-06-11 12:00:00", caller_phone: "PH-1003", caller_name: "Devrat Sharma", receiver_phone: "PH-1005", receiver_name: "Tariq Merchant", duration: "310 sec", tower_id: "T-8802 Bandra West Mumbai", is_cross_case: true },
    { cdr_id: "CDR-1010", timestamp: "2026-08-07 14:15:00", caller_phone: "PH-1003", caller_name: "Devrat Sharma", receiver_phone: "PH-1007", receiver_name: "Anita D'Souza", duration: "204 sec", tower_id: "T-1102 Nariman Point Mumbai" }
  ],

  evidence: [
    { evidence_id: "EVD-001", file_name: "FIR_2026_018_PhishNet.txt", title: "Cyber Crime Police Station FIR 0018/2026", case_id: "CASE-018", sha256_hash: "d4c56ad10356cf2cc8ddfdc26fd4c04ff6ca07f586a8acf970c43731c169c142", file_size: "3,112 bytes", source: "Gurugram Cyber Police", uploaded_at: "2026-06-09 18:30:00", status: "VERIFIED" },
    { evidence_id: "EVD-002", file_name: "Bank_STR_Advisory_ApexTrade.txt", title: "FIU-IND Suspicious Transaction Report STR-88912", case_id: "CASE-041", sha256_hash: "afeb4ed06feb8f55c8a7028172dec41070be605e4508ba3ea0f7dc6b4e9cbcae", file_size: "2,770 bytes", source: "FIU-IND / Imperial Trust Bank", uploaded_at: "2026-08-08 11:00:00", status: "VERIFIED" },
    { evidence_id: "EVD-003", file_name: "Telecom_CDR_TowerDump_T4401.csv", title: "Sector 44 Gurugram Tower T-4401 Dump", case_id: "CASE-018", sha256_hash: "ccfb08874fc7038d541678894b70eee79265d68d8a5c65adf5187c5d4e45f91e", file_size: "2,089 bytes", source: "Airtel / Jio Tower Records", uploaded_at: "2026-06-10 09:15:00", status: "VERIFIED" }
  ],

  groundTruth: groundTruth
};
