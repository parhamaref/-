/**
 * @file ClarificationModal.tsx
 * Modal for requesting customer clarification on measurements, fit preferences,
 * or customization choices.
 */

import React, { useState } from 'react';
import { X, MessageSquare, Send, AlertCircle, HelpCircle } from 'lucide-react';
import { DesignerOrder } from '../../../types/designerOrder.types';

export interface ClarificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: DesignerOrder | null;
  onSend: (message: string) => void;
}

const TEMPLATE_QUESTIONS = [
  'Please verify your natural waist measurement with relaxed breathing.',
  'Do you prefer a structured Savile roped shoulder or soft deconstructed unpadded shoulder?',
  'Could you confirm your intended heel height for garment hemline calibration?',
  'Please confirm your exact monogram font style preference (Serif Roman vs Minimalist Sans).',
];

export const ClarificationModal: React.FC<ClarificationModalProps> = ({
  isOpen,
  onClose,
  order,
  onSend,
}) => {
  const [messageText, setMessageText] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !order) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) {
      setError('Please enter a clarification question');
      return;
    }

    onSend(messageText.trim());
    setMessageText('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#0F0F0F] border border-[#2B2B2B] rounded-xs shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#222] flex items-center justify-between bg-[#141414]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xs bg-amber-400/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-mono uppercase tracking-wider text-white font-medium">
                Request Customer Clarification
              </h3>
              <p className="text-[11px] text-neutral-400">Direct query to {order.customer.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-xs hover:bg-[#222] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-xs flex items-center gap-2 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Preset Buttons */}
          <div>
            <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1.5 flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              Quick Atelier Inquiries
            </label>
            <div className="space-y-1.5">
              {TEMPLATE_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setMessageText(q)}
                  className="w-full text-left p-2 rounded-xs bg-[#141414] hover:bg-[#1E1E1E] border border-[#222] hover:border-neutral-500 text-[11px] text-neutral-300 font-sans transition-colors cursor-pointer"
                >
                  "{q}"
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-neutral-300 mb-1.5">
              Message to Customer *
            </label>
            <textarea
              rows={4}
              placeholder="Detail your question regarding dimensions, fabric weights, or monogram preferences..."
              value={messageText}
              onChange={(e) => {
                setMessageText(e.target.value);
                if (error) setError(null);
              }}
              className="w-full px-3 py-2 bg-[#141414] border border-[#2B2B2B] text-xs font-sans rounded-xs text-white focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div className="p-3 bg-[#141414] border border-[#222] rounded-xs text-[11px] text-neutral-400 font-mono">
            Notification will be sent via customer portal & email. Order will be marked with a clarification flag.
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
              <Send className="w-3.5 h-3.5" />
              Transmit Query
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
