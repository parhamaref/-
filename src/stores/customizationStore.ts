/**
 * @file customizationStore.ts
 * Reactive state store for the Product Customization Builder.
 * Manages Option Groups, Swatches, Pricing Deltas, Incompatibility Rules, and Variants.
 */

import { useState, useEffect } from 'react';
import {
  CustomizationTemplate,
  CustomizationOptionGroup,
  CustomizationOption,
  CompatibilityRule,
} from '../types/customization.types';

export const INITIAL_CUSTOMIZATION_TEMPLATE: CustomizationTemplate = {
  id: 'tmpl_jacket_01',
  designerId: 'des_001_dm',
  name: 'Bespoke Deconstructed Jacket Configuration',
  category: 'jackets',
  basePrice: 650, // £650
  baseLeadTimeDays: 14,
  optionGroups: [
    {
      id: 'grp_fabric',
      name: 'Fabric Selection',
      type: 'fabric',
      description: 'Primary structural material for jacket body and lapels.',
      required: true,
      multiSelect: false,
      sortOrder: 1,
      options: [
        {
          id: 'opt_fab_wool',
          groupId: 'grp_fabric',
          name: '14oz Savile Worsted Wool',
          skuCode: 'W14',
          description: 'Dense architectural drape woven in West Yorkshire mills.',
          priceDelta: 0,
          leadTimeDaysDelta: 0,
          swatchColor: '#1A1A1A',
          swatchImageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=300&q=80',
          materialDetails: '100% Super 130s Worsted Wool, 380 GSM',
          isDefault: true,
          inStock: true,
        },
        {
          id: 'opt_fab_denim',
          groupId: 'grp_fabric',
          name: '15oz Japanese Raw Selvedge',
          skuCode: 'DNM',
          description: 'Kuroki mills indigo warp with unbleached natural weft.',
          priceDelta: 45,
          leadTimeDaysDelta: 2,
          swatchColor: '#1B263B',
          swatchImageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=300&q=80',
          materialDetails: '100% Cotton Shuttle-Loomed Denim',
          inStock: true,
        },
        {
          id: 'opt_fab_linen',
          groupId: 'grp_fabric',
          name: 'Heavy Belgian Slub Linen',
          skuCode: 'LIN',
          description: 'Cold-dyed breathable flax with dramatic tactile slub texture.',
          priceDelta: 30,
          leadTimeDaysDelta: 0,
          swatchColor: '#4A4E51',
          swatchImageUrl: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=300&q=80',
          materialDetails: '100% Organic Belgian Flax, 320 GSM',
          inStock: true,
        },
        {
          id: 'opt_fab_tweed',
          groupId: 'grp_fabric',
          name: 'Scottish Cheviot Tweed',
          skuCode: 'TWD',
          description: 'Weatherproof heritage wool with heathered obsidian flecks.',
          priceDelta: 85,
          leadTimeDaysDelta: 4,
          swatchColor: '#2B2B2A',
          swatchImageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=300&q=80',
          materialDetails: '100% Pure Virgin Cheviot Wool',
          inStock: true,
        },
      ],
    },
    {
      id: 'grp_color',
      name: 'Color Tone & Dye Treatment',
      type: 'color',
      description: 'Colorway treatment and mineral bath finish.',
      required: true,
      multiSelect: false,
      sortOrder: 2,
      options: [
        {
          id: 'opt_col_obsidian',
          groupId: 'grp_color',
          name: 'Obsidian Noir (Deep Black)',
          skuCode: 'NOIR',
          priceDelta: 0,
          leadTimeDaysDelta: 0,
          swatchColor: '#0A0A0A',
          isDefault: true,
          inStock: true,
        },
        {
          id: 'opt_col_charcoal',
          groupId: 'grp_color',
          name: 'Graphite Mineral Ash',
          skuCode: 'ASH',
          priceDelta: 15,
          leadTimeDaysDelta: 0,
          swatchColor: '#282828',
          inStock: true,
        },
        {
          id: 'opt_col_navy',
          groupId: 'grp_color',
          name: 'Midnight Prussian Indigo',
          skuCode: 'NVY',
          priceDelta: 15,
          leadTimeDaysDelta: 0,
          swatchColor: '#141E30',
          inStock: true,
        },
        {
          id: 'opt_col_ecru',
          groupId: 'grp_color',
          name: 'Unbleached Raw Ecru',
          skuCode: 'ECR',
          priceDelta: 20,
          leadTimeDaysDelta: 0,
          swatchColor: '#D8D4CE',
          inStock: true,
        },
      ],
    },
    {
      id: 'grp_trim',
      name: 'Trim & Hardware Details',
      type: 'trim',
      description: 'Button materials, pick-stitching, and internal facing accents.',
      required: true,
      multiSelect: false,
      sortOrder: 3,
      options: [
        {
          id: 'opt_trm_horn',
          groupId: 'grp_trim',
          name: 'Matte Buffalo Horn Buttons',
          skuCode: 'HRN',
          description: 'Carved genuine water buffalo horn with burned edge.',
          priceDelta: 0,
          leadTimeDaysDelta: 0,
          swatchColor: '#1F1A17',
          isDefault: true,
          inStock: true,
        },
        {
          id: 'opt_trm_mop',
          groupId: 'grp_trim',
          name: 'Smoked Mother-of-Pearl',
          skuCode: 'MOP',
          description: 'Iridescent Tahitian shell buttons with cross-stitching.',
          priceDelta: 35,
          leadTimeDaysDelta: 0,
          swatchColor: '#3A3D40',
          inStock: true,
        },
        {
          id: 'opt_trm_brass',
          groupId: 'grp_trim',
          name: 'Oxidized Blackened Brass Studs',
          skuCode: 'BRS',
          description: 'Heavy industrial architectural fasteners forged in Sheffield.',
          priceDelta: 60,
          leadTimeDaysDelta: 3,
          swatchColor: '#4A3B2C',
          inStock: true,
        },
      ],
    },
    {
      id: 'grp_accessory',
      name: 'Modular Garment Accessories',
      type: 'accessory',
      description: 'Detachable outerwear attachments engineered for climate versatility.',
      required: false,
      multiSelect: true,
      maxSelections: 2,
      sortOrder: 4,
      options: [
        {
          id: 'opt_acc_throat',
          groupId: 'grp_accessory',
          name: 'Detachable Storm Throat-Latch',
          skuCode: 'LCH',
          description: 'Under-collar storm tab to secure lapels in gale winds.',
          priceDelta: 40,
          leadTimeDaysDelta: 1,
          swatchColor: '#1A1A1A',
          inStock: true,
        },
        {
          id: 'opt_acc_belt',
          groupId: 'grp_accessory',
          name: 'Architectural Deconstructed Waist Belt',
          skuCode: 'BLT',
          description: '35mm self-fabric waist cincher with blackened steel slider.',
          priceDelta: 65,
          leadTimeDaysDelta: 2,
          swatchColor: '#151515',
          inStock: true,
        },
      ],
    },
    {
      id: 'grp_embroidery',
      name: 'Artisan Embroidery Accents',
      type: 'embroidery',
      description: 'Hand-guided embroidery badges and bar-tack signatures.',
      required: false,
      multiSelect: false,
      sortOrder: 5,
      options: [
        {
          id: 'opt_emb_none',
          groupId: 'grp_embroidery',
          name: 'Clean Minimalist (No Embroidery)',
          skuCode: 'NONE',
          priceDelta: 0,
          leadTimeDaysDelta: 0,
          isDefault: true,
          inStock: true,
        },
        {
          id: 'opt_emb_crest',
          groupId: 'grp_embroidery',
          name: 'Gold Bullion Atelier Crest',
          skuCode: 'CREST',
          description: 'Hand-stitched metallic gold wire insignia at left chest.',
          priceDelta: 120,
          leadTimeDaysDelta: 5,
          swatchColor: '#D4AF37',
          inStock: true,
        },
        {
          id: 'opt_emb_redtack',
          groupId: 'grp_embroidery',
          name: 'Artisan Crimson Bar-Tack Stitching',
          skuCode: 'REDTK',
          description: 'Maison signature crimson silk reinforcement stitches on pocket corners.',
          priceDelta: 25,
          leadTimeDaysDelta: 1,
          swatchColor: '#9E2A2B',
          inStock: true,
        },
      ],
    },
    {
      id: 'grp_monogram',
      name: 'Bespoke Monogramming',
      type: 'monogram',
      description: 'Personalized initials embroidered on under-collar or breast pocket.',
      required: false,
      multiSelect: false,
      sortOrder: 6,
      options: [
        {
          id: 'opt_mng_none',
          groupId: 'grp_monogram',
          name: 'Standard (No Monogram)',
          skuCode: 'NOMNG',
          priceDelta: 0,
          leadTimeDaysDelta: 0,
          isDefault: true,
          inStock: true,
        },
        {
          id: 'opt_mng_collar',
          groupId: 'grp_monogram',
          name: 'Under-Collar Melton Monogram (Up to 3 Initials)',
          skuCode: 'UCLM',
          description: 'Discreet tone-on-tone embroidery on genuine wool collar felt.',
          priceDelta: 30,
          leadTimeDaysDelta: 2,
          swatchColor: '#707070',
          inStock: true,
        },
        {
          id: 'opt_mng_lining',
          groupId: 'grp_monogram',
          name: 'Interior Silk Lining Monogram',
          skuCode: 'INLM',
          description: 'Embroidered into the silk jacquard chest passport pocket.',
          priceDelta: 35,
          leadTimeDaysDelta: 2,
          swatchColor: '#333333',
          inStock: true,
        },
      ],
    },
  ],
  rules: [
    {
      id: 'rule_001_brass_linen',
      name: 'Hardware Weight Integrity',
      ruleType: 'incompatible',
      sourceOptionId: 'opt_trm_brass', // Brass studs
      sourceOptionName: 'Oxidized Blackened Brass Studs',
      targetOptionIds: ['opt_fab_linen'], // Linen
      targetOptionNames: ['Heavy Belgian Slub Linen'],
      explanation: 'Blackened Brass Studs require structural worsted wool or heavyweight denim to prevent fabric distortion. Slub Linen cannot hold heavy industrial hardware.',
      severity: 'error',
      active: true,
    },
    {
      id: 'rule_002_gold_crest_wool',
      name: 'Gold Bullion Crest Backing',
      ruleType: 'incompatible',
      sourceOptionId: 'opt_emb_crest', // Gold Bullion Crest
      sourceOptionName: 'Gold Bullion Atelier Crest',
      targetOptionIds: ['opt_fab_denim'], // Denim
      targetOptionNames: ['15oz Japanese Raw Selvedge'],
      explanation: 'Gold Bullion hand-wire embroidery requires stable worsted wool or tweed backing. Unwashed raw denim indigo oils will tarnish metallic threads.',
      severity: 'error',
      active: true,
    },
    {
      id: 'rule_003_raw_ecru_horn',
      name: 'Ecru Contrast Pairing',
      ruleType: 'recommended',
      sourceOptionId: 'opt_col_ecru', // Raw Ecru
      sourceOptionName: 'Unbleached Raw Ecru',
      targetOptionIds: ['opt_trm_horn'], // Buffalo Horn
      targetOptionNames: ['Matte Buffalo Horn Buttons'],
      explanation: 'Matte Buffalo Horn provides optimal warm contrast against natural unbleached raw ecru fabric.',
      severity: 'warning',
      active: true,
    },
  ],
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2026-10-12T10:00:00Z',
};

