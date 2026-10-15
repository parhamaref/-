/**
 * @file RestoreConfirmModal.tsx
 * Safe Non-Destructive Rollback Confirmation Modal for Daniel’s Maison VCS.
 */

import React, { useState } from 'react';
import {
  X,
  RotateCcw,
  AlertTriangle,
  ArrowRight,
  GitCommit,
  CheckCircle2,
  Clock,
  ShieldAlert,
} from 'lucide-react';
import { VersionCommit } from '../../types/versionControl.types';

interface RestoreConfirmModalProps {
  isOpen: boolean;
  targetCommit: VersionCommit | null;
  currentHeadCommit: VersionCommit | null;
  onConfirm: (rationale: string) => void;
  onClose: () => void;
}

export const RestoreConfirmModal: React.FC<RestoreConfirmModalProps> = ({
  isOpen,
  targetCommit,
  currentHeadCommit,
  onConfirm,
  onClose,
}) => {
  const [rationale, setRationale] = useState(
    'Reverting to previously approved design specifications following client request.'
  );

  if (!isOpen || !targetCommit || !currentHeadCommit) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rationale.trim()) return;
    onConfirm(rationale.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-xl bg-[#0d0d0d] border border-[#333] rounded-xs shadow-2xl flex flex-col overflow-hidden text-neutral-100">
        {/* Header */}
        <div className="px-6 py-4 bg-[#141414] border-b border-[#222] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xs bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold tracking-wider uppercase text-white">
                RESTORE HISTORICAL VERSION
              </h2>
              <p className="text-[11px] font-mono text-neutral-400">
                Non-Destructive Git-Style Forward Revert
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-xs transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 font-mono text-xs">
          {/* Warning banner */}
          <div className="p-3.5 bg-amber-950/20 border border-amber-800/40 rounded-xs flex items-start gap-3 text-amber-200">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <strong className="text-amber-300 font-bold block mb-0.5">Non-Destructive Rollback Policy:</strong>
              Restoring this older version will not delete subsequent commit history. Instead, a new forward version commit will be generated, restoring all measurements, design specs, and fabrics from the selected snapshot.
            </div>
          </div>

          {/* Rollback Path Card */}
          <div className="bg-[#121212] border border-[#222] p-4 rounded-xs space-y-3">
            <div className="text-[10px] uppercase text-neutral-500 font-bold tracking-wider">
              Rollback Path Preview:
            </div>

            <div className="flex items-center justify-between gap-3 text-xs">
              {/* Current HEAD */}
              <div className="flex-1 bg-black p-3 rounded-xs border border-[#222]">
                <div className="text-[10px] text-neutral-500 uppercase">Current Active HEAD:</div>
                <div className="font-bold text-white text-sm mt-0.5">{currentHeadCommit.versionTag}</div>
                <div className="text-[10px] text-neutral-400 truncate">{currentHeadCommit.commitMessage}</div>
              </div>

              <ArrowRight className="w-5 h-5 text-amber-400 shrink-0" />

              {/* Target Snapshot */}
              <div className="flex-1 bg-black p-3 rounded-xs border border-amber-500/40">
                <div className="text-[10px] text-amber-400 uppercase font-bold">Target To Restore:</div>
                <div className="font-bold text-white text-sm mt-0.5">{targetCommit.versionTag}</div>
                <div className="text-[10px] text-neutral-400 truncate">{targetCommit.commitMessage}</div>
              </div>
            </div>

            {/* Target Spec Summary */}
            <div className="text-[11px] text-neutral-400 bg-neutral-900/60 p-2.5 rounded-xs space-y-1">
              <div>• <strong>Silhouette:</strong> {targetCommit.design.silhouetteName} ({targetCommit.design.lapelStyle})</div>
              <div>• <strong>Textile:</strong> {targetCommit.fabrics.primaryFabricName} ({targetCommit.fabrics.millName})</div>
              <div>• <strong>Chest / Waist:</strong> {targetCommit.measurements.chestCircumferenceCm}cm / {targetCommit.measurements.waistDropCm}cm</div>
            </div>
          </div>

          {/* Rationale Input */}
          <div>
            <label className="block text-[11px] uppercase text-neutral-300 font-bold mb-1.5">
              Rollback Rationale / Tailor Directive (Logged to Audit Trail):
            </label>
            <textarea
              rows={3}
              value={rationale}
              onChange={(e) => setRationale(e.target.value)}
              required
              className="w-full bg-black border border-[#333] p-3 rounded-xs text-xs text-neutral-200 placeholder:text-neutral-600 focus:outline-hidden focus:border-amber-500 leading-relaxed"
              placeholder="Explain reason for restoring this previous version..."
            />
          </div>

          {/* Buttons Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-[#222]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-neutral-400 hover:text-white transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold uppercase rounded-xs transition shadow-lg shadow-amber-900/20 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" /> Confirm & Execute Rollback
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
