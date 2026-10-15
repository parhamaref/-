/**
 * @file ProductionStageController.tsx
 * Production State Machine Controller for workshop tailors and master cutters.
 * Enforces business rules and stage transitions:
 * Not Started -> Assigned -> Cutting -> Making -> Finishing -> QC -> Rework -> Complete
 */

import React, { useState } from 'react';
import { ProductionJob, ProductionStage, QCRecord } from '../../types/daniels.types';
import {
  canTransitionProduction,
  getValidNextProductionStages,
} from '../../utils/danielsStateValidators';
import {
  Scissors,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  FileText,
  Sliders,
  Check,
} from 'lucide-react';

interface ProductionStageControllerProps {
  job: ProductionJob;
  qcRecord?: QCRecord | null;
  onUpdateJob: (updatedJob: ProductionJob) => void;
}

const ALL_STAGES: ProductionStage[] = [
  'Not Started',
  'Assigned',
  'Cutting',
  'Making',
  'Finishing',
  'QC',
  'Rework',
  'Complete',
];

export const ProductionStageController: React.FC<ProductionStageControllerProps> = ({
  job,
  qcRecord,
  onUpdateJob,
}) => {
  const currentStage = job.stage;
  const validNextStages = getValidNextProductionStages(currentStage);

  const [selectedNextStage, setSelectedNextStage] = useState<ProductionStage>(
    validNextStages[0] || currentStage
  );
  const [progress, setProgress] = useState<number>(job.progress);
  const [noteText, setNoteText] = useState<string>('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Transition validation
  const handleStageTransition = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setSuccessNotice(null);

    const conditions = {
      progressPercentage: progress,
      qcResult: qcRecord?.result,
      partnerVerified: true,
      materialAllocated: true,
      reworkNotesPresent: Boolean(qcRecord?.correctiveAction || noteText),
    };

    const validation = canTransitionProduction(currentStage, selectedNextStage, conditions);

    if (!validation.allowed) {
      setValidationError(validation.reason || `Transition to ${selectedNextStage} is not permitted.`);
      return;
    }

    const updatedJob: ProductionJob = {
      ...job,
      stage: selectedNextStage,
      progress: selectedNextStage === 'Complete' ? 100 : progress,
      notes: noteText.trim()
        ? [
            ...job.notes,
            {
              timestamp: new Date().toISOString(),
              authorId: job.partnerId,
              text: `[Stage Advanced to ${selectedNextStage}] ${noteText.trim()}`,
            },
          ]
        : job.notes,
      status: selectedNextStage === 'Complete' ? 'Completed' : 'In Progress',
    };

    onUpdateJob(updatedJob);
    setSuccessNotice(`Production job successfully transitioned to stage: ${selectedNextStage}`);
    setNoteText('');

    // Reset next valid stages
    const nextValids = getValidNextProductionStages(selectedNextStage);
    if (nextValids.length > 0) {
      setSelectedNextStage(nextValids[0]);
    }

    setTimeout(() => setSuccessNotice(null), 4000);
  };

  const handleUpdateProgressOnly = () => {
    const updatedJob: ProductionJob = {
      ...job,
      progress,
      notes: noteText.trim()
        ? [
            ...job.notes,
            {
              timestamp: new Date().toISOString(),
              authorId: job.partnerId,
              text: `[Progress Updated to ${progress}%] ${noteText.trim()}`,
            },
          ]
        : job.notes,
    };
    onUpdateJob(updatedJob);
    setSuccessNotice(`Progress updated to ${progress}%`);
    setNoteText('');
    setTimeout(() => setSuccessNotice(null), 3000);
  };

  return (
    <div className="bg-[#0E0E0E] border border-[#2B2B2B] p-6 rounded-sm space-y-6 font-mono text-left">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2B2B2B] pb-3">
        <div className="flex items-center gap-2">
          <Scissors className="w-4 h-4 text-emerald-400" />
          <span className="text-[10px] text-white font-bold uppercase tracking-widest">
            PRODUCTION STATE MACHINE CONTROLLER
          </span>
        </div>
        <span className="text-[8.5px] text-neutral-400 uppercase tracking-widest">
          ACTIVE STAGE: <span className="text-white font-bold">{currentStage}</span>
        </span>
      </div>

      {/* Visual Stage Pipeline */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-1.5">
        {ALL_STAGES.map((stg) => {
          const isCurrent = currentStage === stg;
          const isAllowedNext = validNextStages.includes(stg);
          const isRework = stg === 'Rework';

          return (
            <div
              key={stg}
              className={`p-2 rounded-xs border text-center transition-all ${
                isCurrent
                  ? isRework
                    ? 'bg-rose-950/40 border-rose-500 text-rose-300 ring-1 ring-rose-500/50'
                    : 'bg-white text-black border-white font-bold shadow-md'
                  : isAllowedNext
                  ? 'bg-black border-emerald-500/40 text-emerald-400 cursor-pointer hover:border-emerald-400'
                  : 'bg-black/40 border-[#2B2B2B]/40 text-neutral-600'
              }`}
              onClick={() => {
                if (isAllowedNext) setSelectedNextStage(stg);
              }}
            >
              <span className="text-[8px] uppercase tracking-wider block font-mono truncate">
                {stg}
              </span>
              {isCurrent && (
                <span className="text-[6.5px] uppercase font-bold block mt-0.5 tracking-widest">
                  [CURRENT]
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Notices */}
      {validationError && (
        <div className="p-3 bg-rose-950/40 border border-rose-500/40 rounded-xs text-rose-300 text-[10px] flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {successNotice && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xs text-emerald-300 text-[10px] flex items-center gap-2.5">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successNotice}</span>
        </div>
      )}

      {/* Progress & Milestone Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Progress Slider */}
        <div className="p-4 bg-black/60 border border-[#2B2B2B] rounded-xs space-y-3">
          <div className="flex justify-between items-center text-[10px]">
            <span className="text-neutral-400 uppercase font-bold">ATELIER COMPLETION PROGRESS</span>
            <span className="text-white font-mono font-bold text-sm">{progress}%</span>
          </div>

          <input
            type="range"
            min={0}
            max={100}
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            className="w-full h-1 bg-[#2B2B2B] rounded-lg appearance-none cursor-pointer accent-white"
          />

          <div className="flex justify-between text-[7.5px] text-neutral-500 uppercase">
            <span>0% (PATTERN DRAFT)</span>
            <span>50% (PAD BASTING)</span>
            <span>100% (COLD PRESS)</span>
          </div>

          <button
            type="button"
            onClick={handleUpdateProgressOnly}
            className="w-full py-1.5 border border-[#2B2B2B] hover:border-neutral-400 text-neutral-300 hover:text-white text-[9px] uppercase tracking-widest rounded-xs transition-colors cursor-pointer"
          >
            SYNC PROGRESS METRIC ({progress}%)
          </button>
        </div>

        {/* Transition Form */}
        <form onSubmit={handleStageTransition} className="p-4 bg-black/60 border border-[#2B2B2B] rounded-xs space-y-3">
          <div className="space-y-1">
            <label className="text-[8.5px] text-neutral-400 uppercase tracking-wider block">
              PERMITTED TARGET STAGE
            </label>
            {validNextStages.length > 0 ? (
              <select
                value={selectedNextStage}
                onChange={(e) => setSelectedNextStage(e.target.value as ProductionStage)}
                className="w-full bg-[#050505] border border-[#2B2B2B] focus:border-white p-2 rounded-xs text-white text-[10.5px] outline-none"
              >
                {validNextStages.map((stg) => (
                  <option key={stg} value={stg}>
                    Advance to: {stg.toUpperCase()}
                  </option>
                ))}
              </select>
            ) : (
              <div className="p-2 text-[10px] text-neutral-500 italic bg-black">
                Terminal Stage Reached ({currentStage}).
              </div>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-[8.5px] text-neutral-400 uppercase tracking-wider block">
              WORKSHOP INTERNAL LOG NOTE
            </label>
            <input
              type="text"
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="E.g., Chest canvas prick-stitched; ready for QC evaluation..."
              className="w-full bg-[#050505] border border-[#2B2B2B] focus:border-white p-2 rounded-xs text-white text-[10px] outline-none placeholder-neutral-700"
            />
          </div>

          <button
            type="submit"
            disabled={validNextStages.length === 0}
            className="w-full py-2.5 bg-white hover:bg-neutral-200 disabled:bg-neutral-800 disabled:text-neutral-500 text-black text-[9.5px] font-bold tracking-widest uppercase rounded-xs transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-lg"
          >
            <span>DISPATCH STAGE TRANSITION</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* Workshop Notes Log History */}
      {job.notes.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-[#2B2B2B]">
          <span className="text-[9px] text-neutral-500 uppercase tracking-widest block">
            HISTORICAL WORKSHOP DIARY ({job.notes.length})
          </span>
          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
            {job.notes.map((n, idx) => (
              <div
                key={idx}
                className="p-2 bg-black border border-[#2B2B2B] rounded-xs text-[9px] flex justify-between gap-2"
              >
                <span className="text-neutral-300 font-sans">{n.text}</span>
                <span className="text-neutral-500 font-mono shrink-0">
                  {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductionStageController;
