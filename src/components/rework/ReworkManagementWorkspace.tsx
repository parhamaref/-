/**
 * @file ReworkManagementWorkspace.tsx
 * Master Enterprise Cockpit for Daniel’s Maison Rework Management Workflow.
 * 
 * Features:
 * - Create Rework Request
 * - Assign Rework Tasks
 * - Defect Tracking
 * - Corrective Action Tracking
 * - Reinspection Process
 * 
 * Workflow Stages:
 * QC Failed -> Rework Assigned -> Rework In Progress -> Reinspection -> Approved
 */

import React, { useState } from 'react';
import {
  RotateCcw,
  Users,
  AlertTriangle,
  Wrench,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Award,
  Search,
  Filter,
  Plus,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Calendar,
  Layers,
  Camera,
  FileText,
  Percent,
  Check,
  Building,
  User,
  History,
  TrendingUp,
  XCircle,
  ExternalLink,
} from 'lucide-react';
import { useReworkStore, ReworkActiveTab } from '../../stores/reworkStore';
import { ReworkStatus, ReworkRequest, ReworkPriority } from '../../types/rework.types';
import { CreateReworkModal } from './CreateReworkModal';
import { AssignReworkModal } from './AssignReworkModal';
import { TaskProgressModal } from './TaskProgressModal';
import { ReinspectionModal } from './ReinspectionModal';
import { ReworkCertificateModal } from './ReworkCertificateModal';

const WORKFLOW_STEPS: { id: ReworkStatus; label: string; icon: React.ElementType; description: string }[] = [
  { id: 'QC Failed', label: 'QC Failed', icon: XCircle, description: 'Inspection non-conformance logged' },
  { id: 'Rework Assigned', label: 'Rework Assigned', icon: Users, description: 'Tailor & tasks dispatched' },
  { id: 'Rework In Progress', label: 'In Progress', icon: Wrench, description: 'Bench alteration active' },
  { id: 'Reinspection', label: 'Reinspection', icon: ShieldCheck, description: 'QC chamber verification' },
  { id: 'Approved', label: 'Approved', icon: Award, description: 'Accreditation seal stamped' },
];

