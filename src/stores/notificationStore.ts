/**
 * @file notificationStore.ts
 * Enterprise reactive state store for Daniel’s Maison Atelier Notification Center.
 * Handles In-App, Email, SMS, and Web Push channels for New Orders, Reviews,
 * Messages, Payout Status, and Inventory Alerts with dispatch simulation and audit logs.
 */

import { useState, useEffect } from 'react';
import {
  AtelierNotificationItem,
  ChannelEventPreferences,
  NotificationContactSettings,
  OutboundAuditLogEntry,
  NotificationChannel,
  NotificationEventType,
} from '../types/notification.types';

const INITIAL_PREFERENCES: ChannelEventPreferences[] = [
  {
    eventType: 'order',
    label: 'New Bespoke Commissions & Orders',
    description: 'Triggered when a patron submits a made-to-measure commission or biometric fit dossier.',
    in_app: true,
    email: true,
    sms: true,
    push: true,
  },
  {
    eventType: 'review',
    label: 'Client Reviews & Ratings',
    description: 'Triggered when a verified customer posts a star rating, video review, or feedback.',
    in_app: true,
    email: true,
    sms: false,
    push: true,
  },
  {
    eventType: 'message',
    label: 'Client Salon Direct Messages',
    description: 'Triggered when a patron sends an inquiry, alteration note, or consultation query.',
    in_app: true,
    email: true,
    sms: true,
    push: true,
  },
  {
    eventType: 'payout',
    label: 'Payouts & Balance Transfers',
    description: 'Triggered when Stripe cleared balance transfers or bank withdrawals finalize.',
    in_app: true,
    email: true,
    sms: true,
    push: false,
  },
  {
    eventType: 'inventory',
    label: 'Fabric Deficits & Material Alerts',
    description: 'Triggered when fabric bolts fall below safe cutting buffer meters or stock runs dry.',
    in_app: true,
    email: true,
    sms: false,
    push: true,
  },
];

const INITIAL_CONTACT_SETTINGS: NotificationContactSettings = {
  emailAddress: 'atelier.lead@maisondaniels.com',
  emailVerified: true,
  emailDigest: 'instant',
  phoneNumber: '+44 7911 123456',
  phoneVerified: true,
  smsUrgentOnly: true,
  pushEnabled: true,
  pushPermission: 'granted',
  inAppSoundEnabled: true,
  quietHoursEnabled: false,
  quietHoursStart: '22:00',
  quietHoursEnd: '08:00',
};

