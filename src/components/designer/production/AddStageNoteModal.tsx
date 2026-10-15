/**
 * @file AddStageNoteModal.tsx
 * Modal to record artisan craftsman notes, attach proof photos,
 * and toggle client portal visibility.
 */

import React, { useState } from 'react';
import { X, Check, FileText, Camera, Eye, Lock, AlertCircle } from 'lucide-react';
import { ProductionStageName } from '../../../types/productionWorkflow.types';

export interface AddStageNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  stageName: ProductionStageName;
  onSave: (note: { text: string; artisanName: string; isCustomerVisible: boolean; photoUrl?: string }) => void;
}

export const AddStageNoteModal: React.FC<AddStageNoteModalProps> = ({
  isOpen,
  onClose,
  stageName,
  onSave,
}) => {
  const [text, setText] = useState('');
  const [artisanName, setArtisanName] = useState('Daniel’s Maison');
  const [isCustomerVisible, setIsCustomerVisible] = useState(true);
  const [photoUrl, setPhotoUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      setError('Note description is required');
      return;
    }

    onSave({
      text: text.trim(),
      artisanName: artisanName.trim() || 'Atelier Artisan',
      isCustomerVisible,
      photoUrl: photoUrl.trim() || undefined,
    });
    setText('');
    setPhotoUrl('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#0F0F0F] border border-[#2B2B2B] rounded-xs shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#222] flex items-center justify-between bg-[#141414]">
          <div>
            <h3 className="text-sm font-mono uppercase tracking-wider text-white font-medium">
              Record Stage Note: {stageName}
            </h3>
            <p className="text-[11px] text-neutral-400">
              Document atelier execution notes or share proof photos with client.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-xs hover:bg-[#222] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-xs flex items-center gap-2 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-mono uppercase text-neutral-300 mb-1.5">
              Artisan Signature Name *
            </label>
            <input
              type="text"
              value={artisanName}
              onChange={(e) => setArtisanName(e.target.value)}
              className="w-full px-3 py-2 bg-[#141414] border border-[#2B2B2B] text-xs font-mono rounded-xs text-white focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-neutral-300 mb-1.5">
              Craftsmanship Note & Observations *
            </label>
            <textarea
              rows={4}
              placeholder="e.g. Floating chest canvas pad-stitched by hand. Lapel roll verified against anatomical slope block..."
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                if (error) setError(null);
              }}
              className="w-full px-3 py-2 bg-[#141414] border border-[#2B2B2B] text-xs font-sans rounded-xs text-white focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-neutral-300 mb-1.5 flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-amber-400" />
              Craftsmanship Proof Photo URL (Optional)
            </label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/... or workshop photo link"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              className="w-full px-3 py-2 bg-[#141414] border border-[#2B2B2B] text-xs font-mono rounded-xs text-white focus:border-amber-400 focus:outline-none"
            />
          </div>

          {/* Customer Visibility Toggle */}
          <div className="p-3 bg-[#141414] border border-[#222] rounded-xs flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {isCustomerVisible ? (
                <Eye className="w-4 h-4 text-emerald-400" />
              ) : (
                <Lock className="w-4 h-4 text-neutral-400" />
              )}
              <div>
                <span className="text-xs font-mono text-white block font-medium">
                  {isCustomerVisible ? 'Visible to Customer' : 'Private Atelier Only'}
                </span>
                <span className="text-[10px] text-neutral-500 font-sans">
                  {isCustomerVisible
                    ? 'Published in customer portal order tracking stream.'
                    : 'Confidential shop-floor log only visible to atelier team.'}
                </span>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isCustomerVisible}
                onChange={(e) => setIsCustomerVisible(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#222] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-[#222] flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-mono uppercase text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-mono uppercase tracking-wider font-semibold rounded-xs bg-amber-400 hover:bg-amber-300 text-black shadow-lg shadow-amber-400/20 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              Log Stage Note
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
