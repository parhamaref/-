/**
 * @file QCInspectionWorkspace.tsx
 * Quality Control (QC) Inspector Workbench.
 * Allows certified inspectors to conduct millimeter-tolerance evaluations,
 * log defect classifications, and trigger state machine shifts to 'Rework Required' or 'Ready'.
 */

import React, { useState } from 'react';
import { Order, QCRecord, QCResult, QCDefect, QCCriterion } from '../../types/daniels.types';
import { MOCK_ORDERS, MOCK_PRODUCTS, MOCK_QC_RECORDS } from '../../mock/danielsMockData';
import { logAuditAction } from '../../utils/rbac';
import { useAuth } from '../../contexts/AuthContext';
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Check,
  Plus,
  Trash2,
  Ruler,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface QCInspectionWorkspaceProps {
  orders: Order[];
  onOrderUpdated: (updatedOrder: Order) => void;
  onQCRecorded?: (record: QCRecord) => void;
}

export const QCInspectionWorkspace: React.FC<QCInspectionWorkspaceProps> = ({
  orders,
  onOrderUpdated,
  onQCRecorded,
}) => {
  const { currentUser } = useAuth();

  // Orders eligible for QC inspection
  const qcEligibleOrders = orders.filter((o) =>
    ['In Production', 'QC', 'Rework Required', 'Ready'].includes(o.status)
  );

  const [selectedOrderId, setSelectedOrderId] = useState<string>(
    qcEligibleOrders[0]?.id || orders[0]?.id || ''
  );
  const activeOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];
  const activeProduct = MOCK_PRODUCTS.find((p) => p.id === activeOrder?.productId) || MOCK_PRODUCTS[0];

  // Inspection Checklist State
  const [criteria, setCriteria] = useState<QCCriterion[]>([
    { item: 'Pattern symmetry across center back seam', passed: true, toleranceMm: 0.5 },
    { item: 'Shoulder balance offset & drop compensation', passed: true, toleranceMm: 1.0 },
    { item: 'Milanese hand-buttonhole stitch density (12 sts/cm)', passed: true },
    { item: 'Cupro lining tension & underarm ease clearance', passed: true },
    { item: 'Cold iron finish & absence of fabric pressing shine', passed: true },
  ]);

  const [decision, setDecision] = useState<QCResult>('Pass');
  const [defects, setDefects] = useState<QCDefect[]>([]);
  const [correctiveAction, setCorrectiveAction] = useState<string>('');

  // New Defect Input form
  const [newDefectCode, setNewDefectCode] = useState<string>('DEF-PKT-04');
  const [newDefectSeverity, setNewDefectSeverity] = useState<'Minor' | 'Major' | 'Critical'>('Minor');
  const [newDefectLocation, setNewDefectLocation] = useState<string>('Left waist exterior pocket');
  const [newDefectDesc, setNewDefectDesc] = useState<string>(
    'Left jetted pocket flap misaligned with chalk line by 1.8mm.'
  );

  const [submissionFeedback, setSubmissionFeedback] = useState<string | null>(null);

  const handleToggleCriterion = (index: number) => {
    setCriteria((prev) =>
      prev.map((c, i) => (i === index ? { ...c, passed: !c.passed } : c))
    );
  };

  const handleAddDefect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDefectDesc.trim()) return;

    setDefects((prev) => [
      ...prev,
      {
        defectCode: newDefectCode,
        severity: newDefectSeverity,
        locationOnGarment: newDefectLocation,
        description: newDefectDesc.trim(),
      },
    ]);

    setNewDefectDesc('');
    // Automatically set decision to Fail if defects are detected
    setDecision('Fail');
  };

  const handleRemoveDefect = (index: number) => {
    setDefects((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      if (updated.length === 0) setDecision('Pass');
      return updated;
    });
  };

  const handleSubmitQC = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrder) return;

    const newRecordId = `qc_rec_${Date.now()}`;
    const newQCRecord: QCRecord = {
      id: newRecordId,
      orderId: activeOrder.id,
      inspectionDetails: {
        inspectionDate: new Date().toISOString().split('T')[0],
        inspectorId: currentUser?.name || 'Claire Dupont (QC Lead)',
        criteriaChecked: criteria,
      },
      result: decision,
      defects: decision === 'Fail' ? defects : [],
      correctiveAction: decision === 'Fail' ? correctiveAction : null,
      approval: {
        approvedBy: decision === 'Pass' ? currentUser?.name || 'QC Inspector' : null,
        approvedAt: decision === 'Pass' ? new Date().toISOString() : null,
        version: 1,
      },
    };

    // STATE MACHINE TRIGGER (Requirement 3):
    // If QC fails: transition order status to 'Rework Required', route back to partner, strictly block dispatch.
    // If QC passes: transition order status to 'Ready' for dispatch.
    const nextOrderStatus = decision === 'Fail' ? 'Rework Required' : 'Ready';

    const updatedOrder: Order = {
      ...activeOrder,
      status: nextOrderStatus,
    };

    onOrderUpdated(updatedOrder);
    if (onQCRecorded) onQCRecorded(newQCRecord);

    // Audit Logging
    logAuditAction(
      currentUser,
      'QC',
      'edit',
      'ALLOWED',
      activeOrder.id,
      `QC Inspection completed with result '${decision}'. Order ${activeOrder.id} transitioned to '${nextOrderStatus}'.`
    );

    setSubmissionFeedback(
      decision === 'Fail'
        ? `Inspection sealed: FAIL. Order ${activeOrder.id} moved to 'Rework Required' and routed back to partner atelier.`
        : `Inspection sealed: PASS. Order ${activeOrder.id} moved to 'Ready' for White Glove dispatch.`
    );

    setTimeout(() => setSubmissionFeedback(null), 6000);
  };

  return (
    <div className="space-y-8 text-left font-mono animate-fadeIn">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-[#2B2B2B] pb-4">
        <div>
          <div className="flex items-center gap-2 text-neutral-400 text-[9px] uppercase tracking-widest mb-1">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>ATELIER QUALITY ASSURANCE BENCH</span>
          </div>
          <h2 className="font-serif text-2xl text-white uppercase font-bold tracking-wider">
            QC TOLERANCE INSPECTOR
          </h2>
          <p className="text-[10px] text-neutral-400 font-sans">
            Verify laser symmetry, hand-padded lapel roll, and anatomical alignment against client Spec V2.
          </p>
        </div>

        {/* Order Selector */}
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-neutral-500 uppercase">INSPECT ORDER:</span>
          <select
            value={selectedOrderId}
            onChange={(e) => setSelectedOrderId(e.target.value)}
            className="bg-[#0E0E0E] border border-[#2B2B2B] text-white text-[10.5px] p-2 rounded-xs outline-none"
          >
            {qcEligibleOrders.map((o) => (
              <option key={o.id} value={o.id}>
                {o.id} — [{o.status.toUpperCase()}]
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Submission Notice Banner */}
      {submissionFeedback && (
        <div
          className={`p-4 rounded-xs border text-[11px] flex items-center gap-2.5 font-bold ${
            decision === 'Fail'
              ? 'bg-rose-950/60 border-rose-500/80 text-rose-300'
              : 'bg-emerald-950/60 border-emerald-500/80 text-emerald-300'
          }`}
        >
          {decision === 'Fail' ? (
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          )}
          <span>{submissionFeedback}</span>
        </div>
      )}

      {/* Main Inspection Layout */}
      {activeOrder && (
        <form onSubmit={handleSubmitQC} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Criteria Checklist & Decision */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Diagnostic Capsule */}
            <div className="p-4 bg-[#0E0E0E] border border-[#2B2B2B] rounded-sm flex flex-col sm:flex-row justify-between gap-3 text-[10px]">
              <div>
                <span className="text-neutral-500 uppercase block text-[8px]">GARMENT SPEC:</span>
                <span className="font-serif text-base text-white uppercase font-bold block">
                  {activeProduct.name}
                </span>
                <span className="text-neutral-400 text-[8.5px] font-sans">
                  Assigned Partner: {activeOrder.partnerId || 'Unassigned'}
                </span>
              </div>
              <div className="text-right">
                <span className="text-neutral-500 uppercase block text-[8px]">CURRENT STATUS:</span>
                <span className="text-white font-bold tracking-wider uppercase block">
                  {activeOrder.status}
                </span>
                <span className="text-neutral-500 text-[8.5px]">
                  Monogram: {activeOrder.personalisation.monogram || 'N/A'}
                </span>
              </div>
            </div>

            {/* Tolerance Checklist Table */}
            <div className="bg-[#0E0E0E] border border-[#2B2B2B] p-5 rounded-sm space-y-3">
              <span className="text-[10px] text-white font-bold uppercase tracking-widest block border-b border-[#2B2B2B] pb-2">
                MILLIMETER TOLERANCE VERIFICATION DOCKET
              </span>

              <div className="space-y-2">
                {criteria.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleToggleCriterion(idx)}
                    className={`p-3 rounded-xs border flex items-center justify-between transition-colors cursor-pointer text-[10px] ${
                      item.passed
                        ? 'bg-black/60 border-[#2B2B2B] hover:border-neutral-400 text-neutral-300'
                        : 'bg-rose-950/20 border-rose-500/50 text-rose-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-xs border flex items-center justify-center ${
                          item.passed ? 'bg-white text-black border-white' : 'border-rose-400 text-rose-400'
                        }`}
                      >
                        {item.passed && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className="font-sans font-medium">{item.item}</span>
                    </div>

                    <div className="text-right">
                      {item.toleranceMm && (
                        <span className="text-[8.5px] text-neutral-500 font-mono block">
                          TOL: ±{item.toleranceMm}mm
                        </span>
                      )}
                      <span
                        className={`text-[8px] uppercase font-bold ${
                          item.passed ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {item.passed ? 'PASSED' : 'DEVIATION DETECTED'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Decision Toggle */}
            <div className="bg-[#0E0E0E] border border-[#2B2B2B] p-5 rounded-sm space-y-3">
              <span className="text-[10px] text-white font-bold uppercase tracking-widest block border-b border-[#2B2B2B] pb-2">
                OFFICIAL INSPECTION VERDICT
              </span>

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setDecision('Pass')}
                  className={`py-3 px-4 rounded-xs border text-center transition-all cursor-pointer font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 ${
                    decision === 'Pass'
                      ? 'bg-emerald-500 text-black border-emerald-400 shadow-xl'
                      : 'bg-black/40 border-[#2B2B2B] text-neutral-400 hover:text-white'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>PASS (READY FOR DISPATCH)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDecision('Fail')}
                  className={`py-3 px-4 rounded-xs border text-center transition-all cursor-pointer font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 ${
                    decision === 'Fail'
                      ? 'bg-rose-600 text-white border-rose-500 shadow-xl'
                      : 'bg-black/40 border-[#2B2B2B] text-neutral-400 hover:text-white'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>FAIL (ROUTE TO REWORK)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Defect Categorization & Corrective Action */}
          <div className="space-y-6">
            {decision === 'Fail' ? (
              <div className="bg-[#0E0E0E] border border-rose-900/60 p-5 rounded-sm space-y-4 animate-fadeIn">
                <div className="flex items-center gap-2 text-rose-400 border-b border-rose-900/40 pb-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    DEFECT CATEGORIZATION & REWORK
                  </span>
                </div>

                {/* Add Defect Inputs */}
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div>
                      <label className="text-[8px] text-neutral-400 uppercase block">DEFECT CODE</label>
                      <input
                        type="text"
                        value={newDefectCode}
                        onChange={(e) => setNewDefectCode(e.target.value)}
                        className="w-full bg-[#050505] border border-[#2B2B2B] p-2 rounded-xs text-white text-[10px] outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[8px] text-neutral-400 uppercase block">SEVERITY</label>
                      <select
                        value={newDefectSeverity}
                        onChange={(e) => setNewDefectSeverity(e.target.value as any)}
                        className="w-full bg-[#050505] border border-[#2B2B2B] p-2 rounded-xs text-white text-[10px] outline-none"
                      >
                        <option value="Minor">Minor (Aesthetic)</option>
                        <option value="Major">Major (Fit/Balance)</option>
                        <option value="Critical">Critical (Structural)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[8px] text-neutral-400 uppercase block">LOCATION ON GARMENT</label>
                    <input
                      type="text"
                      value={newDefectLocation}
                      onChange={(e) => setNewDefectLocation(e.target.value)}
                      className="w-full bg-[#050505] border border-[#2B2B2B] p-2 rounded-xs text-white text-[10px] outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[8px] text-neutral-400 uppercase block">DEFECT DESCRIPTION</label>
                    <textarea
                      rows={2}
                      value={newDefectDesc}
                      onChange={(e) => setNewDefectDesc(e.target.value)}
                      className="w-full bg-[#050505] border border-[#2B2B2B] p-2 rounded-xs text-white text-[10px] outline-none"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleAddDefect}
                    className="w-full py-2 bg-rose-950/60 hover:bg-rose-900/60 border border-rose-700/60 text-rose-300 text-[9px] font-bold uppercase tracking-wider rounded-xs cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-3 h-3" />
                    RECORD DEFECT ENTRY
                  </button>
                </div>

                {/* Defect List */}
                {defects.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-[#2B2B2B]">
                    <span className="text-[8px] text-neutral-500 uppercase block">
                      LOGGED DEFECT ENTRIES ({defects.length}):
                    </span>
                    {defects.map((def, i) => (
                      <div
                        key={i}
                        className="p-2 bg-black border border-rose-900/50 rounded-xs text-[9px] flex justify-between items-center text-rose-200"
                      >
                        <div>
                          <span className="font-bold">[{def.defectCode}]</span> {def.locationOnGarment}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveDefect(i)}
                          className="text-neutral-500 hover:text-white"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Mandatory Corrective Action */}
                <div className="space-y-1 pt-2">
                  <label className="text-[8px] text-rose-400 uppercase font-bold block">
                    MANDATORY CORRECTIVE ACTION DIRECTIVE:
                  </label>
                  <textarea
                    rows={3}
                    value={correctiveAction}
                    onChange={(e) => setCorrectiveAction(e.target.value)}
                    placeholder="Instructions for the partner workshop master cutter to unpick and rectify..."
                    className="w-full bg-[#050505] border border-rose-900/70 p-2 rounded-xs text-white text-[10px] outline-none placeholder-neutral-700"
                    required={decision === 'Fail'}
                  />
                </div>
              </div>
            ) : (
              <div className="p-5 bg-[#0E0E0E] border border-emerald-900/40 rounded-sm space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 border-b border-emerald-900/40 pb-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    READY FOR DISPATCH CLEARANCE
                  </span>
                </div>
                <p className="text-[10px] text-neutral-300 font-sans leading-relaxed">
                  Garment satisfies all millimeter tolerance benchmarks. Submitting this evaluation will transition order to <span className="text-white font-bold font-mono">Ready</span> and notify logistics concierge.
                </p>
              </div>
            )}

            {/* Submission Action */}
            <button
              type="submit"
              className={`w-full py-3.5 px-6 font-bold text-[10px] tracking-widest uppercase rounded-xs transition-colors cursor-pointer shadow-xl flex items-center justify-center gap-2 ${
                decision === 'Fail'
                  ? 'bg-rose-600 hover:bg-rose-500 text-white'
                  : 'bg-white hover:bg-neutral-200 text-black'
              }`}
            >
              <FileCheck className="w-4 h-4" />
              <span>
                {decision === 'Fail' ? 'SEAL QC REPORT & TRIGGER REWORK' : 'APPROVE QC & AUTHORIZE READY'}
              </span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default QCInspectionWorkspace;
