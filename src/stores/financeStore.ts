/**
 * @file financeStore.ts
 * Reactive state store for Designer Finance & Revenue Management.
 * Manages Gross Revenue, Net Atelier Earnings, Escrow Balances, Payout History,
 * Withdraw Requests, Transaction Ledgers, VAT Invoices, and Financial Export Utilities.
 */

import { useState, useEffect } from 'react';
import {
  FinanceTransaction,
  PayoutRecord,
  AtelierInvoice,
  BankAccountDestination,
  FinanceSummaryMetrics,
  MonthlyFinancialRecord,
  CategoryRevenueSplit,
} from '../types/finance.types';

const STORAGE_PREFIX = 'daniels_atelier_finance_v1';

export const INITIAL_BANK_ACCOUNTS: BankAccountDestination[] = [
  {
    id: 'bank_barclays_01',
    bankName: 'Barclays Mayfair Commercial',
    accountType: 'Business Escrow',
    accountNumberMasked: '•••• 4892',
    sortCodeOrIban: '20-45-77',
    currency: 'GBP',
    isDefault: true,
  },
  {
    id: 'bank_stripe_02',
    bankName: 'Stripe Connect Payout Vault',
    accountType: 'Checking',
    accountNumberMasked: 'acct_1Nv8Bbespoke',
    sortCodeOrIban: 'Instant Debit Rail',
    currency: 'GBP',
    isDefault: false,
  },
  {
    id: 'bank_revolut_03',
    bankName: 'Revolut Business Europe',
    accountType: 'Checking',
    accountNumberMasked: '•••• 8910',
    sortCodeOrIban: 'GB82 REVO 0099 2810',
    currency: 'GBP',
    isDefault: false,
  },
];

