/**
 * @file qualityControl.types.ts
 * Enterprise Type Definitions for Daniel’s Maison Advanced Quality Control (QC) System.
 * 
 * Features:
 * - Inspection Checklist
 * - Garment Measurements Verification
 * - Fabric Verification
 * - Finish Inspection
 * - Packaging Inspection
 * 
 * Results:
 * - Pass
 * - Fail
 * - Rework Required
 * 
 * Storage:
 * - Defects
 * - Corrective Actions
 * - QC Photos
 * - QC Notes
 * - Approval Records
 */

export type QCResult = 'Pass' | 'Fail' | 'Rework Required';

export type QCDefectSeverity = 'Minor' | 'Major' | 'Critical';

export type QCDefectCategory =
  | 'Measurement'
  | 'Fabric & Weave'
  | 'Stitching & Construction'
  | 'Finishing & Pressing'
  | 'Hardware & Fasteners'
  | 'Lining & Structure'
  | 'Packaging & Presentation'
  | 'Labeling & Tagging';

export type QCCorrectiveActionStatus = 'Pending' | 'In Progress' | 'Resolved' | 'Waived';

export type QCChecklistCategory =
  | 'Symmetry & Proportions'
  | 'Stitch & Seam Integrity'
  | 'Lining & Internal Canvas'
  | 'Pressing & Surface Finish'
  | 'Hardware & Embellishment'
  | 'Packaging & Presentation';

export type QCCheckItemStatus = 'Pass' | 'Fail' | 'Flagged' | 'Pending';

/**
 * Inspection Checklist Item
 */
export interface QCInspectionChecklistItem {
  id: string;
  category: QCChecklistCategory;
  title: string;
  description: string;
  toleranceMm?: number;
  status: QCCheckItemStatus;
  notes?: string;
  photoRefId?: string;
  checkedBy?: string;
  checkedAt?: string;
}

/**
 * Garment Measurement Verification Spec & Actual
 */
export interface QCGarmentMeasurement {
  id: string;
  pointOfMeasure: string; // e.g. "Chest Circumference", "Waist Width", "Sleeve Inseam"
  anatomicalZone: 'Chest' | 'Waist' | 'Hip' | 'Shoulder' | 'Sleeve' | 'Length' | 'Collar' | 'Trouser';
  targetSpecCm: number;
  actualMeasuredCm: number;
  toleranceMinusMm: number; // e.g. 2mm
  tolerancePlusMm: number;  // e.g. 2mm
  varianceMm: number; // actual - target in mm
  status: 'In Tolerance' | 'Out of Tolerance' | 'Critical Deviation';
  notes?: string;
}

/**
 * Fabric Verification Details
 */
export interface QCFabricVerification {
  id: string;
  fabricCode: string;
  millName: string; // e.g. "Lanificio F.lli Cerruti", "Loro Piana Biella"
  composition: string; // e.g. "100% Super 160s Australian Merino Wool"
  declaredGsm: number; // Grams per square meter
  testedGsm: number;
  weavePattern: 'Twill' | 'Herringbone' | 'Plain Weave' | 'Satin' | 'Barathea' | 'Jacquard';
  shadeMatchDeltaE: number; // Spectrophotometer Color match (acceptable < 1.0)
  colorMatchStatus: 'Match' | 'Slight Deviation' | 'Rejected Shade';
  yarnCount: string; // e.g. "2/80s Nm"
  flawInspectionResult: 'Zero Flaws' | 'Minor Slub' | 'Weft Flaw Detected';
  sheenAndHandleCheck: 'Pass' | 'Fail';
  shrinkageResistancePass: boolean;
  notes: string;
  swatchImageUrl?: string;
}

/**
 * Finish Inspection Criteria
 */
export interface QCFinishInspection {
  id: string;
  seamPuckeringRating: 1 | 2 | 3 | 4 | 5; // 5 = Flawless, 1 = Severe Puckering
  stitchDensityPerCm: number; // standard: 5 to 7 sts/cm for suits, 12 sts/cm for buttonholes
  milaneseButtonholeQuality: 'Hand-worked Flawless' | 'Machine-Assisted Pass' | 'Irregular / Rework';
  cuproLiningEasePass: boolean;
  lapelRollFullnessPass: boolean;
  coldIronPressShineFree: boolean;
  threadTrimmed100Percent: boolean;
  zipperAndFastenersFluidity: 'Silky Smooth' | 'Friction Detected' | 'Defective';
  notes: string;
}

