/**
 * @file mediaCenterStore.ts
 * Reactive state store for Production Video Center & Craftsmanship Media Vault.
 * Manages video streaming items, photo proofs, order associations, and compression metrics.
 */

import { useState, useEffect } from 'react';
import { MediaItem } from '../types/mediaCenter.types';

export const INITIAL_MEDIA_ITEMS: MediaItem[] = [
  {
    id: 'med_001_video_canvas',
    title: 'Floating Horsehair Canvas Pad-Stitching & Lapel Shaping',
    type: 'video',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80',
    durationSeconds: 15,
    originalSizeBytes: 42500000, // 42.5 MB
    compressedSizeBytes: 26350000, // 26.35 MB
    resolution: '1920x1080 (1080p 60fps)',
    mimeType: 'video/mp4',
    orderId: 'ord_dm_9480',
    orderNumber: 'DM-2026-9480',
    customerName: 'Sir Julian Thorne',
    garmentName: 'Anatomical Savile Row Tuxedo Jacket',
    productionStage: 'Sewing',
    artisanName: 'Brigitte Moreau',
    artisanRole: 'Couture Tailor',
    caption: 'Pad-stitching 800 individual silk stitches across the floating natural horsehair canvas to establish anatomical lapel roll tension.',
    tags: ['Canvas Basting', 'Lapel Roll', 'Pad-Stitching', 'Hand Sewing', 'Savile Row'],
    isCustomerVisible: true,
    compression: {
      originalSizeBytes: 42500000,
      compressedSizeBytes: 26350000,
      reductionPercentage: 38,
      codec: 'H.264 / AAC High Profile',
      targetResolution: '1080p (60fps)',
    },
    viewsCount: 142,
    createdAt: '2026-10-12T11:30:00Z',
    updatedAt: '2026-10-12T11:30:00Z',
  },
  {
    id: 'med_002_video_cutting',
    title: 'Cloth Shears Cutting & West Yorkshire Worsted Inlays',
    type: 'video',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
    durationSeconds: 15,
    originalSizeBytes: 38200000, // 38.2 MB
    compressedSizeBytes: 23684000,
    resolution: '1920x1080 (1080p)',
    mimeType: 'video/mp4',
    orderId: 'ord_dm_9481',
    orderNumber: 'DM-2026-9481',
    customerName: 'Lord Alistair Sterling',
    garmentName: 'Savile Row Deconstructed Worsted Coat',
    productionStage: 'Cutting',
    artisanName: 'Henry Alcott',
    artisanRole: 'Senior Cloth Cutter',
    caption: 'Cutting shears applied along hand-drawn chalk lines. Incorporating 3cm bespoke inlay allowances along back and side seams.',
    tags: ['Cloth Cutting', 'Savile Inlay', 'Worsted Wool', 'Shears Work'],
    isCustomerVisible: true,
    compression: {
      originalSizeBytes: 38200000,
      compressedSizeBytes: 23684000,
      reductionPercentage: 38,
      codec: 'H.264 / AAC High',
      targetResolution: '1080p',
    },
    viewsCount: 89,
    createdAt: '2026-10-11T16:00:00Z',
    updatedAt: '2026-10-11T16:00:00Z',
  },
  {
    id: 'med_003_photo_qc',
    title: 'Millimeter Tolerance & Collar Crown Verification',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80',
    originalSizeBytes: 8400000, // 8.4 MB
    compressedSizeBytes: 1850000, // 1.85 MB
    resolution: '3840x2160 (4K UHD)',
    mimeType: 'image/jpeg',
    orderId: 'ord_dm_9480',
    orderNumber: 'DM-2026-9480',
    customerName: 'Sir Julian Thorne',
    garmentName: 'Anatomical Savile Row Tuxedo Jacket',
    productionStage: 'Quality Control',
    artisanName: 'Master Daniel',
    artisanRole: 'Atelier QC Gatekeeper',
    caption: 'Checking chest point-to-point balance against 108cm anatomical specification. Collar hug tolerance verified within 1.5mm.',
    tags: ['Quality Control', 'Tolerance Audit', 'Anatomical Fit', 'Final Inspection'],
    isCustomerVisible: true,
    compression: {
      originalSizeBytes: 8400000,
      compressedSizeBytes: 1850000,
      reductionPercentage: 78,
      codec: 'WebP Matrix Transcode',
      targetResolution: '1920x1080',
    },
    viewsCount: 164,
    createdAt: '2026-10-12T10:15:00Z',
    updatedAt: '2026-10-12T10:15:00Z',
  },
  {
    id: 'med_004_video_buttonhole',
    title: 'Hand-Worked Milanese Lapel Buttonhole with Gimp Silk',
    type: 'video',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
    durationSeconds: 60,
    originalSizeBytes: 68500000, // 68.5 MB
    compressedSizeBytes: 42470000,
    resolution: '1920x1080 (1080p)',
    mimeType: 'video/mp4',
    orderId: 'ord_dm_9478',
    orderNumber: 'DM-2026-9478',
    customerName: 'Elena Rostova',
    garmentName: 'Monolithic Muslin Veil Ensemble',
    productionStage: 'Finishing',
    artisanName: 'Brigitte Moreau',
    artisanRole: 'Hand-Finisher',
    caption: 'Working the raised milanese buttonhole over thick silk gimp cord. Takes approximately 45 minutes of continuous focus per buttonhole.',
    tags: ['Milanese Buttonhole', 'Silk Gimp', 'Hand Finishing', 'Craftsmanship Proof'],
    isCustomerVisible: true,
    compression: {
      originalSizeBytes: 68500000,
      compressedSizeBytes: 42470000,
      reductionPercentage: 38,
      codec: 'H.264 / AAC',
      targetResolution: '1080p',
    },
    viewsCount: 215,
    createdAt: '2026-10-12T09:40:00Z',
    updatedAt: '2026-10-12T09:40:00Z',
  },
  {
    id: 'med_005_photo_denim',
    title: 'Japanese Kuroki 15oz Selvedge Alignment Proof',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80',
    originalSizeBytes: 6900000,
    compressedSizeBytes: 1450000,
    resolution: '3024x4032 (High-Res)',
    mimeType: 'image/jpeg',
    orderId: 'ord_dm_9482',
    orderNumber: 'DM-2026-9482',
    customerName: 'Lady Vivienne Vance',
    garmentName: 'Raw-Hem Japanese Selvedge Denim Trousers',
    productionStage: 'Fabric Selection',
    artisanName: 'Eleanor Vance',
    artisanRole: 'Textile Archivist',
    caption: 'Shuttle-loom red line selvedge ID aligned along the continuous outer seam pattern block.',
    tags: ['Japanese Denim', 'Selvedge ID', 'Kuroki Mills', 'Textile Inspection'],
    isCustomerVisible: true,
    compression: {
      originalSizeBytes: 6900000,
      compressedSizeBytes: 1450000,
      reductionPercentage: 79,
      codec: 'WebP Transcode',
      targetResolution: '1920x2560',
    },
    viewsCount: 97,
    createdAt: '2026-10-12T08:00:00Z',
    updatedAt: '2026-10-12T08:00:00Z',
  },
  {
    id: 'med_006_photo_packaging',
    title: 'Atelier Wax Seal & Breathable Organic Suit Carrier',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80',
    originalSizeBytes: 5200000,
    compressedSizeBytes: 980000,
    resolution: '2560x1440',
    mimeType: 'image/jpeg',
    orderId: 'ord_dm_9478',
    orderNumber: 'DM-2026-9478',
    customerName: 'Elena Rostova',
    garmentName: 'Monolithic Muslin Veil Ensemble',
    productionStage: 'Packaging',
    artisanName: 'Atelier Packaging Team',
    artisanRole: 'Heritage Packager',
    caption: 'Garment steamed and fitted on aromatic cedar hanger, sealed with DANIELS stamped sealing wax and personalized thank you docket.',
    tags: ['Packaging', 'Wax Seal', 'Cedar Hanger', 'White Glove Unboxing'],
    isCustomerVisible: true,
    compression: {
      originalSizeBytes: 5200000,
      compressedSizeBytes: 980000,
      reductionPercentage: 81,
      codec: 'WebP Transcode',
      targetResolution: '1920x1080',
    },
    viewsCount: 112,
    createdAt: '2026-10-12T12:00:00Z',
    updatedAt: '2026-10-12T12:00:00Z',
  },
];

