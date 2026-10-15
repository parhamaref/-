/**
 * @file OrderDetailModal.tsx
 * Full-fidelity drawer modal for bespoke order inspection:
 * Status progression bar, customer measurements audit, customization specs,
 * clarification threads, internal atelier notes, and shipping logistics.
 */

import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  Ban,
  MessageSquare,
  Ruler,
  Sliders,
  Truck,
  User,
  Calendar,
  DollarSign,
  ChevronRight,
  Send,
  Plus,
  Clock,
  ArrowRight,
  ShieldCheck,
  Package,
  Flame,
} from 'lucide-react';
import {
  DesignerOrder,
  DesignerOrderStatus,
  OrderShippingInfo,
} from '../../../types/designerOrder.types';
import { convertMeasurement } from '../../../utils/measurementValidationEngine';
import { useDesignerStore } from '../../../stores/designerStore';

export interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: DesignerOrder | null;
  onAccept: (orderId: string) => void;
  onReject: (orderId: string) => void;
  onClarification: (orderId: string) => void;
  onStatusChange: (orderId: string, nextStatus: DesignerOrderStatus) => void;
  onUpdateShipping: (orderId: string, shipping: Partial<OrderShippingInfo>) => void;
  onAddNote: (orderId: string, note: string) => void;
  onSendDirectMessage: (orderId: string, message: string) => void;
}

type DetailTab = 'overview' | 'measurements' | 'customizations' | 'clarifications' | 'shipping';

