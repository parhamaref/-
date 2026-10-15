/**
 * @file ReworkCertificateModal.tsx
 * Haute Couture Accreditation Certificate for Garments Approved After Reinspection.
 */

import React from 'react';
import {
  Award,
  X,
  ShieldCheck,
  CheckCircle2,
  Printer,
  Download,
  Share2,
  Lock,
  Sparkles,
} from 'lucide-react';
import { useReworkStore } from '../../stores/reworkStore';

export const ReworkCertificateModal: React.FC = () => {
  const { isCertificateModalOpen, setModalOpen, activeRequest } = useReworkStore();

  if (!isCertificateModalOpen || !activeRequest || !activeRequest.reinspectionVerdict) return null;

  const verdict = activeRequest.reinspectionVerdict;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#090909] border border-amber-500/40 rounded-2xl shadow-2xl p-8 my-8 text-neutral-100">
        {/* Close Button */}
        <button
          onClick={() => setModalOpen('certificate', false)}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Container */}
        <div className="border-2 border-amber-500/30 rounded-xl p-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-950/20 via-[#0d0d0d] to-[#070707] text-center relative overflow-hidden">
          {/* Subtle Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none">
            <span className="text-8xl font-serif tracking-widest text-amber-300">DANIEL’S MAISON</span>
          </div>

          {/* Crest */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-950/50 border border-amber-500/50 text-amber-400 mb-4 shadow-lg shadow-amber-950/50">
            <Award className="w-8 h-8" />
          </div>

          <div className="font-serif tracking-widest text-xs uppercase text-amber-400 mb-1">
            Daniel’s Maison Haute Couture · London & Paris
          </div>
          <h1 className="text-2xl font-serif text-neutral-100 tracking-wide mb-2">
            Certificate of Reinspection Clearance
          </h1>
          <p className="text-xs text-neutral-400 max-w-md mx-auto mb-6">
            This document attests that the bespoke couture creation identified herein has successfully undergone
            remedial master tailoring and satisfied all tolerance benchmarks of the Haute Couture Quality Gate.
          </p>

          {/* Certificate Number & Seal Hash */}
          <div className="bg-black/60 border border-amber-900/30 rounded-lg p-3 max-w-lg mx-auto mb-6 flex items-center justify-between text-left">
            <div>
              <span className="text-[10px] font-mono text-neutral-500 uppercase block">CERTIFICATE NUMBER</span>
              <span className="text-xs font-mono text-amber-300 font-bold">{verdict.certificateNumber}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono text-neutral-500 uppercase block">DIGITAL SEAL HASH</span>
              <span className="text-[11px] font-mono text-neutral-400">
                {verdict.accreditationSealHash ? `${verdict.accreditationSealHash.slice(0, 16)}...` : 'SECURED'}
              </span>
            </div>
          </div>

          {/* Garment Details Grid */}
          <div className="grid grid-cols-2 gap-4 text-left border-y border-neutral-800/80 py-4 mb-6 text-xs">
            <div>
              <span className="text-neutral-500 font-mono text-[10px] uppercase block">Client Name</span>
              <span className="text-neutral-200 font-medium">{activeRequest.clientName}</span>
            </div>
            <div>
              <span className="text-neutral-500 font-mono text-[10px] uppercase block">Bespoke Order ID</span>
              <span className="text-neutral-200 font-mono">{activeRequest.orderId}</span>
            </div>
            <div>
              <span className="text-neutral-500 font-mono text-[10px] uppercase block">Garment Model</span>
              <span className="text-neutral-200 font-medium truncate">{activeRequest.garmentName}</span>
            </div>
            <div>
              <span className="text-neutral-500 font-mono text-[10px] uppercase block">Couture Standard</span>
              <span className="text-neutral-200">{verdict.complianceStandard}</span>
            </div>
          </div>

          {/* Remediation Summary */}
          <div className="text-left bg-neutral-950/70 border border-neutral-900 rounded p-3 mb-6 text-xs text-neutral-300">
            <span className="text-[10px] font-mono text-emerald-400 uppercase block font-semibold mb-1">
              ✓ REINSPECTION VERDICT: {verdict.verdict.toUpperCase()}
            </span>
            <p className="text-neutral-400 text-[11px] leading-relaxed">{verdict.notes}</p>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-8 text-left pt-2 border-t border-neutral-800/60">
            <div>
              <span className="text-[10px] font-mono text-neutral-500 uppercase block">REMEDIAL MASTER TAILOR</span>
              <div className="font-serif italic text-base text-neutral-200 mt-1">
                {activeRequest.assignedTailor || 'Marco Bellini'}
              </div>
              <span className="text-[10px] text-neutral-500 block">Atelier Craft Guild #4</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono text-neutral-500 uppercase block">CERTIFIED QC MASTER</span>
              <div className="font-serif italic text-base text-amber-300 mt-1">{verdict.reinspectedBy}</div>
              <span className="text-[10px] text-neutral-500 block">Badge: {verdict.inspectorBadgeNumber}</span>
            </div>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-neutral-800">
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-mono">
            <Lock className="w-3.5 h-3.5 text-emerald-500" /> Cryptographically Sealed & Archived
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-200 text-xs font-mono uppercase tracking-wider transition border border-neutral-800"
            >
              <Printer className="w-4 h-4" /> Print Certificate
            </button>
            <button
              onClick={() => setModalOpen('certificate', false)}
              className="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-neutral-950 font-medium text-xs font-mono uppercase tracking-wider transition shadow-md shadow-amber-950/40"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
