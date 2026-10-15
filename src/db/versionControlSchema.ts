/**
 * @file versionControlSchema.ts
 * Relational Database Schema & Architecture Design for Haute Couture Version Control System (VCS).
 * Target: PostgreSQL 15+ / Cloud SQL / Neon / Supabase.
 */

export const VERSION_CONTROL_SQL_DDL = `
-- ============================================================================
-- DANIEL’S MAISON VERSION CONTROL SYSTEM (VCS) DATABASE DESIGN
-- ============================================================================

-- 1. Custom Enums
DO $$ BEGIN
  CREATE TYPE vcs_domain_enum AS ENUM (
    'measurements',
    'design',
    'fabrics',
    'approval'
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE vcs_version_tag_enum AS ENUM (
    'STABLE',
    'PRODUCTION_LOCK',
    'CLIENT_APPROVED',
    'DRAFT',
    'REVISED',
    'ARCHIVED'
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 2. Version-Controlled Packages Header
CREATE TABLE IF NOT EXISTS vcs_packages (
  id VARCHAR(64) PRIMARY KEY,
  order_number VARCHAR(64) NOT NULL,
  package_name VARCHAR(255) NOT NULL,
  customer_id VARCHAR(64) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  current_version VARCHAR(20) NOT NULL DEFAULT 'v1.0.0',
  head_commit_id VARCHAR(64),
  is_locked BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 3. Master Commits Table (Git-Style DAG)
CREATE TABLE IF NOT EXISTS vcs_commits (
  id VARCHAR(64) PRIMARY KEY,
  package_id VARCHAR(64) NOT NULL REFERENCES vcs_packages(id) ON DELETE CASCADE,
  commit_hash VARCHAR(16) NOT NULL,
  full_sha256 VARCHAR(64) NOT NULL,
  version_tag VARCHAR(20) NOT NULL,
  version_badge vcs_version_tag_enum NOT NULL DEFAULT 'DRAFT',
  commit_message TEXT NOT NULL,
  parent_commit_id VARCHAR(64) REFERENCES vcs_commits(id),
  
  -- Author Details
  author_id VARCHAR(64) NOT NULL,
  author_name VARCHAR(255) NOT NULL,
  author_role VARCHAR(64) NOT NULL,
  author_email VARCHAR(255) NOT NULL,
  author_avatar TEXT,
  
  -- Flags
  is_current_head BOOLEAN NOT NULL DEFAULT false,
  is_snapshot_locked BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 4. Measurement Versions Table
CREATE TABLE IF NOT EXISTS vcs_measurements_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  commit_id VARCHAR(64) NOT NULL REFERENCES vcs_commits(id) ON DELETE CASCADE,
  chest_cm NUMERIC(5,2) NOT NULL,
  waist_drop_cm NUMERIC(5,2) NOT NULL,
  hip_cm NUMERIC(5,2) NOT NULL,
  bicep_cm NUMERIC(5,2) NOT NULL,
  shoulder_width_cm NUMERIC(5,2) NOT NULL,
  sleeve_length_cm NUMERIC(5,2) NOT NULL,
  inseam_length_cm NUMERIC(5,2) NOT NULL,
  neck_cm NUMERIC(5,2) NOT NULL,
  jacket_back_length_cm NUMERIC(5,2) NOT NULL,
  shoulder_slope_angle NUMERIC(4,2) NOT NULL,
  posture_notes TEXT,
  tolerance_mm NUMERIC(3,1) NOT NULL DEFAULT 1.0,
  scan_method VARCHAR(100) NOT NULL DEFAULT 'Manual Tailor Tape',
  unit VARCHAR(10) NOT NULL DEFAULT 'cm'
);

-- 5. Design Versions Table
CREATE TABLE IF NOT EXISTS vcs_design_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  commit_id VARCHAR(64) NOT NULL REFERENCES vcs_commits(id) ON DELETE CASCADE,
  silhouette_name VARCHAR(255) NOT NULL,
  lapel_style VARCHAR(255) NOT NULL,
  lapel_width_cm NUMERIC(4,1) NOT NULL,
  button_configuration VARCHAR(100) NOT NULL,
  button_material VARCHAR(255) NOT NULL,
  pocket_style VARCHAR(255) NOT NULL,
  vent_style VARCHAR(100) NOT NULL,
  canvas_structure VARCHAR(255) NOT NULL,
  lining_style VARCHAR(255) NOT NULL,
  monogram_text VARCHAR(100),
  monogram_thread_color VARCHAR(100),
  sketches JSONB NOT NULL DEFAULT '[]'::jsonb,
  technical_directives TEXT
);

-- 6. Fabric Selection Versions Table
CREATE TABLE IF NOT EXISTS vcs_fabric_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  commit_id VARCHAR(64) NOT NULL REFERENCES vcs_commits(id) ON DELETE CASCADE,
  mill_name VARCHAR(255) NOT NULL,
  mill_location VARCHAR(255) NOT NULL,
  primary_fabric_code VARCHAR(100) NOT NULL,
  primary_fabric_name VARCHAR(255) NOT NULL,
  fiber_composition VARCHAR(255) NOT NULL,
  yarn_count VARCHAR(100) NOT NULL,
  fabric_weight_gsm INT NOT NULL,
  weave_pattern VARCHAR(100) NOT NULL,
  primary_color_name VARCHAR(100) NOT NULL,
  pantone_code VARCHAR(50) NOT NULL,
  lining_silk_name VARCHAR(255) NOT NULL,
  lining_composition VARCHAR(255) NOT NULL,
  lining_pantone VARCHAR(50) NOT NULL,
  weather_coating VARCHAR(100),
  swatch_image_url TEXT
);

-- 7. Approval Snapshot Storage Table (Immutable Vault)
CREATE TABLE IF NOT EXISTS vcs_approval_snapshots (
  snapshot_id VARCHAR(64) PRIMARY KEY,
  commit_id VARCHAR(64) NOT NULL REFERENCES vcs_commits(id) ON DELETE RESTRICT,
  package_id VARCHAR(64) NOT NULL REFERENCES vcs_packages(id) ON DELETE RESTRICT,
  version_tag VARCHAR(20) NOT NULL,
  order_number VARCHAR(64) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  captured_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  digital_signature TEXT NOT NULL,
  sha256_seal VARCHAR(64) NOT NULL,
  legal_terms_declaration TEXT NOT NULL,
  signer_ip INET NOT NULL,
  signer_device TEXT NOT NULL,
  measurements_summary TEXT NOT NULL,
  fabric_summary TEXT NOT NULL,
  design_summary TEXT NOT NULL,
  certificate_number VARCHAR(100) NOT NULL UNIQUE,
  inspector_or_designer VARCHAR(255) NOT NULL
);

-- 8. Rollback / Restore Audit Logs Table
CREATE TABLE IF NOT EXISTS vcs_restore_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id VARCHAR(64) NOT NULL REFERENCES vcs_packages(id) ON DELETE CASCADE,
  source_commit_id VARCHAR(64) NOT NULL REFERENCES vcs_commits(id),
  restored_to_commit_id VARCHAR(64) NOT NULL REFERENCES vcs_commits(id),
  new_head_commit_id VARCHAR(64) NOT NULL REFERENCES vcs_commits(id),
  restored_by_user VARCHAR(255) NOT NULL,
  restored_by_role VARCHAR(64) NOT NULL,
  restore_rationale TEXT NOT NULL,
  restored_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Indices for sub-millisecond retrieval
CREATE INDEX IF NOT EXISTS idx_vcs_commits_pkg ON vcs_commits(package_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_vcs_commits_hash ON vcs_commits(commit_hash);
CREATE INDEX IF NOT EXISTS idx_vcs_approval_pkg ON vcs_approval_snapshots(package_id);
CREATE INDEX IF NOT EXISTS idx_vcs_approval_cert ON vcs_approval_snapshots(certificate_number);
`;
