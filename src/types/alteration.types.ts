/**
 * @file alteration.types.ts
 * Type definitions for the Daniel’s Maison Alteration & Tailoring Request Module.
 * Defines data structures for:
 * - 6-Stage Alteration Workflow:
 *   Submitted → Reviewed → Approved → In Alteration → Completed → Returned
 * - Garment Selection & Provenance
 * - Fit Changes & Anatomical Adjustments
 * - Photo Uploads & Visual Fitting Pinpoints
 * - Progress Tracking & Timeline Logs
 * - Master Tailor Reviews & Logistics
 */

import { WardrobeCategory } from './wardrobe.types';

export type AlterationWorkflowStage =
  | 'SUBMITTED'
  | 'REVIEWED'
  | 'APPROVED'
  | 'IN_ALTERATION'
  | 'COMPLETED'
  | 'RETURNED';

export type FitRegion =
  | 'CHEST_BUST'
  | 'WAIST_SUPPRESSION'
  | 'SLEEVE_LENGTH'
  | 'JACKET_LENGTH'
  | 'SHOULDERS_BACK'
  | 'TROUSER_WAIST'
  | 'TROUSER_SEAT'
  | 'TROUSER_INSEAM'
  | 'TROUSER_LEG_OPENING'
  | 'COLLAR_NECK'
  | 'ARMHOLE_DEPTH';

export type FitAdjustmentDirection =
  | 'TAKE_IN'
  | 'LET_OUT'
  | 'SHORTEN'
  | 'LENGTHEN'
  | 'TAPER'
  | 'LIFT_BALANCE'
  | 'LOWER_BALANCE'
  | 'REMOVE_FOLDS';

export type PhotoAngle = 'FRONT' | 'SIDE_PROFILE' | 'BACK' | 'DETAIL_PINPOINT';

export interface FittingPinCoordinate {
  id: string;
  xPercent: number; // 0 to 100 on photo
  yPercent: number; // 0 to 100 on photo
  region: FitRegion;
  note: string;
}

export interface AlterationPhoto {
  id: string;
  url: string;
  angle: PhotoAngle;
  caption: string;
  uploadedAt: string;
  pinCoordinates?: FittingPinCoordinate[];
  isAfterPhoto?: boolean;
}

export interface DesiredFitChange {
  id: string;
  region: FitRegion;
  regionLabel: string;
  direction: FitAdjustmentDirection;
  directionLabel: string;
  deltaCm: number; // e.g. -1.5 or +2.0
  issueDescription: string;
  tailorConfirmedDeltaCm?: number;
}

export interface AlterationTimelineStep {
  stage: AlterationWorkflowStage;
  title: string;
  description: string;
  timestamp: string;
  completed: boolean;
  actorName: string;
  actorRole: 'CLIENT' | 'CONCIERGE' | 'MASTER_TAILOR' | 'CHIEF_CUTTER' | 'COURIER';
  notes?: string;
}

export interface AlterationRequest {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;

  // Selected Garment Info
  wardrobeItemId: string;
  garmentName: string;
  garmentCategory: WardrobeCategory;
  garmentSilhouette: string;
  garmentSerial: string;
  primaryImageUrl: string;
  originalPriceGbp: number;
  originalTailorName: string;

  // Workflow State: Submitted → Reviewed → Approved → In Alteration → Completed → Returned
  currentStage: AlterationWorkflowStage;
  submittedAt: string;
  reviewedAt?: string;
  approvedAt?: string;
  inAlterationAt?: string;
  completedAt?: string;
  returnedAt?: string;

  // Fit & Tailoring Details
  fitChanges: DesiredFitChange[];
  alterationNotes: string;
  bodyPostureNotice?: 'REGULAR_POSTURE' | 'ERECT_POSTURE' | 'SLIGHT_STOOP' | 'LOW_RIGHT_SHOULDER' | 'PROMINENT_BLADES';
  wearOccasion?: string;
  urgencyLevel: 'STANDARD' | 'EXPEDITED' | 'ROYAL_SALON';

  // Visual Fitting Proofs
  photos: AlterationPhoto[];
  afterPhotos?: AlterationPhoto[];

  // Atelier Review & Execution
  assignedTailorName?: string;
  atelierBranch: string;
  tailorChalkNotes?: string;
  estimatedCostGbp: number;
  isComplimentaryWarranty: boolean;
  warrantySerialNumber?: string;

  // Logistics & White-Glove Concierge
  conciergePickup: boolean;
  pickupAddress: string;
  deliveryAddress: string;
  trackingNumber?: string;
  courierServiceName?: string;
  estimatedDeliveryDate?: string;

  // Step-by-step Audit Timeline
  timeline: AlterationTimelineStep[];
}

export interface NewAlterationFormState {
  wardrobeItemId: string;
  fitChanges: DesiredFitChange[];
  alterationNotes: string;
  bodyPostureNotice: 'REGULAR_POSTURE' | 'ERECT_POSTURE' | 'SLIGHT_STOOP' | 'LOW_RIGHT_SHOULDER' | 'PROMINENT_BLADES';
  wearOccasion: string;
  urgencyLevel: 'STANDARD' | 'EXPEDITED' | 'ROYAL_SALON';
  photos: AlterationPhoto[];
  conciergePickup: boolean;
  pickupAddress: string;
  deliveryAddress: string;
  preferredSalon: string;
}
