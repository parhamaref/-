/**
 * @file wardrobeSchema.ts
 * Relational Database Schema definition for Daniel’s Maison Digital Wardrobe Management System.
 * Models customer wardrobe items, garment specifications, size history logs,
 * alteration histories, material provenance, warranty certificates, and service requests.
 * Compatible with PostgreSQL / Drizzle ORM / SQL DDL.
 */

export const WARDROBE_SQL_DDL = `
-- ============================================================================
-- DANIEL’S MAISON DIGITAL WARDROBE MANAGEMENT SYSTEM DDL SCHEMA
-- ============================================================================

-- 1. Garment Categories & Status Enums
CREATE TYPE wardrobe_category AS ENUM (
  'SUITS',
  'SHIRTS',
  'COATS',
  'DRESSES',
  'ACCESSORIES'
);

CREATE TYPE garment_status AS ENUM (
  'IN_WARDROBE',
  'IN_ATELIER',
  'ALTERATION_IN_PROGRESS',
  'REPAIR_IN_PROGRESS',
  'CLEANING_IN_PROGRESS',
  'CARE_IN_PROGRESS',
  'DISPATCHED_RETURN',
  'ARCHIVED'
);

CREATE TYPE service_action_type AS ENUM (
  'REORDER_SAME_ITEM',
  'REQUEST_ALTERATION',
  'REQUEST_REPAIR',
  'REQUEST_CARE_SERVICE',
  'REQUEST_CLEANING_SERVICE',
  'REQUEST_RECREATION_MEASUREMENTS'
);

CREATE TYPE service_request_status AS ENUM (
  'SUBMITTED',
  'COURIER_PICKUP_SCHEDULED',
  'RECEIVED_AT_ATELIER',
  'IN_PROGRESS',
  'QUALITY_INSPECTION',
  'DISPATCHED_TO_CLIENT',
  'COMPLETED',
  'CANCELLED'
);

-- 2. Wardrobe Items (Master Acquired Garments Table)
CREATE TABLE wardrobe_items (
  id VARCHAR(64) PRIMARY KEY,
  customer_id VARCHAR(64) NOT NULL,
  original_order_id VARCHAR(64) NOT NULL,
  product_id VARCHAR(64) NOT NULL,
  garment_name VARCHAR(255) NOT NULL,
  category wardrobe_category NOT NULL,
  silhouette_style VARCHAR(128) NOT NULL,
  status garment_status NOT NULL DEFAULT 'IN_WARDROBE',
  acquired_date TIMESTAMP WITH TIME ZONE NOT NULL,
  original_price_gbp NUMERIC(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'GBP',
  primary_image_url TEXT NOT NULL,
  gallery_image_urls JSONB DEFAULT '[]'::jsonb,
  master_tailor_name VARCHAR(128) NOT NULL,
  atelier_location VARCHAR(128) NOT NULL,
  client_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Garment Material Specifications
CREATE TABLE garment_materials (
  id VARCHAR(64) PRIMARY KEY,
  wardrobe_item_id VARCHAR(64) REFERENCES wardrobe_items(id) ON DELETE CASCADE,
  fabric_mill_name VARCHAR(128) NOT NULL,
  fabric_mill_country VARCHAR(64) NOT NULL,
  fabric_name VARCHAR(128) NOT NULL,
  composition VARCHAR(255) NOT NULL,
  weight_gsm INTEGER NOT NULL,
  weave_structure VARCHAR(64) NOT NULL,
  breathability_rating VARCHAR(32) NOT NULL,
  lining_fabric VARCHAR(128),
  button_material VARCHAR(128),
  interlining_type VARCHAR(128),
  environmental_certification VARCHAR(128)
);

-- 4. Garment Color & Finish Specifications
CREATE TABLE garment_colors (
  id VARCHAR(64) PRIMARY KEY,
  wardrobe_item_id VARCHAR(64) REFERENCES wardrobe_items(id) ON DELETE CASCADE,
  primary_color_name VARCHAR(128) NOT NULL,
  hex_code VARCHAR(7) NOT NULL,
  dye_batch_number VARCHAR(64) NOT NULL,
  pattern_type VARCHAR(64) NOT NULL,
  accent_lining_color VARCHAR(128),
  stitch_thread_color VARCHAR(128)
);

-- 5. Size & Biometric Measurement History
CREATE TABLE garment_size_histories (
  id VARCHAR(64) PRIMARY KEY,
  wardrobe_item_id VARCHAR(64) REFERENCES wardrobe_items(id) ON DELETE CASCADE,
  profile_version VARCHAR(32) NOT NULL,
  recorded_date TIMESTAMP WITH TIME ZONE NOT NULL,
  fit_preset VARCHAR(64) NOT NULL,
  chest_circ_cm NUMERIC(5, 2),
  waist_circ_cm NUMERIC(5, 2),
  hips_circ_cm NUMERIC(5, 2),
  shoulder_width_cm NUMERIC(5, 2),
  sleeve_length_cm NUMERIC(5, 2),
  back_length_cm NUMERIC(5, 2),
  trouser_inseam_cm NUMERIC(5, 2),
  trouser_outseam_cm NUMERIC(5, 2),
  trouser_waist_cm NUMERIC(5, 2),
  notes TEXT
);

-- 6. Garment Alteration & Repair History
CREATE TABLE garment_alteration_histories (
  id VARCHAR(64) PRIMARY KEY,
  wardrobe_item_id VARCHAR(64) REFERENCES wardrobe_items(id) ON DELETE CASCADE,
  alteration_date TIMESTAMP WITH TIME ZONE NOT NULL,
  service_type VARCHAR(64) NOT NULL,
  description TEXT NOT NULL,
  tailor_name VARCHAR(128) NOT NULL,
  atelier_branch VARCHAR(128) NOT NULL,
  cost_gbp NUMERIC(8, 2) DEFAULT 0.00,
  is_complimentary BOOLEAN DEFAULT TRUE,
  measurement_delta JSONB DEFAULT '{}'::jsonb,
  before_photo_url TEXT,
  after_photo_url TEXT
);

-- 7. Garment Care & Preservation Guides
CREATE TABLE garment_care_protocols (
  id VARCHAR(64) PRIMARY KEY,
  wardrobe_item_id VARCHAR(64) REFERENCES wardrobe_items(id) ON DELETE CASCADE,
  pressing_temperature_celsius INTEGER NOT NULL,
  steam_recommendation VARCHAR(128) NOT NULL,
  dry_cleaning_instruction TEXT NOT NULL,
  brushing_technique TEXT NOT NULL,
  hanger_type VARCHAR(128) NOT NULL,
  seasonal_storage_notes TEXT NOT NULL,
  cleaning_frequency_guideline VARCHAR(128) NOT NULL
);

-- 8. Lifetime Warranty & Authenticity Certificates
CREATE TABLE garment_warranties (
  id VARCHAR(64) PRIMARY KEY,
  wardrobe_item_id VARCHAR(64) REFERENCES wardrobe_items(id) ON DELETE CASCADE,
  certificate_serial_number VARCHAR(64) UNIQUE NOT NULL,
  cryptographic_hash VARCHAR(128) NOT NULL,
  warranty_tier VARCHAR(64) NOT NULL DEFAULT 'LIFETIME_BESPOKE_STEWARDSHIP',
  is_active BOOLEAN DEFAULT TRUE,
  coverage_summary TEXT NOT NULL,
  complimentary_alterations_remaining INTEGER DEFAULT -1, -- -1 denotes unlimited lifetime
  complimentary_cleanings_remaining INTEGER DEFAULT 2,
  complimentary_repairs_remaining INTEGER DEFAULT -1,
  issued_at TIMESTAMP WITH TIME ZONE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE -- NULL for lifetime
);

-- 9. Wardrobe Service Requests (Customer Action Pipeline)
CREATE TABLE wardrobe_service_requests (
  id VARCHAR(64) PRIMARY KEY,
  wardrobe_item_id VARCHAR(64) REFERENCES wardrobe_items(id) ON DELETE CASCADE,
  customer_id VARCHAR(64) NOT NULL,
  action_type service_action_type NOT NULL,
  status service_request_status NOT NULL DEFAULT 'SUBMITTED',
  requested_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  target_completion_date TIMESTAMP WITH TIME ZONE,
  urgency_level VARCHAR(32) DEFAULT 'STANDARD',
  specific_instructions TEXT NOT NULL,
  concierge_pickup_requested BOOLEAN DEFAULT TRUE,
  pickup_address TEXT,
  preferred_fitting_salon VARCHAR(128),
  estimated_cost_gbp NUMERIC(8, 2) DEFAULT 0.00,
  assigned_artisan_name VARCHAR(128),
  status_timeline JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indices for rapid querying
CREATE INDEX idx_wardrobe_items_customer ON wardrobe_items(customer_id);
CREATE INDEX idx_wardrobe_items_category ON wardrobe_items(category);
CREATE INDEX idx_wardrobe_items_status ON wardrobe_items(status);
CREATE INDEX idx_service_requests_status ON wardrobe_service_requests(status);
CREATE INDEX idx_service_requests_customer ON wardrobe_service_requests(customer_id);
`;
