/**
 * @file MeasurementConfigWorkspace.tsx
 * Enterprise Made-to-Measure Measurement Configuration Workspace.
 * Garment Templates, Field Schema Form Builder, Anatomical Guides, Ratio Rules & Client Simulator.
 */

import React, { useState, useMemo } from 'react';
import {
  Ruler,
  Plus,
  Layers,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Edit3,
  AlertTriangle,
  Play,
  RotateCcw,
  BookOpen,
  ArrowRight,
  Sparkles,
  Sliders,
  Check,
  Eye,
  Info,
} from 'lucide-react';
import { useMeasurementConfigStore } from '../../../stores/measurementConfigStore';
import {
  GarmentMeasurementTemplate,
  MeasurementFieldConfig,
  MeasurementValidationRule,
  GarmentCategoryType,
} from '../../../types/measurementConfig.types';
import {
  validateGarmentMeasurements,
  convertMeasurement,
} from '../../../utils/measurementValidationEngine';
import { FieldConfigModal } from './FieldConfigModal';
import { ValidationRuleModal } from './ValidationRuleModal';

type WorkspaceTab = 'fields' | 'guides' | 'rules' | 'simulator';

export const MeasurementConfigWorkspace: React.FC = () => {
  const {
    templates,
    activeTemplate,
    setActiveTemplateId,
    addField,
    updateField,
    deleteField,
    addRule,
    updateRule,
    deleteRule,
    toggleRule,
    updateTemplateMeta,
    createCustomTemplate,
    resetToDefaults,
  } = useMeasurementConfigStore();

  const [activeTab, setActiveTab] = useState<WorkspaceTab>('fields');

  // Modals state
  const [fieldModalState, setFieldModalState] = useState<{
    isOpen: boolean;
    initialField: MeasurementFieldConfig | null;
  }>({ isOpen: false, initialField: null });

  const [ruleModalState, setRuleModalState] = useState<{
    isOpen: boolean;
    initialRule: MeasurementValidationRule | null;
  }>({ isOpen: false, initialRule: null });

  // Custom template creation
  const [isNewTemplateOpen, setIsNewTemplateOpen] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateCategory, setNewTemplateCategory] = useState<GarmentCategoryType>('custom');

  // Simulator State
  const [simUnit, setSimUnit] = useState<'cm' | 'inch'>(activeTemplate.primaryUnit || 'cm');
  const [simValues, setSimValues] = useState<Record<string, number>>(() => {
    const vals: Record<string, number> = {};
    activeTemplate.fields.forEach((f) => {
      vals[f.key] = f.defaultValue || Math.round((f.minBound + f.maxBound) / 2);
    });
    return vals;
  });

  // Toast alert
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Switch template handler (re-initializes simulator values)
  const handleSelectTemplate = (id: string) => {
    setActiveTemplateId(id);
    const tmpl = templates.find((t) => t.id === id);
    if (tmpl) {
      setSimUnit(tmpl.primaryUnit);
      const vals: Record<string, number> = {};
      tmpl.fields.forEach((f) => {
        vals[f.key] = f.defaultValue || Math.round((f.minBound + f.maxBound) / 2);
      });
      setSimValues(vals);
    }
  };

  // Convert values when simulator unit is toggled
  const handleToggleSimUnit = (newUnit: 'cm' | 'inch') => {
    if (newUnit === simUnit) return;
    const converted: Record<string, number> = {};
    Object.entries(simValues).forEach(([key, val]) => {
      converted[key] = convertMeasurement(val, simUnit, newUnit);
    });
    setSimValues(converted);
    setSimUnit(newUnit);
  };

  // Evaluate simulator validation
  const simValidation = useMemo(() => {
    // Convert simulator values to template primary unit for strict bounds testing if units differ
    const normalizedValues: Record<string, number> = {};
    Object.entries(simValues).forEach(([key, val]) => {
      normalizedValues[key] =
        simUnit === activeTemplate.primaryUnit
          ? val
          : convertMeasurement(val, simUnit, activeTemplate.primaryUnit);
    });

    return validateGarmentMeasurements(normalizedValues, activeTemplate);
  }, [simValues, simUnit, activeTemplate]);

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#141414] border border-amber-500/50 text-white px-4 py-3 rounded-xs shadow-2xl flex items-center gap-2.5 text-xs font-mono">
          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. GARMENT TEMPLATES SELECTOR CAROUSEL */}
      <div className="p-4 bg-[#0E0E0E] border border-[#2B2B2B] rounded-xs shadow-xl space-y-3">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-neutral-400 uppercase tracking-wider flex items-center gap-1.5 font-semibold">
            <Ruler className="w-4 h-4 text-amber-400" />
            Made-to-Measure Garment Templates
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsNewTemplateOpen(true)}
              className="px-2.5 py-1 bg-[#1A1A1A] hover:bg-[#252525] border border-[#333] text-amber-300 text-xs font-mono rounded-xs transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              New Template
            </button>
            <button
              onClick={() => {
                if (confirm('Reset all measurement templates to Savile Row defaults?')) {
                  resetToDefaults();
                  showToast('Reset templates to defaults');
                }
              }}
              className="p-1.5 text-neutral-400 hover:text-white cursor-pointer"
              title="Reset templates"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Template Pills Carousel */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
          {templates.map((tmpl) => (
            <button
              key={tmpl.id}
              onClick={() => handleSelectTemplate(tmpl.id)}
              className={`px-3.5 py-2 rounded-xs border text-xs font-mono uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                activeTemplate.id === tmpl.id
                  ? 'border-amber-400 bg-amber-400/10 text-white font-bold shadow-md shadow-amber-400/5'
                  : 'border-[#222] bg-[#141414] hover:border-neutral-500 text-neutral-400'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  activeTemplate.id === tmpl.id ? 'bg-amber-400 animate-pulse' : 'bg-neutral-600'
                }`}
              />
              <span>{tmpl.name}</span>
              <span className="text-[10px] text-neutral-500 font-normal">
                ({tmpl.fields.length} fields)
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. ACTIVE TEMPLATE METADATA STRIP */}
      <div className="p-6 bg-[#0E0E0E] border border-[#2B2B2B] rounded-xs shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 bg-amber-400/10 text-amber-400 text-[10px] font-mono rounded-xs border border-amber-500/30 uppercase font-semibold">
                Category: {activeTemplate.category}
              </span>
              <span className="text-[10px] font-mono text-neutral-500">
                Primary Unit: {activeTemplate.primaryUnit.toUpperCase()} • Rules: {activeTemplate.validationRules.length}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif text-white uppercase tracking-wide mt-1">
              {activeTemplate.name}
            </h2>
            <p className="text-xs text-neutral-400 font-sans">{activeTemplate.description}</p>
          </div>

          {/* Guidelines / Unit Settings */}
          <div className="flex items-center gap-3 font-mono text-xs">
            <div className="p-3 bg-[#141414] border border-[#2B2B2B] rounded-xs">
              <span className="text-[9px] text-neutral-500 uppercase block">Standard Unit</span>
              <select
                value={activeTemplate.primaryUnit}
                onChange={(e) =>
                  updateTemplateMeta(activeTemplate.id, {
                    primaryUnit: e.target.value as 'cm' | 'inch',
                  })
                }
                className="bg-transparent text-amber-400 font-mono font-bold text-xs focus:outline-none cursor-pointer"
              >
                <option value="cm" className="bg-[#141414] text-white">Centimetres (cm)</option>
                <option value="inch" className="bg-[#141414] text-white">Inches (in)</option>
              </select>
            </div>

            <div className="p-3 bg-[#141414] border border-[#2B2B2B] rounded-xs">
              <span className="text-[9px] text-neutral-500 uppercase block">Client Unit Toggle</span>
              <span className="text-emerald-400 font-bold text-xs">Allowed (Auto-Convert)</span>
            </div>
          </div>
        </div>

        {/* Workspace Navigation Sub-Tabs */}
        <div className="pt-2 border-t border-[#1C1C1C] flex items-center justify-between gap-3 overflow-x-auto no-scrollbar text-xs font-mono">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('fields')}
              className={`px-3 py-2 border-b-2 font-medium transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === 'fields'
                  ? 'border-amber-400 text-amber-400 bg-amber-400/5'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              Field Schema ({activeTemplate.fields.length})
            </button>

            <button
              onClick={() => setActiveTab('guides')}
              className={`px-3 py-2 border-b-2 font-medium transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === 'guides'
                  ? 'border-amber-400 text-amber-400 bg-amber-400/5'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Anatomical Guides & Diagrams
            </button>

            <button
              onClick={() => setActiveTab('rules')}
              className={`px-3 py-2 border-b-2 font-medium transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === 'rules'
                  ? 'border-amber-400 text-amber-400 bg-amber-400/5'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Anatomical Validation Rules ({activeTemplate.validationRules.length})
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
              Client Form Simulator
            </button>
          </div>

          {activeTab === 'fields' && (
            <button
              onClick={() => setFieldModalState({ isOpen: true, initialField: null })}
              className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-black text-xs font-mono uppercase tracking-wider font-semibold rounded-xs transition-colors flex items-center gap-1 cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Measurement Field
            </button>
          )}

          {activeTab === 'rules' && (
            <button
              onClick={() => setRuleModalState({ isOpen: true, initialRule: null })}
              className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-black text-xs font-mono uppercase tracking-wider font-semibold rounded-xs transition-colors flex items-center gap-1 cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Validation Rule
            </button>
          )}
        </div>
      </div>

      {/* 3. SUB-TAB PANELS */}

      {/* TAB 1: FORM BUILDER & FIELD SCHEMA */}
      {activeTab === 'fields' && (
        <div className="space-y-4">
          <div className="p-4 bg-[#141414] border border-[#222] rounded-xs flex items-center justify-between text-xs font-mono text-neutral-300">
            <span className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              Configured Body Landmarks ({activeTemplate.fields.length} Active Fields)
            </span>
            <span className="text-neutral-500">
              Drag-ordered sequence displayed on bespoke customer checkout
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeTemplate.fields.map((field, idx) => (
              <div
                key={field.id}
                className="p-4 bg-[#0E0E0E] border border-[#222] hover:border-neutral-500 rounded-xs space-y-3 transition-colors group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-xs bg-[#1A1A1A] border border-[#333] flex items-center justify-center text-amber-400 text-[11px] font-mono font-bold mt-0.5">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-mono text-white font-medium">{field.label}</h4>
                        {field.required ? (
                          <span className="px-1.5 py-0.2 bg-amber-400/10 text-amber-400 text-[9px] font-mono rounded-xs border border-amber-500/30">
                            Required
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.2 bg-[#222] text-neutral-400 text-[9px] font-mono rounded-xs">
                            Optional
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-neutral-500 block">
                        Key: {field.key} • Zone: {field.anatomicalZone.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setFieldModalState({ isOpen: true, initialField: field })}
                      className="p-1 text-neutral-400 hover:text-white cursor-pointer"
                      title="Edit field"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Remove field "${field.label}"?`)) {
                          deleteField(activeTemplate.id, field.id);
                          showToast(`Removed ${field.label}`);
                        }
                      }}
                      className="p-1 text-neutral-400 hover:text-red-400 cursor-pointer"
                      title="Delete field"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Tolerance Range Bar */}
                <div className="p-3 bg-[#141414] border border-[#1F1F1F] rounded-xs space-y-1.5 text-xs font-mono">
                  <div className="flex items-center justify-between text-[10px] text-neutral-400">
                    <span>Min: {field.minBound} {field.unit}</span>
                    <span className="text-amber-400 font-bold">Default: {field.defaultValue || '--'} {field.unit}</span>
                    <span>Max: {field.maxBound} {field.unit}</span>
                  </div>
                  <div className="h-1.5 bg-[#222] rounded-full overflow-hidden relative">
                    <div
                      className="h-full bg-gradient-to-r from-neutral-600 via-amber-400 to-neutral-600 rounded-full"
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>

                {/* Guide Text snippet */}
                <p className="text-[11px] text-neutral-400 font-sans line-clamp-2 leading-relaxed">
                  {field.guideText}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: ANATOMICAL GUIDES & DIAGRAMS */}
      {activeTab === 'guides' && (
        <div className="space-y-6">
          <div className="p-4 bg-[#141414] border border-[#242424] rounded-xs flex items-center justify-between text-xs font-mono text-neutral-300">
            <span className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-400" />
              Anatomical Tailor Guidelines & Diagram Gallery
            </span>
            <span className="text-neutral-500">
              Presented to clients during made-to-measure submission
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Template Master Diagram */}
            <div className="p-5 bg-[#0E0E0E] border border-[#222] rounded-xs space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Master Silhouette Reference
              </h3>
              <div className="h-64 rounded-xs border border-[#2B2B2B] bg-black overflow-hidden relative">
                <img
                  src={activeTemplate.instructionDiagramUrl}
                  alt={activeTemplate.name}
                  className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-xs font-mono text-white">
                  <span className="text-[10px] text-amber-400 uppercase block">Atelier Pattern Reference</span>
                  <span className="font-semibold">{activeTemplate.name}</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                  Atelier General Fitting Instructions
                </label>
                <textarea
                  rows={3}
                  value={activeTemplate.fittingGuidelines}
                  onChange={(e) =>
                    updateTemplateMeta(activeTemplate.id, { fittingGuidelines: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-[#141414] border border-[#2B2B2B] text-xs font-sans rounded-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Individual Field Step Instructions */}
            <div className="p-5 bg-[#0E0E0E] border border-[#222] rounded-xs space-y-4 max-h-[500px] overflow-y-auto">
              <h3 className="text-xs font-mono uppercase tracking-wider text-white font-semibold">
                Landmark Measurement Protocols
              </h3>

              <div className="space-y-3">
                {activeTemplate.fields.map((f, i) => (
                  <div key={f.id} className="p-3 bg-[#141414] border border-[#1F1F1F] rounded-xs space-y-1">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-white font-medium">
                        {i + 1}. {f.label}
                      </span>
                      <span className="text-[10px] text-amber-400 uppercase">
                        {f.anatomicalZone}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400 font-sans leading-relaxed">
                      {f.guideText}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ANATOMICAL VALIDATION RULES */}
      {activeTab === 'rules' && (
        <div className="space-y-4">
          <div className="p-4 bg-[#141414] border border-[#242424] rounded-xs flex items-center justify-between text-xs font-mono text-neutral-300">
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              Physiological Proportions & Differential Thresholds
            </span>
            <button
              onClick={() => setRuleModalState({ isOpen: true, initialRule: null })}
              className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-black text-xs font-mono uppercase font-semibold rounded-xs transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              New Rule
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeTemplate.validationRules.map((rule) => (
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
                      onClick={() => toggleRule(activeTemplate.id, rule.id)}
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
                          deleteRule(activeTemplate.id, rule.id);
                          showToast('Rule deleted');
                        }
                      }}
                      className="p-1 text-neutral-400 hover:text-red-400 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="mt-3 p-3 bg-[#141414] border border-[#1F1F1F] rounded-xs text-xs font-mono text-neutral-300">
                  <span className="text-[10px] text-neutral-500 uppercase block mb-1">Formula</span>
                  <span>{rule.primaryFieldKey}</span> {rule.operator} <span>{rule.thresholdValue}</span>{' '}
                  {rule.secondaryFieldKey && (
                    <span className="text-neutral-400">relative to {rule.secondaryFieldKey}</span>
                  )}
                </div>

                <p className="mt-3 text-xs text-neutral-400 font-sans leading-relaxed">
                  {rule.errorMessage}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: CLIENT FORM SIMULATOR */}
      {activeTab === 'simulator' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Interactive Form (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Banner */}
            <div
              className={`p-4 rounded-xs border flex items-center justify-between text-xs font-mono ${
                simValidation.overallStatus === 'PASS'
                  ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                  : simValidation.overallStatus === 'WARN'
                  ? 'bg-amber-950/40 border-amber-800 text-amber-300'
                  : 'bg-rose-950/50 border-rose-800 text-rose-300'
              }`}
            >
              <div className="flex items-center gap-2">
                {simValidation.overallStatus === 'PASS' && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                )}
                {simValidation.overallStatus === 'WARN' && (
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                )}
                {simValidation.overallStatus === 'FAIL' && (
                  <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                )}
                <div>
                  <span className="font-bold uppercase tracking-wider block">
                    Validation Status: {simValidation.overallStatus}
                  </span>
                  <span className="text-[11px] font-sans">
                    {simValidation.overallStatus === 'PASS'
                      ? 'All physiological ratios and tolerances are verified.'
                      : 'Review warnings or errors below.'}
                  </span>
                </div>
              </div>

              {/* Unit Toggle */}
              <div className="flex items-center bg-black/60 rounded-xs border border-white/20 p-0.5">
                <button
                  type="button"
                  onClick={() => handleToggleSimUnit('cm')}
                  className={`px-3 py-1 rounded-xs text-xs font-mono font-bold cursor-pointer transition-colors ${
                    simUnit === 'cm' ? 'bg-amber-400 text-black' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  CM
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleSimUnit('inch')}
                  className={`px-3 py-1 rounded-xs text-xs font-mono font-bold cursor-pointer transition-colors ${
                    simUnit === 'inch' ? 'bg-amber-400 text-black' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  INCH
                </button>
              </div>
            </div>

            {/* Fields Form */}
            <div className="p-6 bg-[#0E0E0E] border border-[#222] rounded-xs space-y-5">
              <h3 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">
                Client Made-to-Measure Submission Test
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activeTemplate.fields.map((field) => {
                  const errorMsg = simValidation.errors[field.key];
                  const warnMsg = simValidation.warnings[field.key];
                  const currentVal = simValues[field.key];

                  return (
                    <div
                      key={field.id}
                      className={`p-3.5 rounded-xs border transition-colors ${
                        errorMsg
                          ? 'bg-rose-950/20 border-rose-800'
                          : warnMsg
                          ? 'bg-amber-950/20 border-amber-800'
                          : 'bg-[#141414] border-[#222]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-mono text-white truncate font-medium">
                          {field.label} {field.required && <span className="text-amber-400">*</span>}
                        </label>
                        <span className="text-[10px] font-mono text-neutral-500 uppercase">
                          {simUnit}
                        </span>
                      </div>

                      <input
                        type="number"
                        step={field.step}
                        value={currentVal !== undefined ? currentVal : ''}
                        onChange={(e) =>
                          setSimValues((prev) => ({
                            ...prev,
                            [field.key]: parseFloat(e.target.value) || 0,
                          }))
                        }
                        className="w-full px-3 py-2 bg-[#0C0C0C] border border-[#2B2B2B] text-xs font-mono rounded-xs text-white focus:border-amber-400 focus:outline-none"
                      />

                      <div className="mt-1 flex items-center justify-between text-[10px] font-mono text-neutral-500">
                        <span>Range: {field.minBound} - {field.maxBound} {field.unit}</span>
                      </div>

                      {errorMsg && (
                        <p className="text-[10px] font-mono text-rose-400 mt-1">{errorMsg}</p>
                      )}
                      {warnMsg && !errorMsg && (
                        <p className="text-[10px] font-mono text-amber-400 mt-1">{warnMsg}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Tailor Inspection Sheet (1 col) */}
          <div className="space-y-6">
            <div className="p-6 bg-[#0E0E0E] border border-amber-500/40 rounded-xs shadow-2xl space-y-5 sticky top-20">
              <div className="border-b border-[#222] pb-3">
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block">
                  BESPOKE PATTERN CUTTING AUDIT
                </span>
                <h3 className="text-xl font-serif text-white uppercase tracking-wide mt-1">
                  {activeTemplate.name}
                </h3>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <h4 className="text-[11px] uppercase tracking-wider text-neutral-400">
                  Entered Dimensions ({simUnit})
                </h4>
                <div className="p-3 bg-[#121212] rounded-xs border border-[#1F1F1F] space-y-1.5 max-h-60 overflow-y-auto">
                  {activeTemplate.fields.map((f) => (
                    <div key={f.key} className="flex justify-between text-neutral-300 text-[11px]">
                      <span className="truncate max-w-[170px] text-neutral-400">{f.label}</span>
                      <span className="text-white font-bold">
                        {simValues[f.key] !== undefined ? `${simValues[f.key]} ${simUnit}` : '--'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Validation Summary */}
              <div className="pt-2 border-t border-[#222] space-y-2">
                {simValidation.isValid ? (
                  <button
                    type="button"
                    onClick={() => showToast('Test bespoke measurement profile submitted successfully')}
                    className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-black text-xs font-mono uppercase tracking-wider font-bold rounded-xs shadow-lg shadow-amber-400/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Approve Measurement Profile
                  </button>
                ) : (
                  <div className="p-3 bg-rose-950/40 border border-rose-800 text-rose-300 text-xs font-mono rounded-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>Submission Blocked: Resolve errors</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. MODALS */}
      <FieldConfigModal
        isOpen={fieldModalState.isOpen}
        onClose={() => setFieldModalState({ isOpen: false, initialField: null })}
        primaryUnit={activeTemplate.primaryUnit}
        onSave={(fieldData) => {
          if (fieldModalState.initialField) {
            updateField(activeTemplate.id, fieldModalState.initialField.id, fieldData);
            showToast(`Updated field ${fieldData.label}`);
          } else {
            addField(activeTemplate.id, fieldData);
            showToast(`Added field ${fieldData.label}`);
          }
        }}
        initialField={fieldModalState.initialField}
      />

      <ValidationRuleModal
        isOpen={ruleModalState.isOpen}
        onClose={() => setRuleModalState({ isOpen: false, initialRule: null })}
        fields={activeTemplate.fields}
        onSave={(ruleData) => {
          if (ruleModalState.initialRule) {
            updateRule(activeTemplate.id, ruleModalState.initialRule.id, ruleData);
            showToast(`Updated rule ${ruleData.name}`);
          } else {
            addRule(activeTemplate.id, ruleData);
            showToast(`Created rule ${ruleData.name}`);
          }
        }}
        initialRule={ruleModalState.initialRule}
      />

      {/* New Custom Template Modal */}
      {isNewTemplateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#0F0F0F] border border-[#2B2B2B] rounded-xs shadow-2xl p-6 space-y-4">
            <h3 className="text-sm font-mono uppercase tracking-wider text-white font-medium">
              Create New Garment Template
            </h3>
            <input
              type="text"
              placeholder="e.g. Bespoke Corset & Bodice Template"
              value={newTemplateName}
              onChange={(e) => setNewTemplateName(e.target.value)}
              className="w-full px-3 py-2 bg-[#141414] border border-[#2B2B2B] text-xs font-mono rounded-xs text-white focus:border-amber-400 focus:outline-none"
            />
            <select
              value={newTemplateCategory}
              onChange={(e) => setNewTemplateCategory(e.target.value as GarmentCategoryType)}
              className="w-full px-3 py-2 bg-[#141414] border border-[#2B2B2B] text-xs font-mono rounded-xs text-white focus:border-amber-400 focus:outline-none"
            >
              <option value="jackets">Jackets & Coats</option>
              <option value="trousers">Trousers & Jeans</option>
              <option value="shirts">Shirts & Blouses</option>
              <option value="gowns">Gowns & Dresses</option>
              <option value="jumpsuits">Jumpsuits & Bodysuits</option>
              <option value="custom">Custom Atelier Garment</option>
            </select>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsNewTemplateOpen(false)}
                className="px-3 py-1.5 text-xs font-mono text-neutral-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (newTemplateName.trim()) {
                    createCustomTemplate(newTemplateName.trim(), newTemplateCategory);
                    setIsNewTemplateOpen(false);
                    setNewTemplateName('');
                    showToast('Template created');
                  }
                }}
                className="px-4 py-1.5 bg-amber-400 hover:bg-amber-300 text-black text-xs font-mono font-semibold rounded-xs cursor-pointer"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
