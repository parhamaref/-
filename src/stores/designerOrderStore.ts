/**
 * @file designerOrderStore.ts
 * Reactive state store for Designer Order Management.
 * Manages Order Inbox, Acceptance, Rejection, Status Progression, Clarification Threads, and Notes.
 */

import { useState, useEffect } from 'react';
import {
  DesignerOrder,
  DesignerOrderStatus,
  ClarificationMessage,
  OrderShippingInfo,
} from '../types/designerOrder.types';

export const INITIAL_DESIGNER_ORDERS: DesignerOrder[] = [
  {
    id: 'ord_dm_9481',
    orderNumber: 'DM-2026-9481',
    createdAt: '2026-10-12T04:30:00Z',
    updatedAt: '2026-10-12T05:00:00Z',
    status: 'Pending',
    priority: 'Rush Bespoke',
    targetCompletionDate: '2026-10-26T18:00:00Z',
    customer: {
      id: 'cust_ali_01',
      name: 'Lord Alistair Sterling',
      email: 'a.sterling@kensington-holdings.co.uk',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      phone: '+44 7700 900142',
      tier: 'VIP Patron',
    },
    garmentName: 'Savile Row Deconstructed Worsted Coat',
    garmentCategory: 'outerwear',
    garmentThumbnail: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80',
    measurements: {
      unit: 'cm',
      values: {
        chest_circumference: 104,
        natural_waist: 86,
        shoulder_width: 47.5,
        sleeve_length: 66,
        back_length: 78,
        bicep_circumference: 35.5,
      },
      clientNotes: 'Prefers 1cm extra allowance in the armhole scye for layering over cashmere knitwear.',
      profileName: 'Alistair Savile Winter 2026',
      submissionDate: '2026-10-12T04:20:00Z',
      anatomicalStatus: 'Verified',
      tailorInspectionNotes: 'Proportions verified against London atelier cutter block No. 04.',
    },
    customizations: {
      baseGarmentName: 'Deconstructed Worsted Coat',
      basePrice: 650,
      options: [
        {
          groupName: 'Fabric Selection',
          optionName: '14oz Savile Worsted Wool',
          skuCode: 'W14',
          priceDelta: 0,
          swatchColor: '#1A1A1A',
          details: '100% Super 130s Worsted Wool, 380 GSM',
        },
        {
          groupName: 'Color Tone',
          optionName: 'Obsidian Noir (Deep Black)',
          skuCode: 'NOIR',
          priceDelta: 0,
          swatchColor: '#0A0A0A',
        },
        {
          groupName: 'Trim & Hardware',
          optionName: 'Smoked Mother-of-Pearl',
          skuCode: 'MOP',
          priceDelta: 35,
          swatchColor: '#3A3D40',
        },
        {
          groupName: 'Modular Accessories',
          optionName: 'Detachable Storm Throat-Latch',
          skuCode: 'LCH',
          priceDelta: 40,
        },
        {
          groupName: 'Artisan Embroidery',
          optionName: 'Gold Bullion Atelier Crest',
          skuCode: 'CREST',
          priceDelta: 120,
          swatchColor: '#D4AF37',
        },
      ],
      monogramText: 'A.S.',
      monogramPlacement: 'Under-Collar Melton Melton Felt',
      totalCustomizationPrice: 195,
      finalPrice: 845,
      estimatedLeadTimeDays: 14,
    },
    clarifications: [],
    shipping: {
      courier: 'Savile Row White Glove Courier',
      deliveryAddress: {
        name: 'Lord Alistair Sterling',
        street: '8 Kensington Palace Gardens',
        city: 'London',
        country: 'United Kingdom',
        postalCode: 'W8 4QP',
        phone: '+44 7700 900142',
      },
    },
    internalNotes: ['Priority commission for Royal Ascot gala fitting.'],
  },
  {
    id: 'ord_dm_9482',
    orderNumber: 'DM-2026-9482',
    createdAt: '2026-10-11T16:15:00Z',
    updatedAt: '2026-10-12T02:00:00Z',
    status: 'Accepted',
    priority: 'High',
    targetCompletionDate: '2026-10-25T12:00:00Z',
    customer: {
      id: 'cust_viv_02',
      name: 'Lady Vivienne Vance',
      email: 'vivienne.vance@vancemedia.com',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      phone: '+44 7911 123456',
      tier: 'Private Client',
    },
    garmentName: 'Raw-Hem Japanese Selvedge Denim Trousers',
    garmentCategory: 'trousers',
    garmentThumbnail: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80',
    measurements: {
      unit: 'cm',
      values: {
        trouser_waist: 72,
        full_hips: 96,
        inseam_length: 81,
        outseam_length: 104,
        thigh_circumference: 54,
        ankle_opening: 38,
      },
      profileName: 'Vivienne Slim Trousers',
      submissionDate: '2026-10-11T15:00:00Z',
      anatomicalStatus: 'Verified',
    },
    customizations: {
      baseGarmentName: 'Straight-Leg Selvedge Denim',
      basePrice: 380,
      options: [
        {
          groupName: 'Fabric Selection',
          optionName: '15oz Japanese Raw Selvedge',
          skuCode: 'DNM',
          priceDelta: 45,
          swatchColor: '#1B263B',
        },
        {
          groupName: 'Trim Details',
          optionName: 'Matte Buffalo Horn Buttons',
          skuCode: 'HRN',
          priceDelta: 0,
        },
        {
          groupName: 'Artisan Embroidery',
          optionName: 'Artisan Crimson Bar-Tack Stitching',
          skuCode: 'REDTK',
          priceDelta: 25,
          swatchColor: '#9E2A2B',
        },
      ],
      totalCustomizationPrice: 70,
      finalPrice: 450,
      estimatedLeadTimeDays: 12,
    },
    clarifications: [],
    shipping: {
      courier: 'DHL Express Atelier Direct',
      deliveryAddress: {
        name: 'Lady Vivienne Vance',
        street: '42 Chelsea Manor Street',
        city: 'London',
        country: 'United Kingdom',
        postalCode: 'SW3 5RL',
        phone: '+44 7911 123456',
      },
    },
    internalNotes: ['Pattern graded to size block 10 with high-rise waistline.'],
  },
  {
    id: 'ord_dm_9480',
    orderNumber: 'DM-2026-9480',
    createdAt: '2026-10-10T10:00:00Z',
    updatedAt: '2026-10-12T01:30:00Z',
    status: 'In Production',
    priority: 'Standard',
    targetCompletionDate: '2026-10-24T17:00:00Z',
    customer: {
      id: 'cust_jul_03',
      name: 'Sir Julian Thorne',
      email: 'thorne@blackwood-capital.com',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      phone: '+44 20 7123 4567',
      tier: 'VIP Patron',
    },
    garmentName: 'Anatomical Savile Row Tuxedo Jacket',
    garmentCategory: 'jackets',
    garmentThumbnail: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80',
    measurements: {
      unit: 'cm',
      values: {
        chest_circumference: 108,
        natural_waist: 92,
        shoulder_width: 49,
        sleeve_length: 67,
        back_length: 79,
        bicep_circumference: 36,
      },
      profileName: 'Julian Thorne Black Tie',
      submissionDate: '2026-10-10T09:45:00Z',
      anatomicalStatus: 'Verified',
    },
    customizations: {
      baseGarmentName: 'Bespoke Tuxedo Jacket',
      basePrice: 850,
      options: [
        {
          groupName: 'Fabric Selection',
          optionName: '14oz Savile Worsted Wool',
          priceDelta: 0,
        },
        {
          groupName: 'Trim & Hardware',
          optionName: 'Smoked Mother-of-Pearl',
          priceDelta: 35,
        },
      ],
      monogramText: 'J.T.',
      monogramPlacement: 'Interior Passport Pocket',
      totalCustomizationPrice: 35,
      finalPrice: 885,
      estimatedLeadTimeDays: 14,
    },
    clarifications: [
      {
        id: 'msg_001',
        sender: 'designer',
        senderName: 'Daniel’s Maison',
        text: 'Confirming roped shoulder peak lapel preference for black-tie commission.',
        timestamp: '2026-10-10T12:00:00Z',
        status: 'resolved',
      },
      {
        id: 'msg_002',
        sender: 'customer',
        senderName: 'Sir Julian Thorne',
        text: 'Confirmed. Heavy grosgrain facing on lapels as discussed.',
        timestamp: '2026-10-10T14:15:00Z',
        status: 'resolved',
      },
    ],
    shipping: {
      courier: 'Savile Row White Glove Courier',
      deliveryAddress: {
        name: 'Sir Julian Thorne',
        street: '15 Grosvenor Square',
        city: 'London',
        country: 'United Kingdom',
        postalCode: 'W1K 6LD',
        phone: '+44 20 7123 4567',
      },
    },
    internalNotes: ['Cutting stage complete. Currently at canvas basting table.'],
  },
  {
    id: 'ord_dm_9478',
    orderNumber: 'DM-2026-9478',
    createdAt: '2026-10-08T09:00:00Z',
    updatedAt: '2026-10-11T16:00:00Z',
    status: 'Quality Control',
    priority: 'Standard',
    targetCompletionDate: '2026-10-18T17:00:00Z',
    customer: {
      id: 'cust_ele_04',
      name: 'Elena Rostova',
      email: 'e.rostova@atelier-rostova.com',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      tier: 'Private Client',
    },
    garmentName: 'Monolithic Muslin Veil Ensemble',
    garmentCategory: 'gowns',
    garmentThumbnail: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80',
    measurements: {
      unit: 'cm',
      values: {
        full_bust: 90,
        underbust_ribcage: 76,
        natural_waist: 68,
        full_hips: 95,
        hollow_to_floor: 146,
      },
      submissionDate: '2026-10-08T08:30:00Z',
      anatomicalStatus: 'Verified',
    },
    customizations: {
      baseGarmentName: 'Muslin Veil Gown',
      basePrice: 920,
      options: [
        {
          groupName: 'Fabric Selection',
          optionName: 'Heavy Belgian Slub Linen & Muslin',
          priceDelta: 50,
        },
      ],
      totalCustomizationPrice: 50,
      finalPrice: 970,
      estimatedLeadTimeDays: 16,
    },
    clarifications: [],
    shipping: {
      courier: 'DHL Express Atelier Direct',
      deliveryAddress: {
        name: 'Elena Rostova',
        street: '12 Rue Saint-Honoré',
        city: 'Paris',
        country: 'France',
        postalCode: '75001',
        phone: '+33 1 42 68 55 00',
      },
    },
    internalNotes: ['Final hand-pressing and seam tension QC check underway.'],
  },
  {
    id: 'ord_dm_9475',
    orderNumber: 'DM-2026-9475',
    createdAt: '2026-10-05T11:00:00Z',
    updatedAt: '2026-10-11T14:00:00Z',
    status: 'Ready To Ship',
    priority: 'Standard',
    targetCompletionDate: '2026-10-15T12:00:00Z',
    customer: {
      id: 'cust_alex_05',
      name: 'Alexander Mercer',
      email: 'a.mercer@mercer-arch.com',
      avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
      tier: 'New Client',
    },
    garmentName: 'Micro-Pleated Habotai Silk Trench',
    garmentCategory: 'outerwear',
    garmentThumbnail: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
    measurements: {
      unit: 'cm',
      values: {
        chest_circumference: 102,
        natural_waist: 84,
        shoulder_width: 46,
        sleeve_length: 65,
        back_length: 105,
      },
      submissionDate: '2026-10-05T10:40:00Z',
      anatomicalStatus: 'Verified',
    },
    customizations: {
      baseGarmentName: 'Silk Habotai Trench',
      basePrice: 1100,
      options: [
        {
          groupName: 'Trim Details',
          optionName: 'Oxidized Blackened Brass Studs',
          priceDelta: 60,
        },
      ],
      totalCustomizationPrice: 60,
      finalPrice: 1160,
      estimatedLeadTimeDays: 14,
    },
    clarifications: [],
    shipping: {
      courier: 'DHL Express Atelier Direct',
      deliveryAddress: {
        name: 'Alexander Mercer',
        street: '88 Franklin Street, Apt 4B',
        city: 'New York',
        country: 'United States',
        postalCode: '10013',
        phone: '+1 212 555 0198',
      },
    },
    internalNotes: ['Packed in breathable bespoke garment bag with cedar hanger.'],
  },
  {
    id: 'ord_dm_9471',
    orderNumber: 'DM-2026-9471',
    createdAt: '2026-10-02T14:00:00Z',
    updatedAt: '2026-10-10T09:00:00Z',
    status: 'Shipped',
    priority: 'Standard',
    targetCompletionDate: '2026-10-14T18:00:00Z',
    customer: {
      id: 'cust_dav_06',
      name: 'David K. Vance',
      email: 'david.vance@solaris-ventures.com',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
      tier: 'Private Client',
    },
    garmentName: 'Asymmetrical Canvas Utility Vest',
    garmentCategory: 'outerwear',
    garmentThumbnail: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=600&q=80',
    measurements: {
      unit: 'cm',
      values: {
        chest_circumference: 105,
        natural_waist: 88,
        shoulder_width: 47,
        back_length: 68,
      },
      submissionDate: '2026-10-02T13:30:00Z',
      anatomicalStatus: 'Verified',
    },
    customizations: {
      baseGarmentName: 'Canvas Utility Vest',
      basePrice: 420,
      options: [],
      totalCustomizationPrice: 0,
      finalPrice: 420,
      estimatedLeadTimeDays: 10,
    },
    clarifications: [],
    shipping: {
      courier: 'DHL Express Atelier Direct',
      trackingNumber: 'DHL-EX-99281734-GB',
      dispatchedAt: '2026-10-10T09:00:00Z',
      estimatedDelivery: '2026-10-13T16:00:00Z',
      deliveryAddress: {
        name: 'David K. Vance',
        street: '72 Berkeley Square',
        city: 'London',
        country: 'United Kingdom',
        postalCode: 'W1J 5AW',
        phone: '+44 20 7493 8888',
      },
    },
    internalNotes: ['Dispatched with signed courier manifest.'],
  },
  {
    id: 'ord_dm_9466',
    orderNumber: 'DM-2026-9466',
    createdAt: '2026-09-25T11:00:00Z',
    updatedAt: '2026-10-06T15:00:00Z',
    status: 'Delivered',
    priority: 'Standard',
    targetCompletionDate: '2026-10-06T12:00:00Z',
    customer: {
      id: 'cust_cam_07',
      name: 'Camille Dupont',
      email: 'camille@dupont-gallery.fr',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      tier: 'Private Client',
    },
    garmentName: 'Bespoke Deconstructed Blazer',
    garmentCategory: 'jackets',
    garmentThumbnail: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80',
    measurements: {
      unit: 'cm',
      values: {
        chest_circumference: 96,
        natural_waist: 78,
        shoulder_width: 44,
        sleeve_length: 63,
        back_length: 74,
      },
      submissionDate: '2026-09-25T10:15:00Z',
      anatomicalStatus: 'Verified',
    },
    customizations: {
      baseGarmentName: 'Deconstructed Blazer',
      basePrice: 580,
      options: [
        {
          groupName: 'Fabric Selection',
          optionName: '14oz Savile Worsted Wool',
          priceDelta: 0,
        },
      ],
      totalCustomizationPrice: 0,
      finalPrice: 580,
      estimatedLeadTimeDays: 14,
    },
    clarifications: [],
    shipping: {
      courier: 'DHL Express Atelier Direct',
      trackingNumber: 'DHL-EX-88123901-FR',
      dispatchedAt: '2026-10-04T10:00:00Z',
      estimatedDelivery: '2026-10-06T14:30:00Z',
      deliveryAddress: {
        name: 'Camille Dupont',
        street: '18 Quai Voltaire',
        city: 'Paris',
        country: 'France',
        postalCode: '75007',
        phone: '+33 6 12 34 56 78',
      },
    },
    internalNotes: ['Client confirmed immaculate basted shoulder drape upon arrival.'],
  },
];

