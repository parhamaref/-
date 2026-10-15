/**
 * @file CustomerDesignApprovalsView.tsx
 * Customer Portal Workspace for Pre-Production Design Approvals.
 * Allows clients to browse, review, and act on commissions before manufacturing starts.
 */

import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  CheckCircle2,
  Clock,
  Scissors,
  Layers,
  Search,
  Filter,
  Eye,
  Sliders,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import { useDesignApprovalStore } from '../../stores/designApprovalStore';
import { DesignApprovalPackage, DesignApprovalWorkflowStage } from '../../types/designApproval.types';
import { CustomerDesignApprovalModal } from './CustomerDesignApprovalModal';

interface CustomerDesignApprovalsViewProps {
  customerId?: string;
  customerName?: string;
}

const STAGE_BADGES: Record<
  DesignApprovalWorkflowStage,
  { label: string; color: string; border: string }
> = {
  DRAFT: { label: '1. Atelier Draft', color: 'bg-neutral-800 text-neutral-300', border: 'border-neutral-700' },
  SUBMITTED: { label: '2. Awaiting Your Review', color: 'bg-amber-500/15 text-amber-300', border: 'border-amber-500/40' },
  REVISION_REQUESTED: { label: '3. Revision Requested', color: 'bg-purple-500/15 text-purple-300', border: 'border-purple-500/40' },
  UPDATED: { label: '4. Updated Specification', color: 'bg-blue-500/15 text-blue-300', border: 'border-blue-500/40' },
  APPROVED: { label: '5. Design Approved', color: 'bg-emerald-500/20 text-emerald-300', border: 'border-emerald-500/50' },
  PRODUCTION: { label: '6. In Workshop Production', color: 'bg-emerald-600 text-white', border: 'border-emerald-400' },
  REJECTED: { label: 'Commission Closed', color: 'bg-red-500/20 text-red-300', border: 'border-red-500/40' },
};

