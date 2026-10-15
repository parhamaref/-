/**
 * @file daniels.types.ts
 * Core domain entities and TypeScript definitions for the DANIELS platform.
 */

// ==========================================
// 1. Roles, Statuses & Enums
// ==========================================

export type UserRole =
  | 'Super Admin'
  | 'Management'
  | 'Sales'
  | 'Production'
  | 'QC'
  | 'Finance'
  | 'Logistics'
  | 'Partner'
  | 'Designer'
  | 'Customer';

export type UserStatus = 'Active' | 'Inactive' | 'Suspended';

export type CustomerVipLevel = 'Standard' | 'Silver' | 'Gold' | 'Platinum' | 'Private Client';
export type CustomerStatus = 'Active' | 'Inactive' | 'Prospect';

export type PartnerVerificationStatus = 'Pending' | 'Verified' | 'Under Review' | 'Rejected';
export type PartnerStatus = 'Active' | 'Inactive' | 'Suspended';

export type ProductStatus = 'Draft' | 'Active' | 'Archived' | 'Discontinued';

export type OrderStatus =
  | 'Draft'
  | 'Awaiting Approval'
  | 'Confirmed'
  | 'In Production'
  | 'QC'
  | 'Ready'
  | 'Dispatched'
  | 'Delivered'
  | 'Closed'
  | 'Cancelled'
  | 'On Hold'
  | 'Rework Required';

export type OrderApprovalStatus = 'Pending' | 'Approved' | 'Rejected' | 'Re-submission Required';

export type ProductionStage =
  | 'Not Started'
  | 'Assigned'
  | 'Cutting'
  | 'Making'
  | 'Finishing'
  | 'QC'
  | 'Rework'
  | 'Complete';

export type ProductionJobStatus =
  | 'Scheduled'
  | 'In Progress'
  | 'On Hold'
  | 'Blocked'
  | 'Completed'
  | 'Terminated';

export type QCResult = 'Pass' | 'Fail';
export type QCDefectSeverity = 'Minor' | 'Major' | 'Critical';

export type PaymentStatus = 'Pending' | 'Part Paid' | 'Paid' | 'Overdue' | 'Refunded';
export type PaymentMethod =
  | 'Credit Card'
  | 'Wire Transfer'
  | 'Stripe'
  | 'Bank Transfer'
  | 'Cash / Private Concierge';

export type DeliveryStatus = 'Pending' | 'Dispatched' | 'In Transit' | 'Delivered' | 'Failed';
export type DeliveryMethod =
  | 'White Glove Concierge'
  | 'Express Courier'
  | 'Private Courier'
  | 'Atelier Pickup';

export type WardrobeItemStatus =
  | 'In Wardrobe'
  | 'In Atelier For Alteration'
  | 'Archived'
  | 'Consigned';

// ==========================================
// 2. Core Entities
// ==========================================

export interface Timestamps {
  createdAt: string;
  updatedAt: string;
}

export interface AuthMetadata {
  lastLoginAt?: string;
  provider?: string;
  mfaEnabled?: boolean;
  ipAddress?: string;
  sessionExpiry?: string;
  [key: string]: any;
}

/**
 * Platform User Entity
 */
export interface User {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  phone: string;
  status: UserStatus;
  authMetadata: AuthMetadata;
  timestamps: Timestamps;
}

/**
 * Customer Profile & Preferences
 */
export interface CustomerProfile {
  title?: string;
  firstName: string;
  lastName: string;
  company?: string;
  notes?: string;
  address?: {
    street: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
  };
}

export interface CustomerPreferences {
  preferredContactMethod: 'Email' | 'Phone' | 'WhatsApp';
  currency: string;
  language: string;
  dietaryNotes?: string;
  stylingNotes?: string;
  notificationOptIn: boolean;
}

export interface Customer {
  id: string;
  userId: string;
  profile: CustomerProfile;
  preferences: CustomerPreferences;
  vipLevel: CustomerVipLevel;
  status: CustomerStatus;
  timestamps: Timestamps;
}

