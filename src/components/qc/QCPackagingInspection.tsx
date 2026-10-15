/**
 * @file QCPackagingInspection.tsx
 * White Glove Packaging & Presentation Verification Bench.
 * Verifies cedar garment bags, contoured brass hangers, wax seals, archival folding, and tamper-proof holographic credentials.
 */

import React from 'react';
import { QCPackagingInspection } from '../../types/qualityControl.types';
import {
  Package,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Tag,
  Truck,
  FileText,
  Sparkles,
} from 'lucide-react';

interface QCPackagingInspectionProps {
  packaging: QCPackagingInspection;
  onUpdatePackaging: (updates: Partial<QCPackagingInspection>) => void;
}

export const QCPackagingInspectionBench: React.FC<QCPackagingInspectionProps> = ({
  packaging,
  onUpdatePackaging,
}) => {
  return (
    <div className="space-y-6 text-left font-mono text-[11px]">
      {/* Banner */}
      <div className="bg-[#0A0A0A] border border-[#222] p-5 rounded-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[9px] bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded-xs uppercase tracking-wider">
              WHITE GLOVE PROTOCOL
            </span>
            <span className="text-[9px] text-emerald-400 font-bold uppercase">
              SEAL: {packaging.waxSealAuthenticityApplied ? 'APPLIED' : 'PENDING'}
            </span>
          </div>
          <h3 className="font-serif text-lg text-white font-bold tracking-wider uppercase">
            ARCHIVAL PRESENTATION & DISPATCH AUDIT
          </h3>
          <p className="text-[10px] text-neutral-400 font-sans mt-0.5">
            Final stage before courier handover. Guarantees museum-grade archival protection during transit.
          </p>
        </div>

        <div className="bg-[#111] p-3 border border-[#222] rounded-xs flex items-center gap-3">
          <Tag className="w-4 h-4 text-emerald-400" />
          <div>
            <span className="text-[8px] text-neutral-500 uppercase block">SECURITY HOLOGRAM</span>
            <span className="text-white font-bold text-xs font-mono">
              {packaging.tamperProofSerialHologram}
            </span>
          </div>
        </div>
      </div>

      {/* Checklist items in luxury cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 1. Signature Cedar Bag */}
        <div
          onClick={() =>
            onUpdatePackaging({ cedarGarmentBagIncluded: !packaging.cedarGarmentBagIncluded })
          }
          className={`p-4 border rounded-xs cursor-pointer transition-all space-y-2 ${
            packaging.cedarGarmentBagIncluded
              ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
              : 'bg-rose-950/20 border-rose-500/40 text-rose-200'
          }`}
        >
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase">Signature Cedar Garment Bag</span>
            {packaging.cedarGarmentBagIncluded ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <XCircle className="w-4 h-4 text-rose-400" />
            )}
          </div>
          <p className="text-[9.5px] text-neutral-400 font-sans">
            Heavyweight breathable twill with Tuscan cedar shavings insert to repel moisture and pests.
          </p>
          <span className="text-[8.5px] text-neutral-500 block uppercase font-mono">
            {packaging.cedarGarmentBagIncluded ? '● VERIFIED PRESENT' : '○ MISSING'}
          </span>
        </div>

        {/* 2. Contoured Brass Atelier Hanger */}
        <div
          onClick={() =>
            onUpdatePackaging({
              contouredBrassHangerVerified: !packaging.contouredBrassHangerVerified,
            })
          }
          className={`p-4 border rounded-xs cursor-pointer transition-all space-y-2 ${
            packaging.contouredBrassHangerVerified
              ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
              : 'bg-rose-950/20 border-rose-500/40 text-rose-200'
          }`}
        >
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase">Contoured Brass Hanger</span>
            {packaging.contouredBrassHangerVerified ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <XCircle className="w-4 h-4 text-rose-400" />
            )}
          </div>
          <p className="text-[9.5px] text-neutral-400 font-sans">
            Anatomically curved hardwood with brushed solid brass hook and engraved serial plaque.
          </p>
          <span className="text-[8.5px] text-neutral-500 block uppercase font-mono">
            {packaging.contouredBrassHangerVerified ? '● VERIFIED PRESENT' : '○ MISSING'}
          </span>
        </div>

        {/* 3. Archival Acid-Free Tissue Paper */}
        <div
          onClick={() =>
            onUpdatePackaging({
              acidFreeTissuePaperFolded: !packaging.acidFreeTissuePaperFolded,
            })
          }
          className={`p-4 border rounded-xs cursor-pointer transition-all space-y-2 ${
            packaging.acidFreeTissuePaperFolded
              ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
              : 'bg-rose-950/20 border-rose-500/40 text-rose-200'
          }`}
        >
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase">Archival Tissue Cushioning</span>
            {packaging.acidFreeTissuePaperFolded ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <XCircle className="w-4 h-4 text-rose-400" />
            )}
          </div>
          <p className="text-[9.5px] text-neutral-400 font-sans">
            Sleeves and chest cavities padded with pH-neutral acid-free tissue to prevent pressure creases.
          </p>
          <span className="text-[8.5px] text-neutral-500 block uppercase font-mono">
            {packaging.acidFreeTissuePaperFolded ? '● CUSHIONED' : '○ PENDING'}
          </span>
        </div>

        {/* 4. Wax Seal Authenticity */}
        <div
          onClick={() =>
            onUpdatePackaging({
              waxSealAuthenticityApplied: !packaging.waxSealAuthenticityApplied,
            })
          }
          className={`p-4 border rounded-xs cursor-pointer transition-all space-y-2 ${
            packaging.waxSealAuthenticityApplied
              ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
              : 'bg-rose-950/20 border-rose-500/40 text-rose-200'
          }`}
        >
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase">Daniel’s Maison Wax Seal</span>
            {packaging.waxSealAuthenticityApplied ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <XCircle className="w-4 h-4 text-rose-400" />
            )}
          </div>
          <p className="text-[9.5px] text-neutral-400 font-sans">
            Imperial crimson sealing wax hand-stamped with the atelier monogram crest over parchment.
          </p>
          <span className="text-[8.5px] text-neutral-500 block uppercase font-mono">
            {packaging.waxSealAuthenticityApplied ? '● STAMPED' : '○ PENDING'}
          </span>
        </div>

        {/* 5. Presentation Box Integrity */}
        <div className="p-4 border border-[#222] bg-[#0E0E0E] rounded-xs space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase text-white">Box Integrity</span>
            <span
              className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-xs ${
                packaging.presentationBoxIntegrity === 'Pristine'
                  ? 'bg-emerald-950 text-emerald-300'
                  : 'bg-rose-950 text-rose-300'
              }`}
            >
              {packaging.presentationBoxIntegrity}
            </span>
          </div>
          <p className="text-[9.5px] text-neutral-400 font-sans">
            Rigid black magnetic keepsake box must exhibit zero scuffs or edge crushing.
          </p>
          <div className="flex gap-1 pt-1">
            {['Pristine', 'Dented', 'Rejected'].map((status) => (
              <button
                key={status}
                onClick={() => onUpdatePackaging({ presentationBoxIntegrity: status as any })}
                className={`px-2 py-1 text-[9px] rounded-xs cursor-pointer ${
                  packaging.presentationBoxIntegrity === status
                    ? 'bg-white text-black font-bold'
                    : 'bg-black text-neutral-400 hover:text-white border border-[#222]'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* 6. Courier Label & Care Card */}
        <div className="p-4 border border-[#222] bg-[#0E0E0E] rounded-xs space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase text-white">Documentation Enclosed</span>
            <FileText className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="space-y-1.5">
            <label
              onClick={() =>
                onUpdatePackaging({
                  courierShippingLabelAffixed: !packaging.courierShippingLabelAffixed,
                })
              }
              className="flex items-center gap-2 cursor-pointer text-[10px] text-neutral-300 hover:text-white"
            >
              <input
                type="checkbox"
                checked={packaging.courierShippingLabelAffixed}
                readOnly
                className="rounded-xs"
              />
              <span>Courier Dispatch Barcode Affixed</span>
            </label>
            <label
              onClick={() =>
                onUpdatePackaging({
                  clientCareCardInserted: !packaging.clientCareCardInserted,
                })
              }
              className="flex items-center gap-2 cursor-pointer text-[10px] text-neutral-300 hover:text-white"
            >
              <input
                type="checkbox"
                checked={packaging.clientCareCardInserted}
                readOnly
                className="rounded-xs"
              />
              <span>Bespoke Wardrobe Care Guide & Certificate Enclosed</span>
            </label>
          </div>
        </div>
      </div>

      {/* Observations Box */}
      <div className="bg-[#070707] border border-[#222] p-4 rounded-xs">
        <label className="text-[9px] text-neutral-500 uppercase tracking-wider block mb-1">
          PACKAGING OBSERVATIONS & DISPATCH INSTRUCTIONS
        </label>
        <textarea
          defaultValue={packaging.notes}
          onBlur={(e) => onUpdatePackaging({ notes: e.target.value })}
          rows={2}
          placeholder="Log packaging and courier notes..."
          className="w-full bg-black/60 border border-[#282828] text-neutral-300 hover:border-neutral-600 focus:border-white text-[10.5px] p-2 rounded-xs outline-none"
        />
      </div>
    </div>
  );
};
