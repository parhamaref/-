/**
 * @file designer.types.ts
 * Core types, interfaces, and permissions for the Designer Dashboard infrastructure.
 */

import { User } from './daniels.types';

export type DesignerVerificationStatus = 'Pending' | 'Under Review' | 'Verified' | 'Suspended';

export type PortfolioCategory =
  | 'Runway'
  | 'Editorial'
  | 'Atelier'
  | 'Bespoke'
  | 'Archive'
  | 'Craftsmanship';

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  category: PortfolioCategory;
  imageUrl: string;
  year?: string;
  client?: string;
  featured?: boolean;
  tags?: string[];
  aspectRatio?: 'portrait' | 'landscape' | 'square';
  createdAt: string;
  updatedAt?: string;
}

export interface DesignerProfile {
  id: string;
  userId: string;
  slug: string;
  brandName: string;
  designerName: string;
  tagline?: string;
  avatarUrl: string;
  logoUrl: string;
  coverImageUrl: string;
  biography: string;
  brandStory: string;
  designPhilosophy: string;
  specialties?: string[];
  awards?: string[];
  studioLocation: {
    address: string;
    city: string;
    country: string;
    postalCode?: string;
    coordinates?: string;
  };
  contactEmail: string;
  phone: string;
  workingHours: string;
  socialLinks: {
    instagram?: string;
    website?: string;
    linkedin?: string;
    twitter?: string;
    pinterest?: string;
    youtube?: string;
  };
  verificationStatus: DesignerVerificationStatus;
  stripeAccountId?: string;
  commissionRate: number; // e.g. 0.15 (15%)
  portfolioGallery: PortfolioItem[];
  createdAt: string;
  updatedAt: string;
}

export type DesignerNavSection =
  | 'overview'
  | 'profile'
  | 'products'
  | 'collections'
  | 'customization'
  | 'measurements'
  | 'orders'
  | 'approvals'
  | 'versioning'
  | 'wardrobe'
  | 'alterations'
  | 'production'
  | 'videos'
  | 'messages'
  | 'inventory'
  | 'suppliers'
  | 'reviews'
  | 'analytics'
  | 'earnings'
  | 'application'
  | 'qc'
  | 'rework'
  | 'audit'
  | 'notifications'
  | 'media'
  | 'security'
  | 'settings';

export interface DesignerNotification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'review' | 'message' | 'inventory' | 'payout' | 'system';
  read: boolean;
  timestamp: string;
  actionUrl?: string;
}

export interface DesignerSettings {
  emailAlertsOnOrder: boolean;
  smsAlertsOnUrgent: boolean;
  autoAcceptOrders: boolean;
  standardLeadTimeDays: number;
  currency: 'GBP' | 'EUR' | 'USD' | 'IRT';
  twoFactorEnabled: boolean;
  theme: 'dark' | 'light' | 'obsidian';
  language: 'en' | 'pt';
}

export interface JwtSession {
  token: string;
  refreshToken: string;
  expiresAt: number;
  issuedAt: number;
  user: User;
  designerProfile?: DesignerProfile;
}
