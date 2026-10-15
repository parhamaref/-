/**
 * @file alterationApi.ts
 * API Client & Service endpoints for the Daniel’s Maison Alteration & Tailoring Request Module.
 * Implements REST endpoints for:
 * - Submitting alteration requests
 * - Progress tracking through the 6 workflow stages:
 *   Submitted → Reviewed → Approved → In Alteration → Completed → Returned
 * - Photo uploads and annotation
 * - Master Tailor approvals and chalk notes
 */

import {
  AlterationRequest,
  AlterationWorkflowStage,
  AlterationPhoto,
  DesiredFitChange,
  AlterationTimelineStep,
} from '../types/alteration.types';
import { INITIAL_MOCK_ALTERATION_REQUESTS } from '../mock/alterationMockData';

// Persistent memory storage
let ALTERATION_CACHE: AlterationRequest[] = [...INITIAL_MOCK_ALTERATION_REQUESTS];

export const AlterationApiService = {
  /**
   * GET /api/alterations
   * Fetch all alteration requests with optional filters
   */
  async getAlterations(filter?: {
    customerId?: string;
    stage?: AlterationWorkflowStage | 'ALL';
    wardrobeItemId?: string;
  }): Promise<AlterationRequest[]> {
    await new Promise((res) => setTimeout(res, 60));
    return ALTERATION_CACHE.filter((item) => {
      if (filter?.customerId && item.customerId !== filter.customerId) return false;
      if (filter?.stage && filter.stage !== 'ALL' && item.currentStage !== filter.stage) return false;
      if (filter?.wardrobeItemId && item.wardrobeItemId !== filter.wardrobeItemId) return false;
      return true;
    });
  },

  /**
   * GET /api/alterations/:id
   * Fetch single alteration request by ID
   */
  async getAlterationById(id: string): Promise<AlterationRequest | null> {
    await new Promise((res) => setTimeout(res, 50));
    return ALTERATION_CACHE.find((a) => a.id === id) || null;
  },

  /**
   * POST /api/alterations
   * Submit a new alteration request from customer or concierge
   */
  async submitAlterationRequest(payload: {
    customerId: string;
    customerName: string;
    customerEmail?: string;
    customerPhone?: string;
    wardrobeItemId: string;
    garmentName: string;
    garmentCategory: any;
    garmentSilhouette: string;
    garmentSerial: string;
    primaryImageUrl: string;
    originalPriceGbp: number;
    originalTailorName: string;
    fitChanges: DesiredFitChange[];
    alterationNotes: string;
    bodyPostureNotice?: 'REGULAR_POSTURE' | 'ERECT_POSTURE' | 'SLIGHT_STOOP' | 'LOW_RIGHT_SHOULDER' | 'PROMINENT_BLADES';
    wearOccasion?: string;
    urgencyLevel: 'STANDARD' | 'EXPEDITED' | 'ROYAL_SALON';
    photos: AlterationPhoto[];
    conciergePickup: boolean;
    pickupAddress: string;
    deliveryAddress: string;
    preferredSalon?: string;
  }): Promise<AlterationRequest> {
    await new Promise((res) => setTimeout(res, 120));

    const newId = `ALT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const nowIso = new Date().toISOString();

    const initialTimeline: AlterationTimelineStep[] = [
      {
        stage: 'SUBMITTED',
        title: 'Alteration Request Submitted',
        description: `Request registered for ${payload.garmentName} with ${payload.fitChanges.length} fit adjustments.`,
        timestamp: nowIso,
        completed: true,
        actorName: payload.customerName,
        actorRole: 'CLIENT',
      },
      {
        stage: 'REVIEWED',
        title: 'Master Tailor Dossier Review',
        description: 'Atelier lead tailor examines fit photos and chalk specifications.',
        timestamp: '',
        completed: false,
        actorName: 'Pending Tailor',
        actorRole: 'MASTER_TAILOR',
      },
      {
        stage: 'APPROVED',
        title: 'Atelier Work Order Approved',
        description: 'Work order cleared for artisan cutting bench.',
        timestamp: '',
        completed: false,
        actorName: 'Atelier Directorate',
        actorRole: 'CONCIERGE',
      },
      {
        stage: 'IN_ALTERATION',
        title: 'Hand Tailoring In Progress',
        description: 'Precision artisan alterations underway at Savile Row salon.',
        timestamp: '',
        completed: false,
        actorName: 'Savile Row Artisan Guild',
        actorRole: 'MASTER_TAILOR',
      },
      {
        stage: 'COMPLETED',
        title: 'Quality Inspection & Steam Press',
        description: 'Final multi-point fit audit and contoured steam press.',
        timestamp: '',
        completed: false,
        actorName: 'Chief Quality Inspector',
        actorRole: 'MASTER_TAILOR',
      },
      {
        stage: 'RETURNED',
        title: 'Dispatched & Returned to Wardrobe',
        description: 'Returned to client residence in protective canvas wardrobe case.',
        timestamp: '',
        completed: false,
        actorName: 'Private Valet Courier',
        actorRole: 'COURIER',
      },
    ];

    const newRequest: AlterationRequest = {
      id: newId,
      customerId: payload.customerId,
      customerName: payload.customerName,
      customerEmail: payload.customerEmail,
      customerPhone: payload.customerPhone,
      wardrobeItemId: payload.wardrobeItemId,
      garmentName: payload.garmentName,
      garmentCategory: payload.garmentCategory,
      garmentSilhouette: payload.garmentSilhouette,
      garmentSerial: payload.garmentSerial,
      primaryImageUrl: payload.primaryImageUrl,
      originalPriceGbp: payload.originalPriceGbp,
      originalTailorName: payload.originalTailorName,
      currentStage: 'SUBMITTED',
      submittedAt: nowIso,
      fitChanges: payload.fitChanges,
      alterationNotes: payload.alterationNotes,
      bodyPostureNotice: payload.bodyPostureNotice || 'REGULAR_POSTURE',
      wearOccasion: payload.wearOccasion,
      urgencyLevel: payload.urgencyLevel,
      photos: payload.photos,
      assignedTailorName: 'Master Tailor Henri Laurent',
      atelierBranch: payload.preferredSalon || 'Mayfair Salon & Workshop, 14 Savile Row, London',
      estimatedCostGbp: 0,
      isComplimentaryWarranty: true,
      warrantySerialNumber: `DAN-WARR-${Math.floor(10000 + Math.random() * 90000)}`,
      conciergePickup: payload.conciergePickup,
      pickupAddress: payload.pickupAddress,
      deliveryAddress: payload.deliveryAddress,
      trackingNumber: `MD-ALT-${Math.floor(100000 + Math.random() * 900000)}-GB`,
      courierServiceName: 'Daniel’s Maison White-Glove Valet',
      timeline: initialTimeline,
    };

    ALTERATION_CACHE = [newRequest, ...ALTERATION_CACHE];
    return newRequest;
  },

  /**
   * PATCH /api/alterations/:id/stage
   * Advance or set workflow stage:
   * SUBMITTED → REVIEWED → APPROVED → IN_ALTERATION → COMPLETED → RETURNED
   */
  async updateWorkflowStage(
    id: string,
    nextStage: AlterationWorkflowStage,
    notes?: string,
    actorName: string = 'Master Tailor Henri Laurent',
    actorRole: 'CLIENT' | 'CONCIERGE' | 'MASTER_TAILOR' | 'CHIEF_CUTTER' | 'COURIER' = 'MASTER_TAILOR',
    afterPhotoUrl?: string
  ): Promise<AlterationRequest> {
    await new Promise((res) => setTimeout(res, 80));
    const target = ALTERATION_CACHE.find((a) => a.id === id);
    if (!target) throw new Error('Alteration request not found');

    const nowIso = new Date().toISOString();

    // Map stage completion in timeline
    const stagesOrder: AlterationWorkflowStage[] = [
      'SUBMITTED',
      'REVIEWED',
      'APPROVED',
      'IN_ALTERATION',
      'COMPLETED',
      'RETURNED',
    ];

    const targetIndex = stagesOrder.indexOf(nextStage);

    const updatedTimeline = target.timeline.map((step) => {
      const stepIdx = stagesOrder.indexOf(step.stage);
      if (stepIdx <= targetIndex) {
        return {
          ...step,
          completed: true,
          timestamp: step.timestamp || nowIso,
          actorName: stepIdx === targetIndex ? actorName : step.actorName,
          notes: stepIdx === targetIndex && notes ? notes : step.notes,
        };
      }
      return {
        ...step,
        completed: false,
      };
    });

    const updatedRequest: AlterationRequest = {
      ...target,
      currentStage: nextStage,
      timeline: updatedTimeline,
      tailorChalkNotes: notes ? `${target.tailorChalkNotes ? target.tailorChalkNotes + '\n' : ''}[${nextStage}]: ${notes}` : target.tailorChalkNotes,
    };

    if (nextStage === 'REVIEWED') updatedRequest.reviewedAt = nowIso;
    if (nextStage === 'APPROVED') updatedRequest.approvedAt = nowIso;
    if (nextStage === 'IN_ALTERATION') updatedRequest.inAlterationAt = nowIso;
    if (nextStage === 'COMPLETED') updatedRequest.completedAt = nowIso;
    if (nextStage === 'RETURNED') updatedRequest.returnedAt = nowIso;

    if (afterPhotoUrl) {
      const newAfterPhoto: AlterationPhoto = {
        id: `photo_after_${Date.now()}`,
        url: afterPhotoUrl,
        angle: 'DETAIL_PINPOINT',
        caption: `Completed alteration inspection verification [${nextStage}]`,
        uploadedAt: nowIso,
        isAfterPhoto: true,
      };
      updatedRequest.afterPhotos = [...(updatedRequest.afterPhotos || []), newAfterPhoto];
    }

    ALTERATION_CACHE = ALTERATION_CACHE.map((a) => (a.id === id ? updatedRequest : a));
    return updatedRequest;
  },

  /**
   * POST /api/alterations/:id/photos
   * Add a fitting photo with optional pin markers
   */
  async addPhoto(id: string, photo: Omit<AlterationPhoto, 'id' | 'uploadedAt'>): Promise<AlterationPhoto> {
    await new Promise((res) => setTimeout(res, 60));
    const target = ALTERATION_CACHE.find((a) => a.id === id);
    if (!target) throw new Error('Alteration request not found');

    const newPhoto: AlterationPhoto = {
      ...photo,
      id: `photo_${Date.now()}`,
      uploadedAt: new Date().toISOString(),
    };

    target.photos = [...target.photos, newPhoto];
    return newPhoto;
  },
};
