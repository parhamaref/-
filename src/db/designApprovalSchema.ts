/**
 * @file designApprovalSchema.ts
 * Relational Database Schema Definition for Daniel’s Maison Design Approval Workflow.
 *
 * Models:
 * - 6-Stage Workflow ENUM ('DRAFT', 'SUBMITTED', 'REVISION_REQUESTED', 'UPDATED', 'APPROVED', 'PRODUCTION', 'REJECTED')
 * - design_approval_packages: Main commission design header, customer link, order link
 * - design_package_versions: Immutable snapshot of version (v1.0, v1.1, v2.0) with changelog
 * - design_sketches: Technical CAD and artistic sketches with annotated coordinates
 * - design_fabric_color_specs: Textile, yarn count, Pantone, lining specifications
 * - design_measurement_specs: Full anatomical bespoke measurement matrix with tolerances
 * - design_custom_requests: Monogram, lapel, canvas, horn button directives
 * - design_revision_items: Client requested modifications with status and designer response
 * - design_approval_logs: Formal legally binding client sign-off records with digital signature
 * - design_audit_trail_events: Immutable chronological event log for compliance & tracking
 *
 * Fully compatible with PostgreSQL / Drizzle ORM.
 */

export const DESIGN_APPROVAL_SQL_DDL = `
-- ============================================================================
-- DANIEL’S MAISON DESIGN APPROVAL WORKFLOW DDL SCHEMA
-- ============================================================================

-- 1. Workflow Stage Enum
CREATE TYPE design_approval_stage AS ENUM (
  'DRAFT',
  'SUBMITTED',
  'REVISION_REQUESTED',
  'UPDATED',
  'APPROVED',
  'PRODUCTION',
  'REJECTED'
);

-- 2. Customer Review Component Enum
CREATE TYPE customer_review_component AS ENUM (
  'SKETCHES',
  'FABRIC',
  'COLOR',
  'MEASUREMENTS',
  'CUSTOM_REQUESTS'
);

-- 3. Revision Status Enum
CREATE TYPE revision_status_enum AS ENUM (
  'PENDING',
  'ADDRESSED',
  'DEFERRED',
  'DECLINED'
);

-- 4. Main Design Approval Packages Table
CREATE TABLE design_approval_packages (
  id VARCHAR(64) PRIMARY KEY,
  order_id VARCHAR(64) NOT NULL,
  order_number VARCHAR(64) NOT NULL,
  customer_id VARCHAR(64) NOT NULL,
  customer_name VARCHAR(128) NOT NULL,
  customer_email VARCHAR(128) NOT NULL,
  garment_name VARCHAR(256) NOT NULL,
  garment_category VARCHAR(64) NOT NULL,
  primary_thumbnail TEXT NOT NULL,
  price_gbp NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  current_stage design_approval_stage NOT NULL DEFAULT 'DRAFT',
  current_version VARCHAR(16) NOT NULL DEFAULT '1.0',
  sla_deadline TIMESTAMPTZ NOT NULL,
  lead_designer VARCHAR(128) NOT NULL,
  master_tailor VARCHAR(128) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Design Package Versions Table
CREATE TABLE design_package_versions (
  id VARCHAR(64) PRIMARY KEY,
  package_id VARCHAR(64) NOT NULL REFERENCES design_approval_packages(id) ON DELETE CASCADE,
  version_number VARCHAR(16) NOT NULL,
  created_by VARCHAR(128) NOT NULL,
  creator_role VARCHAR(64) NOT NULL,
  change_summary TEXT NOT NULL,
  changed_components JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (package_id, version_number)
);

-- 6. Design Sketches Table
CREATE TABLE design_sketches (
  id VARCHAR(64) PRIMARY KEY,
  version_id VARCHAR(64) NOT NULL REFERENCES design_package_versions(id) ON DELETE CASCADE,
  view_angle VARCHAR(32) NOT NULL,
  title VARCHAR(128) NOT NULL,
  image_url TEXT NOT NULL,
  caption TEXT,
  cad_specification TEXT,
  annotated_points JSONB NOT NULL DEFAULT '[]'::jsonb,
  display_order INT NOT NULL DEFAULT 0
);

-- 7. Fabric & Color Specifications Table
CREATE TABLE design_fabric_color_specs (
  id VARCHAR(64) PRIMARY KEY,
  version_id VARCHAR(64) NOT NULL REFERENCES design_package_versions(id) ON DELETE CASCADE,
  mill_name VARCHAR(128) NOT NULL,
  cloth_code VARCHAR(64) NOT NULL,
  cloth_name VARCHAR(128) NOT NULL,
  composition TEXT NOT NULL,
  weight_gsm INT NOT NULL,
  weight_oz NUMERIC(5, 2),
  weave_type VARCHAR(128) NOT NULL,
  origin_country VARCHAR(64) NOT NULL,
  swatch_image_url TEXT NOT NULL,
  tactile_characteristics TEXT,
  drape_class VARCHAR(64) NOT NULL,
  breathability_index VARCHAR(64) NOT NULL,
  primary_color_name VARCHAR(64) NOT NULL,
  primary_color_hex VARCHAR(16) NOT NULL,
  pantone_reference VARCHAR(64),
  lining_color_name VARCHAR(64) NOT NULL,
  lining_color_hex VARCHAR(16) NOT NULL,
  lining_silk_pattern VARCHAR(128),
  buttonhole_thread_color_name VARCHAR(64),
  buttonhole_thread_color_hex VARCHAR(16),
  contrast_details TEXT
);

-- 8. Anatomical Measurement Specs Table
CREATE TABLE design_measurement_specs (
  id VARCHAR(64) PRIMARY KEY,
  version_id VARCHAR(64) NOT NULL REFERENCES design_package_versions(id) ON DELETE CASCADE,
  profile_id VARCHAR(64) NOT NULL,
  profile_name VARCHAR(128) NOT NULL,
  unit VARCHAR(8) NOT NULL DEFAULT 'cm',
  verified_at TIMESTAMPTZ NOT NULL,
  verified_by_tailor VARCHAR(128) NOT NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  customer_height_cm NUMERIC(5, 1),
  customer_weight_kg NUMERIC(5, 1),
  stance_posture TEXT,
  fit_preference VARCHAR(64) NOT NULL
);

-- 9. Custom Requests Table
CREATE TABLE design_custom_requests (
  id VARCHAR(64) PRIMARY KEY,
  version_id VARCHAR(64) NOT NULL REFERENCES design_package_versions(id) ON DELETE CASCADE,
  monogram_text VARCHAR(64),
  monogram_font VARCHAR(64),
  monogram_thread_color VARCHAR(64),
  monogram_placement VARCHAR(128),
  lapel_style VARCHAR(128) NOT NULL,
  button_material VARCHAR(128) NOT NULL,
  pocket_configuration VARCHAR(128) NOT NULL,
  vents_configuration VARCHAR(128) NOT NULL,
  canvas_construction TEXT NOT NULL,
  interior_pockets TEXT,
  additional_tailor_directives TEXT
);

-- 10. Design Revision Items Table
CREATE TABLE design_revision_items (
  id VARCHAR(64) PRIMARY KEY,
  package_id VARCHAR(64) NOT NULL REFERENCES design_approval_packages(id) ON DELETE CASCADE,
  component customer_review_component NOT NULL,
  title VARCHAR(256) NOT NULL,
  client_comment TEXT NOT NULL,
  requested_changes TEXT NOT NULL,
  status revision_status_enum NOT NULL DEFAULT 'PENDING',
  designer_response TEXT,
  resolved_at TIMESTAMPTZ,
  resolved_in_version VARCHAR(16),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. Design Approval Logs Table
CREATE TABLE design_approval_logs (
  id VARCHAR(64) PRIMARY KEY,
  package_id VARCHAR(64) NOT NULL REFERENCES design_approval_packages(id) ON DELETE CASCADE,
  action VARCHAR(32) NOT NULL,
  version_approved VARCHAR(16) NOT NULL,
  actor_name VARCHAR(128) NOT NULL,
  actor_email VARCHAR(128) NOT NULL,
  actor_role VARCHAR(32) NOT NULL,
  digital_signature TEXT NOT NULL,
  declaration_accepted BOOLEAN NOT NULL DEFAULT FALSE,
  notes TEXT,
  client_ip VARCHAR(64),
  device_metadata TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. Design Audit Trail Events Table
CREATE TABLE design_audit_trail_events (
  id VARCHAR(64) PRIMARY KEY,
  package_id VARCHAR(64) NOT NULL REFERENCES design_approval_packages(id) ON DELETE CASCADE,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actor VARCHAR(128) NOT NULL,
  actor_role VARCHAR(64) NOT NULL,
  event_code VARCHAR(64) NOT NULL,
  description TEXT NOT NULL,
  previous_stage design_approval_stage,
  new_stage design_approval_stage,
  version VARCHAR(16) NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- 13. Indexes for High-Velocity Atelier Operations
CREATE INDEX idx_design_packages_customer ON design_approval_packages(customer_id);
CREATE INDEX idx_design_packages_order ON design_approval_packages(order_id);
CREATE INDEX idx_design_packages_stage ON design_approval_packages(current_stage);
CREATE INDEX idx_design_versions_package ON design_package_versions(package_id);
CREATE INDEX idx_design_revisions_package ON design_revision_items(package_id);
CREATE INDEX idx_design_audit_package ON design_audit_trail_events(package_id, timestamp DESC);
`;
