/**
 * @file wardrobeStore.ts
 * Enterprise Reactive State Store for Daniel’s Maison Digital Wardrobe Management System.
 * Powers Customer Wardrobe Portal & Designer Service Dashboard with real-time updates.
 */

import { useState, useEffect } from 'react';
import {
  WardrobeItemFull,
  WardrobeServiceRequest,
  WardrobeCategory,
  GarmentStatus,
  ServiceRequestStatus,
  WardrobeSummaryMetrics,
  AlterationHistoryRecord,
} from '../types/wardrobe.types';
import { WardrobeApiService } from '../services/wardrobeApi';
import { INITIAL_MOCK_WARDROBE_ITEMS, INITIAL_MOCK_SERVICE_REQUESTS } from '../mock/wardrobeMockData';

class WardrobeStore {
  private items: WardrobeItemFull[] = [...INITIAL_MOCK_WARDROBE_ITEMS];
  private serviceRequests: WardrobeServiceRequest[] = [...INITIAL_MOCK_SERVICE_REQUESTS];

  // UI state
  private selectedCategory: WardrobeCategory | 'ALL' = 'ALL';
  private selectedStatus: GarmentStatus | 'ALL' = 'ALL';
  private searchQuery = '';
  private selectedItemId: string | null = INITIAL_MOCK_WARDROBE_ITEMS[0]?.id || null;
  private inspectingServiceId: string | null = INITIAL_MOCK_SERVICE_REQUESTS[0]?.id || null;

  private listeners: Set<() => void> = new Set();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const storedItems = localStorage.getItem('daniels_wardrobe_items_v1');
      if (storedItems) this.items = JSON.parse(storedItems);

