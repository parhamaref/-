/**
 * @file QCFinishInspection.tsx
 * Garment Finishing & Construction Details Inspection Bench.
 * Evaluates seam puckering, hand-worked Milanese buttonholes, cold iron pressing, lining ease, and hardware fluid tests.
 */

import React from 'react';
import { QCFinishInspection } from '../../types/qualityControl.types';
import {
  Sparkles,
  Scissors,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Check,
  Star,
  Activity,
  Zap,
} from 'lucide-react';

interface QCFinishInspectionProps {
  finish: QCFinishInspection;
  onUpdateFinish: (updates: Partial<QCFinishInspection>) => void;
}

export const QCFinishInspectionBench: React.FC<QCFinishInspectionProps> = ({
  finish,
  onUpdateFinish,
}) => {
  return (
    <div className="space-y-6 text-left font-mono text-[11px]">
      {/* Top Finish Quality Summary Card */}
      <div className="bg-[#0A0A0A] border border-[#222] p-5 rounded-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[9px] bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded-xs uppercase tracking-wider">
              FINISH PROTOCOL V3.4
            </span>
            <span className="text-[9px] text-emerald-400 font-bold uppercase">
              SEAM TENSION: OPTIMAL
            </span>
          </div>
          <h3 className="font-serif text-lg text-white font-bold tracking-wider uppercase">
            HAUTE COUTURE HAND-FINISH EVALUATION
          </h3>
          <p className="text-[10px] text-neutral-400 font-sans mt-0.5">
            Micro-inspection of stitch tension, lapel roll fullness, lining ease clearance, and hand-worked Milanese buttonholes.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-[#111] p-3 border border-[#222] rounded-xs">
          <div>
            <span className="text-[8px] text-neutral-500 uppercase block">SEAM PUCKER RATING</span>
            <div className="flex items-center gap-1 text-amber-400 mt-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => onUpdateFinish({ seamPuckeringRating: star as any })}
                  className="cursor-pointer transition-transform hover:scale-125"
                >
                  <Star
                    className={`w-4 h-4 ${
                      star <= finish.seamPuckeringRating
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-neutral-700'
                    }`}
                  />
                </button>
              ))}
              <span className="text-white font-bold text-xs ml-1.5 font-mono">
                {finish.seamPuckeringRating}/5
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Inspection Elements */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 1. Stitch Density */}
        <div className="bg-[#0E0E0E] border border-[#222] p-4 rounded-xs space-y-3">
          <div className="flex justify-between items-center text-[9px] text-neutral-500 uppercase">
            <span>STITCH DENSITY</span>
            <span className="text-emerald-400 font-bold">5-7 STS/CM</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl font-bold text-white">
              {finish.stitchDensityPerCm}
            </span>
            <span className="text-[10px] text-neutral-400">stitches per cm</span>
          </div>
          <p className="text-[9.5px] text-neutral-400 font-sans">
            Counted under optical loupe along armhole and lapel edge.
          </p>
          <div className="flex gap-1 pt-1">
            {[5.0, 5.5, 6.0, 6.5, 7.0].map((d) => (
              <button
                key={d}
                onClick={() => onUpdateFinish({ stitchDensityPerCm: d })}
                className={`px-2 py-1 text-[9px] rounded-xs cursor-pointer ${
                  finish.stitchDensityPerCm === d
                    ? 'bg-white text-black font-bold'
                    : 'bg-black text-neutral-400 hover:text-white border border-[#222]'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Milanese Buttonhole Quality */}
        <div className="bg-[#0E0E0E] border border-[#222] p-4 rounded-xs space-y-3">
          <div className="flex justify-between items-center text-[9px] text-neutral-500 uppercase">
            <span>MILANESE BUTTONHOLE</span>
            <span
              className={`font-bold ${
                finish.milaneseButtonholeQuality.includes('Flawless')
                  ? 'text-emerald-400'
                  : 'text-amber-400'
              }`}
            >
              {finish.milaneseButtonholeQuality.includes('Flawless') ? 'MASTERWORK' : 'ATTENTION'}
            </span>
          </div>
          <div className="font-serif text-base font-bold text-white">
            {finish.milaneseButtonholeQuality}
          </div>
          <p className="text-[9.5px] text-neutral-400 font-sans">
            Hand-sewn with silk gimp core and clean knot anchor.
          </p>
          <div className="space-y-1 pt-1">
            {[
              'Hand-worked Flawless',
              'Machine-Assisted Pass',
              'Irregular / Rework',
            ].map((opt) => (
              <button
                key={opt}
                onClick={() => onUpdateFinish({ milaneseButtonholeQuality: opt as any })}
                className={`w-full text-left px-2 py-1 text-[9.5px] rounded-xs cursor-pointer transition-colors ${
                  finish.milaneseButtonholeQuality === opt
                    ? 'bg-white/10 text-white font-bold border border-white/20'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                ● {opt}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Hardware & Fasteners Fluidity */}
        <div className="bg-[#0E0E0E] border border-[#222] p-4 rounded-xs space-y-3">
          <div className="flex justify-between items-center text-[9px] text-neutral-500 uppercase">
            <span>HARDWARE FLUIDITY TEST</span>
            <span
              className={`font-bold ${
                finish.zipperAndFastenersFluidity === 'Silky Smooth'
                  ? 'text-emerald-400'
                  : 'text-rose-400'
              }`}
            >
              {finish.zipperAndFastenersFluidity.toUpperCase()}
            </span>
          </div>
          <div className="font-serif text-base font-bold text-white">
            {finish.zipperAndFastenersFluidity}
          </div>
          <p className="text-[9.5px] text-neutral-400 font-sans">
            Riri zips, hook-and-bar closures, and horn buttons.
          </p>
          <div className="flex gap-1.5 pt-1">
            {['Silky Smooth', 'Friction Detected', 'Defective'].map((f) => (
              <button
                key={f}
                onClick={() => onUpdateFinish({ zipperAndFastenersFluidity: f as any })}
                className={`px-2 py-1 text-[9px] rounded-xs cursor-pointer ${
                  finish.zipperAndFastenersFluidity === f
                    ? 'bg-white text-black font-bold'
                    : 'bg-black text-neutral-400 hover:text-white border border-[#222]'
                }`}
              >
                {f.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Binary Checklist Criteria Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Cupro Lining Ease */}
        <div
          onClick={() => onUpdateFinish({ cuproLiningEasePass: !finish.cuproLiningEasePass })}
          className={`p-3 border rounded-xs cursor-pointer transition-all flex items-center justify-between ${
            finish.cuproLiningEasePass
              ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-950/20 border-rose-500/40 text-rose-300'
          }`}
        >
          <div>
            <span className="text-[9px] uppercase font-bold block">Cupro Lining Ease Pleat</span>
            <span className="text-[8.5px] text-neutral-400 font-sans">Zero pulling at armscye</span>
          </div>
          {finish.cuproLiningEasePass ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <XCircle className="w-4 h-4 text-rose-400" />
          )}
        </div>

        {/* Lapel Roll Fullness */}
        <div
          onClick={() => onUpdateFinish({ lapelRollFullnessPass: !finish.lapelRollFullnessPass })}
          className={`p-3 border rounded-xs cursor-pointer transition-all flex items-center justify-between ${
            finish.lapelRollFullnessPass
              ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-950/20 border-rose-500/40 text-rose-300'
          }`}
        >
          <div>
            <span className="text-[9px] uppercase font-bold block">Lapel Roll Fullness</span>
            <span className="text-[8.5px] text-neutral-400 font-sans">Three-dimensional roll</span>
          </div>
          {finish.lapelRollFullnessPass ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <XCircle className="w-4 h-4 text-rose-400" />
          )}
        </div>

        {/* Cold Iron Press */}
        <div
          onClick={() => onUpdateFinish({ coldIronPressShineFree: !finish.coldIronPressShineFree })}
          className={`p-3 border rounded-xs cursor-pointer transition-all flex items-center justify-between ${
            finish.coldIronPressShineFree
              ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-950/20 border-rose-500/40 text-rose-300'
          }`}
        >
          <div>
            <span className="text-[9px] uppercase font-bold block">Cold Iron Shine-Free</span>
            <span className="text-[8.5px] text-neutral-400 font-sans">Absence of seam glaze</span>
          </div>
          {finish.coldIronPressShineFree ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <XCircle className="w-4 h-4 text-rose-400" />
          )}
        </div>

        {/* Loose Threads Trimmed */}
        <div
          onClick={() => onUpdateFinish({ threadTrimmed100Percent: !finish.threadTrimmed100Percent })}
          className={`p-3 border rounded-xs cursor-pointer transition-all flex items-center justify-between ${
            finish.threadTrimmed100Percent
              ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-950/20 border-rose-500/40 text-rose-300'
          }`}
        >
          <div>
            <span className="text-[9px] uppercase font-bold block">100% Threads Trimmed</span>
            <span className="text-[8.5px] text-neutral-400 font-sans">Zero loose thread ends</span>
          </div>
          {finish.threadTrimmed100Percent ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <XCircle className="w-4 h-4 text-rose-400" />
          )}
        </div>
      </div>

      {/* Observations Box */}
      <div className="bg-[#070707] border border-[#222] p-4 rounded-xs">
        <label className="text-[9px] text-neutral-500 uppercase tracking-wider block mb-1">
          FINISHING INSPECTOR OBSERVATIONS & DIRECTIVES
        </label>
        <textarea
          defaultValue={finish.notes}
          onBlur={(e) => onUpdateFinish({ notes: e.target.value })}
          rows={2}
          placeholder="Log finishing notes..."
          className="w-full bg-black/60 border border-[#282828] text-neutral-300 hover:border-neutral-600 focus:border-white text-[10.5px] p-2 rounded-xs outline-none"
        />
      </div>
    </div>
  );
};