const STATUS_PROGRESSION: DesignerOrderStatus[] = [
  'Pending',
  'Accepted',
  'In Production',
  'Quality Control',
  'Ready To Ship',
  'Shipped',
  'Delivered',
];

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  isOpen,
  onClose,
  order,
  onAccept,
  onReject,
  onClarification,
  onStatusChange,
  onUpdateShipping,
  onAddNote,
  onSendDirectMessage,
}) => {
  const { setActiveSection } = useDesignerStore();
  const [activeTab, setActiveTab] = useState<DetailTab>('overview');
  const [measUnit, setMeasUnit] = useState<'cm' | 'inch'>(order?.measurements.unit || 'cm');
  const [newNoteText, setNewNoteText] = useState('');
  const [newMsgText, setNewMsgText] = useState('');
  const [trackingInput, setTrackingInput] = useState(order?.shipping.trackingNumber || '');
  const [courierInput, setCourierInput] = useState(order?.shipping.courier || 'DHL Express Atelier Direct');

  if (!isOpen || !order) return null;

  const currentStatusIndex = STATUS_PROGRESSION.indexOf(order.status);
  const nextStatus =
    currentStatusIndex >= 0 && currentStatusIndex < STATUS_PROGRESSION.length - 1
      ? STATUS_PROGRESSION[currentStatusIndex + 1]
      : null;

  const handleAddInternalNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (newNoteText.trim()) {
      onAddNote(order.id, newNoteText.trim());
      setNewNoteText('');
    }
  };

  const handleSendClarification = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMsgText.trim()) {
      onSendDirectMessage(order.id, newMsgText.trim());
      setNewMsgText('');
    }
  };

  const handleSaveShipping = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateShipping(order.id, {
      courier: courierInput,
      trackingNumber: trackingInput.trim() || undefined,
      dispatchedAt: order.shipping.dispatchedAt || new Date().toISOString(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-[#0C0C0C] border border-[#2B2B2B] rounded-xs shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-[#222] bg-[#121212] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xs overflow-hidden border border-[#2F2F2F] bg-black shrink-0">
              <img
                src={order.garmentThumbnail}
                alt={order.garmentName}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-amber-400">
                  {order.orderNumber}
                </span>
                <span className="px-2 py-0.2 bg-amber-400/10 border border-amber-500/30 text-[10px] font-mono text-amber-300 rounded-xs">
                  {order.status.toUpperCase()}
                </span>
                {order.priority === 'Rush Bespoke' && (
                  <span className="px-2 py-0.2 bg-rose-950/70 border border-rose-800 text-[10px] font-mono text-rose-300 rounded-xs">
                    RUSH
                  </span>
                )}
              </div>
              <h2 className="text-base sm:text-lg font-serif text-white uppercase tracking-wide">
                {order.garmentName}
              </h2>
              <p className="text-[11px] font-mono text-neutral-400">
                Customer: <strong className="text-white">{order.customer.name}</strong> ({order.customer.tier})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm sm:text-lg font-serif text-white font-bold hidden sm:inline">
              £{order.customizations.finalPrice.toLocaleString('en-GB')}
            </span>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white rounded-xs hover:bg-[#222] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status Lifecycle Progression Bar */}
        {order.status !== 'Rejected' && (
          <div className="px-6 py-3 bg-[#0F0F0F] border-b border-[#1F1F1F] overflow-x-auto no-scrollbar">
            <div className="flex items-center justify-between min-w-[700px] text-[10px] font-mono">
              {STATUS_PROGRESSION.map((st, idx) => {
                const isPassed = idx <= currentStatusIndex;
                const isCurrent = idx === currentStatusIndex;

                return (
                  <div key={st} className="flex items-center gap-2">
                    <div
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xs border transition-colors ${
                        isCurrent
                          ? 'border-amber-400 bg-amber-400/10 text-amber-300 font-bold'
                          : isPassed
                          ? 'border-emerald-800/60 bg-emerald-950/20 text-emerald-400'
                          : 'border-[#222] bg-[#141414] text-neutral-500'
                      }`}
                    >
                      {isPassed ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <span className="w-3 h-3 rounded-full border border-neutral-600 flex items-center justify-center text-[8px]">
                          {idx + 1}
                        </span>
                      )}
                      <span>{st}</span>
                    </div>
                    {idx < STATUS_PROGRESSION.length - 1 && (
                      <ChevronRight className="w-3 h-3 text-neutral-600 shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="px-6 pt-3 bg-[#111] border-b border-[#222] flex items-center gap-3 overflow-x-auto no-scrollbar text-xs font-mono">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-2.5 border-b-2 font-medium transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'overview'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            Overview & Actions
          </button>

          <button
            onClick={() => setActiveTab('measurements')}
            className={`pb-2.5 border-b-2 font-medium transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'measurements'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Ruler className="w-3.5 h-3.5" />
            Customer Measurements ({Object.keys(order.measurements.values).length})
          </button>

          <button
            onClick={() => setActiveTab('customizations')}
            className={`pb-2.5 border-b-2 font-medium transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'customizations'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            Customizations ({order.customizations.options.length})
          </button>

          <button
            onClick={() => setActiveTab('clarifications')}
            className={`pb-2.5 border-b-2 font-medium transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'clarifications'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Clarifications
            {order.clarifications.length > 0 && (
              <span className="px-1.5 py-0.2 bg-[#222] text-[10px] text-amber-400 rounded-xs">
                {order.clarifications.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('shipping')}
            className={`pb-2.5 border-b-2 font-medium transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'shipping'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            Shipping & Dispatch
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* TAB 1: OVERVIEW & ACTIONS */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Primary Action Toolbar */}
              <div className="p-4 bg-[#141414] border border-[#242424] rounded-xs flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  {order.status === 'Pending' && (
                    <>
                      <button
                        onClick={() => onAccept(order.id)}
                        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-mono uppercase font-bold rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-500/20"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Accept Order
                      </button>

                      <button
                        onClick={() => onReject(order.id)}
                        className="px-3.5 py-2 bg-rose-950/50 hover:bg-rose-900 border border-rose-800 text-rose-300 text-xs font-mono uppercase rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Ban className="w-3.5 h-3.5" />
                        Reject Order
                      </button>
                    </>
                  )}

                  {nextStatus && order.status !== 'Pending' && (
                    <button
                      onClick={() => onStatusChange(order.id, nextStatus)}
                      className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-black text-xs font-mono uppercase font-bold rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-400/20"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                      Advance to {nextStatus}
                    </button>
                  )}

                  <button
                    onClick={() => {
                      onClose();
                      setActiveSection('production');
                    }}
                    className="px-3.5 py-2 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-mono uppercase rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                    Production Workflow
                  </button>

                  <button
                    onClick={() => {
                      onClose();
                      setActiveSection('messages');
                    }}
                    className="px-3 py-2 bg-[#222] hover:bg-[#2C2C2C] border border-[#333] text-white text-xs font-mono uppercase rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                    Client Chat
                  </button>

                  <button
                    onClick={() => onClarification(order.id)}
                    className="px-3 py-2 bg-[#1A1A1A] hover:bg-[#242424] border border-[#333] text-neutral-300 text-xs font-mono uppercase rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    Quick Notice
                  </button>
                </div>

                <div className="text-xs font-mono text-neutral-400">
                  Target Delivery:{' '}
                  <span className="text-white font-bold">
                    {new Date(order.targetCompletionDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Order Info & Customer Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Customer Dossier */}
                <div className="p-4 bg-[#111] border border-[#222] rounded-xs space-y-3">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase block">
                    Customer Profile
                  </span>
                  <div className="flex items-center gap-3">
                    <img
                      src={order.customer.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                      alt={order.customer.name}
                      className="w-10 h-10 rounded-full object-cover border border-[#333]"
                    />
                    <div>
                      <p className="text-xs font-mono text-white font-bold">{order.customer.name}</p>
                      <p className="text-[11px] text-neutral-400">{order.customer.email}</p>
                      <p className="text-[10px] text-amber-400 font-mono">{order.customer.tier}</p>
                    </div>
                  </div>
                  {order.customer.phone && (
                    <p className="text-xs font-mono text-neutral-400 pt-1 border-t border-[#1C1C1C]">
                      Direct Telephone: <span className="text-neutral-200">{order.customer.phone}</span>
                    </p>
                  )}
                </div>

                {/* Timeline & Lead Time */}
                <div className="p-4 bg-[#111] border border-[#222] rounded-xs space-y-2 text-xs font-mono">
                  <span className="text-[10px] text-neutral-500 uppercase block">
                    Commission Timeline
                  </span>
                  <div className="flex justify-between text-neutral-400">
                    <span>Order Placed:</span>
                    <span className="text-white">{new Date(order.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Lead Time:</span>
                    <span className="text-white">{order.customizations.estimatedLeadTimeDays} Working Days</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Courier Assigned:</span>
                    <span className="text-amber-400">{order.shipping.courier}</span>
                  </div>
                </div>
              </div>

              {/* Internal Notes Thread */}
              <div className="p-5 bg-[#111] border border-[#222] rounded-xs space-y-3">
                <span className="text-xs font-mono uppercase text-white font-medium block">
                  Atelier Internal Notes (Private to Atelier)
                </span>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {order.internalNotes.map((note, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-[#161616] border border-[#222] rounded-xs text-xs font-mono text-neutral-300 flex items-start gap-2"
                    >
                      <span className="text-amber-400">•</span>
                      <span>{note}</span>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddInternalNote} className="flex gap-2 pt-2">
                  <input
                    type="text"
                    placeholder="Add cutter note, fitting instruction, or fabric lot number..."
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-[#0C0C0C] border border-[#2B2B2B] text-xs font-mono rounded-xs text-white focus:border-amber-400 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-[#222] hover:bg-[#2A2A2A] text-white text-xs font-mono rounded-xs cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Note
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 2: VIEW CUSTOMER MEASUREMENTS */}
          {activeTab === 'measurements' && (
            <div className="space-y-5">
              <div className="p-4 bg-[#141414] border border-[#222] rounded-xs flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-wider text-white font-medium flex items-center gap-2">
                    <Ruler className="w-4 h-4 text-amber-400" />
                    Customer Anatomical Profile
                  </h3>
                  <p className="text-[11px] text-neutral-400">
                    Profile: {order.measurements.profileName || 'Customer Submission'} • Submitted{' '}
                    {new Date(order.measurements.submissionDate).toLocaleDateString()}
                  </p>
                </div>

                {/* Unit Switcher */}
                <div className="flex items-center bg-black/80 rounded-xs border border-white/20 p-0.5">
                  <button
                    type="button"
                    onClick={() => setMeasUnit('cm')}
                    className={`px-3 py-1 rounded-xs text-xs font-mono font-bold cursor-pointer transition-colors ${
                      measUnit === 'cm' ? 'bg-amber-400 text-black' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    CM
                  </button>
                  <button
                    type="button"
                    onClick={() => setMeasUnit('inch')}
                    className={`px-3 py-1 rounded-xs text-xs font-mono font-bold cursor-pointer transition-colors ${
                      measUnit === 'inch' ? 'bg-amber-400 text-black' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    INCH
                  </button>
                </div>
              </div>

              {/* Measurements Table */}
              <div className="border border-[#222] rounded-xs overflow-hidden bg-[#0C0C0C]">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#141414] border-b border-[#222] text-neutral-400 uppercase text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Anatomical Landmark</th>
                      <th className="py-3 px-4">Customer Value ({measUnit})</th>
                      <th className="py-3 px-4">Pattern Drafting Tolerance</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1C1C1C]">
                    {Object.entries(order.measurements.values).map(([key, rawVal]) => {
                      const displayVal =
                        measUnit === order.measurements.unit
                          ? rawVal
                          : convertMeasurement(rawVal, order.measurements.unit, measUnit);

                      return (
                        <tr key={key} className="hover:bg-[#141414] transition-colors">
                          <td className="py-3 px-4 text-white capitalize">
                            {key.replace(/_/g, ' ')}
                          </td>
                          <td className="py-3 px-4 text-amber-400 font-bold text-sm">
                            {displayVal} {measUnit}
                          </td>
                          <td className="py-3 px-4 text-neutral-400 text-[11px]">
                            ± 0.5 {measUnit} Ease Allowance
                          </td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-300 bg-emerald-950/50 border border-emerald-800 px-2 py-0.5 rounded-xs">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              VERIFIED
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Client Notes & Tailor Inspection */}
              {order.measurements.clientNotes && (
                <div className="p-4 bg-[#141414] border border-[#222] rounded-xs space-y-1">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase block">
                    Client Special Anatomical Instructions
                  </span>
                  <p className="text-xs text-neutral-300 font-sans italic">
                    "{order.measurements.clientNotes}"
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: VIEW CUSTOMIZATIONS */}
          {activeTab === 'customizations' && (
            <div className="space-y-5">
              <div className="p-4 bg-[#141414] border border-[#222] rounded-xs flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-wider text-white font-medium flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-amber-400" />
                    Garment Customization Specification
                  </h3>
                  <p className="text-[11px] text-neutral-400">
                    Base: {order.customizations.baseGarmentName} • Custom additions: £
                    {order.customizations.totalCustomizationPrice}
                  </p>
                </div>
                <span className="text-lg font-serif text-amber-400 font-bold">
                  Total: £{order.customizations.finalPrice}
                </span>
              </div>

              {/* Option Swatches Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {order.customizations.options.map((opt, idx) => (
                  <div key={idx} className="p-3.5 bg-[#111] border border-[#222] rounded-xs space-y-2">
                    <span className="text-[10px] font-mono text-neutral-500 uppercase block">
                      {opt.groupName}
                    </span>
                    <div className="flex items-center gap-2.5">
                      {opt.swatchColor && (
                        <div
                          className="w-6 h-6 rounded-xs border border-[#333] shrink-0"
                          style={{ backgroundColor: opt.swatchColor }}
                        />
                      )}
                      <div>
                        <p className="text-xs font-mono text-white font-medium">{opt.optionName}</p>
                        {opt.details && (
                          <p className="text-[10px] text-neutral-400 font-sans">{opt.details}</p>
                        )}
                      </div>
                    </div>
                    <div className="pt-2 border-t border-[#1C1C1C] flex justify-between text-xs font-mono">
                      <span className="text-neutral-500">Price Delta:</span>
                      <span className="text-amber-400 font-semibold">
                        {opt.priceDelta > 0 ? `+£${opt.priceDelta}` : 'Included'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Monogram Block (if any) */}
              {order.customizations.monogramText && (
                <div className="p-4 bg-gradient-to-r from-[#141414] to-amber-950/20 border border-amber-500/30 rounded-xs flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block">
                      Personalized Monogramming
                    </span>
                    <p className="text-base font-serif text-white tracking-widest mt-0.5">
                      "{order.customizations.monogramText}"
                    </p>
                    <p className="text-[11px] font-mono text-neutral-400">
                      Placement: {order.customizations.monogramPlacement || 'Under-Collar'}
                    </p>
                  </div>
                  <span className="text-xs font-mono text-amber-400 px-3 py-1 bg-black/60 rounded-xs border border-amber-500/40">
                    Hand-Stitched Silk Thread
                  </span>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: CLARIFICATIONS */}
          {activeTab === 'clarifications' && (
            <div className="space-y-4">
              <div className="p-4 bg-[#141414] border border-[#222] rounded-xs flex items-center justify-between text-xs font-mono">
                <span className="text-white font-medium flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-amber-400" />
                  Client Dialogue & Clarifications Thread
                </span>
                <span className="text-neutral-500">{order.clarifications.length} messages</span>
              </div>

              {/* Messages Timeline */}
              <div className="space-y-3 min-h-[200px] max-h-72 overflow-y-auto p-4 bg-[#0A0A0A] border border-[#1C1C1C] rounded-xs">
                {order.clarifications.length === 0 ? (
                  <p className="text-xs font-mono text-neutral-500 text-center py-8">
                    No clarification queries currently active for this order.
                  </p>
                ) : (
                  order.clarifications.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-3 rounded-xs max-w-lg space-y-1 text-xs font-sans ${
                        msg.sender === 'designer'
                          ? 'ml-auto bg-[#1A1A1A] border border-amber-500/30 text-white'
                          : 'mr-auto bg-[#141414] border border-[#2B2B2B] text-neutral-200'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400">
                        <span className={msg.sender === 'designer' ? 'text-amber-400 font-bold' : ''}>
                          {msg.senderName}
                        </span>
                        <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <p className="leading-relaxed">{msg.text}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Send New Message */}
              <form onSubmit={handleSendClarification} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Send direct message or query to client..."
                  value={newMsgText}
                  onChange={(e) => setNewMsgText(e.target.value)}
                  className="flex-1 px-3 py-2 bg-[#141414] border border-[#2B2B2B] text-xs font-mono rounded-xs text-white focus:border-amber-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-black text-xs font-mono font-bold uppercase rounded-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Send
                </button>
              </form>
            </div>
          )}

          {/* TAB 5: SHIPPING & DISPATCH */}
          {activeTab === 'shipping' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Delivery Address */}
                <div className="p-4 bg-[#111] border border-[#222] rounded-xs space-y-3">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase block">
                    Client Delivery Address
                  </span>
                  <div className="text-xs font-mono text-neutral-300 space-y-1">
                    <p className="text-white font-bold">{order.shipping.deliveryAddress.name}</p>
                    <p>{order.shipping.deliveryAddress.street}</p>
                    <p>
                      {order.shipping.deliveryAddress.city}, {order.shipping.deliveryAddress.postalCode}
                    </p>
                    <p>{order.shipping.deliveryAddress.country}</p>
                    <p className="text-neutral-400 mt-2">
                      Tel: {order.shipping.deliveryAddress.phone}
                    </p>
                  </div>
                </div>

                {/* Courier & Tracking Form */}
                <form
                  onSubmit={handleSaveShipping}
                  className="p-4 bg-[#111] border border-[#222] rounded-xs space-y-3"
                >
                  <span className="text-[10px] font-mono text-neutral-500 uppercase block">
                    Bespoke Courier Dispatch Setup
                  </span>

                  <div>
                    <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                      Assigned Courier Service
                    </label>
                    <select
                      value={courierInput}
                      onChange={(e) => setCourierInput(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-[#141414] border border-[#2B2B2B] text-xs font-mono rounded-xs text-white focus:border-amber-400 focus:outline-none cursor-pointer"
                    >
                      <option value="DHL Express Atelier Direct">DHL Express Atelier Direct</option>
                      <option value="Savile Row White Glove Courier">
                        Savile Row White Glove Courier
                      </option>
                      <option value="FedEx International Priority">FedEx International Priority</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                      Tracking Consignment Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. DHL-EX-99281734-GB"
                      value={trackingInput}
                      onChange={(e) => setTrackingInput(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-[#141414] border border-[#2B2B2B] text-xs font-mono rounded-xs text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-[#222] hover:bg-[#2A2A2A] text-white text-xs font-mono uppercase rounded-xs cursor-pointer"
                  >
                    Save Logistics Info
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
