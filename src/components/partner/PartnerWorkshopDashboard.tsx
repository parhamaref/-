/**
 * @file PartnerWorkshopDashboard.tsx
 * Master Workbench Portal for external workshop tailors, master cutters, and craft ateliers.
 * Strictly enforces Partner Data Isolation, Production State Machine progression,
 * and QC defect resolution workflows.
 */

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  MOCK_ORDERS,
  MOCK_PRODUCTION_JOBS,
  MOCK_PRODUCTS,
  MOCK_QC_RECORDS,
  MOCK_PARTNERS,
} from '../../mock/danielsMockData';
import { ProductionJob, Order } from '../../types/daniels.types';
import { ProductionJobDetailView } from './ProductionJobDetailView';
import { PartnerEarningsView } from './PartnerEarningsView';
import { ProtectedRoute } from '../auth/ProtectedRoute';
import {
  Scissors,
  Layers,
  AlertTriangle,
  DollarSign,
  ShieldCheck,
  Clock,
  ArrowRight,
  Sparkles,
  Building,
  CheckCircle2,
} from 'lucide-react';

interface PartnerWorkshopDashboardProps {
  onNavigateHome?: () => void;
}

export const PartnerWorkshopDashboard: React.FC<PartnerWorkshopDashboardProps> = ({
  onNavigateHome,
}) => {
  const { currentUser, partnerData, currentRole } = useAuth();

  // Partner ID resolution (defaults to Biella Master Craft)
  const currentPartnerId = partnerData?.id || 'ptnr_biella_01';
  const partnerProfile =
    partnerData || MOCK_PARTNERS.find((p) => p.id === currentPartnerId) || MOCK_PARTNERS[0];

  // STRICT PARTNER ISOLATION (Requirement 1):
  // Filter all jobs and orders so the logged-in partner only sees assigned records
  const [productionJobs, setProductionJobs] = useState<ProductionJob[]>(() => {
    return MOCK_PRODUCTION_JOBS.filter((j) => j.partnerId === currentPartnerId);
  });

  const assignedOrders = MOCK_ORDERS.filter((o) => o.partnerId === currentPartnerId);

  // Tab state
  const [activeTab, setActiveTab] = useState<'jobs' | 'rework' | 'earnings'>('jobs');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  // Selected job for detail view
  const selectedJob = productionJobs.find((j) => j.id === selectedJobId) || null;
  const selectedOrder = selectedJob
    ? assignedOrders.find((o) => o.id === selectedJob.orderId) || assignedOrders[0]
    : null;

  // Filter jobs requiring rework (Requirement 4)
  const reworkJobs = productionJobs.filter((j) => {
    const qc = MOCK_QC_RECORDS.find((q) => q.orderId === j.orderId);
    return j.stage === 'Rework' || qc?.result === 'Fail';
  });

  const handleJobUpdate = (updatedJob: ProductionJob) => {
    setProductionJobs((prev) =>
      prev.map((j) => (j.id === updatedJob.id ? updatedJob : j))
    );
  };

  return (
    <ProtectedRoute
      module="Production"
      action="operational"
      resourceContext={{ partnerId: currentPartnerId, ownerId: currentUser?.id }}
      onNavigateBack={onNavigateHome}
    >
      <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-12 space-y-8 animate-fadeIn font-mono text-left">
        {/* Detail view overlay when a job is selected */}
        {selectedJob && selectedOrder ? (
          <ProductionJobDetailView
            job={selectedJob}
            order={selectedOrder}
            onBack={() => setSelectedJobId(null)}
            onJobUpdated={handleJobUpdate}
          />
        ) : (
          <div className="space-y-8">
            {/* Atelier Identity & Capacity Header */}
            <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6 bg-[#0E0E0E] border border-[#2B2B2B] p-6 rounded-sm">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-sm bg-black border border-[#2B2B2B] flex items-center justify-center text-white shrink-0">
                  <Scissors className="w-7 h-7 text-emerald-400" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h1 className="font-serif text-xl sm:text-2xl text-white uppercase font-bold tracking-wider">
                      {partnerProfile.businessDetails.legalBusinessName}
                    </h1>
                    <span className="text-[8px] px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase font-bold rounded-2xs">
                      {partnerProfile.verificationStatus}
                    </span>
                  </div>
                  <p className="text-[10px] text-neutral-400 font-sans">
                    {partnerProfile.businessDetails.address.city}, {partnerProfile.businessDetails.address.country} • Workshop Code:{' '}
                    <span className="text-white font-mono">{currentPartnerId}</span>
                  </p>
                </div>
              </div>

              {/* Monthly Capacity & Isolation Metrics */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 border-t lg:border-t-0 border-[#2B2B2B] pt-4 lg:pt-0">
                <div className="text-left sm:text-right">
                  <span className="text-[8px] text-neutral-500 uppercase block">WORKSHOP CAPACITY:</span>
                  <span className="text-sm text-white font-bold tracking-wider">
                    {productionJobs.length} / {partnerProfile.capabilities.capacityPerMonth} SUITS/MO
                  </span>
                  <span className="text-[8px] text-emerald-400 block font-bold">
                    DATA ISOLATION: ACTIVE
                  </span>
                </div>

                {/* Subtabs (Responsive for phones, tablets & desktops) */}
                <div className="flex flex-wrap sm:flex-nowrap border border-[#2B2B2B] rounded-xs overflow-hidden text-[9.5px] sm:text-[10px] bg-black/40 w-full sm:w-auto">
                  <button
                    onClick={() => setActiveTab('jobs')}
                    className={`flex-1 sm:flex-initial px-3 sm:px-3.5 py-2 uppercase tracking-wider transition-colors text-center cursor-pointer ${
                      activeTab === 'jobs'
                        ? 'bg-white text-black font-bold shadow-md'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    ASSIGNED JOBS ({productionJobs.length})
                  </button>

                  <button
                    onClick={() => setActiveTab('rework')}
                    className={`flex-1 sm:flex-initial px-3 sm:px-3.5 py-2 uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                      activeTab === 'rework'
                        ? 'bg-rose-600 text-white font-bold shadow-md'
                        : reworkJobs.length > 0
                        ? 'text-rose-400 hover:text-rose-300'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {reworkJobs.length > 0 && <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />}
                    <span>REWORK ({reworkJobs.length})</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('earnings')}
                    className={`flex-1 sm:flex-initial px-3 sm:px-3.5 py-2 uppercase tracking-wider transition-colors text-center cursor-pointer ${
                      activeTab === 'earnings'
                        ? 'bg-white text-black font-bold shadow-md'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    EARNINGS & PAYOUTS
                  </button>
                </div>
              </div>
            </div>

            {/* TAB 1: ALL ASSIGNED JOBS (Strict Isolation) */}
            {activeTab === 'jobs' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px] text-neutral-400 border-b border-[#2B2B2B] pb-2">
                  <span className="uppercase font-bold tracking-widest text-white">
                    ASSIGNED ATELIER CUTTING & MAKING QUEUE
                  </span>
                  <span className="text-[8.5px] text-neutral-500">
                    STRICT PARTNER ISOLATION: FILTERED TO {currentPartnerId}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {productionJobs.map((job) => {
                    const order = assignedOrders.find((o) => o.id === job.orderId);
                    const product = MOCK_PRODUCTS.find((p) => p.id === order?.productId);
                    const qc = MOCK_QC_RECORDS.find((q) => q.orderId === job.orderId);
                    const hasDefect = qc?.result === 'Fail';

                    return (
                      <div
                        key={job.id}
                        className={`p-5 rounded-sm border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                          hasDefect
                            ? 'bg-[#0E0E0E] border-rose-900/60 hover:border-rose-500'
                            : 'bg-[#0E0E0E] border-[#2B2B2B] hover:border-white/40'
                        }`}
                      >
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2.5">
                            <span className="text-[11px] font-bold text-white tracking-wider">
                              JOB: {job.id}
                            </span>
                            <span className="text-neutral-600">/</span>
                            <span className="text-[10px] text-neutral-400">
                              ORDER: {job.orderId}
                            </span>
                            {hasDefect && (
                              <span className="text-[8px] px-1.5 py-0.5 bg-rose-500/20 text-rose-400 border border-rose-500/40 uppercase font-bold rounded-2xs flex items-center gap-1">
                                <AlertTriangle className="w-2.5 h-2.5" />
                                REWORK REQUIRED
                              </span>
                            )}
                          </div>

                          <div className="font-serif text-lg text-white uppercase font-bold">
                            {product?.name || 'Bespoke Garment'}
                          </div>

                          <div className="text-[9.5px] text-neutral-400 font-sans">
                            Fabric: {product?.materials[0]?.name} • Monogram:{' '}
                            <span className="text-white font-bold">{order?.personalisation.monogram || 'N/A'}</span>
                          </div>
                        </div>

                        {/* Stage & Progress */}
                        <div className="flex flex-col md:items-end gap-2 md:w-64">
                          <div className="flex items-center gap-2">
                            <span className="text-[8.5px] text-neutral-500 uppercase">STAGE:</span>
                            <span
                              className={`text-[9.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-2xs ${
                                job.stage === 'Complete'
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : job.stage === 'Rework'
                                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                  : 'bg-white/10 text-white border border-white/20'
                              }`}
                            >
                              {job.stage}
                            </span>
                          </div>

                          {/* Mini Progress Bar */}
                          <div className="w-full bg-[#1A1A1A] h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-emerald-400 h-full transition-all duration-300"
                              style={{ width: `${job.progress}%` }}
                            />
                          </div>
                          <span className="text-[8px] text-neutral-500">
                            PROGRESS: {job.progress}% • TARGET: {new Date(job.deadlines.targetFinish).toLocaleDateString('en-GB')}
                          </span>
                        </div>

                        {/* Workbench Action */}
                        <button
                          onClick={() => setSelectedJobId(job.id)}
                          className="py-2 px-4 bg-white hover:bg-neutral-200 text-black text-[9.5px] font-bold tracking-widest uppercase rounded-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 shrink-0 shadow-md"
                        >
                          <span>OPEN WORKBENCH</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: REWORK REQUIRED QUEUE (Requirement 4) */}
            {activeTab === 'rework' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px] text-rose-300 border-b border-rose-900/40 pb-2">
                  <span className="uppercase font-bold tracking-widest flex items-center gap-2">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    DEFECT CORRECTIVE ACTION WORKBENCH
                  </span>
                  <span className="text-[8.5px] text-neutral-500">
                    ITEMS FLAGGED BY QUALITY CONTROL (QC)
                  </span>
                </div>

                {reworkJobs.length === 0 ? (
                  <div className="p-12 bg-[#0E0E0E] border border-[#2B2B2B] rounded-sm text-center text-neutral-500 space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                    <p className="uppercase tracking-widest text-[11px] text-white">ALL COMMISSIONS COMPLIANT</p>
                    <p className="text-[9.5px] text-neutral-400 font-sans">
                      Zero defects recorded across your active atelier cutting queue.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {reworkJobs.map((job) => {
                      const order = assignedOrders.find((o) => o.id === job.orderId);
                      const product = MOCK_PRODUCTS.find((p) => p.id === order?.productId);
                      const qc = MOCK_QC_RECORDS.find((q) => q.orderId === job.orderId);

                      return (
                        <div
                          key={job.id}
                          className="p-5 bg-rose-950/20 border border-rose-500/50 rounded-sm space-y-3"
                        >
                          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-rose-900/40 pb-2">
                            <div>
                              <span className="text-rose-400 font-bold text-xs uppercase">
                                JOB {job.id} — ORDER {job.orderId}
                              </span>
                              <h4 className="font-serif text-base text-white uppercase font-bold">
                                {product?.name}
                              </h4>
                            </div>
                            <button
                              onClick={() => setSelectedJobId(job.id)}
                              className="py-1.5 px-4 bg-rose-600 hover:bg-rose-500 text-white text-[9px] font-bold tracking-widest uppercase rounded-xs transition-colors cursor-pointer self-start sm:self-auto"
                            >
                              RESOLVE & RE-SUBMIT TO QC
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[10px]">
                            <div className="space-y-1">
                              <span className="text-neutral-500 uppercase block text-[8px]">
                                DEFECT SUMMARY:
                              </span>
                              {qc?.defects.map((d, i) => (
                                <p key={i} className="text-rose-300 font-sans">
                                  • [{d.defectCode}] {d.description} ({d.locationOnGarment})
                                </p>
                              ))}
                            </div>

                            <div className="space-y-1">
                              <span className="text-neutral-500 uppercase block text-[8px]">
                                CORRECTIVE ACTION DIRECTIVE:
                              </span>
                              <p className="text-neutral-200 font-sans">
                                {qc?.correctiveAction || 'Re-inspect alignment and notify inspector.'}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: EARNINGS & PAYOUTS (Requirement 5) */}
            {activeTab === 'earnings' && (
              <PartnerEarningsView
                partnerId={currentPartnerId}
                partnerDetails={partnerProfile}
              />
            )}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default PartnerWorkshopDashboard;
