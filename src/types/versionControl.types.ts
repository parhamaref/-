/**
 * @file versionControl.types.ts
 * Enterprise Type Definitions for Daniel's Maison Haute Couture Version Control System (VCS).
 * 
 * Supported Version Domains:
 * 1. Measurement Versions (Anatomical bespoke profiles, posture adjustments, tolerances)
 * 2. Design Versions (CAD technical sketches, silhouettes, canvas construction, styling directives)
 * 3. Fabric Selection Versions (Mill sources, yarn count, GSM weights, color Pantone, cupro linings)
 * 4. Approval Versions (Client & Master Tailor formal sign-offs, digital signatures, cryptographic seals)
 * 
 * Features:
 * - Compare Versions (Side-by-side multi-domain semantic diffs)
 * - Restore Older Versions (Non-destructive forward rollbacks with audit trail)
 * - Version History Timeline (Git-style visual branch/commit progression)
 * - Approval Snapshot Storage (Immutable vault with digital signatures & SHA-256 hashes)
 */

export type VersionDomainType = 'measurements' | 'design' | 'fabrics' | 'approval';

export type VersionTag =
  | 'STABLE'
  | 'PRODUCTION_LOCK'
  | 'CLIENT_APPROVED'
  | 'DRAFT'
  | 'REVISED'
  | 'ARCHIVED';

export interface VersionAuthor {
  id: string;
  name: string;
  role: 'Lead Designer' | 'Master Tailor' | 'Artisan Patternmaker' | 'Client' | 'QC Inspector' | 'System';
  email: string;
  avatarUrl?: string;
}

// 1. Measurement Version Data
export interface MeasurementVersionData {
  chestCircumferenceCm: number;
  waistDropCm: number;
  hipCircumferenceCm: number;
  bicepCircumferenceCm: number;
  shoulderWidthCm: number;
  sleeveLengthCm: number;
  inseamLengthCm: number;
  neckCircumferenceCm: number;
  jacketBackLengthCm: number;
  shoulderSlopeAngle: number;
  postureNotes: string;
  toleranceMm: number;
  scanMethod: string;
  unit: 'cm' | 'inches';
}

// 2. Design Version Data
export interface DesignSketchItem {
  id: string;
  viewAngle: 'FRONT' | 'BACK' | 'LAPEL_DETAIL' | 'INTERIOR_LINING' | 'FULL_LENGTH';
  title: string;
  imageUrl: string;
  cadVersion: string;
}

export interface DesignVersionData {
  silhouetteName: string;
  lapelStyle: string;
  lapelWidthCm: number;
  buttonConfiguration: string;
  buttonMaterial: string;
  pocketStyle: string;
  ventStyle: string;
  canvasStructure: string;
  liningStyle: string;
  monogramText: string;
  monogramThreadColor: string;
  sketches: DesignSketchItem[];
  technicalDirectives: string;
}

// 3. Fabric Selection Version Data
export interface FabricVersionData {
  millName: string;
  millLocation: string;
  primaryFabricCode: string;
  primaryFabricName: string;
  fiberComposition: string;
  yarnCount: string;
  fabricWeightGsm: number;
  weavePattern: string;
  primaryColorName: string;
  pantoneCode: string;
  liningSilkName: string;
  liningComposition: string;
  liningPantone: string;
  weatherCoating: string;
  swatchImageUrl?: string;
}

// 4. Approval Version Data
export interface ApprovalVersionData {
  approvalState:
    | 'PENDING_REVIEW'
    | 'CLIENT_APPROVED'
    | 'ATELIER_CERTIFIED'
    | 'REVISION_REQUESTED'
    | 'REJECTED';
  signoffSignerName?: string;
  signoffSignerRole?: string;
  signoffSignerEmail?: string;
  digitalSignatureHash?: string;
  declarationAccepted?: boolean;
  signedAt?: string;
  clientIpAddress?: string;
  clientDevice?: string;
  approvalNotes?: string;
  conditionsPrecedent?: string[];
}

// Master Unified Version Commit
export interface VersionCommit {
  id: string;
  commitHash: string; // e.g. "7a91bf2"
  fullSha256: string;
  versionTag: string; // e.g. "v1.0.0", "v1.1.0", "v2.0.0"
  versionBadge: VersionTag;
  packageId: string;
  packageName: string;
  orderNumber: string;
  customerName: string;
  timestamp: string;
  author: VersionAuthor;
  commitMessage: string;
  parentCommitId: string | null;
  changedDomains: VersionDomainType[];
  measurements: MeasurementVersionData;
  design: DesignVersionData;
  fabrics: FabricVersionData;
  approval: ApprovalVersionData;
  isCurrentHead: boolean;
  isSnapshotLocked: boolean;
}

// Immutable Approval Snapshot
export interface ApprovalSnapshot {
  snapshotId: string;
  commitId: string;
  versionTag: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  capturedAt: string;
  digitalSignature: string;
  sha256Seal: string;
  legalTermsDeclaration: string;
  signerIp: string;
  signerDevice: string;
  measurementsSummary: string;
  fabricSummary: string;
  designSummary: string;
  certificateNumber: string;
  inspectorOrDesigner: string;
}

// Field-level comparison item
export interface VersionDiffItem {
  field: string;
  label: string;
  domain: VersionDomainType;
  oldValue: any;
  newValue: any;
  changeType: 'modified' | 'added' | 'removed' | 'unchanged';
}

export interface VersionComparisonResult {
  sourceCommit: VersionCommit;
  targetCommit: VersionCommit;
  diffs: VersionDiffItem[];
  diffsByDomain: Record<VersionDomainType, VersionDiffItem[]>;
  totalModifications: number;
}

export interface VCSPackageSummary {
  id: string;
  orderNumber: string;
  packageName: string;
  customerName: string;
  currentVersion: string;
  totalCommitsCount: number;
  lastUpdated: string;
  headCommitId: string;
  approvalState: string;
  isLocked: boolean;
}
