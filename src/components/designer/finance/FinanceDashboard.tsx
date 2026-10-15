/**
 * @file FinanceDashboard.tsx
 * Enterprise Designer Finance Dashboard for haute bespoke ateliers.
 * Features Revenue & Earnings Tracking, Payout History, Withdraw Requests,
 * Transaction Ledgers, Itemized VAT Invoices, Charts, Reports, CSV Export, and PDF Export.
 */

import React, { useState } from 'react';
import {
  Wallet,
  TrendingUp,
  ArrowDownToLine,
  ArrowUpRight,
  FileText,
  DollarSign,
  Download,
  Printer,
  Calendar,
  Filter,
  Search,
  CheckCircle2,
  Clock,
  Building2,
  PieChart,
  BarChart3,
  RotateCcw,
  Plus,
  ShieldCheck,
  CreditCard,
  Layers,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { useFinanceStore } from '../../../stores/financeStore';
import {
  FinanceTransaction,
  PayoutRecord,
  AtelierInvoice,
  TransactionType,
  PayoutStatus,
} from '../../../types/finance.types';
import { WithdrawalModal } from './WithdrawalModal';
import { InvoicePdfModal } from './InvoicePdfModal';
import { NewInvoiceModal } from './NewInvoiceModal';

export type FinanceTab = 'overview' | 'transactions' | 'payouts' | 'invoices' | 'reports';

export const FinanceDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FinanceTab>('overview');

  const {
    transactions,
    payouts,
    invoices,
    bankAccounts,
    summary,
    requestWithdrawal,
    cancelWithdrawal,
    createInvoice,
    markInvoicePaid,
    deleteInvoice,
    exportTransactionsCsv,
    exportFinancialReportCsv,
    resetToDefaults,
  } = useFinanceStore();

  // Modals state
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isNewInvoiceOpen, setIsNewInvoiceOpen] = useState(false);
  const [selectedPdfInvoice, setSelectedPdfInvoice] = useState<AtelierInvoice | null>(null);

  // Filters
  const [txSearch, setTxSearch] = useState('');
  const [txTypeFilter, setTxTypeFilter] = useState<string>('ALL');
  const [invoiceFilter, setInvoiceFilter] = useState<string>('ALL');

  // Notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // CSV Exporters
  const handleDownloadTransactionsCsv = () => {
    const csvContent = exportTransactionsCsv();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `atelier_transactions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Transactions ledger exported as CSV.');
  };

  const handleDownloadReportCsv = () => {
    const csvContent = exportFinancialReportCsv();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `atelier_financial_report_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Financial annual report exported as CSV.');
  };

  const handlePrintFullReport = () => {
    window.print();
  };

  // Filtered Transactions
  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.reference.toLowerCase().includes(txSearch.toLowerCase()) ||
      tx.description.toLowerCase().includes(txSearch.toLowerCase()) ||
      (tx.clientName && tx.clientName.toLowerCase().includes(txSearch.toLowerCase())) ||
      (tx.orderNumber && tx.orderNumber.toLowerCase().includes(txSearch.toLowerCase()));

    const matchesType = txTypeFilter === 'ALL' || tx.type === txTypeFilter;
    return matchesSearch && matchesType;
  });

  // Filtered Invoices
  const filteredInvoices = invoices.filter((inv) => {
    if (invoiceFilter === 'paid') return inv.status === 'paid';
    if (invoiceFilter === 'pending') return inv.status === 'pending';
    if (invoiceFilter === 'overdue') return inv.status === 'overdue';
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-[#181818] border border-emerald-500/50 rounded-xl shadow-2xl flex items-center gap-3 text-xs text-white max-w-md animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="flex-1 font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#222] pb-5">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-serif font-bold text-white tracking-wide">
                Finance & Revenue Treasury
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">
                Stripe Connect escrow balances, payout clearing, gross commission ledgers, and UK VAT invoices
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-end md:self-auto">
          <button
            onClick={() => setIsWithdrawModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-semibold rounded-lg transition-colors shadow-lg shadow-emerald-500/20"
          >
            <ArrowDownToLine className="w-4 h-4" />
            <span>Withdraw Funds</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm('Reset finance ledger to default Savile Row atelier records?')) {
                resetToDefaults();
                showToast('Financial ledger reset to demo defaults.');
              }
            }}
            className="flex items-center gap-1.5 px-3 py-2 text-xs text-gray-400 hover:text-white bg-[#181818] hover:bg-[#222] rounded-lg border border-[#333] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Executive Balance Metric Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Available to Withdraw */}
        <div className="p-5 bg-[#141414] border border-[#222] rounded-xl relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>Available to Withdraw</span>
            <span className="text-emerald-400 font-mono text-[10px] px-1.5 py-0.5 bg-emerald-500/10 rounded border border-emerald-500/20 font-bold">
              CLEARED
            </span>
          </div>
          <div className="text-3xl font-serif font-bold text-emerald-400">
            £{summary.availableBalanceGbp.toLocaleString()}
          </div>
          <span className="text-[11px] text-gray-500 block mt-1">
            Settled via Barclays & Stripe
          </span>
        </div>

        {/* Pending Escrow */}
        <div className="p-5 bg-[#141414] border border-[#222] rounded-xl relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>Pending Escrow Vault</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-mono font-bold text-amber-400">
            £{summary.pendingEscrowBalanceGbp.toLocaleString()}
          </div>
          <span className="text-[11px] text-gray-500 block mt-1">
            Released upon client fitting signoff
          </span>
        </div>

        {/* Gross Revenue */}
        <div className="p-5 bg-[#141414] border border-[#222] rounded-xl relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>Total Gross Revenue</span>
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <div className="text-3xl font-serif font-bold text-white">
            £{summary.totalGrossRevenueGbp.toLocaleString()}
          </div>
          <span className="text-[11px] text-gray-500 block mt-1">
            Avg Order Value: £{summary.averageOrderValueGbp.toLocaleString()}
          </span>
        </div>

        {/* Net Atelier Earnings */}
        <div className="p-5 bg-[#141414] border border-[#222] rounded-xl relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>Net Atelier Earnings</span>
            <span className="text-gray-400 font-mono text-[10px]">After 15% Take-Rate</span>
          </div>
          <div className="text-3xl font-serif font-bold text-white">
            £{summary.totalNetEarningsGbp.toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-400 block mt-1">
            £{summary.totalPaidOutGbp.toLocaleString()} disbursed to date
          </span>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center justify-between gap-2 border-b border-[#222] pb-2 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-2">
          {[
            { id: 'overview', label: 'Executive Overview & Charts', icon: BarChart3 },
            { id: 'transactions', label: 'Transactions Ledger', icon: DollarSign, badge: transactions.length },
            { id: 'payouts', label: 'Payout History & Withdrawals', icon: ArrowDownToLine, badge: payouts.length },
            { id: 'invoices', label: 'Invoices Vault', icon: FileText, badge: invoices.length },
            { id: 'reports', label: 'Reports & Tax Summary', icon: Layers },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as FinanceTab)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all border ${
                  isActive
                    ? 'bg-amber-500 text-black font-semibold border-amber-400 shadow-lg shadow-amber-500/20'
                    : 'bg-[#141414] border-[#262626] text-gray-300 hover:text-white hover:border-[#3a3a3a]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-gray-400'}`} />
                <span>{tab.label}</span>
                {typeof tab.badge !== 'undefined' && (
                  <span
                    className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full border ${
                      isActive
                        ? 'bg-black text-amber-400 border-black'
                        : 'bg-[#222] text-gray-400 border-[#333]'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Global Action Export dropdown/buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleDownloadTransactionsCsv}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#181818] hover:bg-[#222] border border-[#2a2a2a] text-gray-300 hover:text-white rounded-lg text-xs font-medium transition-colors"
            title="Export CSV"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>CSV Export</span>
          </button>
        </div>
      </div>

      {/* --- TAB 1: EXECUTIVE OVERVIEW & CHARTS --- */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Main Visual Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Monthly Revenue vs Net Earnings Bar Chart (7 cols) */}
            <div className="lg:col-span-7 bg-[#141414] border border-[#222] rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#222] pb-3">
                <div>
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-amber-400" />
                    Revenue & Net Atelier Earnings Trajectory (2026)
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Gross order volume versus 85% net designer earnings after 15% marketplace take-rate
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-amber-400" />
                    <span className="text-gray-300 text-[11px]">Gross Revenue</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-emerald-400" />
                    <span className="text-gray-300 text-[11px]">Net Earnings</span>
                  </div>
                </div>
              </div>

              {/* Bar visualization */}
              <div className="grid grid-cols-6 gap-3 pt-4 items-end h-56">
                {summary.monthlyRecords.map((m) => {
                  const maxBenchmark = 35000;
                  const grossHeight = Math.min(100, (m.grossRevenue / maxBenchmark) * 100);
                  const netHeight = Math.min(100, (m.netEarnings / maxBenchmark) * 100);

                  return (
                    <div key={m.month} className="flex flex-col items-center gap-1 h-full justify-end group">
                      <span className="text-[10px] font-mono text-gray-400 group-hover:text-white transition-colors">
                        £{(m.grossRevenue / 1000).toFixed(1)}k
                      </span>

                      {/* Paired Bars */}
                      <div className="w-full flex items-end justify-center gap-1 h-40">
                        <div
                          className="w-1/2 bg-amber-400 hover:bg-amber-300 rounded-t transition-all"
                          style={{ height: `${grossHeight}%` }}
                          title={`${m.month} Gross: £${m.grossRevenue.toLocaleString()}`}
                        />
                        <div
                          className="w-1/2 bg-emerald-400 hover:bg-emerald-300 rounded-t transition-all"
                          style={{ height: `${netHeight}%` }}
                          title={`${m.month} Net: £${m.netEarnings.toLocaleString()}`}
                        />
                      </div>

                      <span className="text-[10px] text-gray-400 truncate w-full text-center mt-1">
                        {m.month.split(' ')[0]}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-[#222] flex items-center justify-between text-xs text-gray-500">
                <span>Marketplace Commission Benchmark: 15% Standard</span>
                <span className="font-mono text-gray-400">Total Tax Year Volume: £140,450.00</span>
              </div>
            </div>

            {/* Category Revenue Split (5 cols) */}
            <div className="lg:col-span-5 bg-[#141414] border border-[#222] rounded-xl p-6 space-y-4">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                <PieChart className="w-4 h-4 text-emerald-400" />
                Revenue Breakdown by Garment Category
              </h3>

              <div className="space-y-3.5 pt-1 text-xs">
                {summary.categorySplits.map((cat) => (
                  <div key={cat.category} className="space-y-1">
                    <div className="flex justify-between items-center text-gray-300">
                      <span className="truncate max-w-[200px]">{cat.category}</span>
                      <span className="font-mono text-white font-semibold">
                        £{cat.revenue.toLocaleString()}{' '}
                        <span className="text-gray-500 font-normal">({cat.percentage}%)</span>
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-[#222] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full"
                        style={{ width: `${cat.percentage}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-gray-500">{cat.ordersCount} bespoke orders</span>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-[#181818] border border-[#262626] rounded-lg mt-3 flex items-center justify-between text-xs">
                <span className="text-gray-400">Leading Silhouette Margin:</span>
                <span className="font-bold text-amber-300">Savile Row Tuxedo (64.2% Gross)</span>
              </div>
            </div>
          </div>

          {/* Bank Accounts & Active Payout Rails Card */}
          <div className="bg-[#141414] border border-[#222] rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-amber-400" />
                  Registered Atelier Commercial Bank Accounts
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  FCA-regulated commercial accounts cleared for instant automated disbursement
                </p>
              </div>
              <button
                onClick={() => setIsWithdrawModalOpen(true)}
                className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-semibold rounded-lg transition-colors shadow-sm"
              >
                Request Withdrawal →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {bankAccounts.map((bank) => (
                <div
                  key={bank.id}
                  className="p-4 bg-[#181818] border border-[#262626] rounded-xl space-y-2 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-white text-sm">{bank.bankName}</span>
                    {bank.isDefault && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-bold uppercase">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-400 font-mono">
                    Account: {bank.accountNumberMasked}
                  </div>
                  <div className="text-xs text-gray-400 font-mono">
                    Sort / IBAN: {bank.sortCodeOrIban}
                  </div>
                  <div className="flex items-center gap-1.5 pt-1 text-[11px] text-emerald-400">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified Commercial Payee</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 2: TRANSACTIONS LEDGER --- */}
      {activeTab === 'transactions' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="p-4 bg-[#141414] border border-[#222] rounded-xl flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex-1 flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={txSearch}
                  onChange={(e) => setTxSearch(e.target.value)}
                  placeholder="Search by order #, reference, client..."
                  className="w-full bg-[#181818] border border-[#2a2a2a] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <select
                value={txTypeFilter}
                onChange={(e) => setTxTypeFilter(e.target.value)}
                className="bg-[#181818] border border-[#2a2a2a] rounded-lg px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-amber-400"
              >
                <option value="ALL">All Transaction Types</option>
                <option value="order_payment">Client Order Payments</option>
                <option value="payout">Withdrawals & Payouts</option>
              </select>
            </div>

            <div className="flex items-center gap-2 self-end md:self-auto">
              <button
                onClick={handleDownloadTransactionsCsv}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-[#1c1c1c] hover:bg-[#252525] text-white border border-[#2e2e2e] rounded-lg transition-colors font-medium"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Export Ledger CSV</span>
              </button>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="bg-[#141414] border border-[#222] rounded-xl overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-[#262626] text-gray-400 text-[10px] uppercase tracking-wider bg-[#181818]">
                  <th className="py-3 px-4">Date & Reference</th>
                  <th className="py-3 px-3">Description & Client</th>
                  <th className="py-3 px-3 text-center">Type</th>
                  <th className="py-3 px-3 text-right">Gross (GBP)</th>
                  <th className="py-3 px-3 text-right">Fee (15%)</th>
                  <th className="py-3 px-3 text-right">Net Credited</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#202020]">
                {filteredTransactions.map((tx) => {
                  const isCredit = tx.grossAmount > 0;

                  return (
                    <tr key={tx.id} className="hover:bg-[#181818] transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-mono text-amber-300 font-medium">{tx.reference}</div>
                        <div className="text-[10px] text-gray-500">
                          {new Date(tx.date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="font-medium text-white truncate max-w-[280px]">
                          {tx.description}
                        </div>
                        <div className="text-[10px] text-gray-400">
                          {tx.clientName || tx.payoutMethod || 'Atelier Treasury'}
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded capitalize ${
                            tx.type === 'order_payment'
                              ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
                              : 'bg-blue-950/80 text-blue-400 border border-blue-500/30'
                          }`}
                        >
                          {tx.type.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono font-medium text-gray-200">
                        {isCredit ? `+£${tx.grossAmount.toFixed(2)}` : `-£${Math.abs(tx.grossAmount).toFixed(2)}`}
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono text-gray-500">
                        {tx.feeAmount > 0 ? `-£${tx.feeAmount.toFixed(2)}` : '£0.00'}
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono font-bold">
                        <span className={isCredit ? 'text-emerald-400' : 'text-amber-400'}>
                          {isCredit
                            ? `+£${tx.netAmount.toFixed(2)}`
                            : `-£${Math.abs(tx.netAmount).toFixed(2)}`}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="text-[10px] px-2 py-0.5 rounded font-medium bg-emerald-950/50 text-emerald-400 border border-emerald-500/30 capitalize">
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- TAB 3: PAYOUT HISTORY & WITHDRAW REQUESTS --- */}
      {activeTab === 'payouts' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-[#141414] border border-[#222] rounded-xl text-xs">
            <div>
              <h3 className="font-semibold text-white text-sm">Disbursement History & Banking Rails</h3>
              <p className="text-gray-400 mt-0.5">
                Cleared funds transferred directly to your designated business clearing accounts
              </p>
            </div>
            <button
              onClick={() => setIsWithdrawModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-lg transition-colors shadow-md shadow-emerald-500/20"
            >
              <ArrowDownToLine className="w-4 h-4" />
              <span>Initiate New Withdrawal</span>
            </button>
          </div>

          <div className="space-y-3.5">
            {payouts.map((payout) => {
              const isCompleted = payout.status === 'completed';
              const isProcessing = payout.status === 'processing';

              return (
                <div
                  key={payout.id}
                  className="p-5 bg-[#141414] border border-[#222] hover:border-[#333] rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all"
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`p-2.5 rounded-xl shrink-0 ${
                        isCompleted
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      <ArrowDownToLine className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-sm font-bold text-white">
                          {payout.payoutReference}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded capitalize ${
                            isCompleted
                              ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40'
                              : 'bg-amber-950/80 text-amber-400 border border-amber-500/40 animate-pulse'
                          }`}
                        >
                          {payout.status}
                        </span>
                      </div>
                      <div className="text-xs text-gray-300 mt-1">
                        Destination: <strong className="text-white">{payout.destinationAccount}</strong>
                      </div>
                      <div className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-2">
                        <span>Method: {payout.method}</span>
                        <span>•</span>
                        <span>Requested: {new Date(payout.requestedAt).toLocaleDateString()}</span>
                        {payout.completedAt && (
                          <>
                            <span>•</span>
                            <span className="text-emerald-400">
                              Cleared: {new Date(payout.completedAt).toLocaleDateString()}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end md:self-auto">
                    <div className="text-right">
                      <span className="text-[10px] text-gray-500 block">Net Payout Amount</span>
                      <span className="text-xl font-mono font-bold text-white">
                        £{payout.netAmount.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-gray-500 block">
                        Fee: £{payout.fee.toFixed(2)}
                      </span>
                    </div>

                    {isProcessing && (
                      <button
                        onClick={() => {
                          if (window.confirm('Cancel this pending withdrawal request?')) {
                            cancelWithdrawal(payout.id);
                            showToast('Withdrawal cancelled.');
                          }
                        }}
                        className="px-3 py-1.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 border border-rose-500/30 rounded-lg transition-colors"
                      >
                        Cancel Request
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* --- TAB 4: INVOICES VAULT --- */}
      {activeTab === 'invoices' && (
        <div className="space-y-4">
          <div className="p-4 bg-[#141414] border border-[#222] rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <span className="text-gray-400 font-medium">Filter Status:</span>
              <div className="flex items-center gap-1.5">
                {['ALL', 'paid', 'pending'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setInvoiceFilter(st)}
                    className={`px-3 py-1 rounded-lg capitalize transition-colors ${
                      invoiceFilter === st
                        ? 'bg-amber-500 text-black font-semibold'
                        : 'bg-[#181818] border border-[#262626] text-gray-300 hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setIsNewInvoiceOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-semibold rounded-lg transition-colors shadow-md shadow-amber-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Issue Bespoke Invoice</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredInvoices.map((inv) => (
              <div
                key={inv.id}
                className="p-5 bg-[#141414] border border-[#222] hover:border-[#333] rounded-xl flex flex-col justify-between space-y-4 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-black/60 border border-[#333] text-amber-300 font-bold">
                      {inv.invoiceNumber}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        inv.status === 'paid'
                          ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40'
                          : 'bg-amber-950/80 text-amber-400 border border-amber-500/40'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </div>

                  <h3 className="font-semibold text-white text-sm line-clamp-1">{inv.clientName}</h3>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">{inv.garmentName}</p>
                  <p className="text-[11px] text-gray-500 font-mono mt-0.5">Order #{inv.orderNumber}</p>
                </div>

                <div className="p-3 bg-[#181818] border border-[#262626] rounded-lg text-xs space-y-1">
                  <div className="flex justify-between text-gray-400">
                    <span>Net Subtotal:</span>
                    <span className="font-mono text-white">£{inv.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>VAT ({inv.vatRatePercent}%):</span>
                    <span className="font-mono text-white">£{inv.vatAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-white font-bold pt-1 border-t border-[#333]">
                    <span>Grand Total:</span>
                    <span className="font-mono text-amber-400 text-sm">
                      £{inv.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#222] flex items-center justify-between">
                  <span className="text-[10px] text-gray-500">
                    Issued {new Date(inv.date).toLocaleDateString()}
                  </span>

                  <button
                    onClick={() => setSelectedPdfInvoice(inv)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1c1c1c] hover:bg-[#252525] text-amber-300 border border-[#2e2e2e] rounded-lg text-xs font-semibold transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>View / Export PDF</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- TAB 5: REPORTS & TAX SUMMARY --- */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="p-6 bg-[#141414] border border-[#222] rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-serif font-bold text-white tracking-wide">
                UK Tax Year 2025/2026 Financial Audit Statement
              </h3>
              <p className="text-xs text-gray-400 mt-1 max-w-xl">
                Certified summary of atelier gross billing, 15% marketplace commission disbursements,
                and output VAT records for annual HMRC filing.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadReportCsv}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-[#1c1c1c] hover:bg-[#252525] text-white border border-[#2e2e2e] rounded-lg text-xs font-semibold transition-colors"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Export Tax CSV</span>
              </button>
              <button
                onClick={handlePrintFullReport}
                className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-semibold rounded-lg transition-colors shadow-sm"
              >
                <Printer className="w-4 h-4" />
                <span>Print Audit Statement</span>
              </button>
            </div>
          </div>

          {/* Audit Table */}
          <div className="bg-[#141414] border border-[#222] rounded-xl overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-[#262626] text-gray-400 text-[10px] uppercase tracking-wider bg-[#181818]">
                  <th className="py-3 px-4">Period</th>
                  <th className="py-3 px-3 text-right">Gross Invoiced</th>
                  <th className="py-3 px-3 text-right">Platform Fee (15%)</th>
                  <th className="py-3 px-3 text-right">Net Atelier Profit</th>
                  <th className="py-3 px-3 text-right">Disbursed Payouts</th>
                  <th className="py-3 px-4 text-center">Bespoke Orders</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#202020]">
                {summary.monthlyRecords.map((m) => (
                  <tr key={m.month} className="hover:bg-[#181818] transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-white">{m.month}</td>
                    <td className="py-3.5 px-3 text-right font-mono text-gray-200">
                      £{m.grossRevenue.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono text-gray-400">
                      -£{m.marketplaceFees.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono font-bold text-emerald-400">
                      £{m.netEarnings.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono text-amber-300">
                      £{m.payoutsCompleted.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono text-gray-300">
                      {m.ordersCount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      <WithdrawalModal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        availableBalance={summary.availableBalanceGbp}
        bankAccounts={bankAccounts}
        onRequestWithdrawal={(amount, method, destId, notes) => {
          requestWithdrawal(amount, method, destId, notes);
          showToast(`Withdrawal of £${amount.toLocaleString()} submitted.`);
        }}
      />

      <InvoicePdfModal
        isOpen={!!selectedPdfInvoice}
        onClose={() => setSelectedPdfInvoice(null)}
        invoice={selectedPdfInvoice}
      />

      <NewInvoiceModal
        isOpen={isNewInvoiceOpen}
        onClose={() => setIsNewInvoiceOpen(false)}
        onSaveInvoice={(data) => {
          createInvoice(data);
          showToast(`Invoice ${data.invoiceNumber} created successfully.`);
        }}
      />
    </div>
  );
};
