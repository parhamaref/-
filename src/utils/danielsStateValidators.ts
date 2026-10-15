/**
 * @file danielsStateValidators.ts
 * Pure validation utility functions and state machine rules for the DANIELS platform.
 */

import {
  OrderStatus,
  OrderApprovalStatus,
  ProductionStage,
  PaymentStatus,
  DeliveryStatus,
  MeasurementProfile,
  QCResult,
} from '../types/daniels.types';

// ==========================================
// 1. Order State Machine
// ==========================================

export interface OrderTransitionContext {
  approvalStatus?: OrderApprovalStatus;
  partnerAssigned?: boolean;
  paymentStatus?: PaymentStatus;
  qcResult?: QCResult;
  hasTrackingNumber?: boolean;
  deliveryConfirmed?: boolean;
  previousStateBeforeHold?: OrderStatus;
  userRole?: string;
  cancelReason?: string;
}

export interface TransitionResult {
  allowed: boolean;
  reason?: string;
}

/**
 * Base allowed transitions map for Order status
 */
const ORDER_TRANSITIONS_MAP: Record<OrderStatus, OrderStatus[]> = {
  'Draft': ['Awaiting Approval', 'Cancelled'],
  'Awaiting Approval': ['Confirmed', 'Draft', 'Cancelled', 'On Hold'],
  'Confirmed': ['In Production', 'Cancelled', 'On Hold'],
  'In Production': ['QC', 'Cancelled', 'On Hold'],
  'QC': ['Ready', 'Rework Required', 'On Hold'],
  'Rework Required': ['In Production', 'Cancelled', 'On Hold'],
  'Ready': ['Dispatched', 'Cancelled', 'On Hold'],
  'Dispatched': ['Delivered', 'On Hold'],
  'Delivered': ['Closed'],
  'Closed': [],
  'Cancelled': [],
  'On Hold': [
    'Draft',
    'Awaiting Approval',
    'Confirmed',
    'In Production',
    'QC',
    'Rework Required',
    'Ready',
    'Dispatched',
    'Cancelled'
  ],
};

/**
 * Returns allowed next order statuses from the current status.
 */
export function getValidNextOrderStatuses(current: OrderStatus): OrderStatus[] {
  return ORDER_TRANSITIONS_MAP[current] || [];
}

/**
 * Pure validator for Order State Machine transitions.
 * Draft -> Awaiting Approval -> Confirmed -> In Production -> QC -> Ready -> Dispatched -> Delivered -> Closed
 * Exceptions: Cancelled | On Hold | Rework Required
 */
