/**
 * @file AcceptOrderModal.tsx
 * Modal for accepting a bespoke commission, confirming lead times,
 * and queuing for pattern drafting.
 */

import React, { useState } from 'react';
import { X, CheckCircle2, Calendar, FileText, Check } from 'lucide-react';
import { DesignerOrder } from '../../../types/designerOrder.types';

export interface AcceptOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: DesignerOrder | null;
  onConfirm: (notes?: string) => void;
}

export const AcceptOrderModal: React.FC<AcceptOrderModalProps> = ({
  isOpen,
  onClose,
  order,
  onConfirm,
}) => {
  const [atelierNote, setAtelierNote] = useState('');

  if (!isOpen || !order) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(atelierNote.trim() || undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#0F0F0F] border border-[#2B2B2B] rounded-xs shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#222] flex items-center justify-between bg-[#141414]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xs bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-mono uppercase tracking-wider text-white font-medium">
                Accept Bespoke Commission
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
          <div className="p-4 bg-[#141414] border border-[#222] rounded-xs space-y-2 text-xs font-mono">
            <div className="flex justify-between text-neutral-400">
              <span>Garment Silhouette:</span>
              <span className="text-white font-bold">{order.garmentName}</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Total Value:</span>
              <span className="text-amber-400 font-bold">£{order.customizations.finalPrice}</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Estimated Lead Time:</span>
              <span className="text-white">{order.customizations.estimatedLeadTimeDays} Days</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-neutral-300 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              Atelier Production Queue Note (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Fabric roll allocated. Drafting pattern block on cutting table tomorrow..."
              value={atelierNote}
              onChange={(e) => setAtelierNote(e.target.value)}
              className="w-full px-3 py-2 bg-[#141414] border border-[#2B2B2B] text-xs font-sans rounded-xs text-white focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div className="p-3 bg-emerald-950/30 border border-emerald-800/60 rounded-xs text-[11px] text-emerald-300 font-mono">
            Accepting will notify {order.customer.name} and advance order status to <strong>Accepted</strong>.
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
              className="px-5 py-2 text-xs font-mono uppercase tracking-wider font-semibold rounded-xs bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/20 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              Confirm Acceptance
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
