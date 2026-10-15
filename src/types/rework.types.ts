/**
 * @file rework.types.ts
 * Enterprise Type Definitions for Daniel’s Maison Rework Management Workflow.
 * 
 * Features:
 * - Create Rework Request
 * - Assign Rework Tasks
 * - Defect Tracking
 * - Corrective Action Tracking
 * - Reinspection Process
 * 
 * Workflow Stages:
 * QC Failed -> Rework Assigned -> Rework In Progress -> Reinspection -> Approved
 */

import {
  QCDefectCategory,
  QCDefectSeverity,
  QCResult,
  QCGarmentMeasurement,
} from './qualityControl.types';

export type ReworkStatus =
  | 'QC Failed'
  | 'Rework Assigned'
  | 'Rework In Progress'
  | 'Reinspection'
  | 'Approved';

export type ReworkPriority = 'Standard (48h)' | 'Urgent (24h)' | 'Rush Haute Couture (12h)';

export type ReworkTaskCategory =
  | 'Measurement Alteration'
  | 'Seam Restitch & Taper'
  | 'Fabric Patch & Re-Cut'
  | 'Lapel Roll & Cold Iron Re-Shape'
  | 'Hardware & Button Re-Shank'
  | 'Cupro Lining Ease Adjustment'
  | 'Hemline & Edge Re-Finish';

export type ReworkTaskStatus = 'Pending' | 'In Progress' | 'Completed' | 'Verified';

/**
 * Defect item tracked under a Rework Request
 */
export interface ReworkDefect {
  id: string;
  defectCode: string;
  category: QCDefectCategory;
  severity: QCDefectSeverity;
  location: string;
  description: string;
  detectedBy: string;
  detectedAt: string;
  photoUrl?: string;
  remediationStatus: 'Pending' | 'Remediating' | 'Resolved' | 'Verified';
  resolvedAt?: string;
  resolvedBy?: string;
}

/**
 * Concrete task assigned to a tailor for remediating non-conformances
 */
export interface ReworkTask {
  id: string;
  reworkRequestId: string;
  defectId: string;
  title: string;
  category: ReworkTaskCategory;
  description: string;
  correctiveActionDetail: string;
  assignedTailor: string;
  assignedWorkshop: string;
  priority: 'Standard' | 'Urgent' | 'Immediate';
  estimatedHours: number;
  actualHours: number;
  status: ReworkTaskStatus;
  progressPercent: number; // 0 to 100
  tailorNotes?: string;
  beforePhotoUrl?: string;
  afterPhotoUrl?: string;
  assignedAt: string;
  completedAt?: string;
  targetCompletionDate: string;
}

/**
 * Reinspection checklist item verified after tailor completes work
 */
export interface ReinspectionCheckItem {
  id: string;
  item: string;
  category:
    | 'Measurement'
    | 'Stitch & Seam'
    | 'Fabric & Surface'
    | 'Finish & Press'
    | 'Hardware & Fasteners'
    | 'Lining & Structure'
    | 'Presentation';
  originalDeviation: string;
  targetTolerance: string;
  measuredRecheck: string;
  status: 'Pass' | 'Fail' | 'Pending';
  toleranceVarianceMm?: number;
  inspectorNotes?: string;
  verifiedAt?: string;
}

/**
 * Official Reinspection Verdict & Haute Couture Accreditation Record
 */
export interface ReinspectionVerdict {
  id: string;
  reworkRequestId: string;
  reinspectedBy: string;
  inspectorBadgeNumber: string;
  timestamp: string;
  verdict: 'Approved' | 'Further Rework Required' | 'Rejected / Scrapped';
  accreditationSealHash?: string;
  certificateNumber?: string;
  notes: string;
  measurementsReverified: boolean;
  finishesReverified: boolean;
  packagingReleased: boolean;
  complianceStandard: 'Daniel’s Maison Haute Couture Spec V3.4' | 'Savile Row Protocol' | 'Camera Nazionale Standard';
}

/**
 * Historical audit log of workflow stage transitions
 */
export interface ReworkHistoryLog {
  id: string;
  fromStatus: ReworkStatus;
  toStatus: ReworkStatus;
  changedBy: string;
  role: string;
  timestamp: string;
  comment: string;
}

/**
 * Master Rework Request Record
 */
export interface ReworkRequest {
  id: string; // e.g. "RWK-2026-081"
  orderId: string; // e.g. "ORD-2026-0885"
  qcSessionId?: string; // e.g. "QC-SESS-2026-002"
  clientName: string;
  garmentName: string;
  garmentSilhouette: string;
  orderTotal: number;
  status: ReworkStatus;
  priority: ReworkPriority;
  failedReason: string;
  failedDate: string;
  leadInspector: string;
  leadInspectorBadge: string;
  
  // Assignment details
  assignedTailor?: string;
  assignedWorkshop?: string;
  assignedAt?: string;
  targetSlaDeadline: string;
  
  // Tracking
  defects: ReworkDefect[];
  tasks: ReworkTask[];
  
  // Reinspection Process
  reinspectionChecks: ReinspectionCheckItem[];
  reinspectionVerdict?: ReinspectionVerdict;
  
  // Audit trail
  history: ReworkHistoryLog[];
  
  createdAt: string;
  updatedAt: string;
}

export interface TailorStaffProfile {
  id: string;
  name: string;
  specialty: string;
  workshop: string;
  activeReworksCount: number;
  maxCapacity: number;
  firstTimeFixRate: number; // e.g. 98.4%
  rating: number; // 4.9
  avatarUrl: string;
}