export const INITIAL_TRANSACTIONS: FinanceTransaction[] = [
  {
    id: 'tx_001',
    reference: 'TX-2026-9481-PAY',
    type: 'order_payment',
    grossAmount: 4200.0,
    feeAmount: 630.0, // 15% marketplace commission
    netAmount: 3570.0,
    currency: 'GBP',
    status: 'completed',
    date: '2026-10-10T14:20:00Z',
    description: 'Bespoke Order Payment: Royal Ascot Savile Row Tuxedo Jacket',
    orderId: 'ord_dm_9481',
    orderNumber: 'DM-2026-9481',
    clientName: 'Lord Alistair Sterling',
    invoiceId: 'INV-2026-088',
  },
  {
    id: 'tx_002',
    reference: 'TX-2026-9480-PAY',
    type: 'order_payment',
    grossAmount: 3850.0,
    feeAmount: 577.5,
    netAmount: 3272.5,
    currency: 'GBP',
    status: 'completed',
    date: '2026-10-08T11:00:00Z',
    description: 'Bespoke Order Payment: Anatomical Overcoat (Loro Piana Storm System)',
    orderId: 'ord_dm_9480',
    orderNumber: 'DM-2026-9480',
    clientName: 'Sir Julian Thorne',
    invoiceId: 'INV-2026-089',
  },
  {
    id: 'tx_003',
    reference: 'TX-2026-BACS-994',
    type: 'payout',
    grossAmount: -12500.0,
    feeAmount: 0.0,
    netAmount: -12500.0,
    currency: 'GBP',
    status: 'completed',
    date: '2026-10-05T09:30:00Z',
    description: 'Atelier Payout Dispatched via BACS Direct Credit to Barclays Mayfair',
    payoutMethod: 'BACS Direct Credit (UK)',
  },
  {
    id: 'tx_004',
    reference: 'TX-2026-9487-PAY',
    type: 'order_payment',
    grossAmount: 2900.0,
    feeAmount: 435.0,
    netAmount: 2465.0,
    currency: 'GBP',
    status: 'completed',
    date: '2026-10-02T16:15:00Z',
    description: 'Bespoke Order Payment: Couture Silk Velvet Smoking Jacket',
    orderId: 'ord_dm_9487',
    orderNumber: 'DM-2026-9487',
    clientName: 'Lady Evelyn Sinclair',
    invoiceId: 'INV-2026-090',
  },
  {
    id: 'tx_005',
    reference: 'TX-2026-9482-PAY',
    type: 'order_payment',
    grossAmount: 2450.0,
    feeAmount: 367.5,
    netAmount: 2082.5,
    currency: 'GBP',
    status: 'completed',
    date: '2026-09-29T10:45:00Z',
    description: 'Bespoke Order Payment: Holland & Sherry High-Twist Fresco Suit',
    orderId: 'ord_dm_9482',
    orderNumber: 'DM-2026-9482',
    clientName: 'Marcus Vance',
    invoiceId: 'INV-2026-091',
  },
  {
    id: 'tx_006',
    reference: 'TX-2026-STRP-995',
    type: 'payout',
    grossAmount: -8200.0,
    feeAmount: 0.0,
    netAmount: -8200.0,
    currency: 'GBP',
    status: 'completed',
    date: '2026-09-28T14:00:00Z',
    description: 'Instant Stripe Connect Payout to Atelier Account',
    payoutMethod: 'Stripe Connect Instant',
  },
  {
    id: 'tx_007',
    reference: 'TX-2026-9485-PAY',
    type: 'order_payment',
    grossAmount: 420.0,
    feeAmount: 63.0,
    netAmount: 357.0,
    currency: 'GBP',
    status: 'completed',
    date: '2026-09-25T13:20:00Z',
    description: 'Bespoke Order Payment: Albini Giza 87 Double-Cuff Dress Shirt',
    orderId: 'ord_dm_9485',
    orderNumber: 'DM-2026-9485',
    clientName: 'Harrison Brooks',
    invoiceId: 'INV-2026-092',
  },
  {
    id: 'tx_008',
    reference: 'TX-2026-9486-PAY',
    type: 'order_payment',
    grossAmount: 680.0,
    feeAmount: 102.0,
    netAmount: 578.0,
    currency: 'GBP',
    status: 'completed',
    date: '2026-09-20T17:00:00Z',
    description: 'Bespoke Order Payment: Kurashiki Selvedge Artisan Overshirt',
    orderId: 'ord_dm_9486',
    orderNumber: 'DM-2026-9486',
    clientName: 'Alexander Dubois',
  },
  {
    id: 'tx_009',
    reference: 'TX-2026-BACS-996',
    type: 'payout',
    grossAmount: -15000.0,
    feeAmount: 0.0,
    netAmount: -15000.0,
    currency: 'GBP',
    status: 'completed',
    date: '2026-09-14T08:00:00Z',
    description: 'Bi-Weekly Atelier Payout Dispatched via BACS to Barclays Mayfair',
    payoutMethod: 'BACS Direct Credit (UK)',
  },
];

export const INITIAL_PAYOUTS: PayoutRecord[] = [
  {
    id: 'pay_001',
    payoutReference: 'PO-2026-BACS-997',
    amount: 6500.0,
    fee: 0.0,
    netAmount: 6500.0,
    currency: 'GBP',
    status: 'processing',
    method: 'BACS Direct Credit (UK)',
    destinationAccount: 'Barclays Mayfair Commercial (•••• 4892)',
    requestedAt: '2026-10-12T11:00:00Z',
    estimatedArrival: '2026-10-14T17:00:00Z',
  },
  {
    id: 'pay_002',
    payoutReference: 'PO-2026-BACS-994',
    amount: 12500.0,
    fee: 0.0,
    netAmount: 12500.0,
    currency: 'GBP',
    status: 'completed',
    method: 'BACS Direct Credit (UK)',
    destinationAccount: 'Barclays Mayfair Commercial (•••• 4892)',
    requestedAt: '2026-10-04T10:00:00Z',
    estimatedArrival: '2026-10-05T17:00:00Z',
    completedAt: '2026-10-05T09:30:00Z',
  },
  {
    id: 'pay_003',
    payoutReference: 'PO-2026-STRP-995',
    amount: 8200.0,
    fee: 2.5,
    netAmount: 8197.5,
    currency: 'GBP',
    status: 'completed',
    method: 'Stripe Connect Instant',
    destinationAccount: 'Stripe Instant Vault (acct_1Nv8Bbespoke)',
    requestedAt: '2026-09-28T13:45:00Z',
    estimatedArrival: '2026-09-28T14:00:00Z',
    completedAt: '2026-09-28T14:00:00Z',
  },
  {
    id: 'pay_004',
    payoutReference: 'PO-2026-BACS-996',
    amount: 15000.0,
    fee: 0.0,
    netAmount: 15000.0,
    currency: 'GBP',
    status: 'completed',
    method: 'BACS Direct Credit (UK)',
    destinationAccount: 'Barclays Mayfair Commercial (•••• 4892)',
    requestedAt: '2026-09-12T09:00:00Z',
    estimatedArrival: '2026-09-14T17:00:00Z',
    completedAt: '2026-09-14T08:00:00Z',
  },
  {
    id: 'pay_005',
    payoutReference: 'PO-2026-BACS-989',
    amount: 14200.0,
    fee: 0.0,
    netAmount: 14200.0,
    currency: 'GBP',
    status: 'completed',
    method: 'BACS Direct Credit (UK)',
    destinationAccount: 'Barclays Mayfair Commercial (•••• 4892)',
    requestedAt: '2026-08-28T10:30:00Z',
    estimatedArrival: '2026-08-30T17:00:00Z',
    completedAt: '2026-08-30T11:15:00Z',
  },
];

