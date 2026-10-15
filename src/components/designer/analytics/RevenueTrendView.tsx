/**
 * @file RevenueTrendView.tsx
 * Interactive Revenue Trajectory & Financial Curves for Daniel’s Maison.
 * Features customizable time horizons, SVG gradient area chart with hover tooltips,
 * Bespoke vs Ready-to-Wear volume split, AOV tracking, and itemized period table.
 */

import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  Calendar,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import { RevenueDataPoint } from '../../../types/analytics.types';

interface RevenueTrendViewProps {
  series: RevenueDataPoint[];
  timeRange: string;
}

export const RevenueTrendView: React.FC<RevenueTrendViewProps> = ({
  series,
  timeRange,
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<RevenueDataPoint | null>(null);
  const [metricMode, setMetricMode] = useState<'gross' | 'split' | 'aov'>('gross');

  if (!series || series.length === 0) {
    return (
      <div className="p-12 text-center text-neutral-500 bg-[#0c0c0c] border border-[#222] rounded-xl">
        No revenue data found for selected period.
      </div>
    );
  }

  // Calculate metrics
  const totalGross = series.reduce((sum, p) => sum + p.grossRevenue, 0);
  const totalNet = series.reduce((sum, p) => sum + p.netProfit, 0);
  const totalBespoke = series.reduce((sum, p) => sum + p.bespokeRevenue, 0);
  const totalRtw = series.reduce((sum, p) => sum + p.rtwRevenue, 0);
  const totalOrders = series.reduce((sum, p) => sum + p.ordersCount, 0);
  const overallAov = totalOrders > 0 ? Math.round(totalGross / totalOrders) : 0;
  const bespokeRatio = totalGross > 0 ? ((totalBespoke / totalGross) * 100).toFixed(1) : '0';

  // SVG Chart math
  const maxGross = Math.max(...series.map((p) => p.grossRevenue), 1000);
  const chartHeight = 260;
  const chartWidth = 800;
  const paddingX = 40;
  const paddingY = 30;

  const getX = (index: number) => {
    if (series.length <= 1) return chartWidth / 2;
    return paddingX + (index / (series.length - 1)) * (chartWidth - paddingX * 2);
  };

  const getY = (val: number) => {
    return (
      chartHeight -
      paddingY -
      (val / maxGross) * (chartHeight - paddingY * 2)
    );
  };

  // Generate SVG paths
  const grossPoints = series.map((p, i) => `${getX(i)},${getY(p.grossRevenue)}`).join(' ');
  const bespokePoints = series.map((p, i) => `${getX(i)},${getY(p.bespokeRevenue)}`).join(' ');

  const grossAreaPath = `M ${getX(0)},${chartHeight - paddingY} ` +
    series.map((p, i) => `L ${getX(i)},${getY(p.grossRevenue)}`).join(' ') +
    ` L ${getX(series.length - 1)},${chartHeight - paddingY} Z`;

  const bespokeAreaPath = `M ${getX(0)},${chartHeight - paddingY} ` +
    series.map((p, i) => `L ${getX(i)},${getY(p.bespokeRevenue)}`).join(' ') +
    ` L ${getX(series.length - 1)},${chartHeight - paddingY} Z`;

  return (
    <div className="space-y-6 text-left">
      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-[#0c0c0c] border border-[#222]">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-mono uppercase tracking-wider">
            <span>Period Gross Revenue</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-white">
              £{totalGross.toLocaleString()}
            </span>
            <span className="text-emerald-400 font-mono text-xs font-semibold">
              +24.8% YoY
            </span>
          </div>
          <span className="text-[10px] text-neutral-500 font-mono block mt-1">
            Across {series.length} {timeRange === '7D' ? 'days' : 'reported periods'}
          </span>
        </div>

        <div className="p-5 rounded-xl bg-[#0c0c0c] border border-[#222]">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-mono uppercase tracking-wider">
            <span>Net Atelier Share (68%)</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-emerald-300">
              £{totalNet.toLocaleString()}
            </span>
            <span className="text-neutral-400 font-mono text-xs">Retained</span>
          </div>
          <span className="text-[10px] text-neutral-500 font-mono block mt-1">
            After marketplace infrastructure fee
          </span>
        </div>

        <div className="p-5 rounded-xl bg-[#0c0c0c] border border-[#222]">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-mono uppercase tracking-wider">
            <span>Bespoke Volume Share</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-amber-300">
              {bespokeRatio}%
            </span>
            <span className="text-neutral-400 font-mono text-xs">
              £{totalBespoke.toLocaleString()}
            </span>
          </div>
          <span className="text-[10px] text-neutral-500 font-mono block mt-1">
            Made-to-Measure vs RTW (£{totalRtw.toLocaleString()})
          </span>
        </div>

        <div className="p-5 rounded-xl bg-[#0c0c0c] border border-[#222]">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-mono uppercase tracking-wider">
            <span>Average Order Value</span>
            <ShoppingBag className="w-4 h-4 text-sky-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-white">
              £{overallAov.toLocaleString()}
            </span>
            <span className="text-emerald-400 font-mono text-xs">+8.4%</span>
          </div>
          <span className="text-[10px] text-neutral-500 font-mono block mt-1">
            Total {totalOrders} orders completed
          </span>
        </div>
      </div>

      {/* Main Interactive Chart Container */}
      <div className="p-6 rounded-2xl bg-[#0c0c0c] border border-[#222] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1c1c1c] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-lg font-bold text-white">
                Revenue Trajectory & Volume Dynamics
              </span>
              <span className="text-[11px] font-mono text-amber-400 px-2 py-0.5 rounded-sm bg-amber-500/10 border border-amber-500/20">
                GBP (£)
              </span>
            </div>
            <p className="text-xs text-neutral-400 font-sans mt-0.5">
              Hover over data points to inspect granular bespoke vs ready-to-wear revenue splits.
            </p>
          </div>

          {/* Metric View Toggle */}
          <div className="flex items-center gap-1 p-1 bg-[#141414] border border-[#262626] rounded-lg">
            <button
              onClick={() => setMetricMode('gross')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                metricMode === 'gross'
                  ? 'bg-white text-black font-semibold shadow-xs'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Gross Revenue
            </button>
            <button
              onClick={() => setMetricMode('split')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                metricMode === 'split'
                  ? 'bg-amber-400 text-black font-semibold shadow-xs'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Bespoke vs RTW Split
            </button>
            <button
              onClick={() => setMetricMode('aov')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                metricMode === 'aov'
                  ? 'bg-sky-400 text-black font-semibold shadow-xs'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              AOV Curve
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-6 text-xs font-mono text-neutral-400">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-xs bg-amber-400 inline-block" />
            <span className="text-white">Gross Revenue</span>
          </div>
          {metricMode === 'split' && (
            <>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-xs bg-emerald-400 inline-block" />
                <span>Bespoke Made-to-Measure</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-xs bg-sky-400 inline-block" />
                <span>Haute Ready-to-Wear</span>
              </div>
            </>
          )}
          {hoveredPoint && (
            <div className="ml-auto text-amber-300 font-mono text-xs font-semibold">
              {hoveredPoint.label}: £{hoveredPoint.grossRevenue.toLocaleString()} ({hoveredPoint.ordersCount} orders)
            </div>
          )}
        </div>

        {/* SVG Area Chart */}
        <div className="relative w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-auto min-w-[600px] overflow-visible"
          >
            <defs>
              <linearGradient id="amberGrossGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="emeraldBespokeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid horizontal lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
              const y = chartHeight - paddingY - ratio * (chartHeight - paddingY * 2);
              const labelVal = Math.round(ratio * maxGross);
              return (
                <g key={i}>
                  <line
                    x1={paddingX}
                    y1={y}
                    x2={chartWidth - paddingX}
                    y2={y}
                    stroke="#222"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={paddingX - 8}
                    y={y + 3}
                    textAnchor="end"
                    fill="#666"
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    £{(labelVal / 1000).toFixed(0)}k
                  </text>
                </g>
              );
            })}

            {/* Gross area & line */}
            <path d={grossAreaPath} fill="url(#amberGrossGrad)" />
            <polyline
              points={grossPoints}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Bespoke area if in split mode */}
            {metricMode === 'split' && (
              <>
                <path d={bespokeAreaPath} fill="url(#emeraldBespokeGrad)" />
                <polyline
                  points={bespokePoints}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeDasharray="5 3"
                  strokeLinecap="round"
                />
              </>
            )}

            {/* Data points with hover interaction */}
            {series.map((point, i) => {
              const x = getX(i);
              const y = getY(point.grossRevenue);
              const isHovered = hoveredPoint?.date === point.date;

              return (
                <g
                  key={point.date}
                  className="cursor-pointer transition-transform duration-200"
                  onMouseEnter={() => setHoveredPoint(point)}
                  onMouseLeave={() => setHoveredPoint(null)}
                >
                  {/* Vertical guide when hovered */}
                  {isHovered && (
                    <line
                      x1={x}
                      y1={paddingY}
                      x2={x}
                      y2={chartHeight - paddingY}
                      stroke="#f59e0b"
                      strokeWidth="1"
                      strokeDasharray="3 3"
                    />
                  )}

                  <circle
                    cx={x}
                    cy={y}
                    r={isHovered ? 6 : 3.5}
                    fill={isHovered ? '#ffffff' : '#f59e0b'}
                    stroke="#000000"
                    strokeWidth="2"
                  />

                  {/* X Axis label */}
                  <text
                    x={x}
                    y={chartHeight - 10}
                    textAnchor="middle"
                    fill={isHovered ? '#f59e0b' : '#777'}
                    fontSize="9.5"
                    fontFamily="monospace"
                    fontWeight={isHovered ? 'bold' : 'normal'}
                  >
                    {point.label.split(' ')[0]}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Hovered point inspection tooltip box */}
        {hoveredPoint && (
          <div className="p-4 rounded-xl bg-[#141414] border border-amber-500/30 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono animate-fadeIn">
            <div>
              <span className="text-neutral-500 block uppercase">Reporting Horizon</span>
              <span className="text-white font-bold text-sm">{hoveredPoint.label}</span>
            </div>
            <div>
              <span className="text-neutral-500 block uppercase">Gross Volume</span>
              <span className="text-amber-400 font-bold text-sm">
                £{hoveredPoint.grossRevenue.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-neutral-500 block uppercase">Bespoke vs RTW</span>
              <span className="text-emerald-400 font-bold text-sm">
                £{hoveredPoint.bespokeRevenue.toLocaleString()} / £{hoveredPoint.rtwRevenue.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-neutral-500 block uppercase">Volume & AOV</span>
              <span className="text-sky-400 font-bold text-sm">
                {hoveredPoint.ordersCount} orders (AOV £{Math.round(hoveredPoint.aov).toLocaleString()})
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Itemized Reporting Breakdown Table */}
      <div className="p-6 rounded-2xl bg-[#0c0c0c] border border-[#222] space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-base font-bold text-white uppercase tracking-wider">
            Itemized Revenue Ledger
          </h3>
          <span className="font-mono text-xs text-neutral-400">
            {series.length} recorded horizons
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-[#222] text-neutral-400 text-[10px] uppercase tracking-wider">
                <th className="py-3 px-3">Horizon Period</th>
                <th className="py-3 px-3 text-right">Gross Revenue</th>
                <th className="py-3 px-3 text-right">Net Atelier (68%)</th>
                <th className="py-3 px-3 text-right">Bespoke M2M</th>
                <th className="py-3 px-3 text-right">Ready-to-Wear</th>
                <th className="py-3 px-3 text-right">Orders</th>
                <th className="py-3 px-3 text-right">AOV</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#181818]">
              {series.map((row) => (
                <tr key={row.date} className="hover:bg-[#141414] transition-colors">
                  <td className="py-3 px-3 font-semibold text-white">{row.label}</td>
                  <td className="py-3 px-3 text-right text-amber-300 font-bold">
                    £{row.grossRevenue.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-right text-emerald-400">
                    £{row.netProfit.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-right text-neutral-300">
                    £{row.bespokeRevenue.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-right text-neutral-400">
                    £{row.rtwRevenue.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-right text-white">{row.ordersCount}</td>
                  <td className="py-3 px-3 text-right text-sky-400">
                    £{Math.round(row.aov).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-[#333] font-bold text-white">
                <td className="py-3 px-3">Period Total / Mean</td>
                <td className="py-3 px-3 text-right text-amber-400">
                  £{totalGross.toLocaleString()}
                </td>
                <td className="py-3 px-3 text-right text-emerald-400">
                  £{totalNet.toLocaleString()}
                </td>
                <td className="py-3 px-3 text-right">
                  £{totalBespoke.toLocaleString()}
                </td>
                <td className="py-3 px-3 text-right">
                  £{totalRtw.toLocaleString()}
                </td>
                <td className="py-3 px-3 text-right">{totalOrders}</td>
                <td className="py-3 px-3 text-right text-sky-400">
                  £{overallAov.toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
