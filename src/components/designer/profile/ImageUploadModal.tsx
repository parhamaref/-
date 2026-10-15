/**
 * @file ImageUploadModal.tsx
 * High-performance image upload system supporting local drag-and-drop, direct file selection,
 * external URL specification, and curated haute-couture atelier presets.
 */

import React, { useState, useRef } from 'react';
import {
  Upload,
  Link as LinkIcon,
  Sparkles,
  X,
  Check,
  AlertCircle,
  Image as ImageIcon,
  Crop,
} from 'lucide-react';
import { validateImageFile } from '../../../utils/designerProfileValidators';

export interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (imageUrl: string) => void;
  title?: string;
  description?: string;
  currentImageUrl?: string;
  aspectRatioHint?: '1:1' | '16:9' | '3:1' | '4:5' | 'any';
  category?: 'logo' | 'cover' | 'avatar' | 'portfolio';
}

const ATELIER_PRESETS = [
  {
    name: 'Atelier Minimalist Crest',
    url: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
    type: 'logo',
    desc: 'Architectural monochrome emblem',
  },
  {
    name: 'Savile Row Cutting Table',
    url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1600&q=80',
    type: 'cover',
    desc: 'Bespoke tailoring shears & wool fabrics',
  },
  {
    name: 'Parisian Studio Atelier',
    url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80',
    type: 'cover',
    desc: 'Daylit architectural showroom interior',
  },
  {
    name: 'Head Designer Portrait',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    type: 'avatar',
    desc: 'Studio black-and-white editorial portrait',
  },
  {
    name: 'Raw Muslin Silhouette',
    url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80',
    type: 'portfolio',
    desc: 'Draped cotton muslin mannequin',
  },
  {
    name: 'Artisan Shears & Thread',
    url: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80',
    type: 'portfolio',
    desc: 'Hand-sewing worsted wool details',
  },
];

