/**
 * @file communicationStore.ts
 * Reactive state store for the Customer Communication Center.
 * Manages active conversation threads, structured messages, measurement requests,
 * progress updates, unread indicators, and communication notifications.
 */

import { useState, useEffect } from 'react';
import {
  ConversationThread,
  ChatMessage,
  CommunicationNotification,
  MeasurementRequestPayload,
  ProgressUpdatePayload,
  MessageType,
} from '../types/communication.types';

export const INITIAL_CONVERSATIONS: ConversationThread[] = [
  {
    id: 'conv_001_julian',
    orderId: 'ord_dm_9480',
    orderNumber: 'DM-2026-9480',
    topic: 'Tuxedo Peak Lapel & Shoulder Slope Verification',
    customer: {
      id: 'cust_julian_thorne',
      name: 'Sir Julian Thorne',
      email: 'thorne@blackwood-capital.com',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      phone: '+44 20 7946 0912',
      tier: 'VIP Patron',
      isOnline: true,
      lastSeen: 'Just now',
      totalOrdersCount: 4,
      totalSpendGbp: 4850,
    },
    garmentName: 'Anatomical Savile Row Tuxedo Jacket',
    garmentCategory: 'jackets',
    garmentThumbnail: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80',
    lastMessage: {
      text: 'Canvas pad-stitched and rested. Moving to collar attachment.',
      timestamp: '2026-10-12T13:15:00Z',
      sender: 'designer',
      isRead: true,
      type: 'progress_update',
    },
    unreadCount: 0,
    isPinned: true,
    status: 'active',
    tags: ['VIP Patron', 'Tuxedo', 'Fitting Verification'],
    createdAt: '2026-10-10T11:00:00Z',
    updatedAt: '2026-10-12T13:15:00Z',
  },
  {
    id: 'conv_002_alistair',
    orderId: 'ord_dm_9481',
    orderNumber: 'DM-2026-9481',
    topic: 'Royal Ascot Ease & Inlay Seam Allowances',
    customer: {
      id: 'cust_alistair_sterling',
      name: 'Lord Alistair Sterling',
      email: 'a.sterling@kensington-holdings.co.uk',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      phone: '+44 20 7946 0834',
      tier: 'VIP Patron',
      isOnline: false,
      lastSeen: '25m ago',
      totalOrdersCount: 2,
      totalSpendGbp: 2150,
    },
    garmentName: 'Savile Row Deconstructed Worsted Coat',
    garmentCategory: 'outerwear',
    garmentThumbnail: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80',
    lastMessage: {
      text: 'Understood Lord Alistair. We have incorporated an additional 1.5cm bicep ease and 3cm inlay allowances along the side seams.',
      timestamp: '2026-10-12T07:15:00Z',
      sender: 'designer',
      isRead: false,
      type: 'text',
    },
    unreadCount: 1,
    isPinned: true,
    status: 'active',
    tags: ['Royal Ascot', 'Rush Bespoke', 'Bicep Ease'],
    createdAt: '2026-10-12T05:00:00Z',
    updatedAt: '2026-10-12T07:15:00Z',
  },
  {
    id: 'conv_003_vivienne',
    orderId: 'ord_dm_9482',
    orderNumber: 'DM-2026-9482',
    topic: 'Kuroki Mills Selvedge Hem & Inseam Break',
    customer: {
      id: 'cust_vivienne_vance',
      name: 'Lady Vivienne Vance',
      email: 'vivienne.vance@vancemedia.com',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      phone: '+44 20 7946 0388',
      tier: 'Private Client',
      isOnline: true,
      lastSeen: 'Active now',
      totalOrdersCount: 3,
      totalSpendGbp: 1840,
    },
    garmentName: 'Raw-Hem Japanese Selvedge Denim Trousers',
    garmentCategory: 'trousers',
    garmentThumbnail: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80',
    lastMessage: {
      text: 'Good morning atelier! Can we ensure the red selvedge ID line remains visible on the cuff turn-up?',
      timestamp: '2026-10-12T08:30:00Z',
      sender: 'customer',
      isRead: false,
      type: 'text',
    },
    unreadCount: 1,
    isPinned: false,
    status: 'active',
    tags: ['Japanese Denim', 'Selvedge ID', 'Hem Inseam'],
    createdAt: '2026-10-11T17:00:00Z',
    updatedAt: '2026-10-12T08:30:00Z',
  },
  {
    id: 'conv_004_elena',
    orderId: 'ord_dm_9478',
    orderNumber: 'DM-2026-9478',
    topic: 'Final QC Inspection & White Glove Packaging',
    customer: {
      id: 'cust_elena_rostova',
      name: 'Elena Rostova',
      email: 'e.rostova@atelier-rostova.com',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
      phone: '+44 20 7946 0771',
      tier: 'VIP Patron',
      isOnline: false,
      lastSeen: '1h ago',
      totalOrdersCount: 5,
      totalSpendGbp: 6200,
    },
    garmentName: 'Monolithic Muslin Veil Ensemble',
    garmentCategory: 'gowns',
    garmentThumbnail: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80',
    lastMessage: {
      text: 'Splendid! The draped silhouette looks breathtaking. Looking forward to courier delivery.',
      timestamp: '2026-10-12T10:45:00Z',
      sender: 'customer',
      isRead: true,
      type: 'text',
    },
    unreadCount: 0,
    isPinned: false,
    status: 'active',
    tags: ['Muslin Ensemble', 'Final QC', 'White Glove'],
    createdAt: '2026-10-08T09:30:00Z',
    updatedAt: '2026-10-12T10:45:00Z',
  },
];

