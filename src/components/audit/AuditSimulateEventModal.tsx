/**
 * @file AuditSimulateEventModal.tsx
 * Interactive Live Simulation Tool to trigger authentic audit events across all 8 domains.
 */

import React, { useState } from 'react';
import {
  X,
  Play,
  Sparkles,
  Zap,
  User,
  ShoppingBag,
  DollarSign,
  ClipboardList,
  FileCheck,
  CreditCard,
  ShieldAlert,
  Globe,
} from 'lucide-react';
import {
  AuditEntityType,
  AuditActionType,
  AuditSeverity,
  AuditActor,
} from '../../types/auditTrail.types';
import { AuditTrailService } from '../../services/auditTrailApi';
import { useAuditTrailStore } from '../../stores/auditTrailStore';

interface AuditSimulateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Scenario {
  id: string;
  domain: AuditEntityType;
  title: string;
  description: string;
  icon: React.ElementType;
  severity: AuditSeverity;
  actionType: AuditActionType;
  actionLabel: string;
  entityId: string;
  entityName: string;
  actor: AuditActor;
  oldValue: Record<string, any>;
  newValue: Record<string, any>;
  metadata: Record<string, any>;
}

const PRESET_SCENARIOS: Scenario[] = [
  {
    id: 'sim-profile',
    domain: 'profile',
    title: 'Profile: Atelier Payout Bank Account Modified',
    description: 'Designer Daniel updates IBAN to new Swiss Private Banking vault.',
    icon: User,
    severity: 'MEDIUM',
    actionType: 'PAYOUT_ACCOUNT_MODIFIED',
    actionLabel: 'Disbursement IBAN & Routing Update',
    entityId: 'des-01-daniel',
    entityName: 'Daniel de Morvray Atelier Dossier',
    actor: {
      id: 'usr-des-001',
      name: 'Daniel de Morvray',
      email: 'daniel@maisondaniel.paris',
      role: 'Designer',
      ipAddress: '194.214.22.84',
      geoCity: 'Geneva',
      geoCountry: 'CH',
    },
    oldValue: {
      bankName: 'BNP Paribas Private Wealth',
      iban: 'FR76 3000 4001 2345 6789 0123 456',
      swiftBic: 'BNPAFR2P',
      currency: 'EUR',
    },
    newValue: {
      bankName: 'Pictet & Cie Haute Horlogerie & Couture Escrow',
      iban: 'CH93 0024 0240 1234 5678 9',
      swiftBic: 'PICTCHGG',
      currency: 'CHF',
    },
    metadata: {
      twoFactorMethod: 'FIDO2 YubiKey 5C',
      reason: 'Cross-border Swiss Franc settlement for Zurich runway',
    },
  },
  {
    id: 'sim-product',
    domain: 'product',
    title: 'Product: Post-Apocalyptic Trench Silhouette Restructured',
    description: 'Master patternmaker alters sleeve pitch and adds titanium D-rings.',
    icon: ShoppingBag,
    severity: 'MEDIUM',
    actionType: 'PRODUCT_METADATA_UPDATED',
    actionLabel: 'Patternmaker Architectural Cut Revision',
    entityId: 'prd-trench-02',
    entityName: 'Dune Nomad Waxed Cotton Trench',
    actor: {
      id: 'usr-tailor-002',
      name: 'Marco Bellini',
      email: 'marco.bellini@maisondaniel.paris',
      role: 'Master Tailor',
      ipAddress: '194.214.22.90',
      geoCity: 'Paris',
      geoCountry: 'FR',
    },
    oldValue: {
      silhouette: 'Raglan Storm Trench',
      hardwareFinishing: 'Antiqued Brass 15mm',
      liningYardageMeters: 3.2,
      stormFlapWidthCm: 12.0,
    },
    newValue: {
      silhouette: 'Anatomic Drop-Shoulder Trench',
      hardwareFinishing: 'Grade 5 Anodized Titanium D-Rings',
      liningYardageMeters: 3.6,
      stormFlapWidthCm: 14.5,
    },
    metadata: {
      bomVersion: 'BOM-TR-2026-v2',
      approvedByAtelier: true,
    },
  },
  {
    id: 'sim-price',
    domain: 'price',
    title: 'Price: Gold Bullion Hand-Stitch Surcharge +20%',
    description: 'Finance desk raises bespoke embroidery fee due to raw precious metal market spike.',
    icon: DollarSign,
    severity: 'HIGH',
    actionType: 'SURCHARGE_ADJUSTED',
    actionLabel: 'Bullion Thread Market Surcharge Escalation',
    entityId: 'prd-cape-gala',
    entityName: 'Midnight Velvet Ceremonial Cape',
    actor: {
      id: 'usr-fin-009',
      name: 'Alix de Saint-Germain',
      email: 'alix.finance@maisondaniel.paris',
      role: 'Finance Admin',
      ipAddress: '82.64.120.45',
      geoCity: 'Paris',
      geoCountry: 'FR',
    },
    oldValue: {
      baseEur: 6500,
      goldStitchSurchargeEur: 1400,
      totalRetailEur: 7900,
      marginPercent: 54.2,
    },
    newValue: {
      baseEur: 6500,
      goldStitchSurchargeEur: 1850,
      totalRetailEur: 8350,
      marginPercent: 56.8,
    },
    metadata: {
      metalSpotPriceGoldUsd: '$2,780/oz',
      financialAuditFlag: 'High Margin Deviation',
    },
  },
  {
    id: 'sim-order',
    domain: 'order_status',
    title: 'Order Status: Expedited to Quality Control Gate',
    description: 'Production staff moves Bespoke Suit ORD-2026-9041 to final inspection.',
    icon: ClipboardList,
    severity: 'LOW',
    actionType: 'ORDER_STATUS_CHANGED',
    actionLabel: 'Hand Basting Completed -> Dispatched to QC',
    entityId: 'ord-2026-9041',
    entityName: 'Bespoke Double-Breasted Dinner Suit',
    actor: {
      id: 'usr-tailor-003',
      name: 'Elena Rostova',
      email: 'elena.rostova@maisondaniel.paris',
      role: 'Master Tailor',
      ipAddress: '185.165.169.11',
      geoCity: 'Vienna',
      geoCountry: 'AT',
    },
    oldValue: {
      orderStage: 'Hand Sewing Bench (Stage 3)',
      hoursLogged: 34.5,
      estimatedRemainingHours: 8.0,
      location: 'Bench 02 - Elena',
    },
    newValue: {
      orderStage: 'Quality Control Chamber (Stage 4)',
      hoursLogged: 42.5,
      estimatedRemainingHours: 2.0,
      location: 'QC Inspection Chamber 01',
    },
    metadata: {
      clientVipTier: 'Black Card Patron',
      deliveryDeadline: '2026-10-22',
    },
  },
  {
    id: 'sim-approval',
    domain: 'design_approval',
    title: 'Design Approval: Master Swatch & Lining Approved',
    description: 'Creative Director signs off on Lyon Jacquard Silk Swatch with digital seal.',
    icon: FileCheck,
    severity: 'HIGH',
    actionType: 'SWATCH_APPROVED',
    actionLabel: 'Textile Swatch & Dye Lot Approval Signoff',
    entityId: 'appr-swatch-lyon-88',
    entityName: 'Obsidian Lyon Silk Jacquard Swatch #884',
    actor: {
      id: 'usr-des-001',
      name: 'Daniel de Morvray',
      email: 'daniel@maisondaniel.paris',
      role: 'Designer',
      ipAddress: '194.214.22.84',
      geoCity: 'Paris',
      geoCountry: 'FR',
    },
    oldValue: {
      swatchStatus: 'Awaiting Creative Review',
      deltaLabColorVariance: 1.8,
      weftDensityThreadsPerInch: 180,
    },
    newValue: {
      swatchStatus: 'Approved for Production Weave',
      deltaLabColorVariance: 0.4,
      weftDensityThreadsPerInch: 210,
      digitalSignature: 'DANIEL-SEAL-LYON-2026-PASS',
    },
    metadata: {
      millPartner: 'Les Tissages de la Croix-Rousse (Lyon)',
      swatchBatch: 'LOT-99120',
    },
  },
  {
    id: 'sim-payment',
    domain: 'payment',
    title: 'Payment: Full Escrow Deposit Capture ($14,500)',
    description: 'Stripe 3DSecure confirmation for VIP Gala Wardrobe project.',
    icon: CreditCard,
    severity: 'HIGH',
    actionType: 'PAYMENT_CAPTURED',
    actionLabel: '3D-Secure 2.2 Payment Gateway Capture',
    entityId: 'pay-tx-2026-1092',
    entityName: 'Bespoke Wardrobe Escrow Deposit',
    actor: {
      id: 'usr-sys-stripe',
      name: 'Stripe Gateway Engine',
      email: 'api-webhooks@stripe.com',
      role: 'System Automated',
      ipAddress: '54.187.174.169',
      geoCity: 'Dublin',
      geoCountry: 'IE',
    },
    oldValue: {
      intentStatus: 'requires_capture',
      authorizedAmount: 1450000,
      escrowLocked: false,
    },
    newValue: {
      intentStatus: 'succeeded',
      capturedAmount: 1450000,
      escrowLocked: true,
      escrowMaturityDate: '2026-11-15T00:00:00Z',
    },
    metadata: {
      currency: 'USD',
      fraudScore: 0,
      riskLevel: 'very_low',
    },
  },
  {
    id: 'sim-qc',
    domain: 'qc_decision',
    title: 'QC Decision: Haute Couture Seal of Excellence Awarded',
    description: 'Chamber inspector verifies zero millimeter deviation and stamps gold seal.',
    icon: ShieldAlert,
    severity: 'CRITICAL',
    actionType: 'HAUTE_COUTURE_SEAL_APPLIED',
    actionLabel: 'Official Haute Couture Accreditation Stamped',
    entityId: 'qc-sess-2026-099',
    entityName: 'Ceremonial Silk Trench Inspection Chamber',
    actor: {
      id: 'usr-qc-004',
      name: 'Jean-Luc Picard',
      email: 'jeanluc.qc@maisondaniel.paris',
      role: 'QC Inspector',
      ipAddress: '194.214.22.95',
      geoCity: 'Paris',
      geoCountry: 'FR',
    },
    oldValue: {
      qcVerdict: 'Chamber Measurement Verification In Progress',
      accreditationSeal: null,
      passedMillimeterTolerance: false,
    },
    newValue: {
      qcVerdict: 'Pass',
      accreditationSeal: 'MD-HAUTE-COUTURE-GOLD-SEAL-2026',
      passedMillimeterTolerance: true,
      inspectorBadgeNumber: 'MD-QC-MASTER-77',
      spectrophotometerMatchPercent: 99.8,
    },
    metadata: {
      orderId: 'ORD-2026-7731',
      garmentId: 'garment-monaco-001',
    },
  },
  {
    id: 'sim-customer',
    domain: 'customer_action',
    title: 'Customer Action: 3D LiDAR Anatomic Fit Submitted',
    description: 'Client Lord Harrington submits updated shoulder slope measurements from Monaco.',
    icon: Globe,
    severity: 'LOW',
    actionType: 'MEASUREMENTS_SUBMITTED',
    actionLabel: 'Biometric 3D Cloud Mesh Submission',
    entityId: 'cust-harrington-01',
    entityName: 'Lord Alistair Harrington Fitting Dossier',
    actor: {
      id: 'usr-cli-harrington',
      name: 'Lord Alistair Harrington',
      email: 'harrington.estate@monaco.mc',
      role: 'Client',
      ipAddress: '88.198.44.12',
      geoCity: 'Monaco',
      geoCountry: 'MC',
    },
    oldValue: {
      shoulderSlopeAngleDegrees: 18.2,
      torsoLengthCm: 48.0,
      armLengthCm: 65.5,
      scanDevice: 'iPhone 15 Pro LiDAR',
    },
    newValue: {
      shoulderSlopeAngleDegrees: 19.1,
      torsoLengthCm: 48.2,
      armLengthCm: 66.0,
      scanDevice: 'Atelier Monaco LiDAR Chamber v4',
    },
    metadata: {
      verifiedByTailor: false,
      fittingOccasion: 'Monaco Yacht Show Gala',
    },
  },
];

