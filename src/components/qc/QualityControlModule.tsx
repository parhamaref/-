/**
 * @file QualityControlModule.tsx
 * Master Enterprise Quality Control Cockpit for Daniel’s Maison Haute Couture.
 *
 * Implements:
 * - 5 Feature Pillars:
 *   1. Inspection Checklist
 *   2. Garment Measurements Verification
 *   3. Fabric Verification
 *   4. Finish Inspection
 *   5. Packaging Inspection
 * - 3 Official Decision Results:
 *   - Pass (Digital Certificate, Seal Hash, Diplomatic Dispatch)
 *   - Fail (Quarantine, Fabric Claim, Scrapped Piece)
 *   - Rework Required (Tailor Routing, SLA Deadline, Remediation Ticket)
 * - 5 Storage Pillars:
 *   - Defects
 *   - Corrective Actions
 *   - QC Photos
 *   - QC Notes
 *   - Approval Records
 */

import React, { useState } from 'react';
import { useQualityControlStore, QCActiveTab } from '../../stores/qualityControlStore';
import { QCInspectionChecklist } from './QCInspectionChecklist';
import { QCGarmentMeasurements } from './QCGarmentMeasurements';
import { QCFabricVerificationBench } from './QCFabricVerification';
import { QCFinishInspectionBench } from './QCFinishInspection';
import { QCPackagingInspectionBench } from './QCPackagingInspection';
import { QCDefectsManager } from './QCDefectsManager';
import { QCPhotoEvidenceVault } from './QCPhotoEvidenceVault';
import { QCNotesViewer } from './QCNotesViewer';
import { QCAnalyticsView } from './QCAnalyticsView';
import { QCApprovalModal } from './QCApprovalModal';
import { QCNewSessionModal } from './QCNewSessionModal';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Ruler,
  Layers,
  Sparkles,
  Package,
  Camera,
  MessageSquare,
  BarChart3,
  Award,
  Plus,
  RotateCcw,
  Search,
  Download,
  Printer,
  ChevronRight,
  Lock,
  Tag,
  Check,
} from 'lucide-react';
import { useDesignerStore } from '../../stores/designerStore';

