/**
 * @file TaskProgressModal.tsx
 * Modal for tailors to log bench hours, corrective actions taken, and before/after photo evidence.
 * Powers Defect Tracking & Corrective Action Tracking.
 */

import React, { useState, useEffect } from 'react';
import {
  Wrench,
  X,
  CheckCircle2,
  Clock,
  Camera,
  Check,
  Percent,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import { useReworkStore } from '../../stores/reworkStore';
import { ReworkTask } from '../../types/rework.types';

export const TaskProgressModal: React.FC = () => {
  const { isTaskModalOpen, setModalOpen, activeRequest, selectedTaskId, updateTaskProgress } = useReworkStore();

  const task = activeRequest?.tasks.find((t) => t.id === selectedTaskId) || null;

  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [actualHours, setActualHours] = useState<number>(0);
  const [status, setStatus] = useState<ReworkTask['status']>('In Progress');
  const [tailorNotes, setTailorNotes] = useState('');
  const [beforePhotoUrl, setBeforePhotoUrl] = useState('');
  const [afterPhotoUrl, setAfterPhotoUrl] = useState('');

  useEffect(() => {
    if (task) {
      setProgressPercent(task.progressPercent || 0);
      setActualHours(task.actualHours || 0);
      setStatus(task.status || 'In Progress');
      setTailorNotes(task.tailorNotes || '');
      setBeforePhotoUrl(task.beforePhotoUrl || '');
      setAfterPhotoUrl(task.afterPhotoUrl || '');
    }
  }, [task]);

  if (!isTaskModalOpen || !activeRequest || !task) return null;

  const linkedDefect = activeRequest.defects.find((d) => d.id === task.defectId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const isDone = progressPercent === 100 || status === 'Completed';

    updateTaskProgress(
      activeRequest.id,
      task.id,
      {
        progressPercent: Number(progressPercent),
        actualHours: Number(actualHours),
        status: isDone ? 'Completed' : status,
        tailorNotes,
        beforePhotoUrl: beforePhotoUrl || undefined,
        afterPhotoUrl: afterPhotoUrl || undefined,
      },
      task.assignedTailor
    );
  };

  const handleMark100Percent = () => {
    setProgressPercent(100);
    setStatus('Completed');
    if (!afterPhotoUrl) {
      setAfterPhotoUrl('https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0c0c0c] border border-amber-900/40 rounded-xl shadow-2xl p-6 my-8 text-neutral-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-950/60 border border-amber-800/40 flex items-center justify-center text-amber-400">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-serif tracking-wide text-neutral-100">Tailor Bench Progress Log</h2>
              <p className="text-xs text-neutral-400 tracking-wider">
                Corrective Action & Remediation Tracking · {task.assignedTailor}
              </p>
            </div>
          </div>
          <button
            onClick={() => setModalOpen('task', false)}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Task & Defect Context */}
        <div className="bg-neutral-950 border border-neutral-800/80 rounded-lg p-3.5 mb-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-amber-400 uppercase tracking-wider">{task.category}</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">
              Est: {task.estimatedHours}h · Priority: {task.priority}
            </span>
          </div>
          <div className="text-sm font-medium text-neutral-100">{task.title}</div>
          <div className="text-xs text-neutral-400">{task.correctiveActionDetail}</div>

          {linkedDefect && (
            <div className="mt-2 pt-2 border-t border-neutral-800/60 flex items-center gap-2 text-xs text-rose-300">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-rose-400" />
              <span>
                Resolves Defect <strong className="font-mono">{linkedDefect.defectCode}</strong> ({linkedDefect.location})
              </span>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Progress Slider */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                <Percent className="w-3.5 h-3.5 text-amber-500" /> Remediation Progress
              </label>
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono text-amber-400 font-bold">{progressPercent}%</span>
                <button
                  type="button"
                  onClick={handleMark100Percent}
                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800 text-emerald-300 hover:bg-emerald-900 transition"
                >
                  Set 100% (Completed)
                </button>
              </div>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={progressPercent}
              onChange={(e) => {
                const val = Number(e.target.value);
                setProgressPercent(val);
                if (val === 100) setStatus('Completed');
                else if (val > 0) setStatus('In Progress');
              }}
              className="w-full accent-amber-500 cursor-pointer h-2 bg-neutral-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] font-mono text-neutral-600 mt-1">
              <span>0% (Not Started)</span>
              <span>50% (Bench Alteration)</span>
              <span>100% (Remediated)</span>
            </div>
          </div>

          {/* Actual Hours & Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono tracking-wider uppercase text-neutral-400 mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-500" /> Actual Bench Hours Logged
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="50"
                value={actualHours}
                onChange={(e) => setActualHours(Number(e.target.value))}
                required
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-200"
              />
            </div>

            <div>
              <label className="block text-xs font-mono tracking-wider uppercase text-neutral-400 mb-1.5">
                Task Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-200"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress (Active Bench Work)</option>
                <option value="Completed">Completed (Ready for Inspection)</option>
              </select>
            </div>
          </div>

          {/* Tailor Notes */}
          <div>
            <label className="block text-xs font-mono tracking-wider uppercase text-neutral-400 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-amber-500" /> Tailor Bench Observations & Work Done
            </label>
            <textarea
              rows={3}
              value={tailorNotes}
              onChange={(e) => setTailorNotes(e.target.value)}
              placeholder="Describe the technical needlework, basting, cutting, or pressing methods used to remediate the defect..."
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-amber-600"
            />
          </div>

          {/* Photo Evidence Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono tracking-wider uppercase text-neutral-400 mb-1 flex items-center gap-1">
                <Camera className="w-3 h-3 text-neutral-500" /> Before Photo URL
              </label>
              <input
                type="url"
                value={beforePhotoUrl}
                onChange={(e) => setBeforePhotoUrl(e.target.value)}
                placeholder="https://..."
                className="w-full bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1.5 text-xs text-neutral-300"
              />
              {beforePhotoUrl && (
                <img
                  src={beforePhotoUrl}
                  alt="Before"
                  className="mt-2 h-20 w-full object-cover rounded border border-neutral-800"
                />
              )}
            </div>

            <div>
              <label className="block text-xs font-mono tracking-wider uppercase text-neutral-400 mb-1 flex items-center gap-1">
                <Camera className="w-3 h-3 text-emerald-500" /> After (Remediated) Photo URL
              </label>
              <input
                type="url"
                value={afterPhotoUrl}
                onChange={(e) => setAfterPhotoUrl(e.target.value)}
                placeholder="https://..."
                className="w-full bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1.5 text-xs text-neutral-300"
              />
              {afterPhotoUrl && (
                <img
                  src={afterPhotoUrl}
                  alt="After"
                  className="mt-2 h-20 w-full object-cover rounded border border-emerald-900/60"
                />
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
            <button
              type="button"
              onClick={() => setModalOpen('task', false)}
              className="px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider text-neutral-400 hover:text-neutral-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-neutral-950 font-medium text-xs tracking-wider uppercase transition shadow-lg shadow-amber-950/40"
            >
              <Check className="w-4 h-4" /> Save Remediation Progress
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