export const INITIAL_MESSAGES_MAP: Record<string, ChatMessage[]> = {
  conv_001_julian: [
    {
      id: 'msg_001_j',
      conversationId: 'conv_001_julian',
      sender: 'customer',
      senderName: 'Sir Julian Thorne',
      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      type: 'text',
      text: 'Greetings Master Daniel. I noticed in the transparency portal that the floating chest canvas is being basted. Does the lapel curve roll smoothly over the collar?',
      timestamp: '2026-10-12T11:00:00Z',
      isRead: true,
      status: 'read',
    },
    {
      id: 'msg_002_j',
      conversationId: 'conv_001_julian',
      sender: 'designer',
      senderName: 'Daniel’s Maison',
      type: 'text',
      text: 'Good morning Sir Julian. The floating canvas is hand pad-stitched with 800 individual silk stitches. The lapel will roll with a natural 3D anatomical drape rather than a pressed flat crease.',
      timestamp: '2026-10-12T11:30:00Z',
      isRead: true,
      status: 'read',
    },
    {
      id: 'msg_003_j',
      conversationId: 'conv_001_julian',
      sender: 'designer',
      senderName: 'Daniel’s Maison',
      type: 'measurement_request',
      text: 'Please confirm your right shoulder slope measurement so we can balance the roped sleeve crown.',
      measurementRequest: {
        fieldsRequested: ['Right Shoulder Slope', 'Armhole Depth'],
        urgency: 'Critical Before Cutting',
        tailorNote: 'Your initial profile indicated a 0.5cm lower slope on the right shoulder. Please verify standing straight against a vertical mirror.',
        referenceGuideUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=600&q=80',
        status: 'submitted',
        submittedValues: {
          'Right Shoulder Slope': 3.1,
          'Armhole Depth': 24.5,
        },
        unit: 'cm',
        submittedAt: '2026-10-12T12:10:00Z',
      },
      timestamp: '2026-10-12T11:45:00Z',
      isRead: true,
      status: 'read',
    },
    {
      id: 'msg_004_j',
      conversationId: 'conv_001_julian',
      sender: 'customer',
      senderName: 'Sir Julian Thorne',
      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      type: 'text',
      text: 'Measurements verified as requested (3.1cm slope, 24.5cm armhole depth). Please proceed with the roped shoulder finish.',
      timestamp: '2026-10-12T12:15:00Z',
      isRead: true,
      status: 'read',
    },
    {
      id: 'msg_005_j',
      conversationId: 'conv_001_julian',
      sender: 'designer',
      senderName: 'Daniel’s Maison',
      type: 'progress_update',
      text: 'Milestone Sewing is 60% complete.',
      progressUpdate: {
        stage: 'Sewing',
        progressPercent: 60,
        headline: 'Floating Canvas Pad-Stitched & Rested',
        notes: 'Canvas basted and rested overnight under natural tension. Proceeding to attach the melton collar and shape peak lapels.',
        photoUrls: ['https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80'],
        estimatedDeliveryDate: '2026-10-24',
      },
      timestamp: '2026-10-12T13:15:00Z',
      isRead: true,
      status: 'read',
    },
  ],
  conv_002_alistair: [
    {
      id: 'msg_010_a',
      conversationId: 'conv_002_alistair',
      sender: 'customer',
      senderName: 'Lord Alistair Sterling',
      senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      type: 'text',
      text: 'Hello atelier team. For the deconstructed worsted coat, I would like to ensure sufficient ease around the biceps for wearing over a bespoke morning suit.',
      timestamp: '2026-10-12T06:50:00Z',
      isRead: true,
      status: 'read',
    },
    {
      id: 'msg_011_a',
      conversationId: 'conv_002_alistair',
      sender: 'designer',
      senderName: 'Daniel’s Maison',
      type: 'text',
      text: 'Understood Lord Alistair. We have incorporated an additional 1.5cm bicep ease and 3cm inlay allowances along the side seams.',
      timestamp: '2026-10-12T07:15:00Z',
      isRead: false,
      status: 'delivered',
    },
  ],
  conv_003_vivienne: [
    {
      id: 'msg_020_v',
      conversationId: 'conv_003_vivienne',
      sender: 'customer',
      senderName: 'Lady Vivienne Vance',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      type: 'text',
      text: 'Good morning atelier! Can we ensure the red selvedge ID line remains visible on the cuff turn-up?',
      timestamp: '2026-10-12T08:30:00Z',
      isRead: false,
      status: 'delivered',
    },
  ],
  conv_004_elena: [
    {
      id: 'msg_030_e',
      conversationId: 'conv_004_elena',
      sender: 'designer',
      senderName: 'Daniel’s Maison',
      type: 'progress_update',
      text: 'Quality Control audit completed.',
      progressUpdate: {
        stage: 'Quality Control',
        progressPercent: 80,
        headline: 'Muslin Tension & Boning Audit Complete',
        notes: 'Underbust verified at exactly 76cm. Garment passed 24-point tolerance check.',
        photoUrls: ['https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80'],
      },
      timestamp: '2026-10-12T10:15:00Z',
      isRead: true,
      status: 'read',
    },
    {
      id: 'msg_031_e',
      conversationId: 'conv_004_elena',
      sender: 'customer',
      senderName: 'Elena Rostova',
      senderAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
      type: 'text',
      text: 'Splendid! The draped silhouette looks breathtaking. Looking forward to courier delivery.',
      timestamp: '2026-10-12T10:45:00Z',
      isRead: true,
      status: 'read',
    },
  ],
};

