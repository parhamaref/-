/**
 * @file wardrobeApi.ts
 * API Service & HTTP Client endpoints for the Daniel’s Maison Digital Wardrobe System.
 * Implements REST endpoints for wardrobe browsing, service request pipelines,
 * reordering, alterations, and designer workshop status updates.
 */

import {
  WardrobeItemFull,
  WardrobeServiceRequest,
  ServiceActionType,
  GarmentStatus,
  ServiceRequestStatus,
  AlterationHistoryRecord,
} from '../types/wardrobe.types';
import { INITIAL_MOCK_WARDROBE_ITEMS, INITIAL_MOCK_SERVICE_REQUESTS } from '../mock/wardrobeMockData';

// In-memory persistent cache for client runtime
let WARDROBE_CACHE: WardrobeItemFull[] = [...INITIAL_MOCK_WARDROBE_ITEMS];
let SERVICE_REQUESTS_CACHE: WardrobeServiceRequest[] = [...INITIAL_MOCK_SERVICE_REQUESTS];

export const WardrobeApiService = {
  /**
   * GET /api/wardrobe
   * Fetch all purchased garments in the client's wardrobe
   */
  async getWardrobe(customerId?: string): Promise<WardrobeItemFull[]> {
    await new Promise((res) => setTimeout(res, 80));
    if (!customerId) return WARDROBE_CACHE;
    return WARDROBE_CACHE.filter((item) => item.customerId === customerId);
  },

  /**
   * GET /api/wardrobe/:id
   * Fetch a single garment by unique wardrobe ID
   */
  async getGarmentById(id: string): Promise<WardrobeItemFull | null> {
    await new Promise((res) => setTimeout(res, 50));
    return WARDROBE_CACHE.find((item) => item.id === id) || null;
  },

  /**
   * POST /api/wardrobe/:id/reorder
   * Reorder the same item using identical pattern geometry
   */
  async reorderGarment(
    itemId: string,
    options: {
      customFabricChoice?: string;
      repeatMeasurementsConfirmed: boolean;
      additionalLiningMonogram?: string;
      conciergeNotes?: string;
    }
  ): Promise<{ success: boolean; newOrderId: string; message: string }> {
    await new Promise((res) => setTimeout(res, 120));
    const target = WARDROBE_CACHE.find((i) => i.id === itemId);
    if (!target) throw new Error('Garment not found in archive');

    const newOrderId = `ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Add service request
    const newServiceReq: WardrobeServiceRequest = {
      id: `srv-reorder-${Date.now()}`,
      wardrobeItemId: target.id,
      garmentName: target.garmentName,
      category: target.category,
      customerId: target.customerId,
      customerName: target.customerName,
      actionType: 'REORDER_SAME_ITEM',
      status: 'SUBMITTED',
      requestedDate: new Date().toISOString(),
      targetCompletionDate: new Date(Date.now() + 21 * 86400000).toISOString(),
      urgencyLevel: 'STANDARD',
      specificInstructions: options.conciergeNotes || 'Reorder identical silhouette and measurements.',
      conciergePickupRequested: false,
      pickupAddress: 'N/A — Digital Bespoke Reorder',
      preferredFittingSalon: target.atelierLocation,
      estimatedCostGbp: target.originalPriceGbp,
      assignedArtisanName: target.masterTailorName,
      reorderOptions: options,
      timeline: [
        {
          status: 'SUBMITTED',
          title: 'Repeat Commission Queued',
          description: `Commission ${newOrderId} created with identical biometric pattern.`,
          timestamp: new Date().toISOString(),
          completed: true,
          actor: 'Patron',
        },
      ],
    };

    SERVICE_REQUESTS_CACHE = [newServiceReq, ...SERVICE_REQUESTS_CACHE];

    return {
      success: true,
      newOrderId,
      message: `Your repeat bespoke commission (${newOrderId}) has been queued with Master Tailor ${target.masterTailorName}.`,
    };
  },

  /**
   * POST /api/wardrobe/:id/service-request
   * Submit Alteration, Repair, Care, Cleaning, or Recreation request
   */
  async submitServiceRequest(
    payload: Omit<WardrobeServiceRequest, 'id' | 'requestedDate' | 'timeline' | 'status'>
  ): Promise<WardrobeServiceRequest> {
    await new Promise((res) => setTimeout(res, 100));

    const newRequest: WardrobeServiceRequest = {
      ...payload,
      id: `srv-${Date.now()}`,
      status: 'SUBMITTED',
      requestedDate: new Date().toISOString(),
      timeline: [
        {
          status: 'SUBMITTED',
          title: 'Service Request Registered',
          description: `White-glove concierge protocol initialized for ${payload.actionType.replace(/_/g, ' ')}.`,
          timestamp: new Date().toISOString(),
          completed: true,
          actor: 'Client Salon',
        },
      ],
    };

    SERVICE_REQUESTS_CACHE = [newRequest, ...SERVICE_REQUESTS_CACHE];

    // Update garment status in cache
    let updatedGarmentStatus: GarmentStatus = 'IN_ATELIER';
    if (payload.actionType === 'REQUEST_ALTERATION') updatedGarmentStatus = 'ALTERATION_IN_PROGRESS';
    else if (payload.actionType === 'REQUEST_REPAIR') updatedGarmentStatus = 'REPAIR_IN_PROGRESS';
    else if (payload.actionType === 'REQUEST_CLEANING_SERVICE') updatedGarmentStatus = 'CLEANING_IN_PROGRESS';
    else if (payload.actionType === 'REQUEST_CARE_SERVICE') updatedGarmentStatus = 'CARE_IN_PROGRESS';

    WARDROBE_CACHE = WARDROBE_CACHE.map((item) =>
      item.id === payload.wardrobeItemId ? { ...item, status: updatedGarmentStatus } : item
    );

    return newRequest;
  },

  /**
   * GET /api/wardrobe/services
   * Fetch all service requests (Customer or Designer view)
   */
  async getServiceRequests(filter?: {
    customerId?: string;
    wardrobeItemId?: string;
    status?: ServiceRequestStatus;
  }): Promise<WardrobeServiceRequest[]> {
    await new Promise((res) => setTimeout(res, 60));
    return SERVICE_REQUESTS_CACHE.filter((req) => {
      if (filter?.customerId && req.customerId !== filter.customerId) return false;
      if (filter?.wardrobeItemId && req.wardrobeItemId !== filter.wardrobeItemId) return false;
      if (filter?.status && req.status !== filter.status) return false;
      return true;
    });
  },

  /**
   * PATCH /api/wardrobe/:id/status
   * Designer updates garment status
   */
  async updateGarmentStatus(itemId: string, newStatus: GarmentStatus): Promise<WardrobeItemFull> {
    await new Promise((res) => setTimeout(res, 80));
    const target = WARDROBE_CACHE.find((i) => i.id === itemId);
    if (!target) throw new Error('Garment not found');

    const updated = { ...target, status: newStatus };
    WARDROBE_CACHE = WARDROBE_CACHE.map((i) => (i.id === itemId ? updated : i));
    return updated;
  },

  /**
   * PATCH /api/wardrobe/services/:serviceId/status
   * Designer updates service request status & appends timeline step
   */
  async updateServiceStatus(
    serviceId: string,
    newStatus: ServiceRequestStatus,
    notes: string,
    tailorName: string = 'Master Tailor Henri Laurent'
  ): Promise<WardrobeServiceRequest> {
    await new Promise((res) => setTimeout(res, 80));
    const target = SERVICE_REQUESTS_CACHE.find((s) => s.id === serviceId);
    if (!target) throw new Error('Service request not found');

    const newStep = {
      status: newStatus,
      title: newStatus.replace(/_/g, ' '),
      description: notes || `Service milestone transitioned to ${newStatus}.`,
      timestamp: new Date().toISOString(),
      completed: true,
      actor: tailorName,
    };

    const updated: WardrobeServiceRequest = {
      ...target,
      status: newStatus,
      assignedArtisanName: tailorName,
      timeline: [...target.timeline, newStep],
    };

    SERVICE_REQUESTS_CACHE = SERVICE_REQUESTS_CACHE.map((s) =>
      s.id === serviceId ? updated : s
    );

    // If completed or dispatched, restore garment status
    if (newStatus === 'COMPLETED' || newStatus === 'DISPATCHED_TO_CLIENT') {
      const gStatus: GarmentStatus =
        newStatus === 'COMPLETED' ? 'IN_WARDROBE' : 'DISPATCHED_RETURN';
      WARDROBE_CACHE = WARDROBE_CACHE.map((item) =>
        item.id === target.wardrobeItemId ? { ...item, status: gStatus } : item
      );
    }

    return updated;
  },

  /**
   * POST /api/wardrobe/:id/alterations
   * Add a recorded alteration into the permanent garment history
   */
  async recordAlteration(
    itemId: string,
    alteration: Omit<AlterationHistoryRecord, 'id' | 'alterationDate'>
  ): Promise<AlterationHistoryRecord> {
    await new Promise((res) => setTimeout(res, 90));
    const newRecord: AlterationHistoryRecord = {
      ...alteration,
      id: `alt-${Date.now()}`,
      alterationDate: new Date().toISOString(),
    };

    WARDROBE_CACHE = WARDROBE_CACHE.map((item) =>
      item.id === itemId
        ? { ...item, alterations: [newRecord, ...item.alterations] }
        : item
    );

    return newRecord;
  },
};