/**
 * Partner (Artisan Atelier / Manufacturer)
 */
export interface PartnerBusinessDetails {
  legalBusinessName: string;
  tradeName?: string;
  registrationNumber: string;
  vatTaxId?: string;
  primaryContactName: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

export interface PartnerCapabilities {
  craftSpecialties: string[];
  garmentTypes: string[];
  machineTypes?: string[];
  capacityPerMonth: number;
  leadTimeDays: number;
  certifications?: string[];
}

export interface PartnerPortfolio {
  lookbookUrls?: string[];
  previousBrands?: string[];
  samplePhotos?: string[];
  highlights?: string;
}

export interface Partner {
  id: string;
  userId: string;
  businessDetails: PartnerBusinessDetails;
  capabilities: PartnerCapabilities;
  verificationStatus: PartnerVerificationStatus;
  portfolio: PartnerPortfolio;
  status: PartnerStatus;
}

/**
 * Product Specification & Customisation
 */
export interface ProductMaterial {
  name: string;
  composition: string;
  origin?: string;
  supplier?: string;
}

export interface ProductColour {
  name: string;
  hex: string;
  code?: string;
}

export interface ProductPricing {
  basePrice: number;
  currency: string;
  taxRate?: number;
  markupPercentage?: number;
}

export interface CustomisationOption {
  optionName: string;
  allowedValues: string[];
  additionalCost?: number;
}

export interface Product {
  id: string;
  category: string;
  collection: string;
  name: string;
  materials: ProductMaterial[];
  colours: ProductColour[];
  pricing: ProductPricing;
  customisationOptions: CustomisationOption[];
  status: ProductStatus;
}

/**
 * Measurement Profile with Versioning Rules
 */
export interface BodyMeasurements {
  unit: 'cm' | 'inch';
  neck?: number;
  shoulderWidth?: number;
  chest?: number;
  waist?: number;
  hips?: number;
  sleeveLength?: number;
  bicep?: number;
  wrist?: number;
  jacketLength?: number;
  inseam?: number;
  outseam?: number;
  thigh?: number;
  ankle?: number;
  [key: string]: any;
}

export interface FitPreferences {
  silhouette: 'Ultra Slim' | 'Slim' | 'Classic' | 'Relaxed' | 'Oversized';
  shoulderPad: 'None' | 'Light' | 'Structured';
  trouserBreak: 'No Break' | 'Slight Break' | 'Medium Break' | 'Full Break';
  notes?: string;
}

export interface MeasurementProfile {
  id: string;
  customerId: string;
  measurements: BodyMeasurements;
  fitPreferences: FitPreferences;
  specialRequirements: string[];
  version: number;
  approvedAt: string | null;
  supersededById?: string | null;
  isLatest: boolean;
  notes?: string;
}

/**
 * Order Entity
 */
export interface OrderDates {
  created: string;
  due: string;
  completed?: string | null;
  estimatedShipping?: string;
}

export interface OrderPricing {
  subtotal: number;
  customisationFee: number;
  tax: number;
  total: number;
  currency: string;
}

export interface OrderPersonalisation {
  monogram?: string;
  monogramFont?: string;
  liningFabric?: string;
  buttonSelection?: string;
  customMeasurementsProfileId?: string;
  specialInstructions?: string;
}

export interface Order {
  id: string;
  customerId: string;
  productId: string;
  partnerId: string | null;
  dates: OrderDates;
  pricing: OrderPricing;
  status: OrderStatus;
  personalisation: OrderPersonalisation;
  approvalStatus: OrderApprovalStatus;
}

/**
 * Production Job
 */
export interface ProductionDeadlines {
  startExpected: string;
  targetFinish: string;
  actualFinish?: string | null;
}

export interface ProductionNote {
  timestamp: string;
  authorId: string;
  text: string;
}

export interface ProductionJob {
  id: string;
  orderId: string;
  partnerId: string;
  stage: ProductionStage;
  deadlines: ProductionDeadlines;
  progress: number; // 0 to 100
  notes: ProductionNote[];
  status: ProductionJobStatus;
}

/**
 * Quality Control (QC) Record
 */
export interface QCCriterion {
  item: string;
  passed: boolean;
  toleranceMm?: number;
  notes?: string;
}

export interface QCInspectionDetails {
  inspectionDate: string;
  inspectorId: string;
  criteriaChecked: QCCriterion[];
}

export interface QCDefect {
  defectCode: string;
  description: string;
  severity: QCDefectSeverity;
  locationOnGarment: string;
}

export interface QCApproval {
  approvedBy: string | null;
  approvedAt: string | null;
  version: number;
}

export interface QCRecord {
  id: string;
  orderId: string;
  inspectionDetails: QCInspectionDetails;
  result: QCResult;
  defects: QCDefect[];
  correctiveAction: string | null;
  approval: QCApproval;
}

/**
 * Invoice & Payment
 */
export interface PaymentTimestamps {
  createdAt: string;
  paidAt?: string | null;
  refundedAt?: string | null;
}

export interface InvoicePayment {
  id: string;
  orderId: string;
  customerId: string;
  amount: number;
  status: PaymentStatus;
  method: PaymentMethod;
  reference: string;
  timestamps: PaymentTimestamps;
}

/**
 * Delivery & Shipping
 */
export interface DeliveryConfirmation {
  signedBy?: string | null;
  deliveredAt?: string | null;
  signatureUrl?: string | null;
  photoProofUrl?: string | null;
}

export interface Delivery {
  id: string;
  orderId: string;
  method: DeliveryMethod;
  trackingNumber: string;
  dispatchDate: string | null;
  status: DeliveryStatus;
  confirmation: DeliveryConfirmation;
}

/**
 * Wardrobe Item (Client Garment Archive & Alterations)
 */
export interface AlterationHistoryItem {
  id: string;
  date: string;
  description: string;
  performedBy: string;
  cost: number;
}

export interface WardrobeItem {
  id: string;
  customerId: string;
  orderId: string;
  productId: string;
  size: string;
  colour: string;
  material: string;
  alterations: AlterationHistoryItem[];
  status: WardrobeItemStatus;
}

/**
 * Communication: Messages & Notifications
 */
export interface MessageParticipant {
  id: string;
  name: string;
  role: UserRole;
}

export interface CommunicationAttachment {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  sizeBytes: number;
}

export interface MessageContext {
  entityType: 'Order' | 'ProductionJob' | 'Customer' | 'MeasurementProfile' | 'General';
  entityId?: string;
}

export interface Message {
  id: string;
  sender: MessageParticipant;
  recipient: MessageParticipant;
  context: MessageContext;
  subject?: string;
  body: string;
  attachments: CommunicationAttachment[];
  readStatus: boolean;
  timestamps: {
    sentAt: string;
    readAt?: string | null;
  };
}

export interface NotificationContext {
  entityType: 'Order' | 'ProductionJob' | 'QC' | 'Payment' | 'Delivery' | 'System';
  entityId?: string;
  actionUrl?: string;
}

export interface Notification {
  id: string;
  sender: MessageParticipant | 'SYSTEM';
  recipient: MessageParticipant;
  context: NotificationContext;
  title: string;
  message: string;
  attachments: CommunicationAttachment[];
  readStatus: boolean;
  timestamps: {
    sentAt: string;
    readAt?: string | null;
  };
}

// ==========================================
// 3. Aggregate Daniels Data Store
// ==========================================

export interface DanielsDataStore {
  users: User[];
  customers: Customer[];
  partners: Partner[];
  products: Product[];
  measurementProfiles: MeasurementProfile[];
  orders: Order[];
  productionJobs: ProductionJob[];
  qcRecords: QCRecord[];
  invoices: InvoicePayment[];
  deliveries: Delivery[];
  wardrobeItems: WardrobeItem[];
  messages: Message[];
  notifications: Notification[];
}
