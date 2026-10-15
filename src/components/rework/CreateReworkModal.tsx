/**
 * @file CreateReworkModal.tsx
 * Intake modal to commission a new Rework Request for garments failing QC or requiring remedial alteration.
 * Workflow initialization: sets initial status to 'QC Failed'.
 */

import React, { useState } from 'react';
import {
  RotateCcw,
  X,
  AlertTriangle,
  Plus,
  Trash2,
  ShieldCheck,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useReworkStore } from '../../stores/reworkStore';
import { QCDefectCategory, QCDefectSeverity } from '../../types/qualityControl.types';
import { ReworkPriority } from '../../types/rework.types';

interface DefectInput {
  defectCode: string;
  category: QCDefectCategory;
  severity: QCDefectSeverity;
  location: string;
  description: string;
  detectedBy: string;
  photoUrl?: string;
}

export const CreateReworkModal: React.FC = () => {
  const { isCreateModalOpen, setModalOpen, createReworkRequest } = useReworkStore();

  const [orderId, setOrderId] = useState('ORD-2026-0912');
  const [qcSessionId, setQcSessionId] = useState('QC-SESS-2026-015');
  const [clientName, setClientName] = useState('Prince Christian of Denmark');
  const [garmentName, setGarmentName] = useState('Bespoke Super 180s Wool Double-Breasted Dinner Suit');
  const [garmentSilhouette, setGarmentSilhouette] = useState('Double-Breasted Peak Lapel');
  const [orderTotal, setOrderTotal] = useState(5400);
  const [failedReason, setFailedReason] = useState(
    'Center back vent pitch skew of 2.5mm and left sleeve cuff out of tolerance by 3.0mm.'
  );
  const [leadInspector, setLeadInspector] = useState('Madame Hélène Vautier');
  const [leadInspectorBadge, setLeadInspectorBadge] = useState('MD-QC-LEAD-04');
  const [priority, setPriority] = useState<ReworkPriority>('Urgent (24h)');
  const [targetSlaHours, setTargetSlaHours] = useState(24);

  const [defects, setDefects] = useState<DefectInput[]>([
    {
      defectCode: 'DEF-VENT-02',
      category: 'Measurement',
      severity: 'Major',
      location: 'Center Back Double Vent',
      description: 'Right vent overlaps left vent with 2.5mm skew when standing upright.',
      detectedBy: 'Madame Hélène Vautier',
      photoUrl: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80',
    },
    {
      defectCode: 'DEF-CUFF-01',
      category: 'Stitching & Construction',
      severity: 'Minor',
      location: 'Left Sleeve Surgeon Cuff',
      description: 'Left sleeve hemline 3.0mm longer than master pattern specification.',
      detectedBy: 'Madame Hélène Vautier',
      photoUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
    },
  ]);

  if (!isCreateModalOpen) return null;

  const handleAddDefect = () => {
    setDefects([
      ...defects,
      {
        defectCode: `DEF-NEW-${defects.length + 1}`,
        category: 'Finishing & Pressing',
        severity: 'Minor',
        location: 'Lapel Gorge Seam',
        description: 'Minor puckering along inner silk lining seam.',
        detectedBy: leadInspector,
      },
    ]);
  };

  const handleRemoveDefect = (index: number) => {
    if (defects.length <= 1) return;
    setDefects(defects.filter((_, i) => i !== index));
  };

  const handleDefectChange = (index: number, field: keyof DefectInput, value: any) => {
    const updated = [...defects];
    updated[index] = { ...updated[index], [field]: value };
    setDefects(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const deadline = new Date(Date.now() + targetSlaHours * 3600 * 1000).toISOString();

    createReworkRequest({
      orderId,
      qcSessionId: qcSessionId || undefined,
      clientName,
      garmentName,
      garmentSilhouette,
      orderTotal: Number(orderTotal),
      failedReason,
      leadInspector,
      leadInspectorBadge,
      priority,
      targetSlaDeadline: deadline,
      defects,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#0c0c0c] border border-amber-900/40 rounded-xl shadow-2xl p-6 my-8 text-neutral-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-rose-950/60 border border-rose-800/40 flex items-center justify-center text-rose-400">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-serif tracking-wide text-neutral-100">Commission Rework Request</h2>
              <p className="text-xs text-neutral-400 tracking-wider">
                Stage 1 Workflow: Initial QC Failed Ticket Registration
              </p>
            </div>
          </div>
          <button
            onClick={() => setModalOpen('create', false)}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Order & Client Identity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono tracking-wider uppercase text-neutral-400 mb-1.5">
                Bespoke Order ID
              </label>
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                required
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:border-amber-600"
              />
            </div>
            <div>
              <label className="block text-xs font-mono tracking-wider uppercase text-neutral-400 mb-1.5">
                QC Session Ref (Optional)
              </label>
              <input
                type="text"
                value={qcSessionId}
                onChange={(e) => setQcSessionId(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:border-amber-600"
              />
            </div>

            <div>
              <label className="block text-xs font-mono tracking-wider uppercase text-neutral-400 mb-1.5">
                Client Full Name
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                required
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:border-amber-600"
              />
            </div>
            <div>
              <label className="block text-xs font-mono tracking-wider uppercase text-neutral-400 mb-1.5">
                Garment Valuation (£)
              </label>
              <input
                type="number"
                value={orderTotal}
                onChange={(e) => setOrderTotal(Number(e.target.value))}
                required
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:border-amber-600"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-mono tracking-wider uppercase text-neutral-400 mb-1.5">
                Garment Name & Fabric
              </label>
              <input
                type="text"
                value={garmentName}
                onChange={(e) => setGarmentName(e.target.value)}
                required
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:border-amber-600"
              />
            </div>

            <div>
              <label className="block text-xs font-mono tracking-wider uppercase text-neutral-400 mb-1.5">
                Silhouette / Cut
              </label>
              <input
                type="text"
                value={garmentSilhouette}
                onChange={(e) => setGarmentSilhouette(e.target.value)}
                required
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:border-amber-600"
              />
            </div>

            <div>
              <label className="block text-xs font-mono tracking-wider uppercase text-neutral-400 mb-1.5">
                Rework Priority SLA
              </label>
              <select
                value={priority}
                onChange={(e) => {
                  const val = e.target.value as ReworkPriority;
                  setPriority(val);
                  if (val.includes('12h')) setTargetSlaHours(12);
                  else if (val.includes('24h')) setTargetSlaHours(24);
                  else setTargetSlaHours(48);
                }}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:border-amber-600"
              >
                <option value="Standard (48h)">Standard (48-hour Turnaround)</option>
                <option value="Urgent (24h)">Urgent (24-hour Expedited)</option>
                <option value="Rush Haute Couture (12h)">Rush Haute Couture (12-hour Priority)</option>
              </select>
            </div>
          </div>

          {/* Failed Reason */}
          <div>
            <label className="block text-xs font-mono tracking-wider uppercase text-neutral-400 mb-1.5">
              Primary Inspection Failure Summary
            </label>
            <textarea
              rows={2}
              value={failedReason}
              onChange={(e) => setFailedReason(e.target.value)}
              required
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:border-amber-600"
              placeholder="State the non-conforming parameters identified during QC chamber testing..."
            />
          </div>

          {/* Inspector Credentials */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-neutral-950/60 border border-neutral-800/80 rounded-lg p-3">
            <div>
              <label className="block text-xs font-mono tracking-wider uppercase text-neutral-400 mb-1">
                Auditing QC Inspector
              </label>
              <input
                type="text"
                value={leadInspector}
                onChange={(e) => setLeadInspector(e.target.value)}
                required
                className="w-full bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1.5 text-xs text-neutral-200"
              />
            </div>
            <div>
              <label className="block text-xs font-mono tracking-wider uppercase text-neutral-400 mb-1">
                Inspector Badge Number
              </label>
              <input
                type="text"
                value={leadInspectorBadge}
                onChange={(e) => setLeadInspectorBadge(e.target.value)}
                required
                className="w-full bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1.5 text-xs text-neutral-200"
              />
            </div>
          </div>

          {/* Defect Tracking Items to Rectify */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-medium text-neutral-200">Non-Conforming Defects to Rectify ({defects.length})</h3>
              </div>
              <button
                type="button"
                onClick={handleAddDefect}
                className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-mono tracking-wider"
              >
                <Plus className="w-3.5 h-3.5" /> Add Defect
              </button>
            </div>

            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {defects.map((def, idx) => (
                <div key={idx} className="bg-neutral-950 border border-neutral-800/90 rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono text-amber-400 font-semibold">
                      #{idx + 1} {def.defectCode}
                    </span>
                    {defects.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveDefect(idx)}
                        className="text-neutral-500 hover:text-rose-400 text-xs transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] font-mono uppercase text-neutral-500">Category</label>
                      <select
                        value={def.category}
                        onChange={(e) => handleDefectChange(idx, 'category', e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded px-2 py-1 text-xs text-neutral-200"
                      >
                        <option value="Measurement">Measurement</option>
                        <option value="Stitching & Construction">Stitching & Construction</option>
                        <option value="Fabric & Weave">Fabric & Weave</option>
                        <option value="Finishing & Pressing">Finishing & Pressing</option>
                        <option value="Hardware & Fasteners">Hardware & Fasteners</option>
                        <option value="Lining & Structure">Lining & Structure</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono uppercase text-neutral-500">Severity</label>
                      <select
                        value={def.severity}
                        onChange={(e) => handleDefectChange(idx, 'severity', e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded px-2 py-1 text-xs text-neutral-200"
                      >
                        <option value="Minor">Minor</option>
                        <option value="Major">Major</option>
                        <option value="Critical">Critical</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono uppercase text-neutral-500">Garment Location</label>
                      <input
                        type="text"
                        value={def.location}
                        onChange={(e) => handleDefectChange(idx, 'location', e.target.value)}
                        placeholder="e.g. Center Back Seam"
                        className="w-full bg-neutral-900 border border-neutral-800 rounded px-2 py-1 text-xs text-neutral-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono uppercase text-neutral-500">Detailed Description</label>
                    <input
                      type="text"
                      value={def.description}
                      onChange={(e) => handleDefectChange(idx, 'description', e.target.value)}
                      placeholder="Specify deviation millimeters or geometric skew..."
                      className="w-full bg-neutral-900 border border-neutral-800 rounded px-2 py-1 text-xs text-neutral-200"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
            <button
              type="button"
              onClick={() => setModalOpen('create', false)}
              className="px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider text-neutral-400 hover:text-neutral-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-neutral-950 font-medium text-xs tracking-wider uppercase transition shadow-lg shadow-amber-950/40"
            >
              <RotateCcw className="w-4 h-4" /> Commission Request (QC Failed)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
