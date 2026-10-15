/**
 * @file CustomizationBuilderWorkspace.tsx
 * Enterprise Product Customization Builder workspace for independent fashion designers.
 * Features Option Groups, Swatch Palettes, Compatibility Engine, Dynamic Pricing,
 * Combinatorial Variant Matrix Generator, and Live Bespoke Storefront Simulator.
 */

import React, { useState, useMemo } from 'react';
import {
  Sliders,
  Plus,
  Layers,
  Sparkles,
  ShieldAlert,
  Calculator,
  Play,
  CheckCircle2,
  Trash2,
  Edit3,
  DollarSign,
  Clock,
  Palette,
  AlertTriangle,
  RotateCcw,
  Download,
  Check,
  ChevronRight,
  Eye,
  Copy,
  Search,
  Filter,
  Package,
  Scissors,
  Bookmark,
  ShieldCheck,
  Type,
  Maximize2,
  BadgePercent,
} from 'lucide-react';
import { useCustomizationStore } from '../../../stores/customizationStore';
import {
  CustomizationOptionGroup,
  CustomizationOption,
  CompatibilityRule,
  VariantPermutation,
  RuleType,
} from '../../../types/customization.types';
import {
  evaluateCompatibility,
  calculateDynamicPrice,
  generateVariantPermutations,
} from '../../../utils/customizationRuleEngine';
import { OptionGroupModal } from './OptionGroupModal';
import { OptionItemModal } from './OptionItemModal';
import { RuleBuilderModal } from './RuleBuilderModal';
import { VariantDetailModal } from './VariantDetailModal';

type WorkspaceTab = 'groups' | 'rules' | 'variants' | 'simulator';

