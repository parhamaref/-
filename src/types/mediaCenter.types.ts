/**
 * @file mediaCenter.types.ts
 * Schemas and interfaces for the Production Video Center.
 * Handles craftsmanship video streaming, photo proof uploads, compression pipelines,
 * multi-tag taxonomy, and customer order associations.
 */

import { ProductionStageName } from './productionWorkflow.types';

export type MediaItemType = 'video' | 'photo';

export type CompressionPreset = 'ultra' | 'balanced' | 'archive' | 'passthrough';

export interface CompressionMetrics {
  originalSizeBytes: number;
  compressedSizeBytes: number;
  reductionPercentage: number;
  codec: string; // e.g. "H.264 / AAC", "WebP", "AVIF"
  targetResolution: string; // e.g. "1080p", "720p", "4K"
}

export interface MediaItem {
  id: string;
  title: string;
  type: MediaItemType;
  url: string; // Direct streaming video URL or image URL
  thumbnailUrl: string;
  durationSeconds?: number; // Only for videos
  originalSizeBytes: number;
  compressedSizeBytes?: number;
  resolution: string; // e.g. "1920x1080 (1080p)", "3840x2160 (4K)"
  mimeType: string;
  
  // Order association
  orderId?: string;
  orderNumber?: string; // e.g. "DM-2026-9480"
  customerName?: string;
  garmentName?: string;
  
  // Production metadata
  productionStage?: ProductionStageName;
  artisanName: string;
  artisanRole?: string;
  caption: string;
  tags: string[]; // e.g. ["Canvas Basting", "Lapel Roll", "QC Inspection"]
  isCustomerVisible: boolean; // Published to customer transparency portal
  
  // Metrics & Stats
  compression?: CompressionMetrics;
  viewsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface UploadQueueItem {
  id: string;
  fileName: string;
  fileSize: number;
  type: MediaItemType;
  status: 'queued' | 'compressing' | 'uploading' | 'processing' | 'completed' | 'error';
  progress: number; // 0 to 100%
  speedMbps: number;
  estimatedRemainingSeconds: number;
  compressionSavingsPercent: number;
  errorMessage?: string;
  previewUrl?: string;
}

export interface MediaFilterState {
  searchQuery: string;
  type: 'all' | 'video' | 'photo';
  orderId: string; // 'all' or specific orderId
  stage: string; // 'all' or specific stage
  tag: string; // 'all' or specific tag
  customerVisibility: 'all' | 'visible' | 'hidden';
  sortBy: 'newest' | 'oldest' | 'size' | 'duration';
}
