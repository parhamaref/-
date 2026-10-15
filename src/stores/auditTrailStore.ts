/**
 * @file auditTrailStore.ts
 * Enterprise Reactive State Store for Daniel’s Maison Audit Trail & Governance System.
 * Zero-dependency hook-based store.
 */

import { useState, useEffect, useCallback } from 'react';
import {
  AuditRecord,
  AuditFilterState,
  AuditMetrics,
  AuditEntityType,
  AuditSeverity,
} from '../types/auditTrail.types';
import { AuditTrailService } from '../services/auditTrailApi';

type Listener = () => void;
const listeners = new Set<Listener>();

let currentLogs: AuditRecord[] = [];
let selectedRecordId: string | null = null;
let currentFilters: AuditFilterState = {
  entityType: 'ALL',
  actionType: 'ALL',
  severity: 'ALL',
  searchQuery: '',
};
let currentDiffViewMode: 'split' | 'unified' | 'json' = 'split';
let isArchitectureModalOpen = false;
let isSimulateModalOpen = false;
let notification: { message: string; type: 'success' | 'error' | 'info' } | null = null;
let notificationTimeout: any = null;

function notify() {
  listeners.forEach((listener) => listener());
}

function showNotification(message: string, type: 'success' | 'error' | 'info' = 'success') {
  if (notificationTimeout) clearTimeout(notificationTimeout);
  notification = { message, type };
  notify();
  notificationTimeout = setTimeout(() => {
    notification = null;
    notify();
  }, 4000);
}

// Initialize logs once on module load
if (typeof window !== 'undefined') {
  currentLogs = AuditTrailService.getAuditLogs();
  if (currentLogs.length > 0) {
    selectedRecordId = currentLogs[0].id;
  }
}

export function useAuditTrailStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const handler = () => setTick((t) => t + 1);
    listeners.add(handler);
    return () => {
      listeners.delete(handler);
    };
  }, []);

  const refreshLogs = useCallback(() => {
    currentLogs = AuditTrailService.getAuditLogs();
    if (!selectedRecordId && currentLogs.length > 0) {
      selectedRecordId = currentLogs[0].id;
    }
    notify();
  }, []);

  const setSelectedRecordId = useCallback((id: string | null) => {
    selectedRecordId = id;
    notify();
  }, []);

  const setFilter = useCallback((patch: Partial<AuditFilterState>) => {
    currentFilters = { ...currentFilters, ...patch };
    notify();
  }, []);

  const resetFilters = useCallback(() => {
    currentFilters = {
      entityType: 'ALL',
      actionType: 'ALL',
      severity: 'ALL',
      searchQuery: '',
    };
    notify();
  }, []);

  const setDiffViewMode = useCallback((mode: 'split' | 'unified' | 'json') => {
    currentDiffViewMode = mode;
    notify();
  }, []);

  const setModalOpen = useCallback((modal: 'architecture' | 'simulate', open: boolean) => {
    if (modal === 'architecture') isArchitectureModalOpen = open;
    if (modal === 'simulate') isSimulateModalOpen = open;
    notify();
  }, []);

  const verifyChain = useCallback(() => {
    const result = AuditTrailService.verifyChainIntegrity();
    if (result.isValid) {
      showNotification(`Cryptographic Chain Verified: All ${result.totalChecked} blocks intact (100% SHA-256 seal integrity)`, 'success');
    } else {
      showNotification(`Tampering Alert: Broken hash link at block ${result.brokenRecordId}!`, 'error');
    }
    return result;
  }, []);

  const resetToMock = useCallback(() => {
    currentLogs = AuditTrailService.resetToMock();
    selectedRecordId = currentLogs[0]?.id || null;
    resetFilters();
    showNotification('Audit trail reset to certified pristine mock dataset', 'info');
    notify();
  }, [resetFilters]);

  const exportData = useCallback((format: 'json' | 'csv') => {
    const logs = AuditTrailService.filterLogs(currentLogs, currentFilters);
    if (format === 'json') {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
      const anchor = document.createElement('a');
      anchor.setAttribute('href', dataStr);
      anchor.setAttribute('download', `Maison_Daniel_Audit_Trail_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      showNotification(`Exported ${logs.length} audit records as JSON dossier`, 'success');
    } else {
      // CSV Export
      const headers = ['Sequence', 'Timestamp', 'Entity Type', 'Entity Name', 'Action Type', 'Severity', 'User Name', 'User Role', 'IP Address', 'City', 'Country', 'Tamper Hash'];
      const rows = logs.map((l) => [
        l.sequenceNumber,
        l.timestamp,
        l.entityType,
        `"${l.entityName.replace(/"/g, '""')}"`,
        l.actionType,
        l.severity,
        `"${l.actor.name}"`,
        l.actor.role,
        l.ipAddress,
        l.geoCity || '',
        l.geoCountry || '',
        l.tamperHash,
      ]);
      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const anchor = document.createElement('a');
      anchor.setAttribute('href', encodedUri);
      anchor.setAttribute('download', `Maison_Daniel_Audit_Trail_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      showNotification(`Exported ${logs.length} audit records as CSV spreadsheet`, 'success');
    }
  }, []);

  // Filtered list
  const filteredLogs = AuditTrailService.filterLogs(currentLogs, currentFilters);
  const selectedRecord = currentLogs.find((l) => l.id === selectedRecordId) || currentLogs[0] || null;
  const metrics = AuditTrailService.getMetrics();

  return {
    logs: currentLogs,
    filteredLogs,
    selectedRecord,
    selectedRecordId,
    filters: currentFilters,
    diffViewMode: currentDiffViewMode,
    isArchitectureModalOpen,
    isSimulateModalOpen,
    notification,
    metrics,
    refreshLogs,
    setSelectedRecordId,
    setFilter,
    resetFilters,
    setDiffViewMode,
    setModalOpen,
    verifyChain,
    resetToMock,
    exportData,
    showNotification,
  };
}
