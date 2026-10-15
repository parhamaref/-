/**
 * @file designerOrder.types.ts
 * Schemas and interfaces for the Designer Order Management System.
 * Supports Order Inbox, Bespoke Lifecycles, Anatomical Measurements Inspection,
 * Customization Breakdowns, Clarification Threads, and Logistics.
 */

export type DesignerOrderStatus =
  | 'Pending'
  | 'Accepted'
  | 'In Production'
  | 'Quality Control'
  | 'Ready To Ship'
  | 'Shipped'
  | 'Delivered'
  | 'Rejected';

export interface CustomerMeasurementsSnapshot {
  unit: 'cm' | 'inch';
  values: Record<string, number>;
  clientNotes?: string;
  profileName?: string;
  submissionDate: string;
  anatomicalStatus: 'Verified' | 'Flagged' | 'Tolerance Exception';
  tailorInspectionNotes?: string;
}

export interface CustomizationItemSnapshot {
  groupName: string;
  optionName: string;
  skuCode?: string;
  priceDelta: number;
  swatchColor?: string;
  swatchImageUrl?: string;
  details?: string;
}

export interface OrderCustomizationSnapshot {
  baseGarmentName: string;
  basePrice: number;
  options: CustomizationItemSnapshot[];
  monogramText?: string;
  monogramPlacement?: string;
  totalCustomizationPrice: number;
  finalPrice: number;
  estimatedLeadTimeDays: number;
}

export interface ClarificationMessage {
  id: string;
  sender: 'designer' | 'customer' | 'system';
  senderName: string;
  text: string;
  timestamp: string;
  status: 'pending_reply' | 'resolved';
}

export interface ShippingAddress {
  name: string;
  street: string;
  city: string;
  country: string;
  postalCode: string;
  phone: string;
}

export interface OrderShippingInfo {
  courier: string;
  trackingNumber?: string;
  dispatchedAt?: string;
  estimatedDelivery?: string;
  deliveryAddress: ShippingAddress;
}

export interface DesignerOrder {
  id: string;
  orderNumber: string; // e.g. "DM-2026-9481"
  createdAt: string;
  updatedAt: string;
  status: DesignerOrderStatus;
  priority: 'High' | 'Standard' | 'Rush Bespoke';
  targetCompletionDate: string;
  customer: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
    phone?: string;
    tier: 'VIP Patron' | 'Private Client' | 'New Client';
  };
  garmentName: string;
  garmentCategory: string;
  garmentThumbnail: string;
  measurements: CustomerMeasurementsSnapshot;
  customizations: OrderCustomizationSnapshot;
  clarifications: ClarificationMessage[];
  rejectionReason?: string;
  shipping: OrderShippingInfo;
  internalNotes: string[];
}
