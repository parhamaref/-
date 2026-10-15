/**
 * @file DesignerOverviewPlaceholder.tsx
 * Overview KPI cards, real-time analytics summary, and quick-action workshop dispatch.
 */

import React from 'react';
import {
  TrendingUp,
  ShoppingBag,
  Flame,
  CheckCircle2,
  Clock,
  Star,
  Users,
  Eye,
  ArrowUpRight,
  ShieldAlert,
  Boxes,
  Video,
  ChevronRight,
} from 'lucide-react';
import { useDesignerStore } from '../../stores/designerStore';

export const DesignerOverviewPlaceholder: React.FC = () => {
  const { setActiveSection, profile, notifications } = useDesignerStore();

  const metrics = [
    { label: 'TOTAL GROSS SALES', value: '£42,850.00', delta: '+18.4%', positive: true, icon: TrendingUp },
    { label: 'ACTIVE BESPOKE ORDERS', value: '7 IN PROGRESS', delta: '3 In QC', positive: true, icon: ShoppingBag },
    { label: 'CLEARED STRIPE BALANCE', value: '£9,420.50', delta: 'Payout ready', positive: true, icon: CheckCircle2 },
    { label: 'ATELIER RATING', value: '4.98 ★', delta: '142 Reviews', positive: true, icon: Star },
    { label: 'PRODUCT VIEWS (30D)', value: '18,490', delta: '+24.1%', positive: true, icon: Eye },
    { label: 'MADE-TO-MEASURE CONVERSION', value: '8.4%', delta: '+2.1%', positive: true, icon: Users },
  ];

  return (
    <div className="space-y-8 animate-fadeIn font-mono text-left max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-[#0E0E0E] border border-[#222] p-6 sm:p-8 rounded-sm relative overflow-hidden">
        <div className="max-w-2xl space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-xs bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[9px] uppercase tracking-widest font-bold">
            <span>● VERIFIED ATELIER WORKSPACE</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-white uppercase font-bold tracking-wider">
            Welcome, {profile.brandName}
          </h2>
          <p className="text-xs text-neutral-400 font-sans leading-relaxed">
            Infrastructure operational. You have 3 bespoke orders awaiting measurement verification and 1 low-stock fabric notification.
          </p>
        </div>

        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-12 translate-y-12">
          <span className="font-serif text-9xl font-bold text-white">DM</span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((m, i) => {
          const Icon = m.icon;
          const targetSection =
            m.label === 'ATELIER RATING'
              ? 'reviews'
              : m.label === 'ACTIVE BESPOKE ORDERS'
              ? 'orders'
              : m.label === 'TOTAL GROSS SALES' || m.label === 'CLEARED STRIPE BALANCE'
              ? 'earnings'
              : 'analytics';

          return (
            <div
              key={i}
              onClick={() => setActiveSection(targetSection as any)}
              className="bg-[#0A0A0A] border border-[#222] hover:border-amber-500/50 p-5 rounded-xs transition-all space-y-3 cursor-pointer group hover:bg-[#111]"
            >
              <div className="flex items-center justify-between text-neutral-400">
                <span className="text-[9.5px] uppercase tracking-wider text-neutral-400 group-hover:text-amber-300 transition-colors">
                  {m.label}
                </span>
                <Icon className="w-4 h-4 text-neutral-400 group-hover:text-amber-400 transition-colors" />
              </div>
              <div className="flex items-baseline justify-between">
                <span className="font-serif text-2xl text-white font-bold">{m.value}</span>
                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5">
                  <ArrowUpRight className="w-3 h-3" />
                  <span>{m.delta}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Access Dispatch Lanes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Lane 1: Production Pipeline */}
        <div className="bg-[#0E0E0E] border border-[#222] p-5 rounded-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#222] pb-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Shop-Floor Stages</span>
            </span>
            <button
              onClick={() => setActiveSection('production')}
              className="text-[9px] text-neutral-400 hover:text-white uppercase tracking-wider cursor-pointer"
            >
              View Queue →
            </button>
          </div>
          <p className="text-xs text-neutral-400 font-sans">
            Update stage completions for pattern drafting, cutting, and hand assembly.
          </p>
          <button
            onClick={() => setActiveSection('production')}
            className="w-full py-2.5 px-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white text-[10px] uppercase tracking-widest rounded-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <span>Manage Active Stages</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Lane 2: Video Transparency */}
        <div className="bg-[#0E0E0E] border border-[#222] p-5 rounded-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#222] pb-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Video className="w-3.5 h-3.5 text-emerald-400" />
              <span>Artisan Video Proof</span>
            </span>
            <button
              onClick={() => setActiveSection('videos')}
              className="text-[9px] text-neutral-400 hover:text-white uppercase tracking-wider cursor-pointer"
            >
              Upload →
            </button>
          </div>
          <p className="text-xs text-neutral-400 font-sans">
            Directly upload craftsmanship recordings to client order logs for certified transparency.
          </p>
          <button
            onClick={() => setActiveSection('videos')}
            className="w-full py-2.5 px-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white text-[10px] uppercase tracking-widest rounded-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <span>Launch Video Hub</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Lane 3: Fabric & Yardage Watchtower */}
        <div className="bg-[#0E0E0E] border border-[#222] p-5 rounded-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#222] pb-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Boxes className="w-3.5 h-3.5 text-rose-400" />
              <span>Material Vault</span>
            </span>
            <button
              onClick={() => setActiveSection('inventory')}
              className="text-[9px] text-neutral-400 hover:text-white uppercase tracking-wider cursor-pointer"
            >
              Audit →
            </button>
          </div>
          <p className="text-xs text-neutral-400 font-sans">
            Monitor raw meters of worsted wool, organic linen, silk twills, and hardware.
          </p>
          <button
            onClick={() => setActiveSection('inventory')}
            className="w-full py-2.5 px-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white text-[10px] uppercase tracking-widest rounded-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <span>Inspect Yardage Balance</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
