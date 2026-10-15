/**
 * @file DesignerVerificationWorkspace.tsx
 * Master Workspace for Daniel’s Maison Designer Verification System.
 *
 * Implements:
 * - Dual Perspective Switcher:
 *   1. Atelier Perspective (Designer Self-Service & Status Tracking)
 *   2. Standards Council (Manual Approval & Multi-Pillar Compliance Review)
 * - Quick Status Simulation Toolbar for demonstrating all 5 statuses in real-time
 * - Multi-Step Intake Application Wizard
 */

import React, { useEffect, useState } from 'react';
import { useDesignerVerificationStore } from '../../../stores/designerVerificationStore';
import { DesignerVerificationStatusView } from './DesignerVerificationStatusView';
import { ManualApprovalWorkflowPanel } from './ManualApprovalWorkflowPanel';
import { DesignerVerificationApplicationForm } from './DesignerVerificationApplicationForm';
import { VerificationStatus } from '../../../types/designerVerification.types';
import {
  ShieldCheck,
  Building,
  User,
  Sliders,
  RotateCcw,
  Sparkles,
  Layers,
  FilePlus2,
} from 'lucide-react';

export const DesignerVerificationWorkspace: React.FC = () => {
  const {
    applications,
    selectedApplicationId,
    activePerspective,
    statusFilter,
    searchQuery,
    isLoading,
    getActiveApplication,
    getFilteredApplications,
    loadApplications,
    selectApplication,
    setPerspective,
    setStatusFilter,
    setSearchQuery,
    submitNewApplication,
    claimReview,
    requestMoreInformation,
    respondToQuery,
    approveApplication,
    rejectApplication,
    updatePillarReview,
    simulateStatus,
    resetToDefaults,
  } = useDesignerVerificationStore();

  const [isNewAppModalOpen, setIsNewAppModalOpen] = useState(false);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  const activeApp = getActiveApplication();
  const filteredApps = getFilteredApplications();

  const allStatuses: VerificationStatus[] = [
    'Submitted',
    'Under Review',
    'More Information Required',
    'Approved',
    'Rejected',
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Banner & Control Deck */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-5 border-b border-neutral-800/80">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-[11px] font-mono uppercase tracking-widest text-amber-400 font-semibold">
                Haute Couture Guild Accreditation
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-serif text-white tracking-wide">
              Designer Verification & Atelier Standards
            </h1>
            <p className="text-xs text-neutral-400 mt-1 max-w-2xl font-sans">
              Identity validation, commercial enterprise audit, and craftsmanship portfolio accreditation for Daniel’s Maison bespoke partners.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Perspective Switcher */}
            <div className="inline-flex p-1 bg-neutral-950 border border-neutral-800 rounded-xl">
              <button
                onClick={() => setPerspective('designer')}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono transition ${
                  activePerspective === 'designer'
                    ? 'bg-amber-500 text-neutral-950 font-bold shadow'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Atelier View</span>
              </button>
              <button
                onClick={() => setPerspective('reviewer')}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono transition ${
                  activePerspective === 'reviewer'
                    ? 'bg-amber-500 text-neutral-950 font-bold shadow'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Building className="w-3.5 h-3.5" />
                <span>Standards Council ({applications.length})</span>
              </button>
            </div>

            <button
              onClick={() => setIsNewAppModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white text-xs font-medium tracking-wide transition shadow"
            >
              <FilePlus2 className="w-3.5 h-3.5 text-amber-400" />
              <span>New Dossier</span>
            </button>
          </div>
        </div>

        {/* Live Status Simulation Toolbar */}
        <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-neutral-400 font-mono">
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] uppercase tracking-wider">Simulate Status for Testing:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {allStatuses.map((st) => {
              const isCurrent = activeApp?.status === st;
              return (
                <button
                  key={st}
                  onClick={() => simulateStatus(st)}
                  className={`text-[10px] font-mono uppercase px-2.5 py-1 rounded-lg border transition ${
                    isCurrent
                      ? 'bg-amber-950/70 text-amber-300 border-amber-600 font-bold ring-1 ring-amber-500/40'
                      : 'bg-neutral-950/60 text-neutral-400 border-neutral-800 hover:text-white hover:border-neutral-700'
                  }`}
                >
                  {st}
                </button>
              );
            })}

            <button
              onClick={() => resetToDefaults()}
              title="Reset mock applications to default states"
              className="p-1 text-neutral-500 hover:text-neutral-300 transition ml-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace Body */}
      {isLoading ? (
        <div className="p-16 text-center text-neutral-400 text-xs font-mono">
          Loading verification dossiers & standards registries...
        </div>
      ) : activePerspective === 'designer' ? (
        activeApp ? (
          <DesignerVerificationStatusView
            application={activeApp}
            onRespondToQuery={async (exp, items) => {
              await respondToQuery(activeApp.id, activeApp.designerName, exp, items);
            }}
            onOpenNewApplication={() => setIsNewAppModalOpen(true)}
          />
        ) : (
          <div className="p-12 text-center text-neutral-400 bg-neutral-900 border border-neutral-800 rounded-2xl">
            No active designer application found.
          </div>
        )
      ) : (
        <ManualApprovalWorkflowPanel
          applications={filteredApps}
          selectedApplicationId={selectedApplicationId}
          onSelectApplication={selectApplication}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          onClaimReview={claimReview}
          onRequestMoreInformation={requestMoreInformation}
          onApproveApplication={approveApplication}
          onRejectApplication={rejectApplication}
          onUpdatePillar={updatePillarReview}
        />
      )}

      {/* New Application Intake Wizard */}
      <DesignerVerificationApplicationForm
        isOpen={isNewAppModalOpen}
        onClose={() => setIsNewAppModalOpen(false)}
        onSubmit={async (data) => {
          await submitNewApplication(data);
        }}
        defaultDesignerName={activeApp?.designerName || 'Daniel de Saint-Germain'}
        defaultBrandName={activeApp?.brandName || 'Daniel’s Maison Paris'}
      />
    </div>
  );
};
