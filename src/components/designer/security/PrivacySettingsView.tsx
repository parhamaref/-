/**
 * @file PrivacySettingsView.tsx
 * Atelier Privacy, Data Retention, Client Masking, and GDPR Compliance.
 * Regulates atelier profile visibility, client measurement longevity,
 * and encrypted data archive exports under UK Data Protection Act 2018.
 */

import React, { useState } from 'react';
import {
  ShieldCheck,
  Eye,
  EyeOff,
  Database,
  Download,
  Trash2,
  Check,
  Save,
  Lock,
  FileCheck,
  AlertTriangle,
  HelpCircle,
} from 'lucide-react';
import { useSecurityStore } from '../../../stores/securityStore';
import { PrivacySettings } from '../../../types/security.types';

export const PrivacySettingsView: React.FC = () => {
  const { privacy, updatePrivacySettings, downloadGdprDataArchive } = useSecurityStore();

  const [formState, setFormState] = useState<PrivacySettings>(privacy);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updatePrivacySettings(formState);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 animate-fadeIn font-mono text-left">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#222] pb-5">
        <div>
          <div className="flex items-center gap-2 text-white text-[10px] uppercase tracking-widest mb-1">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>GDPR & CLIENT CONFIDENTIALITY</span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl text-white font-bold uppercase tracking-wider">
            Privacy & Data Retention
          </h3>
          <p className="text-xs text-neutral-400 font-sans mt-0.5">
            Configure atelier visibility, client contact masking on workshop slips, and statutory retention limits.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={downloadGdprDataArchive}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs rounded-xl flex items-center gap-2 border border-neutral-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Download Data Archive</span>
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5"
          >
            {saveSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Grid of Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Atelier Visibility & Client Masking */}
        <div className="bg-[#0E0E0E] border border-[#222] rounded-2xl p-6 space-y-6">
          <div className="border-b border-[#222] pb-4">
            <h4 className="font-serif text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Eye className="w-4 h-4 text-amber-400" />
              <span>Atelier Visibility & Client Masking</span>
            </h4>
            <p className="text-xs text-neutral-400 font-sans mt-0.5">
              Control public access to your digital salon and protect VIP patron PII.
            </p>
          </div>

          {/* Visibility Mode */}
          <div className="space-y-2">
            <label className="text-[10px] text-neutral-400 uppercase tracking-wider block">
              Atelier Profile Visibility
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {[
                { id: 'PUBLIC', label: 'Public Atelier', desc: 'Visible to all luxury patrons worldwide.' },
                { id: 'VERIFIED_ONLY', label: 'Verified Only', desc: 'Accessible by verified buyers & salons.' },
                { id: 'PRIVATE_BESPOKE', label: 'Private Bespoke', desc: 'Invitation-only private commissions.' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() =>
                    setFormState({
                      ...formState,
                      atelierVisibility: opt.id as any,
                    })
                  }
                  className={`p-3 rounded-xl border text-left transition-all ${
                    formState.atelierVisibility === opt.id
                      ? 'bg-amber-500/10 border-amber-500/50 text-white'
                      : 'bg-[#141414] border-[#222] text-neutral-400 hover:text-white'
                  }`}
                >
                  <div className="font-bold text-xs mb-1">{opt.label}</div>
                  <div className="text-[10px] text-neutral-500 font-sans leading-tight">
                    {opt.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Mask Customer Info */}
          <div className="p-4 bg-[#141414] border border-[#222] rounded-xl flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <EyeOff className="w-4 h-4 text-cyan-400" />
                <span>Mask Patron Contact Info on Workshop Slips</span>
              </div>
              <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                Replaces patron real emails and phone numbers with anonymous tokens (`PATRON-***`) on physical cutting and sewing worksheets to prevent data leakage.
              </p>
            </div>
            <input
              type="checkbox"
              checked={formState.maskClientContactInfo}
              onChange={(e) =>
                setFormState({ ...formState, maskClientContactInfo: e.target.checked })
              }
              className="mt-1 w-5 h-5 accent-amber-500 rounded cursor-pointer"
            />
          </div>

          {/* Anonymized Market Benchmarking */}
          <div className="p-4 bg-[#141414] border border-[#222] rounded-xl flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs font-bold text-white">
                Participate in Anonymized Luxury Industry Benchmarks
              </div>
              <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                Contribute anonymized textile and conversion statistics to receive Daniel’s Maison aggregated marketplace trend intelligence.
              </p>
            </div>
            <input
              type="checkbox"
              checked={formState.allowAnonymizedMarketplaceBenchmarking}
              onChange={(e) =>
                setFormState({
                  ...formState,
                  allowAnonymizedMarketplaceBenchmarking: e.target.checked,
                })
              }
              className="mt-1 w-5 h-5 accent-amber-500 rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Card 2: Statutory Data Retention Policy */}
        <div className="bg-[#0E0E0E] border border-[#222] rounded-2xl p-6 space-y-6">
          <div className="border-b border-[#222] pb-4">
            <h4 className="font-serif text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400" />
              <span>Statutory Data Retention Schedules</span>
            </h4>
            <p className="text-xs text-neutral-400 font-sans mt-0.5">
              Automated lifecycle management for customer measurements, invoices, and multimedia.
            </p>
          </div>

          {/* Financial Records */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white font-bold">Financial Invoices & Payout Records</span>
              <span className="text-emerald-400 font-mono font-bold">
                {formState.financialRecordRetentionYears} Years (UK HMRC Mandate)
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 font-sans">
              All cleared commissions and VAT invoices remain archived for the statutory 7-year accounting requirement.
            </p>
          </div>

          {/* Client Measurements */}
          <div className="space-y-1.5 pt-2 border-t border-[#1C1C1C]">
            <div className="flex items-center justify-between text-xs">
              <label className="text-white font-bold">
                Client Biometric Measurement Dossiers
              </label>
              <select
                value={formState.clientMeasurementRetentionMonths}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    clientMeasurementRetentionMonths: Number(e.target.value),
                  })
                }
                className="bg-[#141414] border border-[#333] text-amber-300 text-xs px-2.5 py-1 rounded-lg focus:outline-none"
              >
                <option value={12}>12 Months (1 Year)</option>
                <option value={24}>24 Months (2 Years)</option>
                <option value={36}>36 Months (3 Years - Recommended)</option>
                <option value={60}>60 Months (5 Years)</option>
              </select>
            </div>
            <p className="text-[11px] text-neutral-500 font-sans">
              Automated expiration for bespoke tailoring measurements unless re-confirmed by client during fitting.
            </p>
          </div>

          {/* Consultation Videos */}
          <div className="space-y-1.5 pt-2 border-t border-[#1C1C1C]">
            <div className="flex items-center justify-between text-xs">
              <label className="text-white font-bold">
                Virtual Video Consultation Recordings
              </label>
              <select
                value={formState.consultationMediaRetentionDays}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    consultationMediaRetentionDays: Number(e.target.value),
                  })
                }
                className="bg-[#141414] border border-[#333] text-amber-300 text-xs px-2.5 py-1 rounded-lg focus:outline-none"
              >
                <option value={30}>30 Days</option>
                <option value={60}>60 Days</option>
                <option value={90}>90 Days (Recommended)</option>
                <option value={180}>180 Days</option>
              </select>
            </div>
            <p className="text-[11px] text-neutral-500 font-sans">
              Video consultation streams are automatically wiped from cloud vaults once bespoke delivery confirms.
            </p>
          </div>

          {/* Right to be Forgotten */}
          <div className="p-4 bg-rose-950/20 border border-rose-900/40 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-rose-300 text-xs font-bold">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Right to Erasure / GDPR Atelier Request</span>
            </div>
            <p className="text-[11px] text-rose-200/70 font-sans leading-relaxed">
              If an EU or UK patron exercises GDPR Article 17, our automated scrubber purges personal data while preserving legally required HMRC financial audit logs.
            </p>
          </div>
        </div>
      </div>
    </form>
  );
};
