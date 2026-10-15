/**
 * @file designerStore.ts
 * Lightweight, zero-external-dependency reactive state manager for the Designer Dashboard infrastructure.
 * Provides Zustand-like ergonomics with React hook subscribers, persistent settings, and optimistic updates.
 */

import { useState, useEffect } from 'react';
import {
  DesignerProfile,
  DesignerNavSection,
  DesignerNotification,
  DesignerSettings,
  PortfolioItem,
} from '../types/designer.types';

export const INITIAL_PORTFOLIO_GALLERY: PortfolioItem[] = [
  {
    id: 'port_001_drape',
    title: 'Metamorphic Drape Overcoat',
    category: 'Runway',
    description: 'Triple-washed organic wool with unbonded raw-edge lapels, displayed during Paris Men’s Autumn/Winter capsule.',
    imageUrl: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=80',
    year: '2026',
    client: 'Paris Fashion Week AW26',
    featured: true,
    tags: ['Haute Couture', 'Worsted Wool', 'Deconstruction', 'Outerwear'],
    aspectRatio: 'portrait',
    createdAt: '2026-02-15T10:00:00Z',
  },
  {
    id: 'port_002_tuxedo',
    title: 'Anatomical Savile Row Tuxedo',
    category: 'Bespoke',
    description: 'Single-breasted bespoke smoking jacket engineered with roped shoulder construction and silk grosgrain facings.',
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
    year: '2025',
    client: 'Private Royal Commission',
    featured: true,
    tags: ['Bespoke Tailoring', 'Silk Grosgrain', 'Hand-Stitched', 'Savile Row'],
    aspectRatio: 'portrait',
    createdAt: '2025-11-20T14:30:00Z',
  },
  {
    id: 'port_003_vogue',
    title: 'Raw-Hem Architectural Denim',
    category: 'Editorial',
    description: '14oz Japanese selvedge denim sculpted with ergonomic knee darts and cold-water enzyme wash for Vogue Italia.',
    imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1200&q=80',
    year: '2026',
    client: 'Vogue Italia Spring Edition',
    featured: true,
    tags: ['Japanese Selvedge', 'Editorial', 'Raw Hem', 'Ergonomic Darts'],
    aspectRatio: 'portrait',
    createdAt: '2026-01-08T09:15:00Z',
  },
  {
    id: 'port_004_gauze',
    title: 'Monolithic Muslin Veil Ensemble',
    category: 'Atelier',
    description: 'Double-layered cotton muslin gown with hand-frayed hemline and interior corset boning fabricated in London studio.',
    imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80',
    year: '2025',
    client: 'Atelier Archive No. 04',
    featured: false,
    tags: ['Muslin', 'Corsetry', 'Sculptural', 'London Atelier'],
    aspectRatio: 'portrait',
    createdAt: '2025-08-12T16:00:00Z',
  },
  {
    id: 'port_005_silk',
    title: 'Micro-Pleated Habotai Silk Trench',
    category: 'Editorial',
    description: 'Featherweight silk habotai trench coat treated with mineral water-repellent finish and articulated storm flap.',
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
    year: '2025',
    client: 'Dazed & Confused Magazine',
    featured: false,
    tags: ['Silk Habotai', 'Trench', 'Pleated', 'Articulated'],
    aspectRatio: 'portrait',
    createdAt: '2025-09-28T11:45:00Z',
  },
  {
    id: 'port_006_vest',
    title: 'Asymmetrical Canvas Utility Vest',
    category: 'Craftsmanship',
    description: 'Rigid cotton duck canvas with blackened brass hardware, twin gusseted cargo pockets, and hand-waxed finish.',
    imageUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80',
    year: '2026',
    client: 'Atelier Craftsmanship Dossier',
    featured: false,
    tags: ['Duck Canvas', 'Blackened Brass', 'Hand-Waxed', 'Utility'],
    aspectRatio: 'portrait',
    createdAt: '2026-03-02T13:20:00Z',
  },
];

