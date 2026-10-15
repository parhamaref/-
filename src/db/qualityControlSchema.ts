/**
 * @file qualityControlSchema.ts
 * Relational Database Schema & DDL for Daniel’s Maison Advanced Quality Control System.
 * PostgreSQL & Drizzle ORM compatible definitions.
 */

export const QUALITY_CONTROL_DDL = `
-- 1. QC Result ENUM
CREATE TYPE qc_result_enum AS ENUM ('Pass', 'Fail', 'Rework Required');
CREATE TYPE qc_defect_severity_enum AS ENUM ('Minor', 'Major', 'Critical');
CREATE TYPE qc_corrective_action_status_enum AS ENUM ('Pending', 'In Progress', 'Resolved', 'Waived');
CREATE TYPE qc_check_item_status_enum AS ENUM ('Pass', 'Fail', 'Flagged', 'Pending');

-- 2. Master QC Inspection Sessions Table
CREATE TABLE IF NOT EXISTS qc_inspection_sessions (
    id VARCHAR(64) PRIMARY KEY,
    order_id VARCHAR(64) NOT NULL,
    client_name VARCHAR(255) NOT NULL,
    garment_name VARCHAR(255) NOT NULL,
    garment_silhouette VARCHAR(128) NOT NULL,
    partner_atelier VARCHAR(255) NOT NULL,
    order_total NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    inspection_date DATE NOT NULL DEFAULT CURRENT_DATE,
    inspector_id VARCHAR(64) NOT NULL,
    inspector_name VARCHAR(255) NOT NULL,
    result qc_result_enum NOT NULL DEFAULT 'Pass',
    status VARCHAR(32) NOT NULL DEFAULT 'In Progress',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_qc_sessions_order_id ON qc_inspection_sessions(order_id);
CREATE INDEX IF NOT EXISTS idx_qc_sessions_result ON qc_inspection_sessions(result);

-- 3. Inspection Checklist Table
CREATE TABLE IF NOT EXISTS qc_checklist_items (
    id VARCHAR(64) PRIMARY KEY,
    inspection_id VARCHAR(64) REFERENCES qc_inspection_sessions(id) ON DELETE CASCADE,
    category VARCHAR(64) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    tolerance_mm NUMERIC(5, 2),
    status qc_check_item_status_enum NOT NULL DEFAULT 'Pending',
    notes TEXT,
    photo_ref_id VARCHAR(64),
    checked_by VARCHAR(255),
    checked_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_qc_checklist_inspection ON qc_checklist_items(inspection_id);

-- 4. Garment Measurements Table
CREATE TABLE IF NOT EXISTS qc_garment_measurements (
    id VARCHAR(64) PRIMARY KEY,
    inspection_id VARCHAR(64) REFERENCES qc_inspection_sessions(id) ON DELETE CASCADE,
    point_of_measure VARCHAR(128) NOT NULL,
    anatomical_zone VARCHAR(64) NOT NULL,
    target_spec_cm NUMERIC(6, 2) NOT NULL,
    actual_measured_cm NUMERIC(6, 2) NOT NULL,
    tolerance_minus_mm NUMERIC(4, 1) NOT NULL DEFAULT 2.0,
    tolerance_plus_mm NUMERIC(4, 1) NOT NULL DEFAULT 2.0,
    variance_mm NUMERIC(5, 2) NOT NULL DEFAULT 0.0,
    status VARCHAR(32) NOT NULL DEFAULT 'In Tolerance',
    notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_qc_measurements_inspection ON qc_garment_measurements(inspection_id);

-- 5. Fabric Verification Table
CREATE TABLE IF NOT EXISTS qc_fabric_verifications (
    id VARCHAR(64) PRIMARY KEY,
    inspection_id VARCHAR(64) UNIQUE REFERENCES qc_inspection_sessions(id) ON DELETE CASCADE,
    fabric_code VARCHAR(64) NOT NULL,
    mill_name VARCHAR(255) NOT NULL,
    composition VARCHAR(255) NOT NULL,
    declared_gsm INTEGER NOT NULL,
    tested_gsm INTEGER NOT NULL,
    weave_pattern VARCHAR(64) NOT NULL,
    shade_match_delta_e NUMERIC(4, 2) NOT NULL,
    color_match_status VARCHAR(32) NOT NULL,
    yarn_count VARCHAR(64) NOT NULL,
    flaw_inspection_result VARCHAR(64) NOT NULL,
    sheen_and_handle_check VARCHAR(16) NOT NULL,
    shrinkage_resistance_pass BOOLEAN NOT NULL DEFAULT TRUE,
    notes TEXT,
    swatch_image_url TEXT
);

-- 6. Finish Inspection Table
CREATE TABLE IF NOT EXISTS qc_finish_inspections (
    id VARCHAR(64) PRIMARY KEY,
    inspection_id VARCHAR(64) UNIQUE REFERENCES qc_inspection_sessions(id) ON DELETE CASCADE,
    seam_puckering_rating INTEGER CHECK (seam_puckering_rating BETWEEN 1 AND 5),
    stitch_density_per_cm NUMERIC(4, 1) NOT NULL,
    milanese_buttonhole_quality VARCHAR(64) NOT NULL,
    cupro_lining_ease_pass BOOLEAN NOT NULL DEFAULT TRUE,
    lapel_roll_fullness_pass BOOLEAN NOT NULL DEFAULT TRUE,
    cold_iron_press_shine_free BOOLEAN NOT NULL DEFAULT TRUE,
    thread_trimmed_100_percent BOOLEAN NOT NULL DEFAULT TRUE,
    zipper_and_fasteners_fluidity VARCHAR(32) NOT NULL,
    notes TEXT
);

-- 7. Packaging Inspection Table
CREATE TABLE IF NOT EXISTS qc_packaging_inspections (
    id VARCHAR(64) PRIMARY KEY,
    inspection_id VARCHAR(64) UNIQUE REFERENCES qc_inspection_sessions(id) ON DELETE CASCADE,
    cedar_garment_bag_included BOOLEAN NOT NULL DEFAULT TRUE,
    contoured_brass_hanger_verified BOOLEAN NOT NULL DEFAULT TRUE,
    acid_free_tissue_paper_folded BOOLEAN NOT NULL DEFAULT TRUE,
    wax_seal_authenticity_applied BOOLEAN NOT NULL DEFAULT TRUE,
    tamper_proof_serial_hologram VARCHAR(128) NOT NULL,
    presentation_box_integrity VARCHAR(32) NOT NULL DEFAULT 'Pristine',
    courier_shipping_label_affixed BOOLEAN NOT NULL DEFAULT TRUE,
    client_care_card_inserted BOOLEAN NOT NULL DEFAULT TRUE,
    notes TEXT
);

-- 8. Defects Table
CREATE TABLE IF NOT EXISTS qc_defects (
    id VARCHAR(64) PRIMARY KEY,
    inspection_id VARCHAR(64) REFERENCES qc_inspection_sessions(id) ON DELETE CASCADE,
    defect_code VARCHAR(32) NOT NULL,
    category VARCHAR(64) NOT NULL,
    severity qc_defect_severity_enum NOT NULL DEFAULT 'Minor',
    location_on_garment VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    photo_url TEXT,
    detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    detected_by VARCHAR(255) NOT NULL,
    rework_assigned_to VARCHAR(255),
    resolved BOOLEAN NOT NULL DEFAULT FALSE,
    resolved_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_qc_defects_inspection ON qc_defects(inspection_id);
CREATE INDEX IF NOT EXISTS idx_qc_defects_severity ON qc_defects(severity);

-- 9. Corrective Actions Table
CREATE TABLE IF NOT EXISTS qc_corrective_actions (
    id VARCHAR(64) PRIMARY KEY,
    inspection_id VARCHAR(64) REFERENCES qc_inspection_sessions(id) ON DELETE CASCADE,
    defect_id VARCHAR(64) REFERENCES qc_defects(id) ON DELETE CASCADE,
    action_required TEXT NOT NULL,
    assigned_tailor_or_workshop VARCHAR(255) NOT NULL,
    priority VARCHAR(32) NOT NULL DEFAULT 'Standard',
    target_completion_date DATE NOT NULL,
    requires_reinspection BOOLEAN NOT NULL DEFAULT TRUE,
    status qc_corrective_action_status_enum NOT NULL DEFAULT 'Pending',
    remedial_notes TEXT,
    completed_at TIMESTAMP WITH TIME ZONE,
    verified_by VARCHAR(255)
);

CREATE INDEX IF NOT EXISTS idx_qc_corrective_defect ON qc_corrective_actions(defect_id);

-- 10. QC Photos Evidence Table
CREATE TABLE IF NOT EXISTS qc_photo_evidences (
    id VARCHAR(64) PRIMARY KEY,
    inspection_id VARCHAR(64) REFERENCES qc_inspection_sessions(id) ON DELETE CASCADE,
    garment_area VARCHAR(128) NOT NULL,
    photo_url TEXT NOT NULL,
    caption TEXT NOT NULL,
    defect_ref_id VARCHAR(64),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    inspector_name VARCHAR(255) NOT NULL,
    highlight_coords JSONB
);

CREATE INDEX IF NOT EXISTS idx_qc_photos_inspection ON qc_photo_evidences(inspection_id);

-- 11. QC Notes Table
CREATE TABLE IF NOT EXISTS qc_notes (
    id VARCHAR(64) PRIMARY KEY,
    inspection_id VARCHAR(64) REFERENCES qc_inspection_sessions(id) ON DELETE CASCADE,
    author VARCHAR(255) NOT NULL,
    role VARCHAR(64) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    stage VARCHAR(32) NOT NULL,
    content TEXT NOT NULL,
    is_client_visible BOOLEAN NOT NULL DEFAULT FALSE
);

-- 12. Approval Records Table
CREATE TABLE IF NOT EXISTS qc_approval_records (
    id VARCHAR(64) PRIMARY KEY,
    inspection_id VARCHAR(64) UNIQUE REFERENCES qc_inspection_sessions(id) ON DELETE CASCADE,
    order_id VARCHAR(64) NOT NULL,
    garment_serial_number VARCHAR(128) NOT NULL,
    final_result qc_result_enum NOT NULL,
    certified_inspector_name VARCHAR(255) NOT NULL,
    inspector_badge_number VARCHAR(64) NOT NULL,
    approval_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    digital_seal_hash VARCHAR(255) NOT NULL,
    authenticity_certificate_number VARCHAR(128) NOT NULL,
    rework_dispatched_at TIMESTAMP WITH TIME ZONE,
    rework_instructions TEXT,
    signature_svg_url TEXT,
    compliance_standard VARCHAR(128) NOT NULL DEFAULT 'Daniel’s Maison Haute Couture Spec V3.4'
);

CREATE INDEX IF NOT EXISTS idx_qc_approvals_order ON qc_approval_records(order_id);

-- 13. Rework Status ENUM
CREATE TYPE rework_status_enum AS ENUM (
    'QC Failed',
    'Rework Assigned',
    'Rework In Progress',
    'Reinspection',
    'Approved'
);

-- 14. Master Rework Requests Table
CREATE TABLE IF NOT EXISTS rework_requests (
    id VARCHAR(64) PRIMARY KEY,
    order_id VARCHAR(64) NOT NULL,
    qc_session_id VARCHAR(64) REFERENCES qc_inspection_sessions(id) ON DELETE SET NULL,
    client_name VARCHAR(255) NOT NULL,
    garment_name VARCHAR(255) NOT NULL,
    garment_silhouette VARCHAR(128) NOT NULL,
    order_total NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    status rework_status_enum NOT NULL DEFAULT 'QC Failed',
    priority VARCHAR(64) NOT NULL DEFAULT 'Standard (48h)',
    failed_reason TEXT NOT NULL,
    failed_date DATE NOT NULL DEFAULT CURRENT_DATE,
    lead_inspector VARCHAR(255) NOT NULL,
    lead_inspector_badge VARCHAR(64) NOT NULL,
    assigned_tailor VARCHAR(255),
    assigned_workshop VARCHAR(255),
    assigned_at TIMESTAMP WITH TIME ZONE,
    target_sla_deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rework_order ON rework_requests(order_id);
CREATE INDEX IF NOT EXISTS idx_rework_status ON rework_requests(status);

-- 15. Rework Remediation Tasks Table
CREATE TABLE IF NOT EXISTS rework_tasks (
    id VARCHAR(64) PRIMARY KEY,
    rework_request_id VARCHAR(64) REFERENCES rework_requests(id) ON DELETE CASCADE,
    defect_id VARCHAR(64),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(64) NOT NULL,
    description TEXT,
    corrective_action_detail TEXT NOT NULL,
    assigned_tailor VARCHAR(255) NOT NULL,
    assigned_workshop VARCHAR(255) NOT NULL,
    priority VARCHAR(32) NOT NULL DEFAULT 'Standard',
    estimated_hours NUMERIC(4, 1) NOT NULL DEFAULT 2.0,
    actual_hours NUMERIC(4, 1) NOT NULL DEFAULT 0.0,
    status VARCHAR(32) NOT NULL DEFAULT 'Pending',
    progress_percent INTEGER NOT NULL DEFAULT 0,
    tailor_notes TEXT,
    before_photo_url TEXT,
    after_photo_url TEXT,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    target_completion_date DATE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_rework_tasks_request ON rework_tasks(rework_request_id);

-- 16. Reinspection Audits Table
CREATE TABLE IF NOT EXISTS reinspection_audits (
    id VARCHAR(64) PRIMARY KEY,
    rework_request_id VARCHAR(64) UNIQUE REFERENCES rework_requests(id) ON DELETE CASCADE,
    reinspected_by VARCHAR(255) NOT NULL,
    inspector_badge_number VARCHAR(64) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    verdict VARCHAR(64) NOT NULL,
    accreditation_seal_hash VARCHAR(255),
    certificate_number VARCHAR(128),
    notes TEXT,
    measurements_reverified BOOLEAN NOT NULL DEFAULT FALSE,
    finishes_reverified BOOLEAN NOT NULL DEFAULT FALSE,
    packaging_released BOOLEAN NOT NULL DEFAULT FALSE,
    compliance_standard VARCHAR(128) NOT NULL DEFAULT 'Daniel’s Maison Haute Couture Spec V3.4'
);
`;
