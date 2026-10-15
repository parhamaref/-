/**
 * @file CustomerDesignApprovalModal.tsx
 * Bespoke Pre-Production Design Approval Modal & Review Dossier.
 *
 * Implements:
 * 1. Design Sketches review (CAD & artistic illustration with interactive pins)
 * 2. Fabric Selection review (Mill, composition, weight, weave, swatch)
 * 3. Color Selection review (Primary cloth, Pantone, lining silk, thread contrast)
 * 4. Measurements review (Full anatomical matrix, tolerances, posture notes)
 * 5. Custom Requests review (Monogram, lapel, horn buttons, pockets, canvas)
 *
 * Actions:
 * - Approve Design (with legal declaration & digital signature)
 * - Reject Design (with reason & consultation petition)
 * - Request Revision (multi-component change petition)
 *
 * Requirements:
 * - Version History (v1.0, v1.1 with diff comparison)
 * - Approval Logs (Immutable sign-off records)
 * - Revision Tracking (Threaded items & atelier responses)
 * - Audit Trail (Chronological lifecycle events)
 * - Timestamp Tracking (Turnaround SLA countdown)
 */

import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  AlertCircle,
  Clock,
  Scissors,
  Sparkles,
  Layers,
  FileText,
  ShieldCheck,
  ChevronRight,
  Eye,
  RotateCcw,
  Sliders,
  Send,
  AlertTriangle,
  History,
  Check,
  ZoomIn,
  Palette,
  Ruler,
  Tag,
  ArrowRight,
  RefreshCw,
  Plus,
} from 'lucide-react';
import {
  DesignApprovalPackage,
  CustomerReviewComponent,
  DesignApprovalWorkflowStage,
  SubmitRevisionPayload,
  ApproveDesignPayload,
  RejectDesignPayload,
} from '../../types/designApproval.types';
import { useDesignApprovalStore } from '../../stores/designApprovalStore';

interface CustomerDesignApprovalModalProps {
  packageData: DesignApprovalPackage | null;
  isOpen: boolean;
  onClose: () => void;
  onApprovedSuccess?: () => void;
}

type TabKey =
  | 'SKETCHES'
  | 'FABRIC'
  | 'COLOR'
  | 'MEASUREMENTS'
  | 'CUSTOM_REQUESTS'
  | 'VERSIONS'
  | 'REVISIONS'
  | 'AUDIT_LOGS';

const STAGE_CONFIG: Record<
  DesignApprovalWorkflowStage,
  { label: string; color: string; border: string; desc: string }
> = {
  DRAFT: {
    label: '1. Draft in Atelier',
    color: 'bg-neutral-800 text-neutral-300',
    border: 'border-neutral-700',
    desc: 'Atelier design team is curating the initial specification.',
  },
  SUBMITTED: {
    label: '2. Awaiting Your Approval',
    color: 'bg-amber-500/15 text-amber-300',
    border: 'border-amber-500/40',
    desc: 'Formal pre-production review package ready for your inspection.',
  },
  REVISION_REQUESTED: {
    label: '3. Revision Requested',
    color: 'bg-purple-500/15 text-purple-300',
    border: 'border-purple-500/40',
    desc: 'Your requested adjustments are being drafted by the Creative Director.',
  },
  UPDATED: {
    label: '4. Updated Specification',
    color: 'bg-blue-500/15 text-blue-300',
    border: 'border-blue-500/40',
    desc: 'New version drafted incorporating your revisions. Ready for re-review.',
  },
  APPROVED: {
    label: '5. Design Approved',
    color: 'bg-emerald-500/20 text-emerald-300',
    border: 'border-emerald-500/50',
    desc: 'Specification locked and digitally signed. Ready for cutting bench release.',
  },
  PRODUCTION: {
    label: '6. In Production',
    color: 'bg-emerald-600 text-white',
    border: 'border-emerald-400',
    desc: 'Artisans on the workshop bench are hand-crafting your bespoke garment.',
  },
  REJECTED: {
    label: 'Commission Closed',
    color: 'bg-red-500/20 text-red-300',
    border: 'border-red-500/40',
    desc: 'Commission design declined. Concierge director assigned.',
  },
};

