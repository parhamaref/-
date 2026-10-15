/**
 * @file ApprovalSnapshotVaultView.tsx
 * Immutable Cryptographic Approval Snapshot Vault for Daniel’s Maison VCS.
 */

import React, { useState } from 'react';
import {
  Lock,
  Award,
  ShieldCheck,
  CheckCircle2,
  Printer,
  Download,
  Copy,
  Check,
  ExternalLink,
  Calendar,
  User,
  Globe,
  Laptop,
  FileCheck,
  Ruler,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import {
  ApprovalSnapshot,
  VersionCommit,
} from '../../types/versionControl.types';

interface ApprovalSnapshotVaultViewProps {
  snapshots: ApprovalSnapshot[];
  headCommit: VersionCommit | null;
  onSealHeadCommit: (commitId: string) => void;
}

export const ApprovalSnapshotVaultView: React.FC<ApprovalSnapshotVaultViewProps> = ({
  snapshots,
  headCommit,
  onSealHeadCommit,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyHash = (hash: string, id: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePrintCertificate = (snap: ApprovalSnapshot) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Daniel’s Maison Haute Couture — Certificate of Approval</title>
          <style>
            body { font-family: 'Georgia', serif; padding: 40px; color: #111; line-height: 1.6; }
            .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 20px; }
            .seal { font-size: 24px; font-weight: bold; letter-spacing: 2px; }
            .cert-num { font-family: monospace; font-size: 14px; color: #666; margin-top: 5px; }
            .section { margin: 25px 0; }
            .title { font-weight: bold; text-transform: uppercase; font-size: 12px; letter-spacing: 1px; color: #555; }
            .content { font-size: 14px; margin-top: 5px; background: #f9f9f9; padding: 12px; border: 1px solid #ddd; }
            .signature { margin-top: 40px; border-top: 1px solid #ccc; padding-top: 15px; font-family: monospace; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="seal">DANIEL’S MAISON HAUTE COUTURE</div>
            <div>OFFICIAL DIGITAL SPECIFICATION CERTIFICATE</div>
            <div class="cert-num">${snap.certificateNumber}</div>
          </div>
          <div class="section">
            <div class="title">Bespoke Commission Details</div>
            <div class="content">
              <strong>Order Number:</strong> ${snap.orderNumber}<br/>
              <strong>Client:</strong> ${snap.customerName} (${snap.customerEmail})<br/>
              <strong>Version Sealed:</strong> ${snap.versionTag}<br/>
              <strong>Execution Timestamp:</strong> ${snap.capturedAt}
            </div>
          </div>
          <div class="section">
            <div class="title">Approved Anatomical Measurements</div>
            <div class="content">${snap.measurementsSummary}</div>
          </div>
          <div class="section">
            <div class="title">Approved Textile & Mill Specifications</div>
            <div class="content">${snap.fabricSummary}</div>
          </div>
          <div class="section">
            <div class="title">Approved Silhouette & Architecture</div>
            <div class="content">${snap.designSummary}</div>
          </div>
          <div class="section">
            <div class="title">Legally Binding Declaration</div>
            <div class="content"><em>"${snap.legalTermsDeclaration}"</em></div>
          </div>
          <div class="signature">
            <strong>Digital Signature Hash:</strong> ${snap.digitalSignature}<br/>
            <strong>SHA-256 Vault Seal:</strong> ${snap.sha256Seal}<br/>
            <strong>Client Network Origin:</strong> ${snap.signerIp} • ${snap.signerDevice}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div className="space-y-6">
      {/* Vault Introduction Header */}
      <div className="bg-[#101010] border border-[#222] p-5 rounded-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Lock className="w-4 h-4 text-purple-400" />
            <span className="font-mono text-[10px] text-purple-400 uppercase tracking-widest font-bold">
              IMMUTABLE SNAPSHOT VAULT
            </span>
          </div>
          <h2 className="font-serif text-lg font-bold text-white tracking-wide uppercase">
            CERTIFIED APPROVAL SPECIFICATION ARCHIVE
          </h2>
          <p className="text-xs text-neutral-400 font-sans mt-0.5">
            Every snapshot represents a legally executed client sign-off with digital signature, IP address, and cryptographic SHA-256 seal.
          </p>
        </div>

        {headCommit && !headCommit.isSnapshotLocked && (
          <button
            onClick={() => onSealHeadCommit(headCommit.id)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-700 to-purple-600 hover:from-purple-600 hover:to-purple-500 text-white font-mono text-xs font-bold uppercase rounded-xs transition shadow-lg shadow-purple-950/40 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" /> Seal Current HEAD ({headCommit.versionTag})
          </button>
        )}
      </div>

      {/* Snapshots Cards Grid */}
      <div className="space-y-6">
        {snapshots.map((snap) => (
          <div
            key={snap.snapshotId}
            className="bg-[#0c0c0c] border border-[#282828] rounded-xs overflow-hidden shadow-xl hover:border-neutral-700 transition"
          >
            {/* Certificate Header Banner */}
            <div className="bg-gradient-to-r from-purple-950/40 via-neutral-900 to-[#121212] px-6 py-4 border-b border-[#282828] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xs bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-base font-bold text-white tracking-wide">
                      {snap.certificateNumber}
                    </span>
                    <span className="px-2 py-0.5 bg-purple-950 text-purple-300 border border-purple-800 text-[10px] font-mono rounded-xs font-bold uppercase">
                      LOCKED SNAPSHOT ({snap.versionTag})
                    </span>
                  </div>
                  <div className="text-xs font-mono text-neutral-400">
                    Order: <span className="text-white font-bold">{snap.orderNumber}</span> • Customer: {snap.customerName}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePrintCertificate(snap)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs font-mono rounded-xs transition cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" /> Print Certificate
                </button>
              </div>
            </div>

            {/* Snapshot Body */}
            <div className="p-6 space-y-5 font-mono text-xs">
              {/* 3 Domain Snapshots Columns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Measurements Spec */}
                <div className="p-3.5 bg-[#121212] border border-[#222] rounded-xs space-y-1.5">
                  <div className="text-[10px] uppercase font-bold text-amber-400 flex items-center gap-1.5">
                    <Ruler className="w-3.5 h-3.5" /> Approved Measurements
                  </div>
                  <p className="text-neutral-300 text-[11px] leading-relaxed">
                    {snap.measurementsSummary}
                  </p>
                </div>

                {/* Fabric Spec */}
                <div className="p-3.5 bg-[#121212] border border-[#222] rounded-xs space-y-1.5">
                  <div className="text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1.5">
                    <ShoppingBag className="w-3.5 h-3.5" /> Approved Fabric Specification
                  </div>
                  <p className="text-neutral-300 text-[11px] leading-relaxed">
                    {snap.fabricSummary}
                  </p>
                </div>

                {/* Design Spec */}
                <div className="p-3.5 bg-[#121212] border border-[#222] rounded-xs space-y-1.5">
                  <div className="text-[10px] uppercase font-bold text-cyan-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Approved Silhouette & Details
                  </div>
                  <p className="text-neutral-300 text-[11px] leading-relaxed">
                    {snap.designSummary}
                  </p>
                </div>
              </div>

              {/* Legal Declaration Quote */}
              <div className="p-3.5 bg-black border border-[#222] rounded-xs space-y-1">
                <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">
                  Legally Binding Acceptance Declaration:
                </span>
                <p className="font-serif italic text-xs text-neutral-200">
                  "{snap.legalTermsDeclaration}"
                </p>
              </div>

              {/* Cryptographic Signatures Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] pt-2 border-t border-[#222]">
                <div className="space-y-1">
                  <span className="text-neutral-500 uppercase text-[10px] block">Digital Signature Hash:</span>
                  <div className="flex items-center gap-2 bg-black px-2.5 py-1.5 rounded-xs border border-[#222]">
                    <span className="text-purple-300 font-mono truncate">{snap.digitalSignature}</span>
                    <button
                      onClick={() => handleCopyHash(snap.digitalSignature, `${snap.snapshotId}-sig`)}
                      className="text-neutral-500 hover:text-white"
                      title="Copy Digital Signature"
                    >
                      {copiedId === `${snap.snapshotId}-sig` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-neutral-500 uppercase text-[10px] block">Cryptographic SHA-256 Vault Seal:</span>
                  <div className="flex items-center gap-2 bg-black px-2.5 py-1.5 rounded-xs border border-[#222]">
                    <span className="text-amber-300 font-mono truncate">{snap.sha256Seal}</span>
                    <button
                      onClick={() => handleCopyHash(snap.sha256Seal, `${snap.snapshotId}-seal`)}
                      className="text-neutral-500 hover:text-white"
                      title="Copy SHA-256 Seal"
                    >
                      {copiedId === `${snap.snapshotId}-seal` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Metadata Footer */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-[10px] text-neutral-500 pt-2 border-t border-[#1c1c1c]">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1 text-neutral-400">
                    <User className="w-3 h-3" /> Signed By: {snap.inspectorOrDesigner}
                  </span>
                  <span className="flex items-center gap-1 text-neutral-400">
                    <Calendar className="w-3 h-3" /> Captured: {new Date(snap.capturedAt).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-neutral-400">
                    <Globe className="w-3 h-3" /> Client IP: {snap.signerIp}
                  </span>
                  <span className="flex items-center gap-1 text-neutral-500 truncate max-w-[200px]">
                    <Laptop className="w-3 h-3" /> {snap.signerDevice}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {snapshots.length === 0 && (
          <div className="p-12 text-center text-neutral-500 font-mono text-xs bg-[#0c0c0c] border border-[#222] rounded-xs">
            No locked approval snapshots stored yet for this bespoke commission.
          </div>
        )}
      </div>
    </div>
  );
};
