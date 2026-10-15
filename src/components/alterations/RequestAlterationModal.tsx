/**
 * @file RequestAlterationModal.tsx
 * Multi-Step Bespoke Alteration & Tailoring Request Wizard.
 * Allows customers to:
 * 1. Select Garment From Wardrobe (with visual cards, serial, status)
 * 2. Choose Desired Fit Changes (anatomical regions, delta amounts, issue descriptions)
 * 3. Add Alteration Notes (posture notice, wear occasion, urgency tier)
 * 4. Upload Photos & Interactive Fitting Pinpoints (front, side, back, detail)
 * 5. Review & Submit with White-Glove Concierge Logistics
 */

import React, { useState } from 'react';
import {
  X,
  Scissors,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Upload,
  Camera,
  MapPin,
  Calendar,
  AlertCircle,
  ShieldCheck,
  Truck,
  Sparkles,
  Plus,
  Trash2,
  Info,
  Eye,
  Sliders,
} from 'lucide-react';
import { useWardrobeStore } from '../../stores/wardrobeStore';
import { useAlterationStore } from '../../stores/alterationStore';
import { WardrobeItemFull } from '../../types/wardrobe.types';
import {
  FitRegion,
  FitAdjustmentDirection,
  DesiredFitChange,
  AlterationPhoto,
  PhotoAngle,
  FittingPinCoordinate,
} from '../../types/alteration.types';

interface RequestAlterationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialGarmentId?: string | null;
  onSuccess?: (requestId: string) => void;
}

const FIT_REGIONS: Array<{ id: FitRegion; label: string; description: string }> = [
  { id: 'WAIST_SUPPRESSION', label: 'Waist & Side-Seams', description: 'Taper or ease jacket waist or coat torso' },
  { id: 'SLEEVE_LENGTH', label: 'Sleeve Length', description: 'Raise or lengthen sleeves to calibrate cuff exposure' },
  { id: 'JACKET_LENGTH', label: 'Jacket / Coat Hem Length', description: 'Adjust total length above or below seat line' },
  { id: 'CHEST_BUST', label: 'Chest & Bust Drape', description: 'Clean chest drape or ease tight chest fullness' },
  { id: 'SHOULDERS_BACK', label: 'Shoulders & Back Blades', description: 'Reduce excess cloth behind scye or adjust blade slope' },
  { id: 'COLLAR_NECK', label: 'Collar & Neck Balance', description: 'Eliminate collar gap or lower neck roll' },
  { id: 'TROUSER_WAIST', label: 'Trouser Waistband & Seat', description: 'Take in or let out trouser waistband / seat rise' },
  { id: 'TROUSER_INSEAM', label: 'Trouser Inseam & Hem Break', description: 'Calibrate hem break over bespoke footwear' },
  { id: 'TROUSER_LEG_OPENING', label: 'Trouser Leg Opening & Taper', description: 'Taper knee and hem circumference' },
];

const FIT_DIRECTIONS: Array<{ id: FitAdjustmentDirection; label: string; sign: '-' | '+' }> = [
  { id: 'TAKE_IN', label: 'Take In / Suppress', sign: '-' },
  { id: 'LET_OUT', label: 'Let Out / Ease', sign: '+' },
  { id: 'SHORTEN', label: 'Shorten Hem', sign: '-' },
  { id: 'LENGTHEN', label: 'Lengthen Hem', sign: '+' },
  { id: 'TAPER', label: 'Taper Circumference', sign: '-' },
  { id: 'LOWER_BALANCE', label: 'Lower Balance / Roll', sign: '-' },
  { id: 'LIFT_BALANCE', label: 'Lift Balance', sign: '+' },
  { id: 'REMOVE_FOLDS', label: 'Smooth Folds & Puckering', sign: '-' },
];

