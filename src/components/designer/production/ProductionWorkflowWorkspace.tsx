/**
 * @file ProductionWorkflowWorkspace.tsx
 * Enterprise Production Workflow Module for fashion designers and bespoke ateliers.
 * Features 8-stage manufacturing timeline, stage transitions, progress bars,
 * stage craftsmanship notes, and live customer portal visibility synchronization.
 */

import React, { useState, useMemo } from 'react';
import {
  Flame,
  CheckCircle2,
  Clock,
  ArrowRight,
  User,
  Sliders,
  Eye,
  Lock,
  Plus,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Scissors,
  Layers,
  ShieldCheck,
  Package,
  Truck,
  Edit3,
  Calendar,
  Check,
  ChevronRight,
  Camera,
  Video,
} from 'lucide-react';
import { useProductionWorkflowStore, STAGE_NAMES_IN_ORDER } from '../../../stores/productionWorkflowStore';
import { useDesignerStore } from '../../../stores/designerStore';
import {
  OrderProductionWorkflow,
  ProductionStageName,
  WorkflowStage,
} from '../../../types/productionWorkflow.types';
import { UpdateStageModal } from './UpdateStageModal';
import { AddStageNoteModal } from './AddStageNoteModal';

const STAGE_ICONS: Record<ProductionStageName, React.ComponentType<{ className?: string }>> = {
  'Pattern Design': Sliders,
  'Fabric Selection': Layers,
  'Cutting': Scissors,
  'Sewing': Sparkles,
  'Finishing': Edit3,
  'Quality Control': ShieldCheck,
  'Packaging': Package,
  'Shipping': Truck,
};

