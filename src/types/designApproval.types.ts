/**
 * @file designApproval.types.ts
 * Enterprise Type Definitions for Daniel’s Maison Design Approval Workflow.
 *
 * Workflow:
 * Draft → Submitted → Revision Requested → Updated → Approved → Production
 *
 * Customer Review Elements (Pre-Production):
 * 1. Design Sketches (CAD technical & artist illustrations, multi-view)
 * 2. Fabric Selection (Luxury mill, composition, weight, weave, tactile characteristics)
 * 3. Color Selection (Primary cloth, Pantone, lining silk, thread contrast)
 * 4. Measurements (Full anatomical bespoke profile with tolerances and posture compensation)
 * 5. Custom Requests (Monogram, lapel, canvas, buttons, vents, pockets)
 *
 * Requirements:
 * - Version History (v1.0, v1.1, v2.0 with delta comparisons)
 * - Approval Logs (Immutable sign-off records with digital signature & metadata)
 * - Revision Tracking (Threaded items per review element with designer response)
 * - Audit Trail (Chronological immutable timeline of all human & system transitions)
 * - Timestamp Tracking (Turnaround SLAs and precision event tracking)
 */

export type DesignApprovalWorkflowStage =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'REVISION_REQUESTED'
  | 'UPDATED'
  | 'APPROVED'
  | 'PRODUCTION'
  | 'REJECTED';

export type CustomerReviewComponent =
  | 'SKETCHES'
  | 'FABRIC'
  | 'COLOR'
  | 'MEASUREMENTS'
  | 'CUSTOM_REQUESTS';

export type SketchViewAngle =
  | 'FRONT'
  | 'BACK'
  | 'LAPEL_DETAIL'
  | 'INTERIOR_LINING'
  | 'FULL_LENGTH'
  | 'FABRIC_SWATCH';

export interface SketchAnnotatedPoint {
  id: string;
  xPercent: number; // 0-100% position on sketch
  yPercent: number; // 0-100% position on sketch
  label: string;
  technicalNote: string;
}

export interface DesignSketch {
  id: string;
  viewAngle: SketchViewAngle;
  title: string;
  imageUrl: string;
  caption: string;
  cadSpecification: string;
  annotatedPoints: SketchAnnotatedPoint[];
}

export interface FabricSpecification {
  millName: string; // e.g. "Loro Piana", "Dormeuil", "Scabal", "Holland & Sherry"
  clothCode: string; // e.g. "LP-TASMANIAN-9042"
  clothName: string; // e.g. "Super 160s Tasmanian Royal Worsted"
  composition: string; // e.g. "100% Virgin Merino Wool, 14.5 Micron"
  weightGsm: number; // e.g. 260 gsm
  weightOz: number; // e.g. 9 oz
  weaveType: string; // e.g. "Fine 2x2 Twill with natural stretch"
  originCountry: string; // e.g. "Biella, Italy"
  swatchImageUrl: string;
  tactileCharacteristics: string; // e.g. "Cashmere-like butter hand with crisp drape recovery"
  drapeClass: 'Soft Drape' | 'Structured Tailored' | 'Architectural Crisp';
  breathabilityIndex: 'High Summer' | 'Four-Season All-Year' | 'Winter Heavy';
}

export interface ColorSpecification {
  primaryColorName: string; // e.g. "Midnight Obsidian Blue"
  primaryColorHex: string; // e.g. "#111827"
  pantoneReference: string; // e.g. "PANTONE 19-4015 TCX"
  liningColorName: string; // e.g. "Imperial Bordeaux Jacquard"
  liningColorHex: string; // e.g. "#581C87"
  liningSilkPattern: string; // e.g. "Monogrammed Micro-Damask"
  buttonholeThreadColorName: string; // e.g. "Gimp Silk Champagne"
  buttonholeThreadColorHex: string; // e.g. "#E2D3B3"
  contrastDetails: string; // e.g. "Undercollar matching bordeaux melton cloth"
}

export interface AnatomicalMeasurementLineItem {
  key: string;
  label: string;
  value: number;
  unit: 'cm' | 'inch';
  tolerance: string; // e.g. "+/- 0.5 cm"
  postureCompensationNotes?: string; // e.g. "Lowered 0.7cm for right blade drop"
  isCritical: boolean;
}

export interface MeasurementReviewSpec {
  profileId: string;
  profileName: string;
  unit: 'cm' | 'inch';
  verifiedAt: string;
  verifiedByTailor: string;
  items: AnatomicalMeasurementLineItem[];
  customerHeightCm: number;
  customerWeightKg: number;
  stancePosture: string; // e.g. "Erect Stance, Slight Right Shoulder Drop, Full Chest Prominence"
  fitPreference: 'Traditional English Drape' | 'Sleek Savile Row Cut' | 'Neapolitan Soft Tailoring';
}

