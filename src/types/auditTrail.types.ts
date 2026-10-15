/**
 * @file auditTrail.types.ts
 * Enterprise Type Definitions for Daniel's Maison Immutability Audit Trail System.
 * 
 * Monitored Domains:
 * 1. Profile Changes
 * 2. Product Changes
 * 3. Price Changes
 * 4. Order Status Changes
 * 5. Design Approvals
 * 6. Payments
 * 7. QC Decisions
 * 8. Customer Actions
 * 
 * Stored Properties:
 * - User (ID, Name, Email, Role, Avatar)
 * - Timestamp (ISO string, high-precision Unix)
 * - Old Value (structured JSON / field-level snapshot)
 * - New Value (structured JSON / field-level snapshot)
 * - Action Type (Categorized domain action)
 * - IP Address (with Geo-IP and Client User-Agent)
 * - Cryptographic Block Hash (SHA-256 tamper-evident chain)
 */

export type AuditEntityType =
  | 'profile'
  | 'product'
  | 'price'
  | 'order_status'
  | 'design_approval'
  | 'payment'
  | 'qc_decision'
  | 'customer_action';

export type AuditSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type AuditActionType =
  // Profile
  | 'PROFILE_UPDATED'
  | 'BIO_CHANGED'
  | 'PAYOUT_ACCOUNT_MODIFIED'
  | 'STUDIO_ADDRESS_CHANGED'
  | 'CREDENTIALS_VERIFIED'
  // Product
  | 'PRODUCT_CREATED'
  | 'PRODUCT_METADATA_UPDATED'
  | 'PRODUCT_STATUS_CHANGED'
  | 'FABRIC_COMPOSITION_CHANGED'
  | 'PRODUCT_ARCHIVED'
  // Price
  | 'BASE_PRICE_UPDATED'
  | 'SURCHARGE_ADJUSTED'
  | 'WHOLESALE_DISCOUNT_APPLIED'
  | 'CURRENCY_RATE_OVERRIDE'
  // Order Status
  | 'ORDER_CREATED'
  | 'ORDER_STATUS_CHANGED'
  | 'ORDER_CANCELLED'
  | 'ORDER_RUSH_FEE_ADDED'
  | 'DISPATCH_TRACKING_UPDATED'
  // Design Approval
  | 'SKETCH_SUBMITTED'
  | 'SWATCH_APPROVED'
  | 'TECH_PACK_APPROVED'
  | 'REVISION_REQUESTED'
  | 'DESIGN_REJECTED'
  // Payment
  | 'PAYMENT_INTENT_CREATED'
  | 'PAYMENT_CAPTURED'
  | 'ESCROW_RELEASED'
  | 'REFUND_ISSUED'
  | 'CHARGEBACK_ALERT'
  // QC Decision
  | 'QC_INSPECTION_COMMISSIONED'
  | 'QC_DECISION_ISSUED'
  | 'REWORK_MANDATED'
  | 'HAUTE_COUTURE_SEAL_APPLIED'
  | 'TOLERANCE_WAIVED'
  // Customer Action
  | 'CUSTOMER_LOGIN'
  | 'MEASUREMENTS_SUBMITTED'
  | 'FITTING_APPOINTMENT_BOOKED'
  | 'REVIEW_SUBMITTED'
  | 'ADDRESS_UPDATED';

export interface AuditActor {
  id: string;
  name: string;
  email: string;
  role: 'Designer' | 'Master Tailor' | 'QC Inspector' | 'Client' | 'Finance Admin' | 'System Automated';
  avatarUrl?: string;
  ipAddress: string;
  userAgent?: string;
  geoCity?: string;
  geoCountry?: string;
}

export type DiffChangeType = 'added' | 'removed' | 'modified' | 'unchanged';

export interface FieldDiff {
  field: string;
  label: string;
  oldValue: any;
  newValue: any;
  changeType: DiffChangeType;
  category?: string;
}

export interface AuditRecord {
  id: string;
  sequenceNumber: number;
  entityType: AuditEntityType;
  entityId: string;
  entityName: string;
  actionType: AuditActionType;
  actionLabel: string;
  severity: AuditSeverity;
  actor: AuditActor;
  timestamp: string; // ISO 8601
  ipAddress: string;
  userAgent: string;
  geoCity?: string;
  geoCountry?: string;
  oldValue: Record<string, any> | null;
  newValue: Record<string, any> | null;
  diffs: FieldDiff[];
  metadata?: Record<string, any>;
  tamperHash: string; // SHA-256 seal
  previousHash: string; // Merkle/hash-chain link
  isVerified: boolean; // Computed cryptographically
}

export interface AuditFilterState {
  entityType: AuditEntityType | 'ALL';
  actionType: AuditActionType | 'ALL';
  severity: AuditSeverity | 'ALL';
  actorId?: string;
  searchQuery: string;
  startDate?: string;
  endDate?: string;
  ipAddress?: string;
}

export interface AuditMetrics {
  totalEvents: number;
  todayEvents: number;
  criticalEvents: number;
  highSeverityEvents: number;
  tamperIntegrityPercent: number;
  chainValid: boolean;
  domainCounts: Record<AuditEntityType, number>;
  activeIPsCount: number;
}
