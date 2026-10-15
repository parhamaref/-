/**
 * @file CustomerMeasurementsView.tsx
 * Customer Measurement Profile & Historical Versioning View.
 * Enables clients and bespoke advisors to input/edit anatomical metrics,
 * fit preferences, and specific requirements while retaining an immutable version history.
 */

import React, { useState } from 'react';
import { MeasurementProfile, BodyMeasurements, FitPreferences } from '../../types/daniels.types';
import { MOCK_MEASUREMENT_PROFILES } from '../../mock/danielsMockData';
import { validateMeasurementProfileVersioning } from '../../utils/danielsStateValidators';
import { Ruler, ShieldCheck, History, Check, Plus, AlertCircle, Sparkles, Layers } from 'lucide-react';

interface CustomerMeasurementsViewProps {
  customerId?: string;
  customerName?: string;
  onProfileUpdated?: (newProfile: MeasurementProfile) => void;
}

export const CustomerMeasurementsView: React.FC<CustomerMeasurementsViewProps> = ({
  customerId = 'cust_001',
  customerName = 'Lord Alistair Sterling-Fox',
  onProfileUpdated,
}) => {
  // Profiles for this customer (sorted latest first)
  const [profiles, setProfiles] = useState<MeasurementProfile[]>(() => {
    return MOCK_MEASUREMENT_PROFILES.filter((p) => p.customerId === customerId);
  });

  const activeProfile = profiles.find((p) => p.isLatest) || profiles[0];
  const [selectedVersionId, setSelectedVersionId] = useState<string>(activeProfile?.id || '');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [unit, setUnit] = useState<'cm' | 'inch'>(activeProfile?.measurements.unit || 'cm');
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  // Form states initialized with latest profile
  const [measurements, setMeasurements] = useState<BodyMeasurements>({
    unit: activeProfile?.measurements.unit || 'cm',
    neck: activeProfile?.measurements.neck || 41.5,
    shoulderWidth: activeProfile?.measurements.shoulderWidth || 48.5,
    chest: activeProfile?.measurements.chest || 104.5,
    waist: activeProfile?.measurements.waist || 86.0,
    hips: activeProfile?.measurements.hips || 101.5,
    sleeveLength: activeProfile?.measurements.sleeveLength || 65.5,
    bicep: activeProfile?.measurements.bicep || 35.5,
    wrist: activeProfile?.measurements.wrist || 18.0,
    jacketLength: activeProfile?.measurements.jacketLength || 78.5,
    inseam: activeProfile?.measurements.inseam || 84.0,
    outseam: activeProfile?.measurements.outseam || 108.5,
    thigh: activeProfile?.measurements.thigh || 59.5,
    ankle: activeProfile?.measurements.ankle || 20.5,
  });

  const [fitPreferences, setFitPreferences] = useState<FitPreferences>({
    silhouette: activeProfile?.fitPreferences.silhouette || 'Classic',
    shoulderPad: activeProfile?.fitPreferences.shoulderPad || 'Structured',
    trouserBreak: activeProfile?.fitPreferences.trouserBreak || 'Slight Break',
    notes: activeProfile?.fitPreferences.notes || '',
  });

  const [specialRequirements, setSpecialRequirements] = useState<string[]>(
    activeProfile?.specialRequirements || []
  );
  const [newRequirementText, setNewRequirementText] = useState<string>('');

  const currentDisplayProfile =
    profiles.find((p) => p.id === selectedVersionId) || activeProfile;

  const handleMetricChange = (field: string, val: string) => {
    const num = parseFloat(val);
    setMeasurements((prev) => ({
      ...prev,
      [field]: isNaN(num) ? 0 : num,
    }));
  };

  const handleAddRequirement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRequirementText.trim()) return;
    setSpecialRequirements((prev) => [...prev, newRequirementText.trim()]);
    setNewRequirementText('');
  };

  const handleRemoveRequirement = (idx: number) => {
    setSpecialRequirements((prev) => prev.filter((_, i) => i !== idx));
  };

  // Submit and mint new version
  const handleSaveNewVersion = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorNotice(null);

    const validation = validateMeasurementProfileVersioning(activeProfile, {
      customerId,
      measurements: { ...measurements, unit },
      fitPreferences,
      specialRequirements,
      isLatest: true,
      notes: `Updated on ${new Date().toLocaleDateString('en-GB')}`,
    });

    if (!validation.valid) {
      setErrorNotice(validation.reason || 'Invalid measurements provided.');
      return;
    }

    const newVersionNumber = validation.nextVersion;
    const newProfileId = `meas_prof_${customerId}_v${newVersionNumber}`;

    const newVersion: MeasurementProfile = {
      id: newProfileId,
      customerId,
      measurements: { ...measurements, unit },
      fitPreferences,
      specialRequirements,
      version: newVersionNumber,
      approvedAt: null, // Will require atelier sign-off
      supersededById: null,
      isLatest: true,
      notes: `Client revised fit discovery profile (v${newVersionNumber}).`,
    };

    // Mark previous latest as superseded
    const updatedProfiles = profiles.map((p) => {
      if (p.isLatest) {
        return { ...p, isLatest: false, supersededById: newProfileId };
      }
      return p;
    });

    const finalProfilesList = [newVersion, ...updatedProfiles];
    setProfiles(finalProfilesList);
    setSelectedVersionId(newProfileId);
    setIsEditing(false);
    setSuccessNotice(`New measurement profile v${newVersionNumber} successfully minted & archived prior specs.`);

    if (onProfileUpdated) {
      onProfileUpdated(newVersion);
    }

    setTimeout(() => setSuccessNotice(null), 6000);
  };

  return (
    <div className="space-y-10 text-left font-mono">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2B2B2B] pb-6">
        <div>
          <div className="flex items-center gap-2 text-neutral-400 text-[10px] tracking-widest uppercase mb-1">
            <Ruler className="w-3.5 h-3.5 text-white" />
            <span>BESPOKE ANATOMICAL BLUEPRINT</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-white uppercase tracking-wider font-bold">
            MEASUREMENT DOSSIER
          </h2>
          <p className="text-[11px] text-neutral-400 font-sans mt-0.5">
            Archival records for <span className="text-white font-semibold">{customerName}</span>. Every modification generates an immutable version docket.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="py-2.5 px-5 bg-white hover:bg-neutral-200 text-black text-[10px] font-bold tracking-widest uppercase rounded-xs transition-colors duration-200 flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <Plus className="w-3.5 h-3.5" />
              RECORD NEW FITTING (V{activeProfile ? activeProfile.version + 1 : 1})
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(false)}
              className="py-2.5 px-4 border border-[#2B2B2B] hover:border-white text-neutral-400 hover:text-white text-[10px] tracking-widest uppercase rounded-xs transition-colors duration-200 cursor-pointer"
            >
              CANCEL EDIT
            </button>
          )}
        </div>
      </div>

      {/* Notifications */}
      {successNotice && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-sm text-emerald-300 text-[11px] flex items-center gap-3">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successNotice}</span>
        </div>
      )}

      {errorNotice && (
        <div className="p-4 bg-rose-950/40 border border-rose-500/40 rounded-sm text-rose-300 text-[11px] flex items-center gap-3">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorNotice}</span>
        </div>
      )}

      {/* Version Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#2B2B2B]/60 text-[10px]">
        <span className="text-neutral-500 uppercase tracking-widest mr-2 flex items-center gap-1.5 shrink-0">
          <History className="w-3.5 h-3.5" />
          VERSION HISTORY:
        </span>
        {profiles.map((p) => {
          const isSelected = p.id === selectedVersionId && !isEditing;
          return (
            <button
              key={p.id}
              onClick={() => {
                setSelectedVersionId(p.id);
                setIsEditing(false);
              }}
              className={`px-3 py-1.5 rounded-xs uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 shrink-0 cursor-pointer ${
                isSelected
                  ? 'bg-white text-black font-bold shadow-md'
                  : 'bg-[#0E0E0E] border border-[#2B2B2B] text-neutral-400 hover:text-white hover:border-neutral-500'
              }`}
            >
              <span>SPEC V{p.version}</span>
              {p.isLatest && (
                <span className="text-[7.5px] px-1 py-0.2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold rounded-2xs">
                  CURRENT
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Form or Read-only Display */}
      {isEditing ? (
        <form onSubmit={handleSaveNewVersion} className="space-y-8 animate-fadeIn">
          {/* Unit Switcher */}
          <div className="flex items-center justify-between bg-[#0E0E0E] border border-[#2B2B2B] p-4 rounded-sm">
            <div>
              <span className="text-[10px] text-white font-bold uppercase tracking-wider block">
                METRIC SYSTEM SELECTION
              </span>
              <span className="text-[9px] text-neutral-400 font-sans">
                Set base measurement unit for tailored pattern drafting.
              </span>
            </div>
            <div className="flex border border-[#2B2B2B] rounded-xs overflow-hidden text-[10px]">
              <button
                type="button"
                onClick={() => setUnit('cm')}
                className={`px-4 py-1.5 uppercase transition-colors ${
                  unit === 'cm' ? 'bg-white text-black font-bold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                CENTIMETRES (CM)
              </button>
              <button
                type="button"
                onClick={() => setUnit('inch')}
                className={`px-4 py-1.5 uppercase transition-colors ${
                  unit === 'inch' ? 'bg-white text-black font-bold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                INCHES (IN)
              </button>
            </div>
          </div>

          {/* Upper Body Matrix */}
          <div className="bg-[#0E0E0E] border border-[#2B2B2B] p-6 rounded-sm space-y-4">
            <span className="text-[10px] text-white font-bold uppercase tracking-widest block border-b border-[#2B2B2B] pb-2">
              UPPER TORSO & JACKET PROPORTIONS
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'NECK CIRCUMFERENCE', field: 'neck', val: measurements.neck },
                { label: 'SHOULDER BREADTH', field: 'shoulderWidth', val: measurements.shoulderWidth },
                { label: 'FULL CHEST', field: 'chest', val: measurements.chest },
                { label: 'NATURAL WAIST', field: 'waist', val: measurements.waist },
                { label: 'HIGH HIPS', field: 'hips', val: measurements.hips },
                { label: 'SLEEVE OUTSEAM', field: 'sleeveLength', val: measurements.sleeveLength },
                { label: 'BICEP BREADTH', field: 'bicep', val: measurements.bicep },
                { label: 'JACKET OVERALL LENGTH', field: 'jacketLength', val: measurements.jacketLength },
              ].map((item) => (
                <div key={item.field} className="space-y-1">
                  <label className="text-[8.5px] text-neutral-400 uppercase tracking-wider block">
                    {item.label} ({unit})
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={item.val || ''}
                    onChange={(e) => handleMetricChange(item.field, e.target.value)}
                    className="w-full bg-[#050505] border border-[#2B2B2B] focus:border-white p-2 rounded-xs text-white text-[11px] font-mono outline-none"
                    required
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Lower Body Matrix */}
          <div className="bg-[#0E0E0E] border border-[#2B2B2B] p-6 rounded-sm space-y-4">
            <span className="text-[10px] text-white font-bold uppercase tracking-widest block border-b border-[#2B2B2B] pb-2">
              TROUSER & LOWER BODY PROPORTIONS
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'TROUSER INSEAM', field: 'inseam', val: measurements.inseam },
                { label: 'OUTSEAM (WAIST TO HEM)', field: 'outseam', val: measurements.outseam },
                { label: 'THIGH GIRTH', field: 'thigh', val: measurements.thigh },
                { label: 'ANKLE HEM OPENING', field: 'ankle', val: measurements.ankle },
              ].map((item) => (
                <div key={item.field} className="space-y-1">
                  <label className="text-[8.5px] text-neutral-400 uppercase tracking-wider block">
                    {item.label} ({unit})
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={item.val || ''}
                    onChange={(e) => handleMetricChange(item.field, e.target.value)}
                    className="w-full bg-[#050505] border border-[#2B2B2B] focus:border-white p-2 rounded-xs text-white text-[11px] font-mono outline-none"
                    required
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Fit Preferences */}
          <div className="bg-[#0E0E0E] border border-[#2B2B2B] p-6 rounded-sm space-y-4">
            <span className="text-[10px] text-white font-bold uppercase tracking-widest block border-b border-[#2B2B2B] pb-2">
              FIT SILHOUETTE & DRAPE PREFERENCES
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[8.5px] text-neutral-400 uppercase tracking-wider block">
                  SILHOUETTE PROFILE
                </label>
                <select
                  value={fitPreferences.silhouette}
                  onChange={(e) =>
                    setFitPreferences((prev) => ({
                      ...prev,
                      silhouette: e.target.value as any,
                    }))
                  }
                  className="w-full bg-[#050505] border border-[#2B2B2B] focus:border-white p-2 rounded-xs text-white text-[10.5px] outline-none"
                >
                  <option value="Ultra Slim">Ultra Slim (Close contour)</option>
                  <option value="Slim">Slim (Structured suppression)</option>
                  <option value="Classic">Classic (Savile Row drape)</option>
                  <option value="Relaxed">Relaxed (Fluid ease)</option>
                  <option value="Oversized">Oversized (Architectural volume)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[8.5px] text-neutral-400 uppercase tracking-wider block">
                  SHOULDER CONSTRUCTION
                </label>
                <select
                  value={fitPreferences.shoulderPad}
                  onChange={(e) =>
                    setFitPreferences((prev) => ({
                      ...prev,
                      shoulderPad: e.target.value as any,
                    }))
                  }
                  className="w-full bg-[#050505] border border-[#2B2B2B] focus:border-white p-2 rounded-xs text-white text-[10.5px] outline-none"
                >
                  <option value="None">None (Neapolitan soft shirt shoulder)</option>
                  <option value="Light">Light (Natural roped roll)</option>
                  <option value="Structured">Structured (Formal British peak)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[8.5px] text-neutral-400 uppercase tracking-wider block">
                  TROUSER HEM BREAK
                </label>
                <select
                  value={fitPreferences.trouserBreak}
                  onChange={(e) =>
                    setFitPreferences((prev) => ({
                      ...prev,
                      trouserBreak: e.target.value as any,
                    }))
                  }
                  className="w-full bg-[#050505] border border-[#2B2B2B] focus:border-white p-2 rounded-xs text-white text-[10.5px] outline-none"
                >
                  <option value="No Break">No Break (Cropped modern line)</option>
                  <option value="Slight Break">Slight Break (Crisp graze at shoe lace)</option>
                  <option value="Medium Break">Medium Break (Timeless traditional)</option>
                  <option value="Full Break">Full Break (Deep puddle fold)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Special Posture Requirements */}
          <div className="bg-[#0E0E0E] border border-[#2B2B2B] p-6 rounded-sm space-y-4">
            <span className="text-[10px] text-white font-bold uppercase tracking-widest block border-b border-[#2B2B2B] pb-2">
              POSTURAL & ASYMMETRICAL NOTATIONS
            </span>
            <div className="space-y-2">
              {specialRequirements.map((req, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2.5 bg-black/60 border border-[#2B2B2B] rounded-xs text-[10px] text-neutral-300"
                >
                  <span>• {req}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveRequirement(i)}
                    className="text-rose-400 hover:text-rose-300 text-[9px] uppercase cursor-pointer"
                  >
                    [REMOVE]
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <input
                type="text"
                value={newRequirementText}
                onChange={(e) => setNewRequirementText(e.target.value)}
                placeholder="E.g., Right sleeve pitch rotated forward 1.0cm; drop right shoulder..."
                className="flex-grow bg-[#050505] border border-[#2B2B2B] focus:border-white p-2.5 rounded-xs text-white text-[10px] outline-none placeholder-neutral-700"
              />
              <button
                type="button"
                onClick={handleAddRequirement}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-[9.5px] uppercase font-bold tracking-widest rounded-xs cursor-pointer"
              >
                ADD NOTE
              </button>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="py-3 px-6 border border-[#2B2B2B] text-neutral-400 hover:text-white uppercase text-[10px] tracking-widest rounded-xs cursor-pointer"
            >
              DISCARD
            </button>
            <button
              type="submit"
              className="py-3 px-8 bg-white hover:bg-neutral-200 text-black text-[10px] font-bold tracking-widest uppercase rounded-xs transition-colors duration-200 cursor-pointer shadow-xl flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              AUTHENTICATE SPEC V{activeProfile ? activeProfile.version + 1 : 1}
            </button>
          </div>
        </form>
      ) : (
        /* Read-only Blueprint View */
        <div className="space-y-6">
          {/* Metadata Card */}
          <div className="bg-[#0E0E0E] border border-[#2B2B2B] p-6 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg text-white uppercase font-bold tracking-wider">
                  SPECIFICATION BLUEPRINT V{currentDisplayProfile?.version}
                </span>
                {currentDisplayProfile?.isLatest ? (
                  <span className="px-2 py-0.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[8px] uppercase tracking-widest font-bold rounded-2xs">
                    ACTIVE MASTER
                  </span>
                ) : (
                  <span className="px-2 py-0.5 bg-neutral-800 border border-neutral-700 text-neutral-400 text-[8px] uppercase tracking-widest font-bold rounded-2xs">
                    ARCHIVED HISTORICAL
                  </span>
                )}
              </div>
              <p className="text-[10px] text-neutral-400 font-sans">
                {currentDisplayProfile?.approvedAt ? (
                  <>
                    Approved & signed off by Master Tailor on{' '}
                    <span className="text-white font-mono">
                      {new Date(currentDisplayProfile.approvedAt).toLocaleDateString('en-GB')}
                    </span>
                  </>
                ) : (
                  <span className="text-amber-300">Pending Master Tailor Calico Toile Fitting verification.</span>
                )}
              </p>
            </div>

            <div className="text-[9px] text-neutral-500 uppercase tracking-widest text-right">
              <div>UNIT: {currentDisplayProfile?.measurements.unit.toUpperCase()}</div>
              <div>ID: {currentDisplayProfile?.id}</div>
            </div>
          </div>

          {/* Measurements Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {currentDisplayProfile &&
              Object.entries(currentDisplayProfile.measurements)
                .filter(([k]) => k !== 'unit')
                .map(([key, val]) => (
                  <div
                    key={key}
                    className="p-3 bg-black/60 border border-[#2B2B2B] rounded-xs space-y-1 text-left"
                  >
                    <span className="text-[8px] text-neutral-500 uppercase tracking-wider block">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </span>
                    <span className="text-base text-white font-mono font-bold tracking-wider">
                      {val}{' '}
                      <span className="text-[9px] text-neutral-400 font-normal">
                        {currentDisplayProfile.measurements.unit}
                      </span>
                    </span>
                  </div>
                ))}
          </div>

          {/* Fit Preferences & Posture */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0E0E0E] border border-[#2B2B2B] p-5 rounded-sm space-y-3">
              <span className="text-[9.5px] text-white uppercase font-bold tracking-widest block border-b border-[#2B2B2B] pb-2">
                FIT PROFILE PREFERENCES
              </span>
              <div className="space-y-2 text-[10px] text-neutral-300">
                <div className="flex justify-between">
                  <span className="text-neutral-500">SILHOUETTE:</span>
                  <span className="text-white font-bold">{currentDisplayProfile?.fitPreferences.silhouette}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">SHOULDER PAD:</span>
                  <span className="text-white font-bold">{currentDisplayProfile?.fitPreferences.shoulderPad}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">TROUSER BREAK:</span>
                  <span className="text-white font-bold">{currentDisplayProfile?.fitPreferences.trouserBreak}</span>
                </div>
              </div>
            </div>

            <div className="bg-[#0E0E0E] border border-[#2B2B2B] p-5 rounded-sm space-y-3">
              <span className="text-[9.5px] text-white uppercase font-bold tracking-widest block border-b border-[#2B2B2B] pb-2">
                POSTURAL ACCOMMODATIONS
              </span>
              {currentDisplayProfile && currentDisplayProfile.specialRequirements.length > 0 ? (
                <div className="space-y-1.5 text-[9.5px] text-neutral-300">
                  {currentDisplayProfile.specialRequirements.map((req, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-400">✓</span>
                      <span>{req}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[9px] text-neutral-500 italic">No postural asymmetries recorded.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerMeasurementsView;