export function canTransitionOrder(
  current: OrderStatus,
  next: OrderStatus,
  context?: OrderTransitionContext
): TransitionResult {
  if (current === next) {
    return { allowed: false, reason: `Order is already in state '${current}'.` };
  }

  const allowedNext = ORDER_TRANSITIONS_MAP[current] || [];
  if (!allowedNext.includes(next)) {
    return {
      allowed: false,
      reason: `Illegal order transition from '${current}' to '${next}'. Allowed targets: [${allowedNext.join(', ')}].`,
    };
  }

  // Guard: Awaiting Approval -> Confirmed requires explicit Approval
  if (current === 'Awaiting Approval' && next === 'Confirmed') {
    if (context?.approvalStatus && context.approvalStatus !== 'Approved') {
      return {
        allowed: false,
        reason: `Cannot confirm order: approval status is '${context.approvalStatus}', must be 'Approved'.`,
      };
    }
  }

  // Guard: Confirmed -> In Production requires Partner assignment
  if (current === 'Confirmed' && next === 'In Production') {
    if (context && context.partnerAssigned === false) {
      return {
        allowed: false,
        reason: 'Cannot start production: Partner atelier must be assigned first.',
      };
    }
  }

  // Guard: QC -> Ready requires QC Pass
  if (current === 'QC' && next === 'Ready') {
    if (context?.qcResult && context.qcResult !== 'Pass') {
      return {
        allowed: false,
        reason: `Cannot mark order as Ready: QC inspection result was '${context.qcResult}', expected 'Pass'.`,
      };
    }
  }

  // Guard: QC -> Rework Required requires QC Fail
  if (current === 'QC' && next === 'Rework Required') {
    if (context?.qcResult && context.qcResult === 'Pass') {
      return {
        allowed: false,
        reason: 'Cannot mark order as Rework Required: QC inspection result was marked as Pass.',
      };
    }
  }

  // Guard: Ready -> Dispatched requires delivery tracking
  if (current === 'Ready' && next === 'Dispatched') {
    if (context && context.hasTrackingNumber === false) {
      return {
        allowed: false,
        reason: 'Cannot dispatch order without an active courier tracking number or dispatch docket.',
      };
    }
  }

  // Guard: Dispatched -> Delivered requires delivery confirmation
  if (current === 'Dispatched' && next === 'Delivered') {
    if (context && context.deliveryConfirmed === false) {
      return {
        allowed: false,
        reason: 'Cannot mark as Delivered: Courier signature or client receipt confirmation missing.',
      };
    }
  }

  // Guard: On Hold resumption
  if (current === 'On Hold' && context?.previousStateBeforeHold) {
    if (next !== context.previousStateBeforeHold && next !== 'Cancelled') {
      return {
        allowed: false,
        reason: `Resuming from 'On Hold' should revert to previous state '${context.previousStateBeforeHold}' or transition to 'Cancelled'.`,
      };
    }
  }

  return { allowed: true };
}

// ==========================================
// 2. Production Stage State Machine
// ==========================================

export interface ProductionTransitionConditions {
  progressPercentage?: number;
  qcResult?: QCResult;
  partnerVerified?: boolean;
  materialAllocated?: boolean;
  reworkNotesPresent?: boolean;
}

const PRODUCTION_TRANSITIONS_MAP: Record<ProductionStage, ProductionStage[]> = {
  'Not Started': ['Assigned'],
  'Assigned': ['Cutting', 'Not Started'],
  'Cutting': ['Making', 'Assigned'],
  'Making': ['Finishing', 'Cutting'],
  'Finishing': ['QC', 'Making'],
  'QC': ['Complete', 'Rework'],
  'Rework': ['Finishing', 'Cutting', 'QC'],
  'Complete': [],
};

/**
 * Returns allowed next production stages from the current stage.
 */
export function getValidNextProductionStages(current: ProductionStage): ProductionStage[] {
  return PRODUCTION_TRANSITIONS_MAP[current] || [];
}

/**
 * Pure validator for Production Stages:
 * Not Started -> Assigned -> Cutting -> Making -> Finishing -> QC -> Rework -> Complete
 */