export const CustomerDesignApprovalsView: React.FC<CustomerDesignApprovalsViewProps> = ({
  customerId = 'cust_001',
  customerName = 'Lord Alistair Sterling-Fox',
}) => {
  const {
    filteredPackages,
    countsByStage,
    stageFilter,
    setStageFilter,
    searchQuery,
    setSearchQuery,
    resetToDefaultMock,
  } = useDesignApprovalStore();

  const [inspectingPackage, setInspectingPackage] = useState<DesignApprovalPackage | null>(null);

  const awaitingReviewCount = countsByStage.SUBMITTED + countsByStage.UPDATED;
  const inProductionCount = countsByStage.APPROVED + countsByStage.PRODUCTION;

  const stageOptions: Array<{
    id: DesignApprovalWorkflowStage | 'ALL';
    label: string;
    count: number;
  }> = [
    { id: 'ALL', label: 'All Commissions', count: filteredPackages.length },
    { id: 'SUBMITTED', label: 'Awaiting Sign-Off', count: countsByStage.SUBMITTED },
    { id: 'REVISION_REQUESTED', label: 'Revisions Active', count: countsByStage.REVISION_REQUESTED },
    { id: 'UPDATED', label: 'Updated v1.1', count: countsByStage.UPDATED },
    { id: 'APPROVED', label: 'Approved', count: countsByStage.APPROVED },
    { id: 'PRODUCTION', label: 'In Production', count: countsByStage.PRODUCTION },
  ];

  return (
    <div className="space-y-8 animate-fadeIn font-mono text-left">
      {/* Detail Review Modal */}
      <CustomerDesignApprovalModal
        isOpen={Boolean(inspectingPackage)}
        packageData={inspectingPackage}
        onClose={() => setInspectingPackage(null)}
      />

      {/* Top Banner Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#121212] via-[#0E0E0E] to-[#141414] border border-[#2B2B2B] p-6 sm:p-8">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            Pre-Production Gatekeeper
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold uppercase tracking-wider text-white">
            Design Approval & Specification Review
          </h1>
          <p className="text-sm text-neutral-300 leading-relaxed font-sans">
            Before cloth is hand-sheared on the cutting bench, review and approve your CAD sketches, mill cloth allocation, anatomical measurements, and custom hand-stitched detailing.
          </p>
        </div>

        {/* Action button to reset mock data */}
        <div className="mt-4 sm:mt-0 sm:absolute sm:top-8 sm:right-8 z-10">
          <button
            onClick={() => resetToDefaultMock()}
            className="px-3 py-1.5 rounded-lg border border-[#333] hover:bg-neutral-800 text-neutral-400 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Reset demonstration data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Demo Data
          </button>
        </div>
      </div>

      {/* Pipeline KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-[#0D0D0D] border border-[#222] rounded-xl space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs uppercase tracking-wider font-bold">
            <span>Awaiting Your Review</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-amber-400">
            {awaitingReviewCount}
          </p>
          <span className="text-[11px] text-neutral-500 block">
            Immediate sign-off required
          </span>
        </div>

        <div className="p-5 bg-[#0D0D0D] border border-[#222] rounded-xl space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs uppercase tracking-wider font-bold">
            <span>Revisions Active</span>
            <Sliders className="w-4 h-4 text-purple-400" />
          </div>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-purple-400">
            {countsByStage.REVISION_REQUESTED}
          </p>
          <span className="text-[11px] text-neutral-500 block">
            Creative Director adjustments
          </span>
        </div>

        <div className="p-5 bg-[#0D0D0D] border border-[#222] rounded-xl space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs uppercase tracking-wider font-bold">
            <span>In Bench Production</span>
            <Scissors className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-emerald-400">
            {inProductionCount}
          </p>
          <span className="text-[11px] text-neutral-500 block">
            Approved & crafting
          </span>
        </div>

        <div className="p-5 bg-[#0D0D0D] border border-[#222] rounded-xl space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs uppercase tracking-wider font-bold">
            <span>Guaranteed Fit</span>
            <ShieldCheck className="w-4 h-4 text-blue-400" />
          </div>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-blue-400">
            100%
          </p>
          <span className="text-[11px] text-neutral-500 block">
            Savile Row bespoke tolerance
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0F0F0F] p-4 rounded-xl border border-[#222]">
        {/* Stage Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {stageOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setStageFilter(opt.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 ${
                stageFilter === opt.id
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <span>{opt.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  stageFilter === opt.id ? 'bg-black/30 text-black' : 'bg-neutral-800 text-neutral-400'
                }`}
              >
                {opt.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search commission or cloth..."
            className="w-full bg-[#161616] border border-[#2B2B2B] focus:border-amber-500 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white outline-none"
          />
        </div>
      </div>

      {/* Commissions Grid */}
      {filteredPackages.length === 0 ? (
        <div className="p-12 text-center bg-[#0D0D0D] border border-[#222] rounded-2xl space-y-3">
          <p className="text-neutral-400 text-sm">No commissions match the current filter.</p>
          <button
            onClick={() => setStageFilter('ALL')}
            className="text-xs text-amber-400 hover:underline uppercase font-bold cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPackages.map((pkg) => {
            const spec = pkg.currentSpec;
            const isPendingReview = pkg.currentStage === 'SUBMITTED' || pkg.currentStage === 'UPDATED';

            return (
              <div
                key={pkg.id}
                className={`bg-[#0D0D0D] border rounded-2xl overflow-hidden shadow-xl transition-all hover:border-amber-500/50 flex flex-col justify-between ${
                  isPendingReview ? 'border-amber-500/40 ring-1 ring-amber-500/20' : 'border-[#222]'
                }`}
              >
                {/* Card Top: Visuals & Header */}
                <div>
                  <div className="p-5 border-b border-[#1E1E1E] bg-[#121212] flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest">
                          {pkg.orderNumber}
                        </span>
                        <span className="text-neutral-600 text-xs">•</span>
                        <span className="text-[10px] text-neutral-400 font-bold">
                          v{pkg.currentVersion}
                        </span>
                      </div>
                      <h3 className="font-serif text-lg font-bold text-white uppercase tracking-wider">
                        {pkg.garmentName}
                      </h3>
                      <p className="text-xs text-neutral-400">
                        Lead Designer: <span className="text-neutral-300">{pkg.leadDesigner}</span>
                      </p>
                    </div>

                    {/* Stage Badge */}
                    <div
                      className={`px-2.5 py-1 rounded-md border text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                        STAGE_BADGES[pkg.currentStage].color
                      } ${STAGE_BADGES[pkg.currentStage].border}`}
                    >
                      {STAGE_BADGES[pkg.currentStage].label}
                    </div>
                  </div>

                  {/* Thumbnail & Key Specs Preview */}
                  <div className="p-5 grid grid-cols-1 sm:grid-cols-12 gap-4">
                    {/* Sketch Thumbnail */}
                    <div className="sm:col-span-5 aspect-[4/5] bg-black rounded-xl overflow-hidden border border-[#2B2B2B] relative group">
                      <img
                        src={pkg.primaryThumbnail}
                        alt={pkg.garmentName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute bottom-2 left-2 right-2 p-1.5 bg-black/85 backdrop-blur-md rounded border border-white/10 text-[9px] text-neutral-300 text-center truncate">
                        {spec.sketches[0]?.title || 'CAD Silhouette'}
                      </div>
                    </div>

                    {/* Key Specifications Quick Specs */}
                    <div className="sm:col-span-7 space-y-2.5 text-xs">
                      {/* Fabric Spec Pill */}
                      <div className="p-2.5 bg-[#141414] rounded-lg border border-[#222]">
                        <span className="text-[9px] text-neutral-500 uppercase block font-bold">
                          Cloth Archive
                        </span>
                        <p className="font-bold text-white truncate">
                          {spec.fabric.millName} — {spec.fabric.clothName}
                        </p>
                        <span className="text-[10px] text-neutral-400">
                          {spec.fabric.weightGsm} g/m² · {spec.fabric.composition}
                        </span>
                      </div>

                      {/* Colorway Pill */}
                      <div className="p-2.5 bg-[#141414] rounded-lg border border-[#222] flex items-center justify-between">
                        <div>
                          <span className="text-[9px] text-neutral-500 uppercase block font-bold">
                            Color Selection
                          </span>
                          <span className="text-neutral-200 font-bold block">
                            {spec.color.primaryColorName}
                          </span>
                        </div>
                        <div
                          className="w-6 h-6 rounded-full border border-white/20 shadow-md"
                          style={{ backgroundColor: spec.color.primaryColorHex }}
                          title={spec.color.primaryColorName}
                        />
                      </div>

                      {/* Monogram & Styling */}
                      <div className="p-2.5 bg-[#141414] rounded-lg border border-[#222]">
                        <span className="text-[9px] text-neutral-500 uppercase block font-bold">
                          Custom Request
                        </span>
                        <p className="text-neutral-300 text-[11px] truncate">
                          Monogram: <strong className="text-amber-300">"{spec.customRequests.monogramText}"</strong> · {spec.customRequests.lapelStyle}
                        </p>
                      </div>

                      {/* SLA Countdown if pending review */}
                      {isPendingReview && (
                        <div className="flex items-center gap-1.5 text-[11px] text-amber-400 bg-amber-500/10 px-2.5 py-1.5 rounded-lg border border-amber-500/20">
                          <Clock className="w-3.5 h-3.5 shrink-0" />
                          <span>Turnaround Deadline: 48h Pre-Production Window</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Footer: Action Button */}
                <div className="p-4 bg-[#111111] border-t border-[#1E1E1E] flex items-center justify-between gap-3">
                  <div className="text-xs">
                    <span className="text-[10px] text-neutral-500 uppercase block">Commission Value</span>
                    <strong className="text-amber-300 font-bold text-sm">
                      £{pkg.priceGbp.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                    </strong>
                  </div>

                  <button
                    onClick={() => setInspectingPackage(pkg)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                      isPendingReview
                        ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-950 font-extrabold'
                        : 'bg-neutral-800 hover:bg-neutral-700 text-white'
                    }`}
                  >
                    <Eye className="w-4 h-4" />
                    <span>Review Design Specification</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
