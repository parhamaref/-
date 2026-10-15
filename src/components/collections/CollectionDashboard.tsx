/**
 * @file CollectionDashboard.tsx
 * Atelier Designer Collection Management Dashboard.
 *
 * Allows designers to:
 * - Create seasonal collections (Spring, Summer, Autumn, Winter, Bridal, Luxury)
 * - Upload/configure Collection Cover & Hero Banner
 * - Write & edit the Collection Story & Muse inspiration
 * - Curate Collection Products with pricing & silhouettes
 * - Manage Collection Visibility (Public, Private VIP, Archived, Coming Soon)
 * - Toggle Featured Spotlight status for runway showcase
 * - Filter and manage seasonal catalogs
 */

import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  Search,
  Filter,
  Eye,
  Edit3,
  Trash2,
  CheckCircle2,
  Star,
  Globe,
  Lock,
  Archive,
  Clock,
  Layers,
  Palette,
  X,
  Upload,
  RotateCcw,
  ExternalLink,
  ChevronRight,
  Tag,
} from 'lucide-react';
import { useCollectionStore } from '../../stores/collectionStore';
import {
  SeasonalCollection,
  SeasonCategory,
  CollectionVisibility,
  CreateCollectionPayload,
  CollectionProductItem,
} from '../../types/collection.types';

const SEASON_OPTIONS: SeasonCategory[] = [
  'Spring',
  'Summer',
  'Autumn',
  'Winter',
  'Bridal',
  'Luxury',
];

const VISIBILITY_CONFIG: Record<
  CollectionVisibility,
  { label: string; icon: React.ComponentType<{ className?: string }>; color: string; border: string }
> = {
  PUBLIC: { label: 'Public Lookbook', icon: Globe, color: 'text-emerald-400 bg-emerald-500/10', border: 'border-emerald-500/30' },
  PRIVATE_VIP: { label: 'Private Salon VIP', icon: Lock, color: 'text-amber-400 bg-amber-500/10', border: 'border-amber-500/30' },
  COMING_SOON: { label: 'Runway Teaser', icon: Clock, color: 'text-purple-400 bg-purple-500/10', border: 'border-purple-500/30' },
  ARCHIVED: { label: 'Archived Vault', icon: Archive, color: 'text-neutral-400 bg-neutral-800', border: 'border-neutral-700' },
};

const SAMPLE_COVERS: Record<SeasonCategory, string> = {
  Spring: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=80',
  Summer: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
  Autumn: 'https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=1200&q=80',
  Winter: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80',
  Bridal: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
  Luxury: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80',
};

