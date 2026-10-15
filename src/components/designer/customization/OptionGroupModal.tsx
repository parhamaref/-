/**
 * @file OptionGroupModal.tsx
 * Modal for creating and editing Customization Option Groups
 * (Fabric, Color, Trim, Accessories, Embroidery, Monogram).
 */

import React, { useState, useEffect } from 'react';
import { X, Layers, Check, AlertCircle } from 'lucide-react';
import { CustomizationOptionGroup, CustomizationGroupType } from '../../../types/customization.types';

export interface OptionGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (group: Omit<CustomizationOptionGroup, 'id' | 'sortOrder' | 'options'>) => void;
  initialGroup?: CustomizationOptionGroup | null;
}

const GROUP_TYPES: { value: CustomizationGroupType; label: string; desc: string }[] = [
  { value: 'fabric', label: 'Fabric Selection', desc: 'Core body textile, weave weight and mill' },
  { value: 'color', label: 'Color & Dye Finish', desc: 'Colorways, mineral washes and bath finishes' },
  { value: 'trim', label: 'Trim & Hardware', desc: 'Buttons, zippers, studs, and lapel facings' },
  { value: 'accessory', label: 'Modular Accessories', desc: 'Detachable belts, hoods, tabs, and pocket squares' },
  { value: 'embroidery', label: 'Artisan Embroidery', desc: 'Bullion crests, bar-tacks, and stitched insignia' },
  { value: 'monogram', label: 'Bespoke Monogramming', desc: 'Initials, placement, and font lettering' },
];

export const OptionGroupModal: React.FC<OptionGroupModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialGroup,
}) => {
  const isEditing = Boolean(initialGroup);

  const [formData, setFormData] = useState<{
    name: string;
    type: CustomizationGroupType;
    description: string;
    required: boolean;
    multiSelect: boolean;
    maxSelections: number;
  }>({
    name: '',
    type: 'fabric',
    description: '',
    required: true,
    multiSelect: false,
    maxSelections: 1,
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialGroup) {
      setFormData({
        name: initialGroup.name,
        type: initialGroup.type,
        description: initialGroup.description,
        required: initialGroup.required,
        multiSelect: initialGroup.multiSelect,
        maxSelections: initialGroup.maxSelections || 1,
      });
    } else {
      setFormData({
        name: '',
        type: 'fabric',
        description: '',
        required: true,
        multiSelect: false,
        maxSelections: 1,
      });
    }
    setError(null);
  }, [initialGroup, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Group name is required');
      return;
    }

    onSave({
      name: formData.name.trim(),
      type: formData.type,
      description: formData.description.trim(),
      required: formData.required,
      multiSelect: formData.multiSelect,
      maxSelections: formData.multiSelect ? formData.maxSelections : 1,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#0F0F0F] border border-[#2B2B2B] rounded-xs shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#222] flex items-center justify-between bg-[#141414]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xs bg-amber-400/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-mono uppercase tracking-wider text-white font-medium">
                {isEditing ? 'Edit Option Group' : 'Create Customization Group'}
              </h3>
              <p className="text-[11px] text-neutral-400">Define a category of client garment choices.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-xs hover:bg-[#222] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-xs flex items-center gap-2 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-mono uppercase text-neutral-300 mb-1.5">
              Group Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Primary Fabric Selection, Lapel Facing, Monogram"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 bg-[#141414] border border-[#2B2B2B] text-xs font-mono rounded-xs text-white focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-neutral-300 mb-1.5">
              Group Type *
            </label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value as CustomizationGroupType })
              }
              className="w-full px-3 py-2 bg-[#141414] border border-[#2B2B2B] text-xs font-mono rounded-xs text-white focus:border-amber-400 focus:outline-none cursor-pointer"
            >
              {GROUP_TYPES.map((t) => (
                <option key={t.value} value={t.value} className="bg-[#141414] text-white">
                  {t.label} ({t.desc})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-neutral-300 mb-1.5">
              Description / Advisory
            </label>
            <textarea
              rows={2}
              placeholder="Guidance shown to customers when selecting from this group..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 bg-[#141414] border border-[#2B2B2B] text-xs font-sans rounded-xs text-white focus:border-amber-400 focus:outline-none"
            />
          </div>

          {/* Selection Rules */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#1F1F1F]">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.required}
                onChange={(e) => setFormData({ ...formData, required: e.target.checked })}
                className="rounded-xs bg-[#141414] border-[#2B2B2B] text-amber-400 focus:ring-0"
              />
              <span className="text-xs font-mono text-white">Mandatory Selection</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.multiSelect}
                onChange={(e) => setFormData({ ...formData, multiSelect: e.target.checked })}
                className="rounded-xs bg-[#141414] border-[#2B2B2B] text-amber-400 focus:ring-0"
              />
              <span className="text-xs font-mono text-white">Allow Multi-Select</span>
            </label>
          </div>

          {formData.multiSelect && (
            <div>
              <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                Maximum Options Allowed
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={formData.maxSelections}
                onChange={(e) =>
                  setFormData({ ...formData, maxSelections: parseInt(e.target.value) || 1 })
                }
                className="w-32 px-3 py-1.5 bg-[#141414] border border-[#2B2B2B] text-xs font-mono rounded-xs text-white focus:border-amber-400 focus:outline-none"
              />
            </div>
          )}

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
              {isEditing ? 'Save Group' : 'Create Group'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
