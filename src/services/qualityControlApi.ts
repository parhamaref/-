/**
 * @file qualityControlApi.ts
 * Enterprise Persistence & Business Logic Layer for Daniel’s Maison Advanced Quality Control System.
 * Simulates real database transactions with LocalStorage persistence and fallback to curated mock sessions.
 */

import {
  QCInspectionSession,
  QCResult,
  QCDefect,
  QCCorrectiveAction,
  QCPhotoEvidence,
  QCNote,
  QCApprovalRecord,
  QCInspectionChecklistItem,
  QCGarmentMeasurement,
  QCFabricVerification,
  QCFinishInspection,
  QCPackagingInspection,
} from '../types/qualityControl.types';
import { MOCK_QC_INSPECTION_SESSIONS } from '../mock/qualityControlMockData';

const QC_STORAGE_KEY = 'maison_daniel_qc_sessions_v1';

export class QualityControlApiService {
  /**
   * Load all QC Inspection Sessions from storage
   */
  public static getAllSessions(): QCInspectionSession[] {
    try {
      const stored = localStorage.getItem(QC_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to read QC sessions from localStorage, loading mock data:', e);
    }
    // Save defaults
    this.saveAllSessions(MOCK_QC_INSPECTION_SESSIONS);
    return MOCK_QC_INSPECTION_SESSIONS;
  }

  /**
   * Save all QC Inspection Sessions to storage
   */
  public static saveAllSessions(sessions: QCInspectionSession[]): void {
    try {
      localStorage.setItem(QC_STORAGE_KEY, JSON.stringify(sessions));
    } catch (e) {
      console.error('Failed to save QC sessions to localStorage:', e);
    }
  }

  /**
   * Get single session by ID
   */
  public static getSessionById(sessionId: string): QCInspectionSession | null {
    const sessions = this.getAllSessions();
    return sessions.find((s) => s.id === sessionId) || null;
  }

  /**
   * Update full session
   */
  public static updateSession(updatedSession: QCInspectionSession): QCInspectionSession {
    const sessions = this.getAllSessions();
    const index = sessions.findIndex((s) => s.id === updatedSession.id);
    const stamped: QCInspectionSession = {
      ...updatedSession,
      updatedAt: new Date().toISOString(),
    };

    if (index >= 0) {
      sessions[index] = stamped;
    } else {
      sessions.unshift(stamped);
    }
    this.saveAllSessions(sessions);
    return stamped;
  }

  /**
   * Update a specific checklist item
   */
  public static updateChecklistItem(
    sessionId: string,
    itemId: string,
    updates: Partial<QCInspectionChecklistItem>
  ): QCInspectionSession | null {
    const session = this.getSessionById(sessionId);
    if (!session) return null;

    session.checklist = session.checklist.map((item) => {
      if (item.id === itemId) {
        return {
          ...item,
          ...updates,
          checkedAt: new Date().toISOString(),
        };
      }
      return item;
    });

    return this.updateSession(session);
  }

  /**
   * Add custom checklist item
   */
  public static addChecklistItem(
    sessionId: string,
    item: Omit<QCInspectionChecklistItem, 'id'>
  ): QCInspectionSession | null {
    const session = this.getSessionById(sessionId);
    if (!session) return null;

    const newItem: QCInspectionChecklistItem = {
      ...item,
      id: `chk-custom-${Date.now()}`,
      checkedAt: new Date().toISOString(),
    };

    session.checklist.push(newItem);
    return this.updateSession(session);
  }

  /**
   * Update measurement and re-evaluate variance tolerance status
   */
  public static updateMeasurement(
    sessionId: string,
    measId: string,
    actualMeasuredCm: number,
    notes?: string
  ): QCInspectionSession | null {
    const session = this.getSessionById(sessionId);
    if (!session) return null;

    session.measurements = session.measurements.map((m) => {
      if (m.id === measId) {
        const varianceMm = Math.round((actualMeasuredCm - m.targetSpecCm) * 10 * 10) / 10;
        let status: 'In Tolerance' | 'Out of Tolerance' | 'Critical Deviation' = 'In Tolerance';

        if (varianceMm < -m.toleranceMinusMm || varianceMm > m.tolerancePlusMm) {
          const maxAllowed = Math.max(m.toleranceMinusMm, m.tolerancePlusMm);
          status = Math.abs(varianceMm) > maxAllowed * 2 ? 'Critical Deviation' : 'Out of Tolerance';
        }

        return {
          ...m,
          actualMeasuredCm,
          varianceMm,
          status,
          notes: notes !== undefined ? notes : m.notes,
        };
      }
      return m;
    });

    return this.updateSession(session);
  }

  /**
   * Add a new measurement spec
   */
  public static addMeasurement(
    sessionId: string,
    meas: Omit<QCGarmentMeasurement, 'id' | 'varianceMm' | 'status'>
  ): QCInspectionSession | null {
    const session = this.getSessionById(sessionId);
    if (!session) return null;

    const varianceMm = Math.round((meas.actualMeasuredCm - meas.targetSpecCm) * 10 * 10) / 10;
    let status: 'In Tolerance' | 'Out of Tolerance' | 'Critical Deviation' = 'In Tolerance';
    if (varianceMm < -meas.toleranceMinusMm || varianceMm > meas.tolerancePlusMm) {
      status = Math.abs(varianceMm) > Math.max(meas.toleranceMinusMm, meas.tolerancePlusMm) * 2
        ? 'Critical Deviation'
        : 'Out of Tolerance';
    }

    const newMeas: QCGarmentMeasurement = {
      ...meas,
      id: `meas-${Date.now()}`,
      varianceMm,
      status,
    };

    session.measurements.push(newMeas);
    return this.updateSession(session);
  }

  /**
   * Update Fabric Verification
   */
  public static updateFabricVerification(
    sessionId: string,
    updates: Partial<QCFabricVerification>
  ): QCInspectionSession | null {
    const session = this.getSessionById(sessionId);
    if (!session) return null;

    session.fabricVerification = {
      ...session.fabricVerification,
      ...updates,
    };

    return this.updateSession(session);
  }

  /**
   * Update Finish Inspection
   */
  public static updateFinishInspection(
    sessionId: string,
    updates: Partial<QCFinishInspection>
  ): QCInspectionSession | null {
    const session = this.getSessionById(sessionId);
    if (!session) return null;

    session.finishInspection = {
      ...session.finishInspection,
      ...updates,
    };

    return this.updateSession(session);
  }

  /**
   * Update Packaging Inspection
   */
  public static updatePackagingInspection(
    sessionId: string,
    updates: Partial<QCPackagingInspection>
  ): QCInspectionSession | null {
    const session = this.getSessionById(sessionId);
    if (!session) return null;

    session.packagingInspection = {
      ...session.packagingInspection,
      ...updates,
    };

    return this.updateSession(session);
  }

  /**
   * Log a new defect and auto-suggest corrective action
   */
  public static logDefect(
    sessionId: string,
    defectInput: Omit<QCDefect, 'id' | 'detectedAt' | 'resolved'>,
    autoCreateCorrectiveAction?: {
      actionRequired: string;
      assignedTo: string;
      priority: 'Immediate' | 'Standard' | 'Urgent';
      targetDate: string;
    }
  ): QCInspectionSession | null {
    const session = this.getSessionById(sessionId);
    if (!session) return null;

    const newDefectId = `def-${Date.now()}`;
    const newDefect: QCDefect = {
      ...defectInput,
      id: newDefectId,
      detectedAt: new Date().toISOString(),
      resolved: false,
    };

    session.defects.unshift(newDefect);

    // Auto switch result to Rework Required or Fail based on severity
    if (newDefect.severity === 'Critical') {
      session.result = 'Fail';
    } else if (session.result === 'Pass') {
      session.result = 'Rework Required';
    }

    if (autoCreateCorrectiveAction) {
      const newAction: QCCorrectiveAction = {
        id: `act-${Date.now()}`,
        defectId: newDefectId,
        actionRequired: autoCreateCorrectiveAction.actionRequired,
        assignedTailorOrWorkshop: autoCreateCorrectiveAction.assignedTo,
        priority: autoCreateCorrectiveAction.priority,
        targetCompletionDate: autoCreateCorrectiveAction.targetDate,
        requiresReinspection: true,
        status: 'Pending',
      };
      session.correctiveActions.unshift(newAction);
    }

    return this.updateSession(session);
  }

  /**
   * Resolve a defect
   */
  public static resolveDefect(sessionId: string, defectId: string): QCInspectionSession | null {
    const session = this.getSessionById(sessionId);
    if (!session) return null;

    session.defects = session.defects.map((d) =>
      d.id === defectId ? { ...d, resolved: true, resolvedAt: new Date().toISOString() } : d
    );

    // Check if any open defects remain
    const openDefects = session.defects.filter((d) => !d.resolved);
    if (openDefects.length === 0 && session.result === 'Rework Required') {
      // Re-evaluate if it can be passed
      session.result = 'Pass';
    }

    return this.updateSession(session);
  }

  /**
   * Update or create a Corrective Action
   */
  public static updateCorrectiveAction(
    sessionId: string,
    actionId: string,
    updates: Partial<QCCorrectiveAction>
  ): QCInspectionSession | null {
    const session = this.getSessionById(sessionId);
    if (!session) return null;

    session.correctiveActions = session.correctiveActions.map((act) =>
      act.id === actionId ? { ...act, ...updates } : act
    );

    return this.updateSession(session);
  }

  /**
   * Add a photo evidence record
   */
  public static addPhotoEvidence(
    sessionId: string,
    photoInput: Omit<QCPhotoEvidence, 'id' | 'timestamp'>
  ): QCInspectionSession | null {
    const session = this.getSessionById(sessionId);
    if (!session) return null;

    const newPhoto: QCPhotoEvidence = {
      ...photoInput,
      id: `photo-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };

    session.photos.unshift(newPhoto);
    return this.updateSession(session);
  }

  /**
   * Add an inspector note
   */
  public static addNote(
    sessionId: string,
    noteInput: Omit<QCNote, 'id' | 'timestamp'>
  ): QCInspectionSession | null {
    const session = this.getSessionById(sessionId);
    if (!session) return null;

    const newNote: QCNote = {
      ...noteInput,
      id: `note-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };

    session.notes.push(newNote);
    return this.updateSession(session);
  }

  /**
   * Issue Final Approval / Rejection / Rework Record
   */
  public static issueApprovalDecision(
    sessionId: string,
    result: QCResult,
    inspectorName: string,
    badgeNumber: string,
    reworkInstructions?: string,
    complianceStandard: QCApprovalRecord['complianceStandard'] = 'Daniel’s Maison Haute Couture Spec V3.4'
  ): QCInspectionSession | null {
    const session = this.getSessionById(sessionId);
    if (!session) return null;

    const certPrefix = result === 'Pass' ? 'MD-CERT' : result === 'Rework Required' ? 'MD-REWORK' : 'MD-REJECT';
    const randomHex = Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

    const approvalRecord: QCApprovalRecord = {
      id: `APR-${Date.now()}`,
      inspectionId: session.id,
      orderId: session.orderId,
      garmentSerialNumber: `MD-${session.orderId.replace('ORD-', '')}-${Date.now().toString().slice(-4)}`,
      finalResult: result,
      certifiedInspectorName: inspectorName,
      inspectorBadgeNumber: badgeNumber,
      approvalTimestamp: new Date().toISOString(),
      digitalSealHash: randomHex,
      authenticityCertificateNumber: `${certPrefix}-${Date.now().toString().slice(-6)}`,
      reworkDispatchedAt: result === 'Rework Required' ? new Date().toISOString() : undefined,
      reworkInstructions,
      complianceStandard,
    };

    session.result = result;
    session.status = result === 'Rework Required' ? 'Pending Re-Inspection' : 'Completed';
    session.approvalRecord = approvalRecord;

    return this.updateSession(session);
  }

  /**
   * Create a new inspection session from an Order
   */
  public static createNewSession(orderData: {
    orderId: string;
    clientName: string;
    garmentName: string;
    garmentSilhouette: string;
    partnerAtelier: string;
    orderTotal: number;
    inspectorName: string;
    inspectorId: string;
  }): QCInspectionSession {
    const newSession: QCInspectionSession = {
      id: `QC-SESS-${Date.now()}`,
      orderId: orderData.orderId,
      clientName: orderData.clientName,
      garmentName: orderData.garmentName,
      garmentSilhouette: orderData.garmentSilhouette,
      partnerAtelier: orderData.partnerAtelier,
      orderTotal: orderData.orderTotal,
      inspectionDate: new Date().toISOString().split('T')[0],
      inspectorId: orderData.inspectorId,
      inspectorName: orderData.inspectorName,
      result: 'Pass',
      status: 'In Progress',

      checklist: [
        {
          id: `chk-${Date.now()}-1`,
          category: 'Symmetry & Proportions',
          title: 'Center front and back plumb seam verticality',
          description: 'Seam plumb alignment verified within ±0.5mm.',
          toleranceMm: 0.5,
          status: 'Pass',
        },
        {
          id: `chk-${Date.now()}-2`,
          category: 'Symmetry & Proportions',
          title: 'Lapel / collar gorge angle and width symmetry',
          description: 'Left and right points match symmetrically.',
          toleranceMm: 1.0,
          status: 'Pass',
        },
        {
          id: `chk-${Date.now()}-3`,
          category: 'Stitch & Seam Integrity',
          title: 'Shoulder balance offset & sleeve drape pitch',
          description: 'Sleeve pitch forward rotation verified for relaxed anatomical posture.',
          toleranceMm: 1.5,
          status: 'Pass',
        },
        {
          id: `chk-${Date.now()}-4`,
          category: 'Lining & Internal Canvas',
          title: 'Internal canvas floating tension & lining ease',
          description: 'Full chest canvas floating drape checked.',
          status: 'Pass',
        },
        {
          id: `chk-${Date.now()}-5`,
          category: 'Pressing & Surface Finish',
          title: 'Cold iron finish & absence of fabric pressing shine',
          description: 'Nap of wool / silk unmarred by press luster.',
          status: 'Pass',
        },
        {
          id: `chk-${Date.now()}-6`,
          category: 'Hardware & Embellishment',
          title: 'Buttons & closures shank security and hand stitching',
          description: 'All buttons firmly attached with shank room.',
          status: 'Pass',
        },
        {
          id: `chk-${Date.now()}-7`,
          category: 'Packaging & Presentation',
          title: 'Cedar bag, brass hanger, archival dust cover intact',
          description: 'Packaging criteria verified.',
          status: 'Pending',
        },
      ],

      measurements: [
        {
          id: `meas-${Date.now()}-1`,
          pointOfMeasure: 'Chest Circumference',
          anatomicalZone: 'Chest',
          targetSpecCm: 56.0,
          actualMeasuredCm: 56.0,
          toleranceMinusMm: 3.0,
          tolerancePlusMm: 3.0,
          varianceMm: 0.0,
          status: 'In Tolerance',
        },
        {
          id: `meas-${Date.now()}-2`,
          pointOfMeasure: 'Natural Waist Width',
          anatomicalZone: 'Waist',
          targetSpecCm: 50.0,
          actualMeasuredCm: 50.0,
          toleranceMinusMm: 2.0,
          tolerancePlusMm: 2.0,
          varianceMm: 0.0,
          status: 'In Tolerance',
        },
        {
          id: `meas-${Date.now()}-3`,
          pointOfMeasure: 'Cross Shoulder Width',
          anatomicalZone: 'Shoulder',
          targetSpecCm: 47.0,
          actualMeasuredCm: 47.0,
          toleranceMinusMm: 2.0,
          tolerancePlusMm: 2.0,
          varianceMm: 0.0,
          status: 'In Tolerance',
        },
        {
          id: `meas-${Date.now()}-4`,
          pointOfMeasure: 'Right Sleeve Length',
          anatomicalZone: 'Sleeve',
          targetSpecCm: 65.0,
          actualMeasuredCm: 65.0,
          toleranceMinusMm: 3.0,
          tolerancePlusMm: 3.0,
          varianceMm: 0.0,
          status: 'In Tolerance',
        },
        {
          id: `meas-${Date.now()}-5`,
          pointOfMeasure: 'Left Sleeve Length',
          anatomicalZone: 'Sleeve',
          targetSpecCm: 65.0,
          actualMeasuredCm: 65.0,
          toleranceMinusMm: 3.0,
          tolerancePlusMm: 3.0,
          varianceMm: 0.0,
          status: 'In Tolerance',
        },
      ],

      fabricVerification: {
        id: `fab-${Date.now()}`,
        fabricCode: 'FAB-MD-SPEC-NEW',
        millName: 'Lanificio F.lli Cerruti (Biella, Italy)',
        composition: '100% Super 150s Wool',
        declaredGsm: 300,
        testedGsm: 300,
        weavePattern: 'Twill',
        shadeMatchDeltaE: 0.4,
        colorMatchStatus: 'Match',
        yarnCount: '2/72s Nm',
        flawInspectionResult: 'Zero Flaws',
        sheenAndHandleCheck: 'Pass',
        shrinkageResistancePass: true,
        notes: 'Mill sample piece conforms to master swatch spec.',
        swatchImageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=400&q=80',
      },

      finishInspection: {
        id: `fin-${Date.now()}`,
        seamPuckeringRating: 5,
        stitchDensityPerCm: 6.0,
        milaneseButtonholeQuality: 'Hand-worked Flawless',
        cuproLiningEasePass: true,
        lapelRollFullnessPass: true,
        coldIronPressShineFree: true,
        threadTrimmed100Percent: true,
        zipperAndFastenersFluidity: 'Silky Smooth',
        notes: 'Hand finishing and thread tension verified.',
      },

      packagingInspection: {
        id: `pkg-${Date.now()}`,
        cedarGarmentBagIncluded: true,
        contouredBrassHangerVerified: true,
        acidFreeTissuePaperFolded: true,
        waxSealAuthenticityApplied: false,
        tamperProofSerialHologram: `MD-HOLO-${Date.now().toString().slice(-6)}`,
        presentationBoxIntegrity: 'Pristine',
        courierShippingLabelAffixed: false,
        clientCareCardInserted: true,
        notes: 'Pending final certification seal.',
      },

      defects: [],
      correctiveActions: [],
      photos: [],
      notes: [
        {
          id: `note-${Date.now()}`,
          author: orderData.inspectorName,
          role: 'Quality Auditor',
          timestamp: new Date().toISOString(),
          stage: 'Intake',
          content: 'Session initialized for garment intake.',
          isClientVisible: false,
        },
      ],
      updatedAt: new Date().toISOString(),
    };

    const sessions = this.getAllSessions();
    sessions.unshift(newSession);
    this.saveAllSessions(sessions);
    return newSession;
  }

  /**
   * Reset to initial mock data
   */
  public static resetToMock(): QCInspectionSession[] {
    this.saveAllSessions(MOCK_QC_INSPECTION_SESSIONS);
    return MOCK_QC_INSPECTION_SESSIONS;
  }
}
