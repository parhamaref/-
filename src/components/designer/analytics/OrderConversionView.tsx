/**
 * @file OrderConversionView.tsx
 * Order Conversion & Haute Bespoke Funnel Analytics for Daniel’s Maison.
 * Maps visitor journey through Lookbook Browse, 3D Configurator, Biometrics,
 * Deposit Gate, and Final Commission with channel and device breakdowns.
 */

import React from 'react';
import {
  TrendingUp,
  ArrowDownRight,
  ShieldCheck,
  Smartphone,
  Monitor,
  Tablet,
  Compass,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import {
  FunnelStage,
  TrafficChannelConversion,
  DeviceConversion,
} from '../../../types/analytics.types';

interface OrderConversionViewProps {
  funnelStages: FunnelStage[];
  trafficChannels: TrafficChannelConversion[];
  devices: DeviceConversion[];
}

export const OrderConversionView: React.FC<OrderConversionViewProps> = ({
  funnelStages,
  trafficChannels,
  devices,
}) => {
  const topVisitors = funnelStages[0]?.visitors || 1;
  const finalOrders = funnelStages[funnelStages.length - 1]?.visitors || 0;
  const overallConversionPct = ((finalOrders / topVisitors) * 100).toFixed(2);

  return (
    <div className="space-y-6 text-left">
      {/* Top Conversion Summary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-[#0c0c0c] border border-[#222]">
          <span className="text-neutral-400 font-mono text-xs uppercase tracking-wider block">
            End-to-End Funnel Conversion
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-3xl font-bold text-white">
              {overallConversionPct}%
            </span>
            <span className="text-emerald-400 font-mono text-xs font-semibold">
              +0.45% YoY
            </span>
          </div>
          <span className="text-[10px] text-neutral-500 font-mono block mt-1">
            Industry luxury bespoke average: 1.5% – 2.2%
          </span>
        </div>

        <div className="p-5 rounded-xl bg-[#0c0c0c] border border-[#222]">
          <span className="text-neutral-400 font-mono text-xs uppercase tracking-wider block">
            Customizer-to-Biometrics Velocity
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-3xl font-bold text-amber-300">
              41.0%
            </span>
            <span className="text-emerald-400 font-mono text-xs">+3.1%</span>
          </div>
          <span className="text-[10px] text-neutral-500 font-mono block mt-1">
            2,840 biometric sizing dossiers created
          </span>
        </div>

        <div className="p-5 rounded-xl bg-[#0c0c0c] border border-[#222]">
          <span className="text-neutral-400 font-mono text-xs uppercase tracking-wider block">
            Deposit Gate Closing Rate
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-3xl font-bold text-emerald-300">
              73.8%
            </span>
            <span className="text-emerald-400 font-mono text-xs">High Intent</span>
          </div>
          <span className="text-[10px] text-neutral-500 font-mono block mt-1">
            1,395 fully confirmed bespoke commissions
          </span>
        </div>
      </div>

      {/* Main Conversion Funnel Visualization */}
      <div className="p-6 rounded-2xl bg-[#0c0c0c] border border-[#222] space-y-6">
        <div className="border-b border-[#1c1c1c] pb-4">
          <div className="flex items-center gap-2">
            <span className="font-serif text-lg font-bold text-white">
              Bespoke Atelier Conversion Funnel
            </span>
            <span className="text-[11px] font-mono text-emerald-400 px-2 py-0.5 rounded-sm bg-emerald-500/10 border border-emerald-500/20">
              Full Spectrum Journey
            </span>
          </div>
          <p className="text-xs text-neutral-400 font-sans mt-0.5">
            Sequential progression from lookbook discovery to final bespoke payment confirmation.
          </p>
        </div>

        {/* Stepped Funnel Bars */}
        <div className="space-y-4">
          {funnelStages.map((stage, idx) => {
            const widthPct = Math.max(Math.round((stage.visitors / topVisitors) * 100), 12);
            const isFirst = idx === 0;
            const isLast = idx === funnelStages.length - 1;

            return (
              <div key={stage.id} className="space-y-1.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{stage.name}</span>
                    <span className="text-neutral-500 hidden sm:inline">·</span>
                    <span className="text-neutral-400 text-[11px] hidden sm:inline">
                      {stage.description}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-white font-bold">
                      {stage.visitors.toLocaleString()} visitors
                    </span>
                    {!isFirst && (
                      <span className="text-amber-400 text-[11px]">
                        ({stage.conversionRateFromPrev}% from prev)
                      </span>
                    )}
                    <span className="text-emerald-400 font-bold text-[11px]">
                      {stage.overallConversionRate}% overall
                    </span>
                  </div>
                </div>

                {/* Funnel Bar */}
                <div className="h-7 w-full bg-[#141414] rounded-lg overflow-hidden flex items-center p-1 border border-[#222]">
                  <div
                    className={`h-full rounded-md transition-all duration-500 flex items-center px-3 text-[10px] font-mono font-bold text-black ${
                      isLast
                        ? 'bg-gradient-to-r from-amber-400 to-emerald-400'
                        : 'bg-gradient-to-r from-neutral-200 to-amber-300'
                    }`}
                    style={{ width: `${widthPct}%` }}
                  >
                    <span className="truncate">{widthPct}%</span>
                  </div>
                </div>

                {/* Drop-off notice if not first */}
                {!isFirst && stage.dropoffRate > 0 && (
                  <div className="text-[10px] text-neutral-500 font-mono flex items-center gap-1.5 pl-2">
                    <ArrowDownRight className="w-3 h-3 text-neutral-600" />
                    <span>Drop-off rate: {stage.dropoffRate}%</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Traffic Channel Conversion & Device Split Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Channel Conversion Ranking */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#0c0c0c] border border-[#222] space-y-4">
          <div className="flex items-center justify-between border-b border-[#1c1c1c] pb-3">
            <h3 className="font-serif text-base font-bold text-white uppercase tracking-wider">
              Acquisition Channel Conversion
            </h3>
            <span className="font-mono text-xs text-neutral-400">By Conversion Rate</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-[#222] text-neutral-400 text-[10px] uppercase">
                  <th className="py-2.5 px-2">Client Channel</th>
                  <th className="py-2.5 px-2 text-right">Visitors</th>
                  <th className="py-2.5 px-2 text-right">Orders</th>
                  <th className="py-2.5 px-2 text-right">Conv. Rate</th>
                  <th className="py-2.5 px-2 text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#181818]">
                {trafficChannels.map((c) => (
                  <tr key={c.channel} className="hover:bg-[#141414] transition-colors">
                    <td className="py-2.5 px-2 font-medium text-white">{c.channel}</td>
                    <td className="py-2.5 px-2 text-right text-neutral-400">
                      {c.visitors.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-2 text-right text-white font-semibold">
                      {c.orders}
                    </td>
                    <td className="py-2.5 px-2 text-right text-emerald-400 font-bold">
                      {c.conversionRate}%
                    </td>
                    <td className="py-2.5 px-2 text-right text-amber-300 font-bold">
                      £{c.revenue.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="p-6 rounded-2xl bg-[#0c0c0c] border border-[#222] space-y-4">
          <div className="border-b border-[#1c1c1c] pb-3">
            <h3 className="font-serif text-base font-bold text-white uppercase tracking-wider">
              Device Cohort Split
            </h3>
            <span className="font-mono text-xs text-neutral-400">Platform Ergonomics</span>
          </div>

          <div className="space-y-4 pt-1">
            {devices.map((d) => (
              <div key={d.device} className="p-3.5 rounded-xl bg-[#141414] border border-[#222] space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2 text-white font-semibold">
                    {d.device.includes('Desktop') && <Monitor className="w-4 h-4 text-amber-400" />}
                    {d.device.includes('Mobile') && <Smartphone className="w-4 h-4 text-emerald-400" />}
                    {d.device.includes('Tablet') && <Tablet className="w-4 h-4 text-sky-400" />}
                    <span>{d.device}</span>
                  </div>
                  <span className="text-amber-300 font-bold">{d.sharePct}% share</span>
                </div>

                <div className="w-full h-1.5 bg-[#222] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full"
                    style={{ width: `${d.sharePct}%` }}
                  />
                </div>

                <div className="flex justify-between text-[11px] font-mono text-neutral-400">
                  <span>Conversion Rate</span>
                  <span className="text-emerald-400 font-bold">{d.conversionRate}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