export const ImageUploadModal: React.FC<ImageUploadModalProps> = ({
  isOpen,
  onClose,
  onSelectImage,
  title = 'Upload Visual Asset',
  description = 'Select a high-resolution file, specify a secure URL, or choose from our curated atelier presets.',
  currentImageUrl = '',
  aspectRatioHint = 'any',
  category = 'portfolio',
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'url' | 'presets'>('upload');
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>(currentImageUrl);
  const [urlInput, setUrlInput] = useState<string>(currentImageUrl);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    setError(null);
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPreviewUrl(result);
      setIsProcessing(false);
    };
    reader.onerror = () => {
      setError('Failed to read image file');
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  const handleUrlApply = () => {
    setError(null);
    if (!urlInput.trim()) {
      setError('Please provide a valid image URL');
      return;
    }
    if (!urlInput.startsWith('http://') && !urlInput.startsWith('https://') && !urlInput.startsWith('data:image/')) {
      setError('URL must begin with http://, https://, or data:image/');
      return;
    }
    setPreviewUrl(urlInput.trim());
  };

  const handleConfirm = () => {
    if (!previewUrl) {
      setError('Please select or upload an image first');
      return;
    }
    onSelectImage(previewUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#0F0F0F] border border-[#2B2B2B] rounded-xs shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#222] flex items-center justify-between bg-[#141414]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xs bg-amber-400/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-mono uppercase tracking-wider text-white font-medium">
                {title}
              </h3>
              <p className="text-[11px] text-neutral-400 font-sans">{description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-xs hover:bg-[#222] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Aspect Ratio Hint Badge */}
        {aspectRatioHint !== 'any' && (
          <div className="px-6 py-2 bg-[#121212] border-b border-[#1F1F1F] flex items-center justify-between text-[11px] font-mono text-neutral-400">
            <span className="flex items-center gap-1.5">
              <Crop className="w-3.5 h-3.5 text-amber-400" />
              Recommended Aspect Ratio: <strong className="text-white">{aspectRatioHint}</strong>
            </span>
            <span className="text-neutral-500">Max size: 10MB (JPEG, PNG, WebP)</span>
          </div>
        )}

        {/* Tab Controls */}
        <div className="px-6 pt-4 border-b border-[#1F1F1F] flex items-center gap-4 text-xs font-mono">
          <button
            onClick={() => setActiveTab('upload')}
            className={`pb-3 border-b-2 font-medium transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'upload'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            File Upload
          </button>
          <button
            onClick={() => setActiveTab('url')}
            className={`pb-3 border-b-2 font-medium transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'url'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            Direct URL
          </button>
          <button
            onClick={() => setActiveTab('presets')}
            className={`pb-3 border-b-2 font-medium transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'presets'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Atelier Presets
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {error && (
            <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-xs flex items-center gap-2.5 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {activeTab === 'upload' && (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xs p-8 text-center cursor-pointer transition-all ${
                dragActive
                  ? 'border-amber-400 bg-amber-400/5'
                  : 'border-[#2F2F2F] hover:border-neutral-500 bg-[#121212]'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/svg+xml"
                onChange={handleFileInputChange}
                className="hidden"
              />
              <div className="w-12 h-12 rounded-full bg-[#1A1A1A] border border-[#2F2F2F] flex items-center justify-center mx-auto mb-3 text-amber-400">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-sm font-sans font-medium text-white mb-1">
                Drag and drop your high-resolution asset here
              </p>
              <p className="text-xs text-neutral-400 mb-3">or browse from your local studio machine</p>
              <div className="inline-flex items-center px-3 py-1 bg-[#1A1A1A] border border-[#333] text-[11px] font-mono text-neutral-300 rounded-xs">
                Supports JPEG, PNG, WebP up to 10MB
              </div>
            </div>
          )}

          {activeTab === 'url' && (
            <div className="space-y-3">
              <label className="block text-xs font-mono uppercase text-neutral-300">
                Image Source URL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/... or https://cdn.atelier.com/..."
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="flex-1 px-3 py-2 bg-[#141414] border border-[#2B2B2B] text-white text-xs font-mono rounded-xs focus:border-amber-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleUrlApply}
                  className="px-4 py-2 bg-[#222] hover:bg-[#2E2E2E] text-white text-xs font-mono uppercase rounded-xs transition-colors cursor-pointer"
                >
                  Inspect
                </button>
              </div>
              <p className="text-[11px] text-neutral-500">
                Make sure the host allows cross-origin loading. Unsplash, Cloudinary, and AWS S3 links are supported.
              </p>
            </div>
          )}

          {activeTab === 'presets' && (
            <div className="space-y-3">
              <p className="text-xs text-neutral-400">
                Curated high-resolution editorial and craftsmanship imagery for Daniel Maison Atelier:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {ATELIER_PRESETS.map((preset, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setPreviewUrl(preset.url);
                      setUrlInput(preset.url);
                    }}
                    className={`group relative border rounded-xs overflow-hidden cursor-pointer transition-all ${
                      previewUrl === preset.url
                        ? 'border-amber-400 ring-1 ring-amber-400'
                        : 'border-[#222] hover:border-neutral-500'
                    }`}
                  >
                    <div className="h-24 bg-neutral-900 overflow-hidden">
                      <img
                        src={preset.url}
                        alt={preset.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-2 bg-[#121212]">
                      <p className="text-[11px] font-mono text-white truncate font-medium">
                        {preset.name}
                      </p>
                      <p className="text-[10px] text-neutral-500 truncate">{preset.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Live Preview Card */}
          {previewUrl && (
            <div className="p-4 bg-[#141414] border border-[#242424] rounded-xs space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-neutral-300">
                <span className="flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                  Visual Asset Preview
                </span>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Ready to Apply
                </span>
              </div>
              <div className="relative rounded-xs overflow-hidden border border-[#2A2A2A] bg-black max-h-56 flex items-center justify-center">
                <img
                  src={previewUrl}
                  alt="Asset Preview"
                  className="max-h-56 w-auto object-contain"
                  onError={() => setError('Could not load image preview from provided source')}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-[#141414] border-t border-[#222] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-mono uppercase text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={!previewUrl || isProcessing}
              onClick={handleConfirm}
              className={`px-5 py-2 text-xs font-mono uppercase tracking-wider font-semibold rounded-xs transition-colors flex items-center gap-2 cursor-pointer ${
                previewUrl && !isProcessing
                  ? 'bg-amber-400 hover:bg-amber-300 text-black shadow-lg shadow-amber-400/20'
                  : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              Apply Image
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
