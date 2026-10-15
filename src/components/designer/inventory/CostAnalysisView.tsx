/**
 * @file CostAnalysisView.tsx
 * Financial Cost Analysis, Capital Allocation, and Interactive Garment BOM & Margin Calculator.
 */

import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  PieChart,
  Sliders,
  Scissors,
  Sparkles,
  Layers,
  ArrowUpRight,
  Calculator,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import {
  InventoryCostSummary,
  GarmentBomModel,
  FabricItem,
  MaterialItem,
} from '../../../types/inventory.types';

interface CostAnalysisViewProps {
  costSummary: InventoryCostSummary;
  garmentBoms: GarmentBomModel[];
  fabrics: FabricItem[];
  materials: MaterialItem[];
  onUpdateBom?: (idx: number, updated: GarmentBomModel) => void;
}

export const CostAnalysisView: React.FC<CostAnalysisViewProps> = ({
  costSummary,
  garmentBoms,
  fabrics,
  materials,
  onUpdateBom,
}) => {
  const [selectedBomIndex, setSelectedBomIndex] = useState(0);
  const currentBom = garmentBoms[selectedBomIndex] || garmentBoms[0];

  // Interactive BOM state
  const [fabricUsage, setFabricUsage] = useState(currentBom?.fabricUsageMeters || 4.2);
  const [fabricCostPerMeter, setFabricCostPerMeter] = useState(
    currentBom?.fabricCostPerMeter || 185
  );
  const [liningUsage, setLiningUsage] = useState(currentBom?.liningUsageMeters || 3.0);
  const [liningCostPerMeter, setLiningCostPerMeter] = useState(
    currentBom?.liningCostPerMeter || 18
  );
  const [canvasCost, setCanvasCost] = useState(currentBom?.canvasCost || 64);
  const [buttonsCost, setButtonsCost] = useState(currentBom?.buttonsCost || 28.8);
  const [zippersSundriesCost, setZippersSundriesCost] = useState(
    currentBom?.zippersSundriesCost || 45
  );
  const [laborHours, setLaborHours] = useState(currentBom?.craftLaborHours || 42);
  const [laborRate, setLaborRate] = useState(currentBom?.laborRatePerHour || 45);
  const [retailPrice, setRetailPrice] = useState(currentBom?.retailPriceGbp || 3850);

  // Sync when template changes
  const handleSelectTemplate = (idx: number) => {
    setSelectedBomIndex(idx);
    const tmpl = garmentBoms[idx];
    if (tmpl) {
      setFabricUsage(tmpl.fabricUsageMeters);
      setFabricCostPerMeter(tmpl.fabricCostPerMeter);
      setLiningUsage(tmpl.liningUsageMeters);
      setLiningCostPerMeter(tmpl.liningCostPerMeter);
      setCanvasCost(tmpl.canvasCost);
      setButtonsCost(tmpl.buttonsCost);
      setZippersSundriesCost(tmpl.zippersSundriesCost);
      setLaborHours(tmpl.craftLaborHours);
      setLaborRate(tmpl.laborRatePerHour);
      setRetailPrice(tmpl.retailPriceGbp);
    }
  };

  // Calculations
  const calculatedFabricCost = Math.round(fabricUsage * fabricCostPerMeter * 10) / 10;
  const calculatedLiningCost = Math.round(liningUsage * liningCostPerMeter * 10) / 10;
  const totalMaterialCost =
    calculatedFabricCost +
    calculatedLiningCost +
    canvasCost +
    buttonsCost +
    zippersSundriesCost;
  const totalLaborCost = Math.round(laborHours * laborRate);
  const totalProductionCost = Math.round(totalMaterialCost + totalLaborCost);
  const grossProfit = Math.round(retailPrice - totalProductionCost);
  const grossMarginPercent = Math.round((grossProfit / Math.max(1, retailPrice)) * 1000) / 10;
  const markupMultiplier = Math.round((retailPrice / Math.max(1, totalProductionCost)) * 10) / 10;

  // Capital asset rankings
  const topValuedFabrics = [...fabrics]
    .sort((a, b) => b.currentStockMeters * b.costPerMeter - a.currentStockMeters * a.costPerMeter)
    .slice(0, 5);

  const fabricPercent = Math.round(
    (costSummary.totalFabricValuationGbp / Math.max(1, costSummary.totalInventoryValuationGbp)) *
      100
  );
  const materialPercent = 100 - fabricPercent;

  return (
    <div className="space-y-6">
      {/* Top Financial Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-[#141414] border border-[#222] rounded-xl">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>Total Inventory Asset Value</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-serif font-bold text-white">
            £{costSummary.totalInventoryValuationGbp.toLocaleString()}
          </div>
          <span className="text-[11px] text-gray-500">Physical capital in workshop</span>
        </div>

        <div className="p-4 bg-[#141414] border border-[#222] rounded-xl">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>Cloth vs Trims Ratio</span>
            <PieChart className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-white">
            {fabricPercent}% / {materialPercent}%
          </div>
          <span className="text-[11px] text-gray-500">Fabric rolls vs Haberdashery</span>
        </div>

        <div className="p-4 bg-[#141414] border border-[#222] rounded-xl">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>Average Bespoke Margin</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-emerald-400">
            {grossMarginPercent}%
          </div>
          <span className="text-[11px] text-gray-500">Gross atelier margin</span>
        </div>

        <div className="p-4 bg-[#141414] border border-[#222] rounded-xl">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>Cutting Wastage Benchmark</span>
            <Scissors className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-white">
            {costSummary.averageWastagePercent}%
          </div>
          <span className="text-[11px] text-gray-500">Steam shrinkage & offcuts</span>
        </div>
      </div>

      {/* Main Grid: BOM Calculator & Capital Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive BOM & Margin Calculator (7 cols) */}
        <div className="lg:col-span-7 bg-[#141414] border border-[#222] rounded-xl p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#222] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-serif font-bold text-white tracking-wide">
                  Garment Bill of Materials (BOM) & Margin Simulator
                </h3>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Calculate raw materials, bench labor hours, and atelier profitability
              </p>
            </div>

            {/* Template selector pills */}
            <select
              value={selectedBomIndex}
              onChange={(e) => handleSelectTemplate(Number(e.target.value))}
              className="bg-[#181818] border border-[#333] rounded-lg px-2.5 py-1.5 text-xs text-amber-300 font-medium focus:outline-none focus:border-amber-400"
            >
              {garmentBoms.map((bom, idx) => (
                <option key={bom.garmentName} value={idx}>
                  {bom.garmentName}
                </option>
              ))}
            </select>
          </div>

          {/* Form Inputs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Fabric Usage */}
            <div className="p-3 bg-[#181818] border border-[#262626] rounded-lg space-y-2">
              <label className="font-semibold text-gray-300 flex items-center justify-between">
                <span>Fabric Roll Cloth</span>
                <span className="text-amber-400 font-mono">£{calculatedFabricCost}</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-gray-500 block">Usage (Meters)</span>
                  <input
                    type="number"
                    step="0.1"
                    value={fabricUsage}
                    onChange={(e) => setFabricUsage(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#121212] border border-[#333] rounded px-2 py-1 text-white font-mono"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 block">Cost / Meter (£)</span>
                  <input
                    type="number"
                    step="5"
                    value={fabricCostPerMeter}
                    onChange={(e) => setFabricCostPerMeter(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#121212] border border-[#333] rounded px-2 py-1 text-white font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Lining Usage */}
            <div className="p-3 bg-[#181818] border border-[#262626] rounded-lg space-y-2">
              <label className="font-semibold text-gray-300 flex items-center justify-between">
                <span>Cupro Lining Cloth</span>
                <span className="text-amber-400 font-mono">£{calculatedLiningCost}</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-gray-500 block">Usage (Meters)</span>
                  <input
                    type="number"
                    step="0.1"
                    value={liningUsage}
                    onChange={(e) => setLiningUsage(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#121212] border border-[#333] rounded px-2 py-1 text-white font-mono"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 block">Cost / Meter (£)</span>
                  <input
                    type="number"
                    step="1"
                    value={liningCostPerMeter}
                    onChange={(e) => setLiningCostPerMeter(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#121212] border border-[#333] rounded px-2 py-1 text-white font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Trims & Haberdashery */}
            <div className="p-3 bg-[#181818] border border-[#262626] rounded-lg space-y-2">
              <label className="font-semibold text-gray-300 block">Haberdashery Trims</label>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <span className="text-[10px] text-gray-500 block">Canvas (£)</span>
                  <input
                    type="number"
                    value={canvasCost}
                    onChange={(e) => setCanvasCost(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#121212] border border-[#333] rounded px-2 py-1 text-white font-mono"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 block">Buttons (£)</span>
                  <input
                    type="number"
                    value={buttonsCost}
                    onChange={(e) => setButtonsCost(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#121212] border border-[#333] rounded px-2 py-1 text-white font-mono"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 block">Zips/Sundries</span>
                  <input
                    type="number"
                    value={zippersSundriesCost}
                    onChange={(e) => setZippersSundriesCost(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#121212] border border-[#333] rounded px-2 py-1 text-white font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Craft Labor */}
            <div className="p-3 bg-[#181818] border border-[#262626] rounded-lg space-y-2">
              <label className="font-semibold text-gray-300 flex items-center justify-between">
                <span>Hand Craft & Tailoring Labor</span>
                <span className="text-amber-400 font-mono">£{totalLaborCost}</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-gray-500 block">Hours at Bench</span>
                  <input
                    type="number"
                    step="0.5"
                    value={laborHours}
                    onChange={(e) => setLaborHours(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#121212] border border-[#333] rounded px-2 py-1 text-white font-mono"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 block">Hourly Rate (£)</span>
                  <input
                    type="number"
                    value={laborRate}
                    onChange={(e) => setLaborRate(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#121212] border border-[#333] rounded px-2 py-1 text-white font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Retail Selling Price Slider */}
          <div className="p-4 bg-[#181818] border border-[#262626] rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-300 font-semibold">Bespoke Client Selling Price</span>
              <span className="text-xl font-bold font-serif text-white">
                £{retailPrice.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min="500"
              max="8000"
              step="50"
              value={retailPrice}
              onChange={(e) => setRetailPrice(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-500">
              <span>£500 (Separates)</span>
              <span>£3,850 (Savile Row Tuxedo)</span>
              <span>£8,000 (Haute Couture Overcoat)</span>
            </div>
          </div>

          {/* Dynamic Result Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 bg-black/40 border border-[#222] rounded-lg text-xs">
              <span className="text-[10px] text-gray-500 block">Raw Materials (BOM)</span>
              <span className="text-base font-bold text-white font-mono">
                £{Math.round(totalMaterialCost)}
              </span>
              <span className="text-[10px] text-gray-500 block">Cloth & Trims</span>
            </div>

            <div className="p-3 bg-black/40 border border-[#222] rounded-lg text-xs">
              <span className="text-[10px] text-gray-500 block">Total Cost of Goods</span>
              <span className="text-base font-bold text-white font-mono">
                £{totalProductionCost.toLocaleString()}
              </span>
              <span className="text-[10px] text-gray-500 block">BOM + Tailor Hours</span>
            </div>

            <div className="p-3 bg-black/40 border border-[#222] rounded-lg text-xs">
              <span className="text-[10px] text-gray-500 block">Gross Profit / Piece</span>
              <span className="text-base font-bold text-emerald-400 font-mono">
                £{grossProfit.toLocaleString()}
              </span>
              <span className="text-[10px] text-emerald-500/80 block">Atelier Contribution</span>
            </div>

            <div className="p-3 bg-black/40 border border-[#222] rounded-lg text-xs">
              <span className="text-[10px] text-gray-500 block">Gross Margin %</span>
              <span className="text-base font-bold text-amber-400 font-mono">
                {grossMarginPercent}%
              </span>
              <span className="text-[10px] text-gray-500 block">{markupMultiplier}x Multiplier</span>
            </div>
          </div>
        </div>

        {/* Right: Capital Allocation & Highest Value Assets (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Capital Distribution Breakdown */}
          <div className="bg-[#141414] border border-[#222] rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <PieChart className="w-4 h-4 text-amber-400" />
              Atelier Capital Distribution
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-gray-300 mb-1">
                  <span>Fine Textile Cloth Bolts</span>
                  <span className="font-mono text-white">
                    £{costSummary.totalFabricValuationGbp.toLocaleString()} ({fabricPercent}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-[#222] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full"
                    style={{ width: `${fabricPercent}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-gray-300 mb-1">
                  <span>Haberdashery Trims & Linings</span>
                  <span className="font-mono text-white">
                    £{costSummary.totalMaterialValuationGbp.toLocaleString()} ({materialPercent}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-[#222] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 rounded-full"
                    style={{ width: `${materialPercent}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-gray-300 mb-1">
                  <span>Capital in Mill Transit (Active POs)</span>
                  <span className="font-mono text-white">
                    £{costSummary.activePoCapitalGbp.toLocaleString()}
                  </span>
                </div>
                <div className="w-full h-2 bg-[#222] rounded-full overflow-hidden">
                  <div className="h-full bg-blue-400 rounded-full" style={{ width: `35%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Highest Value Inventory Assets */}
          <div className="bg-[#141414] border border-[#222] rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              Highest Value Workshop Assets
            </h3>
            <p className="text-xs text-gray-400">
              Top cloth rolls by total invested capital on shop floor
            </p>

            <div className="space-y-2 pt-1">
              {topValuedFabrics.map((fab, idx) => {
                const totalRollVal = Math.round(fab.currentStockMeters * fab.costPerMeter);

                return (
                  <div
                    key={fab.id}
                    className="p-2.5 rounded-lg bg-[#181818] border border-[#262626] flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 text-gray-500 font-mono text-[11px]">#{idx + 1}</span>
                      <span
                        className="w-3 h-3 rounded-full border border-white/20 shrink-0"
                        style={{ backgroundColor: fab.hexColor }}
                      />
                      <div>
                        <div className="text-white font-medium truncate max-w-[170px]">
                          {fab.name}
                        </div>
                        <div className="text-[10px] text-gray-500 font-mono">
                          {fab.currentStockMeters}m @ £{fab.costPerMeter}/m
                        </div>
                      </div>
                    </div>

                    <div className="text-right font-mono font-bold text-amber-300 text-sm">
                      £{totalRollVal.toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Monthly Procurement Spend Bar Strip */}
          <div className="bg-[#141414] border border-[#222] rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Procurement Spend Trend (Last 6 Months)
            </h3>

            <div className="grid grid-cols-6 gap-2 pt-2 items-end h-28">
              {costSummary.monthlyProcurementSpend.map((m) => {
                const heightPercent = Math.min(100, (m.spendGbp / 30000) * 100);

                return (
                  <div key={m.month} className="flex flex-col items-center gap-1 h-full justify-end">
                    <span className="text-[9px] font-mono text-gray-400">
                      £{(m.spendGbp / 1000).toFixed(0)}k
                    </span>
                    <div
                      className="w-full bg-amber-500/80 hover:bg-amber-400 rounded-t transition-all"
                      style={{ height: `${heightPercent}%` }}
                      title={`${m.month}: £${m.spendGbp.toLocaleString()} (${m.ordersCount} POs)`}
                    />
                    <span className="text-[9px] text-gray-500 truncate w-full text-center">
                      {m.month.split(' ')[0]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