const SAMPLE_PHOTO_PRESETS = [
  {
    url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
    angle: 'FRONT' as PhotoAngle,
    caption: 'Front standing stance showing torso fit',
  },
  {
    url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
    angle: 'BACK' as PhotoAngle,
    caption: 'Back blade drape and collar alignment',
  },
  {
    url: 'https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=800&q=80',
    angle: 'SIDE_PROFILE' as PhotoAngle,
    caption: 'Side profile posture balance check',
  },
];

export const RequestAlterationModal: React.FC<RequestAlterationModalProps> = ({
  isOpen,
  onClose,
  initialGarmentId,
  onSuccess,
}) => {
  const { items: wardrobeItems } = useWardrobeStore();
  const { submitNewRequest } = useAlterationStore();

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [selectedGarmentId, setSelectedGarmentId] = useState<string>(
    initialGarmentId || wardrobeItems[0]?.id || ''
  );

  // Step 2: Fit changes
  const [fitChanges, setFitChanges] = useState<DesiredFitChange[]>([
    {
      id: 'fc_initial_1',
      region: 'WAIST_SUPPRESSION',
      regionLabel: 'Waist & Side-Seams',
      direction: 'TAKE_IN',
      directionLabel: 'Take In / Suppress',
      deltaCm: -1.0,
      issueDescription: 'Slight excess fabric through mid-torso when buttoned.',
    },
  ]);
  const [currentRegion, setCurrentRegion] = useState<FitRegion>('SLEEVE_LENGTH');
  const [currentDirection, setCurrentDirection] = useState<FitAdjustmentDirection>('SHORTEN');
  const [currentDelta, setCurrentDelta] = useState<number>(-1.0);
  const [currentIssue, setCurrentIssue] = useState<string>('');

  // Step 3: Notes & Context
  const [alterationNotes, setAlterationNotes] = useState<string>(
    'Refining fit for upcoming formal engagements. Requesting clean silhouette contouring.'
  );
  const [bodyPostureNotice, setBodyPostureNotice] = useState<
    'REGULAR_POSTURE' | 'ERECT_POSTURE' | 'SLIGHT_STOOP' | 'LOW_RIGHT_SHOULDER' | 'PROMINENT_BLADES'
  >('REGULAR_POSTURE');
  const [wearOccasion, setWearOccasion] = useState<string>('Autumn Gala & Formal Assemblies');
  const [urgencyLevel, setUrgencyLevel] = useState<'STANDARD' | 'EXPEDITED' | 'ROYAL_SALON'>('STANDARD');

  // Step 4: Photos & Pinpoints
  const [uploadedPhotos, setUploadedPhotos] = useState<AlterationPhoto[]>([
    {
      id: 'photo_init_1',
      url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
      angle: 'FRONT',
      caption: 'Front standing silhouette',
      uploadedAt: new Date().toISOString(),
      pinCoordinates: [
        { id: 'pin_init_1', xPercent: 50, yPercent: 55, region: 'WAIST_SUPPRESSION', note: 'Pinch 1.0cm here' },
      ],
    },
  ]);
  const [activePhotoIdx, setActivePhotoIdx] = useState<number>(0);
  const [pinNoteInput, setPinNoteInput] = useState<string>('Adjust fit here');

  // Step 5: Logistics
  const [conciergePickup, setConciergePickup] = useState<boolean>(true);
  const [pickupAddress, setPickupAddress] = useState<string>(
    '14 Grosvenor Crescent, Belgravia, London SW1X 7EE'
  );
  const [deliveryAddress, setDeliveryAddress] = useState<string>(
    '14 Grosvenor Crescent, Belgravia, London SW1X 7EE'
  );
  const [preferredSalon, setPreferredSalon] = useState<string>(
    'Mayfair Salon & Workshop, 14 Savile Row, London'
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionError, setSubmissionError] = useState<string>('');

  if (!isOpen) return null;

  const selectedGarment = wardrobeItems.find((item) => item.id === selectedGarmentId) || wardrobeItems[0];

  const handleAddFitChange = () => {
    const regionObj = FIT_REGIONS.find((r) => r.id === currentRegion);
    const dirObj = FIT_DIRECTIONS.find((d) => d.id === currentDirection);

    const newChange: DesiredFitChange = {
      id: `fc_${Date.now()}`,
      region: currentRegion,
      regionLabel: regionObj?.label || currentRegion,
      direction: currentDirection,
      directionLabel: dirObj?.label || currentDirection,
      deltaCm: currentDelta,
      issueDescription: currentIssue.trim() || `Adjust ${regionObj?.label} by ${currentDelta > 0 ? '+' : ''}${currentDelta}cm`,
    };

    setFitChanges([...fitChanges, newChange]);
    setCurrentIssue('');
  };

  const handleRemoveFitChange = (id: string) => {
    setFitChanges(fitChanges.filter((fc) => fc.id !== id));
  };

  const handleAddSamplePhoto = (sample: typeof SAMPLE_PHOTO_PRESETS[0]) => {
    const newPhoto: AlterationPhoto = {
      id: `photo_${Date.now()}`,
      url: sample.url,
      angle: sample.angle,
      caption: sample.caption,
      uploadedAt: new Date().toISOString(),
      pinCoordinates: [],
    };
    setUploadedPhotos([...uploadedPhotos, newPhoto]);
    setActivePhotoIdx(uploadedPhotos.length);
  };

  const handlePhotoClickToPin = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!uploadedPhotos[activePhotoIdx]) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const xPercent = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const yPercent = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    const newPin: FittingPinCoordinate = {
      id: `pin_${Date.now()}`,
      xPercent,
      yPercent,
      region: currentRegion,
      note: pinNoteInput || 'Fit adjustment point',
    };

    const updatedList = [...uploadedPhotos];
    const targetPhoto = updatedList[activePhotoIdx];
    targetPhoto.pinCoordinates = [...(targetPhoto.pinCoordinates || []), newPin];
    setUploadedPhotos(updatedList);
  };

  const handleRemovePin = (photoIdx: number, pinId: string) => {
    const updatedList = [...uploadedPhotos];
    const targetPhoto = updatedList[photoIdx];
    targetPhoto.pinCoordinates = targetPhoto.pinCoordinates?.filter((p) => p.id !== pinId);
    setUploadedPhotos(updatedList);
  };

  const handleSubmit = async () => {
    if (!selectedGarment) return;
    setIsSubmitting(true);
    setSubmissionError('');

    try {
      const created = await submitNewRequest({
        customerId: selectedGarment.customerId || 'cust_001',
        customerName: selectedGarment.customerName || 'Lord Alistair Sterling-Fox',
        customerEmail: 'a.sterlingfox@mayfair-holdings.co.uk',
        customerPhone: '+44 20 7946 0912',
        wardrobeItemId: selectedGarment.id,
        garmentName: selectedGarment.garmentName,
        garmentCategory: selectedGarment.category,
        garmentSilhouette: selectedGarment.silhouetteStyle,
        garmentSerial: selectedGarment.warranty?.certificateSerialNumber || 'DAN-SUIT-2024-8841',
        primaryImageUrl: selectedGarment.primaryImageUrl,
        originalPriceGbp: selectedGarment.originalPriceGbp,
        originalTailorName: selectedGarment.masterTailorName,
        fitChanges,
        alterationNotes,
        bodyPostureNotice,
        wearOccasion,
        urgencyLevel,
        photos: uploadedPhotos,
        conciergePickup,
        pickupAddress,
        deliveryAddress,
        preferredSalon,
      });

      if (onSuccess) onSuccess(created.id);
      onClose();
    } catch (err: unknown) {
      setSubmissionError(err instanceof Error ? err.message : 'Error submitting alteration request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn text-left font-mono">
      <div className="bg-[#0B0B0B] border border-[#2B2B2B] rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#222] bg-[#121212] flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Scissors className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest">
                  DANIEL’S MAISON BESPOKE
                </span>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold uppercase">
                  LIFETIME STEWARDSHIP
                </span>
              </div>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-white uppercase tracking-wider">
                Request Tailoring & Alteration
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Step Stepper */}
        <div className="bg-[#0F0F0F] border-b border-[#222] px-6 py-3 flex items-center justify-between text-[10px] overflow-x-auto scrollbar-none shrink-0">
          {[
            { num: 1, label: '1. Select Garment' },
            { num: 2, label: '2. Fit Changes' },
            { num: 3, label: '3. Notes & Context' },
            { num: 4, label: '4. Fitting Photos' },
            { num: 5, label: '5. Logistics & Submit' },
          ].map((s) => (
            <button
              key={s.num}
              onClick={() => setStep(s.num as any)}
              className={`flex items-center gap-2 py-1 px-2.5 rounded-lg transition-all shrink-0 cursor-pointer ${
                step === s.num
                  ? 'bg-amber-400/15 text-amber-300 font-bold border border-amber-400/30'
                  : step > s.num
                  ? 'text-neutral-300 hover:text-white'
                  : 'text-neutral-600'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                  step === s.num
                    ? 'bg-amber-400 text-black'
                    : step > s.num
                    ? 'bg-emerald-500 text-black'
                    : 'bg-neutral-800 text-neutral-400'
                }`}
              >
                {step > s.num ? '✓' : s.num}
              </span>
              <span className="tracking-wider uppercase">{s.label}</span>
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* STEP 1: SELECT GARMENT */}
          {step === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Select Garment from Digital Wardrobe
                  </h3>
                  <p className="text-[11px] text-neutral-400">
                    Choose which piece from your authenticated wardrobe requires bespoke fitting adjustments.
                  </p>
                </div>
                <span className="text-[10px] text-amber-400 font-mono">
                  {wardrobeItems.length} Garments in Vault
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {wardrobeItems.map((item) => {
                  const isSelected = item.id === selectedGarmentId;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedGarmentId(item.id)}
                      className={`relative rounded-xl border p-3 flex flex-col gap-3 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-amber-400 bg-amber-400/10 shadow-lg shadow-amber-500/10'
                          : 'border-[#252525] bg-[#141414] hover:border-neutral-600'
                      }`}
                    >
                      <div className="aspect-4/3 w-full rounded-lg overflow-hidden bg-black/60 relative">
                        <img
                          src={item.primaryImageUrl}
                          alt={item.garmentName}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2 left-2 text-[9px] px-2 py-0.5 rounded-full bg-black/80 text-neutral-300 border border-white/10 uppercase font-mono">
                          {item.category}
                        </span>
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-amber-400 text-black flex items-center justify-center font-bold text-xs shadow-md">
                            ✓
                          </div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <h4 className="font-serif text-xs font-bold text-white uppercase truncate">
                          {item.garmentName}
                        </h4>
                        <p className="text-[10px] text-neutral-400 truncate">
                          {item.silhouetteStyle}
                        </p>
                        <div className="flex items-center justify-between text-[9px] text-neutral-500 pt-1 border-t border-[#222]">
                          <span>SN: {item.warranty?.certificateSerialNumber || 'DAN-2024'}</span>
                          <span className="text-emerald-400 font-bold">● {item.status.replace(/_/g, ' ')}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: CHOOSE FIT CHANGES */}
          {step === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Specify Desired Anatomical Fit Changes
                  </h3>
                  <p className="text-[11px] text-neutral-400">
                    Define the exact tailoring regions, adjustment directions, and centimetre tolerances.
                  </p>
                </div>
                {selectedGarment && (
                  <span className="text-[10px] text-neutral-400 bg-[#161616] px-3 py-1 rounded-full border border-[#252525]">
                    Target: <strong className="text-white">{selectedGarment.garmentName}</strong>
                  </span>
                )}
              </div>

              {/* Add Adjustment Form Box */}
              <div className="bg-[#141414] border border-[#282828] rounded-xl p-4 space-y-4">
                <div className="flex items-center gap-2 text-amber-400 text-[11px] font-bold uppercase tracking-wider">
                  <Sliders className="w-4 h-4" />
                  <span>Configure Tailoring Delta</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Anatomical Region */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                      Targeted Region
                    </label>
                    <select
                      value={currentRegion}
                      onChange={(e) => setCurrentRegion(e.target.value as FitRegion)}
                      className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    >
                      {FIT_REGIONS.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Direction */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                      Adjustment Direction
                    </label>
                    <select
                      value={currentDirection}
                      onChange={(e) => setCurrentDirection(e.target.value as FitAdjustmentDirection)}
                      className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    >
                      {FIT_DIRECTIONS.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Delta (cm) */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-neutral-400 uppercase tracking-wider flex justify-between">
                      <span>Adjustment Amount</span>
                      <span className="text-amber-400 font-mono font-bold">
                        {currentDelta > 0 ? `+${currentDelta}` : currentDelta} cm
                      </span>
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setCurrentDelta((d) => Math.max(d - 0.5, -5.0))}
                        className="px-2.5 py-1.5 rounded-lg bg-[#222] hover:bg-[#333] text-white font-bold"
                      >
                        -
                      </button>
                      <input
                        type="range"
                        min="-4.0"
                        max="4.0"
                        step="0.5"
                        value={currentDelta}
                        onChange={(e) => setCurrentDelta(parseFloat(e.target.value))}
                        className="flex-1 accent-amber-400"
                      />
                      <button
                        type="button"
                        onClick={() => setCurrentDelta((d) => Math.min(d + 0.5, 5.0))}
                        className="px-2.5 py-1.5 rounded-lg bg-[#222] hover:bg-[#333] text-white font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Specific Issue Description */}
                <div className="space-y-1">
                  <label className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                    Concern or Fitting Observation
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Sleeve extends 1cm past thumb knuckle; want French cuff reveal"
                      value={currentIssue}
                      onChange={(e) => setCurrentIssue(e.target.value)}
                      className="flex-1 bg-[#1A1A1A] border border-[#333] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                    <button
                      type="button"
                      onClick={handleAddFitChange}
                      className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs rounded-lg uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Delta</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Current List of Fit Changes */}
              <div className="space-y-3">
                <h4 className="text-[11px] text-neutral-400 uppercase tracking-widest font-bold">
                  Configured Fit Changes ({fitChanges.length})
                </h4>

                {fitChanges.length === 0 ? (
                  <div className="p-6 text-center rounded-xl bg-[#121212] border border-[#222] text-neutral-500">
                    No fit changes added yet. Add at least one tailored adjustment above.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {fitChanges.map((fc, idx) => (
                      <div
                        key={fc.id}
                        className="p-3 rounded-xl bg-[#141414] border border-[#262626] flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-neutral-800 text-neutral-300 flex items-center justify-center text-[10px] font-bold">
                            #{idx + 1}
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white text-xs">{fc.regionLabel}</span>
                              <span className="text-[9px] px-2 py-0.2 rounded-full bg-amber-400/10 text-amber-300 font-bold">
                                {fc.directionLabel} ({fc.deltaCm > 0 ? `+${fc.deltaCm}` : fc.deltaCm} cm)
                              </span>
                            </div>
                            <p className="text-[10px] text-neutral-400 font-sans mt-0.5">
                              {fc.issueDescription}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveFitChange(fc.id)}
                          className="p-1.5 text-neutral-500 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: NOTES & CONTEXT */}
          {step === 3 && (
            <div className="space-y-5 animate-fadeIn">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Add Alteration Notes & Posture Specifications
                </h3>
                <p className="text-[11px] text-neutral-400">
                  Provide context to the Master Tailor regarding natural stance, planned events, and aesthetic preferences.
                </p>
              </div>

              {/* Natural Posture Baseline */}
              <div className="space-y-2">
                <label className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                  Body Stance & Posture Baseline
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'REGULAR_POSTURE', label: 'Regular / Neutral Stance' },
                    { id: 'ERECT_POSTURE', label: 'Erect / High Chest Posture' },
                    { id: 'SLIGHT_STOOP', label: 'Slight Forward Head / Stoop' },
                    { id: 'LOW_RIGHT_SHOULDER', label: 'Low Right Shoulder Slope' },
                    { id: 'PROMINENT_BLADES', label: 'Prominent Shoulder Blades' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setBodyPostureNotice(p.id as any)}
                      className={`p-2.5 rounded-lg border text-[11px] text-left transition-all ${
                        bodyPostureNotice === p.id
                          ? 'border-amber-400 bg-amber-400/15 text-white font-bold'
                          : 'border-[#252525] bg-[#141414] text-neutral-400 hover:text-white'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Comprehensive Notes */}
              <div className="space-y-1">
                <label className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                  Detailed Instructions for Master Tailor
                </label>
                <textarea
                  rows={4}
                  value={alterationNotes}
                  onChange={(e) => setAlterationNotes(e.target.value)}
                  placeholder="Detail how the garment feels during movement, seated versus standing, arm extension..."
                  className="w-full bg-[#141414] border border-[#2B2B2B] rounded-xl p-3 text-xs text-white font-sans focus:outline-none focus:border-amber-400 leading-relaxed"
                />
              </div>

              {/* Occasion & Urgency */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                    Planned Event / Deadline
                  </label>
                  <input
                    type="text"
                    value={wearOccasion}
                    onChange={(e) => setWearOccasion(e.target.value)}
                    placeholder="e.g. State Banquet, Wedding, Season Premiere"
                    className="w-full bg-[#141414] border border-[#2B2B2B] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                    Priority / Urgency Tier
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'STANDARD', label: 'Standard (7-10d)' },
                      { id: 'EXPEDITED', label: 'Expedited (3-5d)' },
                      { id: 'ROYAL_SALON', label: 'Royal (48h)' },
                    ].map((u) => (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => setUrgencyLevel(u.id as any)}
                        className={`p-2 rounded-lg border text-[10px] text-center font-bold uppercase transition-all ${
                          urgencyLevel === u.id
                            ? 'border-amber-400 bg-amber-400 text-black'
                            : 'border-[#252525] bg-[#141414] text-neutral-400 hover:text-white'
                        }`}
                      >
                        {u.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: UPLOAD PHOTOS & PINPOINTS */}
          {step === 4 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Fitting Photographs & Pin-Point Annotations
                  </h3>
                  <p className="text-[11px] text-neutral-400">
                    Upload fit photos and click directly on the image to mark pins where fabric needs adjustment.
                  </p>
                </div>

                {/* Sample Presets Quick Load */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] text-neutral-500 uppercase">Load Preset:</span>
                  {SAMPLE_PHOTO_PRESETS.map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAddSamplePhoto(sample)}
                      className="text-[9px] px-2 py-1 rounded bg-[#222] hover:bg-[#333] text-neutral-300 font-bold uppercase"
                    >
                      +{sample.angle}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interactive Photo Canvas */}
              {uploadedPhotos.length > 0 && uploadedPhotos[activePhotoIdx] ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {uploadedPhotos.map((p, idx) => (
                        <button
                          key={p.id}
                          onClick={() => setActivePhotoIdx(idx)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase flex items-center gap-1.5 cursor-pointer ${
                            activePhotoIdx === idx
                              ? 'bg-amber-400 text-black'
                              : 'bg-[#181818] text-neutral-400 hover:text-white'
                          }`}
                        >
                          <span>{p.angle}</span>
                          <span className="text-[9px] opacity-75">
                            ({p.pinCoordinates?.length || 0} pins)
                          </span>
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-amber-300 font-mono">
                      <span>💡 Click on garment photo to drop tailor pin</span>
                    </div>
                  </div>

                  {/* Canvas Container */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div
                      onClick={handlePhotoClickToPin}
                      className="md:col-span-2 relative aspect-4/3 rounded-xl overflow-hidden bg-black border border-amber-400/30 cursor-crosshair select-none group"
                    >
                      <img
                        src={uploadedPhotos[activePhotoIdx].url}
                        alt="Fitting Photograph"
                        className="w-full h-full object-contain pointer-events-none"
                      />

                      {/* Render Pins */}
                      {uploadedPhotos[activePhotoIdx].pinCoordinates?.map((pin, pIdx) => (
                        <div
                          key={pin.id}
                          style={{ left: `${pin.xPercent}%`, top: `${pin.yPercent}%` }}
                          className="absolute -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center pointer-events-auto"
                        >
                          <div className="w-5 h-5 rounded-full bg-amber-400 text-black font-bold text-[10px] flex items-center justify-center shadow-lg border border-white animate-pulse">
                            {pIdx + 1}
                          </div>
                          <span className="bg-black/90 text-amber-300 text-[8px] font-mono px-1.5 py-0.5 rounded mt-0.5 whitespace-nowrap border border-amber-400/40">
                            {pin.note}
                          </span>
                        </div>
                      ))}

                      <div className="absolute bottom-2 left-2 right-2 bg-black/80 backdrop-blur-sm p-2 rounded-lg border border-white/10 text-[10px] flex items-center justify-between text-neutral-300">
                        <span>{uploadedPhotos[activePhotoIdx].caption}</span>
                        <span className="text-amber-400">Angle: {uploadedPhotos[activePhotoIdx].angle}</span>
                      </div>
                    </div>

                    {/* Pin Details & Controls */}
                    <div className="space-y-3 bg-[#141414] border border-[#252525] rounded-xl p-3 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                            Pin Label / Instruction
                          </label>
                          <input
                            type="text"
                            value={pinNoteInput}
                            onChange={(e) => setPinNoteInput(e.target.value)}
                            placeholder="e.g. Suppress 1.2cm waist seam"
                            className="w-full bg-[#1B1B1B] border border-[#333] rounded-lg px-2.5 py-1.5 text-xs text-white"
                          />
                        </div>

                        <div className="space-y-2">
                          <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold block">
                            Pins Placed on This Photo
                          </span>
                          {uploadedPhotos[activePhotoIdx].pinCoordinates?.length === 0 ? (
                            <p className="text-[11px] text-neutral-500 italic">
                              No pins placed yet. Click anywhere on the photograph to place a marker.
                            </p>
                          ) : (
                            <div className="space-y-1.5 max-h-48 overflow-y-auto">
                              {uploadedPhotos[activePhotoIdx].pinCoordinates?.map((pin, idx) => (
                                <div
                                  key={pin.id}
                                  className="p-2 rounded-lg bg-[#1D1D1D] border border-[#2B2B2B] flex items-center justify-between text-[10px]"
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="w-4 h-4 rounded-full bg-amber-400 text-black flex items-center justify-center font-bold text-[9px]">
                                      {idx + 1}
                                    </span>
                                    <span className="text-white font-mono">{pin.note}</span>
                                  </div>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRemovePin(activePhotoIdx, pin.id);
                                    }}
                                    className="text-neutral-500 hover:text-red-400"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="p-2 rounded bg-amber-400/10 border border-amber-400/20 text-[9.5px] text-amber-300">
                        Pins guide our Master Tailor's chalk layout on the cutting block.
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center rounded-xl bg-[#141414] border border-[#252525] space-y-3">
                  <Camera className="w-8 h-8 text-neutral-500 mx-auto" />
                  <p className="text-neutral-400 text-xs">No fitting photos added.</p>
                  <button
                    onClick={() => handleAddSamplePhoto(SAMPLE_PHOTO_PRESETS[0])}
                    className="px-4 py-2 bg-amber-400 text-black text-xs font-bold rounded-lg uppercase"
                  >
                    Load Sample Fitting Photograph
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STEP 5: LOGISTICS & REVIEW */}
          {step === 5 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  White-Glove Logistics & Request Confirmation
                </h3>
                <p className="text-[11px] text-neutral-400">
                  Review your alteration itinerary, complimentary warranty coverage, and courier collection details.
                </p>
              </div>

              {/* Order Summary Card */}
              <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-[#222]">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedGarment?.primaryImageUrl}
                      alt={selectedGarment?.garmentName}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <h4 className="font-serif text-sm font-bold text-white uppercase">
                        {selectedGarment?.garmentName}
                      </h4>
                      <p className="text-[10px] text-neutral-400">
                        SN: {selectedGarment?.warranty?.certificateSerialNumber || 'DAN-2024'} • {selectedGarment?.silhouetteStyle}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-emerald-400 font-bold uppercase block">
                      ✓ BESPOKE WARRANTY
                    </span>
                    <span className="text-xs font-mono text-neutral-300">
                      Cost: <strong className="text-white">£0.00 (Complimentary)</strong>
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] pt-1">
                  <div>
                    <span className="text-neutral-500 block text-[9.5px] uppercase">Fit Deltas:</span>
                    <span className="text-white font-bold">{fitChanges.length} Tailored Adjustments</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[9.5px] uppercase">Fitting Photos:</span>
                    <span className="text-white font-bold">{uploadedPhotos.length} Photos Attached</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[9.5px] uppercase">Service Lead Time:</span>
                    <span className="text-amber-400 font-bold">
                      {urgencyLevel === 'ROYAL_SALON' ? '48 Hours Expedited' : '5-7 Business Days'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Logistics Addresses */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                    White-Glove Collection Address
                  </label>
                  <input
                    type="text"
                    value={pickupAddress}
                    onChange={(e) => setPickupAddress(e.target.value)}
                    className="w-full bg-[#141414] border border-[#2B2B2B] rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                    Delivery Address
                  </label>
                  <input
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full bg-[#141414] border border-[#2B2B2B] rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              {/* Preferred Salon */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                  Designated Atelier Salon & Cutting Bench
                </label>
                <select
                  value={preferredSalon}
                  onChange={(e) => setPreferredSalon(e.target.value)}
                  className="w-full bg-[#141414] border border-[#2B2B2B] rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="Mayfair Salon & Workshop, 14 Savile Row, London">
                    Mayfair Salon & Workshop, 14 Savile Row, London
                  </option>
                  <option value="Place Vendôme Atelier & Salon, Paris">
                    Place Vendôme Atelier & Salon, Paris
                  </option>
                  <option value="Via Montenapoleone Sartoria, Milan">
                    Via Montenapoleone Sartoria, Milan
                  </option>
                </select>
              </div>

              {/* Workflow Stepper Preview */}
              <div className="p-4 rounded-xl bg-[#141414] border border-[#242424] space-y-2">
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-bold block">
                  Workflow Pipeline You Will Be Able to Track:
                </span>
                <div className="flex items-center justify-between text-[9px] text-neutral-400 font-mono overflow-x-auto py-1">
                  <span className="text-amber-400 font-bold">1. Submitted</span>
                  <span>→</span>
                  <span>2. Reviewed</span>
                  <span>→</span>
                  <span>3. Approved</span>
                  <span>→</span>
                  <span>4. In Alteration</span>
                  <span>→</span>
                  <span>5. Completed</span>
                  <span>→</span>
                  <span>6. Returned</span>
                </div>
              </div>

              {submissionError && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                  {submissionError}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-5 border-t border-[#222] bg-[#121212] flex items-center justify-between gap-4 shrink-0">
          <div>
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => (s - 1) as any)}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Step</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-neutral-400 hover:text-white text-xs"
              >
                Cancel
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {step < 5 ? (
              <button
                type="button"
                onClick={() => setStep((s) => (s + 1) as any)}
                className="px-6 py-2 bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs rounded-xl flex items-center gap-2 uppercase tracking-wider shadow-md transition-all cursor-pointer"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmit}
                className="px-8 py-2.5 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-black font-bold text-xs rounded-xl flex items-center gap-2 uppercase tracking-wider shadow-lg shadow-amber-400/20 transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Registering Request...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm & Dispatch Request</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
