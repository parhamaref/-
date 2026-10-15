/**
 * @file VerificationProgressTracker.tsx
 * Visual progress pipeline and timeline tracking for Designer Verification.
 */

import React from 'react';
import {
  VerificationStatus,
  VerificationAuditLog,
} from '../../../types/designerVerification.types';
import {
  FileText,
  Search,
  AlertTriangle,
  ShieldCheck,
  XCircle,
  Check,
} from 'lucide-react';

interface VerificationProgressTrackerProps {
  status: VerificationStatus;
  auditTrail?: VerificationAuditLog[];
}

export const VerificationProgressTracker: React.FC<VerificationProgressTrackerProps> = ({
  status,
  auditTrail = [],
}) => {
  // Ordered primary progression steps
  const steps: {
    id: VerificationStatus | 'Outcome';
    label: string;
    description: string;
    icon: any;
  }[] = [
    {
      id: 'Submitted',
      label: 'Dossier Intake',
      description: 'Identity & credentials logged',
      icon: FileText,
    },
    {
      id: 'Under Review',
      label: 'Council Audit',
      description: 'Pillars & craftsmanship inspection',
      icon: Search,
    },
    {
      id: 'Outcome',
      label: status === 'Rejected' ? 'Application Decision' : 'Guild Accreditation',
      description:
        status === 'Rejected'
          ? 'Standards criteria not satisfied'
          : status === 'Approved'
          ? 'Maison Seal issued'
          : 'Pending decision',
      icon: status === 'Rejected' ? XCircle : ShieldCheck,
    },
  ];

  // Helper to determine active state of each step
  const getStepState = (stepIndex: number) => {
    if (status === 'Submitted') {
      if (stepIndex === 0) return 'current';
      return 'upcoming';
    }
    if (status === 'Under Review' || status === 'More Information Required') {
      if (stepIndex === 0) return 'completed';
      if (stepIndex === 1) return 'current';
      return 'upcoming';
    }
    if (status === 'Approved' || status === 'Rejected') {
      if (stepIndex < 2) return 'completed';
      return status === 'Approved' ? 'completed' : 'rejected';
    }
    return 'upcoming';
  };

  return (
    <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-5 md:p-6 backdrop-blur-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 mb-5 border-b border-neutral-800/80 gap-3">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400">
            Lifecycle Verification Pipeline
          </span>
          <h3 className="text-lg font-serif text-white tracking-wide">
            Haute Tailoring Accreditation Status
          </h3>
        </div>
        <div className="text-xs font-mono text-neutral-400 flex items-center gap-2">
          <span>Active Phase:</span>
          <span className="text-neutral-200 font-semibold">{status}</span>
        </div>
      </div>

      {/* Conditional Callout if More Information Required */}
      {status === 'More Information Required' && (
        <div className="mb-6 p-4 rounded-lg bg-orange-950/30 border border-orange-700/60 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <span className="font-semibold text-orange-200 tracking-wide uppercase font-mono">
              Action Required // Additional Verification Requested
            </span>
            <p className="text-orange-300/90 leading-relaxed">
              The Standards Council requires supplemental documentation or registry clarifications before this review can proceed.
            </p>
          </div>
        </div>
      )}

      {/* Linear Stepper */}
      <div className="relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-2 relative z-10">
          {steps.map((step, idx) => {
            const state = getStepState(idx);
            const StepIcon = step.icon;

            return (
              <div
                key={step.id}
                className={`relative p-4 rounded-lg border transition-all ${
                  state === 'completed'
                    ? 'bg-emerald-950/20 border-emerald-800/40'
                    : state === 'current'
                    ? 'bg-amber-950/20 border-amber-600/60 ring-1 ring-amber-500/20'
                    : state === 'rejected'
                    ? 'bg-rose-950/20 border-rose-800/50'
                    : 'bg-neutral-950/40 border-neutral-800/50 opacity-60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${
                      state === 'completed'
                        ? 'bg-emerald-900/40 border-emerald-600 text-emerald-300'
                        : state === 'current'
                        ? 'bg-amber-900/40 border-amber-500 text-amber-300 animate-pulse'
                        : state === 'rejected'
                        ? 'bg-rose-900/40 border-rose-600 text-rose-300'
                        : 'bg-neutral-900 border-neutral-700 text-neutral-500'
                    }`}
                  >
                    {state === 'completed' ? (
                      <Check className="w-4 h-4 stroke-[2.5]" />
                    ) : (
                      <StepIcon className="w-4 h-4" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-neutral-400">
                        0{idx + 1}
                      </span>
                      <h4 className="text-sm font-medium text-white truncate">
                        {step.label}
                      </h4>
                    </div>
                    <p className="text-xs text-neutral-400 mt-1 line-clamp-2">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Audit Log Preview */}
      {auditTrail.length > 0 && (
        <div className="mt-6 pt-5 border-t border-neutral-800/70">
          <div className="flex items-center justify-between text-xs font-mono text-neutral-400 mb-3">
            <span className="uppercase tracking-wider">Latest Audit Log Entry</span>
            <span>{new Date(auditTrail[0].timestamp).toLocaleDateString()}</span>
          </div>
          <div className="p-3 rounded-lg bg-neutral-950/60 border border-neutral-800 text-xs text-neutral-300 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 truncate">
              <span className="text-amber-400 font-medium">
                [{auditTrail[0].actorRole}]
              </span>
              <span className="text-neutral-200">{auditTrail[0].actorName}:</span>
              <span className="text-neutral-400 truncate">{auditTrail[0].comment}</span>
            </div>
            <span className="shrink-0 text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-neutral-900 text-neutral-400 border border-neutral-700">
              {auditTrail[0].toStatus}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