const STORAGE_KEY = 'daniels_media_vault_v1';

class MediaCenterStore {
  private mediaItems: MediaItem[];
  private listeners = new Set<() => void>();

  constructor() {
    this.mediaItems = this.loadInitial();
  }

  private loadInitial(): MediaItem[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Could not load stored media items', e);
    }
    return INITIAL_MEDIA_ITEMS;
  }

  private persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.mediaItems));
    } catch (e) {
      console.warn('Could not persist media items', e);
    }
    this.listeners.forEach((fn) => fn());
  }

  public getMediaItems(): MediaItem[] {
    return this.mediaItems;
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public addMediaItem(item: Omit<MediaItem, 'id' | 'createdAt' | 'updatedAt' | 'viewsCount'>) {
    const newItem: MediaItem = {
      ...item,
      id: `med_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      viewsCount: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.mediaItems = [newItem, ...this.mediaItems];
    this.persist();
    return newItem;
  }

  public updateMediaItem(id: string, updates: Partial<MediaItem>) {
    this.mediaItems = this.mediaItems.map((m) =>
      m.id === id ? { ...m, ...updates, updatedAt: new Date().toISOString() } : m
    );
    this.persist();
  }

  public deleteMediaItem(id: string) {
    this.mediaItems = this.mediaItems.filter((m) => m.id !== id);
    this.persist();
  }

  public toggleCustomerVisibility(id: string) {
    this.mediaItems = this.mediaItems.map((m) =>
      m.id === id ? { ...m, isCustomerVisible: !m.isCustomerVisible, updatedAt: new Date().toISOString() } : m
    );
    this.persist();
  }

  public incrementViews(id: string) {
    this.mediaItems = this.mediaItems.map((m) =>
      m.id === id ? { ...m, viewsCount: m.viewsCount + 1 } : m
    );
    this.persist();
  }

  public resetToDefaults() {
    this.mediaItems = INITIAL_MEDIA_ITEMS;
    this.persist();
  }
}

export const mediaCenterStore = new MediaCenterStore();

export function useMediaCenterStore() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(mediaCenterStore.getMediaItems());

  useEffect(() => {
    const unsubscribe = mediaCenterStore.subscribe(() => {
      setMediaItems(mediaCenterStore.getMediaItems());
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return {
    mediaItems,
    addMediaItem: (item: Omit<MediaItem, 'id' | 'createdAt' | 'updatedAt' | 'viewsCount'>) =>
      mediaCenterStore.addMediaItem(item),
    updateMediaItem: (id: string, updates: Partial<MediaItem>) =>
      mediaCenterStore.updateMediaItem(id, updates),
    deleteMediaItem: (id: string) => mediaCenterStore.deleteMediaItem(id),
    toggleCustomerVisibility: (id: string) => mediaCenterStore.toggleCustomerVisibility(id),
    incrementViews: (id: string) => mediaCenterStore.incrementViews(id),
    resetToDefaults: () => mediaCenterStore.resetToDefaults(),
  };
}
