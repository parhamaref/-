/**
 * @file EditProfileModal.tsx
 * Multi-section modal for comprehensive designer profile management:
 * Brand Identity, Heritage Story, Visual Assets (Logo/Cover/Avatar), Studio Coordinates & Social/Web Links.
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Upload,
  Check,
  Building,
  User,
  BookOpen,
  MapPin,
  Globe,
  Camera,
  AlertCircle,
  Save,
  Clock,
  Mail,
  Phone,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { DesignerProfile } from '../../../types/designer.types';
import { validateDesignerProfile } from '../../../utils/designerProfileValidators';
import { ImageUploadModal } from './ImageUploadModal';

export interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: DesignerProfile;
  onSave: (updated: Partial<DesignerProfile>) => void;
}

type TabKey = 'brand' | 'story' | 'visuals' | 'studio' | 'links';

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('brand');
  const [formData, setFormData] = useState<DesignerProfile>({ ...profile });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState(false);

  // Nested image upload modal state
  const [imageModalConfig, setImageModalConfig] = useState<{
    isOpen: boolean;
    field: 'logoUrl' | 'coverImageUrl' | 'avatarUrl';
    title: string;
    aspectRatio: '1:1' | '16:9' | '3:1' | '4:5' | 'any';
  }>({
    isOpen: false,
    field: 'logoUrl',
    title: 'Upload Image',
    aspectRatio: '1:1',
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({ ...profile });
      setErrors({});
      setHasChanges(false);
    }
  }, [isOpen, profile]);

  if (!isOpen) return null;

  const handleChange = (field: keyof DesignerProfile, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
    if (errors[field as string]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field as string];
        return next;
      });
    }
  };

  const handleStudioChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      studioLocation: {
        ...prev.studioLocation,
        [field]: value,
      },
    }));
    setHasChanges(true);
    if (errors[`location_${field}`]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[`location_${field}`];
        return next;
      });
    }
  };

  const handleSocialChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [field]: value,
      },
    }));
    setHasChanges(true);
  };

  const handleOpenImageUploader = (
    field: 'logoUrl' | 'coverImageUrl' | 'avatarUrl',
    title: string,
    aspectRatio: '1:1' | '16:9' | '3:1' | '4:5' | 'any'
  ) => {
    setImageModalConfig({
      isOpen: true,
      field,
      title,
      aspectRatio,
    });
  };

  const handleApplyImage = (url: string) => {
    handleChange(imageModalConfig.field, url);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateDesignerProfile(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      // Auto switch to first tab with error
      if (validation.errors.brandName || validation.errors.designerName) {
        setActiveTab('brand');
      } else if (
        validation.errors.biography ||
        validation.errors.brandStory ||
        validation.errors.designPhilosophy
      ) {
        setActiveTab('story');
      } else if (
        validation.errors.logoUrl ||
        validation.errors.coverImageUrl ||
        validation.errors.avatarUrl
      ) {
        setActiveTab('visuals');
      } else if (
        Object.keys(validation.errors).some((k) => k.startsWith('location_')) ||
        validation.errors.contactEmail ||
        validation.errors.phone
      ) {
        setActiveTab('studio');
      }
      return;
    }

    onSave(formData);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
        <div className="relative w-full max-w-4xl bg-[#0E0E0E] border border-[#2B2B2B] rounded-xs shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
          {/* Header */}
          <div className="px-6 py-4 border-b border-[#222] flex items-center justify-between bg-[#141414]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xs bg-amber-400/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Building className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-mono uppercase tracking-wider text-white font-medium flex items-center gap-2">
                  Edit Designer & Brand Dossier
                  <span className="px-2 py-0.5 bg-amber-400/10 text-amber-400 text-[10px] font-mono rounded-xs border border-amber-500/30">
                    {formData.verificationStatus}
                  </span>
                </h3>
                <p className="text-[11px] text-neutral-400 font-sans">
                  Configure certified public atelier information, craft biography, and media assets.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white rounded-xs hover:bg-[#222] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="px-6 pt-3 bg-[#111] border-b border-[#222] flex items-center gap-2 overflow-x-auto no-scrollbar text-xs font-mono">
            <button
              type="button"
              onClick={() => setActiveTab('brand')}
              className={`px-3 py-2.5 border-b-2 font-medium transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === 'brand'
                  ? 'border-amber-400 text-amber-400 bg-amber-400/5'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              Brand & Designer
              {(errors.brandName || errors.designerName) && (
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('story')}
              className={`px-3 py-2.5 border-b-2 font-medium transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === 'story'
                  ? 'border-amber-400 text-amber-400 bg-amber-400/5'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Story & Philosophy
              {(errors.biography || errors.brandStory || errors.designPhilosophy) && (
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('visuals')}
              className={`px-3 py-2.5 border-b-2 font-medium transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === 'visuals'
                  ? 'border-amber-400 text-amber-400 bg-amber-400/5'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              Visual Assets (Logo / Cover)
              {(errors.logoUrl || errors.coverImageUrl || errors.avatarUrl) && (
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('studio')}
              className={`px-3 py-2.5 border-b-2 font-medium transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === 'studio'
                  ? 'border-amber-400 text-amber-400 bg-amber-400/5'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              Studio & Contact
              {(errors.contactEmail ||
                errors.phone ||
                Object.keys(errors).some((k) => k.startsWith('location_'))) && (
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('links')}
              className={`px-3 py-2.5 border-b-2 font-medium transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === 'links'
                  ? 'border-amber-400 text-amber-400 bg-amber-400/5'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              Social & Web Links
            </button>
          </div>

          {/* Body Content */}
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1">
            {Object.keys(errors).length > 0 && (
              <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-xs flex items-center gap-2.5 text-xs text-red-300">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>Please resolve the highlighted fields to save atelier updates.</span>
              </div>
            )}

            {/* TAB 1: BRAND & DESIGNER */}
            {activeTab === 'brand' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-neutral-300 mb-1.5">
                      Brand / Atelier Name *
                    </label>
                    <input
                      type="text"
                      value={formData.brandName}
                      onChange={(e) => handleChange('brandName', e.target.value)}
                      placeholder="e.g. DANIEL MAISON ATELIER"
                      className={`w-full px-3 py-2 bg-[#141414] border text-xs font-mono rounded-xs text-white focus:outline-none ${
                        errors.brandName ? 'border-red-500' : 'border-[#2B2B2B] focus:border-amber-400'
                      }`}
                    />
                    {errors.brandName && (
                      <p className="text-[10px] text-red-400 mt-1">{errors.brandName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-neutral-300 mb-1.5">
                      Lead Designer / Artisan Name *
                    </label>
                    <input
                      type="text"
                      value={formData.designerName}
                      onChange={(e) => handleChange('designerName', e.target.value)}
                      placeholder="e.g. Daniel’s Maison"
                      className={`w-full px-3 py-2 bg-[#141414] border text-xs font-mono rounded-xs text-white focus:outline-none ${
                        errors.designerName
                          ? 'border-red-500'
                          : 'border-[#2B2B2B] focus:border-amber-400'
                      }`}
                    />
                    {errors.designerName && (
                      <p className="text-[10px] text-red-400 mt-1">{errors.designerName}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-300 mb-1.5">
                    Brand Tagline / Atelier Manifesto
                  </label>
                  <input
                    type="text"
                    value={formData.tagline || ''}
                    onChange={(e) => handleChange('tagline', e.target.value)}
                    placeholder="e.g. Tactile architectural deconstructivism & bespoke tailoring."
                    className="w-full px-3 py-2 bg-[#141414] border border-[#2B2B2B] text-xs font-mono rounded-xs text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-neutral-300 mb-1.5">
                      Storefront Handle (Slug)
                    </label>
                    <div className="flex items-center">
                      <span className="px-3 py-2 bg-[#1C1C1C] border border-r-0 border-[#2B2B2B] text-neutral-500 text-xs font-mono rounded-l-xs">
                        /designer/
                      </span>
                      <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) =>
                          handleChange('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))
                        }
                        className="flex-1 px-3 py-2 bg-[#141414] border border-[#2B2B2B] text-xs font-mono rounded-r-xs text-white focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-neutral-300 mb-1.5">
                      Verification Status
                    </label>
                    <div className="px-3 py-2 bg-[#181818] border border-[#2B2B2B] text-xs font-mono rounded-xs flex items-center justify-between text-neutral-300">
                      <span className="flex items-center gap-1.5 text-amber-400">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        {formData.verificationStatus}
                      </span>
                      <span className="text-[10px] text-neutral-500">Tier 1 Certified Atelier</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: STORY & PHILOSOPHY */}
            {activeTab === 'story' && (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-mono uppercase text-neutral-300">
                      Short Biography *
                    </label>
                    <span className="text-[10px] font-mono text-neutral-500">
                      {(formData.biography || '').length}/1000
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={formData.biography}
                    onChange={(e) => handleChange('biography', e.target.value)}
                    placeholder="Short summary highlighting atelier heritage and focus..."
                    className={`w-full px-3 py-2 bg-[#141414] border text-xs font-sans rounded-xs text-white focus:outline-none leading-relaxed ${
                      errors.biography ? 'border-red-500' : 'border-[#2B2B2B] focus:border-amber-400'
                    }`}
                  />
                  {errors.biography && (
                    <p className="text-[10px] text-red-400 mt-1">{errors.biography}</p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-mono uppercase text-neutral-300">
                      Brand Story & Heritage *
                    </label>
                    <span className="text-[10px] font-mono text-neutral-500">
                      {(formData.brandStory || '').length}/2500
                    </span>
                  </div>
                  <textarea
                    rows={5}
                    value={formData.brandStory}
                    onChange={(e) => handleChange('brandStory', e.target.value)}
                    placeholder="Narrative tracing the founding vision, workshop traditions, and material choices..."
                    className={`w-full px-3 py-2 bg-[#141414] border text-xs font-sans rounded-xs text-white focus:outline-none leading-relaxed ${
                      errors.brandStory ? 'border-red-500' : 'border-[#2B2B2B] focus:border-amber-400'
                    }`}
                  />
                  {errors.brandStory && (
                    <p className="text-[10px] text-red-400 mt-1">{errors.brandStory}</p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-mono uppercase text-neutral-300">
                      Design Philosophy & Craftsmanship *
                    </label>
                    <span className="text-[10px] font-mono text-neutral-500">
                      {(formData.designPhilosophy || '').length}/1500
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    value={formData.designPhilosophy}
                    onChange={(e) => handleChange('designPhilosophy', e.target.value)}
                    placeholder="Ethos on silhouettes, fabric handling, tailoring precision, and zero-synthetic fillers..."
                    className={`w-full px-3 py-2 bg-[#141414] border text-xs font-sans rounded-xs text-white focus:outline-none leading-relaxed ${
                      errors.designPhilosophy
                        ? 'border-red-500'
                        : 'border-[#2B2B2B] focus:border-amber-400'
                    }`}
                  />
                  {errors.designPhilosophy && (
                    <p className="text-[10px] text-red-400 mt-1">{errors.designPhilosophy}</p>
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: VISUAL ASSETS */}
            {activeTab === 'visuals' && (
              <div className="space-y-6">
                {/* Cover Image */}
                <div className="p-4 bg-[#141414] border border-[#242424] rounded-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-mono uppercase text-white font-medium">
                        Atelier Cover Banner (Wide 16:9 / 3:1)
                      </h4>
                      <p className="text-[11px] text-neutral-400">
                        Appears as cinematic backdrop on your public designer storefront.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        handleOpenImageUploader(
                          'coverImageUrl',
                          'Change Cover Banner',
                          '3:1'
                        )
                      }
                      className="px-3 py-1.5 bg-[#222] hover:bg-[#2C2C2C] text-xs font-mono text-white rounded-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5 text-amber-400" />
                      Change Cover
                    </button>
                  </div>

                  <div className="h-32 w-full rounded-xs overflow-hidden border border-[#2B2B2B] relative bg-black">
                    <img
                      src={formData.coverImageUrl}
                      alt="Cover Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </div>
                </div>

                {/* Brand Logo & Avatar Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Brand Logo */}
                  <div className="p-4 bg-[#141414] border border-[#242424] rounded-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-mono uppercase text-white font-medium">
                        Brand Logo / Crest (1:1)
                      </h4>
                      <button
                        type="button"
                        onClick={() =>
                          handleOpenImageUploader('logoUrl', 'Upload Brand Logo', '1:1')
                        }
                        className="text-amber-400 hover:text-amber-300 text-xs font-mono underline cursor-pointer"
                      >
                        Change Logo
                      </button>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xs border border-[#2B2B2B] overflow-hidden bg-black shrink-0">
                        <img
                          src={formData.logoUrl}
                          alt="Logo Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-[11px] text-neutral-400">
                        Used on garment swing tags, certificate cards, and designer listing badges.
                      </div>
                    </div>
                  </div>

                  {/* Designer Avatar */}
                  <div className="p-4 bg-[#141414] border border-[#242424] rounded-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-mono uppercase text-white font-medium">
                        Head Artisan Portrait (1:1)
                      </h4>
                      <button
                        type="button"
                        onClick={() =>
                          handleOpenImageUploader('avatarUrl', 'Upload Designer Portrait', '1:1')
                        }
                        className="text-amber-400 hover:text-amber-300 text-xs font-mono underline cursor-pointer"
                      >
                        Change Avatar
                      </button>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full border border-[#2B2B2B] overflow-hidden bg-black shrink-0">
                        <img
                          src={formData.avatarUrl}
                          alt="Avatar Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-[11px] text-neutral-400">
                        Displayed beside client notes, bespoke chats, and signature approvals.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: STUDIO & CONTACT */}
            {activeTab === 'studio' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-neutral-300 mb-1.5 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-amber-400" />
                      Contact Email *
                    </label>
                    <input
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => handleChange('contactEmail', e.target.value)}
                      placeholder="atelier@danielmaison.com"
                      className={`w-full px-3 py-2 bg-[#141414] border text-xs font-mono rounded-xs text-white focus:outline-none ${
                        errors.contactEmail
                          ? 'border-red-500'
                          : 'border-[#2B2B2B] focus:border-amber-400'
                      }`}
                    />
                    {errors.contactEmail && (
                      <p className="text-[10px] text-red-400 mt-1">{errors.contactEmail}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-neutral-300 mb-1.5 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-amber-400" />
                      Studio Phone / Direct Line *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      placeholder="+44 20 7946 0888"
                      className={`w-full px-3 py-2 bg-[#141414] border text-xs font-mono rounded-xs text-white focus:outline-none ${
                        errors.phone ? 'border-red-500' : 'border-[#2B2B2B] focus:border-amber-400'
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-[10px] text-red-400 mt-1">{errors.phone}</p>
                    )}
                  </div>
                </div>

                {/* Studio Location */}
                <div className="p-4 bg-[#141414] border border-[#242424] rounded-xs space-y-3">
                  <h4 className="text-xs font-mono uppercase text-white font-medium flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    Physical Studio Address & Coordinates
                  </h4>

                  <div>
                    <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                      Street Address & Suite *
                    </label>
                    <input
                      type="text"
                      value={formData.studioLocation.address}
                      onChange={(e) => handleStudioChange('address', e.target.value)}
                      placeholder="14 Savile Row, Suite 3B"
                      className={`w-full px-3 py-2 bg-[#0E0E0E] border text-xs font-mono rounded-xs text-white focus:outline-none ${
                        errors.location_address
                          ? 'border-red-500'
                          : 'border-[#2B2B2B] focus:border-amber-400'
                      }`}
                    />
                    {errors.location_address && (
                      <p className="text-[10px] text-red-400 mt-1">{errors.location_address}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        value={formData.studioLocation.city}
                        onChange={(e) => handleStudioChange('city', e.target.value)}
                        placeholder="London"
                        className={`w-full px-3 py-2 bg-[#0E0E0E] border text-xs font-mono rounded-xs text-white focus:outline-none ${
                          errors.location_city
                            ? 'border-red-500'
                            : 'border-[#2B2B2B] focus:border-amber-400'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                        Country *
                      </label>
                      <input
                        type="text"
                        value={formData.studioLocation.country}
                        onChange={(e) => handleStudioChange('country', e.target.value)}
                        placeholder="United Kingdom"
                        className={`w-full px-3 py-2 bg-[#0E0E0E] border text-xs font-mono rounded-xs text-white focus:outline-none ${
                          errors.location_country
                            ? 'border-red-500'
                            : 'border-[#2B2B2B] focus:border-amber-400'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        value={formData.studioLocation.postalCode || ''}
                        onChange={(e) => handleStudioChange('postalCode', e.target.value)}
                        placeholder="W1S 3JN"
                        className="w-full px-3 py-2 bg-[#0E0E0E] border border-[#2B2B2B] text-xs font-mono rounded-xs text-white focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                        GPS Coordinates
                      </label>
                      <input
                        type="text"
                        value={formData.studioLocation.coordinates || ''}
                        onChange={(e) => handleStudioChange('coordinates', e.target.value)}
                        placeholder="51.5115° N, 0.1410° W"
                        className="w-full px-3 py-2 bg-[#0E0E0E] border border-[#2B2B2B] text-xs font-mono rounded-xs text-white focus:border-amber-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-neutral-400 mb-1 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-400" />
                        Working / Consultation Hours
                      </label>
                      <input
                        type="text"
                        value={formData.workingHours}
                        onChange={(e) => handleChange('workingHours', e.target.value)}
                        placeholder="Mon - Fri: 09:00 - 18:30 GMT"
                        className="w-full px-3 py-2 bg-[#0E0E0E] border border-[#2B2B2B] text-xs font-mono rounded-xs text-white focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: SOCIAL & WEB LINKS */}
            {activeTab === 'links' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-300 mb-1.5 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-amber-400" />
                    Official Website Link
                  </label>
                  <input
                    type="url"
                    value={formData.socialLinks?.website || ''}
                    onChange={(e) => handleSocialChange('website', e.target.value)}
                    placeholder="https://danielmaison.atelier"
                    className="w-full px-3 py-2 bg-[#141414] border border-[#2B2B2B] text-xs font-mono rounded-xs text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-neutral-300 mb-1.5">
                      Instagram Profile Link / Handle
                    </label>
                    <input
                      type="text"
                      value={formData.socialLinks?.instagram || ''}
                      onChange={(e) => handleSocialChange('instagram', e.target.value)}
                      placeholder="https://instagram.com/danielmaison.couture"
                      className="w-full px-3 py-2 bg-[#141414] border border-[#2B2B2B] text-xs font-mono rounded-xs text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-neutral-300 mb-1.5">
                      LinkedIn Company Page
                    </label>
                    <input
                      type="text"
                      value={formData.socialLinks?.linkedin || ''}
                      onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                      placeholder="https://linkedin.com/company/danielmaison"
                      className="w-full px-3 py-2 bg-[#141414] border border-[#2B2B2B] text-xs font-mono rounded-xs text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-neutral-300 mb-1.5">
                      X / Twitter Profile
                    </label>
                    <input
                      type="text"
                      value={formData.socialLinks?.twitter || ''}
                      onChange={(e) => handleSocialChange('twitter', e.target.value)}
                      placeholder="https://x.com/danielmaison"
                      className="w-full px-3 py-2 bg-[#141414] border border-[#2B2B2B] text-xs font-mono rounded-xs text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-neutral-300 mb-1.5">
                      Pinterest / Lookbook Board
                    </label>
                    <input
                      type="text"
                      value={formData.socialLinks?.pinterest || ''}
                      onChange={(e) => handleSocialChange('pinterest', e.target.value)}
                      placeholder="https://pinterest.com/danielmaison"
                      className="w-full px-3 py-2 bg-[#141414] border border-[#2B2B2B] text-xs font-mono rounded-xs text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </form>

          {/* Footer Actions */}
          <div className="px-6 py-4 bg-[#141414] border-t border-[#222] flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-mono uppercase text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <div className="flex items-center gap-3">
              {hasChanges && (
                <span className="text-[11px] font-mono text-amber-400/80 hidden sm:inline">
                  • Unsaved modifications detected
                </span>
              )}
              <button
                type="button"
                onClick={handleSubmit}
                className="px-5 py-2 text-xs font-mono uppercase tracking-wider font-semibold rounded-xs bg-amber-400 hover:bg-amber-300 text-black shadow-lg shadow-amber-400/20 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                Save Atelier Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Nested Image Upload Modal */}
      <ImageUploadModal
        isOpen={imageModalConfig.isOpen}
        onClose={() =>
          setImageModalConfig((prev) => ({ ...prev, isOpen: false }))
        }
        onSelectImage={handleApplyImage}
        title={imageModalConfig.title}
        currentImageUrl={formData[imageModalConfig.field]}
        aspectRatioHint={imageModalConfig.aspectRatio}
        category={
          imageModalConfig.field === 'logoUrl'
            ? 'logo'
            : imageModalConfig.field === 'coverImageUrl'
            ? 'cover'
            : 'avatar'
        }
      />
    </>
  );
};