export const INITIAL_DESIGNER_PROFILE: DesignerProfile = {
  id: 'des_001_dm',
  userId: 'usr_designer_01',
  slug: 'daniel-maison',
  brandName: 'DANIEL MAISON ATELIER',
  designerName: 'Daniel’s Maison',
  tagline: 'Tactile architectural deconstructivism & bespoke made-to-measure tailoring.',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  logoUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=200&q=80',
  coverImageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1600&q=80',
  biography: 'Haute couture atelier dedicated to tactile architectural deconstructivism, bespoke tailoring, and certified made-to-measure outerwear with zero compromise on artisanal precision.',
  brandStory: 'Established with the philosophy that garments carry the memory of resilience. Every seam is engineered for timeless endurance, merging 18th-century Savile Row handcraft with stark brutalist aesthetics.',
  designPhilosophy: 'Decadent minimalism meets raw bespoke tailoring. Zero artificial fillers; pure worsted wools, raw denims, and organic gauzes cut along natural anatomical lines.',
  specialties: ['Bespoke Tailoring', 'Architectural Outerwear', 'Deconstructivist Pattern Drafting', 'Selvedge Denim'],
  awards: ['British Fashion Council Artisan Grant 2024', 'Savile Row Guild Excellence in Craft 2025'],
  studioLocation: {
    address: '14 Savile Row, Suite 3B',
    city: 'London',
    country: 'United Kingdom',
    postalCode: 'W1S 3JN',
    coordinates: '51.5115° N, 0.1410° W',
  },
  contactEmail: 'atelier@danielmaison.com',
  phone: '+44 20 7946 0888',
  workingHours: 'Mon - Fri: 09:00 - 18:30 GMT',
  socialLinks: {
    instagram: 'https://instagram.com/danielmaison.couture',
    website: 'https://danielmaison.atelier',
    linkedin: 'https://linkedin.com/company/danielmaison',
    twitter: 'https://x.com/danielmaison',
  },
  verificationStatus: 'Verified',
  commissionRate: 0.15,
  portfolioGallery: INITIAL_PORTFOLIO_GALLERY,
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2026-10-12T08:00:00Z',
};

export const INITIAL_NOTIFICATIONS: DesignerNotification[] = [
  {
    id: 'notif_001',
    title: 'New Bespoke Commission Received',
    message: 'Order #DM-2026-9481 for Raw-Hem Straight-Leg Denim requires measurement review.',
    type: 'order',
    read: false,
    timestamp: '10 mins ago',
  },
  {
    id: 'notif_002',
    title: 'Low Material Alert: Worsted Wool (Roll #04)',
    message: 'Remaining balance at 6.4 meters. Threshold is 12 meters.',
    type: 'inventory',
    read: false,
    timestamp: '1 hour ago',
  },
  {
    id: 'notif_003',
    title: 'Customer Review Submitted (5.0 ★)',
    message: 'Lord Alistair praised the lapel pick-stitching and anatomical shoulder fit.',
    type: 'review',
    read: true,
    timestamp: '5 hours ago',
  },
  {
    id: 'notif_004',
    title: 'Payout Cleared to Bank Account',
    message: '£4,850.00 transferred via Stripe Connect to Barclays UK account.',
    type: 'payout',
    read: true,
    timestamp: 'Yesterday',
  },
];

export const INITIAL_SETTINGS: DesignerSettings = {
  emailAlertsOnOrder: true,
  smsAlertsOnUrgent: false,
  autoAcceptOrders: false,
  standardLeadTimeDays: 14,
  currency: 'GBP',
  twoFactorEnabled: true,
  theme: 'obsidian',
  language: 'en',
};

const STORAGE_KEY = 'daniels_designer_store_state_v2';

interface DesignerStoreState {
  profile: DesignerProfile;
  activeSection: DesignerNavSection;
  isSidebarCollapsed: boolean;
  isMobileSidebarOpen: boolean;
  notifications: DesignerNotification[];
  settings: DesignerSettings;
  unreadCount: number;
}

class DesignerStore {
  private state: DesignerStoreState;
  private listeners = new Set<() => void>();

  constructor() {
    this.state = this.loadInitialState();
  }

