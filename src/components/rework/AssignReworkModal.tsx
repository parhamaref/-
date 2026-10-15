/**
 * @file AssignReworkModal.tsx
 * Modal to assign a Rework Request to a master tailor, workshop facility, and generate concrete remedial tasks.
 * Workflow transition: 'QC Failed' -> 'Rework Assigned'.
 */

import React, { useState } from 'react';
import {
  Users,
  X,
  CheckCircle2,
  Clock,
  Sparkles,
  Scissors,
  Wrench,
  AlertTriangle,
  Calendar,
  Building,
} from 'lucide-react';
import { useReworkStore } from '../../stores/reworkStore';
import { ReworkTaskCategory, ReworkPriority } from '../../types/rework.types';

export const AssignReworkModal: React.FC = () => {
  const { isAssignModalOpen, setModalOpen, activeRequest, tailorStaff, assignReworkTasks } = useReworkStore();

  const [selectedTailorId, setSelectedTailorId] = useState<string>(tailorStaff[0]?.id || 'TAILOR-01');
  const [selectedWorkshop, setSelectedWorkshop] = useState('Mayfair Master Atelier #1');
  const [priority, setPriority] = useState<ReworkPriority>(activeRequest?.priority || 'Urgent (24h)');
  const [targetDeadline, setTargetDeadline] = useState(
    new Date(Date.now() + 24 * 3600 * 1000).toISOString().split('T')[0]
  );
  const [supervisorNotes, setSupervisorNotes] = useState('Inspect alignment against CAD pattern spline after completion.');

  if (!isAssignModalOpen || !activeRequest) return null;

  const chosenTailor = tailorStaff.find((t) => t.id === selectedTailorId) || tailorStaff[0];

  // Map defects to default proposed tasks
  const proposedTasks = activeRequest.defects.map((defect, idx) => ({
    defectId: defect.id,
    title: `Remediate ${defect.location}: ${defect.defectCode}`,
    category: (defect.category.includes('Measurement')
      ? 'Measurement Alteration'
      : defect.category.includes('Stitch')
      ? 'Seam Restitch & Taper'
      : defect.category.includes('Finish')
      ? 'Lapel Roll & Cold Iron Re-Shape'
      : defect.category.includes('Hardware')
      ? 'Hardware & Button Re-Shank'
      : 'Hemline & Edge Re-Finish') as ReworkTaskCategory,
    description: defect.description,
    correctiveActionDetail: `Perform calibrated alteration on ${defect.location} to bring within tolerance.`,
    estimatedHours: defect.severity === 'Major' ? 2.5 : defect.severity === 'Critical' ? 4.0 : 1.5,
    priority: (defect.severity === 'Critical'
      ? 'Immediate'
      : defect.severity === 'Major'
      ? 'Urgent'
      : 'Standard') as 'Standard' | 'Urgent' | 'Immediate',
  }));

  const [taskList, setTaskList] = useState(proposedTasks);

  const handleTaskChange = (index: number, field: string, val: any) => {
    const updated = [...taskList];
    updated[index] = { ...updated[index], [field]: val };
    setTaskList(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    assignReworkTasks(activeRequest.id, {
      tailorName: chosenTailor.name,
      workshop: selectedWorkshop,
      targetDeadline: `${targetDeadline}T18:00:00Z`,
      priority,
      assignedBy: 'Atelier Production Master (Daniel’s Maison)',
      notes: supervisorNotes,
      tasks: taskList,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#0c0c0c] border border-amber-900/40 rounded-xl shadow-2xl p-6 my-8 text-neutral-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-950/60 border border-amber-800/40 flex items-center justify-center text-amber-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-serif tracking-wide text-neutral-100">Assign Rework Tasks</h2>
              <p className="text-xs text-neutral-400 tracking-wider">
                Workflow Step 2: Route non-conformances to master tailor workbench
              </p>
            </div>
          </div>
          <button
            onClick={() => setModalOpen('assign', false)}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Garment Summary Ribbon */}
        <div className="bg-neutral-950 border border-neutral-800/80 rounded-lg p-3.5 mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">
              Order {activeRequest.orderId} · {activeRequest.clientName}
            </div>
            <div className="text-sm font-medium text-neutral-100 mt-0.5">{activeRequest.garmentName}</div>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div>
              <span className="text-neutral-500 block font-mono text-[10px] uppercase">Failed Reason</span>
              <span className="text-rose-400 line-clamp-1 max-w-xs">{activeRequest.failedReason}</span>
            </div>
            <div>
              <span className="text-neutral-500 block font-mono text-[10px] uppercase">Defects</span>
              <span className="text-amber-400 font-mono font-medium">{activeRequest.defects.length} items</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Master Tailor Selection */}
          <div>
            <label className="block text-xs font-mono tracking-wider uppercase text-neutral-400 mb-2">
              Select Specialist Master Tailor
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {tailorStaff.map((tailor) => {
                const isSelected = tailor.id === selectedTailorId;
                return (
                  <div
                    key={tailor.id}
                    onClick={() => {
                      setSelectedTailorId(tailor.id);
                      setSelectedWorkshop(tailor.workshop);
                    }}
                    className={`cursor-pointer rounded-lg border p-3 transition flex items-center gap-3 ${
                      isSelected
                        ? 'border-amber-500 bg-amber-950/20 shadow-md shadow-amber-950/30'
                        : 'border-neutral-800 bg-neutral-950 hover:border-neutral-700'
                    }`}
                  >
                    <img
                      src={tailor.avatarUrl}
                      alt={tailor.name}
                      className="w-12 h-12 rounded-full object-cover border border-neutral-700"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-neutral-200">{tailor.name}</span>
                        <span className="text-xs font-mono text-amber-400 font-semibold">{tailor.firstTimeFixRate}% FTFR</span>
                      </div>
                      <div className="text-[11px] text-neutral-400 truncate">{tailor.specialty}</div>
                      <div className="flex items-center gap-3 mt-1 text-[10px] font-mono text-neutral-500">
                        <span>Load: {tailor.activeReworksCount}/{tailor.maxCapacity}</span>
                        <span>·</span>
                        <span>{tailor.workshop.split(' ')[0]}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Workshop & Deadline */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-mono tracking-wider uppercase text-neutral-400 mb-1.5">
                Workshop Location
              </label>
              <input
                type="text"
                value={selectedWorkshop}
                onChange={(e) => setSelectedWorkshop(e.target.value)}
                required
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-200"
              />
            </div>
            <div>
              <label className="block text-xs font-mono tracking-wider uppercase text-neutral-400 mb-1.5">
                Priority Class
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as ReworkPriority)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-200"
              >
                <option value="Standard (48h)">Standard (48h)</option>
                <option value="Urgent (24h)">Urgent (24h Expedited)</option>
                <option value="Rush Haute Couture (12h)">Rush Haute Couture (12h Priority)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono tracking-wider uppercase text-neutral-400 mb-1.5">
                Target SLA Completion
              </label>
              <input
                type="date"
                value={targetDeadline}
                onChange={(e) => setTargetDeadline(e.target.value)}
                required
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-200"
              />
            </div>
          </div>

          {/* Rework Remedial Tasks Breakdown */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono tracking-wider uppercase text-neutral-400">
                Remedial Tasks to Commission ({taskList.length})
              </label>
              <span className="text-xs font-mono text-neutral-500">
                Total Est: {taskList.reduce((acc, t) => acc + Number(t.estimatedHours || 0), 0)} hours
              </span>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {taskList.map((task, idx) => (
                <div key={idx} className="bg-neutral-950 border border-neutral-800/90 rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-amber-400">Task #{idx + 1}: {task.title}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">
                      Est. {task.estimatedHours}h
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-mono uppercase text-neutral-500">Task Category</label>
                      <select
                        value={task.category}
                        onChange={(e) => handleTaskChange(idx, 'category', e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded px-2 py-1 text-xs text-neutral-200"
                      >
                        <option value="Measurement Alteration">Measurement Alteration</option>
                        <option value="Seam Restitch & Taper">Seam Restitch & Taper</option>
                        <option value="Fabric Patch & Re-Cut">Fabric Patch & Re-Cut</option>
                        <option value="Lapel Roll & Cold Iron Re-Shape">Lapel Roll & Cold Iron Re-Shape</option>
                        <option value="Hardware & Button Re-Shank">Hardware & Button Re-Shank</option>
                        <option value="Cupro Lining Ease Adjustment">Cupro Lining Ease Adjustment</option>
                        <option value="Hemline & Edge Re-Finish">Hemline & Edge Re-Finish</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono uppercase text-neutral-500">Est. Hours</label>
                      <input
                        type="number"
                        step="0.5"
                        min="0.5"
                        max="20"
                        value={task.estimatedHours}
                        onChange={(e) => handleTaskChange(idx, 'estimatedHours', Number(e.target.value))}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded px-2 py-1 text-xs text-neutral-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono uppercase text-neutral-500">Corrective Action Prescription</label>
                    <input
                      type="text"
                      value={task.correctiveActionDetail}
                      onChange={(e) => handleTaskChange(idx, 'correctiveActionDetail', e.target.value)}
                      placeholder="Specific tailor instruction..."
                      className="w-full bg-neutral-900 border border-neutral-800 rounded px-2 py-1 text-xs text-neutral-200"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Supervisor Memo */}
          <div>
            <label className="block text-xs font-mono tracking-wider uppercase text-neutral-400 mb-1.5">
              Production Supervisor Instructions / Audit Memo
            </label>
            <input
              type="text"
              value={supervisorNotes}
              onChange={(e) => setSupervisorNotes(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-amber-600"
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
            <button
              type="button"
              onClick={() => setModalOpen('assign', false)}
              className="px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider text-neutral-400 hover:text-neutral-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-neutral-950 font-medium text-xs tracking-wider uppercase transition shadow-lg shadow-amber-950/40"
            >
              <CheckCircle2 className="w-4 h-4" /> Confirm Assignment & Move to 'Rework Assigned'
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
