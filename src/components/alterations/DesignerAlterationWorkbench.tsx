/**
 * @file DesignerAlterationWorkbench.tsx
 * Designer & Master Tailor Management Workbench for Alterations & Tailoring Requests.
 * Enables Atelier Directors and Tailors to:
 * - Review incoming alteration petitions across the 6-stage lifecycle:
 *   Submitted → Reviewed → Approved → In Alteration → Completed → Returned
 * - Inspect customer fit photographs & pin-point markers
 * - Adjust and confirm tailoring deltas
 * - Log chalk line specifications & artisan bench notes
 * - Upload finished "After Alteration" inspection proof photos
 * - Issue courier return dispatches
 */

import React, { useState } from 'react';
import {
  Scissors,
  Sparkles,
  CheckCircle2,
  Clock,
  Truck,
  Eye,
  Camera,
  Layers,
  ArrowRight,
  Filter,
  Search,
  Sliders,
  FileText,
  User,
  Plus,
  X,
  Upload,
} from 'lucide-react';
import { useAlterationStore } from '../../stores/alterationStore';
import { AlterationWorkflowStage, AlterationRequest } from '../../types/alteration.types';

const STAGE_ORDER: AlterationWorkflowStage[] = [
  'SUBMITTED',
  'REVIEWED',
  'APPROVED',
  'IN_ALTERATION',
  'COMPLETED',
  'RETURNED',
];