const STORAGE_KEY = 'daniels_customization_template_v1';

class CustomizationStore {
  private template: CustomizationTemplate;
  private listeners = new Set<() => void>();

  constructor() {
    this.template = this.loadInitial();
  }

  private loadInitial(): CustomizationTemplate {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Could not load stored customization template', e);
    }
    return INITIAL_CUSTOMIZATION_TEMPLATE;
  }

  private persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.template));
    } catch (e) {
      console.warn('Could not persist customization template', e);
    }
    this.listeners.forEach((fn) => fn());
  }

  public getTemplate(): CustomizationTemplate {
    return this.template;
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public setBasePrice(price: number) {
    this.template = { ...this.template, basePrice: price, updatedAt: new Date().toISOString() };
    this.persist();
  }

  public setBaseLeadTime(days: number) {
    this.template = { ...this.template, baseLeadTimeDays: days, updatedAt: new Date().toISOString() };
    this.persist();
  }

  // Group Operations
  public addOptionGroup(group: Omit<CustomizationOptionGroup, 'id' | 'sortOrder'>) {
    const newGroup: CustomizationOptionGroup = {
      ...group,
      id: `grp_${Date.now()}`,
      sortOrder: this.template.optionGroups.length + 1,
    };
    this.template = {
      ...this.template,
      optionGroups: [...this.template.optionGroups, newGroup],
      updatedAt: new Date().toISOString(),
    };
    this.persist();
  }

  public updateOptionGroup(groupId: string, updates: Partial<CustomizationOptionGroup>) {
    this.template = {
      ...this.template,
      optionGroups: this.template.optionGroups.map((g) =>
        g.id === groupId ? { ...g, ...updates } : g
      ),
      updatedAt: new Date().toISOString(),
    };
    this.persist();
  }

  public deleteOptionGroup(groupId: string) {
    this.template = {
      ...this.template,
      optionGroups: this.template.optionGroups.filter((g) => g.id !== groupId),
      // Clean up orphaned rules
      rules: this.template.rules.filter(
        (r) =>
          !this.template.optionGroups
            .find((g) => g.id === groupId)
            ?.options.some((o) => o.id === r.sourceOptionId || r.targetOptionIds.includes(o.id))
      ),
      updatedAt: new Date().toISOString(),
    };
    this.persist();
  }

  // Option Operations
  public addOption(groupId: string, option: Omit<CustomizationOption, 'id' | 'groupId'>) {
    const newOpt: CustomizationOption = {
      ...option,
      id: `opt_${Date.now()}`,
      groupId,
    };
    this.template = {
      ...this.template,
      optionGroups: this.template.optionGroups.map((g) =>
        g.id === groupId ? { ...g, options: [...g.options, newOpt] } : g
      ),
      updatedAt: new Date().toISOString(),
    };
    this.persist();
  }

  public updateOption(groupId: string, optionId: string, updates: Partial<CustomizationOption>) {
    this.template = {
      ...this.template,
      optionGroups: this.template.optionGroups.map((g) => {
        if (g.id !== groupId) return g;
        return {
          ...g,
          options: g.options.map((o) => (o.id === optionId ? { ...o, ...updates } : o)),
        };
      }),
      updatedAt: new Date().toISOString(),
    };
    this.persist();
  }

  public deleteOption(groupId: string, optionId: string) {
    this.template = {
      ...this.template,
      optionGroups: this.template.optionGroups.map((g) => {
        if (g.id !== groupId) return g;
        return {
          ...g,
          options: g.options.filter((o) => o.id !== optionId),
        };
      }),
      // Remove rules involving this option
      rules: this.template.rules.filter(
        (r) => r.sourceOptionId !== optionId && !r.targetOptionIds.includes(optionId)
      ),
      updatedAt: new Date().toISOString(),
    };
    this.persist();
  }

  public duplicateOptionGroup(groupId: string) {
    const original = this.template.optionGroups.find((g) => g.id === groupId);
    if (!original) return;
    const newGroupId = `grp_${Date.now()}`;
    const clonedOptions = original.options.map((opt, i) => ({
      ...opt,
      id: `opt_${Date.now()}_${i}`,
      groupId: newGroupId,
    }));
    const newGroup: CustomizationOptionGroup = {
      ...original,
      id: newGroupId,
      name: `${original.name} (Copy)`,
      sortOrder: this.template.optionGroups.length + 1,
      options: clonedOptions,
    };
    this.template = {
      ...this.template,
      optionGroups: [...this.template.optionGroups, newGroup],
      updatedAt: new Date().toISOString(),
    };
    this.persist();
  }

  public duplicateOption(groupId: string, optionId: string) {
    const group = this.template.optionGroups.find((g) => g.id === groupId);
    if (!group) return;
    const originalOpt = group.options.find((o) => o.id === optionId);
    if (!originalOpt) return;
    const newOpt: CustomizationOption = {
      ...originalOpt,
      id: `opt_${Date.now()}`,
      name: `${originalOpt.name} (Copy)`,
      skuCode: `${originalOpt.skuCode || 'OPT'}-CPY`,
      isDefault: false,
    };
    this.template = {
      ...this.template,
      optionGroups: this.template.optionGroups.map((g) =>
        g.id === groupId ? { ...g, options: [...g.options, newOpt] } : g
      ),
      updatedAt: new Date().toISOString(),
    };
    this.persist();
  }

  public toggleOptionStock(groupId: string, optionId: string) {
    this.template = {
      ...this.template,
      optionGroups: this.template.optionGroups.map((g) => {
        if (g.id !== groupId) return g;
        return {
          ...g,
          options: g.options.map((o) =>
            o.id === optionId ? { ...o, inStock: !o.inStock } : o
          ),
        };
      }),
      updatedAt: new Date().toISOString(),
    };
    this.persist();
  }

  // Rules Operations
  public addRule(rule: Omit<CompatibilityRule, 'id'>) {
    const newRule: CompatibilityRule = {
      ...rule,
      id: `rule_${Date.now()}`,
    };
    this.template = {
      ...this.template,
      rules: [...this.template.rules, newRule],
      updatedAt: new Date().toISOString(),
    };
    this.persist();
  }

  public updateRule(ruleId: string, updates: Partial<CompatibilityRule>) {
    this.template = {
      ...this.template,
      rules: this.template.rules.map((r) => (r.id === ruleId ? { ...r, ...updates } : r)),
      updatedAt: new Date().toISOString(),
    };
    this.persist();
  }

  public deleteRule(ruleId: string) {
    this.template = {
      ...this.template,
      rules: this.template.rules.filter((r) => r.id !== ruleId),
      updatedAt: new Date().toISOString(),
    };
    this.persist();
  }

  public toggleRule(ruleId: string) {
    this.template = {
      ...this.template,
      rules: this.template.rules.map((r) => (r.id === ruleId ? { ...r, active: !r.active } : r)),
      updatedAt: new Date().toISOString(),
    };
    this.persist();
  }

  public resetToDefaults() {
    this.template = INITIAL_CUSTOMIZATION_TEMPLATE;
    this.persist();
  }
}

