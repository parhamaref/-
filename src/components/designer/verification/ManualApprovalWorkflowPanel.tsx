/**
 * @file ManualApprovalWorkflowPanel.tsx
 * Standards Council Manual Approval & Atelier Accreditation Board.
 */

import React, { useState } from 'react';
import {
  DesignerVerificationApplication,
  VerificationStatus,
  PillarStatus,
} from '../../../types/designerVerification.types';
import {
  VerificationStatusBadge,
  PillarStatusBadge,
} from './VerificationStatusBadge';
import {
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Award,
  Building2,
  UserCheck,
  Scissors,
  FileCheck2,
  Calendar,
  Sparkles,
  ChevronRight,
  ExternalLink,
  Plus,
} from 'lucide-react';

interface ManualApprovalWorkflowPanelProps {
  applications: DesignerVerificationApplication[];
  selectedApplicationId: string;
  onSelectApplication: (id: string) => void;
  statusFilter: VerificationStatus | 'All';
  onStatusFilterChange: (status: VerificationStatus | 'All') => void;
  searchQuery: string;
  onSearchQueryChange: (q: string) => void;
  onClaimReview: (id: string) => Promise<void>;
  onRequestMoreInformation: (
    id: string,
    reviewerName: string,
    notes: string,
    deadlineDays: number,
    items: { field: string; requirement: string }[]
  ) => Promise<void>;
  onApproveApplication: (
    id: string,
    reviewerName: string,
    tier: 'Maison Accredited' | 'Master Craftsman' | 'Haute Couture Guild',
    comment?: string
  ) => Promise<void>;
  onRejectApplication: (
    id: string,
    reviewerName: string,
    reasonCode: 'INSUFFICIENT_PROOFS' | 'SANCTIONS_FLAG' | 'CRAFTSMANSHIP_MISMATCH' | 'DOCUMENT_EXPIRED' | 'UNRESOLVED_QUERY',
    reasonSummary: string
  ) => Promise<void>;
  onUpdatePillar: (
    id: string,
    pillar: 'identity' | 'business' | 'portfolio',
    status: PillarStatus,
    notes: string
  ) => Promise<void>;
}

