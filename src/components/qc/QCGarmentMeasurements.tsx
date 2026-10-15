/**
 * @file QCGarmentMeasurements.tsx
 * Millimeter-Precision Garment Measurements Verification Bench.
 * Evaluates target specifications vs actual measured dimensions with live tolerance deviation gauges.
 */

import React, { useState } from 'react';
import { QCGarmentMeasurement } from '../../types/qualityControl.types';
import { Ruler, CheckCircle2, AlertTriangle, XCircle, Plus, RefreshCw } from 'lucide-react';

interface QCGarmentMeasurementsProps {
  measurements: QCGarmentMeasurement[];
  onUpdateMeasurement: (measId: string, actualMeasuredCm: number, notes?: string) => void;
  onAddMeasurement: (
    meas: Omit<QCGarmentMeasurement, 'id' | 'varianceMm' | 'status'>
  ) => void;
}

export const QCGarmentMeasurements: React.FC<QCGarmentMeasurementsProps> = ({
  measurements,
  onUpdateMeasurement,
  onAddMeasurement,
}) => {
  const [unit, setUnit] = useState<'cm' | 'in'>('cm');
  const [showAddForm, setShowAddForm] = useState(false);

  // New point form state
  const [pointName, setPointName] = useState('');
  const [zone, setZone] = useState<QCGarmentMeasurement['anatomicalZone']>('Chest');
  const [targetCm, setTargetCm] = useState<number>(50.0);
  const [actualCm, setActualCm] = useState<number>(50.0);
  const [tolMinusMm, setTolMinusMm] = useState<number>(2.0);
  const [tolPlusMm, setTolPlusMm] = useState<number>(2.0);

  const cmToUnit = (cm: number) => {
    if (unit === 'in') return (cm / 2.54).toFixed(2);
    return cm.toFixed(1);
  };

  const inTolCount = measurements.filter((m) => m.status === 'In Tolerance').length;
  const outTolCount = measurements.filter((m) => m.status === 'Out of Tolerance').length;
  const critCount = measurements.filter((m) => m.status === 'Critical Deviation').length;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pointName.trim()) return;

    onAddMeasurement({
      pointOfMeasure: pointName.trim(),
      anatomicalZone: zone,
      targetSpecCm: targetCm,
      actualMeasuredCm: actualCm,
      toleranceMinusMm: tolMinusMm,
      tolerancePlusMm: tolPlusMm,
      notes: 'Initial measurement baseline recorded.',
    });

    setPointName('');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Metrics Bar & Unit Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0A0A0A] p-4 border border-[#222] rounded-xs font-mono text-[11px]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-white">
            <Ruler className="w-4 h-4 text-emerald-400" />
            <span className="font-bold uppercase tracking-wider text-[11px]">
              TOLERANCE SPECIFICATION RADAR
            </span>
          </div>
          <div className="flex items-center gap-2 pl-3 border-l border-[#222]">
            <span className="text-emerald-400 font-bold">{inTolCount} Within Spec</span>
            {outTolCount > 0 && <span className="text-amber-400 font-bold">● {outTolCount} Out of Tolerance</span>}
            {critCount > 0 && <span className="text-rose-400 font-bold">● {critCount} Critical</span>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Unit Switcher */}
          <div className="bg-[#111] p-0.5 border border-[#2B2B2B] rounded-xs flex items-center">
            <button
              onClick={() => setUnit('cm')}
              className={`px-2.5 py-1 text-[9.5px] rounded-xs transition-colors cursor-pointer ${
                unit === 'cm' ? 'bg-white text-black font-bold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              CENTIMETERS (cm)
            </button>
            <button
              onClick={() => setUnit('in')}
              className={`px-2.5 py-1 text-[9.5px] rounded-xs transition-colors cursor-pointer ${
                unit === 'in' ? 'bg-white text-black font-bold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              INCHES (in)
            </button>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1 px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-xs border border-white/20 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Add Point
          </button>
        </div>
      </div>

      {/* Add Measurement Spec Modal */}
      {showAddForm && (
        <form
          onSubmit={handleAddSubmit}
          className="bg-[#0E0E0E] p-4 border border-emerald-500/40 rounded-xs space-y-4 font-mono text-[11px] animate-fadeIn"
        >
          <div className="flex items-center justify-between border-b border-[#222] pb-2">
            <span className="text-emerald-400 font-bold uppercase tracking-wider text-[10px]">
              Register New Anatomical Specification Point
            </span>
            <button type="button" onClick={() => setShowAddForm(false)} className="text-neutral-500 hover:text-white">
              ✕
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="text-[9px] text-neutral-500 uppercase block mb-1">Point of Measure</label>
              <input
                type="text"
                value={pointName}
                onChange={(e) => setPointName(e.target.value)}
                placeholder="e.g. Across Back Width (15cm below collar)"
                className="w-full bg-black border border-[#333] text-white p-2 text-[10px] rounded-xs"
                required
              />
            </div>
            <div>
              <label className="text-[9px] text-neutral-500 uppercase block mb-1">Zone</label>
              <select
                value={zone}
                onChange={(e) => setZone(e.target.value as any)}
                className="w-full bg-black border border-[#333] text-white p-2 text-[10px] rounded-xs"
              >
                {['Chest', 'Waist', 'Hip', 'Shoulder', 'Sleeve', 'Length', 'Collar', 'Trouser'].map((z) => (
                  <option key={z} value={z}>
                    {z}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-[9px] text-neutral-500 uppercase block mb-1">Target Spec (cm)</label>
              <input
                type="number"
                step="0.1"
                value={targetCm}
                onChange={(e) => setTargetCm(parseFloat(e.target.value) || 0)}
                className="w-full bg-black border border-[#333] text-white p-2 text-[10px] rounded-xs"
                required
              />
            </div>
            <div>
              <label className="text-[9px] text-neutral-500 uppercase block mb-1">Actual Measured (cm)</label>
              <input
                type="number"
                step="0.1"
                value={actualCm}
                onChange={(e) => setActualCm(parseFloat(e.target.value) || 0)}
                className="w-full bg-black border border-[#333] text-white p-2 text-[10px] rounded-xs"
                required
              />
            </div>
            <div>
              <label className="text-[9px] text-neutral-500 uppercase block mb-1">Minus Tolerance (-mm)</label>
              <input
                type="number"
                step="0.5"
                value={tolMinusMm}
                onChange={(e) => setTolMinusMm(parseFloat(e.target.value) || 0)}
                className="w-full bg-black border border-[#333] text-white p-2 text-[10px] rounded-xs"
                required
              />
            </div>
            <div>
              <label className="text-[9px] text-neutral-500 uppercase block mb-1">Plus Tolerance (+mm)</label>
              <input
                type="number"
                step="0.5"
                value={tolPlusMm}
                onChange={(e) => setTolPlusMm(parseFloat(e.target.value) || 0)}
                className="w-full bg-black border border-[#333] text-white p-2 text-[10px] rounded-xs"
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 border border-[#333] text-neutral-400 hover:text-white rounded-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-white text-black font-bold uppercase rounded-xs hover:bg-neutral-200"
            >
              Save Specification
            </button>
          </div>
        </form>
      )}

      {/* Measurements Table with Visual Deviation Gauge */}
      <div className="bg-[#070707] border border-[#222] rounded-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-[11px]">
            <thead>
              <tr className="border-b border-[#222] bg-[#0E0E0E] text-[9px] text-neutral-500 uppercase tracking-wider">
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4">POINT OF MEASURE & ZONE</th>
                <th className="py-3 px-4">CAD SPEC ({unit})</th>
                <th className="py-3 px-4">ACTUAL MEASURED ({unit})</th>
                <th className="py-3 px-4">TOLERANCE BRACKET</th>
                <th className="py-3 px-4">VARIANCE GAUGE (mm)</th>
                <th className="py-3 px-4">INSPECTOR AUDIT NOTE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A1A1A]">
              {measurements.map((m) => {
                const maxBracketMm = Math.max(m.toleranceMinusMm, m.tolerancePlusMm) * 1.5;
                // Clamped gauge percentage between 0% and 100% where 50% is 0mm deviation
                const gaugePct = Math.min(
                  Math.max(50 + (m.varianceMm / (maxBracketMm * 2)) * 100, 5),
                  95
                );

                return (
                  <tr
                    key={m.id}
                    className={`hover:bg-white/[0.02] transition-colors ${
                      m.status === 'Critical Deviation'
                        ? 'bg-rose-950/15'
                        : m.status === 'Out of Tolerance'
                        ? 'bg-amber-950/15'
                        : ''
                    }`}
                  >
                    {/* Status Badge */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-xs text-[9px] font-bold uppercase tracking-wider ${
                          m.status === 'In Tolerance'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : m.status === 'Out of Tolerance'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                        }`}
                      >
                        {m.status === 'In Tolerance' ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <AlertTriangle className="w-3 h-3" />
                        )}
                        {m.status}
                      </span>
                    </td>

                    {/* Point of Measure */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white text-[11px]">{m.pointOfMeasure}</div>
                      <span className="text-[8.5px] text-neutral-500 uppercase tracking-widest">
                        ZONE: {m.anatomicalZone}
                      </span>
                    </td>

                    {/* Spec Target */}
                    <td className="py-3.5 px-4 font-mono font-bold text-neutral-300">
                      {cmToUnit(m.targetSpecCm)} {unit}
                    </td>

                    {/* Actual Measured with quick numeric inline editor */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          step="0.05"
                          defaultValue={m.actualMeasuredCm}
                          onBlur={(e) => {
                            const val = parseFloat(e.target.value);
                            if (!isNaN(val) && val !== m.actualMeasuredCm) {
                              onUpdateMeasurement(m.id, val, m.notes);
                            }
                          }}
                          className="w-20 bg-black border border-[#333] hover:border-neutral-500 focus:border-white text-white p-1 text-[10.5px] rounded-xs font-mono font-bold"
                        />
                        <span className="text-[9px] text-neutral-500">cm</span>
                      </div>
                    </td>

                    {/* Tolerance Bracket */}
                    <td className="py-3.5 px-4 font-mono text-[10px] text-neutral-400 whitespace-nowrap">
                      -{m.toleranceMinusMm}mm / +{m.tolerancePlusMm}mm
                    </td>

                    {/* Variance Gauge */}
                    <td className="py-3.5 px-4 min-w-[180px]">
                      <div className="flex items-center justify-between text-[9px] font-mono mb-1">
                        <span
                          className={`font-bold ${
                            m.varianceMm === 0
                              ? 'text-neutral-400'
                              : m.status === 'In Tolerance'
                              ? 'text-emerald-400'
                              : 'text-rose-400'
                          }`}
                        >
                          {m.varianceMm > 0 ? `+${m.varianceMm}` : m.varianceMm} mm
                        </span>
                        <span className="text-neutral-600 text-[8px]">
                          Δ {((m.varianceMm / 10)).toFixed(2)} cm
                        </span>
                      </div>
                      {/* Gauge Bar */}
                      <div className="relative h-2 w-full bg-neutral-900 border border-[#222] rounded-full overflow-hidden">
                        {/* Center zero tick line */}
                        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-neutral-600 -translate-x-1/2 z-10" />
                        {/* Safe tolerance zone */}
                        <div
                          className="absolute top-0 bottom-0 bg-emerald-500/20"
                          style={{
                            left: `${50 - (m.toleranceMinusMm / (maxBracketMm * 2)) * 100}%`,
                            width: `${((m.toleranceMinusMm + m.tolerancePlusMm) / (maxBracketMm * 2)) * 100}%`,
                          }}
                        />
                        {/* Cursor position indicator */}
                        <div
                          className={`absolute top-0 bottom-0 w-1.5 rounded-full z-20 -translate-x-1/2 transition-all ${
                            m.status === 'In Tolerance' ? 'bg-emerald-400' : 'bg-rose-500 animate-pulse'
                          }`}
                          style={{ left: `${gaugePct}%` }}
                        />
                      </div>
                    </td>

                    {/* Inspector Note */}
                    <td className="py-3.5 px-4 min-w-[200px]">
                      <input
                        type="text"
                        defaultValue={m.notes || ''}
                        onBlur={(e) => {
                          if (e.target.value !== (m.notes || '')) {
                            onUpdateMeasurement(m.id, m.actualMeasuredCm, e.target.value);
                          }
                        }}
                        placeholder="Log tolerance note..."
                        className="w-full bg-black/60 border border-[#282828] text-neutral-300 hover:border-neutral-600 focus:border-white text-[10px] p-1.5 rounded-xs outline-none"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
