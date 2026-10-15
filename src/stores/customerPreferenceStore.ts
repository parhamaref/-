/**
 * @file customerPreferenceStore.ts
 * Reactive State Store for Daniel’s Maison Customer Preference Management.
 * Drives real-time UI synchronization between preferences and recommendation engines.
 */

import { useState, useEffect, useCallback } from 'react';
import {
  CustomerPreferenceProfile,
  ProductRecommendationItem,
  CollectionRecommendationItem,
  MarketingPersonaBlueprint,
  PreferredColor,
  PreferredFabric,
  FitSilhouettePreference,
  FitEaseTolerance,
  WardrobeStyleAesthetic,
  MarketingPersonalizationPreferences,
} from '../types/customerPreferences.types';
import { SeasonCategory } from '../types/collection.types';
import {
  customerPreferencesApi,
  DEFAULT_CUSTOMER_PREFERENCE_PROFILE,
} from '../services/customerPreferencesApi';

class CustomerPreferenceStoreManager {
  private profile: CustomerPreferenceProfile = DEFAULT_CUSTOMER_PREFERENCE_PROFILE;
  private productRecommendations: ProductRecommendationItem[] = [];
  private collectionRecommendations: CollectionRecommendationItem[] = [];
  private marketingBlueprint: MarketingPersonaBlueprint | null = null;
  private isLoading: boolean = false;
  private isSaving: boolean = false;
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
    return {
      profile: this.profile,
      productRecommendations: this.productRecommendations,
      collectionRecommendations: this.collectionRecommendations,
      marketingBlueprint: this.marketingBlueprint,
      isLoading: this.isLoading,
      isSaving: this.isSaving,
    };
  }

  public async refresh(customerId: string = 'cust_001') {
    this.isLoading = true;
    this.notify();

    try {
      const p = await customerPreferencesApi.getPreferences(customerId);
      this.profile = p;
      const recs = await customerPreferencesApi.getRecommendations(customerId);
      this.productRecommendations = recs.products;
      this.collectionRecommendations = recs.collections;
      this.marketingBlueprint = recs.marketingBlueprint;
    } finally {
      this.isLoading = false;
      this.notify();
    }
  }

  public async updateProfile(updates: Partial<CustomerPreferenceProfile>) {
    this.isSaving = true;
    this.notify();

    try {
      const updated = await customerPreferencesApi.updatePreferences(
        this.profile.customerId,
        updates
      );
      this.profile = updated;
      // Re-run recommendations with updated preferences
      const recs = await customerPreferencesApi.getRecommendations(this.profile.customerId);
      this.productRecommendations = recs.products;
      this.collectionRecommendations = recs.collections;
      this.marketingBlueprint = recs.marketingBlueprint;
      return updated;
    } finally {
      this.isSaving = false;
      this.notify();
    }
  }

  public toggleColor(color: PreferredColor) {
    const exists = this.profile.favoriteColors.some((c) => c.hex === color.hex);
    let nextColors: PreferredColor[];
    if (exists) {
      nextColors = this.profile.favoriteColors.filter((c) => c.hex !== color.hex);
    } else {
      nextColors = [...this.profile.favoriteColors, color];
    }
    this.updateProfile({ favoriteColors: nextColors });
  }

  public toggleFabric(fabric: PreferredFabric) {
    const exists = this.profile.favoriteFabrics.some((f) => f.name === fabric.name);
    let nextFabrics: PreferredFabric[];
    if (exists) {
      nextFabrics = this.profile.favoriteFabrics.filter((f) => f.name !== fabric.name);
    } else {
      nextFabrics = [...this.profile.favoriteFabrics, fabric];
    }
    this.updateProfile({ favoriteFabrics: nextFabrics });
  }

  public toggleStyle(style: WardrobeStyleAesthetic) {
    const exists = this.profile.preferredStyles.includes(style);
    let nextStyles: WardrobeStyleAesthetic[];
    if (exists) {
      nextStyles = this.profile.preferredStyles.filter((s) => s !== style);
    } else {
      nextStyles = [...this.profile.preferredStyles, style];
    }
    this.updateProfile({ preferredStyles: nextStyles });
  }

  public toggleCollection(season: SeasonCategory) {
    const exists = this.profile.preferredCollections.includes(season);
    let nextCols: SeasonCategory[];
    if (exists) {
      nextCols = this.profile.preferredCollections.filter((s) => s !== season);
    } else {
      nextCols = [...this.profile.preferredCollections, season];
    }
    this.updateProfile({ preferredCollections: nextCols });
  }

  public setFit(fit: FitSilhouettePreference) {
    this.updateProfile({ preferredFit: fit });
  }

  public setTolerance(tolerance: FitEaseTolerance) {
    this.updateProfile({ fitEaseTolerance: tolerance });
  }

  public setPriceRange(minPrice: number, maxPrice: number) {
    this.updateProfile({
      priceRange: {
        ...this.profile.priceRange,
        minPrice,
        maxPrice,
      },
    });
  }

  public updateMarketing(updates: Partial<MarketingPersonalizationPreferences>) {
    this.updateProfile({
      marketing: {
        ...this.profile.marketing,
        ...updates,
      },
    });
  }

  public async resetToDefault() {
    this.isLoading = true;
    this.notify();
    try {
      const reset = await customerPreferencesApi.resetPreferences(this.profile.customerId);
      this.profile = reset;
      const recs = await customerPreferencesApi.getRecommendations(reset.customerId);
      this.productRecommendations = recs.products;
      this.collectionRecommendations = recs.collections;
      this.marketingBlueprint = recs.marketingBlueprint;
    } finally {
      this.isLoading = false;
      this.notify();
    }
  }
}

export const customerPreferenceStoreManager = new CustomerPreferenceStoreManager();

export function useCustomerPreferenceStore() {
  const [state, setState] = useState(() => customerPreferenceStoreManager.getState());

  useEffect(() => {
    return customerPreferenceStoreManager.subscribe(() => {
      setState(customerPreferenceStoreManager.getState());
    });
  }, []);

  const refresh = useCallback((cId?: string) => customerPreferenceStoreManager.refresh(cId), []);
  const updateProfile = useCallback((u: Partial<CustomerPreferenceProfile>) => customerPreferenceStoreManager.updateProfile(u), []);
  const toggleColor = useCallback((c: PreferredColor) => customerPreferenceStoreManager.toggleColor(c), []);
  const toggleFabric = useCallback((f: PreferredFabric) => customerPreferenceStoreManager.toggleFabric(f), []);
  const toggleStyle = useCallback((s: WardrobeStyleAesthetic) => customerPreferenceStoreManager.toggleStyle(s), []);
  const toggleCollection = useCallback((s: SeasonCategory) => customerPreferenceStoreManager.toggleCollection(s), []);
  const setFit = useCallback((f: FitSilhouettePreference) => customerPreferenceStoreManager.setFit(f), []);
  const setTolerance = useCallback((t: FitEaseTolerance) => customerPreferenceStoreManager.setTolerance(t), []);
  const setPriceRange = useCallback((min: number, max: number) => customerPreferenceStoreManager.setPriceRange(min, max), []);
  const updateMarketing = useCallback((u: Partial<MarketingPersonalizationPreferences>) => customerPreferenceStoreManager.updateMarketing(u), []);
  const resetToDefault = useCallback(() => customerPreferenceStoreManager.resetToDefault(), []);

  return {
    ...state,
    refresh,
    updateProfile,
    toggleColor,
    toggleFabric,
    toggleStyle,
    toggleCollection,
    setFit,
    setTolerance,
    setPriceRange,
    updateMarketing,
    resetToDefault,
  };
}