export const CustomerDesignApprovalModal: React.FC<CustomerDesignApprovalModalProps> = ({
  packageData,
  isOpen,
  onClose,
  onApprovedSuccess,
}) => {
  const {
    approveDesign,
    rejectDesign,
    submitRevision,
    releaseToProduction,
    updateVersion,
    isLoading,
  } = useDesignApprovalStore();

  const [activeTab, setActiveTab] = useState<TabKey>('SKETCHES');
  const [selectedSketchIndex, setSelectedSketchIndex] = useState(0);
  const [selectedVersionCompare, setSelectedVersionCompare] = useState<string | null>(null);

  // Action Modals State
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [signatureText, setSignatureText] = useState('Lord Alistair Sterling-Fox');
  const [declarationAccepted, setDeclarationAccepted] = useState(false);
  const [approvalNotes, setApprovalNotes] = useState('');

  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [revisionComponent, setRevisionComponent] = useState<CustomerReviewComponent>('FABRIC');
  const [revisionTitle, setRevisionTitle] = useState('');
  const [revisionComment, setRevisionComment] = useState('');
  const [revisionChanges, setRevisionChanges] = useState('');

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectionAction, setRejectionAction] = useState<
    'REFUND_DEPOSIT' | 'START_OVER_NEW_CONCEPT' | 'SPEAK_WITH_DIRECTOR'
  >('SPEAK_WITH_DIRECTOR');

  const [statusNotification, setStatusNotification] = useState<string | null>(null);

  if (!isOpen || !packageData) return null;

  const currentVersionSpec = packageData.currentSpec;
  const isActionable =
    packageData.currentStage === 'SUBMITTED' || packageData.currentStage === 'UPDATED';

  // Handle Approving Design
  const handleConfirmApproval = async () => {
    if (!declarationAccepted) {
      alert('Please check the legal confirmation checkbox to proceed.');
      return;
    }
    if (!signatureText.trim()) {
      alert('Please provide your digital signature name.');
      return;
    }

    try {
      const payload: ApproveDesignPayload = {
        packageId: packageData.id,
        customerName: packageData.customerName,
        customerEmail: packageData.customerEmail,
        digitalSignature: signatureText.trim(),
        declarationAccepted: true,
        version: packageData.currentVersion,
        notes: approvalNotes,
      };
      await approveDesign(payload);
      setShowApproveModal(false);
      setStatusNotification('Design specification formally approved! Workshop notified.');
      setTimeout(() => setStatusNotification(null), 5000);
      onApprovedSuccess?.();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error approving design');
    }
  };

  // Handle Submitting Revision Request
  const handleConfirmRevision = async () => {
    if (!revisionComment.trim() || !revisionTitle.trim()) {
      alert('Please provide a title and detailed comment for your requested revision.');
      return;
    }

    try {
      const payload: SubmitRevisionPayload = {
        packageId: packageData.id,
        customerName: packageData.customerName,
        items: [
          {
            component: revisionComponent,
            title: revisionTitle.trim(),
            clientComment: revisionComment.trim(),
            requestedChanges: revisionChanges.trim() || revisionComment.trim(),
          },
        ],
      };
      await submitRevision(payload);
      setShowRevisionModal(false);
      setRevisionTitle('');
      setRevisionComment('');
      setRevisionChanges('');
      setStatusNotification('Revision request transmitted to Creative Director.');
      setTimeout(() => setStatusNotification(null), 5000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error submitting revision');
    }
  };

  // Handle Rejection
  const handleConfirmRejection = async () => {
    if (!rejectionReason.trim()) {
      alert('Please state the reason for declining this commission.');
      return;
    }

    try {
      const payload: RejectDesignPayload = {
        packageId: packageData.id,
        customerName: packageData.customerName,
        customerEmail: packageData.customerEmail,
        rejectionReason: rejectionReason.trim(),
        actionRequested: rejectionAction,
      };
      await rejectDesign(payload);
      setShowRejectModal(false);
      setStatusNotification('Commission closed. Atelier Director has been alerted.');
      setTimeout(() => setStatusNotification(null), 5000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error rejecting design');
    }
  };

  // Quick Demo Simulator for Workflow testing
  const handleSimulateAtelierUpdate = async () => {
    await updateVersion({
      packageId: packageData.id,
      designerName: 'Daniel’s Maison',
      changeSummary: 'Atelier updated the design specification with enhanced lapel roll and refined silhouette.',
      changedComponents: ['SKETCHES', 'CUSTOM_REQUESTS'],
      updatedSpec: {},
    });
    setStatusNotification('Simulated Atelier update applied! Package is now UPDATED v1.1.');
    setTimeout(() => setStatusNotification(null), 4000);
  };

  const handleSimulateReleaseProduction = async () => {
    await releaseToProduction(packageData.id, 'Daniel’s Maison');
    setStatusNotification('Design released to cutting table & workshop production!');
    setTimeout(() => setStatusNotification(null), 4000);
  };

  const activeSketch =
    currentVersionSpec.sketches[selectedSketchIndex] || currentVersionSpec.sketches[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#090909] border border-[#2B2B2B] rounded-2xl w-full max-w-6xl max-h-[95vh] flex flex-col overflow-hidden shadow-2xl font-mono text-left">
        {/* Toast Notification */}
        {statusNotification && (
          <div className="bg-emerald-950/90 border-b border-emerald-500/40 text-emerald-200 px-4 py-2.5 text-xs flex items-center justify-between animate-fadeIn">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              {statusNotification}
            </span>
            <button
              onClick={() => setStatusNotification(null)}
              className="text-emerald-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Master Header */}
        <div className="p-4 sm:p-6 border-b border-[#222] bg-[#111111] flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest bg-amber-500/10 px-2 py-0.5 rounded-sm border border-amber-500/30">
                PRE-PRODUCTION APPROVAL DOSSIER
              </span>
              <span className="text-neutral-500 text-xs">/</span>
              <span className="text-xs text-neutral-400 font-bold">{packageData.orderNumber}</span>
              <span className="text-neutral-500 text-xs">/</span>
              <span className="text-xs text-neutral-400">Version {packageData.currentVersion}</span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-white uppercase tracking-wider">
              {packageData.garmentName}
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Commissioned for <span className="text-neutral-200 font-semibold">{packageData.customerName}</span> · Lead Designer: <span className="text-neutral-200">{packageData.leadDesigner}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Stage Badge */}
            <div
              className={`px-3 py-1.5 rounded-md border text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${
                STAGE_CONFIG[packageData.currentStage].color
              } ${STAGE_CONFIG[packageData.currentStage].border}`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              {STAGE_CONFIG[packageData.currentStage].label}
            </div>

            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
              title="Close Dossier"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Bar (Top Banner for immediate approval/revision actions) */}
        <div className="bg-[#141414] border-b border-[#222] px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-neutral-300">
            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Review Status: <strong className="text-white">{STAGE_CONFIG[packageData.currentStage].desc}</strong>
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {isActionable && (
              <>
                <button
                  onClick={() => setShowRejectModal(true)}
                  className="px-3 py-1.5 rounded-md border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer font-bold uppercase tracking-wider text-[11px]"
                >
                  Reject Design
                </button>
                <button
                  onClick={() => setShowRevisionModal(true)}
                  className="px-3.5 py-1.5 rounded-md border border-purple-500/40 text-purple-300 hover:bg-purple-500/15 transition-colors cursor-pointer font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  Request Revision
                </button>
                <button
                  onClick={() => setShowApproveModal(true)}
                  className="px-4 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase tracking-wider text-[11px] transition-colors cursor-pointer flex items-center gap-1.5 shadow-lg shadow-emerald-950"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Approve Design (Sign-off)
                </button>
              </>
            )}

            {packageData.currentStage === 'APPROVED' && (
              <button
                onClick={handleSimulateReleaseProduction}
                className="px-3 py-1.5 rounded-md bg-amber-500 hover:bg-amber-400 text-black font-bold uppercase tracking-wider text-[11px] transition-colors cursor-pointer flex items-center gap-1"
              >
                <Scissors className="w-3.5 h-3.5" />
                Release To Production Bench
              </button>
            )}

            {packageData.currentStage === 'REVISION_REQUESTED' && (
              <button
                onClick={handleSimulateAtelierUpdate}
                className="px-3 py-1.5 rounded-md border border-blue-500/40 text-blue-300 hover:bg-blue-500/10 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Simulate Atelier Update v1.1
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#222] bg-[#0c0c0c] overflow-x-auto text-xs shrink-0 scrollbar-none">
          <button
            onClick={() => setActiveTab('SKETCHES')}
            className={`px-4 py-3 font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'SKETCHES'
                ? 'border-amber-400 text-amber-400 bg-amber-500/5'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            1. Design Sketches
            <span className="px-1.5 py-0.2 text-[10px] bg-neutral-800 rounded-sm">
              {currentVersionSpec.sketches.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('FABRIC')}
            className={`px-4 py-3 font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'FABRIC'
                ? 'border-amber-400 text-amber-400 bg-amber-500/5'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            2. Fabric Selection
          </button>

          <button
            onClick={() => setActiveTab('COLOR')}
            className={`px-4 py-3 font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'COLOR'
                ? 'border-amber-400 text-amber-400 bg-amber-500/5'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            3. Color & Linings
          </button>

          <button
            onClick={() => setActiveTab('MEASUREMENTS')}
            className={`px-4 py-3 font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'MEASUREMENTS'
                ? 'border-amber-400 text-amber-400 bg-amber-500/5'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Ruler className="w-3.5 h-3.5" />
            4. Measurements
            <span className="px-1.5 py-0.2 text-[10px] bg-neutral-800 rounded-sm">
              {currentVersionSpec.measurements.items.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('CUSTOM_REQUESTS')}
            className={`px-4 py-3 font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'CUSTOM_REQUESTS'
                ? 'border-amber-400 text-amber-400 bg-amber-500/5'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            5. Custom Requests
          </button>

          <div className="h-6 w-[1px] bg-neutral-800 my-auto mx-2" />

          <button
            onClick={() => setActiveTab('VERSIONS')}
            className={`px-4 py-3 font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'VERSIONS'
                ? 'border-amber-400 text-amber-400 bg-amber-500/5'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            Version History
            <span className="px-1.5 py-0.2 text-[10px] bg-neutral-800 rounded-sm">
              {packageData.versions.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('REVISIONS')}
            className={`px-4 py-3 font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'REVISIONS'
                ? 'border-amber-400 text-amber-400 bg-amber-500/5'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            Revisions
            {packageData.revisions.length > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] bg-purple-500/20 text-purple-300 rounded-sm">
                {packageData.revisions.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('AUDIT_LOGS')}
            className={`px-4 py-3 font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'AUDIT_LOGS'
                ? 'border-amber-400 text-amber-400 bg-amber-500/5'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Audit Trail
            <span className="px-1.5 py-0.2 text-[10px] bg-neutral-800 rounded-sm">
              {packageData.auditTrail.length}
            </span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* TAB 1: DESIGN SKETCHES */}
          {activeTab === 'SKETCHES' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif text-lg font-bold text-white uppercase tracking-wider">
                    High-Fidelity Technical CAD & Artistic Sketches
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Review front and back silhouettes, lapel gorge angles, button stance, and pocket placement.
                  </p>
                </div>

                {/* View Angle Switcher */}
                <div className="flex items-center gap-2">
                  {currentVersionSpec.sketches.map((sk, idx) => (
                    <button
                      key={sk.id}
                      onClick={() => setSelectedSketchIndex(idx)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border transition-colors cursor-pointer ${
                        selectedSketchIndex === idx
                          ? 'bg-amber-500 text-black border-amber-400'
                          : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
                      }`}
                    >
                      {sk.viewAngle.replace(/_/g, ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Sketch Canvas & Technical Annotations */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Sketch Image Card with Pins */}
                <div className="lg:col-span-7 bg-[#111111] border border-[#2B2B2B] rounded-xl overflow-hidden relative group">
                  <div className="relative aspect-[4/5] bg-black flex items-center justify-center overflow-hidden">
                    <img
                      src={activeSketch.imageUrl}
                      alt={activeSketch.title}
                      className="w-full h-full object-cover opacity-90 group-hover:scale-102 transition-transform duration-500"
                    />

                    {/* Interactive Annotation Pins */}
                    {activeSketch.annotatedPoints.map((pin) => (
                      <div
                        key={pin.id}
                        style={{ left: `${pin.xPercent}%`, top: `${pin.yPercent}%` }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 group/pin z-20"
                      >
                        <div className="w-6 h-6 rounded-full bg-amber-500 text-black font-bold text-[10px] flex items-center justify-center border-2 border-black shadow-lg cursor-pointer animate-pulse hover:scale-125 transition-transform">
                          ●
                        </div>
                        {/* Tooltip Card */}
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-8 w-60 p-2.5 bg-black/95 border border-amber-500/50 rounded-lg shadow-2xl opacity-0 group-hover/pin:opacity-100 transition-opacity pointer-events-none text-left z-30">
                          <p className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                            {pin.label}
                          </p>
                          <p className="text-[10px] text-neutral-300 mt-1 leading-relaxed">
                            {pin.technicalNote}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 bg-[#141414] border-t border-[#222]">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-white uppercase">{activeSketch.title}</span>
                      <span className="text-amber-400 text-[10px] font-bold">
                        {activeSketch.viewAngle} PROJECTION
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400">{activeSketch.caption}</p>
                  </div>
                </div>

                {/* Technical CAD Specification Panel */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="p-4 bg-[#111111] border border-[#2B2B2B] rounded-xl space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest">
                      <Sliders className="w-3.5 h-3.5" />
                      CAD Structural Parameters
                    </div>
                    <p className="text-xs text-neutral-300 leading-relaxed bg-[#171717] p-3 rounded-lg border border-[#222]">
                      {activeSketch.cadSpecification}
                    </p>
                  </div>

                  {/* Annotated Coordinates Breakdown */}
                  <div className="p-4 bg-[#111111] border border-[#2B2B2B] rounded-xl space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-neutral-300 uppercase tracking-wider">
                      <span>Interactive Fitting Callouts ({activeSketch.annotatedPoints.length})</span>
                      <span className="text-[10px] text-neutral-500 font-normal">Hover pin dots to inspect</span>
                    </div>

                    <div className="space-y-2">
                      {activeSketch.annotatedPoints.map((pin) => (
                        <div
                          key={pin.id}
                          className="p-3 bg-[#161616] border border-[#262626] rounded-lg text-xs space-y-1 hover:border-amber-500/40 transition-colors"
                        >
                          <div className="flex items-center justify-between font-bold text-amber-300">
                            <span>{pin.label}</span>
                            <span className="text-[10px] text-neutral-500 font-mono">
                              X:{pin.xPercent}% Y:{pin.yPercent}%
                            </span>
                          </div>
                          <p className="text-neutral-400 text-[11px]">{pin.technicalNote}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Client Revision Prompt */}
                  {isActionable && (
                    <div className="p-4 bg-purple-950/20 border border-purple-500/30 rounded-xl space-y-2">
                      <p className="text-xs text-purple-200 font-bold uppercase tracking-wider">
                        Require an adjustment to lapels or stance?
                      </p>
                      <p className="text-[11px] text-neutral-400">
                        You can request lapel gorge raises, suppression tweaks, or vent depth changes before hand-shearing starts.
                      </p>
                      <button
                        onClick={() => {
                          setRevisionComponent('SKETCHES');
                          setRevisionTitle('Adjustment to silhouette / lapels');
                          setShowRevisionModal(true);
                        }}
                        className="text-xs text-purple-300 hover:text-purple-100 font-bold underline cursor-pointer"
                      >
                        Request Sketch Revision →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FABRIC SELECTION */}
          {activeTab === 'FABRIC' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-white uppercase tracking-wider">
                    Luxury Fabric & Cloth Archive Allocation
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Allocated from world-renowned heritage mills. Inspected for grain-line purity and steam-preshrunk.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Fabric Swatch Card */}
                <div className="md:col-span-5 bg-[#111111] border border-[#2B2B2B] rounded-xl overflow-hidden">
                  <div className="aspect-[4/3] bg-black overflow-hidden relative">
                    <img
                      src={currentVersionSpec.fabric.swatchImageUrl}
                      alt={currentVersionSpec.fabric.clothName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/80 backdrop-blur-md border border-white/20 rounded-sm text-[10px] text-amber-300 font-bold uppercase">
                      {currentVersionSpec.fabric.millName}
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    <span className="text-[10px] text-neutral-500 font-mono">
                      REF: {currentVersionSpec.fabric.clothCode}
                    </span>
                    <h4 className="font-serif text-base font-bold text-white uppercase">
                      {currentVersionSpec.fabric.clothName}
                    </h4>
                    <p className="text-xs text-neutral-400">
                      Origin: <strong className="text-neutral-200">{currentVersionSpec.fabric.originCountry}</strong>
                    </p>
                  </div>
                </div>

                {/* Fabric Technical Matrix */}
                <div className="md:col-span-7 space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="p-3 bg-[#141414] border border-[#262626] rounded-lg">
                      <span className="text-[10px] text-neutral-500 uppercase block">Weight (GSM)</span>
                      <span className="text-sm font-bold text-white">
                        {currentVersionSpec.fabric.weightGsm} g/m²
                      </span>
                    </div>

                    <div className="p-3 bg-[#141414] border border-[#262626] rounded-lg">
                      <span className="text-[10px] text-neutral-500 uppercase block">Weight (Imperial)</span>
                      <span className="text-sm font-bold text-white">
                        {currentVersionSpec.fabric.weightOz} oz
                      </span>
                    </div>

                    <div className="p-3 bg-[#141414] border border-[#262626] rounded-lg">
                      <span className="text-[10px] text-neutral-500 uppercase block">Seasonality</span>
                      <span className="text-sm font-bold text-emerald-400">
                        {currentVersionSpec.fabric.breathabilityIndex}
                      </span>
                    </div>

                    <div className="p-3 bg-[#141414] border border-[#262626] rounded-lg sm:col-span-2">
                      <span className="text-[10px] text-neutral-500 uppercase block">Weave Geometry</span>
                      <span className="text-xs font-bold text-white">
                        {currentVersionSpec.fabric.weaveType}
                      </span>
                    </div>

                    <div className="p-3 bg-[#141414] border border-[#262626] rounded-lg">
                      <span className="text-[10px] text-neutral-500 uppercase block">Drape Classification</span>
                      <span className="text-xs font-bold text-amber-300">
                        {currentVersionSpec.fabric.drapeClass}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 bg-[#141414] border border-[#262626] rounded-lg space-y-2">
                    <span className="text-[10px] text-neutral-500 uppercase block font-bold">
                      Composition & Fibre Metric
                    </span>
                    <p className="text-xs text-neutral-200">{currentVersionSpec.fabric.composition}</p>
                  </div>

                  <div className="p-4 bg-[#141414] border border-[#262626] rounded-lg space-y-2">
                    <span className="text-[10px] text-neutral-500 uppercase block font-bold">
                      Tactile & Drape Characteristics
                    </span>
                    <p className="text-xs text-neutral-300 leading-relaxed italic">
                      "{currentVersionSpec.fabric.tactileCharacteristics}"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: COLOR & LININGS */}
          {activeTab === 'COLOR' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h3 className="font-serif text-lg font-bold text-white uppercase tracking-wider">
                  Colorway & Interior Silk Lining Palette
                </h3>
                <p className="text-xs text-neutral-400">
                  Calibrated under 5500K daylight simulation lamps to guarantee color fidelity.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Primary Cloth Color */}
                <div className="p-5 bg-[#111111] border border-[#2B2B2B] rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-neutral-500 uppercase font-bold">Primary Cloth</span>
                    <span className="text-[10px] text-neutral-400 font-mono">
                      {currentVersionSpec.color.pantoneReference}
                    </span>
                  </div>
                  <div
                    className="h-20 rounded-lg border border-white/20 shadow-inner flex items-end p-2.5"
                    style={{ backgroundColor: currentVersionSpec.color.primaryColorHex }}
                  >
                    <span className="text-[10px] text-white/90 bg-black/70 px-2 py-0.5 rounded font-mono">
                      {currentVersionSpec.color.primaryColorHex}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      {currentVersionSpec.color.primaryColorName}
                    </h4>
                  </div>
                </div>

                {/* Lining Color */}
                <div className="p-5 bg-[#111111] border border-[#2B2B2B] rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-neutral-500 uppercase font-bold">Interior Lining</span>
                    <span className="text-[10px] text-neutral-400 font-mono">Bemberg Silk</span>
                  </div>
                  <div
                    className="h-20 rounded-lg border border-white/20 shadow-inner flex items-end p-2.5"
                    style={{ backgroundColor: currentVersionSpec.color.liningColorHex }}
                  >
                    <span className="text-[10px] text-white/90 bg-black/70 px-2 py-0.5 rounded font-mono">
                      {currentVersionSpec.color.liningColorHex}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      {currentVersionSpec.color.liningColorName}
                    </h4>
                    <p className="text-xs text-neutral-400 mt-1">
                      Pattern: {currentVersionSpec.color.liningSilkPattern}
                    </p>
                  </div>
                </div>

                {/* Buttonhole & Gimp Accent */}
                <div className="p-5 bg-[#111111] border border-[#2B2B2B] rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-neutral-500 uppercase font-bold">Thread Accent</span>
                    <span className="text-[10px] text-neutral-400 font-mono">Silk Gimp</span>
                  </div>
                  <div
                    className="h-20 rounded-lg border border-white/20 shadow-inner flex items-end p-2.5"
                    style={{ backgroundColor: currentVersionSpec.color.buttonholeThreadColorHex }}
                  >
                    <span className="text-[10px] text-black bg-white/80 px-2 py-0.5 rounded font-mono font-bold">
                      {currentVersionSpec.color.buttonholeThreadColorHex}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      {currentVersionSpec.color.buttonholeThreadColorName}
                    </h4>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[#141414] border border-[#262626] rounded-xl">
                <span className="text-[10px] text-neutral-500 uppercase block font-bold mb-1">
                  Contrast & Trim Harmony Directives
                </span>
                <p className="text-xs text-neutral-300">{currentVersionSpec.color.contrastDetails}</p>
              </div>
            </div>
          )}

          {/* TAB 4: MEASUREMENTS */}
          {activeTab === 'MEASUREMENTS' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif text-lg font-bold text-white uppercase tracking-wider">
                    Anatomical Dimension Matrix & Posture Compensation
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Profile: <strong className="text-neutral-200">{currentVersionSpec.measurements.profileName}</strong> · Verified by {currentVersionSpec.measurements.verifiedByTailor}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-neutral-900 border border-neutral-700 text-xs rounded-md text-neutral-300">
                    Height: {currentVersionSpec.measurements.customerHeightCm} cm
                  </span>
                  <span className="px-2.5 py-1 bg-neutral-900 border border-neutral-700 text-xs rounded-md text-neutral-300">
                    Weight: {currentVersionSpec.measurements.customerWeightKg} kg
                  </span>
                </div>
              </div>

              {/* Stance Notice */}
              <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-amber-300 block uppercase tracking-wider">
                    Anatomical Balance Directives:
                  </span>
                  <p className="text-neutral-300 mt-0.5">
                    {currentVersionSpec.measurements.stancePosture} — Cut tailored for{' '}
                    <strong className="text-white">{currentVersionSpec.measurements.fitPreference}</strong>.
                  </p>
                </div>
              </div>

              {/* Measurements Table */}
              <div className="border border-[#2B2B2B] rounded-xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#141414] border-b border-[#2B2B2B] text-neutral-400 uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-2.5 px-4">Anatomical Region</th>
                      <th className="py-2.5 px-4">Dimension</th>
                      <th className="py-2.5 px-4">Tolerance</th>
                      <th className="py-2.5 px-4">Bespoke Inlay / Balance Compensation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#222] bg-[#0E0E0E]">
                    {currentVersionSpec.measurements.items.map((item) => (
                      <tr key={item.key} className="hover:bg-neutral-900/60 transition-colors">
                        <td className="py-2.5 px-4 font-bold text-white flex items-center gap-2">
                          {item.label}
                          {item.isCritical && (
                            <span className="text-[9px] px-1.5 py-0.2 bg-amber-500/20 text-amber-300 rounded font-normal">
                              Critical
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-4 font-mono font-bold text-amber-400">
                          {item.value} {item.unit}
                        </td>
                        <td className="py-2.5 px-4 font-mono text-neutral-400">{item.tolerance}</td>
                        <td className="py-2.5 px-4 text-neutral-300 text-[11px]">
                          {item.postureCompensationNotes || 'Standard drape allowance'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: CUSTOM REQUESTS */}
          {activeTab === 'CUSTOM_REQUESTS' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h3 className="font-serif text-lg font-bold text-white uppercase tracking-wider">
                  Bespoke Styling Options & Tailoring Directives
                </h3>
                <p className="text-xs text-neutral-400">
                  Client personalized elements hand-stitched into the canvas and facets.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-[#111111] border border-[#2B2B2B] rounded-xl space-y-2">
                  <span className="text-[10px] text-neutral-500 uppercase font-bold block">
                    Monogram Specification
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-serif font-bold text-amber-300">
                      "{currentVersionSpec.customRequests.monogramText}"
                    </span>
                    <span className="text-xs text-neutral-400">
                      Font: {currentVersionSpec.customRequests.monogramFont}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400">
                    Placement: {currentVersionSpec.customRequests.monogramPlacement}
                  </p>
                </div>

                <div className="p-4 bg-[#111111] border border-[#2B2B2B] rounded-xl space-y-2">
                  <span className="text-[10px] text-neutral-500 uppercase font-bold block">Lapel Architecture</span>
                  <h4 className="text-sm font-bold text-white">
                    {currentVersionSpec.customRequests.lapelStyle}
                  </h4>
                </div>

                <div className="p-4 bg-[#111111] border border-[#2B2B2B] rounded-xl space-y-2">
                  <span className="text-[10px] text-neutral-500 uppercase font-bold block">Buttons & Fastenings</span>
                  <h4 className="text-sm font-bold text-white">
                    {currentVersionSpec.customRequests.buttonMaterial}
                  </h4>
                </div>

                <div className="p-4 bg-[#111111] border border-[#2B2B2B] rounded-xl space-y-2">
                  <span className="text-[10px] text-neutral-500 uppercase font-bold block">Pockets & Vents</span>
                  <p className="text-xs text-white font-bold">
                    {currentVersionSpec.customRequests.pocketConfiguration}
                  </p>
                  <p className="text-xs text-neutral-400">
                    Vents: {currentVersionSpec.customRequests.ventsConfiguration}
                  </p>
                </div>

                <div className="p-4 bg-[#111111] border border-[#2B2B2B] rounded-xl space-y-2 md:col-span-2">
                  <span className="text-[10px] text-neutral-500 uppercase font-bold block">
                    Floating Canvas Construction
                  </span>
                  <p className="text-xs text-neutral-200">
                    {currentVersionSpec.customRequests.canvasConstruction}
                  </p>
                </div>

                <div className="p-4 bg-[#111111] border border-[#2B2B2B] rounded-xl space-y-2 md:col-span-2">
                  <span className="text-[10px] text-neutral-500 uppercase font-bold block">
                    Tailor Workshop Directives
                  </span>
                  <p className="text-xs text-neutral-300 italic">
                    "{currentVersionSpec.customRequests.additionalTailorDirectives}"
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: VERSION HISTORY */}
          {activeTab === 'VERSIONS' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h3 className="font-serif text-lg font-bold text-white uppercase tracking-wider">
                  Version History & Changelog
                </h3>
                <p className="text-xs text-neutral-400">
                  Track iterative updates, Creative Director revisions, and client feedback cycles.
                </p>
              </div>

              <div className="space-y-4">
                {packageData.versions.map((ver) => {
                  const isCurrent = ver.versionNumber === packageData.currentVersion;
                  return (
                    <div
                      key={ver.versionNumber}
                      className={`p-5 rounded-xl border text-xs space-y-3 transition-colors ${
                        isCurrent
                          ? 'bg-amber-500/5 border-amber-500/40'
                          : 'bg-[#111111] border-[#2B2B2B]'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-bold text-amber-300">
                            Version {ver.versionNumber}
                          </span>
                          {isCurrent && (
                            <span className="px-2 py-0.5 bg-amber-500 text-black text-[10px] font-bold rounded uppercase">
                              Active Spec
                            </span>
                          )}
                          <span className="text-neutral-500">•</span>
                          <span className="text-neutral-400">Drafted by {ver.createdBy} ({ver.creatorRole})</span>
                        </div>
                        <span className="text-neutral-500 font-mono text-[11px]">
                          {new Date(ver.createdAt).toLocaleString()}
                        </span>
                      </div>

                      <p className="text-neutral-200 text-xs bg-[#171717] p-3 rounded-lg border border-[#242424]">
                        {ver.changeSummary}
                      </p>

                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] text-neutral-500 uppercase font-bold mr-1">
                          Components in this version:
                        </span>
                        {ver.changedComponents.map((c) => (
                          <span
                            key={c}
                            className="px-2 py-0.5 bg-neutral-800 text-neutral-300 rounded text-[10px] font-mono"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 7: REVISIONS */}
          {activeTab === 'REVISIONS' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-white uppercase tracking-wider">
                    Revision Tracking & Client Petition Items
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Threaded feedback items submitted for adjustments before cutting.
                  </p>
                </div>

                {isActionable && (
                  <button
                    onClick={() => setShowRevisionModal(true)}
                    className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-md text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    + New Revision Item
                  </button>
                )}
              </div>

              {packageData.revisions.length === 0 ? (
                <div className="p-8 text-center bg-[#111111] border border-[#2B2B2B] rounded-xl text-neutral-500 text-xs">
                  No revisions requested on this commission. The design is in alignment with initial measurements.
                </div>
              ) : (
                <div className="space-y-3">
                  {packageData.revisions.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-4 bg-[#111111] border border-[#2B2B2B] rounded-xl space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded text-[10px] font-bold">
                            {rev.component}
                          </span>
                          <span className="font-bold text-white">{rev.title}</span>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            rev.status === 'ADDRESSED'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}
                        >
                          {rev.status}
                        </span>
                      </div>

                      <p className="text-neutral-300 bg-[#161616] p-2.5 rounded border border-[#222]">
                        <strong className="text-neutral-400 block text-[10px] uppercase">
                          Client Request:
                        </strong>
                        {rev.clientComment}
                      </p>

                      {rev.designerResponse && (
                        <p className="text-emerald-300 bg-emerald-950/20 p-2.5 rounded border border-emerald-500/30">
                          <strong className="text-emerald-400 block text-[10px] uppercase">
                            Atelier Resolution (in v{rev.resolvedInVersion || '1.1'}):
                          </strong>
                          {rev.designerResponse}
                        </p>
                      )}

                      <span className="text-[10px] text-neutral-500 block text-right font-mono">
                        Logged: {new Date(rev.createdAt).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 8: AUDIT TRAIL & APPROVAL LOGS */}
          {activeTab === 'AUDIT_LOGS' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h3 className="font-serif text-lg font-bold text-white uppercase tracking-wider">
                  Immutable Audit Trail & Approval Signatures
                </h3>
                <p className="text-xs text-neutral-400">
                  Cryptographic log of all client reviews, version uploads, and workshop releases.
                </p>
              </div>

              {/* Formal Approval Logs Table */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  Formal Sign-off Records ({packageData.approvalLogs.length})
                </h4>
                {packageData.approvalLogs.length === 0 ? (
                  <p className="text-xs text-neutral-500 italic bg-[#111111] p-3 rounded-lg border border-[#222]">
                    No formal sign-off recorded yet. Commission is awaiting review.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {packageData.approvalLogs.map((log) => (
                      <div
                        key={log.id}
                        className="p-3.5 bg-[#121212] border border-[#262626] rounded-xl text-xs space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4" />
                            {log.action} — Version {log.versionApproved}
                          </span>
                          <span className="text-neutral-500 font-mono text-[10px]">
                            {new Date(log.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-neutral-300">
                          Signatory: <strong className="text-white">{log.actorName}</strong> (
                          {log.actorRole}) · Digital Signature: <span className="font-mono text-amber-300">{log.digitalSignature}</span>
                        </p>
                        {log.notes && <p className="text-neutral-400 text-[11px] italic">"{log.notes}"</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Full Audit Trail Timeline */}
              <div className="space-y-3 pt-4 border-t border-[#222]">
                <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                  Chronological Lifecycle Events ({packageData.auditTrail.length})
                </h4>
                <div className="space-y-2 font-mono text-[11px]">
                  {packageData.auditTrail.map((ev) => (
                    <div
                      key={ev.id}
                      className="p-2.5 bg-[#111111] border border-[#222] rounded-lg flex items-start justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-amber-400 font-bold">{ev.eventCode}</span>
                          <span className="text-neutral-500">•</span>
                          <span className="text-neutral-400">{ev.actor} ({ev.actorRole})</span>
                        </div>
                        <p className="text-neutral-300 mt-1">{ev.description}</p>
                      </div>
                      <span className="text-neutral-500 shrink-0 text-[10px]">
                        {new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer with Quick Actions */}
        <div className="p-4 bg-[#111111] border-t border-[#222] flex flex-wrap items-center justify-between gap-3 shrink-0 text-xs">
          <div className="flex items-center gap-2 text-neutral-400">
            <span>Commission Total:</span>
            <strong className="text-amber-300 text-sm font-mono">
              £{packageData.priceGbp.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
            </strong>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-[#333] hover:bg-neutral-800 text-neutral-300 transition-colors cursor-pointer font-bold uppercase tracking-wider text-[11px]"
            >
              Close Dossier
            </button>
            {isActionable && (
              <button
                onClick={() => setShowApproveModal(true)}
                className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase tracking-wider text-[11px] transition-colors cursor-pointer flex items-center gap-1.5 shadow-lg shadow-emerald-950"
              >
                <CheckCircle2 className="w-4 h-4" />
                Approve & Authorize Production
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. APPROVE DESIGN MODAL (FORMAL DIGITAL SIGN-OFF) */}
      {/* ========================================================================= */}
      {showApproveModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#111111] border border-emerald-500/40 rounded-2xl max-w-lg w-full p-6 space-y-5 text-left font-mono shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-emerald-400 font-bold uppercase tracking-wider text-sm">
                <ShieldCheck className="w-5 h-5" />
                Formal Design Approval & Sign-Off
              </div>
              <button
                onClick={() => setShowApproveModal(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed">
              By confirming approval of <strong className="text-white">v{packageData.currentVersion}</strong>, you authorize Daniel’s Maison Master Tailors to shear the cloth and commence workshop production.
            </p>

            {/* Checklist of approved components */}
            <div className="space-y-1.5 bg-[#171717] p-3.5 rounded-xl border border-[#282828] text-xs">
              <span className="text-[10px] text-neutral-500 uppercase font-bold block mb-1">
                You are approving the following verified specs:
              </span>
              <div className="flex items-center gap-2 text-neutral-300">
                <Check className="w-3.5 h-3.5 text-emerald-400" /> 1. Design Sketches & Silhouette
              </div>
              <div className="flex items-center gap-2 text-neutral-300">
                <Check className="w-3.5 h-3.5 text-emerald-400" /> 2. Fabric: {currentVersionSpec.fabric.millName} ({currentVersionSpec.fabric.clothName})
              </div>
              <div className="flex items-center gap-2 text-neutral-300">
                <Check className="w-3.5 h-3.5 text-emerald-400" /> 3. Color: {currentVersionSpec.color.primaryColorName}
              </div>
              <div className="flex items-center gap-2 text-neutral-300">
                <Check className="w-3.5 h-3.5 text-emerald-400" /> 4. Anatomical Measurements Profile ({currentVersionSpec.measurements.items.length} points)
              </div>
              <div className="flex items-center gap-2 text-neutral-300">
                <Check className="w-3.5 h-3.5 text-emerald-400" /> 5. Custom Requests: Monogram "{currentVersionSpec.customRequests.monogramText}" & Milanese Lapel
              </div>
            </div>

            {/* Digital Signature */}
            <div className="space-y-2">
              <label className="text-[11px] text-neutral-400 uppercase font-bold block">
                Type Your Full Legal Name (Digital Signature)
              </label>
              <input
                type="text"
                value={signatureText}
                onChange={(e) => setSignatureText(e.target.value)}
                className="w-full bg-black border border-[#333] focus:border-emerald-500 rounded-lg px-3.5 py-2.5 text-sm text-white font-serif outline-none"
                placeholder="Full Name"
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <label className="text-[11px] text-neutral-400 uppercase font-bold block">
                Optional Sign-off Remarks
              </label>
              <textarea
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
                rows={2}
                className="w-full bg-black border border-[#333] focus:border-emerald-500 rounded-lg p-2.5 text-xs text-white outline-none"
                placeholder="e.g. Delighted with the CAD adjustments. Proceed to cutting."
              />
            </div>

            {/* Legal Confirmation Checkbox */}
            <label className="flex items-start gap-2.5 text-xs text-neutral-300 cursor-pointer">
              <input
                type="checkbox"
                checked={declarationAccepted}
                onChange={(e) => setDeclarationAccepted(e.target.checked)}
                className="mt-0.5 accent-emerald-500 rounded"
              />
              <span>
                I confirm that I have reviewed the design sketches, fabric, color, and measurements, and grant full authorization to proceed to physical manufacturing.
              </span>
            </label>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowApproveModal(false)}
                className="px-4 py-2 rounded-lg border border-[#333] hover:bg-neutral-800 text-neutral-300 text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmApproval}
                disabled={isLoading}
                className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-950"
              >
                <CheckCircle2 className="w-4 h-4" />
                Sign & Authorize
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. REQUEST REVISION MODAL */}
      {/* ========================================================================= */}
      {showRevisionModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#111111] border border-purple-500/40 rounded-2xl max-w-lg w-full p-6 space-y-4 text-left font-mono shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-purple-300 font-bold uppercase tracking-wider text-sm">
                <Sliders className="w-5 h-5 text-purple-400" />
                Request Design Specification Revision
              </div>
              <button
                onClick={() => setShowRevisionModal(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-neutral-400">
              Submit your desired adjustments to the Creative Director. An updated specification (v{packageData.currentVersion}.1) will be re-submitted for your approval.
            </p>

            {/* Component Selector */}
            <div className="space-y-1.5">
              <label className="text-[11px] text-neutral-400 uppercase font-bold block">
                Which Component Requires Adjustment?
              </label>
              <select
                value={revisionComponent}
                onChange={(e) => setRevisionComponent(e.target.value as CustomerReviewComponent)}
                className="w-full bg-black border border-[#333] focus:border-purple-500 rounded-lg px-3 py-2 text-xs text-white outline-none cursor-pointer"
              >
                <option value="SKETCHES">Design Sketches (Lapels, Silhouette, Stance)</option>
                <option value="FABRIC">Fabric Selection (Mill, Composition, Weight)</option>
                <option value="COLOR">Color Selection & Linings</option>
                <option value="MEASUREMENTS">Measurements & Posture Adjustments</option>
                <option value="CUSTOM_REQUESTS">Custom Requests (Monogram, Buttons, Pockets)</option>
              </select>
            </div>

            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-[11px] text-neutral-400 uppercase font-bold block">
                Summary Title
              </label>
              <input
                type="text"
                value={revisionTitle}
                onChange={(e) => setRevisionTitle(e.target.value)}
                className="w-full bg-black border border-[#333] focus:border-purple-500 rounded-lg px-3 py-2 text-xs text-white outline-none"
                placeholder="e.g. Lengthen jacket hem by 2cm or change lining pattern"
              />
            </div>

            {/* Detailed Feedback */}
            <div className="space-y-1.5">
              <label className="text-[11px] text-neutral-400 uppercase font-bold block">
                Detailed Feedback & Directives
              </label>
              <textarea
                value={revisionComment}
                onChange={(e) => setRevisionComment(e.target.value)}
                rows={3}
                className="w-full bg-black border border-[#333] focus:border-purple-500 rounded-lg p-2.5 text-xs text-white outline-none"
                placeholder="Describe exactly what you would like the atelier to modify..."
              />
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowRevisionModal(false)}
                className="px-4 py-2 rounded-lg border border-[#333] hover:bg-neutral-800 text-neutral-300 text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRevision}
                disabled={isLoading}
                className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                Submit Revision Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. REJECT DESIGN MODAL */}
      {/* ========================================================================= */}
      {showRejectModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#111111] border border-red-500/40 rounded-2xl max-w-lg w-full p-6 space-y-4 text-left font-mono shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-red-400 font-bold uppercase tracking-wider text-sm">
                <AlertTriangle className="w-5 h-5" />
                Reject Commission Design
              </div>
              <button
                onClick={() => setShowRejectModal(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-neutral-300">
              If the concept does not meet your expectations, you may decline the design package. An Atelier Client Director will immediately contact you.
            </p>

            <div className="space-y-1.5">
              <label className="text-[11px] text-neutral-400 uppercase font-bold block">
                Reason for Rejection
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={3}
                className="w-full bg-black border border-[#333] focus:border-red-500 rounded-lg p-2.5 text-xs text-white outline-none"
                placeholder="Please state why this concept is declined..."
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] text-neutral-400 uppercase font-bold block">
                Preferred Concierge Action
              </label>
              <select
                value={rejectionAction}
                onChange={(e) => setRejectionAction(e.target.value as any)}
                className="w-full bg-black border border-[#333] focus:border-red-500 rounded-lg px-3 py-2 text-xs text-white outline-none cursor-pointer"
              >
                <option value="SPEAK_WITH_DIRECTOR">Direct Phone Consultation with Atelier Director</option>
                <option value="START_OVER_NEW_CONCEPT">Start Over with a Brand New Design Concept</option>
                <option value="REFUND_DEPOSIT">Cancel Commission & Process Deposit Return</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 rounded-lg border border-[#333] hover:bg-neutral-800 text-neutral-300 text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRejection}
                disabled={isLoading}
                className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
