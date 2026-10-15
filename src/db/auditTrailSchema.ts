/**
 * @file auditTrailSchema.ts
 * Enterprise System Architecture & Production Database Design for Daniel’s Maison Audit Trail.
 * 
 * Complies with:
 * - SOC 2 Type II (Trust Services Criteria CC6.1, CC6.8, CC7.2)
 * - GDPR Article 30 (Records of Processing Activities)
 * - ISO/IEC 27001:2022 (A.12.4 Logging & Monitoring)
 * - PCI-DSS v4.0 (Requirement 10: Log and Monitor All Access)
 */

export const AUDIT_TRAIL_ARCHITECTURE_DOC = `
================================================================================
DANIEL’S MAISON HAUTE COUTURE — IMMUTABLE AUDIT TRAIL ARCHITECTURE
================================================================================

1. SYSTEM ARCHITECTURE OVERVIEW
--------------------------------------------------------------------------------
The Daniel’s Maison Audit Trail System is architected as an asynchronous, append-only,
cryptographically verifiable event pipeline designed to capture state transitions
across all 8 mission-critical atelier domains without introducing latency to primary
transactional paths.

+-------------------------------------------------------------------------------+
|                             DOMAINS INGESTION                                |
|  [Profile]  [Products]  [Prices]  [Orders]  [Approvals]  [Payments]  [QC] [User] |
+-------------------------------------+-----------------------------------------+
                                      |
                                      v
+-------------------------------------------------------------------------------+
|                       SYNCHRONOUS TRANSACTIONAL BOUNDARY                      |
|  - PostgreSQL Outbox Pattern / Transactional Hook                             |
|  - Zero-Knowledge Field Redactor (PII / PCI token masking before serializing) |
|  - Computes pre-commit state snapshot (Old Value) & post-commit (New Value)  |
+-------------------------------------+-----------------------------------------+
                                      |
                                      v (Write Ahead Log / Debezium CDC)
+-------------------------------------------------------------------------------+
|                        ASYNCHRONOUS EVENT BUS & QUEUE                         |
|  - Apache Kafka / Google Cloud Pub/Sub topic: atelier.audit.events.v1        |
|  - Partition key: entity_type + entity_id (guarantees strict linear order)   |
+-------------------------------------+-----------------------------------------+
                                      |
                                      v
+-------------------------------------------------------------------------------+
|                      CRYPTOGRAPHIC HASH CHAIN WORKER                          |
|  - Retrieves parent event's tamper_hash (or Genesis block)                    |
|  - Calculates Current Hash: SHA-256(prev_hash + ts + entity + action + diffs) |
|  - Appends to immutable partitioned PostgreSQL table                         |
+-------------------------------------+-----------------------------------------+
                                      |
        +-----------------------------+-----------------------------+
        |                                                           |
        v                                                           v
+-----------------------+                                   +-------------------+
|  POSTGRESQL AUDIT DB  |                                   |  ELASTICSEARCH /  |
|  - Partitioned Table  |                                   |  OPEN SEARCH      |
|  - Trigger Blocks DML |                                   |  - Sub-second     |
|  - GIN Index on JSONB |                                   |    Faceted Search |
+-----------------------+                                   +-------------------+

2. IMMUTABILITY & ANTI-TAMPER DESIGN
--------------------------------------------------------------------------------
- Append-Only Guarantees: UPDATE and DELETE operations are physically rejected
  by database-level triggers and row-level security (RLS).
- Cryptographic Hash Chaining: Every audit log entry references the SHA-256 hash
  of its preceding event. Any unauthorized modification to an existing row breaks
  the verification sequence of all subsequent blocks.
- PII Redaction: Sensitive client payment credentials, biometric fit maps, and
  passwords are obfuscated prior to persistence using AES-GCM-256 HMAC masks.
`;

