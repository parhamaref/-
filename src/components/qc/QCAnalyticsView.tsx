/**
 * @file QCAnalyticsView.tsx
 * Quality Analytics & First-Pass Yield (FPY) Telemetry Dashboard.
 */

import React from 'react';
import { QCInspectionSession } from '../../types/qualityControl.types';
import { Activity, ShieldCheck, AlertTriangle, TrendingUp, CheckCircle2, RotateCcw } from 'lucide-react';

interface QCAnalyticsViewProps {
  sessions: QCInspectionSession[];
}

export const QCAnalyticsView: React.FC<QCAnalyticsViewProps> = ({ sessions }) => {
  const total = sessions.length;
  const passCount = sessions.filter((s) => s.result === 'Pass').length;
  const reworkCount = sessions.filter((s) => s.result === 'Rework Required').length;
  const failCount = sessions.filter((s) => s.result === 'Fail').length;

  const firstPassYieldPct = total > 0 ? Math.round((passCount / total) * 100) : 0;
  const reworkRatePct = total > 0 ? Math.round((reworkCount / total) * 100) : 0;
  const scrapRatePct = total > 0 ? Math.round((failCount / total) * 100) : 0;

  // Aggregate all defects
  const allDefects = sessions.flatMap((s) => s.defects);
  const criticalDefects = allDefects.filter((d) => d.severity === 'Critical').length;
  const majorDefects = allDefects.filter((d) => d.severity === 'Major').length;
  const minorDefects = allDefects.filter((d) => d.severity === 'Minor').length;

  return (
    <div className="space-y-6 text-left font-mono text-[11px]">
      {/* KPI Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* First Pass Yield */}
        <div className="bg-[#0A0A0A] border border-[#222] p-5 rounded-xs space-y-2">
          <div className="flex justify-between items-center text-[9px] text-neutral-500 uppercase tracking-widest">
            <span>FIRST-PASS YIELD (FPY)</span>
            <span className="text-emerald-400 font-bold">TARGET &gt;85%</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-3xl font-bold text-white">{firstPassYieldPct}%</span>
            <span className="text-[10px] text-neutral-400">of garments</span>
          </div>
          <p className="text-[9.5px] text-neutral-400 font-sans">
            Garments passed without needing alteration rework or re-cutting.
          </p>
        </div>

        {/* Rework Rate */}
        <div className="bg-[#0A0A0A] border border-[#222] p-5 rounded-xs space-y-2">
          <div className="flex justify-between items-center text-[9px] text-neutral-500 uppercase tracking-widest">
            <span>REWORK REQUIRED RATE</span>
            <span className="text-amber-400 font-bold">MONITORED</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-3xl font-bold text-amber-400">{reworkRatePct}%</span>
            <span className="text-[10px] text-neutral-400">({reworkCount} orders)</span>
          </div>
          <p className="text-[9.5px] text-neutral-400 font-sans">
            Minor sleeve, buttonhole, or pressing re-touches before client dispatch.
          </p>
        </div>

        {/* Quarantine / Scrap */}
        <div className="bg-[#0A0A0A] border border-[#222] p-5 rounded-xs space-y-2">
          <div className="flex justify-between items-center text-[9px] text-neutral-500 uppercase tracking-widest">
            <span>QUARANTINE / REJECT</span>
            <span className="text-rose-400 font-bold">STRICT 0-TOL</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-3xl font-bold text-rose-400">{scrapRatePct}%</span>
            <span className="text-[10px] text-neutral-400">({failCount} orders)</span>
          </div>
          <p className="text-[9.5px] text-neutral-400 font-sans">
            Fabric flaws or structural non-conformances triggered for scrap.
          </p>
        </div>

        {/* Total Inspected Garment Value */}
        <div className="bg-[#0A0A0A] border border-[#222] p-5 rounded-xs space-y-2">
          <div className="flex justify-between items-center text-[9px] text-neutral-500 uppercase tracking-widest">
            <span>AUDITED COUTURE ASSETS</span>
            <span className="text-white font-bold">{total} PIECES</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl font-bold text-white">
              £{sessions.reduce((sum, s) => sum + s.orderTotal, 0).toLocaleString()}
            </span>
          </div>
          <p className="text-[9.5px] text-neutral-400 font-sans">
            Total bespoke commissions governed under QC Spec V3.4.
          </p>
        </div>
      </div>

      {/* Defect Severity Pareto & Workshop Reliability */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Defect Pareto Breakdown */}
        <div className="bg-[#070707] border border-[#222] p-5 rounded-xs space-y-4">
          <div className="flex justify-between items-center border-b border-[#222] pb-3">
            <div>
              <span className="text-[9px] text-neutral-500 uppercase tracking-widest block">
                DEFECT SEVERITY DISTRIBUTION
              </span>
              <h4 className="font-serif text-base text-white font-bold uppercase">
                NON-CONFORMANCE PARETO
              </h4>
            </div>
            <span className="text-[10px] text-neutral-400">
              Total Defect Events: {allDefects.length}
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-[10px] mb-1">
                <span className="text-rose-400 font-bold">Critical (Scrap / Fabric Defect)</span>
                <span className="text-white font-bold">{criticalDefects}</span>
              </div>
              <div className="h-2 w-full bg-neutral-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-500"
                  style={{ width: `${allDefects.length ? (criticalDefects / allDefects.length) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[10px] mb-1">
                <span className="text-amber-400 font-bold">Major (Rework / Tolerance Deviation)</span>
                <span className="text-white font-bold">{majorDefects}</span>
              </div>
              <div className="h-2 w-full bg-neutral-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500"
                  style={{ width: `${allDefects.length ? (majorDefects / allDefects.length) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[10px] mb-1">
                <span className="text-neutral-300 font-bold">Minor (Finishing Touch / Thread Trimming)</span>
                <span className="text-white font-bold">{minorDefects}</span>
              </div>
              <div className="h-2 w-full bg-neutral-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-neutral-400"
                  style={{ width: `${allDefects.length ? (minorDefects / allDefects.length) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Partner Workshop Quality Ranking */}
        <div className="bg-[#070707] border border-[#222] p-5 rounded-xs space-y-4">
          <div className="flex justify-between items-center border-b border-[#222] pb-3">
            <div>
              <span className="text-[9px] text-neutral-500 uppercase tracking-widest block">
                PARTNER ATELIER ACCREDITATION
              </span>
              <h4 className="font-serif text-base text-white font-bold uppercase">
                CRAFTSMANSHIP RELIABILITY INDEX
              </h4>
            </div>
          </div>

          <div className="space-y-3">
            {[
              {
                name: 'Daniel’s Maison Master Atelier (Mayfair)',
                rating: '98.5%',
                status: 'Exemplary',
                color: 'text-emerald-400',
              },
              {
                name: 'Biella Craft Tailoring Studio (Italy)',
                rating: '91.2%',
                status: 'Audited (Rework Resolved)',
                color: 'text-amber-400',
              },
              {
                name: 'Atelier de Soie Lyon (France)',
                rating: '78.0%',
                status: 'Warning (Bolt Flaw Quarantined)',
                color: 'text-rose-400',
              },
            ].map((atelier, i) => (
              <div
                key={i}
                className="p-3 bg-[#0E0E0E] border border-[#222] rounded-xs flex justify-between items-center"
              >
                <div>
                  <span className="font-bold text-white text-[11px] block">{atelier.name}</span>
                  <span className={`text-[9px] uppercase font-bold ${atelier.color}`}>
                    {atelier.status}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-serif text-base font-bold text-white block">
                    {atelier.rating}
                  </span>
                  <span className="text-[8px] text-neutral-500 uppercase">PASS RATE</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
