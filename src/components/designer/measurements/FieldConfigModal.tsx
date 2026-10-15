/**
 * @file FieldConfigModal.tsx
 * Modal for creating and editing individual garment measurement fields,
 * tolerance bounds, anatomical zones, and how-to-measure guide instructions.
 */

import React, { useState, useEffect } from 'react';
import { X, Ruler, Check, AlertCircle } from 'lucide-react';
import {
  MeasurementFieldConfig,
  AnatomicalZone,
} from '../../../types/measurementConfig.types';

export interface FieldConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  primaryUnit: 'cm' | 'inch';
  onSave: (field: Omit<MeasurementFieldConfig, 'id' | 'sortOrder'>) => void;
  initialField?: MeasurementFieldConfig | null;
}

const ANATOMICAL_ZONES: { value: AnatomicalZone; label: string }[] = [
  { value: 'chest_bust', label: 'Chest & Bust' },
  { value: 'torso_waist', label: 'Torso & Waist' },
  { value: 'shoulders', label: 'Shoulders & Yoke' },
  { value: 'arms_sleeves', label: 'Arms & Sleeves' },
  { value: 'hips_pelvis', label: 'Hips & Seat' },
  { value: 'legs_inseam', label: 'Legs & Inseam' },
  { value: 'full_stature', label: 'Full Stature & Loop' },
  { value: 'head_neck', label: 'Neck & Collar' },
];

