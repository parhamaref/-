/**
 * @file CollectionPages.tsx
 * Public & Client-Facing Seasonal Collections Showcase and Lookbook.
 *
 * Implements:
 * - Flagship Featured Collection Runway Hero
 * - Seasonal Category Filters (Spring, Summer, Autumn, Winter, Bridal, Luxury)
 * - Collection Story & Creative Director Muse reading room
 * - Curated Collection Products & Bespoke Commission triggers
 * - Full lookbook galleries with high-resolution editorial photography
 */

import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  Filter,
  Eye,
  Star,
  ChevronRight,
  Layers,
  Palette,
  Scissors,
  ArrowRight,
  X,
  Globe,
  Lock,
  Clock,
  Archive,
  CheckCircle2,
  Share2,
} from 'lucide-react';
import { useCollectionStore } from '../../stores/collectionStore';
import {
  SeasonalCollection,
  SeasonCategory,
  CollectionProductItem,
} from '../../types/collection.types';

const SEASONS: Array<{ id: SeasonCategory | 'ALL'; label: string }> = [
  { id: 'ALL', label: 'All Collections' },
  { id: 'Spring', label: 'Spring' },
  { id: 'Summer', label: 'Summer' },
  { id: 'Autumn', label: 'Autumn' },
  { id: 'Winter', label: 'Winter' },
  { id: 'Bridal', label: 'Bridal & Gala' },
  { id: 'Luxury', label: 'High Luxury' },
];

