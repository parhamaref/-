/**
 * @file DesignerProfileView.tsx
 * Enterprise Designer Profile Management page for the DANIELS Fashion Marketplace.
 * Displays brand dossier, visual assets, portfolio gallery, studio coordinates, and management tools.
 */

import React, { useState } from 'react';
import {
  Building,
  User,
  MapPin,
  Clock,
  Mail,
  Phone,
  Globe,
  Instagram,
  Linkedin,
  Twitter,
  ShieldCheck,
  Edit3,
  Camera,
  Plus,
  Star,
  ExternalLink,
  Sparkles,
  Download,
  Share2,
  Trash2,
  Filter,
  Search,
  CheckCircle2,
  Layers,
  Award,
  BookOpen,
} from 'lucide-react';
import { useDesignerStore } from '../../../stores/designerStore';
import { PortfolioItem, PortfolioCategory } from '../../../types/designer.types';
import { EditProfileModal } from './EditProfileModal';
import { PortfolioManageModal } from './PortfolioManageModal';
import { PortfolioLightboxModal } from './PortfolioLightboxModal';
import { ImageUploadModal } from './ImageUploadModal';

export const DesignerProfileView: React.FC = () => {
  const {
    profile,
    updateProfile,
    addPortfolioItem,
    updatePortfolioItem,
    deletePortfolioItem,
    togglePortfolioFeatured,
  } = useDesignerStore();

  // Modals state
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false);
  const [editingPortfolioItem, setEditingPortfolioItem] = useState<PortfolioItem | null>(null);
  const [lightboxItem, setLightboxItem] = useState<PortfolioItem | null>(null);

  // Direct Image Uploader for Cover / Logo / Avatar
  const [quickImageUploader, setQuickImageUploader] = useState<{
    isOpen: boolean;
    type: 'coverImageUrl' | 'logoUrl' | 'avatarUrl';
    title: string;
    aspectRatio: '1:1' | '16:9' | '3:1' | '4:5' | 'any';
  }>({
    isOpen: false,
    type: 'coverImageUrl',
    title: 'Update Asset',
    aspectRatio: 'any',
  });

  // Profile Page Sub-Tabs
  const [activeTab, setActiveTab] = useState<'portfolio' | 'dossier' | 'studio' | 'brand_kit'>('portfolio');

  // Portfolio filters
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filtered Portfolio items
  const gallery = profile.portfolioGallery || [];
  const filteredPortfolio = gallery.filter((item) => {
    const matchesCategory =
      selectedCategory === 'all' || item.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      !searchQuery.trim() ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.tags || []).some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredWorks = gallery.filter((item) => item.featured);

  const handleApplyQuickImage = (url: string) => {
    updateProfile({ [quickImageUploader.type]: url });
    showToast(`Updated ${quickImageUploader.title.toLowerCase()} successfully`);
  };

  const handleExportProfileJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(profile, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${profile.slug}-atelier-dossier.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Atelier dossier exported as JSON');
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#161616] border border-amber-500/50 text-white px-4 py-3 rounded-xs shadow-2xl flex items-center gap-2.5 text-xs font-mono">
          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. HERO COVER & BRAND IDENTITY HEADER */}
      <div className="relative rounded-xs border border-[#2B2B2B] bg-[#0E0E0E] overflow-hidden shadow-2xl">
        {/* Cover Banner */}
        <div className="relative h-56 sm:h-72 w-full bg-neutral-950 overflow-hidden group">
          <img
            src={profile.coverImageUrl}
            alt="Atelier Cover"
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700 opacity-90"
          />
          {/* Obsidian Gradient Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E0E] via-black/40 to-black/20" />

          {/* Quick Cover Change Button */}
          <button
            onClick={() =>
              setQuickImageUploader({
                isOpen: true,
                type: 'coverImageUrl',
                title: 'Change Atelier Cover Banner',
                aspectRatio: '3:1',
              })
            }
            className="absolute top-4 right-4 px-3 py-1.5 bg-black/60 hover:bg-black/90 backdrop-blur-xs text-xs font-mono text-neutral-200 hover:text-white rounded-xs border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer shadow-lg"
          >
            <Camera className="w-3.5 h-3.5 text-amber-400" />
            <span>Change Cover</span>
          </button>
        </div>

        {/* Profile Card Header Info */}
        <div className="px-6 pb-6 pt-0 sm:pt-2">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-16 sm:-mt-20 relative z-10">
            {/* Left: Crest Logo & Avatar */}
            <div className="flex items-end gap-4 sm:gap-6">
              {/* Brand Logo Stamp */}
              <div className="relative group shrink-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xs border-2 border-amber-500/40 bg-black shadow-2xl overflow-hidden p-1">
                  <img
                    src={profile.logoUrl}
                    alt={profile.brandName}
                    className="w-full h-full object-cover rounded-xs"
                  />
                </div>
                <button
                  onClick={() =>
                    setQuickImageUploader({
                      isOpen: true,
                      type: 'logoUrl',
                      title: 'Change Atelier Crest Logo',
                      aspectRatio: '1:1',
                    })
                  }
                  className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-[10px] font-mono text-amber-300 rounded-xs cursor-pointer"
                >
                  <Camera className="w-4 h-4 mb-0.5" />
                  Edit Logo
                </button>
              </div>

              {/* Head Designer Portrait Badge */}
              <div className="relative group shrink-0 hidden sm:block">
                <div className="w-16 h-16 rounded-full border border-[#333] bg-black shadow-xl overflow-hidden">
                  <img
                    src={profile.avatarUrl}
                    alt={profile.designerName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={() =>
                    setQuickImageUploader({
                      isOpen: true,
                      type: 'avatarUrl',
                      title: 'Change Designer Portrait',
                      aspectRatio: '1:1',
                    })
                  }
                  className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-[9px] font-mono text-white rounded-full cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Titles & Verification */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 bg-amber-400/10 text-amber-400 text-[10px] font-mono rounded-xs border border-amber-500/30 font-semibold tracking-wider flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    {profile.verificationStatus.toUpperCase()} ATELIER
                  </span>
                  <span className="text-[10px] font-mono text-neutral-400">
                    ID: {profile.id} • Commission: {(profile.commissionRate * 100).toFixed(0)}%
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-serif text-white tracking-wide uppercase">
                  {profile.brandName}
                </h1>

                <p className="text-xs font-mono text-neutral-400 flex items-center gap-2">
                  <span className="text-neutral-200">Director: {profile.designerName}</span>
                  <span>•</span>
                  <span className="text-amber-400/80">/{profile.slug}</span>
                </p>
              </div>
            </div>

            {/* Right: Master Actions */}
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <button
                onClick={() => setIsEditProfileOpen(true)}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-black text-xs font-mono uppercase tracking-wider font-semibold rounded-xs shadow-lg shadow-amber-400/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit Profile
              </button>

              <button
                onClick={() => {
                  setEditingPortfolioItem(null);
                  setIsPortfolioModalOpen(true);
                }}
                className="px-3.5 py-2 bg-[#1C1C1C] hover:bg-[#262626] border border-[#333] text-white text-xs font-mono uppercase tracking-wider rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-amber-400" />
                Add Work
              </button>

              <button
                onClick={handleExportProfileJson}
                className="p-2 bg-[#1C1C1C] hover:bg-[#262626] border border-[#333] text-neutral-400 hover:text-white rounded-xs transition-colors cursor-pointer"
                title="Export Dossier JSON"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Tagline */}
          {profile.tagline && (
            <p className="mt-4 text-xs sm:text-sm text-neutral-300 font-sans italic border-l-2 border-amber-400/60 pl-3">
              "{profile.tagline}"
            </p>
          )}

          {/* Quick Intelligence Banner */}
          <div className="mt-6 pt-5 border-t border-[#222] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div className="flex items-center gap-2 text-neutral-300">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="truncate">
                <span className="block text-[10px] text-neutral-500 uppercase">Studio Location</span>
                <span className="truncate">{profile.studioLocation.city}, {profile.studioLocation.country}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-neutral-300">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="truncate">
                <span className="block text-[10px] text-neutral-500 uppercase">Consultation Hours</span>
                <span className="truncate">{profile.workingHours}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-neutral-300">
              <Layers className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="truncate">
                <span className="block text-[10px] text-neutral-500 uppercase">Portfolio Gallery</span>
                <span>{gallery.length} Curated Works</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-neutral-300">
              <Mail className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="truncate">
                <span className="block text-[10px] text-neutral-500 uppercase">Atelier Line</span>
                <span className="truncate">{profile.contactEmail}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SECTION SUB-NAVIGATION TABS */}
      <div className="border-b border-[#222] flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 text-xs font-mono">
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`pb-3 px-3 border-b-2 font-medium transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'portfolio'
                ? 'border-amber-400 text-amber-400 font-semibold'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Portfolio Gallery & Archives
            <span className="px-1.5 py-0.2 bg-[#222] text-[10px] text-neutral-300 rounded-xs">
              {gallery.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('dossier')}
            className={`pb-3 px-3 border-b-2 font-medium transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'dossier'
                ? 'border-amber-400 text-amber-400 font-semibold'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Atelier Dossier & Story
          </button>

          <button
            onClick={() => setActiveTab('studio')}
            className={`pb-3 px-3 border-b-2 font-medium transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'studio'
                ? 'border-amber-400 text-amber-400 font-semibold'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            Studio Coordinates & Contact
          </button>

          <button
            onClick={() => setActiveTab('brand_kit')}
            className={`pb-3 px-3 border-b-2 font-medium transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'brand_kit'
                ? 'border-amber-400 text-amber-400 font-semibold'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            Brand Assets & Seals
          </button>
        </div>

        {/* Live Social Quick Icons */}
        <div className="flex items-center gap-3 shrink-0 pb-3 text-neutral-400 text-xs">
          {profile.socialLinks.instagram && (
            <a
              href={profile.socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-400 transition-colors"
              title="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
          )}
          {profile.socialLinks.website && (
            <a
              href={profile.socialLinks.website}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-400 transition-colors"
              title="Official Website"
            >
              <Globe className="w-4 h-4" />
            </a>
          )}
          {profile.socialLinks.linkedin && (
            <a
              href={profile.socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-400 transition-colors"
              title="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          )}
          {profile.socialLinks.twitter && (
            <a
              href={profile.socialLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-400 transition-colors"
              title="X / Twitter"
            >
              <Twitter className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>

      {/* 3. TAB CONTENT */}

      {/* TAB A: PORTFOLIO GALLERY */}
      {activeTab === 'portfolio' && (
        <div className="space-y-6">
          {/* Controls Bar: Category Pills + Search */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111] p-3 rounded-xs border border-[#222]">
            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs font-mono">
              {[
                'all',
                'Runway',
                'Editorial',
                'Atelier',
                'Bespoke',
                'Archive',
                'Craftsmanship',
              ].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xs transition-colors cursor-pointer uppercase ${
                    selectedCategory.toLowerCase() === cat.toLowerCase()
                      ? 'bg-amber-400 text-black font-semibold shadow-xs'
                      : 'bg-[#1C1C1C] text-neutral-400 hover:text-white hover:bg-[#252525]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input & Add Button */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1 md:w-60">
                <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter by title, tag..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-[#181818] border border-[#2B2B2B] text-xs font-mono rounded-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <button
                onClick={() => {
                  setEditingPortfolioItem(null);
                  setIsPortfolioModalOpen(true);
                }}
                className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-black text-xs font-mono uppercase tracking-wider font-semibold rounded-xs transition-colors flex items-center gap-1 cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                New Work
              </button>
            </div>
          </div>

          {/* Featured Highlights Strip (if any) */}
          {featuredWorks.length > 0 && selectedCategory === 'all' && !searchQuery && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                Featured Atelier Masterpieces
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {featuredWorks.slice(0, 2).map((item) => (
                  <div
                    key={item.id}
                    className="relative group rounded-xs border border-amber-500/30 bg-[#121212] overflow-hidden flex flex-col sm:flex-row h-auto sm:h-48 cursor-pointer"
                    onClick={() => setLightboxItem(item)}
                  >
                    <div className="sm:w-2/5 h-44 sm:h-full overflow-hidden bg-black relative">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2 left-2 px-2 py-0.5 bg-amber-400 text-black text-[9px] font-mono font-bold rounded-xs">
                        FEATURED
                      </div>
                    </div>
                    <div className="p-4 sm:w-3/5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400">
                          <span className="text-amber-400">{item.category}</span>
                          <span>{item.year}</span>
                        </div>
                        <h4 className="text-sm font-serif text-white font-medium mt-1 leading-snug">
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-neutral-400 font-sans mt-1 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-[#222] mt-2">
                        <span className="text-[10px] font-mono text-neutral-500">
                          {item.client || 'Savile Row Atelier'}
                        </span>
                        <span className="text-[10px] font-mono text-amber-400 underline">
                          Inspect Dossier →
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Master Portfolio Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPortfolio.map((item) => (
              <div
                key={item.id}
                className="group relative rounded-xs border border-[#222] hover:border-neutral-500 bg-[#101010] overflow-hidden flex flex-col transition-all duration-300"
              >
                {/* Image Container */}
                <div
                  className="relative h-64 bg-black overflow-hidden cursor-pointer"
                  onClick={() => setLightboxItem(item)}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Badges Overlay */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 bg-black/70 backdrop-blur-xs text-[10px] font-mono text-neutral-200 rounded-xs border border-white/10 uppercase">
                      {item.category}
                    </span>
                    {item.year && (
                      <span className="px-1.5 py-0.5 bg-black/70 backdrop-blur-xs text-[10px] font-mono text-neutral-400 rounded-xs">
                        {item.year}
                      </span>
                    )}
                  </div>

                  {item.featured && (
                    <div className="absolute top-2.5 right-2.5 p-1.5 bg-amber-400 text-black rounded-xs shadow-md">
                      <Star className="w-3 h-3 fill-black" />
                    </div>
                  )}

                  {/* Hover Inspect Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-3 py-1.5 bg-black/80 text-white text-xs font-mono rounded-xs border border-white/20 uppercase tracking-wider">
                      Inspect Work
                    </span>
                  </div>
                </div>

                {/* Card Meta Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3
                      className="text-sm font-serif text-white hover:text-amber-400 transition-colors font-medium cursor-pointer"
                      onClick={() => setLightboxItem(item)}
                    >
                      {item.title}
                    </h3>
                    {item.client && (
                      <p className="text-[11px] font-mono text-neutral-400 mt-0.5">
                        {item.client}
                      </p>
                    )}
                    <p className="text-xs text-neutral-400 font-sans mt-2 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Tags */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {item.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-[#181818] text-[10px] font-mono text-neutral-400 rounded-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                      {item.tags.length > 3 && (
                        <span className="text-[10px] font-mono text-neutral-500 self-center">
                          +{item.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Card Bottom Actions */}
                  <div className="pt-3 border-t border-[#1C1C1C] flex items-center justify-between">
                    <button
                      onClick={() => togglePortfolioFeatured(item.id)}
                      className={`text-[11px] font-mono flex items-center gap-1 transition-colors cursor-pointer ${
                        item.featured ? 'text-amber-400' : 'text-neutral-500 hover:text-neutral-300'
                      }`}
                    >
                      <Star className={`w-3 h-3 ${item.featured ? 'fill-amber-400' : ''}`} />
                      {item.featured ? 'Featured' : 'Feature'}
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingPortfolioItem(item);
                          setIsPortfolioModalOpen(true);
                        }}
                        className="p-1.5 text-neutral-400 hover:text-white hover:bg-[#222] rounded-xs transition-colors cursor-pointer"
                        title="Edit project"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Remove "${item.title}" from portfolio?`)) {
                            deletePortfolioItem(item.id);
                            showToast(`Removed "${item.title}" from portfolio`);
                          }
                        }}
                        className="p-1.5 text-neutral-400 hover:text-red-400 hover:bg-red-950/30 rounded-xs transition-colors cursor-pointer"
                        title="Delete project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Empty State / Add Card */}
            <div
              onClick={() => {
                setEditingPortfolioItem(null);
                setIsPortfolioModalOpen(true);
              }}
              className="rounded-xs border-2 border-dashed border-[#262626] hover:border-amber-500/50 hover:bg-amber-500/5 transition-all p-8 flex flex-col items-center justify-center text-center cursor-pointer min-h-[300px]"
            >
              <div className="w-12 h-12 rounded-full bg-[#181818] border border-[#2B2B2B] flex items-center justify-center text-amber-400 mb-3">
                <Plus className="w-6 h-6" />
              </div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-white font-medium">
                Add New Portfolio Project
              </h4>
              <p className="text-[11px] text-neutral-500 max-w-xs mt-1">
                Upload runway captures, editorial lookbooks, or atelier tailoring archives.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB B: ATELIER DOSSIER & STORY */}
      {activeTab === 'dossier' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Heritage Story & Bio (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Heritage Story */}
            <div className="p-6 bg-[#0E0E0E] border border-[#222] rounded-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Atelier Heritage & Brand Story
                </h3>
                <button
                  onClick={() => setIsEditProfileOpen(true)}
                  className="text-xs font-mono text-neutral-400 hover:text-white underline cursor-pointer"
                >
                  Edit Narrative
                </button>
              </div>
              <p className="text-xs sm:text-sm text-neutral-300 font-sans leading-relaxed whitespace-pre-line">
                {profile.brandStory}
              </p>
            </div>

            {/* Short Biography */}
            <div className="p-6 bg-[#0E0E0E] border border-[#222] rounded-xs space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-2">
                <User className="w-4 h-4" />
                Artisan Biography
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 font-sans leading-relaxed">
                {profile.biography}
              </p>
            </div>

            {/* Design Philosophy */}
            <div className="p-6 bg-[#0E0E0E] border border-[#222] rounded-xs space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Design Philosophy & Material Integrity
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 font-sans leading-relaxed">
                {profile.designPhilosophy}
              </p>
            </div>
          </div>

          {/* Right Column: Specialties & Awards (1 col) */}
          <div className="space-y-6">
            {/* Disciplines & Specialties */}
            <div className="p-6 bg-[#0E0E0E] border border-[#222] rounded-xs space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-wider text-white font-semibold flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                Atelier Specialties
              </h3>
              <div className="flex flex-wrap gap-2">
                {(profile.specialties || ['Bespoke Tailoring', 'Architectural Outerwear', 'Deconstruction']).map(
                  (spec, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-[#181818] border border-[#2A2A2A] text-xs font-mono text-neutral-300 rounded-xs"
                    >
                      {spec}
                    </span>
                  )
                )}
              </div>
            </div>

            {/* Awards & Honors */}
            <div className="p-6 bg-[#0E0E0E] border border-[#222] rounded-xs space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-wider text-white font-semibold flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                Accreditations & Honors
              </h3>
              <div className="space-y-2.5">
                {(profile.awards || ['British Fashion Council Artisan Grant', 'Savile Row Excellence']).map(
                  (award, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-[#141414] border border-[#222] rounded-xs text-xs font-mono text-neutral-200 flex items-center gap-2"
                    >
                      <Star className="w-3.5 h-3.5 text-amber-400 shrink-0 fill-amber-400" />
                      <span>{award}</span>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Verification Credentials Card */}
            <div className="p-5 bg-gradient-to-br from-[#121212] to-amber-950/20 border border-amber-500/30 rounded-xs space-y-2">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-semibold">
                <ShieldCheck className="w-4 h-4" />
                Verified DANIELS Creator Status
              </div>
              <p className="text-[11px] text-neutral-400 font-sans leading-relaxed">
                Certified for made-to-measure bespoke order reception, custom pattern approval, and client anatomical measurements handling.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB C: STUDIO COORDINATES & CONTACT */}
      {activeTab === 'studio' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Physical Location Card */}
          <div className="p-6 bg-[#0E0E0E] border border-[#222] rounded-xs space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Physical Studio & Showroom
              </h3>
              <span className="px-2 py-0.5 bg-neutral-800 text-[10px] font-mono text-neutral-300 rounded-xs">
                By Appointment Only
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-4 bg-[#141414] border border-[#242424] rounded-xs space-y-1">
                <span className="text-[10px] text-neutral-500 uppercase block">Atelier Address</span>
                <p className="text-white text-sm font-semibold">{profile.studioLocation.address}</p>
                <p className="text-neutral-300">
                  {profile.studioLocation.city}, {profile.studioLocation.postalCode || ''}
                </p>
                <p className="text-neutral-400">{profile.studioLocation.country}</p>
              </div>

              {profile.studioLocation.coordinates && (
                <div className="flex items-center justify-between p-3 bg-[#141414] border border-[#242424] rounded-xs">
                  <span className="text-neutral-500">GPS Coordinates:</span>
                  <span className="text-amber-400">{profile.studioLocation.coordinates}</span>
                </div>
              )}
            </div>

            {/* Stylized Simulated Map Widget */}
            <div className="h-44 w-full rounded-xs border border-[#2B2B2B] bg-[#0A0A0A] relative overflow-hidden flex items-center justify-center">
              {/* Grid Lines */}
              <div
                className="absolute inset-0 opacity-15"
                style={{
                  backgroundImage:
                    'radial-gradient(circle, #F59E0B 1px, transparent 1px), linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                }}
              />
              <div className="relative text-center space-y-2 z-10">
                <div className="w-8 h-8 rounded-full bg-amber-400 text-black mx-auto flex items-center justify-center font-bold text-xs shadow-lg shadow-amber-400/40 animate-pulse">
                  <MapPin className="w-4 h-4" />
                </div>
                <p className="text-xs font-mono text-white font-medium">Savile Row Bespoke Quarter</p>
                <p className="text-[10px] font-mono text-neutral-400">London W1S, United Kingdom</p>
              </div>
            </div>
          </div>

          {/* Contact & Consultation Schedule */}
          <div className="p-6 bg-[#0E0E0E] border border-[#222] rounded-xs space-y-5">
            <h3 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Consultation & Client Liaison
            </h3>

            <div className="space-y-4 text-xs font-mono">
              <div className="p-4 bg-[#141414] border border-[#242424] rounded-xs space-y-2">
                <span className="text-[10px] text-neutral-500 uppercase block">Operating Hours</span>
                <p className="text-white text-sm font-semibold">{profile.workingHours}</p>
                <p className="text-[11px] text-neutral-400 font-sans">
                  Private basted fitting sessions reserved on Tuesdays & Thursdays.
                </p>
              </div>

              <div className="p-4 bg-[#141414] border border-[#242424] rounded-xs space-y-3">
                <span className="text-[10px] text-neutral-500 uppercase block">Direct Communications</span>

                <div className="flex items-center justify-between text-neutral-300">
                  <span className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-amber-400" />
                    Atelier Email:
                  </span>
                  <a
                    href={`mailto:${profile.contactEmail}`}
                    className="text-white hover:text-amber-400 transition-colors"
                  >
                    {profile.contactEmail}
                  </a>
                </div>

                <div className="flex items-center justify-between text-neutral-300">
                  <span className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-amber-400" />
                    Telephone:
                  </span>
                  <a
                    href={`tel:${profile.phone}`}
                    className="text-white hover:text-amber-400 transition-colors"
                  >
                    {profile.phone}
                  </a>
                </div>
              </div>

              {/* Social Channels List */}
              <div className="p-4 bg-[#141414] border border-[#242424] rounded-xs space-y-2">
                <span className="text-[10px] text-neutral-500 uppercase block">Verified Channels</span>
                <div className="space-y-1.5 text-[11px]">
                  {profile.socialLinks.instagram && (
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-400 flex items-center gap-1.5">
                        <Instagram className="w-3.5 h-3.5 text-pink-400" /> Instagram:
                      </span>
                      <a
                        href={profile.socialLinks.instagram}
                        target="_blank"
                        rel="noreferrer"
                        className="text-white hover:text-amber-400 underline"
                      >
                        {profile.socialLinks.instagram}
                      </a>
                    </div>
                  )}

                  {profile.socialLinks.website && (
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-400 flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-blue-400" /> Website:
                      </span>
                      <a
                        href={profile.socialLinks.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-white hover:text-amber-400 underline"
                      >
                        {profile.socialLinks.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB D: BRAND ASSETS & SEALS */}
      {activeTab === 'brand_kit' && (
        <div className="space-y-6">
          <div className="p-6 bg-[#0E0E0E] border border-[#222] rounded-xs space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-2">
              <Award className="w-4 h-4" />
              Atelier Brand Identity Kit & Seals
            </h3>
            <p className="text-xs text-neutral-400 font-sans">
              High-resolution visual identity components used across garment packaging, authenticity certificates, and customer invoice headers.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-3">
              {/* Crest Logo */}
              <div className="p-4 bg-[#141414] border border-[#242424] rounded-xs space-y-3">
                <span className="text-[10px] font-mono text-neutral-500 uppercase block">
                  Official Atelier Crest (1:1)
                </span>
                <div className="h-32 bg-black rounded-xs border border-[#2B2B2B] overflow-hidden flex items-center justify-center p-2">
                  <img
                    src={profile.logoUrl}
                    alt="Logo asset"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-neutral-400">800x800 PNG</span>
                  <a
                    href={profile.logoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-amber-400 hover:underline flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" /> View Asset
                  </a>
                </div>
              </div>

              {/* Cover Banner Asset */}
              <div className="p-4 bg-[#141414] border border-[#242424] rounded-xs space-y-3">
                <span className="text-[10px] font-mono text-neutral-500 uppercase block">
                  Storefront Banner (3:1)
                </span>
                <div className="h-32 bg-black rounded-xs border border-[#2B2B2B] overflow-hidden">
                  <img
                    src={profile.coverImageUrl}
                    alt="Cover asset"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-neutral-400">1600x533 WebP</span>
                  <a
                    href={profile.coverImageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-amber-400 hover:underline flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" /> View Asset
                  </a>
                </div>
              </div>

              {/* Designer Avatar */}
              <div className="p-4 bg-[#141414] border border-[#242424] rounded-xs space-y-3">
                <span className="text-[10px] font-mono text-neutral-500 uppercase block">
                  Artisan Portrait (1:1)
                </span>
                <div className="h-32 bg-black rounded-xs border border-[#2B2B2B] overflow-hidden flex items-center justify-center">
                  <img
                    src={profile.avatarUrl}
                    alt="Portrait asset"
                    className="h-24 w-24 rounded-full object-cover border border-[#333]"
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-neutral-400">400x400 JPG</span>
                  <a
                    href={profile.avatarUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-amber-400 hover:underline flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" /> View Asset
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. MODALS INTEGRATION */}

      {/* Edit Profile Master Modal */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        profile={profile}
        onSave={(updated) => {
          updateProfile(updated);
          showToast('Atelier profile updated successfully');
        }}
      />

      {/* Add / Edit Portfolio Item Modal */}
      <PortfolioManageModal
        isOpen={isPortfolioModalOpen}
        onClose={() => {
          setIsPortfolioModalOpen(false);
          setEditingPortfolioItem(null);
        }}
        initialItem={editingPortfolioItem}
        onSave={(itemData) => {
          if (editingPortfolioItem) {
            updatePortfolioItem(editingPortfolioItem.id, itemData);
            showToast(`Updated "${itemData.title}"`);
          } else {
            addPortfolioItem({
              id: `port_${Date.now()}`,
              title: itemData.title || 'Untitled Portfolio Work',
              category: (itemData.category as PortfolioCategory) || 'Runway',
              description: itemData.description || '',
              imageUrl: itemData.imageUrl || '',
              year: itemData.year || new Date().getFullYear().toString(),
              client: itemData.client,
              featured: itemData.featured || false,
              tags: itemData.tags || [],
              aspectRatio: 'portrait',
              createdAt: new Date().toISOString(),
            });
            showToast(`Published "${itemData.title}" to portfolio`);
          }
        }}
      />

      {/* High-Resolution Portfolio Lightbox */}
      <PortfolioLightboxModal
        item={lightboxItem}
        onClose={() => setLightboxItem(null)}
        onEdit={(item) => {
          setEditingPortfolioItem(item);
          setIsPortfolioModalOpen(true);
        }}
        onDelete={(id) => {
          deletePortfolioItem(id);
          showToast('Portfolio project removed');
        }}
        onToggleFeatured={(id) => {
          togglePortfolioFeatured(id);
          if (lightboxItem && lightboxItem.id === id) {
            setLightboxItem({ ...lightboxItem, featured: !lightboxItem.featured });
          }
          showToast('Featured status updated');
        }}
      />

      {/* Quick Direct Asset Upload Modal */}
      <ImageUploadModal
        isOpen={quickImageUploader.isOpen}
        onClose={() => setQuickImageUploader((prev) => ({ ...prev, isOpen: false }))}
        onSelectImage={handleApplyQuickImage}
        title={quickImageUploader.title}
        currentImageUrl={profile[quickImageUploader.type]}
        aspectRatioHint={quickImageUploader.aspectRatio}
        category={
          quickImageUploader.type === 'logoUrl'
            ? 'logo'
            : quickImageUploader.type === 'coverImageUrl'
            ? 'cover'
            : 'avatar'
        }
      />
    </div>
  );
};
