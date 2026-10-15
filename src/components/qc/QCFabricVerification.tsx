/**
 * @file QCFabricVerification.tsx
 * Fabric & Textile Integrity Verification Bench.
 * Evaluates mill credentials, spectrophotometer ΔE shade matching, GSM mass testing, and weave flaw inspections.
 */

import React, { useState } from 'react';
import { QCFabricVerification } from '../../types/qualityControl.types';
import {
  Layers,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  Cpu,
  Eye,
  Check,
  Edit2,
} from 'lucide-react';

interface QCFabricVerificationProps {
  fabric: QCFabricVerification;
  onUpdateFabric: (updates: Partial<QCFabricVerification>) => void;
}

export const QCFabricVerificationBench: React.FC<QCFabricVerificationProps> = ({
  fabric,
  onUpdateFabric,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [testedGsm, setTestedGsm] = useState(fabric.testedGsm);
  const [deltaE, setDeltaE] = useState(fabric.shadeMatchDeltaE);
  const [notes, setNotes] = useState(fabric.notes);

  const gsmDelta = testedGsm - fabric.declaredGsm;
  const isGsmPass = Math.abs(gsmDelta) <= 15;
  const isDeltaEPass = deltaE < 0.8;

  const handleSave = () => {
    onUpdateFabric({
      testedGsm,
      shadeMatchDeltaE: deltaE,
      colorMatchStatus: deltaE < 0.8 ? 'Match' : deltaE < 1.5 ? 'Slight Deviation' : 'Rejected Shade',
      notes,
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 text-left font-mono text-[11px]">
      {/* Mill Credential & Specimen Banner */}
      <div className="bg-[#0A0A0A] border border-[#222] p-5 rounded-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          {fabric.swatchImageUrl && (
            <div className="w-16 h-16 rounded-xs border border-white/20 overflow-hidden shrink-0 bg-neutral-900 shadow-lg">
              <img
                src={fabric.swatchImageUrl}
                alt="Fabric Swatch"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[9px] bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded-xs uppercase tracking-wider">
                BOLT LOT: {fabric.fabricCode}
              </span>
              <span className="text-[9px] text-emerald-400 font-bold uppercase">
                MILL: {fabric.millName}
              </span>
            </div>
            <h3 className="font-serif text-lg text-white font-bold tracking-wider uppercase">
              {fabric.composition}
            </h3>
            <p className="text-[10px] text-neutral-400 font-sans mt-0.5">
              Weave: {fabric.weavePattern} | Yarn Count: {fabric.yarnCount}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-[#333] rounded-xs transition-colors cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5" />
            {isEditing ? 'Cancel Edit' : 'Edit Lab Parameters'}
          </button>
        </div>
      </div>

      {/* 4 Core Verification Meters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. GSM Mass Density */}
        <div className="bg-[#0E0E0E] border border-[#222] p-4 rounded-xs space-y-2">
          <div className="flex justify-between items-center text-[9px] text-neutral-500 uppercase tracking-widest">
            <span>FABRIC WEIGHT (GSM)</span>
            <span
              className={`font-bold ${isGsmPass ? 'text-emerald-400' : 'text-rose-400'}`}
            >
              {isGsmPass ? 'PASS' : 'DEVIATION'}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl font-bold text-white">{fabric.testedGsm}</span>
            <span className="text-[10px] text-neutral-400">g/m²</span>
            <span className="text-[9px] text-neutral-500 ml-auto">
              Spec: {fabric.declaredGsm} g/m² (Δ {gsmDelta > 0 ? `+${gsmDelta}` : gsmDelta})
            </span>
          </div>
          <div className="w-full bg-neutral-900 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full ${isGsmPass ? 'bg-emerald-400' : 'bg-rose-500'}`}
              style={{ width: `${Math.min((fabric.testedGsm / (fabric.declaredGsm * 1.3)) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* 2. Spectrophotometer Color Match */}
        <div className="bg-[#0E0E0E] border border-[#222] p-4 rounded-xs space-y-2">
          <div className="flex justify-between items-center text-[9px] text-neutral-500 uppercase tracking-widest">
            <span>SPECTRO SHADE (ΔE)</span>
            <span
              className={`font-bold ${
                fabric.colorMatchStatus === 'Match'
                  ? 'text-emerald-400'
                  : fabric.colorMatchStatus === 'Slight Deviation'
                  ? 'text-amber-400'
                  : 'text-rose-400'
              }`}
            >
              {fabric.colorMatchStatus.toUpperCase()}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl font-bold text-white">ΔE {fabric.shadeMatchDeltaE}</span>
            <span className="text-[9px] text-neutral-500 ml-auto">
              Tolerance: ΔE &lt; 0.80
            </span>
          </div>
          <p className="text-[9.5px] text-neutral-400 font-sans">
            {fabric.shadeMatchDeltaE < 0.8
              ? 'Zero visible chromatic shift under D65 daylight illuminant.'
              : 'Subtle shade variation detected across bolt.'}
          </p>
        </div>

        {/* 3. Weft & Flaw Inspection */}
        <div className="bg-[#0E0E0E] border border-[#222] p-4 rounded-xs space-y-2">
          <div className="flex justify-between items-center text-[9px] text-neutral-500 uppercase tracking-widest">
            <span>FLAW SCANNER</span>
            <span
              className={`font-bold ${
                fabric.flawInspectionResult === 'Zero Flaws'
                  ? 'text-emerald-400'
                  : 'text-rose-400'
              }`}
            >
              {fabric.flawInspectionResult === 'Zero Flaws' ? '100% CLEAR' : 'FLAGGED'}
            </span>
          </div>
          <div className="font-serif text-lg font-bold text-white truncate">
            {fabric.flawInspectionResult}
          </div>
          <p className="text-[9.5px] text-neutral-400 font-sans">
            Backlit optical verification of 10-meter fabric bolt run.
          </p>
        </div>

        {/* 4. Sheen & Dimensional Stability */}
        <div className="bg-[#0E0E0E] border border-[#222] p-4 rounded-xs space-y-2">
          <div className="flex justify-between items-center text-[9px] text-neutral-500 uppercase tracking-widest">
            <span>SHEEN & STABILITY</span>
            <span
              className={`font-bold ${
                fabric.sheenAndHandleCheck === 'Pass' && fabric.shrinkageResistancePass
                  ? 'text-emerald-400'
                  : 'text-rose-400'
              }`}
            >
              VERIFIED
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] px-2 py-0.5 rounded-xs font-bold ${
                fabric.sheenAndHandleCheck === 'Pass'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-600'
                  : 'bg-rose-950 text-rose-300 border border-rose-600'
              }`}
            >
              Handle: {fabric.sheenAndHandleCheck}
            </span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-xs font-bold ${
                fabric.shrinkageResistancePass
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-600'
                  : 'bg-rose-950 text-rose-300 border border-rose-600'
              }`}
            >
              Shrinkage: {fabric.shrinkageResistancePass ? 'Pass' : 'Fail'}
            </span>
          </div>
          <p className="text-[9.5px] text-neutral-400 font-sans">
            Steam vacuum test confirms &lt;0.2% dimensional movement.
          </p>
        </div>
      </div>

      {/* Editor Panel if toggled */}
      {isEditing && (
        <div className="bg-[#111] p-5 border border-amber-500/40 rounded-xs space-y-4 animate-fadeIn">
          <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
            Edit Lab Verification Parameters
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[9px] text-neutral-400 uppercase block mb-1">
                Tested GSM (g/m²)
              </label>
              <input
                type="number"
                value={testedGsm}
                onChange={(e) => setTestedGsm(parseInt(e.target.value) || 0)}
                className="w-full bg-black border border-[#333] text-white p-2 text-[10px] rounded-xs"
              />
            </div>
            <div>
              <label className="text-[9px] text-neutral-400 uppercase block mb-1">
                Spectrophotometer ΔE
              </label>
              <input
                type="number"
                step="0.05"
                value={deltaE}
                onChange={(e) => setDeltaE(parseFloat(e.target.value) || 0)}
                className="w-full bg-black border border-[#333] text-white p-2 text-[10px] rounded-xs"
              />
            </div>
            <div>
              <label className="text-[9px] text-neutral-400 uppercase block mb-1">
                Flaw Inspection Result
              </label>
              <select
                value={fabric.flawInspectionResult}
                onChange={(e) =>
                  onUpdateFabric({ flawInspectionResult: e.target.value as any })
                }
                className="w-full bg-black border border-[#333] text-white p-2 text-[10px] rounded-xs"
              >
                <option value="Zero Flaws">Zero Flaws</option>
                <option value="Minor Slub">Minor Slub</option>
                <option value="Weft Flaw Detected">Weft Flaw Detected</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-[9px] text-neutral-400 uppercase block mb-1">
              Textile Auditor Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full bg-black border border-[#333] text-white p-2 text-[10px] rounded-xs"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1.5 border border-[#333] text-neutral-400 rounded-xs"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 bg-white text-black font-bold uppercase rounded-xs hover:bg-neutral-200"
            >
              Update Textile Records
            </button>
          </div>
        </div>
      )}

      {/* Textile Notes Card */}
      <div className="bg-[#070707] border border-[#222] p-4 rounded-xs">
        <span className="text-[9px] text-neutral-500 uppercase tracking-wider block mb-1">
          LAB AUDIT OBSERVATIONS
        </span>
        <p className="text-[11px] text-neutral-300 font-sans leading-relaxed">
          {fabric.notes}
        </p>
      </div>
    </div>
  );
};
