/**
 * @file measurementConfigStore.ts
 * Reactive state store for Made-to-Measure Garment Templates, Field Schemas,
 * Anatomical Guides, and Validation Rules.
 */

import { useState, useEffect } from 'react';
import {
  GarmentMeasurementTemplate,
  MeasurementFieldConfig,
  MeasurementValidationRule,
  GarmentCategoryType,
} from '../types/measurementConfig.types';

export const INITIAL_GARMENT_TEMPLATES: GarmentMeasurementTemplate[] = [
  {
    id: 'tmpl_meas_jackets',
    designerId: 'des_001_dm',
    category: 'jackets',
    name: 'Savile Row Bespoke Jacket Template',
    description: 'Anatomical tailor specification for deconstructed blazers, overcoats, and smoking jackets.',
    primaryUnit: 'cm',
    allowClientUnitToggle: true,
    instructionDiagramUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
    fittingGuidelines: 'Take measurements wearing a lightweight fitted shirt. Ensure tape measure rests flat against the body with one finger ease.',
    fields: [
      {
        id: 'fld_jkt_chest',
        key: 'chest_circumference',
        label: 'Chest Circumference',
        anatomicalZone: 'chest_bust',
        unit: 'cm',
        minBound: 75,
        maxBound: 160,
        step: 0.5,
        defaultValue: 102,
        required: true,
        guideText: 'Measure around the fullest part of the chest, keeping the tape parallel to the floor under armpits.',
        warningBounds: { minWarn: 82, maxWarn: 145 },
        sortOrder: 1,
      },
      {
        id: 'fld_jkt_waist',
        key: 'natural_waist',
        label: 'Natural Waist',
        anatomicalZone: 'torso_waist',
        unit: 'cm',
        minBound: 60,
        maxBound: 150,
        step: 0.5,
        defaultValue: 86,
        required: true,
        guideText: 'Measure around the narrowest point of your torso, typically 2 inches above the navel.',
        warningBounds: { minWarn: 68, maxWarn: 135 },
        sortOrder: 2,
      },
      {
        id: 'fld_jkt_shoulder',
        key: 'shoulder_width',
        label: 'Shoulder Point to Point',
        anatomicalZone: 'shoulders',
        unit: 'cm',
        minBound: 36,
        maxBound: 62,
        step: 0.5,
        defaultValue: 46,
        required: true,
        guideText: 'From the prominent bone tip of the left acromion shoulder point across the neck base to the right shoulder bone tip.',
        warningBounds: { minWarn: 38, maxWarn: 58 },
        sortOrder: 3,
      },
      {
        id: 'fld_jkt_sleeve',
        key: 'sleeve_length',
        label: 'Crown Sleeve Length',
        anatomicalZone: 'arms_sleeves',
        unit: 'cm',
        minBound: 50,
        maxBound: 80,
        step: 0.5,
        defaultValue: 65,
        required: true,
        guideText: 'From the outer edge of the shoulder bone down the outside of the arm to the hinge bone of the wrist.',
        warningBounds: { minWarn: 54, maxWarn: 74 },
        sortOrder: 4,
      },
      {
        id: 'fld_jkt_back',
        key: 'back_length',
        label: 'Centre Back Length',
        anatomicalZone: 'torso_waist',
        unit: 'cm',
        minBound: 65,
        maxBound: 110,
        step: 0.5,
        defaultValue: 76,
        required: true,
        guideText: 'From the prominent C7 vertebra at the base of the neck straight down the spine to the desired jacket hemline.',
        sortOrder: 5,
      },
      {
        id: 'fld_jkt_bicep',
        key: 'bicep_circumference',
        label: 'Bicep Girth (Flexed)',
        anatomicalZone: 'arms_sleeves',
        unit: 'cm',
        minBound: 22,
        maxBound: 55,
        step: 0.5,
        defaultValue: 34,
        required: false,
        guideText: 'Measure around the fullest point of the upper arm with arm slightly flexed at 90 degrees.',
        sortOrder: 6,
      },
    ],
    validationRules: [
      {
        id: 'rule_jkt_drop',
        name: 'Waist Drop Plausibility',
        ruleType: 'differential',
        primaryFieldKey: 'natural_waist',
        secondaryFieldKey: 'chest_circumference',
        operator: '>',
        thresholdValue: 35,
        severity: 'warning',
        errorMessage: 'Chest-to-waist drop exceeds 35cm. Please double check waist measurement to avoid extreme drape suppression.',
        active: true,
      },
    ],
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2026-10-12T10:00:00Z',
  },
  {
    id: 'tmpl_meas_trousers',
    designerId: 'des_001_dm',
    category: 'trousers',
    name: 'Artisanal Trouser & Denim Template',
    description: 'Precision drafting schema for straight-leg trousers, raw selvedge denim, and flared culottes.',
    primaryUnit: 'cm',
    allowClientUnitToggle: true,
    instructionDiagramUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1200&q=80',
    fittingGuidelines: 'Measure without shoes. Stand upright with feet shoulder-width apart without locking knees.',
    fields: [
      {
        id: 'fld_trs_waist',
        key: 'trouser_waist',
        label: 'Waistband Position Circumference',
        anatomicalZone: 'torso_waist',
        unit: 'cm',
        minBound: 60,
        maxBound: 145,
        step: 0.5,
        defaultValue: 84,
        required: true,
        guideText: 'Measure where you naturally wear your trouser waistband (mid-rise or high-rise).',
        sortOrder: 1,
      },
      {
        id: 'fld_trs_hips',
        key: 'full_hips',
        label: 'Full Hips / Seat Circumference',
        anatomicalZone: 'hips_pelvis',
        unit: 'cm',
        minBound: 75,
        maxBound: 160,
        step: 0.5,
        defaultValue: 98,
        required: true,
        guideText: 'Around the fullest contour of your seat and hips with heels together.',
        sortOrder: 2,
      },
      {
        id: 'fld_trs_inseam',
        key: 'inseam_length',
        label: 'Inside Leg (Inseam)',
        anatomicalZone: 'legs_inseam',
        unit: 'cm',
        minBound: 60,
        maxBound: 105,
        step: 0.5,
        defaultValue: 82,
        required: true,
        guideText: 'From the lowest point of the crotch seam straight down the inside leg to the floor (barefoot).',
        sortOrder: 3,
      },
      {
        id: 'fld_trs_outseam',
        key: 'outseam_length',
        label: 'Total Outseam Length',
        anatomicalZone: 'legs_inseam',
        unit: 'cm',
        minBound: 85,
        maxBound: 135,
        step: 0.5,
        defaultValue: 106,
        required: true,
        guideText: 'From the waistband edge down the outer hip and leg to the bottom hemline.',
        sortOrder: 4,
      },
      {
        id: 'fld_trs_thigh',
        key: 'thigh_circumference',
        label: 'Upper Thigh Circumference',
        anatomicalZone: 'legs_inseam',
        unit: 'cm',
        minBound: 38,
        maxBound: 85,
        step: 0.5,
        defaultValue: 58,
        required: false,
        guideText: 'Around the widest part of the upper thigh, 1 inch below crotch.',
        sortOrder: 5,
      },
      {
        id: 'fld_trs_ankle',
        key: 'ankle_opening',
        label: 'Desired Leg Opening (Hem Width)',
        anatomicalZone: 'legs_inseam',
        unit: 'cm',
        minBound: 28,
        maxBound: 65,
        step: 0.5,
        defaultValue: 42,
        required: false,
        guideText: 'Total circumference around the bottom hem opening.',
        sortOrder: 6,
      },
    ],
    validationRules: [
      {
        id: 'rule_trs_hip_waist',
        name: 'Hip Greater Than Waist',
        ruleType: 'ratio',
        primaryFieldKey: 'full_hips',
        secondaryFieldKey: 'trouser_waist',
        operator: '<',
        thresholdValue: 0.95,
        severity: 'error',
        errorMessage: 'Hip circumference must be greater than or equal to trouser waist circumference.',
        active: true,
      },
    ],
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2026-10-12T10:00:00Z',
  },
  {
    id: 'tmpl_meas_shirts',
    designerId: 'des_001_dm',
    category: 'shirts',
    name: 'Bespoke Shirt & Blouse Template',
    description: 'Fitted tailoring measurements for formal dress shirts and deconstructed poplin blouses.',
    primaryUnit: 'cm',
    allowClientUnitToggle: true,
    instructionDiagramUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80',
    fittingGuidelines: 'Keep tape comfortable around the collar band allowing space for two fingers ease.',
    fields: [
      {
        id: 'fld_sh_collar',
        key: 'neck_circumference',
        label: 'Collar Band / Neck',
        anatomicalZone: 'head_neck',
        unit: 'cm',
        minBound: 32,
        maxBound: 54,
        step: 0.5,
        defaultValue: 40,
        required: true,
        guideText: 'Around the base of the neck where the shirt collar button sits, with two fingers inside the tape.',
        sortOrder: 1,
      },
      {
        id: 'fld_sh_chest',
        key: 'chest_circumference',
        label: 'Chest Circumference',
        anatomicalZone: 'chest_bust',
        unit: 'cm',
        minBound: 75,
        maxBound: 150,
        step: 0.5,
        defaultValue: 98,
        required: true,
        guideText: 'Fullest point of chest across shoulder blades.',
        sortOrder: 2,
      },
      {
        id: 'fld_sh_sleeve',
        key: 'sleeve_from_yoke',
        label: 'Centre Back to Wrist Sleeve',
        anatomicalZone: 'arms_sleeves',
        unit: 'cm',
        minBound: 70,
        maxBound: 105,
        step: 0.5,
        defaultValue: 88,
        required: true,
        guideText: 'From centre of the neck base, over shoulder point, along elbow to wrist bone.',
        sortOrder: 3,
      },
      {
        id: 'fld_sh_wrist',
        key: 'wrist_circumference',
        label: 'Cuff Wrist Circumference',
        anatomicalZone: 'arms_sleeves',
        unit: 'cm',
        minBound: 14,
        maxBound: 26,
        step: 0.5,
        defaultValue: 18,
        required: false,
        guideText: 'Around the prominent wrist bone.',
        sortOrder: 4,
      },
    ],
    validationRules: [],
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2026-10-12T10:00:00Z',
  },
  {
    id: 'tmpl_meas_gowns',
    designerId: 'des_001_dm',
    category: 'gowns',
    name: 'Haute Couture Evening Gown & Dress Template',
    description: 'Sculptural silhouette specifications for corseted evening wear and draped gowns.',
    primaryUnit: 'cm',
    allowClientUnitToggle: true,
    instructionDiagramUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80',
    fittingGuidelines: 'Measure while wearing the specific undergarments and shoe heel height planned for the gown.',
    fields: [
      {
        id: 'fld_gwn_bust',
        key: 'full_bust',
        label: 'Full Bust Circumference',
        anatomicalZone: 'chest_bust',
        unit: 'cm',
        minBound: 70,
        maxBound: 155,
        step: 0.5,
        defaultValue: 92,
        required: true,
        guideText: 'Around the fullest apex of the bust, level across the back.',
        sortOrder: 1,
      },
      {
        id: 'fld_gwn_underbust',
        key: 'underbust_ribcage',
        label: 'Underbust Ribcage',
        anatomicalZone: 'chest_bust',
        unit: 'cm',
        minBound: 60,
        maxBound: 135,
        step: 0.5,
        defaultValue: 78,
        required: true,
        guideText: 'Directly beneath the bust tissue against the ribcage for corset foundation.',
        sortOrder: 2,
      },
      {
        id: 'fld_gwn_waist',
        key: 'natural_waist',
        label: 'Natural Waist',
        anatomicalZone: 'torso_waist',
        unit: 'cm',
        minBound: 55,
        maxBound: 140,
        step: 0.5,
        defaultValue: 70,
        required: true,
        guideText: 'Narrowest point of natural waistline.',
        sortOrder: 3,
      },
      {
        id: 'fld_gwn_hips',
        key: 'full_hips',
        label: 'Full Hips',
        anatomicalZone: 'hips_pelvis',
        unit: 'cm',
        minBound: 75,
        maxBound: 160,
        step: 0.5,
        defaultValue: 96,
        required: true,
        guideText: 'Fullest curve of hips and buttocks.',
        sortOrder: 4,
      },
      {
        id: 'fld_gwn_hollow_floor',
        key: 'hollow_to_floor',
        label: 'Hollow to Floor (With Planned Heels)',
        anatomicalZone: 'full_stature',
        unit: 'cm',
        minBound: 110,
        maxBound: 175,
        step: 0.5,
        defaultValue: 145,
        required: true,
        guideText: 'From the hollow depression between collarbones straight down to the floor wearing planned event heels.',
        sortOrder: 5,
      },
    ],
    validationRules: [],
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2026-10-12T10:00:00Z',
  },
  {
    id: 'tmpl_meas_jumpsuits',
    designerId: 'des_001_dm',
    category: 'jumpsuits',
    name: 'Architectural Jumpsuit & Bodysuit Template',
    description: 'Continuous vertical torso and stride measurements for seamless bodysuits and jumpsuits.',
    primaryUnit: 'cm',
    allowClientUnitToggle: true,
    instructionDiagramUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
    fittingGuidelines: 'Vertical torso girth loop is critical to ensure comfort when sitting and reaching.',
    fields: [
      {
        id: 'fld_jmp_torso_loop',
        key: 'torso_vertical_girth',
        label: 'Total Torso Vertical Loop (Girth)',
        anatomicalZone: 'full_stature',
        unit: 'cm',
        minBound: 125,
        maxBound: 195,
        step: 0.5,
        defaultValue: 156,
        required: true,
        guideText: 'From mid-shoulder, down chest, through crotch, and up the back to meet the starting shoulder point.',
        sortOrder: 1,
      },
      {
        id: 'fld_jmp_chest',
        key: 'chest_bust',
        label: 'Bust / Chest',
        anatomicalZone: 'chest_bust',
        unit: 'cm',
        minBound: 70,
        maxBound: 150,
        step: 0.5,
        defaultValue: 92,
        required: true,
        guideText: 'Around fullest part of chest.',
        sortOrder: 2,
      },
      {
        id: 'fld_jmp_waist',
        key: 'waist',
        label: 'Waist',
        anatomicalZone: 'torso_waist',
        unit: 'cm',
        minBound: 55,
        maxBound: 140,
        step: 0.5,
        defaultValue: 72,
        required: true,
        guideText: 'Around natural waistline.',
        sortOrder: 3,
      },
      {
        id: 'fld_jmp_inseam',
        key: 'inseam',
        label: 'Inseam Length',
        anatomicalZone: 'legs_inseam',
        unit: 'cm',
        minBound: 65,
        maxBound: 100,
        step: 0.5,
        defaultValue: 80,
        required: true,
        guideText: 'From crotch to floor.',
        sortOrder: 4,
      },
    ],
    validationRules: [],
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2026-10-12T10:00:00Z',
  },
];