export const INITIAL_NOTIFICATIONS: CommunicationNotification[] = [
  {
    id: 'notif_001',
    conversationId: 'conv_003_vivienne',
    title: 'New Client Message',
    body: 'Lady Vivienne Vance requested red selvedge ID cuff visibility.',
    type: 'new_message',
    read: false,
    timestamp: '2026-10-12T08:30:00Z',
    customerName: 'Lady Vivienne Vance',
    orderNumber: 'DM-2026-9482',
  },
  {
    id: 'notif_002',
    conversationId: 'conv_001_julian',
    title: 'Measurement Submitted',
    body: 'Sir Julian Thorne submitted verified Right Shoulder Slope (3.1cm).',
    type: 'measurement_submitted',
    read: true,
    timestamp: '2026-10-12T12:10:00Z',
    customerName: 'Sir Julian Thorne',
    orderNumber: 'DM-2026-9480',
  },
];

const STORAGE_CONVERSATIONS_KEY = 'daniels_communication_threads_v1';
const STORAGE_MESSAGES_KEY = 'daniels_communication_messages_v1';
const STORAGE_NOTIFICATIONS_KEY = 'daniels_communication_notifications_v1';

class CommunicationStore {
  private conversations: ConversationThread[];
  private messagesMap: Record<string, ChatMessage[]>;
  private notifications: CommunicationNotification[];
  private activeConversationId: string;
  private listeners = new Set<() => void>();

