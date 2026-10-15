/**
 * @file WithdrawalModal.tsx
 * Modal for initiating bespoke atelier payouts and funds disbursement.
 */

import React, { useState } from 'react';
import {
  X,
  Wallet,
  ArrowDownToLine,
  Building2,
  Clock,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { BankAccountDestination, PayoutMethodType } from '../../../types/finance.types';

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableBalance: number;
  bankAccounts: BankAccountDestination[];
  onRequestWithdrawal: (
    amount: number,
    method: PayoutMethodType,
    destinationId: string,
    notes?: string
  ) => void;
}

export const WithdrawalModal: React.FC<WithdrawalModalProps> = ({
  isOpen,
  onClose,
  availableBalance,
  bankAccounts,
  onRequestWithdrawal,
}) => {
  if (!isOpen) return null;

  const [amount, setAmount] = useState<number>(Math.min(5000, availableBalance));
  const [selectedBankId, setSelectedBankId] = useState<string>(
    bankAccounts[0]?.id || ''
  );
  const [method, setMethod] = useState<PayoutMethodType>('BACS Direct Credit (UK)');
  const [notes, setNotes] = useState<string>('Standard bi-weekly atelier payroll disbursement.');
  const [error, setError] = useState<string | null>(null);

  const transferFee =
    method === 'CHAPS Same-Day' ? 15.0 : method === 'Stripe Connect Instant' ? 2.5 : 0.0;
  const netDisbursement = Math.max(0, amount - transferFee);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) {
      setError('Please specify a withdrawal amount greater than £0.');
      return;
    }
    if (amount > availableBalance) {
      setError(`Amount exceeds available atelier balance of £${availableBalance.toLocaleString()}.`);
      return;
    }

    onRequestWithdrawal(amount, method, selectedBankId, notes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#111] border border-[#2a2a2a] rounded-xl max-w-lg w-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#222] bg-[#161616]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <ArrowDownToLine className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-serif font-bold text-white tracking-wide">
                Request Funds Withdrawal
              </h2>
              <p className="text-xs text-gray-400">
                Disburse cleared earnings to registered commercial accounts
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-lg flex items-center gap-2 text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Balance card */}
          <div className="p-3.5 bg-[#181818] border border-[#262626] rounded-xl flex items-center justify-between">
            <div>
              <span className="text-gray-400 block text-[11px]">Available to Withdraw</span>
              <span className="text-2xl font-serif font-bold text-emerald-400">
                £{availableBalance.toLocaleString()}
              </span>
            </div>
            <div className="text-right text-[10px] text-gray-500">
              <span>Cleared Atelier Balance</span>
              <span className="block text-emerald-400 font-mono">No Hold</span>
            </div>
          </div>

          {/* Amount input & quick chips */}
          <div>
            <label className="block text-gray-300 font-medium mb-1">
              Disbursement Amount (£ GBP) *
            </label>
            <input
              type="number"
              step="50"
              min="100"
              max={availableBalance}
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              className="w-full bg-[#181818] border border-[#333] rounded-lg px-3 py-2.5 text-base font-mono font-bold text-white focus:outline-none focus:border-amber-400"
              required
            />
            <div className="flex items-center gap-2 mt-2">
              <button
                type="button"
                onClick={() => setAmount(1000)}
                className="px-2.5 py-1 bg-[#1a1a1a] hover:bg-[#252525] border border-[#333] rounded text-gray-300 font-mono text-[11px]"
              >
                £1,000
              </button>
              <button
                type="button"
                onClick={() => setAmount(5000)}
                className="px-2.5 py-1 bg-[#1a1a1a] hover:bg-[#252525] border border-[#333] rounded text-gray-300 font-mono text-[11px]"
              >
                £5,000
              </button>
              <button
                type="button"
                onClick={() => setAmount(10000)}
                className="px-2.5 py-1 bg-[#1a1a1a] hover:bg-[#252525] border border-[#333] rounded text-gray-300 font-mono text-[11px]"
              >
                £10,000
              </button>
              <button
                type="button"
                onClick={() => setAmount(availableBalance)}
                className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 rounded text-amber-300 font-mono text-[11px] font-semibold"
              >
                All Cleared (£{availableBalance.toLocaleString()})
              </button>
            </div>
          </div>

          {/* Destination account */}
          <div>
            <label className="block text-gray-300 font-medium mb-1">
              Destination Commercial Account *
            </label>
            <select
              value={selectedBankId}
              onChange={(e) => setSelectedBankId(e.target.value)}
              className="w-full bg-[#181818] border border-[#333] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
            >
              {bankAccounts.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.bankName} ({b.accountNumberMasked}) • {b.sortCodeOrIban}
                </option>
              ))}
            </select>
          </div>

          {/* Transfer Rail */}
          <div>
            <label className="block text-gray-300 font-medium mb-1">Payment Rail & Speed</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMethod('BACS Direct Credit (UK)')}
                className={`p-2.5 rounded-lg border text-left transition-colors ${
                  method === 'BACS Direct Credit (UK)'
                    ? 'bg-amber-500/10 border-amber-500 text-amber-300'
                    : 'bg-[#181818] border-[#333] text-gray-400'
                }`}
              >
                <div className="font-semibold text-white">BACS Direct Credit</div>
                <div className="text-[10px] text-gray-400 mt-0.5">2-3 business days • Free (£0)</div>
              </button>

              <button
                type="button"
                onClick={() => setMethod('Stripe Connect Instant')}
                className={`p-2.5 rounded-lg border text-left transition-colors ${
                  method === 'Stripe Connect Instant'
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300'
                    : 'bg-[#181818] border-[#333] text-gray-400'
                }`}
              >
                <div className="font-semibold text-white">Stripe Instant Rail</div>
                <div className="text-[10px] text-gray-400 mt-0.5">Under 30 mins • £2.50 flat</div>
              </button>
            </div>
          </div>

          {/* Net summary */}
          <div className="p-3 bg-black/40 border border-[#222] rounded-lg space-y-1 text-xs">
            <div className="flex justify-between text-gray-400">
              <span>Gross Withdrawal:</span>
              <span className="font-mono text-white">£{amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Transfer Network Fee:</span>
              <span className="font-mono text-white">£{transferFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-white pt-1 border-t border-[#333]">
              <span>Net Credited to Account:</span>
              <span className="font-mono text-emerald-400 text-sm">
                £{netDisbursement.toLocaleString()}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-gray-300 font-medium mb-1">Accounting Reference Note</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#181818] border border-[#333] rounded-lg px-3 py-2 text-white"
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-[#222]">
            <span className="text-[10px] text-gray-500 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              FCA Regulated UK Commercial Clearing
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-lg shadow-lg shadow-emerald-500/20 transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm Withdrawal</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
