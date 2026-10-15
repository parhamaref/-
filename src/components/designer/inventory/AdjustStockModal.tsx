/**
 * @file AdjustStockModal.tsx
 * Quick stock adjustment modal for recording yardage changes with audit trail reasons.
 */

import React, { useState } from 'react';
import { X, Sliders, ArrowUpRight, ArrowDownRight, CheckCircle2 } from 'lucide-react';
import { FabricItem } from '../../../types/inventory.types';

interface AdjustStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  fabric: FabricItem | null;
  onAdjust: (
    id: string,
    delta: number,
    reason: 'delivery' | 'order_allocation' | 'sampling' | 'shrinkage' | 'manual_audit'
  ) => void;
}

export const AdjustStockModal: React.FC<AdjustStockModalProps> = ({
  isOpen,
  onClose,
  fabric,
  onAdjust,
}) => {
  if (!isOpen || !fabric) return null;

  const [adjustmentType, setAdjustmentType] = useState<'add' | 'deduct'>('add');
  const [amount, setAmount] = useState<number>(5.0);
  const [reason, setReason] = useState<
    'delivery' | 'order_allocation' | 'sampling' | 'shrinkage' | 'manual_audit'
  >('delivery');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const delta = adjustmentType === 'add' ? Math.abs(amount) : -Math.abs(amount);
    onAdjust(fabric.id, delta, reason);
    onClose();
  };

  const calculatedNewTotal = Math.max(
    0,
    fabric.currentStockMeters + (adjustmentType === 'add' ? amount : -amount)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#121212] border border-[#2a2a2a] rounded-xl max-w-md w-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#222] bg-[#181818]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Adjust Bolt Yardage</h3>
              <p className="text-xs text-gray-400 font-mono">{fabric.sku}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-white rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="p-3 bg-[#181818] border border-[#262626] rounded-lg">
            <div className="text-xs text-gray-400">Selected Bolt</div>
            <div className="text-sm font-medium text-white truncate">{fabric.name}</div>
            <div className="text-xs text-gray-400 mt-1 flex items-center justify-between">
              <span>Location: {fabric.storageLocation}</span>
              <span className="font-semibold text-amber-400">
                Current: {fabric.currentStockMeters}m
              </span>
            </div>
          </div>

          {/* Action Type */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setAdjustmentType('add');
                setReason('delivery');
              }}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium border transition-colors ${
                adjustmentType === 'add'
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-400'
                  : 'bg-[#181818] border-[#333] text-gray-400 hover:text-white'
              }`}
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Add Roll Yardage</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAdjustmentType('deduct');
                setReason('sampling');
              }}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium border transition-colors ${
                adjustmentType === 'deduct'
                  ? 'bg-rose-950/40 border-rose-500/50 text-rose-400'
                  : 'bg-[#181818] border-[#333] text-gray-400 hover:text-white'
              }`}
            >
              <ArrowDownRight className="w-4 h-4" />
              <span>Deduct Yardage</span>
            </button>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Quantity to {adjustmentType === 'add' ? 'Add' : 'Deduct'} (Meters)
            </label>
            <input
              type="number"
              step="0.5"
              min="0.1"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              className="w-full bg-[#181818] border border-[#333] rounded-lg px-3 py-2 text-base font-semibold text-white focus:outline-none focus:border-amber-400"
              required
            />
          </div>

          {/* Reason */}
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Audit Log Reason</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value as any)}
              className="w-full bg-[#181818] border border-[#333] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
            >
              {adjustmentType === 'add' ? (
                <>
                  <option value="delivery">Mill Shipment / Arrival Delivery</option>
                  <option value="manual_audit">Inventory Recount / Found Stock</option>
                </>
              ) : (
                <>
                  <option value="order_allocation">Bespoke Order Cutting</option>
                  <option value="sampling">Client Swatch / Showroom Sampling</option>
                  <option value="shrinkage">Steam Sponge / Weave Shrinkage</option>
                  <option value="manual_audit">Bolt Damage / Salvage Scrap</option>
                </>
              )}
            </select>
          </div>

          {/* New Stock Preview */}
          <div className="p-3 rounded-lg bg-black/40 border border-[#222] flex items-center justify-between text-xs">
            <span className="text-gray-400">Projected Balance:</span>
            <span className="font-mono font-bold text-white text-sm">
              {calculatedNewTotal.toFixed(1)} meters
            </span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs rounded-lg transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Apply Adjustment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