const INITIAL_NOTIFICATIONS: AtelierNotificationItem[] = [
  {
    id: 'notif_ord_001',
    eventType: 'order',
    title: 'New Bespoke Commission: #DM-2026-9481',
    message: 'Lord Sterling Vance commissioned the Anatomical Savile Row Tuxedo in Scabal Super 150s Wool. Measurements verified.',
    priority: 'urgent',
    read: false,
    archived: false,
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 mins ago
    actionUrl: 'orders',
    actionLabel: 'Inspect Order Dossier',
    metadata: {
      orderId: 'DM-2026-9481',
      clientName: 'Lord Sterling Vance',
      amount: 4200,
    },
    channels: [
      { channel: 'in_app', enabled: true, status: 'delivered', dispatchedAt: '15 mins ago' },
      { channel: 'email', enabled: true, status: 'delivered', dispatchedAt: '15 mins ago', recipientAddress: 'atelier.lead@maisondaniels.com' },
      { channel: 'sms', enabled: true, status: 'delivered', dispatchedAt: '14 mins ago', recipientAddress: '+44 •••• ••3456' },
      { channel: 'push', enabled: true, status: 'delivered', dispatchedAt: '15 mins ago' },
    ],
  },
  {
    id: 'notif_rev_002',
    eventType: 'review',
    title: '5.0 ★ Video Review Submitted',
    message: 'Countess Eleanor Beauchamp published a 45-second high-resolution video review for the Monolithic Muslin Veil Ensemble.',
    priority: 'normal',
    read: false,
    archived: false,
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(), // 2 hours ago
    actionUrl: 'reviews',
    actionLabel: 'View Video Review',
    metadata: {
      clientName: 'Countess Eleanor Beauchamp',
      rating: 5,
    },
    channels: [
      { channel: 'in_app', enabled: true, status: 'delivered', dispatchedAt: '2h ago' },
      { channel: 'email', enabled: true, status: 'delivered', dispatchedAt: '2h ago', recipientAddress: 'atelier.lead@maisondaniels.com' },
      { channel: 'push', enabled: true, status: 'delivered', dispatchedAt: '2h ago' },
      { channel: 'sms', enabled: false, status: 'skipped' },
    ],
  },
  {
    id: 'notif_msg_003',
    eventType: 'message',
    title: 'Client Inquiry: Alteration Consultation',
    message: 'Marcus Al-Rashid sent a message regarding sleeve pitch adjustment for Order #DM-2026-9410 before final basting.',
    priority: 'urgent',
    read: false,
    archived: false,
    createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(), // 4 hours ago
    actionUrl: 'messages',
    actionLabel: 'Open Salon Chat',
    metadata: {
      clientName: 'Marcus Al-Rashid',
      threadId: 'msg_th_9410',
    },
    channels: [
      { channel: 'in_app', enabled: true, status: 'delivered', dispatchedAt: '4h ago' },
      { channel: 'email', enabled: true, status: 'delivered', dispatchedAt: '4h ago', recipientAddress: 'atelier.lead@maisondaniels.com' },
      { channel: 'sms', enabled: true, status: 'delivered', dispatchedAt: '4h ago', recipientAddress: '+44 •••• ••3456' },
      { channel: 'push', enabled: true, status: 'delivered', dispatchedAt: '4h ago' },
    ],
  },
  {
    id: 'notif_pay_004',
    eventType: 'payout',
    title: 'Stripe Payout Cleared: £9,420.50',
    message: 'Monthly net designer withdrawal of £9,420.50 has been settled to your Barclays UK business account ending in 8842.',
    priority: 'normal',
    read: true,
    archived: false,
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(), // 1 day ago
    actionUrl: 'earnings',
    actionLabel: 'View Transaction Ledger',
    metadata: {
      amount: 9420.5,
      payoutId: 'po_stripe_884291',
    },
    channels: [
      { channel: 'in_app', enabled: true, status: 'delivered', dispatchedAt: '1d ago' },
      { channel: 'email', enabled: true, status: 'delivered', dispatchedAt: '1d ago', recipientAddress: 'atelier.lead@maisondaniels.com' },
      { channel: 'sms', enabled: true, status: 'delivered', dispatchedAt: '1d ago', recipientAddress: '+44 •••• ••3456' },
      { channel: 'push', enabled: false, status: 'skipped' },
    ],
  },
  {
    id: 'notif_inv_005',
    eventType: 'inventory',
    title: 'Low Stock Deficit: Holland & Sherry Fresco (Roll #08)',
    message: 'Remaining balance at 4.2 meters. Threshold is 12.0 meters. Impacting 2 pending bespoke jacket cutting queues.',
    priority: 'critical',
    read: true,
    archived: false,
    createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(), // 1.5 days ago
    actionUrl: 'inventory',
    actionLabel: 'Reorder from Mill',
    metadata: {
      fabricId: 'FAB-HS-008',
      metersRemaining: 4.2,
    },
    channels: [
      { channel: 'in_app', enabled: true, status: 'delivered', dispatchedAt: '1d ago' },
      { channel: 'email', enabled: true, status: 'delivered', dispatchedAt: '1d ago', recipientAddress: 'atelier.lead@maisondaniels.com' },
      { channel: 'push', enabled: true, status: 'delivered', dispatchedAt: '1d ago' },
      { channel: 'sms', enabled: false, status: 'skipped' },
    ],
  },
];