export const FieldConfigModal: React.FC<FieldConfigModalProps> = ({
  isOpen,
  onClose,
  primaryUnit,
  onSave,
  initialField,
}) => {
  const isEditing = Boolean(initialField);

  const [formData, setFormData] = useState<{
    key: string;
    label: string;
    anatomicalZone: AnatomicalZone;
    unit: 'cm' | 'inch';
    minBound: number;
    maxBound: number;
    step: number;
    defaultValue: number;
    required: boolean;
    guideText: string;
    guideImageUrl: string;
    minWarn: number;
    maxWarn: number;
  }>({
    key: '',
    label: '',
    anatomicalZone: 'chest_bust',
    unit: primaryUnit,
    minBound: 60,
    maxBound: 160,
    step: 0.5,
    defaultValue: 95,
    required: true,
    guideText: '',
    guideImageUrl: '',
    minWarn: 70,
    maxWarn: 140,
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialField) {
      setFormData({
        key: initialField.key,
        label: initialField.label,
        anatomicalZone: initialField.anatomicalZone,
        unit: initialField.unit,
        minBound: initialField.minBound,
        maxBound: initialField.maxBound,
        step: initialField.step,
        defaultValue: initialField.defaultValue || Math.round((initialField.minBound + initialField.maxBound) / 2),
        required: initialField.required,
        guideText: initialField.guideText,
        guideImageUrl: initialField.guideImageUrl || '',
        minWarn: initialField.warningBounds?.minWarn || initialField.minBound + 5,
        maxWarn: initialField.warningBounds?.maxWarn || initialField.maxBound - 5,
      });
    } else {
      setFormData({
        key: '',
        label: '',
        anatomicalZone: 'chest_bust',
        unit: primaryUnit,
        minBound: 60,
        maxBound: 160,
        step: 0.5,
        defaultValue: 95,
        required: true,
        guideText: '',
        guideImageUrl: '',
        minWarn: 70,
        maxWarn: 140,
      });
    }
    setError(null);
  }, [initialField, isOpen, primaryUnit]);

  if (!isOpen) return null;

  const handleLabelChange = (label: string) => {
    const key = label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');
    setFormData((prev) => ({
      ...prev,
      label,
      key: isEditing ? prev.key : key,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.label.trim()) {
      setError('Field label is required');
      return;
    }
    if (!formData.key.trim()) {
      setError('Field key identifier is required');
      return;
    }
    if (formData.minBound >= formData.maxBound) {
      setError('Minimum bound must be less than maximum bound');
      return;
    }

    onSave({
      key: formData.key.trim(),
      label: formData.label.trim(),
      anatomicalZone: formData.anatomicalZone,
      unit: formData.unit,
      minBound: Number(formData.minBound),
      maxBound: Number(formData.maxBound),
      step: Number(formData.step),
      defaultValue: Number(formData.defaultValue),
      required: formData.required,
      guideText: formData.guideText.trim() || 'Measure around the anatomical point keeping the tape parallel to the floor.',
      guideImageUrl: formData.guideImageUrl.trim() || undefined,
      warningBounds: {
        minWarn: Number(formData.minWarn),
        maxWarn: Number(formData.maxWarn),
      },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#0F0F0F] border border-[#2B2B2B] rounded-xs shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#222] flex items-center justify-between bg-[#141414]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xs bg-amber-400/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Ruler className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-mono uppercase tracking-wider text-white font-medium">
                {isEditing ? 'Edit Measurement Field' : 'Add Measurement Field'}
              </h3>
              <p className="text-[11px] text-neutral-400">
                Configure anatomical landmark, units, bounds, and tailor instructions.
              </p>
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
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {error && (
            <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-xs flex items-center gap-2 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-mono uppercase text-neutral-300 mb-1.5">
              Field Display Label *
            </label>
            <input
              type="text"
              placeholder="e.g. Chest Circumference (Fullest Apex)"
              value={formData.label}
              onChange={(e) => handleLabelChange(e.target.value)}
              className="w-full px-3 py-2 bg-[#141414] border border-[#2B2B2B] text-xs font-mono rounded-xs text-white focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono uppercase text-neutral-300 mb-1.5">
                Key Identifier
              </label>
              <input
                type="text"
                placeholder="chest_circumference"
                value={formData.key}
                onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                className="w-full px-3 py-2 bg-[#141414] border border-[#2B2B2B] text-xs font-mono rounded-xs text-white focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-300 mb-1.5">
                Anatomical Zone *
              </label>
              <select
                value={formData.anatomicalZone}
                onChange={(e) =>
                  setFormData({ ...formData, anatomicalZone: e.target.value as AnatomicalZone })
                }
                className="w-full px-3 py-2 bg-[#141414] border border-[#2B2B2B] text-xs font-mono rounded-xs text-white focus:border-amber-400 focus:outline-none cursor-pointer"
              >
                {ANATOMICAL_ZONES.map((z) => (
                  <option key={z.value} value={z.value} className="bg-[#141414]">
                    {z.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Bounds and Unit */}
          <div className="p-4 bg-[#141414] border border-[#222] rounded-xs space-y-3">
            <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block">
              Tolerance Bounds & Measurement Increments
            </span>

            <div className="grid grid-cols-3 gap-3 text-xs font-mono">
              <div>
                <label className="block text-neutral-400 text-[10px] uppercase mb-1">
                  Min ({formData.unit})
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.minBound}
                  onChange={(e) =>
                    setFormData({ ...formData, minBound: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full px-2.5 py-1.5 bg-[#0C0C0C] border border-[#2B2B2B] rounded-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-400 text-[10px] uppercase mb-1">
                  Default ({formData.unit})
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.defaultValue}
                  onChange={(e) =>
                    setFormData({ ...formData, defaultValue: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full px-2.5 py-1.5 bg-[#0C0C0C] border border-[#2B2B2B] rounded-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-400 text-[10px] uppercase mb-1">
                  Max ({formData.unit})
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.maxBound}
                  onChange={(e) =>
                    setFormData({ ...formData, maxBound: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full px-2.5 py-1.5 bg-[#0C0C0C] border border-[#2B2B2B] rounded-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-neutral-400 text-[10px] uppercase mb-1">
                  Step Increment
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.step}
                  onChange={(e) =>
                    setFormData({ ...formData, step: parseFloat(e.target.value) || 0.5 })
                  }
                  className="w-full px-2.5 py-1.5 bg-[#0C0C0C] border border-[#2B2B2B] rounded-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-400 text-[10px] uppercase mb-1">
                  Unit
                </label>
                <select
                  value={formData.unit}
                  onChange={(e) =>
                    setFormData({ ...formData, unit: e.target.value as 'cm' | 'inch' })
                  }
                  className="w-full px-2.5 py-1.5 bg-[#0C0C0C] border border-[#2B2B2B] rounded-xs text-white focus:border-amber-400 focus:outline-none cursor-pointer"
                >
                  <option value="cm">Centimetres (cm)</option>
                  <option value="inch">Inches (in)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Guide Text */}
          <div>
            <label className="block text-xs font-mono uppercase text-neutral-300 mb-1.5">
              How-To-Measure Guide Instructions *
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Wrap measuring tape around the fullest point of the bust/chest keeping the tape parallel to the floor with two fingers ease..."
              value={formData.guideText}
              onChange={(e) => setFormData({ ...formData, guideText: e.target.value })}
              className="w-full px-3 py-2 bg-[#141414] border border-[#2B2B2B] text-xs font-sans rounded-xs text-white focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-neutral-300 mb-1.5">
              Anatomical Illustration / Guide Image URL (Optional)
            </label>
            <input
              type="url"
              placeholder="https://..."
              value={formData.guideImageUrl}
              onChange={(e) => setFormData({ ...formData, guideImageUrl: e.target.value })}
              className="w-full px-3 py-2 bg-[#141414] border border-[#2B2B2B] text-xs font-mono rounded-xs text-white focus:border-amber-400 focus:outline-none"
            />
          </div>

          {/* Required Flag */}
          <div className="pt-2 border-t border-[#1F1F1F]">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.required}
                onChange={(e) => setFormData({ ...formData, required: e.target.checked })}
                className="rounded-xs bg-[#141414] border-[#2B2B2B] text-amber-400 focus:ring-0"
              />
              <span className="text-xs font-mono text-white">
                Mandatory Field (Required for Made-to-Measure Order Placement)
              </span>
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
              {isEditing ? 'Save Field' : 'Add Field'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
