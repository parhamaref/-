/**
 * @file rbac.ts
 * Role-Based Access Control (RBAC) matrix, data isolation rules, and audit logging
 * for the DANIELS platform.
 */

import { User, UserRole } from '../types/daniels.types';

// ==========================================
// 1. Modules & Actions Types
// ==========================================

export type DanielsModule =
  | 'Customers'
  | 'Partners'
  | 'Products'
  | 'Orders'
  | 'Production'
  | 'QC'
  | 'Finance'
  | 'Delivery'
  | 'Wardrobe'
  | 'Designer'
  | 'Studio';

export type DanielsAction =
  | 'view'
  | 'create'
  | 'edit'
  | 'delete'
  | 'manage'
  | 'operational'
  | 'feedback'
  | 'submit';

export interface ResourceContext {
  customerId?: string;
  partnerId?: string;
  ownerId?: string;
  assignedPartnerId?: string;
  associatedCustomerId?: string;
  [key: string]: any;
}

// ==========================================
// 2. Audit Trail
// ==========================================

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  module: DanielsModule;
  action: DanielsAction;
  resourceId?: string;
  status: 'ALLOWED' | 'DENIED';
  reason?: string;
}

const auditLogStore: AuditLogEntry[] = [];

/**
 * Audit First: Records role-based access requests and state changes.
 */
export function logAuditAction(
  user: User | null,
  module: DanielsModule,
  action: DanielsAction,
  status: 'ALLOWED' | 'DENIED',
  resourceId?: string,
  reason?: string
): AuditLogEntry {
  const entry: AuditLogEntry = {
    id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    userId: user?.id || 'anonymous',
    userName: user?.name || 'Unauthenticated User',
    userRole: user?.role || ('Customer' as UserRole),
    module,
    action,
    resourceId,
    status,
    reason,
  };

  auditLogStore.unshift(entry);
  if (auditLogStore.length > 500) {
    auditLogStore.pop(); // Keep manageable buffer in memory
  }

  return entry;
}

export function getAuditLogs(): AuditLogEntry[] {
  return [...auditLogStore];
}

export function clearAuditLogs(): void {
  auditLogStore.length = 0;
}

// ==========================================
// 3. Data Isolation Helper Evaluators
// ==========================================

/**
 * Normalizes resource context passed to permissions check.
 */
function extractContext(resourceContext?: string | ResourceContext): {
  customerId?: string;
  partnerId?: string;
  ownerId?: string;
  resourceId?: string;
} {
  if (!resourceContext) return {};
  if (typeof resourceContext === 'string') {
    return {
      customerId: resourceContext,
      partnerId: resourceContext,
      ownerId: resourceContext,
      resourceId: resourceContext,
    };
  }
  return {
    customerId: resourceContext.customerId || resourceContext.associatedCustomerId,
    partnerId: resourceContext.partnerId || resourceContext.assignedPartnerId,
    ownerId: resourceContext.ownerId || resourceContext.customerId || resourceContext.partnerId,
    resourceId: resourceContext.resourceId || resourceContext.ownerId,
  };
}

/**
 * Checks whether user has permission to access a specific customer record (Data Isolation).
 * Customer A strictly cannot access Customer B's records.
 */
export function canAccessCustomerData(user: User | null, targetCustomerId: string): boolean {
  if (!user) return false;
  if (user.role === 'Super Admin' || user.role === 'Management' || user.role === 'Sales') {
    return true;
  }
  // Internal operational teams have view-only access
  if (['Production', 'QC', 'Finance', 'Logistics'].includes(user.role)) {
    return true;
  }
  if (user.role === 'Customer') {
    // User ID or customer ID match
    return user.id === targetCustomerId || targetCustomerId.includes(user.id);
  }
  if (user.role === 'Partner') {
    // Partners only get limited data when explicitly assigned
    return false;
  }
  return false;
}

/**
 * Checks whether user has permission to access a partner record (Data Isolation).
 * Partner strictly cannot view unassigned orders or peer partner records.
 */
