/**
 * @file ReinspectionModal.tsx
 * Official QC Chamber Reinspection Bench & Haute Couture Accreditation Stamping.
 * Workflow transition: 'Reinspection' -> 'Approved' (Step 4 -> Step 5).
 */

import React, { useState } from 'react';
import {
  ShieldCheck,
  X,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Award,
  Sparkles,
  Ruler,
  Check,
  FileCheck,
  Stamp,
} from 'lucide-react';
import { useReworkStore } from '../../stores/reworkStore';

export const ReinspectionModal: React.FC = () => {
  const { isReinspectionModalOpen, setModalOpen, activeRequest, performReinspection } = useReworkStore();

  const [inspectorName, setInspectorName] = useState('Madame Hélène Vautier');
  const [badgeNumber, setBadgeNumber] = useState('MD-QC-LEAD-04');
  const [verdict, setVerdict] = useState<'Approved' | 'Further Rework Required' | 'Rejected / Scrapped'>('Approved');
  const [inspectorNotes, setInspectorNotes] = useState(
    'All remedial alterations inspected under 10x optical loupe and laser pitch caliber. Full conformity verified with zero deviation.'
  );

  const [measurementsReverified, setMeasurementsReverified] = useState(true);
  const [finishesReverified, setFinishesReverified] = useState(true);
  const [packagingReleased, setPackagingReleased] = useState(true);

  // Initialize checks from request
  const initialChecks = (activeRequest?.reinspectionChecks || []).map((c) => ({
    checkId: c.id,
    item: c.item,
    originalDeviation: c.originalDeviation,
    targetTolerance: c.targetTolerance,
    measuredRecheck: c.measuredRecheck && c.measuredRecheck !== 'Pending tailor remediation' ? c.measuredRecheck : '0.0mm exact match',
    toleranceVarianceMm: c.toleranceVarianceMm ?? 0.0,
    status: (c.status === 'Fail' ? 'Fail' : 'Pass') as 'Pass' | 'Fail',
    notes: c.inspectorNotes || 'Verified on calibrated inspection bench.',
  }));

  const [checks, setChecks] = useState(initialChecks);

  if (!isReinspectionModalOpen || !activeRequest) return null;

  const handleCheckStatusChange = (index: number, newStatus: 'Pass' | 'Fail') => {
    const updated = [...checks];
    updated[index].status = newStatus;
    setChecks(updated);

    // If any fails, auto suggest further rework
    if (newStatus === 'Fail') {
      setVerdict('Further Rework Required');
    }
  };

  const handleCheckFieldChange = (index: number, field: string, val: any) => {
    const updated = [...checks];
    updated[index] = { ...updated[index], [field]: val };
    setChecks(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    performReinspection(activeRequest.id, {
      reinspectedBy: inspectorName,
      inspectorBadgeNumber: badgeNumber,
      verdict,
      notes: inspectorNotes,
      measurementsReverified,
      finishesReverified,
      packagingReleased,
      checks: checks.map((c) => ({
        checkId: c.checkId,
        status: c.status,
        measuredRecheck: c.measuredRecheck,
        toleranceVarianceMm: c.toleranceVarianceMm,
        inspectorNotes: c.notes,
      })),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#0c0c0c] border border-emerald-900/40 rounded-xl shadow-2xl p-6 my-8 text-neutral-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-950/60 border border-emerald-800/40 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-serif tracking-wide text-neutral-100">Reinspection Chamber & Sign-off</h2>
              <p className="text-xs text-neutral-400 tracking-wider">
                Workflow Step 4 & 5: Final Post-Rework Audit & Official Accreditation
              </p>
            </div>
          </div>
          <button
            onClick={() => setModalOpen('reinspection', false)}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Piece Dossier */}
        <div className="bg-neutral-950 border border-neutral-800/80 rounded-lg p-3.5 mb-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">
              {activeRequest.orderId} · {activeRequest.clientName}
            </div>
            <div className="text-sm font-medium text-neutral-100 mt-0.5">{activeRequest.garmentName}</div>
          </div>
          <div className="text-right text-xs">
            <span className="text-neutral-500 block font-mono text-[10px] uppercase">Assigned Tailor</span>
            <span className="text-amber-400 font-medium">{activeRequest.assignedTailor || 'Master Tailor'}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Reinspection Verification Checklist */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono tracking-wider uppercase text-neutral-400 flex items-center gap-1.5">
                <Ruler className="w-3.5 h-3.5 text-emerald-400" /> Reinspection Verification Items ({checks.length})
              </label>
              <span className="text-[10px] font-mono text-neutral-500">Tolerance Target: Standard Haute Couture</span>
            </div>

            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {checks.map((chk, idx) => (
                <div
                  key={chk.checkId || idx}
                  className={`bg-neutral-950 border rounded-lg p-3 space-y-2 transition ${
                    chk.status === 'Pass' ? 'border-emerald-900/40' : 'border-rose-900/40'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium text-neutral-200">
                      #{idx + 1} {chk.item}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleCheckStatusChange(idx, 'Pass')}
                        className={`px-2.5 py-1 rounded text-[11px] font-mono font-medium transition flex items-center gap-1 ${
                          chk.status === 'Pass'
                            ? 'bg-emerald-600 text-neutral-950 font-bold'
                            : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200'
                        }`}
                      >
                        <Check className="w-3 h-3" /> PASS
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCheckStatusChange(idx, 'Fail')}
                        className={`px-2.5 py-1 rounded text-[11px] font-mono font-medium transition flex items-center gap-1 ${
                          chk.status === 'Fail'
                            ? 'bg-rose-600 text-white font-bold'
                            : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200'
                        }`}
                      >
                        <X className="w-3 h-3" /> FAIL
                      </button>
                    </div>
                  </div>

                  <div className="text-[11px] text-neutral-400 grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <span className="text-neutral-500 font-mono text-[10px] block">ORIGINAL DEVIATION</span>
                      <span className="text-rose-300 font-mono">{chk.originalDeviation}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 font-mono text-[10px] block">TARGET TOLERANCE</span>
                      <span className="text-neutral-300 font-mono">{chk.targetTolerance}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1 border-t border-neutral-900">
                    <div>
                      <label className="text-[10px] font-mono uppercase text-neutral-500">Measured Re-Check Value</label>
                      <input
                        type="text"
                        value={chk.measuredRecheck}
                        onChange={(e) => handleCheckFieldChange(idx, 'measuredRecheck', e.target.value)}
                        placeholder="e.g. 0.0mm exact or 67.0cm caliper match"
                        className="w-full bg-neutral-900 border border-neutral-800 rounded px-2 py-1 text-xs text-neutral-200"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono uppercase text-neutral-500">Inspector Observations</label>
                      <input
                        type="text"
                        value={chk.notes}
                        onChange={(e) => handleCheckFieldChange(idx, 'notes', e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded px-2 py-1 text-xs text-neutral-200"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Verification Protocol Checks */}
          <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-3 space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block">
              Daniel’s Maison Quality Protocol Sign-Offs
            </span>
            <label className="flex items-center gap-2.5 text-xs text-neutral-300 cursor-pointer">
              <input
                type="checkbox"
                checked={measurementsReverified}
                onChange={(e) => setMeasurementsReverified(e.target.checked)}
                className="w-4 h-4 rounded accent-emerald-500 bg-neutral-900"
              />
              <span>Garment measurements re-calibrated and 100% within tolerance bounds (±1.5mm)</span>
            </label>
            <label className="flex items-center gap-2.5 text-xs text-neutral-300 cursor-pointer">
              <input
                type="checkbox"
                checked={finishesReverified}
                onChange={(e) => setFinishesReverified(e.target.checked)}
                className="w-4 h-4 rounded accent-emerald-500 bg-neutral-900"
              />
              <span>Finishes, seams, and cold-iron pressing verified shine-free and pucker-free</span>
            </label>
            <label className="flex items-center gap-2.5 text-xs text-neutral-300 cursor-pointer">
              <input
                type="checkbox"
                checked={packagingReleased}
                onChange={(e) => setPackagingReleased(e.target.checked)}
                className="w-4 h-4 rounded accent-emerald-500 bg-neutral-900"
              />
              <span>Release garment hold: Approved for cedar garment bag & wax-sealed presentation</span>
            </label>
          </div>

          {/* Verdict Selector */}
          <div>
            <label className="block text-xs font-mono tracking-wider uppercase text-neutral-400 mb-2">
              Official Decision Verdict
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setVerdict('Approved')}
                className={`p-3 rounded-lg border text-left transition flex flex-col justify-between ${
                  verdict === 'Approved'
                    ? 'border-emerald-500 bg-emerald-950/30 text-emerald-200'
                    : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-serif font-bold text-emerald-400">APPROVED</span>
                  <Award className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-[11px] text-neutral-400 mt-1">Issue Haute Couture Seal & Dispatch Certificate</p>
              </button>

              <button
                type="button"
                onClick={() => setVerdict('Further Rework Required')}
                className={`p-3 rounded-lg border text-left transition flex flex-col justify-between ${
                  verdict === 'Further Rework Required'
                    ? 'border-amber-500 bg-amber-950/30 text-amber-200'
                    : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-serif font-bold text-amber-400">FURTHER REWORK</span>
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                </div>
                <p className="text-[11px] text-neutral-400 mt-1">Return to tailor workbench for punch list</p>
              </button>

              <button
                type="button"
                onClick={() => setVerdict('Rejected / Scrapped')}
                className={`p-3 rounded-lg border text-left transition flex flex-col justify-between ${
                  verdict === 'Rejected / Scrapped'
                    ? 'border-rose-500 bg-rose-950/30 text-rose-200'
                    : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-serif font-bold text-rose-400">REJECTED / SCRAP</span>
                  <XCircle className="w-4 h-4 text-rose-400" />
                </div>
                <p className="text-[11px] text-neutral-400 mt-1">Irreparable structural non-conformance</p>
              </button>
            </div>
          </div>

          {/* Inspector Memo */}
          <div>
            <label className="block text-xs font-mono tracking-wider uppercase text-neutral-400 mb-1.5">
              Official QC Certificate Statement & Auditor Notes
            </label>
            <textarea
              rows={2}
              value={inspectorNotes}
              onChange={(e) => setInspectorNotes(e.target.value)}
              required
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-emerald-600"
            />
          </div>

          {/* Inspector Signature Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-neutral-950 border border-neutral-800/80 rounded-lg p-3">
            <div>
              <label className="block text-xs font-mono tracking-wider uppercase text-neutral-400 mb-1">
                Certifying Lead Inspector
              </label>
              <input
                type="text"
                value={inspectorName}
                onChange={(e) => setInspectorName(e.target.value)}
                required
                className="w-full bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-200"
              />
            </div>
            <div>
              <label className="block text-xs font-mono tracking-wider uppercase text-neutral-400 mb-1">
                Badge / Accreditation Number
              </label>
              <input
                type="text"
                value={badgeNumber}
                onChange={(e) => setBadgeNumber(e.target.value)}
                required
                className="w-full bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-200"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
            <button
              type="button"
              onClick={() => setModalOpen('reinspection', false)}
              className="px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider text-neutral-400 hover:text-neutral-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-xs tracking-wider uppercase transition shadow-lg ${
                verdict === 'Approved'
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-neutral-950 shadow-emerald-950/40 font-bold'
                  : verdict === 'Further Rework Required'
                  ? 'bg-amber-600 hover:bg-amber-500 text-neutral-950 shadow-amber-950/40'
                  : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-950/40'
              }`}
            >
              <Stamp className="w-4 h-4" />
              {verdict === 'Approved' ? 'Stamp Accreditation Seal & Approve' : 'Submit Reinspection Verdict'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
