/**
 * @file PartnerEarningsView.tsx
 * Partner Earnings, Milestone Payouts & Invoices Ledger.
 * Shows assigned order payouts, release milestones (Deposit on Cutting, Balance on QC Pass),
 * and banking wire references adhering to Own/Relevant data isolation.
 */

import React from 'react';
import { Order, Partner } from '../../types/daniels.types';
import { MOCK_ORDERS, MOCK_PRODUCTS } from '../../mock/danielsMockData';
import { DollarSign, Landmark, ShieldCheck, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface PartnerEarningsViewProps {
  partnerId: string;
  partnerDetails?: Partner | null;
}

export const PartnerEarningsView: React.FC<PartnerEarningsViewProps> = ({
  partnerId,
  partnerDetails,
}) => {
  // Filter assigned orders (Own/Relevant data isolation - Requirement 1 & 5)
  const assignedOrders = MOCK_ORDERS.filter((o) => o.partnerId === partnerId);

  // Compute craft fees & milestone payouts
  // Contractor atelier rate is typically 45% of garment subtotal
  const earningsData = assignedOrders.map((ord) => {
    const product = MOCK_PRODUCTS.find((p) => p.id === ord.productId);
    const craftFee = Math.round(ord.pricing.subtotal * 0.45);
    const deposit40 = Math.round(craftFee * 0.4);
    const balance60 = craftFee - deposit40;

    let payoutStatus: 'Paid' | 'Part Paid' | 'In Escrow' = 'In Escrow';
    let releasedAmount = 0;

    if (ord.status === 'Delivered' || ord.status === 'Closed') {
      payoutStatus = 'Paid';
      releasedAmount = craftFee;
    } else if (ord.status === 'In Production' || ord.status === 'QC') {
      payoutStatus = 'Part Paid';
      releasedAmount = deposit40; // 40% deposit released on cutting
    }

    return {
      order: ord,
      product,
      craftFee,
      deposit40,
      balance60,
      payoutStatus,
      releasedAmount,
      wireRef: `BIELLA-SEPA-${ord.id.replace('ord_', '')}-EUR`,
    };
  });

  const totalContractValue = earningsData.reduce((acc, curr) => acc + curr.craftFee, 0);
  const totalSettled = earningsData.reduce((acc, curr) => acc + curr.releasedAmount, 0);
  const totalPendingEscrow = totalContractValue - totalSettled;

  return (
    <div className="space-y-8 text-left font-mono animate-fadeIn">
      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-[#0E0E0E] border border-[#2B2B2B] rounded-sm space-y-1">
          <span className="text-[8.5px] text-neutral-500 uppercase tracking-widest block">
            CRAFT CONTRACT VALUE
          </span>
          <span className="font-serif text-2xl sm:text-3xl text-white font-bold tracking-wider block">
            £{totalContractValue.toLocaleString()}
          </span>
          <span className="text-[8.5px] text-neutral-400 font-sans block">
            Across {assignedOrders.length} assigned bespoke commissions
          </span>
        </div>

        <div className="p-5 bg-[#0E0E0E] border border-[#2B2B2B] rounded-sm space-y-1">
          <span className="text-[8.5px] text-emerald-400 uppercase tracking-widest block font-bold">
            SETTLED & DISBURSED
          </span>
          <span className="font-serif text-2xl sm:text-3xl text-emerald-400 font-bold tracking-wider block">
            £{totalSettled.toLocaleString()}
          </span>
          <span className="text-[8.5px] text-neutral-400 font-sans block">
            Transferred via verified SEPA wire dockets
          </span>
        </div>

        <div className="p-5 bg-[#0E0E0E] border border-[#2B2B2B] rounded-sm space-y-1">
          <span className="text-[8.5px] text-amber-300 uppercase tracking-widest block font-bold">
            ESCROW MILESTONES IN PROGRESS
          </span>
          <span className="font-serif text-2xl sm:text-3xl text-amber-300 font-bold tracking-wider block">
            £{totalPendingEscrow.toLocaleString()}
          </span>
          <span className="text-[8.5px] text-neutral-400 font-sans block">
            Releasing on QC pass & final delivery
          </span>
        </div>
      </div>

      {/* Payout Milestone Schedule */}
      <div className="bg-[#0E0E0E] border border-[#2B2B2B] p-6 rounded-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2B2B2B] pb-3">
          <div className="flex items-center gap-2">
            <Landmark className="w-4 h-4 text-white" />
            <span className="text-[10px] text-white font-bold uppercase tracking-widest">
              COMMISSION SETTLEMENT & WIRE DISPATCH LEDGER
            </span>
          </div>
          <span className="text-[8.5px] text-neutral-400 uppercase tracking-widest">
            BANKING: {partnerDetails?.businessDetails.legalBusinessName || 'Atelier Biella S.r.l.'}
          </span>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-[10px] text-left">
            <thead>
              <tr className="border-b border-[#2B2B2B] text-neutral-500 text-[8.5px] uppercase tracking-wider">
                <th className="py-2.5 pr-4">COMMISSION ID</th>
                <th className="py-2.5 px-4">SILHOUETTE SPEC</th>
                <th className="py-2.5 px-4">TOTAL CRAFT FEE</th>
                <th className="py-2.5 px-4">MILESTONE 1 (40% CUTTING)</th>
                <th className="py-2.5 px-4">MILESTONE 2 (60% QC PASS)</th>
                <th className="py-2.5 px-4">WIRE REFERENCE</th>
                <th className="py-2.5 pl-4 text-right">PAYOUT STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2B2B2B]/60">
              {earningsData.map((item) => (
                <tr key={item.order.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 pr-4 font-bold text-white font-mono">
                    {item.order.id}
                  </td>
                  <td className="py-3.5 px-4 font-serif text-neutral-200 uppercase font-bold truncate max-w-[180px]">
                    {item.product?.name || 'Bespoke Silhouette'}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-white">
                    £{item.craftFee.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-neutral-300">
                    £{item.deposit40.toLocaleString()}{' '}
                    {item.payoutStatus !== 'In Escrow' && (
                      <span className="text-emerald-400 text-[8px] font-bold">✓ RELEASED</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-neutral-300">
                    £{item.balance60.toLocaleString()}{' '}
                    {item.payoutStatus === 'Paid' ? (
                      <span className="text-emerald-400 text-[8px] font-bold">✓ SETTLED</span>
                    ) : (
                      <span className="text-amber-400 text-[8px]">ESCROW</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-[9px] text-neutral-500 font-mono">
                    {item.wireRef}
                  </td>
                  <td className="py-3.5 pl-4 text-right">
                    <span
                      className={`text-[8px] font-bold px-2 py-0.5 rounded-2xs uppercase tracking-widest ${
                        item.payoutStatus === 'Paid'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : item.payoutStatus === 'Part Paid'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                      }`}
                    >
                      {item.payoutStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PartnerEarningsView;
