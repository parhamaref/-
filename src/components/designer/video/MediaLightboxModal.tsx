/**
 * @file MediaLightboxModal.tsx
 * Full-screen modal inspector for craftsmanship videos and high-resolution photo proofs.
 * Integrates AtelierVideoPlayer, compression dossier, order linkage, and customer stream toggles.
 */

import React, { useState } from 'react';
import {
  X,
  Eye,
  Lock,
  ChevronLeft,
  ChevronRight,
  Download,
  Tag,
  User,
  Clock,
  Layers,
  Sparkles,
  Maximize2,
  Minimize2,
  Flame,
  CheckCircle2,
  HardDrive,
} from 'lucide-react';
import { MediaItem } from '../../../types/mediaCenter.types';
import { AtelierVideoPlayer } from './AtelierVideoPlayer';
import { formatBytes, formatDuration } from '../../../utils/mediaCompressor';

export interface MediaLightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaItem: MediaItem | null;
  allItems: MediaItem[];
  onNavigate: (item: MediaItem) => void;
  onToggleVisibility: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const MediaLightboxModal: React.FC<MediaLightboxModalProps> = ({
  isOpen,
  onClose,
  mediaItem,
  allItems,
  onNavigate,
  onToggleVisibility,
}) => {
  const [photoZoom, setPhotoZoom] = useState(false);

  if (!isOpen || !mediaItem) return null;

  const currentIndex = allItems.findIndex((m) => m.id === mediaItem.id);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < allItems.length - 1;

  const handlePrevious = () => {
    if (hasPrevious) onNavigate(allItems[currentIndex - 1]);
  };

  const handleNext = () => {
    if (hasNext) onNavigate(allItems[currentIndex + 1]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-[#0D0D0D] border border-[#2B2B2B] rounded-xs shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        {/* Top Header */}
        <div className="px-5 py-3.5 border-b border-[#222] bg-[#141414] flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <span
              className={`px-2 py-0.5 rounded-xs font-mono text-[9px] uppercase font-bold shrink-0 ${
                mediaItem.type === 'video'
                  ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                  : 'bg-blue-400/20 text-blue-300 border border-blue-400/40'
              }`}
            >
              {mediaItem.type.toUpperCase()}
            </span>
            <h2 className="text-sm font-serif text-white uppercase tracking-wide truncate">
              {mediaItem.title}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {/* Customer Visibility Toggle */}
            <button
              onClick={() => onToggleVisibility(mediaItem.id)}
              className={`px-2.5 py-1 rounded-xs border text-[11px] font-mono flex items-center gap-1.5 cursor-pointer transition-colors ${
                mediaItem.isCustomerVisible
                  ? 'bg-emerald-950/60 border-emerald-700 text-emerald-300'
                  : 'bg-[#1C1C1C] border-[#333] text-neutral-400 hover:text-white'
              }`}
              title="Toggle customer portal visibility"
            >
              {mediaItem.isCustomerVisible ? (
                <>
                  <Eye className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Client Stream: Live</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Atelier Vault Only</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white hover:bg-[#222] rounded-xs transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Main Body (Media + Sidebar Inspector) */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-3">
          {/* Main Media Player / Photo Stage (2 cols) */}
          <div className="lg:col-span-2 bg-black flex items-center justify-center p-3 sm:p-5 relative border-b lg:border-b-0 lg:border-r border-[#222]">
            {/* Previous Button */}
            {hasPrevious && (
              <button
                onClick={handlePrevious}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/60 hover:bg-black/90 border border-white/20 text-white rounded-full transition-all cursor-pointer z-30"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}

            {/* Next Button */}
            {hasNext && (
              <button
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/60 hover:bg-black/90 border border-white/20 text-white rounded-full transition-all cursor-pointer z-30"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}

            {/* Content Renderer */}
            {mediaItem.type === 'video' ? (
              <div className="w-full">
                <AtelierVideoPlayer
                  src={mediaItem.url}
                  poster={mediaItem.thumbnailUrl}
                  title={mediaItem.title}
                  resolutionBadge={mediaItem.resolution}
                  autoPlay={true}
                />
              </div>
            ) : (
              <div className="relative w-full h-full flex items-center justify-center overflow-hidden min-h-[380px] max-h-[70vh]">
                <img
                  src={mediaItem.url}
                  alt={mediaItem.title}
                  onClick={() => setPhotoZoom(!photoZoom)}
                  className={`object-contain transition-transform duration-300 rounded-xs cursor-zoom-in max-h-[68vh] ${
                    photoZoom ? 'scale-150 cursor-zoom-out' : 'scale-100'
                  }`}
                />
                <button
                  onClick={() => setPhotoZoom(!photoZoom)}
                  className="absolute bottom-3 right-3 p-1.5 bg-black/70 border border-white/20 text-white rounded-xs text-xs font-mono flex items-center gap-1 cursor-pointer"
                >
                  {photoZoom ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                  <span>{photoZoom ? 'Fit' : 'Zoom'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Metadata Dossier & Order Linkage (1 col) */}
          <div className="p-5 space-y-5 bg-[#0F0F0F] text-xs font-mono overflow-y-auto max-h-[75vh]">
            {/* Order Association Card */}
            {mediaItem.orderNumber ? (
              <div className="p-3.5 bg-[#141414] border border-amber-500/30 rounded-xs space-y-2">
                <span className="text-[10px] text-amber-400 uppercase tracking-wider block font-bold flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5" />
                  Linked Bespoke Order
                </span>
                <div className="space-y-0.5">
                  <span className="text-white font-bold block">{mediaItem.orderNumber}</span>
                  <span className="text-neutral-300 block truncate">{mediaItem.garmentName}</span>
                  <span className="text-neutral-500 text-[11px] block">
                    Client: <strong className="text-neutral-300">{mediaItem.customerName}</strong>
                  </span>
                  {mediaItem.productionStage && (
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-xs bg-[#222] text-amber-300 text-[10px]">
                      Stage: {mediaItem.productionStage}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-3 bg-[#141414] border border-[#222] rounded-xs text-neutral-500 text-[11px]">
                Not associated with a specific customer order. Stored in Atelier Brand Archive.
              </div>
            )}

            {/* Artisan Narrative / Caption */}
            <div className="space-y-1.5">
              <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">
                Craftsmanship Observation
              </span>
              <p className="text-neutral-200 font-sans text-xs leading-relaxed">
                {mediaItem.caption}
              </p>
            </div>

            {/* Artisan Signature */}
            <div className="p-3 bg-[#141414] border border-[#222] rounded-xs space-y-1">
              <span className="text-[10px] text-neutral-500 uppercase block">Artisan Recorded</span>
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-white font-bold">{mediaItem.artisanName}</span>
                {mediaItem.artisanRole && (
                  <span className="text-neutral-500 text-[10px]">({mediaItem.artisanRole})</span>
                )}
              </div>
            </div>

            {/* Storage & Compression Architecture */}
            <div className="p-3.5 bg-[#141414] border border-[#222] rounded-xs space-y-2">
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider block flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 text-amber-400" />
                Storage & Compression Pipeline
              </span>

              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between text-neutral-400">
                  <span>Resolution:</span>
                  <span className="text-white font-semibold">{mediaItem.resolution}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Original Size:</span>
                  <span className="text-neutral-300">{formatBytes(mediaItem.originalSizeBytes)}</span>
                </div>
                {mediaItem.compressedSizeBytes && (
                  <div className="flex justify-between text-neutral-400">
                    <span>Compressed Stream:</span>
                    <span className="text-emerald-400 font-semibold">
                      {formatBytes(mediaItem.compressedSizeBytes)}
                    </span>
                  </div>
                )}
                {mediaItem.compression && (
                  <div className="flex justify-between text-neutral-400 pt-1 border-t border-[#1F1F1F]">
                    <span>Bandwidth Saved:</span>
                    <span className="text-emerald-300 font-bold">
                      {mediaItem.compression.reductionPercentage}% ({mediaItem.compression.codec})
                    </span>
                  </div>
                )}
                {mediaItem.durationSeconds && (
                  <div className="flex justify-between text-neutral-400">
                    <span>Duration:</span>
                    <span className="text-white">{formatDuration(mediaItem.durationSeconds)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Craftsmanship Tags */}
            <div className="space-y-1.5">
              <span className="text-[10px] text-neutral-500 uppercase tracking-wider block flex items-center gap-1">
                <Tag className="w-3 h-3 text-amber-400" />
                Craftsmanship Tags ({mediaItem.tags.length})
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {mediaItem.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-xs bg-[#1A1A1A] border border-[#2B2B2B] text-neutral-300 text-[10px]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Timestamp & Views */}
            <div className="pt-2 border-t border-[#222] flex items-center justify-between text-[10px] text-neutral-500">
              <span>Added: {new Date(mediaItem.createdAt).toLocaleDateString()}</span>
              <span>{mediaItem.viewsCount} Atelier Views</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
