/**
 * @file designApprovalApi.ts
 * API Client & REST Service for Daniel’s Maison Design Approval Workflow.
 * Implements endpoints for:
 * - Fetching pre-production design approval packages
 * - Submitting draft packages to customers (Draft → Submitted)
 * - Requesting design revisions with component-specific comments (Submitted/Updated → Revision Requested)
 * - Updating design packages with new versions (Revision Requested → Updated)
 * - Formal customer approval with digital signature & audit log (Submitted/Updated → Approved)
 * - Formal rejection (Submitted/Updated → Rejected)
 * - Handover to atelier cutting & assembly (Approved → Production)
 *
 * Persists changes in LocalStorage for seamless dev demonstration.
 */

import {
  DesignApprovalPackage,
  DesignApprovalWorkflowStage,
  SubmitRevisionPayload,
  ApproveDesignPayload,
  RejectDesignPayload,
  UpdateDesignVersionPayload,
  DesignApprovalLog,
  DesignAuditTrailEvent,
  DesignRevisionItem,
  DesignPackageVersion,
} from '../types/designApproval.types';
import { INITIAL_DESIGN_APPROVAL_PACKAGES } from '../mock/designApprovalMockData';

const STORAGE_KEY = 'maison_daniels_design_approval_packages_v1';

function getStoredPackages(): DesignApprovalPackage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: DesignApprovalPackage[] = JSON.parse(raw);
      // Link currentSpec
      parsed.forEach((p) => {
        p.currentSpec = p.versions[p.versions.length - 1];
      });
      return parsed;
    }
  } catch (err) {
    console.error('Failed to parse design approval packages from storage', err);
  }
  savePackages(INITIAL_DESIGN_APPROVAL_PACKAGES);
  return INITIAL_DESIGN_APPROVAL_PACKAGES;
}

function savePackages(packages: DesignApprovalPackage[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(packages));
  } catch (err) {
    console.error('Failed to write design approval packages to storage', err);
  }
}

