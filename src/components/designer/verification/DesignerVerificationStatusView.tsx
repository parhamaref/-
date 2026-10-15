/**
 * @file DesignerVerificationStatusView.tsx
 * Designer's self-serve verification dashboard & status tracking center.
 */

import React, { useState } from 'react';
import {
  DesignerVerificationApplication,
} from '../../../types/designerVerification.types';
import {
  VerificationStatusBadge,
  PillarStatusBadge,
} from './VerificationStatusBadge';
import { VerificationProgressTracker } from './VerificationProgressTracker';
import { RespondToQueryModal } from './RespondToQueryModal';
import {
  ShieldCheck,
  Building2,
  UserCheck,
  Scissors,
  AlertTriangle,
  History,
  CheckCircle2,
  Calendar,
  Sparkles,
  ExternalLink,
  Award,
} from 'lucide-react';

interface DesignerVerificationStatusViewProps {
  application: DesignerVerificationApplication;
  onRespondToQuery: (
    explanation: string,
    items: { itemId: string; designerResponse: string; documentUrl?: string }[]
  ) => Promise<void>;
  onOpenNewApplication?: () => void;
}

export const DesignerVerificationStatusView: React.FC<DesignerVerificationStatusViewProps> = ({
  application,
  onRespondToQuery,
  onOpenNewApplication,
}) => {
  const [isQueryModalOpen, setIsQueryModalOpen] = useState(false);
  const [showAuditTrail, setShowAuditTrail] = useState(true);

  const { identity, business, portfolio, accreditationDetails, rejectionDetails, activeQuery } = application;

  return (
    <div className="space-y-6">
      {/* Designer Hero Header */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 md:p-8 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <img
              src={application.avatarUrl}
              alt={application.designerName}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-neutral-700 shadow-xl"
            />
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-2xl font-serif text-white tracking-wide">
                  {application.brandName}
                </h2>
                <VerificationStatusBadge status={application.status} size="md" />
              </div>
              <p className="text-xs text-neutral-400 mt-1 font-mono">
                Artisan Principal: <span className="text-neutral-200">{application.designerName}</span> • Application Ref: <span className="text-amber-400">{application.id}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {application.status === 'More Information Required' && (
              <button
                onClick={() => setIsQueryModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-neutral-950 text-xs font-semibold tracking-wide transition shadow-lg animate-pulse"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Provide Supplemental Proofs</span>
              </button>
            )}

            {onOpenNewApplication && (
              <button
                onClick={onOpenNewApplication}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-neutral-700 hover:border-neutral-500 text-neutral-200 text-xs font-medium tracking-wide transition"
              >
                <span>Submit Re-application</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Visual Pipeline Stepper */}
      <VerificationProgressTracker
        status={application.status}
        auditTrail={application.auditTrail}
      />

      {/* Status Specific Highlights */}
      {application.status === 'Approved' && accreditationDetails && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-neutral-900 to-amber-950/30 border border-emerald-600/60 shadow-2xl space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-emerald-800/40">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-900/50 border border-emerald-500 flex items-center justify-center text-emerald-300">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-semibold">
                  Daniel’s Maison Official Accreditation
                </span>
                <h3 className="text-xl font-serif text-white tracking-wide">
                  {accreditationDetails.tier} Atelier Seal
                </h3>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-mono text-neutral-400 block">Accreditation Seal ID:</span>
              <span className="text-sm font-mono font-bold text-amber-300">{accreditationDetails.sealNumber}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3 rounded-lg bg-neutral-950/60 border border-neutral-800">
              <span className="text-neutral-400 block font-mono text-[10px]">Validated By:</span>
              <span className="text-white font-medium mt-0.5 block">{accreditationDetails.approvedBy}</span>
            </div>
            <div className="p-3 rounded-lg bg-neutral-950/60 border border-neutral-800">
              <span className="text-neutral-400 block font-mono text-[10px]">Granted On:</span>
              <span className="text-white font-medium mt-0.5 block">
                {new Date(accreditationDetails.approvedAt).toLocaleDateString()}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-neutral-950/60 border border-neutral-800">
              <span className="text-neutral-400 block font-mono text-[10px]">Valid Until:</span>
              <span className="text-emerald-300 font-medium mt-0.5 block">
                {new Date(accreditationDetails.expiresAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 text-xs text-neutral-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Unlocked Atelier Privileges: Bespoke Order Escrow Guarantee, Certified Guild Catalog Badge, Priority Haute Commission Intake.</span>
          </div>
        </div>
      )}

      {application.status === 'More Information Required' && activeQuery && (
        <div className="p-6 rounded-2xl bg-orange-950/30 border border-orange-700/70 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-orange-800/40">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-orange-400" />
              <div>
                <h4 className="text-base font-semibold text-white">Action Required: Standards Council Clarification</h4>
                <p className="text-xs text-orange-300/80 font-mono">Issued by {activeQuery.requestedBy}</p>
              </div>
            </div>
            <span className="text-xs font-mono text-orange-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Deadline: {activeQuery.deadlineDate}
            </span>
          </div>

          <p className="text-xs text-neutral-200 leading-relaxed bg-neutral-950/60 p-3 rounded-lg border border-neutral-800">
            "{activeQuery.notes}"
          </p>

          <div className="space-y-2">
            <span className="text-[10px] uppercase font-mono tracking-wider text-orange-300">Flagged Evidence Items:</span>
            {activeQuery.items.map((item, idx) => (
              <div key={item.id} className="p-3 rounded-lg bg-neutral-900 border border-neutral-800 text-xs flex items-center justify-between">
                <div>
                  <span className="font-medium text-white">{item.field}</span>
                  <p className="text-neutral-400 text-[11px] mt-0.5">{item.requirement}</p>
                </div>
                <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                  item.fulfilled ? 'bg-emerald-950/40 text-emerald-300 border-emerald-700' : 'bg-orange-950/40 text-orange-300 border-orange-700'
                }`}>
                  {item.fulfilled ? 'Provided' : 'Pending Response'}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={() => setIsQueryModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-neutral-950 text-xs font-bold transition shadow-lg"
            >
              <Sparkles className="w-4 h-4" />
              <span>Respond to Inquiry & Upload Proofs</span>
            </button>
          </div>
        </div>
      )}

      {application.status === 'Rejected' && rejectionDetails && (
        <div className="p-6 rounded-2xl bg-rose-950/30 border border-rose-800/70 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-rose-900/60">
            <div className="w-10 h-10 rounded-xl bg-rose-900/40 border border-rose-700 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-semibold text-white">Accreditation Decision: Standards Criteria Not Met</h4>
              <p className="text-xs text-rose-300/80 font-mono">
                Code: <span className="font-bold">{rejectionDetails.reasonCode}</span> • Audited By: {rejectionDetails.rejectedBy}
              </p>
            </div>
          </div>

          <p className="text-xs text-neutral-200 leading-relaxed bg-neutral-950/60 p-3 rounded-lg border border-neutral-800">
            "{rejectionDetails.reasonSummary}"
          </p>

          <div className="flex items-center justify-between text-xs text-neutral-400 pt-2 font-mono">
            <span>Eligible for Re-application from: <strong className="text-neutral-200">{rejectionDetails.reapplicationEligibleDate}</strong></span>
            {rejectionDetails.appealAllowed && (
              <span className="text-amber-400 underline cursor-pointer">Formal Appeal Available via Council Secretariat</span>
            )}
          </div>
        </div>
      )}

      {/* 3 Pillar Inspection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pillar 1: Identity */}
        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-amber-400" />
              <h4 className="text-sm font-semibold text-white">Pillar I: Identity</h4>
            </div>
            <PillarStatusBadge status={identity.status} />
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-neutral-400">Full Name:</span>
              <span className="text-neutral-200 font-medium">{identity.fullName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Nationality:</span>
              <span className="text-neutral-200">{identity.nationality}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Document Type:</span>
              <span className="text-neutral-200 font-mono uppercase text-[11px]">{identity.idType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Masked ID Number:</span>
              <span className="text-amber-300 font-mono">{identity.idNumberMasked}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Biometric Match:</span>
              <span className="text-emerald-400 font-mono">{identity.biometricVerificationScore || 99}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Sanctions Screening:</span>
              <span className="text-emerald-400 font-mono">Passed (OFAC/Interpol)</span>
            </div>
          </div>

          {identity.reviewerNotes && (
            <p className="text-[11px] text-neutral-400 bg-neutral-950 p-2.5 rounded border border-neutral-800/80 italic">
              Council Note: "{identity.reviewerNotes}"
            </p>
          )}
        </div>

        {/* Pillar 2: Business */}
        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-400" />
              <h4 className="text-sm font-semibold text-white">Pillar II: Business</h4>
            </div>
            <PillarStatusBadge status={business.status} />
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-neutral-400">Legal Entity:</span>
              <span className="text-neutral-200 font-medium">{business.legalEntityName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Entity Type:</span>
              <span className="text-neutral-300 text-[11px] truncate max-w-[140px]">{business.entityType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Registry / RCS:</span>
              <span className="text-amber-300 font-mono">{business.registrationNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Tax / VAT ID:</span>
              <span className="text-neutral-200 font-mono">{business.taxVatNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Registered Country:</span>
              <span className="text-neutral-200">{business.registeredCountry}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Workshop Facility:</span>
              <span className="text-neutral-300 text-[11px] truncate max-w-[140px]">{business.workshopAddress}</span>
            </div>
          </div>

          {business.reviewerNotes && (
            <p className="text-[11px] text-neutral-400 bg-neutral-950 p-2.5 rounded border border-neutral-800/80 italic">
              Council Note: "{business.reviewerNotes}"
            </p>
          )}
        </div>

        {/* Pillar 3: Portfolio */}
        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <Scissors className="w-4 h-4 text-amber-400" />
              <h4 className="text-sm font-semibold text-white">Pillar III: Portfolio</h4>
            </div>
            <PillarStatusBadge status={portfolio.status} />
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-neutral-400">Practice Tenure:</span>
              <span className="text-neutral-200 font-medium">{portfolio.yearsInPractice} Years in Haute Tailoring</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Atelier Studio:</span>
              <span className="text-neutral-200">{portfolio.atelierCity}, {portfolio.atelierCountry}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Showcase Works:</span>
              <span className="text-amber-300 font-mono">{portfolio.works.length} Verified Pieces</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Guild Affiliations:</span>
              <span className="text-neutral-300 text-[11px] truncate max-w-[140px]">
                {portfolio.guildAffiliations.join(', ') || 'Independent Master'}
              </span>
            </div>
          </div>

          {portfolio.works[0] && (
            <div className="p-2.5 rounded bg-neutral-950 border border-neutral-800 text-xs flex items-center gap-3">
              <img
                src={portfolio.works[0].imageUrl}
                alt={portfolio.works[0].title}
                className="w-10 h-10 rounded object-cover border border-neutral-700"
              />
              <div className="min-w-0">
                <span className="text-white font-medium block truncate text-[11px]">
                  {portfolio.works[0].title}
                </span>
                <span className="text-[10px] text-neutral-400 block truncate">
                  {portfolio.works[0].craftTechniques.join(' • ')}
                </span>
              </div>
            </div>
          )}

          {portfolio.reviewerNotes && (
            <p className="text-[11px] text-neutral-400 bg-neutral-950 p-2.5 rounded border border-neutral-800/80 italic">
              Council Note: "{portfolio.reviewerNotes}"
            </p>
          )}
        </div>
      </div>

      {/* Audit Trail Accordion */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
        <div
          className="flex items-center justify-between cursor-pointer select-none"
          onClick={() => setShowAuditTrail(!showAuditTrail)}
        >
          <div className="flex items-center gap-3">
            <History className="w-5 h-5 text-amber-400" />
            <div>
              <h4 className="text-sm font-semibold text-white">Accreditation Audit Trail & Timestamp Log</h4>
              <p className="text-xs text-neutral-400">Immutable ledger of standards reviews, query dispatches, and status changes</p>
            </div>
          </div>
          <span className="text-xs font-mono text-amber-400 hover:underline">
            {showAuditTrail ? 'Collapse Log' : `Expand Log (${application.auditTrail.length})`}
          </span>
        </div>

        {showAuditTrail && (
          <div className="mt-5 space-y-3 pt-5 border-t border-neutral-800/80">
            {application.auditTrail.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-amber-400 font-mono font-medium">[{log.actorRole}]</span>
                      <span className="text-white font-medium">{log.actorName}</span>
                      <span className="text-neutral-500 font-mono text-[11px]">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-neutral-300 mt-1">{log.comment}</p>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2 self-end md:self-center">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-400">
                    {log.fromStatus}
                  </span>
                  <span className="text-neutral-500">→</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/40 text-amber-300 border border-amber-800/60 font-semibold">
                    {log.toStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Query Response Modal */}
      {activeQuery && (
        <RespondToQueryModal
          isOpen={isQueryModalOpen}
          onClose={() => setIsQueryModalOpen(false)}
          query={activeQuery}
          designerName={application.designerName}
          onSubmitResponse={onRespondToQuery}
        />
      )}
    </div>
  );
};