export const CollectionDashboard: React.FC<{ onPreviewCollection?: (col: SeasonalCollection) => void }> = ({
  onPreviewCollection,
}) => {
  const {
    filteredCollections,
    countsBySeason,
    filters,
    setSeasonFilter,
    setVisibilityFilter,
    setFeaturedOnly,
    setSearchQuery,
    setSortBy,
    createCollection,
    updateCollection,
    toggleFeatured,
    updateVisibility,
    deleteCollection,
    resetToDefaultMock,
    isLoading,
  } = useCollectionStore();

  // Create / Edit modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<SeasonalCollection | null>(null);

  // Form state
  const [formSeason, setFormSeason] = useState<SeasonCategory>('Spring');
  const [formTitle, setFormTitle] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formYear, setFormYear] = useState<number>(2026);
  const [formSeasonCode, setFormSeasonCode] = useState('SS26');
  const [formCoverUrl, setFormCoverUrl] = useState(SAMPLE_COVERS.Spring);
  const [formStory, setFormStory] = useState('');
  const [formMuse, setFormMuse] = useState('');
  const [formVisibility, setFormVisibility] = useState<CollectionVisibility>('PUBLIC');
  const [formIsFeatured, setFormIsFeatured] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const openCreateModal = () => {
    setEditingCollection(null);
    setFormSeason('Spring');
    setFormTitle('Spring Vernal Botanical 2026');
    setFormSubtitle('High-Twist Tropical Worsteds & Botanical Jacquards');
    setFormYear(2026);
    setFormSeasonCode('SS26');
    setFormCoverUrl(SAMPLE_COVERS.Spring);
    setFormStory('Inspired by British architectural lines softened by Italian fluid drape, incorporating ultra-breathable high-twist fresco cloths.');
    setFormMuse('Kew Royal Herbarium at dawn and mid-century diplomat wardrobes.');
    setFormVisibility('PUBLIC');
    setFormIsFeatured(true);
    setIsCreateModalOpen(true);
  };

  const openEditModal = (col: SeasonalCollection) => {
    setEditingCollection(col);
    setFormSeason(col.season);
    setFormTitle(col.title);
    setFormSubtitle(col.subtitle);
    setFormYear(col.year);
    setFormSeasonCode(col.seasonCode);
    setFormCoverUrl(col.coverImageUrl);
    setFormStory(col.storyNarrative);
    setFormMuse(col.museInspiration);
    setFormVisibility(col.visibility);
    setFormIsFeatured(col.isFeatured);
    setIsCreateModalOpen(true);
  };

  const handleSaveCollection = async () => {
    if (!formTitle.trim()) {
      alert('Please enter a collection title.');
      return;
    }

    try {
      if (editingCollection) {
        await updateCollection({
          id: editingCollection.id,
          title: formTitle,
          subtitle: formSubtitle,
          season: formSeason,
          year: formYear,
          seasonCode: formSeasonCode,
          coverImageUrl: formCoverUrl,
          storyNarrative: formStory,
          museInspiration: formMuse,
          visibility: formVisibility,
          isFeatured: formIsFeatured,
        });
        showToast(`Collection "${formTitle}" updated successfully!`);
      } else {
        await createCollection({
          title: formTitle,
          subtitle: formSubtitle,
          season: formSeason,
          year: formYear,
          seasonCode: formSeasonCode,
          coverImageUrl: formCoverUrl,
          storyNarrative: formStory,
          museInspiration: formMuse,
          visibility: formVisibility,
          isFeatured: formIsFeatured,
          products: [
            {
              id: `prod_${Date.now()}_1`,
              name: `${formTitle} Flagship Suit`,
              category: 'Suits',
              price: 4500,
              currency: 'GBP',
              imageUrl: formCoverUrl,
              primaryFabric: 'Loro Piana Super 160s Worsted',
              silhouette: 'Single-Breasted 2-Button Peak Lapel',
              isHeroPiece: true,
              shortDescription: 'Signature silhouette tailored for the seasonal collection.',
            },
          ],
        });
        showToast(`New collection "${formTitle}" created!`);
      }
      setIsCreateModalOpen(false);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error saving collection');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete collection "${name}"?`)) {
      await deleteCollection(id);
      showToast(`Collection "${name}" deleted.`);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn font-mono text-left">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="bg-emerald-950/90 border border-emerald-500/50 text-emerald-200 px-4 py-2.5 rounded-xl text-xs flex items-center justify-between animate-fadeIn">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {toastMessage}
          </span>
          <button onClick={() => setToastMessage(null)} className="text-emerald-400">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0F0F0F] p-6 rounded-2xl border border-[#222]">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-4 h-4" />
            Atelier Seasonal Lookbooks & Catalogs
          </div>
          <h2 className="font-serif text-2xl font-bold text-white uppercase tracking-wider">
            Seasonal Collection Management
          </h2>
          <p className="text-xs text-neutral-400 font-sans">
            Author and publish Spring, Summer, Autumn, Winter, Bridal, and Luxury collections with covers, stories, and curated products.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => resetToDefaultMock()}
            className="px-3 py-2 rounded-lg border border-[#333] hover:bg-neutral-800 text-neutral-400 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Reset Mock Collections"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Data
          </button>

          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-950"
          >
            <Plus className="w-4 h-4" />
            + Create Seasonal Collection
          </button>
        </div>
      </div>

      {/* Seasonal Quick Filter Counts */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {SEASON_OPTIONS.map((season) => (
          <button
            key={season}
            onClick={() => setSeasonFilter(filters.season === season ? 'ALL' : season)}
            className={`p-3.5 rounded-xl border text-xs text-left transition-all cursor-pointer ${
              filters.season === season
                ? 'bg-amber-500/15 border-amber-500/60 shadow-md'
                : 'bg-[#111111] border-[#222] hover:border-[#333]'
            }`}
          >
            <span className="text-[10px] text-neutral-400 uppercase font-bold block">{season}</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="font-serif text-lg font-bold text-white">
                {countsBySeason[season] || 0}
              </span>
              <span className="text-[10px] text-neutral-500">Curated</span>
            </div>
          </button>
        ))}
      </div>

      {/* Search and Secondary Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#121212] p-4 rounded-xl border border-[#222]">
        {/* Left: Search input */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.searchQuery || ''}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, story, fabric..."
            className="w-full bg-[#181818] border border-[#2B2B2B] focus:border-amber-500 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white outline-none"
          />
        </div>

        {/* Right: Toggles & Visibility */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Featured Filter */}
          <button
            onClick={() => setFeaturedOnly(!filters.featuredOnly)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border transition-colors cursor-pointer flex items-center gap-1.5 ${
              filters.featuredOnly
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            Featured Spotlight Only
          </button>

          {/* Visibility Selector */}
          <select
            value={filters.visibility || 'ALL'}
            onChange={(e) => setVisibilityFilter(e.target.value as any)}
            className="bg-[#181818] border border-[#2B2B2B] rounded-lg px-3 py-1.5 text-xs text-neutral-300 outline-none cursor-pointer"
          >
            <option value="ALL">All Visibility States</option>
            <option value="PUBLIC">Public Lookbooks</option>
            <option value="PRIVATE_VIP">Private Salon VIP</option>
            <option value="COMING_SOON">Runway Teasers</option>
            <option value="ARCHIVED">Archived</option>
          </select>

          {/* Sort Selector */}
          <select
            value={filters.sortBy || 'NEWEST'}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-[#181818] border border-[#2B2B2B] rounded-lg px-3 py-1.5 text-xs text-neutral-300 outline-none cursor-pointer"
          >
            <option value="NEWEST">Sort: Newest First</option>
            <option value="FEATURED_FIRST">Sort: Featured Priority</option>
            <option value="PRODUCT_COUNT">Sort: Most Garments</option>
            <option value="ALPHABETICAL">Sort: Alphabetical (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Collections Grid */}
      {filteredCollections.length === 0 ? (
        <div className="p-12 text-center bg-[#0D0D0D] border border-[#222] rounded-2xl space-y-3">
          <p className="text-neutral-400 text-sm">No seasonal collections found matching criteria.</p>
          <button
            onClick={() => {
              setSeasonFilter('ALL');
              setVisibilityFilter('ALL');
              setFeaturedOnly(false);
              setSearchQuery('');
            }}
            className="text-xs text-amber-400 hover:underline uppercase font-bold cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCollections.map((col) => {
            const vis = VISIBILITY_CONFIG[col.visibility];
            const VisIcon = vis.icon;

            return (
              <div
                key={col.id}
                className={`bg-[#0D0D0D] border rounded-2xl overflow-hidden shadow-xl transition-all hover:border-amber-500/50 flex flex-col justify-between ${
                  col.isFeatured ? 'border-amber-500/40 ring-1 ring-amber-500/20' : 'border-[#222]'
                }`}
              >
                <div>
                  {/* Cover Image Banner */}
                  <div className="aspect-[16/10] bg-black relative overflow-hidden group">
                    <img
                      src={col.coverImageUrl}
                      alt={col.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                      <span className="px-2.5 py-1 bg-black/80 backdrop-blur-md border border-white/20 rounded-md text-[10px] text-white font-bold uppercase tracking-wider">
                        {col.season} · {col.seasonCode}
                      </span>

                      {/* Featured Star */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFeatured(col.id, !col.isFeatured);
                        }}
                        className={`pointer-events-auto p-1.5 rounded-md backdrop-blur-md border transition-colors cursor-pointer ${
                          col.isFeatured
                            ? 'bg-amber-500 text-black border-amber-400 shadow-md'
                            : 'bg-black/70 text-neutral-400 hover:text-white border-white/20'
                        }`}
                        title={col.isFeatured ? 'Featured Spotlight Active' : 'Set as Featured'}
                      >
                        <Star className="w-3.5 h-3.5 fill-current" />
                      </button>
                    </div>

                    {/* Bottom Info Overlay */}
                    <div className="absolute bottom-2 left-2 right-2 p-2 bg-black/85 backdrop-blur-md rounded-lg border border-white/10 flex items-center justify-between text-[10px]">
                      <span className="text-neutral-300 font-bold">{col.productCount} Garments Curated</span>
                      <span className={`px-2 py-0.5 rounded flex items-center gap-1 font-bold uppercase ${vis.color} border ${vis.border}`}>
                        <VisIcon className="w-3 h-3" />
                        {vis.label}
                      </span>
                    </div>
                  </div>

                  {/* Body Details */}
                  <div className="p-5 space-y-3">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-white uppercase tracking-wider">
                        {col.title}
                      </h3>
                      <p className="text-xs text-neutral-400 line-clamp-1">{col.subtitle}</p>
                    </div>

                    {/* Story Narrative Excerpt */}
                    <p className="text-neutral-300 text-xs line-clamp-2 leading-relaxed bg-[#141414] p-3 rounded-lg border border-[#222] font-sans">
                      "{col.storyNarrative}"
                    </p>

                    {/* Palette Swatches */}
                    {col.colorPalette && col.colorPalette.length > 0 && (
                      <div className="flex items-center gap-1.5 pt-1">
                        <span className="text-[9px] text-neutral-500 uppercase font-bold mr-1">
                          Palette:
                        </span>
                        {col.colorPalette.slice(0, 4).map((c, i) => (
                          <div
                            key={i}
                            className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                            style={{ backgroundColor: c.hex }}
                            title={`${c.name} (${c.hex})`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 bg-[#111111] border-t border-[#1E1E1E] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(col)}
                      className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-md transition-colors cursor-pointer"
                      title="Edit Collection Story & Cover"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(col.id, col.title)}
                      className="p-1.5 text-neutral-500 hover:text-red-400 hover:bg-neutral-800 rounded-md transition-colors cursor-pointer"
                      title="Delete Collection"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onPreviewCollection?.(col)}
                      className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Lookbook Preview
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* CREATE / EDIT COLLECTION MODAL */}
      {/* ========================================================================= */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#0F0F0F] border border-[#2B2B2B] rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl font-mono text-left">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#222] bg-[#141414] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest block">
                    ATELIER CATALOG EDITOR
                  </span>
                  <h3 className="font-serif text-lg font-bold text-white uppercase">
                    {editingCollection ? `Edit Collection: ${editingCollection.title}` : 'Create New Seasonal Collection'}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-neutral-400 hover:text-white p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Fields */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
              {/* Season Category & Year */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-neutral-400 font-bold uppercase text-[10px] block">
                    Season Category *
                  </label>
                  <select
                    value={formSeason}
                    onChange={(e) => {
                      const s = e.target.value as SeasonCategory;
                      setFormSeason(s);
                      if (!editingCollection) {
                        setFormCoverUrl(SAMPLE_COVERS[s]);
                      }
                    }}
                    className="w-full bg-[#161616] border border-[#2B2B2B] focus:border-amber-500 rounded-lg p-2.5 text-xs text-white outline-none cursor-pointer"
                  >
                    {SEASON_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s} Collection
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-400 font-bold uppercase text-[10px] block">
                    Year *
                  </label>
                  <input
                    type="number"
                    value={formYear}
                    onChange={(e) => setFormYear(Number(e.target.value))}
                    className="w-full bg-[#161616] border border-[#2B2B2B] focus:border-amber-500 rounded-lg p-2 text-xs text-white outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-400 font-bold uppercase text-[10px] block">
                    Season Code (e.g. SS26) *
                  </label>
                  <input
                    type="text"
                    value={formSeasonCode}
                    onChange={(e) => setFormSeasonCode(e.target.value)}
                    className="w-full bg-[#161616] border border-[#2B2B2B] focus:border-amber-500 rounded-lg p-2 text-xs text-white outline-none"
                    placeholder="SS26"
                  />
                </div>
              </div>

              {/* Title and Subtitle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-neutral-400 font-bold uppercase text-[10px] block">
                    Collection Title *
                  </label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full bg-[#161616] border border-[#2B2B2B] focus:border-amber-500 rounded-lg p-2.5 text-xs text-white outline-none font-serif"
                    placeholder="e.g. Spring Vernal Equinox"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-400 font-bold uppercase text-[10px] block">
                    Editorial Subtitle
                  </label>
                  <input
                    type="text"
                    value={formSubtitle}
                    onChange={(e) => setFormSubtitle(e.target.value)}
                    className="w-full bg-[#161616] border border-[#2B2B2B] focus:border-amber-500 rounded-lg p-2.5 text-xs text-white outline-none"
                    placeholder="e.g. High-Twist Worsteds & Botanical Silks"
                  />
                </div>
              </div>

              {/* Cover Image URL */}
              <div className="space-y-1">
                <label className="text-neutral-400 font-bold uppercase text-[10px] block">
                  Collection Cover Photography URL *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formCoverUrl}
                    onChange={(e) => setFormCoverUrl(e.target.value)}
                    className="flex-1 bg-[#161616] border border-[#2B2B2B] focus:border-amber-500 rounded-lg p-2 text-xs text-white outline-none"
                    placeholder="https://..."
                  />
                  <button
                    type="button"
                    onClick={() => setFormCoverUrl(SAMPLE_COVERS[formSeason])}
                    className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg text-[10px] uppercase font-bold"
                  >
                    Preset
                  </button>
                </div>
              </div>

              {/* Story Narrative */}
              <div className="space-y-1">
                <label className="text-neutral-400 font-bold uppercase text-[10px] block">
                  Collection Story & Creative Director Narrative *
                </label>
                <textarea
                  value={formStory}
                  onChange={(e) => setFormStory(e.target.value)}
                  rows={4}
                  className="w-full bg-[#161616] border border-[#2B2B2B] focus:border-amber-500 rounded-lg p-2.5 text-xs text-white outline-none font-sans leading-relaxed"
                  placeholder="Describe the editorial concept, silhouette philosophy, and seasonal context..."
                />
              </div>

              {/* Muse Inspiration */}
              <div className="space-y-1">
                <label className="text-neutral-400 font-bold uppercase text-[10px] block">
                  Muse & Climate Inspiration
                </label>
                <input
                  type="text"
                  value={formMuse}
                  onChange={(e) => setFormMuse(e.target.value)}
                  className="w-full bg-[#161616] border border-[#2B2B2B] focus:border-amber-500 rounded-lg p-2 text-xs text-white outline-none"
                  placeholder="e.g. Savile Row archives in fog, Mediterranean yachting decks..."
                />
              </div>

              {/* Visibility and Featured Spotlight */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#222]">
                <div className="space-y-1">
                  <label className="text-neutral-400 font-bold uppercase text-[10px] block">
                    Collection Visibility
                  </label>
                  <select
                    value={formVisibility}
                    onChange={(e) => setFormVisibility(e.target.value as CollectionVisibility)}
                    className="w-full bg-[#161616] border border-[#2B2B2B] focus:border-amber-500 rounded-lg p-2 text-xs text-white outline-none cursor-pointer"
                  >
                    <option value="PUBLIC">PUBLIC — Visible to All Clients</option>
                    <option value="PRIVATE_VIP">PRIVATE_VIP — Private Salon Invite Only</option>
                    <option value="COMING_SOON">COMING_SOON — Runway Teaser Mode</option>
                    <option value="ARCHIVED">ARCHIVED — Hidden in Historical Vault</option>
                  </select>
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <label className="flex items-center gap-2 cursor-pointer text-neutral-300 font-bold">
                    <input
                      type="checkbox"
                      checked={formIsFeatured}
                      onChange={(e) => setFormIsFeatured(e.target.checked)}
                      className="accent-amber-500 w-4 h-4 rounded"
                    />
                    <span>Flagship Featured Spotlight</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 bg-[#141414] border-t border-[#222] flex items-center justify-end gap-3 shrink-0">
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-[#333] hover:bg-neutral-800 text-neutral-300 text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCollection}
                disabled={isLoading}
                className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-950"
              >
                <CheckCircle2 className="w-4 h-4" />
                {editingCollection ? 'Update Collection' : 'Create & Publish'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
