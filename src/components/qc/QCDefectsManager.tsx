/**
 * @file QCDefectsManager.tsx
 * Defect Registry & Corrective Actions Remediation Center.
 * Handles logging non-conformances, assigning remedial actions to tailors, tracking SLA deadlines, and certifying resolutions.
 */

import React, { useState } from 'react';
import {
  QCDefect,
  QCCorrectiveAction,
  QCDefectCategory,
  QCDefectSeverity,
} from '../../types/qualityControl.types';
import {
  AlertTriangle,
  Plus,
  CheckCircle2,
  Clock,
  ShieldAlert,
  ArrowRight,
  User,
  Calendar,
  Camera,
  ExternalLink,
} from 'lucide-react';

interface QCDefectsManagerProps {
  defects: QCDefect[];
  correctiveActions: QCCorrectiveAction[];
  onLogDefect: (
    defect: Omit<QCDefect, 'id' | 'detectedAt' | 'resolved'>,
    autoAction?: {
      actionRequired: string;
      assignedTo: string;
      priority: 'Immediate' | 'Standard' | 'Urgent';
      targetDate: string;
    }
  ) => void;
  onResolveDefect: (defectId: string) => void;
  onUpdateAction: (actionId: string, updates: Partial<QCCorrectiveAction>) => void;
}

const CATEGORIES: QCDefectCategory[] = [
  'Measurement',
  'Fabric & Weave',
  'Stitching & Construction',
  'Finishing & Pressing',
  'Hardware & Fasteners',
  'Lining & Structure',
  'Packaging & Presentation',
  'Labeling & Tagging',
];

