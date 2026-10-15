/**
 * @file DesignerDesignApprovalWorkbench.tsx
 * Atelier Designer & Master Tailor Management Workbench for Design Approvals.
 *
 * Enables Atelier Directors and Tailors to:
 * - Curate pre-production design approval packages (Draft → Submitted)
 * - Review incoming client revision requests across the 5 review components
 * - Upload updated design packages & bump versions (Revision Requested → Updated v1.1)
 * - Inspect legally binding client digital sign-offs
 * - Formally release approved packages to workshop cutting & assembly benches (Approved → Production)
 * - Inspect complete audit trails and approval logs
 */

import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  CheckCircle2,
  Clock,
  Scissors,
  Layers,
  Search,
  Sliders,
  ShieldCheck,
  Send,
  Eye,
  Plus,
  RefreshCw,
  X,
  History,
  Check,
  User,
  ArrowRight,
  ExternalLink,
  GitBranch,
} from 'lucide-react';
import { useDesignApprovalStore } from '../../stores/designApprovalStore';
import { useDesignerStore } from '../../stores/designerStore';
import {
  DesignApprovalPackage,
  DesignApprovalWorkflowStage,
  CustomerReviewComponent,
} from '../../types/designApproval.types';
import { CustomerDesignApprovalModal } from './CustomerDesignApprovalModal';

const STAGE_ORDER: DesignApprovalWorkflowStage[] = [
  'DRAFT',
  'SUBMITTED',
  'REVISION_REQUESTED',
  'UPDATED',
  'APPROVED',
  'PRODUCTION',
  'REJECTED',
];

