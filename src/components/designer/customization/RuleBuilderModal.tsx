/**
 * @file RuleBuilderModal.tsx
 * Visual rule creation modal for the Customization Compatibility Engine.
 * Allows designers to specify incompatibilities, dependencies, and material guidelines.
 */

import React, { useState, useEffect } from 'react';
import { X, ShieldAlert, Check, AlertTriangle, ArrowRight, Ban } from 'lucide-react';
import {
  CompatibilityRule,
  CustomizationOptionGroup,
  RuleType,
} from '../../../types/customization.types';

export interface RuleBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  optionGroups: CustomizationOptionGroup[];
  onSave: (rule: Omit<CompatibilityRule, 'id'>) => void;
  initialRule?: CompatibilityRule | null;
}

export const RuleBuilderModal: React.FC<RuleBuilderModalProps> = ({
  isOpen,
  onClose,
  optionGroups,
  onSave,
  initialRule,
}) => {
  const isEditing = Boolean(initialRule);

  // Flatten all options for lookups
  const allOptions = optionGroups.flatMap((g) =>
    g.options.map((o) => ({ ...o, groupName: g.name }))
  );

  const [formData, setFormData] = useState<{
    name: string;
    ruleType: RuleType;
    sourceOptionId: string;
    targetOptionIds: string[];
    explanation: string;
    severity: 'error' | 'warning';
    active: boolean;
  }>({
    name: '',
    ruleType: 'incompatible',
    sourceOptionId: allOptions[0]?.id || '',
    targetOptionIds: [],
    explanation: '',
    severity: 'error',
    active: true,
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialRule) {
      setFormData({
        name: initialRule.name,
        ruleType: initialRule.ruleType,
        sourceOptionId: initialRule.sourceOptionId,
        targetOptionIds: initialRule.targetOptionIds || [],
        explanation: initialRule.explanation,
        severity: initialRule.severity,
        active: initialRule.active,
      });
    } else {
      setFormData({
        name: '',
        ruleType: 'incompatible',
        sourceOptionId: allOptions[0]?.id || '',
        targetOptionIds: [],
        explanation: '',
        severity: 'error',
        active: true,
      });
    }
    setError(null);
  }, [initialRule, isOpen]);

  if (!isOpen) return null;

  const handleToggleTargetOption = (optId: string) => {
    setFormData((prev) => {
      const exists = prev.targetOptionIds.includes(optId);
      return {
        ...prev,
        targetOptionIds: exists
          ? prev.targetOptionIds.filter((id) => id !== optId)
          : [...prev.targetOptionIds, optId],
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Rule name is required');
      return;
    }
    if (!formData.sourceOptionId) {
      setError('Please select a trigger option');
      return;
    }
    if (formData.targetOptionIds.length === 0) {
      setError('Please select at least one target option');
      return;
    }
    if (!formData.explanation.trim()) {
      setError('Please provide an explanation for tailors and customers');
      return;
    }

    const sourceOpt = allOptions.find((o) => o.id === formData.sourceOptionId);
    const targetNames = allOptions
      .filter((o) => formData.targetOptionIds.includes(o.id))
      .map((o) => o.name);

    onSave({
      name: formData.name.trim(),
      ruleType: formData.ruleType,
      sourceOptionId: formData.sourceOptionId,
      sourceOptionName: sourceOpt?.name,
      targetOptionIds: formData.targetOptionIds,
      targetOptionNames: targetNames,
      explanation: formData.explanation.trim(),
      severity: formData.severity,
      active: formData.active,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#0F0F0F] border border-[#2B2B2B] rounded-xs shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#222] flex items-center justify-between bg-[#141414]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xs bg-amber-400/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-mono uppercase tracking-wider text-white font-medium">
                {isEditing ? 'Edit Compatibility Rule' : 'Add Compatibility Rule'}
              </h3>
              <p className="text-[11px] text-neutral-400">
                Enforce garment integrity, hardware constraints, and material compatibility.
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
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {error && (
            <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-xs flex items-center gap-2 text-xs text-red-300">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-neutral-300 mb-1.5">
                Rule Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Heavy Hardware on Light Linen Rule"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-[#141414] border border-[#2B2B2B] text-xs font-mono rounded-xs text-white focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-300 mb-1.5">
                Rule Behavior *
              </label>
              <select
                value={formData.ruleType}
                onChange={(e) => setFormData({ ...formData, ruleType: e.target.value as RuleType })}
                className="w-full px-3 py-2 bg-[#141414] border border-[#2B2B2B] text-xs font-mono rounded-xs text-white focus:border-amber-400 focus:outline-none cursor-pointer"
              >
                <option value="incompatible" className="bg-[#141414]">
                  Incompatible With (Block Combination)
                </option>
                <option value="requires" className="bg-[#141414]">
                  Requires (Mandatory Pairing)
                </option>
                <option value="recommended" className="bg-[#141414]">
                  Recommended Pairing (Advisory)
                </option>
              </select>
            </div>
          </div>

          {/* Trigger Condition / Source Option */}
          <div className="p-4 bg-[#141414] border border-[#222] rounded-xs space-y-2">
            <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider block">
              1. IF CUSTOMER SELECTS THIS TRIGGER OPTION:
            </span>
            <select
              value={formData.sourceOptionId}
              onChange={(e) => setFormData({ ...formData, sourceOptionId: e.target.value })}
              className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#2B2B2B] text-xs font-mono rounded-xs text-white focus:border-amber-400 focus:outline-none cursor-pointer"
            >
              {optionGroups.map((grp) => (
                <optgroup key={grp.id} label={grp.name.toUpperCase()} className="bg-[#141414]">
                  {grp.options.map((opt) => (
                    <option key={opt.id} value={opt.id} className="bg-[#0A0A0A] text-white">
                      {opt.name} ({grp.name})
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* Consequence Target Options */}
          <div className="p-4 bg-[#141414] border border-[#222] rounded-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider">
                2. THEN {formData.ruleType.toUpperCase()} WITH THESE OPTIONS:
              </span>
              <span className="text-[10px] font-mono text-neutral-500">
                {formData.targetOptionIds.length} options selected
              </span>
            </div>

            <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
              {optionGroups.map((grp) => (
                <div key={grp.id} className="border border-[#1F1F1F] rounded-xs p-2.5 bg-[#0C0C0C]">
                  <p className="text-[10px] font-mono uppercase text-neutral-400 mb-1.5 font-semibold">
                    {grp.name}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {grp.options
                      .filter((o) => o.id !== formData.sourceOptionId)
                      .map((opt) => {
                        const isChecked = formData.targetOptionIds.includes(opt.id);
                        return (
                          <label
                            key={opt.id}
                            className={`flex items-center gap-2 p-1.5 rounded-xs border text-xs font-mono cursor-pointer transition-colors ${
                              isChecked
                                ? 'border-amber-400/50 bg-amber-400/10 text-white'
                                : 'border-[#222] hover:border-neutral-500 text-neutral-400'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggleTargetOption(opt.id)}
                              className="rounded-xs bg-[#141414] border-[#333] text-amber-400 focus:ring-0"
                            />
                            <span className="truncate">{opt.name}</span>
                          </label>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Explanation Text */}
          <div>
            <label className="block text-xs font-mono uppercase text-neutral-300 mb-1.5">
              Customer & Tailor Explanation *
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Heavy brass hardware requires structured wool or denim backing to prevent fabric tear..."
              value={formData.explanation}
              onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
              className="w-full px-3 py-2 bg-[#141414] border border-[#2B2B2B] text-xs font-sans rounded-xs text-white focus:border-amber-400 focus:outline-none"
            />
          </div>

          {/* Severity and Active Switch */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#1F1F1F]">
            <div>
              <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                Rule Severity
              </label>
              <select
                value={formData.severity}
                onChange={(e) =>
                  setFormData({ ...formData, severity: e.target.value as 'error' | 'warning' })
                }
                className="w-full px-3 py-1.5 bg-[#141414] border border-[#2B2B2B] text-xs font-mono rounded-xs text-white focus:border-amber-400 focus:outline-none"
              >
                <option value="error">Error (Blocks Checkout & Config)</option>
                <option value="warning">Warning (Shows Craft Advisory)</option>
              </select>
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="rounded-xs bg-[#141414] border-[#2B2B2B] text-amber-400 focus:ring-0"
                />
                <span className="text-xs font-mono text-white">Rule Active in Live Store</span>
              </label>
            </div>
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
