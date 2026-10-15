/**
 * @file designApprovalStore.ts
 * Enterprise Reactive State Store for Daniel’s Maison Design Approval Workflow.
 * Manages customer reviews, version comparisons, revision petitions, approval logs,
 * and atelier workshop handover.
 */

import { useState, useEffect, useCallback } from 'react';
import {
  DesignApprovalPackage,
  DesignApprovalWorkflowStage,
  SubmitRevisionPayload,
  ApproveDesignPayload,
  RejectDesignPayload,
  UpdateDesignVersionPayload,
} from '../types/designApproval.types';
import { designApprovalApi } from '../services/designApprovalApi';

class DesignApprovalStoreManager {
  private packages: DesignApprovalPackage[] = [];
  private activePackageId: string | null = null;
  private stageFilter: DesignApprovalWorkflowStage | 'ALL' = 'ALL';
  private searchQuery: string = '';
  private selectedVersionNumber: string | null = null;
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
    return {
      packages: this.packages,
      filteredPackages: this.getFilteredPackages(),
      activePackage: this.getActivePackage(),
      stageFilter: this.stageFilter,
      searchQuery: this.searchQuery,
      selectedVersionNumber: this.selectedVersionNumber,
      isLoading: this.isLoading,
      error: this.error,
      countsByStage: this.getCountsByStage(),
    };
  }

  public getActivePackage(): DesignApprovalPackage | null {
    if (!this.activePackageId) return this.packages[0] || null;
    return this.packages.find((p) => p.id === this.activePackageId) || this.packages[0] || null;
  }

  public getFilteredPackages(): DesignApprovalPackage[] {
    let list = [...this.packages];

    if (this.stageFilter !== 'ALL') {
      list = list.filter((p) => p.currentStage === this.stageFilter);
    }

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.garmentName.toLowerCase().includes(q) ||
          p.orderNumber.toLowerCase().includes(q) ||
          p.customerName.toLowerCase().includes(q) ||
          p.leadDesigner.toLowerCase().includes(q)
      );
    }

    return list;
  }

  public getCountsByStage(): Record<DesignApprovalWorkflowStage, number> {
    const counts: Record<DesignApprovalWorkflowStage, number> = {
      DRAFT: 0,
      SUBMITTED: 0,
      REVISION_REQUESTED: 0,
      UPDATED: 0,
      APPROVED: 0,
      PRODUCTION: 0,
      REJECTED: 0,
    };

    this.packages.forEach((p) => {
      if (counts[p.currentStage] !== undefined) {
        counts[p.currentStage]++;
      }
    });

    return counts;
  }

  public async refresh() {
    this.isLoading = true;
    this.error = null;
    this.notify();

    try {
      const res = await designApprovalApi.getPackages();
      this.packages = res.packages;
      if (!this.activePackageId && this.packages.length > 0) {
        this.activePackageId = this.packages[0].id;
      }
    } catch (err: unknown) {
      this.error = err instanceof Error ? err.message : 'Failed to load design packages';
    } finally {
      this.isLoading = false;
      this.notify();
    }
  }

  public setActivePackageId(id: string | null) {
    this.activePackageId = id;
    this.selectedVersionNumber = null;
    this.notify();
  }

  public setStageFilter(filter: DesignApprovalWorkflowStage | 'ALL') {
    this.stageFilter = filter;
    this.notify();
  }

  public setSearchQuery(query: string) {
    this.searchQuery = query;
    this.notify();
  }

  public setSelectedVersionNumber(version: string | null) {
    this.selectedVersionNumber = version;
    this.notify();
  }

  public async submitDraft(packageId: string, designerName: string = 'Daniel’s Maison') {
    this.isLoading = true;
    this.notify();
    try {
      const updated = await designApprovalApi.submitDraftToCustomer(packageId, designerName);
      this.replacePackageInList(updated);
      return updated;
    } finally {
      this.isLoading = false;
      this.notify();
    }
  }

  public async submitRevision(payload: SubmitRevisionPayload) {
    this.isLoading = true;
    this.notify();
    try {
      const updated = await designApprovalApi.submitRevisionRequest(payload);
      this.replacePackageInList(updated);
      return updated;
    } finally {
      this.isLoading = false;
      this.notify();
    }
  }

  public async updateVersion(payload: UpdateDesignVersionPayload) {
    this.isLoading = true;
    this.notify();
    try {
      const updated = await designApprovalApi.updateDesignVersion(payload);
      this.replacePackageInList(updated);
      return updated;
    } finally {
      this.isLoading = false;
      this.notify();
    }
  }

  public async approveDesign(payload: ApproveDesignPayload) {
    this.isLoading = true;
    this.notify();
    try {
      const updated = await designApprovalApi.approveDesignPackage(payload);
      this.replacePackageInList(updated);
      return updated;
    } finally {
      this.isLoading = false;
      this.notify();
    }
  }

  public async rejectDesign(payload: RejectDesignPayload) {
    this.isLoading = true;
    this.notify();
    try {
      const updated = await designApprovalApi.rejectDesignPackage(payload);
      this.replacePackageInList(updated);
      return updated;
    } finally {
      this.isLoading = false;
      this.notify();
    }
  }

  public async releaseToProduction(packageId: string, releasedBy: string = 'Daniel’s Maison') {
    this.isLoading = true;
    this.notify();
    try {
      const updated = await designApprovalApi.releaseToProduction(packageId, releasedBy);
      this.replacePackageInList(updated);
      return updated;
    } finally {
      this.isLoading = false;
      this.notify();
    }
  }

  public async resetToDefaultMock() {
    this.isLoading = true;
    this.notify();
    try {
      const fresh = await designApprovalApi.resetMockData();
      this.packages = fresh;
      this.activePackageId = fresh[0]?.id || null;
      this.selectedVersionNumber = null;
    } finally {
      this.isLoading = false;
      this.notify();
    }
  }

  private replacePackageInList(updated: DesignApprovalPackage) {
    const idx = this.packages.findIndex((p) => p.id === updated.id);
    if (idx >= 0) {
      this.packages[idx] = updated;
    } else {
      this.packages.unshift(updated);
    }
    if (this.activePackageId === updated.id) {
      this.activePackageId = updated.id;
    }
  }
}

