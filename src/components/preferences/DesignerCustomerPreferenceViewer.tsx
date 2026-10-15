/**
 * @file DesignerCustomerPreferenceViewer.tsx
 * Atelier Designer & Master Tailor Client Preference Dossier Viewer.
 *
 * Enables Atelier Directors and Tailors to:
 * - Review client taste profiles & persona classification before salon fittings
 * - Inspect favorite mills, favorite colors, fit silhouettes, and price ceilings
 * - View algorithmically generated commission recommendations for consultation
 * - Record artisan consultation styling directives
 */

import React, { useState } from 'react';
import {
  Sparkles,
  Palette,
  Layers,
  Scissors,
  Tag,
  DollarSign,
  User,
  ShieldCheck,
  Star,
  CheckCircle2,
  FileText,
  Clock,
  ChevronRight,
  ArrowRight,
  X,
  Compass,
} from 'lucide-react';
import { useCustomerPreferenceStore } from '../../stores/customerPreferenceStore';
import { CustomerPreferenceProfile } from '../../types/customerPreferences.types';

export const DesignerCustomerPreferenceViewer: React.FC = () => {
  const {
    profile,
    productRecommendations,
    marketingBlueprint,
    updateProfile,
  } = useCustomerPreferenceStore();

  const [tailorNoteInput, setTailorNoteInput] = useState(profile.personalStylingNotes || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveNotes = async () => {
    await updateProfile({ personalStylingNotes: tailorNoteInput });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fadeIn font-mono text-left max-w-6xl mx-auto">
      {/* Header */}
      <div className="p-6 bg-[#0F0F0F] border border-[#222] rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-4 h-4" />
            Client Consultation Dossier
          </div>
          <h2 className="font-serif text-2xl font-bold text-white uppercase tracking-wider">
            Client Taste & Preference Profile: {profile.customerName}
          </h2>
          <p className="text-xs text-neutral-400 font-sans">
            Consultation briefing dossier for Master Tailors prior to salon basted fittings.
          </p>
        </div>

        <div className="px-3.5 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase rounded-lg shrink-0">
          ● {profile.vipPersonaTitle}
        </div>
      </div>

      {/* Grid: 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Client Preference Matrix */}
        <div className="lg:col-span-7 space-y-4">
          {/* Favorite Colors Card */}
          <div className="p-5 bg-[#121212] border border-[#222] rounded-xl space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-white uppercase">
              <span className="flex items-center gap-2">
                <Palette className="w-3.5 h-3.5 text-amber-400" />
                Favorite Tailoring Colors ({profile.favoriteColors.length})
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {profile.favoriteColors.map((color) => (
                <div
                  key={color.id}
                  className="p-2 bg-[#171717] rounded-lg border border-[#262626] flex items-center gap-2"
                >
                  <div
                    className="w-4 h-4 rounded-full border border-white/20 shrink-0"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="text-[11px] text-white truncate">{color.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Favorite Fabrics Card */}
          <div className="p-5 bg-[#121212] border border-[#222] rounded-xl space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-white uppercase">
              <span className="flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                Favored Mills & Textile Qualities ({profile.favoriteFabrics.length})
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {profile.favoriteFabrics.map((fab) => (
                <div key={fab.id} className="p-2.5 bg-[#171717] rounded-lg border border-[#262626] text-xs">
                  <span className="text-[9px] text-amber-400 font-bold uppercase block">{fab.millName}</span>
                  <span className="text-white font-bold block">{fab.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Silhouette & Ease Tolerances */}
          <div className="p-5 bg-[#121212] border border-[#222] rounded-xl space-y-3">
            <span className="text-xs font-bold text-white uppercase flex items-center gap-2">
              <Scissors className="w-3.5 h-3.5 text-amber-400" />
              Pattern Draft & Ease Parameters
            </span>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#171717] rounded-lg border border-[#262626]">
                <span className="text-[10px] text-neutral-500 uppercase block font-bold">Preferred Silhouette</span>
                <span className="text-white font-bold">{profile.preferredFit}</span>
              </div>
              <div className="p-3 bg-[#171717] rounded-lg border border-[#262626]">
                <span className="text-[10px] text-neutral-500 uppercase block font-bold">Ease Tolerance</span>
                <span className="text-amber-300 font-bold">{profile.fitEaseTolerance}</span>
              </div>
            </div>
          </div>

          {/* Budget Ceiling */}
          <div className="p-5 bg-[#121212] border border-[#222] rounded-xl flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] text-neutral-500 uppercase font-bold block">
                Target Commission Budget
              </span>
              <span className="text-lg font-bold text-white font-mono">
                £{profile.priceRange.minPrice.toLocaleString()} - £{profile.priceRange.maxPrice.toLocaleString()} {profile.priceRange.currency}
              </span>
            </div>
            <span className="px-2.5 py-1 bg-neutral-800 text-neutral-300 rounded text-[10px] uppercase font-bold">
              {profile.priceRange.tier.replace(/_/g, ' ')}
            </span>
          </div>

          {/* Master Tailor Consultation Notes */}
          <div className="p-5 bg-[#121212] border border-[#222] rounded-xl space-y-2 text-xs">
            <span className="font-bold text-amber-400 uppercase block">
              Master Tailor Consultation Directives & Taste Notes:
            </span>
            <textarea
              value={tailorNoteInput}
              onChange={(e) => setTailorNoteInput(e.target.value)}
              rows={3}
              className="w-full bg-black border border-[#333] focus:border-amber-500 rounded-lg p-2.5 text-xs text-white outline-none"
              placeholder="Record fitting directives, lapel gorging requests, or cloth reservations..."
            />
            <div className="flex items-center justify-between pt-1">
              {saveSuccess ? (
                <span className="text-emerald-400 text-xs flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Notes saved to client dossier.
                </span>
              ) : <div />}
              <button
                onClick={handleSaveNotes}
                className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-bold uppercase text-[11px] rounded-lg cursor-pointer"
              >
                Save Directives
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Algorithmic Recommendations for Consultation */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 bg-[#121212] border border-amber-500/30 rounded-xl space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-amber-400 uppercase">
              <span className="flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5" />
                Algorithmically Recommended for Consultation
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              Pieces scored highest against client’s past preferences. Present these during the fitting discovery.
            </p>

            <div className="space-y-2.5 pt-2">
              {productRecommendations.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-[#171717] border border-[#282828] rounded-xl flex items-center gap-3 text-xs"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-14 h-14 rounded-lg object-cover border border-[#333] shrink-0"
                  />
                  <div className="overflow-hidden flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-amber-300 font-bold text-[10px] uppercase font-mono">
                        {item.matchScore}% Match
                      </span>
                      <span className="text-white font-bold text-[10px] font-mono">
                        £{item.price.toLocaleString()}
                      </span>
                    </div>
                    <h5 className="font-bold text-white text-xs truncate mt-0.5">{item.name}</h5>
                    <p className="text-[10px] text-neutral-400 truncate">{item.fabric}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Blueprint Summary */}
          {marketingBlueprint && (
            <div className="p-5 bg-[#121212] border border-[#222] rounded-xl space-y-2.5 text-xs">
              <span className="text-[10px] text-neutral-500 uppercase font-bold block">
                Next Commission Recommendation
              </span>
              <h4 className="font-serif text-sm font-bold text-white uppercase">
                {marketingBlueprint.nextRecommendedCommission.garmentType}
              </h4>
              <p className="text-[11px] text-neutral-300 leading-relaxed">
                {marketingBlueprint.nextRecommendedCommission.whyRecommended}
              </p>
              <div className="pt-2 text-[10px] text-neutral-400 space-y-1">
                {marketingBlueprint.tailorConsultationDirectives.map((d, i) => (
                  <div key={i} className="flex items-start gap-1.5">
                    <span className="text-amber-400">•</span>
                    <span>{d}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