const INITIAL_AUDIT_LOGS: OutboundAuditLogEntry[] = [
  {
    id: 'log_001',
    notificationId: 'notif_ord_001',
    eventType: 'order',
    channel: 'email',
    recipient: 'atelier.lead@maisondaniels.com',
    status: 'opened',
    timestamp: '15 mins ago',
    summary: 'New Bespoke Commission #DM-2026-9481 alert delivered via SendGrid SMTP',
    latencyMs: 142,
  },
  {
    id: 'log_002',
    notificationId: 'notif_ord_001',
    eventType: 'order',
    channel: 'sms',
    recipient: '+44 7911 123456',
    status: 'delivered',
    timestamp: '14 mins ago',
    summary: 'SMS text alert sent via Twilio Gateway; delivery receipt ACK received',
    latencyMs: 410,
  },
  {
    id: 'log_003',
    notificationId: 'notif_ord_001',
    eventType: 'order',
    channel: 'push',
    recipient: 'Device [Chrome macOS - Token #9a48]',
    status: 'delivered',
    timestamp: '15 mins ago',
    summary: 'Web Push dispatched through FCM Service Worker',
    latencyMs: 88,
  },
  {
    id: 'log_004',
    notificationId: 'notif_msg_003',
    eventType: 'message',
    channel: 'email',
    recipient: 'atelier.lead@maisondaniels.com',
    status: 'delivered',
    timestamp: '4h ago',
    summary: 'Salon message notification delivered with preview snippet',
    latencyMs: 165,
  },
  {
    id: 'log_005',
    notificationId: 'notif_pay_004',
    eventType: 'payout',
    channel: 'email',
    recipient: 'atelier.lead@maisondaniels.com',
    status: 'opened',
    timestamp: '1d ago',
    summary: 'Payout cleared confirmation statement with VAT receipt attachment',
    latencyMs: 195,
  },
];