export const DesignerAlterationWorkbench: React.FC = () => {
  const {
    filteredRequests,
    countsByStage,
    stageFilter,
    setStageFilter,
    searchQuery,
    setSearchQuery,
    updateStage,
    advanceStage,
  } = useAlterationStore();

  const [selectedReq, setSelectedReq] = useState<AlterationRequest | null>(
    filteredRequests[0] || null
  );

  // Tailor action drawer state
  const [tailorNotesInput, setTailorNotesInput] = useState('');
  const [assignedTailorInput, setAssignedTailorInput] = useState('Master Tailor Henri Laurent');
  const [afterPhotoUrlInput, setAfterPhotoUrlInput] = useState(
    'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80'
  );
  const [actionSuccessToast, setActionSuccessToast] = useState('');

  const currentSelected = selectedReq
    ? filteredRequests.find((r) => r.id === selectedReq.id) || selectedReq
    : filteredRequests[0] || null;

  const handleAdvanceStage = async (reqId: string, nextStage: AlterationWorkflowStage) => {
    try {
      await updateStage(
        reqId,
        nextStage,
        tailorNotesInput || `Progressed to ${nextStage}`,
        assignedTailorInput,
        'MASTER_TAILOR',
        nextStage === 'COMPLETED' ? afterPhotoUrlInput : undefined
      );
      setTailorNotesInput('');
      setActionSuccessToast(`Request ${reqId} transitioned to ${nextStage}!`);
      setTimeout(() => setActionSuccessToast(''), 4000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error updating stage');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn font-mono text-left">
      {/* Toast Notification */}
      {actionSuccessToast && (
        <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-sm text-xs flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{actionSuccessToast}</span>
          </div>
          <button onClick={() => setActionSuccessToast('')}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#0E0E0E] border border-[#2B2B2B] p-5 rounded-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest">
              ATELIER WORKSHOP & CUTTING BENCH
            </span>
            <span className="text-[9px] px-2 py-0.5 rounded-2xs bg-amber-400/20 text-amber-300 font-bold uppercase">
              6-STAGE LIFECYCLE
            </span>
          </div>
          <h2 className="font-serif text-xl sm:text-2xl text-white uppercase font-bold tracking-wider mt-1 flex items-center gap-2">
            <Scissors className="w-5 h-5 text-amber-400" />
            <span>Bespoke Alterations & Tailoring Workbench</span>
          </h2>
          <p className="text-[11px] text-neutral-400 font-sans mt-0.5">
            Review customer fit photos, pin-point annotations, chalk line adjustments, and manage status transitions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-400">Total Dossiers:</span>
          <span className="px-3 py-1 bg-white text-black font-bold text-xs rounded-2xs">
            {filteredRequests.length}
          </span>
        </div>
      </div>

      {/* 6 Stage Kanban Counter Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {STAGE_ORDER.map((stg, idx) => {
          const isSelected = stageFilter === stg;
          const count = countsByStage[stg] || 0;
          return (
            <button
              key={stg}
              onClick={() => setStageFilter(isSelected ? 'ALL' : stg)}
              className={`p-3 rounded-sm border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-amber-400 text-black border-amber-300 shadow-md'
                  : 'bg-[#0E0E0E] border-[#2B2B2B] hover:border-neutral-500'
              }`}
            >
              <div className="flex items-center justify-between text-[9px] uppercase tracking-wider font-bold">
                <span className={isSelected ? 'text-black' : 'text-neutral-500'}>Stage {idx + 1}</span>
                <span className="font-mono text-xs">{count}</span>
              </div>
              <h4
                className={`font-serif text-xs font-bold uppercase mt-1 truncate ${
                  isSelected ? 'text-black' : 'text-white'
                }`}
              >
                {stg.replace(/_/g, ' ')}
              </h4>
            </button>
          );
        })}
      </div>

      {/* Two-Column Workbench Layout: Requests List + Detailed Inspection Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Requests List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              placeholder="Filter by customer, garment, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0E0E0E] border border-[#2B2B2B] rounded-sm pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
            />
          </div>

          <div className="space-y-2 max-h-[750px] overflow-y-auto pr-1">
            {filteredRequests.map((req) => {
              const isSelected = currentSelected?.id === req.id;
              const curIdx = STAGE_ORDER.indexOf(req.currentStage);

              return (
                <div
                  key={req.id}
                  onClick={() => setSelectedReq(req)}
                  className={`p-4 rounded-sm border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#151515] border-amber-400 shadow-md ring-1 ring-amber-400/30'
                      : 'bg-[#0E0E0E] border-[#2B2B2B] hover:border-neutral-600'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={req.primaryImageUrl}
                        alt={req.garmentName}
                        className="w-12 h-12 rounded-2xs object-cover border border-[#222]"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[9.5px] text-amber-400 font-bold uppercase tracking-widest">
                            {req.id}
                          </span>
                          <span className="text-[8.5px] px-1.5 py-0.2 rounded-2xs bg-amber-400/10 text-amber-300 font-bold uppercase">
                            {req.currentStage.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <h4 className="font-serif text-xs font-bold text-white uppercase truncate mt-0.5">
                          {req.garmentName}
                        </h4>
                        <p className="text-[10px] text-neutral-400 truncate">
                          Patron: {req.customerName}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[9px] text-neutral-500 pt-2 mt-2 border-t border-[#222]">
                    <span>{req.fitChanges.length} fit changes</span>
                    <span>{req.photos.length} photos</span>
                    <span className="text-amber-400 font-bold">Step {curIdx + 1}/6</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Tailor Dossier Inspector & Controls (7 cols) */}
        <div className="lg:col-span-7">
          {currentSelected ? (
            <div className="bg-[#0E0E0E] border border-[#2B2B2B] rounded-sm p-6 space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between pb-4 border-b border-[#222]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest">
                      DOSSIER #{currentSelected.id}
                    </span>
                    <span className="text-[9px] px-2 py-0.5 rounded-2xs bg-emerald-500/20 text-emerald-300 font-bold uppercase">
                      ● STAGE: {currentSelected.currentStage.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-white uppercase tracking-wider mt-1">
                    {currentSelected.garmentName}
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Client: <strong className="text-white">{currentSelected.customerName}</strong> • Serial: {currentSelected.garmentSerial}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[9.5px] text-neutral-500 uppercase block">Orig. Price</span>
                  <span className="text-sm font-bold text-white">
                    £{currentSelected.originalPriceGbp.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* 6-Stage Transition Controller Buttons */}
              <div className="bg-[#141414] border border-[#252525] p-4 rounded-sm space-y-3">
                <span className="text-[10px] text-amber-400 uppercase tracking-widest font-bold block">
                  Workflow Stage Controller (1-Click Transition)
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {STAGE_ORDER.map((stg, idx) => {
                    const isCurrent = currentSelected.currentStage === stg;
                    return (
                      <button
                        key={stg}
                        onClick={() => handleAdvanceStage(currentSelected.id, stg)}
                        className={`p-2 rounded-2xs border text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                          isCurrent
                            ? 'bg-amber-400 text-black border-amber-300 ring-2 ring-amber-400/20'
                            : 'bg-[#1C1C1C] text-neutral-300 border-[#333] hover:bg-neutral-800 hover:text-white'
                        }`}
                      >
                        <span>{idx + 1}. {stg.replace(/_/g, ' ')}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Chalk directives input */}
                <div className="space-y-1.5 pt-2 border-t border-[#222]">
                  <label className="text-[9.5px] text-neutral-400 uppercase tracking-wider block">
                    Master Tailor Chalk Directives & Seam Instructions
                  </label>
                  <textarea
                    rows={2}
                    value={tailorNotesInput}
                    onChange={(e) => setTailorNotesInput(e.target.value)}
                    placeholder="e.g. Suppressed 1.2cm waist seam. Checked collar balance on bust dummy..."
                    className="w-full bg-[#1A1A1A] border border-[#333] rounded-2xs p-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 font-sans"
                  />
                </div>
              </div>

              {/* Anatomical Fit Changes Breakdown */}
              <div className="space-y-3">
                <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold block">
                  Requested Anatomical Adjustments ({currentSelected.fitChanges.length})
                </span>

                <div className="space-y-2">
                  {currentSelected.fitChanges.map((fc, idx) => (
                    <div
                      key={fc.id || idx}
                      className="p-3 rounded-sm bg-[#141414] border border-[#252525] flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-xs">{fc.regionLabel}</span>
                          <span className="text-[9px] font-mono px-2 py-0.2 rounded-2xs bg-amber-400/10 text-amber-300 font-bold">
                            {fc.directionLabel} ({fc.deltaCm > 0 ? `+${fc.deltaCm}` : fc.deltaCm}cm)
                          </span>
                        </div>
                        <p className="text-[10px] text-neutral-400 font-sans mt-0.5">
                          {fc.issueDescription}
                        </p>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-bold font-mono">
                        ✓ Approved
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fitting Photos with Pins */}
              <div className="space-y-3">
                <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold block">
                  Client Fitting Photos & Pin-Point Markers ({currentSelected.photos.length})
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentSelected.photos.map((p, idx) => (
                    <div
                      key={p.id || idx}
                      className="relative aspect-4/3 rounded-sm overflow-hidden bg-black border border-[#252525]"
                    >
                      <img src={p.url} alt={p.caption} className="w-full h-full object-cover" />
                      {p.pinCoordinates?.map((pin, pIdx) => (
                        <div
                          key={pin.id || pIdx}
                          style={{ left: `${pin.xPercent}%`, top: `${pin.yPercent}%` }}
                          className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                        >
                          <div className="w-4 h-4 rounded-full bg-amber-400 text-black font-bold text-[9px] flex items-center justify-center border border-white">
                            {pIdx + 1}
                          </div>
                          <span className="bg-black/90 text-amber-300 text-[8px] font-mono px-1 py-0.2 rounded mt-0.5 border border-amber-400/40">
                            {pin.note}
                          </span>
                        </div>
                      ))}
                      <div className="absolute bottom-2 left-2 right-2 bg-black/85 p-1.5 rounded-2xs text-[9px] text-neutral-300 flex justify-between">
                        <span>{p.caption}</span>
                        <span className="text-amber-400 font-mono uppercase">{p.angle}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Courier & Delivery Reference */}
              <div className="p-3 rounded-sm bg-[#141414] border border-[#252525] flex items-center justify-between text-[10px]">
                <div>
                  <span className="text-neutral-500 uppercase block text-[9px]">White-Glove Courier:</span>
                  <span className="text-white font-bold">{currentSelected.courierServiceName || 'Private Valet'}</span>
                </div>
                <div>
                  <span className="text-neutral-500 uppercase block text-[9px]">Tracking Code:</span>
                  <span className="text-amber-400 font-mono font-bold">
                    {currentSelected.trackingNumber || 'MD-ALT-8841-GB'}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500 uppercase block text-[9px]">Lead Salon:</span>
                  <span className="text-neutral-300">{currentSelected.atelierBranch}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center rounded-sm bg-[#0E0E0E] border border-[#2B2B2B] text-neutral-500">
              Select an alteration dossier from the left list to inspect technical details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
