/**
 * @file reworkStore.ts
 * Enterprise Reactive State Store for Daniel’s Maison Rework Management Workflow.
 * Zero-external-dependency reactive manager with hook subscribers.
 */

import { useState, useEffect, useCallback } from 'react';
import {
  ReworkRequest,
  ReworkStatus,
  ReworkTask,
  ReworkDefect,
  TailorStaffProfile,
  ReworkPriority,
  ReworkTaskCategory,
} from '../types/rework.types';
import { ReworkApiService } from '../services/reworkApi';

export type ReworkActiveTab = 'overview' | 'defects' | 'tasks' | 'reinspection' | 'history';

export interface ReworkStoreState {
  requests: ReworkRequest[];
  activeRequestId: string | null;
  statusFilter: ReworkStatus | 'ALL';
  searchQuery: string;
  activeTab: ReworkActiveTab;
  selectedTaskId: string | null;
  selectedDefectId: string | null;
  isCreateModalOpen: boolean;
  isAssignModalOpen: boolean;
  isTaskModalOpen: boolean;
  isReinspectionModalOpen: boolean;
  isCertificateModalOpen: boolean;
  tailorStaff: TailorStaffProfile[];
  notification: { message: string; type: 'success' | 'error' | 'info' } | null;
}

class ReworkStoreManager {
  private state: ReworkStoreState = {
    requests: [],
    activeRequestId: null,
    statusFilter: 'ALL',
    searchQuery: '',
    activeTab: 'overview',
    selectedTaskId: null,
    selectedDefectId: null,
    isCreateModalOpen: false,
    isAssignModalOpen: false,
    isTaskModalOpen: false,
    isReinspectionModalOpen: false,
    isCertificateModalOpen: false,
    tailorStaff: [],
    notification: null,
  };

  private listeners = new Set<(state: ReworkStoreState) => void>();

  constructor() {
    this.init();
  }

  private init() {
    const list = ReworkApiService.getAllRequests();
    this.state.requests = list;
    this.state.tailorStaff = ReworkApiService.getTailorStaff();
    if (list.length > 0) {
      this.state.activeRequestId = list[0].id;
    }
  }

  public getState(): ReworkStoreState {
    return this.state;
  }

  public subscribe(listener: (state: ReworkStoreState) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener(this.state));
  }

  public showNotification(message: string, type: 'success' | 'error' | 'info' = 'success') {
    this.state = {
      ...this.state,
      notification: { message, type },
    };
    this.notify();

    setTimeout(() => {
      if (this.state.notification?.message === message) {
        this.state = {
          ...this.state,
          notification: null,
        };
        this.notify();
      }
    }, 4000);
  }

  public setActiveRequestId(id: string | null) {
    this.state = {
      ...this.state,
      activeRequestId: id,
    };
    this.notify();
  }

  public setStatusFilter(status: ReworkStatus | 'ALL') {
    this.state = {
      ...this.state,
      statusFilter: status,
    };
    this.notify();
  }

  public setSearchQuery(query: string) {
    this.state = {
      ...this.state,
      searchQuery: query,
    };
    this.notify();
  }

  public setActiveTab(tab: ReworkActiveTab) {
    this.state = {
      ...this.state,
      activeTab: tab,
    };
    this.notify();
  }

  public setSelectedTaskId(id: string | null) {
    this.state = {
      ...this.state,
      selectedTaskId: id,
    };
    this.notify();
  }

  public setSelectedDefectId(id: string | null) {
    this.state = {
      ...this.state,
      selectedDefectId: id,
    };
    this.notify();
  }

  public setModalOpen(
    modal:
      | 'create'
      | 'assign'
      | 'task'
      | 'reinspection'
      | 'certificate',
    isOpen: boolean
  ) {
    const keyMap: Record<string, keyof ReworkStoreState> = {
      create: 'isCreateModalOpen',
      assign: 'isAssignModalOpen',
      task: 'isTaskModalOpen',
      reinspection: 'isReinspectionModalOpen',
      certificate: 'isCertificateModalOpen',
    };
    const key = keyMap[modal];
    if (key) {
      this.state = {
        ...this.state,
        [key]: isOpen,
      };
      this.notify();
    }
  }

  // Workflow Action 1: Create Rework Request
  public createReworkRequest(data: Parameters<typeof ReworkApiService.createReworkRequest>[0]) {
    const created = ReworkApiService.createReworkRequest(data);
    const updatedList = ReworkApiService.getAllRequests();
    this.state = {
      ...this.state,
      requests: updatedList,
      activeRequestId: created.id,
      isCreateModalOpen: false,
    };
    this.notify();
    this.showNotification(`Rework Request ${created.id} initialized with status 'QC Failed'`, 'success');
  }

  // Workflow Action 2: Assign Rework Tasks ('QC Failed' -> 'Rework Assigned')
  public assignReworkTasks(
    reworkId: string,
    assignment: Parameters<typeof ReworkApiService.assignReworkTasks>[1]
  ) {
    const updated = ReworkApiService.assignReworkTasks(reworkId, assignment);
    if (updated) {
      this.state = {
        ...this.state,
        requests: ReworkApiService.getAllRequests(),
        isAssignModalOpen: false,
      };
      this.notify();
      this.showNotification(
        `Rework assigned to ${assignment.tailorName}. Status updated to 'Rework Assigned'.`,
        'success'
      );
    }
  }

  // Workflow Action 2b: Start Rework ('Rework Assigned' -> 'Rework In Progress')
  public startRework(reworkId: string, tailorName: string, notes?: string) {
    const updated = ReworkApiService.startRework(reworkId, tailorName, notes);
    if (updated) {
      this.state = {
        ...this.state,
        requests: ReworkApiService.getAllRequests(),
      };
      this.notify();
      this.showNotification(`Rework started by ${tailorName}. Status: 'Rework In Progress'`, 'info');
    }
  }

  // Workflow Action 3 & 4: Defect Tracking & Task Progress
  public updateTaskProgress(
    reworkId: string,
    taskId: string,
    updates: Partial<ReworkTask>,
    tailorName: string
  ) {
    const updated = ReworkApiService.updateReworkTask(reworkId, taskId, updates, tailorName);
    if (updated) {
      this.state = {
        ...this.state,
        requests: ReworkApiService.getAllRequests(),
        isTaskModalOpen: false,
      };
      this.notify();
      this.showNotification('Task remediation progress logged successfully', 'success');
    }
  }

  // Workflow Action 4: Submit For Reinspection ('Rework In Progress' -> 'Reinspection')
  public submitForReinspection(reworkId: string, tailorName: string, notes: string) {
    const updated = ReworkApiService.submitForReinspection(reworkId, tailorName, notes);
    if (updated) {
      this.state = {
        ...this.state,
        requests: ReworkApiService.getAllRequests(),
      };
      this.notify();
      this.showNotification(
        `Piece submitted for Reinspection. Handed off to QC Master Chamber.`,
        'success'
      );
    }
  }

  // Workflow Action 5: Reinspection Verdict ('Reinspection' -> 'Approved')
  public performReinspection(
    reworkId: string,
    verdictData: Parameters<typeof ReworkApiService.performReinspection>[1]
  ) {
    const updated = ReworkApiService.performReinspection(reworkId, verdictData);
    if (updated) {
      this.state = {
        ...this.state,
        requests: ReworkApiService.getAllRequests(),
        isReinspectionModalOpen: false,
      };
      this.notify();
      if (verdictData.verdict === 'Approved') {
        this.showNotification(
          `APPROVED! Haute Couture accreditation seal stamped. Garment ready for client dispatch!`,
          'success'
        );
      } else {
        this.showNotification(`Reinspection verdict: ${verdictData.verdict}`, 'info');
      }
    }
  }

  public resetToMock() {
    const reset = ReworkApiService.resetToMock();
    this.state = {
      ...this.state,
      requests: reset,
      activeRequestId: reset[0]?.id || null,
      statusFilter: 'ALL',
      searchQuery: '',
    };
    this.notify();
    this.showNotification('Rework workspace reset to curated atelier demo data', 'info');
  }
}

