/**
 * @file notification.types.ts
 * Type definitions for the Daniel’s Maison Atelier Notification Center.
 * Models multi-channel delivery (In-App, Email, SMS, Push) and event triggers
 * (New Orders, Reviews, Messages, Payout Status, Inventory Alerts).
 */

export type NotificationChannel = 'in_app' | 'email' | 'sms' | 'push';

export type NotificationEventType =
  | 'order'
  | 'review'
  | 'message'
  | 'payout'
  | 'inventory';

export type NotificationPriority = 'low' | 'normal' | 'urgent' | 'critical';

export interface ChannelDeliveryStatus {
  channel: NotificationChannel;
  enabled: boolean;
  status: 'delivered' | 'sent' | 'pending' | 'skipped' | 'failed';
  dispatchedAt?: string;
  recipientAddress?: string; // email address, masked phone number, device token
}

export interface AtelierNotificationItem {
  id: string;
  eventType: NotificationEventType;
  title: string;
  message: string;
  priority: NotificationPriority;
  read: boolean;
  archived: boolean;
  createdAt: string;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: {
    orderId?: string;
    clientName?: string;
    amount?: number;
    rating?: number;
    fabricId?: string;
    metersRemaining?: number;
    threadId?: string;
    payoutId?: string;
  };
  channels: ChannelDeliveryStatus[];
}

export interface ChannelEventPreferences {
  eventType: NotificationEventType;
  label: string;
  description: string;
  in_app: boolean;
  email: boolean;
  sms: boolean;
  push: boolean;
}

export interface NotificationContactSettings {
  emailAddress: string;
  emailVerified: boolean;
  emailDigest: 'instant' | 'hourly' | 'daily_digest';
  phoneNumber: string;
  phoneVerified: boolean;
  smsUrgentOnly: boolean;
  pushEnabled: boolean;
  pushPermission: 'granted' | 'denied' | 'default';
  inAppSoundEnabled: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string; // e.g. "22:00"
  quietHoursEnd: string; // e.g. "08:00"
}

export interface OutboundAuditLogEntry {
  id: string;
  notificationId: string;
  eventType: NotificationEventType;
  channel: NotificationChannel;
  recipient: string;
  status: 'delivered' | 'sent' | 'opened' | 'bounced' | 'failed';
  timestamp: string;
  summary: string;
  latencyMs: number;
}
