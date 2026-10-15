/**
 * @file qualityControlStore.ts
 * Enterprise Reactive State Store for Daniel’s Maison Advanced Quality Control System.
 * Zero-external-dependency reactive manager with hook subscribers.
 */

import { useState, useEffect, useCallback } from 'react';
import {
  QCInspectionSession,
  QCResult,
  QCDefect,
  QCCorrectiveAction,
  QCPhotoEvidence,
  QCNote,
  QCInspectionChecklistItem,
  QCGarmentMeasurement,
  QCFabricVerification,
  QCFinishInspection,
  QCPackagingInspection,
} from '../types/qualityControl.types';
import { QualityControlApiService } from '../services/qualityControlApi';

export type QCActiveTab =
  | 'checklist'
  | 'measurements'
  | 'fabric'
  | 'finish'
  | 'packaging'
  | 'defects'
  | 'photos'
  | 'notes'
  | 'analytics';

export interface QCStoreState {
  sessions: QCInspectionSession[];
  activeSessionId: string | null;
  activeTab: QCActiveTab;
  resultFilter: QCResult | 'ALL';
  searchQuery: string;
  selectedDefectId: string | null;
  selectedPhotoId: string | null;
  isLoading: boolean;
  isApprovalModalOpen: boolean;
  isNewSessionModalOpen: boolean;
  isLogDefectModalOpen: boolean;
  isAddPhotoModalOpen: boolean;
  notification: { message: string; type: 'success' | 'error' | 'info' } | null;
}

class QCStoreManager {
  private state: QCStoreState = {
    sessions: [],
    activeSessionId: null,
    activeTab: 'checklist',
    resultFilter: 'ALL',
    searchQuery: '',
    selectedDefectId: null,
    selectedPhotoId: null,
    isLoading: false,
    isApprovalModalOpen: false,
    isNewSessionModalOpen: false,
    isLogDefectModalOpen: false,
    isAddPhotoModalOpen: false,
    notification: null,
  };

  private listeners = new Set<(state: QCStoreState) => void>();

  constructor() {
    this.init();
  }

  private init() {
    const loaded = QualityControlApiService.getAllSessions();
    this.state.sessions = loaded;
    if (loaded.length > 0) {
      this.state.activeSessionId = loaded[0].id;
    }
  }

  public getState(): QCStoreState {
    return this.state;
  }