const STORAGE_KEY = 'daniels_designer_orders_v1';

class DesignerOrderStore {
  private orders: DesignerOrder[];
  private listeners = new Set<() => void>();

  constructor() {
    this.orders = this.loadInitial();
  }

  private loadInitial(): DesignerOrder[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Could not load stored designer orders', e);
    }
    return INITIAL_DESIGNER_ORDERS;
  }

  private persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.orders));
    } catch (e) {
      console.warn('Could not persist designer orders', e);
    }
    this.listeners.forEach((fn) => fn());
  }

  public getOrders(): DesignerOrder[] {
    return this.orders;
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  // Status transitions
  public acceptOrder(orderId: string, notes?: string) {
    this.orders = this.orders.map((ord) => {
      if (ord.id !== orderId) return ord;
      return {
        ...ord,
        status: 'Accepted',
        updatedAt: new Date().toISOString(),
        internalNotes: notes
          ? [...ord.internalNotes, `Accepted by atelier: ${notes}`]
          : [...ord.internalNotes, 'Commission accepted and entered drafting queue.'],
      };
    });
    this.persist();
  }

  public rejectOrder(orderId: string, reason: string) {
    this.orders = this.orders.map((ord) => {
      if (ord.id !== orderId) return ord;
      return {
        ...ord,
        status: 'Rejected',
        rejectionReason: reason,
        updatedAt: new Date().toISOString(),
        internalNotes: [...ord.internalNotes, `Commission rejected: ${reason}`],
      };
    });
    this.persist();
  }

  public updateOrderStatus(orderId: string, nextStatus: DesignerOrderStatus) {
    this.orders = this.orders.map((ord) => {
      if (ord.id !== orderId) return ord;
      return {
        ...ord,
        status: nextStatus,
        updatedAt: new Date().toISOString(),
        internalNotes: [...ord.internalNotes, `Status updated to ${nextStatus}`],
      };
    });
    this.persist();
  }

  public requestClarification(orderId: string, messageText: string) {
    const newMessage: ClarificationMessage = {
      id: `msg_${Date.now()}`,
      sender: 'designer',
      senderName: 'Daniel’s Maison',
      text: messageText,
      timestamp: new Date().toISOString(),
      status: 'pending_reply',
    };

    this.orders = this.orders.map((ord) => {
      if (ord.id !== orderId) return ord;
      return {
        ...ord,
        clarifications: [...ord.clarifications, newMessage],
        updatedAt: new Date().toISOString(),
        internalNotes: [...ord.internalNotes, `Clarification requested: "${messageText}"`],
      };
    });
    this.persist();
  }

  public updateShipping(orderId: string, shippingUpdate: Partial<OrderShippingInfo>) {
    this.orders = this.orders.map((ord) => {
      if (ord.id !== orderId) return ord;
      return {
        ...ord,
        shipping: {
          ...ord.shipping,
          ...shippingUpdate,
        },
        updatedAt: new Date().toISOString(),
      };
    });
    this.persist();
  }

  public addInternalNote(orderId: string, noteText: string) {
    this.orders = this.orders.map((ord) => {
      if (ord.id !== orderId) return ord;
      return {
        ...ord,
        internalNotes: [...ord.internalNotes, noteText],
        updatedAt: new Date().toISOString(),
      };
    });
    this.persist();
  }

  public resetToDefaults() {
    this.orders = INITIAL_DESIGNER_ORDERS;
    this.persist();
  }
}

export const designerOrderStore = new DesignerOrderStore();

export function useDesignerOrderStore() {
  const [orders, setOrders] = useState<DesignerOrder[]>(designerOrderStore.getOrders());

  useEffect(() => {
    const unsubscribe = designerOrderStore.subscribe(() => {
      setOrders(designerOrderStore.getOrders());
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return {
    orders,
    acceptOrder: (id: string, notes?: string) => designerOrderStore.acceptOrder(id, notes),
    rejectOrder: (id: string, reason: string) => designerOrderStore.rejectOrder(id, reason),
    updateOrderStatus: (id: string, status: DesignerOrderStatus) =>
      designerOrderStore.updateOrderStatus(id, status),
    requestClarification: (id: string, text: string) =>
      designerOrderStore.requestClarification(id, text),
    updateShipping: (id: string, s: Partial<OrderShippingInfo>) =>
      designerOrderStore.updateShipping(id, s),
    addInternalNote: (id: string, note: string) => designerOrderStore.addInternalNote(id, note),
    resetToDefaults: () => designerOrderStore.resetToDefaults(),
  };
}