class NotificationStore {
  private notifications: AtelierNotificationItem[] = INITIAL_NOTIFICATIONS;
  private preferences: ChannelEventPreferences[] = INITIAL_PREFERENCES;
  private contactSettings: NotificationContactSettings = INITIAL_CONTACT_SETTINGS;
  private auditLogs: OutboundAuditLogEntry[] = INITIAL_AUDIT_LOGS;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem('daniels_notification_store');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.notifications) this.notifications = parsed.notifications;
        if (parsed.preferences) this.preferences = parsed.preferences;
        if (parsed.contactSettings) this.contactSettings = parsed.contactSettings;
        if (parsed.auditLogs) this.auditLogs = parsed.auditLogs;
      }
    } catch {
      // Keep defaults
    }
  }

  private persist() {
    try {
      localStorage.setItem(
        'daniels_notification_store',
        JSON.stringify({
          notifications: this.notifications,
          preferences: this.preferences,
          contactSettings: this.contactSettings,
          auditLogs: this.auditLogs,
        })
      );
    } catch {
      // Ignore
    }
    this.notify();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  // Getters
  public getNotifications(): AtelierNotificationItem[] {
    return this.notifications.filter((n) => !n.archived);
  }

  public getUnreadCount(): number {
    return this.notifications.filter((n) => !n.read && !n.archived).length;
  }

  public getPreferences(): ChannelEventPreferences[] {
    return this.preferences;
  }

  public getContactSettings(): NotificationContactSettings {
    return this.contactSettings;
  }

  public getAuditLogs(): OutboundAuditLogEntry[] {
    return this.auditLogs;
  }

  // Actions
  public markAsRead(id: string) {
    this.notifications = this.notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    this.persist();
  }

  public markAsUnread(id: string) {
    this.notifications = this.notifications.map((n) =>
      n.id === id ? { ...n, read: false } : n
    );
    this.persist();
  }

  public markAllAsRead() {
    this.notifications = this.notifications.map((n) => ({ ...n, read: true }));
    this.persist();
  }

  public deleteNotification(id: string) {
    this.notifications = this.notifications.filter((n) => n.id !== id);
    this.persist();
  }

  public archiveNotification(id: string) {
    this.notifications = this.notifications.map((n) =>
      n.id === id ? { ...n, archived: true } : n
    );
    this.persist();
  }

  public clearAll() {
    this.notifications = [];
    this.persist();
  }

  public togglePreference(eventType: NotificationEventType, channel: NotificationChannel) {
    this.preferences = this.preferences.map((p) => {
      if (p.eventType === eventType) {
        return {
          ...p,
          [channel]: !p[channel],
        };
      }
      return p;
    });
    this.persist();
  }

  public updateContactSettings(settings: Partial<NotificationContactSettings>) {
    this.contactSettings = {
      ...this.contactSettings,
      ...settings,
    };
    this.persist();
  }

  public clearAuditLogs() {
    this.auditLogs = [];
    this.persist();
  }

  /**
   * Simulates an incoming real-world event across configured channels.
   */
  public simulateIncomingEvent(
    eventType: NotificationEventType,
    options?: {
      title?: string;
      message?: string;
      priority?: AtelierNotificationItem['priority'];
      actionUrl?: string;
      actionLabel?: string;
      metadata?: AtelierNotificationItem['metadata'];
    }
  ): AtelierNotificationItem {
    const pref = this.preferences.find((p) => p.eventType === eventType);

    // Build event details based on type if not specified
    let title = options?.title || '';
    let message = options?.message || '';
    let priority = options?.priority || 'normal';
    let actionUrl = options?.actionUrl || 'orders';
    let actionLabel = options?.actionLabel || 'Inspect Details';

    if (!title) {
      switch (eventType) {
        case 'order':
          title = `New Bespoke Commission: #DM-2026-${Math.floor(1000 + Math.random() * 9000)}`;
          message = 'A private client submitted a custom order for the Metamorphic Drape Overcoat with Italian Horn Buttons.';
          priority = 'urgent';
          actionUrl = 'orders';
          actionLabel = 'Inspect Order';
          break;
        case 'review':
          title = 'New 5.0 ★ Bespoke Fitting Review';
          message = 'A patron in Geneva submitted an enthusiastic review praising the roped shoulder construction.';
          priority = 'normal';
          actionUrl = 'reviews';
          actionLabel = 'View Review';
          break;
        case 'message':
          title = 'Urgent Client Fitting Note';
          message = 'Client requested a lapel peak adjustment and added silk monogramming initials "S.V."';
          priority = 'urgent';
          actionUrl = 'messages';
          actionLabel = 'Reply in Salon';
          break;
        case 'payout':
          title = `Stripe Payout Cleared: £${(3000 + Math.random() * 5000).toFixed(2)}`;
          message = 'Automated transfer has settled to Barclays Bank ending in 8842 with 0% dispute reserves.';
          priority = 'normal';
          actionUrl = 'earnings';
          actionLabel = 'View Ledger';
          break;
        case 'inventory':
          title = 'Critical Stock Alert: Loro Piana Tasmanian Wool';
          message = 'Bolt #03 is below 5.0 meters buffer limit. Reorder required to fulfill upcoming suiting queue.';
          priority = 'critical';
          actionUrl = 'inventory';
          actionLabel = 'Reorder Bolt';
          break;
      }
    }

    const channelStatuses = (['in_app', 'email', 'sms', 'push'] as NotificationChannel[]).map((ch) => {
      const isEnabled = pref ? pref[ch] : true;
      return {
        channel: ch,
        enabled: isEnabled,
        status: isEnabled ? ('delivered' as const) : ('skipped' as const),
        dispatchedAt: 'Just now',
        recipientAddress:
          ch === 'email'
            ? this.contactSettings.emailAddress
            : ch === 'sms'
            ? this.contactSettings.phoneNumber
            : ch === 'push'
            ? 'Registered Device #1'
            : undefined,
      };
    });

    const newNotification: AtelierNotificationItem = {
      id: `notif_${eventType}_${Date.now()}`,
      eventType,
      title,
      message,
      priority,
      read: false,
      archived: false,
      createdAt: new Date().toISOString(),
      actionUrl,
      actionLabel,
      metadata: options?.metadata || {},
      channels: channelStatuses,
    };

    // Prepend to notifications
    this.notifications = [newNotification, ...this.notifications];

    // Log outbound audit entries for enabled channels
    const newLogs: OutboundAuditLogEntry[] = channelStatuses
      .filter((ch) => ch.enabled)
      .map((ch) => ({
        id: `log_${Date.now()}_${ch.channel}`,
        notificationId: newNotification.id,
        eventType,
        channel: ch.channel,
        recipient: ch.recipientAddress || 'In-App Bell Interface',
        status: 'delivered',
        timestamp: 'Just now',
        summary: `Dispatched ${newNotification.title} via ${ch.channel.toUpperCase()}`,
        latencyMs: Math.floor(50 + Math.random() * 200),
      }));

    this.auditLogs = [...newLogs, ...this.auditLogs];

    this.persist();
    return newNotification;
  }

  public resetToDefaults() {
    this.notifications = INITIAL_NOTIFICATIONS;
    this.preferences = INITIAL_PREFERENCES;
    this.contactSettings = INITIAL_CONTACT_SETTINGS;
    this.auditLogs = INITIAL_AUDIT_LOGS;
    this.persist();
  }
}

