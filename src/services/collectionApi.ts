/**
 * @file collectionApi.ts
 * API Client & REST Service for Daniel’s Maison Seasonal Collection Management.
 * Implements endpoints for:
 * - Fetching seasonal collections with advanced filters (Season, Visibility, Featured, Search)
 * - Fetching single collection by ID or Slug
 * - Creating new seasonal collections with covers, stories, palettes, and products
 * - Updating existing collections and visibility states
 * - Toggling Featured status for runway spotlight
 * - Deleting / Archiving collections
 * - LocalStorage persistence for instant demonstration
 */

import {
  SeasonalCollection,
  CreateCollectionPayload,
  UpdateCollectionPayload,
  CollectionFilterOptions,
  CollectionVisibility,
} from '../types/collection.types';
import { INITIAL_SEASONAL_COLLECTIONS } from '../mock/collectionMockData';

const STORAGE_KEY = 'maison_daniels_seasonal_collections_v1';

function getStoredCollections(): SeasonalCollection[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to parse seasonal collections from storage', err);
  }
  saveCollections(INITIAL_SEASONAL_COLLECTIONS);
  return INITIAL_SEASONAL_COLLECTIONS;
}

function saveCollections(collections: SeasonalCollection[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(collections));
  } catch (err) {
    console.error('Failed to save seasonal collections to storage', err);
  }
}

