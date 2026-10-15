/**
 * @file AdminOperationsDashboard.tsx
 * Admin & Operations Central Command.
 * Includes Operational KPI Dashboard, Master Order Management & Atelier Delegation,
 * Quality Control Workbench, Finance & Payment Reconciliation, Logistics Console,
 * and Security Audit Explorer.
 */

import React, { useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  MOCK_ORDERS,
  MOCK_PRODUCTS,
  MOCK_CUSTOMERS,
  MOCK_PARTNERS,
  MOCK_QC_RECORDS,
  MOCK_INVOICE_PAYMENTS,
} from '../../mock/danielsMockData';
import { Order, OrderStatus, QCRecord, InvoicePayment, CustomerVipLevel } from '../../types/daniels.types';
import { OrderAssignmentModal } from './OrderAssignmentModal';
import { QCInspectionWorkspace } from './QCInspectionWorkspace';
import { LogisticsManagerView } from './LogisticsManagerView';
import { AuditTrailExplorer } from './AuditTrailExplorer';
import { AcceptanceTestRunner } from '../qa/AcceptanceTestRunner';
import { ProtectedRoute } from '../auth/ProtectedRoute';
import {
  Activity,
  Package,
  ShieldCheck,
  Truck,
  DollarSign,
  Lock,
  Building,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Filter,
  Search,
  Plus,
  ArrowRight,
  TrendingUp,
  FileCheck,
} from 'lucide-react';

interface AdminOperationsDashboardProps {
  onNavigateHome?: () => void;
}