export const notificationStore = new NotificationStore();

export function useNotificationStore() {
  const [notifications, setNotifications] = useState<AtelierNotificationItem[]>(
    notificationStore.getNotifications()
  );
  const [unreadCount, setUnreadCount] = useState<number>(notificationStore.getUnreadCount());
  const [preferences, setPreferences] = useState<ChannelEventPreferences[]>(
    notificationStore.getPreferences()
  );
  const [contactSettings, setContactSettings] = useState<NotificationContactSettings>(
    notificationStore.getContactSettings()
  );
  const [auditLogs, setAuditLogs] = useState<OutboundAuditLogEntry[]>(
    notificationStore.getAuditLogs()
  );

  useEffect(() => {
    const unsubscribe = notificationStore.subscribe(() => {
      setNotifications(notificationStore.getNotifications());
      setUnreadCount(notificationStore.getUnreadCount());
      setPreferences(notificationStore.getPreferences());
      setContactSettings(notificationStore.getContactSettings());
      setAuditLogs(notificationStore.getAuditLogs());
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return {
    notifications,
    unreadCount,
    preferences,
    contactSettings,
    auditLogs,
    markAsRead: (id: string) => notificationStore.markAsRead(id),
    markAsUnread: (id: string) => notificationStore.markAsUnread(id),
    markAllAsRead: () => notificationStore.markAllAsRead(),
    deleteNotification: (id: string) => notificationStore.deleteNotification(id),
    archiveNotification: (id: string) => notificationStore.archiveNotification(id),
    clearAll: () => notificationStore.clearAll(),
    togglePreference: (eventType: NotificationEventType, channel: NotificationChannel) =>
      notificationStore.togglePreference(eventType, channel),
    updateContactSettings: (settings: Partial<NotificationContactSettings>) =>
      notificationStore.updateContactSettings(settings),
    simulateIncomingEvent: (
      eventType: NotificationEventType,
      options?: Parameters<typeof notificationStore.simulateIncomingEvent>[1]
    ) => notificationStore.simulateIncomingEvent(eventType, options),
    clearAuditLogs: () => notificationStore.clearAuditLogs(),
    resetToDefaults: () => notificationStore.resetToDefaults(),
  };
}
