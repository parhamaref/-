/**
 * @file customization.types.ts
 * Schemas and interfaces for Product Customization Builder,
 * Option Groups, Compatibility Rule Engine, Dynamic Pricing, and Variant Permutations.
 */

export type CustomizationGroupType =
  | 'fabric'
  | 'color'
  | 'trim'
  | 'accessory'
  | 'embroidery'
  | 'monogram';

export interface CustomizationOption {
  id: string;
  groupId: string;
  name: string;
  skuCode: string;
  description?: string;
  priceDelta: number; // in GBP, e.g. +45
  leadTimeDaysDelta: number; // e.g. +3 days
  swatchColor?: string; // hex code
  swatchImageUrl?: string;
  texturePattern?: string;
  materialDetails?: string;
  isDefault?: boolean;
  inStock: boolean;
  outOfStockNotice?: string;
}

export interface CustomizationOptionGroup {
  id: string;
  name: string;
  type: CustomizationGroupType;
  description: string;
  required: boolean;
  multiSelect: boolean;
  maxSelections?: number;
  options: CustomizationOption[];
  sortOrder: number;
}

export type RuleType = 'incompatible' | 'requires' | 'recommended';

export interface CompatibilityRule {
  id: string;
  name: string;
  ruleType: RuleType;
  sourceOptionId: string; // The trigger option
  sourceOptionName?: string;
  targetOptionIds: string[]; // Options that are incompatible / required
  targetOptionNames?: string[];
  explanation: string; // Why this rule exists, e.g. "Worsted wool cannot support raw frayed denim trims"
  severity: 'error' | 'warning';
  active: boolean;
}

export interface VariantPermutation {
  id: string;
  sku: string;
  name: string;
  selectedOptionIds: string[];
  selectedOptionNames: Record<string, string>;
  calculatedPrice: number;
  calculatedLeadTimeDays: number;
  isCompatible: boolean;
  conflictReason?: string;
}

export interface CustomizationTemplate {
  id: string;
  designerId: string;
  name: string;
  category: 'jackets' | 'trousers' | 'dresses' | 'tops' | 'outerwear';
  basePrice: number; // in GBP
  baseLeadTimeDays: number;
  optionGroups: CustomizationOptionGroup[];
  rules: CompatibilityRule[];
  createdAt: string;
  updatedAt: string;
}