export const CollectionPages: React.FC<{
  onSelectProduct?: (product: CollectionProductItem) => void;
  onNavigateHome?: () => void;
}> = ({ onSelectProduct, onNavigateHome }) => {
  const {
    filteredCollections,
    featuredCollections,
    countsBySeason,
    filters,
    setSeasonFilter,
    setFeaturedOnly,
    setSearchQuery,
    setSortBy,
  } = useCollectionStore();

  const [inspectingCollection, setInspectingCollection] = useState<SeasonalCollection | null>(null);
  const [activeGarmentTab, setActiveGarmentTab] = useState<'PRODUCTS' | 'STORY' | 'LOOKBOOK'>('PRODUCTS');
  const [selectedProductDetail, setSelectedProductDetail] = useState<CollectionProductItem | null>(null);
  const [commissionSuccessToast, setCommissionSuccessToast] = useState<string | null>(null);

  // Featured flagship collection for top runway hero
  const flagshipCollection = featuredCollections[0] || filteredCollections[0] || null;

  const handleCommissionClick = (product: CollectionProductItem) => {
    setSelectedProductDetail(null);
    setCommissionSuccessToast(`Commission inquiry for "${product.name}" registered with Private Salon.`);
    setTimeout(() => setCommissionSuccessToast(null), 4000);
    onSelectProduct?.(product);
  };

  return (
    <div className="space-y-12 animate-fadeIn font-mono text-left max-w-7xl 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Toast */}
      {commissionSuccessToast && (
        <div className="fixed bottom-6 right-6 z-70 bg-emerald-950 border border-emerald-500/50 text-emerald-200 px-5 py-3 rounded-xl text-xs flex items-center gap-3 shadow-2xl animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{commissionSuccessToast}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. FLAGSHIP FEATURED HERO RUNWAY BANNER */}
      {/* ========================================================================= */}
      {flagshipCollection && (
        <div className="relative rounded-3xl overflow-hidden border border-[#2B2B2B] shadow-2xl group min-h-[460px] flex flex-col justify-end">
          {/* Backdrop Image */}
          <div className="absolute inset-0 z-0">
            <img
              src={flagshipCollection.heroBannerUrl || flagshipCollection.coverImageUrl}
              alt={flagshipCollection.title}
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700 brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 p-6 sm:p-12 max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-amber-500 text-black text-[10px] font-extrabold uppercase tracking-widest rounded-full shadow-lg">
                ★ FEATURED SPOTLIGHT · {flagshipCollection.seasonCode}
              </span>
              <span className="px-2.5 py-1 bg-black/70 border border-white/20 text-neutral-300 text-[10px] font-bold uppercase tracking-wider rounded-full">
                {flagshipCollection.season} Collection {flagshipCollection.year}
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white uppercase tracking-wider leading-tight">
              {flagshipCollection.title}
            </h1>

            <p className="text-neutral-300 text-sm sm:text-base font-sans line-clamp-3 leading-relaxed">
              {flagshipCollection.storyNarrative}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => setInspectingCollection(flagshipCollection)}
                className="px-6 py-3 bg-white text-black hover:bg-neutral-200 font-extrabold uppercase text-xs tracking-widest rounded-xl transition-all shadow-xl flex items-center gap-2 cursor-pointer"
              >
                <span>Explore Full Collection & Garments</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <span className="text-xs text-neutral-400 font-mono">
                {flagshipCollection.productCount} Hand-Tailored Pieces
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. SEASONAL FILTER BAR & SEARCH CONTROLS */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#222] pb-4">
          <div>
            <h2 className="font-serif text-2xl font-bold text-white uppercase tracking-wider">
              Seasonal Haute-Couture Lookbooks
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Curated by Daniel’s Maison and Savile Row artisans across spring frescós, summer linens, autumn flannels, winter cashmeres, and ceremonial gala dress.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filters.searchQuery || ''}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search collections or fabrics..."
              className="w-full bg-[#121212] border border-[#2B2B2B] focus:border-amber-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white outline-none"
            />
          </div>
        </div>

        {/* Season Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {SEASONS.map((s) => {
            const isSelected = filters.season === s.id;
            const count = s.id === 'ALL' ? filteredCollections.length : countsBySeason[s.id] || 0;

            return (
              <button
                key={s.id}
                onClick={() => setSeasonFilter(s.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? 'bg-amber-500 text-black shadow-lg shadow-amber-950 font-extrabold'
                    : 'bg-[#121212] text-neutral-400 hover:text-white border border-[#222] hover:border-[#333]'
                }`}
              >
                <span>{s.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-black/30 text-black' : 'bg-neutral-800 text-neutral-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}

          <div className="h-6 w-[1px] bg-neutral-800 my-auto mx-1" />

          {/* Featured Toggle */}
          <button
            onClick={() => setFeaturedOnly(!filters.featuredOnly)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
              filters.featuredOnly
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                : 'bg-[#121212] text-neutral-400 border border-[#222] hover:text-white'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            Featured Runway
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. COLLECTION CARDS CATALOG GRID */}
      {/* ========================================================================= */}
      {filteredCollections.length === 0 ? (
        <div className="p-16 text-center bg-[#0D0D0D] border border-[#222] rounded-3xl space-y-3">
          <p className="text-neutral-400 text-sm">No collections found matching the current criteria.</p>
          <button
            onClick={() => {
              setSeasonFilter('ALL');
              setFeaturedOnly(false);
              setSearchQuery('');
            }}
            className="text-xs text-amber-400 uppercase font-bold hover:underline cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCollections.map((col) => (
            <div
              key={col.id}
              onClick={() => setInspectingCollection(col)}
              className="bg-[#0C0C0C] border border-[#222] hover:border-amber-500/50 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer"
            >
              <div>
                {/* Cover Image Container */}
                <div className="aspect-[16/11] bg-black relative overflow-hidden">
                  <img
                    src={col.coverImageUrl}
                    alt={col.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 bg-black/80 backdrop-blur-md border border-white/20 rounded-md text-[10px] text-white font-bold uppercase tracking-wider">
                      {col.season} · {col.seasonCode}
                    </span>

                    {col.isFeatured && (
                      <span className="px-2 py-0.5 bg-amber-500 text-black text-[9px] font-bold uppercase tracking-wider rounded">
                        ★ Featured
                      </span>
                    )}
                  </div>

                  {/* Bottom Image Overlay */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px]">
                    <span className="text-neutral-300 font-bold bg-black/70 px-2 py-0.5 rounded backdrop-blur-sm">
                      {col.productCount} Garments Curated
                    </span>
                    {col.runwayLocation && (
                      <span className="text-neutral-400 text-[10px] truncate max-w-[150px]">
                        {col.runwayLocation}
                      </span>
                    )}
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 space-y-3">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-white uppercase tracking-wider group-hover:text-amber-300 transition-colors">
                      {col.title}
                    </h3>
                    <p className="text-xs text-neutral-400 mt-0.5 line-clamp-1">{col.subtitle}</p>
                  </div>

                  <p className="text-xs text-neutral-300 font-sans line-clamp-2 leading-relaxed">
                    "{col.storyNarrative}"
                  </p>

                  {/* Textile & Palette tags */}
                  {col.colorPalette && col.colorPalette.length > 0 && (
                    <div className="flex items-center gap-1.5 pt-2">
                      <span className="text-[9px] text-neutral-500 uppercase font-bold mr-1">
                        Palette:
                      </span>
                      {col.colorPalette.slice(0, 4).map((c, i) => (
                        <div
                          key={i}
                          className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm"
                          style={{ backgroundColor: c.hex }}
                          title={`${c.name} (${c.hex})`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-4 bg-[#111111] border-t border-[#1E1E1E] flex items-center justify-between text-xs">
                <span className="text-[10px] text-neutral-400 uppercase font-bold">
                  Curated by {col.artisticDirector}
                </span>

                <span className="text-amber-400 group-hover:translate-x-1 transition-transform flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider">
                  View Lookbook <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. COLLECTION DETAIL & LOOKBOOK MODAL */}
      {/* ========================================================================= */}
      {inspectingCollection && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#0A0A0A] border border-[#2B2B2B] rounded-2xl w-full max-w-6xl max-h-[95vh] flex flex-col overflow-hidden shadow-2xl font-mono text-left">
            {/* Header Banner */}
            <div className="relative aspect-[21/7] min-h-[180px] bg-black overflow-hidden shrink-0">
              <img
                src={inspectingCollection.heroBannerUrl || inspectingCollection.coverImageUrl}
                alt={inspectingCollection.title}
                className="w-full h-full object-cover brightness-70"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

              {/* Close Button */}
              <button
                onClick={() => setInspectingCollection(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/70 hover:bg-black text-neutral-300 hover:text-white border border-white/20 cursor-pointer z-20"
                title="Close Lookbook"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Title & Metadata Over Banner */}
              <div className="absolute bottom-4 left-4 right-4 z-10 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-amber-500 text-black text-[10px] font-bold uppercase rounded">
                    {inspectingCollection.season} · {inspectingCollection.seasonCode}
                  </span>
                  <span className="text-neutral-400 text-xs">
                    Curated by {inspectingCollection.artisticDirector}
                  </span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white uppercase tracking-wider">
                  {inspectingCollection.title}
                </h2>
                <p className="text-xs text-neutral-300 line-clamp-1">{inspectingCollection.subtitle}</p>
              </div>
            </div>

            {/* Sub-Navigation Tabs */}
            <div className="flex border-b border-[#222] bg-[#111111] text-xs shrink-0">
              <button
                onClick={() => setActiveGarmentTab('PRODUCTS')}
                className={`px-5 py-3 font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
                  activeGarmentTab === 'PRODUCTS'
                    ? 'border-amber-400 text-amber-400 bg-amber-500/5'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                Collection Pieces ({inspectingCollection.products.length})
              </button>

              <button
                onClick={() => setActiveGarmentTab('STORY')}
                className={`px-5 py-3 font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
                  activeGarmentTab === 'STORY'
                    ? 'border-amber-400 text-amber-400 bg-amber-500/5'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                The Story & Muse
              </button>

              <button
                onClick={() => setActiveGarmentTab('LOOKBOOK')}
                className={`px-5 py-3 font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
                  activeGarmentTab === 'LOOKBOOK'
                    ? 'border-amber-400 text-amber-400 bg-amber-500/5'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                Runway Gallery
              </button>
            </div>

            {/* Modal Content Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              {/* TAB 1: CURATED PRODUCTS */}
              {activeGarmentTab === 'PRODUCTS' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-white uppercase tracking-wider">
                        Tailored Pieces in this Collection
                      </h3>
                      <p className="text-xs text-neutral-400">
                        Available for made-to-measure commission or bespoke discovery at Savile Row.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {inspectingCollection.products.map((prod) => (
                      <div
                        key={prod.id}
                        className="bg-[#121212] border border-[#262626] rounded-xl overflow-hidden shadow-lg flex flex-col justify-between hover:border-amber-500/40 transition-colors"
                      >
                        <div>
                          <div className="aspect-[4/5] bg-black overflow-hidden relative group">
                            <img
                              src={prod.imageUrl}
                              alt={prod.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            {prod.isHeroPiece && (
                              <span className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-amber-500 text-black text-[9px] font-bold uppercase rounded">
                                Hero Silhouette
                              </span>
                            )}
                          </div>

                          <div className="p-4 space-y-2 text-xs">
                            <span className="text-[10px] text-neutral-500 uppercase font-bold block">
                              {prod.category}
                            </span>
                            <h4 className="font-serif text-sm font-bold text-white uppercase">
                              {prod.name}
                            </h4>
                            <p className="text-neutral-400 text-[11px] leading-relaxed">
                              Cloth: <strong className="text-neutral-200">{prod.primaryFabric}</strong>
                            </p>
                            <p className="text-neutral-400 text-[11px]">
                              Cut: {prod.silhouette}
                            </p>
                          </div>
                        </div>

                        <div className="p-4 bg-[#161616] border-t border-[#222] flex items-center justify-between">
                          <span className="font-mono text-amber-300 font-bold text-sm">
                            £{prod.price.toLocaleString('en-GB')}
                          </span>

                          <button
                            onClick={() => handleCommissionClick(prod)}
                            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5"
                          >
                            <Scissors className="w-3.5 h-3.5" />
                            Commission Piece
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: STORY & MUSE NARRATIVE */}
              {activeGarmentTab === 'STORY' && (
                <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
                  <div className="p-6 bg-[#121212] border border-[#2B2B2B] rounded-2xl space-y-4">
                    <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest block">
                      EDITORIAL ESSAY BY {inspectingCollection.artisticDirector}
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-white uppercase">
                      The Concept & Atmosphere
                    </h3>
                    <p className="text-neutral-200 text-sm font-sans leading-relaxed whitespace-pre-line">
                      {inspectingCollection.storyNarrative}
                    </p>
                  </div>

                  {/* Muse Card */}
                  <div className="p-6 bg-[#121212] border border-[#2B2B2B] rounded-2xl space-y-2">
                    <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest block">
                      MUSE & CLIMATE DIALOGUE
                    </span>
                    <p className="text-neutral-300 text-xs italic font-serif">
                      "{inspectingCollection.museInspiration}"
                    </p>
                  </div>

                  {/* Color Palette Matrix */}
                  <div className="p-6 bg-[#121212] border border-[#2B2B2B] rounded-2xl space-y-4">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Seasonal Color Story & Harmonized Linings
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {inspectingCollection.colorPalette.map((color, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-[#171717] rounded-xl border border-[#262626] space-y-2"
                        >
                          <div
                            className="h-12 rounded-lg border border-white/20 shadow-inner flex items-end p-1.5"
                            style={{ backgroundColor: color.hex }}
                          >
                            <span className="text-[9px] text-white/90 bg-black/60 px-1.5 py-0.2 rounded font-mono">
                              {color.hex}
                            </span>
                          </div>
                          <div>
                            <span className="font-bold text-white text-xs block">{color.name}</span>
                            {color.role && (
                              <span className="text-[10px] text-neutral-400 block">{color.role}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Textile Highlights */}
                  <div className="p-6 bg-[#121212] border border-[#2B2B2B] rounded-2xl space-y-3">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Certified Textile Mill Allocations
                    </h4>
                    <ul className="space-y-2 text-xs text-neutral-300">
                      {inspectingCollection.textileHighlights.map((tex, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>{tex}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* TAB 3: RUNWAY GALLERY */}
              {activeGarmentTab === 'LOOKBOOK' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {inspectingCollection.lookbookImages.map((img, i) => (
                      <div
                        key={i}
                        className="aspect-[4/5] bg-black rounded-2xl overflow-hidden border border-[#2B2B2B] relative group"
                      >
                        <img
                          src={img}
                          alt={`Lookbook ${i + 1}`}
                          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                        />
                        <div className="absolute bottom-3 left-3 bg-black/80 px-3 py-1 rounded text-[10px] text-white font-bold uppercase">
                          LOOK #{String(i + 1).padStart(2, '0')} · {inspectingCollection.seasonCode}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#111111] border-t border-[#222] flex items-center justify-between text-xs">
              <span className="text-neutral-400">
                Daniel’s Maison Haute-Couture Archive · {inspectingCollection.seasonCode}
              </span>

              <button
                onClick={() => setInspectingCollection(null)}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Close Lookbook
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