export function canTransitionProduction(
  current: ProductionStage,
  next: ProductionStage,
  conditions?: ProductionTransitionConditions
): TransitionResult {
  if (current === next) {
    return { allowed: false, reason: `Production is already in stage '${current}'.` };
  }

  const allowedNext = PRODUCTION_TRANSITIONS_MAP[current] || [];
  if (!allowedNext.includes(next)) {
    return {
      allowed: false,
      reason: `Illegal production transition from '${current}' to '${next}'. Allowed targets: [${allowedNext.join(', ')}].`,
    };
  }

  // Guard: Not Started -> Assigned requires partner capability verification
  if (current === 'Not Started' && next === 'Assigned') {
    if (conditions && conditions.partnerVerified === false) {
      return {
        allowed: false,
        reason: 'Cannot assign production job to an unverified partner atelier.',
      };
    }
  }

  // Guard: Assigned -> Cutting requires materials allocated
  if (current === 'Assigned' && next === 'Cutting') {
    if (conditions && conditions.materialAllocated === false) {
      return {
        allowed: false,
        reason: 'Cannot start cutting: Fabrics and raw materials have not been confirmed in inventory.',
      };
    }
  }

  // Guard: QC -> Complete requires QC Pass
  if (current === 'QC' && next === 'Complete') {
    if (conditions?.qcResult && conditions.qcResult !== 'Pass') {
      return {
        allowed: false,
        reason: `Cannot complete production: Quality inspection failed with '${conditions.qcResult}'.`,
      };
    }
    if (conditions?.progressPercentage !== undefined && conditions.progressPercentage < 100) {
      return {
        allowed: false,
        reason: `Cannot complete production: Progress is at ${conditions.progressPercentage}%, must be 100%.`,
      };
    }
  }

  // Guard: QC -> Rework requires defect description
  if (current === 'QC' && next === 'Rework') {
    if (conditions?.qcResult && conditions.qcResult === 'Pass') {
      return {
        allowed: false,
        reason: 'Cannot trigger rework when QC inspection is passed.',
      };
    }
    if (conditions && conditions.reworkNotesPresent === false) {
      return {
        allowed: false,
        reason: 'Cannot route to rework without explicit corrective action and defect notes.',
      };
    }
  }

  return { allowed: true };
}

// ==========================================
// 3. Payment Lifecycle
// ==========================================

export interface PaymentTransitionContext {
  totalAmount?: number;
  paidAmount?: number;
  isPastDueDate?: boolean;
  refundApproved?: boolean;
}

const PAYMENT_TRANSITIONS_MAP: Record<PaymentStatus, PaymentStatus[]> = {
  'Pending': ['Part Paid', 'Paid', 'Overdue'],
  'Part Paid': ['Paid', 'Overdue', 'Refunded'],
  'Paid': ['Refunded'],
  'Overdue': ['Part Paid', 'Paid'],
  'Refunded': [],
};

/**
 * Returns allowed next payment statuses.
 */
export function getValidNextPaymentStatuses(current: PaymentStatus): PaymentStatus[] {
  return PAYMENT_TRANSITIONS_MAP[current] || [];
}

/**
 * Pure validator for Payment Lifecycle:
 * Pending -> Part Paid -> Paid | Overdue | Refunded
 */
export function canTransitionPayment(
  current: PaymentStatus,
  next: PaymentStatus,
  context?: PaymentTransitionContext
): TransitionResult {
  if (current === next) {
    return { allowed: false, reason: `Payment is already in status '${current}'.` };
  }

  const allowedNext = PAYMENT_TRANSITIONS_MAP[current] || [];
  if (!allowedNext.includes(next)) {
    return {
      allowed: false,
      reason: `Illegal payment transition from '${current}' to '${next}'. Allowed targets: [${allowedNext.join(', ')}].`,
    };
  }

  // Guard: Pending / Part Paid -> Overdue requires past due date
  if (next === 'Overdue') {
    if (context && context.isPastDueDate === false) {
      return {
        allowed: false,
        reason: 'Payment invoice is not yet past due date.',
      };
    }
  }

  // Guard: Transition to Paid requires full amount
  if (next === 'Paid' && context?.totalAmount && context?.paidAmount !== undefined) {
    if (context.paidAmount < context.totalAmount) {
      return {
        allowed: false,
        reason: `Paid amount (${context.paidAmount}) is less than total invoice amount (${context.totalAmount}). Use 'Part Paid' instead.`,
      };
    }
  }

  // Guard: Transition to Refunded requires refund authorization
  if (next === 'Refunded' && context?.refundApproved === false) {
    return {
      allowed: false,
      reason: 'Refund has not been authorized by Finance.',
    };
  }

  return { allowed: true };
}

// ==========================================
// 4. Delivery Lifecycle
// ==========================================

export interface DeliveryTransitionContext {
  hasTrackingNumber?: boolean;
  courierAccepted?: boolean;
  recipientSigned?: boolean;
  failureReason?: string;
}

