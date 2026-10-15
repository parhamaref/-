/**
 * @file alterationStore.ts
 * Enterprise Reactive State Store for Daniel’s Maison Alteration & Tailoring Request Module.
 * Manages customer alteration submissions, photo pin-pointing, 6-stage lifecycle transitions,
 * and Master Tailor review workbench.
 */

import { useState, useEffect } from 'react';
import {
  AlterationRequest,
  AlterationWorkflowStage,
  AlterationPhoto,
  DesiredFitChange,
  FitRegion,
  FitAdjustmentDirection,
  FittingPinCoordinate,
} from '../types/alteration.types';
import { INITIAL_MOCK_ALTERATION_REQUESTS } from '../mock/alterationMockData';
import { AlterationApiService } from '../services/alterationApi';

class AlterationStore {
  private requests: AlterationRequest[] = [...INITIAL_MOCK_ALTERATION_REQUESTS];
  private selectedRequestId: string | null = INITIAL_MOCK_ALTERATION_REQUESTS[0]?.id || null;
  private stageFilter: AlterationWorkflowStage | 'ALL' = 'ALL';
  private searchQuery = '';
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem('daniels_alterations_v1');
      if (stored) {
        this.requests = JSON.parse(stored);
      }
    } catch {
      // ignore
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem('daniels_alterations_v1', JSON.stringify(this.requests));
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
  public getRequests(): AlterationRequest[] {
    return this.requests;
  }

  public getSelectedRequestId(): string | null {
    return this.selectedRequestId;
  }

  public getSelectedRequest(): AlterationRequest | null {
    if (!this.selectedRequestId) return this.requests[0] || null;
    return this.requests.find((r) => r.id === this.selectedRequestId) || this.requests[0] || null;
  }

  public getStageFilter(): AlterationWorkflowStage | 'ALL' {
    return this.stageFilter;
  }

  public getSearchQuery(): string {
    return this.searchQuery;
  }

  public setStageFilter(stage: AlterationWorkflowStage | 'ALL') {
    this.stageFilter = stage;
    this.notify();
  }

  public setSearchQuery(query: string) {
    this.searchQuery = query;
    this.notify();
  }

  public setSelectedRequestId(id: string | null) {
    this.selectedRequestId = id;
    this.notify();
  }

  public getFilteredRequests(): AlterationRequest[] {
    return this.requests.filter((r) => {
      if (this.stageFilter !== 'ALL' && r.currentStage !== this.stageFilter) return false;
      if (this.searchQuery.trim()) {
        const q = this.searchQuery.toLowerCase();
        const matchGarment = r.garmentName.toLowerCase().includes(q);
        const matchCustomer = r.customerName.toLowerCase().includes(q);
        const matchSerial = r.garmentSerial.toLowerCase().includes(q);
        const matchNotes = r.alterationNotes.toLowerCase().includes(q);
        const matchId = r.id.toLowerCase().includes(q);
        if (!matchGarment && !matchCustomer && !matchSerial && !matchNotes && !matchId) return false;
      }
      return true;
    });
  }

  public getCountsByStage(): Record<AlterationWorkflowStage, number> {
    const counts: Record<AlterationWorkflowStage, number> = {
      SUBMITTED: 0,
      REVIEWED: 0,
      APPROVED: 0,
      IN_ALTERATION: 0,
      COMPLETED: 0,
      RETURNED: 0,
    };
    this.requests.forEach((r) => {
      if (counts[r.currentStage] !== undefined) {
        counts[r.currentStage]++;
      }
    });
    return counts;
  }

  // Actions
  public async submitNewRequest(payload: Parameters<typeof AlterationApiService.submitAlterationRequest>[0]): Promise<AlterationRequest> {
    const created = await AlterationApiService.submitAlterationRequest(payload);
    this.requests = [created, ...this.requests];
    this.selectedRequestId = created.id;
    this.notify();
    return created;
  }

  public async updateStage(
    requestId: string,
    nextStage: AlterationWorkflowStage,
    notes?: string,
    actorName?: string,
    actorRole?: any,
    afterPhotoUrl?: string
  ): Promise<AlterationRequest> {
    const updated = await AlterationApiService.updateWorkflowStage(
      requestId,
      nextStage,
      notes,
      actorName,
      actorRole,
      afterPhotoUrl
    );

    this.requests = this.requests.map((r) => (r.id === requestId ? updated : r));
    this.notify();
    return updated;
  }

  /**
   * Advance to next stage in the 6-stage workflow
   */
  public async advanceStage(requestId: string, notes?: string, afterPhotoUrl?: string): Promise<AlterationRequest> {
    const target = this.requests.find((r) => r.id === requestId);
    if (!target) throw new Error('Request not found');

    const sequence: AlterationWorkflowStage[] = [
      'SUBMITTED',
      'REVIEWED',
      'APPROVED',
      'IN_ALTERATION',
      'COMPLETED',
      'RETURNED',
    ];

    const curIndex = sequence.indexOf(target.currentStage);
    if (curIndex >= sequence.length - 1) {
      return target; // already at last stage
    }

    const nextStage = sequence[curIndex + 1];
    return this.updateStage(requestId, nextStage, notes, 'Master Tailor Henri Laurent', 'MASTER_TAILOR', afterPhotoUrl);
  }

  /**
   * Rewind or reset stage (useful for testing or rejecting back to review)
   */
  public async rewindStage(requestId: string): Promise<AlterationRequest> {
    const target = this.requests.find((r) => r.id === requestId);
    if (!target) throw new Error('Request not found');

    const sequence: AlterationWorkflowStage[] = [
      'SUBMITTED',
      'REVIEWED',
      'APPROVED',
      'IN_ALTERATION',
      'COMPLETED',
      'RETURNED',
    ];

    const curIndex = sequence.indexOf(target.currentStage);
    if (curIndex <= 0) return target;

    const prevStage = sequence[curIndex - 1];
    return this.updateStage(requestId, prevStage, 'Stage reverted for atelier revision', 'Chief Inspector', 'MASTER_TAILOR');
  }

  public async addFittingPin(
    requestId: string,
    photoId: string,
    pin: Omit<FittingPinCoordinate, 'id'>
  ): Promise<void> {
    const target = this.requests.find((r) => r.id === requestId);
    if (!target) return;

    const photo = target.photos.find((p) => p.id === photoId);
    if (!photo) return;

    const newPin: FittingPinCoordinate = {
      ...pin,
      id: `pin_${Date.now()}`,
    };

    photo.pinCoordinates = [...(photo.pinCoordinates || []), newPin];
    this.notify();
  }

  public resetToDefaultMock() {
    this.requests = [...INITIAL_MOCK_ALTERATION_REQUESTS];
    this.selectedRequestId = INITIAL_MOCK_ALTERATION_REQUESTS[0]?.id || null;
    this.saveToStorage();
    this.notify();
  }
}

