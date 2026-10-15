/**
 * @file PortfolioManageModal.tsx
 * Modal for creating and editing designer portfolio projects, runway presentations,
 * editorial features, and atelier craftsmanship archives.
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Upload,
  Check,
  Tag,
  Calendar,
  Sparkles,
  AlertCircle,
  FileText,
  User,
  Image as ImageIcon,
} from 'lucide-react';
import { PortfolioItem, PortfolioCategory } from '../../../types/designer.types';
import { validatePortfolioItem } from '../../../utils/designerProfileValidators';
import { ImageUploadModal } from './ImageUploadModal';

export interface PortfolioManageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Partial<PortfolioItem>) => void;
  initialItem?: PortfolioItem | null;
}

const CATEGORIES: PortfolioCategory[] = [
  'Runway',
  'Editorial',
  'Atelier',
  'Bespoke',
  'Archive',
  'Craftsmanship',
];

export const PortfolioManageModal: React.FC<PortfolioManageModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialItem,
}) => {
  const isEditing = Boolean(initialItem);

  const [formData, setFormData] = useState<Partial<PortfolioItem>>({
    title: '',
    category: 'Runway',
    description: '',
    imageUrl: '',
    year: '2026',
    client: '',
    featured: false,
    tags: [],
    aspectRatio: 'portrait',
  });

  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  useEffect(() => {
    if (initialItem) {
      setFormData({
        ...initialItem,
        tags: initialItem.tags || [],
      });
    } else {
      setFormData({
        title: '',
        category: 'Runway',
        description: '',
        imageUrl: '',
        year: new Date().getFullYear().toString(),
        client: '',
        featured: false,
        tags: ['Haute Couture', 'Atelier'],
        aspectRatio: 'portrait',
      });
    }
    setErrors({});
  }, [initialItem, isOpen]);

  if (!isOpen) return null;

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !(formData.tags || []).includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), trimmed],
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: (prev.tags || []).filter((t) => t !== tagToRemove),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validatePortfolioItem(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    onSave(formData);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
        <div className="relative w-full max-w-2xl bg-[#0F0F0F] border border-[#2B2B2B] rounded-xs shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="px-6 py-4 border-b border-[#222] flex items-center justify-between bg-[#141414]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xs bg-amber-400/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-mono uppercase tracking-wider text-white font-medium">
                  {isEditing ? 'Edit Portfolio Project' : 'Add New Portfolio Project'}
                </h3>
                <p className="text-[11px] text-neutral-400 font-sans">
                  Showcase bespoke tailoring commissions, runway looks, and atelier craft heritage.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white rounded-xs hover:bg-[#222] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form Form */}
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
            {Object.keys(errors).length > 0 && (
              <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-xs flex items-center gap-2.5 text-xs text-red-300">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>Please fix the highlighted issues before saving.</span>
              </div>
            )}

            {/* Title & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-neutral-300 mb-1.5">
                  Project Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Metamorphic Drape Coat"
                  value={formData.title || ''}
                  onChange={(e) => {
                    setFormData({ ...formData, title: e.target.value });
                    if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
                  }}
                  className={`w-full px-3 py-2 bg-[#141414] border text-xs font-mono rounded-xs text-white focus:outline-none ${
                    errors.title ? 'border-red-500' : 'border-[#2B2B2B] focus:border-amber-400'
                  }`}
                />
                {errors.title && <p className="text-[10px] text-red-400 mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-300 mb-1.5">
                  Category *
                </label>
                <select
                  value={formData.category || 'Runway'}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value as PortfolioCategory })
                  }
                  className="w-full px-3 py-2 bg-[#141414] border border-[#2B2B2B] text-xs font-mono rounded-xs text-white focus:border-amber-400 focus:outline-none cursor-pointer"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} className="bg-[#141414] text-white">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Year & Client */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-neutral-300 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  Presentation Year
                </label>
                <input
                  type="text"
                  placeholder="e.g. 2026"
                  value={formData.year || ''}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="w-full px-3 py-2 bg-[#141414] border border-[#2B2B2B] text-xs font-mono rounded-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-300 mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  Client / Publication / Event
                </label>
                <input
                  type="text"
                  placeholder="e.g. Paris Fashion Week AW26 / Vogue"
                  value={formData.client || ''}
                  onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                  className="w-full px-3 py-2 bg-[#141414] border border-[#2B2B2B] text-xs font-mono rounded-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Image Selection */}
            <div>
              <label className="block text-xs font-mono uppercase text-neutral-300 mb-1.5 flex items-center justify-between">
                <span>High-Resolution Project Image *</span>
                <button
                  type="button"
                  onClick={() => setIsImageModalOpen(true)}
                  className="text-amber-400 hover:text-amber-300 text-[11px] underline flex items-center gap-1 cursor-pointer"
                >
                  <Upload className="w-3 h-3" /> Upload / Choose Preset
                </button>
              </label>

              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/... or upload"
                  value={formData.imageUrl || ''}
                  onChange={(e) => {
                    setFormData({ ...formData, imageUrl: e.target.value });
                    if (errors.imageUrl) setErrors((prev) => ({ ...prev, imageUrl: '' }));
                  }}
                  className={`flex-1 px-3 py-2 bg-[#141414] border text-xs font-mono rounded-xs text-white focus:outline-none ${
                    errors.imageUrl ? 'border-red-500' : 'border-[#2B2B2B] focus:border-amber-400'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setIsImageModalOpen(true)}
                  className="px-3 py-2 bg-[#222] hover:bg-[#2B2B2B] text-white text-xs font-mono rounded-xs cursor-pointer flex items-center gap-1.5"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                  Browse
                </button>
              </div>
              {errors.imageUrl && <p className="text-[10px] text-red-400 mt-1">{errors.imageUrl}</p>}

              {/* Preview */}
              {formData.imageUrl && (
                <div className="mt-3 relative h-40 bg-black rounded-xs border border-[#2B2B2B] overflow-hidden flex items-center justify-center">
                  <img
                    src={formData.imageUrl}
                    alt="Project preview"
                    className="h-full w-full object-cover"
                    onError={() => setErrors((prev) => ({ ...prev, imageUrl: 'Failed to load image from URL' }))}
                  />
                  <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/70 backdrop-blur-xs text-[10px] font-mono text-white rounded-xs">
                    {formData.category}
                  </div>
                </div>
              )}
            </div>

            {/* Description / Craftsmanship notes */}
            <div>
              <label className="block text-xs font-mono uppercase text-neutral-300 mb-1.5 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                Craftsmanship Notes & Project Dossier *
              </label>
              <textarea
                rows={4}
                placeholder="Detail the tailoring techniques, fabric composition (e.g. 14oz Japanese selvedge denim), pattern construction, and bespoke fittings involved..."
                value={formData.description || ''}
                onChange={(e) => {
                  setFormData({ ...formData, description: e.target.value });
                  if (errors.description) setErrors((prev) => ({ ...prev, description: '' }));
                }}
                className={`w-full px-3 py-2 bg-[#141414] border text-xs font-sans rounded-xs text-white focus:outline-none leading-relaxed ${
                  errors.description ? 'border-red-500' : 'border-[#2B2B2B] focus:border-amber-400'
                }`}
              />
              {errors.description && (
                <p className="text-[10px] text-red-400 mt-1">{errors.description}</p>
              )}
            </div>

            {/* Tags & Keywords */}
            <div>
              <label className="block text-xs font-mono uppercase text-neutral-300 mb-1.5 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-amber-400" />
                Tags & Techniques
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="e.g. Worsted Wool, Hand-Stitched, Savile Row"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  className="flex-1 px-3 py-2 bg-[#141414] border border-[#2B2B2B] text-xs font-mono rounded-xs text-white focus:border-amber-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-3 py-2 bg-[#222] hover:bg-[#2B2B2B] text-white text-xs font-mono rounded-xs cursor-pointer"
                >
                  Add Tag
                </button>
              </div>

              {/* Tag Chips */}
              <div className="flex flex-wrap gap-1.5">
                {(formData.tags || []).map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#1A1A1A] border border-[#333] text-[11px] font-mono text-neutral-300 rounded-xs"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-neutral-500 hover:text-red-400 cursor-pointer ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Featured toggle */}
            <div className="pt-2 border-t border-[#1F1F1F] flex items-center justify-between">
              <div>
                <p className="text-xs font-mono text-white font-medium">Feature on Public Atelier Cover</p>
                <p className="text-[11px] text-neutral-400">
                  Highlighted with golden atelier seal at top of public portfolio.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured || false}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#222] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-400"></div>
              </label>
            </div>
          </form>

          {/* Footer Actions */}
          <div className="px-6 py-4 bg-[#141414] border-t border-[#222] flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-mono uppercase text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-5 py-2 text-xs font-mono uppercase tracking-wider font-semibold rounded-xs bg-amber-400 hover:bg-amber-300 text-black shadow-lg shadow-amber-400/20 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              {isEditing ? 'Save Changes' : 'Publish Project'}
            </button>
          </div>
        </div>
      </div>

      {/* Nested Image Upload Modal */}
      <ImageUploadModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        onSelectImage={(url) => {
          setFormData((prev) => ({ ...prev, imageUrl: url }));
          if (errors.imageUrl) setErrors((prev) => ({ ...prev, imageUrl: '' }));
        }}
        title="Select Project Image"
        description="Choose a high-resolution runway photo, editorial scan, or craftsmanship detail."
        currentImageUrl={formData.imageUrl}
        category="portfolio"
        aspectRatioHint="4:5"
      />
    </>
  );
};
