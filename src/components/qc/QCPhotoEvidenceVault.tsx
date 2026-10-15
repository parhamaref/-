/**
 * @file QCPhotoEvidenceVault.tsx
 * High-Resolution Photographic Evidence Vault for Garment Inspections.
 * Captures macro detail shots, optical loupe checks, defect highlights, and packaging records.
 */

import React, { useState } from 'react';
import { QCPhotoEvidence } from '../../types/qualityControl.types';
import { Camera, Plus, ZoomIn, Eye, Tag, Calendar, User, X } from 'lucide-react';

interface QCPhotoEvidenceVaultProps {
  photos: QCPhotoEvidence[];
  onAddPhoto: (photo: Omit<QCPhotoEvidence, 'id' | 'timestamp'>) => void;
}

const SAMPLE_PHOTO_PRESETS = [
  {
    garmentArea: 'Hand Milanese Buttonhole (10x Loupe)',
    photoUrl: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=800&q=80',
    caption: '12 stitches/cm hand silk gimp buttonhole inspection.',
  },
  {
    garmentArea: 'Shoulder Roped Sleevehead Fit',
    photoUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
    caption: 'Zero puckering along shoulder crown spline.',
  },
  {
    garmentArea: 'Interior Cupro Lining Pleat Ease',
    photoUrl: 'https://images.unsplash.com/photo-1598808503746-f34c53b9323e?auto=format&fit=crop&w=800&q=80',
    caption: 'Kinetic mobility pleat with hand pick-stitching.',
  },
  {
    garmentArea: 'Tamper-Proof Holographic Packaging',
    photoUrl: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&w=800&q=80',
    caption: 'Official wax seal applied over presentation box.',
  },
];