export const collectionApi = {
  /**
   * Fetch all collections matching filters
   */
  async getCollections(filters?: CollectionFilterOptions): Promise<{
    collections: SeasonalCollection[];
    totalCount: number;
  }> {
    await new Promise((r) => setTimeout(r, 100)); // Latency simulation
    let list = getStoredCollections();

    // 1. Season Filter
    if (filters?.season && filters.season !== 'ALL') {
      list = list.filter((c) => c.season === filters.season);
    }

    // 2. Visibility Filter
    if (filters?.visibility && filters.visibility !== 'ALL') {
      list = list.filter((c) => c.visibility === filters.visibility);
    }

    // 3. Featured Only
    if (filters?.featuredOnly) {
      list = list.filter((c) => c.isFeatured);
    }

    // 4. Search Query (Title, Story, Subtitle, Products)
    if (filters?.searchQuery?.trim()) {
      const q = filters.searchQuery.toLowerCase().trim();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.subtitle.toLowerCase().includes(q) ||
          c.storyNarrative.toLowerCase().includes(q) ||
          c.season.toLowerCase().includes(q) ||
          c.products.some((p) => p.name.toLowerCase().includes(q) || p.primaryFabric.toLowerCase().includes(q))
      );
    }

    // 5. Sorting
    if (filters?.sortBy === 'FEATURED_FIRST') {
      list.sort((a, b) => {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return a.featuredOrder - b.featuredOrder;
      });
    } else if (filters?.sortBy === 'PRODUCT_COUNT') {
      list.sort((a, b) => b.products.length - a.products.length);
    } else if (filters?.sortBy === 'ALPHABETICAL') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      // Default: NEWEST
      list.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
    }

    return { collections: list, totalCount: list.length };
  },

  /**
   * Fetch single collection by ID
   */
  async getCollectionById(id: string): Promise<SeasonalCollection> {
    await new Promise((r) => setTimeout(r, 60));
    const list = getStoredCollections();
    const found = list.find((c) => c.id === id);
    if (!found) throw new Error(`Collection ${id} not found`);
    return found;
  },

  /**
   * Fetch single collection by Slug
   */
  async getCollectionBySlug(slug: string): Promise<SeasonalCollection> {
    await new Promise((r) => setTimeout(r, 60));
    const list = getStoredCollections();
    const found = list.find((c) => c.slug === slug);
    if (!found) throw new Error(`Collection with slug ${slug} not found`);
    return found;
  },

  /**
   * Fetch Featured Spotlight collections
   */
  async getFeaturedCollections(): Promise<SeasonalCollection[]> {
    await new Promise((r) => setTimeout(r, 60));
    const list = getStoredCollections();
    return list
      .filter((c) => c.isFeatured && c.visibility !== 'ARCHIVED')
      .sort((a, b) => a.featuredOrder - b.featuredOrder);
  },

  /**
   * Create a new Seasonal Collection
   */
  async createCollection(payload: CreateCollectionPayload): Promise<SeasonalCollection> {
    await new Promise((r) => setTimeout(r, 200));
    const list = getStoredCollections();

    const slug =
      payload.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') +
      '-' +
      payload.year;

    const newCollection: SeasonalCollection = {
      id: `col_${payload.season.toLowerCase()}_${Date.now()}`,
      slug,
      title: payload.title,
      subtitle: payload.subtitle,
      season: payload.season,
      year: payload.year,
      seasonCode: payload.seasonCode || `${payload.season.toUpperCase().slice(0, 2)}${String(payload.year).slice(-2)}`,
      coverImageUrl: payload.coverImageUrl,
      heroBannerUrl: payload.heroBannerUrl || payload.coverImageUrl,
      storyNarrative: payload.storyNarrative,
      artisticDirector: payload.artisticDirector || 'Daniel’s Maison',
      museInspiration: payload.museInspiration || 'Savile Row craftsmanship and seasonal climate atmospheres',
      colorPalette: payload.colorPalette || [
        { name: 'Obsidian Midnight', hex: '#111827', role: 'Primary Tailoring' },
        { name: 'Oatmeal Chalk', hex: '#E5E7EB', role: 'Shirting Accent' },
      ],
      textileHighlights: payload.textileHighlights || ['British Wool worsteds', 'Bemberg Cupro lining'],
      products: payload.products || [],
      productCount: payload.products?.length || 0,
      visibility: payload.visibility,
      isFeatured: payload.isFeatured,
      featuredOrder: payload.isFeatured ? 1 : 99,
      lookbookImages: [payload.coverImageUrl],
      releaseDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      designerNotes: payload.designerNotes,
      runwayLocation: payload.runwayLocation || 'Mayfair Flagship Salon, London',
    };

    list.unshift(newCollection);
    saveCollections(list);
    return newCollection;
  },

  /**
   * Update an existing collection
   */
  async updateCollection(payload: UpdateCollectionPayload): Promise<SeasonalCollection> {
    await new Promise((r) => setTimeout(r, 180));
    const list = getStoredCollections();
    const idx = list.findIndex((c) => c.id === payload.id);
    if (idx === -1) throw new Error(`Collection ${payload.id} not found`);

    const existing = list[idx];
    const updated: SeasonalCollection = {
      ...existing,
      ...payload,
      productCount: payload.products ? payload.products.length : existing.products.length,
      updatedAt: new Date().toISOString(),
    };

    list[idx] = updated;
    saveCollections(list);
    return updated;
  },

  /**
   * Toggle Featured Spotlight status
   */
  async toggleFeatured(id: string, isFeatured: boolean): Promise<SeasonalCollection> {
    await new Promise((r) => setTimeout(r, 120));
    const list = getStoredCollections();
    const found = list.find((c) => c.id === id);
    if (!found) throw new Error(`Collection ${id} not found`);

    found.isFeatured = isFeatured;
    found.updatedAt = new Date().toISOString();
    saveCollections(list);
    return found;
  },

  /**
   * Update collection visibility
   */
  async updateVisibility(id: string, visibility: CollectionVisibility): Promise<SeasonalCollection> {
    await new Promise((r) => setTimeout(r, 120));
    const list = getStoredCollections();
    const found = list.find((c) => c.id === id);
    if (!found) throw new Error(`Collection ${id} not found`);

    found.visibility = visibility;
    found.updatedAt = new Date().toISOString();
    saveCollections(list);
    return found;
  },

  /**
   * Delete a collection
   */
  async deleteCollection(id: string): Promise<boolean> {
    await new Promise((r) => setTimeout(r, 160));
    let list = getStoredCollections();
    list = list.filter((c) => c.id !== id);
    saveCollections(list);
    return true;
  },

  /**
   * Reset to initial mock data
   */
  async resetMockData(): Promise<SeasonalCollection[]> {
    localStorage.removeItem(STORAGE_KEY);
    saveCollections(INITIAL_SEASONAL_COLLECTIONS);
    return INITIAL_SEASONAL_COLLECTIONS;
  },
};