/**
 * Packaging Inspection Criteria
 */
export interface QCPackagingInspection {
  id: string;
  cedarGarmentBagIncluded: boolean;
  contouredBrassHangerVerified: boolean;
  acidFreeTissuePaperFolded: boolean;
  waxSealAuthenticityApplied: boolean;
  tamperProofSerialHologram: string; // e.g. "MD-HOLO-9428-A"
  presentationBoxIntegrity: 'Pristine' | 'Dented' | 'Rejected';
  courierShippingLabelAffixed: boolean;
  clientCareCardInserted: boolean;
  notes: string;
}

/**
 * Defect Record
 */
export interface QCDefect {
  id: string;
  defectCode: string; // e.g. "DEF-MEAS-01", "DEF-FIN-08"
  category: QCDefectCategory;
  severity: QCDefectSeverity;
  locationOnGarment: string;
  description: string;
  photoUrl?: string;
  detectedAt: string;
  detectedBy: string;
  reworkAssignedTo?: string;
  resolved: boolean;
  resolvedAt?: string;
}

/**
 * Corrective Action Record
 */
export interface QCCorrectiveAction {
  id: string;
  defectId: string;
  actionRequired: string;
  assignedTailorOrWorkshop: string;
  priority: 'Immediate' | 'Standard' | 'Urgent';
  targetCompletionDate: string;
  requiresReinspection: boolean;
  status: QCCorrectiveActionStatus;
  remedialNotes?: string;
  completedAt?: string;
  verifiedBy?: string;
}

/**
 * QC Photo Evidence Record
 */
export interface QCPhotoEvidence {
  id: string;
  garmentArea: string; // e.g. "Center Back Seam", "Left Lapel Buttonhole", "Hemline Inseam"
  photoUrl: string;
  caption: string;
  defectRefId?: string;
  timestamp: string;
  inspectorName: string;
  highlightCoordinates?: { x: number; y: number }; // Percentage 0-100 on photo
}

/**
 * QC Note Record
 */
export interface QCNote {
  id: string;
  author: string;
  role: string;
  timestamp: string;
  stage: 'Intake' | 'Measurement' | 'Fabric' | 'Finish' | 'Packaging' | 'Final Signoff';
  content: string;
  isClientVisible: boolean;
}

/**
 * Approval & Certification Record
 */
export interface QCApprovalRecord {
  id: string;
  inspectionId: string;
  orderId: string;
  garmentSerialNumber: string;
  finalResult: QCResult;
  certifiedInspectorName: string;
  inspectorBadgeNumber: string;
  approvalTimestamp: string;
  digitalSealHash: string;
  authenticityCertificateNumber: string;
  reworkDispatchedAt?: string;
  reworkInstructions?: string;
  signatureSvgUrl?: string;
  complianceStandard: 'Daniel’s Maison Haute Couture Spec V3.4' | 'Savile Row Bespoke Protocol' | 'Camera Nazionale Standard';
}

/**
 * Master QC Inspection Session Record
 */
export interface QCInspectionSession {
  id: string;
  orderId: string;
  clientName: string;
  garmentName: string;
  garmentSilhouette: string;
  partnerAtelier: string;
  orderTotal: number;
  inspectionDate: string;
  inspectorId: string;
  inspectorName: string;
  result: QCResult;
  status: 'In Progress' | 'Completed' | 'Pending Re-Inspection';
  
  // 5 Feature Pillars
  checklist: QCInspectionChecklistItem[];
  measurements: QCGarmentMeasurement[];
  fabricVerification: QCFabricVerification;
  finishInspection: QCFinishInspection;
  packagingInspection: QCPackagingInspection;
  
  // Storage Pillars
  defects: QCDefect[];
  correctiveActions: QCCorrectiveAction[];
  photos: QCPhotoEvidence[];
  notes: QCNote[];
  approvalRecord?: QCApprovalRecord;
  
  updatedAt: string;
}
