/**
 * @file RespondToQueryModal.tsx
 * Modal for designers to submit supplemental documents and respond to queries
 * when status is 'More Information Required'.
 */

import React, { useState } from 'react';
import {
  MoreInformationQuery,
} from '../../../types/designerVerification.types';
import {
  X,
  AlertTriangle,
  FileUp,
  CheckCircle2,
  Calendar,
  Send,
} from 'lucide-react';

interface RespondToQueryModalProps {
  isOpen: boolean;
  onClose: () => void;
  query: MoreInformationQuery;
  designerName: string;
  onSubmitResponse: (
    explanation: string,
    items: { itemId: string; designerResponse: string; documentUrl?: string }[]
  ) => Promise<void>;
}

export const RespondToQueryModal: React.FC<RespondToQueryModalProps> = ({
  isOpen,
  onClose,
  query,
  designerName,
  onSubmitResponse,
}) => {
  const [explanation, setExplanation] = useState('');
  const [itemResponses, setItemResponses] = useState<Record<string, { response: string; url: string }>>(() => {
    const init: Record<string, { response: string; url: string }> = {};
    query.items.forEach((item) => {
      init[item.id] = {
        response: item.designerResponse || '',
        url: item.documentUrl || '',
      };
    });
    return init;
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleItemChange = (itemId: string, field: 'response' | 'url', val: string) => {
    setItemResponses((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [field]: val,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!explanation.trim()) return;

    setIsSubmitting(true);
    try {
      const payload = query.items.map((it) => ({
        itemId: it.id,
        designerResponse: itemResponses[it.id]?.response || 'Clarification provided in master dossier.',
        documentUrl: itemResponses[it.id]?.url || undefined,
      }));

      await onSubmitResponse(explanation, payload);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-700/80 rounded-2xl shadow-2xl p-6 md:p-8 my-8 text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-950/60 border border-orange-700 flex items-center justify-center text-orange-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-serif tracking-wide text-white">
                Respond to Standards Council Query
              </h3>
              <p className="text-xs text-neutral-400 font-mono">
                Requested by {query.requestedBy}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Auditor's Notice Box */}
        <div className="my-5 p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-xs space-y-2">
          <div className="flex items-center justify-between text-neutral-400 font-mono">
            <span className="uppercase text-[10px] text-amber-400 tracking-wider">Official Query Request</span>
            <span className="flex items-center gap-1.5 text-orange-400">
              <Calendar className="w-3.5 h-3.5" />
              Deadline: {query.deadlineDate}
            </span>
          </div>
          <p className="text-neutral-200 leading-relaxed font-sans text-sm italic">
            "{query.notes}"
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Itemized Requirements */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400">
              Requested Evidence Items ({query.items.length})
            </h4>

            {query.items.map((item, idx) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-neutral-950/70 border border-neutral-800 space-y-3"
              >
                <div className="flex items-start gap-2.5">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">
                    #{idx + 1}
                  </span>
                  <div>
                    <h5 className="text-sm font-medium text-white">{item.field}</h5>
                    <p className="text-xs text-neutral-400 mt-0.5">{item.requirement}</p>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <textarea
                    rows={2}
                    placeholder="Enter your response or clarification regarding this item..."
                    value={itemResponses[item.id]?.response || ''}
                    onChange={(e) => handleItemChange(item.id, 'response', e.target.value)}
                    className="w-full text-xs bg-neutral-900 border border-neutral-700 rounded-lg p-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                  />
                  <div className="flex items-center gap-2">
                    <FileUp className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <input
                      type="text"
                      placeholder="Document / Certified PDF URL (e.g., https://...)"
                      value={itemResponses[item.id]?.url || ''}
                      onChange={(e) => handleItemChange(item.id, 'url', e.target.value)}
                      className="w-full text-xs bg-neutral-900 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Master Atelier Statement */}
          <div className="space-y-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300">
              Atelier Formal Statement / Cover Note *
            </label>
            <textarea
              required
              rows={3}
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder={`Provide a formal overview to the Standards Council explaining the supplemental documentation attached on behalf of ${designerName}...`}
              className="w-full text-sm bg-neutral-950 border border-neutral-700 rounded-xl p-3 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg border border-neutral-700 text-xs font-medium text-neutral-300 hover:bg-neutral-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !explanation.trim()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-semibold tracking-wide transition shadow-lg disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Submitting...' : 'Submit Supplemental Dossier'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
