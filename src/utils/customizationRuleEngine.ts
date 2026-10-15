/**
 * @file customizationRuleEngine.ts
 * Enterprise Compatibility Rule Engine & Dynamic Pricing Calculator.
 * Evaluates garment configuration integrity, enforces compatibility matrices,
 * and generates combinatorial product variant permutations.
 */

import {
  CustomizationOption,
  CustomizationOptionGroup,
  CompatibilityRule,
  VariantPermutation,
} from '../types/customization.types';

export interface CompatibilityEvaluationResult {
  isCompatible: boolean;
  errors: string[];
  warnings: string[];
  conflictingRules: CompatibilityRule[];
}

/**
 * Evaluates whether a set of chosen options violates any compatibility rules.
 */
export function evaluateCompatibility(
  selectedOptionIds: string[],
  rules: CompatibilityRule[]
): CompatibilityEvaluationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const conflictingRules: CompatibilityRule[] = [];

  const selectedSet = new Set(selectedOptionIds);

  for (const rule of rules) {
    if (!rule.active) continue;

    // Check if the trigger option is selected
    if (selectedSet.has(rule.sourceOptionId)) {
      if (rule.ruleType === 'incompatible') {
        // If trigger is selected, NONE of the targetOptionIds may be selected
        const conflicts = rule.targetOptionIds.filter((tId) => selectedSet.has(tId));
        if (conflicts.length > 0) {
          conflictingRules.push(rule);
          if (rule.severity === 'error') {
            errors.push(rule.explanation || `Incompatible combination with option ID ${rule.sourceOptionId}`);
          } else {
            warnings.push(rule.explanation);
          }
        }
      } else if (rule.ruleType === 'requires') {
        // If trigger is selected, AT LEAST ONE or ALL of the targetOptionIds must be selected
        const satisfied = rule.targetOptionIds.some((tId) => selectedSet.has(tId));
        if (!satisfied) {
          conflictingRules.push(rule);
          if (rule.severity === 'error') {
            errors.push(rule.explanation || `Option requires a dependent selection.`);
          } else {
            warnings.push(rule.explanation);
          }
        }
      } else if (rule.ruleType === 'recommended') {
        const satisfied = rule.targetOptionIds.some((tId) => selectedSet.has(tId));
        if (!satisfied) {
          warnings.push(`Recommendation: ${rule.explanation}`);
        }
      }
    }
  }

  return {
    isCompatible: errors.length === 0,
    errors,
    warnings,
    conflictingRules,
  };
}

/**
 * Calculates dynamic price given base price and selected options.
 */
export function calculateDynamicPrice(
  basePrice: number,
  selectedOptions: CustomizationOption[]
): {
  basePrice: number;
  optionsTotal: number;
  finalPrice: number;
  breakdown: { name: string; priceDelta: number }[];
} {
  const breakdown: { name: string; priceDelta: number }[] = [];
  let optionsTotal = 0;

  for (const opt of selectedOptions) {
    if (opt.priceDelta !== 0) {
      optionsTotal += opt.priceDelta;
      breakdown.push({
        name: opt.name,
        priceDelta: opt.priceDelta,
      });
    }
  }

  return {
    basePrice,
    optionsTotal,
    finalPrice: Math.max(0, basePrice + optionsTotal),
    breakdown,
  };
}

/**
 * Generates Cartesian product combinations across option groups and validates each variant.
 */
export function generateVariantPermutations(
  optionGroups: CustomizationOptionGroup[],
  rules: CompatibilityRule[],
  basePrice: number,
  baseLeadTimeDays: number = 14,
  maxPermutations: number = 40
): VariantPermutation[] {
  // Only include groups that have at least 1 option
  const activeGroups = optionGroups.filter((g) => g.options.length > 0);
  if (activeGroups.length === 0) return [];

  // Cartesian product helper
  const cartesian = (arrays: CustomizationOption[][]): CustomizationOption[][] => {
    return arrays.reduce<CustomizationOption[][]>(
      (acc, curr) => {
        const res: CustomizationOption[][] = [];
        acc.forEach((a) => {
          curr.forEach((b) => {
            res.push([...a, b]);
          });
        });
        return res;
      },
      [[]]
    );
  };

  // We take the primary single-select groups first to avoid combinatorial explosion
  const groupOptionLists = activeGroups.map((g) => g.options.slice(0, 4)); // cap per group for safety
  const rawCombinations = cartesian(groupOptionLists).slice(0, maxPermutations);

  return rawCombinations.map((combo, idx) => {
    const selectedOptionIds = combo.map((o) => o.id);
    const selectedOptionNames: Record<string, string> = {};
    let priceSum = basePrice;
    let leadTime = baseLeadTimeDays;
    const skuParts: string[] = ['DM'];

    combo.forEach((opt) => {
      selectedOptionNames[opt.groupId] = opt.name;
      priceSum += opt.priceDelta;
      leadTime += opt.leadTimeDaysDelta;
      skuParts.push(opt.skuCode || opt.name.substring(0, 3).toUpperCase());
    });

    const compatibility = evaluateCompatibility(selectedOptionIds, rules);

    return {
      id: `var_${idx + 1}_${Date.now()}`,
      sku: skuParts.join('-'),
      name: combo.map((o) => o.name).join(' / '),
      selectedOptionIds,
      selectedOptionNames,
      calculatedPrice: priceSum,
      calculatedLeadTimeDays: Math.max(1, leadTime),
      isCompatible: compatibility.isCompatible,
      conflictReason: compatibility.errors[0] || (compatibility.warnings[0] ? `Note: ${compatibility.warnings[0]}` : undefined),
    };
  });
}