const DELIVERY_TRANSITIONS_MAP: Record<DeliveryStatus, DeliveryStatus[]> = {
  'Pending': ['Dispatched'],
  'Dispatched': ['In Transit'],
  'In Transit': ['Delivered', 'Failed'],
  'Failed': ['In Transit', 'Dispatched', 'Pending'],
  'Delivered': [],
};

/**
 * Returns allowed next delivery statuses.
 */
export function getValidNextDeliveryStatuses(current: DeliveryStatus): DeliveryStatus[] {
  return DELIVERY_TRANSITIONS_MAP[current] || [];
}

/**
 * Pure validator for Delivery Lifecycle:
 * Pending -> Dispatched -> In Transit -> Delivered | Failed
 */
export function canTransitionDelivery(
  current: DeliveryStatus,
  next: DeliveryStatus,
  context?: DeliveryTransitionContext
): TransitionResult {
  if (current === next) {
    return { allowed: false, reason: `Delivery is already in status '${current}'.` };
  }

  const allowedNext = DELIVERY_TRANSITIONS_MAP[current] || [];
  if (!allowedNext.includes(next)) {
    return {
      allowed: false,
      reason: `Illegal delivery transition from '${current}' to '${next}'. Allowed targets: [${allowedNext.join(', ')}].`,
    };
  }

  // Guard: Pending -> Dispatched requires tracking number
  if (current === 'Pending' && next === 'Dispatched') {
    if (context && context.hasTrackingNumber === false) {
      return {
        allowed: false,
        reason: 'Cannot mark as dispatched without an assigned courier tracking code.',
      };
    }
  }

  // Guard: In Transit -> Delivered requires signature / recipient acknowledgement
  if (current === 'In Transit' && next === 'Delivered') {
    if (context && context.recipientSigned === false) {
      return {
        allowed: false,
        reason: 'Delivery cannot be marked complete without recipient signature or concierge handover proof.',
      };
    }
  }

  // Guard: In Transit -> Failed requires failure reason
  if (current === 'In Transit' && next === 'Failed') {
    if (context && !context.failureReason) {
      return {
        allowed: false,
        reason: 'A reason must be provided when marking delivery as failed (e.g. Recipient Unavailable).',
      };
    }
  }

  return { allowed: true };
}

// ==========================================
// 5. Measurement Profile Versioning Validator
// ==========================================

export interface MeasurementVersioningResult {
  valid: boolean;
  nextVersion: number;
  reason?: string;
}

/**
 * Validates measurement profile updates adhering to strict versioning rules:
 * - Prior versions must remain immutable
 * - Version number must strictly increment
 * - Validates essential anatomical measurements
 */
export function validateMeasurementProfileVersioning(
  previous: MeasurementProfile | null,
  next: Omit<MeasurementProfile, 'id' | 'version' | 'approvedAt'>
): MeasurementVersioningResult {
  if (!next.customerId) {
    return { valid: false, nextVersion: 1, reason: 'Customer ID is required.' };
  }

  if (!next.measurements || !next.measurements.unit) {
    return { valid: false, nextVersion: previous ? previous.version + 1 : 1, reason: 'Measurements must specify a valid unit (cm or inch).' };
  }

  // Check that at least some core measurements exist
  const coreMetrics = ['chest', 'waist', 'hips', 'shoulderWidth', 'sleeveLength'];
  const hasAtLeastOne = coreMetrics.some(
    (metric) => typeof next.measurements[metric] === 'number' && next.measurements[metric] > 0
  );

  if (!hasAtLeastOne) {
    return {
      valid: false,
      nextVersion: previous ? previous.version + 1 : 1,
      reason: `Profile must contain at least one valid core measurement (${coreMetrics.join(', ')}).`,
    };
  }

  const nextVersion = previous ? previous.version + 1 : 1;

  return {
    valid: true,
    nextVersion,
  };
}