export const alterationStoreInstance = new AlterationStore();

export function useAlterationStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    return alterationStoreInstance.subscribe(() => {
      setTick((t) => t + 1);
    });
  }, []);

  return {
    requests: alterationStoreInstance.getRequests(),
    filteredRequests: alterationStoreInstance.getFilteredRequests(),
    selectedRequest: alterationStoreInstance.getSelectedRequest(),
    selectedRequestId: alterationStoreInstance.getSelectedRequestId(),
    stageFilter: alterationStoreInstance.getStageFilter(),
    searchQuery: alterationStoreInstance.getSearchQuery(),
    countsByStage: alterationStoreInstance.getCountsByStage(),
    setStageFilter: (s: AlterationWorkflowStage | 'ALL') => alterationStoreInstance.setStageFilter(s),
    setSearchQuery: (q: string) => alterationStoreInstance.setSearchQuery(q),
    setSelectedRequestId: (id: string | null) => alterationStoreInstance.setSelectedRequestId(id),
    submitNewRequest: (payload: any) => alterationStoreInstance.submitNewRequest(payload),
    updateStage: (
      id: string,
      stage: AlterationWorkflowStage,
      notes?: string,
      actor?: string,
      role?: any,
      afterPhoto?: string
    ) => alterationStoreInstance.updateStage(id, stage, notes, actor, role, afterPhoto),
    advanceStage: (id: string, notes?: string, afterPhoto?: string) =>
      alterationStoreInstance.advanceStage(id, notes, afterPhoto),
    rewindStage: (id: string) => alterationStoreInstance.rewindStage(id),
    addFittingPin: (reqId: string, photoId: string, pin: any) =>
      alterationStoreInstance.addFittingPin(reqId, photoId, pin),
    resetToDefaultMock: () => alterationStoreInstance.resetToDefaultMock(),
  };
}
