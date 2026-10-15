/**
 * @file WardrobeServiceTrackerModal.tsx
 * Live Atelier Service Progress Tracker for customer digital wardrobe.
 * Visualizes white-glove courier status, atelier reception, master tailor progress,
 * and dispatch timeline.
 */

import React from 'react';
import {
  X,
  CheckCircle2,
  Clock,
  Truck,
  Scissors,
  ShieldCheck,
  MapPin,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { WardrobeServiceRequest } from '../../../types/wardrobe.types';

interface WardrobeServiceTrackerModalProps {
  request: WardrobeServiceRequest | null;
  isOpen: boolean;
  onClose: () => void;
}

export const WardrobeServiceTrackerModal: React.FC<WardrobeServiceTrackerModalProps> = ({
  request,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !request) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0E0E0E] border border-[#2B2B2B] rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl text-left font-mono">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#222] bg-[#141414] flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest">
                  SERVICE DOSSIER • {request.id}
                </span>
                <span className="text-[9px] px-2 py-0.2 rounded-full bg-amber-500/20 text-amber-300 font-bold uppercase">
                  {request.status.replace(/_/g, ' ')}
                </span>
              </div>
              <h3 className="font-serif text-lg font-bold text-white uppercase tracking-wider truncate">
                {request.garmentName}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
          {/* Summary Box */}
          <div className="p-4 rounded-xl bg-[#141414] border border-[#252525] space-y-2">
            <div className="flex items-center justify-between text-neutral-400 text-[11px]">
              <span>Service Type:</span>
              <span className="text-white font-bold">{request.actionType.replace(/_/g, ' ')}</span>
            </div>
            <div className="flex items-center justify-between text-neutral-400 text-[11px]">
              <span>Assigned Atelier:</span>
              <span className="text-neutral-200">{request.preferredFittingSalon}</span>
            </div>
            {request.assignedArtisanName && (
              <div className="flex items-center justify-between text-neutral-400 text-[11px]">
                <span>Master Artisan:</span>
                <span className="text-amber-300 font-bold">{request.assignedArtisanName}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-neutral-400 text-[11px]">
              <span>Target Completion:</span>
              <span className="text-emerald-400 font-mono">
                {request.targetCompletionDate
                  ? new Date(request.targetCompletionDate).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : '7 business days'}
              </span>
            </div>
          </div>

          {/* Stepper Timeline */}
          <div className="space-y-4">
            <h4 className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold">
              Atelier Milestones & Custody Log
            </h4>

            <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#252525]">
              {request.timeline.map((step, idx) => {
                return (
                  <div key={idx} className="relative">
                    <div
                      className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center border text-[10px] ${
                        step.completed
                          ? 'bg-amber-500 border-amber-400 text-black font-bold'
                          : 'bg-[#181818] border-neutral-700 text-neutral-500'
                      }`}
                    >
                      {step.completed ? '✓' : idx + 1}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span
                          className={`font-bold text-xs ${
                            step.completed ? 'text-white' : 'text-neutral-500'
                          }`}
                        >
                          {step.title}
                        </span>
                        {step.completed && (
                          <span className="text-[10px] text-neutral-500 font-mono">
                            {new Date(step.timestamp).toLocaleDateString([], {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-neutral-400 font-sans leading-relaxed">
                        {step.description}
                      </p>
                      {step.actor && (
                        <span className="text-[9.5px] text-amber-400/80 font-mono block">
                          Verified by: {step.actor}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#141414] border-t border-[#222] flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs rounded-xl"
          >
            Close Tracker
          </button>
        </div>
      </div>
    </div>
  );
};