export const AuditSimulateEventModal: React.FC<AuditSimulateEventModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { refreshLogs, setSelectedRecordId, showNotification } = useAuditTrailStore();
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(PRESET_SCENARIOS[0].id);
  const [customIp, setCustomIp] = useState('194.214.22.84 (Paris Atelier)');
  const [isSimulating, setIsSimulating] = useState(false);

  if (!isOpen) return null;

  const currentScenario = PRESET_SCENARIOS.find((s) => s.id === selectedScenarioId) || PRESET_SCENARIOS[0];

  const handleExecuteSimulation = async () => {
    setIsSimulating(true);
    try {
      const cleanIp = customIp.split(' ')[0] || '194.214.22.84';
      const newRecord = await AuditTrailService.logEvent({
        entityType: currentScenario.domain,
        entityId: currentScenario.entityId,
        entityName: currentScenario.entityName,
        actionType: currentScenario.actionType,
        actionLabel: currentScenario.actionLabel,
        severity: currentScenario.severity,
        actor: {
          ...currentScenario.actor,
          ipAddress: cleanIp,
        },
        oldValue: currentScenario.oldValue,
        newValue: currentScenario.newValue,
        metadata: currentScenario.metadata,
        ipAddress: cleanIp,
      });

      refreshLogs();
      setSelectedRecordId(newRecord.id);
      showNotification(`Audited Event Ingested: ${currentScenario.actionLabel} (SHA-256 Block #${newRecord.sequenceNumber})`, 'success');
      onClose();
    } catch (e) {
      console.error(e);
      showNotification('Failed to simulate audit event', 'error');
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-3xl bg-[#0d0d0d] border border-[#333] rounded-xs shadow-2xl flex flex-col overflow-hidden text-neutral-100">
        {/* Header */}
        <div className="px-6 py-4 bg-[#141414] border-b border-[#222] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xs bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold tracking-wider uppercase text-white">
                SIMULATE LIVE AUDIT INGESTION EVENT
              </h2>
              <p className="text-[11px] font-mono text-neutral-400">
                Trigger transactional state changes across any of the 8 tracked domains to verify real-time cryptographic hash chaining.
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

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
          {/* Scenario Selector */}
          <div>
            <label className="block text-xs font-mono uppercase text-neutral-400 mb-2">
              Select Tracked Domain Scenario (All 8 Domains Available)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {PRESET_SCENARIOS.map((scenario) => {
                const Icon = scenario.icon;
                const isSelected = scenario.id === selectedScenarioId;
                return (
                  <button
                    key={scenario.id}
                    onClick={() => setSelectedScenarioId(scenario.id)}
                    className={`flex items-start gap-3 p-3 rounded-xs border text-left transition cursor-pointer ${
                      isSelected
                        ? 'bg-neutral-900 border-amber-500/80 ring-1 ring-amber-500/50'
                        : 'bg-[#111] border-[#222] hover:border-neutral-700'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-xs mt-0.5 shrink-0 ${
                        isSelected
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-neutral-800 text-neutral-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="font-mono text-xs font-bold text-white truncate">
                          {scenario.title.split(':')[0]}
                        </span>
                        <span
                          className={`px-1.5 py-0.2 text-[9px] font-mono font-bold rounded-xs ${
                            scenario.severity === 'CRITICAL'
                              ? 'bg-rose-950 text-rose-300 border border-rose-800'
                              : scenario.severity === 'HIGH'
                              ? 'bg-orange-950 text-orange-300 border border-orange-800'
                              : 'bg-neutral-800 text-neutral-300'
                          }`}
                        >
                          {scenario.severity}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">
                        {scenario.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scenario Details Preview Card */}
          <div className="bg-[#121212] border border-[#262626] p-4 rounded-xs space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[#222] pb-2 text-[11px]">
              <span className="text-amber-400 font-bold uppercase">
                {currentScenario.actionLabel}
              </span>
              <span className="text-neutral-400">
                Target Entity: {currentScenario.entityId}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-[11px]">
              <div>
                <span className="text-neutral-500 block mb-0.5">Originating Actor:</span>
                <span className="text-neutral-200 font-semibold">{currentScenario.actor.name}</span>
                <span className="text-neutral-400 block text-[10px]">({currentScenario.actor.role})</span>
              </div>
              <div>
                <span className="text-neutral-500 block mb-0.5">Source IP / Workstation:</span>
                <select
                  value={customIp}
                  onChange={(e) => setCustomIp(e.target.value)}
                  className="w-full bg-black border border-[#333] text-neutral-200 px-2 py-1 rounded-xs text-[11px] focus:outline-hidden focus:border-amber-500"
                >
                  <option value="194.214.22.84 (Paris Atelier)">194.214.22.84 (Paris HQ)</option>
                  <option value="82.64.120.45 (Lyon Mill)">82.64.120.45 (Lyon Mill)</option>
                  <option value="185.165.169.11 (Vienna Studio)">185.165.169.11 (Vienna)</option>
                  <option value="88.198.44.12 (Monaco VIP Penthouse)">88.198.44.12 (Monaco)</option>
                  <option value="54.187.174.169 (Stripe Webhook Gateway)">54.187.174.169 (Stripe)</option>
                </select>
              </div>
            </div>

            <div className="pt-2 border-t border-[#222]">
              <div className="text-[10px] text-neutral-400 uppercase mb-1">State Transition Preview:</div>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="p-2 bg-rose-950/20 border border-rose-900/30 text-rose-200 rounded-xs">
                  <div className="font-bold text-rose-400 mb-0.5">Old Value (Pre-Commit):</div>
                  <pre className="overflow-x-auto">{JSON.stringify(currentScenario.oldValue, null, 1)}</pre>
                </div>
                <div className="p-2 bg-emerald-950/20 border border-emerald-900/30 text-emerald-200 rounded-xs">
                  <div className="font-bold text-emerald-400 mb-0.5">New Value (Post-Commit):</div>
                  <pre className="overflow-x-auto">{JSON.stringify(currentScenario.newValue, null, 1)}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#141414] border-t border-[#222] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-mono text-neutral-400 hover:text-white transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleExecuteSimulation}
            disabled={isSimulating}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-mono text-xs font-bold uppercase rounded-xs transition shadow-lg shadow-amber-900/20 cursor-pointer disabled:opacity-50"
          >
            <Play className="w-4 h-4 fill-black" />
            {isSimulating ? 'Hashing & Ingesting...' : 'Simulate & Ingest Event'}
          </button>
        </div>
      </div>
    </div>
  );
};
