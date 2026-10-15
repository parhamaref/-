/**
 * @file customerPreferencesSchema.ts
 * Relational Database Schema definition for Daniel’s Maison Customer Preference Management
 * and Personalized Recommendation Engine.
 *
 * Models:
 * - customer_preference_profiles: Core preferences header (Fit, Tolerance, Price Range, Persona)
 * - customer_favorite_colors: Color swatches (Hex, Color Name, Category)
 * - customer_favorite_fabrics: Textile and mill affinities (Loro Piana, Scabal, Fox Brothers, Cashmere)
 * - customer_favorite_designers: Atelier artisans and creative directors
 * - customer_preferred_styles: Aesthetic silhouette preferences (Double-breasted, 3-Piece, Tuxedo)
 * - customer_preferred_collections: Seasonal collection affinities (Spring, Summer, Autumn, Winter, Bridal, Luxury)
 * - customer_marketing_preferences: VIP trunk show, fabric alert, and channel preferences
 * - customer_recommendation_logs: Audit log of algorithmic recommendation suggestions and client conversions
 *
 * Fully compatible with PostgreSQL / Drizzle ORM.
 */

export const CUSTOMER_PREFERENCES_SQL_DDL = `
-- ============================================================================
-- DANIEL’S MAISON CUSTOMER PREFERENCE & RECOMMENDATION ARCHITECTURE DDL
-- ============================================================================

-- 1. Master Customer Preference Profiles
CREATE TABLE customer_preference_profiles (
  customer_id VARCHAR(64) PRIMARY KEY,
  customer_name VARCHAR(128) NOT NULL,
  customer_email VARCHAR(128) NOT NULL,
  vip_persona_title VARCHAR(128) NOT NULL DEFAULT 'Savile Row Sovereign Traditionalist',
  preferred_fit VARCHAR(64) NOT NULL DEFAULT 'Sleek Savile Row Cut',
  fit_ease_tolerance VARCHAR(64) NOT NULL DEFAULT 'Standard True-to-Measure (0cm ease)',
  min_price_budget NUMERIC(10, 2) NOT NULL DEFAULT 2500.00,
  max_price_budget NUMERIC(10, 2) NOT NULL DEFAULT 8500.00,
  currency VARCHAR(8) NOT NULL DEFAULT 'GBP',
  budget_tier VARCHAR(32) NOT NULL DEFAULT 'SIGNATURE_SAVILE_ROW',
  allow_high_value_exceptions BOOLEAN NOT NULL DEFAULT TRUE,
  personal_styling_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Customer Favorite Colors Table
CREATE TABLE customer_favorite_colors (
  id VARCHAR(64) PRIMARY KEY,
  customer_id VARCHAR(64) NOT NULL REFERENCES customer_preference_profiles(customer_id) ON DELETE CASCADE,
  color_name VARCHAR(64) NOT NULL,
  hex_code VARCHAR(16) NOT NULL,
  category VARCHAR(32) NOT NULL DEFAULT 'Dark Tailoring',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Customer Favorite Fabrics Table
CREATE TABLE customer_favorite_fabrics (
  id VARCHAR(64) PRIMARY KEY,
  customer_id VARCHAR(64) NOT NULL REFERENCES customer_preference_profiles(customer_id) ON DELETE CASCADE,
  fabric_name VARCHAR(128) NOT NULL,
  mill_name VARCHAR(128) NOT NULL,
  category VARCHAR(32) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Customer Favorite Designers Table
CREATE TABLE customer_favorite_designers (
  id VARCHAR(64) PRIMARY KEY,
  customer_id VARCHAR(64) NOT NULL REFERENCES customer_preference_profiles(customer_id) ON DELETE CASCADE,
  designer_name VARCHAR(128) NOT NULL,
  role VARCHAR(64) NOT NULL,
  atelier_brand VARCHAR(128),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Customer Preferred Styles Table
CREATE TABLE customer_preferred_styles (
  id VARCHAR(64) PRIMARY KEY,
  customer_id VARCHAR(64) NOT NULL REFERENCES customer_preference_profiles(customer_id) ON DELETE CASCADE,
  style_aesthetic VARCHAR(64) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Customer Preferred Collections Table
CREATE TABLE customer_preferred_collections (
  id VARCHAR(64) PRIMARY KEY,
  customer_id VARCHAR(64) NOT NULL REFERENCES customer_preference_profiles(customer_id) ON DELETE CASCADE,
  season_category VARCHAR(32) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Customer Marketing Personalization Preferences
CREATE TABLE customer_marketing_preferences (
  customer_id VARCHAR(64) PRIMARY KEY REFERENCES customer_preference_profiles(customer_id) ON DELETE CASCADE,
  vip_trunk_show_invites BOOLEAN NOT NULL DEFAULT TRUE,
  rare_textile_allocation_alerts BOOLEAN NOT NULL DEFAULT TRUE,
  seasonal_lookbook_early_access BOOLEAN NOT NULL DEFAULT TRUE,
  fitting_salon_champagne_booking BOOLEAN NOT NULL DEFAULT TRUE,
  communication_channel VARCHAR(32) NOT NULL DEFAULT 'WHATSAPP_CONCIERGE',
  appointment_day VARCHAR(32) NOT NULL DEFAULT 'WEEKDAY_MORNING',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Recommendation Impression & Conversion Logs
CREATE TABLE customer_recommendation_logs (
  id VARCHAR(64) PRIMARY KEY,
  customer_id VARCHAR(64) NOT NULL REFERENCES customer_preference_profiles(customer_id) ON DELETE CASCADE,
  entity_type VARCHAR(32) NOT NULL, -- 'PRODUCT' or 'COLLECTION'
  entity_id VARCHAR(64) NOT NULL,
  match_score NUMERIC(5, 2) NOT NULL, -- e.g. 98.50%
  matching_reasons JSONB NOT NULL DEFAULT '[]'::jsonb,
  action_taken VARCHAR(32) DEFAULT 'VIEWED', -- 'VIEWED', 'COMMISSION_INQUIRY', 'DISMISSED'
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Indexes
CREATE INDEX idx_customer_colors_cust ON customer_favorite_colors(customer_id);
CREATE INDEX idx_customer_fabrics_cust ON customer_favorite_fabrics(customer_id);
CREATE INDEX idx_customer_styles_cust ON customer_preferred_styles(customer_id);
CREATE INDEX idx_customer_rec_logs_cust ON customer_recommendation_logs(customer_id, timestamp DESC);
`;
