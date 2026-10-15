/**
 * @file PortfolioLightboxModal.tsx
 * Full-fidelity lightbox viewer for inspecting designer portfolio pieces,
 * bespoke garment construction notes, provenance, and high-resolution textures.
 */

import React from 'react';
import {
  X,
  Calendar,
  User,
  Star,
  Tag,
  Edit2,
  Trash2,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { PortfolioItem } from '../../../types/designer.types';

export interface PortfolioLightboxModalProps {
  item: PortfolioItem | null;
  onClose: () => void;
  onEdit: (item: PortfolioItem) => void;
  onDelete: (id: string) => void;
  onToggleFeatured: (id: string) => void;
}

export const PortfolioLightboxModal: React.FC<PortfolioLightboxModalProps> = ({
  item,
  onClose,
  onEdit,
  onDelete,
  onToggleFeatured,
}) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-[#0C0C0C] border border-[#2B2B2B] rounded-xs shadow-2xl overflow-hidden flex flex-col lg:flex-row max-h-[92vh]">
        {/* Close Button Floating */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-black/60 hover:bg-neutral-800 text-neutral-300 hover:text-white rounded-full transition-colors cursor-pointer border border-[#333]"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left: High-Res Image Presentation */}
        <div className="lg:w-3/5 bg-black flex items-center justify-center p-4 relative overflow-hidden group">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="max-h-[50vh] lg:max-h-[85vh] w-auto max-w-full object-contain rounded-xs"
          />

          {item.featured && (
            <div className="absolute top-4 left-4 px-3 py-1 bg-amber-400 text-black text-[10px] font-mono uppercase tracking-wider font-bold rounded-xs flex items-center gap-1.5 shadow-lg">
              <Star className="w-3 h-3 fill-black" />
              Featured Masterpiece
            </div>
          )}

          <div className="absolute bottom-4 left-4 px-2.5 py-1 bg-black/80 backdrop-blur-xs text-[11px] font-mono text-neutral-300 rounded-xs border border-[#333]">
            {item.category} Category
          </div>
        </div>

        {/* Right: Craftsmanship & Provenance Dossier */}
        <div className="lg:w-2/5 p-6 flex flex-col justify-between overflow-y-auto border-t lg:border-t-0 lg:border-l border-[#222] bg-[#111]">
          <div className="space-y-5">
            {/* Category & Year */}
            <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
              <span className="text-amber-400 uppercase tracking-wider font-semibold">
                {item.category} Archive
              </span>
              {item.year && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                  {item.year}
                </span>
              )}
            </div>

            {/* Title */}
            <div>
              <h2 className="text-xl sm:text-2xl font-serif text-white tracking-wide leading-tight">
                {item.title}
              </h2>
              {item.client && (
                <p className="text-xs font-mono text-neutral-400 mt-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  <span>{item.client}</span>
                </p>
              )}
            </div>

            {/* Craftsmanship Narrative */}
            <div className="space-y-2 border-t border-[#1F1F1F] pt-4">
              <h4 className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Artisanal Notes & Execution
              </h4>
              <p className="text-xs text-neutral-300 font-sans leading-relaxed whitespace-pre-line">
                {item.description}
              </p>
            </div>

            {/* Tags */}
            {item.tags && item.tags.length > 0 && (
              <div className="space-y-2 border-t border-[#1F1F1F] pt-4">
                <h4 className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-semibold flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-amber-400" />
                  Technical Disciplines
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {item.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-[#1A1A1A] border border-[#2B2B2B] text-[10px] font-mono text-neutral-300 rounded-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Bar */}
          <div className="pt-6 mt-6 border-t border-[#1F1F1F] flex items-center justify-between gap-2">
            <button
              onClick={() => onToggleFeatured(item.id)}
              className={`px-3 py-2 text-xs font-mono rounded-xs border transition-colors flex items-center gap-1.5 cursor-pointer ${
                item.featured
                  ? 'border-amber-400/40 bg-amber-400/10 text-amber-300'
                  : 'border-[#2B2B2B] hover:border-neutral-500 text-neutral-400 hover:text-white'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${item.featured ? 'fill-amber-400' : ''}`} />
              {item.featured ? 'Featured' : 'Mark Feature'}
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onEdit(item);
                  onClose();
                }}
                className="px-3 py-2 text-xs font-mono rounded-xs bg-[#222] hover:bg-[#2C2C2C] text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5 text-amber-400" />
                Edit
              </button>
              <button
                onClick={() => {
                  if (confirm(`Remove "${item.title}" from atelier portfolio?`)) {
                    onDelete(item.id);
                    onClose();
                  }
                }}
                className="p-2 text-xs font-mono rounded-xs bg-red-950/30 hover:bg-red-900/50 text-red-400 border border-red-800/40 transition-colors cursor-pointer"
                title="Delete portfolio item"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
