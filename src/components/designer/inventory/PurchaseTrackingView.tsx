/**
 * @file PurchaseTrackingView.tsx
 * Purchase Tracking & Receiving module for mill orders, waybills, and arrival restocks.
 */

import React, { useState } from 'react';
import {
  FileText,
  Search,
  Plus,
  Truck,
  PackageCheck,
  CheckCircle2,
  Clock,
  Printer,
  ChevronRight,
  ExternalLink,
  Sliders,
  DollarSign,
  AlertCircle,
  Building2,
  Trash2,
} from 'lucide-react';
import {
  PurchaseOrder,
  PurchaseOrderStatus,
  Supplier,
  FabricItem,
  MaterialItem,
} from '../../../types/inventory.types';
import { CreatePurchaseOrderModal } from './CreatePurchaseOrderModal';
import { ReceivePoModal } from './ReceivePoModal';
import { PoInvoiceModal } from './PoInvoiceModal';

interface PurchaseTrackingViewProps {
  purchaseOrders: PurchaseOrder[];
  suppliers: Supplier[];
  fabrics: FabricItem[];
  materials: MaterialItem[];
  onCreatePo: (poData: any) => void;
  onUpdatePoStatus: (
    id: string,
    status: PurchaseOrderStatus,
    carrierInfo?: { carrier?: string; trackingNumber?: string }
  ) => void;
  onReceivePo: (poId: string, notes: string, inspector: string) => void;
  onDeletePo: (id: string) => void;
}

