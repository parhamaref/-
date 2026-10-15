/**
 * @file VersionControlWorkspace.tsx
 * Master Enterprise Cockpit for Daniel’s Maison Haute Couture Version Control System (VCS).
 * 
 * Features:
 * - Version History Timeline (Visual Git-style graph)
 * - Compare Versions (Multi-domain side-by-side diffing)
 * - Restore Older Versions (Non-destructive forward rollbacks)
 * - Approval Snapshot Storage (Cryptographic legal sign-off vault)
 */

import React, { useState } from 'react';
import {
  GitBranch,
  GitCommit,
  RotateCcw,
  Columns2,
  Lock,
  Layers,
  Award,
  Plus,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter,
  Ruler,
  ShoppingBag,
  Sparkles,
  FileCheck,
  Calendar,
  User,
  ArrowRight,
  Printer,
  ChevronRight,
  Hash,
} from 'lucide-react';
import { useVersionControlStore } from '../../stores/versionControlStore';
import {
  VersionDomainType,
  VersionCommit,
} from '../../types/versionControl.types';
import { VersionTimelineView } from './VersionTimelineView';
import { VersionCompareView } from './VersionCompareView';
import { ApprovalSnapshotVaultView } from './ApprovalSnapshotVaultView';
import { RestoreConfirmModal } from './RestoreConfirmModal';
import { CreateCommitModal } from './CreateCommitModal';