export const customizationStore = new CustomizationStore();

export function useCustomizationStore() {
  const [template, setTemplate] = useState<CustomizationTemplate>(customizationStore.getTemplate());

  useEffect(() => {
    const unsubscribe = customizationStore.subscribe(() => {
      setTemplate(customizationStore.getTemplate());
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return {
    template,
    setBasePrice: (p: number) => customizationStore.setBasePrice(p),
    setBaseLeadTime: (d: number) => customizationStore.setBaseLeadTime(d),
    addOptionGroup: (g: Omit<CustomizationOptionGroup, 'id' | 'sortOrder'>) =>
      customizationStore.addOptionGroup(g),
    updateOptionGroup: (id: string, u: Partial<CustomizationOptionGroup>) =>
      customizationStore.updateOptionGroup(id, u),
    deleteOptionGroup: (id: string) => customizationStore.deleteOptionGroup(id),
    duplicateOptionGroup: (id: string) => customizationStore.duplicateOptionGroup(id),
    addOption: (gId: string, opt: Omit<CustomizationOption, 'id' | 'groupId'>) =>
      customizationStore.addOption(gId, opt),
    updateOption: (gId: string, optId: string, u: Partial<CustomizationOption>) =>
      customizationStore.updateOption(gId, optId, u),
    deleteOption: (gId: string, optId: string) => customizationStore.deleteOption(gId, optId),
    duplicateOption: (gId: string, optId: string) => customizationStore.duplicateOption(gId, optId),
    toggleOptionStock: (gId: string, optId: string) => customizationStore.toggleOptionStock(gId, optId),
    addRule: (r: Omit<CompatibilityRule, 'id'>) => customizationStore.addRule(r),
    updateRule: (id: string, u: Partial<CompatibilityRule>) => customizationStore.updateRule(id, u),
    deleteRule: (id: string) => customizationStore.deleteRule(id),
    toggleRule: (id: string) => customizationStore.toggleRule(id),
    resetToDefaults: () => customizationStore.resetToDefaults(),
  };
}