export const ManualApprovalWorkflowPanel: React.FC<ManualApprovalWorkflowPanelProps> = ({
  applications,
  selectedApplicationId,
  onSelectApplication,
  statusFilter,
  onStatusFilterChange,
  searchQuery,
  onSearchQueryChange,
  onClaimReview,
  onRequestMoreInformation,
  onApproveApplication,
  onRejectApplication,
  onUpdatePillar,
}) => {
  const [activeTab, setActiveTab] = useState<'identity' | 'business' | 'portfolio' | 'audit'>('identity');

  // Modals for workflow actions
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [approveTier, setApproveTier] = useState<'Maison Accredited' | 'Master Craftsman' | 'Haute Couture Guild'>('Maison Accredited');
  const [approveComment, setApproveComment] = useState('All craftsmanship benchmarks and fiscal clearances verified.');

  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectCode, setRejectCode] = useState<'INSUFFICIENT_PROOFS' | 'SANCTIONS_FLAG' | 'CRAFTSMANSHIP_MISMATCH' | 'DOCUMENT_EXPIRED' | 'UNRESOLVED_QUERY'>('CRAFTSMANSHIP_MISMATCH');
  const [rejectSummary, setRejectSummary] = useState('');

  const [isQueryModalOpen, setIsQueryModalOpen] = useState(false);
  const [queryNotes, setQueryNotes] = useState('Please furnish certified copy of commercial registry extract and updated tax clearance.');
  const [queryDeadlineDays, setQueryDeadlineDays] = useState(14);
  const [queryItemsInput, setQueryItemsInput] = useState('Updated 2026 VAT certificate\nRecent Chamber of Commerce stamped extract\nCutting bench facility photography');

  const selectedApp = applications.find((a) => a.id === selectedApplicationId) || applications[0];

  const filterTabs: (VerificationStatus | 'All')[] = [
    'All',
    'Submitted',
    'Under Review',
    'More Information Required',
    'Approved',
    'Rejected',
  ];

  const handleApproveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;
    await onApproveApplication(selectedApp.id, 'Standards Council Committee', approveTier, approveComment);
    setIsApproveModalOpen(false);
  };

  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;
    await onRejectApplication(selectedApp.id, 'Standards Council Committee', rejectCode, rejectSummary);
    setIsRejectModalOpen(false);
  };

  const handleQuerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;
    const items = queryItemsInput
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((text) => ({
        field: text,
        requirement: 'Submit certified proof or updated document.',
      }));

    await onRequestMoreInformation(
      selectedApp.id,
      'Julian Sterling (Senior Auditor)',
      queryNotes,
      queryDeadlineDays,
      items
    );
    setIsQueryModalOpen(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Sidebar: Application Queue & Filters */}
      <div className="lg:col-span-4 space-y-4">
        {/* Search & Status Filters */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search designer, brand, country..."
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              className="w-full text-xs bg-neutral-950 border border-neutral-700/80 rounded-xl pl-9 pr-3 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 font-sans"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => onStatusFilterChange(tab)}
                className={`text-[11px] font-mono uppercase px-2.5 py-1 rounded-lg transition ${
                  statusFilter === tab
                    ? 'bg-amber-500 text-neutral-950 font-bold shadow'
                    : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Application List */}
        <div className="space-y-2.5 max-h-[720px] overflow-y-auto pr-1">
          {applications.map((app) => {
            const isSelected = app.id === selectedApp?.id;
            return (
              <div
                key={app.id}
                onClick={() => onSelectApplication(app.id)}
                className={`p-3.5 rounded-xl border transition cursor-pointer ${
                  isSelected
                    ? 'bg-neutral-800/90 border-amber-500/80 shadow-md ring-1 ring-amber-500/30'
                    : 'bg-neutral-900/80 border-neutral-800/80 hover:border-neutral-700 hover:bg-neutral-900'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <img
                      src={app.avatarUrl}
                      alt={app.designerName}
                      className="w-10 h-10 rounded-xl object-cover border border-neutral-700"
                    />
                    <div className="min-w-0">
                      <h4 className="text-sm font-medium text-white truncate">
                        {app.brandName}
                      </h4>
                      <p className="text-xs text-neutral-400 truncate">
                        {app.designerName} • {app.business.registeredCountry}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-500 uppercase shrink-0">
                    {app.priority}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between pt-2.5 border-t border-neutral-800/60">
                  <VerificationStatusBadge status={app.status} size="sm" />
                  <span className="text-[10px] font-mono text-neutral-400">
                    {new Date(app.submittedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            );
          })}

          {applications.length === 0 && (
            <div className="p-8 text-center bg-neutral-900/50 border border-neutral-800 rounded-2xl text-xs text-neutral-500">
              No verification dossiers match the active filters.
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Deep Dossier Inspection & Manual Workflow Controls */}
      <div className="lg:col-span-8 space-y-6">
        {selectedApp ? (
          <>
            {/* Dossier Header & Workflow Action Bar */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedApp.avatarUrl}
                    alt={selectedApp.designerName}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-neutral-700"
                  />
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-xl font-serif text-white">{selectedApp.brandName}</h3>
                      <VerificationStatusBadge status={selectedApp.status} size="sm" />
                    </div>
                    <p className="text-xs text-neutral-400 font-mono mt-0.5">
                      Principal: {selectedApp.designerName} • Dossier Ref: {selectedApp.id}
                    </p>
                  </div>
                </div>

                {/* Workflow Buttons */}
                <div className="flex items-center gap-2 flex-wrap">
                  {selectedApp.status === 'Submitted' && (
                    <button
                      onClick={() => onClaimReview(selectedApp.id)}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold tracking-wide transition shadow"
                    >
                      Claim & Begin Audit
                    </button>
                  )}

                  {selectedApp.status !== 'Approved' && (
                    <button
                      onClick={() => setIsApproveModalOpen(true)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold tracking-wide transition shadow inline-flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve & Grant Seal</span>
                    </button>
                  )}

                  {selectedApp.status !== 'More Information Required' && selectedApp.status !== 'Approved' && (
                    <button
                      onClick={() => setIsQueryModalOpen(true)}
                      className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold tracking-wide transition shadow inline-flex items-center gap-1.5"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Request More Info</span>
                    </button>
                  )}

                  {selectedApp.status !== 'Rejected' && (
                    <button
                      onClick={() => setIsRejectModalOpen(true)}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold tracking-wide transition shadow inline-flex items-center gap-1.5"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject Application</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Pillar Tabs */}
              <div className="flex gap-2 border-b border-neutral-800 pb-2">
                {[
                  { id: 'identity', label: 'Pillar I: Identity', icon: UserCheck, status: selectedApp.identity.status },
                  { id: 'business', label: 'Pillar II: Business', icon: Building2, status: selectedApp.business.status },
                  { id: 'portfolio', label: 'Pillar III: Portfolio', icon: Scissors, status: selectedApp.portfolio.status },
                  { id: 'audit', label: 'Audit Trail', icon: FileCheck2 },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isCur = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`inline-flex items-center gap-2 text-xs font-mono uppercase px-3 py-2 rounded-lg transition ${
                        isCur
                          ? 'bg-neutral-800 text-amber-400 font-semibold'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                      {tab.status && (
                        <span className={`w-2 h-2 rounded-full ${
                          tab.status === 'verified' ? 'bg-emerald-400' : tab.status === 'flagged' ? 'bg-orange-400' : 'bg-neutral-500'
                        }`} />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Pillar Inspection Body */}
              {activeTab === 'identity' && (
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-white">Government ID & Biometric Verification</h4>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onUpdatePillar(selectedApp.id, 'identity', 'verified', 'ID validated.')}
                        className="text-[11px] font-mono px-2.5 py-1 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-700/60 hover:bg-emerald-900"
                      >
                        Mark Verified
                      </button>
                      <button
                        onClick={() => onUpdatePillar(selectedApp.id, 'identity', 'flagged', 'Flagged for re-scan.')}
                        className="text-[11px] font-mono px-2.5 py-1 rounded bg-orange-950/60 text-orange-300 border border-orange-700/60 hover:bg-orange-900"
                      >
                        Flag Clarification
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2">
                      <div className="text-neutral-400 font-mono">Full Name:</div>
                      <div className="text-white font-medium">{selectedApp.identity.fullName}</div>
                    </div>
                    <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2">
                      <div className="text-neutral-400 font-mono">Date of Birth & Nationality:</div>
                      <div className="text-white font-medium">{selectedApp.identity.dateOfBirth} ({selectedApp.identity.nationality})</div>
                    </div>
                    <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2">
                      <div className="text-neutral-400 font-mono">ID Type & Masked Number:</div>
                      <div className="text-white font-mono uppercase">{selectedApp.identity.idType} - {selectedApp.identity.idNumberMasked}</div>
                    </div>
                    <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2">
                      <div className="text-neutral-400 font-mono">Facial Biometrics & Sanctions:</div>
                      <div className="text-emerald-400 font-mono">
                        Biometric score {selectedApp.identity.biometricVerificationScore || 99}% • Sanctions Clear
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2 text-xs">
                    <span className="text-neutral-400 font-mono block">Document Proof URLs:</span>
                    <div className="flex flex-col gap-1 text-neutral-300 font-mono text-[11px]">
                      <a href={selectedApp.identity.idDocumentUrl} target="_blank" rel="noreferrer" className="text-amber-400 hover:underline flex items-center gap-1.5">
                        <ExternalLink className="w-3 h-3" />
                        ID Document File: {selectedApp.identity.idDocumentUrl}
                      </a>
                      <a href={selectedApp.identity.proofOfAddressUrl} target="_blank" rel="noreferrer" className="text-amber-400 hover:underline flex items-center gap-1.5">
                        <ExternalLink className="w-3 h-3" />
                        Proof of Address File: {selectedApp.identity.proofOfAddressUrl}
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'business' && (
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-white">Commercial Registry & Atelier Workshop</h4>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onUpdatePillar(selectedApp.id, 'business', 'verified', 'Business incorporation confirmed.')}
                        className="text-[11px] font-mono px-2.5 py-1 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-700/60 hover:bg-emerald-900"
                      >
                        Mark Verified
                      </button>
                      <button
                        onClick={() => onUpdatePillar(selectedApp.id, 'business', 'flagged', 'Fiscal registration query.')}
                        className="text-[11px] font-mono px-2.5 py-1 rounded bg-orange-950/60 text-orange-300 border border-orange-700/60 hover:bg-orange-900"
                      >
                        Flag Clarification
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 space-y-1.5">
                      <span className="text-neutral-400 font-mono">Entity & Trade Name:</span>
                      <p className="text-white font-medium">{selectedApp.business.legalEntityName} ({selectedApp.business.tradeName})</p>
                    </div>
                    <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 space-y-1.5">
                      <span className="text-neutral-400 font-mono">Registration & Tax/VAT:</span>
                      <p className="text-amber-300 font-mono">{selectedApp.business.registrationNumber} • {selectedApp.business.taxVatNumber}</p>
                    </div>
                    <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 space-y-1.5">
                      <span className="text-neutral-400 font-mono">Registered Address:</span>
                      <p className="text-neutral-200">{selectedApp.business.registeredAddress}</p>
                    </div>
                    <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 space-y-1.5">
                      <span className="text-neutral-400 font-mono">Craftsmanship Atelier Address:</span>
                      <p className="text-neutral-200">{selectedApp.business.workshopAddress}</p>
                    </div>
                  </div>

                  {selectedApp.business.atelierFacilityPhotos.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-xs font-mono text-neutral-400 uppercase">Atelier Workshop Facility Photos</span>
                      <div className="grid grid-cols-2 gap-3">
                        {selectedApp.business.atelierFacilityPhotos.map((img, i) => (
                          <img
                            key={i}
                            src={img}
                            alt="Facility"
                            className="w-full h-36 object-cover rounded-xl border border-neutral-800"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'portfolio' && (
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-white">Artisanal Portfolio & Haute Craftsmanship Works</h4>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onUpdatePillar(selectedApp.id, 'portfolio', 'verified', 'Couture standards met.')}
                        className="text-[11px] font-mono px-2.5 py-1 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-700/60 hover:bg-emerald-900"
                      >
                        Mark Verified
                      </button>
                      <button
                        onClick={() => onUpdatePillar(selectedApp.id, 'portfolio', 'rejected', 'Fails couture criteria.')}
                        className="text-[11px] font-mono px-2.5 py-1 rounded bg-rose-950/60 text-rose-300 border border-rose-700/60 hover:bg-rose-900"
                      >
                        Reject Craftsmanship
                      </button>
                    </div>
                  </div>

                  <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 text-xs space-y-2">
                    <span className="text-neutral-400 font-mono block">Heritage & Atelier Bio:</span>
                    <p className="text-neutral-200 leading-relaxed">{selectedApp.portfolio.bioAndHeritage}</p>
                    <div className="flex gap-4 pt-2 font-mono text-neutral-400 text-[11px]">
                      <span>Experience: <strong className="text-white">{selectedApp.portfolio.yearsInPractice} yrs</strong></span>
                      <span>Studio: <strong className="text-white">{selectedApp.portfolio.atelierCity}, {selectedApp.portfolio.atelierCountry}</strong></span>
                    </div>
                  </div>

                  {/* Works Showcase */}
                  <div className="space-y-3">
                    <span className="text-xs font-mono text-neutral-400 uppercase">Master Tailoring Works ({selectedApp.portfolio.works.length})</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedApp.portfolio.works.map((work) => (
                        <div key={work.id} className="p-3.5 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2.5 text-xs">
                          <img
                            src={work.imageUrl}
                            alt={work.title}
                            className="w-full h-40 object-cover rounded-lg border border-neutral-800"
                          />
                          <div>
                            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-950/40 text-amber-300 border border-amber-800/60">
                              {work.category}
                            </span>
                            <h5 className="text-sm font-medium text-white mt-1.5">{work.title}</h5>
                          </div>
                          <div className="text-[11px] text-neutral-400">
                            <strong>Techniques:</strong> {work.craftTechniques.join(', ')}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'audit' && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-sm font-semibold text-white">Application Ledger</h4>
                  {selectedApp.auditTrail.map((log) => (
                    <div key={log.id} className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-xs flex justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-amber-400 font-mono font-medium">[{log.actorRole}]</span>
                          <span className="text-white font-medium">{log.actorName}</span>
                          <span className="text-neutral-500 text-[11px] font-mono">{new Date(log.timestamp).toLocaleString()}</span>
                        </div>
                        <p className="text-neutral-300 mt-1">{log.comment}</p>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-400 shrink-0 self-start">
                        {log.toStatus}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="p-12 text-center bg-neutral-900 border border-neutral-800 rounded-2xl text-neutral-400">
            Select an application from the queue to inspect verification pillars.
          </div>
        )}
      </div>

      {/* Modal: Approve Application & Issue Seal */}
      {isApproveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-neutral-900 border border-neutral-700 rounded-2xl p-6 text-white space-y-4 shadow-2xl">
            <h3 className="text-lg font-serif text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-400" />
              Issue Daniel’s Maison Accreditation Seal
            </h3>
            <form onSubmit={handleApproveSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-400 font-mono mb-1">Accreditation Guild Tier</label>
                <select
                  value={approveTier}
                  onChange={(e) => setApproveTier(e.target.value as any)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-white"
                >
                  <option value="Maison Accredited">Maison Accredited</option>
                  <option value="Master Craftsman">Master Craftsman</option>
                  <option value="Haute Couture Guild">Haute Couture Guild</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-400 font-mono mb-1">Council Audit Comment</label>
                <textarea
                  rows={3}
                  value={approveComment}
                  onChange={(e) => setApproveComment(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsApproveModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-neutral-700 text-neutral-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-500 text-neutral-950 font-bold hover:bg-emerald-400"
                >
                  Grant Accreditation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Request More Information */}
      {isQueryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-neutral-900 border border-neutral-700 rounded-2xl p-6 text-white space-y-4 shadow-2xl">
            <h3 className="text-lg font-serif text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-400" />
              Request Supplemental Documentation
            </h3>
            <form onSubmit={handleQuerySubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-400 font-mono mb-1">Council Clarification Note</label>
                <textarea
                  rows={3}
                  value={queryNotes}
                  onChange={(e) => setQueryNotes(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-neutral-400 font-mono mb-1">Requested Items (one per line)</label>
                <textarea
                  rows={3}
                  value={queryItemsInput}
                  onChange={(e) => setQueryItemsInput(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-neutral-400 font-mono mb-1">Response Deadline (Days)</label>
                <input
                  type="number"
                  value={queryDeadlineDays}
                  onChange={(e) => setQueryDeadlineDays(Number(e.target.value))}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-white font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsQueryModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-neutral-700 text-neutral-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-orange-500 text-neutral-950 font-bold hover:bg-orange-400"
                >
                  Dispatch Query to Designer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Reject Application */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-neutral-900 border border-neutral-700 rounded-2xl p-6 text-white space-y-4 shadow-2xl">
            <h3 className="text-lg font-serif text-white flex items-center gap-2">
              <XCircle className="w-5 h-5 text-rose-400" />
              Reject Verification Application
            </h3>
            <form onSubmit={handleRejectSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-400 font-mono mb-1">Rejection Standard Reason Code</label>
                <select
                  value={rejectCode}
                  onChange={(e) => setRejectCode(e.target.value as any)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-white"
                >
                  <option value="CRAFTSMANSHIP_MISMATCH">CRAFTSMANSHIP_MISMATCH (Offshore/Fast fashion assembly)</option>
                  <option value="INSUFFICIENT_PROOFS">INSUFFICIENT_PROOFS (Missing official registries)</option>
                  <option value="SANCTIONS_FLAG">SANCTIONS_FLAG (Screening alert)</option>
                  <option value="DOCUMENT_EXPIRED">DOCUMENT_EXPIRED (Invalid expired identification)</option>
                  <option value="UNRESOLVED_QUERY">UNRESOLVED_QUERY (Failed response deadline)</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-400 font-mono mb-1">Council Audit Notes & Guidance</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detail the standards shortcomings for the applicant..."
                  value={rejectSummary}
                  onChange={(e) => setRejectSummary(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRejectModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-neutral-700 text-neutral-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!rejectSummary.trim()}
                  className="px-4 py-2 rounded-lg bg-rose-600 text-white font-bold hover:bg-rose-500 disabled:opacity-50"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