export const VersionControlWorkspace: React.FC = () => {
  const {
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
    setModalOpen,
    resetToMock,
  } = useVersionControlStore();

  const [sealModalOpen, setSealModalOpen] = useState(false);
  const [sealSignerName, setSealSignerName] = useState('Lord Alistair Harrington');
  const [sealSignerRole, setSealSignerRole] = useState('Client & Commissioner');
  const [sealSignerEmail, setSealSignerEmail] = useState('harrington.estate@monaco.mc');
  const [sealNotes, setSealNotes] = useState('Specifications approved and locked for production shears.');

  const headCommit = commits.find((c) => c.isCurrentHead) || commits[0] || null;
  const targetRestoreCommit = commits.find((c) => c.id === targetRestoreCommitId) || null;

  const handleCompareWithHead = (commitId: string) => {
    if (headCommit) {
      setComparisonPair(commitId, headCommit.id);
      setActiveTab('compare');
    }
  };

  const handleExecuteSeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!headCommit) return;

    sealApprovalSnapshot({
      commitId: headCommit.id,
      digitalSignature: `DIGITAL-SIG-SHA256-${sealSignerName.toUpperCase().replace(/\s+/g, '-')}-${Date.now().toString(16)}`,
      declarationAccepted: true,
      signerName: sealSignerName.trim(),
      signerRole: sealSignerRole.trim(),
      signerEmail: sealSignerEmail.trim(),
      notes: sealNotes.trim(),
    });

    setSealModalOpen(false);
  };

  return (
    <div className="flex flex-col flex-1 h-full min-h-screen bg-[#070707] text-neutral-100 font-sans select-none overflow-x-hidden">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xs border shadow-2xl flex items-center gap-3 backdrop-blur-md transition animate-in slide-in-from-top-4 ${
            notification.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-700/80 text-emerald-200'
              : notification.type === 'error'
              ? 'bg-rose-950/90 border-rose-700/80 text-rose-200'
              : 'bg-neutral-900/90 border-neutral-700 text-neutral-200'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
          )}
          <span className="text-xs font-mono">{notification.message}</span>
        </div>
      )}

      {/* Workspace Header */}
      <header className="px-6 py-4 border-b border-neutral-800/80 bg-[#0a0a0a]/90 backdrop-blur-md sticky top-0 z-20">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Brand & Package Title */}
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xs bg-gradient-to-br from-amber-600/20 to-neutral-900 border border-amber-600/40 flex items-center justify-center text-amber-400 shadow-lg">
              <GitBranch className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                  HAUTE COUTURE REVISION CONTROL
                </span>
                {activePackage && (
                  <span className="px-2 py-0.5 bg-neutral-800 text-neutral-300 text-[9px] font-mono rounded-xs border border-neutral-700">
                    {activePackage.orderNumber}
                  </span>
                )}
                {activePackage?.isLocked && (
                  <span className="flex items-center gap-1 px-2 py-0.5 bg-purple-950/80 text-purple-300 border border-purple-800 text-[9px] font-mono uppercase rounded-xs">
                    <Lock className="w-2.5 h-2.5" /> Production Locked
                  </span>
                )}
              </div>
              <h1 className="font-serif text-2xl font-bold tracking-wider text-white uppercase mt-0.5">
                VERSION CONTROL SYSTEM (VCS)
              </h1>
            </div>
          </div>

          {/* Controls: Package Selector & Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Package Selector */}
            <div className="flex items-center bg-[#121212] border border-[#333] rounded-xs px-2.5 py-1">
              <span className="text-[10px] font-mono text-neutral-500 uppercase mr-2">Commission:</span>
              <select
                value={activePackageId}
                onChange={(e) => setActivePackageId(e.target.value)}
                className="bg-transparent text-xs font-mono text-white font-bold focus:outline-hidden cursor-pointer"
              >
                {packages.map((pkg) => (
                  <option key={pkg.id} value={pkg.id} className="bg-[#121212] text-white">
                    {pkg.orderNumber} — {pkg.customerName} ({pkg.currentVersion})
                  </option>
                ))}
              </select>
            </div>

            {/* Commit New Version Button */}
            <button
              onClick={() => setModalOpen('createCommit', true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white text-black hover:bg-neutral-200 font-mono text-[11px] font-bold uppercase rounded-xs transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Commit New Version
            </button>

            {/* Seal Approval Snapshot Button */}
            {headCommit && !headCommit.isSnapshotLocked && (
              <button
                onClick={() => setSealModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-purple-600/20 border border-purple-600/40 text-purple-300 hover:bg-purple-600/30 font-mono text-[11px] font-bold uppercase rounded-xs transition cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" /> Seal Approval Snapshot
              </button>
            )}

            {/* Reset Mock Data */}
            <button
              onClick={resetToMock}
              title="Reset VCS Dataset"
              className="p-1.5 border border-neutral-800 hover:border-neutral-600 text-neutral-400 hover:text-white rounded-xs transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* KPI Ribbon Strip */}
      <section className="bg-[#0b0b0b] border-b border-[#222] px-6 py-2.5 font-mono text-[11px]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-neutral-500">ACTIVE HEAD:</span>
              <span className="text-amber-400 font-bold">{activePackage?.currentVersion || 'v1.0.0'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-neutral-500">TOTAL COMMITS:</span>
              <span className="text-white font-bold">{commits.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-neutral-500">SEALED SNAPSHOTS:</span>
              <span className="text-purple-400 font-bold">{approvalSnapshots.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-neutral-500">CLIENT APPROVAL:</span>
              <span className={`font-bold ${activePackage?.isLocked ? 'text-emerald-400' : 'text-amber-300'}`}>
                {activePackage?.approvalState?.replace('_', ' ') || 'PENDING'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-neutral-400 text-[10px]">
            <span>LAST MUTATION:</span>
            <span className="text-neutral-200">
              {activePackage ? new Date(activePackage.lastUpdated).toLocaleDateString() : 'Today'}
            </span>
          </div>
        </div>
      </section>

      {/* Main Tabs Navigation */}
      <section className="bg-[#0e0e0e] border-b border-[#222] px-6 py-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Tab buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('timeline')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xs font-mono text-xs transition cursor-pointer ${
                activeTab === 'timeline'
                  ? 'bg-neutral-800 text-white font-bold border border-neutral-600'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <GitCommit className="w-3.5 h-3.5 text-amber-400" />
              <span>Version History Timeline</span>
              <span className="px-1.5 py-0.2 bg-black text-amber-300 text-[10px] rounded-xs font-mono">
                {commits.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('compare')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xs font-mono text-xs transition cursor-pointer ${
                activeTab === 'compare'
                  ? 'bg-neutral-800 text-white font-bold border border-neutral-600'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Columns2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Compare Versions</span>
              {comparisonResult && (
                <span className="px-1.5 py-0.2 bg-black text-cyan-300 text-[10px] rounded-xs font-mono">
                  {comparisonResult.totalModifications} Diffs
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('snapshots')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xs font-mono text-xs transition cursor-pointer ${
                activeTab === 'snapshots'
                  ? 'bg-neutral-800 text-white font-bold border border-neutral-600'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Lock className="w-3.5 h-3.5 text-purple-400" />
              <span>Approval Snapshot Storage</span>
              <span className="px-1.5 py-0.2 bg-black text-purple-300 text-[10px] rounded-xs font-mono">
                {approvalSnapshots.length}
              </span>
            </button>
          </div>

          {/* Domain Filter (Only when on Timeline) */}
          {activeTab === 'timeline' && (
            <div className="flex items-center gap-1 font-mono text-xs">
              <span className="text-neutral-500 text-[10px] uppercase mr-1">Filter Domain:</span>
              {(['ALL', 'measurements', 'design', 'fabrics', 'approval'] as const).map((dom) => (
                <button
                  key={dom}
                  onClick={() => setDomainFilter(dom)}
                  className={`px-2 py-0.5 rounded-xs text-[11px] capitalize transition cursor-pointer ${
                    domainFilter === dom
                      ? 'bg-neutral-700 text-white font-bold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {dom}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Main Content Area */}
      <main className="p-6 flex-1 overflow-y-auto">
        {/* Tab 1: Timeline & Details Side-by-Side */}
        {activeTab === 'timeline' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Timeline Stream (Left 7 Cols) */}
            <div className="lg:col-span-7 bg-[#0a0a0a] border border-[#222] rounded-xs p-4 overflow-hidden">
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#222]">
                <span className="font-mono text-xs text-neutral-400 uppercase tracking-wider font-bold">
                  Bespoke Evolution Branch (Linear DAG)
                </span>
                <span className="text-[10px] font-mono text-neutral-500">
                  Head: {activePackage?.currentVersion}
                </span>
              </div>

              <VersionTimelineView
                commits={commits}
                selectedCommitId={selectedCommitId}
                onSelectCommit={setSelectedCommitId}
                onCompareWithHead={handleCompareWithHead}
                onRestoreCommit={openRestoreModal}
                domainFilter={domainFilter}
              />
            </div>

            {/* Selected Version Inspector (Right 5 Cols) */}
            <div className="lg:col-span-5 bg-[#0a0a0a] border border-[#222] rounded-xs p-5 space-y-5">
              {selectedCommit ? (
                <>
                  {/* Selected Commit Header */}
                  <div className="border-b border-[#222] pb-4">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="font-mono text-base font-bold text-white tracking-wide">
                        {selectedCommit.versionTag} ({selectedCommit.commitHash})
                      </span>
                      <span className="px-2 py-0.5 bg-neutral-900 border border-neutral-700 text-amber-300 font-mono text-[10px] font-bold uppercase rounded-xs">
                        {selectedCommit.versionBadge}
                      </span>
                    </div>
                    <p className="font-sans text-xs text-neutral-300 leading-relaxed mb-3">
                      {selectedCommit.commitMessage}
                    </p>

                    {/* Commit Metadata */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-neutral-400 pt-2 border-t border-[#1a1a1a]">
                      <div>Author: <span className="text-neutral-200 font-bold">{selectedCommit.author.name}</span></div>
                      <div>{new Date(selectedCommit.timestamp).toLocaleString()}</div>
                    </div>
                  </div>

                  {/* 1. Measurement Snapshot Section */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-amber-400 font-bold uppercase flex items-center gap-1.5">
                        <Ruler className="w-3.5 h-3.5" /> Measurements Profile
                      </span>
                      <span className="text-[10px] text-neutral-500">
                        {selectedCommit.measurements.scanMethod}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-[11px] font-mono bg-[#111] p-3 rounded-xs border border-[#222]">
                      <div>
                        <span className="text-neutral-500 block text-[9px]">CHEST</span>
                        <span className="text-neutral-200 font-bold">{selectedCommit.measurements.chestCircumferenceCm} cm</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block text-[9px]">WAIST DROP</span>
                        <span className="text-neutral-200 font-bold">{selectedCommit.measurements.waistDropCm} cm</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block text-[9px]">SLEEVE</span>
                        <span className="text-neutral-200 font-bold">{selectedCommit.measurements.sleeveLengthCm} cm</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block text-[9px]">JACKET BACK</span>
                        <span className="text-neutral-200 font-bold">{selectedCommit.measurements.jacketBackLengthCm} cm</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block text-[9px]">SHOULDER SLOPE</span>
                        <span className="text-neutral-200 font-bold">{selectedCommit.measurements.shoulderSlopeAngle}°</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block text-[9px]">TOLERANCE</span>
                        <span className="text-emerald-400 font-bold">±{selectedCommit.measurements.toleranceMm} mm</span>
                      </div>
                    </div>
                    {selectedCommit.measurements.postureNotes && (
                      <p className="text-[11px] text-neutral-400 font-sans italic bg-black/40 p-2 rounded-xs border border-[#1f1f1f]">
                        "{selectedCommit.measurements.postureNotes}"
                      </p>
                    )}
                  </div>

                  {/* 2. Design Specs Section */}
                  <div className="space-y-2">
                    <div className="text-xs font-mono text-cyan-400 font-bold uppercase flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Design Architecture
                    </div>
                    <div className="bg-[#111] p-3 rounded-xs border border-[#222] space-y-1.5 text-[11px] font-mono">
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Silhouette:</span>
                        <span className="text-neutral-200 font-bold">{selectedCommit.design.silhouetteName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Lapel Architecture:</span>
                        <span className="text-neutral-200">{selectedCommit.design.lapelStyle} ({selectedCommit.design.lapelWidthCm}cm)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Chest Canvas:</span>
                        <span className="text-neutral-200">{selectedCommit.design.canvasStructure}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Button / Hardware:</span>
                        <span className="text-neutral-200">{selectedCommit.design.buttonMaterial}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Monogram Directives:</span>
                        <span className="text-amber-300 font-bold">{selectedCommit.design.monogramText}</span>
                      </div>
                    </div>
                  </div>

                  {/* 3. Fabric Selection Section */}
                  <div className="space-y-2">
                    <div className="text-xs font-mono text-emerald-400 font-bold uppercase flex items-center gap-1.5">
                      <ShoppingBag className="w-3.5 h-3.5" /> Fabric Selection
                    </div>
                    <div className="bg-[#111] p-3 rounded-xs border border-[#222] space-y-1.5 text-[11px] font-mono">
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Mill Partner:</span>
                        <span className="text-neutral-200 font-bold">{selectedCommit.fabrics.millName} ({selectedCommit.fabrics.millLocation})</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Primary Cloth:</span>
                        <span className="text-neutral-200">{selectedCommit.fabrics.primaryFabricName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Weight & Yarn:</span>
                        <span className="text-neutral-200">{selectedCommit.fabrics.fabricWeightGsm} GSM • {selectedCommit.fabrics.yarnCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Lining Specification:</span>
                        <span className="text-neutral-200">{selectedCommit.fabrics.liningSilkName}</span>
                      </div>
                    </div>
                  </div>

                  {/* 4. Approval State Section */}
                  <div className="space-y-2">
                    <div className="text-xs font-mono text-purple-400 font-bold uppercase flex items-center gap-1.5">
                      <FileCheck className="w-3.5 h-3.5" /> Approval Status
                    </div>
                    <div className="bg-[#111] p-3 rounded-xs border border-[#222] space-y-1.5 text-[11px] font-mono">
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Stage:</span>
                        <span className="text-purple-300 font-bold uppercase">{selectedCommit.approval.approvalState.replace('_', ' ')}</span>
                      </div>
                      {selectedCommit.approval.signoffSignerName && (
                        <div className="flex justify-between">
                          <span className="text-neutral-500">Signed By:</span>
                          <span className="text-neutral-200">{selectedCommit.approval.signoffSignerName} ({selectedCommit.approval.signoffSignerRole})</span>
                        </div>
                      )}
                      {selectedCommit.approval.digitalSignatureHash && (
                        <div className="pt-1 border-t border-[#1f1f1f]">
                          <span className="text-neutral-500 block text-[9px]">DIGITAL SIGNATURE HASH:</span>
                          <span className="text-neutral-300 font-mono text-[10px] break-all">{selectedCommit.approval.digitalSignatureHash}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bottom Action Buttons */}
                  <div className="pt-3 border-t border-[#222] flex items-center gap-2">
                    {!selectedCommit.isCurrentHead && (
                      <button
                        onClick={() => openRestoreModal(selectedCommit.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-amber-600/20 border border-amber-600/40 hover:bg-amber-600/30 text-amber-300 font-mono text-xs font-bold uppercase rounded-xs transition cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" /> Restore This Version
                      </button>
                    )}

                    {!selectedCommit.isCurrentHead && (
                      <button
                        onClick={() => handleCompareWithHead(selectedCommit.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-neutral-900 border border-neutral-700 hover:border-neutral-500 text-neutral-200 font-mono text-xs rounded-xs transition cursor-pointer"
                      >
                        <Columns2 className="w-3.5 h-3.5" /> Compare vs HEAD
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-neutral-500 font-mono text-xs">
                  Select a version commit in the timeline to inspect its full multi-domain dossier.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Compare Versions */}
        {activeTab === 'compare' && (
          <VersionCompareView
            commits={commits}
            comparisonSourceId={comparisonSourceId}
            comparisonTargetId={comparisonTargetId}
            comparisonResult={comparisonResult}
            onSetComparisonPair={setComparisonPair}
            onRestoreToSource={openRestoreModal}
          />
        )}

        {/* Tab 3: Approval Snapshot Vault */}
        {activeTab === 'snapshots' && (
          <ApprovalSnapshotVaultView
            snapshots={approvalSnapshots}
            headCommit={headCommit}
            onSealHeadCommit={() => setSealModalOpen(true)}
          />
        )}
      </main>

      {/* Restore Confirmation Modal */}
      <RestoreConfirmModal
        isOpen={isRestoreConfirmModalOpen}
        targetCommit={targetRestoreCommit}
        currentHeadCommit={headCommit}
        onConfirm={executeRestore}
        onClose={closeRestoreModal}
      />

      {/* Create Version Commit Modal */}
      <CreateCommitModal
        isOpen={isCreateCommitModalOpen}
        onClose={() => setModalOpen('createCommit', false)}
        packageId={activePackageId}
        headCommit={headCommit}
      />

      {/* Seal Approval Snapshot Modal */}
      {sealModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg bg-[#0d0d0d] border border-[#333] rounded-xs shadow-2xl flex flex-col overflow-hidden text-neutral-100">
            <div className="px-6 py-4 bg-[#141414] border-b border-[#222] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xs bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-serif text-lg font-bold tracking-wider uppercase text-white">
                    SEAL APPROVAL SNAPSHOT
                  </h2>
                  <p className="text-[11px] font-mono text-neutral-400">
                    Cryptographic Lock & Legal Sign-off Execution
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSealModalOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleExecuteSeal} className="p-6 space-y-4 font-mono text-xs">
              <div className="p-3 bg-purple-950/20 border border-purple-800/40 rounded-xs text-purple-200 text-[11px] leading-relaxed">
                Sealing will lock <strong>{headCommit?.versionTag}</strong> into the immutable snapshot vault, generate a SHA-256 seal, and mark this version as <strong>PRODUCTION_LOCK</strong>.
              </div>

              <div>
                <label className="block text-[10px] uppercase text-neutral-400 font-bold mb-1">
                  Signer Full Name:
                </label>
                <input
                  type="text"
                  value={sealSignerName}
                  onChange={(e) => setSealSignerName(e.target.value)}
                  required
                  className="w-full bg-black border border-[#333] px-3 py-1.5 rounded-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase text-neutral-400 font-bold mb-1">
                  Signer Role / Capacity:
                </label>
                <input
                  type="text"
                  value={sealSignerRole}
                  onChange={(e) => setSealSignerRole(e.target.value)}
                  required
                  className="w-full bg-black border border-[#333] px-3 py-1.5 rounded-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase text-neutral-400 font-bold mb-1">
                  Signer Email:
                </label>
                <input
                  type="email"
                  value={sealSignerEmail}
                  onChange={(e) => setSealSignerEmail(e.target.value)}
                  required
                  className="w-full bg-black border border-[#333] px-3 py-1.5 rounded-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase text-neutral-400 font-bold mb-1">
                  Approval Directives & Notes:
                </label>
                <textarea
                  rows={2}
                  value={sealNotes}
                  onChange={(e) => setSealNotes(e.target.value)}
                  className="w-full bg-black border border-[#333] p-2.5 rounded-xs text-white"
                />
              </div>

              <div className="pt-3 border-t border-[#222] flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setSealModalOpen(false)}
                  className="px-4 py-2 text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold uppercase rounded-xs transition shadow-lg shadow-purple-950/40"
                >
                  <ShieldCheck className="w-4 h-4" /> Seal & Lock Snapshot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
