/**
 * @file ValidationRuleModal.tsx
 * Modal for creating and editing anatomical ratio rules and differential bounds
 * between measurement fields (e.g., chest-to-waist drop, hip-to-waist ratio).
 */

import React, { useState, useEffect } from 'react';
import { X, ShieldAlert, Check, AlertTriangle } from 'lucide-react';
import {
  MeasurementValidationRule,
  MeasurementFieldConfig,
  ValidationRuleType,
} from '../../../types/measurementConfig.types';

export interface ValidationRuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  fields: MeasurementFieldConfig[];
  onSave: (rule: Omit<MeasurementValidationRule, 'id'>) => void;
  initialRule?: MeasurementValidationRule | null;
}

export const ValidationRuleModal: React.FC<ValidationRuleModalProps> = ({
  isOpen,
  onClose,
  fields,
  onSave,
  initialRule,
}) => {
  const isEditing = Boolean(initialRule);

  const [formData, setFormData] = useState<{
    name: string;
    ruleType: ValidationRuleType;
    primaryFieldKey: string;
    secondaryFieldKey: string;
    operator: '<' | '>' | '<=' | '>=';
    thresholdValue: number;
    severity: 'error' | 'warning';
    errorMessage: string;
    active: boolean;
  }>({
    name: '',
    ruleType: 'differential',
    primaryFieldKey: fields[0]?.key || '',
    secondaryFieldKey: fields[1]?.key || '',
    operator: '>',
    thresholdValue: 30,
    severity: 'warning',
    errorMessage: '',
    active: true,
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialRule) {
      setFormData({
        name: initialRule.name,
        ruleType: initialRule.ruleType,
        primaryFieldKey: initialRule.primaryFieldKey,
        secondaryFieldKey: initialRule.secondaryFieldKey || fields[0]?.key || '',
        operator: (initialRule.operator as any) || '>',
        thresholdValue: initialRule.thresholdValue,
        severity: initialRule.severity,
        errorMessage: initialRule.errorMessage,
        active: initialRule.active,
      });
    } else {
      setFormData({
        name: '',
        ruleType: 'differential',
        primaryFieldKey: fields[0]?.key || '',
        secondaryFieldKey: fields[1]?.key || fields[0]?.key || '',
        operator: '>',
        thresholdValue: 30,
        severity: 'warning',
        errorMessage: '',
        active: true,
      });
    }
    setError(null);
  }, [initialRule, isOpen, fields]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Rule name is required');
      return;
    }
    if (!formData.primaryFieldKey) {
      setError('Primary field is required');
      return;
    }
    if (!formData.errorMessage.trim()) {
      setError('Error message explaining the anatomical issue is required');
      return;
    }

    onSave({
      name: formData.name.trim(),
      ruleType: formData.ruleType,
      primaryFieldKey: formData.primaryFieldKey,
      secondaryFieldKey: formData.secondaryFieldKey || undefined,
      operator: formData.operator,
      thresholdValue: Number(formData.thresholdValue),
      severity: formData.severity,
      errorMessage: formData.errorMessage.trim(),
      active: formData.active,
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
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-mono uppercase tracking-wider text-white font-medium">
                {isEditing ? 'Edit Anatomical Rule' : 'Add Anatomical Validation Rule'}
              </h3>
              <p className="text-[11px] text-neutral-400">
                Prevent physiologically impossible or extreme customer measurement entries.
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-xs flex items-center gap-2 text-xs text-red-300">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-mono uppercase text-neutral-300 mb-1.5">
              Rule Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Chest-to-Waist Drop Discrepancy"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 bg-[#141414] border border-[#2B2B2B] text-xs font-mono rounded-xs text-white focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono uppercase text-neutral-300 mb-1.5">
                Rule Check Type *
              </label>
              <select
                value={formData.ruleType}
                onChange={(e) =>
                  setFormData({ ...formData, ruleType: e.target.value as ValidationRuleType })
                }
                className="w-full px-3 py-2 bg-[#141414] border border-[#2B2B2B] text-xs font-mono rounded-xs text-white focus:border-amber-400 focus:outline-none cursor-pointer"
              >
                <option value="differential">Differential Difference (|A - B|)</option>
                <option value="ratio">Proportional Ratio (A / B)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-300 mb-1.5">
                Severity
              </label>
              <select
                value={formData.severity}
                onChange={(e) =>
                  setFormData({ ...formData, severity: e.target.value as 'error' | 'warning' })
                }
                className="w-full px-3 py-2 bg-[#141414] border border-[#2B2B2B] text-xs font-mono rounded-xs text-white focus:border-amber-400 focus:outline-none cursor-pointer"
              >
                <option value="warning">Warning (Allows Submission with Notice)</option>
                <option value="error">Error (Prohibits Invalid Form Submission)</option>
              </select>
            </div>
          </div>

          {/* Logic Formula */}
          <div className="p-4 bg-[#141414] border border-[#222] rounded-xs space-y-3">
            <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block">
              Anatomical Logic Formula
            </span>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[10px] text-neutral-400 uppercase mb-1">Primary Field</label>
                <select
                  value={formData.primaryFieldKey}
                  onChange={(e) => setFormData({ ...formData, primaryFieldKey: e.target.value })}
                  className="w-full px-2 py-1.5 bg-[#0C0C0C] border border-[#2B2B2B] text-xs font-mono rounded-xs text-white focus:border-amber-400 focus:outline-none"
                >
                  {fields.map((f) => (
                    <option key={f.key} value={f.key}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-neutral-400 uppercase mb-1">Operator</label>
                <select
                  value={formData.operator}
                  onChange={(e) => setFormData({ ...formData, operator: e.target.value as any })}
                  className="w-full px-2 py-1.5 bg-[#0C0C0C] border border-[#2B2B2B] text-xs font-mono rounded-xs text-white focus:border-amber-400 focus:outline-none"
                >
                  <option value=">">Greater than (&gt;)</option>
                  <option value="<">Less than (&lt;)</option>
                  <option value=">=">At least (&gt;=)</option>
                  <option value="<=">At most (&lt;=)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-neutral-400 uppercase mb-1">Threshold</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.thresholdValue}
                  onChange={(e) =>
                    setFormData({ ...formData, thresholdValue: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full px-2 py-1.5 bg-[#0C0C0C] border border-[#2B2B2B] text-xs font-mono rounded-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-neutral-400 uppercase mb-1">
                Compared Against (Secondary Field)
              </label>
              <select
                value={formData.secondaryFieldKey}
                onChange={(e) => setFormData({ ...formData, secondaryFieldKey: e.target.value })}
                className="w-full px-2 py-1.5 bg-[#0C0C0C] border border-[#2B2B2B] text-xs font-mono rounded-xs text-white focus:border-amber-400 focus:outline-none"
              >
                {fields.map((f) => (
                  <option key={f.key} value={f.key}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-neutral-300 mb-1.5">
              Client & Tailor Warning Explanation *
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Chest-to-waist drop is unusually large. Please re-check measurement tape position."
              value={formData.errorMessage}
              onChange={(e) => setFormData({ ...formData, errorMessage: e.target.value })}
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
              className="px-5 py-2 text-xs font-mono uppercase tracking-wider font-semibold rounded-xs bg-amber-400 hover:bg-amber-300 text-black shadow-lg shadow-amber-400/20 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              {isEditing ? 'Save Rule' : 'Deploy Rule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