export const QualityControlModule: React.FC = () => {
  const { setActiveSection } = useDesignerStore();
  const {
    sessions,
    activeSession,
    activeSessionId,
    activeTab,
    resultFilter,
    searchQuery,
    isApprovalModalOpen,
    isNewSessionModalOpen,
    notification,
    setActiveSessionId,
    setActiveTab,
    setResultFilter,
    setSearchQuery,
    setModalOpen,
    updateChecklistItem,
    addChecklistItem,
    updateMeasurement,
    addMeasurement,
    updateFabric,
    updateFinish,
    updatePackaging,
    logDefect,
    resolveDefect,
    updateCorrectiveAction,
    addPhoto,
    addNote,
    issueDecision,
    createSession,
    resetToMock,
    showNotification,
  } = useQualityControlStore();

  const [showCertificateModal, setShowCertificateModal] = useState(false);

  // Filter sessions
  const filteredSessions = sessions.filter((s) => {
    if (resultFilter !== 'ALL' && s.result !== resultFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
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

  // Calculate summary counts
  const totalSessions = sessions.length;
  const passCount = sessions.filter((s) => s.result === 'Pass').length;
  const reworkCount = sessions.filter((s) => s.result === 'Rework Required').length;
  const failCount = sessions.filter((s) => s.result === 'Fail').length;
  const openDefectsTotal = sessions.reduce(
    (sum, s) => sum + s.defects.filter((d) => !d.resolved).length,
    0
  );

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(activeSession, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${activeSession?.orderId || 'QC'}_Dossier.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showNotification('QC Dossier JSON exported successfully.');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#E0E0E0] select-none font-sans pb-16">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xs border text-[11px] font-mono shadow-2xl flex items-center gap-2.5 transition-all animate-slideIn ${
            notification.type === 'error'
              ? 'bg-rose-950/90 border-rose-500/80 text-rose-200'
              : notification.type === 'info'
              ? 'bg-amber-950/90 border-amber-500/80 text-amber-200'
              : 'bg-emerald-950/90 border-emerald-500/80 text-emerald-200'
          }`}
        >
          {notification.type === 'error' ? (
            <XCircle className="w-4 h-4 shrink-0 text-rose-400" />
          ) : notification.type === 'info' ? (
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
          ) : (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Top Cockpit Header */}
      <header className="border-b border-[#222] bg-[#070707] px-4 sm:px-8 py-5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-400">
                DANIEL’S MAISON QUALITY ASSURANCE BENCH
              </span>
              <span className="text-[9px] bg-neutral-800 text-neutral-300 font-mono px-2 py-0.5 rounded-xs">
                SPEC V3.4
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl text-white font-bold tracking-wider uppercase">
              ADVANCED QUALITY CONTROL SYSTEM
            </h1>
            <p className="text-[11px] text-neutral-400 max-w-2xl mt-0.5 font-sans">
              Millimeter tolerance verification, spectrophotometer textile authentication, construction finish benchmarks, and white-glove packaging certification.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setActiveSection('rework')}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-600/20 border border-amber-600/40 text-amber-300 font-mono text-[10px] font-bold uppercase rounded-xs hover:bg-amber-600/30 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" /> Rework Workflow ({reworkCount})
            </button>
            <button
              onClick={() => setModalOpen('newSession', true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-white text-black font-mono text-[10px] font-bold uppercase rounded-xs hover:bg-neutral-200 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Commission Inspection
            </button>
            <button
              onClick={() => setModalOpen('approval', true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-[10px] font-bold uppercase rounded-xs transition-colors cursor-pointer"
            >
              <Award className="w-3.5 h-3.5" /> Seal Decision
            </button>
            <button
              onClick={handleExportJson}
              title="Export Dossier JSON"
              className="p-2 border border-[#333] hover:border-neutral-500 text-neutral-300 hover:text-white rounded-xs transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={resetToMock}
              title="Reset Mock Data"
              className="p-2 border border-[#333] hover:border-neutral-500 text-neutral-300 hover:text-white rounded-xs transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* KPI Ribbon Strip */}
      <section className="bg-[#0A0A0A] border-b border-[#222] px-4 sm:px-8 py-3 font-mono text-[11px]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-neutral-500 uppercase text-[9.5px]">FIRST-PASS YIELD:</span>
              <span className="text-emerald-400 font-bold text-sm">
                {Math.round((passCount / (totalSessions || 1)) * 100)}%
              </span>
            </div>
            <div className="flex items-center gap-2 pl-4 border-l border-[#222]">
              <span className="text-neutral-500 uppercase text-[9.5px]">ACTIVE COMMISSIONS:</span>
              <span className="text-white font-bold">{totalSessions}</span>
            </div>
            <div className="flex items-center gap-2 pl-4 border-l border-[#222]">
              <span className="text-neutral-500 uppercase text-[9.5px]">PASS RATE:</span>
              <span className="text-emerald-400 font-bold">{passCount} PASS</span>
            </div>
            <div className="flex items-center gap-2 pl-4 border-l border-[#222]">
              <span className="text-neutral-500 uppercase text-[9.5px]">REWORK QUEUE:</span>
              <span className="text-amber-400 font-bold">{reworkCount} REWORK</span>
            </div>
            <div className="flex items-center gap-2 pl-4 border-l border-[#222]">
              <span className="text-neutral-500 uppercase text-[9.5px]">QUARANTINED:</span>
              <span className="text-rose-400 font-bold">{failCount} FAIL</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-rose-400 font-bold text-[10px]">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{openDefectsTotal} OPEN DEFECTS ACROSS SYSTEM</span>
          </div>
        </div>
      </section>

      {/* Main Workbench Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-6 space-y-6">
        {/* Session Selector & Active Piece Banner */}
        <div className="bg-[#0D0D0D] border border-[#222] p-5 rounded-xs space-y-4">
          {/* Filter & Order Selector */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1E1E1E] pb-4">
            {/* Search & Selector */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter order, client, garment..."
                  className="bg-black border border-[#282828] text-white pl-8 pr-3 py-1.5 text-[10.5px] font-mono rounded-xs w-48 sm:w-60 outline-none focus:border-white"
                />
              </div>

              <select
                value={activeSessionId || ''}
                onChange={(e) => setActiveSessionId(e.target.value)}
                className="bg-black border border-[#282828] text-white py-1.5 px-3 text-[10.5px] font-mono rounded-xs outline-none focus:border-white cursor-pointer"
              >
                {filteredSessions.map((s) => (
                  <option key={s.id} value={s.id}>
                    [{s.result.toUpperCase()}] {s.orderId} — {s.garmentName} ({s.clientName})
                  </option>
                ))}
              </select>
            </div>

            {/* Result Filter Tabs */}
            <div className="flex items-center gap-1.5 font-mono text-[10px]">
              <span className="text-[9px] text-neutral-500 uppercase mr-1">FILTER:</span>
              <button
                onClick={() => setResultFilter('ALL')}
                className={`px-2.5 py-1 rounded-xs uppercase tracking-wider cursor-pointer ${
                  resultFilter === 'ALL'
                    ? 'bg-white text-black font-bold'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white border border-[#222]'
                }`}
              >
                ALL ({totalSessions})
              </button>
              <button
                onClick={() => setResultFilter('Pass')}
                className={`px-2.5 py-1 rounded-xs uppercase tracking-wider cursor-pointer ${
                  resultFilter === 'Pass'
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'bg-neutral-900 text-emerald-400 hover:text-white border border-[#222]'
                }`}
              >
                PASS ({passCount})
              </button>
              <button
                onClick={() => setResultFilter('Rework Required')}
                className={`px-2.5 py-1 rounded-xs uppercase tracking-wider cursor-pointer ${
                  resultFilter === 'Rework Required'
                    ? 'bg-amber-600 text-white font-bold'
                    : 'bg-neutral-900 text-amber-400 hover:text-white border border-[#222]'
                }`}
              >
                REWORK ({reworkCount})
              </button>
              <button
                onClick={() => setResultFilter('Fail')}
                className={`px-2.5 py-1 rounded-xs uppercase tracking-wider cursor-pointer ${
                  resultFilter === 'Fail'
                    ? 'bg-rose-600 text-white font-bold'
                    : 'bg-neutral-900 text-rose-400 hover:text-white border border-[#222]'
                }`}
              >
                FAIL ({failCount})
              </button>
            </div>
          </div>

          {/* Active Piece Dossier Metadata Card */}
          {activeSession && (
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-1">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-bold text-white tracking-wider">
                    {activeSession.orderId}
                  </span>
                  {/* Status Badge */}
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-xs text-[10px] font-mono font-bold uppercase tracking-wider ${
                      activeSession.result === 'Pass'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : activeSession.result === 'Rework Required'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                    }`}
                  >
                    {activeSession.result === 'Pass' && <CheckCircle2 className="w-3.5 h-3.5" />}
                    {activeSession.result === 'Rework Required' && (
                      <AlertTriangle className="w-3.5 h-3.5" />
                    )}
                    {activeSession.result === 'Fail' && <XCircle className="w-3.5 h-3.5" />}
                    {activeSession.result}
                  </span>
                  <span className="text-[10px] font-mono text-neutral-400 uppercase">
                    Status: {activeSession.status}
                  </span>
                </div>
                <h2 className="font-serif text-xl sm:text-2xl text-white font-bold uppercase tracking-wide">
                  {activeSession.garmentName}
                </h2>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-neutral-400 font-mono">
                  <span>Client: <strong className="text-neutral-200">{activeSession.clientName}</strong></span>
                  <span>Silhouette: <strong className="text-neutral-200">{activeSession.garmentSilhouette}</strong></span>
                  <span>Workshop: <strong className="text-neutral-200">{activeSession.partnerAtelier}</strong></span>
                  <span>Commission: <strong className="text-emerald-400">£{activeSession.orderTotal.toLocaleString()}</strong></span>
                </div>
              </div>

              {/* Inspector Badge & Certificate Seal Trigger */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="bg-[#141414] border border-[#2B2B2B] p-3 rounded-xs text-right font-mono text-[10px]">
                  <span className="text-[8.5px] text-neutral-500 uppercase block">CERTIFIED INSPECTOR</span>
                  <span className="text-white font-bold block">{activeSession.inspectorName}</span>
                  <span className="text-emerald-400 text-[8.5px] block mt-0.5">
                    BADGE: {activeSession.inspectorId}
                  </span>
                </div>

                {activeSession.approvalRecord && (
                  <button
                    onClick={() => setShowCertificateModal(true)}
                    className="p-3 bg-neutral-900 hover:bg-neutral-800 border border-white/20 text-white rounded-xs flex flex-col items-center justify-center cursor-pointer transition-colors"
                    title="View Authenticity Certificate"
                  >
                    <Award className="w-5 h-5 text-amber-400" />
                    <span className="text-[8px] font-mono uppercase mt-1">CERTIFICATE</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Feature & Storage Navigation Tabs */}
        <div className="border-b border-[#222] flex items-center gap-1 overflow-x-auto pb-px scrollbar-none font-mono text-[10.5px]">
          {/* Feature Pillars */}
          <button
            onClick={() => setActiveTab('checklist')}
            className={`flex items-center gap-2 px-4 py-2.5 border-b-2 uppercase tracking-wider whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'checklist'
                ? 'border-white text-white font-bold bg-white/5'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" /> 1. Inspection Checklist ({activeSession?.checklist.length || 0})
          </button>

          <button
            onClick={() => setActiveTab('measurements')}
            className={`flex items-center gap-2 px-4 py-2.5 border-b-2 uppercase tracking-wider whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'measurements'
                ? 'border-white text-white font-bold bg-white/5'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Ruler className="w-3.5 h-3.5" /> 2. Garment Measurements ({activeSession?.measurements.length || 0})
          </button>

          <button
            onClick={() => setActiveTab('fabric')}
            className={`flex items-center gap-2 px-4 py-2.5 border-b-2 uppercase tracking-wider whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'fabric'
                ? 'border-white text-white font-bold bg-white/5'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> 3. Fabric Verification
          </button>

          <button
            onClick={() => setActiveTab('finish')}
            className={`flex items-center gap-2 px-4 py-2.5 border-b-2 uppercase tracking-wider whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'finish'
                ? 'border-white text-white font-bold bg-white/5'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> 4. Finish Inspection
          </button>

          <button
            onClick={() => setActiveTab('packaging')}
            className={`flex items-center gap-2 px-4 py-2.5 border-b-2 uppercase tracking-wider whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'packaging'
                ? 'border-white text-white font-bold bg-white/5'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Package className="w-3.5 h-3.5" /> 5. Packaging Inspection
          </button>

          {/* Storage & Intelligence Pillars */}
          <button
            onClick={() => setActiveTab('defects')}
            className={`flex items-center gap-2 px-4 py-2.5 border-b-2 uppercase tracking-wider whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'defects'
                ? 'border-white text-white font-bold bg-white/5'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> Defects & Actions ({activeSession?.defects.length || 0})
          </button>

          <button
            onClick={() => setActiveTab('photos')}
            className={`flex items-center gap-2 px-4 py-2.5 border-b-2 uppercase tracking-wider whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'photos'
                ? 'border-white text-white font-bold bg-white/5'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5" /> QC Photos ({activeSession?.photos.length || 0})
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className={`flex items-center gap-2 px-4 py-2.5 border-b-2 uppercase tracking-wider whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'notes'
                ? 'border-white text-white font-bold bg-white/5'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" /> Audit Notes ({activeSession?.notes.length || 0})
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-4 py-2.5 border-b-2 uppercase tracking-wider whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'analytics'
                ? 'border-white text-white font-bold bg-white/5'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-emerald-400" /> Quality Analytics
          </button>
        </div>

        {/* Tab Content Display */}
        {activeSession && (
          <div className="animate-fadeIn">
            {activeTab === 'checklist' && (
              <QCInspectionChecklist
                checklist={activeSession.checklist}
                onUpdateItem={updateChecklistItem}
                onAddItem={addChecklistItem}
              />
            )}

            {activeTab === 'measurements' && (
              <QCGarmentMeasurements
                measurements={activeSession.measurements}
                onUpdateMeasurement={updateMeasurement}
                onAddMeasurement={addMeasurement}
              />
            )}

            {activeTab === 'fabric' && (
              <QCFabricVerificationBench
                fabric={activeSession.fabricVerification}
                onUpdateFabric={updateFabric}
              />
            )}

            {activeTab === 'finish' && (
              <QCFinishInspectionBench
                finish={activeSession.finishInspection}
                onUpdateFinish={updateFinish}
              />
            )}

            {activeTab === 'packaging' && (
              <QCPackagingInspectionBench
                packaging={activeSession.packagingInspection}
                onUpdatePackaging={updatePackaging}
              />
            )}

            {activeTab === 'defects' && (
              <QCDefectsManager
                defects={activeSession.defects}
                correctiveActions={activeSession.correctiveActions}
                onLogDefect={logDefect}
                onResolveDefect={resolveDefect}
                onUpdateAction={updateCorrectiveAction}
              />
            )}

            {activeTab === 'photos' && (
              <QCPhotoEvidenceVault
                photos={activeSession.photos}
                onAddPhoto={addPhoto}
              />
            )}

            {activeTab === 'notes' && (
              <QCNotesViewer
                notes={activeSession.notes}
                onAddNote={addNote}
              />
            )}

            {activeTab === 'analytics' && (
              <QCAnalyticsView sessions={sessions} />
            )}
          </div>
        )}
      </main>

      {/* Decision Modal */}
      {activeSession && (
        <QCApprovalModal
          session={activeSession}
          isOpen={isApprovalModalOpen}
          onClose={() => setModalOpen('approval', false)}
          onIssueDecision={issueDecision}
        />
      )}

      {/* Commission Session Modal */}
      <QCNewSessionModal
        isOpen={isNewSessionModalOpen}
        onClose={() => setModalOpen('newSession', false)}
        onCreateSession={createSession}
      />

      {/* Authenticity Certificate Modal */}
      {showCertificateModal && activeSession?.approvalRecord && (
        <div
          onClick={() => setShowCertificateModal(false)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0B0B0B] border-2 border-amber-500/60 p-8 sm:p-10 max-w-xl w-full text-center space-y-6 shadow-2xl rounded-xs animate-scaleUp font-serif relative"
          >
            <button
              onClick={() => setShowCertificateModal(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white font-mono text-sm"
            >
              ✕
            </button>

            {/* Crest */}
            <div className="w-16 h-16 border-2 border-amber-400/80 rounded-full mx-auto flex items-center justify-center text-amber-300">
              <Award className="w-8 h-8" />
            </div>

            <div className="border-b border-[#222] pb-4 space-y-1">
              <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-neutral-400 block">
                DANIEL’S MAISON HAUTE COUTURE
              </span>
              <h2 className="text-2xl text-white font-bold tracking-widest uppercase">
                CERTIFICATE OF COUTURE ATELIER AUTHENTICITY
              </h2>
              <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-widest block font-bold">
                RESULT: {activeSession.approvalRecord.finalResult}
              </span>
            </div>

            <div className="font-mono text-[10px] text-neutral-300 text-left space-y-2.5 bg-black/60 p-4 border border-[#222] rounded-xs">
              <div className="flex justify-between">
                <span className="text-neutral-500 uppercase">COMMISSION ORDER:</span>
                <span className="text-white font-bold">{activeSession.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500 uppercase">PATRON:</span>
                <span className="text-white font-bold">{activeSession.clientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500 uppercase">GARMENT SPECIMEN:</span>
                <span className="text-white font-bold">{activeSession.garmentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500 uppercase">SERIAL NUMBER:</span>
                <span className="text-amber-400 font-bold">{activeSession.approvalRecord.garmentSerialNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500 uppercase">CERTIFICATE NUMBER:</span>
                <span className="text-white font-bold">{activeSession.approvalRecord.authenticityCertificateNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500 uppercase">COMPLIANCE PROTOCOL:</span>
                <span className="text-neutral-200">{activeSession.approvalRecord.complianceStandard}</span>
              </div>
              <div className="flex justify-between border-t border-[#1C1C1C] pt-2">
                <span className="text-neutral-500 uppercase">CERTIFIED INSPECTOR:</span>
                <span className="text-white font-bold">{activeSession.approvalRecord.certifiedInspectorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500 uppercase">INSPECTOR ACCREDITATION:</span>
                <span className="text-emerald-400 font-bold">{activeSession.approvalRecord.inspectorBadgeNumber}</span>
              </div>
              <div className="border-t border-[#1C1C1C] pt-2">
                <span className="text-neutral-500 uppercase block text-[8px] mb-0.5">DIGITAL CRYPTOGRAPHIC HASH:</span>
                <span className="text-neutral-400 text-[8px] break-all block font-mono">
                  {activeSession.approvalRecord.digitalSealHash}
                </span>
              </div>
            </div>

            <div className="flex justify-center gap-3 font-mono text-[10px]">
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-white text-black font-bold uppercase rounded-xs hover:bg-neutral-200 cursor-pointer flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" /> Print Certificate
              </button>
              <button
                onClick={() => setShowCertificateModal(false)}
                className="px-4 py-2 border border-[#333] text-neutral-300 hover:text-white rounded-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
