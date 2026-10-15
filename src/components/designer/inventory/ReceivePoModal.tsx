/**
 * @file ReceivePoModal.tsx
 * Modal for physical receipt inspection and automated inventory restocking.
 */

import React, { useState } from 'react';
import { X, PackageCheck, CheckCircle2, ShieldCheck, AlertTriangle } from 'lucide-react';
import { PurchaseOrder } from '../../../types/inventory.types';

interface ReceivePoModalProps {
  isOpen: boolean;
  onClose: () => void;
  purchaseOrder: PurchaseOrder | null;
  onReceive: (poId: string, receivingNotes: string, inspectorName: string) => void;
}

export const ReceivePoModal: React.FC<ReceivePoModalProps> = ({
  isOpen,
  onClose,
  purchaseOrder,
  onReceive,
}) => {
  if (!isOpen || !purchaseOrder) return null;

  const [inspectorName, setInspectorName] = useState('Master Cutter Arthur Vance');
  const [qualityCondition, setQualityCondition] = useState<'flawless' | 'minor_variance' | 'recheck'>(
    'flawless'
  );
  const [receivingNotes, setReceivingNotes] = useState(
    'Bespoke cloth inspection completed. Weave tension, color lot saturation, and salvage selvedges verified against swatch master.'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalNote = `[Inspection: ${qualityCondition.toUpperCase()}] ${receivingNotes}`.trim();
    onReceive(purchaseOrder.id, finalNote, inspectorName);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#121212] border border-[#2a2a2a] rounded-xl max-w-lg w-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#222] bg-[#161616]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <PackageCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-serif font-bold text-white tracking-wide">
                Receive & Restock Shipment
              </h2>
              <p className="text-xs text-gray-400 font-mono">{purchaseOrder.poNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="p-3 bg-[#181818] border border-[#262626] rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Mill / Supplier:</span>
              <span className="text-white font-medium">{purchaseOrder.supplierName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Carrier & Waybill:</span>
              <span className="text-amber-300 font-mono">
                {purchaseOrder.carrier} ({purchaseOrder.trackingNumber || 'Direct Mill Delivery'})
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Total Purchase Value:</span>
              <span className="text-emerald-400 font-bold font-mono">
                £{purchaseOrder.totalAmount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Items that will be restocked */}
          <div>
            <span className="block font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              Items to Automatically Restock ({purchaseOrder.items.length})
            </span>
            <div className="space-y-1.5 max-h-36 overflow-y-auto">
              {purchaseOrder.items.map((item) => (
                <div
                  key={item.id}
                  className="p-2 rounded bg-black/40 border border-[#262626] flex items-center justify-between"
                >
                  <div>
                    <span className="text-white font-medium block truncate max-w-[240px]">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">{item.sku}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-emerald-400 font-bold font-mono">
                      +{item.quantity} {item.unit}
                    </span>
                    <span className="text-[10px] text-gray-500 block">will be added</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quality Appraisal */}
          <div>
            <label className="block text-gray-300 font-medium mb-1">
              Shop Floor Inspection Quality
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setQualityCondition('flawless')}
                className={`py-2 px-2.5 rounded-lg border text-center transition-colors ${
                  qualityCondition === 'flawless'
                    ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-400'
                    : 'bg-[#181818] border-[#333] text-gray-400'
                }`}
              >
                <ShieldCheck className="w-4 h-4 mx-auto mb-0.5" />
                <span className="text-[11px] font-medium block">Flawless</span>
              </button>

              <button
                type="button"
                onClick={() => setQualityCondition('minor_variance')}
                className={`py-2 px-2.5 rounded-lg border text-center transition-colors ${
                  qualityCondition === 'minor_variance'
                    ? 'bg-amber-950/40 border-amber-500/50 text-amber-400'
                    : 'bg-[#181818] border-[#333] text-gray-400'
                }`}
              >
                <AlertTriangle className="w-4 h-4 mx-auto mb-0.5" />
                <span className="text-[11px] font-medium block">Minor Variance</span>
              </button>

              <button
                type="button"
                onClick={() => setQualityCondition('recheck')}
                className={`py-2 px-2.5 rounded-lg border text-center transition-colors ${
                  qualityCondition === 'recheck'
                    ? 'bg-blue-950/40 border-blue-500/50 text-blue-400'
                    : 'bg-[#181818] border-[#333] text-gray-400'
                }`}
              >
                <PackageCheck className="w-4 h-4 mx-auto mb-0.5" />
                <span className="text-[11px] font-medium block">Sampling Passed</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-gray-300 font-medium mb-1">Receiving Inspector</label>
            <input
              type="text"
              value={inspectorName}
              onChange={(e) => setInspectorName(e.target.value)}
              className="w-full bg-[#181818] border border-[#333] rounded-lg px-3 py-2 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 font-medium mb-1">Inspection & Receiving Remarks</label>
            <textarea
              rows={2}
              value={receivingNotes}
              onChange={(e) => setReceivingNotes(e.target.value)}
              className="w-full bg-[#181818] border border-[#333] rounded-lg px-3 py-2 text-white"
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#222]">
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
              <span>Confirm Receipt & Update Inventory</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
