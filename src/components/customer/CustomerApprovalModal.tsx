/**
 * @file CustomerApprovalModal.tsx
 * Modal for Bespoke Customisation Specification Review & Formal Design Approval.
 * Records formal client approval, timestamp, and immutable spec version.
 */

import React, { useState } from 'react';
import { Order, Product, OrderPersonalisation } from '../../types/daniels.types';
import { MOCK_PRODUCTS, MOCK_MEASUREMENT_PROFILES } from '../../mock/danielsMockData';
import { X, CheckCircle2, ShieldCheck, Sparkles, Scissors, FileText, Check } from 'lucide-react';

export interface CustomerApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  order?: Order | null;
  product?: Product | null;
  customerName?: string;
  onApprove?: (approvalData: {
    approvedBy: string;
    approvedAt: string;
    specVersion: number;
    personalisation: OrderPersonalisation;
  }) => void;
}

export const CustomerApprovalModal: React.FC<CustomerApprovalModalProps> = ({
  isOpen,
  onClose,
  order,
  product = MOCK_PRODUCTS[0],
  customerName = 'Lord Alistair Sterling-Fox',
  onApprove,
}) => {
  const activeProduct = product || MOCK_PRODUCTS[0];
  const activeProfile = MOCK_MEASUREMENT_PROFILES.find((p) => p.isLatest) || MOCK_MEASUREMENT_PROFILES[0];

  // Bespoke customisation options state
  const [selectedMaterial, setSelectedMaterial] = useState<string>(
    activeProduct.materials[0]?.name || 'Dormeuil Royal 11 Dover Wool'
  );
  const [selectedColour, setSelectedColour] = useState<string>(
    activeProduct.colours[0]?.name || 'Soot Charcoal'
  );
  const [monogram, setMonogram] = useState<string>(order?.personalisation.monogram || 'A.S.F.');
  const [monogramFont, setMonogramFont] = useState<string>(
    order?.personalisation.monogramFont || 'Classic Serif Roman'
  );
  const [liningFabric, setLiningFabric] = useState<string>(
    order?.personalisation.liningFabric || 'Bemberg Cupro Jacquard Monogram'
  );
  const [buttonSelection, setButtonSelection] = useState<string>(
    order?.personalisation.buttonSelection || 'Matte Black Buffalo Horn'
  );
  const [specialInstructions, setSpecialInstructions] = useState<string>(
    order?.personalisation.specialInstructions ||
      'Hand-sewn horn buttonholes with Milanese silk gimp cord.'
  );

  const [confirmedDeclaration, setConfirmedDeclaration] = useState<boolean>(false);
  const [approvedState, setApprovedState] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleFormalApproval = () => {
    if (!confirmedDeclaration) return;

    const approvalData = {
      approvedBy: customerName,
      approvedAt: new Date().toISOString(),
      specVersion: activeProfile.version,
      personalisation: {
        monogram,
        monogramFont,
        liningFabric,
        buttonSelection,
        customMeasurementsProfileId: activeProfile.id,
        specialInstructions,
      },
    };

    setApprovedState(true);

    if (onApprove) {
      onApprove(approvalData);
    }

    setTimeout(() => {
      onClose();
      setApprovedState(false);
    }, 2500);
  };

  return (
    <div
      id="customer-approval-modal-backdrop"
      className="fixed inset-0 z-50 bg-[#050505]/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto font-mono text-left animate-fadeIn"
    >
      <div className="bg-[#0E0E0E] border border-[#2B2B2B] max-w-2xl w-full rounded-sm shadow-2xl p-6 sm:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="border-b border-[#2B2B2B] pb-4 space-y-1">
          <div className="flex items-center gap-2 text-neutral-400 text-[9.5px] uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>BESPOKE COMMISSION VALIDATION</span>
          </div>
          <h2 className="font-serif text-2xl text-white uppercase font-bold tracking-wider">
            FORMAL DESIGN SPEC APPROVAL
          </h2>
          <p className="text-[10.5px] text-neutral-400 font-sans">
            Review fabrications, bespoke details, and bind anatomical Spec V{activeProfile.version} into production dockets.
          </p>
        </div>

        {approvedState ? (
          <div className="py-12 text-center space-y-4 animate-fadeIn">
            <div className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center mx-auto shadow-2xl">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <h3 className="font-serif text-2xl text-white uppercase tracking-widest font-bold">
              COMMISSION SPEC SEALED & APPROVED
            </h3>
            <p className="text-[11px] text-neutral-400 font-sans max-w-md mx-auto leading-relaxed">
              Recorded by <span className="text-white font-bold">{customerName}</span> at{' '}
              <span className="font-mono text-white">{new Date().toLocaleTimeString()}</span>. Docket transmitted to the master cutter at Atelier Biella.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Garment Identification */}
            <div className="p-4 bg-black/60 border border-[#2B2B2B] rounded-xs flex justify-between items-center text-[10px]">
              <div>
                <span className="text-neutral-500 uppercase block">GARMENT:</span>
                <span className="font-serif text-base text-white uppercase font-bold">
                  {activeProduct.name}
                </span>
                <span className="text-[9px] text-neutral-400 block font-sans">
                  {activeProduct.collection}
                </span>
              </div>
              <div className="text-right">
                <span className="text-neutral-500 uppercase block">MEASUREMENT SPEC:</span>
                <span className="text-emerald-400 font-bold tracking-widest uppercase">
                  ACTIVE PROFILE V{activeProfile.version}
                </span>
                <span className="text-[8.5px] text-neutral-500 block">ID: {activeProfile.id}</span>
              </div>
            </div>

            {/* Bespoke Option Selectors */}
            <div className="space-y-4">
              <span className="text-[10px] text-white font-bold uppercase tracking-widest block border-b border-[#2B2B2B] pb-1">
                MATERIAL & TEXTILE ARCHIVE
              </span>

              {/* Material selection */}
              <div className="space-y-1.5">
                <label className="text-[8.5px] text-neutral-400 uppercase tracking-wider block">
                  SELECTED CLOTH
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeProduct.materials.map((mat) => {
                    const isSelected = selectedMaterial === mat.name;
                    return (
                      <button
                        type="button"
                        key={mat.name}
                        onClick={() => setSelectedMaterial(mat.name)}
                        className={`p-2.5 rounded-xs border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-white/10 border-white text-white'
                            : 'bg-black/40 border-[#2B2B2B] text-neutral-400 hover:text-white'
                        }`}
                      >
                        <div className="text-[10px] font-bold uppercase truncate">{mat.name}</div>
                        <div className="text-[8.5px] text-neutral-500 truncate">{mat.composition}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Colour Palette */}
              <div className="space-y-1.5 pt-2">
                <label className="text-[8.5px] text-neutral-400 uppercase tracking-wider block">
                  HERITAGE COLOURWAY
                </label>
                <div className="flex gap-2">
                  {activeProduct.colours.map((col) => {
                    const isSelected = selectedColour === col.name;
                    return (
                      <button
                        type="button"
                        key={col.name}
                        onClick={() => setSelectedColour(col.name)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-xs border text-[9.5px] uppercase transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-white text-black border-white font-bold'
                            : 'bg-black border-[#2B2B2B] text-neutral-400 hover:text-white'
                        }`}
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-neutral-600 inline-block"
                          style={{ backgroundColor: col.hex }}
                        />
                        <span>{col.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Personalisation Specifications */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <label className="text-[8.5px] text-neutral-400 uppercase tracking-wider block">
                    MONOGRAM INITIALS
                  </label>
                  <input
                    type="text"
                    maxLength={10}
                    value={monogram}
                    onChange={(e) => setMonogram(e.target.value.toUpperCase())}
                    placeholder="E.g., A.S.F."
                    className="w-full bg-[#050505] border border-[#2B2B2B] focus:border-white p-2 rounded-xs text-white text-[11px] font-mono uppercase outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[8.5px] text-neutral-400 uppercase tracking-wider block">
                    TYPOGRAPHY STYLIST
                  </label>
                  <select
                    value={monogramFont}
                    onChange={(e) => setMonogramFont(e.target.value)}
                    className="w-full bg-[#050505] border border-[#2B2B2B] focus:border-white p-2 rounded-xs text-white text-[10px] outline-none"
                  >
                    <option value="Classic Serif Roman">Classic Serif Roman (Subtle Under-Lapel)</option>
                    <option value="Archival French Script">Archival French Script (Crest Pocket)</option>
                    <option value="Minimalist Linear Mono">Minimalist Linear Mono (Jacket Facing)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[8.5px] text-neutral-400 uppercase tracking-wider block">
                    BUTTONS & HARDWARE
                  </label>
                  <select
                    value={buttonSelection}
                    onChange={(e) => setButtonSelection(e.target.value)}
                    className="w-full bg-[#050505] border border-[#2B2B2B] focus:border-white p-2 rounded-xs text-white text-[10px] outline-none"
                  >
                    <option value="Matte Black Buffalo Horn">Matte Black Buffalo Horn (Unpolished)</option>
                    <option value="Smoked Mother of Pearl">Smoked Mother of Pearl (Australian Sea Shell)</option>
                    <option value="Antiqued Sterling Silver">Antiqued Sterling Silver (Hand-Cast Crest)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[8.5px] text-neutral-400 uppercase tracking-wider block">
                    INTERIOR LINING WEAVE
                  </label>
                  <select
                    value={liningFabric}
                    onChange={(e) => setLiningFabric(e.target.value)}
                    className="w-full bg-[#050505] border border-[#2B2B2B] focus:border-white p-2 rounded-xs text-white text-[10px] outline-none"
                  >
                    <option value="Bemberg Cupro Jacquard Monogram">Bemberg Cupro Jacquard Monogram</option>
                    <option value="Pure Silk Twill Noir">Pure Silk Twill Noir (Heavy 18mm)</option>
                    <option value="Tone-on-tone French Navy Twill">Tone-on-tone French Navy Twill</option>
                  </select>
                </div>
              </div>

              {/* Special tailor notes */}
              <div className="space-y-1 pt-1">
                <label className="text-[8.5px] text-neutral-400 uppercase tracking-wider block">
                  MASTER TAILOR COMMISSIONS MEMORANDUM
                </label>
                <textarea
                  rows={2}
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="Special instructions for lapel roll, roped shoulder pitch, or pocket depth..."
                  className="w-full bg-[#050505] border border-[#2B2B2B] focus:border-white p-2.5 rounded-xs text-white text-[10px] outline-none placeholder-neutral-700"
                />
              </div>
            </div>

            {/* Formal Declaration Checkbox */}
            <div className="p-4 bg-black border border-[#2B2B2B] rounded-xs space-y-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={confirmedDeclaration}
                  onChange={(e) => setConfirmedDeclaration(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded-xs border-[#2B2B2B] accent-white cursor-pointer"
                />
                <span className="text-[10px] text-neutral-300 font-sans leading-relaxed">
                  I formally approve this bespoke specification docket, authorizing Daniel’s Maison
                  and Atelier Biella to initiate cloth shearing and canvas pad-stitching per
                  Measurement Spec <span className="text-white font-mono font-bold">V{activeProfile.version}</span>.
                </span>
              </label>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="py-3 px-5 border border-[#2B2B2B] text-neutral-400 hover:text-white uppercase text-[10px] tracking-widest rounded-xs cursor-pointer"
              >
                CLOSE
              </button>
              <button
                type="button"
                onClick={handleFormalApproval}
                disabled={!confirmedDeclaration}
                className="py-3 px-8 bg-white hover:bg-neutral-200 disabled:bg-neutral-800 disabled:text-neutral-500 text-black text-[10px] font-bold tracking-widest uppercase rounded-xs transition-colors duration-200 flex items-center gap-2 cursor-pointer shadow-xl"
              >
                <ShieldCheck className="w-4 h-4" />
                SEAL DESIGN APPROVAL
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerApprovalModal;