export const ProductionWorkflowWorkspace: React.FC = () => {
  const {
    workflows,
    activeWorkflow,
    setActiveWorkflowId,
    updateStage,
    advanceToNextStage,
    addStageNote,
    toggleNoteVisibility,
    toggleMasterCustomerVisibility,
    resetToDefaults,
  } = useProductionWorkflowStore();
  const { setActiveSection } = useDesignerStore();

  const [selectedStageName, setSelectedStageName] = useState<ProductionStageName>(
    activeWorkflow.currentStage || 'Pattern Design'
  );

  const [activeViewMode, setActiveViewMode] = useState<'timeline' | 'customer_preview'>('timeline');

  // Modals state
  const [updateStageModalStage, setUpdateStageModalStage] = useState<WorkflowStage | null>(null);
  const [addNoteModalStageName, setAddNoteModalStageName] = useState<ProductionStageName | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Find the currently inspected stage within the active workflow
  const currentInspectedStage = useMemo(() => {
    return (
      activeWorkflow.stages.find((s) => s.stage === selectedStageName) ||
      activeWorkflow.stages[0]
    );
  }, [activeWorkflow, selectedStageName]);

  // KPIs
  const kpis = useMemo(() => {
    const totalJobs = workflows.length;
    const inCuttingOrSewing = workflows.filter((w) => ['Cutting', 'Sewing'].includes(w.currentStage)).length;
    const inQC = workflows.filter((w) => w.currentStage === 'Quality Control').length;
    const customerBroadcastingCount = workflows.filter((w) => w.customerVisibilityEnabled).length;
    const avgProgress = Math.round(
      workflows.reduce((acc, w) => acc + w.overallProgress, 0) / (totalJobs || 1)
    );
    return {
      totalJobs,
      inCuttingOrSewing,
      inQC,
      customerBroadcastingCount,
      avgProgress,
    };
  }, [workflows]);

  const currentStageIndex = STAGE_NAMES_IN_ORDER.indexOf(activeWorkflow.currentStage);
  const canAdvance = currentStageIndex < STAGE_NAMES_IN_ORDER.length - 1;
  const nextStageName = canAdvance ? STAGE_NAMES_IN_ORDER[currentStageIndex + 1] : null;

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#141414] border border-amber-500/50 text-white px-4 py-3 rounded-xs shadow-2xl flex items-center gap-2.5 text-xs font-mono">
          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. TOP KPI SHOP-FLOOR STRIP */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="p-3.5 bg-[#0E0E0E] border border-[#222] rounded-xs space-y-1">
          <span className="text-[10px] font-mono text-neutral-500 uppercase block">Active In Atelier</span>
          <span className="text-xl font-serif text-white font-bold">{kpis.totalJobs} Garments</span>
        </div>

        <div className="p-3.5 bg-[#0E0E0E] border border-[#222] rounded-xs space-y-1">
          <span className="text-[10px] font-mono text-amber-400 uppercase block">Cutting & Basting</span>
          <span className="text-xl font-serif text-amber-400 font-bold">{kpis.inCuttingOrSewing} Active</span>
        </div>

        <div className="p-3.5 bg-[#0E0E0E] border border-[#222] rounded-xs space-y-1">
          <span className="text-[10px] font-mono text-purple-400 uppercase block">QC Gate Check</span>
          <span className="text-xl font-serif text-purple-400 font-bold">{kpis.inQC} Pending</span>
        </div>

        <div className="p-3.5 bg-[#0E0E0E] border border-[#222] rounded-xs space-y-1">
          <span className="text-[10px] font-mono text-emerald-400 uppercase block">Customer Portal Stream</span>
          <span className="text-xl font-serif text-emerald-400 font-bold">{kpis.customerBroadcastingCount} Live</span>
        </div>

        <div className="p-3.5 bg-[#0E0E0E] border border-[#222] rounded-xs space-y-1">
          <span className="text-[10px] font-mono text-neutral-400 uppercase block">Avg Workshop Completion</span>
          <span className="text-xl font-serif text-white font-bold">{kpis.avgProgress}%</span>
        </div>
      </div>

      {/* 2. ORDER / WORKFLOW SELECTOR CAROUSEL */}
      <div className="p-4 bg-[#0E0E0E] border border-[#222] rounded-xs shadow-xl space-y-3">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-neutral-400 uppercase tracking-wider flex items-center gap-1.5 font-semibold">
            <Flame className="w-4 h-4 text-amber-400" />
            Active Production Job Queue
          </span>
          <button
            onClick={() => {
              if (confirm('Reset production workflows to factory demo state?')) {
                resetToDefaults();
                showToast('Workflows reset to defaults');
              }
            }}
            className="p-1.5 text-neutral-400 hover:text-white cursor-pointer"
            title="Reset workflows"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pt-1">
          {workflows.map((wf) => {
            const isSelected = wf.id === activeWorkflow.id;

            return (
              <button
                key={wf.id}
                onClick={() => {
                  setActiveWorkflowId(wf.id);
                  setSelectedStageName(wf.currentStage);
                }}
                className={`p-3 rounded-xs border text-left transition-all cursor-pointer flex items-center gap-3 shrink-0 ${
                  isSelected
                    ? 'border-amber-400 bg-amber-400/10 text-white shadow-lg shadow-amber-400/5'
                    : 'border-[#222] bg-[#141414] hover:border-neutral-500 text-neutral-400'
                }`}
              >
                <div className="w-10 h-10 rounded-xs overflow-hidden border border-[#333] bg-black shrink-0">
                  <img
                    src={wf.garmentThumbnail}
                    alt={wf.garmentName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-mono font-bold text-white">{wf.orderNumber}</span>
                    <span className="text-[10px] font-mono text-amber-400">({wf.overallProgress}%)</span>
                  </div>
                  <span className="text-[11px] font-serif text-neutral-300 block truncate max-w-[160px]">
                    {wf.garmentName}
                  </span>
                  <span className="text-[10px] font-mono text-neutral-500 block">
                    Stage: {wf.currentStage}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. ACTIVE WORKFLOW CONTROLLER HEADER */}
      <div className="p-6 bg-[#0E0E0E] border border-[#2B2B2B] rounded-xs shadow-xl space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-xs overflow-hidden border border-[#333] bg-black shrink-0">
              <img
                src={activeWorkflow.garmentThumbnail}
                alt={activeWorkflow.garmentName}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono font-bold text-amber-400">
                  {activeWorkflow.orderNumber}
                </span>
                <span className="px-2 py-0.2 bg-amber-400/10 border border-amber-500/30 text-[10px] font-mono text-amber-300 rounded-xs">
                  CURRENT STAGE: {activeWorkflow.currentStage.toUpperCase()}
                </span>
                {activeWorkflow.isRushOrder && (
                  <span className="px-1.5 py-0.2 bg-rose-950/70 border border-rose-800 text-[9px] font-mono text-rose-300 rounded-xs">
                    RUSH
                  </span>
                )}
              </div>
              <h1 className="text-lg sm:text-xl font-serif text-white uppercase tracking-wide mt-0.5">
                {activeWorkflow.garmentName}
              </h1>
              <p className="text-xs font-mono text-neutral-400">
                Client: <strong className="text-white">{activeWorkflow.customerName}</strong> • Target Finish:{' '}
                <strong className="text-neutral-200">
                  {new Date(activeWorkflow.estimatedFinishAt).toLocaleDateString()}
                </strong>
              </p>
            </div>
          </div>

          {/* Customer Visibility Toggle & Advance Stage Button */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Master Customer Visibility Toggle */}
            <button
              onClick={() => {
                toggleMasterCustomerVisibility(activeWorkflow.id);
                showToast(
                  activeWorkflow.customerVisibilityEnabled
                    ? 'Customer portal stream paused'
                    : 'Customer portal stream active'
                );
              }}
              className={`px-3 py-2 rounded-xs border text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors ${
                activeWorkflow.customerVisibilityEnabled
                  ? 'border-emerald-700/60 bg-emerald-950/30 text-emerald-300'
                  : 'border-[#333] bg-[#141414] text-neutral-500 hover:text-neutral-300'
              }`}
            >
              {activeWorkflow.customerVisibilityEnabled ? (
                <>
                  <Eye className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Client Stream: Live</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Client Stream: Hidden</span>
                </>
              )}
            </button>

            {/* Advance to Next Stage Button */}
            {canAdvance && nextStageName && (
              <button
                onClick={() => {
                  advanceToNextStage(activeWorkflow.id, `Milestone completed. Handed to ${nextStageName} team.`);
                  setSelectedStageName(nextStageName);
                  showToast(`Advanced to ${nextStageName}`);
                }}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-black text-xs font-mono uppercase font-bold tracking-wider rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-400/20"
              >
                <span>Advance to {nextStageName}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Overall Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-neutral-400 uppercase tracking-wider">
              Total Manufacturing Progress
            </span>
            <span className="text-amber-400 font-bold text-sm">
              {activeWorkflow.overallProgress}% Complete
            </span>
          </div>
          <div className="h-2 bg-[#1C1C1C] rounded-full overflow-hidden border border-[#2B2B2B]">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${activeWorkflow.overallProgress}%` }}
            />
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="pt-2 border-t border-[#1F1F1F] flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveViewMode('timeline')}
              className={`px-3 py-1.5 border-b-2 font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeViewMode === 'timeline'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              Atelier Timeline View
            </button>
            <button
              onClick={() => setActiveViewMode('customer_preview')}
              className={`px-3 py-1.5 border-b-2 font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeViewMode === 'customer_preview'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-emerald-400" />
              Customer Portal Live Preview
            </button>
          </div>
        </div>
      </div>

      {/* 4. MAIN CONTENT PANELS */}

      {/* VIEW A: INTERACTIVE ATELIER TIMELINE VIEW */}
      {activeViewMode === 'timeline' && (
        <div className="space-y-6">
          {/* Horizontal 8-Stage Timeline Stepper */}
          <div className="p-6 bg-[#0E0E0E] border border-[#222] rounded-xs shadow-xl overflow-x-auto no-scrollbar">
            <div className="flex items-center justify-between min-w-[950px] relative">
              {/* Background Connecting Rail */}
              <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-[#222] -translate-y-1/2 z-0" />

              {activeWorkflow.stages.map((stg) => {
                const IconComponent = STAGE_ICONS[stg.stage] || Clock;
                const isSelected = selectedStageName === stg.stage;
                const isCompleted = stg.status === 'Completed';
                const isInProgress = stg.status === 'In Progress';
                const isBlocked = stg.status === 'Blocked';

                return (
                  <div
                    key={stg.id}
                    onClick={() => setSelectedStageName(stg.stage)}
                    className="relative z-10 flex flex-col items-center group cursor-pointer"
                  >
                    {/* Circle Node */}
                    <div
                      className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                        isSelected
                          ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-black scale-110 shadow-lg shadow-amber-400/20'
                          : ''
                      } ${
                        isCompleted
                          ? 'bg-emerald-500 text-black font-bold'
                          : isInProgress
                          ? 'bg-amber-400 text-black font-bold animate-pulse'
                          : isBlocked
                          ? 'bg-rose-600 text-white font-bold'
                          : 'bg-[#181818] border border-[#333] text-neutral-500 hover:border-neutral-400'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-5 h-5 stroke-[2.5]" />
                      ) : (
                        <IconComponent className="w-4 h-4" />
                      )}
                    </div>

                    {/* Step Label */}
                    <div className="mt-2.5 text-center">
                      <span className="text-[10px] font-mono text-neutral-500 uppercase block">
                        0{stg.order}
                      </span>
                      <span
                        className={`text-xs font-mono font-medium block truncate max-w-[110px] ${
                          isSelected ? 'text-amber-400 font-bold' : 'text-neutral-300'
                        }`}
                      >
                        {stg.stage}
                      </span>
                      <span
                        className={`text-[9px] font-mono uppercase block ${
                          isCompleted
                            ? 'text-emerald-400'
                            : isInProgress
                            ? 'text-amber-400 font-bold'
                            : isBlocked
                            ? 'text-rose-400'
                            : 'text-neutral-600'
                        }`}
                      >
                        {stg.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Stage Detail & Artisan Control Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Stage Status, Progress, and Notes Thread */}
            <div className="lg:col-span-2 space-y-6">
              <div className="p-6 bg-[#0E0E0E] border border-[#222] rounded-xs shadow-xl space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1C1C1C] pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xs bg-[#1A1A1A] border border-[#333] flex items-center justify-center text-amber-400 font-mono font-bold">
                      0{currentInspectedStage.order}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-serif text-white uppercase tracking-wide">
                          {currentInspectedStage.stage}
                        </h2>
                        <span
                          className={`px-2 py-0.2 text-[9px] font-mono uppercase font-bold rounded-xs ${
                            currentInspectedStage.status === 'Completed'
                              ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800'
                              : currentInspectedStage.status === 'In Progress'
                              ? 'bg-amber-950/60 text-amber-300 border border-amber-800'
                              : 'bg-[#1C1C1C] text-neutral-400'
                          }`}
                        >
                          {currentInspectedStage.status}
                        </span>
                      </div>
                      <p className="text-[11px] font-mono text-neutral-400">
                        Assigned: {currentInspectedStage.assignedArtisan} ({currentInspectedStage.artisanRole})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveSection('videos')}
                      className="px-3 py-1.5 bg-[#1F1F1F] hover:bg-[#2A2A2A] border border-[#333] text-amber-300 text-xs font-mono uppercase rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                      title="Open Production Video Center"
                    >
                      <Video className="w-3.5 h-3.5 text-amber-400" />
                      Video Vault
                    </button>
                    <button
                      onClick={() => setUpdateStageModalStage(currentInspectedStage)}
                      className="px-3 py-1.5 bg-[#222] hover:bg-[#2C2C2C] border border-[#333] text-white text-xs font-mono uppercase rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                      Update Stage
                    </button>
                    <button
                      onClick={() => setAddNoteModalStageName(currentInspectedStage.stage)}
                      className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-black text-xs font-mono uppercase font-bold rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Note
                    </button>
                  </div>
                </div>

                {/* Sub-Progress Bar */}
                <div className="p-4 bg-[#141414] border border-[#222] rounded-xs space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-neutral-300">
                    <span>Stage Completion:</span>
                    <span className="text-amber-400 font-bold">
                      {currentInspectedStage.progress}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-[#222] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all duration-300"
                      style={{ width: `${currentInspectedStage.progress}%` }}
                    />
                  </div>
                </div>

                {/* Public Customer Narrative Preview */}
                <div className="p-4 bg-[#141414] border border-[#222] rounded-xs space-y-1.5">
                  <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" />
                    Customer Portal Narrative (Published to Client)
                  </span>
                  <p className="text-xs text-neutral-300 font-sans leading-relaxed">
                    "{currentInspectedStage.customerSummary}"
                  </p>
                </div>

                {/* Craftsmanship Notes & Photos Stream */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                    <span className="uppercase tracking-wider font-semibold">
                      Milestone Notes & Shop-Floor Photos ({currentInspectedStage.notes.length})
                    </span>
                    <span className="text-neutral-500">
                      Toggle eye icon to control client visibility
                    </span>
                  </div>

                  {currentInspectedStage.notes.length === 0 ? (
                    <div className="p-8 text-center bg-[#121212] rounded-xs border border-[#222] text-xs font-mono text-neutral-500">
                      No craftsmanship notes logged yet for {currentInspectedStage.stage}.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {currentInspectedStage.notes.map((note) => (
                        <div
                          key={note.id}
                          className="p-4 bg-[#141414] border border-[#222] rounded-xs space-y-2.5 transition-colors"
                        >
                          <div className="flex items-center justify-between text-xs font-mono">
                            <span className="text-white font-bold flex items-center gap-1.5">
                              <User className="w-3.5 h-3.5 text-amber-400" />
                              {note.artisanName}
                            </span>
                            <div className="flex items-center gap-3">
                              <span className="text-neutral-500 text-[10px]">
                                {new Date(note.timestamp).toLocaleString()}
                              </span>
                              {/* Direct Visibility Toggle Button */}
                              <button
                                onClick={() =>
                                  toggleNoteVisibility(
                                    activeWorkflow.id,
                                    currentInspectedStage.stage,
                                    note.id
                                  )
                                }
                                className={`px-2 py-0.5 rounded-xs border text-[10px] font-mono flex items-center gap-1 cursor-pointer transition-colors ${
                                  note.isCustomerVisible
                                    ? 'bg-emerald-950/60 border-emerald-700 text-emerald-300'
                                    : 'bg-[#1C1C1C] border-[#333] text-neutral-500'
                                }`}
                                title="Toggle customer visibility"
                              >
                                {note.isCustomerVisible ? (
                                  <>
                                    <Eye className="w-3 h-3 text-emerald-400" />
                                    <span>Client Visible</span>
                                  </>
                                ) : (
                                  <>
                                    <Lock className="w-3 h-3" />
                                    <span>Atelier Only</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>

                          <p className="text-xs text-neutral-200 font-sans leading-relaxed">
                            {note.text}
                          </p>

                          {/* Attached Photo */}
                          {note.photoUrl && (
                            <div className="mt-2 h-44 rounded-xs overflow-hidden border border-[#2B2B2B] bg-black">
                              <img
                                src={note.photoUrl}
                                alt="Craftsmanship proof"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right 1 Col: Production Schedule & Checklist */}
            <div className="space-y-6">
              <div className="p-6 bg-[#0E0E0E] border border-[#222] rounded-xs shadow-xl space-y-4">
                <h3 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Milestone Schedule Summary
                </h3>

                <div className="space-y-3 text-xs font-mono">
                  <div className="p-3 bg-[#141414] border border-[#222] rounded-xs space-y-1">
                    <span className="text-[10px] text-neutral-500 uppercase block">Total Stage Allocation</span>
                    <span className="text-white font-bold">{currentInspectedStage.estimatedDurationHours} Workshop Hours</span>
                  </div>

                  <div className="p-3 bg-[#141414] border border-[#222] rounded-xs space-y-1">
                    <span className="text-[10px] text-neutral-500 uppercase block">Started Timestamp</span>
                    <span className="text-neutral-300">
                      {currentInspectedStage.startedAt
                        ? new Date(currentInspectedStage.startedAt).toLocaleString()
                        : 'Not yet initiated'}
                    </span>
                  </div>

                  <div className="p-3 bg-[#141414] border border-[#222] rounded-xs space-y-1">
                    <span className="text-[10px] text-neutral-500 uppercase block">Completed Timestamp</span>
                    <span className="text-neutral-300">
                      {currentInspectedStage.completedAt
                        ? new Date(currentInspectedStage.completedAt).toLocaleString()
                        : 'In progress / pending'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quality Gate Card */}
              <div className="p-6 bg-[#0E0E0E] border border-amber-500/30 rounded-xs space-y-3">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  Atelier Craftsmanship Gate
                </div>
                <p className="text-[11px] text-neutral-400 font-sans leading-relaxed">
                  Stage completion requires artisan sign-off and millimeter tolerance checks before pattern blocks pass to assembly.
                </p>
                <div className="p-2.5 bg-[#141414] rounded-xs border border-[#222] text-xs font-mono text-neutral-300 flex justify-between">
                  <span>QC Integrity Score:</span>
                  <span className="text-emerald-400 font-bold">{activeWorkflow.qualityScore || 99.8}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW B: LIVE CUSTOMER PORTAL PREVIEW */}
      {activeViewMode === 'customer_preview' && (
        <div className="space-y-6">
          <div className="p-4 bg-emerald-950/30 border border-emerald-800/60 rounded-xs flex items-center justify-between text-xs font-mono text-emerald-300">
            <span className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-emerald-400" />
              Live Customer Tracking Stream View
            </span>
            <span>Customer: {activeWorkflow.customerName}</span>
          </div>

          {/* Client-Facing Tracking Container */}
          <div className="max-w-3xl mx-auto p-6 sm:p-10 bg-[#0A0A0A] border border-[#2B2B2B] rounded-xs shadow-2xl space-y-8">
            <div className="border-b border-[#222] pb-6 space-y-2">
              <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block">
                DANIELS ATELIER // CRAFTSMANSHIP JOURNAL
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-white uppercase tracking-wide">
                {activeWorkflow.garmentName}
              </h2>
              <div className="flex items-center justify-between text-xs font-mono text-neutral-400 pt-2">
                <span>Order Reference: {activeWorkflow.orderNumber}</span>
                <span className="text-amber-400 font-bold">{activeWorkflow.overallProgress}% Completed</span>
              </div>

              {/* Progress Bar */}
              <div className="h-2 bg-[#1C1C1C] rounded-full overflow-hidden mt-3">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${activeWorkflow.overallProgress}%` }}
                />
              </div>
            </div>

            {/* Public Milestones Stream */}
            <div className="space-y-8 relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#222]">
              {activeWorkflow.stages
                .filter((stg) => stg.status === 'Completed' || stg.status === 'In Progress')
                .map((stg) => (
                  <div key={stg.id} className="relative space-y-3">
                    <span
                      className={`absolute -left-6 top-1 w-4 h-4 rounded-full border-2 border-black flex items-center justify-center ${
                        stg.status === 'Completed' ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'
                      }`}
                    />

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-amber-400 uppercase font-semibold">
                          Stage {stg.order}: {stg.stage}
                        </span>
                        <span className="text-[10px] font-mono text-neutral-500">
                          ({stg.status})
                        </span>
                      </div>
                      <p className="text-sm text-neutral-200 font-serif mt-1 leading-relaxed">
                        {stg.customerSummary}
                      </p>
                    </div>

                    {/* Customer Visible Notes & Photos */}
                    <div className="space-y-3 pt-1">
                      {stg.notes
                        .filter((n) => n.isCustomerVisible)
                        .map((n) => (
                          <div
                            key={n.id}
                            className="p-4 bg-[#121212] border border-[#222] rounded-xs space-y-2 text-xs font-sans text-neutral-300"
                          >
                            <div className="flex justify-between text-[10px] font-mono text-neutral-500">
                              <span>Artisan: {n.artisanName}</span>
                              <span>{new Date(n.timestamp).toLocaleDateString()}</span>
                            </div>
                            <p className="leading-relaxed">{n.text}</p>
                            {n.photoUrl && (
                              <div className="h-56 rounded-xs overflow-hidden border border-[#2A2A2A] mt-2">
                                <img
                                  src={n.photoUrl}
                                  alt="Craft snapshot"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. MODALS */}
      <UpdateStageModal
        isOpen={Boolean(updateStageModalStage)}
        onClose={() => setUpdateStageModalStage(null)}
        stage={updateStageModalStage}
        onSave={(updates) => {
          if (updateStageModalStage) {
            updateStage(activeWorkflow.id, updateStageModalStage.stage, updates);
            showToast(`Updated ${updateStageModalStage.stage}`);
            setUpdateStageModalStage(null);
          }
        }}
      />

      <AddStageNoteModal
        isOpen={Boolean(addNoteModalStageName)}
        onClose={() => setAddNoteModalStageName(null)}
        stageName={addNoteModalStageName || 'Pattern Design'}
        onSave={(note) => {
          if (addNoteModalStageName) {
            addStageNote(activeWorkflow.id, addNoteModalStageName, note);
            showToast('Craftsmanship note recorded');
            setAddNoteModalStageName(null);
          }
        }}
      />
    </div>
  );
};
