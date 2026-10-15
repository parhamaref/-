/**
 * @file designerVerificationSchema.ts
 * Relational Database Schema for Daniel's Maison Designer Verification System.
 * PostgreSQL & Drizzle ORM compatible definitions.
 */

export const DESIGNER_VERIFICATION_DDL = `
-- 1. Status ENUM definitions
CREATE TYPE designer_verification_status AS ENUM (
  'Submitted',
  'Under Review',
  'More Information Required',
  'Approved',
  'Rejected'
);

CREATE TYPE verification_pillar_status AS ENUM (
  'unverified',
  'pending',
  'verified',
  'rejected',
  'flagged'
);

CREATE TYPE government_id_type AS ENUM (
  'passport',
  'national_id',
  'residence_permit',
  'artisan_guild_card'
);

CREATE TYPE accreditation_tier AS ENUM (
  'Maison Accredited',
  'Master Craftsman',
  'Haute Couture Guild'
);

-- 2. Master Verification Applications Table
CREATE TABLE designer_verification_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  designer_id VARCHAR(120) NOT NULL REFERENCES designers(id) ON DELETE CASCADE,
  designer_name VARCHAR(255) NOT NULL,
  brand_name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  status designer_verification_status NOT NULL DEFAULT 'Submitted',
  priority VARCHAR(20) NOT NULL DEFAULT 'Normal',
  assigned_reviewer_id VARCHAR(120),
  assigned_reviewer_name VARCHAR(255),
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Pillar 1: Identity Verification
CREATE TABLE designer_identity_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES designer_verification_applications(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  date_of_birth DATE NOT NULL,
  nationality VARCHAR(100) NOT NULL,
  id_type government_id_type NOT NULL,
  id_number_masked VARCHAR(50) NOT NULL,
  id_document_url TEXT NOT NULL,
  id_expiry_date DATE NOT NULL,
  proof_of_address_url TEXT NOT NULL,
  biometric_score NUMERIC(5,2),
  sanctions_check_passed BOOLEAN DEFAULT true,
  status verification_pillar_status DEFAULT 'pending',
  verified_at TIMESTAMP WITH TIME ZONE,
  reviewer_notes TEXT
);

-- 4. Pillar 2: Business & Atelier Verification
CREATE TABLE designer_business_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES designer_verification_applications(id) ON DELETE CASCADE,
  legal_entity_name VARCHAR(255) NOT NULL,
  trade_name VARCHAR(255) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  registration_number VARCHAR(100) NOT NULL,
  tax_vat_number VARCHAR(100) NOT NULL,
  registered_country VARCHAR(100) NOT NULL,
  registered_address TEXT NOT NULL,
  workshop_address TEXT NOT NULL,
  certificate_incorporation_url TEXT NOT NULL,
  tax_certificate_url TEXT NOT NULL,
  atelier_facility_photos JSONB DEFAULT '[]'::jsonb,
  status verification_pillar_status DEFAULT 'pending',
  verified_at TIMESTAMP WITH TIME ZONE,
  reviewer_notes TEXT
);

-- 5. Pillar 3: Portfolio & Craftsmanship Verification
CREATE TABLE designer_portfolio_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES designer_verification_applications(id) ON DELETE CASCADE,
  bio_and_heritage TEXT NOT NULL,
  years_in_practice INTEGER NOT NULL DEFAULT 1,
  atelier_city VARCHAR(100) NOT NULL,
  atelier_country VARCHAR(100) NOT NULL,
  press_mentions JSONB DEFAULT '[]'::jsonb,
  guild_affiliations JSONB DEFAULT '[]'::jsonb,
  status verification_pillar_status DEFAULT 'pending',
  verified_at TIMESTAMP WITH TIME ZONE,
  reviewer_notes TEXT
);

-- 6. Portfolio Showcase Works Table
CREATE TABLE designer_portfolio_works (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_verification_id UUID NOT NULL REFERENCES designer_portfolio_verifications(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  collection_year INTEGER NOT NULL,
  category VARCHAR(100) NOT NULL,
  craft_techniques JSONB NOT NULL DEFAULT '[]'::jsonb,
  image_url TEXT NOT NULL,
  materials_used JSONB NOT NULL DEFAULT '[]'::jsonb,
  client_description TEXT
);

-- 7. Audit Trail & Decision Logs
CREATE TABLE designer_verification_audit_trail (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES designer_verification_applications(id) ON DELETE CASCADE,
  actor_name VARCHAR(255) NOT NULL,
  actor_role VARCHAR(100) NOT NULL,
  from_status designer_verification_status,
  to_status designer_verification_status NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. More Information Queries & Supplemental Requests
CREATE TABLE designer_verification_queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES designer_verification_applications(id) ON DELETE CASCADE,
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  requested_by VARCHAR(255) NOT NULL,
  notes TEXT NOT NULL,
  deadline_date DATE NOT NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  designer_responded_at TIMESTAMP WITH TIME ZONE,
  designer_explanation TEXT
);

-- 9. Issued Accreditation Seals
CREATE TABLE designer_accreditation_seals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID UNIQUE NOT NULL REFERENCES designer_verification_applications(id),
  designer_id VARCHAR(120) NOT NULL,
  seal_number VARCHAR(80) UNIQUE NOT NULL,
  tier accreditation_tier NOT NULL,
  approved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved_by VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  badge_url TEXT
);
`;
