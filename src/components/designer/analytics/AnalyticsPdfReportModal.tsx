/**
 * @file AnalyticsPdfReportModal.tsx
 * Printable luxury executive dossier modal for Atelier Analytics.
 * Generates an itemized report ready for print or PDF export.
 */

import React from 'react';
import {
  X,
  Printer,
  Download,
  Sparkles,
  Building2,
  TrendingUp,
  Award,
  Crown,
  HeartHandshake,
  CheckCircle2,
} from 'lucide-react';
import {
  AnalyticsSummaryKPIs,
  RevenueDataPoint,
  ProductPerformanceMetric,
  VipClientDossier,
} from '../../../types/analytics.types';

interface AnalyticsPdfReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  kpis: AnalyticsSummaryKPIs;
  series: RevenueDataPoint[];
  products: ProductPerformanceMetric[];
  vipClients: VipClientDossier[];
  timeRange: string;
}

export const AnalyticsPdfReportModal: React.FC<AnalyticsPdfReportModalProps> = ({
  isOpen,
  onClose,
  kpis,
  series,
  products,
  vipClients,
  timeRange,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const topProducts = products.slice(0, 5);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-[#0a0a0a] border border-[#2b2b2b] rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Modal Toolbar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#222] bg-[#111]">
          <div className="flex items-center gap-2">
            <span className="font-serif text-sm font-bold uppercase tracking-wider text-white">
              Executive Analytics Dossier · Print & Export
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs font-mono uppercase tracking-wider transition-colors shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Content */}
        <div className="p-8 sm:p-12 space-y-10 text-left text-neutral-200 font-sans print:p-0 print:bg-white print:text-black">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b-2 border-amber-500 pb-6 gap-4">
            <div>
              <div className="font-serif text-3xl font-extrabold text-white tracking-widest uppercase">
                DANIEL’S MAISON
              </div>
              <div className="font-mono text-xs text-amber-400 tracking-[0.25em] uppercase mt-1">
                HAUTE BESPOKE ATELIER · TELEMETRY INTELLIGENCE
              </div>
              <div className="font-mono text-[11px] text-neutral-400 mt-2">
                Document Code: MD-ANALYTICS-{new Date().getFullYear()}-{Date.now().toString().slice(-4)}
              </div>
            </div>

            <div className="text-right font-mono text-xs text-neutral-400 space-y-1">
              <div>Reporting Period: <strong className="text-white">{timeRange}</strong></div>
              <div>Generated: <strong className="text-white">{new Date().toLocaleDateString('en-GB')}</strong></div>
              <div>Classification: <strong className="text-amber-400 uppercase">Board Confidential</strong></div>
            </div>
          </div>

          {/* Executive Summary Metrics Grid */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-white uppercase tracking-wider border-b border-[#222] pb-2">
              1. Executive KPI Summary
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
              <div className="p-4 rounded-xl bg-[#141414] border border-[#222]">
                <span className="text-neutral-500 text-[10px] uppercase block">Gross Revenue</span>
                <span className="text-amber-400 text-xl font-bold block mt-1">
                  £{kpis.totalRevenue.toLocaleString()}
                </span>
                <span className="text-[10px] text-emerald-400">+{kpis.revenueChangePct}% YoY</span>
              </div>

              <div className="p-4 rounded-xl bg-[#141414] border border-[#222]">
                <span className="text-neutral-500 text-[10px] uppercase block">Bespoke Conversion</span>
                <span className="text-white text-xl font-bold block mt-1">
                  {kpis.orderConversionRate}%
                </span>
                <span className="text-[10px] text-emerald-400">+{kpis.conversionChangePct}% pts</span>
              </div>

              <div className="p-4 rounded-xl bg-[#141414] border border-[#222]">
                <span className="text-neutral-500 text-[10px] uppercase block">Repeat Retention</span>
                <span className="text-emerald-400 text-xl font-bold block mt-1">
                  {kpis.repeatCustomerRate}%
                </span>
                <span className="text-[10px] text-emerald-400">+{kpis.repeatCustomerChangePct}% pts</span>
              </div>

              <div className="p-4 rounded-xl bg-[#141414] border border-[#222]">
                <span className="text-neutral-500 text-[10px] uppercase block">Avg Customer LTV</span>
                <span className="text-amber-300 text-xl font-bold block mt-1">
                  £{kpis.avgCustomerLtv.toLocaleString()}
                </span>
                <span className="text-[10px] text-sky-400">7.4x CAC Ratio</span>
              </div>
            </div>
          </div>

          {/* Revenue Trajectory Section */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-white uppercase tracking-wider border-b border-[#222] pb-2">
              2. Revenue Dynamics Breakdown
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-[#222] text-neutral-400 text-[10px] uppercase">
                    <th className="py-2 px-2">Period</th>
                    <th className="py-2 px-2 text-right">Gross</th>
                    <th className="py-2 px-2 text-right">Net Share</th>
                    <th className="py-2 px-2 text-right">Bespoke M2M</th>
                    <th className="py-2 px-2 text-right">Orders</th>
                    <th className="py-2 px-2 text-right">AOV</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#181818]">
                  {series.slice(-6).map((s) => (
                    <tr key={s.date}>
                      <td className="py-2 px-2 font-semibold text-white">{s.label}</td>
                      <td className="py-2 px-2 text-right text-amber-300">£{s.grossRevenue.toLocaleString()}</td>
                      <td className="py-2 px-2 text-right text-emerald-400">£{s.netProfit.toLocaleString()}</td>
                      <td className="py-2 px-2 text-right text-neutral-300">£{s.bespokeRevenue.toLocaleString()}</td>
                      <td className="py-2 px-2 text-right text-white">{s.ordersCount}</td>
                      <td className="py-2 px-2 text-right text-sky-300">£{Math.round(s.aov).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Product Silhouettes */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-white uppercase tracking-wider border-b border-[#222] pb-2">
              3. Top Performing Garments
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-[#222] text-neutral-400 text-[10px] uppercase">
                    <th className="py-2 px-2">SKU</th>
                    <th className="py-2 px-2">Silhouette Name</th>
                    <th className="py-2 px-2">Category</th>
                    <th className="py-2 px-2 text-right">Total Revenue</th>
                    <th className="py-2 px-2 text-right">Units</th>
                    <th className="py-2 px-2 text-right">Conv. %</th>
                    <th className="py-2 px-2 text-right">Margin %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#181818]">
                  {topProducts.map((p) => (
                    <tr key={p.id}>
                      <td className="py-2 px-2 text-neutral-400">{p.sku}</td>
                      <td className="py-2 px-2 font-semibold text-white">{p.name}</td>
                      <td className="py-2 px-2 text-neutral-300">{p.category}</td>
                      <td className="py-2 px-2 text-right text-amber-300 font-bold">
                        £{p.totalRevenue.toLocaleString()}
                      </td>
                      <td className="py-2 px-2 text-right text-white">{p.unitsSold}</td>
                      <td className="py-2 px-2 text-right text-emerald-400">{p.conversionRate}%</td>
                      <td className="py-2 px-2 text-right text-sky-300">{p.grossMarginPct}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Signature & Audit Stamp */}
          <div className="pt-8 border-t border-[#222] flex flex-col sm:flex-row justify-between items-end gap-6 font-mono text-xs text-neutral-400">
            <div>
              <p className="text-white font-serif text-sm font-bold uppercase">
                Daniel’s Maison Executive Atelier
              </p>
              <p className="text-[10px] text-neutral-500 mt-1">
                Certified Savile Row & Italian Mill Bespoke Verification
              </p>
            </div>
            <div className="text-right">
              <div className="w-48 border-b border-neutral-600 pb-1 mb-1 text-[10px] uppercase text-neutral-500">
                Audited & Approved By
              </div>
              <div className="font-serif text-amber-300 text-sm italic font-bold">
                Daniel & Partners Board
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
