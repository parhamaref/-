export interface Artifact {
  id: string;
  name: string;
  code: string;
  category: 'outerwear' | 'basewear' | 'footwear' | 'accessories' | 'womenswear' | string;
  subcategory?: 'bodysuits' | 'dresses' | 'tops-crop-tops' | 'jumpsuits' | 'skirts' | 'trousers-jeans' | 'shorts-sets' | 'hoodies-sweatshirts' | string;
  collection: string;
  brand?: string;
  sku?: string;
  materials: string[];
  details: string[];
  description: {
    en: string;
    pt?: string;
  };
  lore: {
    en: string;
    pt?: string;
  };
  priceCRDT: number; // Base currency value in GBP (£)
  originalPrice?: string; // Original price in Tomans / IRR
  originalCurrency?: string; // 'IRT'
  images: {
    front: string;
    side: string;
    back: string;
    campaign: string;
    gallery?: string[];
  };
  sizes: string[];
  colors?: string[];
  inStock?: boolean;
  stockStatus?: 'In Stock' | 'Limited Stock' | 'Pre-Order';
  careInstructions?: string[];
  integrityScore: string; // e.g. "94% Structural Integrity"
  protectiveRating: string; // e.g. "Radiation / Chemical level 4"
}

export interface JournalPost {
  id: string;
  title: {
    en: string;
    pt?: string;
  };
  excerpt: {
    en: string;
    pt?: string;
  };
  content: {
    en: string;
    pt?: string;
  };
  category: 'SURVIVAL' | 'DESIGN' | 'CULTURE' | 'DECAY';
  date: string;
  coordinates: string;
  author: string;
}

export interface CartItem {
  artifact: Artifact;
  selectedSize: string;
  selectedColor?: string;
  quantity: number;
}

export type Currency = 'GBP';

export interface CurrencyDetails {
  symbol: string;
  rate: number; // multiplier from CRDT base
  label: string;
}

export interface LanguageDictionary {
  [key: string]: {
    en: string;
    pt: string;
  };
}

export interface RoadmapMilestone {
  phase: string;
  title: {
    en: string;
    pt: string;
  };
  status: 'completed' | 'in-progress' | 'future';
  timeline: string;
  actions: {
    en: string[];
    pt: string[];
  };
}
