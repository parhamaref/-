/**
 * @file OrderInboxView.tsx
 * Master Order Inbox & Lifecycle Management for independent fashion designers.
 * Features KPI counters, Status Tabs, Filter/Search, Order Cards, and Direct Actions.
 */

import React, { useState, useMemo } from 'react';
import {
  Inbox,
  CheckCircle2,
  AlertTriangle,
  Ban,
  MessageSquare,
  Search,
  Filter,
  Eye,
  ArrowRight,
  Clock,
  Ruler,
  Sliders,
  Calendar,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Package,
} from 'lucide-react';
import { useDesignerOrderStore } from '../../../stores/designerOrderStore';
import { DesignerOrder, DesignerOrderStatus } from '../../../types/designerOrder.types';
import { OrderDetailModal } from './OrderDetailModal';
import { AcceptOrderModal } from './AcceptOrderModal';
import { RejectOrderModal } from './RejectOrderModal';
import { ClarificationModal } from './ClarificationModal';

export const OrderInboxView: React.FC = () => {
  const {
    orders,
    acceptOrder,
    rejectOrder,
    updateOrderStatus,
    requestClarification,
    updateShipping,
    addInternalNote,
    resetToDefaults,
  } = useDesignerOrderStore();

  // Filters state
  const [selectedStatusTab, setSelectedStatusTab] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');

  // Modals state
  const [detailModalOrder, setDetailModalOrder] = useState<DesignerOrder | null>(null);
  const [acceptModalOrder, setAcceptModalOrder] = useState<DesignerOrder | null>(null);
  const [rejectModalOrder, setRejectModalOrder] = useState<DesignerOrder | null>(null);
  const [clarificationModalOrder, setClarificationModalOrder] = useState<DesignerOrder | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // KPIs
  const kpis = useMemo(() => {
    const pending = orders.filter((o) => o.status === 'Pending').length;
    const inProduction = orders.filter((o) => o.status === 'In Production').length;
    const qc = orders.filter((o) => o.status === 'Quality Control').length;
    const ready = orders.filter((o) => o.status === 'Ready To Ship').length;
    const dispatched = orders.filter((o) => ['Shipped', 'Delivered'].includes(o.status)).length;
    return {
      total: orders.length,
      pending,
      inProduction,
      qc,
      ready,
      dispatched,
    };
  }, [orders]);

  // Filtered orders list
  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      const matchesStatus =
        selectedStatusTab === 'All' || ord.status.toLowerCase() === selectedStatusTab.toLowerCase();

      const matchesPriority =
        priorityFilter === 'All' || ord.priority.toLowerCase() === priorityFilter.toLowerCase();

      const matchesSearch =
        !searchQuery.trim() ||
        ord.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ord.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ord.garmentName.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesStatus && matchesPriority && matchesSearch;
    });
  }, [orders, selectedStatusTab, priorityFilter, searchQuery]);

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#141414] border border-amber-500/50 text-white px-4 py-3 rounded-xs shadow-2xl flex items-center gap-2.5 text-xs font-mono">
          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. TOP KPI STRIP */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 bg-[#0E0E0E] border border-[#222] rounded-xs space-y-1">
          <span className="text-[10px] font-mono text-neutral-500 uppercase block">Total Orders</span>
          <span className="text-xl font-serif text-white font-bold">{kpis.total}</span>
        </div>

        <div className="p-3.5 bg-[#0E0E0E] border border-amber-500/30 rounded-xs space-y-1">
          <span className="text-[10px] font-mono text-amber-400 uppercase block flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Pending Inbox
          </span>
          <span className="text-xl font-serif text-amber-400 font-bold">{kpis.pending}</span>
        </div>

        <div className="p-3.5 bg-[#0E0E0E] border border-[#222] rounded-xs space-y-1">
          <span className="text-[10px] font-mono text-neutral-500 uppercase block">In Production</span>
          <span className="text-xl font-serif text-white font-bold">{kpis.inProduction}</span>
        </div>

        <div className="p-3.5 bg-[#0E0E0E] border border-[#222] rounded-xs space-y-1">
          <span className="text-[10px] font-mono text-neutral-500 uppercase block">Quality Control</span>
          <span className="text-xl font-serif text-white font-bold">{kpis.qc}</span>
        </div>

        <div className="p-3.5 bg-[#0E0E0E] border border-[#222] rounded-xs space-y-1">
          <span className="text-[10px] font-mono text-neutral-500 uppercase block">Ready To Ship</span>
          <span className="text-xl font-serif text-white font-bold">{kpis.ready}</span>
        </div>

        <div className="p-3.5 bg-[#0E0E0E] border border-[#222] rounded-xs space-y-1">
          <span className="text-[10px] font-mono text-emerald-400 uppercase block">Dispatched / Done</span>
          <span className="text-xl font-serif text-emerald-400 font-bold">{kpis.dispatched}</span>
        </div>
      </div>

      {/* 2. FILTER & SEARCH CONTROLS */}
      <div className="p-4 bg-[#0E0E0E] border border-[#222] rounded-xs shadow-xl space-y-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs font-mono pb-1 border-b border-[#1C1C1C]">
          {[
            'All',
            'Pending',
            'Accepted',
            'In Production',
            'Quality Control',
            'Ready To Ship',
            'Shipped',
            'Delivered',
            'Rejected',
          ].map((statusTab) => {
            const count =
              statusTab === 'All'
                ? orders.length
                : orders.filter((o) => o.status.toLowerCase() === statusTab.toLowerCase()).length;

            return (
              <button
                key={statusTab}
                onClick={() => setSelectedStatusTab(statusTab)}
                className={`px-3 py-1.5 rounded-xs transition-colors cursor-pointer uppercase shrink-0 flex items-center gap-1.5 ${
                  selectedStatusTab.toLowerCase() === statusTab.toLowerCase()
                    ? 'bg-amber-400 text-black font-bold shadow-xs'
                    : 'bg-[#141414] text-neutral-400 hover:text-white hover:bg-[#1E1E1E]'
                }`}
              >
                <span>{statusTab}</span>
                <span className="text-[10px] px-1 rounded-xs bg-black/40">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Priority Selector */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
          <div className="relative w-full sm:w-80">
            <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Order #, Customer, Garment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#141414] border border-[#2B2B2B] text-xs font-mono rounded-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-[#141414] border border-[#2B2B2B] text-xs font-mono rounded-xs text-neutral-300 focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="All">All Priorities</option>
              <option value="Rush Bespoke">Rush Bespoke</option>
              <option value="High">High Priority</option>
              <option value="Standard">Standard</option>
            </select>

            <button
              onClick={() => {
                if (confirm('Reset orders to initial demo state?')) {
                  resetToDefaults();
                  showToast('Orders reset to defaults');
                }
              }}
              className="p-2 bg-[#141414] hover:bg-[#202020] border border-[#2B2B2B] text-neutral-400 hover:text-white rounded-xs transition-colors cursor-pointer"
              title="Reset order state"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. ORDERS LIST / TABLE */}
      {filteredOrders.length === 0 ? (
        <div className="p-12 text-center bg-[#0E0E0E] border border-[#222] rounded-xs space-y-2">
          <Inbox className="w-8 h-8 text-neutral-600 mx-auto" />
          <h3 className="text-sm font-mono uppercase text-white font-medium">No Commissions Found</h3>
          <p className="text-xs text-neutral-400">Try adjusting your status tab or search query.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((ord) => {
            const isPending = ord.status === 'Pending';

            return (
              <div
                key={ord.id}
                className={`p-4 rounded-xs border transition-all ${
                  isPending
                    ? 'bg-[#101010] border-amber-500/40 shadow-lg shadow-amber-500/5'
                    : 'bg-[#0E0E0E] border-[#222] hover:border-neutral-500'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Garment Image, Info & Customer */}
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div
                      className="w-16 h-16 rounded-xs overflow-hidden border border-[#2B2B2B] bg-black shrink-0 cursor-pointer"
                      onClick={() => setDetailModalOrder(ord)}
                    >
                      <img
                        src={ord.garmentThumbnail}
                        alt={ord.garmentName}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono font-bold text-amber-400">
                          {ord.orderNumber}
                        </span>
                        <span
                          className={`px-2 py-0.2 text-[9px] font-mono uppercase font-bold rounded-xs ${
                            ord.status === 'Pending'
                              ? 'bg-amber-400/20 text-amber-300 border border-amber-500/40'
                              : ord.status === 'In Production'
                              ? 'bg-blue-950/60 text-blue-300 border border-blue-800'
                              : ord.status === 'Quality Control'
                              ? 'bg-purple-950/60 text-purple-300 border border-purple-800'
                              : ord.status === 'Ready To Ship'
                              ? 'bg-amber-950/60 text-amber-300 border border-amber-800'
                              : ord.status === 'Shipped' || ord.status === 'Delivered'
                              ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800'
                              : 'bg-neutral-800 text-neutral-400'
                          }`}
                        >
                          {ord.status}
                        </span>
                        {ord.priority === 'Rush Bespoke' && (
                          <span className="px-1.5 py-0.2 bg-rose-950/70 border border-rose-800 text-[9px] font-mono text-rose-300 rounded-xs">
                            RUSH BESPOKE
                          </span>
                        )}
                        <span className="text-[10px] font-mono text-neutral-500">
                          {new Date(ord.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <h3
                        className="text-sm font-serif text-white uppercase tracking-wide hover:text-amber-400 cursor-pointer transition-colors font-medium"
                        onClick={() => setDetailModalOrder(ord)}
                      >
                        {ord.garmentName}
                      </h3>

                      <div className="flex items-center gap-3 text-xs font-mono text-neutral-400 flex-wrap">
                        <span className="text-neutral-300">
                          Client: <strong>{ord.customer.name}</strong> ({ord.customer.tier})
                        </span>
                        <span>•</span>
                        <span className="text-amber-400 font-bold">
                          £{ord.customizations.finalPrice}
                        </span>
                        <span>•</span>
                        <span>
                          {Object.keys(ord.measurements.values).length} Body Measurements
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Action Buttons & Triggers */}
                  <div className="flex items-center gap-2 flex-wrap lg:justify-end">
                    {/* Pending Action Buttons */}
                    {isPending ? (
                      <>
                        <button
                          onClick={() => setAcceptModalOrder(ord)}
                          className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-mono uppercase font-bold rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/20"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Accept
                        </button>
                        <button
                          onClick={() => setRejectModalOrder(ord)}
                          className="px-3 py-1.5 bg-rose-950/40 hover:bg-rose-900 border border-rose-800 text-rose-300 text-xs font-mono uppercase rounded-xs transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Ban className="w-3.5 h-3.5" />
                          Reject
                        </button>
                      </>
                    ) : null}

                    {/* Clarification Trigger */}
                    <button
                      onClick={() => setClarificationModalOrder(ord)}
                      className="px-2.5 py-1.5 bg-[#181818] hover:bg-[#222] border border-[#2E2E2E] text-neutral-300 hover:text-white text-xs font-mono rounded-xs transition-colors flex items-center gap-1 cursor-pointer"
                      title="Clarification enquiry"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                      Clarify
                      {ord.clarifications.length > 0 && (
                        <span className="w-4 h-4 rounded-full bg-amber-400 text-black text-[9px] font-bold flex items-center justify-center">
                          {ord.clarifications.length}
                        </span>
                      )}
                    </button>

                    {/* View Details / Inspect */}
                    <button
                      onClick={() => setDetailModalOrder(ord)}
                      className="px-3.5 py-1.5 bg-[#222] hover:bg-[#2C2C2C] border border-[#333] text-white text-xs font-mono uppercase font-semibold rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-amber-400" />
                      Inspect Order
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. MODALS INTEGRATION */}
      <OrderDetailModal
        isOpen={Boolean(detailModalOrder)}
        onClose={() => setDetailModalOrder(null)}
        order={detailModalOrder}
        onAccept={(orderId) => {
          acceptOrder(orderId);
          showToast('Commission accepted and scheduled');
          setDetailModalOrder(null);
        }}
        onReject={(orderId) => {
          const ord = orders.find((o) => o.id === orderId);
          if (ord) setRejectModalOrder(ord);
        }}
        onClarification={(orderId) => {
          const ord = orders.find((o) => o.id === orderId);
          if (ord) setClarificationModalOrder(ord);
        }}
        onStatusChange={(orderId, nextStatus) => {
          updateOrderStatus(orderId, nextStatus);
          showToast(`Order updated to ${nextStatus}`);
          // Refresh opened modal
          const updated = orders.find((o) => o.id === orderId);
          if (updated) setDetailModalOrder({ ...updated, status: nextStatus });
        }}
        onUpdateShipping={(orderId, shipping) => {
          updateShipping(orderId, shipping);
          showToast('Logistics consignment updated');
        }}
        onAddNote={(orderId, note) => {
          addInternalNote(orderId, note);
          showToast('Internal note recorded');
        }}
        onSendDirectMessage={(orderId, message) => {
          requestClarification(orderId, message);
          showToast('Direct query transmitted to client');
        }}
      />

      <AcceptOrderModal
        isOpen={Boolean(acceptModalOrder)}
        onClose={() => setAcceptModalOrder(null)}
        order={acceptModalOrder}
        onConfirm={(notes) => {
          if (acceptModalOrder) {
            acceptOrder(acceptModalOrder.id, notes);
            showToast(`Order ${acceptModalOrder.orderNumber} accepted`);
            setAcceptModalOrder(null);
          }
        }}
      />

      <RejectOrderModal
        isOpen={Boolean(rejectModalOrder)}
        onClose={() => setRejectModalOrder(null)}
        order={rejectModalOrder}
        onConfirm={(reason) => {
          if (rejectModalOrder) {
            rejectOrder(rejectModalOrder.id, reason);
            showToast(`Order ${rejectModalOrder.orderNumber} declined`);
            setRejectModalOrder(null);
            setDetailModalOrder(null);
          }
        }}
      />

      <ClarificationModal
        isOpen={Boolean(clarificationModalOrder)}
        onClose={() => setClarificationModalOrder(null)}
        order={clarificationModalOrder}
        onSend={(message) => {
          if (clarificationModalOrder) {
            requestClarification(clarificationModalOrder.id, message);
            showToast('Clarification sent to customer');
            setClarificationModalOrder(null);
          }
        }}
      />
    </div>
  );
};