export const QCDefectsManager: React.FC<QCDefectsManagerProps> = ({
  defects,
  correctiveActions,
  onLogDefect,
  onResolveDefect,
  onUpdateAction,
}) => {
  const [activeTab, setActiveTab] = useState<'defects' | 'actions'>('defects');
  const [showLogModal, setShowLogModal] = useState(false);

  // New Defect Form State
  const [defectCode, setDefectCode] = useState(`DEF-${Date.now().toString().slice(-4)}`);
  const [category, setCategory] = useState<QCDefectCategory>('Finishing & Pressing');
  const [severity, setSeverity] = useState<QCDefectSeverity>('Major');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [assignedTo, setAssignedTo] = useState('Master Tailor Workshop');
  const [actionRequired, setActionRequired] = useState('');
  const [priority, setPriority] = useState<'Immediate' | 'Standard' | 'Urgent'>('Urgent');
  const [targetDate, setTargetDate] = useState(
    new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]
  );

  const openDefects = defects.filter((d) => !d.resolved);
  const resolvedDefects = defects.filter((d) => d.resolved);

  const handleDefectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim() || !description.trim()) return;

    onLogDefect(
      {
        defectCode: defectCode.trim(),
        category,
        severity,
        locationOnGarment: location.trim(),
        description: description.trim(),
        photoUrl: photoUrl.trim() || undefined,
        detectedBy: 'QC Lead Inspector',
        reworkAssignedTo: assignedTo,
      },
      actionRequired.trim()
        ? {
            actionRequired: actionRequired.trim(),
            assignedTo: assignedTo.trim(),
            priority,
            targetDate,
          }
        : undefined
    );

    setLocation('');
    setDescription('');
    setActionRequired('');
    setShowLogModal(false);
  };

  return (
    <div className="space-y-6 text-left font-mono text-[11px]">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0A0A0A] p-4 border border-[#222] rounded-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('defects')}
            className={`px-3 py-1.5 text-[10px] uppercase tracking-wider rounded-xs transition-colors cursor-pointer ${
              activeTab === 'defects'
                ? 'bg-white text-black font-bold'
                : 'bg-neutral-900 text-neutral-400 hover:text-white border border-[#222]'
            }`}
          >
            Defects Register ({defects.length})
          </button>
          <button
            onClick={() => setActiveTab('actions')}
            className={`px-3 py-1.5 text-[10px] uppercase tracking-wider rounded-xs transition-colors cursor-pointer ${
              activeTab === 'actions'
                ? 'bg-white text-black font-bold'
                : 'bg-neutral-900 text-neutral-400 hover:text-white border border-[#222]'
            }`}
          >
            Corrective Actions ({correctiveActions.length})
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] text-rose-400 font-bold">
            ● {openDefects.length} Open Non-Conformances
          </span>
          <span className="text-[10px] text-emerald-400 font-bold">
            ● {resolvedDefects.length} Rectified
          </span>
          <button
            onClick={() => setShowLogModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xs font-bold uppercase transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Log Defect
          </button>
        </div>
      </div>

      {/* Log Defect Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0C0C0C] border border-[#2B2B2B] w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 rounded-xs space-y-5 animate-scaleUp">
            <div className="flex justify-between items-center border-b border-[#222] pb-3">
              <div>
                <span className="text-[9px] text-rose-400 font-bold uppercase tracking-widest block">
                  NON-CONFORMANCE REPORTING
                </span>
                <h3 className="font-serif text-lg text-white font-bold tracking-wider uppercase">
                  RECORD DEFECT & CORRECTIVE ACTION
                </h3>
              </div>
              <button
                onClick={() => setShowLogModal(false)}
                className="text-neutral-500 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleDefectSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[9px] text-neutral-400 uppercase block mb-1">Defect Code</label>
                  <input
                    type="text"
                    value={defectCode}
                    onChange={(e) => setDefectCode(e.target.value)}
                    className="w-full bg-black border border-[#333] text-white p-2 text-[10px] rounded-xs font-mono font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="text-[9px] text-neutral-400 uppercase block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-black border border-[#333] text-white p-2 text-[10px] rounded-xs"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[9px] text-neutral-400 uppercase block mb-1">Severity</label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as any)}
                    className="w-full bg-black border border-[#333] text-white p-2 text-[10px] rounded-xs font-bold text-rose-400"
                  >
                    <option value="Minor">Minor (Non-structural)</option>
                    <option value="Major">Major (Rework required)</option>
                    <option value="Critical">Critical (Re-cut / Reject)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[9px] text-neutral-400 uppercase block mb-1">
                  Location on Garment
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Left lapel gorge / Center back collar / Cuff vent"
                  className="w-full bg-black border border-[#333] text-white p-2 text-[10px] rounded-xs"
                  required
                />
              </div>

              <div>
                <label className="text-[9px] text-neutral-400 uppercase block mb-1">
                  Defect Description & Empirical Observations
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Describe deviation against CAD spec, thread tension, millimeter gap, or fabric flaw..."
                  className="w-full bg-black border border-[#333] text-white p-2 text-[10px] rounded-xs"
                  required
                />
              </div>

              <div>
                <label className="text-[9px] text-neutral-400 uppercase block mb-1">
                  Photo Evidence URL (Optional)
                </label>
                <input
                  type="text"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-black border border-[#333] text-white p-2 text-[10px] rounded-xs"
                />
              </div>

              {/* Linked Corrective Action Box */}
              <div className="bg-[#111] p-4 border border-rose-500/30 rounded-xs space-y-3">
                <span className="text-[9.5px] text-rose-400 font-bold uppercase tracking-wider block">
                  Prescribe Corrective Action (Rework Routing)
                </span>
                <div>
                  <label className="text-[9px] text-neutral-400 uppercase block mb-1">
                    Action Required by Atelier
                  </label>
                  <input
                    type="text"
                    value={actionRequired}
                    onChange={(e) => setActionRequired(e.target.value)}
                    placeholder="e.g. Steam relax nap, re-tension buttonhole gimp, or shorten sleeve by 3mm"
                    className="w-full bg-black border border-[#333] text-white p-2 text-[10px] rounded-xs"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[9px] text-neutral-400 uppercase block mb-1">
                      Assigned Tailor / Workshop
                    </label>
                    <input
                      type="text"
                      value={assignedTo}
                      onChange={(e) => setAssignedTo(e.target.value)}
                      className="w-full bg-black border border-[#333] text-white p-2 text-[10px] rounded-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-neutral-400 uppercase block mb-1">Priority</label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as any)}
                      className="w-full bg-black border border-[#333] text-white p-2 text-[10px] rounded-xs"
                    >
                      <option value="Immediate">Immediate (Quarantine)</option>
                      <option value="Urgent">Urgent (24h turnaround)</option>
                      <option value="Standard">Standard (48h turnaround)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] text-neutral-400 uppercase block mb-1">Target Date</label>
                    <input
                      type="date"
                      value={targetDate}
                      onChange={(e) => setTargetDate(e.target.value)}
                      className="w-full bg-black border border-[#333] text-white p-2 text-[10px] rounded-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#222]">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 border border-[#333] text-neutral-400 hover:text-white rounded-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold uppercase rounded-xs transition-colors"
                >
                  Commit Non-Conformance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DEFECTS TAB */}
      {activeTab === 'defects' && (
        <div className="space-y-4">
          {defects.length === 0 ? (
            <div className="bg-[#070707] border border-[#222] p-8 text-center rounded-xs space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <h4 className="font-serif text-base text-white uppercase font-bold">
                ZERO DEFECTS RECORDED
              </h4>
              <p className="text-[10px] text-neutral-400 font-sans max-w-sm mx-auto">
                No non-conformances logged for this garment. All parameters meet Daniel’s Maison standards.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {defects.map((defect) => (
                <div
                  key={defect.id}
                  className={`bg-[#0A0A0A] border p-4 rounded-xs space-y-3 transition-colors ${
                    defect.resolved
                      ? 'border-emerald-500/30 bg-emerald-950/10'
                      : defect.severity === 'Critical'
                      ? 'border-rose-500/60 bg-rose-950/15'
                      : 'border-amber-500/40 bg-amber-950/10'
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-bold text-white text-[11px]">
                          {defect.defectCode}
                        </span>
                        <span
                          className={`text-[8.5px] uppercase font-bold px-2 py-0.5 rounded-xs ${
                            defect.severity === 'Critical'
                              ? 'bg-rose-900 text-rose-200'
                              : defect.severity === 'Major'
                              ? 'bg-amber-900 text-amber-200'
                              : 'bg-neutral-800 text-neutral-300'
                          }`}
                        >
                          {defect.severity}
                        </span>
                        <span className="text-[8.5px] text-neutral-500 uppercase">
                          {defect.category}
                        </span>
                      </div>
                      <h4 className="font-serif text-sm text-neutral-200 font-bold uppercase">
                        {defect.locationOnGarment}
                      </h4>
                    </div>

                    {defect.resolved ? (
                      <span className="text-[9px] text-emerald-400 font-bold uppercase border border-emerald-500/40 bg-emerald-950/40 px-2 py-0.5 rounded-xs">
                        RECTIFIED
                      </span>
                    ) : (
                      <button
                        onClick={() => onResolveDefect(defect.id)}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[9px] font-bold uppercase rounded-xs transition-colors cursor-pointer"
                      >
                        Mark Resolved
                      </button>
                    )}
                  </div>

                  <p className="text-[10.5px] text-neutral-300 font-sans leading-relaxed">
                    {defect.description}
                  </p>

                  {defect.photoUrl && (
                    <div className="h-32 w-full rounded-xs overflow-hidden border border-[#222] bg-black">
                      <img
                        src={defect.photoUrl}
                        alt="Defect visual"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="flex justify-between items-center text-[9px] text-neutral-500 pt-2 border-t border-[#1E1E1E]">
                    <span>Detected by: {defect.detectedBy}</span>
                    <span>
                      {new Date(defect.detectedAt).toLocaleDateString()} at{' '}
                      {new Date(defect.detectedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CORRECTIVE ACTIONS TAB */}
      {activeTab === 'actions' && (
        <div className="space-y-4">
          {correctiveActions.length === 0 ? (
            <div className="bg-[#070707] border border-[#222] p-8 text-center rounded-xs space-y-2">
              <Clock className="w-8 h-8 text-neutral-500 mx-auto" />
              <h4 className="font-serif text-base text-white uppercase font-bold">
                NO ACTIONS CURRENTLY OUTSTANDING
              </h4>
              <p className="text-[10px] text-neutral-400 font-sans max-w-sm mx-auto">
                No corrective rework instructions assigned for this piece.
              </p>
            </div>
          ) : (
            <div className="bg-[#070707] border border-[#222] rounded-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-[11px]">
                  <thead>
                    <tr className="border-b border-[#222] bg-[#0E0E0E] text-[9px] text-neutral-500 uppercase tracking-wider">
                      <th className="py-3 px-4">STATUS</th>
                      <th className="py-3 px-4">PRIORITY</th>
                      <th className="py-3 px-4">PRESCRIBED REMEDIATION ACTION</th>
                      <th className="py-3 px-4">ASSIGNED ATELIER</th>
                      <th className="py-3 px-4">DUE DATE</th>
                      <th className="py-3 px-4 text-right">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1A1A1A]">
                    {correctiveActions.map((act) => (
                      <tr key={act.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded-xs text-[9px] font-bold uppercase tracking-wider ${
                              act.status === 'Resolved'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                : act.status === 'In Progress'
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                                : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                            }`}
                          >
                            {act.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-bold text-neutral-300">
                          {act.priority}
                        </td>
                        <td className="py-3 px-4 max-w-md">
                          <div className="text-white font-bold text-[11px]">{act.actionRequired}</div>
                          {act.remedialNotes && (
                            <div className="text-[9.5px] text-neutral-400 font-sans mt-0.5">
                              {act.remedialNotes}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4 text-neutral-300">{act.assignedTailorOrWorkshop}</td>
                        <td className="py-3 px-4 text-neutral-400">{act.targetCompletionDate}</td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          {act.status !== 'Resolved' ? (
                            <button
                              onClick={() =>
                                onUpdateAction(act.id, {
                                  status: 'Resolved',
                                  completedAt: new Date().toISOString(),
                                })
                              }
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[9px] font-bold uppercase rounded-xs cursor-pointer transition-colors"
                            >
                              Verify Fixed
                            </button>
                          ) : (
                            <span className="text-[9px] text-neutral-500 uppercase">CLOSED</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