export const DesignerDesignApprovalWorkbench: React.FC = () => {
  const { setActiveSection } = useDesignerStore();
  const {
    filteredPackages,
    countsByStage,
    stageFilter,
    setStageFilter,
    searchQuery,
    setSearchQuery,
    submitDraft,
    updateVersion,
    releaseToProduction,
    resetToDefaultMock,
    isLoading,
  } = useDesignApprovalStore();

  const [selectedPkgId, setSelectedPkgId] = useState<string | null>(
    filteredPackages[0]?.id || null
  );
  const [customerModalPkg, setCustomerModalPkg] = useState<DesignApprovalPackage | null>(null);

  // Designer update form state
  const [isUpdateDrawerOpen, setIsUpdateDrawerOpen] = useState(false);
  const [updateSummaryInput, setUpdateSummaryInput] = useState('');
  const [updateComponentsInput, setUpdateComponentsInput] = useState<CustomerReviewComponent[]>([
    'SKETCHES',
    'CUSTOM_REQUESTS',
  ]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const selectedPkg =
    filteredPackages.find((p) => p.id === selectedPkgId) || filteredPackages[0] || null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Atelier Action: Submit Draft to Customer
  const handleSubmitDraftToClient = async (pkgId: string) => {
    try {
      await submitDraft(pkgId, 'Daniel’s Maison');
      showToast('Design package submitted to client for formal review!');
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error submitting draft');
    }
  };

  // Atelier Action: Update Version
  const handleApplyUpdateVersion = async () => {
    if (!selectedPkg) return;
    if (!updateSummaryInput.trim()) {
      alert('Please enter a change summary describing the adjustments.');
      return;
    }

    try {
      await updateVersion({
        packageId: selectedPkg.id,
        designerName: 'Daniel’s Maison',
        changeSummary: updateSummaryInput.trim(),
        changedComponents: updateComponentsInput,
        updatedSpec: {},
        addressedRevisionIds: selectedPkg.revisions.map((r) => r.id),
      });
      setIsUpdateDrawerOpen(false);
      setUpdateSummaryInput('');
      showToast(`Updated Design Package v${selectedPkg.currentVersion}.1 dispatched to client!`);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error updating version');
    }
  };

  // Atelier Action: Release to Production Bench
  const handleReleaseToWorkshop = async (pkgId: string) => {
    try {
      await releaseToProduction(pkgId, 'Daniel’s Maison');
      showToast('Approved package released to Head Cutter for cloth shearing!');
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error releasing to production');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn font-mono text-left">
      {/* Client Preview Modal if Designer wants to inspect exact customer experience */}
      <CustomerDesignApprovalModal
        isOpen={Boolean(customerModalPkg)}
        packageData={customerModalPkg}
        onClose={() => setCustomerModalPkg(null)}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="bg-emerald-950/90 border border-emerald-500/50 text-emerald-200 px-4 py-2.5 rounded-xl text-xs flex items-center justify-between animate-fadeIn">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {toastMessage}
          </span>
          <button onClick={() => setToastMessage(null)} className="text-emerald-400">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Atelier Master Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0F0F0F] p-6 rounded-2xl border border-[#222]">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-4 h-4" />
            Atelier Quality & Pre-Production Gate
          </div>
          <h2 className="font-serif text-2xl font-bold text-white uppercase tracking-wider">
            Design Approval & Specification Workbench
          </h2>
          <p className="text-xs text-neutral-400 font-sans">
            Oversee bespoke design packages through the 6-stage lifecycle before workshop manufacturing commences.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveSection('versioning')}
            className="px-3.5 py-2 rounded-lg bg-amber-500/20 border border-amber-500/40 hover:bg-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <GitBranch className="w-3.5 h-3.5 text-amber-400" />
            Version Control (VCS)
          </button>
          <button
            onClick={() => resetToDefaultMock()}
            className="px-3 py-2 rounded-lg border border-[#333] hover:bg-neutral-800 text-neutral-400 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Data
          </button>
        </div>
      </div>

      {/* 6-Stage Progress Counts Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        <div
          onClick={() => setStageFilter('DRAFT')}
          className={`p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
            stageFilter === 'DRAFT'
              ? 'bg-neutral-800 border-neutral-600'
              : 'bg-[#111111] border-[#222] hover:border-neutral-700'
          }`}
        >
          <span className="text-[10px] text-neutral-500 uppercase font-bold block">1. Draft</span>
          <span className="font-serif text-xl font-bold text-white">{countsByStage.DRAFT}</span>
        </div>

        <div
          onClick={() => setStageFilter('SUBMITTED')}
          className={`p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
            stageFilter === 'SUBMITTED'
              ? 'bg-amber-500/20 border-amber-500/50'
              : 'bg-[#111111] border-[#222] hover:border-amber-500/40'
          }`}
        >
          <span className="text-[10px] text-amber-400 uppercase font-bold block">2. Submitted</span>
          <span className="font-serif text-xl font-bold text-amber-300">
            {countsByStage.SUBMITTED}
          </span>
        </div>

        <div
          onClick={() => setStageFilter('REVISION_REQUESTED')}
          className={`p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
            stageFilter === 'REVISION_REQUESTED'
              ? 'bg-purple-500/20 border-purple-500/50'
              : 'bg-[#111111] border-[#222] hover:border-purple-500/40'
          }`}
        >
          <span className="text-[10px] text-purple-400 uppercase font-bold block">3. Revisions</span>
          <span className="font-serif text-xl font-bold text-purple-300">
            {countsByStage.REVISION_REQUESTED}
          </span>
        </div>

        <div
          onClick={() => setStageFilter('UPDATED')}
          className={`p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
            stageFilter === 'UPDATED'
              ? 'bg-blue-500/20 border-blue-500/50'
              : 'bg-[#111111] border-[#222] hover:border-blue-500/40'
          }`}
        >
          <span className="text-[10px] text-blue-400 uppercase font-bold block">4. Updated</span>
          <span className="font-serif text-xl font-bold text-blue-300">{countsByStage.UPDATED}</span>
        </div>

        <div
          onClick={() => setStageFilter('APPROVED')}
          className={`p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
            stageFilter === 'APPROVED'
              ? 'bg-emerald-500/20 border-emerald-500/50'
              : 'bg-[#111111] border-[#222] hover:border-emerald-500/40'
          }`}
        >
          <span className="text-[10px] text-emerald-400 uppercase font-bold block">5. Approved</span>
          <span className="font-serif text-xl font-bold text-emerald-300">
            {countsByStage.APPROVED}
          </span>
        </div>

        <div
          onClick={() => setStageFilter('PRODUCTION')}
          className={`p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
            stageFilter === 'PRODUCTION'
              ? 'bg-emerald-700/30 border-emerald-500'
              : 'bg-[#111111] border-[#222] hover:border-emerald-600'
          }`}
        >
          <span className="text-[10px] text-emerald-300 uppercase font-bold block">6. Production</span>
          <span className="font-serif text-xl font-bold text-emerald-200">
            {countsByStage.PRODUCTION}
          </span>
        </div>
      </div>

      {/* Main Dual-Pane Studio Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Commission List */}
        <div className="lg:col-span-5 space-y-3">
          {/* Search & Filter Header */}
          <div className="flex items-center justify-between gap-2 bg-[#121212] p-2.5 rounded-xl border border-[#222]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by client or order #..."
              className="bg-transparent text-xs text-white pl-2 outline-none w-full"
            />
            {stageFilter !== 'ALL' && (
              <button
                onClick={() => setStageFilter('ALL')}
                className="text-[10px] text-amber-400 uppercase font-bold px-2 py-0.5 rounded bg-neutral-800 shrink-0"
              >
                Clear
              </button>
            )}
          </div>

          {/* List items */}
          <div className="space-y-2 max-h-[700px] overflow-y-auto pr-1">
            {filteredPackages.map((pkg) => {
              const isSelected = selectedPkg?.id === pkg.id;
              return (
                <div
                  key={pkg.id}
                  onClick={() => setSelectedPkgId(pkg.id)}
                  className={`p-4 rounded-xl border text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500/50 shadow-md'
                      : 'bg-[#111111] border-[#222] hover:border-[#333]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest">
                      {pkg.orderNumber} · v{pkg.currentVersion}
                    </span>
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase ${
                        pkg.currentStage === 'APPROVED'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : pkg.currentStage === 'REVISION_REQUESTED'
                          ? 'bg-purple-500/20 text-purple-300'
                          : pkg.currentStage === 'SUBMITTED'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-neutral-800 text-neutral-300'
                      }`}
                    >
                      {pkg.currentStage.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <h4 className="font-serif text-sm font-bold text-white uppercase">{pkg.garmentName}</h4>
                  <p className="text-neutral-400 text-[11px] mt-0.5">
                    Client: <strong className="text-neutral-200">{pkg.customerName}</strong>
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-neutral-500 mt-2 pt-2 border-t border-[#1C1C1C]">
                    <span>Cloth: {pkg.currentSpec.fabric.millName}</span>
                    <span className="text-amber-300 font-bold">
                      £{pkg.priceGbp.toLocaleString('en-GB')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Package Inspection & Tailor Action Workbench */}
        {selectedPkg && (
          <div className="lg:col-span-7 bg-[#0F0F0F] border border-[#262626] rounded-2xl p-6 space-y-6">
            {/* Header with Quick Action Triggers */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#222]">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-amber-400 font-bold">{selectedPkg.orderNumber}</span>
                  <span className="text-neutral-600">•</span>
                  <span className="text-xs text-neutral-300 font-bold">
                    Version {selectedPkg.currentVersion}
                  </span>
                </div>
                <h3 className="font-serif text-xl font-bold text-white uppercase tracking-wider">
                  {selectedPkg.garmentName}
                </h3>
                <p className="text-xs text-neutral-400">
                  Client: <strong className="text-white">{selectedPkg.customerName}</strong> ({selectedPkg.customerEmail})
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCustomerModalPkg(selectedPkg)}
                  className="px-3 py-1.5 rounded-lg border border-[#333] hover:bg-neutral-800 text-xs text-neutral-300 font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Client View Preview
                </button>
              </div>
            </div>

            {/* Atelier Workflow Stage Transitions Bar */}
            <div className="bg-[#141414] p-4 rounded-xl border border-[#222] space-y-3">
              <span className="text-[10px] text-neutral-500 uppercase font-bold block">
                Atelier Workflow Actions:
              </span>

              <div className="flex flex-wrap items-center gap-2">
                {selectedPkg.currentStage === 'DRAFT' && (
                  <button
                    onClick={() => handleSubmitDraftToClient(selectedPkg.id)}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-950"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Submit Draft Specification to Client →
                  </button>
                )}

                {selectedPkg.currentStage === 'REVISION_REQUESTED' && (
                  <button
                    onClick={() => setIsUpdateDrawerOpen(true)}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-lg shadow-purple-950"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    Address Revisions & Upload v{selectedPkg.currentVersion}.1 →
                  </button>
                )}

                {selectedPkg.currentStage === 'APPROVED' && (
                  <button
                    onClick={() => handleReleaseToWorkshop(selectedPkg.id)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-950"
                  >
                    <Scissors className="w-3.5 h-3.5" />
                    Release Cloth to Cutting Bench (Production) →
                  </button>
                )}

                {selectedPkg.currentStage === 'SUBMITTED' && (
                  <div className="flex items-center gap-2 text-xs text-amber-300 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/30">
                    <Clock className="w-3.5 h-3.5 shrink-0" />
                    <span>Dossier in client review queue. SLA countdown active.</span>
                  </div>
                )}

                {selectedPkg.currentStage === 'PRODUCTION' && (
                  <div className="flex items-center gap-2 text-xs text-emerald-300 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/30">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Active in workshop cutting & assembly benches.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Revisions Active Drawer (if opened) */}
            {isUpdateDrawerOpen && (
              <div className="bg-[#171717] p-5 rounded-xl border border-purple-500/50 space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between text-xs text-purple-300 font-bold uppercase">
                  <span>Upload Revised Specification v{selectedPkg.currentVersion}.1</span>
                  <button
                    onClick={() => setIsUpdateDrawerOpen(false)}
                    className="text-neutral-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1.5 text-xs">
                  <label className="text-neutral-400 block font-bold">
                    Atelier Revision Changelog Summary
                  </label>
                  <textarea
                    value={updateSummaryInput}
                    onChange={(e) => setUpdateSummaryInput(e.target.value)}
                    rows={3}
                    className="w-full bg-black border border-[#333] focus:border-purple-500 rounded-lg p-2.5 text-xs text-white outline-none"
                    placeholder="e.g. Lapel gorge raised 1.5cm; substituted Scabal charcoal cashmere as requested."
                  />
                </div>

                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => setIsUpdateDrawerOpen(false)}
                    className="px-3 py-1.5 rounded-lg border border-[#333] text-neutral-300 text-xs font-bold uppercase"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleApplyUpdateVersion}
                    disabled={isLoading}
                    className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold uppercase tracking-wider"
                  >
                    Publish Updated Specification
                  </button>
                </div>
              </div>
            )}

            {/* Pending Revision Items from Client */}
            {selectedPkg.revisions.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-2">
                  <Sliders className="w-3.5 h-3.5" />
                  Client Revision Items ({selectedPkg.revisions.length})
                </h4>

                <div className="space-y-2">
                  {selectedPkg.revisions.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-3 bg-[#141414] border border-[#2A2A2A] rounded-xl text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-300">{rev.title}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 uppercase">
                          {rev.status}
                        </span>
                      </div>
                      <p className="text-neutral-300 text-[11px]">{rev.clientComment}</p>
                      {rev.designerResponse && (
                        <p className="text-emerald-300 text-[11px] mt-1 pt-1 border-t border-[#222]">
                          Resolution: {rev.designerResponse}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Formal Approval Signatures */}
            {selectedPkg.approvalLogs.length > 0 && (
              <div className="space-y-3 pt-3 border-t border-[#222]">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Formal Sign-Off Logs ({selectedPkg.approvalLogs.length})
                </h4>

                <div className="space-y-2">
                  {selectedPkg.approvalLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3 bg-[#121212] border border-emerald-500/30 rounded-xl text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between font-bold text-emerald-300">
                        <span>{log.action} — Version {log.versionApproved}</span>
                        <span className="text-[10px] text-neutral-500 font-mono">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-neutral-300">
                        Signatory: <strong className="text-white">{log.actorName}</strong> ({log.actorRole}) · Digital Signature: <span className="font-mono text-amber-300">{log.digitalSignature}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Audit Trail Timeline */}
            <div className="space-y-3 pt-3 border-t border-[#222]">
              <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
                <History className="w-3.5 h-3.5" />
                Audit Trail Timeline ({selectedPkg.auditTrail.length})
              </h4>

              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 font-mono text-[11px]">
                {selectedPkg.auditTrail.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-2 bg-[#121212] border border-[#222] rounded-lg flex items-center justify-between text-neutral-300"
                  >
                    <div>
                      <span className="text-amber-400 font-bold mr-2">{ev.eventCode}</span>
                      <span>{ev.description}</span>
                    </div>
                    <span className="text-neutral-500 text-[10px] shrink-0">
                      {new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
