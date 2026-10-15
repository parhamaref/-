/**
 * @file CustomerPreferencesWorkspace.tsx
 * VIP Customer Preference Management Center & Intelligent Recommendation Suite.
 *
 * Implements:
 * - Favorite Colors, Fabrics, Designers, Fit Silhouettes, Styles, Collections, and Price Ranges
 * - Real-Time Personalized Product Suggestions with Explainable Match Scores (0-100%)
 * - Thematic Seasonal Collection Suggestions
 * - VIP Persona Classification & Next Commission Blueprint
 * - Marketing Personalization Controls
 */

import React, { useState } from 'react';
import {
  Sparkles,
  Palette,
  Layers,
  Scissors,
  Tag,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Star,
  Sliders,
  DollarSign,
  Bell,
  ArrowRight,
  Eye,
  RotateCcw,
  Plus,
  X,
  Compass,
  Check,
  User,
  Heart,
  ChevronRight,
} from 'lucide-react';
import { useCustomerPreferenceStore } from '../../stores/customerPreferenceStore';
import {
  PreferredColor,
  PreferredFabric,
  FitSilhouettePreference,
  FitEaseTolerance,
  WardrobeStyleAesthetic,
} from '../../types/customerPreferences.types';
import { SeasonCategory } from '../../types/collection.types';

const PRESET_COLORS: PreferredColor[] = [
  { id: 'c_mid', name: 'Midnight Obsidian', hex: '#0B0D12', category: 'Dark Tailoring' },
  { id: 'c_sage', name: 'Sartorial Sage', hex: '#4A5B4C', category: 'Earth Tone' },
  { id: 'c_bordeaux', name: 'Imperial Bordeaux', hex: '#4A0E17', category: 'Dark Tailoring' },
  { id: 'c_ivory', name: 'Alabaster Ivory', hex: '#FDFBF7', category: 'Neutral' },
  { id: 'c_charcoal', name: 'Peat Charcoal', hex: '#1C1C1E', category: 'Dark Tailoring' },
  { id: 'c_camel', name: 'Somerset Camel', hex: '#C19A6B', category: 'Earth Tone' },
  { id: 'c_gold', name: '24k Gold Navy', hex: '#14213D', category: 'Dark Tailoring' },
  { id: 'c_slate', name: 'Glacial Slate', hex: '#64748B', category: 'Neutral' },
];

const PRESET_FABRICS: PreferredFabric[] = [
  { id: 'f_loro', name: 'Super 160s Royal Worsted', millName: 'Loro Piana', category: 'Worsted Wool' },
  { id: 'f_fox', name: 'Heritage Somerset Flannel (370g)', millName: 'Fox Brothers & Co.', category: 'Flannel' },
  { id: 'f_scabal', name: 'Ripple Zibeline Pure Cashmere', millName: 'Scabal', category: 'Cashmere' },
  { id: 'f_dormeuil', name: 'Ceremonial Silk Barathea 180s', millName: 'Dormeuil', category: 'Silk' },
  { id: 'f_solbiati', name: 'Washed Irish Linen & Tussah Silk', millName: 'Solbiati (Loro Piana)', category: 'Linen' },
  { id: 'f_lovat', name: 'Kirkton Estate Cheviot Tweed', millName: 'Lovat Mill (Scotland)', category: 'Tweed' },
  { id: 'f_smith', name: 'High-Twist Finmeresco Tropical (280g)', millName: 'Smith Woollens', category: 'Worsted Wool' },
  { id: 'f_vicuna', name: 'Certified Peruvian Golden Fleece Vicuña', millName: 'Inca Royal Mills', category: 'Exotic' },
];

const FIT_OPTIONS: FitSilhouettePreference[] = [
  'Sleek Savile Row Cut',
  'Traditional English Drape',
  'Neapolitan Soft Tailoring',
  'Architectural Structured',
  'Relaxed Casual Bespoke',
  'Classic British Military',
];

const EASE_OPTIONS: FitEaseTolerance[] = [
  'Snug Athletic Fit (-0.5cm ease)',
  'Standard True-to-Measure (0cm ease)',
  'Comfort Ease (+1.5cm ease)',
  'Generous Drape Ease (+3.0cm ease)',
];

