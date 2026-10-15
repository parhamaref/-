/**
 * @file customerPreferences.types.ts
 * Enterprise Type Definitions for Daniel’s Maison Customer Preference Management
 * and Personalized Recommendation Engine.
 *
 * Stores:
 * - Favorite Colors (Hex, color name, palette role)
 * - Favorite Fabrics (Mills, yarn counts, compositions, textures)
 * - Favorite Designers & Master Tailors
 * - Preferred Fit (Savile Row Cut, English Drape, Neapolitan Soft, etc.)
 * - Preferred Styles (Double-Breasted, 3-Piece, Tuxedo, Safari, etc.)
 * - Preferred Collections (Spring, Summer, Autumn, Winter, Bridal, Luxury)
 * - Price Range Preferences (Min, Max, Currency, Budget Tier)
 *
 * Drives:
 * - Personalized Product Suggestions with match scoring (0-100%)
 * - Collection Suggestions with thematic rationale
 * - Marketing Personalization & VIP Persona Classification
 */

import { SeasonCategory } from './collection.types';

export interface PreferredColor {
  id: string;
  name: string;
  hex: string;
  category: 'Neutral' | 'Dark Tailoring' | 'Earth Tone' | 'Vibrant Accent' | 'Pastel';
}

export interface PreferredFabric {
  id: string;
  name: string;
  millName: string;
  category: 'Worsted Wool' | 'Flannel' | 'Cashmere' | 'Linen' | 'Silk' | 'Tweed' | 'Exotic';
}

export interface PreferredDesigner {
  id: string;
  name: string;
  role: string;
  atelierBrand?: string;
}

export type FitSilhouettePreference =
  | 'Sleek Savile Row Cut'
  | 'Traditional English Drape'
  | 'Neapolitan Soft Tailoring'
  | 'Architectural Structured'
  | 'Relaxed Casual Bespoke'
  | 'Classic British Military';

export type FitEaseTolerance =
  | 'Snug Athletic Fit (-0.5cm ease)'
  | 'Standard True-to-Measure (0cm ease)'
  | 'Comfort Ease (+1.5cm ease)'
  | 'Generous Drape Ease (+3.0cm ease)';

export type WardrobeStyleAesthetic =
  | 'Double-Breasted Heritage'
  | '3-Piece Waistcoat Ensemble'
  | 'Black-Tie Ceremonial Evening'
  | 'Field & Safari Utility Tailoring'
  | 'Unstructured Summer Linen'
  | 'High-Collar Architectural Greatcoat'
  | 'Single-Breasted Notch Executive';

export type PriceBudgetTier =
  | 'ENTRY_BESPOKE' // £1,500 - £3,000
  | 'SIGNATURE_SAVILE_ROW' // £3,000 - £6,000
  | 'HIGH_LUXURY_HAUTE' // £6,000 - £12,000
  | 'ROYAL_SOVEREIGN'; // £12,000+

export interface PriceRangePreference {
  minPrice: number;
  maxPrice: number;
  currency: string;
  tier: PriceBudgetTier;
  allowHighValueExceptions: boolean;
}

export interface MarketingPersonalizationPreferences {
  vipTrunkShowInvites: boolean;
  rareTextileAllocationAlerts: boolean; // e.g. Scabal gold or Loro Piana Tasmanian
  seasonalLookbookEarlyAccess: boolean;
  fittingSalonChampagneBooking: boolean;
  preferredCommunicationChannel: 'WHATSAPP_CONCIERGE' | 'PRIVATE_EMAIL' | 'PHONE_CONSULTATION';
  preferredAppointmentDay: 'WEEKDAY_MORNING' | 'WEEKDAY_EVENING' | 'SATURDAY_SALON';
}

export interface CustomerPreferenceProfile {
  customerId: string;
  customerName: string;
  customerEmail: string;
  vipPersonaTitle: string; // e.g. "Savile Row Sovereign Traditionalist"
  favoriteColors: PreferredColor[];
  favoriteFabrics: PreferredFabric[];
  favoriteDesigners: PreferredDesigner[];
  preferredFit: FitSilhouettePreference;
  fitEaseTolerance: FitEaseTolerance;
  preferredStyles: WardrobeStyleAesthetic[];
  preferredCollections: SeasonCategory[];
  priceRange: PriceRangePreference;
  marketing: MarketingPersonalizationPreferences;
  personalStylingNotes: string;
  updatedAt: string;
}

export interface ProductRecommendationItem {
  id: string;
  name: string;
  category: string;
  price: number;
  currency: string;
  imageUrl: string;
  fabric: string;
  silhouette: string;
  designer: string;
  matchScore: number; // 0 - 100%
  matchingReasons: string[];
  isTopRecommendation: boolean;
}

export interface CollectionRecommendationItem {
  id: string;
  slug: string;
  title: string;
  season: SeasonCategory;
  seasonCode: string;
  coverImageUrl: string;
  matchScore: number; // 0 - 100%
  thematicRationale: string;
  curatedPiecesCount: number;
}

export interface MarketingPersonaBlueprint {
  personaTitle: string;
  clientSegment: 'Sovereign Patron' | 'Modern Diplomat' | 'Executive Connoisseur' | 'Haute Avant-Garde';
  nextRecommendedCommission: {
    garmentType: string;
    suggestedCloth: string;
    suggestedColor: string;
    whyRecommended: string;
    estimatedCostGbp: number;
  };
  tailorConsultationDirectives: string[];
  swatchTrunkRecommended: string[];
}