export function canAccessPartnerData(user: User | null, targetPartnerId: string): boolean {
  if (!user) return false;
  if (user.role === 'Super Admin' || user.role === 'Management') return true;
  if (['Sales', 'Production', 'QC', 'Finance', 'Logistics'].includes(user.role)) return true;
  if (user.role === 'Partner') {
    return user.id === targetPartnerId || targetPartnerId.includes(user.id);
  }
  return false;
}

// ==========================================
// 4. Core RBAC Matrix Evaluator
// ==========================================

/**
 * Evaluates the complete Role-Based Access Control matrix & data isolation rules.
 *
 * SPECIFICATION MAPPING:
 * - Super Admin & Management: Full access across Customers, Partners, Products, Orders, Production, QC, Finance, Delivery, Wardrobe.
 * - Sales: Edit (Customers, Products, Orders, Wardrobe); View (Partners, Production, QC, Finance, Delivery).
 * - Production: Full (Production, QC); Operational (Orders); View (Customers, Partners, Products, Finance, Delivery, Wardrobe).
 * - QC: Full (QC, Production); View (Customers, Partners, Products, Orders, Finance, Delivery, Wardrobe).
 * - Finance: Full (Finance, Delivery); Finance View (Orders); View (Customers, Partners, Products, Production, QC, Wardrobe).
 * - Logistics: Full (Delivery); Logistics View (Orders); View (Customers, Partners, Products, Production, QC, Finance, Wardrobe).
 * - Partner: Assigned (Orders, Production, Delivery); Assigned Feedback (QC); Own/Submit (Products); Own/Relevant (Finance); Limited (Customers, Wardrobe); Own (Partners).
 * - Customer: Own (Customers, Products View, Orders, Wardrobe, Delivery, Finance, QC Result, Production Own Status).
 */