  private loadInitialState(): DesignerStoreState {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...parsed,
          // ensure portfolioGallery exists
          profile: {
            ...INITIAL_DESIGNER_PROFILE,
            ...parsed.profile,
            portfolioGallery:
              parsed.profile?.portfolioGallery && parsed.profile.portfolioGallery.length > 0
                ? parsed.profile.portfolioGallery
                : INITIAL_PORTFOLIO_GALLERY,
          },
          unreadCount: (parsed.notifications || INITIAL_NOTIFICATIONS).filter((n: any) => !n.read).length,
        };
      }
    } catch (e) {
      console.warn('Failed to load cached store state', e);
    }

    return {
      profile: INITIAL_DESIGNER_PROFILE,
      activeSection: 'overview',
      isSidebarCollapsed: false,
      isMobileSidebarOpen: false,
      notifications: INITIAL_NOTIFICATIONS,
      settings: INITIAL_SETTINGS,
      unreadCount: INITIAL_NOTIFICATIONS.filter((n) => !n.read).length,
    };
  }

  private persistState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.warn('Failed to persist designer store state', e);
    }
  }

  public getState() {
    return this.state;
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.persistState();
    this.listeners.forEach((fn) => fn());
  }

  public setActiveSection(section: DesignerNavSection) {
    this.state = {
      ...this.state,
      activeSection: section,
      isMobileSidebarOpen: false, // auto-close mobile drawer on route select
    };
    this.notify();
  }

  public toggleSidebar() {
    this.state = {
      ...this.state,
      isSidebarCollapsed: !this.state.isSidebarCollapsed,
    };
    this.notify();
  }

  public setMobileSidebarOpen(open: boolean) {
    this.state = {
      ...this.state,
      isMobileSidebarOpen: open,
    };
    this.notify();
  }

  public updateProfile(updated: Partial<DesignerProfile>) {
    this.state = {
      ...this.state,
      profile: {
        ...this.state.profile,
        ...updated,
        updatedAt: new Date().toISOString(),
      },
    };
    this.notify();
  }

  // Portfolio actions
  public addPortfolioItem(item: PortfolioItem) {
    const updatedGallery = [item, ...(this.state.profile.portfolioGallery || [])];
    this.updateProfile({ portfolioGallery: updatedGallery });
  }

  public updatePortfolioItem(id: string, updates: Partial<PortfolioItem>) {
    const updatedGallery = (this.state.profile.portfolioGallery || []).map((it) => {
      if (it.id === id) {
        return { ...it, ...updates, updatedAt: new Date().toISOString() };
      }
      return it;
    });
    this.updateProfile({ portfolioGallery: updatedGallery });
  }

  public deletePortfolioItem(id: string) {
    const updatedGallery = (this.state.profile.portfolioGallery || []).filter((it) => it.id !== id);
    this.updateProfile({ portfolioGallery: updatedGallery });
  }

  public togglePortfolioFeatured(id: string) {
    const updatedGallery = (this.state.profile.portfolioGallery || []).map((it) => {
      if (it.id === id) {
        return { ...it, featured: !it.featured, updatedAt: new Date().toISOString() };
      }
      return it;
    });
    this.updateProfile({ portfolioGallery: updatedGallery });
  }

  public reorderPortfolio(itemIds: string[]) {
    const current = this.state.profile.portfolioGallery || [];
    const itemMap = new Map(current.map((it) => [it.id, it]));
    const reordered: PortfolioItem[] = [];
    itemIds.forEach((id) => {
      const found = itemMap.get(id);
      if (found) reordered.push(found);
    });
    // add any remaining
    current.forEach((it) => {
      if (!itemIds.includes(it.id)) reordered.push(it);
    });
    this.updateProfile({ portfolioGallery: reordered });
  }

  // Notifications
  public markNotificationAsRead(id: string) {
    const nextNotifs = this.state.notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    this.state = {
      ...this.state,
      notifications: nextNotifs,
      unreadCount: nextNotifs.filter((n) => !n.read).length,
    };
    this.notify();
  }

  public markAllNotificationsAsRead() {
    const nextNotifs = this.state.notifications.map((n) => ({ ...n, read: true }));
    this.state = {
      ...this.state,
      notifications: nextNotifs,
      unreadCount: 0,
    };
    this.notify();
  }

  public updateSettings(updated: Partial<DesignerSettings>) {
    this.state = {
      ...this.state,
      settings: {
        ...this.state.settings,
        ...updated,
      },
    };
    this.notify();
  }
}

export const designerStore = new DesignerStore();

/**
 * React hook subscriber for designer state.
 */
export function useDesignerStore() {
  const [state, setState] = useState(designerStore.getState());

  useEffect(() => {
    const unsubscribe = designerStore.subscribe(() => {
      setState(designerStore.getState());
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return {
    ...state,
    setActiveSection: (sec: DesignerNavSection) => designerStore.setActiveSection(sec),
    toggleSidebar: () => designerStore.toggleSidebar(),
    setMobileSidebarOpen: (open: boolean) => designerStore.setMobileSidebarOpen(open),
    updateProfile: (p: Partial<DesignerProfile>) => designerStore.updateProfile(p),
    addPortfolioItem: (item: PortfolioItem) => designerStore.addPortfolioItem(item),
    updatePortfolioItem: (id: string, updates: Partial<PortfolioItem>) =>
      designerStore.updatePortfolioItem(id, updates),
    deletePortfolioItem: (id: string) => designerStore.deletePortfolioItem(id),
    togglePortfolioFeatured: (id: string) => designerStore.togglePortfolioFeatured(id),
    reorderPortfolio: (ids: string[]) => designerStore.reorderPortfolio(ids),
    markNotificationAsRead: (id: string) => designerStore.markNotificationAsRead(id),
    markAllNotificationsAsRead: () => designerStore.markAllNotificationsAsRead(),
    updateSettings: (s: Partial<DesignerSettings>) => designerStore.updateSettings(s),
  };
}
