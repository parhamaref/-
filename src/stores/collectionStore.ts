/**
 * @file collectionStore.ts
 * Enterprise Reactive State Store for Daniel’s Maison Seasonal Collection Management.
 * Manages designer collection authoring, public editorial lookbooks, product attachments,
 * visibility state, and featured spotlight promotions.
 */

import { useState, useEffect, useCallback } from 'react';
import {
  SeasonalCollection,
  SeasonCategory,
  CollectionVisibility,
  CollectionFilterOptions,
  CreateCollectionPayload,
  UpdateCollectionPayload,
} from '../types/collection.types';
import { collectionApi } from '../services/collectionApi';

class CollectionStoreManager {
  private collections: SeasonalCollection[] = [];
  private activeCollectionId: string | null = null;
  private filters: CollectionFilterOptions = {
    season: 'ALL',
    visibility: 'ALL',
    featuredOnly: false,
    searchQuery: '',
    sortBy: 'NEWEST',
  };
  private isLoading: boolean = false;
  private error: string | null = null;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.refresh();
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  public getState() {
    const filtered = this.getFilteredCollections();
    const featured = this.collections.filter((c) => c.isFeatured && c.visibility !== 'ARCHIVED');
    const countsBySeason = this.getCountsBySeason();
    const countsByVisibility = this.getCountsByVisibility();

    return {
      collections: this.collections,
      filteredCollections: filtered,
      featuredCollections: featured,
      activeCollection: this.getActiveCollection(),
      filters: this.filters,
      isLoading: this.isLoading,
      error: this.error,
      countsBySeason,
      countsByVisibility,
    };
  }

  public getActiveCollection(): SeasonalCollection | null {
    if (!this.activeCollectionId) return this.collections[0] || null;
    return this.collections.find((c) => c.id === this.activeCollectionId) || this.collections[0] || null;
  }

  public getFilteredCollections(): SeasonalCollection[] {
    let list = [...this.collections];

    if (this.filters.season && this.filters.season !== 'ALL') {
      list = list.filter((c) => c.season === this.filters.season);
    }

    if (this.filters.visibility && this.filters.visibility !== 'ALL') {
      list = list.filter((c) => c.visibility === this.filters.visibility);
    }

    if (this.filters.featuredOnly) {
      list = list.filter((c) => c.isFeatured);
    }

    if (this.filters.searchQuery?.trim()) {
      const q = this.filters.searchQuery.toLowerCase().trim();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.subtitle.toLowerCase().includes(q) ||
          c.storyNarrative.toLowerCase().includes(q) ||
          c.season.toLowerCase().includes(q) ||
          c.products.some((p) => p.name.toLowerCase().includes(q) || p.primaryFabric.toLowerCase().includes(q))
      );
    }