  public subscribe(listener: (state: QCStoreState) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private emit() {
    this.listeners.forEach((listener) => listener(this.state));
  }

  private setState(updater: Partial<QCStoreState> | ((prev: QCStoreState) => Partial<QCStoreState>)) {
    const next = typeof updater === 'function' ? updater(this.state) : updater;
    this.state = { ...this.state, ...next };
    this.emit();
  }

  // --- ACTIONS ---

  public setActiveSessionId(id: string) {
    this.setState({ activeSessionId: id });
  }

  public setActiveTab(tab: QCActiveTab) {
    this.setState({ activeTab: tab });
  }

  public setResultFilter(filter: QCResult | 'ALL') {
    this.setState({ resultFilter: filter });
  }

  public setSearchQuery(query: string) {
    this.setState({ searchQuery: query });
  }

  public setModalOpen(modal: 'approval' | 'newSession' | 'logDefect' | 'addPhoto', open: boolean) {
    if (modal === 'approval') this.setState({ isApprovalModalOpen: open });
    if (modal === 'newSession') this.setState({ isNewSessionModalOpen: open });
    if (modal === 'logDefect') this.setState({ isLogDefectModalOpen: open });
    if (modal === 'addPhoto') this.setState({ isAddPhotoModalOpen: open });
  }

  public setSelectedDefectId(id: string | null) {
    this.setState({ selectedDefectId: id });
  }

  public setSelectedPhotoId(id: string | null) {
    this.setState({ selectedPhotoId: id });
  }

  public showNotification(message: string, type: 'success' | 'error' | 'info' = 'success') {
    this.setState({ notification: { message, type } });
    setTimeout(() => {
      if (this.state.notification?.message === message) {
        this.setState({ notification: null });
      }
    }, 4500);
  }

  // Checklist Actions
  public updateChecklistItem(itemId: string, updates: Partial<QCInspectionChecklistItem>) {
    if (!this.state.activeSessionId) return;
    const updated = QualityControlApiService.updateChecklistItem(
      this.state.activeSessionId,
      itemId,
      updates
    );
    if (updated) {
      this.refreshSessions(updated);
    }
  }

  public addChecklistItem(item: Omit<QCInspectionChecklistItem, 'id'>) {
    if (!this.state.activeSessionId) return;
    const updated = QualityControlApiService.addChecklistItem(this.state.activeSessionId, item);
    if (updated) {
      this.refreshSessions(updated);
      this.showNotification('Custom inspection criterion added to checklist.');
    }
  }

  // Garment Measurements Actions
  public updateMeasurement(measId: string, actualMeasuredCm: number, notes?: string) {
    if (!this.state.activeSessionId) return;
    const updated = QualityControlApiService.updateMeasurement(
      this.state.activeSessionId,
      measId,
      actualMeasuredCm,
      notes
    );
    if (updated) {
      this.refreshSessions(updated);
    }
  }

  public addMeasurement(meas: Omit<QCGarmentMeasurement, 'id' | 'varianceMm' | 'status'>) {
    if (!this.state.activeSessionId) return;
    const updated = QualityControlApiService.addMeasurement(this.state.activeSessionId, meas);
    if (updated) {
      this.refreshSessions(updated);
      this.showNotification('Measurement specification point registered.');
    }
  }

  // Fabric Actions
  public updateFabric(updates: Partial<QCFabricVerification>) {
    if (!this.state.activeSessionId) return;
    const updated = QualityControlApiService.updateFabricVerification(
      this.state.activeSessionId,
      updates
    );
    if (updated) {
      this.refreshSessions(updated);
      this.showNotification('Fabric verification parameters updated.');
    }
  }

  // Finish Inspection Actions
  public updateFinish(updates: Partial<QCFinishInspection>) {
    if (!this.state.activeSessionId) return;
    const updated = QualityControlApiService.updateFinishInspection(
      this.state.activeSessionId,
      updates
    );
    if (updated) {
      this.refreshSessions(updated);
      this.showNotification('Finish inspection standards updated.');
    }
  }

  // Packaging Inspection Actions
  public updatePackaging(updates: Partial<QCPackagingInspection>) {
    if (!this.state.activeSessionId) return;
    const updated = QualityControlApiService.updatePackagingInspection(
      this.state.activeSessionId,
      updates
    );
    if (updated) {
      this.refreshSessions(updated);
      this.showNotification('Packaging verification points verified.');
    }
  }

  // Defect Logging & Actions
  public logDefect(
    defect: Omit<QCDefect, 'id' | 'detectedAt' | 'resolved'>,
    autoAction?: { actionRequired: string; assignedTo: string; priority: 'Immediate' | 'Standard' | 'Urgent'; targetDate: string }
  ) {
    if (!this.state.activeSessionId) return;
    const updated = QualityControlApiService.logDefect(
      this.state.activeSessionId,
      defect,
      autoAction
    );
    if (updated) {
      this.refreshSessions(updated);
      this.showNotification(`Defect ${defect.defectCode} recorded & routed.`, 'error');
    }
  }

  public resolveDefect(defectId: string) {
    if (!this.state.activeSessionId) return;
    const updated = QualityControlApiService.resolveDefect(this.state.activeSessionId, defectId);
    if (updated) {
      this.refreshSessions(updated);
      this.showNotification('Defect marked as rectified.');
    }
  }

  public updateCorrectiveAction(actionId: string, updates: Partial<QCCorrectiveAction>) {
    if (!this.state.activeSessionId) return;
    const updated = QualityControlApiService.updateCorrectiveAction(
      this.state.activeSessionId,
      actionId,
      updates
    );
    if (updated) {
      this.refreshSessions(updated);
      this.showNotification('Corrective action status updated.');
    }
  }

  // Photo & Notes Actions
  public addPhoto(photo: Omit<QCPhotoEvidence, 'id' | 'timestamp'>) {
    if (!this.state.activeSessionId) return;
    const updated = QualityControlApiService.addPhotoEvidence(this.state.activeSessionId, photo);
    if (updated) {
      this.refreshSessions(updated);
      this.showNotification('QC photo evidence added to vault.');
    }
  }

  public addNote(note: Omit<QCNote, 'id' | 'timestamp'>) {
    if (!this.state.activeSessionId) return;
    const updated = QualityControlApiService.addNote(this.state.activeSessionId, note);
    if (updated) {
      this.refreshSessions(updated);
      this.showNotification('Inspector memo recorded.');
    }
  }

  // Final Decision & Certification
  public issueDecision(
    result: QCResult,
    inspectorName: string,
    badgeNumber: string,
    reworkInstructions?: string
  ) {
    if (!this.state.activeSessionId) return;
    const updated = QualityControlApiService.issueApprovalDecision(
      this.state.activeSessionId,
      result,
      inspectorName,
      badgeNumber,
      reworkInstructions
    );
    if (updated) {
      this.refreshSessions(updated);
      this.setState({ isApprovalModalOpen: false });
      this.showNotification(
        result === 'Pass'
          ? 'Couture Seal of Approval granted. Certificate generated!'
          : result === 'Rework Required'
          ? 'Rework Required issued. Garment routed to atelier tailors.'
          : 'Inspection Result: FAIL. Garment quarantined for review.',
        result === 'Pass' ? 'success' : result === 'Rework Required' ? 'info' : 'error'
      );
    }
  }

  // Create New Session
  public createSession(orderData: Parameters<typeof QualityControlApiService.createNewSession>[0]) {
    const created = QualityControlApiService.createNewSession(orderData);
    const sessions = QualityControlApiService.getAllSessions();
    this.setState({
      sessions,
      activeSessionId: created.id,
      isNewSessionModalOpen: false,
    });
    this.showNotification(`New QC session initialized for order ${created.orderId}.`);
  }

  // Reset to Mock
  public resetToMock() {
    const fresh = QualityControlApiService.resetToMock();
    this.setState({
      sessions: fresh,
      activeSessionId: fresh[0]?.id || null,
    });
    this.showNotification('Quality control database reset to baseline mock records.');
  }

  private refreshSessions(updatedSession: QCInspectionSession) {
    const sessions = this.state.sessions.map((s) =>
      s.id === updatedSession.id ? updatedSession : s
    );
    this.setState({ sessions });
  }
}

export const qcStoreInstance = new QCStoreManager();

/**
 * Hook to consume Quality Control Store
 */
export function useQualityControlStore() {
  const [state, setState] = useState<QCStoreState>(qcStoreInstance.getState());

  useEffect(() => {
    const unsubscribe = qcStoreInstance.subscribe((newState) => {
      setState({ ...newState });
    });
    return unsubscribe;
  }, []);

  const activeSession =
    state.sessions.find((s) => s.id === state.activeSessionId) || state.sessions[0] || null;

  const filteredSessions = state.sessions.filter((s) => {
    if (state.resultFilter !== 'ALL' && s.result !== state.resultFilter) {
      return false;
    }
    if (state.searchQuery.trim()) {
      const q = state.searchQuery.toLowerCase();
      return (
        s.orderId.toLowerCase().includes(q) ||
        s.clientName.toLowerCase().includes(q) ||
        s.garmentName.toLowerCase().includes(q) ||
        s.inspectorName.toLowerCase().includes(q) ||
        s.partnerAtelier.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return {
    ...state,
    activeSession,
    filteredSessions,
    setActiveSessionId: useCallback((id: string) => qcStoreInstance.setActiveSessionId(id), []),
    setActiveTab: useCallback((tab: QCActiveTab) => qcStoreInstance.setActiveTab(tab), []),
    setResultFilter: useCallback((f: QCResult | 'ALL') => qcStoreInstance.setResultFilter(f), []),
    setSearchQuery: useCallback((q: string) => qcStoreInstance.setSearchQuery(q), []),
    setModalOpen: useCallback(
      (m: 'approval' | 'newSession' | 'logDefect' | 'addPhoto', open: boolean) =>
        qcStoreInstance.setModalOpen(m, open),
      []
    ),
    setSelectedDefectId: useCallback((id: string | null) => qcStoreInstance.setSelectedDefectId(id), []),
    setSelectedPhotoId: useCallback((id: string | null) => qcStoreInstance.setSelectedPhotoId(id), []),
    showNotification: useCallback(
      (msg: string, type?: 'success' | 'error' | 'info') =>
        qcStoreInstance.showNotification(msg, type),
      []
    ),
    updateChecklistItem: useCallback(
      (itemId: string, updates: Partial<QCInspectionChecklistItem>) =>
        qcStoreInstance.updateChecklistItem(itemId, updates),
      []
    ),
    addChecklistItem: useCallback(
      (item: Omit<QCInspectionChecklistItem, 'id'>) => qcStoreInstance.addChecklistItem(item),
      []
    ),
    updateMeasurement: useCallback(
      (measId: string, actualCm: number, notes?: string) =>
        qcStoreInstance.updateMeasurement(measId, actualCm, notes),
      []
    ),
    addMeasurement: useCallback(
      (m: Omit<QCGarmentMeasurement, 'id' | 'varianceMm' | 'status'>) =>
        qcStoreInstance.addMeasurement(m),
      []
    ),
    updateFabric: useCallback(
      (u: Partial<QCFabricVerification>) => qcStoreInstance.updateFabric(u),
      []
    ),
    updateFinish: useCallback(
      (u: Partial<QCFinishInspection>) => qcStoreInstance.updateFinish(u),
      []
    ),
    updatePackaging: useCallback(
      (u: Partial<QCPackagingInspection>) => qcStoreInstance.updatePackaging(u),
      []
    ),
    logDefect: useCallback(
      (
        d: Omit<QCDefect, 'id' | 'detectedAt' | 'resolved'>,
        act?: { actionRequired: string; assignedTo: string; priority: 'Immediate' | 'Standard' | 'Urgent'; targetDate: string }
      ) => qcStoreInstance.logDefect(d, act),
      []
    ),
    resolveDefect: useCallback((id: string) => qcStoreInstance.resolveDefect(id), []),
    updateCorrectiveAction: useCallback(
      (actId: string, u: Partial<QCCorrectiveAction>) =>
        qcStoreInstance.updateCorrectiveAction(actId, u),
      []
    ),
    addPhoto: useCallback(
      (p: Omit<QCPhotoEvidence, 'id' | 'timestamp'>) => qcStoreInstance.addPhoto(p),
      []
    ),
    addNote: useCallback((n: Omit<QCNote, 'id' | 'timestamp'>) => qcStoreInstance.addNote(n), []),
    issueDecision: useCallback(
      (
        result: QCResult,
        inspectorName: string,
        badgeNumber: string,
        reworkInstructions?: string
      ) => qcStoreInstance.issueDecision(result, inspectorName, badgeNumber, reworkInstructions),
      []
    ),
    createSession: useCallback(
      (orderData: Parameters<typeof QualityControlApiService.createNewSession>[0]) =>
        qcStoreInstance.createSession(orderData),
      []
    ),
    resetToMock: useCallback(() => qcStoreInstance.resetToMock(), []),
  };
}
