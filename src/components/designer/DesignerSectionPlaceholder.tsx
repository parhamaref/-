/**
 * @file DesignerSectionPlaceholder.tsx
 * Modular placeholder view generator for sections pending business-feature implementation.
 */

import React from 'react';
import { Construction, ArrowLeft } from 'lucide-react';
import { DesignerNavSection } from '../../types/designer.types';
import { useDesignerStore } from '../../stores/designerStore';

interface DesignerSectionPlaceholderProps {
  sectionKey: DesignerNavSection;
  title: string;
  description: string;
  features: string[];
}

export const DesignerSectionPlaceholder: React.FC<DesignerSectionPlaceholderProps> = ({
  sectionKey,
  title,
  description,
  features,
}) => {
  const { setActiveSection } = useDesignerStore();

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-mono text-left animate-fadeIn">
      <div className="flex items-center gap-2 text-[9px] text-neutral-500 uppercase tracking-widest">
        <button
          onClick={() => setActiveSection('overview')}
          className="hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-3 h-3" />
          <span>OVERVIEW</span>
        </button>
        <span>/</span>
        <span className="text-white">{sectionKey.toUpperCase()}</span>
      </div>

      <div className="bg-[#0E0E0E] border border-[#222] p-8 rounded-sm space-y-6">
        <div className="flex items-start justify-between gap-4 border-b border-[#222] pb-5">
          <div className="space-y-1">
            <span className="text-[9px] text-emerald-400 uppercase tracking-widest font-bold block">
              ● INFRASTRUCTURE READY // MODULE FOUNDATION
            </span>
            <h2 className="font-serif text-2xl text-white uppercase font-bold tracking-wider">
              {title}
            </h2>
            <p className="text-xs text-neutral-400 font-sans leading-relaxed max-w-2xl">
              {description}
            </p>
          </div>
          <div className="p-3 bg-neutral-900 border border-[#2B2B2B] rounded-xs text-neutral-400 shrink-0">
            <Construction className="w-6 h-6 text-amber-400" />
          </div>
        </div>

        <div className="space-y-3">
          <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-bold">
            Planned Technical Features & Endpoints:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {features.map((feat, idx) => (
              <div
                key={idx}
                className="p-3 bg-black/50 border border-[#222] rounded-xs text-xs text-neutral-300 flex items-center gap-2.5"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                <span className="font-sans text-[11px] leading-snug">{feat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