export const designApprovalApi = {
  /**
   * Fetch all design approval packages with optional filtering
   */
  async getPackages(filters?: {
    customerId?: string;
    stage?: DesignApprovalWorkflowStage | 'ALL';
    search?: string;
  }): Promise<{ packages: DesignApprovalPackage[]; totalCount: number }> {
    await new Promise((r) => setTimeout(r, 120)); // Realistic network latency
    let list = getStoredPackages();

    if (filters?.customerId) {
      list = list.filter((p) => p.customerId === filters.customerId);
    }

    if (filters?.stage && filters.stage !== 'ALL') {
      list = list.filter((p) => p.currentStage === filters.stage);
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.garmentName.toLowerCase().includes(q) ||
          p.orderNumber.toLowerCase().includes(q) ||
          p.customerName.toLowerCase().includes(q) ||
          p.leadDesigner.toLowerCase().includes(q)
      );
    }

    // Sort by recent updated first
    list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    return { packages: list, totalCount: list.length };
  },

  /**
   * Fetch a single package by ID
   */
  async getPackageById(packageId: string): Promise<DesignApprovalPackage> {
    await new Promise((r) => setTimeout(r, 80));
    const list = getStoredPackages();
    const found = list.find((p) => p.id === packageId);
    if (!found) throw new Error(`Design approval package ${packageId} not found`);
    return found;
  },

  /**
   * Atelier Action: Submit Draft to Customer (Draft → Submitted)
   */
  async submitDraftToCustomer(packageId: string, designerName: string): Promise<DesignApprovalPackage> {
    await new Promise((r) => setTimeout(r, 180));
    const list = getStoredPackages();
    const pkg = list.find((p) => p.id === packageId);
    if (!pkg) throw new Error(`Package ${packageId} not found`);

    const prevStage = pkg.currentStage;
    pkg.currentStage = 'SUBMITTED';
    pkg.updatedAt = new Date().toISOString();
    pkg.slaDeadline = new Date(Date.now() + 48 * 3600 * 1000).toISOString();

    const auditEvent: DesignAuditTrailEvent = {
      id: `aud_${Date.now()}`,
      packageId: pkg.id,
      timestamp: new Date().toISOString(),
      actor: designerName,
      actorRole: 'LEAD_DESIGNER',
      eventCode: 'SUBMITTED_TO_CUSTOMER',
      description: `Design specification v${pkg.currentVersion} submitted to ${pkg.customerName} for formal client review.`,
      previousStage: prevStage,
      newStage: 'SUBMITTED',
      version: pkg.currentVersion,
    };

    pkg.auditTrail.unshift(auditEvent);
    savePackages(list);
    return pkg;
  },

  /**
   * Customer Action: Request Revision (Submitted / Updated → Revision Requested)
   */
  async submitRevisionRequest(payload: SubmitRevisionPayload): Promise<DesignApprovalPackage> {
    await new Promise((r) => setTimeout(r, 220));
    const list = getStoredPackages();
    const pkg = list.find((p) => p.id === payload.packageId);
    if (!pkg) throw new Error(`Package ${payload.packageId} not found`);

    const prevStage = pkg.currentStage;
    pkg.currentStage = 'REVISION_REQUESTED';
    pkg.updatedAt = new Date().toISOString();

    const newRevisionItems: DesignRevisionItem[] = payload.items.map((it, idx) => ({
      id: `rev_${Date.now()}_${idx}`,
      component: it.component,
      title: it.title,
      clientComment: it.clientComment,
      requestedChanges: it.requestedChanges,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    }));

    pkg.revisions = [...newRevisionItems, ...pkg.revisions];

    const approvalLog: DesignApprovalLog = {
      id: `log_rev_${Date.now()}`,
      packageId: pkg.id,
      action: 'REVISION_REQUESTED',
      versionApproved: pkg.currentVersion,
      actorName: payload.customerName,
      actorEmail: pkg.customerEmail,
      actorRole: 'CUSTOMER',
      digitalSignature: `${payload.customerName} [REVISION_PETITION_SUBMITTED]`,
      declarationAccepted: true,
      notes: payload.overallNotes || `Requested ${payload.items.length} design revision item(s).`,
      timestamp: new Date().toISOString(),
    };
    pkg.approvalLogs.unshift(approvalLog);

    const auditEvent: DesignAuditTrailEvent = {
      id: `aud_${Date.now()}`,
      packageId: pkg.id,
      timestamp: new Date().toISOString(),
      actor: payload.customerName,
      actorRole: 'CUSTOMER',
      eventCode: 'REVISION_REQUESTED',
      description: `Client requested ${payload.items.length} bespoke revision(s) on ${payload.items.map((i) => i.component).join(', ')}.`,
      previousStage: prevStage,
      newStage: 'REVISION_REQUESTED',
      version: pkg.currentVersion,
      metadata: { itemsCount: payload.items.length, items: payload.items },
    };
    pkg.auditTrail.unshift(auditEvent);

    savePackages(list);
    return pkg;
  },

  /**
   * Atelier Action: Update Design Package with New Version (Revision Requested → Updated)
   */
  async updateDesignVersion(payload: UpdateDesignVersionPayload): Promise<DesignApprovalPackage> {
    await new Promise((r) => setTimeout(r, 260));
    const list = getStoredPackages();
    const pkg = list.find((p) => p.id === payload.packageId);
    if (!pkg) throw new Error(`Package ${payload.packageId} not found`);

    const currentMajor = parseInt(pkg.currentVersion.split('.')[0] || '1', 10);
    const currentMinor = parseInt(pkg.currentVersion.split('.')[1] || '0', 10);
    const nextVersion = `${currentMajor}.${currentMinor + 1}`;

    const prevSpec = pkg.currentSpec;
    const nextSpec: DesignPackageVersion = {
      versionNumber: nextVersion,
      createdAt: new Date().toISOString(),
      createdBy: payload.designerName,
      creatorRole: 'Lead Designer & Atelier Director',
      changeSummary: payload.changeSummary,
      changedComponents: payload.changedComponents,
      sketches: payload.updatedSpec.sketches || prevSpec.sketches,
      fabric: payload.updatedSpec.fabric || prevSpec.fabric,
      color: payload.updatedSpec.color || prevSpec.color,
      measurements: payload.updatedSpec.measurements || prevSpec.measurements,
      customRequests: payload.updatedSpec.customRequests || prevSpec.customRequests,
    };

    pkg.versions.push(nextSpec);
    pkg.currentVersion = nextVersion;
    pkg.currentSpec = nextSpec;
    const prevStage = pkg.currentStage;
    pkg.currentStage = 'UPDATED';
    pkg.updatedAt = new Date().toISOString();
    pkg.slaDeadline = new Date(Date.now() + 48 * 3600 * 1000).toISOString();

    // Mark addressed revision items
    if (payload.addressedRevisionIds?.length) {
      pkg.revisions.forEach((rev) => {
        if (payload.addressedRevisionIds?.includes(rev.id)) {
          rev.status = 'ADDRESSED';
          rev.resolvedAt = new Date().toISOString();
          rev.resolvedInVersion = nextVersion;
          rev.designerResponse = rev.designerResponse || payload.changeSummary;
        }
      });
    }

    const auditEvent: DesignAuditTrailEvent = {
      id: `aud_${Date.now()}`,
      packageId: pkg.id,
      timestamp: new Date().toISOString(),
      actor: payload.designerName,
      actorRole: 'LEAD_DESIGNER',
      eventCode: 'VERSION_UPDATED',
      description: `Atelier uploaded updated Design Package v${nextVersion}. Changes applied to: ${payload.changedComponents.join(', ')}.`,
      previousStage: prevStage,
      newStage: 'UPDATED',
      version: nextVersion,
      metadata: { changeSummary: payload.changeSummary },
    };
    pkg.auditTrail.unshift(auditEvent);

    savePackages(list);
    return pkg;
  },

  /**
   * Customer Action: Approve Design (Submitted / Updated → Approved)
   */
  async approveDesignPackage(payload: ApproveDesignPayload): Promise<DesignApprovalPackage> {
    await new Promise((r) => setTimeout(r, 250));
    const list = getStoredPackages();
    const pkg = list.find((p) => p.id === payload.packageId);
    if (!pkg) throw new Error(`Package ${payload.packageId} not found`);

    const prevStage = pkg.currentStage;
    pkg.currentStage = 'APPROVED';
    pkg.updatedAt = new Date().toISOString();

    const approvalLog: DesignApprovalLog = {
      id: `log_app_${Date.now()}`,
      packageId: pkg.id,
      action: 'APPROVED',
      versionApproved: payload.version,
      actorName: payload.customerName,
      actorEmail: payload.customerEmail,
      actorRole: 'CUSTOMER',
      digitalSignature: payload.digitalSignature,
      declarationAccepted: payload.declarationAccepted,
      notes: payload.notes || 'Full pre-production design package approved without reservation.',
      clientIp: '192.168.1.1',
      deviceMetadata: typeof navigator !== 'undefined' ? navigator.userAgent : 'Bespoke Client Terminal',
      timestamp: new Date().toISOString(),
    };
    pkg.approvalLogs.unshift(approvalLog);

    const auditEvent: DesignAuditTrailEvent = {
      id: `aud_${Date.now()}`,
      packageId: pkg.id,
      timestamp: new Date().toISOString(),
      actor: payload.customerName,
      actorRole: 'CUSTOMER',
      eventCode: 'APPROVED_BY_CUSTOMER',
      description: `Client formally approved Design Package v${payload.version} with digital signature "${payload.digitalSignature}". Commission is cleared for workshop manufacturing.`,
      previousStage: prevStage,
      newStage: 'APPROVED',
      version: payload.version,
      metadata: { digitalSignature: payload.digitalSignature },
    };
    pkg.auditTrail.unshift(auditEvent);

    savePackages(list);
    return pkg;
  },

  /**
   * Customer Action: Reject Design
   */
  async rejectDesignPackage(payload: RejectDesignPayload): Promise<DesignApprovalPackage> {
    await new Promise((r) => setTimeout(r, 200));
    const list = getStoredPackages();
    const pkg = list.find((p) => p.id === payload.packageId);
    if (!pkg) throw new Error(`Package ${payload.packageId} not found`);

    const prevStage = pkg.currentStage;
    pkg.currentStage = 'REJECTED';
    pkg.updatedAt = new Date().toISOString();

    const approvalLog: DesignApprovalLog = {
      id: `log_rej_${Date.now()}`,
      packageId: pkg.id,
      action: 'REJECTED',
      versionApproved: pkg.currentVersion,
      actorName: payload.customerName,
      actorEmail: payload.customerEmail,
      actorRole: 'CUSTOMER',
      digitalSignature: `${payload.customerName} [REJECTED_COMMISSION]`,
      declarationAccepted: true,
      notes: `Reason: ${payload.rejectionReason} (Resolution requested: ${payload.actionRequested})`,
      timestamp: new Date().toISOString(),
    };
    pkg.approvalLogs.unshift(approvalLog);

    const auditEvent: DesignAuditTrailEvent = {
      id: `aud_${Date.now()}`,
      packageId: pkg.id,
      timestamp: new Date().toISOString(),
      actor: payload.customerName,
      actorRole: 'CUSTOMER',
      eventCode: 'REJECTED_BY_CUSTOMER',
      description: `Client rejected design package. Reason: ${payload.rejectionReason}. Action requested: ${payload.actionRequested}`,
      previousStage: prevStage,
      newStage: 'REJECTED',
      version: pkg.currentVersion,
    };
    pkg.auditTrail.unshift(auditEvent);

    savePackages(list);
    return pkg;
  },

  /**
   * Atelier Action: Release to Production (Approved → Production)
   */
  async releaseToProduction(packageId: string, releasedBy: string): Promise<DesignApprovalPackage> {
    await new Promise((r) => setTimeout(r, 220));
    const list = getStoredPackages();
    const pkg = list.find((p) => p.id === packageId);
    if (!pkg) throw new Error(`Package ${packageId} not found`);

    const prevStage = pkg.currentStage;
    pkg.currentStage = 'PRODUCTION';
    pkg.updatedAt = new Date().toISOString();

    const approvalLog: DesignApprovalLog = {
      id: `log_prod_${Date.now()}`,
      packageId: pkg.id,
      action: 'PRODUCTION_RELEASED',
      versionApproved: pkg.currentVersion,
      actorName: releasedBy,
      actorEmail: 'workshop@maisondaniels.com',
      actorRole: 'LEAD_DESIGNER',
      digitalSignature: `${releasedBy} [WORKSHOP_CUTTING_RELEASE]`,
      declarationAccepted: true,
      notes: 'Design package approved and released to Head Cutter for cloth shearing.',
      timestamp: new Date().toISOString(),
    };
    pkg.approvalLogs.unshift(approvalLog);

    const auditEvent: DesignAuditTrailEvent = {
      id: `aud_${Date.now()}`,
      packageId: pkg.id,
      timestamp: new Date().toISOString(),
      actor: releasedBy,
      actorRole: 'LEAD_DESIGNER',
      eventCode: 'RELEASED_TO_PRODUCTION',
      description: `Approved design package v${pkg.currentVersion} formally released to atelier cutting & assembly workshops.`,
      previousStage: prevStage,
      newStage: 'PRODUCTION',
      version: pkg.currentVersion,
    };
    pkg.auditTrail.unshift(auditEvent);

    savePackages(list);
    return pkg;
  },

  /**
   * Reset store to initial mock data
   */
  async resetMockData(): Promise<DesignApprovalPackage[]> {
    localStorage.removeItem(STORAGE_KEY);
    savePackages(INITIAL_DESIGN_APPROVAL_PACKAGES);
    return INITIAL_DESIGN_APPROVAL_PACKAGES;
  },
};
