/**
 * @file productionWorkflow.types.ts
 * Schemas and interfaces for the Designer Production Workflow Module.
 * Defines the 8 sequential haute-couture manufacturing milestones:
 * Pattern Design -> Fabric Selection -> Cutting -> Sewing -> Finishing -> Quality Control -> Packaging -> Shipping.
 */

export type ProductionStageName =
  | 'Pattern Design'
  | 'Fabric Selection'
  | 'Cutting'
  | 'Sewing'
  | 'Finishing'
  | 'Quality Control'
  | 'Packaging'
  | 'Shipping';

export type WorkflowStageStatus = 'Not Started' | 'In Progress' | 'Completed' | 'Blocked';

export interface StageNote {
  id: string;
  timestamp: string;
  artisanName: string;
  text: string;
  isCustomerVisible: boolean; // Enables client portal visibility
  photoUrl?: string; // Optional craftsmanship snapshot
}

export interface WorkflowStage {
  id: string;
  stage: ProductionStageName;
  order: number; // 1 to 8
  status: WorkflowStageStatus;
  progress: number; // 0 to 100
  startedAt?: string;
  completedAt?: string;
  estimatedDurationHours: number;
  assignedArtisan: string;
  artisanRole: string; // e.g. "Master Pattern Drafter", "Head Cutter", "Senior Tailor", "QC Specialist"
  notes: StageNote[];
  customerSummary: string; // Public-facing narrative shown to client in customer portal
}

export interface OrderProductionWorkflow {
  id: string;
  orderId: string;
  orderNumber: string; // e.g. "DM-2026-9480"
  customerName: string;
  customerEmail: string;
  garmentName: string;
  garmentCategory: string;
  garmentThumbnail: string;
  currentStage: ProductionStageName;
  overallProgress: number; // 0 to 100%
  stages: WorkflowStage[];
  startedAt: string;
  estimatedFinishAt: string;
  isRushOrder: boolean;
  qualityScore?: number; // e.g. 99.4%
  customerVisibilityEnabled: boolean; // Master client tracking stream toggle
  createdAt: string;
  updatedAt: string;
}
