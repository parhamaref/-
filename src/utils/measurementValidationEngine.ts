/**
 * @file measurementValidationEngine.ts
 * Validation engine for made-to-measure anatomical schemas, ratio constraints,
 * unit normalization, and bespoke pattern tolerances.
 */

import {
  GarmentMeasurementTemplate,
  MeasurementFieldConfig,
  MeasurementValidationRule,
} from '../types/measurementConfig.types';

export interface MeasurementValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  warnings: Record<string, string>;
  overallStatus: 'PASS' | 'WARN' | 'FAIL';
}

export const CM_PER_INCH = 2.54;

/**
 * Converts measurements between centimetres and inches.
 */
export function convertMeasurement(value: number, fromUnit: 'cm' | 'inch', toUnit: 'cm' | 'inch'): number {
  if (fromUnit === toUnit) return value;
  if (fromUnit === 'inch' && toUnit === 'cm') {
    return Number((value * CM_PER_INCH).toFixed(1));
  }
  return Number((value / CM_PER_INCH).toFixed(2));
}

/**
 * Validates a client submission dictionary against a designer's template schema.
 */
export function validateGarmentMeasurements(
  values: Record<string, number>,
  template: GarmentMeasurementTemplate
): MeasurementValidationResult {
  const errors: Record<string, string> = {};
  const warnings: Record<string, string> = {};

  // 1. Check Field Bounds & Required Status
  for (const field of template.fields) {
    const val = values[field.key];

    if (val === undefined || val === null || isNaN(val)) {
      if (field.required) {
        errors[field.key] = `${field.label} is required for this garment.`;
      }
      continue;
    }

    // Min and Max bounds
    if (val < field.minBound) {
      errors[field.key] = `Value cannot be less than ${field.minBound} ${field.unit} (Provided: ${val} ${field.unit}).`;
    } else if (val > field.maxBound) {
      errors[field.key] = `Value cannot exceed ${field.maxBound} ${field.unit} (Provided: ${val} ${field.unit}).`;
    } else if (field.warningBounds) {
      if (val < field.warningBounds.minWarn) {
        warnings[field.key] = `Value is unusually narrow (${val} ${field.unit}). Please verify measuring tape position.`;
      } else if (val > field.warningBounds.maxWarn) {
        warnings[field.key] = `Value is unusually broad (${val} ${field.unit}). Please verify anatomical landmark.`;
      }
    }
  }

  // 2. Anatomical Ratio and Differential Rules
  for (const rule of template.validationRules) {
    if (!rule.active) continue;

    const valA = values[rule.primaryFieldKey];
    if (valA === undefined) continue;

    if (rule.secondaryFieldKey) {
      const valB = values[rule.secondaryFieldKey];
      if (valB === undefined) continue;

      if (rule.ruleType === 'ratio') {
        const ratio = valA / (valB || 1);
        let violated = false;
        if (rule.operator === '>' && ratio > rule.thresholdValue) violated = true;
        if (rule.operator === '<' && ratio < rule.thresholdValue) violated = true;

        if (violated) {
          if (rule.severity === 'error') {
            errors[rule.primaryFieldKey] = rule.errorMessage;
          } else {
            warnings[rule.primaryFieldKey] = rule.errorMessage;
          }
        }
      } else if (rule.ruleType === 'differential') {
        const diff = Math.abs(valA - valB);
        let violated = false;
        if (rule.operator === '>' && diff > rule.thresholdValue) violated = true;
        if (rule.operator === '<' && diff < rule.thresholdValue) violated = true;

        if (violated) {
          if (rule.severity === 'error') {
            errors[rule.primaryFieldKey] = rule.errorMessage;
          } else {
            warnings[rule.primaryFieldKey] = rule.errorMessage;
          }
        }
      }
    }
  }

  const hasErrors = Object.keys(errors).length > 0;
  const hasWarnings = Object.keys(warnings).length > 0;

  return {
    isValid: !hasErrors,
    errors,
    warnings,
    overallStatus: hasErrors ? 'FAIL' : hasWarnings ? 'WARN' : 'PASS',
  };
}
