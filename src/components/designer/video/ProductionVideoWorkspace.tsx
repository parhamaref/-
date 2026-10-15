/**
 * @file ProductionVideoWorkspace.tsx
 * Enterprise Production Video Center & Craftsmanship Media Vault.
 * Features video streaming, photo proof inspection, in-browser compression pipeline,
 * order association, craftsmanship tagging, and customer transparency streams.
 */

import React, { useState, useMemo } from 'react';
import {
  Video,
  Image as ImageIcon,
  Upload,
  Play,
  Eye,
  Lock,
  Search,
  Filter,
  Trash2,
  HardDrive,
  Flame,
  CheckCircle2,
  Sparkles,
  Layers,
  Clock,
  User,
  RotateCcw,
  Tag,
  Grid,
  List,
  Maximize2,
  Sliders,
  Check,
} from 'lucide-react';
import { useMediaCenterStore } from '../../../stores/mediaCenterStore';
import { MediaItem, MediaItemType } from '../../../types/mediaCenter.types';
import { formatBytes, formatDuration } from '../../../utils/mediaCompressor';
import { MediaUploadModal } from './MediaUploadModal';
import { MediaLightboxModal } from './MediaLightboxModal';

export const ProductionVideoWorkspace: React.FC = () => {
  const {
    mediaItems,
    addMediaItem,
    deleteMediaItem,
    toggleCustomerVisibility,
    incrementViews,
    resetToDefaults,
  } = useMediaCenterStore();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'video' | 'photo'>('all');
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [tagFilter, setTagFilter] = useState<string>('all');
  const [visibilityFilter, setVisibilityFilter] = useState<'all' | 'visible' | 'hidden'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Modals state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [inspectedMediaItem, setInspectedMediaItem] = useState<MediaItem | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Extract unique orders and tags for filter dropdowns
  const availableOrders = useMemo(() => {
    const map = new Map<string, string>();
    mediaItems.forEach((m) => {
      if (m.orderId && m.orderNumber) {
        map.set(m.orderId, `${m.orderNumber} - ${m.customerName || 'Client'}`);
      }
    });
    return Array.from(map.entries());
  }, [mediaItems]);

  const availableTags = useMemo(() => {
    const set = new Set<string>();
    mediaItems.forEach((m) => m.tags.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [mediaItems]);

  // KPIs
  const kpis = useMemo(() => {
    const totalVideos = mediaItems.filter((m) => m.type === 'video').length;
    const totalPhotos = mediaItems.filter((m) => m.type === 'photo').length;
    const clientVisibleCount = mediaItems.filter((m) => m.isCustomerVisible).length;
    const totalOriginalSize = mediaItems.reduce((acc, m) => acc + m.originalSizeBytes, 0);
    const totalCompressedSize = mediaItems.reduce(
      (acc, m) => acc + (m.compressedSizeBytes || m.originalSizeBytes),
      0
    );
    const totalSavedBytes = Math.max(0, totalOriginalSize - totalCompressedSize);
    const avgSavingsPercent =
      totalOriginalSize > 0 ? Math.round((totalSavedBytes / totalOriginalSize) * 100) : 0;

    return {
      totalCount: mediaItems.length,
      totalVideos,
      totalPhotos,
      clientVisibleCount,
      totalOriginalSize,
      totalSavedBytes,
      avgSavingsPercent,
    };
  }, [mediaItems]);

  // Filtered media list
  const filteredMedia = useMemo(() => {
    return mediaItems.filter((item) => {
      const matchesSearch =
        !searchQuery.trim() ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.artisanName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.orderNumber && item.orderNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesType = typeFilter === 'all' || item.type === typeFilter;
      const matchesOrder = orderFilter === 'all' || item.orderId === orderFilter;
      const matchesStage = stageFilter === 'all' || item.productionStage === stageFilter;
      const matchesTag = tagFilter === 'all' || item.tags.includes(tagFilter);
      const matchesVisibility =
        visibilityFilter === 'all' ||
        (visibilityFilter === 'visible' && item.isCustomerVisible) ||
        (visibilityFilter === 'hidden' && !item.isCustomerVisible);

      return (
        matchesSearch &&
        matchesType &&
        matchesOrder &&
        matchesStage &&
        matchesTag &&
        matchesVisibility
      );
    });
  }, [
    mediaItems,
    searchQuery,
    typeFilter,
    orderFilter,
    stageFilter,
    tagFilter,
    visibilityFilter,
  ]);

  const handleOpenItem = (item: MediaItem) => {
    incrementViews(item.id);
    setInspectedMediaItem(item);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#141414] border border-amber-500/50 text-white px-4 py-3 rounded-xs shadow-2xl flex items-center gap-2.5 text-xs font-mono">
          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. TOP MEDIA VAULT KPI METRICS STRIP */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="p-3.5 bg-[#0E0E0E] border border-[#222] rounded-xs space-y-1">
          <span className="text-[10px] font-mono text-neutral-500 uppercase block">Total Media Proofs</span>
          <span className="text-xl font-serif text-white font-bold">{kpis.totalCount} Assets</span>
        </div>

        <div className="p-3.5 bg-[#0E0E0E] border border-[#222] rounded-xs space-y-1">
          <span className="text-[10px] font-mono text-amber-400 uppercase block">Craftsmanship Videos</span>
          <span className="text-xl font-serif text-amber-400 font-bold">{kpis.totalVideos} Streams</span>
        </div>

        <div className="p-3.5 bg-[#0E0E0E] border border-[#222] rounded-xs space-y-1">
          <span className="text-[10px] font-mono text-blue-400 uppercase block">High-Res Photos</span>
          <span className="text-xl font-serif text-blue-400 font-bold">{kpis.totalPhotos} Proofs</span>
        </div>

        <div className="p-3.5 bg-[#0E0E0E] border border-[#222] rounded-xs space-y-1">
          <span className="text-[10px] font-mono text-emerald-400 uppercase block">Bandwidth Saved</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-serif text-emerald-400 font-bold">
              {formatBytes(kpis.totalSavedBytes)}
            </span>
            <span className="text-[10px] font-mono text-neutral-400">({kpis.avgSavingsPercent}%)</span>
          </div>
        </div>

        <div className="p-3.5 bg-[#0E0E0E] border border-[#222] rounded-xs space-y-1">
          <span className="text-[10px] font-mono text-neutral-400 uppercase block">Client Portal Stream</span>
          <span className="text-xl font-serif text-white font-bold">{kpis.clientVisibleCount} Live</span>
        </div>
      </div>

      {/* 2. HEADER & CONTROL TOOLBAR */}
      <div className="p-6 bg-[#0E0E0E] border border-[#2B2B2B] rounded-xs shadow-xl space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 bg-amber-400/10 border border-amber-400/30 text-amber-400 text-[10px] font-mono uppercase tracking-wider rounded-xs">
                Production Transparency Stream
              </span>
              <span className="text-neutral-500 text-xs font-mono">
                {filteredMedia.length} of {mediaItems.length} Shown
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-serif text-white tracking-tight uppercase">
              Production Video & Craftsmanship Center
            </h1>
            <p className="text-xs text-neutral-400 font-sans mt-0.5">
              Stream haute-couture tailoring videos, upload high-res photo proof, apply in-browser compression, and link to client orders.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => {
                if (confirm('Reset media vault to default atelier showroom demo videos?')) {
                  resetToDefaults();
                  showToast('Media vault reset to factory demo assets');
                }
              }}
              className="p-2.5 bg-[#141414] hover:bg-[#202020] border border-[#2B2B2B] text-neutral-400 hover:text-white rounded-xs transition-colors cursor-pointer"
              title="Reset sample media"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-black text-xs font-mono uppercase font-bold tracking-wider rounded-xs transition-colors flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-400/20"
            >
              <Upload className="w-4 h-4" />
              Upload Craft Media
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="pt-3 border-t border-[#1C1C1C] flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs font-mono">
          {/* Search Input */}
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-neutral-500" />
              <input
                type="text"
                placeholder="Search by title, tag, artisan, or order #..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-[#141414] border border-[#2B2B2B] rounded-xs text-white text-xs placeholder:text-neutral-600 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Type Toggle Pills & Filter Dropdowns */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Type Filter */}
            <div className="flex items-center bg-[#141414] p-1 border border-[#2B2B2B] rounded-xs">
              {(['all', 'video', 'photo'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`px-2.5 py-0.5 text-[10px] font-mono uppercase rounded-xs transition-colors cursor-pointer ${
                    typeFilter === t
                      ? 'bg-amber-400 text-black font-bold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {t === 'all' ? 'All' : t === 'video' ? 'Videos' : 'Photos'}
                </button>
              ))}
            </div>

            {/* Order Filter */}
            <select
              value={orderFilter}
              onChange={(e) => setOrderFilter(e.target.value)}
              className="px-2 py-1 bg-[#141414] border border-[#2B2B2B] rounded-xs text-neutral-300 text-xs focus:border-amber-400 focus:outline-none cursor-pointer max-w-[170px] truncate"
            >
              <option value="all">All Orders</option>
              {availableOrders.map(([id, label]) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
            </select>

            {/* Visibility Filter */}
            <select
              value={visibilityFilter}
              onChange={(e) => setVisibilityFilter(e.target.value as any)}
              className="px-2 py-1 bg-[#141414] border border-[#2B2B2B] rounded-xs text-neutral-300 text-xs focus:border-amber-400 focus:outline-none cursor-pointer"
            >
              <option value="all">All Visibility</option>
              <option value="visible">Live in Portal</option>
              <option value="hidden">Atelier Only</option>
            </select>

            {/* Tag Filter */}
            {availableTags.length > 0 && (
              <select
                value={tagFilter}
                onChange={(e) => setTagFilter(e.target.value)}
                className="px-2 py-1 bg-[#141414] border border-[#2B2B2B] rounded-xs text-neutral-300 text-xs focus:border-amber-400 focus:outline-none cursor-pointer max-w-[140px] truncate"
              >
                <option value="all">All Tags</option>
                {availableTags.map((tag) => (
                  <option key={tag} value={tag}>
                    #{tag}
                  </option>
                ))}
              </select>
            )}

            {/* Layout Mode Toggle */}
            <div className="flex items-center bg-[#141414] p-1 border border-[#2B2B2B] rounded-xs text-neutral-400">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1 rounded-xs cursor-pointer ${
                  viewMode === 'grid' ? 'bg-[#222] text-amber-400' : 'hover:text-white'
                }`}
                title="Grid View"
              >
                <Grid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1 rounded-xs cursor-pointer ${
                  viewMode === 'list' ? 'bg-[#222] text-amber-400' : 'hover:text-white'
                }`}
                title="List View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MEDIA CARDS CONTAINER */}
      {filteredMedia.length === 0 ? (
        <div className="p-16 text-center bg-[#0E0E0E] border border-[#222] rounded-xs space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#1A1A1A] border border-[#333] flex items-center justify-center text-amber-400 mx-auto">
            <Video className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-mono text-white font-medium">No Craftsmanship Media Found</h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto font-sans">
            No media matching your current filter criteria. Upload a video clip or reset filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setTypeFilter('all');
              setOrderFilter('all');
              setVisibilityFilter('all');
              setTagFilter('all');
            }}
            className="px-4 py-1.5 bg-[#1F1F1F] hover:bg-[#2A2A2A] text-white text-xs font-mono uppercase rounded-xs transition-colors cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMedia.map((item) => (
            <div
              key={item.id}
              className="bg-[#0E0E0E] border border-[#222] hover:border-neutral-500 rounded-xs overflow-hidden flex flex-col justify-between transition-all group shadow-lg"
            >
              <div>
                {/* Thumbnail Preview Stage */}
                <div
                  onClick={() => handleOpenItem(item)}
                  className="relative aspect-video bg-black overflow-hidden cursor-pointer"
                >
                  <img
                    src={item.thumbnailUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Gradient Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Type Badge & Duration */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span
                      className={`px-2 py-0.5 rounded-xs font-mono text-[9px] uppercase font-bold tracking-wider ${
                        item.type === 'video'
                          ? 'bg-amber-400/90 text-black'
                          : 'bg-blue-500/90 text-white'
                      }`}
                    >
                      {item.type}
                    </span>
                    <span className="px-1.5 py-0.5 rounded-xs bg-black/70 text-white font-mono text-[9px] border border-white/20">
                      {item.resolution}
                    </span>
                  </div>

                  {item.durationSeconds && (
                    <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-xs bg-black/80 text-amber-300 font-mono text-[10px] font-bold border border-white/20 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDuration(item.durationSeconds)}
                    </div>
                  )}

                  {/* Center Play Icon for Video */}
                  {item.type === 'video' && (
                    <div className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-black/60 group-hover:bg-amber-400 text-white group-hover:text-black flex items-center justify-center transition-all group-hover:scale-110 border border-white/30 group-hover:border-transparent">
                      <Play className="w-5 h-5 ml-0.5 fill-current" />
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-3">
                  <div className="space-y-1">
                    <h3
                      onClick={() => handleOpenItem(item)}
                      className="text-xs font-serif text-white uppercase tracking-wide font-medium truncate cursor-pointer hover:text-amber-400 transition-colors"
                      title={item.title}
                    >
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-neutral-400 font-sans line-clamp-2 leading-relaxed">
                      {item.caption}
                    </p>
                  </div>

                  {/* Order Association Badge */}
                  {item.orderNumber && (
                    <div className="p-2 bg-[#141414] border border-[#222] rounded-xs flex items-center justify-between text-[10px] font-mono">
                      <div className="flex items-center gap-1.5 text-amber-400 truncate">
                        <Flame className="w-3 h-3 shrink-0" />
                        <span className="font-bold truncate">{item.orderNumber}</span>
                      </div>
                      <span className="text-neutral-400 truncate max-w-[120px]">
                        {item.customerName}
                      </span>
                    </div>
                  )}

                  {/* Compression Metrics Pill */}
                  <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 pt-1 border-t border-[#1C1C1C]">
                    <span className="flex items-center gap-1">
                      <HardDrive className="w-3 h-3 text-neutral-400" />
                      <span>{formatBytes(item.compressedSizeBytes || item.originalSizeBytes)}</span>
                    </span>
                    {item.compression && (
                      <span className="text-emerald-400 font-bold">
                        -{item.compression.reductionPercentage}% saved
                      </span>
                    )}
                  </div>

                  {/* Tags */}
                  <div className="flex items-center gap-1 flex-wrap pt-0.5">
                    {item.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        onClick={() => setTagFilter(tag)}
                        className="px-1.5 py-0.2 rounded-xs bg-[#161616] text-[9px] font-mono text-neutral-400 hover:text-amber-400 cursor-pointer"
                      >
                        #{tag}
                      </span>
                    ))}
                    {item.tags.length > 3 && (
                      <span className="text-[9px] font-mono text-neutral-500">
                        +{item.tags.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="px-4 py-2.5 border-t border-[#1C1C1C] bg-[#121212] flex items-center justify-between text-xs font-mono">
                {/* Customer Visibility Toggle Button */}
                <button
                  onClick={() => {
                    toggleCustomerVisibility(item.id);
                    showToast(
                      item.isCustomerVisible
                        ? 'Removed from customer tracking portal'
                        : 'Published live to customer tracking stream'
                    );
                  }}
                  className={`text-[10px] px-2 py-0.5 rounded-xs border flex items-center gap-1 cursor-pointer transition-colors ${
                    item.isCustomerVisible
                      ? 'border-emerald-800/80 bg-emerald-950/40 text-emerald-300'
                      : 'border-[#333] text-neutral-500 hover:text-white'
                  }`}
                  title="Toggle client portal visibility"
                >
                  {item.isCustomerVisible ? (
                    <>
                      <Eye className="w-3 h-3 text-emerald-400" />
                      <span>Client Stream</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3 h-3" />
                      <span>Private</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenItem(item)}
                    className="p-1 text-neutral-400 hover:text-white cursor-pointer"
                    title="Inspect & Play"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Delete "${item.title}" from media vault?`)) {
                        deleteMediaItem(item.id);
                        showToast('Media proof deleted');
                      }
                    }}
                    className="p-1 text-neutral-400 hover:text-red-400 cursor-pointer"
                    title="Delete item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* LIST VIEW */
        <div className="border border-[#222] rounded-xs overflow-hidden bg-[#0C0C0C]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#141414] border-b border-[#222] text-neutral-400 uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Asset</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Linked Order</th>
                  <th className="py-3 px-4">Milestone</th>
                  <th className="py-3 px-4">Size & Compression</th>
                  <th className="py-3 px-4">Client Portal</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1C1C1C]">
                {filteredMedia.map((item) => (
                  <tr key={item.id} className="hover:bg-[#141414] transition-colors">
                    <td className="py-3 px-4">
                      <div
                        onClick={() => handleOpenItem(item)}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <div className="w-12 h-8 rounded-xs overflow-hidden bg-black shrink-0 border border-[#333]">
                          <img
                            src={item.thumbnailUrl}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <span className="text-white font-medium block truncate max-w-xs group-hover:text-amber-400 transition-colors">
                            {item.title}
                          </span>
                          <span className="text-[10px] text-neutral-500 block">
                            By {item.artisanName}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-xs text-[9px] uppercase font-bold ${
                          item.type === 'video'
                            ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                            : 'bg-blue-400/20 text-blue-300 border border-blue-400/40'
                        }`}
                      >
                        {item.type}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      {item.orderNumber ? (
                        <span className="text-amber-400 font-bold">{item.orderNumber}</span>
                      ) : (
                        <span className="text-neutral-500">Archive</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-neutral-300">
                      {item.productionStage || 'Atelier General'}
                    </td>

                    <td className="py-3 px-4">
                      <div className="text-[11px]">
                        <span className="text-white">
                          {formatBytes(item.compressedSizeBytes || item.originalSizeBytes)}
                        </span>
                        {item.compression && (
                          <span className="text-emerald-400 text-[10px] block font-bold">
                            -{item.compression.reductionPercentage}% saved
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <button
                        onClick={() => toggleCustomerVisibility(item.id)}
                        className={`text-[10px] px-2 py-0.5 rounded-xs border cursor-pointer ${
                          item.isCustomerVisible
                            ? 'border-emerald-800 text-emerald-300 bg-emerald-950/40'
                            : 'border-[#333] text-neutral-500'
                        }`}
                      >
                        {item.isCustomerVisible ? 'Live in Portal' : 'Private'}
                      </button>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenItem(item)}
                          className="px-2 py-1 bg-[#1A1A1A] hover:bg-[#252525] text-white border border-[#333] rounded-xs text-[10px] cursor-pointer"
                        >
                          View
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete "${item.title}"?`)) {
                              deleteMediaItem(item.id);
                              showToast('Deleted media proof');
                            }
                          }}
                          className="p-1 text-neutral-400 hover:text-red-400 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. MODALS */}
      <MediaUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSave={(data) => {
          const item = addMediaItem(data);
          showToast(`Uploaded ${item.title}`);
        }}
      />

      <MediaLightboxModal
        isOpen={Boolean(inspectedMediaItem)}
        onClose={() => setInspectedMediaItem(null)}
        mediaItem={inspectedMediaItem}
        allItems={filteredMedia}
        onNavigate={(item) => setInspectedMediaItem(item)}
        onToggleVisibility={(id) => {
          toggleCustomerVisibility(id);
          if (inspectedMediaItem && inspectedMediaItem.id === id) {
            setInspectedMediaItem({
              ...inspectedMediaItem,
              isCustomerVisible: !inspectedMediaItem.isCustomerVisible,
            });
          }
          showToast('Updated customer visibility');
        }}
      />
    </div>
  );
};
