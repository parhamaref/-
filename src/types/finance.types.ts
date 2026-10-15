/**
 * @file finance.types.ts
 * Enterprise type definitions for the Designer Finance & Revenue Management Suite.
 * Covers Earnings, Revenue, Payouts, Withdrawals, Transactions, VAT Invoices, and Financial Reports.
 */

export type TransactionType =
  | 'order_payment'
  | 'payout'
  | 'marketplace_fee'
  | 'material_reimbursement'
  | 'refund'
  | 'escrow_release';

export type TransactionStatus = 'completed' | 'pending' | 'processing' | 'failed';

export type PayoutStatus = 'completed' | 'processing' | 'pending' | 'failed' | 'cancelled';

export type PayoutMethodType =
  | 'BACS Direct Credit (UK)'
  | 'Stripe Connect Instant'
  | 'SEPA Euro Instant'
  | 'CHAPS Same-Day';

export interface BankAccountDestination {
  id: string;
  bankName: string;
  accountType: 'Checking' | 'Business Escrow';
  accountNumberMasked: string;
  sortCodeOrIban: string;
  currency: 'GBP' | 'EUR' | 'USD';
  isDefault: boolean;
}

export interface FinanceTransaction {
  id: string;
  reference: string;
  type: TransactionType;
  grossAmount: number;
  feeAmount: number;
  netAmount: number;
  currency: 'GBP' | 'EUR' | 'USD';
  status: TransactionStatus;
  date: string;
  description: string;
  orderId?: string;
  orderNumber?: string;
  clientName?: string;
  payoutMethod?: string;
  invoiceId?: string;
}

export interface PayoutRecord {
  id: string;
  payoutReference: string;
  amount: number;
  fee: number;
  netAmount: number;
  currency: 'GBP' | 'EUR' | 'USD';
  status: PayoutStatus;
  method: PayoutMethodType;
  destinationAccount: string;
  requestedAt: string;
  estimatedArrival: string;
  completedAt?: string;
  failureReason?: string;
}

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface AtelierInvoice {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  clientName: string;
  clientCompany?: string;
  clientEmail: string;
  clientAddress: string;
  orderNumber: string;
  garmentName: string;
  currency: 'GBP' | 'EUR' | 'USD';
  items: InvoiceLineItem[];
  subtotal: number;
  vatRatePercent: number; // e.g. 20%
  vatAmount: number;
  totalAmount: number;
  status: 'paid' | 'pending' | 'overdue';
  paidAt?: string;
  notes?: string;
}

export interface MonthlyFinancialRecord {
  month: string;
  grossRevenue: number;
  netEarnings: number;
  marketplaceFees: number;
  payoutsCompleted: number;
  ordersCount: number;
}

export interface CategoryRevenueSplit {
  category: string;
  revenue: number;
  percentage: number;
  ordersCount: number;
}

export interface FinanceSummaryMetrics {
  availableBalanceGbp: number;
  pendingEscrowBalanceGbp: number;
  totalGrossRevenueGbp: number;
  totalNetEarningsGbp: number;
  totalPaidOutGbp: number;
  averageOrderValueGbp: number;
  marketplaceCommissionRate: number; // e.g. 0.15 (15%)
  currency: 'GBP';
  monthlyRecords: MonthlyFinancialRecord[];
  categorySplits: CategoryRevenueSplit[];
}
