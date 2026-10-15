/**
 * @file communication.types.ts
 * Schemas and interfaces for the Customer Communication Center.
 * Supports direct messaging, chat threads, structured measurement requests,
 * progress updates, order discussions, and notifications.
 */

import { ProductionStageName } from './productionWorkflow.types';

export type MessageSender = 'designer' | 'customer' | 'system';

export type MessageType =
  | 'text'
  | 'measurement_request'
  | 'progress_update'
  | 'order_discussion'
  | 'image_attachment';

export interface MeasurementRequestPayload {
  fieldsRequested: string[]; // e.g. ["Chest Circumference", "Shoulder Slope", "Armhole Depth"]
  urgency: 'Standard' | 'Urgent' | 'Critical Before Cutting';
  tailorNote: string;
  referenceGuideUrl?: string;
  status: 'pending' | 'submitted' | 'waived';
  submittedValues?: Record<string, number>;
  unit?: 'cm' | 'inch';
  submittedAt?: string;
}

export interface ProgressUpdatePayload {
  stage: ProductionStageName;
  progressPercent: number;
  headline: string;
  notes: string;
  photoUrls?: string[];
  estimatedDeliveryDate?: string;
}

export interface ChatAttachment {
  id: string;
  url: string;
  name: string;
  type: 'image' | 'video' | 'document';
  sizeBytes?: number;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  sender: MessageSender;
  senderName: string;
  senderAvatar?: string;
  type: MessageType;
  text: string;
  attachments?: ChatAttachment[];
  measurementRequest?: MeasurementRequestPayload;
  progressUpdate?: ProgressUpdatePayload;
  timestamp: string;
  isRead: boolean;
  status: 'sent' | 'delivered' | 'read';
}

export interface ConversationCustomer {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  phone?: string;
  tier: 'VIP Patron' | 'Private Client' | 'New Client';
  isOnline: boolean;
  lastSeen?: string;
  totalOrdersCount: number;
  totalSpendGbp: number;
}

export interface ConversationThread {
  id: string;
  orderId?: string;
  orderNumber?: string; // e.g. "DM-2026-9480"
  customer: ConversationCustomer;
  garmentName?: string;
  garmentCategory?: string;
  garmentThumbnail?: string;
  topic: string;
  lastMessage: {
    text: string;
    timestamp: string;
    sender: MessageSender;
    isRead: boolean;
    type: MessageType;
  };
  unreadCount: number;
  isPinned: boolean;
  status: 'active' | 'archived' | 'waiting_customer';
  tags: string[]; // e.g. ["Urgent Fit", "Savile Tuxedo", "Measurement Pending"]
  createdAt: string;
  updatedAt: string;
}

export interface CommunicationNotification {
  id: string;
  conversationId: string;
  title: string;
  body: string;
  type: 'new_message' | 'measurement_submitted' | 'order_inquiry' | 'urgent_clarification';
  read: boolean;
  timestamp: string;
  customerName: string;
  orderNumber?: string;
}