const STYLE_OPTIONS: WardrobeStyleAesthetic[] = [
  'Double-Breasted Heritage',
  '3-Piece Waistcoat Ensemble',
  'Black-Tie Ceremonial Evening',
  'Field & Safari Utility Tailoring',
  'Unstructured Summer Linen',
  'High-Collar Architectural Greatcoat',
  'Single-Breasted Notch Executive',
];

const COLLECTION_OPTIONS: SeasonCategory[] = [
  'Spring',
  'Summer',
  'Autumn',
  'Winter',
  'Bridal',
  'Luxury',
];

export const CustomerPreferencesWorkspace: React.FC<{
  onCommissionProduct?: (productName: string) => void;
  onExploreCollection?: (slug: string) => void;
}> = ({ onCommissionProduct, onExploreCollection }) => {
  const {
    profile,
    productRecommendations,
    collectionRecommendations,
    marketingBlueprint,
    updateProfile,
    toggleColor,
    toggleFabric,
    toggleStyle,
    toggleCollection,
    setFit,
    setTolerance,
    setPriceRange,
    updateMarketing,
    resetToDefault,
    isSaving,
  } = useCustomerPreferenceStore();

  const [activeTab, setActiveTab] = useState<'PREFERENCES' | 'RECOMMENDATIONS' | 'MARKETING'>('RECOMMENDATIONS');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, isMin: boolean) => {
    const val = Number(e.target.value);
    if (isMin) {
      setPriceRange(val, Math.max(val + 500, profile.priceRange.maxPrice));
    } else {
      setPriceRange(Math.min(profile.priceRange.minPrice, val - 500), val);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn font-mono text-left max-w-7xl 2xl:max-w-[1600px] mx-auto">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-70 bg-emerald-950 border border-emerald-500/50 text-emerald-200 px-5 py-3 rounded-xl text-xs flex items-center gap-3 shadow-2xl animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#121212] via-[#0E0E0E] to-[#141414] border border-[#2B2B2B] p-6 sm:p-8">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            VIP Client Taste & Styling Engine
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold uppercase tracking-wider text-white">
            Personal Taste & Recommendation Suite
          </h1>
          <p className="text-sm text-neutral-300 font-sans leading-relaxed">
            Curate your favored color palettes, certified mill cloths, silhouette fits, and price boundaries. Our recommendation engine tailors bespoke product suggestions and runway previews to your private aesthetic.
          </p>
        </div>

        <div className="mt-4 sm:mt-0 sm:absolute sm:top-8 sm:right-8 z-10 flex items-center gap-2.5">
          <button
            onClick={() => {
              resetToDefault();
              showToast('Reset to Lord Alistair VIP defaults.');
            }}
            className="px-3 py-1.5 rounded-lg border border-[#333] hover:bg-neutral-800 text-neutral-400 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Defaults
          </button>
        </div>
      </div>

      {/* Persona Badge Summary Card */}
      <div className="p-5 bg-[#0D0D0D] border border-[#222] rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <User className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest block">
              IDENTIFIED BESPOKE PERSONA
            </span>
            <h3 className="font-serif text-lg font-bold text-white uppercase">
              {profile.vipPersonaTitle}
            </h3>
            <p className="text-xs text-neutral-400">
              Preferred Fit: <strong className="text-neutral-200">{profile.preferredFit}</strong> · Budget Tier:{' '}
              <strong className="text-amber-300">{profile.priceRange.tier.replace(/_/g, ' ')}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right text-xs">
            <span className="text-[10px] text-neutral-500 uppercase block font-bold">Bespoke Budget</span>
            <span className="text-white font-mono font-bold">
              £{profile.priceRange.minPrice.toLocaleString()} - £{profile.priceRange.maxPrice.toLocaleString()}
            </span>
          </div>
          {isSaving && (
            <span className="text-xs text-amber-400 animate-pulse font-bold">
              Saving preferences...
            </span>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-[#222] bg-[#0E0E0E] rounded-xl overflow-x-auto text-xs shrink-0">
        <button
          onClick={() => setActiveTab('RECOMMENDATIONS')}
          className={`px-5 py-3 font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'RECOMMENDATIONS'
              ? 'border-amber-400 text-amber-400 bg-amber-500/5'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          Personalized Recommendations
          <span className="px-1.5 py-0.2 text-[10px] bg-amber-500 text-black font-extrabold rounded">
            {productRecommendations.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('PREFERENCES')}
          className={`px-5 py-3 font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'PREFERENCES'
              ? 'border-amber-400 text-amber-400 bg-amber-500/5'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          Edit Taste & Silhouette Preferences
        </button>

        <button
          onClick={() => setActiveTab('MARKETING')}
          className={`px-5 py-3 font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'MARKETING'
              ? 'border-amber-400 text-amber-400 bg-amber-500/5'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          VIP Marketing & Trunk Show Channels
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: PERSONALIZED RECOMMENDATIONS */}
      {/* ========================================================================= */}
      {activeTab === 'RECOMMENDATIONS' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Blueprint Hero Card */}
          {marketingBlueprint && (
            <div className="p-6 bg-[#111111] border border-amber-500/30 rounded-2xl relative overflow-hidden">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-2 max-w-2xl">
                  <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest block">
                    NEXT RECOMMENDED BESPOKE COMMISSION
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-white uppercase">
                    {marketingBlueprint.nextRecommendedCommission.garmentType}
                  </h3>
                  <p className="text-xs text-neutral-300 font-sans leading-relaxed">
                    {marketingBlueprint.nextRecommendedCommission.whyRecommended}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                    <span className="text-neutral-400">
                      Cloth: <strong className="text-neutral-200">{marketingBlueprint.nextRecommendedCommission.suggestedCloth}</strong>
                    </span>
                    <span className="text-neutral-600">•</span>
                    <span className="text-neutral-400">
                      Colorway: <strong className="text-neutral-200">{marketingBlueprint.nextRecommendedCommission.suggestedColor}</strong>
                    </span>
                    <span className="text-neutral-600">•</span>
                    <span className="text-amber-300 font-bold font-mono">
                      Est. £{marketingBlueprint.nextRecommendedCommission.estimatedCostGbp.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-3">
                  <button
                    onClick={() => {
                      onCommissionProduct?.(marketingBlueprint.nextRecommendedCommission.garmentType);
                      showToast(`Blueprint registered for consultation with Head Cutter.`);
                    }}
                    className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-extrabold uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-amber-950 cursor-pointer flex items-center gap-2"
                  >
                    <Scissors className="w-4 h-4" />
                    Request Blueprint Consultation
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Section: Product Suggestions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl font-bold text-white uppercase tracking-wider">
                  Curated Garment Suggestions ({productRecommendations.length})
                </h3>
                <p className="text-xs text-neutral-400">
                  Scored algorithmically against your favorite fabrics, color palettes, and Savile Row silhouette bias.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {productRecommendations.map((item) => (
                <div
                  key={item.id}
                  className={`bg-[#0C0C0C] border rounded-2xl overflow-hidden shadow-xl transition-all hover:border-amber-500/50 flex flex-col justify-between ${
                    item.isTopRecommendation ? 'border-amber-500/50 ring-1 ring-amber-500/30' : 'border-[#222]'
                  }`}
                >
                  <div>
                    {/* Image & Match Score Overlay */}
                    <div className="aspect-[4/3] bg-black relative overflow-hidden group">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3 px-2.5 py-1 bg-black/85 backdrop-blur-md border border-amber-500/50 rounded-lg text-xs font-bold text-amber-300 flex items-center gap-1.5 shadow-lg">
                        <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
                        <span>{item.matchScore}% Match</span>
                      </div>

                      {item.isTopRecommendation && (
                        <div className="absolute top-3 left-3 px-2 py-0.5 bg-amber-500 text-black text-[9px] font-extrabold uppercase rounded shadow">
                          Top Match
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-3">
                      <div>
                        <span className="text-[10px] text-neutral-500 uppercase font-bold block">
                          {item.category} · Tailored by {item.designer}
                        </span>
                        <h4 className="font-serif text-base font-bold text-white uppercase mt-0.5">
                          {item.name}
                        </h4>
                      </div>

                      <div className="space-y-1 text-xs">
                        <p className="text-neutral-400 text-[11px]">
                          Cloth: <strong className="text-neutral-200">{item.fabric}</strong>
                        </p>
                        <p className="text-neutral-400 text-[11px]">
                          Cut: {item.silhouette}
                        </p>
                      </div>

                      {/* Matching Reasons Tags */}
                      <div className="space-y-1 pt-1">
                        <span className="text-[9px] text-neutral-500 uppercase font-bold block">
                          Why this matches your taste:
                        </span>
                        <div className="space-y-1">
                          {item.matchingReasons.map((reason, i) => (
                            <div key={i} className="flex items-center gap-1.5 text-[10.5px] text-neutral-300">
                              <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                              <span>{reason}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="p-4 bg-[#111111] border-t border-[#1E1E1E] flex items-center justify-between">
                    <span className="font-mono text-amber-300 font-bold text-sm">
                      £{item.price.toLocaleString('en-GB')}
                    </span>

                    <button
                      onClick={() => {
                        onCommissionProduct?.(item.name);
                        showToast(`Commission inquiry for "${item.name}" registered.`);
                      }}
                      className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Scissors className="w-3.5 h-3.5" />
                      Commission Piece
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Collection Suggestions */}
          <div className="space-y-4 pt-4 border-t border-[#222]">
            <div>
              <h3 className="font-serif text-xl font-bold text-white uppercase tracking-wider">
                Recommended Seasonal Collections
              </h3>
              <p className="text-xs text-neutral-400">
                Seasonal catalogs that feature your preferred mills, palettes, and silhouette moods.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {collectionRecommendations.map((col) => (
                <div
                  key={col.id}
                  className="bg-[#0C0C0C] border border-[#222] hover:border-amber-500/40 rounded-xl overflow-hidden shadow-lg flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-[16/9] bg-black relative overflow-hidden">
                      <img src={col.coverImageUrl} alt={col.title} className="w-full h-full object-cover" />
                      <div className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-black/80 rounded text-xs font-bold text-amber-300 border border-white/20">
                        {col.matchScore}% Match
                      </div>
                    </div>
                    <div className="p-4 space-y-2 text-xs">
                      <span className="text-[10px] text-amber-400 font-bold uppercase">{col.season} Collection</span>
                      <h4 className="font-serif text-base font-bold text-white uppercase">{col.title}</h4>
                      <p className="text-neutral-300 text-[11px] leading-relaxed italic">
                        "{col.thematicRationale}"
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 bg-[#111111] border-t border-[#1E1E1E] flex items-center justify-between text-xs">
                    <span className="text-neutral-400 text-[10px]">{col.curatedPiecesCount} Garments</span>
                    <button
                      onClick={() => onExploreCollection?.(col.slug)}
                      className="text-amber-400 hover:text-white font-bold uppercase text-[11px] flex items-center gap-1 cursor-pointer"
                    >
                      View Lookbook <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: EDIT PREFERENCES */}
      {/* ========================================================================= */}
      {activeTab === 'PREFERENCES' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Favorite Colors Section */}
          <div className="p-6 bg-[#0E0E0E] border border-[#222] rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Palette className="w-4 h-4 text-amber-400" />
                  1. Favorite Tailoring Colors & Palettes
                </h3>
                <p className="text-xs text-neutral-400">
                  Select shades you gravitate towards for suits, overcoats, and silk linings.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {PRESET_COLORS.map((color) => {
                const isSelected = profile.favoriteColors.some((c) => c.hex === color.hex);
                return (
                  <button
                    key={color.id}
                    onClick={() => toggleColor(color)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500/60 shadow-md'
                        : 'bg-[#141414] border-[#262626] hover:border-[#333]'
                    }`}
                  >
                    <div
                      className="w-7 h-7 rounded-lg border border-white/20 shadow-inner shrink-0"
                      style={{ backgroundColor: color.hex }}
                    />
                    <div className="overflow-hidden">
                      <span className="text-xs font-bold text-white block truncate">{color.name}</span>
                      <span className="text-[10px] text-neutral-400 block">{color.category}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Favorite Fabrics Section */}
          <div className="p-6 bg-[#0E0E0E] border border-[#222] rounded-2xl space-y-4">
            <div>
              <h3 className="font-serif text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                2. Favorite Fabrics & Certified Mills
              </h3>
              <p className="text-xs text-neutral-400">
                Tell our algorithm which world-renowned textile mills and compositions you prefer.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {PRESET_FABRICS.map((fabric) => {
                const isSelected = profile.favoriteFabrics.some((f) => f.name === fabric.name);
                return (
                  <button
                    key={fabric.id}
                    onClick={() => toggleFabric(fabric)}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500/60 shadow-md'
                        : 'bg-[#141414] border-[#262626] hover:border-[#333]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] text-amber-400 font-bold uppercase">{fabric.millName}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                    </div>
                    <span className="text-xs font-bold text-white block">{fabric.name}</span>
                    <span className="text-[10px] text-neutral-400 block mt-1">{fabric.category}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preferred Fit & Ease Tolerance */}
          <div className="p-6 bg-[#0E0E0E] border border-[#222] rounded-2xl space-y-6">
            <div>
              <h3 className="font-serif text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Scissors className="w-4 h-4 text-amber-400" />
                3. Preferred Silhouette Fit & Anatomical Ease
              </h3>
              <p className="text-xs text-neutral-400">
                Calibrates pattern draft balance across jacket drape, waist suppression, and movement allowance.
              </p>
            </div>

            <div className="space-y-3">
              <span className="text-[11px] text-neutral-400 font-bold uppercase block">
                Select Tailoring Silhouette Cut:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {FIT_OPTIONS.map((fit) => (
                  <button
                    key={fit}
                    onClick={() => setFit(fit)}
                    className={`p-3.5 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer flex items-center justify-between ${
                      profile.preferredFit === fit
                        ? 'bg-amber-500 text-black border-amber-400 font-extrabold shadow-md'
                        : 'bg-[#141414] text-neutral-300 border-[#262626] hover:border-[#333]'
                    }`}
                  >
                    <span>{fit}</span>
                    {profile.preferredFit === fit && <Check className="w-4 h-4 text-black" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t border-[#222]">
              <span className="text-[11px] text-neutral-400 font-bold uppercase block">
                Anatomical Ease Tolerance:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {EASE_OPTIONS.map((ease) => (
                  <button
                    key={ease}
                    onClick={() => setTolerance(ease)}
                    className={`p-3 rounded-xl border text-xs text-left transition-all cursor-pointer flex items-center justify-between ${
                      profile.fitEaseTolerance === ease
                        ? 'bg-amber-500/15 border-amber-500 text-amber-300 font-bold'
                        : 'bg-[#141414] text-neutral-400 border-[#262626] hover:border-[#333]'
                    }`}
                  >
                    <span>{ease}</span>
                    {profile.fitEaseTolerance === ease && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Preferred Styles Aesthetics */}
          <div className="p-6 bg-[#0E0E0E] border border-[#222] rounded-2xl space-y-4">
            <div>
              <h3 className="font-serif text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Tag className="w-4 h-4 text-amber-400" />
                4. Preferred Wardrobe Style Aesthetics
              </h3>
              <p className="text-xs text-neutral-400">
                Choose the wardrobe silhouettes you wear most frequently.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {STYLE_OPTIONS.map((style) => {
                const isSelected = profile.preferredStyles.includes(style);
                return (
                  <button
                    key={style}
                    onClick={() => toggleStyle(style)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer flex items-center gap-2 ${
                      isSelected
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-md'
                        : 'bg-[#141414] text-neutral-400 border-[#262626] hover:border-[#333]'
                    }`}
                  >
                    <span>{style}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preferred Seasonal Collections */}
          <div className="p-6 bg-[#0E0E0E] border border-[#222] rounded-2xl space-y-4">
            <div>
              <h3 className="font-serif text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Compass className="w-4 h-4 text-amber-400" />
                5. Preferred Seasonal Collections
              </h3>
              <p className="text-xs text-neutral-400">
                Select which seasonal releases you want featured in your priority feed.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5">
              {COLLECTION_OPTIONS.map((season) => {
                const isSelected = profile.preferredCollections.includes(season);
                return (
                  <button
                    key={season}
                    onClick={() => toggleCollection(season)}
                    className={`p-3 rounded-xl border text-xs font-bold uppercase text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500 text-black border-amber-400 font-extrabold shadow-md'
                        : 'bg-[#141414] text-neutral-400 border-[#262626] hover:border-[#333]'
                    }`}
                  >
                    {season}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range Preferences */}
          <div className="p-6 bg-[#0E0E0E] border border-[#222] rounded-2xl space-y-4">
            <div>
              <h3 className="font-serif text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-amber-400" />
                6. Bespoke Commission Price Range
              </h3>
              <p className="text-xs text-neutral-400">
                Calibrate your target investment window per bespoke commission.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-[#141414] rounded-xl border border-[#262626] space-y-2">
                <label className="text-[10px] text-neutral-400 uppercase font-bold block">
                  Minimum Commission Budget (GBP)
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-neutral-500 font-mono">£</span>
                  <input
                    type="number"
                    step="500"
                    value={profile.priceRange.minPrice}
                    onChange={(e) => handlePriceChange(e, true)}
                    className="w-full bg-black border border-[#333] focus:border-amber-500 rounded-lg p-2 text-sm text-white font-mono outline-none"
                  />
                </div>
              </div>

              <div className="p-4 bg-[#141414] rounded-xl border border-[#262626] space-y-2">
                <label className="text-[10px] text-neutral-400 uppercase font-bold block">
                  Maximum Commission Budget (GBP)
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-neutral-500 font-mono">£</span>
                  <input
                    type="number"
                    step="500"
                    value={profile.priceRange.maxPrice}
                    onChange={(e) => handlePriceChange(e, false)}
                    className="w-full bg-black border border-[#333] focus:border-amber-500 rounded-lg p-2 text-sm text-white font-mono outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2.5 text-xs text-neutral-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={profile.priceRange.allowHighValueExceptions}
                  onChange={(e) =>
                    updateProfile({
                      priceRange: {
                        ...profile.priceRange,
                        allowHighValueExceptions: e.target.checked,
                      },
                    })
                  }
                  className="accent-amber-500 rounded"
                />
                <span>
                  Notify me of rare heirloom exceptions (e.g. Peruvian Vicuña or Scabal 24k Gold) exceeding my ceiling.
                </span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: MARKETING PERSONALIZATION */}
      {/* ========================================================================= */}
      {activeTab === 'MARKETING' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="p-6 bg-[#0E0E0E] border border-[#222] rounded-2xl space-y-4">
            <div>
              <h3 className="font-serif text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-400" />
                VIP Concierge & Marketing Personalization
              </h3>
              <p className="text-xs text-neutral-400">
                Select which private atelier announcements and bespoke privileges you wish to receive.
              </p>
            </div>

            <div className="space-y-3">
              <label className="p-4 bg-[#141414] border border-[#262626] rounded-xl flex items-center justify-between cursor-pointer hover:border-amber-500/40 transition-colors">
                <div>
                  <span className="font-bold text-white text-xs block">
                    Private Salon VIP Trunk Show Invites
                  </span>
                  <span className="text-[11px] text-neutral-400 block mt-0.5">
                    Personalized invitations to Mayfair, Geneva, and Paris private salon trunk exhibitions.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={profile.marketing.vipTrunkShowInvites}
                  onChange={(e) => updateMarketing({ vipTrunkShowInvites: e.target.checked })}
                  className="w-5 h-5 accent-amber-500 rounded"
                />
              </label>

              <label className="p-4 bg-[#141414] border border-[#262626] rounded-xl flex items-center justify-between cursor-pointer hover:border-amber-500/40 transition-colors">
                <div>
                  <span className="font-bold text-white text-xs block">
                    Rare Mill Textile Allocation Priority Alerts
                  </span>
                  <span className="text-[11px] text-neutral-400 block mt-0.5">
                    First notice when rare bolt yardages from Loro Piana, Scabal, or Fox Brothers arrive in London.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={profile.marketing.rareTextileAllocationAlerts}
                  onChange={(e) => updateMarketing({ rareTextileAllocationAlerts: e.target.checked })}
                  className="w-5 h-5 accent-amber-500 rounded"
                />
              </label>

              <label className="p-4 bg-[#141414] border border-[#262626] rounded-xl flex items-center justify-between cursor-pointer hover:border-amber-500/40 transition-colors">
                <div>
                  <span className="font-bold text-white text-xs block">
                    Seasonal Collection Early Lookbook Access
                  </span>
                  <span className="text-[11px] text-neutral-400 block mt-0.5">
                    72-hour preview window prior to public seasonal runway release.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={profile.marketing.seasonalLookbookEarlyAccess}
                  onChange={(e) => updateMarketing({ seasonalLookbookEarlyAccess: e.target.checked })}
                  className="w-5 h-5 accent-amber-500 rounded"
                />
              </label>

              <label className="p-4 bg-[#141414] border border-[#262626] rounded-xl flex items-center justify-between cursor-pointer hover:border-amber-500/40 transition-colors">
                <div>
                  <span className="font-bold text-white text-xs block">
                    Private Fitting Salon Champagne Reservation
                  </span>
                  <span className="text-[11px] text-neutral-400 block mt-0.5">
                    Complimentary vintage champagne reception during bespoke basted fitting appointments.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={profile.marketing.fittingSalonChampagneBooking}
                  onChange={(e) => updateMarketing({ fittingSalonChampagneBooking: e.target.checked })}
                  className="w-5 h-5 accent-amber-500 rounded"
                />
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