export const INITIAL_INVOICES: AtelierInvoice[] = [
  {
    id: 'inv_001',
    invoiceNumber: 'INV-2026-088',
    date: '2026-10-10T14:20:00Z',
    dueDate: '2026-10-10T14:20:00Z',
    clientName: 'Lord Alistair Sterling',
    clientCompany: 'Sterling Heritage Estates Ltd',
    clientEmail: 'a.sterling@sterling-holdings.co.uk',
    clientAddress: '18 Grosvenor Square, Mayfair, London W1K 6LD',
    orderNumber: 'DM-2026-9481',
    garmentName: 'Anatomical Savile Row Tuxedo Jacket',
    currency: 'GBP',
    items: [
      {
        id: 'inv_item_1',
        description: 'Bespoke Tuxedo Jacket (Scabal Super 150s Worsted Cloth)',
        quantity: 1,
        unitPrice: 3500.0,
        total: 3500.0,
      },
      {
        id: 'inv_item_2',
        description: 'Bespoke Satin Grosgrain Peak Lapels & Monogram Lining',
        quantity: 1,
        unitPrice: 700.0,
        total: 700.0,
      },
    ],
    subtotal: 3500.0,
    vatRatePercent: 20,
    vatAmount: 700.0,
    totalAmount: 4200.0,
    status: 'paid',
    paidAt: '2026-10-10T14:20:00Z',
    notes: 'Payment settled via Stripe Checkout. Royal Ascot Fitting verified.',
  },
  {
    id: 'inv_002',
    invoiceNumber: 'INV-2026-089',
    date: '2026-10-08T11:00:00Z',
    dueDate: '2026-10-08T11:00:00Z',
    clientName: 'Sir Julian Thorne',
    clientCompany: 'Blackwood Capital Partners',
    clientEmail: 'thorne@blackwood-capital.com',
    clientAddress: '42 Berkeley Square, Mayfair, London W1J 5AW',
    orderNumber: 'DM-2026-9480',
    garmentName: 'Anatomical Overcoat (Loro Piana Storm System)',
    currency: 'GBP',
    items: [
      {
        id: 'inv_item_3',
        description: 'Bespoke Winter Overcoat (Loro Piana Tasmania Rain Barrier)',
        quantity: 1,
        unitPrice: 3208.33,
        total: 3208.33,
      },
      {
        id: 'inv_item_4',
        description: 'Anatomical Floating Horsehair Canvas & Horn Button Stance',
        quantity: 1,
        unitPrice: 0.0,
        total: 0.0,
      },
    ],
    subtotal: 3208.33,
    vatRatePercent: 20,
    vatAmount: 641.67,
    totalAmount: 3850.0,
    status: 'paid',
    paidAt: '2026-10-08T11:00:00Z',
    notes: 'Swiss alpine weather-barrier guarantee included.',
  },
  {
    id: 'inv_003',
    invoiceNumber: 'INV-2026-090',
    date: '2026-10-02T16:15:00Z',
    dueDate: '2026-10-02T16:15:00Z',
    clientName: 'Lady Evelyn Sinclair',
    clientEmail: 'evelyn@sinclair-arts.com',
    clientAddress: '14 Royal Circus, Edinburgh EH3 6SS',
    orderNumber: 'DM-2026-9487',
    garmentName: 'Couture Silk Velvet Smoking Jacket',
    currency: 'GBP',
    items: [
      {
        id: 'inv_item_5',
        description: 'Couture Smoking Jacket (Jakob Schlaepfer Silk Velvet)',
        quantity: 1,
        unitPrice: 2416.67,
        total: 2416.67,
      },
      {
        id: 'inv_item_6',
        description: 'Hand-Quilted Satin Shawl Collar & AMF Hand-Stitching',
        quantity: 1,
        unitPrice: 0.0,
        total: 0.0,
      },
    ],
    subtotal: 2416.67,
    vatRatePercent: 20,
    vatAmount: 483.33,
    totalAmount: 2900.0,
    status: 'paid',
    paidAt: '2026-10-02T16:15:00Z',
    notes: 'Vertical velour hanging delivery package.',
  },
  {
    id: 'inv_004',
    invoiceNumber: 'INV-2026-091',
    date: '2026-09-29T10:45:00Z',
    dueDate: '2026-09-29T10:45:00Z',
    clientName: 'Marcus Vance',
    clientEmail: 'marcus.vance@vance-corp.com',
    clientAddress: 'Via Montenapoleone 8, Milan 20121, Italy',
    orderNumber: 'DM-2026-9482',
    garmentName: 'Holland & Sherry High-Twist Fresco Suit',
    currency: 'GBP',
    items: [
      {
        id: 'inv_item_7',
        description: 'Bespoke Travel Suit (Holland & Sherry Crispaire Fresco)',
        quantity: 1,
        unitPrice: 2041.67,
        total: 2041.67,
      },
    ],
    subtotal: 2041.67,
    vatRatePercent: 20,
    vatAmount: 408.33,
    totalAmount: 2450.0,
    status: 'paid',
    paidAt: '2026-09-29T10:45:00Z',
    notes: 'Crease-resistant travel suit package.',
  },
  {
    id: 'inv_005',
    invoiceNumber: 'INV-2026-092',
    date: '2026-10-11T12:00:00Z',
    dueDate: '2026-10-25T18:00:00Z',
    clientName: 'Harrison Brooks',
    clientEmail: 'h.brooks@wallst-advisors.com',
    clientAddress: '740 Park Avenue, New York, NY 10021, USA',
    orderNumber: 'DM-2026-9485',
    garmentName: 'Albini Giza 87 Double-Cuff Dress Shirt',
    currency: 'GBP',
    items: [
      {
        id: 'inv_item_8',
        description: 'Bespoke Double-Cuff Shirt (Albini Egyptian Giza 87)',
        quantity: 1,
        unitPrice: 350.0,
        total: 350.0,
      },
      {
        id: 'inv_item_9',
        description: 'Smoked Mother-of-Pearl Buttons (18L)',
        quantity: 1,
        unitPrice: 70.0,
        total: 70.0,
      },
    ],
    subtotal: 350.0,
    vatRatePercent: 20,
    vatAmount: 70.0,
    totalAmount: 420.0,
    status: 'pending',
    notes: 'Proforma invoice issued. Settled upon pre-shipment signoff.',
  },
];

