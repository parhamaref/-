/**
 * @file collection.types.ts
 * Type definitions for Daniel’s Maison Seasonal Collection Management System.
 *
 * Supports:
 * - Seasonal Collections: Spring, Summer, Autumn, Winter, Bridal, Luxury
 * - Collection Cover & Hero Lookbook imagery
 * - Collection Story & Editorial Creative Director narrative
 * - Curated Collection Products & Garments
 * - Visibility controls: Public, Private VIP, Archived, Coming Soon
 * - Featured Spotlight Collections for runway showcase
 */

export type SeasonCategory =
  | 'Spring'
  | 'Summer'
  | 'Autumn'
  | 'Winter'
  | 'Bridal'
  | 'Luxury';

export type CollectionVisibility =
  | 'PUBLIC'
  | 'PRIVATE_VIP'
  | 'ARCHIVED'
  | 'COMING_SOON';

export interface CollectionPaletteColor {
  name: string;
  hex: string;
  role?: string; // e.g. "Primary Cloth", "Lining Accent", "Silk Thread"
}

export interface CollectionProductItem {
  id: string;
  name: string;
  category: string;
  price: number;
  currency: string;
  imageUrl: string;
  primaryFabric: string;
  silhouette: string;
  isHeroPiece?: boolean;
  shortDescription?: string;
}

export interface SeasonalCollection {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  season: SeasonCategory;
  year: number;
  seasonCode: string; // e.g. "SS26", "FW26", "BRIDAL-26"
  coverImageUrl: string;
  heroBannerUrl?: string;
  storyNarrative: string;
  artisticDirector: string;
  museInspiration: string;
  colorPalette: CollectionPaletteColor[];
  textileHighlights: string[];
  products: CollectionProductItem[];
  productCount: number;
  visibility: CollectionVisibility;
  isFeatured: boolean;
  featuredOrder: number;
  lookbookImages: string[];
  releaseDate: string;
  createdAt: string;
  updatedAt: string;
  designerNotes?: string;
  runwayLocation?: string; // e.g. "Mayfair Flagship Salon, London"
}

export interface CreateCollectionPayload {
  title: string;
  subtitle: string;
  season: SeasonCategory;
  year: number;
  seasonCode: string;
  coverImageUrl: string;
  heroBannerUrl?: string;
  storyNarrative: string;
  artisticDirector?: string;
  museInspiration?: string;
  colorPalette?: CollectionPaletteColor[];
  textileHighlights?: string[];
  products?: CollectionProductItem[];
  visibility: CollectionVisibility;
  isFeatured: boolean;
  designerNotes?: string;
  runwayLocation?: string;
}

export interface UpdateCollectionPayload {
  id: string;
  title?: string;
  subtitle?: string;
  season?: SeasonCategory;
  year?: number;
  seasonCode?: string;
  coverImageUrl?: string;
  heroBannerUrl?: string;
  storyNarrative?: string;
  artisticDirector?: string;
  museInspiration?: string;
  colorPalette?: CollectionPaletteColor[];
  textileHighlights?: string[];
  products?: CollectionProductItem[];
  visibility?: CollectionVisibility;
  isFeatured?: boolean;
  designerNotes?: string;
  runwayLocation?: string;
}

export interface CollectionFilterOptions {
  season?: SeasonCategory | 'ALL';
  visibility?: CollectionVisibility | 'ALL';
  featuredOnly?: boolean;
  searchQuery?: string;
  sortBy?: 'NEWEST' | 'FEATURED_FIRST' | 'PRODUCT_COUNT' | 'ALPHABETICAL';
}
