/**
 * @file OrderAssignmentModal.tsx
 * Single Source of Truth assignment modal for assigning verified partner ateliers
 * to approved orders and establishing production deadlines.
 */

import React, { useState } from 'react';
import { Order, Partner, ProductionJob } from '../../types/daniels.types';
import { MOCK_PARTNERS, MOCK_PRODUCTS, MOCK_CUSTOMERS } from '../../mock/danielsMockData';
import { logAuditAction } from '../../utils/rbac';
import { useAuth } from '../../contexts/AuthContext';
import { X, Building, Calendar, Check, ShieldCheck, Scissors, Sparkles, Clock } from 'lucide-react';

interface OrderAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onAssignPartner: (
    orderId: string,
    partnerId: string,
    deadlines: { startExpected: string; targetFinish: string },
    notes: string
  ) => void;
}

export const OrderAssignmentModal: React.FC<OrderAssignmentModalProps> = ({
  isOpen,
  onClose,
  order,
  onAssignPartner,
}) => {
  const { currentUser } = useAuth();

  // Filter only verified partner ateliers
  const verifiedPartners = MOCK_PARTNERS.filter((p) => p.verificationStatus === 'Verified');

  const [selectedPartnerId, setSelectedPartnerId] = useState<string>(
    order?.partnerId || verifiedPartners[0]?.id || ''
  );
  const [startDate, setStartDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [finishDate, setFinishDate] = useState<string>(
    order?.dates.due ? order.dates.due.split('T')[0] : '2026-11-15'
  );
  const [atelierInstructions, setAtelierInstructions] = useState<string>(
    'Cold press finish and preserve 1.2cm shoulder roll asymmetry balance. Baste forward fitting canvas before collar closure.'
  );
  const [successState, setSuccessState] = useState(false);

  if (!isOpen || !order) return null;

  const product = MOCK_PRODUCTS.find((p) => p.id === order.productId) || MOCK_PRODUCTS[0];
  const customer = MOCK_CUSTOMERS.find((c) => c.id === order.customerId) || MOCK_CUSTOMERS[0];
  const activePartner = verifiedPartners.find((p) => p.id === selectedPartnerId) || verifiedPartners[0];

  const handleAssignmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPartnerId) return;

    onAssignPartner(
      order.id,
      selectedPartnerId,
      { startExpected: startDate, targetFinish: finishDate },
      atelierInstructions
    );

    // Record audit event
    logAuditAction(
      currentUser,
      'Orders',
      'edit',
      'ALLOWED',
      order.id,
      `Assigned verified partner atelier '${selectedPartnerId}' to order ${order.id}. Due date: ${finishDate}`
    );

    setSuccessState(true);
    setTimeout(() => {
      setSuccessState(false);
      onClose();
    }, 2000);
  };

  return (
    <div
      id="order-assignment-modal-backdrop"
      className="fixed inset-0 z-50 bg-[#050505]/85 backdrop-blur-md flex items-center justify-center p-4 font-mono text-left animate-fadeIn"
    >
      <div className="bg-[#0E0E0E] border border-[#2B2B2B] max-w-xl w-full rounded-sm shadow-2xl p-6 sm:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="border-b border-[#2B2B2B] pb-4 space-y-1">
          <div className="flex items-center gap-2 text-neutral-400 text-[9px] uppercase tracking-widest">
            <Building className="w-3.5 h-3.5 text-white" />
            <span>OPERATIONAL PARTNER ALLOCATION</span>
          </div>
          <h2 className="font-serif text-2xl text-white uppercase font-bold tracking-wider">
            ATELIER JOB DISPATCH
          </h2>
          <p className="text-[10.5px] text-neutral-400 font-sans">
            Delegate commission <span className="text-white font-bold">{order.id}</span> to a verified artisan workshop.
          </p>
        </div>

        {successState ? (
          <div className="py-12 text-center space-y-3 animate-fadeIn">
            <div className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center mx-auto shadow-2xl">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <h3 className="font-serif text-xl text-white uppercase tracking-wider font-bold">
              ATELIER ASSIGNMENT SEALED
            </h3>
            <p className="text-[11px] text-neutral-400 font-sans max-w-md mx-auto leading-relaxed">
              Order {order.id} routed to {activePartner?.businessDetails.legalBusinessName}. Production schedule and spec dockets synced to workshop portal.
            </p>
          </div>
        ) : (
          <form onSubmit={handleAssignmentSubmit} className="space-y-5">
            {/* Order & Client Context */}
            <div className="p-4 bg-black/60 border border-[#2B2B2B] rounded-xs grid grid-cols-2 gap-3 text-[10px]">
              <div>
                <span className="text-neutral-500 uppercase block text-[8px]">GARMENT:</span>
                <span className="text-white font-bold block truncate">{product.name}</span>
                <span className="text-neutral-400 text-[8.5px] block truncate">
                  Client: {customer.profile.firstName} {customer.profile.lastName} ({customer.vipLevel})
                </span>
              </div>
              <div className="text-right">
                <span className="text-neutral-500 uppercase block text-[8px]">COMMISSION VALUE:</span>
                <span className="text-white font-mono font-bold block">
                  £{order.pricing.total.toLocaleString()}
                </span>
                <span className="text-emerald-400 text-[8.5px] block font-bold">
                  Status: {order.status}
                </span>
              </div>
            </div>

            {/* Partner Selection */}
            <div className="space-y-1.5">
              <label className="text-[8.5px] text-neutral-400 uppercase tracking-wider block">
                SELECT VERIFIED PARTNER ATELIER
              </label>
              <select
                value={selectedPartnerId}
                onChange={(e) => setSelectedPartnerId(e.target.value)}
                className="w-full bg-[#050505] border border-[#2B2B2B] focus:border-white p-2.5 rounded-xs text-white text-[11px] outline-none"
                required
              >
                {verifiedPartners.map((ptnr) => (
                  <option key={ptnr.id} value={ptnr.id}>
                    {ptnr.businessDetails.legalBusinessName} — {ptnr.businessDetails.address.city}, {ptnr.businessDetails.address.country} (Cap: {ptnr.capabilities.capacityPerMonth}/mo)
                  </option>
                ))}
              </select>
            </div>

            {/* Selected Partner Details Pill */}
            {activePartner && (
              <div className="p-3 bg-black border border-[#2B2B2B] rounded-xs space-y-1 text-[9.5px]">
                <div className="flex justify-between">
                  <span className="text-neutral-500 uppercase">CRAFT SPECIALTIES:</span>
                  <span className="text-neutral-300 truncate max-w-[280px]">
                    {activePartner.capabilities.craftSpecialties.join(' • ')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500 uppercase">LEAD TIME:</span>
                  <span className="text-emerald-400 font-bold">
                    {activePartner.capabilities.leadTimeDays} DAYS STANDARD
                  </span>
                </div>
              </div>
            )}

            {/* Deadlines Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[10px]">
              <div className="space-y-1">
                <label className="text-[8.5px] text-neutral-400 uppercase tracking-wider block">
                  TARGET CUTTING COMMENCEMENT
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-[#050505] border border-[#2B2B2B] focus:border-white p-2 rounded-xs text-white text-[10.5px] outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[8.5px] text-neutral-400 uppercase tracking-wider block">
                  FINAL COMPLETION DEADLINE
                </label>
                <input
                  type="date"
                  value={finishDate}
                  onChange={(e) => setFinishDate(e.target.value)}
                  className="w-full bg-[#050505] border border-[#2B2B2B] focus:border-white p-2 rounded-xs text-white text-[10.5px] outline-none"
                  required
                />
              </div>
            </div>

            {/* Workshop Instructions */}
            <div className="space-y-1">
              <label className="text-[8.5px] text-neutral-400 uppercase tracking-wider block">
                ATELIER CUTTING & PAD-STITCHING DIRECTIVES
              </label>
              <textarea
                rows={3}
                value={atelierInstructions}
                onChange={(e) => setAtelierInstructions(e.target.value)}
                className="w-full bg-[#050505] border border-[#2B2B2B] focus:border-white p-2.5 rounded-xs text-white text-[10px] outline-none placeholder-neutral-700"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-4 border border-[#2B2B2B] text-neutral-400 hover:text-white uppercase text-[9.5px] rounded-xs cursor-pointer"
              >
                DISCARD
              </button>
              <button
                type="submit"
                className="py-2.5 px-6 bg-white hover:bg-neutral-200 text-black text-[9.5px] font-bold tracking-widest uppercase rounded-xs transition-colors cursor-pointer shadow-lg flex items-center gap-2"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                DISPATCH TO WORKSHOP
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default OrderAssignmentModal;
