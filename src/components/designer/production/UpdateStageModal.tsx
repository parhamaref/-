/**
 * @file UpdateStageModal.tsx
 * Modal to update an individual production milestone's status, progress percentage,
 * assigned craftsman, and customer summary narrative.
 */

import React, { useState, useEffect } from 'react';
import { X, Check, Sliders, AlertCircle, Clock, User, Eye } from 'lucide-react';
import {
  WorkflowStage,
  WorkflowStageStatus,
} from '../../../types/productionWorkflow.types';

export interface UpdateStageModalProps {
  isOpen: boolean;
  onClose: () => void;
  stage: WorkflowStage | null;
  onSave: (updates: Partial<WorkflowStage>) => void;
}

export const UpdateStageModal: React.FC<UpdateStageModalProps> = ({
  isOpen,
  onClose,
  stage,
  onSave,
}) => {
  const [status, setStatus] = useState<WorkflowStageStatus>('In Progress');
  const [progress, setProgress] = useState<number>(50);
  const [assignedArtisan, setAssignedArtisan] = useState('');
  const [customerSummary, setCustomerSummary] = useState('');

  useEffect(() => {
    if (stage) {
      setStatus(stage.status);
      setProgress(stage.progress);
      setAssignedArtisan(stage.assignedArtisan || '');
      setCustomerSummary(stage.customerSummary || '');
    }
  }, [stage, isOpen]);

  if (!isOpen || !stage) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      status,
      progress: status === 'Completed' ? 100 : status === 'Not Started' ? 0 : progress,
      assignedArtisan: assignedArtisan.trim(),
      customerSummary: customerSummary.trim(),
      completedAt: status === 'Completed' ? stage.completedAt || new Date().toISOString() : undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#0F0F0F] border border-[#2B2B2B] rounded-xs shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#222] flex items-center justify-between bg-[#141414]">
          <div>
            <h3 className="text-sm font-mono uppercase tracking-wider text-white font-medium">
              Update Stage: {stage.stage} (Stage {stage.order} of 8)
            </h3>
            <p className="text-[11px] text-neutral-400 font-sans">
              Update manufacturing milestone status and client-facing progress.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-xs hover:bg-[#222] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono uppercase text-neutral-300 mb-1.5">
                Stage Status *
              </label>
              <select
                value={status}
                onChange={(e) => {
                  const s = e.target.value as WorkflowStageStatus;
                  setStatus(s);
                  if (s === 'Completed') setProgress(100);
                  if (s === 'Not Started') setProgress(0);
                }}
                className="w-full px-3 py-2 bg-[#141414] border border-[#2B2B2B] text-xs font-mono rounded-xs text-white focus:border-amber-400 focus:outline-none cursor-pointer"
              >
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Blocked">Blocked / Held</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-300 mb-1.5 flex items-center justify-between">
                <span>Progress</span>
                <span className="text-amber-400 font-bold">{progress}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={progress}
                disabled={status === 'Completed' || status === 'Not Started'}
                onChange={(e) => setProgress(parseInt(e.target.value) || 0)}
                className="w-full accent-amber-400 cursor-pointer mt-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-neutral-300 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-amber-400" />
              Assigned Atelier Artisan
            </label>
            <input
              type="text"
              placeholder="e.g. Master Daniel, Brigitte Moreau"
              value={assignedArtisan}
              onChange={(e) => setAssignedArtisan(e.target.value)}
              className="w-full px-3 py-2 bg-[#141414] border border-[#2B2B2B] text-xs font-mono rounded-xs text-white focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-neutral-300 mb-1.5 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              Customer Portal Narrative
            </label>
            <textarea
              rows={3}
              placeholder="Describe current tailoring progress for the client in their tracking stream..."
              value={customerSummary}
              onChange={(e) => setCustomerSummary(e.target.value)}
              className="w-full px-3 py-2 bg-[#141414] border border-[#2B2B2B] text-xs font-sans rounded-xs text-white focus:border-amber-400 focus:outline-none"
            />
            <p className="text-[10px] text-neutral-500 mt-1">
              Shown to client when Customer Visibility is enabled.
            </p>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-[#222] flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-mono uppercase text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-mono uppercase tracking-wider font-semibold rounded-xs bg-amber-400 hover:bg-amber-300 text-black shadow-lg shadow-amber-400/20 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              Save Stage
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