export const QCPhotoEvidenceVault: React.FC<QCPhotoEvidenceVaultProps> = ({
  photos,
  onAddPhoto,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<QCPhotoEvidence | null>(null);

  // New photo form state
  const [garmentArea, setGarmentArea] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [inspectorName, setInspectorName] = useState('QC Lead Inspector');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoUrl.trim() || !garmentArea.trim()) return;

    onAddPhoto({
      garmentArea: garmentArea.trim(),
      photoUrl: photoUrl.trim(),
      caption: caption.trim() || 'Photographic verification proof.',
      inspectorName: inspectorName.trim(),
    });

    setGarmentArea('');
    setPhotoUrl('');
    setCaption('');
    setShowAddModal(false);
  };

  const handleApplyPreset = (preset: typeof SAMPLE_PHOTO_PRESETS[0]) => {
    setGarmentArea(preset.garmentArea);
    setPhotoUrl(preset.photoUrl);
    setCaption(preset.caption);
  };

  return (
    <div className="space-y-6 text-left font-mono text-[11px]">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0A0A0A] p-4 border border-[#222] rounded-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Camera className="w-4 h-4 text-emerald-400" />
            <span className="text-[10px] text-white font-bold uppercase tracking-wider">
              PHOTOGRAPHIC EVIDENCE VAULT ({photos.length} ARCHIVES)
            </span>
          </div>
          <p className="text-[10px] text-neutral-400 font-sans">
            High-resolution visual telemetry verifying lapel roll, stitch consistency, pattern matches, and white-glove packaging.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-black font-bold uppercase rounded-xs hover:bg-neutral-200 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Capture Photo Evidence
        </button>
      </div>

      {/* Photo Gallery Grid */}
      {photos.length === 0 ? (
        <div className="bg-[#070707] border border-[#222] p-8 text-center rounded-xs space-y-2">
          <Camera className="w-8 h-8 text-neutral-600 mx-auto" />
          <h4 className="font-serif text-base text-white uppercase font-bold">
            NO PHOTO EVIDENCE ATTACHED
          </h4>
          <p className="text-[10px] text-neutral-400 font-sans max-w-sm mx-auto">
            Attach macro imagery or packaging records to corroborate inspection decisions.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => setSelectedPhoto(photo)}
              className="bg-[#0A0A0A] border border-[#222] hover:border-neutral-500 rounded-xs overflow-hidden group cursor-pointer transition-all flex flex-col"
            >
              {/* Image Preview with overlay on hover */}
              <div className="relative h-48 w-full bg-neutral-900 overflow-hidden">
                <img
                  src={photo.photoUrl}
                  alt={photo.garmentArea}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <span className="px-2 py-1 bg-white text-black text-[9px] font-bold uppercase rounded-xs flex items-center gap-1">
                    <ZoomIn className="w-3 h-3" /> Inspect Macro View
                  </span>
                </div>
                <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-xs border border-white/20 px-2 py-0.5 rounded-xs text-[8.5px] text-white uppercase font-bold">
                  {photo.garmentArea}
                </div>
              </div>

              {/* Caption & Metadata */}
              <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
                <p className="text-[10px] text-neutral-300 font-sans line-clamp-2 leading-relaxed">
                  {photo.caption}
                </p>
                <div className="flex justify-between items-center text-[8.5px] text-neutral-500 border-t border-[#1C1C1C] pt-2">
                  <span>Inspector: {photo.inspectorName}</span>
                  <span>{new Date(photo.timestamp).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Inspect Photo Modal */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0C0C0C] border border-[#2B2B2B] w-full max-w-4xl p-6 rounded-xs space-y-4 animate-scaleUp text-left"
          >
            <div className="flex justify-between items-center border-b border-[#222] pb-3">
              <div>
                <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest block">
                  MACRO OPTICAL INSPECTION
                </span>
                <h3 className="font-serif text-lg text-white font-bold tracking-wider uppercase">
                  {selectedPhoto.garmentArea}
                </h3>
              </div>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="h-96 w-full rounded-xs overflow-hidden border border-[#222] bg-black">
              <img
                src={selectedPhoto.photoUrl}
                alt={selectedPhoto.garmentArea}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="p-3 bg-[#111] border border-[#222] rounded-xs space-y-1">
              <span className="text-[9px] text-neutral-500 uppercase tracking-widest block">
                INSPECTOR ANNOTATION
              </span>
              <p className="text-[11px] text-neutral-200 font-sans leading-relaxed">
                {selectedPhoto.caption}
              </p>
              <div className="flex justify-between items-center text-[9px] text-neutral-500 pt-2 border-t border-[#222]">
                <span>Certified by: {selectedPhoto.inspectorName}</span>
                <span>Timestamp: {new Date(selectedPhoto.timestamp).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Photo Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0C0C0C] border border-[#2B2B2B] w-full max-w-xl p-6 rounded-xs space-y-4 animate-scaleUp">
            <div className="flex justify-between items-center border-b border-[#222] pb-3">
              <div>
                <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest block">
                  ATTACH OPTICAL PROOF
                </span>
                <h3 className="font-serif text-lg text-white font-bold tracking-wider uppercase">
                  RECORD QC PHOTO EVIDENCE
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-neutral-500 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Quick preset selector */}
            <div className="space-y-1">
              <span className="text-[8.5px] text-neutral-500 uppercase block">
                Quick Camera Presets:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {SAMPLE_PHOTO_PRESETS.map((p, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleApplyPreset(p)}
                    className="px-2 py-1 bg-neutral-900 hover:bg-neutral-800 text-[9px] text-neutral-300 rounded-xs border border-[#2B2B2B] cursor-pointer"
                  >
                    + {p.garmentArea.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="text-[9px] text-neutral-400 uppercase block mb-1">
                  Garment Area / Feature Point
                </label>
                <input
                  type="text"
                  value={garmentArea}
                  onChange={(e) => setGarmentArea(e.target.value)}
                  placeholder="e.g. Left Lapel Milanese Buttonhole / Center Back Vent"
                  className="w-full bg-black border border-[#333] text-white p-2 text-[10px] rounded-xs"
                  required
                />
              </div>

              <div>
                <label className="text-[9px] text-neutral-400 uppercase block mb-1">
                  High-Resolution Photo URL
                </label>
                <input
                  type="text"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-black border border-[#333] text-white p-2 text-[10px] rounded-xs"
                  required
                />
              </div>

              <div>
                <label className="text-[9px] text-neutral-400 uppercase block mb-1">
                  Inspector Caption & Optical Findings
                </label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  rows={2}
                  placeholder="Describe thread density, edge regularity, or packaging status..."
                  className="w-full bg-black border border-[#333] text-white p-2 text-[10px] rounded-xs"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#222]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-[#333] text-neutral-400 rounded-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-white text-black font-bold uppercase rounded-xs hover:bg-neutral-200"
                >
                  Save Photo to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
