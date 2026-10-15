/**
 * @file designerVerificationStore.ts
 * Enterprise Reactive State Store for Daniel’s Maison Designer Verification System.
 * Zero-external-dependency reactive manager with hook subscribers.
 */

import { useState, useEffect, useCallback } from 'react';
import {
  DesignerVerificationApplication,
  VerificationStatus,
  PillarStatus,
} from '../types/designerVerification.types';
import { designerVerificationApi } from '../services/designerVerificationApi';

class DesignerVerificationStoreManager {
  private applications: DesignerVerificationApplication[] = [];
  private selectedApplicationId: string = 'app-verified-001';
  private activePerspective: 'designer' | 'reviewer' = 'designer';
  private statusFilter: VerificationStatus | 'All' = 'All';
  private searchQuery: string = '';
  private isLoading: boolean = false;
  private error: string | null = null;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.loadApplications();
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
    const active = this.getActiveApplication();
    const filtered = this.getFilteredApplications();

    return {
      applications: this.applications,
      selectedApplicationId: this.selectedApplicationId,
      activePerspective: this.activePerspective,
      statusFilter: this.statusFilter,
      searchQuery: this.searchQuery,
      isLoading: this.isLoading,
      error: this.error,
      activeApplication: active,
      filteredApplications: filtered,
    };
  }

  public getActiveApplication(): DesignerVerificationApplication | undefined {
    return this.applications.find((app) => app.id === this.selectedApplicationId) || this.applications[0];
  }

  public getFilteredApplications(): DesignerVerificationApplication[] {
    return this.applications.filter((app) => {
      const matchesStatus = this.statusFilter === 'All' || app.status === this.statusFilter;
      const q = this.searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        app.designerName.toLowerCase().includes(q) ||
        app.brandName.toLowerCase().includes(q) ||
        app.id.toLowerCase().includes(q) ||
        app.business.registeredCountry.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }

  public async loadApplications(): Promise<void> {
    this.isLoading = true;
    this.error = null;
    this.notify();
    try {
      const apps = await designerVerificationApi.getAllApplications();
      this.applications = apps;
      if (!this.selectedApplicationId && apps.length > 0) {
        this.selectedApplicationId = apps[0].id;
      }
    } catch (err: any) {
      this.error = err?.message || 'Failed to load applications';
    } finally {
      this.isLoading = false;
      this.notify();
    }
  }

  public selectApplication(id: string): void {
    this.selectedApplicationId = id;
    this.notify();
  }

  public setPerspective(perspective: 'designer' | 'reviewer'): void {
    this.activePerspective = perspective;
    this.notify();
  }

  public setStatusFilter(filter: VerificationStatus | 'All'): void {
    this.statusFilter = filter;
    this.notify();
  }

  public setSearchQuery(query: string): void {
    this.searchQuery = query;
    this.notify();
  }

  public async submitNewApplication(
    data: Omit<DesignerVerificationApplication, 'id' | 'submittedAt' | 'updatedAt' | 'auditTrail'>
  ): Promise<void> {
    this.isLoading = true;
    this.notify();
    try {
      const created = await designerVerificationApi.submitApplication(data);
      this.applications = await designerVerificationApi.getAllApplications();
      this.selectedApplicationId = created.id;
    } catch (err: any) {
      this.error = err?.message || 'Failed to submit application';
    } finally {
      this.isLoading = false;
      this.notify();
    }
  }

  public async claimReview(id: string, reviewerName = 'Julian Sterling (Standards Auditor)'): Promise<void> {
    this.isLoading = true;
    this.notify();
    try {
      const updated = await designerVerificationApi.claimReview(id, reviewerName);
      this.applications = this.applications.map((a) => (a.id === updated.id ? updated : a));
    } catch (err: any) {
      this.error = err?.message || 'Failed to claim review';
    } finally {
      this.isLoading = false;
      this.notify();
    }
  }

  public async requestMoreInformation(
    id: string,
    reviewerName: string,
    notes: string,
    deadlineDays: number,
    items: { field: string; requirement: string }[]
  ): Promise<void> {
    this.isLoading = true;
    this.notify();
    try {
      const updated = await designerVerificationApi.requestMoreInformation(id, reviewerName, notes, deadlineDays, items);
      this.applications = this.applications.map((a) => (a.id === updated.id ? updated : a));
    } catch (err: any) {
      this.error = err?.message || 'Failed to request information';
    } finally {
      this.isLoading = false;
      this.notify();
    }
  }

  public async respondToQuery(
    id: string,
    designerName: string,
    explanation: string,
    responses: { itemId: string; designerResponse: string; documentUrl?: string }[]
  ): Promise<void> {
    this.isLoading = true;
    this.notify();
    try {
      const updated = await designerVerificationApi.respondToQuery(id, designerName, explanation, responses);
      this.applications = this.applications.map((a) => (a.id === updated.id ? updated : a));
    } catch (err: any) {
      this.error = err?.message || 'Failed to respond to query';
    } finally {
      this.isLoading = false;
      this.notify();
    }
  }

  public async approveApplication(
    id: string,
    reviewerName: string,
    tier: 'Maison Accredited' | 'Master Craftsman' | 'Haute Couture Guild',
    comment?: string
  ): Promise<void> {
    this.isLoading = true;
    this.notify();
    try {
      const updated = await designerVerificationApi.approveApplication(id, reviewerName, tier, comment);
      this.applications = this.applications.map((a) => (a.id === updated.id ? updated : a));
    } catch (err: any) {
      this.error = err?.message || 'Failed to approve application';
    } finally {
      this.isLoading = false;
      this.notify();
    }
  }

  public async rejectApplication(
    id: string,
    reviewerName: string,
    reasonCode: 'INSUFFICIENT_PROOFS' | 'SANCTIONS_FLAG' | 'CRAFTSMANSHIP_MISMATCH' | 'DOCUMENT_EXPIRED' | 'UNRESOLVED_QUERY',
    reasonSummary: string
  ): Promise<void> {
    this.isLoading = true;
    this.notify();
    try {
      const updated = await designerVerificationApi.rejectApplication(id, reviewerName, reasonCode, reasonSummary);
      this.applications = this.applications.map((a) => (a.id === updated.id ? updated : a));
    } catch (err: any) {
      this.error = err?.message || 'Failed to reject application';
    } finally {
      this.isLoading = false;
      this.notify();
    }
  }

  public async updatePillarReview(
    id: string,
    pillar: 'identity' | 'business' | 'portfolio',
    status: PillarStatus,
    reviewerNotes: string
  ): Promise<void> {
    try {
      const updated = await designerVerificationApi.updatePillarReview(id, pillar, status, reviewerNotes);
      this.applications = this.applications.map((a) => (a.id === updated.id ? updated : a));
      this.notify();
    } catch (err: any) {
      this.error = err?.message || 'Failed to update pillar review';
      this.notify();
    }
  }

  public simulateStatus(targetStatus: VerificationStatus): void {
    const active = this.getActiveApplication();
    if (!active) return;
    const now = new Date().toISOString();

    const updated: DesignerVerificationApplication = {
      ...active,
      status: targetStatus,
      updatedAt: now,
      auditTrail: [
        {
          id: `aud-sim-${Date.now()}`,
          timestamp: now,
          actorName: 'System Simulation',
          actorRole: 'Standards Council',
          fromStatus: active.status,
          toStatus: targetStatus,
          comment: `Status switched to ${targetStatus} for demonstration and testing.`,
        },
        ...active.auditTrail,
      ],
    };

    if (targetStatus === 'Approved' && !updated.accreditationDetails) {
      updated.accreditationDetails = {
        sealNumber: `MD-SEAL-${new Date().getFullYear()}-099`,
        tier: 'Haute Couture Guild',
        approvedAt: now,
        approvedBy: 'Standards Council Board',
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      };
      updated.identity.status = 'verified';
      updated.business.status = 'verified';
      updated.portfolio.status = 'verified';
    }

    if (targetStatus === 'More Information Required' && !updated.activeQuery) {
      updated.activeQuery = {
        requestedAt: now,
        requestedBy: 'Standards Council Inspector',
        notes: 'Please submit updated commercial registry extract and atelier workshop occupancy certification.',
        deadlineDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        items: [
          {
            id: 'sim-q-1',
            field: 'Official Chamber of Commerce Registration',
            requirement: 'Original extract stamped within 60 days.',
            fulfilled: false,
          },
          {
            id: 'sim-q-2',
            field: 'Master Cutting Table / Workshop Photos',
            requirement: 'High resolution photos of in-house cutting bench and hand pressing gear.',
            fulfilled: false,
          },
        ],
      };
    }

    if (targetStatus === 'Rejected' && !updated.rejectionDetails) {
      updated.rejectionDetails = {
        rejectedAt: now,
        rejectedBy: 'Standards Council Inspector',
        reasonCode: 'CRAFTSMANSHIP_MISMATCH',
        reasonSummary: 'Atelier submitted outsourced factory production proofs which do not satisfy Daniel’s Maison bespoke tailoring requirements.',
        appealAllowed: true,
        reapplicationEligibleDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      };
    }

    this.applications = this.applications.map((a) => (a.id === updated.id ? updated : a));
    this.notify();
  }

  public async resetToDefaults(): Promise<void> {
    this.isLoading = true;
    this.notify();
    const apps = await designerVerificationApi.resetToDefaults();
    this.applications = apps;
    this.selectedApplicationId = apps[0]?.id ?? '';
    this.isLoading = false;
    this.notify();
  }
}

export const designerVerificationStoreManager = new DesignerVerificationStoreManager();

export function useDesignerVerificationStore() {
  const [state, setState] = useState(() => designerVerificationStoreManager.getState());

  useEffect(() => {
    return designerVerificationStoreManager.subscribe(() => {
      setState(designerVerificationStoreManager.getState());
    });
  }, []);

  const getActiveApplication = useCallback(() => designerVerificationStoreManager.getActiveApplication(), []);
  const getFilteredApplications = useCallback(() => designerVerificationStoreManager.getFilteredApplications(), []);
  const loadApplications = useCallback(() => designerVerificationStoreManager.loadApplications(), []);
  const selectApplication = useCallback((id: string) => designerVerificationStoreManager.selectApplication(id), []);
  const setPerspective = useCallback((p: 'designer' | 'reviewer') => designerVerificationStoreManager.setPerspective(p), []);
  const setStatusFilter = useCallback((f: VerificationStatus | 'All') => designerVerificationStoreManager.setStatusFilter(f), []);
  const setSearchQuery = useCallback((q: string) => designerVerificationStoreManager.setSearchQuery(q), []);
  const submitNewApplication = useCallback(
    (data: Omit<DesignerVerificationApplication, 'id' | 'submittedAt' | 'updatedAt' | 'auditTrail'>) =>
      designerVerificationStoreManager.submitNewApplication(data),
    []
  );
  const claimReview = useCallback((id: string, reviewerName?: string) => designerVerificationStoreManager.claimReview(id, reviewerName), []);
  const requestMoreInformation = useCallback(
    (id: string, reviewerName: string, notes: string, deadlineDays: number, items: { field: string; requirement: string }[]) =>
      designerVerificationStoreManager.requestMoreInformation(id, reviewerName, notes, deadlineDays, items),
    []
  );
  const respondToQuery = useCallback(
    (id: string, designerName: string, explanation: string, responses: { itemId: string; designerResponse: string; documentUrl?: string }[]) =>
      designerVerificationStoreManager.respondToQuery(id, designerName, explanation, responses),
    []
  );
  const approveApplication = useCallback(
    (id: string, reviewerName: string, tier: 'Maison Accredited' | 'Master Craftsman' | 'Haute Couture Guild', comment?: string) =>
      designerVerificationStoreManager.approveApplication(id, reviewerName, tier, comment),
    []
  );
  const rejectApplication = useCallback(
    (id: string, reviewerName: string, reasonCode: 'INSUFFICIENT_PROOFS' | 'SANCTIONS_FLAG' | 'CRAFTSMANSHIP_MISMATCH' | 'DOCUMENT_EXPIRED' | 'UNRESOLVED_QUERY', reasonSummary: string) =>
      designerVerificationStoreManager.rejectApplication(id, reviewerName, reasonCode, reasonSummary),
    []
  );
  const updatePillarReview = useCallback(
    (id: string, pillar: 'identity' | 'business' | 'portfolio', status: PillarStatus, reviewerNotes: string) =>
      designerVerificationStoreManager.updatePillarReview(id, pillar, status, reviewerNotes),
    []
  );
  const simulateStatus = useCallback((st: VerificationStatus) => designerVerificationStoreManager.simulateStatus(st), []);
  const resetToDefaults = useCallback(() => designerVerificationStoreManager.resetToDefaults(), []);

  return {
    ...state,
    getActiveApplication,
    getFilteredApplications,
    loadApplications,
    selectApplication,
    setPerspective,
    setStatusFilter,
    setSearchQuery,
    submitNewApplication,
    claimReview,
    requestMoreInformation,
    respondToQuery,
    approveApplication,
    rejectApplication,
    updatePillarReview,
    simulateStatus,
    resetToDefaults,
  };
}