export const reworkStoreManager = new ReworkStoreManager();

/**
 * Custom React hook for Rework Store
 */
export function useReworkStore() {
  const [state, setState] = useState<ReworkStoreState>(() => reworkStoreManager.getState());

  useEffect(() => {
    const unsubscribe = reworkStoreManager.subscribe(setState);
    return () => unsubscribe();
  }, []);

  const activeRequest = state.requests.find((r) => r.id === state.activeRequestId) || null;
  const metrics = ReworkApiService.getMetrics();

  return {
    ...state,
    activeRequest,
    metrics,
    setActiveRequestId: useCallback((id: string | null) => reworkStoreManager.setActiveRequestId(id), []),
    setStatusFilter: useCallback((status: ReworkStatus | 'ALL') => reworkStoreManager.setStatusFilter(status), []),
    setSearchQuery: useCallback((q: string) => reworkStoreManager.setSearchQuery(q), []),
    setActiveTab: useCallback((tab: ReworkActiveTab) => reworkStoreManager.setActiveTab(tab), []),
    setSelectedTaskId: useCallback((id: string | null) => reworkStoreManager.setSelectedTaskId(id), []),
    setSelectedDefectId: useCallback((id: string | null) => reworkStoreManager.setSelectedDefectId(id), []),
    setModalOpen: useCallback(
      (modal: 'create' | 'assign' | 'task' | 'reinspection' | 'certificate', isOpen: boolean) =>
        reworkStoreManager.setModalOpen(modal, isOpen),
      []
    ),
    createReworkRequest: useCallback(
      (data: Parameters<typeof ReworkApiService.createReworkRequest>[0]) =>
        reworkStoreManager.createReworkRequest(data),
      []
    ),
    assignReworkTasks: useCallback(
      (reworkId: string, assignment: Parameters<typeof ReworkApiService.assignReworkTasks>[1]) =>
        reworkStoreManager.assignReworkTasks(reworkId, assignment),
      []
    ),
    startRework: useCallback(
      (reworkId: string, tailorName: string, notes?: string) =>
        reworkStoreManager.startRework(reworkId, tailorName, notes),
      []
    ),
    updateTaskProgress: useCallback(
      (reworkId: string, taskId: string, updates: Partial<ReworkTask>, tailorName: string) =>
        reworkStoreManager.updateTaskProgress(reworkId, taskId, updates, tailorName),
      []
    ),
    submitForReinspection: useCallback(
      (reworkId: string, tailorName: string, notes: string) =>
        reworkStoreManager.submitForReinspection(reworkId, tailorName, notes),
      []
    ),
    performReinspection: useCallback(
      (reworkId: string, verdictData: Parameters<typeof ReworkApiService.performReinspection>[1]) =>
        reworkStoreManager.performReinspection(reworkId, verdictData),
      []
    ),
    resetToMock: useCallback(() => reworkStoreManager.resetToMock(), []),
    showNotification: useCallback(
      (msg: string, type: 'success' | 'error' | 'info' = 'success') =>
        reworkStoreManager.showNotification(msg, type),
      []
    ),
  };
}
