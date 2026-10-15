/**
 * @file GarmentDetailModal.tsx
 * Deep Garment Dossier Inspector for the Daniel’s Maison Digital Wardrobe.
 * Displays multi-angle lookbooks, Material specs, Color & Dye details,
 * Size History, Alteration Logs, Archival Care Guidelines, and Lifetime Warranty.
 */

import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Scissors,
  ShieldCheck,
  Calendar,
  Layers,
  Thermometer,
  Wind,
  CheckCircle2,
  FileText,
  Clock,
  Ruler,
  Palette,
  Droplets,
  PackageCheck,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { WardrobeItemFull, ServiceActionType } from '../../../types/wardrobe.types';

interface GarmentDetailModalProps {
  item: WardrobeItemFull | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenActionModal: (actionType: ServiceActionType) => void;
}

export const GarmentDetailModal: React.FC<GarmentDetailModalProps> = ({
  item,
  isOpen,
  onClose,
  onOpenActionModal,
}) => {
  const [activeTab, setActiveTab] = useState<
    'specs' | 'material' | 'color' | 'size' | 'alterations' | 'care' | 'warranty'
  >('specs');

  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  if (!isOpen || !item) return null;

  const photos = [item.primaryImageUrl, ...(item.galleryImageUrls || [])];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'IN_WARDROBE':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            ● IN YOUR WARDROBE
          </span>
        );
      case 'IN_ATELIER':
      case 'ALTERATION_IN_PROGRESS':
      case 'REPAIR_IN_PROGRESS':
      case 'CLEANING_IN_PROGRESS':
      case 'CARE_IN_PROGRESS':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 border border-amber-500/30 text-amber-400 animate-pulse">
            ● IN ATELIER SERVICE
          </span>
        );
      case 'DISPATCHED_RETURN':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            ● COURIER RETURN DISPATCH
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-neutral-800 text-neutral-400">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0B0B0B] border border-[#2B2B2B] rounded-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl text-left font-mono">
        {/* Top Header Bar */}
        <div className="p-5 sm:p-6 border-b border-[#222] flex items-center justify-between gap-4 bg-[#121212] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest">
                  {item.category} • {item.originalOrderId}
                </span>
                {getStatusBadge(item.status)}
              </div>
              <h2 className="font-serif text-lg sm:text-xl text-white font-bold uppercase tracking-wider truncate max-w-xl">
                {item.garmentName}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Left Lookbook, Right Tabs */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-[#222]">
          {/* Left Column: Garment Visual Gallery & Provenance (5 cols) */}
          <div className="lg:col-span-5 p-6 bg-[#0E0E0E] flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="aspect-[3/4] w-full rounded-xl overflow-hidden bg-black border border-[#222] relative group">
                <img
                  src={photos[activePhotoIdx]}
                  alt={item.garmentName}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-lg bg-black/75 backdrop-blur-sm border border-white/10 text-[10px] text-neutral-300">
                  <span className="text-white font-bold block">{item.silhouetteStyle}</span>
                  <span className="text-neutral-400">Crafted by {item.masterTailorName}</span>
                </div>
              </div>

              {/* Thumbnails */}
              {photos.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {photos.map((src, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActivePhotoIdx(idx)}
                      className={`w-14 h-14 rounded-lg overflow-hidden border transition-all shrink-0 ${
                        activePhotoIdx === idx
                          ? 'border-amber-400 ring-1 ring-amber-400'
                          : 'border-neutral-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={src} alt="thumb" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Atelier Heritage Tag */}
            <div className="p-4 rounded-xl bg-[#141414] border border-[#262626] space-y-2 text-xs">
              <div className="flex items-center justify-between text-[10px] text-neutral-400 uppercase tracking-wider">
                <span>Atelier Provenance</span>
                <span className="text-amber-400 font-bold">100% BESPOKE</span>
              </div>
              <div className="text-white font-serif font-bold text-sm">
                {item.atelierLocation}
              </div>
              <div className="text-[11px] text-neutral-400 font-sans">
                Master Artisan: <span className="text-white">{item.masterTailorName}</span> • Acquired on{' '}
                <span className="text-neutral-300 font-mono">
                  {new Date(item.acquiredDate).toLocaleDateString([], {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <div className="text-[10px] text-neutral-500 pt-1 font-mono">
                Original Valuation: £{item.originalPriceGbp.toLocaleString()} {item.currency}
              </div>
            </div>
          </div>

          {/* Right Column: Multi-tab Information & Action Dock (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            {/* Sub-Tabs Nav */}
            <div className="p-3 border-b border-[#222] bg-[#121212] flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[11px]">
              {[
                { id: 'specs', label: 'Overview', icon: FileText },
                { id: 'material', label: 'Material', icon: Layers },
                { id: 'color', label: 'Color & Dye', icon: Palette },
                { id: 'size', label: 'Size History', icon: Ruler },
                { id: 'alterations', label: 'Alterations', icon: Scissors, badge: `${item.alterations.length}` },
                { id: 'care', label: 'Care Guide', icon: Droplets },
                { id: 'warranty', label: 'Warranty', icon: ShieldCheck },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors border ${
                      isActive
                        ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 font-bold'
                        : 'border-transparent text-neutral-400 hover:text-white hover:bg-neutral-900'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                    {tab.badge && (
                      <span className="text-[9px] px-1 py-0.2 rounded-full bg-neutral-800 text-neutral-400 font-mono">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Sub-Tab View Container */}
            <div className="p-6 flex-1 overflow-y-auto space-y-6">
              {/* TAB 1: SPECS / OVERVIEW */}
              {activeTab === 'specs' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-serif text-base font-bold text-white uppercase tracking-wider mb-1">
                      Garment Silhouette & Commission Profile
                    </h4>
                    <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                      {item.clientNotes ||
                        'Crafted exclusively for the patron with floating horsehair canvas and hand-padded lapels.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-[#141414] border border-[#222] space-y-1">
                      <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">
                        Category & Silhouette
                      </span>
                      <span className="text-white font-bold">{item.category}</span>
                      <span className="text-[11px] text-neutral-400 block">{item.silhouetteStyle}</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#141414] border border-[#222] space-y-1">
                      <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">
                        Fabric Mill & Cloth
                      </span>
                      <span className="text-white font-bold">{item.material.fabricMillName}</span>
                      <span className="text-[11px] text-neutral-400 block">{item.material.fabricName}</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#141414] border border-[#222] space-y-1">
                      <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">
                        Color & Dye Lot
                      </span>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0"
                          style={{ backgroundColor: item.color.hexCode }}
                        />
                        <span className="text-white font-bold">{item.color.primaryColorName}</span>
                      </div>
                      <span className="text-[10px] text-neutral-500 font-mono block">
                        Lot: {item.color.dyeBatchNumber}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#141414] border border-[#222] space-y-1">
                      <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">
                        Lifetime Covenant
                      </span>
                      <span className="text-emerald-400 font-bold">Complimentary Alterations</span>
                      <span className="text-[10px] text-neutral-400 block">
                        Certificate: {item.warranty.certificateSerialNumber}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: MATERIAL SPECS */}
              {activeTab === 'material' && (
                <div className="space-y-5 text-xs">
                  <div>
                    <h4 className="font-serif text-base font-bold text-white uppercase tracking-wider mb-1 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-amber-400" />
                      <span>Textile Provenance & Weave Architecture</span>
                    </h4>
                    <p className="text-xs text-neutral-400 font-sans">
                      Sourced directly from certified heritage mills in Britain and Biella, Italy.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#141414] border border-[#222] space-y-3">
                    <div className="flex items-center justify-between border-b border-[#222] pb-2">
                      <span className="text-neutral-400">Mill Origin</span>
                      <span className="text-white font-bold">
                        {item.material.fabricMillName} ({item.material.fabricMillCountry})
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-b border-[#222] pb-2">
                      <span className="text-neutral-400">Fiber Composition</span>
                      <span className="text-amber-300 font-bold">{item.material.composition}</span>
                    </div>

                    <div className="flex items-center justify-between border-b border-[#222] pb-2">
                      <span className="text-neutral-400">Weight & Thickness</span>
                      <span className="text-white font-mono">{item.material.weightGsm} g/m² (GSM)</span>
                    </div>

                    <div className="flex items-center justify-between border-b border-[#222] pb-2">
                      <span className="text-neutral-400">Weave Structure</span>
                      <span className="text-white font-mono">{item.material.weaveStructure}</span>
                    </div>

                    <div className="flex items-center justify-between border-b border-[#222] pb-2">
                      <span className="text-neutral-400">Breathability / Climate</span>
                      <span className="text-white">{item.material.breathabilityRating}</span>
                    </div>

                    {item.material.liningFabric && (
                      <div className="flex items-center justify-between border-b border-[#222] pb-2">
                        <span className="text-neutral-400">Lining Fabric</span>
                        <span className="text-white">{item.material.liningFabric}</span>
                      </div>
                    )}

                    {item.material.buttonMaterial && (
                      <div className="flex items-center justify-between border-b border-[#222] pb-2">
                        <span className="text-neutral-400">Buttons & Hardware</span>
                        <span className="text-white">{item.material.buttonMaterial}</span>
                      </div>
                    )}

                    {item.material.interliningType && (
                      <div className="flex items-center justify-between border-b border-[#222] pb-2">
                        <span className="text-neutral-400">Internal Canvas Construction</span>
                        <span className="text-white">{item.material.interliningType}</span>
                      </div>
                    )}

                    {item.material.environmentalCertification && (
                      <div className="flex items-center justify-between pt-1 text-[11px]">
                        <span className="text-emerald-400">Sustainability & Origin Proof</span>
                        <span className="text-emerald-300 font-sans">
                          {item.material.environmentalCertification}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: COLOR & DYE */}
              {activeTab === 'color' && (
                <div className="space-y-5 text-xs">
                  <div>
                    <h4 className="font-serif text-base font-bold text-white uppercase tracking-wider mb-1 flex items-center gap-2">
                      <Palette className="w-4 h-4 text-amber-400" />
                      <span>Color Chemistry & Dye Archival Record</span>
                    </h4>
                    <p className="text-xs text-neutral-400 font-sans">
                      Precise pigment formulations archived for exact matching in alterations or sibling garments.
                    </p>
                  </div>

                  <div className="p-5 rounded-xl bg-[#141414] border border-[#222] flex items-center gap-5">
                    <div
                      className="w-20 h-20 rounded-xl border border-white/20 shadow-xl shrink-0"
                      style={{ backgroundColor: item.color.hexCode }}
                    />
                    <div className="space-y-1">
                      <div className="font-serif text-lg font-bold text-white">
                        {item.color.primaryColorName}
                      </div>
                      <div className="font-mono text-neutral-400">
                        HEX: <span className="text-white font-bold">{item.color.hexCode}</span> • Dye Lot:{' '}
                        <span className="text-amber-300">{item.color.dyeBatchNumber}</span>
                      </div>
                      <div className="text-[11px] text-neutral-400 font-sans">
                        Pattern: <span className="text-white">{item.color.patternType}</span>
                      </div>
                    </div>
                  </div>

                  {item.color.stitchThreadColor && (
                    <div className="p-3.5 rounded-xl bg-[#111] border border-[#222] flex items-center justify-between">
                      <span className="text-neutral-400">Topstitch Thread Color</span>
                      <span className="text-white font-mono">{item.color.stitchThreadColor}</span>
                    </div>
                  )}

                  {item.color.accentLiningColor && (
                    <div className="p-3.5 rounded-xl bg-[#111] border border-[#222] flex items-center justify-between">
                      <span className="text-neutral-400">Contrast Inner Lining Accent</span>
                      <span className="text-white font-mono">{item.color.accentLiningColor}</span>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: SIZE HISTORY */}
              {activeTab === 'size' && (
                <div className="space-y-5 text-xs">
                  <div>
                    <h4 className="font-serif text-base font-bold text-white uppercase tracking-wider mb-1 flex items-center gap-2">
                      <Ruler className="w-4 h-4 text-cyan-400" />
                      <span>Size & Biometric Fit History</span>
                    </h4>
                    <p className="text-xs text-neutral-400 font-sans">
                      Recorded tailor measurements associated with this specific garment cut.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {item.sizeHistory.map((sh, idx) => (
                      <div
                        key={sh.id || idx}
                        className="p-4 rounded-xl bg-[#141414] border border-[#252525] space-y-3"
                      >
                        <div className="flex items-center justify-between border-b border-[#222] pb-2">
                          <span className="text-amber-300 font-bold">{sh.profileVersion}</span>
                          <span className="text-[10px] text-neutral-500 font-mono">
                            {new Date(sh.recordedDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="text-[11px] text-neutral-400 font-sans">
                          Fit Preset: <strong className="text-white">{sh.fitPreset}</strong>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-[11px]">
                          {Object.entries(sh.measurements).map(([k, val]) => (
                            <div key={k} className="p-2 bg-black/40 rounded border border-neutral-800">
                              <span className="text-[9px] text-neutral-500 uppercase block">
                                {k.replace(/([A-Z])/g, ' $1').replace('Cm', ' (cm)')}
                              </span>
                              <span className="text-white font-bold">{val} cm</span>
                            </div>
                          ))}
                        </div>

                        {sh.notes && (
                          <div className="text-[11px] text-neutral-400 font-sans bg-black/20 p-2 rounded">
                            Artisan Note: {sh.notes}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: ALTERATION HISTORY */}
              {activeTab === 'alterations' && (
                <div className="space-y-5 text-xs">
                  <div>
                    <h4 className="font-serif text-base font-bold text-white uppercase tracking-wider mb-1 flex items-center gap-2">
                      <Scissors className="w-4 h-4 text-amber-400" />
                      <span>Alteration & Tailoring Timeline</span>
                    </h4>
                    <p className="text-xs text-neutral-400 font-sans">
                      Archived log of adjustments performed under your Lifetime Atelier Covenant.
                    </p>
                  </div>

                  {item.alterations.length === 0 ? (
                    <div className="p-8 text-center bg-[#141414] border border-[#222] rounded-xl text-neutral-500">
                      <Scissors className="w-8 h-8 mx-auto mb-2 opacity-40" />
                      <p>Pristine original commission. No alterations have been performed on this garment.</p>
                      <button
                        onClick={() => onOpenActionModal('REQUEST_ALTERATION')}
                        className="mt-3 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider rounded-lg"
                      >
                        Request Complimentary Fitting Adjustment →
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {item.alterations.map((alt) => (
                        <div
                          key={alt.id}
                          className="p-4 rounded-xl bg-[#141414] border border-[#252525] space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-white font-bold text-sm">{alt.serviceType}</span>
                            <span className="text-[10px] text-emerald-400 font-mono font-bold">
                              {alt.isComplimentary ? 'COMPLIMENTARY' : `£${alt.costGbp}`}
                            </span>
                          </div>
                          <p className="text-neutral-300 font-sans leading-relaxed text-xs">
                            {alt.description}
                          </p>
                          <div className="flex items-center justify-between text-[10px] text-neutral-500 font-mono pt-1">
                            <span>Tailor: {alt.tailorName} ({alt.atelierBranch})</span>
                            <span>{new Date(alt.alterationDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 6: CARE PROTOCOL */}
              {activeTab === 'care' && (
                <div className="space-y-5 text-xs">
                  <div>
                    <h4 className="font-serif text-base font-bold text-white uppercase tracking-wider mb-1 flex items-center gap-2">
                      <Droplets className="w-4 h-4 text-cyan-400" />
                      <span>Atelier Garment Care Protocol</span>
                    </h4>
                    <p className="text-xs text-neutral-400 font-sans">
                      Protect the natural crimp, luster, and longevity of your bespoke textile.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-4 rounded-xl bg-[#141414] border border-[#222] space-y-1">
                      <span className="text-[10px] text-neutral-500 uppercase tracking-wider block flex items-center gap-1.5">
                        <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                        <span>Ironing & Pressing</span>
                      </span>
                      <span className="text-white font-bold">
                        Max {item.care.pressingTemperatureCelsius}°C
                      </span>
                      <p className="text-[11px] text-neutral-400 font-sans">
                        {item.care.steamRecommendation}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-[#141414] border border-[#222] space-y-1">
                      <span className="text-[10px] text-neutral-500 uppercase tracking-wider block flex items-center gap-1.5">
                        <Wind className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Brushing & Fibers</span>
                      </span>
                      <span className="text-white font-bold">Natural Boar Bristle</span>
                      <p className="text-[11px] text-neutral-400 font-sans">
                        {item.care.brushingTechnique}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-[#141414] border border-[#222] space-y-1 sm:col-span-2">
                      <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">
                        Professional Cleaning Protocol
                      </span>
                      <p className="text-white font-sans leading-relaxed">
                        {item.care.dryCleaningInstruction}
                      </p>
                      <span className="text-[10px] text-neutral-500 font-mono block pt-1">
                        Recommended cadence: {item.care.cleaningFrequencyGuideline}
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-[#141414] border border-[#222] space-y-1 sm:col-span-2">
                      <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">
                        Hanging & Seasonal Storage
                      </span>
                      <span className="text-white font-bold block">{item.care.hangerType}</span>
                      <p className="text-[11px] text-neutral-400 font-sans">
                        {item.care.seasonalStorageNotes}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 7: WARRANTY */}
              {activeTab === 'warranty' && (
                <div className="space-y-5 text-xs">
                  <div>
                    <h4 className="font-serif text-base font-bold text-white uppercase tracking-wider mb-1 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Digital Certificate of Authenticity & Lifetime Warranty</span>
                    </h4>
                    <p className="text-xs text-neutral-400 font-sans">
                      Cryptographically certified bespoke provenance registered on the Daniel’s Maison Atelier Registry.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-gradient-to-br from-[#1A1810] to-[#0E0E0E] border border-amber-500/40 space-y-4 shadow-xl">
                    <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
                      <div>
                        <span className="text-[9px] uppercase tracking-widest text-amber-400/80 font-bold block">
                          ATELIER WARRANT REGISTRATION
                        </span>
                        <span className="font-serif text-base font-bold text-white">
                          {item.warranty.warrantyTier}
                        </span>
                      </div>
                      <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                        ACTIVE & CERTIFIED
                      </span>
                    </div>

                    <p className="text-xs text-neutral-300 font-sans leading-relaxed">
                      {item.warranty.coverageSummary}
                    </p>

                    <div className="grid grid-cols-2 gap-3 text-[11px] font-mono pt-2 border-t border-amber-500/20">
                      <div>
                        <span className="text-[9px] text-neutral-400 uppercase block">Serial Certificate</span>
                        <span className="text-amber-300 select-all font-bold">
                          {item.warranty.certificateSerialNumber}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] text-neutral-400 uppercase block">Cryptographic Hash</span>
                        <span className="text-neutral-300 text-[10px] truncate block select-all">
                          {item.warranty.cryptographicHash}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center font-mono text-[11px]">
                    <div className="p-3 rounded-xl bg-[#141414] border border-[#222]">
                      <span className="text-[9px] text-neutral-500 uppercase block">Alterations</span>
                      <span className="text-emerald-400 font-bold text-sm">UNLIMITED</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#141414] border border-[#222]">
                      <span className="text-[9px] text-neutral-500 uppercase block">Eco-Cleanings</span>
                      <span className="text-amber-400 font-bold text-sm">
                        {item.warranty.complimentaryCleaningsRemaining} Left
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#141414] border border-[#222]">
                      <span className="text-[9px] text-neutral-500 uppercase block">Seam Repairs</span>
                      <span className="text-emerald-400 font-bold text-sm">LIFETIME</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Action Dock (All 6 Actions Accessible) */}
            <div className="p-4 bg-[#0E0E0E] border-t border-[#222] flex flex-wrap items-center justify-between gap-2 shrink-0">
              <span className="text-[10px] text-neutral-400 uppercase tracking-widest hidden sm:inline">
                Atelier Stewardship Actions:
              </span>

              <div className="flex flex-wrap items-center gap-1.5 ml-auto">
                <button
                  onClick={() => onOpenActionModal('REQUEST_ALTERATION')}
                  className="px-3 py-1.5 bg-[#181818] hover:bg-[#252525] border border-[#333] hover:border-amber-500/40 text-neutral-200 text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Scissors className="w-3.5 h-3.5 text-amber-400" />
                  <span>Alteration</span>
                </button>

                <button
                  onClick={() => onOpenActionModal('REQUEST_REPAIR')}
                  className="px-3 py-1.5 bg-[#181818] hover:bg-[#252525] border border-[#333] hover:border-amber-500/40 text-neutral-200 text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Repair</span>
                </button>

                <button
                  onClick={() => onOpenActionModal('REQUEST_CARE_SERVICE')}
                  className="px-3 py-1.5 bg-[#181818] hover:bg-[#252525] border border-[#333] hover:border-amber-500/40 text-neutral-200 text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Care Revival</span>
                </button>

                <button
                  onClick={() => onOpenActionModal('REQUEST_CLEANING_SERVICE')}
                  className="px-3 py-1.5 bg-[#181818] hover:bg-[#252525] border border-[#333] hover:border-amber-500/40 text-neutral-200 text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Droplets className="w-3.5 h-3.5 text-blue-400" />
                  <span>Eco-Cleaning</span>
                </button>

                <button
                  onClick={() => onOpenActionModal('REQUEST_RECREATION_MEASUREMENTS')}
                  className="px-3 py-1.5 bg-[#181818] hover:bg-[#252525] border border-[#333] hover:border-amber-500/40 text-neutral-200 text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-purple-400" />
                  <span>Recreate in New Cloth</span>
                </button>

                <button
                  onClick={() => onOpenActionModal('REORDER_SAME_ITEM')}
                  className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow-md shadow-amber-500/20 cursor-pointer"
                >
                  Reorder Item
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