export const AdminOperationsDashboard: React.FC<AdminOperationsDashboardProps> = ({
  onNavigateHome,
}) => {
  const { currentUser, currentRole } = useAuth();

  // Orders State
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [invoices, setInvoices] = useState<InvoicePayment[]>(MOCK_INVOICE_PAYMENTS);

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    'kpis' | 'orders' | 'qc' | 'finance' | 'logistics' | 'audit' | 'acceptance'
  >('kpis');

  // Filter States for Master Order Table
  const [searchOrderText, setSearchOrderText] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('ALL');
  const [partnerFilter, setPartnerFilter] = useState<string>('ALL');
  const [vipFilter, setVipFilter] = useState<string>('ALL');

  // Modal State for Partner Assignment
  const [assignmentModalOpen, setAssignmentModalOpen] = useState(false);
  const [orderToAssign, setOrderToAssign] = useState<Order | null>(null);

  // 1. KPI COMPUTATIONS (Requirement 1)
  const kpiData = useMemo(() => {
    const activeOrders = orders.filter((o) => !['Closed', 'Cancelled'].includes(o.status));
    const totalOrderValue = activeOrders.reduce((sum, o) => sum + o.pricing.total, 0);

    // Production bottlenecks: Orders in 'In Production' or 'Rework Required'
    const bottlenecks = orders.filter((o) => ['In Production', 'Rework Required'].includes(o.status));

    // QC Rejection rate
    const totalQC = MOCK_QC_RECORDS.length;
    const failedQC = MOCK_QC_RECORDS.filter((q) => q.result === 'Fail').length;
    const qcRejectionRate = totalQC > 0 ? Math.round((failedQC / totalQC) * 100) : 0;

    // Partner Capacity: Biella Craft has capacity 45/month
    const biellaCapacityUsed = orders.filter(
      (o) => o.partnerId === 'ptnr_biella_01' && o.status !== 'Delivered'
    ).length;
    const biellaMaxCapacity = MOCK_PARTNERS[0]?.capabilities.capacityPerMonth || 45;

    // Revenue breakdown
    const paidRevenue = invoices
      .filter((i) => i.status === 'Paid')
      .reduce((sum, i) => sum + i.amount, 0);
    const pendingRevenue = invoices
      .filter((i) => i.status === 'Part Paid' || i.status === 'Pending')
      .reduce((sum, i) => sum + i.amount, 0);

    return {
      activeOrdersCount: activeOrders.length,
      totalOrderValue,
      bottlenecksCount: bottlenecks.length,
      qcRejectionRate,
      partnerCapacityUsed: biellaCapacityUsed,
      partnerMaxCapacity: biellaMaxCapacity,
      paidRevenue,
      pendingRevenue,
    };
  }, [orders, invoices]);

  // Master Order Table Filtering
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const customer = MOCK_CUSTOMERS.find((c) => c.id === o.customerId);
      const product = MOCK_PRODUCTS.find((p) => p.id === o.productId);

      const matchesSearch =
        searchOrderText === '' ||
        o.id.toLowerCase().includes(searchOrderText.toLowerCase()) ||
        (customer && customer.profile.lastName.toLowerCase().includes(searchOrderText.toLowerCase())) ||
        (product && product.name.toLowerCase().includes(searchOrderText.toLowerCase()));

      const matchesStage = stageFilter === 'ALL' || o.status === stageFilter;
      const matchesPartner =
        partnerFilter === 'ALL' ||
        (partnerFilter === 'UNASSIGNED' ? !o.partnerId : o.partnerId === partnerFilter);
      const matchesVip = vipFilter === 'ALL' || (customer && customer.vipLevel === vipFilter);

      return matchesSearch && matchesStage && matchesPartner && matchesVip;
    });
  }, [orders, searchOrderText, stageFilter, partnerFilter, vipFilter]);

  const handleOrderUpdated = (updatedOrder: Order) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
    );
  };

  const handleAssignPartnerConfirm = (
    orderId: string,
    partnerId: string,
    deadlines: { startExpected: string; targetFinish: string },
    notes: string
  ) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              partnerId,
              status: o.status === 'Draft' || o.status === 'Confirmed' ? 'In Production' : o.status,
              dates: { ...o.dates, due: deadlines.targetFinish },
            }
          : o
      )
    );
  };

  return (
    <ProtectedRoute
      module="Orders"
      action="view"
      onNavigateBack={onNavigateHome}
    >
      <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-12 space-y-8 animate-fadeIn font-mono text-left">
        {/* Admin Command Header */}
        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6 bg-[#0E0E0E] border border-[#2B2B2B] p-6 rounded-sm">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-sm bg-black border border-[#2B2B2B] flex items-center justify-center text-white shrink-0">
              <Activity className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-serif text-xl sm:text-2xl text-white uppercase font-bold tracking-wider">
                  OPERATIONS & PRODUCTION COMMAND
                </h1>
                <span className="text-[8.5px] px-2 py-0.5 bg-white/10 text-white border border-white/20 uppercase font-bold rounded-2xs">
                  ROLE: {currentRole}
                </span>
              </div>
              <p className="text-[10px] text-neutral-400 font-sans mt-0.5">
                Centralized supervisory suite for atelier allocation, tolerances inspection, and global distribution.
              </p>
            </div>
          </div>

          {/* Master Tabs (Responsive for phones, tablets & desktop) */}
          <div className="flex flex-wrap border border-[#2B2B2B] rounded-xs overflow-hidden text-[9px] sm:text-[9.5px] bg-black/40 w-full lg:w-auto">
            {[
              { id: 'kpis', label: 'PIPELINE KPIS', icon: TrendingUp },
              { id: 'orders', label: 'ORDERS & ATELIERS', icon: Package },
              { id: 'qc', label: 'QC WORKBENCH', icon: ShieldCheck },
              { id: 'finance', label: 'FINANCE & BILLING', icon: DollarSign },
              { id: 'logistics', label: 'LOGISTICS CONSOLE', icon: Truck },
              { id: 'audit', label: 'AUDIT EXPLORER', icon: Lock },
              { id: 'acceptance', label: 'ACCEPTANCE TESTS (10)', icon: FileCheck },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 sm:flex-initial px-3 sm:px-3.5 py-2 uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-white text-black font-bold shadow-md'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ======================================================== */}
        {/* TAB 1: OPERATIONAL KPI DASHBOARD (Requirement 1) */}
        {/* ======================================================== */}
        {activeTab === 'kpis' && (
          <div className="space-y-8 animate-fadeIn">
            {/* KPI Metrics Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Metric 1: Active Orders */}
              <div className="p-5 bg-[#0E0E0E] border border-[#2B2B2B] rounded-sm space-y-1">
                <span className="text-[8.5px] text-neutral-500 uppercase tracking-widest block">
                  ACTIVE COMMISSIONS PIPELINE
                </span>
                <span className="font-serif text-3xl text-white font-bold tracking-wider block">
                  {kpiData.activeOrdersCount} COMMISSIONS
                </span>
                <span className="text-[9px] text-emerald-400 font-bold block">
                  Gross Value: £{kpiData.totalOrderValue.toLocaleString()}
                </span>
              </div>

              {/* Metric 2: Production Bottlenecks */}
              <div className="p-5 bg-[#0E0E0E] border border-[#2B2B2B] rounded-sm space-y-1">
                <span className="text-[8.5px] text-amber-400 uppercase tracking-widest block font-bold">
                  PRODUCTION BOTTLENECKS
                </span>
                <span className="font-serif text-3xl text-amber-300 font-bold tracking-wider block">
                  {kpiData.bottlenecksCount} IN CRITICAL CRAFT
                </span>
                <span className="text-[9px] text-neutral-400 font-sans block">
                  Requires tailor basting or rework inspection
                </span>
              </div>

              {/* Metric 3: QC Rejection Rate */}
              <div className="p-5 bg-[#0E0E0E] border border-[#2B2B2B] rounded-sm space-y-1">
                <span className="text-[8.5px] text-rose-400 uppercase tracking-widest block font-bold">
                  QC REJECTION TOLERANCE RATE
                </span>
                <span className="font-serif text-3xl text-rose-400 font-bold tracking-wider block">
                  {kpiData.qcRejectionRate}% REWORK
                </span>
                <span className="text-[9px] text-neutral-400 font-sans block">
                  Enforces zero-tolerance luxury benchmark
                </span>
              </div>

              {/* Metric 4: Partner Capacity */}
              <div className="p-5 bg-[#0E0E0E] border border-[#2B2B2B] rounded-sm space-y-1">
                <span className="text-[8.5px] text-neutral-500 uppercase tracking-widest block">
                  BIELLA WORKSHOP CAPACITY
                </span>
                <span className="font-serif text-3xl text-white font-bold tracking-wider block">
                  {kpiData.partnerCapacityUsed} / {kpiData.partnerMaxCapacity} SUITS
                </span>
                <div className="w-full bg-[#1A1A1A] h-1.5 rounded-full overflow-hidden mt-1">
                  <div
                    className="bg-emerald-400 h-full"
                    style={{
                      width: `${(kpiData.partnerCapacityUsed / kpiData.partnerMaxCapacity) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Financial Summary & Settlement Status (Requirement 4) */}
            <div className="bg-[#0E0E0E] border border-[#2B2B2B] p-6 rounded-sm space-y-4">
              <span className="text-[10px] text-white font-bold uppercase tracking-widest block border-b border-[#2B2B2B] pb-2">
                REVENUE ACCRUAL & FINANCIAL RECONCILIATION SUMMARY
              </span>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-black/60 border border-[#2B2B2B] rounded-xs space-y-1">
                  <span className="text-[8px] text-neutral-500 uppercase block">SETTLED INVOICES:</span>
                  <span className="font-serif text-2xl text-emerald-400 font-bold">
                    £{kpiData.paidRevenue.toLocaleString()}
                  </span>
                  <span className="text-[8.5px] text-neutral-400 block font-sans">
                    Fully cleared into primary accounts
                  </span>
                </div>

                <div className="p-4 bg-black/60 border border-[#2B2B2B] rounded-xs space-y-1">
                  <span className="text-[8px] text-neutral-500 uppercase block">IN-PROGRESS ESCROW & DEPOSITS:</span>
                  <span className="font-serif text-2xl text-amber-300 font-bold">
                    £{kpiData.pendingRevenue.toLocaleString()}
                  </span>
                  <span className="text-[8.5px] text-neutral-400 block font-sans">
                    Pending final garment delivery clearance
                  </span>
                </div>

                <div className="p-4 bg-black/60 border border-[#2B2B2B] rounded-xs space-y-1">
                  <span className="text-[8px] text-neutral-500 uppercase block">TOTAL PIPELINE VALUE:</span>
                  <span className="font-serif text-2xl text-white font-bold">
                    £{(kpiData.paidRevenue + kpiData.pendingRevenue).toLocaleString()}
                  </span>
                  <span className="text-[8.5px] text-neutral-400 block font-sans">
                    Combined commission receivables
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: ORDER MANAGEMENT & ATELIER ASSIGNMENT (Requirement 2) */}
        {/* ======================================================== */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Filter Bar */}
            <div className="bg-[#0E0E0E] border border-[#2B2B2B] p-4 rounded-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-[10px]">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchOrderText}
                  onChange={(e) => setSearchOrderText(e.target.value)}
                  placeholder="Filter by Order, Client, Garment..."
                  className="w-full bg-[#050505] border border-[#2B2B2B] focus:border-white pl-9 pr-3 py-2 rounded-xs text-white text-[10px] outline-none placeholder-neutral-700"
                />
              </div>

              <div>
                <select
                  value={stageFilter}
                  onChange={(e) => setStageFilter(e.target.value)}
                  className="w-full bg-[#050505] border border-[#2B2B2B] focus:border-white p-2 rounded-xs text-white text-[10px] outline-none"
                >
                  <option value="ALL">ALL PIPELINE STAGES</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="In Production">In Production</option>
                  <option value="QC">QC</option>
                  <option value="Rework Required">Rework Required</option>
                  <option value="Ready">Ready</option>
                  <option value="Dispatched">Dispatched</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>

              <div>
                <select
                  value={partnerFilter}
                  onChange={(e) => setPartnerFilter(e.target.value)}
                  className="w-full bg-[#050505] border border-[#2B2B2B] focus:border-white p-2 rounded-xs text-white text-[10px] outline-none"
                >
                  <option value="ALL">ALL PARTNERS</option>
                  <option value="ptnr_biella_01">Atelier Biella</option>
                  <option value="UNASSIGNED">Unassigned Only</option>
                </select>
              </div>

              <div>
                <select
                  value={vipFilter}
                  onChange={(e) => setVipFilter(e.target.value)}
                  className="w-full bg-[#050505] border border-[#2B2B2B] focus:border-white p-2 rounded-xs text-white text-[10px] outline-none"
                >
                  <option value="ALL">ALL CLIENT TIERS</option>
                  <option value="Private Client">Private Client</option>
                  <option value="Platinum">Platinum</option>
                  <option value="Gold">Gold</option>
                  <option value="Standard">Standard</option>
                </select>
              </div>
            </div>

            {/* Master Orders Table */}
            <div className="bg-[#0E0E0E] border border-[#2B2B2B] p-6 rounded-sm space-y-4">
              <div className="flex justify-between items-center text-[9px] text-neutral-500 border-b border-[#2B2B2B] pb-2">
                <span>COMMISSIONS REGISTER ({filteredOrders.length})</span>
                <span>SINGLE SOURCE OF TRUTH PIPELINE</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-[10px] text-left">
                  <thead>
                    <tr className="border-b border-[#2B2B2B] text-neutral-500 text-[8.5px] uppercase tracking-wider">
                      <th className="py-2.5 pr-4">ORDER ID</th>
                      <th className="py-2.5 px-3">CLIENT & TIER</th>
                      <th className="py-2.5 px-3">GARMENT SPEC</th>
                      <th className="py-2.5 px-3">ATELIER PARTNER</th>
                      <th className="py-2.5 px-3">DUE DATE</th>
                      <th className="py-2.5 px-3">STAGE STATUS</th>
                      <th className="py-2.5 pl-3 text-right">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2B2B2B]/60">
                    {filteredOrders.map((ord) => {
                      const customer = MOCK_CUSTOMERS.find((c) => c.id === ord.customerId);
                      const product = MOCK_PRODUCTS.find((p) => p.id === ord.productId);

                      return (
                        <tr key={ord.id} className="hover:bg-white/5 transition-colors">
                          <td className="py-3.5 pr-4 font-bold text-white font-mono">{ord.id}</td>
                          <td className="py-3.5 px-3">
                            <div className="font-bold text-white">
                              {customer?.profile.firstName} {customer?.profile.lastName}
                            </div>
                            <span className="text-[8px] text-emerald-400 uppercase font-bold">
                              {customer?.vipLevel}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 font-serif uppercase font-bold text-neutral-200 truncate max-w-[180px]">
                            {product?.name}
                          </td>
                          <td className="py-3.5 px-3 font-mono">
                            {ord.partnerId ? (
                              <span className="text-neutral-300">{ord.partnerId}</span>
                            ) : (
                              <span className="text-amber-400 font-bold">[UNASSIGNED]</span>
                            )}
                          </td>
                          <td className="py-3.5 px-3 text-neutral-400">
                            {new Date(ord.dates.due).toLocaleDateString('en-GB')}
                          </td>
                          <td className="py-3.5 px-3">
                            <span
                              className={`text-[8px] font-bold px-2 py-0.5 rounded-2xs uppercase tracking-widest ${
                                ord.status === 'Delivered'
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                  : ord.status === 'Rework Required'
                                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                                  : ord.status === 'In Production'
                                  ? 'bg-white/10 text-white border border-white/20'
                                  : 'bg-neutral-800 text-neutral-300'
                              }`}
                            >
                              {ord.status}
                            </span>
                          </td>
                          <td className="py-3.5 pl-3 text-right">
                            <button
                              onClick={() => {
                                setOrderToAssign(ord);
                                setAssignmentModalOpen(true);
                              }}
                              className="py-1 px-3 bg-white hover:bg-neutral-200 text-black text-[8.5px] font-bold uppercase rounded-xs transition-colors cursor-pointer"
                            >
                              ASSIGN ATELIER
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: QUALITY CONTROL WORKSPACE (Requirement 3) */}
        {/* ======================================================== */}
        {activeTab === 'qc' && (
          <QCInspectionWorkspace
            orders={orders}
            onOrderUpdated={handleOrderUpdated}
          />
        )}

        {/* ======================================================== */}
        {/* TAB 4: FINANCE & PAYMENT RECONCILIATION (Requirement 4) */}
        {/* ======================================================== */}
        {activeTab === 'finance' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-[#0E0E0E] border border-[#2B2B2B] p-6 rounded-sm space-y-4">
              <div className="flex justify-between items-center text-[10px] text-white border-b border-[#2B2B2B] pb-2 font-bold uppercase">
                <span>INVOICE LEDGER & CLIENT SETTLEMENT RECONCILIATION</span>
                <span className="text-neutral-500 font-normal">
                  ENTRIES: {invoices.length}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-[10px] text-left">
                  <thead>
                    <tr className="border-b border-[#2B2B2B] text-neutral-500 text-[8.5px] uppercase tracking-wider">
                      <th className="py-2.5 pr-4">INVOICE ID</th>
                      <th className="py-2.5 px-3">ORDER REF</th>
                      <th className="py-2.5 px-3">AMOUNT</th>
                      <th className="py-2.5 px-3">METHOD</th>
                      <th className="py-2.5 px-3">REFERENCE</th>
                      <th className="py-2.5 px-3">STATUS</th>
                      <th className="py-2.5 pl-3 text-right">DATE LOGGED</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2B2B2B]/60">
                    {invoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3 pr-4 font-bold text-white font-mono">{inv.id}</td>
                        <td className="py-3 px-3 text-neutral-300 font-mono">{inv.orderId}</td>
                        <td className="py-3 px-3 font-bold text-white">
                          £{inv.amount.toLocaleString()}
                        </td>
                        <td className="py-3 px-3 text-neutral-300">{inv.method}</td>
                        <td className="py-3 px-3 font-mono text-neutral-400">{inv.reference}</td>
                        <td className="py-3 px-3">
                          <span
                            className={`text-[8px] font-bold px-2 py-0.5 rounded-2xs uppercase tracking-widest ${
                              inv.status === 'Paid'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                : inv.status === 'Part Paid'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                            }`}
                          >
                            {inv.status}
                          </span>
                        </td>
                        <td className="py-3 pl-3 text-right text-neutral-400">
                          {new Date(inv.timestamps.createdAt).toLocaleDateString('en-GB')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: LOGISTICS & DISPATCH MANAGER (Requirement 5) */}
        {/* ======================================================== */}
        {activeTab === 'logistics' && (
          <LogisticsManagerView
            orders={orders}
            onOrderUpdated={handleOrderUpdated}
          />
        )}

        {/* ======================================================== */}
        {/* TAB 6: SECURITY & AUDIT TRAIL EXPLORER (Requirement 6) */}
        {/* ======================================================== */}
        {activeTab === 'audit' && <AuditTrailExplorer />}

        {/* ======================================================== */}
        {/* TAB 7: ACCEPTANCE TEST RUNNER (10 Technical Specs) */}
        {/* ======================================================== */}
        {activeTab === 'acceptance' && <AcceptanceTestRunner />}

        {/* Partner Allocation Modal */}
        <OrderAssignmentModal
          isOpen={assignmentModalOpen}
          onClose={() => setAssignmentModalOpen(false)}
          order={orderToAssign}
          onAssignPartner={handleAssignPartnerConfirm}
        />
      </div>
    </ProtectedRoute>
  );
};

export default AdminOperationsDashboard;
