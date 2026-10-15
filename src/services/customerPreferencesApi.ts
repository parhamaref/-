/**
 * @file customerPreferencesApi.ts
 * API Client & REST Service for Daniel’s Maison Customer Preference Management.
 * Implements endpoints for:
 * - Fetching customer preference profiles
 * - Updating favorite colors, fabrics, designers, fit, styles, collections, price ranges
 * - Generating real-time personalized product & collection recommendations
 * - Generating VIP marketing personalization blueprints
 * - LocalStorage persistence for instant demonstration
 */

import {
  CustomerPreferenceProfile,
  ProductRecommendationItem,
  CollectionRecommendationItem,
  MarketingPersonaBlueprint,
} from '../types/customerPreferences.types';
import { recommendationEngine } from './recommendationEngine';

const STORAGE_KEY = 'maison_daniels_customer_preferences_v1';

export const DEFAULT_CUSTOMER_PREFERENCE_PROFILE: CustomerPreferenceProfile = {
  customerId: 'cust_001',
  customerName: 'Lord Alistair Sterling-Fox',
  customerEmail: 'alistair@sterling-fox.co.uk',
  vipPersonaTitle: 'Savile Row Sovereign Traditionalist',
  favoriteColors: [
    { id: 'col_1', name: 'Midnight Obsidian', hex: '#0B0D12', category: 'Dark Tailoring' },
    { id: 'col_2', name: 'Sartorial Sage', hex: '#4A5B4C', category: 'Earth Tone' },
    { id: 'col_3', name: 'Imperial Bordeaux', hex: '#4A0E17', category: 'Dark Tailoring' },
    { id: 'col_4', name: 'Alabaster Ivory', hex: '#FDFBF7', category: 'Neutral' },
  ],
  favoriteFabrics: [
    { id: 'fab_1', name: 'Super 160s Royal Worsted', millName: 'Loro Piana', category: 'Worsted Wool' },
    { id: 'fab_2', name: 'Heritage Somerset Flannel (370g)', millName: 'Fox Brothers & Co.', category: 'Flannel' },
    { id: 'fab_3', name: 'Ripple Zibeline Pure Cashmere', millName: 'Scabal', category: 'Cashmere' },
    { id: 'fab_4', name: 'Ceremonial Silk Barathea 180s', millName: 'Dormeuil', category: 'Silk' },
  ],
  favoriteDesigners: [
    { id: 'des_1', name: 'Daniel’s Maison', role: 'Creative Director & Master Patternmaker' },
    { id: 'des_2', name: 'Master Tailor Henri Laurent', role: 'Savile Row Bench Director' },
  ],
  preferredFit: 'Sleek Savile Row Cut',
  fitEaseTolerance: 'Snug Athletic Fit (-0.5cm ease)',
  preferredStyles: [
    'Double-Breasted Heritage',
    '3-Piece Waistcoat Ensemble',
    'Black-Tie Ceremonial Evening',
    'High-Collar Architectural Greatcoat',
  ],
  preferredCollections: ['Spring', 'Autumn', 'Winter', 'Luxury', 'Bridal'],
  priceRange: {
    minPrice: 3500,
    maxPrice: 8500,
    currency: 'GBP',
    tier: 'SIGNATURE_SAVILE_ROW',
    allowHighValueExceptions: true,
  },
  marketing: {
    vipTrunkShowInvites: true,
    rareTextileAllocationAlerts: true,
    seasonalLookbookEarlyAccess: true,
    fittingSalonChampagneBooking: true,
    preferredCommunicationChannel: 'WHATSAPP_CONCIERGE',
    preferredAppointmentDay: 'WEEKDAY_MORNING',
  },
  personalStylingNotes: 'Prefers deep waist suppression, Milanese hand-embroidered peak lapels, and horn crest buttons. Avoid synthetic lining blushes.',
  updatedAt: new Date().toISOString(),
};

function getStoredProfile(customerId: string): CustomerPreferenceProfile {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}_${customerId}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to parse customer preferences from storage', err);
  }
  saveProfile(DEFAULT_CUSTOMER_PREFERENCE_PROFILE);
  return DEFAULT_CUSTOMER_PREFERENCE_PROFILE;
}

function saveProfile(profile: CustomerPreferenceProfile) {
  try {
    localStorage.setItem(`${STORAGE_KEY}_${profile.customerId}`, JSON.stringify(profile));
  } catch (err) {
    console.error('Failed to save customer preferences to storage', err);
  }
}

export const customerPreferencesApi = {
  /**
   * Fetch customer preference profile
   */
  async getPreferences(customerId: string = 'cust_001'): Promise<CustomerPreferenceProfile> {
    await new Promise((r) => setTimeout(r, 80));
    return getStoredProfile(customerId);
  },

  /**
   * Update customer preference profile
   */
  async updatePreferences(
    customerId: string,
    updates: Partial<CustomerPreferenceProfile>
  ): Promise<CustomerPreferenceProfile> {
    await new Promise((r) => setTimeout(r, 150));
    const current = getStoredProfile(customerId);
    const updated: CustomerPreferenceProfile = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    saveProfile(updated);
    return updated;
  },

  /**
   * Get intelligent personalized recommendations based on profile
   */
  async getRecommendations(customerId: string = 'cust_001'): Promise<{
    products: ProductRecommendationItem[];
    collections: CollectionRecommendationItem[];
    marketingBlueprint: MarketingPersonaBlueprint;
  }> {
    await new Promise((r) => setTimeout(r, 120));
    const profile = getStoredProfile(customerId);
    const products = recommendationEngine.generateProductRecommendations(profile);
    const collections = recommendationEngine.generateCollectionRecommendations(profile);
    const marketingBlueprint = recommendationEngine.generatePersonaBlueprint(profile);

    return {
      products,
      collections,
      marketingBlueprint,
    };
  },

  /**
   * Reset preferences to initial VIP defaults
   */
  async resetPreferences(customerId: string = 'cust_001'): Promise<CustomerPreferenceProfile> {
    saveProfile(DEFAULT_CUSTOMER_PREFERENCE_PROFILE);
    return DEFAULT_CUSTOMER_PREFERENCE_PROFILE;
  },
};
