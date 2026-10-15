/**
 * @file RetentionClvView.tsx
 * Customer Retention Matrix & Lifetime Value (CLV) Analytics for Daniel’s Maison.
 * Features 6-Month Cohort Retention Heatmap, Repeat Purchase Curves,
 * CLV Tier Distribution, and Top VIP Client Dossier Ledger.
 */

import React, { useState } from 'react';
import {
  Users,
  Award,
  Crown,
  HeartHandshake,
  DollarSign,
  TrendingUp,
  Clock,
  Sparkles,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import {
  RetentionCohort,
  VipClientDossier,
  ClvTierSummary,
} from '../../../types/analytics.types';

interface RetentionClvViewProps {
  cohorts: RetentionCohort[];
  vipClients: VipClientDossier[];
  clvTiers: ClvTierSummary[];
}

export const RetentionClvView: React.FC<RetentionClvViewProps> = ({
  cohorts,
  vipClients,
  clvTiers,
}) => {
  const [selectedVip, setSelectedVip] = useState<VipClientDossier | null>(null);

  // Helper for heatmap background intensity
  const getHeatmapColor = (pct: number) => {
    if (pct >= 70) return 'bg-emerald-500/30 text-emerald-300 font-bold';
    if (pct >= 60) return 'bg-emerald-500/20 text-emerald-400 font-semibold';
    if (pct >= 50) return 'bg-amber-500/25 text-amber-300 font-semibold';
    if (pct >= 40) return 'bg-amber-500/15 text-amber-400';
    if (pct >= 30) return 'bg-neutral-800 text-neutral-300';
    return 'bg-neutral-900 text-neutral-500';
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Retention & CLV KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-[#0c0c0c] border border-[#222]">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-mono uppercase tracking-wider">
            <span>Repeat Customer Rate</span>
            <HeartHandshake className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-3xl font-bold text-emerald-400">
              64.2%
            </span>
            <span className="text-emerald-400 font-mono text-xs">+7.2% YoY</span>
          </div>
          <span className="text-[10px] text-neutral-500 font-mono block mt-1">
            Industry luxury average: 38% – 45%
          </span>
        </div>

        <div className="p-5 rounded-xl bg-[#0c0c0c] border border-[#222]">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-mono uppercase tracking-wider">
            <span>Average Lifetime Value</span>
            <Crown className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-3xl font-bold text-amber-300">
              £8,420
            </span>
            <span className="text-emerald-400 font-mono text-xs">+15.6%</span>
          </div>
          <span className="text-[10px] text-neutral-500 font-mono block mt-1">
            Across active bespoke patrons
          </span>
        </div>

        <div className="p-5 rounded-xl bg-[#0c0c0c] border border-[#222]">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-mono uppercase tracking-wider">
            <span>LTV-to-CAC Ratio</span>
            <TrendingUp className="w-4 h-4 text-sky-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-3xl font-bold text-sky-400">
              7.4x
            </span>
            <span className="text-neutral-400 font-mono text-xs">World-Class</span>
          </div>
          <span className="text-[10px] text-neutral-500 font-mono block mt-1">
            Acquisition payback period: 1.8 months
          </span>
        </div>

        <div className="p-5 rounded-xl bg-[#0c0c0c] border border-[#222]">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-mono uppercase tracking-wider">
            <span>Mean Repurchase Cycle</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-3xl font-bold text-white">
              48 Days
            </span>
            <span className="text-emerald-400 font-mono text-xs">-6 days</span>
          </div>
          <span className="text-[10px] text-neutral-500 font-mono block mt-1">
            Seasonal wardrobe re-commissions
          </span>
        </div>
      </div>

      {/* 6-Month Retention Cohort Heatmap Matrix */}
      <div className="p-6 rounded-2xl bg-[#0c0c0c] border border-[#222] space-y-4">
        <div className="border-b border-[#1c1c1c] pb-3">
          <div className="flex items-center gap-2">
            <span className="font-serif text-lg font-bold text-white">
              Customer Retention Cohort Heatmap
            </span>
            <span className="text-[11px] font-mono text-emerald-400 px-2 py-0.5 rounded-sm bg-emerald-500/10 border border-emerald-500/20">
              Repeat Rate (%)
            </span>
          </div>
          <p className="text-xs text-neutral-400 font-sans mt-0.5">
            Percentage of patrons from each monthly acquisition cohort placing repeat bespoke commissions over subsequent months.
          </p>
        </div>

        <div className="overflow-x-auto pt-2">
          <table className="w-full text-center font-mono text-xs">
            <thead>
              <tr className="border-b border-[#222] text-neutral-400 text-[10px] uppercase">
                <th className="py-2.5 px-3 text-left">Cohort Month</th>
                <th className="py-2.5 px-3">New Patrons</th>
                <th className="py-2.5 px-3">Month 1</th>
                <th className="py-2.5 px-3">Month 2</th>
                <th className="py-2.5 px-3">Month 3</th>
                <th className="py-2.5 px-3">Month 4</th>
                <th className="py-2.5 px-3">Month 5</th>
                <th className="py-2.5 px-3">Month 6</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#181818]">
              {cohorts.map((row) => (
                <tr key={row.cohortMonth} className="hover:bg-[#141414] transition-colors">
                  <td className="py-3 px-3 text-left font-semibold text-white">
                    {row.cohortMonth}
                  </td>
                  <td className="py-3 px-3 text-neutral-300 font-bold">
                    {row.initialCustomers}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2.5 py-1 rounded-sm bg-neutral-800 text-neutral-400">
                      {row.month1Pct}%
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2.5 py-1 rounded-sm ${getHeatmapColor(row.month2Pct)}`}>
                      {row.month2Pct}%
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2.5 py-1 rounded-sm ${getHeatmapColor(row.month3Pct)}`}>
                      {row.month3Pct}%
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2.5 py-1 rounded-sm ${getHeatmapColor(row.month4Pct)}`}>
                      {row.month4Pct}%
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2.5 py-1 rounded-sm ${getHeatmapColor(row.month5Pct)}`}>
                      {row.month5Pct}%
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2.5 py-1 rounded-sm ${getHeatmapColor(row.month6Pct)}`}>
                      {row.month6Pct}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CLV Tier Segmentation Breakdown */}
      <div className="p-6 rounded-2xl bg-[#0c0c0c] border border-[#222] space-y-4">
        <div className="flex items-center justify-between border-b border-[#1c1c1c] pb-3">
          <div>
            <h3 className="font-serif text-base font-bold text-white uppercase tracking-wider">
              Patron Lifetime Value (CLV) Segmentation
            </h3>
            <p className="text-xs text-neutral-400 font-sans mt-0.5">
              Cumulative historical revenue and distribution by client engagement tier.
            </p>
          </div>
          <span className="font-mono text-xs text-amber-400">322 Active Clients</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          {clvTiers.map((tier) => (
            <div
              key={tier.tier}
              className="p-4 rounded-xl bg-[#141414] border border-[#222] space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-serif text-sm font-bold text-white">
                  {tier.tier}
                </span>
                <span className="text-xs font-mono text-neutral-400 font-bold">
                  {tier.sharePct}%
                </span>
              </div>

              <div className="space-y-1 font-mono text-xs">
                <div className="flex justify-between text-neutral-400">
                  <span>Client Count:</span>
                  <span className="text-white font-bold">{tier.clientCount}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Average LTV:</span>
                  <span className="text-amber-400 font-bold">
                    £{tier.avgLtv.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Gross Share:</span>
                  <span className="text-emerald-400 font-bold">
                    £{tier.totalRevenue.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="w-full h-1.5 bg-[#222] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${tier.sharePct * 2}%`, backgroundColor: tier.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top VIP Clients Ledger */}
      <div className="p-6 rounded-2xl bg-[#0c0c0c] border border-[#222] space-y-4">
        <div className="flex items-center justify-between border-b border-[#1c1c1c] pb-3">
          <h3 className="font-serif text-base font-bold text-white uppercase tracking-wider">
            High Net Worth VIP Patrons Dossier
          </h3>
          <span className="font-mono text-xs text-neutral-400">Top Lifetime Contributors</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-[#222] text-neutral-400 text-[10px] uppercase">
                <th className="py-2.5 px-3">Patron Name</th>
                <th className="py-2.5 px-3">VIP Tier</th>
                <th className="py-2.5 px-3">Domicile</th>
                <th className="py-2.5 px-3 text-right">Lifetime Spend</th>
                <th className="py-2.5 px-3 text-right">Commissions</th>
                <th className="py-2.5 px-3 text-right">AOV</th>
                <th className="py-2.5 px-3 text-right">Frequency</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#181818]">
              {vipClients.map((client) => (
                <tr
                  key={client.id}
                  onClick={() => setSelectedVip(client)}
                  className="hover:bg-[#141414] transition-colors cursor-pointer"
                >
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      {client.avatar && (
                        <img
                          src={client.avatar}
                          alt={client.clientName}
                          className="w-7 h-7 rounded-full object-cover border border-amber-500/30"
                        />
                      )}
                      <span className="font-semibold text-white font-serif text-xs">
                        {client.clientName}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-[10px] font-mono text-amber-300 font-bold px-2 py-0.5 rounded-sm bg-amber-500/10 border border-amber-500/20">
                      {client.tier}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-neutral-400">{client.location}</td>
                  <td className="py-3 px-3 text-right font-bold text-amber-300">
                    £{client.totalSpend.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-right text-white font-semibold">
                    {client.ordersCount}
                  </td>
                  <td className="py-3 px-3 text-right text-sky-300">
                    £{Math.round(client.aov).toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-right text-neutral-300">
                    {client.repeatFrequencyDays}d
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">
                      ● {client.loyaltyStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
