/**
 * @file SendUpdateModal.tsx
 * Modal to dispatch production progress updates with milestone badges,
 * tailoring completion percentages, craftsmanship photos, and client alerts.
 */

import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Clock,
  Camera,
  Check,
  AlertCircle,
  Eye,
  Sliders,
  Send,
} from 'lucide-react';
import { ProgressUpdatePayload } from '../../../types/communication.types';
import { ProductionStageName } from '../../../types/productionWorkflow.types';

export interface SendUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerName: string;
  orderNumber?: string;
  garmentName?: string;
  onSend: (payload: ProgressUpdatePayload) => void;
}

const STAGES: ProductionStageName[] = [
  'Pattern Design',
  'Fabric Selection',
  'Cutting',
  'Sewing',
  'Finishing',
  'Quality Control',
  'Packaging',
  'Shipping',
];

export const SendUpdateModal: React.FC<SendUpdateModalProps> = ({
  isOpen,
  onClose,
  customerName,
  orderNumber,
  garmentName,
  onSend,
}) => {
  const [stage, setStage] = useState<ProductionStageName>('Sewing');
  const [progressPercent, setProgressPercent] = useState<number>(65);
  const [headline, setHeadline] = useState('Floating Chest Canvas Pad-Stitched & Shaped');
  const [notes, setNotes] = useState(
    'Natural horsehair canvas pad-stitched and rested overnight under natural humidity. The lapel rolls with bespoke springiness.'
  );
  const [photoUrl, setPhotoUrl] = useState(
    'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80'
  );
  const [deliveryDate, setDeliveryDate] = useState('2026-10-24');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!headline.trim()) {
      setError('Please provide a milestone headline');
      return;
    }

    onSend({
      stage,
      progressPercent,
      headline: headline.trim(),
      notes: notes.trim(),
      photoUrls: photoUrl.trim() ? [photoUrl.trim()] : undefined,
      estimatedDeliveryDate: deliveryDate,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#0D0D0D] border border-[#2B2B2B] rounded-xs shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#222] bg-[#141414] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xs bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-mono uppercase tracking-wider text-white font-medium">
                Dispatch Production Progress Update
              </h3>
              <p className="text-[11px] text-neutral-400 font-sans">
                Post milestone report directly to {customerName}'s tracking stream ({orderNumber || 'Order Discussion'}).
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

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs font-mono">
          {error && (
            <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-xs flex items-center gap-2 text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {garmentName && (
            <div className="p-3 bg-[#141414] border border-[#222] rounded-xs flex items-center justify-between text-neutral-300">
              <span>Garment Silhouette:</span>
              <span className="text-amber-400 font-bold">{garmentName}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs uppercase text-neutral-300 mb-1">Milestone Stage</label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value as ProductionStageName)}
                className="w-full px-3 py-2 bg-[#141414] border border-[#2B2B2B] text-white text-xs rounded-xs focus:border-amber-400 focus:outline-none cursor-pointer"
              >
                {STAGES.map((stg) => (
                  <option key={stg} value={stg}>
                    {stg}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase text-neutral-300 mb-1 flex justify-between">
                <span>Progress:</span>
                <span className="text-amber-400 font-bold">{progressPercent}%</span>
              </label>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={progressPercent}
                onChange={(e) => setProgressPercent(parseInt(e.target.value) || 0)}
                className="w-full accent-amber-400 cursor-pointer mt-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase text-neutral-300 mb-1">Milestone Headline *</label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="w-full px-3 py-2 bg-[#141414] border border-[#2B2B2B] rounded-xs text-white text-xs focus:border-amber-400 focus:outline-none"
              placeholder="e.g. Floating Canvas Pad-Stitched & Shaped"
            />
          </div>

          <div>
            <label className="block text-xs uppercase text-neutral-300 mb-1">Tailor Observations & Notes</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-[#141414] border border-[#2B2B2B] rounded-xs text-white text-xs font-sans focus:border-amber-400 focus:outline-none leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs uppercase text-neutral-300 mb-1 flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-amber-400" />
              Attached Shop-Floor Craftsmanship Photo URL
            </label>
            <input
              type="text"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              className="w-full px-3 py-2 bg-[#141414] border border-[#2B2B2B] rounded-xs text-white text-xs focus:border-amber-400 focus:outline-none"
              placeholder="https://..."
            />
          </div>

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
              <Send className="w-3.5 h-3.5" />
              Publish Progress Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
