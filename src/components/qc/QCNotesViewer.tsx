/**
 * @file QCNotesViewer.tsx
 * Inspector Observations, Tailor Instructions, and Audit Memos.
 */

import React, { useState } from 'react';
import { QCNote } from '../../types/qualityControl.types';
import { MessageSquare, Plus, User, Clock, Shield, Lock, Eye } from 'lucide-react';

interface QCNotesViewerProps {
  notes: QCNote[];
  onAddNote: (note: Omit<QCNote, 'id' | 'timestamp'>) => void;
}

export const QCNotesViewer: React.FC<QCNotesViewerProps> = ({ notes, onAddNote }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [content, setContent] = useState('');
  const [stage, setStage] = useState<QCNote['stage']>('Intake');
  const [isClientVisible, setIsClientVisible] = useState(false);
  const [author, setAuthor] = useState('Senior QC Auditor');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    onAddNote({
      author: author.trim(),
      role: 'Inspector',
      stage,
      content: content.trim(),
      isClientVisible,
    });

    setContent('');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6 text-left font-mono text-[11px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0A0A0A] p-4 border border-[#222] rounded-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span className="text-[10px] text-white font-bold uppercase tracking-wider">
              INSPECTOR AUDIT LOGS & TAILOR MEMOS ({notes.length})
            </span>
          </div>
          <p className="text-[10px] text-neutral-400 font-sans">
            Immutable observations stamped into the permanent garment provenance dossier.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-black font-bold uppercase rounded-xs hover:bg-neutral-200 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Add Memo
        </button>
      </div>

      {showAddForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-[#0E0E0E] p-5 border border-emerald-500/40 rounded-xs space-y-4 animate-fadeIn"
        >
          <div className="flex justify-between items-center border-b border-[#222] pb-2">
            <span className="text-emerald-400 font-bold uppercase tracking-wider text-[10px]">
              Record Inspector Observation
            </span>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-neutral-500 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[9px] text-neutral-400 uppercase block mb-1">Inspection Stage</label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value as any)}
                className="w-full bg-black border border-[#333] text-white p-2 text-[10px] rounded-xs"
              >
                <option value="Intake">Intake</option>
                <option value="Measurement">Measurement</option>
                <option value="Fabric">Fabric</option>
                <option value="Finish">Finish</option>
                <option value="Packaging">Packaging</option>
                <option value="Final Signoff">Final Signoff</option>
              </select>
            </div>
            <div>
              <label className="text-[9px] text-neutral-400 uppercase block mb-1">Author Name</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full bg-black border border-[#333] text-white p-2 text-[10px] rounded-xs"
                required
              />
            </div>
            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer text-[10px] text-neutral-300">
                <input
                  type="checkbox"
                  checked={isClientVisible}
                  onChange={(e) => setIsClientVisible(e.target.checked)}
                />
                <span>Include in Client Wardrobe Certificate</span>
              </label>
            </div>
          </div>

          <div>
            <label className="text-[9px] text-neutral-400 uppercase block mb-1">Memo Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={3}
              placeholder="Record exact technical directives..."
              className="w-full bg-black border border-[#333] text-white p-2 text-[10px] rounded-xs"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#222]">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 border border-[#333] text-neutral-400 rounded-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-white text-black font-bold uppercase rounded-xs hover:bg-neutral-200"
            >
              Post Memo
            </button>
          </div>
        </form>
      )}

      {/* Notes List */}
      <div className="space-y-3">
        {notes.map((note) => (
          <div
            key={note.id}
            className="p-4 bg-[#0A0A0A] border border-[#222] rounded-xs space-y-2 hover:border-neutral-600 transition-colors"
          >
            <div className="flex justify-between items-center text-[9px] text-neutral-400 border-b border-[#1C1C1C] pb-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white uppercase">{note.author}</span>
                <span className="bg-neutral-800 text-neutral-300 px-1.5 py-0.2 rounded-xs uppercase">
                  {note.stage}
                </span>
                {note.isClientVisible ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <Eye className="w-3 h-3" /> Client Visible
                  </span>
                ) : (
                  <span className="text-neutral-500 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Confidential
                  </span>
                )}
              </div>
              <span>{new Date(note.timestamp).toLocaleString()}</span>
            </div>
            <p className="text-[11px] text-neutral-200 font-sans leading-relaxed">
              {note.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