export function hasPermission(
  user: User | null,
  module: DanielsModule,
  action: DanielsAction,
  resourceContext?: string | ResourceContext,
  recordAudit: boolean = false
): boolean {
  const audit = (
    u: User | null,
    m: DanielsModule,
    a: DanielsAction,
    status: 'ALLOWED' | 'DENIED',
    resId?: string,
    reason?: string
  ) => {
    if (recordAudit) {
      audit(u, m, a, status, resId, reason);
    }
  };

  if (!user || user.status !== 'Active') {
    audit(user, module, action, 'DENIED', undefined, 'User is unauthenticated or inactive');
    return false;
  }

  const { customerId, partnerId, ownerId, resourceId } = extractContext(resourceContext);
  const role = user.role;

  // ----------------------------------------------------
  // 1. Super Admin & Management: Full Access Across All Modules
  // ----------------------------------------------------
  if (role === 'Super Admin' || role === 'Management') {
    audit(user, module, action, 'ALLOWED', resourceId, `${role} has full administrative privileges`);
    return true;
  }

  // ----------------------------------------------------
  // 2. Sales
  // Edit (Customers, Products, Orders, Wardrobe)
  // View (Partners, Production, QC, Finance, Delivery)
  // ----------------------------------------------------
  if (role === 'Sales') {
    const editModules: DanielsModule[] = ['Customers', 'Products', 'Orders', 'Wardrobe'];
    const viewModules: DanielsModule[] = ['Partners', 'Production', 'QC', 'Finance', 'Delivery'];

    if (editModules.includes(module)) {
      if (['view', 'create', 'edit'].includes(action)) {
        audit(user, module, action, 'ALLOWED', resourceId, 'Sales has edit rights on client/order modules');
        return true;
      }
    }

    if (viewModules.includes(module) && action === 'view') {
      audit(user, module, action, 'ALLOWED', resourceId, 'Sales has view-only rights on operations');
      return true;
    }

    audit(user, module, action, 'DENIED', resourceId, 'Sales cannot perform delete or non-permitted actions');
    return false;
  }

  // ----------------------------------------------------
  // 3. Production
  // Full (Production, QC)
  // Operational (Orders)
  // View (Customers, Partners, Products, Finance, Delivery, Wardrobe)
  // ----------------------------------------------------
  if (role === 'Production') {
    if (module === 'Production' || module === 'QC') {
      audit(user, module, action, 'ALLOWED', resourceId, 'Production team has full control over Production & QC');
      return true;
    }

    if (module === 'Orders') {
      if (action === 'view' || action === 'operational' || action === 'edit') {
        audit(user, module, action, 'ALLOWED', resourceId, 'Production has operational execution rights on Orders');
        return true;
      }
    }

    const viewOnly: DanielsModule[] = ['Customers', 'Partners', 'Products', 'Finance', 'Delivery', 'Wardrobe'];
    if (viewOnly.includes(module) && action === 'view') {
      audit(user, module, action, 'ALLOWED', resourceId, 'Production has view access to supporting reference data');
      return true;
    }

    audit(user, module, action, 'DENIED', resourceId, 'Action not permitted for Production role');
    return false;
  }

  // ----------------------------------------------------
  // 4. QC (Quality Control)
  // Full (QC, Production)
  // View (Customers, Partners, Products, Orders, Finance, Delivery, Wardrobe)
  // ----------------------------------------------------
  if (role === 'QC') {
    if (module === 'QC' || module === 'Production') {
      audit(user, module, action, 'ALLOWED', resourceId, 'QC has full inspection & production evaluation control');
      return true;
    }

    if (action === 'view') {
      audit(user, module, action, 'ALLOWED', resourceId, 'QC has view access across all operational records');
      return true;
    }

    audit(user, module, action, 'DENIED', resourceId, 'QC cannot modify non-QC records');
    return false;
  }

  // ----------------------------------------------------
  // 5. Finance
  // Full (Finance, Delivery)
  // Finance View (Orders)
  // View (Customers, Partners, Products, Production, QC, Wardrobe)
  // ----------------------------------------------------
  if (role === 'Finance') {
    if (module === 'Finance' || module === 'Delivery') {
      audit(user, module, action, 'ALLOWED', resourceId, 'Finance has full control over Finance & Delivery billing');
      return true;
    }

    if (module === 'Orders' && action === 'view') {
      audit(user, module, action, 'ALLOWED', resourceId, 'Finance has financial view access on Orders');
      return true;
    }

    if (action === 'view') {
      audit(user, module, action, 'ALLOWED', resourceId, 'Finance has read-only access for auditing');
      return true;
    }

    audit(user, module, action, 'DENIED', resourceId, 'Finance is restricted to financial transactions');
    return false;
  }

  // ----------------------------------------------------
  // 6. Logistics
  // Full (Delivery)
  // Logistics View (Orders)
  // View (Customers, Partners, Products, Production, QC, Finance, Wardrobe)
  // ----------------------------------------------------
  if (role === 'Logistics') {
    if (module === 'Delivery') {
      audit(user, module, action, 'ALLOWED', resourceId, 'Logistics has full dispatch and courier delivery rights');
      return true;
    }

    if (module === 'Orders' && action === 'view') {
      audit(user, module, action, 'ALLOWED', resourceId, 'Logistics view on orders for fulfillment');
      return true;
    }

    if (action === 'view') {
      audit(user, module, action, 'ALLOWED', resourceId, 'Logistics reference view');
      return true;
    }

    audit(user, module, action, 'DENIED', resourceId, 'Action not permitted for Logistics');
    return false;
  }

  // ----------------------------------------------------
  // 7. Partner
  // Assigned (Orders, Production, Delivery)
  // Assigned Feedback (QC)
  // Own/Submit (Products)
  // Own/Relevant (Finance)
  // Limited (Customers, Wardrobe)
  // Own (Partners)
  // Strict Data Isolation: Cannot view unassigned jobs/orders
  // ----------------------------------------------------
  if (role === 'Partner') {
    const isPartnerAssigned = Boolean(
      partnerId &&
        (partnerId === user.id || partnerId.includes(user.id) || user.id.includes(partnerId))
    );

    // Own Partners Profile
    if (module === 'Partners') {
      if (['view', 'edit'].includes(action)) {
        if (!partnerId || isPartnerAssigned) {
          audit(user, module, action, 'ALLOWED', resourceId, 'Partner accessing own atelier profile');
          return true;
        }
      }
      audit(user, module, action, 'DENIED', resourceId, 'Partner data isolation: Cannot access peer partner profiles');
      return false;
    }

    // Assigned Orders
    if (module === 'Orders') {
      if (['view', 'operational'].includes(action)) {
        if (isPartnerAssigned) {
          audit(user, module, action, 'ALLOWED', resourceId, 'Partner managing assigned order');
          return true;
        }
      }
      audit(user, module, action, 'DENIED', resourceId, 'Partner data isolation: Order is not assigned to this atelier');
      return false;
    }

    // Assigned Production
    if (module === 'Production') {
      if (['view', 'edit', 'operational'].includes(action)) {
        if (isPartnerAssigned) {
          audit(user, module, action, 'ALLOWED', resourceId, 'Partner managing assigned production batch');
          return true;
        }
      }
      audit(user, module, action, 'DENIED', resourceId, 'Partner data isolation: Production job is not assigned to this atelier');
      return false;
    }

    // Assigned Delivery
    if (module === 'Delivery') {
      if (action === 'view' && isPartnerAssigned) {
        audit(user, module, action, 'ALLOWED', resourceId, 'Partner viewing delivery dispatch for assigned job');
        return true;
      }
      audit(user, module, action, 'DENIED', resourceId, 'Partner delivery restricted to assigned jobs');
      return false;
    }

    // Assigned Feedback (QC)
    if (module === 'QC') {
      if (action === 'view' || action === 'feedback') {
        if (isPartnerAssigned) {
          audit(user, module, action, 'ALLOWED', resourceId, 'Partner submitting corrective feedback on assigned QC record');
          return true;
        }
      }
      audit(user, module, action, 'DENIED', resourceId, 'Partner QC restricted to assigned garments');
      return false;
    }

    // Own/Submit Products
    if (module === 'Products') {
      if (action === 'view' || action === 'submit') {
        audit(user, module, action, 'ALLOWED', resourceId, 'Partner viewing catalog or submitting customisation prototype');
        return true;
      }
      audit(user, module, action, 'DENIED', resourceId, 'Partner cannot edit official collection catalog');
      return false;
    }

    // Own/Relevant Finance
    if (module === 'Finance') {
      if (action === 'view' && isPartnerAssigned) {
        audit(user, module, action, 'ALLOWED', resourceId, 'Partner viewing payout invoice for completed commission');
        return true;
      }
      audit(user, module, action, 'DENIED', resourceId, 'Partner finance restricted to verified payouts');
      return false;
    }

    // Limited Customers & Wardrobe (only for assigned alterations/specifications)
    if ((module === 'Customers' || module === 'Wardrobe') && action === 'view') {
      if (isPartnerAssigned) {
        audit(user, module, action, 'ALLOWED', resourceId, 'Partner viewing anatomical fit sheet for assigned garment');
        return true;
      }
      audit(user, module, action, 'DENIED', resourceId, 'Partner data isolation: Unassigned customer records are confidential');
      return false;
    }

    audit(user, module, action, 'DENIED', resourceId, 'Action not permitted for Partner');
    return false;
  }

  // ----------------------------------------------------
  // 7B. Designer (Independent Couture Fashion Designers)
  // Manage own Atelier Products, Customizations, Measurements Blueprints
  // Manage assigned / own Atelier Orders, Production stages, Video transparency
  // View own Customers measurements, Wardrobe specs, Reviews, Analytics, Earnings
  // ----------------------------------------------------
  if (role === 'Designer') {
    const isDesignerAssigned = Boolean(
      partnerId &&
        (partnerId === user.id || partnerId.includes(user.id) || user.id.includes(partnerId))
    );

    // Designer Studio & Atelier profile
    if (module === 'Designer' || module === 'Studio' || module === 'Partners') {
      if (['view', 'edit', 'manage'].includes(action)) {
        audit(user, module, action, 'ALLOWED', resourceId, 'Designer managing own atelier profile');
        return true;
      }
    }

    // Products & Customization
    if (module === 'Products') {
      if (['view', 'create', 'edit', 'manage', 'submit'].includes(action)) {
        audit(user, module, action, 'ALLOWED', resourceId, 'Designer managing brand collection products');
        return true;
      }
    }

    // Orders & Production
    if (module === 'Orders' || module === 'Production') {
      if (['view', 'edit', 'operational', 'manage'].includes(action)) {
        audit(user, module, action, 'ALLOWED', resourceId, 'Designer managing atelier orders & stages');
        return true;
      }
    }

    // Quality Control Feedback & Reviews
    if (module === 'QC') {
      if (['view', 'feedback', 'operational'].includes(action)) {
        audit(user, module, action, 'ALLOWED', resourceId, 'Designer viewing garment QC certifications');
        return true;
      }
    }

    // Finance & Earnings
    if (module === 'Finance') {
      if (['view', 'operational'].includes(action)) {
        audit(user, module, action, 'ALLOWED', resourceId, 'Designer viewing sales commissions & payout ledger');
        return true;
      }
    }

    // Delivery & Tracking
    if (module === 'Delivery') {
      if (['view', 'operational'].includes(action)) {
        audit(user, module, action, 'ALLOWED', resourceId, 'Designer managing dispatch logistics');
        return true;
      }
    }

    // Customer Measurements for orders
    if (module === 'Customers' || module === 'Wardrobe') {
      if (action === 'view') {
        audit(user, module, action, 'ALLOWED', resourceId, 'Designer viewing anatomical fit specs for made-to-measure');
        return true;
      }
    }

    audit(user, module, action, 'DENIED', resourceId, 'Action not permitted for Designer');
    return false;
  }

  // ----------------------------------------------------
  // 8. Customer
  // Own (Customers, Orders, Wardrobe, Delivery, Finance, QC Result, Production Own Status)
  // Products: View
  // Strict Data Isolation: Customer A strictly cannot access Customer B's records!
  // ----------------------------------------------------
  if (role === 'Customer') {
    // Products Catalog View is public/open to customer
    if (module === 'Products' && action === 'view') {
      audit(user, module, action, 'ALLOWED', resourceId, 'Customer viewing official luxury catalog');
      return true;
    }

    // Verify ownership for all personal records
    const isOwner = Boolean(
      (customerId && (customerId === user.id || customerId.includes(user.id) || user.id.includes(customerId))) ||
      (ownerId && (ownerId === user.id || ownerId.includes(user.id) || user.id.includes(ownerId)))
    );

    // Profile & Measurement Access
    if (module === 'Customers') {
      if (['view', 'edit'].includes(action)) {
        if (isOwner) {
          audit(user, module, action, 'ALLOWED', resourceId, 'Customer managing personal bespoke profile');
          return true;
        }
      }
      audit(user, module, action, 'DENIED', resourceId, 'Customer data isolation: Cannot query or access another client’s profile');
      return false;
    }

    // Orders, Wardrobe, Delivery, Finance, QC, Production
    const ownPersonalModules: DanielsModule[] = [
      'Orders',
      'Wardrobe',
      'Delivery',
      'Finance',
      'QC',
      'Production',
    ];

    if (ownPersonalModules.includes(module)) {
      if (action === 'view') {
        if (isOwner) {
          audit(user, module, action, 'ALLOWED', resourceId, `Customer viewing personal ${module} record`);
          return true;
        }
      }
      audit(
        user,
        module,
        action,
        'DENIED',
        resourceId,
        `Customer data isolation: Access to ${module} denied. Record does not belong to this client.`
      );
      return false;
    }

    audit(user, module, action, 'DENIED', resourceId, 'Customer restricted to personal client portal');
    return false;
  }

  audit(user, module, action, 'DENIED', resourceId, `Role '${role}' is not recognized in RBAC matrix`);
  return false;
}
