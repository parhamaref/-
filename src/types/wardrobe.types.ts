/**
 * @file wardrobe.types.ts
 * Enterprise type definitions for the Daniel’s Maison Digital Wardrobe Management System.
 * Supports Wardrobe Dashboard, Garment Inspection, Size & Alteration History,
 * Material/Color/Care/Warranty specifications, and 6 customer service workflows.
 */

export type WardrobeCategory = 'SUITS' | 'SHIRTS' | 'COATS' | 'DRESSES' | 'ACCESSORIES';

export type GarmentStatus =
  | 'IN_WARDROBE'
  | 'IN_ATELIER'
  | 'ALTERATION_IN_PROGRESS'
  | 'REPAIR_IN_PROGRESS'
  | 'CLEANING_IN_PROGRESS'
  | 'CARE_IN_PROGRESS'
  | 'DISPATCHED_RETURN'
  | 'ARCHIVED';

export type ServiceActionType =
  | 'REORDER_SAME_ITEM'
  | 'REQUEST_ALTERATION'
  | 'REQUEST_REPAIR'
  | 'REQUEST_CARE_SERVICE'
  | 'REQUEST_CLEANING_SERVICE'
  | 'REQUEST_RECREATION_MEASUREMENTS';

export type ServiceRequestStatus =
  | 'SUBMITTED'
  | 'COURIER_PICKUP_SCHEDULED'
  | 'RECEIVED_AT_ATELIER'
  | 'IN_PROGRESS'
  | 'QUALITY_INSPECTION'
  | 'DISPATCHED_TO_CLIENT'
  | 'COMPLETED'
  | 'CANCELLED';

export interface MaterialInfo {
  fabricMillName: string;
  fabricMillCountry: string;
  fabricName: string;
  composition: string;
  weightGsm: number;
  weaveStructure: string;
  breathabilityRating: string;
  liningFabric?: string;
  buttonMaterial?: string;
  interliningType?: string;
  environmentalCertification?: string;
}

export interface ColorInfo {
  primaryColorName: string;
  hexCode: string;
  dyeBatchNumber: string;
  patternType: string;
  accentLiningColor?: string;
  stitchThreadColor?: string;
}

export interface SizeHistoryEntry {
  id: string;
  profileVersion: string;
  recordedDate: string;
  fitPreset: string;
  measurements: {
    chestCircCm?: number;
    waistCircCm?: number;
    hipsCircCm?: number;
    shoulderWidthCm?: number;
    sleeveLengthCm?: number;
    backLengthCm?: number;
    trouserInseamCm?: number;
    trouserOutseamCm?: number;
    trouserWaistCm?: number;
    collarCircCm?: number;
    bicepCircCm?: number;
  };
  notes?: string;
}

export interface AlterationHistoryRecord {
  id: string;
  alterationDate: string;
  serviceType: string;
  description: string;
  tailorName: string;
  atelierBranch: string;
  costGbp: number;
  isComplimentary: boolean;
  measurementDelta?: Record<string, string>;
  beforePhotoUrl?: string;
  afterPhotoUrl?: string;
}

export interface CareInstructions {
  pressingTemperatureCelsius: number;
  steamRecommendation: string;
  dryCleaningInstruction: string;
  brushingTechnique: string;
  hangerType: string;
  seasonalStorageNotes: string;
  cleaningFrequencyGuideline: string;
}

export interface WarrantyInfo {
  certificateSerialNumber: string;
  cryptographicHash: string;
  warrantyTier: string;
  isActive: boolean;
  coverageSummary: string;
  complimentaryAlterationsRemaining: number; // -1 for unlimited
  complimentaryCleaningsRemaining: number;
  complimentaryRepairsRemaining: number;
  issuedAt: string;
  expiresAt?: string;
}

export interface WardrobeItemFull {
  id: string;
  customerId: string;
  customerName: string;
  originalOrderId: string;
  productId: string;
  garmentName: string;
  category: WardrobeCategory;
  silhouetteStyle: string;
  status: GarmentStatus;
  acquiredDate: string;
  originalPriceGbp: number;
  currency: string;
  primaryImageUrl: string;
  galleryImageUrls: string[];
  masterTailorName: string;
  atelierLocation: string;
  clientNotes?: string;

  // Detailed Modules
  material: MaterialInfo;
  color: ColorInfo;
  care: CareInstructions;
  warranty: WarrantyInfo;
  sizeHistory: SizeHistoryEntry[];
  alterations: AlterationHistoryRecord[];
}

export interface ServiceStatusTimelineStep {
  status: ServiceRequestStatus;
  title: string;
  description: string;
  timestamp: string;
  completed: boolean;
  actor?: string;
}

export interface WardrobeServiceRequest {
  id: string;
  wardrobeItemId: string;
  garmentName: string;
  category: WardrobeCategory;
  customerId: string;
  customerName: string;
  actionType: ServiceActionType;
  status: ServiceRequestStatus;
  requestedDate: string;
  targetCompletionDate?: string;
  urgencyLevel: 'STANDARD' | 'EXPEDITED' | 'ROYAL_SALON';
  specificInstructions: string;
  conciergePickupRequested: boolean;
  pickupAddress: string;
  preferredFittingSalon: string;
  estimatedCostGbp: number;
  assignedArtisanName?: string;
  timeline: ServiceStatusTimelineStep[];

  // Action-specific options
  reorderOptions?: {
    customFabricChoice?: string;
    repeatMeasurementsConfirmed: boolean;
    additionalLiningMonogram?: string;
  };
  alterationOptions?: {
    targetedAreas: string[];
    adjustmentNotes: string;
    fitDirection: 'TAKE_IN' | 'LET_OUT' | 'LENGTHEN' | 'SHORTEN' | 'CUSTOM';
  };
  repairOptions?: {
    damageType: 'SEAM_PULL' | 'BUTTON_LOST' | 'LINING_WEAR' | 'FABRIC_SNAG' | 'OTHER';
    photoUrl?: string;
  };
  recreationOptions?: {
    newFabricSelected: string;
    newColorHex: string;
    keepIdenticalCut: boolean;
  };
}

export interface WardrobeSummaryMetrics {
  totalGarments: number;
  totalValuationGbp: number;
  garmentsInAtelier: number;
  activeWarrantiesCount: number;
  completedAlterationsLifetime: number;
  categoryCounts: Record<WardrobeCategory, number>;
}