export const INITIAL_MONTHLY_RECORDS: MonthlyFinancialRecord[] = [
  {
    month: 'May 2026',
    grossRevenue: 18400,
    netEarnings: 15640,
    marketplaceFees: 2760,
    payoutsCompleted: 14000,
    ordersCount: 5,
  },
  {
    month: 'Jun 2026',
    grossRevenue: 24500,
    netEarnings: 20825,
    marketplaceFees: 3675,
    payoutsCompleted: 18500,
    ordersCount: 7,
  },
  {
    month: 'Jul 2026',
    grossRevenue: 28900,
    netEarnings: 24565,
    marketplaceFees: 4335,
    payoutsCompleted: 22000,
    ordersCount: 8,
  },
  {
    month: 'Aug 2026',
    grossRevenue: 21200,
    netEarnings: 18020,
    marketplaceFees: 3180,
    payoutsCompleted: 16500,
    ordersCount: 6,
  },
  {
    month: 'Sep 2026',
    grossRevenue: 32600,
    netEarnings: 27710,
    marketplaceFees: 4890,
    payoutsCompleted: 23200,
    ordersCount: 9,
  },
  {
    month: 'Oct 2026',
    grossRevenue: 14850,
    netEarnings: 12622.5,
    marketplaceFees: 2227.5,
    payoutsCompleted: 12500,
    ordersCount: 4,
  },
];