export const ReworkManagementWorkspace: React.FC = () => {
  const {
    requests,
    activeRequest,
    activeRequestId,
    statusFilter,
    searchQuery,
    activeTab,
    metrics,
    notification,
    setActiveRequestId,
    setStatusFilter,
    setSearchQuery,
    setActiveTab,
    setSelectedTaskId,
    setModalOpen,
    startRework,
    submitForReinspection,
    resetToMock,
  } = useReworkStore();

  const [submitNotes, setSubmitNotes] = useState('All remedial alterations verified on bench. Passed 5kg tension test.');
  const [showSubmitPrompt, setShowSubmitPrompt] = useState(false);

  // Filter requests
  const filteredRequests = requests.filter((r) => {
    if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchClient = r.clientName.toLowerCase().includes(q);
      const matchOrder = r.orderId.toLowerCase().includes(q);
      const matchGarment = r.garmentName.toLowerCase().includes(q);
      const matchTailor = (r.assignedTailor || '').toLowerCase().includes(q);
      const matchId = r.id.toLowerCase().includes(q);
      if (!matchClient && !matchOrder && !matchGarment && !matchTailor && !matchId) return false;
    }
    return true;
  });

  const getStepIndex = (status: ReworkStatus): number => {
    switch (status) {
      case 'QC Failed':
        return 0;
      case 'Rework Assigned':
        return 1;
      case 'Rework In Progress':
        return 2;
      case 'Reinspection':
        return 3;
      case 'Approved':
        return 4;
      default:
        return 0;
    }
  };

  const currentStepIndex = activeRequest ? getStepIndex(activeRequest.status) : 0;

  const handleOpenTaskModal = (taskId: string) => {
    setSelectedTaskId(taskId);
    setModalOpen('task', true);
  };

  const handleStartReworkDirect = () => {
    if (!activeRequest) return;
    startRework(activeRequest.id, activeRequest.assignedTailor || 'Master Tailor');
  };

  const handleSubmitReinspectionDirect = () => {
    if (!activeRequest) return;
    submitForReinspection(activeRequest.id, activeRequest.assignedTailor || 'Master Tailor', submitNotes);
    setShowSubmitPrompt(false);
  };

  return (
    <div className="flex flex-col flex-1 h-full min-h-screen bg-[#070707] text-neutral-100 font-sans select-none overflow-x-hidden">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl border shadow-2xl flex items-center gap-3 backdrop-blur-md transition animate-in slide-in-from-top-4 ${
            notification.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-700/80 text-emerald-200'
              : notification.type === 'error'
              ? 'bg-rose-950/90 border-rose-700/80 text-rose-200'
              : 'bg-neutral-900/90 border-neutral-700 text-neutral-200'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
          )}
          <span className="text-xs font-mono">{notification.message}</span>
        </div>
      )}

      {/* Header Bar */}
      <header className="px-6 py-4 border-b border-neutral-800/80 bg-[#0a0a0a]/90 backdrop-blur-md flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-950 to-neutral-900 border border-amber-800/50 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-950/30">
            <RotateCcw className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-[10px] font-mono tracking-widest uppercase text-amber-500 font-semibold">
                Daniel’s Maison Atelier Workshop
              </span>
              <span className="text-neutral-600">·</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/60 border border-amber-800/50 text-amber-300">
                5-Stage Workflow Gate
              </span>
            </div>
            <h1 className="text-xl font-serif text-neutral-100 tracking-wide mt-0.5">
              Rework Management & Remediation Engine
            </h1>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={resetToMock}
            title="Reset to initial curated demo dataset"
            className="px-3 py-2 rounded-lg text-xs font-mono text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900 border border-neutral-800/80 transition flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Demo
          </button>
          <button
            onClick={() => setModalOpen('create', true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-neutral-950 font-medium text-xs font-mono tracking-wider uppercase transition shadow-md shadow-amber-950/30"
          >
            <Plus className="w-4 h-4" /> Commission Rework
          </button>
        </div>
      </header>

      {/* 5-Stage Interactive Workflow Stepper Ribbon */}
      <section className="px-6 py-3 bg-[#0d0d0d] border-b border-neutral-800/80">
        <div className="flex items-center justify-between mb-2">
          <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider flex items-center gap-2">
            <span>Official Remediation Pipeline</span>
            <span className="text-neutral-600">/</span>
            <span className="text-neutral-300 font-medium">Click any stage to filter active inventory</span>
          </div>
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`text-[11px] font-mono px-2.5 py-0.5 rounded transition ${
              statusFilter === 'ALL'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            Show All ({metrics.total})
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {WORKFLOW_STEPS.map((step, idx) => {
            const count = requests.filter((r) => r.status === step.id).length;
            const isFilterActive = statusFilter === step.id;
            const Icon = step.icon;

            const stageStyles: Record<ReworkStatus, { border: string; text: string; bg: string }> = {
              'QC Failed': { border: 'border-rose-900/60', text: 'text-rose-400', bg: 'hover:bg-rose-950/20' },
              'Rework Assigned': { border: 'border-amber-900/60', text: 'text-amber-400', bg: 'hover:bg-amber-950/20' },
              'Rework In Progress': { border: 'border-blue-900/60', text: 'text-blue-400', bg: 'hover:bg-blue-950/20' },
              'Reinspection': { border: 'border-purple-900/60', text: 'text-purple-400', bg: 'hover:bg-purple-950/20' },
              'Approved': { border: 'border-emerald-900/60', text: 'text-emerald-400', bg: 'hover:bg-emerald-950/20' },
            };

            const style = stageStyles[step.id];

            return (
              <button
                key={step.id}
                onClick={() => setStatusFilter(isFilterActive ? 'ALL' : step.id)}
                className={`text-left p-3 rounded-lg border transition relative overflow-hidden ${
                  isFilterActive
                    ? `border-amber-500 bg-amber-950/30 shadow-md shadow-amber-950/30`
                    : `border-neutral-800 bg-[#0a0a0a] ${style.bg}`
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono text-neutral-500">0{idx + 1}</span>
                    <Icon className={`w-3.5 h-3.5 ${style.text}`} />
                  </div>
                  <span
                    className={`text-xs font-mono font-bold px-1.5 py-0.2 rounded ${
                      count > 0 ? 'bg-neutral-800 text-neutral-100' : 'text-neutral-600'
                    }`}
                  >
                    {count}
                  </span>
                </div>
                <div className="text-xs font-serif font-medium text-neutral-200 truncate">{step.label}</div>
                <div className="text-[10px] text-neutral-500 truncate mt-0.5">{step.description}</div>
              </button>
            );
          })}
        </div>
      </section>

      {/* KPI Metrics Strip */}
      <section className="px-6 py-3 border-b border-neutral-800/80 bg-[#090909] grid grid-cols-2 md:grid-cols-6 gap-3">
        <div className="bg-neutral-950 border border-neutral-800/80 rounded-lg p-2.5">
          <span className="text-[10px] font-mono uppercase text-neutral-500 block">Active Reworks</span>
          <span className="text-lg font-mono font-bold text-amber-400">{metrics.total - metrics.approved}</span>
        </div>
        <div className="bg-neutral-950 border border-neutral-800/80 rounded-lg p-2.5">
          <span className="text-[10px] font-mono uppercase text-neutral-500 block">Awaiting Assignment</span>
          <span className="text-lg font-mono font-bold text-rose-400">{metrics.qcFailed}</span>
        </div>
        <div className="bg-neutral-950 border border-neutral-800/80 rounded-lg p-2.5">
          <span className="text-[10px] font-mono uppercase text-neutral-500 block">Active on Bench</span>
          <span className="text-lg font-mono font-bold text-blue-400">{metrics.inProgress}</span>
        </div>
        <div className="bg-neutral-950 border border-neutral-800/80 rounded-lg p-2.5">
          <span className="text-[10px] font-mono uppercase text-neutral-500 block">In Reinspection</span>
          <span className="text-lg font-mono font-bold text-purple-400">{metrics.reinspection}</span>
        </div>
        <div className="bg-neutral-950 border border-neutral-800/80 rounded-lg p-2.5">
          <span className="text-[10px] font-mono uppercase text-neutral-500 block">First-Time Fix Rate</span>
          <span className="text-lg font-mono font-bold text-emerald-400">{metrics.firstTimeFixRate}%</span>
        </div>
        <div className="bg-neutral-950 border border-neutral-800/80 rounded-lg p-2.5">
          <span className="text-[10px] font-mono uppercase text-neutral-500 block">Avg Turnaround</span>
          <span className="text-lg font-mono font-bold text-neutral-200">{metrics.avgTurnaroundHours}h</span>
        </div>
      </section>

      {/* Main Workspace Split Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Pane: Requests List */}
        <aside className="w-full lg:w-80 border-r border-neutral-800/80 bg-[#0a0a0a] flex flex-col shrink-0">
          {/* Search & Filter Header */}
          <div className="p-3 border-b border-neutral-800/80 space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search orders, tailors, clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-600"
              />
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500">
              <span>{filteredRequests.length} garments in queue</span>
              {statusFilter !== 'ALL' && (
                <button
                  onClick={() => setStatusFilter('ALL')}
                  className="text-amber-400 hover:underline text-[10px]"
                >
                  Clear filter
                </button>
              )}
            </div>
          </div>

          {/* Request List Items */}
          <div className="flex-1 overflow-y-auto divide-y divide-neutral-900">
            {filteredRequests.length === 0 ? (
              <div className="p-8 text-center text-neutral-500 text-xs">
                No rework requests match the selected criteria.
              </div>
            ) : (
              filteredRequests.map((req) => {
                const isSelected = req.id === activeRequestId;
                const statusColor =
                  req.status === 'Approved'
                    ? 'text-emerald-400 border-emerald-800/40 bg-emerald-950/20'
                    : req.status === 'Reinspection'
                    ? 'text-purple-400 border-purple-800/40 bg-purple-950/20'
                    : req.status === 'Rework In Progress'
                    ? 'text-blue-400 border-blue-800/40 bg-blue-950/20'
                    : req.status === 'Rework Assigned'
                    ? 'text-amber-400 border-amber-800/40 bg-amber-950/20'
                    : 'text-rose-400 border-rose-800/40 bg-rose-950/20';

                return (
                  <div
                    key={req.id}
                    onClick={() => setActiveRequestId(req.id)}
                    className={`p-3.5 cursor-pointer transition flex flex-col gap-1.5 ${
                      isSelected
                        ? 'bg-amber-950/25 border-l-2 border-l-amber-500'
                        : 'hover:bg-neutral-900/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-neutral-400 font-semibold">{req.orderId}</span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${statusColor}`}>
                        {req.status}
                      </span>
                    </div>

                    <div className="text-xs font-medium text-neutral-100 line-clamp-1">{req.garmentName}</div>
                    <div className="text-[11px] text-neutral-400 truncate">{req.clientName}</div>

                    <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-neutral-500">
                      <span>{req.defects.length} defect(s)</span>
                      <span>{req.assignedTailor ? req.assignedTailor.split(' ')[0] : 'Unassigned'}</span>
                      <span className="text-amber-500">{req.priority.split(' ')[0]}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </aside>

        {/* Right Pane: Comprehensive Active Request Cockpit */}
        <main className="flex-1 flex flex-col bg-[#070707] overflow-y-auto">
          {activeRequest ? (
            <>
              {/* Cockpit Top Hero Bar */}
              <div className="p-6 border-b border-neutral-800/80 bg-gradient-to-b from-[#0e0e0e] to-[#070707]">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">
                        {activeRequest.id}
                      </span>
                      <span className="text-neutral-600">·</span>
                      <span className="text-xs font-mono text-neutral-400">Order: {activeRequest.orderId}</span>
                      <span className="text-neutral-600">·</span>
                      <span className="text-xs font-serif text-amber-300">£{activeRequest.orderTotal.toLocaleString()}</span>
                    </div>
                    <h2 className="text-2xl font-serif text-neutral-100 tracking-wide">{activeRequest.garmentName}</h2>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Client: <span className="text-neutral-200 font-medium">{activeRequest.clientName}</span> ·{' '}
                      {activeRequest.garmentSilhouette}
                    </p>
                  </div>

                  {/* Primary Next Action Button */}
                  <div className="flex items-center gap-3">
                    {activeRequest.status === 'QC Failed' && (
                      <button
                        onClick={() => setModalOpen('assign', true)}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-neutral-950 font-medium text-xs font-mono tracking-wider uppercase transition shadow-lg shadow-amber-950/40"
                      >
                        <Users className="w-4 h-4" /> Assign Rework Tasks <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {activeRequest.status === 'Rework Assigned' && (
                      <button
                        onClick={handleStartReworkDirect}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs font-mono tracking-wider uppercase transition shadow-lg shadow-blue-950/40"
                      >
                        <Wrench className="w-4 h-4" /> Start Bench Work <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {activeRequest.status === 'Rework In Progress' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setShowSubmitPrompt(!showSubmitPrompt)}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs font-mono tracking-wider uppercase transition shadow-lg shadow-purple-950/40"
                        >
                          <ShieldCheck className="w-4 h-4" /> Submit for Reinspection <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {activeRequest.status === 'Reinspection' && (
                      <button
                        onClick={() => setModalOpen('reinspection', true)}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-neutral-950 font-bold text-xs font-mono tracking-wider uppercase transition shadow-lg shadow-emerald-950/40"
                      >
                        <Award className="w-4 h-4" /> Open Reinspection Chamber & Verdict <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {activeRequest.status === 'Approved' && (
                      <button
                        onClick={() => setModalOpen('certificate', true)}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-neutral-950 font-bold text-xs font-mono tracking-wider uppercase transition shadow-lg shadow-amber-950/40"
                      >
                        <Award className="w-4 h-4" /> View Haute Couture Certificate
                      </button>
                    )}
                  </div>
                </div>

                {/* Submit for Reinspection Expandable Prompt */}
                {showSubmitPrompt && activeRequest.status === 'Rework In Progress' && (
                  <div className="bg-neutral-950 border border-purple-800/60 rounded-xl p-4 mb-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-purple-300 font-semibold uppercase">
                        Confirm Hand-off to QC Master Chamber
                      </span>
                      <button
                        onClick={() => setShowSubmitPrompt(false)}
                        className="text-neutral-500 hover:text-neutral-300 text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                    <textarea
                      rows={2}
                      value={submitNotes}
                      onChange={(e) => setSubmitNotes(e.target.value)}
                      placeholder="Tailor bench sign-off notes..."
                      className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-1.5 text-xs text-neutral-200"
                    />
                    <div className="flex justify-end">
                      <button
                        onClick={handleSubmitReinspectionDirect}
                        className="px-4 py-2 rounded bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono uppercase tracking-wider font-semibold transition"
                      >
                        Dispatch Piece to Reinspection Chamber
                      </button>
                    </div>
                  </div>
                )}

                {/* 5-Stage Visual Progression Timeline */}
                <div className="relative pt-4 pb-2">
                  <div className="absolute top-8 left-6 right-6 h-0.5 bg-neutral-800 -z-0" />
                  <div
                    className="absolute top-8 left-6 h-0.5 bg-amber-500 transition-all duration-500 -z-0"
                    style={{ width: `${(currentStepIndex / 4) * 100}%` }}
                  />

                  <div className="grid grid-cols-5 gap-2 relative z-10">
                    {WORKFLOW_STEPS.map((step, idx) => {
                      const isPast = idx < currentStepIndex;
                      const isCurrent = idx === currentStepIndex;
                      const Icon = step.icon;

                      return (
                        <div key={step.id} className="flex flex-col items-center text-center">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center transition border-2 ${
                              isCurrent
                                ? 'bg-amber-600 border-amber-300 text-neutral-950 shadow-lg shadow-amber-950/60 ring-4 ring-amber-500/20'
                                : isPast
                                ? 'bg-emerald-950 border-emerald-500 text-emerald-400'
                                : 'bg-neutral-900 border-neutral-700 text-neutral-500'
                            }`}
                          >
                            {isPast ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                          </div>
                          <span
                            className={`text-[11px] font-mono mt-2 ${
                              isCurrent
                                ? 'text-amber-400 font-bold'
                                : isPast
                                ? 'text-neutral-300'
                                : 'text-neutral-500'
                            }`}
                          >
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="px-6 border-b border-neutral-800/80 bg-[#0a0a0a] flex items-center gap-1 overflow-x-auto">
                {(
                  [
                    { id: 'overview', label: 'Overview & SLA', icon: Clock },
                    { id: 'defects', label: `Defect Tracking (${activeRequest.defects.length})`, icon: AlertTriangle },
                    { id: 'tasks', label: `Remedial Tasks (${activeRequest.tasks.length})`, icon: Wrench },
                    { id: 'reinspection', label: `Reinspection Chamber (${activeRequest.reinspectionChecks.length})`, icon: ShieldCheck },
                    { id: 'history', label: `Audit Trail (${activeRequest.history.length})`, icon: History },
                  ] as const
                ).map((tab) => {
                  const isActive = activeTab === tab.id;
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as ReworkActiveTab)}
                      className={`flex items-center gap-2 px-4 py-3 text-xs font-mono tracking-wider transition border-b-2 whitespace-nowrap ${
                        isActive
                          ? 'border-amber-500 text-amber-300 font-semibold'
                          : 'border-transparent text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" /> {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Tab Content Display */}
              <div className="p-6 flex-1 space-y-6">
                {/* TAB 1: OVERVIEW */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Failed Reason Alert Box */}
                    <div className="bg-rose-950/20 border border-rose-900/40 rounded-xl p-4 flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <div className="text-xs font-mono uppercase tracking-wider text-rose-300 font-semibold">
                          Original Quality Failure Summary
                        </div>
                        <p className="text-xs text-neutral-300 leading-relaxed">{activeRequest.failedReason}</p>
                        <div className="flex items-center gap-4 pt-1 text-[10px] font-mono text-neutral-400">
                          <span>Audited by {activeRequest.leadInspector} ({activeRequest.leadInspectorBadge})</span>
                          <span>·</span>
                          <span>Failed on {activeRequest.failedDate}</span>
                        </div>
                      </div>
                    </div>

                    {/* Rework Parameters Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-neutral-950 border border-neutral-800/80 rounded-xl p-4 space-y-2">
                        <span className="text-[10px] font-mono text-neutral-500 uppercase block">Assigned Tailor</span>
                        <div className="text-base font-serif text-neutral-100">
                          {activeRequest.assignedTailor || 'Pending Assignment'}
                        </div>
                        <div className="text-xs text-neutral-400">
                          {activeRequest.assignedWorkshop || 'Atelier Assignment Required'}
                        </div>
                      </div>

                      <div className="bg-neutral-950 border border-neutral-800/80 rounded-xl p-4 space-y-2">
                        <span className="text-[10px] font-mono text-neutral-500 uppercase block">SLA Priority Class</span>
                        <div className="text-base font-mono font-bold text-amber-400">{activeRequest.priority}</div>
                        <div className="text-xs text-neutral-400">
                          Target: {new Date(activeRequest.targetSlaDeadline).toLocaleString()}
                        </div>
                      </div>

                      <div className="bg-neutral-950 border border-neutral-800/80 rounded-xl p-4 space-y-2">
                        <span className="text-[10px] font-mono text-neutral-500 uppercase block">Remediation Completion</span>
                        <div className="text-base font-mono font-bold text-emerald-400">
                          {activeRequest.tasks.length > 0
                            ? Math.round(
                                (activeRequest.tasks.filter((t) => t.status === 'Completed' || t.status === 'Verified')
                                  .length /
                                  activeRequest.tasks.length) *
                                  100
                              )
                            : 0}
                          %
                        </div>
                        <div className="text-xs text-neutral-400">
                          {activeRequest.tasks.filter((t) => t.status === 'Completed' || t.status === 'Verified').length} of{' '}
                          {activeRequest.tasks.length} tasks finished
                        </div>
                      </div>
                    </div>

                    {/* Reinspection Verdict Box if approved */}
                    {activeRequest.reinspectionVerdict && (
                      <div className="bg-emerald-950/20 border border-emerald-800/40 rounded-xl p-5 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-emerald-400">
                            <Award className="w-5 h-5" />
                            <span className="text-sm font-serif font-bold uppercase tracking-wider">
                              Haute Couture Reinspection Approved
                            </span>
                          </div>
                          <button
                            onClick={() => setModalOpen('certificate', true)}
                            className="text-xs font-mono text-amber-400 hover:underline flex items-center gap-1"
                          >
                            View Certificate <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="text-xs text-neutral-300 leading-relaxed">
                          {activeRequest.reinspectionVerdict.notes}
                        </p>
                        <div className="flex items-center gap-4 text-[10px] font-mono text-neutral-400">
                          <span>Certified by {activeRequest.reinspectionVerdict.reinspectedBy}</span>
                          <span>·</span>
                          <span>Cert: {activeRequest.reinspectionVerdict.certificateNumber}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 2: DEFECT TRACKING */}
                {activeTab === 'defects' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
                        Tracked Non-Conformances ({activeRequest.defects.length})
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {activeRequest.defects.map((defect) => {
                        const sevColor =
                          defect.severity === 'Critical'
                            ? 'text-rose-400 bg-rose-950/60 border-rose-800'
                            : defect.severity === 'Major'
                            ? 'text-amber-400 bg-amber-950/60 border-amber-800'
                            : 'text-neutral-300 bg-neutral-900 border-neutral-700';

                        const remColor =
                          defect.remediationStatus === 'Verified'
                            ? 'text-emerald-400 border-emerald-800/50 bg-emerald-950/20'
                            : defect.remediationStatus === 'Resolved'
                            ? 'text-blue-400 border-blue-800/50 bg-blue-950/20'
                            : defect.remediationStatus === 'Remediating'
                            ? 'text-amber-400 border-amber-800/50 bg-amber-950/20'
                            : 'text-rose-400 border-rose-800/50 bg-rose-950/20';

                        return (
                          <div
                            key={defect.id}
                            className="bg-neutral-950 border border-neutral-800/80 rounded-xl p-4 flex flex-col justify-between gap-3 shadow-lg"
                          >
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-mono text-amber-400 font-bold">{defect.defectCode}</span>
                                <div className="flex items-center gap-2">
                                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${sevColor}`}>
                                    {defect.severity}
                                  </span>
                                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${remColor}`}>
                                    {defect.remediationStatus}
                                  </span>
                                </div>
                              </div>

                              <div className="text-sm font-medium text-neutral-200">{defect.location}</div>
                              <p className="text-xs text-neutral-400 leading-relaxed">{defect.description}</p>
                            </div>

                            {defect.photoUrl && (
                              <div className="relative group overflow-hidden rounded-lg border border-neutral-800">
                                <img
                                  src={defect.photoUrl}
                                  alt={defect.location}
                                  className="w-full h-32 object-cover transition group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                  <span className="text-[10px] font-mono text-neutral-200 bg-black/80 px-2 py-1 rounded">
                                    QC Macro Photo
                                  </span>
                                </div>
                              </div>
                            )}

                            <div className="pt-2 border-t border-neutral-900 flex items-center justify-between text-[10px] font-mono text-neutral-500">
                              <span>Detected: {new Date(defect.detectedAt).toLocaleDateString()}</span>
                              <span>By {defect.detectedBy}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* TAB 3: REMEDIAL TASKS & CORRECTIVE ACTIONS */}
                {activeTab === 'tasks' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
                        Assigned Tailor Bench Tasks ({activeRequest.tasks.length})
                      </div>
                      {activeRequest.status === 'QC Failed' && (
                        <button
                          onClick={() => setModalOpen('assign', true)}
                          className="text-xs font-mono text-amber-400 hover:underline"
                        >
                          + Assign Tasks
                        </button>
                      )}
                    </div>

                    {activeRequest.tasks.length === 0 ? (
                      <div className="p-8 border border-neutral-800/80 rounded-xl bg-neutral-950 text-center space-y-3">
                        <Wrench className="w-8 h-8 text-neutral-600 mx-auto" />
                        <div className="text-sm font-medium text-neutral-300">No remedial tasks assigned yet</div>
                        <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                          Click "Assign Rework Tasks" to assign a specialist tailor and generate concrete remedial needlework tasks.
                        </p>
                        <button
                          onClick={() => setModalOpen('assign', true)}
                          className="px-4 py-2 rounded-lg bg-amber-600 text-neutral-950 text-xs font-mono uppercase font-semibold"
                        >
                          Assign Rework Tasks
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {activeRequest.tasks.map((task) => {
                          const isDone = task.status === 'Completed' || task.status === 'Verified';

                          return (
                            <div
                              key={task.id}
                              className="bg-neutral-950 border border-neutral-800/80 rounded-xl p-5 space-y-4 shadow-lg"
                            >
                              <div className="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-900 text-amber-400 border border-neutral-800">
                                      {task.category}
                                    </span>
                                    <span className="text-[10px] font-mono text-neutral-500">
                                      Priority: {task.priority}
                                    </span>
                                  </div>
                                  <h3 className="text-base font-serif text-neutral-100">{task.title}</h3>
                                  <p className="text-xs text-neutral-400 mt-0.5">{task.correctiveActionDetail}</p>
                                </div>

                                <div className="flex items-center gap-3">
                                  <span
                                    className={`text-xs font-mono px-2.5 py-1 rounded border ${
                                      isDone
                                        ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                                        : 'bg-amber-950/60 border-amber-800 text-amber-300'
                                    }`}
                                  >
                                    {task.status} ({task.progressPercent}%)
                                  </span>

                                  <button
                                    onClick={() => handleOpenTaskModal(task.id)}
                                    className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-xs font-mono text-neutral-200 border border-neutral-700 transition"
                                  >
                                    Log Progress
                                  </button>
                                </div>
                              </div>

                              {/* Progress Bar */}
                              <div>
                                <div className="flex justify-between text-[10px] font-mono text-neutral-500 mb-1">
                                  <span>Progress: {task.progressPercent}%</span>
                                  <span>
                                    Time: {task.actualHours}h actual / {task.estimatedHours}h est
                                  </span>
                                </div>
                                <div className="w-full bg-neutral-900 rounded-full h-2 overflow-hidden">
                                  <div
                                    className={`h-full transition-all duration-500 ${
                                      isDone ? 'bg-emerald-500' : 'bg-amber-500'
                                    }`}
                                    style={{ width: `${task.progressPercent}%` }}
                                  />
                                </div>
                              </div>

                              {/* Tailor Observations & Before/After Photos */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-neutral-900 text-xs">
                                <div>
                                  <span className="text-[10px] font-mono uppercase text-neutral-500 block mb-1">
                                    Tailor Bench Notes ({task.assignedTailor})
                                  </span>
                                  <p className="text-neutral-300 text-xs italic">
                                    {task.tailorNotes || 'No progress notes logged yet.'}
                                  </p>
                                </div>

                                {(task.beforePhotoUrl || task.afterPhotoUrl) && (
                                  <div className="flex items-center gap-3">
                                    {task.beforePhotoUrl && (
                                      <div className="flex-1">
                                        <span className="text-[9px] font-mono uppercase text-neutral-500 block mb-0.5">
                                          Before Remediation
                                        </span>
                                        <img
                                          src={task.beforePhotoUrl}
                                          alt="Before"
                                          className="h-16 w-full object-cover rounded border border-neutral-800"
                                        />
                                      </div>
                                    )}
                                    {task.afterPhotoUrl && (
                                      <div className="flex-1">
                                        <span className="text-[9px] font-mono uppercase text-emerald-400 block mb-0.5">
                                          After Remediation
                                        </span>
                                        <img
                                          src={task.afterPhotoUrl}
                                          alt="After"
                                          className="h-16 w-full object-cover rounded border border-emerald-900/60"
                                        />
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 4: REINSPECTION PROCESS */}
                {activeTab === 'reinspection' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-serif text-neutral-100">QC Chamber Reinspection Bench</h3>
                        <p className="text-xs text-neutral-400">
                          Verification of tolerances, millimeter measurements, and surface finishes
                        </p>
                      </div>

                      <button
                        onClick={() => setModalOpen('reinspection', true)}
                        className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-neutral-950 font-bold text-xs font-mono uppercase tracking-wider transition"
                      >
                        Launch Reinspection Bench
                      </button>
                    </div>

                    <div className="space-y-3">
                      {activeRequest.reinspectionChecks.map((check, idx) => (
                        <div
                          key={check.id || idx}
                          className="bg-neutral-950 border border-neutral-800/80 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium text-neutral-200">{check.item}</span>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-900 text-neutral-400">
                                {check.category}
                              </span>
                            </div>
                            <div className="text-xs text-neutral-400">
                              <span className="text-neutral-500">Original issue:</span> {check.originalDeviation}
                            </div>
                            <div className="text-xs text-neutral-300 font-mono">
                              <span className="text-neutral-500">Measured:</span> {check.measuredRecheck}
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span
                              className={`text-xs font-mono font-bold px-3 py-1 rounded border ${
                                check.status === 'Pass'
                                  ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                                  : check.status === 'Fail'
                                  ? 'bg-rose-950/60 border-rose-800 text-rose-300'
                                  : 'bg-neutral-900 border-neutral-700 text-neutral-400'
                              }`}
                            >
                              {check.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 5: AUDIT TRAIL */}
                {activeTab === 'history' && (
                  <div className="space-y-4">
                    <div className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
                      Immutable Workflow Stage Transitions ({activeRequest.history.length})
                    </div>

                    <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-neutral-800">
                      {activeRequest.history.map((log) => (
                        <div key={log.id} className="relative flex items-start gap-4 pl-8">
                          <div className="absolute left-2 top-1.5 w-3.5 h-3.5 rounded-full bg-amber-500 border-2 border-[#070707] ring-2 ring-amber-500/20" />
                          <div className="flex-1 bg-neutral-950 border border-neutral-800/80 rounded-lg p-3 space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-mono text-amber-400 font-medium">
                                {log.fromStatus} → {log.toStatus}
                              </span>
                              <span className="text-[10px] font-mono text-neutral-500">
                                {new Date(log.timestamp).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-xs text-neutral-300">{log.comment}</p>
                            <div className="text-[10px] font-mono text-neutral-500 pt-0.5">
                              By {log.changedBy} ({log.role})
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-neutral-500 space-y-3">
              <RotateCcw className="w-12 h-12 text-neutral-700" />
              <div className="text-sm font-serif text-neutral-300">Select a Rework Request</div>
              <p className="text-xs text-neutral-500 max-w-sm text-center">
                Select an order from the queue on the left or commission a new rework request to initiate the 5-stage workflow.
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      <CreateReworkModal />
      <AssignReworkModal />
      <TaskProgressModal />
      <ReinspectionModal />
      <ReworkCertificateModal />
    </div>
  );
};