export const PurchaseTrackingView: React.FC<PurchaseTrackingViewProps> = ({
  purchaseOrders,
  suppliers,
  fabrics,
  materials,
  onCreatePo,
  onUpdatePoStatus,
  onReceivePo,
  onDeletePo,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [receivingPo, setReceivingPo] = useState<PurchaseOrder | null>(null);
  const [invoicingPo, setInvoicingPo] = useState<PurchaseOrder | null>(null);

  const filteredOrders = purchaseOrders.filter((po) => {
    const matchesSearch =
      po.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      po.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (po.trackingNumber && po.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      po.items.some((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || po.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalCapitalOnOrder = purchaseOrders
    .filter((po) => po.status === 'confirmed' || po.status === 'in_transit' || po.status === 'sent')
    .reduce((sum, po) => sum + po.totalAmount, 0);

  const inTransitCount = purchaseOrders.filter((po) => po.status === 'in_transit').length;
  const receivedCount = purchaseOrders.filter((po) => po.status === 'received').length;

  return (
    <div className="space-y-6">
      {/* Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-[#141414] border border-[#222] rounded-xl">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>Capital on Order</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-serif font-bold text-white">
            £{Math.round(totalCapitalOnOrder).toLocaleString()}
          </div>
          <span className="text-[11px] text-gray-500">Committed in active POs</span>
        </div>

        <div className="p-4 bg-[#141414] border border-[#222] rounded-xl">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>In Transit & Customs</span>
            <Truck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-emerald-400">{inTransitCount}</div>
          <span className="text-[11px] text-gray-500">Air express shipments</span>
        </div>

        <div className="p-4 bg-[#141414] border border-[#222] rounded-xl">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>Received & Restocked</span>
            <CheckCircle2 className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-white">{receivedCount}</div>
          <span className="text-[11px] text-gray-500">Completed atelier intakes</span>
        </div>

        <div className="p-4 bg-[#141414] border border-[#222] rounded-xl">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>Total Mill Orders</span>
            <FileText className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-amber-400">{purchaseOrders.length}</div>
          <span className="text-[11px] text-gray-500">All historic & draft records</span>
        </div>
      </div>

      {/* Control Bar */}
      <div className="p-4 bg-[#141414] border border-[#222] rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex-1 flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search PO number, supplier, waybill..."
              className="w-full bg-[#181818] border border-[#2a2a2a] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#181818] border border-[#2a2a2a] rounded-lg px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-amber-400"
          >
            <option value="ALL">All PO Statuses</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent to Mill</option>
            <option value="confirmed">Confirmed</option>
            <option value="in_transit">In Transit</option>
            <option value="received">Received & Restocked</option>
          </select>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-semibold rounded-lg transition-colors shadow-lg shadow-amber-500/20 self-end sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Draft Purchase Order</span>
        </button>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((po) => {
          const isReceived = po.status === 'received';
          const isInTransit = po.status === 'in_transit';

          return (
            <div
              key={po.id}
              className="p-5 bg-[#141414] border border-[#222] hover:border-[#333] rounded-xl space-y-4 transition-all"
            >
              {/* Header row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222] pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-serif font-bold text-white tracking-wide">
                        {po.poNumber}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2.5 py-0.5 rounded capitalize ${
                          isReceived
                            ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40'
                            : isInTransit
                            ? 'bg-blue-950/80 text-blue-400 border border-blue-500/40'
                            : po.status === 'confirmed'
                            ? 'bg-amber-950/80 text-amber-400 border border-amber-500/40'
                            : 'bg-gray-800 text-gray-300'
                        }`}
                      >
                        {po.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-2">
                      <span>Mill: <strong className="text-gray-200">{po.supplierName}</strong></span>
                      <span>•</span>
                      <span>Issued: {new Date(po.issueDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Right side amount & actions */}
                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <div className="text-right">
                    <span className="text-[10px] text-gray-500 block">Total Amount</span>
                    <span className="text-base font-bold text-white font-mono">
                      £{po.totalAmount.toLocaleString()}
                    </span>
                  </div>

                  <button
                    onClick={() => setInvoicingPo(po)}
                    className="p-2 rounded-lg bg-[#1c1c1c] hover:bg-[#252525] text-gray-300 hover:text-white border border-[#2e2e2e]"
                    title="Print / View Invoice"
                  >
                    <Printer className="w-4 h-4" />
                  </button>

                  {!isReceived && (
                    <button
                      onClick={() => setReceivingPo(po)}
                      className="flex items-center gap-1.5 px-3 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-semibold rounded-lg shadow-md shadow-emerald-500/20 transition-colors"
                    >
                      <PackageCheck className="w-4 h-4" />
                      <span>Receive & Restock</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Waybill and Delivery Info Bar */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-[#181818] border border-[#262626] rounded-lg text-xs">
                <div>
                  <span className="text-gray-500 block text-[10px] uppercase">Expected Delivery</span>
                  <span className="text-white font-medium flex items-center gap-1 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    {new Date(po.expectedDate).toLocaleDateString()}
                  </span>
                </div>

                <div>
                  <span className="text-gray-500 block text-[10px] uppercase">Carrier & Waybill</span>
                  <span className="text-amber-300 font-mono font-medium flex items-center gap-1 mt-0.5">
                    <Truck className="w-3.5 h-3.5 text-emerald-400" />
                    {po.carrier || 'TBD'} • {po.trackingNumber || 'Awaiting Waybill'}
                  </span>
                </div>

                <div>
                  <span className="text-gray-500 block text-[10px] uppercase">Payment Terms</span>
                  <span className="text-gray-300 font-medium capitalize mt-0.5 block">
                    {po.paymentStatus.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Line Items Table */}
              <div>
                <div className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-1.5">
                  Ordered Line Items ({po.items.length})
                </div>
                <div className="divide-y divide-[#222] border border-[#222] rounded-lg overflow-hidden bg-[#161616]">
                  {po.items.map((item) => (
                    <div
                      key={item.id}
                      className="px-3.5 py-2 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-amber-300 px-1.5 py-0.5 bg-black/40 rounded border border-[#333]">
                          {item.sku}
                        </span>
                        <span className="text-white font-medium">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-4 text-gray-300">
                        <span className="font-mono text-gray-400">
                          {item.quantity} {item.unit} @ £{item.unitPrice}
                        </span>
                        <span className="font-mono font-bold text-white">
                          £{item.lineTotal.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Update Strip */}
              <div className="flex items-center justify-between text-xs pt-1">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-[11px]">Workflow Phase:</span>
                  <select
                    value={po.status}
                    onChange={(e) => onUpdatePoStatus(po.id, e.target.value as any)}
                    className="bg-[#181818] border border-[#333] text-gray-300 text-xs rounded px-2 py-1 focus:outline-none focus:border-amber-400"
                  >
                    <option value="draft">Draft</option>
                    <option value="sent">Sent to Mill</option>
                    <option value="confirmed">Confirmed by Mill</option>
                    <option value="in_transit">In Transit (Air Express)</option>
                    <option value="received">Received & Stocked</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <button
                  onClick={() => {
                    if (window.confirm(`Delete purchase order ${po.poNumber}?`)) {
                      onDeletePo(po.id);
                    }
                  }}
                  className="text-gray-500 hover:text-rose-400 text-xs flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete PO</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modals */}
      <CreatePurchaseOrderModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        suppliers={suppliers}
        fabrics={fabrics}
        materials={materials}
        onSave={onCreatePo}
      />

      <ReceivePoModal
        isOpen={!!receivingPo}
        onClose={() => setReceivingPo(null)}
        purchaseOrder={receivingPo}
        onReceive={onReceivePo}
      />

      <PoInvoiceModal
        isOpen={!!invoicingPo}
        onClose={() => setInvoicingPo(null)}
        purchaseOrder={invoicingPo}
      />
    </div>
  );
};