export const designApprovalStoreManager = new DesignApprovalStoreManager();

/**
 * Custom React Hook to consume the Design Approval Store
 */
export function useDesignApprovalStore() {
  const [state, setState] = useState(() => designApprovalStoreManager.getState());

  useEffect(() => {
    return designApprovalStoreManager.subscribe(() => {
      setState(designApprovalStoreManager.getState());
    });
  }, []);

  const refresh = useCallback(() => designApprovalStoreManager.refresh(), []);
  const setActivePackageId = useCallback((id: string | null) => designApprovalStoreManager.setActivePackageId(id), []);
  const setStageFilter = useCallback((f: DesignApprovalWorkflowStage | 'ALL') => designApprovalStoreManager.setStageFilter(f), []);
  const setSearchQuery = useCallback((q: string) => designApprovalStoreManager.setSearchQuery(q), []);
  const setSelectedVersionNumber = useCallback((v: string | null) => designApprovalStoreManager.setSelectedVersionNumber(v), []);
  const submitDraft = useCallback((pkgId: string, desName?: string) => designApprovalStoreManager.submitDraft(pkgId, desName), []);
  const submitRevision = useCallback((payload: SubmitRevisionPayload) => designApprovalStoreManager.submitRevision(payload), []);
  const updateVersion = useCallback((payload: UpdateDesignVersionPayload) => designApprovalStoreManager.updateVersion(payload), []);
  const approveDesign = useCallback((payload: ApproveDesignPayload) => designApprovalStoreManager.approveDesign(payload), []);
  const rejectDesign = useCallback((payload: RejectDesignPayload) => designApprovalStoreManager.rejectDesign(payload), []);
  const releaseToProduction = useCallback((pkgId: string, by?: string) => designApprovalStoreManager.releaseToProduction(pkgId, by), []);
  const resetToDefaultMock = useCallback(() => designApprovalStoreManager.resetToDefaultMock(), []);

  return {
    ...state,
    refresh,
    setActivePackageId,
    setStageFilter,
    setSearchQuery,
    setSelectedVersionNumber,
    submitDraft,
    submitRevision,
    updateVersion,
    approveDesign,
    rejectDesign,
    releaseToProduction,
    resetToDefaultMock,
  };
}
