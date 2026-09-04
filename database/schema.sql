-- ============================================================================
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
