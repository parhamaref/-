/**
 * @file CustomerOrderTracker.tsx
 * Order lifecycle & White Glove Delivery tracking for clients.
 * Includes interactive state step progression, carrier tracking,
 * and direct in-app communication messaging panel.
 */

import React, { useState } from 'react';
import { Order, OrderStatus, Delivery, Message, ProductionJob } from '../../types/daniels.types';
import {
  MOCK_ORDERS,
  MOCK_DELIVERIES,
  MOCK_MESSAGES,
  MOCK_PRODUCTION_JOBS,
  MOCK_PRODUCTS,
} from '../../mock/danielsMockData';
import { CustomerApprovalModal } from './CustomerApprovalModal';
import { CustomerDesignApprovalModal } from '../designApproval/CustomerDesignApprovalModal';
import { useDesignApprovalStore } from '../../stores/designApprovalStore';
import {
  Truck,
  Package,
  CheckCircle2,
  Clock,
  Send,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Paperclip,
  Check,
  AlertCircle,
} from 'lucide-react';

interface CustomerOrderTrackerProps {
  customerId?: string;
  customerName?: string;
}

export const CustomerOrderTracker: React.FC<CustomerOrderTrackerProps> = ({
  customerId = 'cust_001',
  customerName = 'Lord Alistair Sterling-Fox',
}) => {
  // Orders for this customer
  const [orders, setOrders] = useState<Order[]>(() => {
    return MOCK_ORDERS.filter((o) => o.customerId === customerId);
  });

  const [selectedOrderId, setSelectedOrderId] = useState<string>(orders[0]?.id || '');
  const activeOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];

  // Associated delivery & production info
  const deliveryInfo = MOCK_DELIVERIES.find((d) => d.orderId === activeOrder?.id);
  const productionJob = MOCK_PRODUCTION_JOBS.find((pj) => pj.orderId === activeOrder?.id);
  const productInfo = MOCK_PRODUCTS.find((p) => p.id === activeOrder?.productId) || MOCK_PRODUCTS[0];

  // In-app order messages state
  const [messages, setMessages] = useState<Message[]>(() => {
    return MOCK_MESSAGES.filter(
      (m) => m.context.entityType === 'Order' && m.context.entityId === activeOrder?.id
    );
  });
  const [newMessageText, setNewMessageText] = useState('');
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const { packages: designPackages } = useDesignApprovalStore();

  const matchingDesignPackage =
    designPackages.find((p) => p.orderId === activeOrder?.id || p.orderNumber === activeOrder?.id) ||
    designPackages[0] ||
    null;

  // Steps in the tracker visual progression
  const STEPS: { status: OrderStatus; label: string; desc: string }[] = [
    { status: 'Confirmed', label: 'COMMISSION CONFIRMED', desc: 'Deposit validated & cloth allocated' },
    { status: 'In Production', label: 'IN ATELIER PRODUCTION', desc: 'Cloth hand-sheared & canvas basted' },
    { status: 'QC', label: 'QC & TOLERANCE INSPECTION', desc: 'Laser and millimeter precision check' },
    { status: 'Ready', label: 'ATELIER READY', desc: 'Final cold-press & garment bag seal' },
    { status: 'Dispatched', label: 'COURIER DISPATCHED', desc: 'In transit via White Glove Concierge' },
    { status: 'Delivered', label: 'HANDOVER COMPLETE', desc: 'Archived into private wardrobe' },
  ];

  const getStepState = (stepStatus: OrderStatus) => {
    const statusOrder: OrderStatus[] = [
      'Draft',
      'Awaiting Approval',
      'Confirmed',
      'In Production',
      'QC',
      'Ready',
      'Dispatched',
      'Delivered',
      'Closed',
    ];

    const currentIndex = statusOrder.indexOf(activeOrder?.status || 'Confirmed');
    const stepIndex = statusOrder.indexOf(stepStatus);

    if (activeOrder?.status === 'On Hold' || activeOrder?.status === 'Rework Required') {
      if (stepStatus === 'QC' || stepStatus === 'In Production') return 'current';
    }

    if (currentIndex > stepIndex) return 'completed';
    if (currentIndex === stepIndex) return 'current';
    return 'upcoming';
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim() || !activeOrder) return;

    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      sender: {
        id: customerId,
        name: customerName,
        role: 'Customer',
      },
      recipient: {
        id: 'usr_sales_01',
        name: 'Julian Montgomery',
        role: 'Sales',
      },
      context: {
        entityType: 'Order',
        entityId: activeOrder.id,
      },
      subject: `Inquiry: Order ${activeOrder.id}`,
      body: newMessageText.trim(),
      attachments: [],
      readStatus: false,
      timestamps: {
        sentAt: new Date().toISOString(),
        readAt: null,
      },
    };

    setMessages((prev) => [...prev, newMsg]);
    setNewMessageText('');
  };

  return (
    <div className="space-y-10 text-left font-mono">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2B2B2B] pb-6">
        <div>
          <div className="flex items-center gap-2 text-neutral-400 text-[10px] tracking-widest uppercase mb-1">
            <Truck className="w-3.5 h-3.5 text-white" />
            <span>REAL-TIME ATELIER DISPATCH TRACKER</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-white uppercase tracking-wider font-bold">
            COMMISSION PROGRESSION
          </h2>
          <p className="text-[11px] text-neutral-400 font-sans mt-0.5">
            Monitor hand-crafting stages, quality control tolerances, and white glove courier routes.
          </p>
        </div>

        {/* Order Selector */}
        {orders.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-[9.5px] text-neutral-500 uppercase">SELECT ORDER:</span>
            <select
              value={selectedOrderId}
              onChange={(e) => setSelectedOrderId(e.target.value)}
              className="bg-[#0E0E0E] border border-[#2B2B2B] text-white text-[10.5px] p-2 rounded-xs outline-none"
            >
              {orders.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.id} — {o.status.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {activeOrder ? (
        <div className="space-y-8 animate-fadeIn">
          {/* Order Overview Summary Card */}
          <div className="bg-[#0E0E0E] border border-[#2B2B2B] p-6 rounded-sm grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-1 border-b md:border-b-0 md:border-r border-[#2B2B2B] pb-4 md:pb-0 pr-4">
              <span className="text-[8.5px] text-neutral-500 uppercase tracking-widest block">
                COMMISSION IDENTIFIER
              </span>
              <span className="text-sm text-white font-bold tracking-wider block">
                {activeOrder.id}
              </span>
              <span className="text-[9px] text-neutral-400 font-sans block">
                Created: {new Date(activeOrder.dates.created).toLocaleDateString('en-GB')}
              </span>
            </div>

            <div className="space-y-1 border-b md:border-b-0 md:border-r border-[#2B2B2B] pb-4 md:pb-0 pr-4">
              <span className="text-[8.5px] text-neutral-500 uppercase tracking-widest block">
                SILHOUETTE SPECIFICATION
              </span>
              <span className="text-sm text-white font-serif font-bold tracking-wider block uppercase truncate">
                {productInfo.name}
              </span>
              <span className="text-[9px] text-neutral-400 block truncate">
                Monogram: <span className="text-white font-bold">{activeOrder.personalisation.monogram || 'N/A'}</span>
              </span>
            </div>

            <div className="space-y-1 border-b md:border-b-0 md:border-r border-[#2B2B2B] pb-4 md:pb-0 pr-4">
              <span className="text-[8.5px] text-neutral-500 uppercase tracking-widest block">
                CURRENT LIFECYCLE STAGE
              </span>
              <div className="inline-flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-white font-bold uppercase tracking-wider">
                  {activeOrder.status}
                </span>
              </div>
              {productionJob && (
                <span className="text-[9px] text-neutral-400 block font-mono">
                  Atelier Craft Progress: <span className="text-emerald-400 font-bold">{productionJob.progress}%</span>
                </span>
              )}
            </div>

            <div className="space-y-2 flex flex-col justify-center">
              <button
                onClick={() => setApprovalModalOpen(true)}
                className="py-2.5 px-4 bg-white/10 hover:bg-white hover:text-black border border-white/20 text-white text-[9.5px] font-bold tracking-widest uppercase rounded-xs transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                VIEW DESIGN SPEC & APPROVAL
              </button>
            </div>
          </div>

          {/* Visual Step Progression */}
          <div className="bg-[#0E0E0E] border border-[#2B2B2B] p-6 sm:p-8 rounded-sm space-y-6">
            <span className="text-[10px] text-white font-bold uppercase tracking-widest block border-b border-[#2B2B2B] pb-2">
              ATELIER MILESTONES PIPELINE
            </span>

            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 relative">
              {STEPS.map((step, idx) => {
                const state = getStepState(step.status);

                return (
                  <div
                    key={step.status}
                    className={`p-3.5 rounded-xs border transition-all duration-300 relative space-y-2 ${
                      state === 'completed'
                        ? 'bg-black border-white/40 text-white'
                        : state === 'current'
                        ? 'bg-white/10 border-white text-white ring-1 ring-white/30'
                        : 'bg-black/30 border-[#2B2B2B]/60 text-neutral-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[8.5px] font-mono tracking-widest uppercase">
                        PHASE 0{idx + 1}
                      </span>
                      {state === 'completed' ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      ) : state === 'current' ? (
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      ) : (
                        <Clock className="w-3 h-3 text-neutral-600" />
                      )}
                    </div>

                    <div className="space-y-0.5">
                      <div className="text-[10px] font-bold tracking-wider uppercase leading-tight">
                        {step.label}
                      </div>
                      <div className="text-[8.5px] font-sans text-neutral-400 leading-normal line-clamp-2">
                        {step.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delivery & Carrier Coordinates Segment */}
          {deliveryInfo && (
            <div className="bg-[#0E0E0E] border border-[#2B2B2B] p-6 rounded-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#2B2B2B] pb-3">
                <div className="flex items-center gap-2 text-white">
                  <Package className="w-4 h-4 text-emerald-400" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    CONCIERGE COURIER DISPATCH
                  </span>
                </div>
                <span className="text-[9px] text-emerald-400 font-bold tracking-widest uppercase px-2 py-0.5 bg-emerald-950/60 border border-emerald-500/30 rounded-2xs">
                  STATUS: {deliveryInfo.status.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-[10px]">
                <div className="p-3 bg-black/60 border border-[#2B2B2B] rounded-xs space-y-1">
                  <span className="text-neutral-500 uppercase block text-[8px]">COURIER METHOD:</span>
                  <span className="text-white font-bold block">{deliveryInfo.method}</span>
                </div>
                <div className="p-3 bg-black/60 border border-[#2B2B2B] rounded-xs space-y-1">
                  <span className="text-neutral-500 uppercase block text-[8px]">WAYBILL / TRACKING:</span>
                  <span className="text-white font-mono font-bold block tracking-wider">
                    {deliveryInfo.trackingNumber}
                  </span>
                </div>
                <div className="p-3 bg-black/60 border border-[#2B2B2B] rounded-xs space-y-1">
                  <span className="text-neutral-500 uppercase block text-[8px]">ESTIMATED ARRIVAL:</span>
                  <span className="text-white font-bold block">
                    {activeOrder.dates.estimatedShipping
                      ? new Date(activeOrder.dates.estimatedShipping).toLocaleDateString('en-GB')
                      : 'Pending Atelier Final Press'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* In-App Direct Atelier Messaging Panel (Requirement 5) */}
          <div className="bg-[#0E0E0E] border border-[#2B2B2B] p-6 rounded-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#2B2B2B] pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-white" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-white">
                  IN-APP ATELIER DISPATCH CHANNEL
                </span>
              </div>
              <span className="text-[8.5px] text-neutral-500 uppercase">
                DIRECT LINK WITH BESPOKE ADVISOR
              </span>
            </div>

            {/* Message Thread */}
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {messages.length === 0 ? (
                <div className="p-6 text-center text-neutral-500 text-[10px]">
                  No messages logged yet. Use the dispatch field below to transmit queries to your bespoke advisor.
                </div>
              ) : (
                messages.map((msg) => {
                  const isCustomerSender = msg.sender.role === 'Customer';
                  return (
                    <div
                      key={msg.id}
                      className={`p-3.5 rounded-sm border text-[10px] space-y-1.5 ${
                        isCustomerSender
                          ? 'ml-auto max-w-lg bg-white/5 border-white/20 text-neutral-200'
                          : 'mr-auto max-w-lg bg-black border-[#2B2B2B] text-neutral-300'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[8px] text-neutral-500 border-b border-[#2B2B2B]/60 pb-1">
                        <span className="font-bold uppercase text-neutral-400">
                          {msg.sender.name} ({msg.sender.role})
                        </span>
                        <span>{new Date(msg.timestamps.sentAt).toLocaleTimeString()}</span>
                      </div>
                      <p className="font-sans leading-relaxed text-[11px] text-[#F3F3F3]">
                        {msg.body}
                      </p>
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="flex gap-2 pt-1">
                          {msg.attachments.map((att) => (
                            <span
                              key={att.id}
                              className="text-[8px] text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-2xs flex items-center gap-1"
                            >
                              <Paperclip className="w-2.5 h-2.5" />
                              {att.filename}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Transmit Input Form */}
            <form onSubmit={handleSendMessage} className="flex gap-2 pt-2 border-t border-[#2B2B2B]">
              <input
                type="text"
                value={newMessageText}
                onChange={(e) => setNewMessageText(e.target.value)}
                placeholder="Inquire regarding fitting dates, lining monogram, or delivery concierge..."
                className="flex-grow bg-[#050505] border border-[#2B2B2B] focus:border-white p-2.5 rounded-xs text-white text-[10.5px] outline-none placeholder-neutral-700"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-white hover:bg-neutral-200 text-black text-[9.5px] font-bold tracking-widest uppercase rounded-xs transition-colors duration-200 flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                TRANSMIT
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="py-16 text-center text-neutral-500 border border-dashed border-[#2B2B2B] p-8 rounded-sm space-y-2">
          <Package className="w-8 h-8 text-neutral-600 mx-auto" />
          <p className="uppercase tracking-widest text-[11px] text-white">NO COMMISSIONS ON RECORD</p>
          <p className="text-[9px] text-neutral-500 font-sans">
            Inquire at the salon to initiate your first bespoke commission.
          </p>
        </div>
      )}

      {/* 6-Stage Pre-Production Design Approval Modal */}
      <CustomerDesignApprovalModal
        isOpen={approvalModalOpen}
        packageData={matchingDesignPackage}
        onClose={() => setApprovalModalOpen(false)}
        onApprovedSuccess={() => {
          if (activeOrder) {
            setOrders((prev) =>
              prev.map((o) =>
                o.id === activeOrder.id
                  ? {
                      ...o,
                      approvalStatus: 'Approved',
                    }
                  : o
              )
            );
          }
        }}
      />
    </div>
  );
};

export default CustomerOrderTracker;
