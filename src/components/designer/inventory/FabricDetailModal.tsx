/**
 * @file FabricDetailModal.tsx
 * Deep inspection modal for a fabric roll/bolt in the Atelier Inventory.
 */

import React from 'react';
import { X, Layers, ExternalLink, ShieldCheck, MapPin, Tag, ShoppingCart, Sliders } from 'lucide-react';
import { FabricItem } from '../../../types/inventory.types';

interface FabricDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  fabric: FabricItem | null;
  onAdjustStock: (fabric: FabricItem) => void;
  onQuickReorder: (fabric: FabricItem) => void;
}

export const FabricDetailModal: React.FC<FabricDetailModalProps> = ({
  isOpen,
  onClose,
  fabric,
  onAdjustStock,
  onQuickReorder,
}) => {
  if (!isOpen || !fabric) return null;

  const available = Math.max(0, fabric.currentStockMeters - fabric.reservedMeters);
  const totalValuation = fabric.currentStockMeters * fabric.costPerMeter;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#111] border border-[#262626] rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="relative h-44 bg-[#1a1a1a] overflow-hidden border-b border-[#222]">
          <img
            src={fabric.swatchImageUrl}
            alt={fabric.name}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-[#111]/60 to-transparent" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black/80 text-gray-300 hover:text-white rounded-lg backdrop-blur-sm transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-black/80 border border-[#333] text-amber-300">
                {fabric.sku}
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-gray-300 backdrop-blur-sm">
                {fabric.weave}
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-gray-300">
                {fabric.weightGsm} GSM
              </span>
            </div>
            <h2 className="text-xl font-serif font-bold text-white tracking-wide truncate">
              {fabric.name}
            </h2>
            <p className="text-xs text-gray-300 flex items-center gap-2 mt-0.5">
              <span>{fabric.supplierName}</span>
              <span>•</span>
              <span className="font-mono">{fabric.millCode}</span>
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-[#181818] border border-[#222] rounded-lg">
              <span className="text-[11px] text-gray-400 block mb-0.5">Physical Stock</span>
              <span className="text-lg font-bold text-white font-mono">
                {fabric.currentStockMeters}m
              </span>
              <span className="text-[10px] text-gray-500 block">Roll Balance</span>
            </div>

            <div className="p-3 bg-[#181818] border border-[#222] rounded-lg">
              <span className="text-[11px] text-gray-400 block mb-0.5">Reserved</span>
              <span className="text-lg font-bold text-amber-400 font-mono">
                {fabric.reservedMeters}m
              </span>
              <span className="text-[10px] text-gray-500 block">Allocated to Orders</span>
            </div>

            <div className="p-3 bg-[#181818] border border-[#222] rounded-lg">
              <span className="text-[11px] text-gray-400 block mb-0.5">Available to Cut</span>
              <span
                className={`text-lg font-bold font-mono ${
                  available <= 0 ? 'text-red-400' : 'text-emerald-400'
                }`}
              >
                {available.toFixed(1)}m
              </span>
              <span className="text-[10px] text-gray-500 block">Unallocated</span>
            </div>

            <div className="p-3 bg-[#181818] border border-[#222] rounded-lg">
              <span className="text-[11px] text-gray-400 block mb-0.5">Bolt Valuation</span>
              <span className="text-lg font-bold text-white font-mono">
                £{totalValuation.toLocaleString()}
              </span>
              <span className="text-[10px] text-gray-500 block">@ £{fabric.costPerMeter}/m</span>
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              Technical & Loom Specifications
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-[#161616] border border-[#222] rounded-lg p-3">
              <div>
                <span className="text-gray-500 block">Composition:</span>
                <span className="text-white font-medium">{fabric.composition}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Bolt Width:</span>
                <span className="text-white font-medium">{fabric.widthCm} cm</span>
              </div>
              <div>
                <span className="text-gray-500 block">Color & Pantone:</span>
                <span className="text-white font-medium flex items-center gap-1.5 mt-0.5">
                  <span
                    className="w-3 h-3 rounded-full border border-white/20 inline-block"
                    style={{ backgroundColor: fabric.hexColor }}
                  />
                  {fabric.colorName}
                </span>
              </div>
              <div>
                <span className="text-gray-500 block">Shrinkage Rate:</span>
                <span className="text-white font-medium">{fabric.shrinkageRatePercent}%</span>
              </div>
              <div>
                <span className="text-gray-500 block">Batch / Lot:</span>
                <span className="text-amber-300 font-mono font-medium">{fabric.batchLotNumber}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Inspection Status:</span>
                <span className="text-emerald-400 font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  {fabric.inspectionStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Storage & Atelier Assignment */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              Atelier Location & Active Allocations
            </h3>
            <div className="bg-[#161616] border border-[#222] rounded-lg p-3 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Rack / Shelf Location:</span>
                <span className="font-semibold text-white px-2 py-0.5 bg-[#222] rounded border border-[#333]">
                  {fabric.storageLocation}
                </span>
              </div>

              <div>
                <span className="text-xs text-gray-400 block mb-1.5">
                  Orders Reserving this Cloth:
                </span>
                {fabric.reservedOrderNumbers && fabric.reservedOrderNumbers.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {fabric.reservedOrderNumbers.map((orderNum) => (
                      <span
                        key={orderNum}
                        className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300"
                      >
                        <Tag className="w-3 h-3" />
                        {orderNum}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 italic">No orders currently reserving yardage.</p>
                )}
              </div>
            </div>
          </div>

          {/* Notes */}
          {fabric.notes && (
            <div className="p-3 bg-[#161616] border border-[#222] rounded-lg text-xs space-y-1">
              <span className="text-gray-400 font-medium">Workshop Notes:</span>
              <p className="text-gray-300 whitespace-pre-line">{fabric.notes}</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#222] bg-[#161616]">
          <button
            onClick={() => {
              onClose();
              onAdjustStock(fabric);
            }}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-300 hover:text-white bg-[#222] hover:bg-[#2c2c2c] rounded-lg transition-colors border border-[#333]"
          >
            <Sliders className="w-4 h-4 text-amber-400" />
            <span>Adjust Roll Yardage</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onQuickReorder(fabric);
              }}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-black rounded-lg transition-colors shadow-lg shadow-amber-500/20"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Draft Mill Purchase Order</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
