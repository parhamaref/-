/**
 * @file ProductionJobDetailView.tsx
 * Dedicated detail workbench for assigned bespoke commissions.
 * Features read-only approved technical pattern specifications,
 * state machine stage control, and QC defect corrective action handling.
 */

import React, { useState } from 'react';
import {
  ProductionJob,
  Order,
  Product,
  MeasurementProfile,
  QCRecord,
} from '../../types/daniels.types';
import {
  MOCK_MEASUREMENT_PROFILES,
  MOCK_PRODUCTS,
  MOCK_QC_RECORDS,
} from '../../mock/danielsMockData';
import { ProductionStageController } from './ProductionStageController';
import {
  ArrowLeft,
  Ruler,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  FileCheck,
  RotateCcw,
  Sparkles,
  Layers,
  Clock,
  User,
} from 'lucide-react';

interface ProductionJobDetailViewProps {
  job: ProductionJob;
  order: Order;
  onBack: () => void;
  onJobUpdated: (updatedJob: ProductionJob) => void;
}

export const ProductionJobDetailView: React.FC<ProductionJobDetailViewProps> = ({
  job,
  order,
  onBack,
  onJobUpdated,
}) => {
  const [currentJob, setCurrentJob] = useState<ProductionJob>(job);

  // Associated Product & Measurement Profile
  const product = MOCK_PRODUCTS.find((p) => p.id === order.productId) || MOCK_PRODUCTS[0];
  const profileId = order.personalisation.customMeasurementsProfileId;
  const measurementProfile =
    MOCK_MEASUREMENT_PROFILES.find((p) => p.id === profileId) ||
    MOCK_MEASUREMENT_PROFILES.find((p) => p.customerId === order.customerId && p.isLatest) ||
    MOCK_MEASUREMENT_PROFILES[0];

  // QC Record for this order
  const [qcRecord, setQcRecord] = useState<QCRecord | undefined>(() => {
    return MOCK_QC_RECORDS.find((q) => q.orderId === order.id);
  });

  const [reworkActionNotice, setReworkActionNotice] = useState<string | null>(null);

  const handleJobUpdateInternal = (updated: ProductionJob) => {
    setCurrentJob(updated);
    onJobUpdated(updated);
  };

  // Re-submit reworked item to QC (Requirement 4)
  const handleResubmitToQC = () => {
    const updatedJob: ProductionJob = {
      ...currentJob,
      stage: 'QC',
      progress: 95,
      notes: [
        ...currentJob.notes,
        {
          timestamp: new Date().toISOString(),
          authorId: currentJob.partnerId,
          text: `[QC Re-submission] Rework completed as per inspector corrective action docket. Handed back to QC team.`,
        },
      ],
      status: 'In Progress',
    };

    handleJobUpdateInternal(updatedJob);
    setReworkActionNotice('Garment successfully re-submitted to QC Inspection Queue.');
    setTimeout(() => setReworkActionNotice(null), 5000);
  };

  return (
    <div className="space-y-8 text-left font-mono animate-fadeIn">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between border-b border-[#2B2B2B] pb-4">
        <button
          onClick={onBack}
          className="text-neutral-400 hover:text-white text-[10px] uppercase flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>RETURN TO WORKSHOP QUEUE</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[9px] text-neutral-500 uppercase">COMMISSION:</span>
          <span className="text-white font-bold text-[11px]">{order.id}</span>
          <span className="text-neutral-600">|</span>
          <span className="text-[9px] text-neutral-500 uppercase">JOB:</span>
          <span className="text-emerald-400 font-bold text-[11px]">{currentJob.id}</span>
        </div>
      </div>

      {/* Rework Alert Banner (Requirement 4) */}
      {qcRecord && qcRecord.result === 'Fail' && (
        <div className="p-5 bg-rose-950/50 border border-rose-500/60 rounded-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-rose-500/30 pb-3">
            <div className="flex items-center gap-2.5 text-rose-300">
              <AlertTriangle className="w-5 h-5 text-rose-400 animate-pulse shrink-0" />
              <span className="text-xs font-bold uppercase tracking-wider">
                QC INSPECTION DEFECT DETECTED — REWORK REQUIRED
              </span>
            </div>
            <span className="text-[9px] text-rose-300 font-mono">
              INSPECTOR ID: {qcRecord.inspectionDetails.inspectorId} ({qcRecord.inspectionDetails.inspectionDate})
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[10px]">
            {/* Defect details */}
            <div className="space-y-2">
              <span className="text-rose-400 font-bold uppercase tracking-wider block text-[9px]">
                DEFECT SPECIFICATIONS:
              </span>
              {qcRecord.defects.map((def, idx) => (
                <div key={idx} className="p-2.5 bg-black/60 border border-rose-900/60 rounded-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-rose-300 font-bold">CODE: {def.defectCode}</span>
                    <span className="text-[8.5px] px-1 py-0.2 bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold uppercase rounded-2xs">
                      {def.severity}
                    </span>
                  </div>
                  <p className="text-neutral-300 font-sans">{def.description}</p>
                  <span className="text-[8.5px] text-neutral-500 block">
                    LOCATION: {def.locationOnGarment}
                  </span>
                </div>
              ))}
            </div>

            {/* Corrective Action Plan */}
            <div className="space-y-2">
              <span className="text-rose-400 font-bold uppercase tracking-wider block text-[9px]">
                REQUIRED CORRECTIVE ACTION:
              </span>
              <div className="p-3 bg-black/60 border border-rose-900/60 rounded-xs text-neutral-200 text-[10.5px] leading-relaxed font-sans">
                {qcRecord.correctiveAction || 'Follow master tailor re-alignment instructions.'}
              </div>

              {/* Action Button to Resubmit (Requirement 4) */}
              <button
                onClick={handleResubmitToQC}
                className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-500 text-white text-[9.5px] font-bold tracking-widest uppercase rounded-xs transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-lg"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>RE-SUBMIT REWORKED GARMENT TO QC</span>
              </button>
            </div>
          </div>

          {reworkActionNotice && (
            <div className="p-2 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-[10px] rounded-xs text-center font-bold">
              {reworkActionNotice}
            </div>
          )}
        </div>
      )}

      {/* Production State Machine Controller (Requirement 2) */}
      <ProductionStageController
        job={currentJob}
        qcRecord={qcRecord}
        onUpdateJob={handleJobUpdateInternal}
      />

      {/* Technical Specifications Viewer (Requirement 3) */}
      <div className="bg-[#0E0E0E] border border-[#2B2B2B] p-6 rounded-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2B2B2B] pb-3">
          <div className="flex items-center gap-2">
            <Ruler className="w-4 h-4 text-white" />
            <span className="text-[10px] text-white font-bold uppercase tracking-widest">
              APPROVED TECHNICAL SPECIFICATIONS & PATTERN BLUEPRINT
            </span>
          </div>
          <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest">
            SPEC V{measurementProfile.version} (SEALED)
          </span>
        </div>

        {/* Pattern & Fabrication Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[10px]">
          <div className="p-3 bg-black/60 border border-[#2B2B2B] rounded-xs space-y-1">
            <span className="text-neutral-500 uppercase text-[8px] block">SILHOUETTE / GARMENT:</span>
            <span className="font-serif text-sm text-white uppercase font-bold block">
              {product.name}
            </span>
            <span className="text-neutral-400 text-[8.5px] block font-sans">{product.collection}</span>
          </div>

          <div className="p-3 bg-black/60 border border-[#2B2B2B] rounded-xs space-y-1">
            <span className="text-neutral-500 uppercase text-[8px] block">TEXTILE SPECIFICATION:</span>
            <span className="text-white font-bold block">{product.materials[0]?.name}</span>
            <span className="text-neutral-400 text-[8.5px] block truncate font-sans">
              {product.materials[0]?.composition}
            </span>
          </div>

          <div className="p-3 bg-black/60 border border-[#2B2B2B] rounded-xs space-y-1">
            <span className="text-neutral-500 uppercase text-[8px] block">PERSONALISATION & MONOGRAM:</span>
            <span className="text-white font-bold block">
              {order.personalisation.monogram || 'NO MONOGRAM'} ({order.personalisation.monogramFont || 'Roman'})
            </span>
            <span className="text-neutral-400 text-[8.5px] block truncate font-sans">
              Buttons: {order.personalisation.buttonSelection || 'Standard'}
            </span>
          </div>
        </div>

        {/* Tailor Technical Directives */}
        <div className="p-4 bg-black border border-[#2B2B2B] rounded-xs space-y-2">
          <span className="text-[9px] text-white font-bold uppercase tracking-wider block">
            MASTER TAILOR CUTTING DIRECTIVES:
          </span>
          <p className="text-[10.5px] text-neutral-300 font-sans leading-relaxed">
            {order.personalisation.specialInstructions ||
              'Standard Daniel’s Maison canvas drape. Maintain 1.2cm shoulder roll compensation.'}
          </p>
        </div>

        {/* Approved Anatomical Measurements Table (Read-Only) */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-[9px] text-neutral-400 border-b border-[#2B2B2B] pb-1">
            <span className="uppercase font-bold text-white">ANATOMICAL METRICS MATRIX</span>
            <span>UNIT: {measurementProfile.measurements.unit.toUpperCase()}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
            {Object.entries(measurementProfile.measurements)
              .filter(([k]) => k !== 'unit')
              .map(([key, val]) => (
                <div key={key} className="p-2.5 bg-black/40 border border-[#2B2B2B] rounded-xs">
                  <span className="text-[7.5px] text-neutral-500 uppercase block truncate">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </span>
                  <span className="text-sm font-bold text-white tracking-wider">
                    {val}{' '}
                    <span className="text-[8px] text-neutral-400 font-normal">
                      {measurementProfile.measurements.unit}
                    </span>
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* Asymmetries and Posture */}
        {measurementProfile.specialRequirements.length > 0 && (
          <div className="p-4 bg-black/60 border border-[#2B2B2B] rounded-xs space-y-1.5">
            <span className="text-[9px] text-amber-300 font-bold uppercase tracking-wider block">
              POSTURAL ASYMMETRIES & BALANCE ADJUSTMENTS:
            </span>
            <ul className="text-[10px] text-neutral-300 space-y-1">
              {measurementProfile.specialRequirements.map((req, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  <span className="text-emerald-400">✓</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductionJobDetailView;
