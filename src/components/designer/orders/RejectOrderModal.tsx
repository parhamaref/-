/**
 * @file RejectOrderModal.tsx
 * Modal for declining an order with structured rejection reasons
 * and client notification explanation.
 */

import React, { useState } from 'react';
import { X, Ban, AlertTriangle, AlertCircle } from 'lucide-react';
import { DesignerOrder } from '../../../types/designerOrder.types';

export interface RejectOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: DesignerOrder | null;
  onConfirm: (reason: string) => void;
}

const REJECTION_REASONS = [
  'Material Shortage: Selected mill yardage temporarily out of stock',
  'Capacity Full: Atelier bespoke schedule fully booked for requested timeframe',
  'Measurement Discrepancy: Anatomical measurements exceed garment pattern tolerance',
  'Customization Conflict: Requested trims/embroidery cannot be executed on selected weave',
  'Client Consultation Request: Private fitting required before bespoke order can proceed',
  'Other / Custom Atelier Reason',
];

export const RejectOrderModal: React.FC<RejectOrderModalProps> = ({
  isOpen,
  onClose,
  order,
  onConfirm,
}) => {
  const [selectedReason, setSelectedReason] = useState(REJECTION_REASONS[0]);
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !order) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedReason === 'Other / Custom Atelier Reason' && !additionalNotes.trim()) {
      setError('Please provide an explanation for the client');
      return;
    }

    const fullReason = additionalNotes.trim()
      ? `${selectedReason}: ${additionalNotes.trim()}`
      : selectedReason;

    onConfirm(fullReason);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#0F0F0F] border border-[#2B2B2B] rounded-xs shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#222] flex items-center justify-between bg-[#141414]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xs bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Ban className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-mono uppercase tracking-wider text-white font-medium">
                Decline Commission Request
              </h3>
              <p className="text-[11px] text-neutral-400">Order {order.orderNumber} for {order.customer.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-xs hover:bg-[#222] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-xs flex items-center gap-2 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <div className="p-3 bg-rose-950/30 border border-rose-800/50 rounded-xs text-xs font-mono text-rose-200 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>This action will cancel the commission and issue a 100% refund to the client.</span>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-neutral-300 mb-1.5">
              Reason for Declining *
            </label>
            <select
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              className="w-full px-3 py-2 bg-[#141414] border border-[#2B2B2B] text-xs font-mono rounded-xs text-white focus:border-amber-400 focus:outline-none cursor-pointer"
            >
              {REJECTION_REASONS.map((r, i) => (
                <option key={i} value={r} className="bg-[#141414] text-white">
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-neutral-300 mb-1.5">
              Client Advisory Note (Shared with Customer)
            </label>
            <textarea
              rows={3}
              placeholder="Provide context or suggest alternative silhouettes or upcoming availability..."
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              className="w-full px-3 py-2 bg-[#141414] border border-[#2B2B2B] text-xs font-sans rounded-xs text-white focus:border-amber-400 focus:outline-none"
            />
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-[#222] flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-mono uppercase text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-mono uppercase tracking-wider font-semibold rounded-xs bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/20 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Ban className="w-3.5 h-3.5" />
              Decline Commission
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
