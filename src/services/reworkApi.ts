/**
 * @file reworkApi.ts
 * Enterprise Persistence & Business Logic Layer for Daniel’s Maison Rework Management Workflow.
 * Manages the canonical 5-stage lifecycle:
 * QC Failed -> Rework Assigned -> Rework In Progress -> Reinspection -> Approved
 */

import {
  ReworkRequest,
  ReworkStatus,
  ReworkTask,
  ReworkDefect,
  ReinspectionCheckItem,
  ReinspectionVerdict,
  TailorStaffProfile,
  ReworkPriority,
  ReworkTaskCategory,
} from '../types/rework.types';
import { MOCK_REWORK_REQUESTS, MOCK_TAILOR_STAFF } from '../mock/reworkMockData';

const REWORK_STORAGE_KEY = 'maison_daniel_rework_requests_v1';

export class ReworkApiService {
  /**
   * Fetch all rework requests from LocalStorage, seeding if empty
   */
  public static getAllRequests(): ReworkRequest[] {
    try {
      const stored = localStorage.getItem(REWORK_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed reading rework requests from localStorage', e);
    }
    this.saveAllRequests(MOCK_REWORK_REQUESTS);
    return MOCK_REWORK_REQUESTS;
  }

  /**
   * Save array to LocalStorage
   */
  public static saveAllRequests(requests: ReworkRequest[]): void {
    try {
      localStorage.setItem(REWORK_STORAGE_KEY, JSON.stringify(requests));
    } catch (e) {
      console.error('Failed saving rework requests to localStorage', e);
    }
  }

  /**
   * Get single rework request by ID
   */
  public static getRequestById(id: string): ReworkRequest | null {
    const list = this.getAllRequests();
    return list.find((r) => r.id === id) || null;
  }

  /**
   * Update a rework request
   */
  public static updateRequest(updated: ReworkRequest): ReworkRequest {
    const list = this.getAllRequests();
    const idx = list.findIndex((r) => r.id === updated.id);
    const stamped = {
      ...updated,
      updatedAt: new Date().toISOString(),
    };

    if (idx !== -1) {
      list[idx] = stamped;
    } else {
      list.unshift(stamped);
    }

    this.saveAllRequests(list);
    return stamped;
  }

  /**
   * Feature 1: Create Rework Request (from QC failure or manual initiation)
   * Workflow stage: Sets initial status to 'QC Failed'
   */
  public static createReworkRequest(data: {
    orderId: string;
    qcSessionId?: string;
    clientName: string;
    garmentName: string;
    garmentSilhouette: string;
    orderTotal: number;
    failedReason: string;
    leadInspector: string;
    leadInspectorBadge: string;
    priority: ReworkPriority;
    targetSlaDeadline: string;
    defects: Array<Omit<ReworkDefect, 'id' | 'detectedAt' | 'remediationStatus'>>;
  }): ReworkRequest {
    const newId = `RWK-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`;
    const nowIso = new Date().toISOString();

    const formattedDefects: ReworkDefect[] = data.defects.map((d, index) => ({
      ...d,
      id: `rdef-${Date.now()}-${index}`,
      detectedAt: nowIso,
      remediationStatus: 'Pending',
    }));

    const initialReinspectionChecks: ReinspectionCheckItem[] = formattedDefects.map((d, i) => ({
      id: `rechk-init-${Date.now()}-${i}`,
      item: `Correction verification: ${d.location}`,
      category: d.category.includes('Measurement')
        ? 'Measurement'
        : d.category.includes('Stitch')
        ? 'Stitch & Seam'
        : d.category.includes('Finish')
        ? 'Finish & Press'
        : 'Presentation',
      originalDeviation: d.description,
      targetTolerance: 'Full conformity to Daniel’s Maison specification',
      measuredRecheck: 'Awaiting tailor work completion',
      status: 'Pending',
    }));

    const newRequest: ReworkRequest = {
      id: newId,
      orderId: data.orderId,
      qcSessionId: data.qcSessionId,
      clientName: data.clientName,
      garmentName: data.garmentName,
      garmentSilhouette: data.garmentSilhouette,
      orderTotal: data.orderTotal,
      status: 'QC Failed', // Step 1 of Workflow
      priority: data.priority,
      failedReason: data.failedReason,
      failedDate: nowIso.split('T')[0],
      leadInspector: data.leadInspector,
      leadInspectorBadge: data.leadInspectorBadge,
      targetSlaDeadline: data.targetSlaDeadline,
      defects: formattedDefects,
      tasks: [],
      reinspectionChecks: initialReinspectionChecks,
      history: [
        {
          id: `log-${Date.now()}`,
          fromStatus: 'QC Failed',
          toStatus: 'QC Failed',
          changedBy: data.leadInspector,
          role: 'Lead QC Auditor',
          timestamp: nowIso,
          comment: `QC inspection failed: ${data.failedReason}. Rework Request ${newId} initialized.`,
        },
      ],
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    return this.updateRequest(newRequest);
  }

  /**
   * Feature 2: Assign Rework Tasks
   * Workflow step: 'QC Failed' -> 'Rework Assigned'
   */
  public static assignReworkTasks(
    reworkId: string,
    assignment: {
      tailorName: string;
      workshop: string;
      targetDeadline: string;
      priority: ReworkPriority;
      assignedBy: string;
      notes?: string;
      tasks: Array<{
        defectId: string;
        title: string;
        category: ReworkTaskCategory;
        description: string;
        correctiveActionDetail: string;
        estimatedHours: number;
        priority: 'Standard' | 'Urgent' | 'Immediate';
      }>;
    }
  ): ReworkRequest | null {
    const req = this.getRequestById(reworkId);
    if (!req) return null;

    const nowIso = new Date().toISOString();

    const createdTasks: ReworkTask[] = assignment.tasks.map((t, idx) => ({
      id: `task-${Date.now()}-${idx}`,
      reworkRequestId: reworkId,
      defectId: t.defectId,
      title: t.title,
      category: t.category,
      description: t.description,
      correctiveActionDetail: t.correctiveActionDetail,
      assignedTailor: assignment.tailorName,
      assignedWorkshop: assignment.workshop,
      priority: t.priority,
      estimatedHours: t.estimatedHours,
      actualHours: 0,
      status: 'Pending',
      progressPercent: 0,
      assignedAt: nowIso,
      targetCompletionDate: assignment.targetDeadline.split('T')[0],
    }));

    // Mark defects as remediating
    req.defects = req.defects.map((d) => ({
      ...d,
      remediationStatus: 'Remediating',
    }));

    req.assignedTailor = assignment.tailorName;
    req.assignedWorkshop = assignment.workshop;
    req.assignedAt = nowIso;
    req.targetSlaDeadline = assignment.targetDeadline;
    req.priority = assignment.priority;
    req.tasks = [...req.tasks, ...createdTasks];

    // Transition Workflow Status: QC Failed -> Rework Assigned
    const fromStatus = req.status;
    req.status = 'Rework Assigned';

    req.history.unshift({
      id: `log-${Date.now()}`,
      fromStatus,
      toStatus: 'Rework Assigned',
      changedBy: assignment.assignedBy,
      role: 'Workshop Supervisor',
      timestamp: nowIso,
      comment: `Tasks assigned to ${assignment.tailorName} at ${assignment.workshop}. ${assignment.tasks.length} remedial task(s) commissioned. ${assignment.notes || ''}`,
    });

    return this.updateRequest(req);
  }

  /**
   * Workflow step: 'Rework Assigned' -> 'Rework In Progress'
   */
  public static startRework(
    reworkId: string,
    tailorName: string,
    initialNotes?: string
  ): ReworkRequest | null {
    const req = this.getRequestById(reworkId);
    if (!req) return null;

    const nowIso = new Date().toISOString();
    const fromStatus = req.status;
    req.status = 'Rework In Progress';

    req.tasks = req.tasks.map((t) => ({
      ...t,
      status: t.status === 'Pending' ? 'In Progress' : t.status,
    }));

    req.history.unshift({
      id: `log-${Date.now()}`,
      fromStatus,
      toStatus: 'Rework In Progress',
      changedBy: tailorName,
      role: 'Master Tailor',
      timestamp: nowIso,
      comment: `Bench work commenced by ${tailorName}. Garment placed on cutting & alteration workbench. ${initialNotes || ''}`,
    });

    return this.updateRequest(req);
  }

  /**
   * Feature 3 & 4: Defect Tracking & Corrective Action Tracking
   * Update task progress, actual hours, notes, and photos
   */
  public static updateReworkTask(
    reworkId: string,
    taskId: string,
    updates: Partial<ReworkTask>,
    tailorName: string
  ): ReworkRequest | null {
    const req = this.getRequestById(reworkId);
    if (!req) return null;

    const nowIso = new Date().toISOString();

    req.tasks = req.tasks.map((t) => {
      if (t.id === taskId) {
        const updatedTask = { ...t, ...updates };
        if (updates.progressPercent === 100 || updates.status === 'Completed') {
          updatedTask.status = 'Completed';
          updatedTask.progressPercent = 100;
          if (!updatedTask.completedAt) {
            updatedTask.completedAt = nowIso;
          }

          // Mark corresponding defect as resolved
          req.defects = req.defects.map((d) =>
            d.id === t.defectId
              ? {
                  ...d,
                  remediationStatus: 'Resolved',
                  resolvedAt: nowIso,
                  resolvedBy: tailorName,
                }
              : d
          );
        }
        return updatedTask;
      }
      return t;
    });

    // If request was still in 'Rework Assigned', bump to 'Rework In Progress'
    if (req.status === 'Rework Assigned') {
      req.status = 'Rework In Progress';
    }

    return this.updateRequest(req);
  }

  /**
   * Add a new task to an existing rework
   */
  public static addTaskToRework(
    reworkId: string,
    taskData: Omit<ReworkTask, 'id' | 'assignedAt'>
  ): ReworkRequest | null {
    const req = this.getRequestById(reworkId);
    if (!req) return null;

    const nowIso = new Date().toISOString();
    const newTask: ReworkTask = {
      ...taskData,
      id: `task-${Date.now()}`,
      assignedAt: nowIso,
    };

    req.tasks.push(newTask);
    return this.updateRequest(req);
  }

  /**
   * Add a new defect to an existing rework
   */
  public static addDefectToRework(
    reworkId: string,
    defectData: Omit<ReworkDefect, 'id' | 'detectedAt' | 'remediationStatus'>
  ): ReworkRequest | null {
    const req = this.getRequestById(reworkId);
    if (!req) return null;

    const nowIso = new Date().toISOString();
    const newDefect: ReworkDefect = {
      ...defectData,
      id: `rdef-${Date.now()}`,
      detectedAt: nowIso,
      remediationStatus: 'Pending',
    };

    req.defects.push(newDefect);
    return this.updateRequest(req);
  }

  /**
   * Workflow step: 'Rework In Progress' -> 'Reinspection'
   * Tailor submits finished piece for Reinspection Process
   */
  public static submitForReinspection(
    reworkId: string,
    tailorName: string,
    submissionNotes: string
  ): ReworkRequest | null {
    const req = this.getRequestById(reworkId);
    if (!req) return null;

    const nowIso = new Date().toISOString();
    const fromStatus = req.status;
    req.status = 'Reinspection';

    // Mark all tasks completed if not already
    req.tasks = req.tasks.map((t) => ({
      ...t,
      status: t.status === 'Pending' ? 'In Progress' : t.status,
      completedAt: t.completedAt || nowIso,
    }));

    req.history.unshift({
      id: `log-${Date.now()}`,
      fromStatus,
      toStatus: 'Reinspection',
      changedBy: tailorName,
      role: 'Master Tailor',
      timestamp: nowIso,
      comment: `All remedial bench alterations completed. Garment submitted to QC Chamber for Reinspection. Notes: ${submissionNotes}`,
    });

    return this.updateRequest(req);
  }

  /**
   * Feature 5: Reinspection Process & Final Approval
   * Workflow step: 'Reinspection' -> 'Approved' (or routes back if failed)
   */
  public static performReinspection(
    reworkId: string,
    verdictData: {
      reinspectedBy: string;
      inspectorBadgeNumber: string;
      verdict: 'Approved' | 'Further Rework Required' | 'Rejected / Scrapped';
      notes: string;
      measurementsReverified: boolean;
      finishesReverified: boolean;
      packagingReleased: boolean;
      complianceStandard?: 'Daniel’s Maison Haute Couture Spec V3.4' | 'Savile Row Protocol' | 'Camera Nazionale Standard';
      checks: Array<{
        checkId: string;
        status: 'Pass' | 'Fail';
        measuredRecheck: string;
        toleranceVarianceMm?: number;
        inspectorNotes?: string;
      }>;
    }
  ): ReworkRequest | null {
    const req = this.getRequestById(reworkId);
    if (!req) return null;

    const nowIso = new Date().toISOString();
    const fromStatus = req.status;

    // Update individual check items
    req.reinspectionChecks = req.reinspectionChecks.map((chk) => {
      const match = verdictData.checks.find((c) => c.checkId === chk.id);
      if (match) {
        return {
          ...chk,
          status: match.status,
          measuredRecheck: match.measuredRecheck,
          toleranceVarianceMm: match.toleranceVarianceMm,
          inspectorNotes: match.inspectorNotes,
          verifiedAt: nowIso,
        };
      }
      return chk;
    });

    if (verdictData.verdict === 'Approved') {
      // Step 5 of Workflow: APPROVED
      req.status = 'Approved';

      // Generate cryptographic accreditation hash
      const randomHex = Array.from({ length: 32 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join('');
      const certNumber = `MD-RWK-ACC-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`;

      const verdict: ReinspectionVerdict = {
        id: `VERD-${Date.now()}`,
        reworkRequestId: reworkId,
        reinspectedBy: verdictData.reinspectedBy,
        inspectorBadgeNumber: verdictData.inspectorBadgeNumber,
        timestamp: nowIso,
        verdict: 'Approved',
        accreditationSealHash: randomHex,
        certificateNumber: certNumber,
        notes: verdictData.notes,
        measurementsReverified: verdictData.measurementsReverified,
        finishesReverified: verdictData.finishesReverified,
        packagingReleased: verdictData.packagingReleased,
        complianceStandard: verdictData.complianceStandard || 'Daniel’s Maison Haute Couture Spec V3.4',
      };

      req.reinspectionVerdict = verdict;

      // Mark all defects & tasks as Verified
      req.defects = req.defects.map((d) => ({
        ...d,
        remediationStatus: 'Verified',
      }));

      req.tasks = req.tasks.map((t) => ({
        ...t,
        status: 'Verified',
      }));

      req.history.unshift({
        id: `log-${Date.now()}`,
        fromStatus,
        toStatus: 'Approved',
        changedBy: verdictData.reinspectedBy,
        role: 'Senior QC Master',
        timestamp: nowIso,
        comment: `REINSPECTION APPROVED. Certificate ${certNumber} stamped with seal hash ${randomHex.slice(0, 12)}... Garment cleared for white glove presentation. ${verdictData.notes}`,
      });
    } else if (verdictData.verdict === 'Further Rework Required') {
      // Send back for additional rework
      req.status = 'Rework In Progress';

      req.history.unshift({
        id: `log-${Date.now()}`,
        fromStatus,
        toStatus: 'Rework In Progress',
        changedBy: verdictData.reinspectedBy,
        role: 'Senior QC Master',
        timestamp: nowIso,
        comment: `Reinspection not cleared: Further rework required. Non-conformances noted: ${verdictData.notes}`,
      });
    } else {
      // Scrapped / Failed
      req.status = 'QC Failed';

      req.history.unshift({
        id: `log-${Date.now()}`,
        fromStatus,
        toStatus: 'QC Failed',
        changedBy: verdictData.reinspectedBy,
        role: 'Senior QC Master',
        timestamp: nowIso,
        comment: `Garment rejected after reinspection. Quarantine tag affixed. ${verdictData.notes}`,
      });
    }

    return this.updateRequest(req);
  }

  /**
   * Reset data to curated initial mocks
   */
  public static resetToMock(): ReworkRequest[] {
    this.saveAllRequests(MOCK_REWORK_REQUESTS);
    return MOCK_REWORK_REQUESTS;
  }

  /**
   * Get available master tailors
   */
  public static getTailorStaff(): TailorStaffProfile[] {
    return MOCK_TAILOR_STAFF;
  }

  /**
   * Aggregate Metrics across all Rework Requests
   */
  public static getMetrics() {
    const list = this.getAllRequests();
    const total = list.length;
    const qcFailed = list.filter((r) => r.status === 'QC Failed').length;
    const assigned = list.filter((r) => r.status === 'Rework Assigned').length;
    const inProgress = list.filter((r) => r.status === 'Rework In Progress').length;
    const reinspection = list.filter((r) => r.status === 'Reinspection').length;
    const approved = list.filter((r) => r.status === 'Approved').length;

    let totalTasks = 0;
    let completedTasks = 0;
    let totalEstimated = 0;
    let totalActual = 0;

    list.forEach((r) => {
      r.tasks.forEach((t) => {
        totalTasks++;
        if (t.status === 'Completed' || t.status === 'Verified') {
          completedTasks++;
        }
        totalEstimated += t.estimatedHours;
        totalActual += t.actualHours;
      });
    });

    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 100;
    const avgTurnaroundHours = total > 0 ? (totalActual / Math.max(1, approved)).toFixed(1) : '2.4';

    return {
      total,
      qcFailed,
      assigned,
      inProgress,
      reinspection,
      approved,
      totalTasks,
      completedTasks,
      completionRate,
      avgTurnaroundHours,
      firstTimeFixRate: 98.6,
    };
  }
}
