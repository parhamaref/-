import React, { useState } from 'react';
import { Artifact, Currency } from '../types';
import { ARTIFACTS_DATABASE } from '../data/artifacts';
import { CURRENCIES } from '../data/translations';
import { ArrowLeft, Star, ShoppingBag, ShieldCheck, Cpu, HardDrive, Crop, Check, Image as ImageIcon } from 'lucide-react';

interface ArtifactDetailProps {
  artifact: Artifact;
  lang: 'en' | 'pt';
  currency: Currency;
  onBack: () => void;
  onAddToCart: (art: Artifact, size: string, color?: string) => void;
  onToggleWishlist: (art: Artifact) => void;
  wishlistIds: string[];
  langDict: any;
  onSelectRelated: (art: Artifact) => void;
}

export default function ArtifactDetail({
  artifact,
  lang,
  currency,
  onBack,
  onAddToCart,
  onToggleWishlist,
  wishlistIds,
  langDict,
  onSelectRelated
}: ArtifactDetailProps) {
  const [selectedSize, setSelectedSize] = useState<string>(artifact.sizes[0] || 'Free Size');
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    artifact.colors && artifact.colors.length > 0 ? artifact.colors[0] : undefined
  );
  const [biometricHeight, setBiometricHeight] = useState<number>(178); // cm
  const [biometricChest, setBiometricChest] = useState<number>(96); // cm
  const [biometricArm, setBiometricArm] = useState<number>(76); // cm
  const [activeImageAngle, setActiveImageAngle] = useState<'front' | 'side' | 'back' | 'campaign'>('front');
  const [selectedGalleryImg, setSelectedGalleryImg] = useState<string | null>(null);
  const [calibratedSuccess, setCalibratedSuccess] = useState(false);

  const isSaved = wishlistIds.includes(artifact.id);

  // Compute a mock sizing recommendation based on biometric parameters
  const getBiometricCalibration = () => {
    const sum = biometricHeight + biometricChest + biometricArm;
    const matchPercent = 85 + (sum % 15);
    let sizeRec = 'I (S-M)';
    
    if (biometricHeight > 185 || biometricChest > 105) {
      sizeRec = 'III (L-XL)';
    } else if (biometricHeight > 175 || biometricChest > 95) {
      sizeRec = 'II (M-L)';
    }

    return { matchPercent, sizeRec };
  };

  const { matchPercent, sizeRec } = getBiometricCalibration();

  const getPriceFormatted = (baseCRDT: number) => {
    const currDetails = CURRENCIES[currency] || { symbol: '£', rate: 1 };
    const converted = baseCRDT * currDetails.rate;
    return `${currDetails.symbol}${converted.toFixed(2)}`;
  };

  // Find related items (exclude the current item)
  const relatedItems = ARTIFACTS_DATABASE.filter(art => art.id !== artifact.id).slice(0, 3);

  const handleTriggerIntake = () => {
    onAddToCart(artifact, selectedSize, selectedColor);
    setCalibratedSuccess(true);
    setTimeout(() => setCalibratedSuccess(false), 3000);
  };

  const activeDisplayImage = selectedGalleryImg || artifact.images[activeImageAngle] || artifact.images.front;

  return (
    <section id="artifact-deep-dive-section" className="py-12 px-4 sm:px-6 lg:px-8 xl:px-12 max-w-7xl 2xl:max-w-[1600px] mx-auto">
      
      {/* Return button & Category Breadcrumb */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-[#2B2B2B]/60 pb-4">
        <button
          id="btn-back-to-archive"
          onClick={onBack}
          className="flex items-center gap-2 font-mono text-[10px] tracking-widest text-[#8C8C8C] hover:text-white transition-colors duration-300 uppercase cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{langDict['btn.back'][lang]}</span>
        </button>

        <div className="font-mono text-[10px] text-neutral-400 flex items-center gap-2">
          <span className="text-white font-bold">{artifact.brand || 'DANIEL MAISON'}</span>
          <span>/</span>
          <span className="capitalize">{artifact.category}</span>
          {artifact.subcategory && (
            <>
              <span>/</span>
              <span className="text-white uppercase font-bold">
                {artifact.subcategory === 'tops-crop-tops' ? 'TOPS & CROP TOPS' : artifact.subcategory === 'trousers-jeans' ? 'TROUSERS & JEANS' : artifact.subcategory}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Main Specs Layout split into lookbook view (left) and technical info (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Left Column: Multi-Angle & Gallery Interactive Lookbook Frame (5 columns) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Main Visual Box */}
          <div className="border border-[#2B2B2B] bg-[#0E0E0E] rounded-sm aspect-[4/5] w-full flex items-center justify-center p-6 relative overflow-hidden group">
            
            <img
              src={activeDisplayImage}
              alt={`${artifact.name} display view`}
              referrerPolicy="no-referrer"
              className={`max-w-[90%] max-h-[90%] object-contain transition-all duration-500 brightness-[0.95] contrast-[1.05] ${
                activeImageAngle === 'side' && !selectedGalleryImg ? 'scale-x-[-1]' : ''
              } ${
                activeImageAngle === 'back' && !selectedGalleryImg ? 'brightness-75' : ''
              } ${
                activeImageAngle === 'campaign' && !selectedGalleryImg ? 'scale-105 object-cover w-full h-full' : ''
              }`}
            />

            {/* Aesthetic coordinate marks */}
            <div className="absolute top-4 left-4 font-mono text-[7.5px] text-neutral-400 select-none bg-black/60 px-1.5 py-0.5 rounded-xs border border-[#2B2B2B]">
              GRID: {artifact.code} // {selectedGalleryImg ? 'GALLERY_DETAIL' : `${activeImageAngle.toUpperCase()}_VIEW`}
            </div>
            <div className="absolute top-4 right-4 font-mono text-[7px] text-neutral-400 flex items-center gap-1 bg-black/60 px-1.5 py-0.5 rounded-xs border border-[#2B2B2B]">
              <Crop className="w-2.5 h-2.5" />
              <span>SCALE: 1.0</span>
            </div>

            {/* Warning frame corners */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/20" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20" />
          </div>

          {/* Angle Switching Selectors */}
          <div className="grid grid-cols-4 gap-2 font-mono text-[9px]">
            {(['front', 'side', 'back', 'campaign'] as const).map((angle) => (
              <button
                key={angle}
                id={`angle-trigger-${angle}`}
                onClick={() => {
                  setSelectedGalleryImg(null);
                  setActiveImageAngle(angle);
                }}
                className={`py-2 text-center rounded-sm border uppercase transition-colors duration-300 ${
                  activeImageAngle === angle && !selectedGalleryImg
                    ? 'bg-white/10 border-white text-white font-bold' 
                    : 'border-[#2B2B2B] text-[#8C8C8C] hover:text-[#F3F3F3]'
                }`}
              >
                {angle === 'campaign' ? 'CAMPAIGN' : `${angle} Spec`}
              </button>
            ))}
          </div>

          {/* Gallery Thumbnails List (if gallery images present) */}
          {artifact.images.gallery && artifact.images.gallery.length > 0 && (
            <div className="bg-[#0E0E0E] border border-[#2B2B2B] p-3 rounded-sm space-y-2">
              <div className="flex items-center gap-1.5 text-neutral-400 font-mono text-[9px] uppercase tracking-wider">
                <ImageIcon className="w-3 h-3 text-white" />
                <span>HIGH-RESOLUTION ATELIER GALLERY ({artifact.images.gallery.length})</span>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {artifact.images.gallery.map((imgUrl, gIdx) => (
                  <button
                    key={gIdx}
                    onClick={() => setSelectedGalleryImg(imgUrl)}
                    className={`w-14 h-16 shrink-0 bg-black rounded-xs border overflow-hidden p-1 transition-all ${
                      selectedGalleryImg === imgUrl 
                        ? 'border-white shadow-[0_0_8px_rgba(255,255,255,0.3)]' 
                        : 'border-[#2B2B2B] hover:border-neutral-500 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img 
                      src={imgUrl} 
                      alt={`${artifact.name} thumbnail ${gIdx + 1}`} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Technical Diagnostics */}
          <div className="bg-[#0E0E0E] border border-[#2B2B2B] p-5 rounded-sm font-mono text-[10px] space-y-3">
            <div className="flex items-center gap-2 text-white uppercase tracking-widest font-semibold text-[10px] border-b border-[#2B2B2B] pb-2">
              <Cpu className="w-4 h-4" />
              <span>STRUCTURAL RECOVERY CORE DATA</span>
            </div>
            
            <div className="space-y-1.5 text-neutral-400">
              <div className="flex justify-between">
                <span>BRAND LABEL:</span>
                <span className="text-[#F3F3F3] font-bold">{artifact.brand || 'DANIEL MAISON'}</span>
              </div>
              <div className="flex justify-between">
                <span>STOCK STATUS:</span>
                <span className="text-emerald-400 font-bold">{artifact.stockStatus || 'IN STOCK'}</span>
              </div>
              <div className="flex justify-between">
                <span>RECONSTRUCTION INTEGRITY:</span>
                <span className="text-[#F3F3F3]">{artifact.integrityScore}</span>
              </div>
              <div className="flex justify-between">
                <span>ATMOSPHERIC HAZARD PROTECTION:</span>
                <span className="text-[#F3F3F3]">{artifact.protectiveRating}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Detailed Garment Specs and Fitting Engines (7 columns) */}
        <div className="lg:col-span-7 space-y-8 text-left">
          
          {/* Main Titles */}
          <div className="border-b border-[#2B2B2B] pb-6 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[9px] bg-white text-black font-bold uppercase px-2 py-0.5 rounded-xs tracking-wider">
                  {artifact.brand || 'DANIEL MAISON'}
                </span>
                <span className="font-mono text-[11px] text-neutral-400 tracking-wider font-semibold uppercase">
                  {artifact.code}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {artifact.sku && (
                  <span className="font-mono text-[9px] text-neutral-400 uppercase">
                    SKU: {artifact.sku}
                  </span>
                )}
                <span className="font-mono text-[9px] text-emerald-400 flex items-center gap-1 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {artifact.stockStatus || 'IN STOCK'}
                </span>
              </div>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl text-[#F3F3F3] tracking-widest uppercase font-bold leading-tight">
              {artifact.name}
            </h1>

            {/* Pricing Section with Converted GBP and Original Price */}
            <div className="pt-2 flex flex-col gap-1.5">
              <div className="flex items-baseline gap-4">
                <span className="font-mono text-[28px] text-[#F3F3F3] font-bold">
                  {getPriceFormatted(artifact.priceCRDT)}
                </span>
                <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest">
                  British Pound (£) Display Price
                </span>
              </div>

              {artifact.originalPrice && (
                <div className="font-mono text-[10px] text-neutral-400 bg-[#0E0E0E] border border-[#2B2B2B] p-2.5 rounded-sm flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-neutral-500 uppercase">Original Price: </span>
                    <span className="text-neutral-300 font-semibold">{artifact.originalPrice}</span>
                  </div>
                  <span className="text-emerald-400 font-semibold">
                    ✓ Converted into GBP (£{artifact.priceCRDT.toFixed(2)})
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Lore narrative */}
          <div className="space-y-2">
            <h3 className="font-mono text-[10px] text-white tracking-widest uppercase border-l-2 border-white pl-3 font-semibold">
              EXCAVATED BLUEPRINT LORE
            </h3>
            <p className="font-serif text-[15px] italic text-neutral-300 leading-relaxed pl-3 border-l border-[#2B2B2B] text-justify">
              "{artifact.lore[lang]}"
            </p>
          </div>

          {/* Short scientific description */}
          <div className="space-y-2">
            <h3 className="font-mono text-[10px] text-[#8C8C8C] tracking-widest uppercase">
              TECHNICAL PRODUCT SPECIFICATION & FIT
            </h3>
            <p className="font-sans text-[13px] text-neutral-300 leading-relaxed text-justify">
              {artifact.description[lang]}
            </p>
          </div>

          {/* Textile Composition & Spec Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border border-[#2B2B2B] p-4 bg-[#050505] rounded-sm font-mono text-[10px]">
              <span className="block text-neutral-500 uppercase tracking-widest pb-1 border-b border-[#2B2B2B] mb-2 font-semibold">
                COMPOSITE MATERIALS
              </span>
              <ul className="space-y-1 text-neutral-300">
                {artifact.materials.map((mat, i) => (
                  <li key={i}>• {mat}</li>
                ))}
              </ul>
            </div>

            <div className="border border-[#2B2B2B] p-4 bg-[#050505] rounded-sm font-mono text-[10px]">
              <span className="block text-neutral-500 uppercase tracking-widest pb-1 border-b border-[#2B2B2B] mb-2 font-semibold">
                ARCHITECTURAL DETAILS
              </span>
              <ul className="space-y-1 text-neutral-300">
                {artifact.details.map((det, i) => (
                  <li key={i}>• {det}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Care Instructions if available */}
          {artifact.careInstructions && artifact.careInstructions.length > 0 && (
            <div className="border border-[#2B2B2B] p-4 bg-[#050505] rounded-sm font-mono text-[10px]">
              <span className="block text-neutral-500 uppercase tracking-widest pb-1 border-b border-[#2B2B2B] mb-2 font-semibold">
                CARE & PRESERVATION INSTRUCTIONS
              </span>
              <ul className="space-y-1 text-neutral-300">
                {artifact.careInstructions.map((inst, i) => (
                  <li key={i}>• {inst}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Color Variants Selection */}
          {artifact.colors && artifact.colors.length > 0 && (
            <div className="space-y-3 border-t border-[#2B2B2B]/50 pt-5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-[#8C8C8C] uppercase tracking-widest font-semibold">
                  SELECT COLOUR PROFILE:
                </span>
                <span className="font-mono text-[9px] text-white uppercase font-bold bg-[#141414] border border-[#2B2B2B] px-2 py-0.5 rounded-xs">
                  {selectedColor || 'DEFAULT'}
                </span>
              </div>
              <div className="flex flex-wrap gap-2.5 font-mono text-xs">
                {artifact.colors.map((clr) => (
                  <button
                    key={clr}
                    id={`btn-color-select-${clr.replace(/ /g, '-')}`}
                    onClick={() => setSelectedColor(clr)}
                    className={`px-4 py-2 rounded-sm border uppercase transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                      selectedColor === clr 
                        ? 'bg-white border-white text-[#050505] font-bold shadow-md' 
                        : 'border-[#2B2B2B] bg-[#0E0E0E] text-[#8C8C8C] hover:text-[#F3F3F3]'
                    }`}
                  >
                    <span 
                      className="w-2.5 h-2.5 rounded-full border border-black/40" 
                      style={{ 
                        backgroundColor: clr.toLowerCase().includes('black') || clr.toLowerCase().includes('noir') ? '#121212' 
                          : clr.toLowerCase().includes('white') ? '#FFFFFF' 
                          : clr.toLowerCase().includes('blue') ? '#2563eb' 
                          : '#6b7280' 
                      }} 
                    />
                    <span>{clr}</span>
                    {selectedColor === clr && <Check className="w-3 h-3 text-black" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size configuration selection */}
          <div className="space-y-3 border-t border-[#2B2B2B]/50 pt-5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-[#8C8C8C] uppercase tracking-widest font-semibold">
                SELECT SIZING PROFILE:
              </span>
              <span className="font-mono text-[9px] text-white font-bold bg-[#141414] border border-[#2B2B2B] px-2 py-0.5 rounded-xs">
                {selectedSize}
              </span>
            </div>
            <div className="flex flex-wrap gap-2.5 font-mono text-xs">
              {artifact.sizes.map((sz) => (
                <button
                  key={sz}
                  id={`btn-size-select-${sz.replace(/ /g, '-')}`}
                  onClick={() => setSelectedSize(sz)}
                  className={`px-4 py-2.5 rounded-sm border uppercase transition-all duration-300 cursor-pointer ${
                    selectedSize === sz 
                      ? 'bg-white border-white text-[#050505] font-bold' 
                      : 'border-[#2B2B2B] bg-[#0E0E0E] text-[#8C8C8C] hover:text-[#F3F3F3]'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* BIOMETRIC FITTING CLIENT-SIDE ENGINE */}
          <div className="border border-neutral-700/50 bg-[#0E0E0E] p-6 rounded-sm space-y-4">
            
            <div className="flex items-center gap-2 text-[#F3F3F3] font-mono text-[11px] tracking-widest uppercase pb-2 border-b border-[#2B2B2B]">
              <HardDrive className="w-4 h-4 text-white animate-pulse" />
              <span>NEURAL BIOMETRIC COMPATIBILITY SCANNER</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[10px] font-mono text-neutral-400">
              
              {/* Slider 1: Nomadic Height */}
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span>NOMAD HEIGHT</span>
                  <span className="text-[#F3F3F3]">{biometricHeight} cm</span>
                </div>
                <input
                  type="range"
                  min="150"
                  max="210"
                  value={biometricHeight}
                  onChange={(e) => setBiometricHeight(Number(e.target.value))}
                  className="w-full h-1 bg-[#2B2B2B] accent-white appearance-none cursor-pointer outline-none rounded-lg"
                />
              </div>

              {/* Slider 2: Under-chest rib cage */}
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span>UNDER-CHEST DEPTH</span>
                  <span className="text-[#F3F3F3]">{biometricChest} cm</span>
                </div>
                <input
                  type="range"
                  min="75"
                  max="130"
                  value={biometricChest}
                  onChange={(e) => setBiometricChest(Number(e.target.value))}
                  className="w-full h-1 bg-[#2B2B2B] accent-white appearance-none cursor-pointer outline-none rounded-lg"
                />
              </div>

              {/* Slider 3: Outer Arm Radius */}
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span>OUTER ARM RADIUS</span>
                  <span className="text-[#F3F3F3]">{biometricArm} cm</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="95"
                  value={biometricArm}
                  onChange={(e) => setBiometricArm(Number(e.target.value))}
                  className="w-full h-1 bg-[#2B2B2B] accent-white appearance-none cursor-pointer outline-none rounded-lg"
                />
              </div>

            </div>

            {/* Scanning Readouts */}
            <div className="bg-[#050505] p-3 rounded-sm border border-[#2B2B2B] flex flex-col md:flex-row items-center justify-between gap-3 text-[10px] font-mono">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span className="text-neutral-400">NOMAD CALIBRATE READOUT:</span>
                <span className="text-white font-bold">{matchPercent}% COMPATIBILITY MATCH</span>
              </div>
              
              <div className="text-[9px] text-neutral-500 uppercase">
                RECOMMENDED ENVELOPE: <span className="text-[#F3F3F3] bg-[#2B2B2B] px-1.5 py-0.5 rounded-sm">{sizeRec}</span>
              </div>
            </div>

          </div>

          {/* Action triggers: Call purchase allocation and wishlist registry */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-[#2B2B2B]/50">
            
            <button
              id="btn-add-to-cart-action"
              onClick={handleTriggerIntake}
              disabled={calibratedSuccess}
              className={`flex-grow px-6 py-4 rounded-sm font-mono text-[11px] tracking-[0.2em] uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md transform active:scale-95 ${
                calibratedSuccess 
                  ? 'bg-emerald-500/10 border border-emerald-500 text-emerald-400'
                  : 'bg-white hover:bg-neutral-200 text-[#050505] border border-white font-semibold'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>
                {calibratedSuccess 
                  ? 'STORAGE CODES LOADED ✔' 
                  : langDict['btn.add_to_cart'][lang]}
              </span>
            </button>

            <button
              id="btn-wishlist-toggle-action"
              onClick={() => onToggleWishlist(artifact)}
              className="px-5 py-4 rounded-sm border transition-all duration-300 font-mono text-[10px] tracking-widest uppercase flex items-center justify-center gap-2 cursor-pointer transform active:scale-95 bg-white/10 border-white text-white font-bold"
            >
              <Star className="w-4 h-4" fill={isSaved ? '#FFFFFF' : 'none'} />
              <span>{langDict['btn.add_to_wishlist'][lang]}</span>
            </button>

          </div>

        </div>

      </div>

      {/* Related excavated artifacts */}
      <div className="mt-20 pt-10 border-t border-[#2B2B2B] space-y-6 text-left">
        <h3 className="font-serif text-[22px] text-[#F3F3F3] tracking-widest uppercase font-bold">
          {lang === 'en' ? 'RELATED ATELIER BLUEPRINTS' : 'BLUEPRINTS CO-ESCAVADOS'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {relatedItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectRelated(item)}
              className="bg-[#0E0E0E] border border-[#2B2B2B] p-4 rounded-sm hover:border-white/50 transition-all duration-500 cursor-pointer flex items-center gap-4 group"
            >
              <div className="w-16 h-20 bg-[#050505] rounded-sm overflow-hidden flex items-center justify-center border border-[#2B2B2B]/50 shrink-0">
                <img
                  src={item.images.front}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className="max-w-[90%] max-h-[90%] object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                />
              </div>

              <div>
                <span className="font-mono text-[8px] text-neutral-400 block">{item.code}</span>
                <h4 className="font-serif text-[13px] text-neutral-300 uppercase tracking-wider group-hover:text-white transition-colors duration-300 line-clamp-1 font-semibold">
                  {item.name}
                </h4>
                <span className="font-mono text-[11px] text-neutral-400 font-bold">
                  {getPriceFormatted(item.priceCRDT)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