    if (this.filters.sortBy === 'FEATURED_FIRST') {
      list.sort((a, b) => {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return a.featuredOrder - b.featuredOrder;
      });
    } else if (this.filters.sortBy === 'PRODUCT_COUNT') {
      list.sort((a, b) => b.products.length - a.products.length);
    } else if (this.filters.sortBy === 'ALPHABETICAL') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      list.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
    }

    return list;
  }

  public getCountsBySeason(): Record<SeasonCategory, number> {
    const counts: Record<SeasonCategory, number> = {
      Spring: 0,
      Summer: 0,
      Autumn: 0,
      Winter: 0,
      Bridal: 0,
      Luxury: 0,
    };
    this.collections.forEach((c) => {
      if (counts[c.season] !== undefined) {
        counts[c.season]++;
      }
    });
    return counts;
  }

  public getCountsByVisibility(): Record<CollectionVisibility, number> {
    const counts: Record<CollectionVisibility, number> = {
      PUBLIC: 0,
      PRIVATE_VIP: 0,
      ARCHIVED: 0,
      COMING_SOON: 0,
    };
    this.collections.forEach((c) => {
      if (counts[c.visibility] !== undefined) {
        counts[c.visibility]++;
      }
    });
    return counts;
  }

  public async refresh() {
    this.isLoading = true;
    this.error = null;
    this.notify();

    try {
      const res = await collectionApi.getCollections();
      this.collections = res.collections;
      if (!this.activeCollectionId && this.collections.length > 0) {
        this.activeCollectionId = this.collections[0].id;
      }
    } catch (err: unknown) {
      this.error = err instanceof Error ? err.message : 'Failed to load collections';
    } finally {
      this.isLoading = false;
      this.notify();
    }
  }

  public setActiveCollectionId(id: string | null) {
    this.activeCollectionId = id;
    this.notify();
  }

  public setSeasonFilter(season: SeasonCategory | 'ALL') {
    this.filters.season = season;
    this.notify();
  }

  public setVisibilityFilter(visibility: CollectionVisibility | 'ALL') {
    this.filters.visibility = visibility;
    this.notify();
  }

  public setFeaturedOnly(featured: boolean) {
    this.filters.featuredOnly = featured;
    this.notify();
  }

  public setSearchQuery(q: string) {
    this.filters.searchQuery = q;
    this.notify();
  }

  public setSortBy(sortBy: 'NEWEST' | 'FEATURED_FIRST' | 'PRODUCT_COUNT' | 'ALPHABETICAL') {
    this.filters.sortBy = sortBy;
    this.notify();
  }

  public async createCollection(payload: CreateCollectionPayload) {
    this.isLoading = true;
    this.notify();
    try {
      const created = await collectionApi.createCollection(payload);
      this.collections.unshift(created);
      this.activeCollectionId = created.id;
      return created;
    } finally {
      this.isLoading = false;
      this.notify();
    }
  }

  public async updateCollection(payload: UpdateCollectionPayload) {
    this.isLoading = true;
    this.notify();
    try {
      const updated = await collectionApi.updateCollection(payload);
      const idx = this.collections.findIndex((c) => c.id === updated.id);
      if (idx !== -1) {
        this.collections[idx] = updated;
      }
      return updated;
    } finally {
      this.isLoading = false;
      this.notify();
    }
  }

  public async toggleFeatured(id: string, isFeatured: boolean) {
    this.isLoading = true;
    this.notify();
    try {
      const updated = await collectionApi.toggleFeatured(id, isFeatured);
      const idx = this.collections.findIndex((c) => c.id === id);
      if (idx !== -1) {
        this.collections[idx] = updated;
      }
      return updated;
    } finally {
      this.isLoading = false;
      this.notify();
    }
  }

  public async updateVisibility(id: string, visibility: CollectionVisibility) {
    this.isLoading = true;
    this.notify();
    try {
      const updated = await collectionApi.updateVisibility(id, visibility);
      const idx = this.collections.findIndex((c) => c.id === id);
      if (idx !== -1) {
        this.collections[idx] = updated;
      }
      return updated;
    } finally {
      this.isLoading = false;
      this.notify();
    }
  }

  public async deleteCollection(id: string) {
    this.isLoading = true;
    this.notify();
    try {
      await collectionApi.deleteCollection(id);
      this.collections = this.collections.filter((c) => c.id !== id);
      if (this.activeCollectionId === id) {
        this.activeCollectionId = this.collections[0]?.id || null;
      }
      return true;
    } finally {
      this.isLoading = false;
      this.notify();
    }
  }

  public async resetToDefaultMock() {
    this.isLoading = true;
    this.notify();
    try {
      const fresh = await collectionApi.resetMockData();
      this.collections = fresh;
      this.activeCollectionId = fresh[0]?.id || null;
      this.filters = {
        season: 'ALL',
        visibility: 'ALL',
        featuredOnly: false,
        searchQuery: '',
        sortBy: 'NEWEST',
      };
    } finally {
      this.isLoading = false;
      this.notify();
    }
  }
}

export const collectionStoreManager = new CollectionStoreManager();

/**
 * Custom React Hook to consume the Collection Store
 */
export function useCollectionStore() {
  const [state, setState] = useState(() => collectionStoreManager.getState());

  useEffect(() => {
    return collectionStoreManager.subscribe(() => {
      setState(collectionStoreManager.getState());
    });
  }, []);

  const refresh = useCallback(() => collectionStoreManager.refresh(), []);
  const setActiveCollectionId = useCallback((id: string | null) => collectionStoreManager.setActiveCollectionId(id), []);
  const setSeasonFilter = useCallback((s: SeasonCategory | 'ALL') => collectionStoreManager.setSeasonFilter(s), []);
  const setVisibilityFilter = useCallback((v: CollectionVisibility | 'ALL') => collectionStoreManager.setVisibilityFilter(v), []);
  const setFeaturedOnly = useCallback((f: boolean) => collectionStoreManager.setFeaturedOnly(f), []);
  const setSearchQuery = useCallback((q: string) => collectionStoreManager.setSearchQuery(q), []);
  const setSortBy = useCallback((sort: 'NEWEST' | 'FEATURED_FIRST' | 'PRODUCT_COUNT' | 'ALPHABETICAL') => collectionStoreManager.setSortBy(sort), []);
  const createCollection = useCallback((payload: CreateCollectionPayload) => collectionStoreManager.createCollection(payload), []);
  const updateCollection = useCallback((payload: UpdateCollectionPayload) => collectionStoreManager.updateCollection(payload), []);
  const toggleFeatured = useCallback((id: string, isFeatured: boolean) => collectionStoreManager.toggleFeatured(id, isFeatured), []);
  const updateVisibility = useCallback((id: string, vis: CollectionVisibility) => collectionStoreManager.updateVisibility(id, vis), []);
  const deleteCollection = useCallback((id: string) => collectionStoreManager.deleteCollection(id), []);
  const resetToDefaultMock = useCallback(() => collectionStoreManager.resetToDefaultMock(), []);

  return {
    ...state,
    refresh,
    setActiveCollectionId,
    setSeasonFilter,
    setVisibilityFilter,
    setFeaturedOnly,
    setSearchQuery,
    setSortBy,
    createCollection,
    updateCollection,
    toggleFeatured,
    updateVisibility,
    deleteCollection,
    resetToDefaultMock,
  };
}
