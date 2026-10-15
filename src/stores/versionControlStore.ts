/**
 * @file versionControlStore.ts
 * Enterprise Reactive State Store for Daniel’s Maison Version Control System (VCS).
 * Zero-dependency hook-based store.
 */

import { useState, useEffect, useCallback } from 'react';
import {
  VersionCommit,
  ApprovalSnapshot,
  VCSPackageSummary,
  VersionComparisonResult,
  VersionDomainType,
  VersionAuthor,
} from '../types/versionControl.types';
import { VersionControlService } from '../services/versionControlApi';

type Listener = () => void;
const listeners = new Set<Listener>();

let packages: VCSPackageSummary[] = [];
let activePackageId: string = '';
let commits: VersionCommit[] = [];
let selectedCommitId: string | null = null;
let comparisonSourceId: string | null = null;
let comparisonTargetId: string | null = null;
let activeTab: 'timeline' | 'compare' | 'snapshots' | 'restore' = 'timeline';
let domainFilter: 'ALL' | VersionDomainType = 'ALL';
let isCreateCommitModalOpen = false;
let isRestoreConfirmModalOpen = false;
let targetRestoreCommitId: string | null = null;
let selectedSnapshotId: string | null = null;

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

// Initial hydration
if (typeof window !== 'undefined') {
  packages = VersionControlService.getPackages();
  if (packages.length > 0) {
    activePackageId = packages[0].id;
    commits = VersionControlService.getCommitsByPackage(activePackageId);
    if (commits.length > 0) {
      selectedCommitId = commits[0].id;
      if (commits.length > 1) {
        comparisonSourceId = commits[1].id;
        comparisonTargetId = commits[0].id;
      }
    }
  }
}

export function useVersionControlStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const handler = () => setTick((t) => t + 1);
    listeners.add(handler);
    return () => {
      listeners.delete(handler);
    };
  }, []);

  const refreshState = useCallback(() => {
    packages = VersionControlService.getPackages();
    if (!activePackageId && packages.length > 0) {
      activePackageId = packages[0].id;
    }
    commits = VersionControlService.getCommitsByPackage(activePackageId);
    if (!selectedCommitId && commits.length > 0) {
      selectedCommitId = commits[0].id;
    }
    if (!comparisonSourceId && commits.length > 1) {
      comparisonSourceId = commits[1].id;
      comparisonTargetId = commits[0].id;
    }
    notify();
  }, []);

  const setActivePackageId = useCallback((id: string) => {
    activePackageId = id;
    commits = VersionControlService.getCommitsByPackage(id);
    if (commits.length > 0) {
      selectedCommitId = commits[0].id;
      if (commits.length > 1) {
        comparisonSourceId = commits[1].id;
        comparisonTargetId = commits[0].id;
      } else {
        comparisonSourceId = commits[0].id;
        comparisonTargetId = commits[0].id;
      }
    } else {
      selectedCommitId = null;
      comparisonSourceId = null;
      comparisonTargetId = null;
    }
    notify();
  }, []);

  const setSelectedCommitId = useCallback((id: string | null) => {
    selectedCommitId = id;
    notify();
  }, []);

  const setActiveTab = useCallback((tab: 'timeline' | 'compare' | 'snapshots' | 'restore') => {
    activeTab = tab;
    notify();
  }, []);

  const setDomainFilter = useCallback((domain: 'ALL' | VersionDomainType) => {
    domainFilter = domain;
    notify();
  }, []);

  const setComparisonPair = useCallback((sourceId: string, targetId: string) => {
    comparisonSourceId = sourceId;
    comparisonTargetId = targetId;
    notify();
  }, []);

  const openRestoreModal = useCallback((commitId: string) => {
    targetRestoreCommitId = commitId;
    isRestoreConfirmModalOpen = true;
    notify();
  }, []);

  const closeRestoreModal = useCallback(() => {
    targetRestoreCommitId = null;
    isRestoreConfirmModalOpen = false;
    notify();
  }, []);

  const executeRestore = useCallback((rationale: string) => {
    if (!targetRestoreCommitId || !activePackageId) return;

    const author: VersionAuthor = {
      id: 'usr-des-001',
      name: 'Daniel de Morvray',
      role: 'Lead Designer',
      email: 'daniel@maisondaniel.paris',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    };

    const newCommit = VersionControlService.restoreVersion({
      packageId: activePackageId,
      targetCommitId: targetRestoreCommitId,
      restoreRationale: rationale,
      author,
    });

    if (newCommit) {
      refreshState();
      selectedCommitId = newCommit.id;
      isRestoreConfirmModalOpen = false;
      targetRestoreCommitId = null;
      showNotification(`Successfully restored to snapshot! New HEAD created (${newCommit.versionTag})`, 'success');
    } else {
      showNotification('Failed to execute version rollback', 'error');
    }
  }, [refreshState]);

  const sealApprovalSnapshot = useCallback((params: {
    commitId: string;
    digitalSignature: string;
    declarationAccepted: boolean;
    signerName: string;
    signerRole: string;
    signerEmail: string;
    notes?: string;
  }) => {
    const snapshot = VersionControlService.createApprovalSnapshot(params);
    if (snapshot) {
      refreshState();
      showNotification(`Approval Snapshot Sealed: Certificate ${snapshot.certificateNumber}`, 'success');
    } else {
      showNotification('Failed to generate approval snapshot', 'error');
    }
    return snapshot;
  }, [refreshState]);

  const resetToMock = useCallback(() => {
    VersionControlService.resetToMock();
    refreshState();
    showNotification('Version Control System reset to pristine dataset', 'info');
  }, [refreshState]);

  const activePackage = packages.find((p) => p.id === activePackageId) || packages[0] || null;
  const selectedCommit = commits.find((c) => c.id === selectedCommitId) || commits[0] || null;

  // Compute comparison result if comparison IDs exist
  let comparisonResult: VersionComparisonResult | null = null;
  if (comparisonSourceId && comparisonTargetId) {
    comparisonResult = VersionControlService.compareVersions(comparisonSourceId, comparisonTargetId);
  }

  const approvalSnapshots = VersionControlService.getApprovalSnapshots(activePackageId);

  return {
    packages,
    activePackage,
    activePackageId,
    commits,
    selectedCommit,
    selectedCommitId,
    comparisonSourceId,
    comparisonTargetId,
    comparisonResult,
    activeTab,
    domainFilter,
    approvalSnapshots,
    isCreateCommitModalOpen,
    isRestoreConfirmModalOpen,
    targetRestoreCommitId,
    selectedSnapshotId,
    notification,
    setActivePackageId,
    setSelectedCommitId,
    setActiveTab,
    setDomainFilter,
    setComparisonPair,
    openRestoreModal,
    closeRestoreModal,
    executeRestore,
    sealApprovalSnapshot,
    setModalOpen: (modal: 'createCommit' | 'snapshotDetail', open: boolean) => {
      if (modal === 'createCommit') isCreateCommitModalOpen = open;
      notify();
    },
    setSelectedSnapshotId: (id: string | null) => {
      selectedSnapshotId = id;
      notify();
    },
    resetToMock,
    showNotification,
  };
}
