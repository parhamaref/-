/**
 * @file designerVerificationApi.ts
 * REST API client & service layer for Daniel's Maison Designer Verification System.
 * Simulates real persistence using LocalStorage with fallback to curated high-fidelity mock data.
 */

import {
  DesignerVerificationApplication,
  VerificationStatus,
  PillarStatus,
  MoreInformationQuery,
} from '../types/designerVerification.types';
import { INITIAL_DESIGNER_VERIFICATION_APPLICATIONS } from '../mock/designerVerificationMockData';

const STORAGE_KEY = 'maison_daniel_designer_verifications_v1';

function getStoredApplications(): DesignerVerificationApplication[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DESIGNER_VERIFICATION_APPLICATIONS));
      return INITIAL_DESIGNER_VERIFICATION_APPLICATIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_DESIGNER_VERIFICATION_APPLICATIONS;
  }
}

function saveApplications(apps: DesignerVerificationApplication[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
  } catch (err) {
    console.error('Error saving designer verifications to localStorage', err);
  }
}

export const designerVerificationApi = {
  /**
   * Get all applications with optional status filter
   */
  async getAllApplications(statusFilter?: VerificationStatus | 'All'): Promise<DesignerVerificationApplication[]> {
    await new Promise((r) => setTimeout(r, 120));
    const all = getStoredApplications();
    if (!statusFilter || statusFilter === 'All') return all;
    return all.filter((app) => app.status === statusFilter);
  },

  /**
   * Get application by ID
   */
  async getApplicationById(id: string): Promise<DesignerVerificationApplication | null> {
    await new Promise((r) => setTimeout(r, 80));
    const all = getStoredApplications();
    return all.find((app) => app.id === id) || null;
  },

  /**
   * Get application by designer ID
   */
  async getApplicationByDesigner(designerId: string): Promise<DesignerVerificationApplication | null> {
    await new Promise((r) => setTimeout(r, 80));
    const all = getStoredApplications();
    return all.find((app) => app.designerId === designerId) || all[0] || null;
  },

  /**
   * Designer submits a new application
   */
  async submitApplication(appData: Omit<DesignerVerificationApplication, 'id' | 'submittedAt' | 'updatedAt' | 'auditTrail'>): Promise<DesignerVerificationApplication> {
    await new Promise((r) => setTimeout(r, 200));
    const all = getStoredApplications();
    const now = new Date().toISOString();
    const newApp: DesignerVerificationApplication = {
      ...appData,
      id: `app-auto-${Date.now()}`,
      submittedAt: now,
      updatedAt: now,
      status: 'Submitted',
      auditTrail: [
        {
          id: `aud-${Date.now()}`,
          timestamp: now,
          actorName: appData.designerName,
          actorRole: 'Designer',
          fromStatus: 'Draft',
          toStatus: 'Submitted',
          comment: 'Application submitted for official accreditation review.',
        },
      ],
    };

    all.unshift(newApp);
    saveApplications(all);
    return newApp;
  },

  /**
   * Standards Council claims an application to begin review -> status: 'Under Review'
   */
  async claimReview(id: string, reviewerName: string = 'Standards Council Inspector'): Promise<DesignerVerificationApplication> {
    await new Promise((r) => setTimeout(r, 150));
    const all = getStoredApplications();
    const index = all.findIndex((a) => a.id === id);
    if (index === -1) throw new Error('Application not found');

    const app = all[index];
    const prevStatus = app.status;
    const now = new Date().toISOString();

    const updated: DesignerVerificationApplication = {
      ...app,
      status: 'Under Review',
      assignedReviewer: reviewerName,
      assignedReviewerRole: 'Senior Bespoke Standards Auditor',
      updatedAt: now,
      auditTrail: [
        {
          id: `aud-${Date.now()}`,
          timestamp: now,
          actorName: reviewerName,
          actorRole: 'Standards Council',
          fromStatus: prevStatus,
          toStatus: 'Under Review',
          comment: `Dossier claimed by ${reviewerName} for full inspection.`,
        },
        ...app.auditTrail,
      ],
    };

    all[index] = updated;
    saveApplications(all);
    return updated;
  },

  /**
   * Standards Council flags application -> status: 'More Information Required'
   */
  async requestMoreInformation(
    id: string,
    reviewerName: string,
    notes: string,
    deadlineDays: number = 21,
    items: { field: string; requirement: string }[]
  ): Promise<DesignerVerificationApplication> {
    await new Promise((r) => setTimeout(r, 150));
    const all = getStoredApplications();
    const index = all.findIndex((a) => a.id === id);
    if (index === -1) throw new Error('Application not found');

    const app = all[index];
    const prevStatus = app.status;
    const now = new Date().toISOString();
    const deadline = new Date(Date.now() + deadlineDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const activeQuery: MoreInformationQuery = {
      requestedAt: now,
      requestedBy: reviewerName,
      notes,
      deadlineDate: deadline,
      items: items.map((item, idx) => ({
        id: `q-item-${Date.now()}-${idx}`,
        field: item.field,
        requirement: item.requirement,
        fulfilled: false,
      })),
    };

    const updated: DesignerVerificationApplication = {
      ...app,
      status: 'More Information Required',
      activeQuery,
      updatedAt: now,
      auditTrail: [
        {
          id: `aud-${Date.now()}`,
          timestamp: now,
          actorName: reviewerName,
          actorRole: 'Standards Council',
          fromStatus: prevStatus,
          toStatus: 'More Information Required',
          comment: `Additional documentation requested: ${notes}`,
        },
        ...app.auditTrail,
      ],
    };

    all[index] = updated;
    saveApplications(all);
    return updated;
  },

  /**
   * Designer responds to query -> moves status back to 'Under Review'
   */
  async respondToQuery(
    id: string,
    designerName: string,
    explanation: string,
    responses: { itemId: string; designerResponse: string; documentUrl?: string }[]
  ): Promise<DesignerVerificationApplication> {
    await new Promise((r) => setTimeout(r, 150));
    const all = getStoredApplications();
    const index = all.findIndex((a) => a.id === id);
    if (index === -1) throw new Error('Application not found');

    const app = all[index];
    const prevStatus = app.status;
    const now = new Date().toISOString();

    const currentQuery = app.activeQuery;
    const updatedItems = currentQuery?.items.map((item) => {
      const resp = responses.find((r) => r.itemId === item.id);
      if (resp) {
        return {
          ...item,
          fulfilled: true,
          designerResponse: resp.designerResponse,
          documentUrl: resp.documentUrl || 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&q=80',
        };
      }
      return item;
    }) || [];

    const updated: DesignerVerificationApplication = {
      ...app,
      status: 'Under Review',
      activeQuery: currentQuery
        ? {
            ...currentQuery,
            designerRespondedAt: now,
            designerExplanation: explanation,
            items: updatedItems,
          }
        : undefined,
      updatedAt: now,
      auditTrail: [
        {
          id: `aud-${Date.now()}`,
          timestamp: now,
          actorName: designerName,
          actorRole: 'Designer',
          fromStatus: prevStatus,
          toStatus: 'Under Review',
          comment: `Designer provided supplemental documents: "${explanation.slice(0, 100)}..."`,
        },
        ...app.auditTrail,
      ],
    };

    all[index] = updated;
    saveApplications(all);
    return updated;
  },

  /**
   * Standards Council approves application -> status: 'Approved'
   */
  async approveApplication(
    id: string,
    reviewerName: string,
    tier: 'Maison Accredited' | 'Master Craftsman' | 'Haute Couture Guild' = 'Maison Accredited',
    approvalComment: string = 'Accreditation granted.'
  ): Promise<DesignerVerificationApplication> {
    await new Promise((r) => setTimeout(r, 180));
    const all = getStoredApplications();
    const index = all.findIndex((a) => a.id === id);
    if (index === -1) throw new Error('Application not found');

    const app = all[index];
    const prevStatus = app.status;
    const now = new Date().toISOString();
    const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
    const sealNum = `MD-SEAL-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    const updated: DesignerVerificationApplication = {
      ...app,
      status: 'Approved',
      identity: { ...app.identity, status: 'verified', verifiedAt: now },
      business: { ...app.business, status: 'verified', verifiedAt: now },
      portfolio: { ...app.portfolio, status: 'verified', verifiedAt: now },
      accreditationDetails: {
        sealNumber: sealNum,
        tier,
        approvedAt: now,
        approvedBy: reviewerName,
        expiresAt: expires,
      },
      updatedAt: now,
      auditTrail: [
        {
          id: `aud-${Date.now()}`,
          timestamp: now,
          actorName: reviewerName,
          actorRole: 'Standards Council',
          fromStatus: prevStatus,
          toStatus: 'Approved',
          comment: `${tier} seal granted (${sealNum}). ${approvalComment}`,
        },
        ...app.auditTrail,
      ],
    };

    all[index] = updated;
    saveApplications(all);
    return updated;
  },

  /**
   * Standards Council rejects application -> status: 'Rejected'
   */
  async rejectApplication(
    id: string,
    reviewerName: string,
    reasonCode: 'INSUFFICIENT_PROOFS' | 'SANCTIONS_FLAG' | 'CRAFTSMANSHIP_MISMATCH' | 'DOCUMENT_EXPIRED' | 'UNRESOLVED_QUERY',
    reasonSummary: string
  ): Promise<DesignerVerificationApplication> {
    await new Promise((r) => setTimeout(r, 180));
    const all = getStoredApplications();
    const index = all.findIndex((a) => a.id === id);
    if (index === -1) throw new Error('Application not found');

    const app = all[index];
    const prevStatus = app.status;
    const now = new Date().toISOString();
    const reapplyDate = new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const updated: DesignerVerificationApplication = {
      ...app,
      status: 'Rejected',
      rejectionDetails: {
        rejectedAt: now,
        rejectedBy: reviewerName,
        reasonCode,
        reasonSummary,
        appealAllowed: true,
        reapplicationEligibleDate: reapplyDate,
      },
      updatedAt: now,
      auditTrail: [
        {
          id: `aud-${Date.now()}`,
          timestamp: now,
          actorName: reviewerName,
          actorRole: 'Standards Council',
          fromStatus: prevStatus,
          toStatus: 'Rejected',
          comment: `Application rejected under code ${reasonCode}: ${reasonSummary}`,
        },
        ...app.auditTrail,
      ],
    };

    all[index] = updated;
    saveApplications(all);
    return updated;
  },

  /**
   * Update individual pillar status
   */
  async updatePillarReview(
    id: string,
    pillar: 'identity' | 'business' | 'portfolio',
    status: PillarStatus,
    reviewerNotes: string
  ): Promise<DesignerVerificationApplication> {
    await new Promise((r) => setTimeout(r, 100));
    const all = getStoredApplications();
    const index = all.findIndex((a) => a.id === id);
    if (index === -1) throw new Error('Application not found');

    const app = all[index];
    const now = new Date().toISOString();

    const updated: DesignerVerificationApplication = {
      ...app,
      [pillar]: {
        ...app[pillar],
        status,
        reviewerNotes,
        verifiedAt: status === 'verified' ? now : undefined,
      },
      updatedAt: now,
    };

    all[index] = updated;
    saveApplications(all);
    return updated;
  },

  /**
   * Reset store to initial high-fidelity state
   */
  async resetToDefaults(): Promise<DesignerVerificationApplication[]> {
    localStorage.removeItem(STORAGE_KEY);
    return getStoredApplications();
  },
};
