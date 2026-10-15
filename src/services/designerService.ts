/**
 * @file designerService.ts
 * Enterprise API service for the Designer Dashboard operations.
 * Manages Profile, Atelier Dossier, Portfolio Gallery, Assets, and KPI feeds.
 */

import { apiClient, ApiResponse } from './apiClient';
import {
  DesignerProfile,
  DesignerNotification,
  DesignerSettings,
  PortfolioItem,
} from '../types/designer.types';
import {
  CustomizationTemplate,
  CustomizationOptionGroup,
  CompatibilityRule,
} from '../types/customization.types';
import {
  GarmentMeasurementTemplate,
  MeasurementFieldConfig,
  MeasurementValidationRule,
} from '../types/measurementConfig.types';

const LOCAL_STORAGE_PROFILE_KEY = 'daniels_designer_profile_cache';
const LOCAL_STORAGE_CUSTOMIZATION_KEY = 'daniels_customization_template_v1';
const LOCAL_STORAGE_MEASUREMENTS_KEY = 'daniels_measurement_templates_v1';

export const designerService = {
  // 1. Profile & Studio Settings
  async getProfile(): Promise<ApiResponse<DesignerProfile>> {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_PROFILE_KEY);
      if (cached) {
        return {
          data: JSON.parse(cached),
          success: true,
          timestamp: new Date().toISOString(),
        };
      }
    } catch {
      // LocalStorage error fallback
    }

    // Call REST endpoint
    const res = await apiClient.get<DesignerProfile>('/designer/me');
    return res;
  },

  async updateProfile(payload: Partial<DesignerProfile>): Promise<ApiResponse<DesignerProfile>> {
    // Optimistically update localStorage cache
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_PROFILE_KEY);
      const current = cached ? JSON.parse(cached) : {};
      const updated = {
        ...current,
        ...payload,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not cache designer profile in localStorage', e);
    }

    const res = await apiClient.put<DesignerProfile>('/designer/me', payload);
    return res;
  },

  // 2. Image Upload System
  async uploadImage(
    fileOrUrl: File | string,
    category: 'logo' | 'cover' | 'avatar' | 'portfolio'
  ): Promise<ApiResponse<{ url: string; filename: string; sizeBytes?: number }>> {
    if (typeof fileOrUrl === 'string') {
      // Direct remote URL or data URL
      return {
        data: {
          url: fileOrUrl,
          filename: `${category}_${Date.now()}.png`,
        },
        success: true,
        timestamp: new Date().toISOString(),
      };
    }

    // Process File via FileReader to base64 DataURL
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const resultUrl = reader.result as string;
        resolve({
          data: {
            url: resultUrl,
            filename: fileOrUrl.name,
            sizeBytes: fileOrUrl.size,
          },
          success: true,
          timestamp: new Date().toISOString(),
        });
      };
      reader.onerror = () => {
        resolve({
          data: {
            url: '',
            filename: fileOrUrl.name,
          },
          success: false,
          message: 'Failed to process local file reader',
          timestamp: new Date().toISOString(),
        });
      };
      reader.readAsDataURL(fileOrUrl);
    });
  },

  // 3. Portfolio Management
  async getPortfolio(): Promise<ApiResponse<PortfolioItem[]>> {
    const profileRes = await this.getProfile();
    return {
      data: profileRes.data?.portfolioGallery || [],
      success: true,
      timestamp: new Date().toISOString(),
    };
  },

  async addPortfolioItem(
    item: Omit<PortfolioItem, 'id' | 'createdAt'>
  ): Promise<ApiResponse<PortfolioItem>> {
    const newItem: PortfolioItem = {
      ...item,
      id: `port_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      createdAt: new Date().toISOString(),
    };

    // Update in local cache
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_PROFILE_KEY);
      if (cached) {
        const profile: DesignerProfile = JSON.parse(cached);
        const gallery = [newItem, ...(profile.portfolioGallery || [])];
        profile.portfolioGallery = gallery;
        localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(profile));
      }
    } catch (e) {
      console.warn('Portfolio storage sync failed', e);
    }

    return {
      data: newItem,
      success: true,
      timestamp: new Date().toISOString(),
    };
  },

  async updatePortfolioItem(
    id: string,
    updates: Partial<PortfolioItem>
  ): Promise<ApiResponse<PortfolioItem>> {
    let updatedItem: PortfolioItem | null = null;
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_PROFILE_KEY);
      if (cached) {
        const profile: DesignerProfile = JSON.parse(cached);
        profile.portfolioGallery = (profile.portfolioGallery || []).map((it) => {
          if (it.id === id) {
            updatedItem = { ...it, ...updates, updatedAt: new Date().toISOString() };
            return updatedItem;
          }
          return it;
        });
        localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(profile));
      }
    } catch (e) {
      console.warn('Portfolio storage sync failed', e);
    }

    return {
      data: updatedItem as any,
      success: !!updatedItem,
      timestamp: new Date().toISOString(),
    };
  },

  async deletePortfolioItem(id: string): Promise<ApiResponse<{ success: boolean; id: string }>> {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_PROFILE_KEY);
      if (cached) {
        const profile: DesignerProfile = JSON.parse(cached);
        profile.portfolioGallery = (profile.portfolioGallery || []).filter((it) => it.id !== id);
        localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(profile));
      }
    } catch (e) {
      console.warn('Portfolio storage sync failed', e);
    }

    return {
      data: { success: true, id },
      success: true,
      timestamp: new Date().toISOString(),
    };
  },

  // 4. Overview & Analytics KPIs
  async getOverviewStats(): Promise<
    ApiResponse<{
      totalSales: number;
      revenueGbp: number;
      totalOrders: number;
      activeOrders: number;
      completedOrders: number;
      pendingOrders: number;
      cancelledOrders: number;
      customerRating: number;
      reviewCount: number;
      productViews: number;
      conversionRate: number;
    }>
  > {
    return apiClient.get('/designer/analytics/overview');
  },

  // 5. Notifications & Feeds
  async getNotifications(): Promise<ApiResponse<DesignerNotification[]>> {
    return apiClient.get<DesignerNotification[]>('/designer/notifications');
  },

  async markNotificationRead(id: string): Promise<ApiResponse<{ success: boolean }>> {
    return apiClient.put(`/designer/notifications/${id}/read`);
  },

  async markAllNotificationsRead(): Promise<ApiResponse<{ success: boolean }>> {
    return apiClient.put('/designer/notifications/read-all');
  },

  // 6. Settings
  async getSettings(): Promise<ApiResponse<DesignerSettings>> {
    return apiClient.get<DesignerSettings>('/designer/settings');
  },

  async updateSettings(settings: Partial<DesignerSettings>): Promise<ApiResponse<DesignerSettings>> {
    return apiClient.put<DesignerSettings>('/designer/settings', settings);
  },

  // 7. Product Customization Builder
  async getCustomizationTemplate(): Promise<ApiResponse<CustomizationTemplate>> {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_CUSTOMIZATION_KEY);
      if (cached) {
        return { data: JSON.parse(cached), success: true, timestamp: new Date().toISOString() };
      }
    } catch {}
    return apiClient.get<CustomizationTemplate>('/designer/customization/template');
  },

  async saveCustomizationTemplate(template: CustomizationTemplate): Promise<ApiResponse<CustomizationTemplate>> {
    try {
      localStorage.setItem(LOCAL_STORAGE_CUSTOMIZATION_KEY, JSON.stringify(template));
    } catch (e) {
      console.warn('Could not cache customization template', e);
    }
    return apiClient.put<CustomizationTemplate>('/designer/customization/template', template);
  },

  // 8. Made-to-Measure Garment Templates
  async getMeasurementTemplates(): Promise<ApiResponse<GarmentMeasurementTemplate[]>> {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_MEASUREMENTS_KEY);
      if (cached) {
        return { data: JSON.parse(cached), success: true, timestamp: new Date().toISOString() };
      }
    } catch {}
    return apiClient.get<GarmentMeasurementTemplate[]>('/designer/measurements/templates');
  },

  async saveMeasurementTemplate(template: GarmentMeasurementTemplate): Promise<ApiResponse<GarmentMeasurementTemplate>> {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_MEASUREMENTS_KEY);
      const list: GarmentMeasurementTemplate[] = cached ? JSON.parse(cached) : [];
      const updated = list.some(t => t.id === template.id)
        ? list.map(t => (t.id === template.id ? template : t))
        : [...list, template];
      localStorage.setItem(LOCAL_STORAGE_MEASUREMENTS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not cache measurement template', e);
    }
    return apiClient.put<GarmentMeasurementTemplate>(`/designer/measurements/templates/${template.id}`, template);
  },

  // 9. Production Workflow Module
  async getProductionWorkflows(): Promise<ApiResponse<any[]>> {
    const cached = localStorage.getItem('daniels_production_workflows_v1');
    if (cached) {
      return { data: JSON.parse(cached), success: true, timestamp: new Date().toISOString() };
    }
    return apiClient.get('/designer/production/workflows');
  },

  async updateProductionStage(workflowId: string, stageName: string, updates: any): Promise<ApiResponse<any>> {
    return apiClient.put(`/designer/production/workflows/${workflowId}/stages/${encodeURIComponent(stageName)}`, updates);
  },

  async addProductionStageNote(workflowId: string, stageName: string, note: any): Promise<ApiResponse<any>> {
    return apiClient.post(`/designer/production/workflows/${workflowId}/stages/${encodeURIComponent(stageName)}/notes`, note);
  },

  // 10. Production Video Center & Media Vault
  async getMediaItems(): Promise<ApiResponse<any[]>> {
    const cached = localStorage.getItem('daniels_media_vault_v1');
    if (cached) {
      return { data: JSON.parse(cached), success: true, timestamp: new Date().toISOString() };
    }
    return apiClient.get('/designer/media');
  },

  async saveMediaItem(mediaItem: any): Promise<ApiResponse<any>> {
    return apiClient.post('/designer/media', mediaItem);
  },

  async deleteMediaItem(mediaId: string): Promise<ApiResponse<any>> {
    return apiClient.delete(`/designer/media/${mediaId}`);
  },

  // 11. Customer Communication Center
  async getConversations(): Promise<ApiResponse<any[]>> {
    const cached = localStorage.getItem('daniels_communication_threads_v1');
    if (cached) {
      return { data: JSON.parse(cached), success: true, timestamp: new Date().toISOString() };
    }
    return apiClient.get('/designer/communication/conversations');
  },

  async getMessages(conversationId: string): Promise<ApiResponse<any[]>> {
    const cached = localStorage.getItem('daniels_communication_messages_v1');
    if (cached) {
      const map = JSON.parse(cached);
      return { data: map[conversationId] || [], success: true, timestamp: new Date().toISOString() };
    }
    return apiClient.get(`/designer/communication/conversations/${conversationId}/messages`);
  },

  async sendMessage(conversationId: string, payload: any): Promise<ApiResponse<any>> {
    return apiClient.post(`/designer/communication/conversations/${conversationId}/messages`, payload);
  },

  async requestMeasurements(conversationId: string, payload: any): Promise<ApiResponse<any>> {
    return apiClient.post(`/designer/communication/conversations/${conversationId}/measurement-requests`, payload);
  },
};
