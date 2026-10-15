/**
 * @file QCApprovalModal.tsx
 * Official Decision & Haute Couture Accreditation Certification Modal.
 * Generates digital certificates for 'Pass', tailor rework routing for 'Rework Required', and quarantine reports for 'Fail'.
 */

import React, { useState } from 'react';
import { QCInspectionSession, QCResult } from '../../types/qualityControl.types';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileCheck,
  Award,
  Hash,
  User,
  Calendar,
  Lock,
} from 'lucide-react';
import { ReworkApiService } from '../../services/reworkApi';
import { AuditTrailService } from '../../services/auditTrailApi';

interface QCApprovalModalProps {
  session: QCInspectionSession;
  isOpen: boolean;
  onClose: () => void;
  onIssueDecision: (
    result: QCResult,
    inspectorName: string,
    badgeNumber: string,
    reworkInstructions?: string
  ) => void;
}

export const QCApprovalModal: React.FC<QCApprovalModalProps> = ({
  session,
  isOpen,
  onClose,
  onIssueDecision,
}) => {
  const [decision, setDecision] = useState<QCResult>(session.result || 'Pass');
  const [inspectorName, setInspectorName] = useState(session.inspectorName || 'Madame Hélène Vautier');
  const [badgeNumber, setBadgeNumber] = useState('MD-QC-MASTER-04');
  const [reworkInstructions, setReworkInstructions] = useState(
    session.result === 'Rework Required'
      ? 'Shorten left sleeve cuff by 4.5mm from split hem and steam relax right lapel gorge.'
      : ''
  );
  const [complianceStandard, setComplianceStandard] = useState(
    'Daniel’s Maison Haute Couture Spec V3.4'
  );

  if (!isOpen) return null;

  const openDefects = session.defects.filter((d) => !d.resolved);
  const outOfTolMeas = session.measurements.filter((m) => m.status !== 'In Tolerance');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onIssueDecision(decision, inspectorName.trim(), badgeNumber.trim(), reworkInstructions.trim());

    if (decision === 'Rework Required') {
      const existing = ReworkApiService.getAllRequests().find((r) => r.orderId === session.orderId);
      if (!existing) {
        ReworkApiService.createReworkRequest({
          orderId: session.orderId,
          qcSessionId: session.id,
          clientName: session.clientName,
          garmentName: session.garmentName,
          garmentSilhouette: session.garmentSilhouette,
          orderTotal: session.orderTotal,
          failedReason: reworkInstructions.trim() || 'QC flagged non-conforming parameters requiring bench remediation.',
          leadInspector: inspectorName.trim(),
          leadInspectorBadge: badgeNumber.trim(),
          priority: 'Urgent (24h)',
          targetSlaDeadline: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
          defects: session.defects.map((d) => ({
            defectCode: d.defectCode,
            category: d.category,
            severity: d.severity,
            location: d.locationOnGarment,
            description: d.description,
            detectedBy: d.detectedBy,
            photoUrl: d.photoUrl,
          })),
        });
      }
    }

    // Append to immutable Audit Trail System
    AuditTrailService.logEvent({
      entityType: 'qc_decision',
      entityId: session.id,
      entityName: `${session.garmentName} (${session.orderId})`,
      actionType: decision === 'Rework Required' ? 'REWORK_MANDATED' : 'QC_DECISION_ISSUED',
      actionLabel: `QC Chamber Decision: ${decision}`,
      severity: decision === 'Fail' || decision === 'Rework Required' ? 'CRITICAL' : 'LOW',
      actor: {
        id: `usr-qc-${badgeNumber.trim().toLowerCase().replace(/[^a-z0-9]/g, '-') || 'inspector'}`,
        name: inspectorName.trim() || 'QC Lead Inspector',
        email: `${(inspectorName.trim() || 'inspector').toLowerCase().replace(/\s+/g, '.')}@maisondaniel.paris`,
        role: 'QC Inspector',
        ipAddress: '194.214.22.95',
        geoCity: 'Paris',
        geoCountry: 'FR',
      },
      oldValue: {
        decision: session.result,
        defectsCount: session.defects.length,
        notesCount: session.notes.length,
      },
      newValue: {
        decision,
        inspectorName: inspectorName.trim(),
        badgeNumber: badgeNumber.trim(),
        instructions: reworkInstructions.trim(),
        standard: complianceStandard,
      },
      metadata: {
        orderId: session.orderId,
        clientName: session.clientName,
        garmentSilhouette: session.garmentSilhouette,
      },
      ipAddress: '194.214.22.95',
    }).catch(console.error);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#0A0A0A] border border-[#2B2B2B] w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-xs space-y-6 text-left font-mono text-[11px] animate-scaleUp">
        {/* Header */}
        <div className="flex justify-between items-start border-b border-[#222] pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-[9px] text-neutral-400 uppercase tracking-widest">
                CERTIFICATION BOARD DISPATCH
              </span>
            </div>
            <h3 className="font-serif text-xl text-white font-bold tracking-wider uppercase">
              SEAL QUALITY CONTROL DECISION
            </h3>
            <p className="text-[10px] text-neutral-400 font-sans mt-0.5">
              Order: <span className="text-white font-mono font-bold">{session.orderId}</span> |{' '}
              {session.garmentName} ({session.clientName})
            </p>
          </div>
          <button onClick={onClose} className="text-neutral-500 hover:text-white text-base">
            ✕
          </button>
        </div>

        {/* Warning if trying to Pass with open defects */}
        {decision === 'Pass' && (openDefects.length > 0 || outOfTolMeas.length > 0) && (
          <div className="p-3 bg-amber-950/40 border border-amber-500/50 text-amber-300 rounded-xs flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
            <div className="text-[10px] font-sans">
              <strong>Caution:</strong> This garment currently has {openDefects.length} open defect(s) and{' '}
              {outOfTolMeas.length} measurement deviation(s). Passing will issue an authorized override certificate.
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 3 Result Cards */}
          <div>
            <label className="text-[9px] text-neutral-400 uppercase block mb-2">
              Select Official Quality Decision
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* 1. PASS */}
              <div
                onClick={() => setDecision('Pass')}
                className={`p-4 border rounded-xs cursor-pointer transition-all space-y-1.5 ${
                  decision === 'Pass'
                    ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-lg'
                    : 'bg-[#0E0E0E] border-[#222] text-neutral-400 hover:border-neutral-600'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-xs uppercase text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> PASS
                  </span>
                  {decision === 'Pass' && <span className="text-[8px] bg-emerald-500 text-black px-1.5 py-0.2 rounded-xs font-bold">SELECTED</span>}
                </div>
                <p className="text-[9.5px] font-sans text-neutral-300">
                  Approved for white glove packaging & diplomatic dispatch. Generates authenticity seal.
                </p>
              </div>

              {/* 2. REWORK REQUIRED */}
              <div
                onClick={() => setDecision('Rework Required')}
                className={`p-4 border rounded-xs cursor-pointer transition-all space-y-1.5 ${
                  decision === 'Rework Required'
                    ? 'bg-amber-950/40 border-amber-500 text-white shadow-lg'
                    : 'bg-[#0E0E0E] border-[#222] text-neutral-400 hover:border-neutral-600'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-xs uppercase text-amber-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" /> REWORK
                  </span>
                  {decision === 'Rework Required' && <span className="text-[8px] bg-amber-500 text-black px-1.5 py-0.2 rounded-xs font-bold">SELECTED</span>}
                </div>
                <p className="text-[9.5px] font-sans text-neutral-300">
                  Routes garment back to atelier tailors with corrective tickets for non-conformances.
                </p>
              </div>

              {/* 3. FAIL */}
              <div
                onClick={() => setDecision('Fail')}
                className={`p-4 border rounded-xs cursor-pointer transition-all space-y-1.5 ${
                  decision === 'Fail'
                    ? 'bg-rose-950/40 border-rose-500 text-white shadow-lg'
                    : 'bg-[#0E0E0E] border-[#222] text-neutral-400 hover:border-neutral-600'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-xs uppercase text-rose-400 flex items-center gap-1.5">
                    <XCircle className="w-4 h-4" /> FAIL
                  </span>
                  {decision === 'Fail' && <span className="text-[8px] bg-rose-500 text-black px-1.5 py-0.2 rounded-xs font-bold">SELECTED</span>}
                </div>
                <p className="text-[9.5px] font-sans text-neutral-300">
                  Irreparable flaws. Garment quarantined. Initiates fabric mill claim & emergency re-cut.
                </p>
              </div>
            </div>
          </div>

          {/* Conditional Rework Instructions */}
          {decision === 'Rework Required' && (
            <div className="bg-[#111] p-4 border border-amber-500/30 rounded-xs space-y-2 animate-fadeIn">
              <label className="text-[9px] text-amber-400 uppercase font-bold block">
                Tailor Rework Routing Instructions
              </label>
              <textarea
                value={reworkInstructions}
                onChange={(e) => setReworkInstructions(e.target.value)}
                rows={3}
                placeholder="Prescribe exact alterations, sleeve length delta, steam table instructions..."
                className="w-full bg-black border border-[#333] text-white p-2 text-[10px] rounded-xs"
                required
              />
            </div>
          )}

          {/* Inspector Credentials */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[9px] text-neutral-400 uppercase block mb-1">
                Certified Lead Inspector Name
              </label>
              <input
                type="text"
                value={inspectorName}
                onChange={(e) => setInspectorName(e.target.value)}
                className="w-full bg-black border border-[#333] text-white p-2 text-[10px] rounded-xs"
                required
              />
            </div>
            <div>
              <label className="text-[9px] text-neutral-400 uppercase block mb-1">
                Inspector Accreditation Badge #
              </label>
              <input
                type="text"
                value={badgeNumber}
                onChange={(e) => setBadgeNumber(e.target.value)}
                className="w-full bg-black border border-[#333] text-white p-2 text-[10px] rounded-xs font-mono font-bold"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-[9px] text-neutral-400 uppercase block mb-1">
              Quality Protocol Standard
            </label>
            <select
              value={complianceStandard}
              onChange={(e) => setComplianceStandard(e.target.value)}
              className="w-full bg-black border border-[#333] text-white p-2 text-[10px] rounded-xs"
            >
              <option value="Daniel’s Maison Haute Couture Spec V3.4">
                Daniel’s Maison Haute Couture Spec V3.4 (Strict Millimeter Precision)
              </option>
              <option value="Savile Row Bespoke Protocol">
                Savile Row Bespoke Protocol (Hand-Padded Canvas)
              </option>
              <option value="Camera Nazionale Standard">
                Camera Nazionale Standard (Biella Fine Wool Spec)
              </option>
            </select>
          </div>

          {/* Decision Summary Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-[#222]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#333] text-neutral-400 hover:text-white rounded-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-6 py-2.5 rounded-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                decision === 'Pass'
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-black'
                  : decision === 'Rework Required'
                  ? 'bg-amber-500 hover:bg-amber-400 text-black'
                  : 'bg-rose-600 hover:bg-rose-500 text-white'
              }`}
            >
              {decision === 'Pass'
                ? 'Certify & Issue Seal of Approval'
                : decision === 'Rework Required'
                ? 'Issue Rework Order to Atelier'
                : 'Confirm Quarantined Failure'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
