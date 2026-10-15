/**
 * @file OptionItemModal.tsx
 * Modal for creating and editing individual customization options within a group.
 * Supports pricing adjustments, lead time delta, swatch color/texture, and inventory availability.
 */

import React, { useState, useEffect } from 'react';
import { X, Check, DollarSign, Clock, AlertCircle, Palette, Tag } from 'lucide-react';
import { CustomizationOption } from '../../../types/customization.types';

export interface OptionItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  groupName: string;
  onSave: (option: Omit<CustomizationOption, 'id' | 'groupId'>) => void;
  initialOption?: CustomizationOption | null;
}

export const OptionItemModal: React.FC<OptionItemModalProps> = ({
  isOpen,
  onClose,
  groupName,
  onSave,
  initialOption,
}) => {
  const isEditing = Boolean(initialOption);

  const [formData, setFormData] = useState<{
    name: string;
    skuCode: string;
    description: string;
    priceDelta: number;
    leadTimeDaysDelta: number;
    swatchColor: string;
    swatchImageUrl: string;
    materialDetails: string;
    isDefault: boolean;
    inStock: boolean;
    outOfStockNotice: string;
  }>({
    name: '',
    skuCode: '',
    description: '',
    priceDelta: 0,
    leadTimeDaysDelta: 0,
    swatchColor: '#1A1A1A',
    swatchImageUrl: '',
    materialDetails: '',
    isDefault: false,
    inStock: true,
    outOfStockNotice: '',
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialOption) {
      setFormData({
        name: initialOption.name,
        skuCode: initialOption.skuCode || '',
        description: initialOption.description || '',
        priceDelta: initialOption.priceDelta || 0,
        leadTimeDaysDelta: initialOption.leadTimeDaysDelta || 0,
        swatchColor: initialOption.swatchColor || '#1A1A1A',
        swatchImageUrl: initialOption.swatchImageUrl || '',
        materialDetails: initialOption.materialDetails || '',
        isDefault: Boolean(initialOption.isDefault),
        inStock: initialOption.inStock !== false,
        outOfStockNotice: initialOption.outOfStockNotice || '',
      });
    } else {
      setFormData({
        name: '',
        skuCode: '',
        description: '',
        priceDelta: 0,
        leadTimeDaysDelta: 0,
        swatchColor: '#1A1A1A',
        swatchImageUrl: '',
        materialDetails: '',
        isDefault: false,
        inStock: true,
        outOfStockNotice: '',
      });
    }
    setError(null);
  }, [initialOption, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Option name is required');
      return;
    }

    onSave({
      name: formData.name.trim(),
      skuCode: formData.skuCode.trim().toUpperCase() || formData.name.substring(0, 3).toUpperCase(),
      description: formData.description.trim(),
      priceDelta: Number(formData.priceDelta) || 0,
      leadTimeDaysDelta: Number(formData.leadTimeDaysDelta) || 0,
      swatchColor: formData.swatchColor,
      swatchImageUrl: formData.swatchImageUrl.trim() || undefined,
      materialDetails: formData.materialDetails.trim() || undefined,
      isDefault: formData.isDefault,
      inStock: formData.inStock,
      outOfStockNotice: formData.outOfStockNotice.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#0F0F0F] border border-[#2B2B2B] rounded-xs shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#222] flex items-center justify-between bg-[#141414]">
          <div>
            <h3 className="text-sm font-mono uppercase tracking-wider text-white font-medium">
              {isEditing ? 'Edit Option' : `Add Option to ${groupName}`}
            </h3>
            <p className="text-[11px] text-neutral-400">
              Configure swatch, price delta, and production parameters.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-xs hover:bg-[#222] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {error && (
            <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-xs flex items-center gap-2 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-mono uppercase text-neutral-300 mb-1.5">
                Option Title *
              </label>
              <input
                type="text"
                placeholder="e.g. 14oz Worsted Wool, Smoked Mother-of-Pearl"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-[#141414] border border-[#2B2B2B] text-xs font-mono rounded-xs text-white focus:border-amber-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-neutral-300 mb-1.5 flex items-center gap-1">
                <Tag className="w-3 h-3 text-amber-400" />
                SKU Tag
              </label>
              <input
                type="text"
                placeholder="e.g. W14"
                value={formData.skuCode}
                onChange={(e) => setFormData({ ...formData, skuCode: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 bg-[#141414] border border-[#2B2B2B] text-xs font-mono rounded-xs text-white focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Pricing & Production Lead Time */}
          <div className="grid grid-cols-2 gap-4 p-3 bg-[#141414] border border-[#222] rounded-xs">
            <div>
              <label className="block text-[11px] font-mono text-neutral-400 mb-1 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                Price Delta (£ GBP)
              </label>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-500 text-xs font-mono">
                  +£
                </span>
                <input
                  type="number"
                  step="5"
                  value={formData.priceDelta}
                  onChange={(e) =>
                    setFormData({ ...formData, priceDelta: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full pl-8 pr-3 py-1.5 bg-[#0A0A0A] border border-[#2B2B2B] text-xs font-mono rounded-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>
              <p className="text-[10px] text-neutral-500 mt-0.5">Use 0 for standard base inclusion</p>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-neutral-400 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                Lead Time Delta (Days)
              </label>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-500 text-xs font-mono">
                  +
                </span>
                <input
                  type="number"
                  min="0"
                  max="60"
                  value={formData.leadTimeDaysDelta}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      leadTimeDaysDelta: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full pl-7 pr-3 py-1.5 bg-[#0A0A0A] border border-[#2B2B2B] text-xs font-mono rounded-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>
              <p className="text-[10px] text-neutral-500 mt-0.5">Extra craft days required</p>
            </div>
          </div>

          {/* Swatch & Visual Texture */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-neutral-300 mb-1.5 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-amber-400" />
                Swatch Color (Hex)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.swatchColor}
                  onChange={(e) => setFormData({ ...formData, swatchColor: e.target.value })}
                  className="w-9 h-8 bg-black border border-[#2B2B2B] rounded-xs cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={formData.swatchColor}
                  onChange={(e) => setFormData({ ...formData, swatchColor: e.target.value })}
                  className="flex-1 px-3 py-1.5 bg-[#141414] border border-[#2B2B2B] text-xs font-mono rounded-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-300 mb-1.5">
                Swatch Image URL (Optional)
              </label>
              <input
                type="url"
                placeholder="https://..."
                value={formData.swatchImageUrl}
                onChange={(e) => setFormData({ ...formData, swatchImageUrl: e.target.value })}
                className="w-full px-3 py-1.5 bg-[#141414] border border-[#2B2B2B] text-xs font-mono rounded-xs text-white focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-neutral-300 mb-1.5">
              Material / Technical Details
            </label>
            <input
              type="text"
              placeholder="e.g. 100% Super 130s Worsted Wool, 380 GSM, Mill No. 4"
              value={formData.materialDetails}
              onChange={(e) => setFormData({ ...formData, materialDetails: e.target.value })}
              className="w-full px-3 py-2 bg-[#141414] border border-[#2B2B2B] text-xs font-mono rounded-xs text-white focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-neutral-300 mb-1.5">
              Customer Description
            </label>
            <textarea
              rows={2}
              placeholder="Sensory tactile notes for the client..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 bg-[#141414] border border-[#2B2B2B] text-xs font-sans rounded-xs text-white focus:border-amber-400 focus:outline-none"
            />
          </div>

          {/* Default and In-Stock */}
          <div className="flex items-center justify-between pt-2 border-t border-[#1F1F1F]">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isDefault}
                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                className="rounded-xs bg-[#141414] border-[#2B2B2B] text-amber-400 focus:ring-0"
              />
              <span className="text-xs font-mono text-white">Default Selected Option</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.inStock}
                onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                className="rounded-xs bg-[#141414] border-[#2B2B2B] text-amber-400 focus:ring-0"
              />
              <span className="text-xs font-mono text-white">Currently In Stock</span>
            </label>
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
              className="px-5 py-2 text-xs font-mono uppercase tracking-wider font-semibold rounded-xs bg-amber-400 hover:bg-amber-300 text-black shadow-lg shadow-amber-400/20 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              {isEditing ? 'Save Option' : 'Add Option'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