      const storedRequests = localStorage.getItem('daniels_wardrobe_requests_v1');
      if (storedRequests) this.serviceRequests = JSON.parse(storedRequests);
    } catch {
      // ignore
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem('daniels_wardrobe_items_v1', JSON.stringify(this.items));
      localStorage.setItem('daniels_wardrobe_requests_v1', JSON.stringify(this.serviceRequests));
    } catch {
      // ignore
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.saveToStorage();
    this.listeners.forEach((fn) => fn());
  }

  // Getters
  public getItems(): WardrobeItemFull[] {
    return this.items;
  }

  public getServiceRequests(): WardrobeServiceRequest[] {
    return this.serviceRequests;
  }

  public getSelectedItemId(): string | null {
    return this.selectedItemId;
  }

  public getSelectedItem(): WardrobeItemFull | null {
    if (!this.selectedItemId) return this.items[0] || null;
    return this.items.find((i) => i.id === this.selectedItemId) || this.items[0] || null;
  }

  public getInspectingServiceRequest(): WardrobeServiceRequest | null {
    if (!this.inspectingServiceId) return null;
    return this.serviceRequests.find((s) => s.id === this.inspectingServiceId) || null;
  }

  public getFilters() {
    return {
      category: this.selectedCategory,
      status: this.selectedStatus,
      search: this.searchQuery,
    };
  }

  public setFilters(category: WardrobeCategory | 'ALL', status: GarmentStatus | 'ALL', search: string) {
    this.selectedCategory = category;
    this.selectedStatus = status;
    this.searchQuery = search;
    this.notify();
  }

  public setSelectedItemId(id: string | null) {
    this.selectedItemId = id;
    this.notify();
  }

  public setInspectingServiceId(id: string | null) {
    this.inspectingServiceId = id;
    this.notify();
  }

  public getFilteredItems(): WardrobeItemFull[] {
    return this.items.filter((item) => {
      if (this.selectedCategory !== 'ALL' && item.category !== this.selectedCategory) {
        return false;
      }
      if (this.selectedStatus !== 'ALL' && item.status !== this.selectedStatus) {
        return false;
      }
      if (this.searchQuery.trim()) {
        const q = this.searchQuery.toLowerCase();
        const matchesName = item.garmentName.toLowerCase().includes(q);
        const matchesOrder = item.originalOrderId.toLowerCase().includes(q);
        const matchesFabric = item.material.fabricName.toLowerCase().includes(q);
        const matchesMill = item.material.fabricMillName.toLowerCase().includes(q);
        const matchesColor = item.color.primaryColorName.toLowerCase().includes(q);
        const matchesTailor = item.masterTailorName.toLowerCase().includes(q);
        if (!matchesName && !matchesOrder && !matchesFabric && !matchesMill && !matchesColor && !matchesTailor) {
          return false;
        }
      }
      return true;
    });
  }

  public getMetrics(): WardrobeSummaryMetrics {
    const totalValuationGbp = this.items.reduce((acc, curr) => acc + curr.originalPriceGbp, 0);
    const garmentsInAtelier = this.items.filter((i) => i.status !== 'IN_WARDROBE').length;
    const activeWarrantiesCount = this.items.filter((i) => i.warranty?.isActive).length;
    const completedAlterationsLifetime = this.items.reduce(
      (acc, curr) => acc + curr.alterations.length,
      0
    );

    const categoryCounts: Record<WardrobeCategory, number> = {
      SUITS: this.items.filter((i) => i.category === 'SUITS').length,
      SHIRTS: this.items.filter((i) => i.category === 'SHIRTS').length,
      COATS: this.items.filter((i) => i.category === 'COATS').length,
      DRESSES: this.items.filter((i) => i.category === 'DRESSES').length,
      ACCESSORIES: this.items.filter((i) => i.category === 'ACCESSORIES').length,
    };

    return {
      totalGarments: this.items.length,
      totalValuationGbp,
      garmentsInAtelier,
      activeWarrantiesCount,
      completedAlterationsLifetime,
      categoryCounts,
    };
  }

  // Action Methods
  public async reorderGarment(
    itemId: string,
    options: {
      customFabricChoice?: string;
      repeatMeasurementsConfirmed: boolean;
      additionalLiningMonogram?: string;
      conciergeNotes?: string;
    }
  ) {
    const res = await WardrobeApiService.reorderGarment(itemId, options);
    const updatedRequests = await WardrobeApiService.getServiceRequests();
    this.serviceRequests = updatedRequests;
    this.notify();
    return res;
  }

  public async submitServiceRequest(payload: {
    wardrobeItemId: string;
    actionType:
      | 'REQUEST_ALTERATION'
      | 'REQUEST_REPAIR'
      | 'REQUEST_CARE_SERVICE'
      | 'REQUEST_CLEANING_SERVICE'
      | 'REQUEST_RECREATION_MEASUREMENTS';
    specificInstructions: string;
    conciergePickupRequested: boolean;
    pickupAddress: string;
    preferredFittingSalon: string;
    urgencyLevel: 'STANDARD' | 'EXPEDITED' | 'ROYAL_SALON';
    alterationOptions?: any;
    repairOptions?: any;
    recreationOptions?: any;
  }) {
    const target = this.items.find((i) => i.id === payload.wardrobeItemId);
    if (!target) throw new Error('Garment not found');

    const created = await WardrobeApiService.submitServiceRequest({
      wardrobeItemId: target.id,
      garmentName: target.garmentName,
      category: target.category,
      customerId: target.customerId,
      customerName: target.customerName,
      actionType: payload.actionType,
      urgencyLevel: payload.urgencyLevel,
      specificInstructions: payload.specificInstructions,
      conciergePickupRequested: payload.conciergePickupRequested,
      pickupAddress: payload.pickupAddress,
      preferredFittingSalon: payload.preferredFittingSalon,
      estimatedCostGbp: 0.0, // Lifetime privilege
      assignedArtisanName: target.masterTailorName,
      alterationOptions: payload.alterationOptions,
      repairOptions: payload.repairOptions,
      recreationOptions: payload.recreationOptions,
    });

    // Refresh items and requests
    this.items = await WardrobeApiService.getWardrobe();
    this.serviceRequests = await WardrobeApiService.getServiceRequests();
    this.inspectingServiceId = created.id;
    this.notify();
    return created;
  }

  public async updateServiceStatus(
    serviceId: string,
    newStatus: ServiceRequestStatus,
    notes: string,
    tailorName: string
  ) {
    const updated = await WardrobeApiService.updateServiceStatus(
      serviceId,
      newStatus,
      notes,
      tailorName
    );
    this.items = await WardrobeApiService.getWardrobe();
    this.serviceRequests = await WardrobeApiService.getServiceRequests();
    this.notify();
    return updated;
  }

  public async recordAlteration(
    itemId: string,
    record: Omit<AlterationHistoryRecord, 'id' | 'alterationDate'>
  ) {
    const created = await WardrobeApiService.recordAlteration(itemId, record);
    this.items = await WardrobeApiService.getWardrobe();
    this.notify();
    return created;
  }

  public exportWardrobeInventoryCsv() {
    const rows = [
      [
        'Garment ID',
        'Garment Name',
        'Category',
        'Original Order',
        'Status',
        'Acquired Date',
        'Original Price GBP',
        'Fabric Mill',
        'Fabric Name',
        'Composition',
        'Color',
        'Tailor',
        'Warranty Certificate',
      ],
      ...this.items.map((i) => [
        i.id,
        `"${i.garmentName.replace(/"/g, '""')}"`,
        i.category,
        i.originalOrderId,
        i.status,
        i.acquiredDate.slice(0, 10),
        i.originalPriceGbp.toString(),
        `"${i.material.fabricMillName.replace(/"/g, '""')}"`,
        `"${i.material.fabricName.replace(/"/g, '""')}"`,
        `"${i.material.composition.replace(/"/g, '""')}"`,
        `"${i.color.primaryColorName.replace(/"/g, '""')}"`,
        `"${i.masterTailorName.replace(/"/g, '""')}"`,
        i.warranty?.certificateSerialNumber || 'N/A',
      ]),
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `maison_daniels_wardrobe_archive_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export const wardrobeStore = new WardrobeStore();

export function useWardrobeStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    return wardrobeStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  return {
    items: wardrobeStore.getItems(),
    serviceRequests: wardrobeStore.getServiceRequests(),
    selectedItem: wardrobeStore.getSelectedItem(),
    selectedItemId: wardrobeStore.getSelectedItemId(),
    setSelectedItemId: (id: string | null) => wardrobeStore.setSelectedItemId(id),
    inspectingServiceRequest: wardrobeStore.getInspectingServiceRequest(),
    setInspectingServiceId: (id: string | null) => wardrobeStore.setInspectingServiceId(id),

    filters: wardrobeStore.getFilters(),
    setFilters: (c: WardrobeCategory | 'ALL', s: GarmentStatus | 'ALL', q: string) =>
      wardrobeStore.setFilters(c, s, q),

    filteredItems: wardrobeStore.getFilteredItems(),
    metrics: wardrobeStore.getMetrics(),

    // Actions
    reorderGarment: (id: string, opts: any) => wardrobeStore.reorderGarment(id, opts),
    submitServiceRequest: (p: any) => wardrobeStore.submitServiceRequest(p),
    updateServiceStatus: (sid: string, st: ServiceRequestStatus, notes: string, t: string) =>
      wardrobeStore.updateServiceStatus(sid, st, notes, t),
    recordAlteration: (id: string, rec: any) => wardrobeStore.recordAlteration(id, rec),
    exportWardrobeInventoryCsv: () => wardrobeStore.exportWardrobeInventoryCsv(),
  };
}
