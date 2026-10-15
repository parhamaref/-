/**
 * @file QCNewSessionModal.tsx
 * Intake modal to commission a new Quality Control Inspection Session.
 */

import React, { useState } from 'react';
import { ShieldCheck, Plus, Package } from 'lucide-react';

interface QCNewSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateSession: (orderData: {
    orderId: string;
    clientName: string;
    garmentName: string;
    garmentSilhouette: string;
    partnerAtelier: string;
    orderTotal: number;
    inspectorName: string;
    inspectorId: string;
  }) => void;
}

export const QCNewSessionModal: React.FC<QCNewSessionModalProps> = ({
  isOpen,
  onClose,
  onCreateSession,
}) => {
  const [orderId, setOrderId] = useState(`ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [clientName, setClientName] = useState('Sir Reginald Thorne');
  const [garmentName, setGarmentName] = useState('Bespoke Charcoal Flannel 3-Piece Suit');
  const [garmentSilhouette, setGarmentSilhouette] = useState('Single-Breasted Notch Lapel Bespoke');
  const [partnerAtelier, setPartnerAtelier] = useState('Daniel’s Maison Master Atelier (Mayfair)');
  const [orderTotal, setOrderTotal] = useState(4950);
  const [inspectorName, setInspectorName] = useState('Madame Hélène Vautier (Senior QC Master)');
  const [inspectorId, setInspectorId] = useState('QC-LEAD-04');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateSession({
      orderId: orderId.trim(),
      clientName: clientName.trim(),
      garmentName: garmentName.trim(),
      garmentSilhouette: garmentSilhouette.trim(),
      partnerAtelier: partnerAtelier.trim(),
      orderTotal,
      inspectorName: inspectorName.trim(),
      inspectorId: inspectorId.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#0A0A0A] border border-[#2B2B2B] w-full max-w-xl p-6 rounded-xs space-y-5 text-left font-mono text-[11px] animate-scaleUp">
        <div className="flex justify-between items-center border-b border-[#222] pb-3">
          <div>
            <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest block">
              INTAKE PROTOCOL
            </span>
            <h3 className="font-serif text-lg text-white font-bold tracking-wider uppercase">
              COMMISSION NEW QC INSPECTION SESSION
            </h3>
          </div>
          <button onClick={onClose} className="text-neutral-500 hover:text-white text-base">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[9px] text-neutral-400 uppercase block mb-1">Order ID</label>
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full bg-black border border-[#333] text-white p-2 text-[10px] rounded-xs font-mono font-bold"
                required
              />
            </div>
            <div>
              <label className="text-[9px] text-neutral-400 uppercase block mb-1">Client Name</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full bg-black border border-[#333] text-white p-2 text-[10px] rounded-xs"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-[9px] text-neutral-400 uppercase block mb-1">Garment Title</label>
            <input
              type="text"
              value={garmentName}
              onChange={(e) => setGarmentName(e.target.value)}
              className="w-full bg-black border border-[#333] text-white p-2 text-[10px] rounded-xs font-serif font-bold"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[9px] text-neutral-400 uppercase block mb-1">Silhouette & Cut</label>
              <input
                type="text"
                value={garmentSilhouette}
                onChange={(e) => setGarmentSilhouette(e.target.value)}
                className="w-full bg-black border border-[#333] text-white p-2 text-[10px] rounded-xs"
                required
              />
            </div>
            <div>
              <label className="text-[9px] text-neutral-400 uppercase block mb-1">Partner Atelier</label>
              <select
                value={partnerAtelier}
                onChange={(e) => setPartnerAtelier(e.target.value)}
                className="w-full bg-black border border-[#333] text-white p-2 text-[10px] rounded-xs"
              >
                <option value="Daniel’s Maison Master Atelier (Mayfair)">
                  Daniel’s Maison Master Atelier (Mayfair)
                </option>
                <option value="Biella Craft Tailoring Studio (Biella, Italy)">
                  Biella Craft Tailoring Studio (Biella, Italy)
                </option>
                <option value="Atelier de Soie Lyon (Lyon, France)">
                  Atelier de Soie Lyon (Lyon, France)
                </option>
                <option value="Savile Row Heritage Tailors (London)">
                  Savile Row Heritage Tailors (London)
                </option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[9px] text-neutral-400 uppercase block mb-1">Garment Value (£)</label>
              <input
                type="number"
                value={orderTotal}
                onChange={(e) => setOrderTotal(parseFloat(e.target.value) || 0)}
                className="w-full bg-black border border-[#333] text-white p-2 text-[10px] rounded-xs font-mono"
                required
              />
            </div>
            <div>
              <label className="text-[9px] text-neutral-400 uppercase block mb-1">Assign Lead Auditor</label>
              <input
                type="text"
                value={inspectorName}
                onChange={(e) => setInspectorName(e.target.value)}
                className="w-full bg-black border border-[#333] text-white p-2 text-[10px] rounded-xs"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#222]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#333] text-neutral-400 hover:text-white rounded-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-white text-black font-bold uppercase rounded-xs hover:bg-neutral-200 transition-colors"
            >
              Initialize Inspection Dossier
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
