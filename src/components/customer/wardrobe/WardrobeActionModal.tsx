/**
 * @file WardrobeActionModal.tsx
 * Multi-Action Interactive Modal for the Daniel’s Maison Digital Wardrobe.
 * Implements 6 distinct customer workflows:
 * 1. Reorder Same Item
 * 2. Request Alteration
 * 3. Request Repair
 * 4. Request Care Service
 * 5. Request Cleaning Service
 * 6. Request Recreation Based On Existing Measurements
 */

import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Scissors,
  ShieldCheck,
  Sparkles,
  Droplets,
  RefreshCw,
  ShoppingBag,
  Truck,
  MapPin,
  Calendar,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { WardrobeItemFull, ServiceActionType } from '../../../types/wardrobe.types';
import { useWardrobeStore } from '../../../stores/wardrobeStore';
import { alterationStoreInstance } from '../../../stores/alterationStore';

interface WardrobeActionModalProps {
  item: WardrobeItemFull | null;
  isOpen: boolean;
  actionType: ServiceActionType | null;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export const WardrobeActionModal: React.FC<WardrobeActionModalProps> = ({
  item,
  isOpen,
  actionType,
  onClose,
  onSuccess,
}) => {
  const { reorderGarment, submitServiceRequest } = useWardrobeStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [instructions, setInstructions] = useState('');
  const [conciergePickup, setConciergePickup] = useState(true);
  const [pickupAddress, setPickupAddress] = useState(
    '14 Grosvenor Crescent, Belgravia, London SW1X 7EE'
  );
  const [preferredSalon, setPreferredSalon] = useState('Mayfair Salon & Workshop, London');
  const [urgency, setUrgency] = useState<'STANDARD' | 'EXPEDITED' | 'ROYAL_SALON'>('STANDARD');

  // Alteration specific
  const [targetedAreas, setTargetedAreas] = useState<string[]>(['Waist & Side-Seams']);
  const [fitDirection, setFitDirection] = useState<'TAKE_IN' | 'LET_OUT' | 'LENGTHEN' | 'SHORTEN'>(
    'TAKE_IN'
  );

  // Repair specific
  const [damageType, setDamageType] = useState<'SEAM_PULL' | 'BUTTON_LOST' | 'LINING_WEAR' | 'FABRIC_SNAG'>(
    'BUTTON_LOST'
  );

  // Recreation / Reorder specific
  const [recreationCloth, setRecreationCloth] = useState(
    'Super 160s Charcoal Flannel (Dormeuil Royal 11)'
  );
  const [repeatMeasurementsOk, setRepeatMeasurementsOk] = useState(true);
  const [monogramText, setMonogramText] = useState('A.S.F.');

  if (!isOpen || !item || !actionType) return null;

  const getActionTitle = () => {
    switch (actionType) {
      case 'REORDER_SAME_ITEM':
        return 'Reorder Bespoke Commission';
      case 'REQUEST_ALTERATION':
        return 'Request Fitting Alteration';
      case 'REQUEST_REPAIR':
        return 'Request Atelier Artisan Repair';
      case 'REQUEST_CARE_SERVICE':
        return 'Request Seasonal Care & Revival';
      case 'REQUEST_CLEANING_SERVICE':
        return 'Request Eco-Wet Care Cleaning';
      case 'REQUEST_RECREATION_MEASUREMENTS':
        return 'Recreate in New Cloth (Existing Measurements)';
    }
  };

  const getActionIcon = () => {
    switch (actionType) {
      case 'REORDER_SAME_ITEM':
        return <ShoppingBag className="w-5 h-5 text-amber-400" />;
      case 'REQUEST_ALTERATION':
        return <Scissors className="w-5 h-5 text-amber-400" />;
      case 'REQUEST_REPAIR':
        return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
      case 'REQUEST_CARE_SERVICE':
        return <Sparkles className="w-5 h-5 text-cyan-400" />;
      case 'REQUEST_CLEANING_SERVICE':
        return <Droplets className="w-5 h-5 text-blue-400" />;
      case 'REQUEST_RECREATION_MEASUREMENTS':
        return <RefreshCw className="w-5 h-5 text-purple-400" />;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (actionType === 'REORDER_SAME_ITEM') {
        const res = await reorderGarment(item.id, {
          repeatMeasurementsConfirmed: repeatMeasurementsOk,
          additionalLiningMonogram: monogramText,
          conciergeNotes: instructions,
        });
        onSuccess(res.message);
      } else {
        await submitServiceRequest({
          wardrobeItemId: item.id,
          actionType,
          specificInstructions: instructions || `Requested ${actionType.replace(/_/g, ' ')} via customer portal.`,
          conciergePickupRequested: conciergePickup,
          pickupAddress: conciergePickup ? pickupAddress : 'Client Drop-off',
          preferredFittingSalon: preferredSalon,
          urgencyLevel: urgency,
          alterationOptions:
            actionType === 'REQUEST_ALTERATION'
              ? { targetedAreas, fitDirection, adjustmentNotes: instructions }
              : undefined,
          repairOptions:
            actionType === 'REQUEST_REPAIR' ? { damageType } : undefined,
          recreationOptions:
            actionType === 'REQUEST_RECREATION_MEASUREMENTS'
              ? { newFabricSelected: recreationCloth, newColorHex: '#1E1E1E', keepIdenticalCut: true }
              : undefined,
        });

        if (actionType === 'REQUEST_ALTERATION') {
          try {
            await alterationStoreInstance.submitNewRequest({
              customerId: item.customerId || 'cust_001',
              customerName: item.customerName || 'Lord Alistair Sterling-Fox',
              wardrobeItemId: item.id,
              garmentName: item.garmentName,
              garmentCategory: item.category,
              garmentSilhouette: item.silhouetteStyle,
              garmentSerial: item.warranty?.certificateSerialNumber || 'DAN-2024',
              primaryImageUrl: item.primaryImageUrl,
              originalPriceGbp: item.originalPriceGbp,
              originalTailorName: item.masterTailorName,
              fitChanges: targetedAreas.map((area, i) => ({
                id: `fc_${Date.now()}_${i}`,
                region: 'WAIST_SUPPRESSION',
                regionLabel: area,
                direction: fitDirection,
                directionLabel: fitDirection.replace(/_/g, ' '),
                deltaCm: fitDirection === 'TAKE_IN' || fitDirection === 'SHORTEN' ? -1.0 : 1.0,
                issueDescription: instructions || `Adjust ${area}`,
              })),
              alterationNotes: instructions || 'Fitting adjustments requested from wardrobe card',
              urgencyLevel: urgency,
              photos: [
                {
                  id: `photo_${Date.now()}`,
                  url: item.primaryImageUrl,
                  angle: 'FRONT',
                  caption: 'Garment reference photograph',
                  uploadedAt: new Date().toISOString(),
                },
              ],
              conciergePickup,
              pickupAddress: conciergePickup ? pickupAddress : 'Client Drop-off',
              deliveryAddress: conciergePickup ? pickupAddress : 'Client Collection',
              preferredSalon,
            });
          } catch {}
        }

        onSuccess(
          `Service request for "${item.garmentName}" submitted successfully. White-glove concierge is notified.`
        );
      }
      onClose();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error submitting request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0D0D0D] border border-[#2B2B2B] rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl text-left font-mono">
        {/* Header */}
        <div className="p-6 border-b border-[#222] bg-[#121212] flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
              {getActionIcon()}
            </div>
            <div>
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest block">
                ATELIER STEWARDSHIP ACTION
              </span>
              <h3 className="font-serif text-lg font-bold text-white uppercase tracking-wider">
                {getActionTitle()}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Garment Summary Strip */}
          <div className="p-3.5 rounded-xl bg-[#141414] border border-[#262626] flex items-center gap-3">
            <img
              src={item.primaryImageUrl}
              alt={item.garmentName}
              className="w-12 h-16 object-cover rounded-lg border border-neutral-800 shrink-0"
            />
            <div className="space-y-0.5 overflow-hidden">
              <span className="text-[10px] text-neutral-400 font-mono block">
                {item.category} • {item.originalOrderId}
              </span>
              <span className="text-white font-bold text-sm truncate block">
                {item.garmentName}
              </span>
              <span className="text-[10px] text-amber-300 font-mono block">
                {item.material.fabricMillName} • Master Tailor {item.masterTailorName}
              </span>
            </div>
          </div>

          {/* ACTION 1: REORDER SAME ITEM */}
          {actionType === 'REORDER_SAME_ITEM' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/30 text-amber-300/90 text-xs font-sans leading-relaxed">
                Reordering crafts an identical garment utilizing your exact biometric paper patterns
                already archived in the Mayfair atelier cutting vault.
              </div>

              <div className="p-4 rounded-xl bg-[#141414] border border-[#222] space-y-2">
                <label className="flex items-center gap-2 cursor-pointer text-white font-bold">
                  <input
                    type="checkbox"
                    checked={repeatMeasurementsOk}
                    onChange={(e) => setRepeatMeasurementsOk(e.target.checked)}
                    className="w-4 h-4 accent-amber-500 rounded"
                  />
                  <span>Confirm using active Bespoke Fit Profile (No measurement changes)</span>
                </label>
                <p className="text-[11px] text-neutral-400 font-sans pl-6">
                  If your measurements have changed, you may request a basted fitting session at our salon.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                  Custom Silk Lining Monogram (Optional)
                </label>
                <input
                  type="text"
                  value={monogramText}
                  onChange={(e) => setMonogramText(e.target.value)}
                  placeholder="e.g. A.S.F. or Initials"
                  className="w-full bg-[#121212] border border-[#333] px-3.5 py-2.5 rounded-xl text-white font-mono focus:outline-none focus:border-amber-500/60"
                />
              </div>
            </div>
          )}

          {/* ACTION 2: REQUEST ALTERATION */}
          {actionType === 'REQUEST_ALTERATION' && (
            <div className="space-y-4">
              <div>
                <label className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-2">
                  Targeted Adjustment Areas
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    'Waist & Side-Seams',
                    'Sleeve Length',
                    'Trouser Inseam / Hem',
                    'Chest & Lapel Stance',
                    'Trouser Waistband',
                    'Shoulder Pad Softening',
                  ].map((area) => {
                    const isChecked = targetedAreas.includes(area);
                    return (
                      <button
                        type="button"
                        key={area}
                        onClick={() => {
                          if (isChecked) {
                            setTargetedAreas(targetedAreas.filter((a) => a !== area));
                          } else {
                            setTargetedAreas([...targetedAreas, area]);
                          }
                        }}
                        className={`p-2.5 rounded-lg border text-left transition-colors ${
                          isChecked
                            ? 'bg-amber-500/15 border-amber-500/50 text-white font-bold'
                            : 'bg-[#141414] border-[#252525] text-neutral-400 hover:text-white'
                        }`}
                      >
                        {area}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-2">
                  Adjustment Direction
                </label>
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  {[
                    { id: 'TAKE_IN', label: 'Take In / Slim' },
                    { id: 'LET_OUT', label: 'Let Out / Ease' },
                    { id: 'SHORTEN', label: 'Shorten' },
                    { id: 'LENGTHEN', label: 'Lengthen' },
                  ].map((dir) => (
                    <button
                      type="button"
                      key={dir.id}
                      onClick={() => setFitDirection(dir.id as any)}
                      className={`py-2 rounded-lg border transition-colors ${
                        fitDirection === dir.id
                          ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 font-bold'
                          : 'bg-[#141414] border-[#252525] text-neutral-400'
                      }`}
                    >
                      {dir.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ACTION 3: REQUEST REPAIR */}
          {actionType === 'REQUEST_REPAIR' && (
            <div className="space-y-4">
              <div>
                <label className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-2">
                  Type of Damage or Mending Required
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'BUTTON_LOST', label: 'Horn / MOP Button Lost / Re-anchor' },
                    { id: 'SEAM_PULL', label: 'Seam Separation / Stitches Loosened' },
                    { id: 'LINING_WEAR', label: 'Inner Silk Lining Wear / Abrasion' },
                    { id: 'FABRIC_SNAG', label: 'Fabric Snag / Invisible Reweave' },
                  ].map((dmg) => (
                    <button
                      type="button"
                      key={dmg.id}
                      onClick={() => setDamageType(dmg.id as any)}
                      className={`p-3 rounded-lg border text-left transition-colors ${
                        damageType === dmg.id
                          ? 'bg-emerald-500/15 border-emerald-500/50 text-white font-bold'
                          : 'bg-[#141414] border-[#252525] text-neutral-400'
                      }`}
                    >
                      {dmg.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs rounded-xl font-sans">
                Complimentary lifetime seam and button repairs are fully included under your Daniel’s Maison covenant.
              </div>
            </div>
          )}

          {/* ACTION 4: REQUEST CARE SERVICE */}
          {actionType === 'REQUEST_CARE_SERVICE' && (
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-200 text-xs font-sans leading-relaxed">
                <strong className="text-white block mb-1">Seasonal Atelier Care Protocol:</strong>
                Includes ultrasonic mist fibre relaxation, hand boar-bristle nap alignment, bespoke pressing on curved tailoring bucks, and organic red cedar conditioning.
              </div>
            </div>
          )}

          {/* ACTION 5: REQUEST CLEANING SERVICE */}
          {actionType === 'REQUEST_CLEANING_SERVICE' && (
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-200 text-xs font-sans leading-relaxed">
                <strong className="text-white block mb-1">Ecological Solvent-Free Wet-Care:</strong>
                Never exposes luxury worsteds, vicuña, or silks to harsh commercial dry-cleaning chemicals (perchloroethylene). Re-hydrates natural lanolin in wool fibers.
              </div>
            </div>
          )}

          {/* ACTION 6: REQUEST RECREATION MEASUREMENTS */}
          {actionType === 'REQUEST_RECREATION_MEASUREMENTS' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-200 text-xs font-sans leading-relaxed">
                <strong className="text-white block mb-1">Sister Garment Recreation:</strong>
                Duplicate the perfected bespoke silhouette and balance of this garment in a new luxury textile bolt of your choice.
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                  Select New Fabric Bolt
                </label>
                <select
                  value={recreationCloth}
                  onChange={(e) => setRecreationCloth(e.target.value)}
                  className="w-full bg-[#121212] border border-[#333] px-3.5 py-2.5 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-purple-500"
                >
                  <option value="Super 160s Charcoal Flannel (Dormeuil Royal 11)">
                    Dormeuil Royal 11 Super 160s Charcoal Flannel (310g)
                  </option>
                  <option value="Loro Piana Tasmanian 150s Midnight Barathea (280g)">
                    Loro Piana Tasmanian 150s Midnight Barathea (280g)
                  </option>
                  <option value="Fox Brothers Glen Plaid Heritage Worsted (340g)">
                    Fox Brothers Glen Plaid Heritage Worsted (340g)
                  </option>
                  <option value="Irish Heritage Heavyweight Linen in Forest Olive (380g)">
                    Irish Heritage Heavyweight Linen in Forest Olive (380g)
                  </option>
                  <option value="Scabal Diamond Chip Silk Blend in Obsidian Black (260g)">
                    Scabal Diamond Chip Silk Blend in Obsidian Black (260g)
                  </option>
                </select>
              </div>
            </div>
          )}

          {/* Common Field: Specific Instructions */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-neutral-400 uppercase tracking-wider block">
              Specific Tailoring & Fitting Notes
            </label>
            <textarea
              rows={3}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Please take in jacket waist 1.0cm; trouser hem length is perfect. Prepare for Friday evening black-tie gala."
              className="w-full bg-[#121212] border border-[#333] p-3 rounded-xl text-white placeholder:text-neutral-600 font-sans text-xs focus:outline-none focus:border-amber-500/60"
            />
          </div>

          {/* White-glove Courier Protocol */}
          {actionType !== 'REORDER_SAME_ITEM' && (
            <div className="p-4 rounded-xl bg-[#141414] border border-[#222] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white font-bold text-xs">
                  <Truck className="w-4 h-4 text-amber-400" />
                  <span>White-Glove Concierge Trunk Pickup</span>
                </div>
                <input
                  type="checkbox"
                  checked={conciergePickup}
                  onChange={(e) => setConciergePickup(e.target.checked)}
                  className="w-4 h-4 accent-amber-500 cursor-pointer"
                />
              </div>

              {conciergePickup && (
                <div className="space-y-1.5 pt-1 border-t border-[#222]">
                  <label className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                    Collection Residence Address
                  </label>
                  <input
                    type="text"
                    value={pickupAddress}
                    onChange={(e) => setPickupAddress(e.target.value)}
                    className="w-full bg-[#121212] border border-[#333] px-3 py-2 rounded-lg text-white font-sans text-xs focus:outline-none"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
                <div>
                  <label className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1">
                    Atelier Destination Salon
                  </label>
                  <select
                    value={preferredSalon}
                    onChange={(e) => setPreferredSalon(e.target.value)}
                    className="w-full bg-[#121212] border border-[#333] px-2.5 py-1.5 rounded-lg text-neutral-200 text-xs focus:outline-none"
                  >
                    <option value="Mayfair Salon & Workshop, London">Mayfair Salon, London</option>
                    <option value="Savile Row Bespoke Studio, London">Savile Row Studio, London</option>
                    <option value="Place Vendôme Atelier, Paris">Place Vendôme, Paris</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1">
                    Priority Dispatch Tier
                  </label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value as any)}
                    className="w-full bg-[#121212] border border-[#333] px-2.5 py-1.5 rounded-lg text-amber-300 text-xs focus:outline-none"
                  >
                    <option value="STANDARD">Standard Turnaround (5–7 days)</option>
                    <option value="EXPEDITED">Expedited Priority (48–72 hours)</option>
                    <option value="ROYAL_SALON">Same-Day Royal Salon (24 hours)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Footer Submit Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#222]">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 border border-neutral-700 hover:border-neutral-500 text-neutral-300 text-xs rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
            >
              {isSubmitting ? 'Registering with Atelier...' : 'Submit Request →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
