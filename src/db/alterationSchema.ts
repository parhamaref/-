/**
 * @file alterationSchema.ts
 * Relational Database Schema definition for Daniel’s Maison Alteration & Tailoring Request Module.
 * Models:
 * - 6-Stage Workflow ENUM ('SUBMITTED', 'REVIEWED', 'APPROVED', 'IN_ALTERATION', 'COMPLETED', 'RETURNED')
 * - alteration_requests (Main petition header, customer link, wardrobe garment link)
 * - alteration_fit_changes (Specific anatomical region, direction, deltas)
 * - alteration_photos (Uploaded customer fit photographs with pin coordinates)
 * - alteration_timeline_logs (Audit log for stage transitions)
 *
 * Fully compatible with PostgreSQL / Drizzle ORM.
 */

export const ALTERATION_SQL_DDL = `
-- ============================================================================
-- DANIEL’S MAISON ALTERATION & TAILORING REQUEST DDL SCHEMA
-- ============================================================================

-- 1. Workflow Stage Enum
CREATE TYPE alteration_workflow_stage AS ENUM (
  'SUBMITTED',
  'REVIEWED',
  'APPROVED',
  'IN_ALTERATION',
  'COMPLETED',
  'RETURNED'
);

CREATE TYPE fit_region_enum AS ENUM (
  'CHEST_BUST',
  'WAIST_SUPPRESSION',
  'SLEEVE_LENGTH',
  'JACKET_LENGTH',
  'SHOULDERS_BACK',
  'TROUSER_WAIST',
  'TROUSER_SEAT',
  'TROUSER_INSEAM',
  'TROUSER_LEG_OPENING',
  'COLLAR_NECK',
  'ARMHOLE_DEPTH'
);

CREATE TYPE fit_direction_enum AS ENUM (
  'TAKE_IN',
  'LET_OUT',
  'SHORTEN',
  'LENGTHEN',
  'TAPER',
  'LIFT_BALANCE',
  'LOWER_BALANCE',
  'REMOVE_FOLDS'
);

-- 2. Alteration Requests Master Table
CREATE TABLE alteration_requests (
  id VARCHAR(64) PRIMARY KEY,
  customer_id VARCHAR(64) NOT NULL,
  customer_name VARCHAR(128) NOT NULL,
  customer_email VARCHAR(128),
  customer_phone VARCHAR(64),
  wardrobe_item_id VARCHAR(64) NOT NULL REFERENCES wardrobe_items(id) ON DELETE CASCADE,
  garment_name VARCHAR(255) NOT NULL,
  garment_category VARCHAR(64) NOT NULL,
  garment_serial VARCHAR(64) NOT NULL,
  
  -- Workflow state
  current_stage alteration_workflow_stage NOT NULL DEFAULT 'SUBMITTED',
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  approved_at TIMESTAMP WITH TIME ZONE,
  in_alteration_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  returned_at TIMESTAMP WITH TIME ZONE,

  -- Notes & Context
  alteration_notes TEXT NOT NULL,
  body_posture_notice VARCHAR(64) DEFAULT 'REGULAR_POSTURE',
  wear_occasion VARCHAR(128),
  urgency_level VARCHAR(32) DEFAULT 'STANDARD',

  -- Atelier Management
  assigned_tailor_name VARCHAR(128),
  atelier_branch VARCHAR(128) NOT NULL DEFAULT 'Mayfair Salon & Workshop, London',
  tailor_chalk_notes TEXT,
  estimated_cost_gbp NUMERIC(8, 2) DEFAULT 0.00,
  is_complimentary_warranty BOOLEAN DEFAULT TRUE,
  warranty_serial_number VARCHAR(64),

  -- Logistics
  concierge_pickup BOOLEAN DEFAULT TRUE,
  pickup_address TEXT,
  delivery_address TEXT,
  tracking_number VARCHAR(128),
  courier_service_name VARCHAR(128),
  estimated_delivery_date TIMESTAMP WITH TIME ZONE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Anatomical Fit Changes Table
CREATE TABLE alteration_fit_changes (
  id VARCHAR(64) PRIMARY KEY,
  request_id VARCHAR(64) NOT NULL REFERENCES alteration_requests(id) ON DELETE CASCADE,
  region fit_region_enum NOT NULL,
  region_label VARCHAR(128) NOT NULL,
  direction fit_direction_enum NOT NULL,
  direction_label VARCHAR(128) NOT NULL,
  delta_cm NUMERIC(4, 1) NOT NULL,
  issue_description TEXT,
  tailor_confirmed_delta_cm NUMERIC(4, 1),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Customer Fitting Photos & Pinpoints Table
CREATE TABLE alteration_photos (
  id VARCHAR(64) PRIMARY KEY,
  request_id VARCHAR(64) NOT NULL REFERENCES alteration_requests(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  angle VARCHAR(32) NOT NULL DEFAULT 'FRONT',
  caption TEXT,
  pin_coordinates JSONB DEFAULT '[]'::jsonb,
  is_after_photo BOOLEAN DEFAULT FALSE,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Alteration Workflow Audit Log & Timeline
CREATE TABLE alteration_timeline_logs (
  id VARCHAR(64) PRIMARY KEY,
  request_id VARCHAR(64) NOT NULL REFERENCES alteration_requests(id) ON DELETE CASCADE,
  stage alteration_workflow_stage NOT NULL,
  title VARCHAR(128) NOT NULL,
  description TEXT NOT NULL,
  actor_name VARCHAR(128) NOT NULL,
  actor_role VARCHAR(32) NOT NULL,
  tailor_notes TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indices
CREATE INDEX idx_alterations_customer ON alteration_requests(customer_id);
CREATE INDEX idx_alterations_garment ON alteration_requests(wardrobe_item_id);
CREATE INDEX idx_alterations_stage ON alteration_requests(current_stage);
CREATE INDEX idx_alteration_fit_changes_req ON alteration_fit_changes(request_id);
CREATE INDEX idx_alteration_photos_req ON alteration_photos(request_id);
CREATE INDEX idx_alteration_timeline_req ON alteration_timeline_logs(request_id);
`;