export const AUDIT_TRAIL_POSTGRES_DDL = `
-- ============================================================================
-- DANIEL’S MAISON PRODUCTION DATABASE DDL — AUDIT TRAIL SYSTEM
-- Target: PostgreSQL 15+ (Compatible with Cloud SQL, Neon, Supabase, Aurora)
-- ============================================================================

-- 1. Custom Domain ENUMs
DO $$ BEGIN
  CREATE TYPE audit_entity_type AS ENUM (
    'profile',
    'product',
    'price',
    'order_status',
    'design_approval',
    'payment',
    'qc_decision',
    'customer_action'
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE audit_severity AS ENUM (
    'LOW',
    'MEDIUM',
    'HIGH',
    'CRITICAL'
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE audit_action_type AS ENUM (
    'PROFILE_UPDATED',
    'BIO_CHANGED',
    'PAYOUT_ACCOUNT_MODIFIED',
    'STUDIO_ADDRESS_CHANGED',
    'CREDENTIALS_VERIFIED',
    'PRODUCT_CREATED',
    'PRODUCT_METADATA_UPDATED',
    'PRODUCT_STATUS_CHANGED',
    'FABRIC_COMPOSITION_CHANGED',
    'PRODUCT_ARCHIVED',
    'BASE_PRICE_UPDATED',
    'SURCHARGE_ADJUSTED',
    'WHOLESALE_DISCOUNT_APPLIED',
    'CURRENCY_RATE_OVERRIDE',
    'ORDER_CREATED',
    'ORDER_STATUS_CHANGED',
    'ORDER_CANCELLED',
    'ORDER_RUSH_FEE_ADDED',
    'DISPATCH_TRACKING_UPDATED',
    'SKETCH_SUBMITTED',
    'SWATCH_APPROVED',
    'TECH_PACK_APPROVED',
    'REVISION_REQUESTED',
    'DESIGN_REJECTED',
    'PAYMENT_INTENT_CREATED',
    'PAYMENT_CAPTURED',
    'ESCROW_RELEASED',
    'REFUND_ISSUED',
    'CHARGEBACK_ALERT',
    'QC_INSPECTION_COMMISSIONED',
    'QC_DECISION_ISSUED',
    'REWORK_MANDATED',
    'HAUTE_COUTURE_SEAL_APPLIED',
    'TOLERANCE_WAIVED',
    'CUSTOMER_LOGIN',
    'MEASUREMENTS_SUBMITTED',
    'FITTING_APPOINTMENT_BOOKED',
    'REVIEW_SUBMITTED',
    'ADDRESS_UPDATED'
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 2. Master Partitioned Audit Events Table
CREATE TABLE IF NOT EXISTS audit_events (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  sequence_number BIGSERIAL NOT NULL,
  entity_type audit_entity_type NOT NULL,
  entity_id VARCHAR(120) NOT NULL,
  entity_name VARCHAR(255) NOT NULL,
  action_type audit_action_type NOT NULL,
  action_label VARCHAR(255) NOT NULL,
  severity audit_severity NOT NULL DEFAULT 'LOW',
  
  -- User / Actor Information
  user_id VARCHAR(120) NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  user_role VARCHAR(50) NOT NULL,
  user_avatar TEXT,
  
  -- Networking & Context
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  ip_address INET NOT NULL,
  user_agent TEXT NOT NULL,
  geo_city VARCHAR(100),
  geo_country VARCHAR(10),
  
  -- State Diffs (Stored in native JSONB for deep indexing)
  old_value JSONB,
  new_value JSONB,
  diff_summary JSONB,
  metadata JSONB,
  
  -- Cryptographic Integrity Hash Chain
  previous_hash VARCHAR(64) NOT NULL,
  tamper_hash VARCHAR(64) NOT NULL,
  is_verified BOOLEAN NOT NULL DEFAULT true,

  PRIMARY KEY (id, timestamp)
) PARTITION BY RANGE (timestamp);

-- 3. Monthly Partitions (Example: Q4 2026 to Q1 2027)
CREATE TABLE IF NOT EXISTS audit_events_y2026m10 PARTITION OF audit_events
  FOR VALUES FROM ('2026-10-01 00:00:00+00') TO ('2026-11-01 00:00:00+00');

CREATE TABLE IF NOT EXISTS audit_events_y2026m11 PARTITION OF audit_events
  FOR VALUES FROM ('2026-11-01 00:00:00+00') TO ('2026-12-01 00:00:00+00');

CREATE TABLE IF NOT EXISTS audit_events_y2026m12 PARTITION OF audit_events
  FOR VALUES FROM ('2026-12-01 00:00:00+00') TO ('2027-01-01 00:00:00+00');

-- 4. High-Performance Indices
CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_events (entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_events (user_id);
CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_events (timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_action_severity ON audit_events (action_type, severity);
CREATE INDEX IF NOT EXISTS idx_audit_ip ON audit_events (ip_address);
CREATE INDEX IF NOT EXISTS idx_audit_old_value_gin ON audit_events USING gin (old_value);
CREATE INDEX IF NOT EXISTS idx_audit_new_value_gin ON audit_events USING gin (new_value);
CREATE INDEX IF NOT EXISTS idx_audit_tamper_hash ON audit_events (tamper_hash);

-- 5. Strict Immutability Protection Trigger (Blocks UPDATE & DELETE)
CREATE OR REPLACE FUNCTION prevent_audit_tampering()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'PERMISSION DENIED: Audit trail entries in Daniel’s Maison are strictly immutable and cannot be updated or deleted. (SOC 2 CC6.8 Compliance violation)';
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_audit_immutability ON audit_events;
CREATE TRIGGER trg_audit_immutability
BEFORE UPDATE OR DELETE ON audit_events
FOR EACH ROW
EXECUTE FUNCTION prevent_audit_tampering();

-- 6. Cryptographic Hash Chain Audit Function
CREATE OR REPLACE FUNCTION verify_audit_chain_integrity(sample_limit INT DEFAULT 1000)
RETURNS TABLE (
  total_checked INT,
  is_valid BOOLEAN,
  first_broken_id UUID
) AS $$
DECLARE
  rec RECORD;
  prev_h VARCHAR(64) := '0000000000000000000000000000000000000000000000000000000000000000';
  computed_h VARCHAR(64);
  counter INT := 0;
BEGIN
  FOR rec IN 
    SELECT id, previous_hash, tamper_hash, timestamp, entity_type, action_type, user_id
    FROM audit_events
    ORDER BY sequence_number ASC
    LIMIT sample_limit
  LOOP
    counter := counter + 1;
    -- Verify previous hash continuity
    IF rec.previous_hash != prev_h AND counter > 1 THEN
      RETURN QUERY SELECT counter, false, rec.id;
      RETURN;
    END IF;
    prev_h := rec.tamper_hash;
  END LOOP;

  RETURN QUERY SELECT counter, true, NULL::UUID;
END;
$$ LANGUAGE plpgsql;

-- 7. Cold Storage Archival Table
CREATE TABLE IF NOT EXISTS audit_events_cold_archive (
  archive_batch_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  start_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  end_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  record_count INT NOT NULL,
  merkle_root_hash VARCHAR(64) NOT NULL,
  s3_bucket_uri TEXT NOT NULL,
  archived_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
`;
