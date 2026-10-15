/**
 * @file ReplyModal.tsx
 * Modal for composing or editing an official atelier response to a client review.
 */

import React, { useState } from 'react';
import { X, Send, Sparkles, MessageSquare, Quote, CheckCircle2, User } from 'lucide-react';
import { ReviewItem } from '../../../types/review.types';

interface ReplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  review: ReviewItem | null;
  onSaveReply: (reviewId: string, replyText: string, authorRole: string) => void;
}

export const ReplyModal: React.FC<ReplyModalProps> = ({
  isOpen,
  onClose,
  review,
  onSaveReply,
}) => {
  if (!isOpen || !review) return null;

  const existingReply = review.reply;
  const [replyText, setReplyText] = useState(existingReply?.text || '');
  const [authorRole, setAuthorRole] = useState(
    existingReply?.authorRole || 'Creative Director & Master Cutter'
  );
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  const templates = [
    {
      title: 'Formal Atelier Gratitude',
      text: `Dear ${review.author.name}, it was an extraordinary privilege tailoring this ${review.garmentName} for you. May the cloth accompany you in health and distinction. We eagerly look forward to welcoming you back to the atelier.`,
    },
    {
      title: 'Craft & Fabric Appraisal',
      text: `Thank you, ${review.author.name}. The drape and tension on this cloth were specifically adjusted to flatter your posture. Our workshop cutters take immense pride in your words.`,
    },
    {
      title: 'Fitting & Ease Adjustment Offer',
      text: `Dear ${review.author.name}, thank you for your thoughtful observation regarding the sleeve cuff ease. We have flagged this in your master anatomical pattern dossier so all subsequent garments reflect the requested millimeter ease. Our complimentary fitting studio is always at your disposal.`,
    },
  ];

  const handleApplyTemplate = (text: string) => {
    setReplyText(text);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    onSaveReply(review.id, replyText.trim(), authorRole);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#111] border border-[#2a2a2a] rounded-xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#222] bg-[#161616]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-serif font-bold text-white tracking-wide">
                {existingReply ? 'Edit Atelier Official Reply' : 'Compose Atelier Response'}
              </h2>
              <p className="text-xs text-gray-400">
                Directly communicate with verified buyer {review.author.name}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Client review quote summary */}
          <div className="p-3.5 bg-[#161616] border border-[#262626] rounded-lg text-xs space-y-1.5">
            <div className="flex items-center justify-between text-gray-400">
              <span className="font-semibold text-white">{review.author.name}</span>
              <span className="font-mono text-amber-400">{'★'.repeat(review.overallRating)}</span>
            </div>
            <p className="text-gray-300 italic line-clamp-3">"{review.content}"</p>
            <div className="text-[11px] text-gray-500 font-mono">
              Order {review.orderNumber} • {review.garmentName}
            </div>
          </div>

          {/* Quick Response Templates */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              Atelier Response Templates
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {templates.map((tmpl) => (
                <button
                  key={tmpl.title}
                  type="button"
                  onClick={() => handleApplyTemplate(tmpl.text)}
                  className="p-2 text-left rounded-lg bg-[#181818] hover:bg-[#222] border border-[#262626] hover:border-amber-500/40 text-xs transition-colors"
                >
                  <span className="font-medium text-amber-300 block mb-0.5 truncate">
                    {tmpl.title}
                  </span>
                  <span className="text-[10px] text-gray-400 line-clamp-2">{tmpl.text}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sign-off Role */}
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Author Representation & Title
            </label>
            <select
              value={authorRole}
              onChange={(e) => setAuthorRole(e.target.value)}
              className="w-full bg-[#181818] border border-[#333] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
            >
              <option value="Creative Director & Master Cutter">
                Daniel M. Sterling — Creative Director & Master Cutter
              </option>
              <option value="Head of Bespoke Client Relations">
                Head of Bespoke Client Relations
              </option>
              <option value="Master Tailor & Fit Specialist">
                Master Tailor & Fit Specialist
              </option>
              <option value="Atelier Director">Atelier Director</option>
            </select>
          </div>

          {/* Message Area */}
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Official Response Copy *
            </label>
            <textarea
              rows={5}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Craft your personalized atelier reply..."
              className="w-full bg-[#181818] border border-[#333] rounded-lg p-3 text-xs text-white focus:outline-none focus:border-amber-400 placeholder-gray-500 leading-relaxed"
              required
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-[#222]">
            <span className="text-[11px] text-gray-500">
              Published on official verified atelier feed
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs rounded-lg transition-colors shadow-lg shadow-amber-500/20"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{existingReply ? 'Update Official Reply' : 'Publish Official Reply'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