const STORAGE_KEY = 'daniels_measurement_templates_v1';

class MeasurementConfigStore {
  private templates: GarmentMeasurementTemplate[];
  private activeTemplateId: string;
  private listeners = new Set<() => void>();

  constructor() {
    this.templates = this.loadInitial();
    this.activeTemplateId = this.templates[0]?.id || 'tmpl_meas_jackets';
  }

  private loadInitial(): GarmentMeasurementTemplate[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Could not load stored measurement templates', e);
    }
    return INITIAL_GARMENT_TEMPLATES;
  }

  private persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.templates));
    } catch (e) {
      console.warn('Could not persist measurement templates', e);
    }
    this.listeners.forEach((fn) => fn());
  }

  public getTemplates(): GarmentMeasurementTemplate[] {
    return this.templates;
  }

  public getActiveTemplate(): GarmentMeasurementTemplate {
    return (
      this.templates.find((t) => t.id === this.activeTemplateId) ||
      this.templates[0] ||
      INITIAL_GARMENT_TEMPLATES[0]
    );
  }

  public setActiveTemplateId(id: string) {
    this.activeTemplateId = id;
    this.listeners.forEach((fn) => fn());
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  // Field Management
  public addField(templateId: string, field: Omit<MeasurementFieldConfig, 'id' | 'sortOrder'>) {
    const newField: MeasurementFieldConfig = {
      ...field,
      id: `fld_${Date.now()}`,
      sortOrder:
        (this.templates.find((t) => t.id === templateId)?.fields.length || 0) + 1,
    };

    this.templates = this.templates.map((tmpl) => {
      if (tmpl.id !== templateId) return tmpl;
      return {
        ...tmpl,
        fields: [...tmpl.fields, newField],
        updatedAt: new Date().toISOString(),
      };
    });
    this.persist();
  }

  public updateField(
    templateId: string,
    fieldId: string,
    updates: Partial<MeasurementFieldConfig>
  ) {
    this.templates = this.templates.map((tmpl) => {
      if (tmpl.id !== templateId) return tmpl;
      return {
        ...tmpl,
        fields: tmpl.fields.map((f) => (f.id === fieldId ? { ...f, ...updates } : f)),
        updatedAt: new Date().toISOString(),
      };
    });
    this.persist();
  }

  public deleteField(templateId: string, fieldId: string) {
    this.templates = this.templates.map((tmpl) => {
      if (tmpl.id !== templateId) return tmpl;
      const targetField = tmpl.fields.find((f) => f.id === fieldId);
      return {
        ...tmpl,
        fields: tmpl.fields.filter((f) => f.id !== fieldId),
        // Clean up any rules mentioning this field key
        validationRules: tmpl.validationRules.filter(
          (r) =>
            r.primaryFieldKey !== targetField?.key &&
            r.secondaryFieldKey !== targetField?.key
        ),
        updatedAt: new Date().toISOString(),
      };
    });
    this.persist();
  }

  // Rule Management
  public addRule(templateId: string, rule: Omit<MeasurementValidationRule, 'id'>) {
    const newRule: MeasurementValidationRule = {
      ...rule,
      id: `rule_m_${Date.now()}`,
    };
    this.templates = this.templates.map((tmpl) => {
      if (tmpl.id !== templateId) return tmpl;
      return {
        ...tmpl,
        validationRules: [...tmpl.validationRules, newRule],
        updatedAt: new Date().toISOString(),
      };
    });
    this.persist();
  }

  public updateRule(
    templateId: string,
    ruleId: string,
    updates: Partial<MeasurementValidationRule>
  ) {
    this.templates = this.templates.map((tmpl) => {
      if (tmpl.id !== templateId) return tmpl;
      return {
        ...tmpl,
        validationRules: tmpl.validationRules.map((r) =>
          r.id === ruleId ? { ...r, ...updates } : r
        ),
        updatedAt: new Date().toISOString(),
      };
    });
    this.persist();
  }

  public deleteRule(templateId: string, ruleId: string) {
    this.templates = this.templates.map((tmpl) => {
      if (tmpl.id !== templateId) return tmpl;
      return {
        ...tmpl,
        validationRules: tmpl.validationRules.filter((r) => r.id !== ruleId),
        updatedAt: new Date().toISOString(),
      };
    });
    this.persist();
  }

  public toggleRule(templateId: string, ruleId: string) {
    this.templates = this.templates.map((tmpl) => {
      if (tmpl.id !== templateId) return tmpl;
      return {
        ...tmpl,
        validationRules: tmpl.validationRules.map((r) =>
          r.id === ruleId ? { ...r, active: !r.active } : r
        ),
        updatedAt: new Date().toISOString(),
      };
    });
    this.persist();
  }

  // Template Management
  public updateTemplateMeta(
    templateId: string,
    meta: Partial<Pick<GarmentMeasurementTemplate, 'name' | 'description' | 'fittingGuidelines' | 'instructionDiagramUrl' | 'primaryUnit'>>
  ) {
    this.templates = this.templates.map((tmpl) =>
      tmpl.id === templateId ? { ...tmpl, ...meta, updatedAt: new Date().toISOString() } : tmpl
    );
    this.persist();
  }

  public createCustomTemplate(name: string, category: GarmentCategoryType) {
    const newTemplate: GarmentMeasurementTemplate = {
      id: `tmpl_${Date.now()}`,
      designerId: 'des_001_dm',
      category,
      name,
      description: 'Custom bespoke pattern measurement schema.',
      primaryUnit: 'cm',
      allowClientUnitToggle: true,
      instructionDiagramUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80',
      fittingGuidelines: 'Verify client silhouette measurements with flexible sewing measuring tape.',
      fields: [],
      validationRules: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.templates = [...this.templates, newTemplate];
    this.activeTemplateId = newTemplate.id;
    this.persist();
  }

  public resetToDefaults() {
    this.templates = INITIAL_GARMENT_TEMPLATES;
    this.activeTemplateId = INITIAL_GARMENT_TEMPLATES[0].id;
    this.persist();
  }
}

export const measurementConfigStore = new MeasurementConfigStore();

export function useMeasurementConfigStore() {
  const [templates, setTemplates] = useState<GarmentMeasurementTemplate[]>(
    measurementConfigStore.getTemplates()
  );
  const [activeTemplate, setActiveTemplate] = useState<GarmentMeasurementTemplate>(
    measurementConfigStore.getActiveTemplate()
  );

  useEffect(() => {
    const unsubscribe = measurementConfigStore.subscribe(() => {
      setTemplates(measurementConfigStore.getTemplates());
      setActiveTemplate(measurementConfigStore.getActiveTemplate());
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return {
    templates,
    activeTemplate,
    setActiveTemplateId: (id: string) => measurementConfigStore.setActiveTemplateId(id),
    addField: (tId: string, f: Omit<MeasurementFieldConfig, 'id' | 'sortOrder'>) =>
      measurementConfigStore.addField(tId, f),
    updateField: (tId: string, fId: string, u: Partial<MeasurementFieldConfig>) =>
      measurementConfigStore.updateField(tId, fId, u),
    deleteField: (tId: string, fId: string) => measurementConfigStore.deleteField(tId, fId),
    addRule: (tId: string, r: Omit<MeasurementValidationRule, 'id'>) =>
      measurementConfigStore.addRule(tId, r),
    updateRule: (tId: string, rId: string, u: Partial<MeasurementValidationRule>) =>
      measurementConfigStore.updateRule(tId, rId, u),
    deleteRule: (tId: string, rId: string) => measurementConfigStore.deleteRule(tId, rId),
    toggleRule: (tId: string, rId: string) => measurementConfigStore.toggleRule(tId, rId),
    updateTemplateMeta: (
      tId: string,
      meta: Partial<Pick<GarmentMeasurementTemplate, 'name' | 'description' | 'fittingGuidelines' | 'instructionDiagramUrl' | 'primaryUnit'>>
    ) => measurementConfigStore.updateTemplateMeta(tId, meta),
    createCustomTemplate: (name: string, category: GarmentCategoryType) =>
      measurementConfigStore.createCustomTemplate(name, category),
    resetToDefaults: () => measurementConfigStore.resetToDefaults(),
  };
}
