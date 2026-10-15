/**
 * @file AlterationProgressTrackerModal.tsx
 * Live Progress Tracker & Milestone Dossier for the Daniel’s Maison Alteration Workflow:
 * 1. Submitted
 * 2. Reviewed
 * 3. Approved
 * 4. In Alteration
 * 5. Completed
 * 6. Returned
 *
 * Includes:
 * - 6-stage Stepper with timestamps, actors, and notes
 * - Before vs After alteration comparison gallery
 * - Anatomical fit changes summary
 * - Master Tailor chalk directives
 * - White-Glove courier tracking
 * - Interactive Testing Toolbar (Advance / Rewind stages for immediate demonstration)
 */

import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Clock,
  Truck,
  Scissors,
  ShieldCheck,
  MapPin,
  Calendar,
  Sparkles,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  FileText,
  Camera,
  Layers,
  RotateCcw,
} from 'lucide-react';
import {
  AlterationRequest,
  AlterationWorkflowStage,
} from '../../types/alteration.types';
import { useAlterationStore } from '../../stores/alterationStore';

interface AlterationProgressTrackerModalProps {
  request: AlterationRequest | null;
  isOpen: boolean;
  onClose: () => void;
}

const WORKFLOW_STAGES: Array<{
  stage: AlterationWorkflowStage;
  num: number;
  label: string;
  shortDesc: string;
}> = [
  { stage: 'SUBMITTED', num: 1, label: 'Submitted', shortDesc: 'Client intake registered' },
  { stage: 'REVIEWED', num: 2, label: 'Reviewed', shortDesc: 'Master Tailor assessment' },
  { stage: 'APPROVED', num: 3, label: 'Approved', shortDesc: 'Atelier work order scheduled' },
  { stage: 'IN_ALTERATION', num: 4, label: 'In Alteration', shortDesc: 'Hand tailoring on bench' },
  { stage: 'COMPLETED', num: 5, label: 'Completed', shortDesc: 'Final press & fit audit' },
  { stage: 'RETURNED', num: 6, label: 'Returned', shortDesc: 'White-glove valet delivered' },
];

