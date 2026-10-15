/**
 * @file CustomerAlterationsWorkspace.tsx
 * Customer Master Workspace for Alteration & Tailoring Requests.
 * Displays all active and archived alteration petitions across the 6-stage lifecycle:
 * Submitted → Reviewed → Approved → In Alteration → Completed → Returned
 */

import React, { useState } from 'react';
import {
  Scissors,
  Sparkles,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Truck,
  Eye,
  Camera,
  Layers,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { useAlterationStore } from '../../stores/alterationStore';
import { AlterationWorkflowStage, AlterationRequest } from '../../types/alteration.types';
import { RequestAlterationModal } from './RequestAlterationModal';
import { AlterationProgressTrackerModal } from './AlterationProgressTrackerModal';

interface CustomerAlterationsWorkspaceProps {
  customerId?: string;
  customerName?: string;
}

const STAGE_BADGES: Record<AlterationWorkflowStage, { label: string; color: string; border: string }> = {
  SUBMITTED: { label: '1. Submitted', color: 'bg-blue-500/10 text-blue-400', border: 'border-blue-500/30' },
  REVIEWED: { label: '2. Reviewed', color: 'bg-purple-500/10 text-purple-400', border: 'border-purple-500/30' },
  APPROVED: { label: '3. Approved', color: 'bg-amber-500/10 text-amber-400', border: 'border-amber-500/30' },
  IN_ALTERATION: { label: '4. In Alteration', color: 'bg-orange-500/15 text-orange-400', border: 'border-orange-500/30' },
  COMPLETED: { label: '5. Completed', color: 'bg-emerald-500/15 text-emerald-400', border: 'border-emerald-500/30' },
  RETURNED: { label: '6. Returned', color: 'bg-green-500/20 text-green-300', border: 'border-green-500/40' },
};

export const CustomerAlterationsWorkspace: React.FC<CustomerAlterationsWorkspaceProps> = ({
  customerId = 'cust_001',
  customerName = 'Lord Alistair Sterling-Fox',
}) => {
  const {
    filteredRequests,
    countsByStage,
    stageFilter,
    setStageFilter,
    searchQuery,
    setSearchQuery,
    advanceStage,
    resetToDefaultMock,
  } = useAlterationStore();

  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [inspectingRequest, setInspectingRequest] = useState<AlterationRequest | null>(null);

  const totalActive = countsByStage.SUBMITTED + countsByStage.REVIEWED + countsByStage.APPROVED + countsByStage.IN_ALTERATION;

  const stageOptions: Array<{ id: AlterationWorkflowStage | 'ALL'; label: string; count: number }> = [
    { id: 'ALL', label: 'All Requests', count: filteredRequests.length },
    { id: 'SUBMITTED', label: 'Submitted', count: countsByStage.SUBMITTED },
    { id: 'REVIEWED', label: 'Reviewed', count: countsByStage.REVIEWED },
    { id: 'APPROVED', label: 'Approved', count: countsByStage.APPROVED },
    { id: 'IN_ALTERATION', label: 'In Alteration', count: countsByStage.IN_ALTERATION },
    { id: 'COMPLETED', label: 'Completed', count: countsByStage.COMPLETED },
    { id: 'RETURNED', label: 'Returned', count: countsByStage.RETURNED },
  ];

  const handleOpenTracker = (req: AlterationRequest) => {
    setInspectingRequest(req);
  };

  return (
    <div className="space-y-8 animate-fadeIn font-mono text-left">
      {/* Request Alteration Wizard Modal */}
      <RequestAlterationModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onSuccess={(newId) => {
          const created = filteredRequests.find((r) => r.id === newId);
          if (created) setInspectingRequest(created);
        }}
      />

      {/* Progress Tracker Modal */}
      <AlterationProgressTrackerModal
        request={inspectingRequest}
        isOpen={Boolean(inspectingRequest)}
        onClose={() => setInspectingRequest(null)}
      />

      {/* Header Metric Ribbon */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0E0E0E] border border-[#2B2B2B] p-5 rounded-sm flex flex-col justify-between">
          <span className="text-[9.5px] uppercase tracking-widest text-neutral-400">
            Active Alterations
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold font-serif text-white">{totalActive}</span>
            <span className="text-[10px] text-amber-400">In Pipeline</span>
          </div>
        </div>

        <div className="bg-[#0E0E0E] border border-[#2B2B2B] p-5 rounded-sm flex flex-col justify-between">
          <span className="text-[9.5px] uppercase tracking-widest text-neutral-400">
            On Cutting Bench
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold font-serif text-amber-400">
              {countsByStage.IN_ALTERATION}
            </span>
            <span className="text-[10px] text-neutral-400">In Alteration</span>
          </div>
        </div>

        <div className="bg-[#0E0E0E] border border-[#2B2B2B] p-5 rounded-sm flex flex-col justify-between">
          <span className="text-[9.5px] uppercase tracking-widest text-neutral-400">
            Returned & Restored
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold font-serif text-emerald-400">
              {countsByStage.RETURNED}
            </span>
            <span className="text-[10px] text-emerald-400">Delivered</span>
          </div>
        </div>

        <div className="bg-[#0E0E0E] border border-[#2B2B2B] p-5 rounded-sm flex flex-col justify-between">
          <span className="text-[9.5px] uppercase tracking-widest text-neutral-400">
            Bespoke Stewardship
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-sm font-bold text-emerald-400">100% COMPLIMENTARY</span>
            <span className="text-[9px] text-neutral-400">Lifetime Warranty</span>
          </div>
        </div>
      </div>

      {/* Main Bar & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#0E0E0E] border border-[#2B2B2B] p-4 rounded-sm">
        <div>
          <h2 className="font-serif text-xl text-white uppercase font-bold tracking-wider flex items-center gap-2">
            <Scissors className="w-5 h-5 text-amber-400" />
            <span>Tailoring & Alteration Requests</span>
          </h2>
          <p className="text-[11px] text-neutral-400 font-sans mt-0.5">
            Full 6-stage lifecycle tracking for bespoke fitting refinements, seam tapering, and cuff adjustments.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => setIsRequestModalOpen(true)}
            className="flex-1 md:flex-initial px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs rounded-xs flex items-center justify-center gap-2 uppercase tracking-wider shadow-lg shadow-amber-400/10 cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Request New Alteration</span>
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
        {/* Stage Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 text-[10px]">
          {stageOptions.map((s) => (
            <button
              key={s.id}
              onClick={() => setStageFilter(s.id)}
              className={`px-3 py-2 rounded-xs uppercase tracking-wider font-bold transition-all shrink-0 cursor-pointer ${
                stageFilter === s.id
                  ? 'bg-white text-black shadow-md'
                  : 'bg-[#0E0E0E] border border-[#2B2B2B] text-neutral-400 hover:text-white'
              }`}
            >
              <span>{s.label}</span>
              <span className="ml-1.5 opacity-60">({s.count})</span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full lg:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            placeholder="Search garment or request ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0E0E0E] border border-[#2B2B2B] rounded-xs pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
          />
        </div>
      </div>

      {/* Requests Grid */}
      {filteredRequests.length === 0 ? (
        <div className="p-12 text-center rounded-sm bg-[#0E0E0E] border border-[#2B2B2B] space-y-3">
          <Scissors className="w-8 h-8 text-neutral-600 mx-auto" />
          <h3 className="text-white font-bold text-sm uppercase">No Alteration Requests Found</h3>
          <p className="text-neutral-500 text-xs max-w-md mx-auto font-sans">
            No alteration dossiers matching your criteria. You can request a complimentary fitting adjustment on any piece in your Digital Wardrobe.
          </p>
          <button
            onClick={() => setIsRequestModalOpen(true)}
            className="px-5 py-2 bg-amber-400 text-black text-xs font-bold rounded-xs uppercase tracking-wider mt-2 cursor-pointer"
          >
            Request Alteration
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRequests.map((req) => {
            const badge = STAGE_BADGES[req.currentStage];
            const stagesOrder: AlterationWorkflowStage[] = [
              'SUBMITTED',
              'REVIEWED',
              'APPROVED',
              'IN_ALTERATION',
              'COMPLETED',
              'RETURNED',
            ];
            const stageIdx = stagesOrder.indexOf(req.currentStage);

            return (
              <div
                key={req.id}
                className="bg-[#0E0E0E] border border-[#2B2B2B] hover:border-neutral-600 rounded-sm p-5 space-y-4 transition-all flex flex-col justify-between"
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={req.primaryImageUrl}
                      alt={req.garmentName}
                      className="w-14 h-14 rounded-xs object-cover border border-[#222]"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9.5px] text-amber-400 font-bold uppercase tracking-widest">
                          {req.id}
                        </span>
                        <span
                          className={`text-[8.5px] px-2 py-0.5 rounded-2xs font-bold uppercase border ${badge.color} ${badge.border}`}
                        >
                          {badge.label}
                        </span>
                      </div>
                      <h3 className="font-serif text-sm font-bold text-white uppercase tracking-wider mt-0.5">
                        {req.garmentName}
                      </h3>
                      <p className="text-[10px] text-neutral-400 font-sans truncate">
                        {req.garmentSilhouette} • SN: {req.garmentSerial}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 6-Step Visual Progress Stepper Preview */}
                <div className="bg-[#121212] border border-[#222] p-2.5 rounded-xs space-y-1.5">
                  <div className="flex items-center justify-between text-[8.5px] text-neutral-500 uppercase">
                    <span>Workflow Progress</span>
                    <span className="text-amber-400 font-bold">Step {stageIdx + 1} of 6</span>
                  </div>

                  <div className="grid grid-cols-6 gap-1">
                    {stagesOrder.map((stg, i) => {
                      const isComplete = i <= stageIdx;
                      const isCurrent = i === stageIdx;
                      return (
                        <div key={stg} className="flex flex-col items-center gap-1">
                          <div
                            className={`h-1.5 w-full rounded-2xs transition-all ${
                              isCurrent
                                ? 'bg-amber-400 animate-pulse'
                                : isComplete
                                ? 'bg-emerald-500'
                                : 'bg-[#222]'
                            }`}
                          />
                          <span
                            className={`text-[7.5px] uppercase tracking-tighter truncate ${
                              isCurrent
                                ? 'text-amber-400 font-bold'
                                : isComplete
                                ? 'text-neutral-300'
                                : 'text-neutral-600'
                            }`}
                          >
                            {stg.slice(0, 4)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Fit changes chips */}
                <div className="space-y-1.5">
                  <span className="text-[9px] text-neutral-500 uppercase tracking-widest block">
                    Configured Fit Adjustments ({req.fitChanges.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {req.fitChanges.map((fc, idx) => (
                      <span
                        key={idx}
                        className="text-[9.5px] px-2 py-0.5 rounded-2xs bg-[#171717] border border-[#2E2E2E] text-neutral-200"
                      >
                        {fc.regionLabel}: <strong className="text-amber-400">{fc.deltaCm > 0 ? `+${fc.deltaCm}` : fc.deltaCm}cm</strong>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer details & Action buttons */}
                <div className="pt-3 border-t border-[#222] flex items-center justify-between gap-2 text-[10px]">
                  <div className="text-neutral-400 truncate">
                    <span className="text-neutral-500 block text-[9px] uppercase">Assigned Master Tailor:</span>
                    <span className="text-white font-bold">{req.assignedTailorName || 'Henri Laurent'}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleOpenTracker(req)}
                      className="px-3.5 py-1.5 bg-white hover:bg-neutral-200 text-black text-xs font-bold rounded-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Track Progress</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
