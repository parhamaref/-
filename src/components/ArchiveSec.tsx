import React, { useState } from 'react';
import { Artifact, Currency } from '../types';
import { ARTIFACTS_DATABASE } from '../data/artifacts';
import { CURRENCIES } from '../data/translations';
import { Shovel, Layers, Eye, Star, Search, ShieldCheck } from 'lucide-react';

interface ArchiveSecProps {
  lang: 'en' | 'pt';
  currency: Currency;
  onSelectArtifact: (art: Artifact) => void;
  langDict: any;
  onToggleWishlist: (art: Artifact) => void;
  wishlistIds: string[];
}

export default function ArchiveSec({
  lang,
  currency,
  onSelectArtifact,
  langDict,
  onToggleWishlist,
  wishlistIds
}: ArchiveSecProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('all');
  const [selectedCollection, setSelectedCollection] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Collect all unique materials available in the database for dynamic filter list
  const allMaterials = Array.from(
    new Set(ARTIFACTS_DATABASE.flatMap(art => art.materials))
  );

  const collections = ['Genesis-01', 'Scavenger-02', 'Excavation-03', 'Womenswear-Atelier'];

  // Filter logic
  const filteredArtifacts = ARTIFACTS_DATABASE.filter(art => {
    const matchesCategory = selectedCategory === 'all' || art.category === selectedCategory;
    const matchesSubcategory = selectedSubcategory === 'all' || art.subcategory === selectedSubcategory;
    const matchesMaterial = selectedMaterial === 'all' || art.materials.includes(selectedMaterial);
    const matchesCollection = selectedCollection === 'all' || art.collection === selectedCollection;
    
    const searchableText = `${art.name} ${art.code} ${art.category} ${art.subcategory || ''} ${art.brand || ''} ${art.sku || ''} ${(art.colors || []).join(' ')} ${art.materials.join(' ')} ${art.details.join(' ')} ${art.description.en} ${art.originalPrice || ''} تاپ کراپ تاپ زنانه ریبدار گره ای بادی اورگانزا مشکی زارا دنیل مزون tops crop tops halter cami tank daniel maison`.toLowerCase();
    const matchesSearch = searchQuery.trim() === '' || searchableText.includes(searchQuery.toLowerCase().trim());

    return matchesCategory && matchesSubcategory && matchesMaterial && matchesCollection && matchesSearch;
  });

  const getPriceFormatted = (baseCRDT: number) => {
    const currDetails = CURRENCIES[currency] || { symbol: '£', rate: 1 };
    const converted = baseCRDT * currDetails.rate;
    return `${currDetails.symbol}${converted.toFixed(2)}`;
  };

  return (
    <section id="museum-archive-section" className="py-12 px-4 sm:px-6 lg:px-8 xl:px-12 max-w-7xl 2xl:max-w-[1600px] mx-auto">
      
      {/* Editorial Title */}
      <div className="border-b border-[#2B2B2B] pb-8 mb-12 text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start gap-2 text-white font-mono text-[10px] tracking-widest uppercase mb-3">
          <Shovel className="w-4 h-4" />
          <span>CYBERARCHAEOLOGICAL EXCAVATION CATALOG // GENESIS LABS</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl text-[#F3F3F3] tracking-widest uppercase font-bold">
          {langDict['nav.archive'][lang]}
        </h2>
        <p className="font-mono text-[11px] text-[#8C8C8C] tracking-wide mt-3 max-w-3xl leading-relaxed text-justify">
          {lang === 'en' 
            ? 'Each excavated item is hand-restored, decrypted, structural-checked, and carbon-dated. We recreate these blueprints with original apocalyptic density specifications.' 
            : 'Cada item escavado é restaurado à mão, descriptografado, avaliado estruturalmente e datado por carbono. Recriamos essas plantas com as especificações originais.'}
        </p>
      </div>

      {/* Filter and Search Layout: Sidebar Left / Grid Right */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Filters Panel */}
        <div className="space-y-6 lg:border-r lg:border-[#2B2B2B] lg:pr-8">
          
          <div className="flex items-center gap-2 text-[#F3F3F3] font-mono text-[11px] tracking-widest uppercase border-b border-[#2B2B2B] pb-3 font-semibold">
            <Layers className="w-4 h-4 text-white" />
            <span>{langDict['filter.title'][lang]}</span>
          </div>

          {/* Core Search */}
          <div className="relative">
            <input
              id="archive-text-search"
              type="text"
              placeholder={lang === 'en' ? 'CRYPTONYM / MATERIAL SEARCH...' : 'BUSCAR CRIPTÔNIMO / MATERIAL...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#141414] border border-[#2B2B2B] px-3.5 py-2.5 rounded-sm font-mono text-xs text-[#F3F3F3] focus:outline-none focus:border-white placeholder-neutral-600 tracking-wider pl-10"
            />
            <Search className="w-4 h-4 text-neutral-600 absolute left-3.5 top-3.5" />
          </div>

          {/* Category Selector */}
          <div className="space-y-2">
            <span className="block font-mono text-[9px] text-[#8C8C8C] uppercase tracking-widest border-l border-white pl-2">
              {langDict['filter.category'][lang]}
            </span>
            <div className="flex flex-wrap lg:flex-col gap-1.5 font-mono text-[10px]">
              <button
                id="filter-cat-all"
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedSubcategory('all');
                }}
                className={`text-left px-3 py-1.5 rounded-sm transition-colors duration-300 ${
                  selectedCategory === 'all' 
                    ? 'bg-white/10 text-white border border-white/30' 
                    : 'text-[#8C8C8C] hover:text-[#F3F3F3] hover:bg-[#0E0E0E]'
                }`}
              >
                {langDict['filter.all'][lang]}
              </button>
              {['womenswear', 'outerwear', 'basewear', 'footwear', 'accessories'].map((cat) => (
                <button
                  key={cat}
                  id={`filter-cat-${cat}`}
                  onClick={() => {
                    setSelectedCategory(cat);
                    if (cat !== 'womenswear') {
                      setSelectedSubcategory('all');
                    }
                  }}
                  className={`text-left px-3 py-1.5 rounded-sm transition-colors duration-300 capitalize flex items-center justify-between ${
                    selectedCategory === cat 
                      ? 'bg-white/10 text-white border border-white/30 font-semibold' 
                      : 'text-[#8C8C8C] hover:text-[#F3F3F3] hover:bg-[#0E0E0E]'
                  }`}
                >
                  <span>{langDict[`filter.${cat}`]?.[lang] || cat}</span>
                  {cat === 'womenswear' && (
                    <span className="text-[8px] bg-rose-500/20 text-rose-300 px-1 py-0.2 rounded-xs border border-rose-500/30">
                      NEW
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Subcategory Pills for Womenswear */}
            {(selectedCategory === 'womenswear' || selectedCategory === 'all') && (
              <div className="pt-2 border-t border-[#2B2B2B]/40 space-y-1.5">
                <span className="block font-mono text-[8px] text-neutral-400 uppercase tracking-widest font-semibold">
                  WOMENSWEAR SUBCATEGORIES:
                </span>
                <div className="flex flex-wrap gap-1 font-mono text-[9px]">
                  <button
                    onClick={() => setSelectedSubcategory('all')}
                    className={`px-2 py-1 rounded-xs border transition-colors ${
                      selectedSubcategory === 'all'
                        ? 'bg-white text-black font-bold border-white'
                        : 'border-[#2B2B2B] text-neutral-400 hover:text-white'
                    }`}
                  >
                    ALL ({ARTIFACTS_DATABASE.filter(a => a.category === 'womenswear').length})
                  </button>
                  <button
                    id="filter-subcat-dresses"
                    onClick={() => {
                      setSelectedSubcategory('dresses');
                      if (selectedCategory !== 'womenswear') setSelectedCategory('womenswear');
                    }}
                    className={`px-2.5 py-1 rounded-xs border transition-colors flex items-center gap-1 ${
                      selectedSubcategory === 'dresses'
                        ? 'bg-white text-black font-bold border-white'
                        : 'border-[#2B2B2B] text-neutral-300 hover:text-white hover:border-neutral-500'
                    }`}
                  >
                    <span>DRESSES</span>
                    <span className="text-[8px] opacity-75 bg-neutral-800 px-1 rounded-xs">
                      {ARTIFACTS_DATABASE.filter(a => a.subcategory === 'dresses').length}
                    </span>
                  </button>
                  <button
                    id="filter-subcat-bodysuits"
                    onClick={() => {
                      setSelectedSubcategory('bodysuits');
                      if (selectedCategory !== 'womenswear') setSelectedCategory('womenswear');
                    }}
                    className={`px-2.5 py-1 rounded-xs border transition-colors flex items-center gap-1 ${
                      selectedSubcategory === 'bodysuits'
                        ? 'bg-white text-black font-bold border-white'
                        : 'border-[#2B2B2B] text-neutral-300 hover:text-white hover:border-neutral-500'
                    }`}
                  >
                    <span>BODYSUITS</span>
                    <span className="text-[8px] opacity-75 bg-neutral-800 px-1 rounded-xs">
                      {ARTIFACTS_DATABASE.filter(a => a.subcategory === 'bodysuits').length}
                    </span>
                  </button>
                  <button
                    id="filter-subcat-tops"
                    onClick={() => {
                      setSelectedSubcategory('tops-crop-tops');
                      if (selectedCategory !== 'womenswear') setSelectedCategory('womenswear');
                    }}
                    className={`px-2.5 py-1 rounded-xs border transition-colors flex items-center gap-1 ${
                      selectedSubcategory === 'tops-crop-tops'
                        ? 'bg-white text-black font-bold border-white'
                        : 'border-[#2B2B2B] text-neutral-300 hover:text-white hover:border-neutral-500'
                    }`}
                  >
                    <span>TOPS & CROP TOPS</span>
                    <span className="text-[8px] opacity-75 bg-neutral-800 px-1 rounded-xs">
                      {ARTIFACTS_DATABASE.filter(a => a.subcategory === 'tops-crop-tops').length}
                    </span>
                  </button>
                  <button
                    id="filter-subcat-jumpsuits"
                    onClick={() => {
                      setSelectedSubcategory('jumpsuits');
                      if (selectedCategory !== 'womenswear') setSelectedCategory('womenswear');
                    }}
                    className={`px-2.5 py-1 rounded-xs border transition-colors flex items-center gap-1 ${
                      selectedSubcategory === 'jumpsuits'
                        ? 'bg-white text-black font-bold border-white'
                        : 'border-[#2B2B2B] text-neutral-300 hover:text-white hover:border-neutral-500'
                    }`}
                  >
                    <span>JUMPSUITS</span>
                    <span className="text-[8px] opacity-75 bg-neutral-800 px-1 rounded-xs">
                      {ARTIFACTS_DATABASE.filter(a => a.subcategory === 'jumpsuits').length}
                    </span>
                  </button>
                  <button
                    id="filter-subcat-skirts"
                    onClick={() => {
                      setSelectedSubcategory('skirts');
                      if (selectedCategory !== 'womenswear') setSelectedCategory('womenswear');
                    }}
                    className={`px-2.5 py-1 rounded-xs border transition-colors flex items-center gap-1 ${
                      selectedSubcategory === 'skirts'
                        ? 'bg-white text-black font-bold border-white'
                        : 'border-[#2B2B2B] text-neutral-300 hover:text-white hover:border-neutral-500'
                    }`}
                  >
                    <span>SKIRTS</span>
                    <span className="text-[8px] opacity-75 bg-neutral-800 px-1 rounded-xs">
                      {ARTIFACTS_DATABASE.filter(a => a.subcategory === 'skirts').length}
                    </span>
                  </button>
                  <button
                    id="filter-subcat-trousers-jeans"
                    onClick={() => {
                      setSelectedSubcategory('trousers-jeans');
                      if (selectedCategory !== 'womenswear') setSelectedCategory('womenswear');
                    }}
                    className={`px-2.5 py-1 rounded-xs border transition-colors flex items-center gap-1 ${
                      selectedSubcategory === 'trousers-jeans'
                        ? 'bg-white text-black font-bold border-white'
                        : 'border-[#2B2B2B] text-neutral-300 hover:text-white hover:border-neutral-500'
                    }`}
                  >
                    <span>TROUSERS & JEANS</span>
                    <span className="text-[8px] opacity-75 bg-neutral-800 px-1 rounded-xs">
                      {ARTIFACTS_DATABASE.filter(a => a.subcategory === 'trousers-jeans').length}
                    </span>
                  </button>
                  <button
                    id="filter-subcat-shorts-sets"
                    onClick={() => {
                      setSelectedSubcategory('shorts-sets');
                      if (selectedCategory !== 'womenswear') setSelectedCategory('womenswear');
                    }}
                    className={`px-2.5 py-1 rounded-xs border transition-colors flex items-center gap-1 ${
                      selectedSubcategory === 'shorts-sets'
                        ? 'bg-white text-black font-bold border-white'
                        : 'border-[#2B2B2B] text-neutral-300 hover:text-white hover:border-neutral-500'
                    }`}
                  >
                    <span>SHORTS & SETS</span>
                    <span className="text-[8px] opacity-75 bg-neutral-800 px-1 rounded-xs">
                      {ARTIFACTS_DATABASE.filter(a => a.subcategory === 'shorts-sets').length}
                    </span>
                  </button>
                  <button
                    id="filter-subcat-hoodies-sweatshirts"
                    onClick={() => {
                      setSelectedSubcategory('hoodies-sweatshirts');
                      if (selectedCategory !== 'womenswear') setSelectedCategory('womenswear');
                    }}
                    className={`px-2.5 py-1 rounded-xs border transition-colors flex items-center gap-1 ${
                      selectedSubcategory === 'hoodies-sweatshirts'
                        ? 'bg-white text-black font-bold border-white'
                        : 'border-[#2B2B2B] text-neutral-300 hover:text-white hover:border-neutral-500'
                    }`}
                  >
                    <span>HOODIES & SWEATSHIRTS</span>
                    <span className="text-[8px] opacity-75 bg-neutral-800 px-1 rounded-xs">
                      {ARTIFACTS_DATABASE.filter(a => a.subcategory === 'hoodies-sweatshirts').length}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Collection Cohort Selector */}
          <div className="space-y-2 pt-2 border-t border-[#2B2B2B]/50">
            <span className="block font-mono text-[9px] text-[#8C8C8C] uppercase tracking-widest border-l border-white pl-2">
              {langDict['filter.collection'][lang]}
            </span>
            <div className="flex flex-wrap lg:flex-col gap-1.5 font-mono text-[10px]">
              <button
                id="filter-col-all"
                onClick={() => setSelectedCollection('all')}
                className={`text-left px-3 py-1.5 rounded-sm transition-colors duration-300 ${
                  selectedCollection === 'all' 
                    ? 'bg-white/10 text-white border border-white/30' 
                    : 'text-[#8C8C8C] hover:text-[#F3F3F3] hover:bg-[#0E0E0E]'
                }`}
              >
                {langDict['filter.all'][lang]}
              </button>
              {collections.map((colName) => (
                <button
                  key={colName}
                  id={`filter-col-${colName}`}
                  onClick={() => setSelectedCollection(colName)}
                  className={`text-left px-3 py-1.5 rounded-sm transition-colors duration-300 ${
                    selectedCollection === colName 
                      ? 'bg-white/10 text-white border border-white/30' 
                      : 'text-[#8C8C8C] hover:text-[#F3F3F3] hover:bg-[#0E0E0E]'
                  }`}
                >
                  {colName}
                </button>
              ))}
            </div>
          </div>

          {/* Material Filters */}
          <div className="space-y-2 pt-2 border-t border-[#2B2B2B]/50">
            <span className="block font-mono text-[9px] text-[#8C8C8C] uppercase tracking-widest border-l border-white pl-2">
              {langDict['filter.material'][lang]}
            </span>
            <div className="flex flex-wrap lg:flex-col gap-1.5 font-mono text-[10px]">
              <button
                id="filter-mat-all"
                onClick={() => setSelectedMaterial('all')}
                className={`text-left px-3 py-1.5 rounded-sm transition-colors duration-300 ${
                  selectedMaterial === 'all' 
                    ? 'bg-white/10 text-white border border-white/30' 
                    : 'text-[#8C8C8C] hover:text-[#F3F3F3] hover:bg-[#0E0E0E]'
                }`}
              >
                {langDict['filter.all'][lang]}
              </button>
              {allMaterials.map((mat) => (
                <button
                  key={mat}
                  id={`filter-mat-${mat.toLowerCase().replace(/ /g, '-')}`}
                  onClick={() => setSelectedMaterial(mat)}
                  className={`text-left px-3 py-1.5 rounded-sm transition-colors duration-300 truncate max-w-full ${
                    selectedMaterial === mat 
                      ? 'bg-white/10 text-white border border-white/30' 
                      : 'text-[#8C8C8C] hover:text-[#F3F3F3] hover:bg-[#0E0E0E]'
                  }`}
                  title={mat}
                >
                  {mat}
                </button>
              ))}
            </div>
          </div>

          {/* Diagnostic Stats */}
          <div className="bg-[#0E0E0E] border border-[#2B2B2B] border-dashed p-4 rounded-sm font-mono text-[9px] text-neutral-500 space-y-1">
            <div className="flex justify-between">
              <span>UNITS CATALOGED:</span>
              <span className="text-[#F3F3F3]">{ARTIFACTS_DATABASE.length}</span>
            </div>
            <div className="flex justify-between">
              <span>UNITS MATCHED:</span>
              <span className="text-white">{filteredArtifacts.length}</span>
            </div>
            <div className="flex justify-between">
              <span>RADIATION COMPLIANCE:</span>
              <span className="text-emerald-500">100% SECURE</span>
            </div>
          </div>

        </div>

        {/* Right Cargo Grid */}
        <div className="lg:col-span-3">
          {filteredArtifacts.length === 0 ? (
            <div className="border border-[#2B2B2B] border-dashed p-16 text-center rounded-sm font-mono text-neutral-500">
              <p className="text-xs uppercase tracking-widest text-[#8C8C8C] mb-2">// SECURITY DISCREPANCY //</p>
              <p className="text-[10px]">No excavated blueprint matches the specified multi-parameter query.</p>
              <button 
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedMaterial('all');
                  setSelectedCollection('all');
                  setSearchQuery('');
                }}
                className="mt-6 px-4 py-2 border border-white text-white text-[9px] tracking-widest uppercase hover:bg-white hover:text-[#050505] transition-all duration-300"
              >
                FUSE MATRIX RESET
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredArtifacts.map((art) => {
                const isSaved = wishlistIds.includes(art.id);
                return (
                  <div
                    key={art.id}
                    id={`artifact-card-${art.id}`}
                    className="group bg-[#0E0E0E] border border-[#2B2B2B] rounded-sm hover:border-white/50 transition-all duration-500 flex flex-col justify-between overflow-hidden relative shadow-md hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                  >
                    
                    {/* Upper Category, Code and Star Banner */}
                    <div className="p-4 flex items-center justify-between border-b border-[#2B2B2B]/50 bg-[#050505]/40">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[8px] text-neutral-400 uppercase tracking-widest font-semibold">
                            {art.brand || 'DANIEL MAISON'}
                          </span>
                          {art.subcategory && (
                            <span className="font-mono text-[7px] text-rose-300 bg-rose-950/40 border border-rose-800/40 px-1 py-0.2 rounded-xs uppercase">
                              {art.subcategory}
                            </span>
                          )}
                        </div>
                        <span className="font-mono text-[9.5px] text-neutral-400 tracking-wider font-semibold mt-0.5">
                          {art.code}
                        </span>
                      </div>
                      
                      {/* Register wishlist flag */}
                      <button
                        id={`btn-wishlist-toggle-${art.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleWishlist(art);
                        }}
                        className={`p-1.5 rounded-full border transition-colors duration-300 ${
                          isSaved 
                            ? 'bg-white/10 border-white text-white' 
                            : 'border-[#2B2B2B] text-neutral-600 hover:text-white hover:border-neutral-500'
                        }`}
                        title="Intel Target Saved"
                      >
                        <Star className="w-3.5 h-3.5" fill={isSaved ? '#FFFFFF' : 'none'} />
                      </button>
                    </div>

                    {/* Highly aesthetic product window */}
                    <div 
                      onClick={() => onSelectArtifact(art)}
                      className="aspect-square w-full relative bg-[#050505] flex items-center justify-center overflow-hidden cursor-pointer"
                    >
                      <img
                        src={art.images.front}
                        alt={art.name}
                        referrerPolicy="no-referrer"
                        className="w-[85%] h-[85%] object-contain group-hover:scale-105 transition-transform duration-700 grayscale contrast-[1.1] brightness-[0.9] group-hover:grayscale-0 group-hover:brightness-100"
                      />
                      
                      {/* Subtle ash layout overlay */}
                      <div className="absolute inset-0 bg-radial-gradient from-transparent to-[#050505]/75 pointer-events-none" />

                      {/* Decryption status corner logs */}
                      <div className="absolute bottom-2 left-2 pr-2 bg-[#050505]/80 border border-[#2B2B2B] rounded-sm py-1 px-1.5 font-mono text-[7px] text-neutral-400 opacity-60 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                        <ShieldCheck className="w-2.5 h-2.5 text-white" />
                        <span>{art.integrityScore}</span>
                      </div>
                    </div>

                    {/* Metadata summary */}
                    <div className="p-4 flex-grow border-t border-[#2B2B2B]/50 flex flex-col justify-between">
                      <div>
                        {/* Name in Luxury Serif */}
                        <h3 
                          onClick={() => onSelectArtifact(art)}
                          className="font-serif text-[16px] sm:text-[18px] text-[#F3F3F3] tracking-wider uppercase group-hover:text-white transition-colors duration-300 cursor-pointer"
                        >
                          {art.name}
                        </h3>
                        {/* Cutoff description */}
                        <p className="font-sans text-[11px] text-[#8C8C8C] mt-2 line-clamp-2 leading-relaxed">
                          {art.description[lang]}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-[#2B2B2B]/30 flex items-center justify-between">
                        {/* Custom Apocalypse price format */}
                        <div className="flex flex-col">
                          <span className="font-mono text-[7px] text-neutral-500 uppercase tracking-widest">ALLOCATION WEIGHT</span>
                          <span className="font-mono text-[14px] text-[#F3F3F3] font-semibold">
                            {getPriceFormatted(art.priceCRDT)}
                          </span>
                        </div>

                        {/* View specifications */}
                        <button
                          id={`btn-view-${art.id}`}
                          onClick={() => onSelectArtifact(art)}
                          className="px-3.5 py-1.5 border border-[#2B2B2B] text-[#8C8C8C] group-hover:border-white group-hover:text-white rounded-sm font-mono text-[9px] tracking-widest uppercase transition-all duration-300 hover:bg-white/10"
                        >
                          {langDict['btn.view_artifact'][lang]}
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

    </section>
  );
}
