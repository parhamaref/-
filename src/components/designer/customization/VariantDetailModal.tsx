/**
 * @file VariantDetailModal.tsx
 * Modal for deep inspection of a combinatorial variant permutation.
 * Displays SKU, compatibility verdict, rule engine diagnostics, and price/lead-time breakdown.
 */

import React from 'react';
import {
  X,
  Tag,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Layers,
  Copy,
  Check,
  CheckCircle2,
} from 'lucide-react';
import { VariantPermutation, CustomizationOptionGroup } from '../../../types/customization.types';

export interface VariantDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  variant: VariantPermutation | null;
  optionGroups: CustomizationOptionGroup[];
  basePrice: number;
}

export const VariantDetailModal: React.FC<VariantDetailModalProps> = ({
  isOpen,
  onClose,
  variant,
  optionGroups,
  basePrice,
}) => {
  const [copiedSku, setCopiedSku] = React.useState(false);

  if (!isOpen || !variant) return null;

  const handleCopySku = () => {
    navigator.clipboard.writeText(variant.sku);
    setCopiedSku(true);
    setTimeout(() => setCopiedSku(false), 2000);
  };

  // Find all option objects corresponding to selectedOptionIds
  const allOptions = optionGroups.flatMap((g) => g.options);
  const selectedOptions = allOptions.filter((o) => variant.selectedOptionIds.includes(o.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#0F0F0F] border border-[#2B2B2B] rounded-xs shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#222] flex items-center justify-between bg-[#141414]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xs bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-amber-400 font-bold">{variant.sku}</span>
                {variant.isCompatible ? (
                  <span className="px-2 py-0.5 rounded-xs bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-[10px] font-mono flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Compatible
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-xs bg-rose-950/60 border border-rose-800 text-rose-300 text-[10px] font-mono flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Incompatible
                  </span>
                )}
              </div>
              <h2 className="text-sm font-mono text-white font-medium mt-0.5">
                Variant Specification Dossier
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-[#222] rounded-xs transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs font-mono">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-[#141414] border border-[#222] rounded-xs">
              <span className="text-[10px] text-neutral-500 uppercase block">Total Price</span>
              <span className="text-lg font-serif font-bold text-amber-400">
                £{variant.calculatedPrice.toLocaleString('en-GB')}
              </span>
              <span className="text-[10px] text-neutral-500 block">
                Base £{basePrice} + Customization £{variant.calculatedPrice - basePrice}
              </span>
            </div>

            <div className="p-3 bg-[#141414] border border-[#222] rounded-xs">
              <span className="text-[10px] text-neutral-500 uppercase block">Atelier Lead Time</span>
              <div className="flex items-center gap-1.5 text-lg font-mono font-bold text-white">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>{variant.calculatedLeadTimeDays}</span>
                <span className="text-xs font-normal text-neutral-400">Days</span>
              </div>
              <span className="text-[10px] text-neutral-500 block">Handmade to order</span>
            </div>

            <div className="p-3 bg-[#141414] border border-[#222] rounded-xs">
              <span className="text-[10px] text-neutral-500 uppercase block">SKU Code</span>
              <div className="flex items-center justify-between gap-1 mt-0.5">
                <span className="text-xs text-white font-bold truncate">{variant.sku}</span>
                <button
                  onClick={handleCopySku}
                  className="p-1 text-neutral-400 hover:text-amber-400 cursor-pointer"
                  title="Copy SKU"
                >
                  {copiedSku ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <span className="text-[10px] text-neutral-500 block">Production barcode</span>
            </div>
          </div>

          {/* Conflict or Compatibility Notice */}
          {!variant.isCompatible && (
            <div className="p-4 bg-rose-950/40 border border-rose-800/80 rounded-xs space-y-1.5 text-rose-300">
              <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-rose-200">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                Compatibility Rule Engine Flag
              </div>
              <p className="font-sans text-xs text-rose-200 pl-6 leading-relaxed">
                {variant.conflictReason || 'This combination violates an established atelier material rule.'}
              </p>
            </div>
          )}

          {variant.isCompatible && (
            <div className="p-3.5 bg-emerald-950/30 border border-emerald-800/60 rounded-xs flex items-center gap-2.5 text-emerald-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Garment structural integrity confirmed. No material or assembly conflict detected.</span>
            </div>
          )}

          {/* Selected Option Composition */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              Component Options Breakdown ({selectedOptions.length})
            </h3>

            <div className="space-y-2">
              {selectedOptions.map((opt) => {
                const group = optionGroups.find((g) => g.id === opt.groupId);
                return (
                  <div
                    key={opt.id}
                    className="p-3 bg-[#141414] border border-[#222] rounded-xs flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {opt.swatchColor ? (
                        <div
                          className="w-5 h-5 rounded-xs border border-[#333] shrink-0"
                          style={{ backgroundColor: opt.swatchColor }}
                        />
                      ) : (
                        <div className="w-5 h-5 rounded-xs bg-[#222] border border-[#333] shrink-0 flex items-center justify-center text-[9px] text-neutral-400">
                          {opt.skuCode || 'OPT'}
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium truncate">{opt.name}</span>
                          <span className="text-[10px] text-neutral-500 uppercase px-1.5 py-0.2 bg-[#1C1C1C] rounded-xs">
                            {group?.type || 'Option'}
                          </span>
                        </div>
                        {opt.materialDetails && (
                          <span className="text-[10px] text-neutral-400 block font-sans truncate">
                            {opt.materialDetails}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-amber-400 font-semibold block">
                        {opt.priceDelta > 0 ? `+£${opt.priceDelta}` : 'Included'}
                      </span>
                      {opt.leadTimeDaysDelta > 0 && (
                        <span className="text-[10px] text-neutral-500 block">
                          +{opt.leadTimeDaysDelta} Days
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-[#222] bg-[#141414] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#202020] hover:bg-[#2A2A2A] text-white text-xs font-mono uppercase tracking-wider rounded-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