export interface CustomRequestSpec {
  monogramText: string;
  monogramFont: string;
  monogramThreadColor: string;
  monogramPlacement: string; // e.g. "Inside Right Breast Pocket Facet"
  lapelStyle: string; // e.g. "10.5cm Milanese Hand-Rolled Peak Lapel"
  buttonMaterial: string; // e.g. "Hand-Carved Dark Horn with Maison Crest"
  pocketConfiguration: string; // e.g. "Slanted Double-Besom with Ticket Pocket"
  ventsConfiguration: string; // e.g. "Dual 25cm Deep Side Vents"
  canvasConstruction: string; // e.g. "Full Floating Horsehair Canvas with Pad-Stitched Chest Piece"
  interiorPockets: string; // e.g. "Twin Passport Pockets, Cigar Sheath, Fountain Pen Slot"
  additionalTailorDirectives: string;
}

export interface DesignPackageVersion {
  versionNumber: string; // e.g. "1.0", "1.1", "2.0"
  createdAt: string;
  createdBy: string;
  creatorRole: string; // e.g. "Lead Designer", "Artisan Patternmaker"
  changeSummary: string;
  changedComponents: CustomerReviewComponent[];
  sketches: DesignSketch[];
  fabric: FabricSpecification;
  color: ColorSpecification;
  measurements: MeasurementReviewSpec;
  customRequests: CustomRequestSpec;
}

export interface DesignRevisionItem {
  id: string;
  component: CustomerReviewComponent;
  title: string;
  clientComment: string;
  requestedChanges: string;
  status: 'PENDING' | 'ADDRESSED' | 'DEFERRED' | 'DECLINED';
  designerResponse?: string;
  createdAt: string;
  resolvedAt?: string;
  resolvedInVersion?: string;
}

export interface DesignApprovalLog {
  id: string;
  packageId: string;
  action: 'APPROVED' | 'REJECTED' | 'REVISION_REQUESTED' | 'SUBMITTED' | 'UPDATED' | 'PRODUCTION_RELEASED';
  versionApproved: string;
  actorName: string;
  actorEmail: string;
  actorRole: 'CUSTOMER' | 'LEAD_DESIGNER' | 'MASTER_TAILOR' | 'SYSTEM';
  digitalSignature: string;
  declarationAccepted: boolean;
  timestamp: string;
  notes?: string;
  clientIp?: string;
  deviceMetadata?: string;
}

export interface DesignAuditTrailEvent {
  id: string;
  packageId: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  eventCode:
    | 'DRAFT_CREATED'
    | 'SUBMITTED_TO_CUSTOMER'
    | 'SPEC_VIEWED_BY_CUSTOMER'
    | 'REVISION_REQUESTED'
    | 'VERSION_UPDATED'
    | 'APPROVED_BY_CUSTOMER'
    | 'REJECTED_BY_CUSTOMER'
    | 'RELEASED_TO_PRODUCTION';
  description: string;
  previousStage?: DesignApprovalWorkflowStage;
  newStage?: DesignApprovalWorkflowStage;
  version: string;
  metadata?: Record<string, any>;
}

export interface DesignApprovalPackage {
  id: string; // e.g. "DAP-2026-9480"
  orderId: string;
  orderNumber: string; // e.g. "DM-2026-9480"
  customerId: string;
  customerName: string;
  customerEmail: string;
  garmentName: string; // e.g. "Savile Row Sovereign Bespoke 3-Piece Suit"
  garmentCategory: 'Suits' | 'Shirts' | 'Coats' | 'Dresses' | 'Accessories';
  primaryThumbnail: string;
  priceGbp: number;
  currentStage: DesignApprovalWorkflowStage;
  currentVersion: string; // e.g. "1.1"
  slaDeadline: string; // ISO deadline for client signoff
  turnaroundHoursRemaining?: number;
  leadDesigner: string;
  masterTailor: string;
  versions: DesignPackageVersion[];
  currentSpec: DesignPackageVersion;
  revisions: DesignRevisionItem[];
  approvalLogs: DesignApprovalLog[];
  auditTrail: DesignAuditTrailEvent[];
  createdAt: string;
  updatedAt: string;
}

export interface SubmitRevisionPayload {
  packageId: string;
  customerName: string;
  items: Array<{
    component: CustomerReviewComponent;
    title: string;
    clientComment: string;
    requestedChanges: string;
  }>;
  overallNotes?: string;
}

export interface ApproveDesignPayload {
  packageId: string;
  customerName: string;
  customerEmail: string;
  digitalSignature: string;
  declarationAccepted: boolean;
  version: string;
  notes?: string;
}

export interface RejectDesignPayload {
  packageId: string;
  customerName: string;
  customerEmail: string;
  rejectionReason: string;
  actionRequested: 'REFUND_DEPOSIT' | 'START_OVER_NEW_CONCEPT' | 'SPEAK_WITH_DIRECTOR';
}

export interface UpdateDesignVersionPayload {
  packageId: string;
  designerName: string;
  changeSummary: string;
  changedComponents: CustomerReviewComponent[];
  updatedSpec: Partial<DesignPackageVersion>;
  addressedRevisionIds?: string[];
}
