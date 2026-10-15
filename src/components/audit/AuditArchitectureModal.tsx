/**
 * @file AuditArchitectureModal.tsx
 * Interactive Architectural Blueprint & PostgreSQL Database Design Explorer for Audit Trail.
 */

import React, { useState } from 'react';
import {
  X,
  Database,
  Layers,
  ShieldCheck,
  Copy,
  Check,
  Server,
  Lock,
  GitBranch,
  Terminal,
  ExternalLink,
} from 'lucide-react';
import {
  AUDIT_TRAIL_ARCHITECTURE_DOC,
  AUDIT_TRAIL_POSTGRES_DDL,
} from '../../db/auditTrailSchema';

interface AuditArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuditArchitectureModal: React.FC<AuditArchitectureModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'ddl' | 'compliance'>('architecture');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyDdl = () => {
    navigator.clipboard.writeText(AUDIT_TRAIL_POSTGRES_DDL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-5xl h-[88vh] bg-[#0c0c0c] border border-[#333] rounded-xs shadow-2xl flex flex-col overflow-hidden text-neutral-100">
        {/* Header */}
        <div className="px-6 py-4 bg-[#141414] border-b border-[#222] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xs bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold tracking-wider uppercase text-white">
                AUDIT TRAIL SYSTEM ARCHITECTURE & DATABASE DESIGN
              </h2>
              <p className="text-[11px] font-mono text-neutral-400">
                Daniel’s Maison Haute Couture Enterprise Governance • SOC 2 & GDPR Art. 30 Certified
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-xs transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 py-2.5 bg-[#101010] border-b border-[#222] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('architecture')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-mono rounded-xs transition cursor-pointer ${
                activeTab === 'architecture'
                  ? 'bg-white text-black font-bold'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <Server className="w-3.5 h-3.5" /> System Architecture
            </button>
            <button
              onClick={() => setActiveTab('ddl')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-mono rounded-xs transition cursor-pointer ${
                activeTab === 'ddl'
                  ? 'bg-white text-black font-bold'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <Database className="w-3.5 h-3.5" /> Production PostgreSQL DDL
            </button>
            <button
              onClick={() => setActiveTab('compliance')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-mono rounded-xs transition cursor-pointer ${
                activeTab === 'compliance'
                  ? 'bg-white text-black font-bold'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Immutability & Compliance
            </button>
          </div>

          {activeTab === 'ddl' && (
            <button
              onClick={handleCopyDdl}
              className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-xs rounded-xs hover:bg-amber-500/30 transition cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied DDL' : 'Copy SQL Schema'}
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          {activeTab === 'architecture' && (
            <div className="space-y-6">
              {/* Architecture Diagram Visualization */}
              <div className="bg-[#080808] border border-[#222] p-5 rounded-xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#222] pb-3">
                  <span className="font-mono text-xs text-amber-400 uppercase tracking-widest font-bold flex items-center gap-2">
                    <Layers className="w-4 h-4" /> End-to-End Ingestion Flow
                  </span>
                  <span className="text-[10px] font-mono text-neutral-500">
                    High-Throughput • Sub-Millisecond Hook
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-mono">
                  {/* Step 1 */}
                  <div className="bg-[#121212] border border-[#2a2a2a] p-3.5 rounded-xs space-y-2">
                    <div className="text-amber-400 font-bold text-[11px]">1. Domain Mutators</div>
                    <div className="text-neutral-300 text-[11px] leading-relaxed">
                      All 8 domains (Profile, Products, Prices, Orders, Approvals, Payments, QC, Customer) execute transactions inside ACID boundaries.
                    </div>
                    <div className="text-[10px] text-neutral-500 pt-1">Hook: Pre-commit snapshot</div>
                  </div>

                  {/* Step 2 */}
                  <div className="bg-[#121212] border border-[#2a2a2a] p-3.5 rounded-xs space-y-2">
                    <div className="text-cyan-400 font-bold text-[11px]">2. PII / Zero-Knowledge</div>
                    <div className="text-neutral-300 text-[11px] leading-relaxed">
                      Zero-Knowledge Redactor masks PCI credit cards, banking IBAN digits, and biometrics prior to event serialization.
                    </div>
                    <div className="text-[10px] text-neutral-500 pt-1">Mask: SHA-256 HMAC</div>
                  </div>

                  {/* Step 3 */}
                  <div className="bg-[#121212] border border-[#2a2a2a] p-3.5 rounded-xs space-y-2">
                    <div className="text-purple-400 font-bold text-[11px]">3. Hash Chain Linker</div>
                    <div className="text-neutral-300 text-[11px] leading-relaxed">
                      Worker computes current block hash: SHA-256(prev_hash + timestamp + actor + diffs). Guarantees tamper-evident lineage.
                    </div>
                    <div className="text-[10px] text-neutral-500 pt-1">Chain: Merkle-linked</div>
                  </div>

                  {/* Step 4 */}
                  <div className="bg-[#121212] border border-[#2a2a2a] p-3.5 rounded-xs space-y-2">
                    <div className="text-emerald-400 font-bold text-[11px]">4. Append-Only Store</div>
                    <div className="text-neutral-300 text-[11px] leading-relaxed">
                      PostgreSQL monthly partitions. Anti-tampering trigger physically rejects UPDATE and DELETE operations.
                    </div>
                    <div className="text-[10px] text-neutral-500 pt-1">Retention: 7-Year Cold Archival</div>
                  </div>
                </div>
              </div>

              {/* Raw Architecture Text Specifications */}
              <div className="bg-black border border-[#222] p-4 rounded-xs">
                <div className="flex items-center justify-between text-neutral-400 text-xs font-mono mb-2">
                  <span className="flex items-center gap-1.5 text-neutral-300">
                    <Terminal className="w-3.5 h-3.5" /> Architecture Specification Dossier
                  </span>
                </div>
                <pre className="font-mono text-[11px] text-neutral-300 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
                  {AUDIT_TRAIL_ARCHITECTURE_DOC}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'ddl' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                <span>Production PostgreSQL 15+ Schema • Partitioned Range Tables • Anti-Tamper Trigger</span>
                <span className="text-emerald-400 font-bold">✓ Ready for Cloud SQL / Neon / Aurora</span>
              </div>
              <pre className="p-4 bg-black border border-[#222] text-amber-200/90 font-mono text-[11px] overflow-x-auto leading-relaxed max-h-[60vh] rounded-xs select-all">
                {AUDIT_TRAIL_POSTGRES_DDL}
              </pre>
            </div>
          )}

          {activeTab === 'compliance' && (
            <div className="space-y-6 font-sans">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-[#111] border border-[#252525] rounded-xs space-y-3">
                  <div className="flex items-center gap-2 text-white font-serif font-bold text-sm">
                    <Lock className="w-4 h-4 text-amber-400" /> SOC 2 Type II Compliance
                  </div>
                  <ul className="text-xs text-neutral-300 space-y-2 list-disc list-inside font-mono">
                    <li><strong className="text-white">CC6.1:</strong> Logical access security logs with authenticated user ID, role, and source IP address.</li>
                    <li><strong className="text-white">CC6.8:</strong> Protection against unauthorized modifications using PostgreSQL append-only immutability triggers.</li>
                    <li><strong className="text-white">CC7.2:</strong> Real-time anomaly detection for critical price deviations and unauthorized privilege escalation.</li>
                  </ul>
                </div>

                <div className="p-4 bg-[#111] border border-[#252525] rounded-xs space-y-3">
                  <div className="flex items-center gap-2 text-white font-serif font-bold text-sm">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> GDPR Article 30 Records
                  </div>
                  <ul className="text-xs text-neutral-300 space-y-2 list-disc list-inside font-mono">
                    <li><strong className="text-white">ROPA Accountability:</strong> Explicitly logs all processing activities of customer biometric & fitting data.</li>
                    <li><strong className="text-white">Right to Erasure Handlers:</strong> Biometric values pseudonymized using cryptographic salt tokens.</li>
                    <li><strong className="text-white">Data Subject Access (DSAR):</strong> Instant export of all customer-facing actions and state histories.</li>
                  </ul>
                </div>
              </div>

              {/* 8 Tracked Domains Table */}
              <div className="border border-[#222] rounded-xs overflow-hidden">
                <div className="px-4 py-3 bg-[#141414] border-b border-[#222] font-serif text-xs font-bold text-white uppercase tracking-wider">
                  Complete Domain Tracking Matrix
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-[11px]">
                    <thead className="bg-[#0e0e0e] text-neutral-400 border-b border-[#222]">
                      <tr>
                        <th className="py-2.5 px-4">Domain</th>
                        <th className="py-2.5 px-4">Monitored Events</th>
                        <th className="py-2.5 px-4">Captured State Snapshot</th>
                        <th className="py-2.5 px-4">Default Severity</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1e1e1e] text-neutral-300">
                      <tr>
                        <td className="py-2.5 px-4 font-bold text-white">Profile Changes</td>
                        <td className="py-2.5 px-4">Address, Payout IBAN, Tax ID, Bio</td>
                        <td className="py-2.5 px-4">Full Atelier Profile Delta</td>
                        <td className="py-2.5 px-4 text-amber-400 font-bold">MEDIUM</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 font-bold text-white">Product Changes</td>
                        <td className="py-2.5 px-4">Fabrics, Linings, Silhouettes, SKU</td>
                        <td className="py-2.5 px-4">BOM & Technical Specs</td>
                        <td className="py-2.5 px-4 text-amber-400 font-bold">MEDIUM</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 font-bold text-white">Price Changes</td>
                        <td className="py-2.5 px-4">MSRP, Surcharges, Currencies, Wholesale</td>
                        <td className="py-2.5 px-4">Price Schedule & Justification</td>
                        <td className="py-2.5 px-4 text-orange-400 font-bold">HIGH</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 font-bold text-white">Order Status Changes</td>
                        <td className="py-2.5 px-4">Assembly, QC Gate, Alterations, Shipped</td>
                        <td className="py-2.5 px-4">Lifecycle Step & Assigned Bench</td>
                        <td className="py-2.5 px-4 text-blue-400 font-bold">LOW</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 font-bold text-white">Design Approvals</td>
                        <td className="py-2.5 px-4">CAD Tech Pack, Swatches, Cut-Lists</td>
                        <td className="py-2.5 px-4">Tolerances & Digital Signature</td>
                        <td className="py-2.5 px-4 text-orange-400 font-bold">HIGH</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 font-bold text-white">Payments</td>
                        <td className="py-2.5 px-4">3DSecure Capture, Escrow, Refunds</td>
                        <td className="py-2.5 px-4">Gateway Token & Escrow Lock</td>
                        <td className="py-2.5 px-4 text-orange-400 font-bold">HIGH</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 font-bold text-white">QC Decisions</td>
                        <td className="py-2.5 px-4">Pass, Fail, Rework Mandated, Tolerance Waiver</td>
                        <td className="py-2.5 px-4">Inspector Badge, Millimeter Variance</td>
                        <td className="py-2.5 px-4 text-rose-400 font-bold">CRITICAL</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 font-bold text-white">Customer Actions</td>
                        <td className="py-2.5 px-4">3D LiDAR Scans, Fitting Booking, Login</td>
                        <td className="py-2.5 px-4">Anatomic Measurements & Device IP</td>
                        <td className="py-2.5 px-4 text-blue-400 font-bold">LOW</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#111] border-t border-[#222] flex items-center justify-between text-xs font-mono text-neutral-400">
          <span>SHA-256 Tamper-Evident Hash Chaining Engine • ISO 27001 Certified</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xs transition cursor-pointer"
          >
            Close Blueprint
          </button>
        </div>
      </div>
    </div>
  );
};