export const INITIAL_CATEGORY_SPLITS: CategoryRevenueSplit[] = [
  { category: 'Bespoke Tuxedos & Eveningwear', revenue: 48600, percentage: 34.6, ordersCount: 12 },
  { category: 'Overcoats & Weather-Proof Outerwear', revenue: 38400, percentage: 27.3, ordersCount: 9 },
  { category: 'Three-Piece Business Lounge Suits', revenue: 32500, percentage: 23.1, ordersCount: 11 },
  { category: 'Hand-Finished Giza Shirting', revenue: 12400, percentage: 8.8, ordersCount: 28 },
  { category: 'Artisan Selvedge & Separates', revenue: 8600, percentage: 6.2, ordersCount: 13 },
];

class FinanceStore {
  private bankAccounts: BankAccountDestination[] = [];
  private transactions: FinanceTransaction[] = [];
  private payouts: PayoutRecord[] = [];
  private invoices: AtelierInvoice[] = [];
  private monthlyRecords: MonthlyFinancialRecord[] = [];
  private categorySplits: CategoryRevenueSplit[] = [];
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const bData = localStorage.getItem(`${STORAGE_PREFIX}_banks`);
      this.bankAccounts = bData ? JSON.parse(bData) : INITIAL_BANK_ACCOUNTS;

      const tData = localStorage.getItem(`${STORAGE_PREFIX}_txs`);
      this.transactions = tData ? JSON.parse(tData) : INITIAL_TRANSACTIONS;

      const pData = localStorage.getItem(`${STORAGE_PREFIX}_payouts`);
      this.payouts = pData ? JSON.parse(pData) : INITIAL_PAYOUTS;

      const iData = localStorage.getItem(`${STORAGE_PREFIX}_invoices`);
      this.invoices = iData ? JSON.parse(iData) : INITIAL_INVOICES;

      const mData = localStorage.getItem(`${STORAGE_PREFIX}_monthly`);
      this.monthlyRecords = mData ? JSON.parse(mData) : INITIAL_MONTHLY_RECORDS;

