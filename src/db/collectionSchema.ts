/**
 * @file collectionSchema.ts
 * Relational Database Schema definition for Daniel’s Maison Seasonal Collection Management System.
 * Models:
 * - season_category_enum ('Spring', 'Summer', 'Autumn', 'Winter', 'Bridal', 'Luxury')
 * - collection_visibility_enum ('PUBLIC', 'PRIVATE_VIP', 'ARCHIVED', 'COMING_SOON')
 * - seasonal_collections (Main seasonal lookbook header, editorial narrative, cover image, visibility)
 * - collection_products (Junction table of garments curated into the collection)
 * - collection_color_palettes (Harmonized textile and silk color swatches)
 * - collection_lookbook_media (Runway and high-res campaign assets)
 *
 * Fully compatible with PostgreSQL / Drizzle ORM.
 */

export const COLLECTION_SQL_DDL = `
-- ============================================================================
-- DANIEL’S MAISON SEASONAL COLLECTION MANAGEMENT DDL SCHEMA
-- ============================================================================

-- 1. Seasonal Category Enum
CREATE TYPE season_category_enum AS ENUM (
  'Spring',
  'Summer',
  'Autumn',
  'Winter',
  'Bridal',
  'Luxury'
);

-- 2. Collection Visibility Enum
CREATE TYPE collection_visibility_enum AS ENUM (
  'PUBLIC',
  'PRIVATE_VIP',
  'ARCHIVED',
  'COMING_SOON'
);

-- 3. Seasonal Collections Master Table
CREATE TABLE seasonal_collections (
  id VARCHAR(64) PRIMARY KEY,
  slug VARCHAR(128) UNIQUE NOT NULL,
  title VARCHAR(256) NOT NULL,
  subtitle VARCHAR(256),
  season season_category_enum NOT NULL,
  year INT NOT NULL DEFAULT 2026,
  season_code VARCHAR(32) NOT NULL,
  cover_image_url TEXT NOT NULL,
  hero_banner_url TEXT,
  story_narrative TEXT NOT NULL,
  artistic_director VARCHAR(128) NOT NULL DEFAULT 'Daniel’s Maison',
  muse_inspiration TEXT,
  visibility collection_visibility_enum NOT NULL DEFAULT 'PUBLIC',
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  featured_order INT NOT NULL DEFAULT 0,
  designer_notes TEXT,
  runway_location VARCHAR(256),
  release_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Collection Products Link Table
CREATE TABLE collection_products (
  id VARCHAR(64) PRIMARY KEY,
  collection_id VARCHAR(64) NOT NULL REFERENCES seasonal_collections(id) ON DELETE CASCADE,
  product_id VARCHAR(64) NOT NULL,
  product_name VARCHAR(256) NOT NULL,
  category VARCHAR(64) NOT NULL,
  price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  currency VARCHAR(8) NOT NULL DEFAULT 'GBP',
  image_url TEXT NOT NULL,
  primary_fabric VARCHAR(256),
  silhouette VARCHAR(128),
  is_hero_piece BOOLEAN NOT NULL DEFAULT FALSE,
  short_description TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (collection_id, product_id)
);

-- 5. Collection Color Palettes Table
CREATE TABLE collection_color_palettes (
  id VARCHAR(64) PRIMARY KEY,
  collection_id VARCHAR(64) NOT NULL REFERENCES seasonal_collections(id) ON DELETE CASCADE,
  color_name VARCHAR(64) NOT NULL,
  hex_code VARCHAR(16) NOT NULL,
  role_note VARCHAR(128),
  sort_order INT NOT NULL DEFAULT 0
);

-- 6. Collection Textile Highlights Table
CREATE TABLE collection_textiles (
  id VARCHAR(64) PRIMARY KEY,
  collection_id VARCHAR(64) NOT NULL REFERENCES seasonal_collections(id) ON DELETE CASCADE,
  highlight_name VARCHAR(256) NOT NULL,
  mill_origin VARCHAR(128),
  sort_order INT NOT NULL DEFAULT 0
);

-- 7. Collection Lookbook Media Table
CREATE TABLE collection_lookbook_media (
  id VARCHAR(64) PRIMARY KEY,
  collection_id VARCHAR(64) NOT NULL REFERENCES seasonal_collections(id) ON DELETE CASCADE,
  media_url TEXT NOT NULL,
  caption TEXT,
  media_type VARCHAR(16) NOT NULL DEFAULT 'IMAGE',
  sort_order INT NOT NULL DEFAULT 0
);

-- 8. Performance Indexes
CREATE INDEX idx_seasonal_collections_season ON seasonal_collections(season);
CREATE INDEX idx_seasonal_collections_visibility ON seasonal_collections(visibility);
CREATE INDEX idx_seasonal_collections_featured ON seasonal_collections(is_featured, featured_order);
CREATE INDEX idx_collection_products_collection ON collection_products(collection_id);
`;