export const AlterationProgressTrackerModal: React.FC<AlterationProgressTrackerModalProps> = ({
  request,
  isOpen,
  onClose,
}) => {
  const { advanceStage, rewindStage, updateStage } = useAlterationStore();
  const [isSimulating, setIsSimulating] = useState(false);
  const [simNote, setSimNote] = useState('');
  const [activePhotoTab, setActivePhotoTab] = useState<'BEFORE' | 'AFTER'>('BEFORE');

  if (!isOpen || !request) return null;

  const currentStageIndex = WORKFLOW_STAGES.findIndex((s) => s.stage === request.currentStage);

  const handleAdvance = async () => {
    setIsSimulating(true);
    try {
      await advanceStage(request.id, simNote || undefined);
      setSimNote('');
    } finally {
      setIsSimulating(false);
    }
  };

  const handleRewind = async () => {
    setIsSimulating(true);
    try {
      await rewindStage(request.id);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleDirectStageJump = async (stage: AlterationWorkflowStage) => {
    setIsSimulating(true);
    try {
      await updateStage(request.id, stage, `Direct status test transition to ${stage}`);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn text-left font-mono">
      <div className="bg-[#0B0B0B] border border-[#2B2B2B] rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#222] bg-[#121212] flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Scissors className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest">
                  ALTERATION DOSSIER • {request.id}
                </span>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-bold uppercase">
                  {request.currentStage.replace(/_/g, ' ')}
                </span>
              </div>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-white uppercase tracking-wider truncate">
                {request.garmentName}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 6-Stage Progress Stepper Bar */}
        <div className="p-4 sm:p-6 bg-[#0E0E0E] border-b border-[#222] shrink-0">
          <div className="flex items-center justify-between text-[10px] text-neutral-400 mb-2">
            <span className="uppercase tracking-wider font-bold">
              Progress: Stage {currentStageIndex + 1} of 6
            </span>
            <span className="text-amber-400 font-bold uppercase">
              Current: {request.currentStage.replace(/_/g, ' ')}
            </span>
          </div>

          {/* Stepper Dots & Line */}
          <div className="relative flex items-center justify-between">
            {/* Background track line */}
            <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-0.5 bg-[#252525] -z-0" />

            {/* Filled progress track */}
            <div
              className="absolute left-4 top-1/2 -translate-y-1/2 h-0.5 bg-amber-400 transition-all duration-300 -z-0"
              style={{
                width: `${(currentStageIndex / (WORKFLOW_STAGES.length - 1)) * 92}%`,
              }}
            />

            {WORKFLOW_STAGES.map((s, idx) => {
              const isPassed = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;
              return (
                <div key={s.stage} className="relative z-10 flex flex-col items-center">
                  <button
                    onClick={() => handleDirectStageJump(s.stage)}
                    title={`Jump to ${s.label}`}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-[10px] sm:text-xs transition-all cursor-pointer ${
                      isPassed
                        ? 'bg-emerald-500 text-black border-2 border-emerald-400 shadow-md'
                        : isCurrent
                        ? 'bg-amber-400 text-black border-2 border-white ring-4 ring-amber-400/20 shadow-lg scale-110'
                        : 'bg-[#181818] text-neutral-500 border border-[#333]'
                    }`}
                  >
                    {isPassed ? '✓' : s.num}
                  </button>

                  <span
                    className={`mt-1.5 text-[8.5px] sm:text-[9.5px] uppercase font-bold tracking-wider text-center ${
                      isCurrent
                        ? 'text-amber-400'
                        : isPassed
                        ? 'text-neutral-300'
                        : 'text-neutral-600'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Top Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-[#131313] border border-[#262626] rounded-xl p-4">
            <div>
              <span className="text-[9.5px] text-neutral-500 uppercase block">Client Name</span>
              <span className="text-white font-bold">{request.customerName}</span>
            </div>
            <div>
              <span className="text-[9.5px] text-neutral-500 uppercase block">Assigned Artisan</span>
              <span className="text-amber-300 font-bold">
                {request.assignedTailorName || 'Master Tailor Henri Laurent'}
              </span>
            </div>
            <div>
              <span className="text-[9.5px] text-neutral-500 uppercase block">Atelier Salon</span>
              <span className="text-neutral-300 truncate block">{request.atelierBranch}</span>
            </div>
            <div>
              <span className="text-[9.5px] text-neutral-500 uppercase block">Warranty Coverage</span>
              <span className="text-emerald-400 font-bold">
                ✓ 100% Complimentary ({request.warrantySerialNumber})
              </span>
            </div>
          </div>

          {/* Master Tailor Chalk Directives & Fit Changes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Fit Adjustments List */}
            <div className="p-4 rounded-xl bg-[#141414] border border-[#252525] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-amber-400 uppercase tracking-widest font-bold">
                  Requested Fit Changes ({request.fitChanges.length})
                </span>
                <span className="text-[9px] text-neutral-500 font-mono">
                  Occasion: {request.wearOccasion || 'Standard Wardrobe'}
                </span>
              </div>

              <div className="space-y-2">
                {request.fitChanges.map((fc, idx) => (
                  <div
                    key={fc.id || idx}
                    className="p-2.5 rounded-lg bg-[#191919] border border-[#2C2C2C] flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-white text-xs block">{fc.regionLabel}</span>
                      <p className="text-[10px] text-neutral-400 font-sans mt-0.5">
                        {fc.issueDescription}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-1 rounded bg-amber-400/10 text-amber-300 font-bold">
                      {fc.directionLabel} ({fc.deltaCm > 0 ? `+${fc.deltaCm}` : fc.deltaCm} cm)
                    </span>
                  </div>
                ))}
              </div>

              {request.alterationNotes && (
                <div className="pt-2 border-t border-[#222]">
                  <span className="text-[9px] text-neutral-500 uppercase block mb-1">
                    Client's Personal Notes:
                  </span>
                  <p className="text-[11px] text-neutral-300 font-sans italic bg-[#101010] p-2.5 rounded-lg border border-[#222]">
                    "{request.alterationNotes}"
                  </p>
                </div>
              )}
            </div>

            {/* Master Tailor Directives & Chalk Log */}
            <div className="p-4 rounded-xl bg-[#141414] border border-[#252525] space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] text-amber-400 uppercase tracking-widest font-bold">
                  <Sparkles className="w-4 h-4" />
                  <span>Master Tailor Chalk & Blueprint Log</span>
                </div>

                <div className="p-3 rounded-lg bg-[#191919] border border-[#2C2C2C] space-y-2 text-xs">
                  <p className="text-neutral-300 font-mono leading-relaxed whitespace-pre-line text-[11px]">
                    {request.tailorChalkNotes ||
                      'Chalk lines verified by Savile Row cutting team. Precision hand basting applied.'}
                  </p>
                </div>

                {request.bodyPostureNotice && (
                  <div className="flex items-center justify-between text-[10px] text-neutral-400 pt-1">
                    <span>Posture Compensation:</span>
                    <span className="text-white font-bold font-mono">
                      {request.bodyPostureNotice.replace(/_/g, ' ')}
                    </span>
                  </div>
                )}
              </div>

              {/* White-Glove Courier & Valet Tracking */}
              <div className="p-3 rounded-lg bg-[#181818] border border-[#2C2C2C] space-y-1.5">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-neutral-400 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-amber-400" />
                    <span>Courier Service:</span>
                  </span>
                  <span className="text-white font-bold">{request.courierServiceName || 'Private Valet'}</span>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-neutral-400">Tracking Reference:</span>
                  <span className="text-amber-400 font-mono font-bold">
                    {request.trackingNumber || 'MD-VALET-7719-GB'}
                  </span>
                </div>
                {request.estimatedDeliveryDate && (
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-neutral-400">Estimated Delivery:</span>
                    <span className="text-emerald-400 font-mono">
                      {new Date(request.estimatedDeliveryDate).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Fitting Proofs: Before vs After Photos */}
          <div className="p-4 rounded-xl bg-[#141414] border border-[#252525] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-amber-400 uppercase tracking-widest font-bold">
                  Visual Fitting Proofs & Pinpoints
                </span>
                <div className="flex rounded-lg overflow-hidden border border-[#333] text-[10px]">
                  <button
                    onClick={() => setActivePhotoTab('BEFORE')}
                    className={`px-3 py-1 uppercase font-bold cursor-pointer ${
                      activePhotoTab === 'BEFORE'
                        ? 'bg-amber-400 text-black'
                        : 'bg-[#181818] text-neutral-400 hover:text-white'
                    }`}
                  >
                    Before Alteration ({request.photos.length})
                  </button>
                  <button
                    onClick={() => setActivePhotoTab('AFTER')}
                    className={`px-3 py-1 uppercase font-bold cursor-pointer ${
                      activePhotoTab === 'AFTER'
                        ? 'bg-amber-400 text-black'
                        : 'bg-[#181818] text-neutral-400 hover:text-white'
                    }`}
                  >
                    After Alteration ({request.afterPhotos?.length || 0})
                  </button>
                </div>
              </div>
              <span className="text-[10px] text-neutral-500 font-mono">
                {activePhotoTab === 'BEFORE' ? 'Client Fit Pins' : 'Master Tailor Completed Proof'}
              </span>
            </div>

            {activePhotoTab === 'BEFORE' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {request.photos.map((p, idx) => (
                  <div
                    key={p.id || idx}
                    className="relative aspect-4/3 rounded-xl overflow-hidden bg-black border border-[#2A2A2A] group"
                  >
                    <img src={p.url} alt={p.caption} className="w-full h-full object-cover" />
                    {/* Render Pinpoints */}
                    {p.pinCoordinates?.map((pin, pinIdx) => (
                      <div
                        key={pin.id || pinIdx}
                        style={{ left: `${pin.xPercent}%`, top: `${pin.yPercent}%` }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                      >
                        <div className="w-4 h-4 rounded-full bg-amber-400 text-black font-bold text-[9px] flex items-center justify-center border border-white shadow">
                          {pinIdx + 1}
                        </div>
                        <span className="bg-black/90 text-amber-300 text-[8px] font-mono px-1 py-0.2 rounded mt-0.5 border border-amber-400/40">
                          {pin.note}
                        </span>
                      </div>
                    ))}
                    <div className="absolute bottom-2 left-2 right-2 bg-black/80 backdrop-blur-sm p-1.5 rounded text-[9.5px] text-neutral-300 flex justify-between">
                      <span className="truncate">{p.caption}</span>
                      <span className="text-amber-400 font-mono uppercase">{p.angle}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                {request.afterPhotos && request.afterPhotos.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {request.afterPhotos.map((p, idx) => (
                      <div
                        key={p.id || idx}
                        className="relative aspect-4/3 rounded-xl overflow-hidden bg-black border border-emerald-500/30"
                      >
                        <img src={p.url} alt={p.caption} className="w-full h-full object-cover" />
                        <div className="absolute top-2 left-2 text-[9px] px-2 py-0.5 rounded-full bg-emerald-500 text-black font-bold uppercase">
                          ✓ Finished Seam Proof
                        </div>
                        <div className="absolute bottom-2 left-2 right-2 bg-black/80 backdrop-blur-sm p-1.5 rounded text-[9.5px] text-neutral-300">
                          {p.caption}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center rounded-lg bg-[#181818] border border-[#282828] text-neutral-500">
                    After-alteration photographs will be uploaded upon completion by the Master Tailor inspection desk.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Stepper Timeline Log */}
          <div className="space-y-3">
            <h4 className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold">
              Historical Custody & Atelier Milestones
            </h4>

            <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#252525]">
              {request.timeline.map((step, idx) => {
                return (
                  <div key={idx} className="relative">
                    <div
                      className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center border text-[9px] ${
                        step.completed
                          ? 'bg-amber-400 border-amber-300 text-black font-bold'
                          : 'bg-[#181818] border-neutral-700 text-neutral-600'
                      }`}
                    >
                      {step.completed ? '✓' : idx + 1}
                    </div>

                    <div className="p-3 rounded-xl bg-[#141414] border border-[#242424] space-y-1">
                      <div className="flex items-center justify-between">
                        <span
                          className={`font-bold text-xs uppercase ${
                            step.completed ? 'text-white' : 'text-neutral-500'
                          }`}
                        >
                          {step.title}
                        </span>
                        {step.completed && step.timestamp && (
                          <span className="text-[10px] text-neutral-500 font-mono">
                            {new Date(step.timestamp).toLocaleDateString([], {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-neutral-400 font-sans leading-relaxed">
                        {step.description}
                      </p>
                      <div className="flex items-center justify-between text-[9.5px] text-amber-400/80 font-mono pt-1">
                        <span>Actor: {step.actorName}</span>
                        <span className="text-neutral-500">Role: {step.actorRole}</span>
                      </div>
                      {step.notes && (
                        <div className="p-2 rounded bg-amber-400/5 border border-amber-400/20 text-[10px] text-amber-300 font-mono mt-1">
                          Log note: {step.notes}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Interactive Testing & Simulation Toolbar */}
        <div className="p-4 bg-[#121212] border-t border-[#222] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-[10px] text-neutral-400 uppercase font-mono">Test Simulator:</span>
            {currentStageIndex > 0 && (
              <button
                disabled={isSimulating}
                onClick={handleRewind}
                className="px-3 py-1.5 bg-[#222] hover:bg-[#333] text-neutral-300 text-xs rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                title="Rewind to previous stage"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Revert Stage</span>
              </button>
            )}

            {currentStageIndex < WORKFLOW_STAGES.length - 1 && (
              <button
                disabled={isSimulating}
                onClick={handleAdvance}
                className="px-4 py-1.5 bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs rounded-lg flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
              >
                <span>Advance to {WORKFLOW_STAGES[currentStageIndex + 1].label}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs rounded-xl cursor-pointer"
          >
            Close Tracker
          </button>
        </div>
      </div>
    </div>
  );
};