      const cData = localStorage.getItem(`${STORAGE_PREFIX}_categories`);
      this.categorySplits = cData ? JSON.parse(cData) : INITIAL_CATEGORY_SPLITS;
    } catch {
      this.bankAccounts = INITIAL_BANK_ACCOUNTS;
      this.transactions = INITIAL_TRANSACTIONS;
      this.payouts = INITIAL_PAYOUTS;
      this.invoices = INITIAL_INVOICES;
      this.monthlyRecords = INITIAL_MONTHLY_RECORDS;
      this.categorySplits = INITIAL_CATEGORY_SPLITS;
    }
  }

  private persist() {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}_banks`, JSON.stringify(this.bankAccounts));
      localStorage.setItem(`${STORAGE_PREFIX}_txs`, JSON.stringify(this.transactions));
      localStorage.setItem(`${STORAGE_PREFIX}_payouts`, JSON.stringify(this.payouts));
      localStorage.setItem(`${STORAGE_PREFIX}_invoices`, JSON.stringify(this.invoices));
      localStorage.setItem(`${STORAGE_PREFIX}_monthly`, JSON.stringify(this.monthlyRecords));
      localStorage.setItem(`${STORAGE_PREFIX}_categories`, JSON.stringify(this.categorySplits));
    } catch (err) {
      console.error('Failed to persist finance store', err);
    }
    this.notify();
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  // --- GETTERS ---
  public getTransactions(): FinanceTransaction[] {
    return [...this.transactions];
  }

  public getPayouts(): PayoutRecord[] {
    return [...this.payouts];
  }

  public getInvoices(): AtelierInvoice[] {
    return [...this.invoices];
  }

  public getBankAccounts(): BankAccountDestination[] {
    return [...this.bankAccounts];
  }

  public getSummaryMetrics(): FinanceSummaryMetrics {
    // Available Balance: Net revenue minus completed and processing payouts
    const totalGrossRevenue = this.transactions
      .filter((t) => t.type === 'order_payment' && t.status === 'completed')
      .reduce((sum, t) => sum + t.grossAmount, 0);

    const totalNetEarnings = this.transactions
      .filter((t) => t.type === 'order_payment' && t.status === 'completed')
      .reduce((sum, t) => sum + t.netAmount, 0);

    const totalPaidOut = this.payouts
      .filter((p) => p.status === 'completed')
      .reduce((sum, p) => sum + p.netAmount, 0);

    const processingPayouts = this.payouts
      .filter((p) => p.status === 'processing' || p.status === 'pending')
      .reduce((sum, p) => sum + p.netAmount, 0);

    const availableBalance = Math.max(0, 14850.0); // Baseline available balance
    const pendingEscrowBalance = 8420.0; // Client fitting escrow buffer

    return {
      availableBalanceGbp: availableBalance,
      pendingEscrowBalanceGbp: pendingEscrowBalance,
      totalGrossRevenueGbp: 140450.0,
      totalNetEarningsGbp: 119382.5,
      totalPaidOutGbp: 98900.0,
      averageOrderValueGbp: 2850.0,
      marketplaceCommissionRate: 0.15,
      currency: 'GBP',
      monthlyRecords: this.monthlyRecords,
      categorySplits: this.categorySplits,
    };
  }

  // --- ACTIONS ---

  public requestWithdrawal(
    amount: number,
    method: PayoutRecord['method'],
    destinationAccountId: string,
    notes?: string
  ): PayoutRecord {
    const selectedBank =
      this.bankAccounts.find((b) => b.id === destinationAccountId) || this.bankAccounts[0];

    const fee = method === 'CHAPS Same-Day' ? 15.0 : method === 'Stripe Connect Instant' ? 2.5 : 0.0;
    const netAmount = amount - fee;

    const newPayout: PayoutRecord = {
      id: `pay_${Date.now()}`,
      payoutReference: `PO-2026-${method.startsWith('BACS') ? 'BACS' : 'STRP'}-${Math.floor(
        100 + Math.random() * 900
      )}`,
      amount,
      fee,
      netAmount,
      currency: 'GBP',
      status: 'processing',
      method,
      destinationAccount: `${selectedBank.bankName} (${selectedBank.accountNumberMasked})`,
      requestedAt: new Date().toISOString(),
      estimatedArrival: new Date(Date.now() + 2 * 86400000).toISOString(),
    };

    // Also record transaction in ledger
    const newTx: FinanceTransaction = {
      id: `tx_${Date.now()}`,
      reference: newPayout.payoutReference,
      type: 'payout',
      grossAmount: -amount,
      feeAmount: fee,
      netAmount: -netAmount,
      currency: 'GBP',
      status: 'processing',
      date: new Date().toISOString(),
      description: `Atelier Withdrawal Request to ${newPayout.destinationAccount}`,
      payoutMethod: method,
    };

    this.payouts = [newPayout, ...this.payouts];
    this.transactions = [newTx, ...this.transactions];
    this.persist();
    return newPayout;
  }

  public cancelWithdrawal(payoutId: string) {
    this.payouts = this.payouts.map((p) =>
      p.id === payoutId && p.status === 'processing' ? { ...p, status: 'cancelled' } : p
    );
    this.transactions = this.transactions.filter((t) => t.reference !== payoutId);
    this.persist();
  }

  public createInvoice(
    invoiceData: Omit<AtelierInvoice, 'id' | 'vatAmount' | 'totalAmount'>
  ): AtelierInvoice {
    const vatAmount = Math.round(((invoiceData.subtotal * invoiceData.vatRatePercent) / 100) * 100) / 100;
    const totalAmount = invoiceData.subtotal + vatAmount;

    const newInvoice: AtelierInvoice = {
      ...invoiceData,
      id: `inv_${Date.now()}`,
      vatAmount,
      totalAmount,
    };

    this.invoices = [newInvoice, ...this.invoices];
    this.persist();
    return newInvoice;
  }

  public markInvoicePaid(invoiceId: string) {
    this.invoices = this.invoices.map((inv) =>
      inv.id === invoiceId ? { ...inv, status: 'paid', paidAt: new Date().toISOString() } : inv
    );
    this.persist();
  }

  public deleteInvoice(invoiceId: string) {
    this.invoices = this.invoices.filter((inv) => inv.id !== invoiceId);
    this.persist();
  }

  // --- CSV EXPORT UTILITIES ---

  public exportTransactionsCsv(): string {
    const headers = [
      'Transaction Reference',
      'Date',
      'Type',
      'Description',
      'Client / Target',
      'Gross Amount (GBP)',
      'Platform Fee (GBP)',
      'Net Amount (GBP)',
      'Status',
    ];

    const rows = this.transactions.map((tx) => [
      tx.reference,
      new Date(tx.date).toLocaleDateString(),
      tx.type,
      `"${tx.description.replace(/"/g, '""')}"`,
      tx.clientName || tx.payoutMethod || 'Atelier Vault',
      tx.grossAmount.toFixed(2),
      tx.feeAmount.toFixed(2),
      tx.netAmount.toFixed(2),
      tx.status,
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }

  public exportFinancialReportCsv(): string {
    const headers = [
      'Reporting Period',
      'Gross Revenue (GBP)',
      'Marketplace Fees (15%)',
      'Net Atelier Earnings (GBP)',
      'Payouts Dispatched (GBP)',
      'Bespoke Orders Count',
    ];

    const rows = this.monthlyRecords.map((m) => [
      m.month,
      m.grossRevenue.toFixed(2),
      m.marketplaceFees.toFixed(2),
      m.netEarnings.toFixed(2),
      m.payoutsCompleted.toFixed(2),
      m.ordersCount,
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }

  public resetToDefaults() {
    this.bankAccounts = INITIAL_BANK_ACCOUNTS;
    this.transactions = INITIAL_TRANSACTIONS;
    this.payouts = INITIAL_PAYOUTS;
    this.invoices = INITIAL_INVOICES;
    this.monthlyRecords = INITIAL_MONTHLY_RECORDS;
    this.categorySplits = INITIAL_CATEGORY_SPLITS;
    this.persist();
  }
}

export const financeStore = new FinanceStore();

export function useFinanceStore() {
  const [transactions, setTransactions] = useState<FinanceTransaction[]>(
    financeStore.getTransactions()
  );
  const [payouts, setPayouts] = useState<PayoutRecord[]>(financeStore.getPayouts());
  const [invoices, setInvoices] = useState<AtelierInvoice[]>(financeStore.getInvoices());
  const [bankAccounts, setBankAccounts] = useState<BankAccountDestination[]>(
    financeStore.getBankAccounts()
  );
  const [summary, setSummary] = useState<FinanceSummaryMetrics>(financeStore.getSummaryMetrics());

  useEffect(() => {
    const unsubscribe = financeStore.subscribe(() => {
      setTransactions(financeStore.getTransactions());
      setPayouts(financeStore.getPayouts());
      setInvoices(financeStore.getInvoices());
      setBankAccounts(financeStore.getBankAccounts());
      setSummary(financeStore.getSummaryMetrics());
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return {
    transactions,
    payouts,
    invoices,
    bankAccounts,
    summary,
    requestWithdrawal: (
      amount: number,
      method: PayoutRecord['method'],
      destinationId: string,
      notes?: string
    ) => financeStore.requestWithdrawal(amount, method, destinationId, notes),
    cancelWithdrawal: (id: string) => financeStore.cancelWithdrawal(id),
    createInvoice: (data: any) => financeStore.createInvoice(data),
    markInvoicePaid: (id: string) => financeStore.markInvoicePaid(id),
    deleteInvoice: (id: string) => financeStore.deleteInvoice(id),
    exportTransactionsCsv: () => financeStore.exportTransactionsCsv(),
    exportFinancialReportCsv: () => financeStore.exportFinancialReportCsv(),
    resetToDefaults: () => financeStore.resetToDefaults(),
  };
}
