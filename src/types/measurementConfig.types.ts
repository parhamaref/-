/**
 * @file measurementConfig.types.ts
 * Schemas and interfaces for the Made-to-Measure Configuration Module:
 * Garment Templates, Custom Fields, Anatomical Guides, Tolerance Bounds, and Validation Rules.
 */

export type GarmentCategoryType =
  | 'jackets'
  | 'trousers'
  | 'shirts'
  | 'gowns'
  | 'jumpsuits'
  | 'custom';

export type AnatomicalZone =
  | 'head_neck'
  | 'shoulders'
  | 'chest_bust'
  | 'torso_waist'
  | 'arms_sleeves'
  | 'hips_pelvis'
  | 'legs_inseam'
  | 'full_stature';

export interface MeasurementFieldConfig {
  id: string;
  key: string; // e.g. "chest_circumference", "sleeve_length"
  label: string; // e.g. "Chest Circumference (Fullest Point)"
  anatomicalZone: AnatomicalZone;
  unit: 'cm' | 'inch';
  minBound: number; // e.g. 70 cm
  maxBound: number; // e.g. 160 cm
  step: number; // e.g. 0.5 cm
  defaultValue?: number;
  required: boolean;
  guideText: string; // Step-by-step instructions for the tailor or client
  guideImageUrl?: string; // Anatomical reference illustration
  warningBounds?: {
    minWarn: number;
    maxWarn: number;
  };
  customNotesPrompt?: string;
  sortOrder: number;
}

export type ValidationRuleType = 'ratio' | 'differential' | 'range' | 'custom_script';

export interface MeasurementValidationRule {
  id: string;
  name: string;
  ruleType: ValidationRuleType;
  primaryFieldKey: string;
  secondaryFieldKey?: string;
  operator: '<' | '>' | '<=' | '>=' | 'range_ratio';
  thresholdValue: number; // e.g. 1.25 ratio or 20cm difference
  severity: 'error' | 'warning';
  errorMessage: string; // e.g. "Waist measurement cannot exceed chest measurement by more than 15cm"
  active: boolean;
}

export interface GarmentMeasurementTemplate {
  id: string;
  designerId: string;
  category: GarmentCategoryType;
  name: string; // e.g. "Savile Row Bespoke Jacket Template"
  description: string;
  primaryUnit: 'cm' | 'inch';
  allowClientUnitToggle: boolean;
  fields: MeasurementFieldConfig[];
  validationRules: MeasurementValidationRule[];
  instructionDiagramUrl: string;
  fittingGuidelines: string;
  createdAt: string;
  updatedAt: string;
}