export const CustomizationBuilderWorkspace: React.FC = () => {
  const {
    template,
    setBasePrice,
    setBaseLeadTime,
    addOptionGroup,
    updateOptionGroup,
    deleteOptionGroup,
    duplicateOptionGroup,
    addOption,
    updateOption,
    deleteOption,
    duplicateOption,
    toggleOptionStock,
    addRule,
    updateRule,
    deleteRule,
    toggleRule,
    resetToDefaults,
  } = useCustomizationStore();

  const [activeTab, setActiveTab] = useState<WorkspaceTab>('groups');

  // Modals state
  const [groupModalState, setGroupModalState] = useState<{
    isOpen: boolean;
    initialGroup: CustomizationOptionGroup | null;
  }>({ isOpen: false, initialGroup: null });

  const [optionModalState, setOptionModalState] = useState<{
    isOpen: boolean;
    groupId: string;
    groupName: string;
    initialOption: CustomizationOption | null;
  }>({ isOpen: false, groupId: '', groupName: '', initialOption: null });

  const [ruleModalState, setRuleModalState] = useState<{
    isOpen: boolean;
    initialRule: CompatibilityRule | null;
  }>({ isOpen: false, initialRule: null });

  // Inspection modal for Variant Matrix
  const [inspectedVariant, setInspectedVariant] = useState<VariantPermutation | null>(null);

  // Search & Filter state for Variant Matrix
  const [variantSearch, setVariantSearch] = useState('');
  const [variantFilter, setVariantFilter] = useState<'all' | 'compatible' | 'conflict'>('all');

  // Search & Filter state for Rules
  const [ruleSearch, setRuleSearch] = useState('');
  const [ruleTypeFilter, setRuleTypeFilter] = useState<'all' | RuleType>('all');

  // Simulator selections (Map groupId -> optionId or array of optionIds)
  const [simulatorSelections, setSimulatorSelections] = useState<Record<string, string[]>>(() => {
    const defaults: Record<string, string[]> = {};
    template.optionGroups.forEach((g) => {
      const def = g.options.find((o) => o.isDefault) || g.options[0];
      if (def) {
        defaults[g.id] = [def.id];
      } else {
        defaults[g.id] = [];
      }
    });
    return defaults;
  });

  // Bespoke Monogramming state
  const [monogramText, setMonogramText] = useState('D.M.');
  const [monogramFont, setMonogramFont] = useState<'serif' | 'gothic' | 'modern' | 'script'>('serif');
  const [monogramThread, setMonogramThread] = useState<{ name: string; color: string }>({
    name: 'Atelier Gold Bullion',
    color: '#D4AF37',
  });

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Flattened active selections for simulator
  const activeSelectedOptionIds = useMemo(() => {
    return Object.values(simulatorSelections).flat();
  }, [simulatorSelections]);

  const activeSelectedOptions = useMemo(() => {
    const all = template.optionGroups.flatMap((g) => g.options);
    return all.filter((o) => activeSelectedOptionIds.includes(o.id));
  }, [template, activeSelectedOptionIds]);

  // Compatibility evaluation for simulator
  const simulatorEvaluation = useMemo(() => {
    return evaluateCompatibility(activeSelectedOptionIds, template.rules);
  }, [activeSelectedOptionIds, template.rules]);

  // Dynamic price for simulator
  const simulatorPricing = useMemo(() => {
    return calculateDynamicPrice(template.basePrice, activeSelectedOptions);
  }, [template.basePrice, activeSelectedOptions]);

  // Total lead time for simulator
  const simulatorLeadTime = useMemo(() => {
    const sumDeltas = activeSelectedOptions.reduce((acc, opt) => acc + (opt.leadTimeDaysDelta || 0), 0);
    return Math.max(1, template.baseLeadTimeDays + sumDeltas);
  }, [template.baseLeadTimeDays, activeSelectedOptions]);

  // Generated variant permutations
  const generatedVariants = useMemo(() => {
    return generateVariantPermutations(
      template.optionGroups,
      template.rules,
      template.basePrice,
      template.baseLeadTimeDays,
      40
    );
  }, [template]);

  // Filtered variants
  const filteredVariants = useMemo(() => {
    return generatedVariants.filter((v) => {
      const matchesSearch =
        variantSearch === '' ||
        v.sku.toLowerCase().includes(variantSearch.toLowerCase()) ||
        v.name.toLowerCase().includes(variantSearch.toLowerCase());

      const matchesStatus =
        variantFilter === 'all' ||
        (variantFilter === 'compatible' && v.isCompatible) ||
        (variantFilter === 'conflict' && !v.isCompatible);

      return matchesSearch && matchesStatus;
    });
  }, [generatedVariants, variantSearch, variantFilter]);

  // Filtered rules
  const filteredRules = useMemo(() => {
    return template.rules.filter((r) => {
      const matchesSearch =
        ruleSearch === '' ||
        r.name.toLowerCase().includes(ruleSearch.toLowerCase()) ||
        r.explanation.toLowerCase().includes(ruleSearch.toLowerCase()) ||
        (r.sourceOptionName && r.sourceOptionName.toLowerCase().includes(ruleSearch.toLowerCase()));

      const matchesType = ruleTypeFilter === 'all' || r.ruleType === ruleTypeFilter;

      return matchesSearch && matchesType;
    });
  }, [template.rules, ruleSearch, ruleTypeFilter]);

  const handleSimulatorOptionToggle = (groupId: string, optionId: string, multiSelect: boolean) => {
    setSimulatorSelections((prev) => {
      const current = prev[groupId] || [];
      if (!multiSelect) {
        return { ...prev, [groupId]: [optionId] };
      }
      if (current.includes(optionId)) {
        return { ...prev, [groupId]: current.filter((id) => id !== optionId) };
      }
      return { ...prev, [groupId]: [...current, optionId] };
    });
  };

  const handleResetSimulator = () => {
    const defaults: Record<string, string[]> = {};
    template.optionGroups.forEach((g) => {
      const def = g.options.find((o) => o.isDefault) || g.options[0];
      defaults[g.id] = def ? [def.id] : [];
    });
    setSimulatorSelections(defaults);
    showToast('Reset simulator selections to defaults');
  };

  const handleSimulateConflict = () => {
    // Set Heavy Belgian Slub Linen + Oxidized Blackened Brass Studs to trigger conflict rule 001
    setSimulatorSelections((prev) => ({
      ...prev,
      grp_fabric: ['opt_fab_linen'],
      grp_trim: ['opt_trm_brass'],
    }));
    showToast('Triggered conflict: Slub Linen with Brass Studs');
  };

  const exportVariantsCsv = () => {
    const headers = 'SKU,Variant Combination,Calculated Price (GBP),Lead Time (Days),Compatibility Status,Conflict Notes\n';
    const rows = generatedVariants
      .map(
        (v) =>
          `"${v.sku}","${v.name}",${v.calculatedPrice},${v.calculatedLeadTimeDays},"${v.isCompatible ? 'COMPATIBLE' : 'INCOMPATIBLE'}","${v.conflictReason || ''}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.name.toLowerCase().replace(/\s+/g, '_')}_variants.csv`;
    a.click();
    showToast('Variant Matrix exported as CSV');
  };

  // Check if monogram option is active
  const hasMonogramSelected = useMemo(() => {
    const monogramGroup = template.optionGroups.find((g) => g.type === 'monogram');
    if (!monogramGroup) return false;
    const selected = simulatorSelections[monogramGroup.id] || [];
    return selected.some((id) => id !== 'opt_mng_none');
  }, [template.optionGroups, simulatorSelections]);

  // Check if embroidery option is active
  const hasEmbroiderySelected = useMemo(() => {
    const embGroup = template.optionGroups.find((g) => g.type === 'embroidery');
    if (!embGroup) return false;
    const selected = simulatorSelections[embGroup.id] || [];
    return selected.some((id) => id !== 'opt_emb_none');
  }, [template.optionGroups, simulatorSelections]);

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#141414] border border-amber-500/50 text-white px-4 py-3 rounded-xs shadow-2xl flex items-center gap-2.5 text-xs font-mono">
          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. HEADER & BASE CONFIGURATION STRIP */}
      <div className="p-6 bg-[#0E0E0E] border border-[#2B2B2B] rounded-xs shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 bg-amber-400/10 border border-amber-400/30 text-amber-400 text-[10px] font-mono uppercase tracking-wider rounded-xs">
                Product Customization Studio
              </span>
              <span className="text-neutral-500 text-xs font-mono">ID: {template.id}</span>
            </div>
            <h1 className="text-xl md:text-2xl font-serif text-white tracking-tight uppercase">
              {template.name}
            </h1>
            <p className="text-xs text-neutral-400 font-sans mt-0.5">
              Define option groups, compatibility exclusion rules, and dynamic price formulas for bespoke tailoring.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap font-mono">
            {/* Base Price Config */}
            <div className="px-3.5 py-2 bg-[#141414] border border-[#2B2B2B] rounded-xs flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-amber-400" />
              <div>
                <span className="text-[9px] text-neutral-500 uppercase block">Base Price</span>
                <div className="flex items-center text-xs font-bold text-white">
                  <span>£</span>
                  <input
                    type="number"
                    value={template.basePrice}
                    onChange={(e) => setBasePrice(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-16 bg-transparent text-white font-mono text-xs focus:outline-none focus:text-amber-400"
                  />
                </div>
              </div>
            </div>

            {/* Base Lead Time */}
            <div className="px-3.5 py-2 bg-[#141414] border border-[#2B2B2B] rounded-xs flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <div>
                <span className="text-[9px] text-neutral-500 uppercase block">Base Lead Time</span>
                <div className="flex items-center text-xs font-bold text-white">
                  <input
                    type="number"
                    value={template.baseLeadTimeDays}
                    onChange={(e) => setBaseLeadTime(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-10 bg-transparent text-white font-mono text-xs focus:outline-none focus:text-amber-400"
                  />
                  <span>Days</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                if (confirm('Reset template configuration to factory Savile Row defaults?')) {
                  resetToDefaults();
                  showToast('Configuration reset to defaults');
                }
              }}
              className="p-2.5 bg-[#141414] hover:bg-[#202020] border border-[#2B2B2B] text-neutral-400 hover:text-white rounded-xs transition-colors cursor-pointer"
              title="Reset to Defaults"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Workspace Sub-Tabs */}
        <div className="pt-2 border-t border-[#1C1C1C] flex items-center justify-between gap-3 overflow-x-auto no-scrollbar text-xs font-mono">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('groups')}
              className={`px-3 py-2 border-b-2 font-medium transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === 'groups'
                  ? 'border-amber-400 text-amber-400 bg-amber-400/5'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Option Groups ({template.optionGroups.length})
            </button>

            <button
              onClick={() => setActiveTab('rules')}
              className={`px-3 py-2 border-b-2 font-medium transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === 'rules'
                  ? 'border-amber-400 text-amber-400 bg-amber-400/5'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              Compatibility Engine ({template.rules.length})
            </button>

            <button
              onClick={() => setActiveTab('variants')}
              className={`px-3 py-2 border-b-2 font-medium transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === 'variants'
                  ? 'border-amber-400 text-amber-400 bg-amber-400/5'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              Variant Matrix ({generatedVariants.length})
            </button>

            <button
              onClick={() => setActiveTab('simulator')}
              className={`px-3 py-2 border-b-2 font-medium transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === 'simulator'
                  ? 'border-amber-400 text-amber-400 bg-amber-400/5'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              <Play className="w-3.5 h-3.5 text-emerald-400" />
              Live Storefront Simulator
            </button>
          </div>

          {activeTab === 'groups' && (
            <button
              onClick={() => setGroupModalState({ isOpen: true, initialGroup: null })}
              className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-black text-xs font-mono uppercase tracking-wider font-semibold rounded-xs transition-colors flex items-center gap-1 cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              New Group
            </button>
          )}

          {activeTab === 'rules' && (
            <button
              onClick={() => setRuleModalState({ isOpen: true, initialRule: null })}
              className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-black text-xs font-mono uppercase tracking-wider font-semibold rounded-xs transition-colors flex items-center gap-1 cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              New Rule
            </button>
          )}

          {activeTab === 'variants' && (
            <button
              onClick={exportVariantsCsv}
              className="px-3 py-1.5 bg-[#1F1F1F] hover:bg-[#2A2A2A] text-white border border-[#333] text-xs font-mono uppercase tracking-wider rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              Export CSV
            </button>
          )}
        </div>
      </div>

      {/* 2. TAB CONTENT PANELS */}

      {/* TAB 1: OPTION GROUPS & INDIVIDUAL OPTIONS */}
      {activeTab === 'groups' && (
        <div className="space-y-6">
          {/* Quick Category Badges Bar */}
          <div className="p-3.5 bg-[#141414] border border-[#222] rounded-xs flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-neutral-400">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase text-neutral-500 font-bold">Supported Option Types:</span>
              <span className="px-2 py-0.5 bg-[#1D1D1D] rounded-xs text-amber-300">Fabric Choices</span>
              <span className="px-2 py-0.5 bg-[#1D1D1D] rounded-xs text-amber-300">Color Palette</span>
              <span className="px-2 py-0.5 bg-[#1D1D1D] rounded-xs text-amber-300">Trim & Hardware</span>
              <span className="px-2 py-0.5 bg-[#1D1D1D] rounded-xs text-amber-300">Modular Accessories</span>
              <span className="px-2 py-0.5 bg-[#1D1D1D] rounded-xs text-amber-300">Artisan Embroidery</span>
              <span className="px-2 py-0.5 bg-[#1D1D1D] rounded-xs text-amber-300">Monogramming</span>
            </div>
            <span className="text-neutral-500 text-[11px]">
              {template.optionGroups.reduce((acc, g) => acc + g.options.length, 0)} total options configured
            </span>
          </div>

          {template.optionGroups.map((group) => (
            <div
              key={group.id}
              className="p-5 bg-[#0E0E0E] border border-[#222] rounded-xs shadow-lg space-y-4"
            >
              {/* Group Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1C1C1C] pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-xs bg-[#1A1A1A] border border-[#333] flex items-center justify-center text-amber-400 text-xs font-mono font-bold">
                    {group.sortOrder}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-mono uppercase tracking-wider text-white font-medium">
                        {group.name}
                      </h3>
                      <span className="px-2 py-0.2 bg-[#1A1A1A] border border-[#2E2E2E] text-[10px] font-mono text-neutral-300 uppercase rounded-xs">
                        {group.type}
                      </span>
                      {group.required && (
                        <span className="text-[10px] font-mono text-amber-400">Required</span>
                      )}
                      {group.multiSelect && (
                        <span className="text-[10px] font-mono text-neutral-400">
                          (Multi: max {group.maxSelections})
                        </span>
                      )}
                    </div>
                    {group.description && (
                      <p className="text-[11px] text-neutral-400 font-sans mt-0.5">
                        {group.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Group Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setOptionModalState({
                        isOpen: true,
                        groupId: group.id,
                        groupName: group.name,
                        initialOption: null,
                      })
                    }
                    className="px-2.5 py-1.5 bg-[#1A1A1A] hover:bg-[#252525] border border-[#333] text-amber-300 text-xs font-mono rounded-xs transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Option
                  </button>

                  <button
                    onClick={() => {
                      duplicateOptionGroup(group.id);
                      showToast(`Duplicated ${group.name}`);
                    }}
                    className="p-1.5 text-neutral-400 hover:text-white hover:bg-[#222] rounded-xs transition-colors cursor-pointer"
                    title="Duplicate group"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() =>
                      setGroupModalState({ isOpen: true, initialGroup: group })
                    }
                    className="p-1.5 text-neutral-400 hover:text-white hover:bg-[#222] rounded-xs transition-colors cursor-pointer"
                    title="Edit group"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Delete group "${group.name}" and all its options?`)) {
                        deleteOptionGroup(group.id);
                        showToast(`Deleted ${group.name}`);
                      }
                    }}
                    className="p-1.5 text-neutral-400 hover:text-red-400 hover:bg-red-950/30 rounded-xs transition-colors cursor-pointer"
                    title="Delete group"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {group.options.map((opt) => (
                  <div
                    key={opt.id}
                    className={`p-3.5 bg-[#141414] border rounded-xs flex flex-col justify-between space-y-3 transition-colors group ${
                      opt.inStock ? 'border-[#222] hover:border-neutral-500' : 'border-rose-950/60 opacity-75'
                    }`}
                  >
                    <div>
                      {/* Swatch & Title */}
                      <div className="flex items-start gap-2.5">
                        {opt.swatchImageUrl ? (
                          <div className="w-8 h-8 rounded-xs overflow-hidden border border-[#333] shrink-0 bg-black">
                            <img
                              src={opt.swatchImageUrl}
                              alt={opt.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : opt.swatchColor ? (
                          <div
                            className="w-8 h-8 rounded-xs border border-[#333] shrink-0 shadow-xs"
                            style={{ backgroundColor: opt.swatchColor }}
                          />
                        ) : null}

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <h4 className="text-xs font-mono text-white truncate font-medium">
                              {opt.name}
                            </h4>
                            {opt.isDefault && (
                              <span className="text-[9px] font-mono text-amber-400 shrink-0">
                                Default
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] font-mono text-neutral-500 block truncate">
                            SKU: {opt.skuCode || 'N/A'}
                          </span>
                        </div>
                      </div>

                      {/* Description & Material */}
                      {opt.materialDetails && (
                        <p className="text-[11px] text-neutral-400 font-sans mt-2 line-clamp-2">
                          {opt.materialDetails}
                        </p>
                      )}
                    </div>

                    {/* Pricing, Lead Time & Card Actions */}
                    <div className="pt-2 border-t border-[#1C1C1C] flex items-center justify-between text-xs font-mono">
                      <div>
                        <span className="text-amber-400 font-bold block">
                          {opt.priceDelta > 0 ? `+£${opt.priceDelta}` : 'Included'}
                        </span>
                        {opt.leadTimeDaysDelta > 0 && (
                          <span className="text-[9px] text-neutral-500 block">
                            +{opt.leadTimeDaysDelta} days
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        {/* Stock status toggle */}
                        <button
                          onClick={() => {
                            toggleOptionStock(group.id, opt.id);
                            showToast(`${opt.name} is now ${!opt.inStock ? 'In Stock' : 'Out of Stock'}`);
                          }}
                          className={`text-[9px] px-1.5 py-0.5 rounded-xs border cursor-pointer ${
                            opt.inStock
                              ? 'border-emerald-800/60 text-emerald-300 bg-emerald-950/40'
                              : 'border-rose-800/60 text-rose-300 bg-rose-950/40'
                          }`}
                          title="Toggle stock status"
                        >
                          {opt.inStock ? 'In Stock' : 'Out'}
                        </button>

                        {/* Duplicate option */}
                        <button
                          onClick={() => {
                            duplicateOption(group.id, opt.id);
                            showToast(`Duplicated ${opt.name}`);
                          }}
                          className="p-1 text-neutral-400 hover:text-white cursor-pointer"
                          title="Duplicate option"
                        >
                          <Copy className="w-3 h-3" />
                        </button>

                        <button
                          onClick={() =>
                            setOptionModalState({
                              isOpen: true,
                              groupId: group.id,
                              groupName: group.name,
                              initialOption: opt,
                            })
                          }
                          className="p-1 text-neutral-400 hover:text-amber-400 cursor-pointer"
                          title="Edit option"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>

                        <button
                          onClick={() => {
                            if (confirm(`Remove option "${opt.name}"?`)) {
                              deleteOption(group.id, opt.id);
                              showToast(`Removed ${opt.name}`);
                            }
                          }}
                          className="p-1 text-neutral-400 hover:text-red-400 cursor-pointer"
                          title="Delete option"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: COMPATIBILITY RULE ENGINE */}
      {activeTab === 'rules' && (
        <div className="space-y-5">
          {/* Rule Filter & Search Bar */}
          <div className="p-4 bg-[#141414] border border-[#242424] rounded-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-white font-medium">Garment Structure & Material Compatibility Guard</span>
              <span className="text-neutral-500">({template.rules.length} Active Rules)</span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Search rules..."
                  value={ruleSearch}
                  onChange={(e) => setRuleSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 bg-[#0C0C0C] border border-[#2B2B2B] rounded-xs text-white text-xs placeholder:text-neutral-600 focus:outline-none focus:border-amber-400 w-44"
                />
              </div>

              <div className="flex items-center gap-1 bg-[#0C0C0C] p-1 border border-[#2B2B2B] rounded-xs">
                {(['all', 'incompatible', 'requires', 'recommended'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setRuleTypeFilter(type)}
                    className={`px-2 py-0.5 text-[10px] font-mono uppercase rounded-xs transition-colors cursor-pointer ${
                      ruleTypeFilter === type
                        ? 'bg-amber-400 text-black font-bold'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRules.map((rule) => (
              <div
                key={rule.id}
                className={`p-4 rounded-xs border transition-colors ${
                  rule.active ? 'bg-[#0E0E0E] border-[#2B2B2B]' : 'bg-[#0A0A0A] border-[#1C1C1C] opacity-60'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 text-[9px] font-mono uppercase font-bold rounded-xs ${
                        rule.severity === 'error'
                          ? 'bg-rose-950/70 border border-rose-800 text-rose-300'
                          : 'bg-amber-950/70 border border-amber-800 text-amber-300'
                      }`}
                    >
                      {rule.ruleType.toUpperCase()}
                    </span>
                    <h4 className="text-xs font-mono text-white font-medium">{rule.name}</h4>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => toggleRule(rule.id)}
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-xs border cursor-pointer ${
                        rule.active
                          ? 'border-emerald-700/60 text-emerald-300 bg-emerald-950/30'
                          : 'border-[#333] text-neutral-500'
                      }`}
                    >
                      {rule.active ? 'Active' : 'Disabled'}
                    </button>
                    <button
                      onClick={() => setRuleModalState({ isOpen: true, initialRule: rule })}
                      className="p-1 text-neutral-400 hover:text-white cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete rule "${rule.name}"?`)) {
                          deleteRule(rule.id);
                          showToast('Rule deleted');
                        }
                      }}
                      className="p-1 text-neutral-400 hover:text-red-400 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Visual Logic Flow */}
                <div className="mt-3 p-3 bg-[#141414] border border-[#1F1F1F] rounded-xs text-xs font-mono space-y-1.5">
                  <div className="text-neutral-400 flex items-center gap-2">
                    <span className="text-[10px] text-neutral-500 uppercase">Trigger:</span>
                    <span className="text-amber-400 font-semibold">{rule.sourceOptionName}</span>
                  </div>
                  <div className="text-neutral-400 flex items-center gap-2">
                    <span className="text-[10px] text-neutral-500 uppercase">
                      {rule.ruleType === 'incompatible' ? 'Cannot Pair With:' : 'Requires:'}
                    </span>
                    <span className="text-white font-medium">
                      {(rule.targetOptionNames || []).join(', ')}
                    </span>
                  </div>
                </div>

                <p className="mt-3 text-xs text-neutral-400 font-sans leading-relaxed">
                  {rule.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: DYNAMIC PRICING & VARIANT GENERATOR */}
      {activeTab === 'variants' && (
        <div className="space-y-5">
          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3 bg-[#121212] border border-[#222] rounded-xs">
              <span className="text-[10px] text-neutral-500 uppercase block">Total Generated SKUs</span>
              <span className="text-lg font-bold text-white mt-0.5 block">{generatedVariants.length}</span>
            </div>

            <div className="p-3 bg-[#121212] border border-[#222] rounded-xs">
              <span className="text-[10px] text-neutral-500 uppercase block">Compatible SKUs</span>
              <span className="text-lg font-bold text-emerald-400 mt-0.5 block">
                {generatedVariants.filter((v) => v.isCompatible).length}
              </span>
            </div>

            <div className="p-3 bg-[#121212] border border-[#222] rounded-xs">
              <span className="text-[10px] text-neutral-500 uppercase block">Conflict Blocked</span>
              <span className="text-lg font-bold text-rose-400 mt-0.5 block">
                {generatedVariants.filter((v) => !v.isCompatible).length}
              </span>
            </div>

            <div className="p-3 bg-[#121212] border border-[#222] rounded-xs">
              <span className="text-[10px] text-neutral-500 uppercase block">Dynamic Price Range</span>
              <span className="text-lg font-bold text-amber-400 mt-0.5 block">
                £{Math.min(...generatedVariants.map((v) => v.calculatedPrice))} - £
                {Math.max(...generatedVariants.map((v) => v.calculatedPrice))}
              </span>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="p-4 bg-[#141414] border border-[#242424] rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Filter SKU or options..."
                  value={variantSearch}
                  onChange={(e) => setVariantSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 bg-[#0C0C0C] border border-[#2B2B2B] rounded-xs text-white text-xs placeholder:text-neutral-600 focus:outline-none focus:border-amber-400 w-52"
                />
              </div>

              <div className="flex items-center gap-1 bg-[#0C0C0C] p-1 border border-[#2B2B2B] rounded-xs">
                <button
                  onClick={() => setVariantFilter('all')}
                  className={`px-2.5 py-1 text-[10px] uppercase rounded-xs transition-colors cursor-pointer ${
                    variantFilter === 'all'
                      ? 'bg-amber-400 text-black font-bold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  All ({generatedVariants.length})
                </button>
                <button
                  onClick={() => setVariantFilter('compatible')}
                  className={`px-2.5 py-1 text-[10px] uppercase rounded-xs transition-colors cursor-pointer ${
                    variantFilter === 'compatible'
                      ? 'bg-emerald-500 text-black font-bold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Compatible ({generatedVariants.filter((v) => v.isCompatible).length})
                </button>
                <button
                  onClick={() => setVariantFilter('conflict')}
                  className={`px-2.5 py-1 text-[10px] uppercase rounded-xs transition-colors cursor-pointer ${
                    variantFilter === 'conflict'
                      ? 'bg-rose-500 text-black font-bold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Conflicts ({generatedVariants.filter((v) => !v.isCompatible).length})
                </button>
              </div>
            </div>

            <button
              onClick={exportVariantsCsv}
              className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-black text-xs font-mono uppercase font-semibold rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              Download SKU CSV
            </button>
          </div>

          {/* Table */}
          <div className="border border-[#222] rounded-xs overflow-hidden bg-[#0C0C0C]">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#141414] border-b border-[#222] text-neutral-400 uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Generated SKU</th>
                    <th className="py-3 px-4">Configuration Permutation</th>
                    <th className="py-3 px-4">Total Price</th>
                    <th className="py-3 px-4">Lead Time</th>
                    <th className="py-3 px-4">Rule Engine Status</th>
                    <th className="py-3 px-4 text-right">Inspect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1C1C1C]">
                  {filteredVariants.map((v) => (
                    <tr key={v.id} className="hover:bg-[#141414] transition-colors">
                      <td className="py-3 px-4 font-bold text-amber-400">{v.sku}</td>
                      <td className="py-3 px-4 text-neutral-300 max-w-md truncate">{v.name}</td>
                      <td className="py-3 px-4 text-white font-bold">£{v.calculatedPrice}</td>
                      <td className="py-3 px-4 text-neutral-400">{v.calculatedLeadTimeDays} Days</td>
                      <td className="py-3 px-4">
                        {v.isCompatible ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xs bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-[10px]">
                            <Check className="w-3 h-3" /> COMPATIBLE
                          </span>
                        ) : (
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xs bg-rose-950/60 border border-rose-800 text-rose-300 text-[10px]"
                            title={v.conflictReason}
                          >
                            <AlertTriangle className="w-3 h-3" /> CONFLICT
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setInspectedVariant(v)}
                          className="px-2 py-1 bg-[#1C1C1C] hover:bg-[#282828] text-neutral-300 hover:text-white rounded-xs border border-[#333] text-[10px] font-mono uppercase inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3 h-3 text-amber-400" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: LIVE STOREFRONT SIMULATOR */}
      {activeTab === 'simulator' && (
        <div className="space-y-4">
          {/* Simulator Toolbar */}
          <div className="p-3.5 bg-[#141414] border border-[#222] rounded-xs flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2">
              <Play className="w-4 h-4 text-emerald-400" />
              <span className="text-white font-medium">Live Customer Personalization Engine Simulator</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSimulateConflict}
                className="px-2.5 py-1 bg-rose-950/40 hover:bg-rose-950/70 border border-rose-800/80 text-rose-300 text-[11px] rounded-xs transition-colors cursor-pointer flex items-center gap-1"
                title="Trigger known incompatible pair"
              >
                <AlertTriangle className="w-3 h-3" />
                Trigger Rule Conflict Demo
              </button>

              <button
                onClick={handleResetSimulator}
                className="px-2.5 py-1 bg-[#1C1C1C] hover:bg-[#282828] border border-[#333] text-neutral-300 text-[11px] rounded-xs transition-colors cursor-pointer flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Reset Defaults
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Interactive Customer Configurator (2 cols) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Conflict Alert Banner if any rules fail */}
              {!simulatorEvaluation.isCompatible && (
                <div className="p-4 bg-rose-950/50 border border-rose-800/80 rounded-xs space-y-2 text-xs font-mono text-rose-300 animate-fadeIn">
                  <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-rose-200">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    Compatibility Conflict Detected by Rule Engine
                  </div>
                  {simulatorEvaluation.errors.map((err, idx) => (
                    <p key={idx} className="font-sans text-xs text-rose-200 pl-6">
                      • {err}
                    </p>
                  ))}
                </div>
              )}

              {simulatorEvaluation.warnings.length > 0 && (
                <div className="p-3 bg-amber-950/40 border border-amber-800/60 rounded-xs space-y-1 text-xs font-mono text-amber-300 animate-fadeIn">
                  <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-amber-200">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    Atelier Craftsmanship Recommendations
                  </div>
                  {simulatorEvaluation.warnings.map((warn, idx) => (
                    <p key={idx} className="font-sans text-xs text-amber-200 pl-5">
                      • {warn}
                    </p>
                  ))}
                </div>
              )}

              {/* Configurator Option Groups */}
              {template.optionGroups.map((group) => {
                const selectedIds = simulatorSelections[group.id] || [];

                return (
                  <div
                    key={group.id}
                    className="p-5 bg-[#0E0E0E] border border-[#222] rounded-xs space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xs font-mono uppercase tracking-wider text-white font-medium">
                            {group.name}
                          </h3>
                          <span className="px-1.5 py-0.2 bg-[#1C1C1C] border border-[#2E2E2E] text-[9px] font-mono text-amber-300 uppercase rounded-xs">
                            {group.type}
                          </span>
                        </div>
                        {group.description && (
                          <p className="text-[11px] text-neutral-400 font-sans mt-0.5">{group.description}</p>
                        )}
                      </div>
                      {group.required && (
                        <span className="text-[10px] font-mono text-amber-400">Required</span>
                      )}
                    </div>

                    {/* Swatches / Buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
                      {group.options.map((opt) => {
                        const isSelected = selectedIds.includes(opt.id);

                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() =>
                              handleSimulatorOptionToggle(group.id, opt.id, group.multiSelect)
                            }
                            className={`p-3 rounded-xs border text-left transition-all cursor-pointer flex flex-col justify-between ${
                              isSelected
                                ? 'border-amber-400 bg-amber-400/10 shadow-lg shadow-amber-400/5'
                                : 'border-[#222] bg-[#141414] hover:border-neutral-500'
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              {opt.swatchColor && (
                                <span
                                  className="w-5 h-5 rounded-xs border border-[#333] shrink-0 mt-0.5"
                                  style={{ backgroundColor: opt.swatchColor }}
                                />
                              )}
                              <div className="min-w-0 flex-1">
                                <span className="text-xs font-mono text-white block truncate font-medium">
                                  {opt.name}
                                </span>
                                {opt.materialDetails && (
                                  <span className="text-[10px] text-neutral-500 block truncate">
                                    {opt.materialDetails}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="mt-2.5 pt-1.5 border-t border-[#1F1F1F] flex items-center justify-between text-[11px] font-mono">
                              <span
                                className={opt.priceDelta > 0 ? 'text-amber-400' : 'text-neutral-400'}
                              >
                                {opt.priceDelta > 0 ? `+£${opt.priceDelta}` : 'Included'}
                              </span>
                              {isSelected && (
                                <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* Bespoke Monogramming Customization Studio (Appears when Monogram Option is Selected) */}
              {hasMonogramSelected && (
                <div className="p-5 bg-[#0E0E0E] border border-amber-500/40 rounded-xs space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-[#222] pb-3">
                    <div className="flex items-center gap-2">
                      <Type className="w-4 h-4 text-amber-400" />
                      <h3 className="text-xs font-mono uppercase tracking-wider text-white font-medium">
                        Bespoke Monogramming Studio
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono text-amber-400 uppercase">
                      Hand-Embroidered
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Monogram Config Inputs */}
                    <div className="space-y-3 text-xs font-mono">
                      <div>
                        <label className="text-[10px] text-neutral-400 uppercase block mb-1">
                          Monogram Initials (Up to 4 Characters)
                        </label>
                        <input
                          type="text"
                          maxLength={5}
                          value={monogramText}
                          onChange={(e) => setMonogramText(e.target.value.toUpperCase())}
                          className="w-full px-3 py-2 bg-[#141414] border border-[#2B2B2B] rounded-xs text-white text-sm font-mono tracking-widest focus:outline-none focus:border-amber-400"
                          placeholder="e.g. D.M."
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-neutral-400 uppercase block mb-1">
                          Embroidery Thread Color
                        </label>
                        <div className="flex items-center gap-2 flex-wrap">
                          {[
                            { name: 'Atelier Gold Bullion', color: '#D4AF37' },
                            { name: 'Raw Silk Ecru', color: '#E5E1D8' },
                            { name: 'Crimson Silk', color: '#9E2A2B' },
                            { name: 'Charcoal Silver', color: '#9E9E9E' },
                            { name: 'Midnight Noir', color: '#111111' },
                          ].map((thread) => (
                            <button
                              key={thread.name}
                              type="button"
                              onClick={() => setMonogramThread(thread)}
                              className={`p-1.5 rounded-xs border flex items-center gap-1.5 cursor-pointer text-[10px] ${
                                monogramThread.name === thread.name
                                  ? 'border-amber-400 bg-amber-400/10 text-white'
                                  : 'border-[#222] bg-[#141414] text-neutral-400 hover:text-white'
                              }`}
                            >
                              <span
                                className="w-3 h-3 rounded-full border border-black/40"
                                style={{ backgroundColor: thread.color }}
                              />
                              <span>{thread.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] text-neutral-400 uppercase block mb-1">
                          Typography Lettering Style
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { id: 'serif', label: 'Savile Serif' },
                            { id: 'gothic', label: 'Gothic English' },
                            { id: 'modern', label: 'Modern Sans' },
                            { id: 'script', label: 'Atelier Script' },
                          ].map((font) => (
                            <button
                              key={font.id}
                              type="button"
                              onClick={() => setMonogramFont(font.id as any)}
                              className={`p-2 rounded-xs border text-center cursor-pointer text-xs ${
                                monogramFont === font.id
                                  ? 'border-amber-400 bg-amber-400/10 text-amber-400 font-bold'
                                  : 'border-[#222] bg-[#141414] text-neutral-400 hover:text-white'
                              }`}
                            >
                              {font.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Live Monogram Stitches Preview Box */}
                    <div className="p-4 bg-[#141414] border border-[#2B2B2B] rounded-xs flex flex-col items-center justify-center text-center space-y-2 relative overflow-hidden">
                      <div className="absolute top-2 right-2 text-[9px] font-mono text-neutral-500 uppercase">
                        Collar Felt Preview
                      </div>
                      <div className="w-full h-24 bg-[#1A1A1A] rounded-xs border border-[#333] flex items-center justify-center p-3 shadow-inner">
                        <span
                          className={`text-3xl tracking-widest ${
                            monogramFont === 'serif'
                              ? 'font-serif'
                              : monogramFont === 'gothic'
                              ? 'font-serif italic font-black'
                              : monogramFont === 'modern'
                              ? 'font-mono font-bold'
                              : 'font-serif italic'
                          }`}
                          style={{
                            color: monogramThread.color,
                            textShadow: `0 0 1px ${monogramThread.color}, 0 1px 2px rgba(0,0,0,0.8)`,
                          }}
                        >
                          {monogramText || 'A.V.'}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-neutral-400">
                        {monogramThread.name} • {monogramFont.toUpperCase()} Script
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Live Price & Summary Ticket (1 col) */}
            <div className="space-y-6">
              <div className="p-6 bg-[#0E0E0E] border border-amber-500/40 rounded-xs shadow-2xl space-y-5 sticky top-20">
                <div className="border-b border-[#222] pb-3">
                  <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block">
                    BESPOKE COMMISSION INVOICE ESTIMATE
                  </span>
                  <h3 className="text-xl font-serif text-white uppercase tracking-wide mt-1">
                    {template.name}
                  </h3>
                </div>

                {/* Dynamic Price Display */}
                <div className="p-4 bg-[#141414] border border-[#222] rounded-xs space-y-1">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase block">
                    Calculated Bespoke Total
                  </span>
                  <div className="text-3xl font-serif text-amber-400 font-bold">
                    £{simulatorPricing.finalPrice.toLocaleString('en-GB')}
                  </div>
                  <span className="text-[10px] font-mono text-neutral-500 block">
                    Base: £{template.basePrice} + Customization: £{simulatorPricing.optionsTotal}
                  </span>
                </div>

                {/* Lead Time Display */}
                <div className="p-3 bg-[#141414] border border-[#222] rounded-xs flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span className="text-neutral-300">Estimated Lead Time</span>
                  </div>
                  <span className="text-white font-bold">{simulatorLeadTime} Days</span>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 text-xs font-mono">
                  <h4 className="text-[11px] uppercase tracking-wider text-neutral-400">
                    Specification Breakdown ({simulatorPricing.breakdown.length + 1} Line Items)
                  </h4>
                  <div className="p-3 bg-[#121212] rounded-xs border border-[#1F1F1F] space-y-2 max-h-60 overflow-y-auto">
                    <div className="flex justify-between text-neutral-300">
                      <span>Base Garment Drafting</span>
                      <span>£{template.basePrice}</span>
                    </div>
                    {simulatorPricing.breakdown.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-neutral-400 text-[11px]">
                        <span className="truncate max-w-[180px]">• {item.name}</span>
                        <span className="text-amber-400">+{item.priceDelta > 0 ? `£${item.priceDelta}` : '£0'}</span>
                      </div>
                    ))}
                    {hasMonogramSelected && (
                      <div className="flex justify-between text-neutral-400 text-[11px] pt-1 border-t border-[#1C1C1C]">
                        <span className="text-amber-300 truncate max-w-[180px]">• Monogram: "{monogramText}"</span>
                        <span className="text-neutral-500">{monogramThread.name}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Rule Validation Badge */}
                <div className="pt-2 border-t border-[#222]">
                  {simulatorEvaluation.isCompatible ? (
                    <div className="p-3 bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs font-mono rounded-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Garment Configuration 100% Validated</span>
                    </div>
                  ) : (
                    <div className="p-3 bg-rose-950/50 border border-rose-800 text-rose-300 text-xs font-mono rounded-xs flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>Incompatible Combination</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. MODALS */}
      <OptionGroupModal
        isOpen={groupModalState.isOpen}
        onClose={() => setGroupModalState({ isOpen: false, initialGroup: null })}
        onSave={(groupData) => {
          if (groupModalState.initialGroup) {
            updateOptionGroup(groupModalState.initialGroup.id, groupData);
            showToast(`Updated ${groupData.name}`);
          } else {
            addOptionGroup({ ...groupData, options: [] });
            showToast(`Created ${groupData.name}`);
          }
        }}
        initialGroup={groupModalState.initialGroup}
      />

      <OptionItemModal
        isOpen={optionModalState.isOpen}
        onClose={() =>
          setOptionModalState({ isOpen: false, groupId: '', groupName: '', initialOption: null })
        }
        groupId={optionModalState.groupId}
        groupName={optionModalState.groupName}
        onSave={(optionData) => {
          if (optionModalState.initialOption) {
            updateOption(optionModalState.groupId, optionModalState.initialOption.id, optionData);
            showToast(`Updated ${optionData.name}`);
          } else {
            addOption(optionModalState.groupId, optionData);
            showToast(`Added ${optionData.name}`);
          }
        }}
        initialOption={optionModalState.initialOption}
      />

      <RuleBuilderModal
        isOpen={ruleModalState.isOpen}
        onClose={() => setRuleModalState({ isOpen: false, initialRule: null })}
        optionGroups={template.optionGroups}
        onSave={(ruleData) => {
          if (ruleModalState.initialRule) {
            updateRule(ruleModalState.initialRule.id, ruleData);
            showToast(`Updated rule ${ruleData.name}`);
          } else {
            addRule(ruleData);
            showToast(`Created rule ${ruleData.name}`);
          }
        }}
        initialRule={ruleModalState.initialRule}
      />

      <VariantDetailModal
        isOpen={Boolean(inspectedVariant)}
        onClose={() => setInspectedVariant(null)}
        variant={inspectedVariant}
        optionGroups={template.optionGroups}
        basePrice={template.basePrice}
      />
    </div>
  );
};