  constructor() {
    this.conversations = this.loadInitialConversations();
    this.messagesMap = this.loadInitialMessages();
    this.notifications = this.loadInitialNotifications();
    this.activeConversationId = this.conversations[0]?.id || 'conv_001_julian';
  }

  private loadInitialConversations(): ConversationThread[] {
    try {
      const stored = localStorage.getItem(STORAGE_CONVERSATIONS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Could not load conversations', e);
    }
    return INITIAL_CONVERSATIONS;
  }

  private loadInitialMessages(): Record<string, ChatMessage[]> {
    try {
      const stored = localStorage.getItem(STORAGE_MESSAGES_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Could not load messages', e);
    }
    return INITIAL_MESSAGES_MAP;
  }

  private loadInitialNotifications(): CommunicationNotification[] {
    try {
      const stored = localStorage.getItem(STORAGE_NOTIFICATIONS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Could not load notifications', e);
    }
    return INITIAL_NOTIFICATIONS;
  }

  private persist() {
    try {
      localStorage.setItem(STORAGE_CONVERSATIONS_KEY, JSON.stringify(this.conversations));
      localStorage.setItem(STORAGE_MESSAGES_KEY, JSON.stringify(this.messagesMap));
      localStorage.setItem(STORAGE_NOTIFICATIONS_KEY, JSON.stringify(this.notifications));
    } catch (e) {
      console.warn('Could not persist communication store', e);
    }
    this.listeners.forEach((fn) => fn());
  }

  public getConversations(): ConversationThread[] {
    return this.conversations;
  }

  public getMessages(conversationId: string): ChatMessage[] {
    return this.messagesMap[conversationId] || [];
  }

  public getNotifications(): CommunicationNotification[] {
    return this.notifications;
  }

  public getActiveConversation(): ConversationThread {
    return (
      this.conversations.find((c) => c.id === this.activeConversationId) ||
      this.conversations[0] ||
      INITIAL_CONVERSATIONS[0]
    );
  }

  public setActiveConversationId(id: string) {
    this.activeConversationId = id;
    this.markConversationRead(id);
    this.listeners.forEach((fn) => fn());
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public markConversationRead(conversationId: string) {
    this.conversations = this.conversations.map((c) => {
      if (c.id === conversationId) {
        return {
          ...c,
          unreadCount: 0,
          lastMessage: { ...c.lastMessage, isRead: true },
        };
      }
      return c;
    });

    const threadMessages = this.messagesMap[conversationId] || [];
    this.messagesMap[conversationId] = threadMessages.map((m) => ({
      ...m,
      isRead: true,
      status: 'read',
    }));

    this.persist();
  }

  public sendMessage(
    conversationId: string,
    params: {
      text: string;
      type?: MessageType;
      measurementRequest?: MeasurementRequestPayload;
      progressUpdate?: ProgressUpdatePayload;
      attachments?: any[];
      sender?: 'designer' | 'customer';
    }
  ): ChatMessage {
    const isDesigner = params.sender !== 'customer';
    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      conversationId,
      sender: isDesigner ? 'designer' : 'customer',
      senderName: isDesigner ? 'Daniel’s Maison' : 'Client Patron',
      type: params.type || 'text',
      text: params.text,
      measurementRequest: params.measurementRequest,
      progressUpdate: params.progressUpdate,
      attachments: params.attachments,
      timestamp: new Date().toISOString(),
      isRead: isDesigner,
      status: isDesigner ? 'delivered' : 'read',
    };

    const threadMessages = this.messagesMap[conversationId] || [];
    this.messagesMap[conversationId] = [...threadMessages, newMessage];

    this.conversations = this.conversations.map((c) => {
      if (c.id === conversationId) {
        return {
          ...c,
          lastMessage: {
            text: params.text,
            timestamp: newMessage.timestamp,
            sender: newMessage.sender,
            isRead: isDesigner,
            type: newMessage.type,
          },
          unreadCount: isDesigner ? c.unreadCount : c.unreadCount + 1,
          updatedAt: new Date().toISOString(),
        };
      }
      return c;
    });

    this.persist();
    return newMessage;
  }

  public requestMeasurements(conversationId: string, payload: MeasurementRequestPayload) {
    const text = `Atelier Fitting Request: Measurement verification needed for [${payload.fieldsRequested.join(', ')}].`;
    this.sendMessage(conversationId, {
      text,
      type: 'measurement_request',
      measurementRequest: payload,
    });
  }

  public sendProgressUpdate(conversationId: string, payload: ProgressUpdatePayload) {
    const text = `Production Stage Milestone: ${payload.stage} (${payload.progressPercent}%). ${payload.headline}`;
    this.sendMessage(conversationId, {
      text,
      type: 'progress_update',
      progressUpdate: payload,
    });
  }

  public togglePinConversation(conversationId: string) {
    this.conversations = this.conversations.map((c) =>
      c.id === conversationId ? { ...c, isPinned: !c.isPinned } : c
    );
    this.persist();
  }

  public archiveConversation(conversationId: string) {
    this.conversations = this.conversations.map((c) =>
      c.id === conversationId
        ? { ...c, status: c.status === 'archived' ? 'active' : 'archived' }
        : c
    );
    this.persist();
  }

  public simulateCustomerReply(conversationId: string, text: string) {
    this.sendMessage(conversationId, {
      text,
      sender: 'customer',
      type: 'text',
    });

    // Add notification
    const conv = this.conversations.find((c) => c.id === conversationId);
    if (conv) {
      const newNotif: CommunicationNotification = {
        id: `notif_${Date.now()}`,
        conversationId,
        title: 'New Client Message',
        body: `${conv.customer.name}: "${text.substring(0, 60)}..."`,
        type: 'new_message',
        read: false,
        timestamp: new Date().toISOString(),
        customerName: conv.customer.name,
        orderNumber: conv.orderNumber,
      };
      this.notifications = [newNotif, ...this.notifications];
      this.persist();
    }
  }

  public markNotificationRead(id: string) {
    this.notifications = this.notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    this.persist();
  }

  public markAllNotificationsRead() {
    this.notifications = this.notifications.map((n) => ({ ...n, read: true }));
    this.persist();
  }

  public resetToDefaults() {
    this.conversations = INITIAL_CONVERSATIONS;
    this.messagesMap = INITIAL_MESSAGES_MAP;
    this.notifications = INITIAL_NOTIFICATIONS;
    this.activeConversationId = INITIAL_CONVERSATIONS[0].id;
    this.persist();
  }
}

export const communicationStore = new CommunicationStore();

export function useCommunicationStore() {
  const [conversations, setConversations] = useState<ConversationThread[]>(
    communicationStore.getConversations()
  );
  const [activeConversation, setActiveConversation] = useState<ConversationThread>(
    communicationStore.getActiveConversation()
  );
  const [notifications, setNotifications] = useState<CommunicationNotification[]>(
    communicationStore.getNotifications()
  );

  useEffect(() => {
    const unsubscribe = communicationStore.subscribe(() => {
      setConversations(communicationStore.getConversations());
      setActiveConversation(communicationStore.getActiveConversation());
      setNotifications(communicationStore.getNotifications());
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const activeMessages = communicationStore.getMessages(activeConversation.id);

  return {
    conversations,
    activeConversation,
    activeMessages,
    notifications,
    setActiveConversationId: (id: string) => communicationStore.setActiveConversationId(id),
    sendMessage: (convId: string, params: any) => communicationStore.sendMessage(convId, params),
    requestMeasurements: (convId: string, payload: MeasurementRequestPayload) =>
      communicationStore.requestMeasurements(convId, payload),
    sendProgressUpdate: (convId: string, payload: ProgressUpdatePayload) =>
      communicationStore.sendProgressUpdate(convId, payload),
    togglePinConversation: (convId: string) => communicationStore.togglePinConversation(convId),
    archiveConversation: (convId: string) => communicationStore.archiveConversation(convId),
    simulateCustomerReply: (convId: string, text: string) =>
      communicationStore.simulateCustomerReply(convId, text),
    markNotificationRead: (id: string) => communicationStore.markNotificationRead(id),
    markAllNotificationsRead: () => communicationStore.markAllNotificationsRead(),
    resetToDefaults: () => communicationStore.resetToDefaults(),
  };
}
