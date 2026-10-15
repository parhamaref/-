/**
 * @file SupplierDetailModal.tsx
 * Comprehensive dossier modal for an artisan mill or haberdashery supplier.
 */

import React from 'react';
import {
  X,
  Truck,
  Star,
  Clock,
  Award,
  CreditCard,
  Mail,
  Phone,
  Globe,
  PlusCircle,
  FileText,
  Boxes,
} from 'lucide-react';
import { Supplier, FabricItem, MaterialItem, PurchaseOrder } from '../../../types/inventory.types';

interface SupplierDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplier: Supplier | null;
  fabrics: FabricItem[];
  materials: MaterialItem[];
  purchaseOrders: PurchaseOrder[];
  onDraftPo: (supplier: Supplier) => void;
}

export const SupplierDetailModal: React.FC<SupplierDetailModalProps> = ({
  isOpen,
  onClose,
  supplier,
  fabrics,
  materials,
  purchaseOrders,
  onDraftPo,
}) => {
  if (!isOpen || !supplier) return null;

  const suppliedFabrics = fabrics.filter((f) => f.supplierId === supplier.id);
  const suppliedMaterials = materials.filter((m) => m.supplierId === supplier.id);
  const supplierPos = purchaseOrders.filter((po) => po.supplierId === supplier.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#111] border border-[#262626] rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#222] bg-[#161616] flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-serif font-bold text-lg">
              {supplier.code.slice(0, 3)}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs px-2 py-0.5 rounded bg-[#222] text-amber-300 font-mono border border-[#333]">
                  {supplier.code}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
                  {supplier.tier}
                </span>
              </div>
              <h2 className="text-xl font-serif font-bold text-white tracking-wide">
                {supplier.name}
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {supplier.city}, {supplier.country} • {supplier.specialty}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-[#222] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-[#181818] border border-[#222] rounded-lg">
              <span className="text-[11px] text-gray-400 block mb-0.5">Quality Rating</span>
              <div className="flex items-center gap-1.5 text-amber-400 font-bold text-lg">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{supplier.qualityRating.toFixed(1)}</span>
                <span className="text-xs text-gray-500 font-normal">/ 5.0</span>
              </div>
              <span className="text-[10px] text-gray-500 block">Weave & Finish</span>
            </div>

            <div className="p-3 bg-[#181818] border border-[#222] rounded-lg">
              <span className="text-[11px] text-gray-400 block mb-0.5">Avg Lead Time</span>
              <div className="flex items-center gap-1.5 text-white font-bold text-lg font-mono">
                <Clock className="w-4 h-4 text-gray-400" />
                <span>{supplier.averageLeadTimeDays}</span>
                <span className="text-xs text-gray-400 font-normal">Days</span>
              </div>
              <span className="text-[10px] text-gray-500 block">Dispatch to Atelier</span>
            </div>

            <div className="p-3 bg-[#181818] border border-[#222] rounded-lg">
              <span className="text-[11px] text-gray-400 block mb-0.5">Min Order (MOQ)</span>
              <span className="text-lg font-bold text-white font-mono block">
                {supplier.moqMeters}m
              </span>
              <span className="text-[10px] text-gray-500 block">Sampling Cut Friendly</span>
            </div>

            <div className="p-3 bg-[#181818] border border-[#222] rounded-lg">
              <span className="text-[11px] text-gray-400 block mb-0.5">Total Historic Spend</span>
              <span className="text-lg font-bold text-emerald-400 font-mono block">
                £{supplier.totalSpendGbp.toLocaleString()}
              </span>
              <span className="text-[10px] text-gray-500 block">{supplier.paymentTerms}</span>
            </div>
          </div>

          {/* Contact Details */}
          <div className="bg-[#161616] border border-[#222] rounded-lg p-4 space-y-3">
            <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
              Atelier Mill Representative & Channels
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500 shrink-0" />
                <a
                  href={`mailto:${supplier.email}`}
                  className="text-amber-400 hover:underline truncate"
                >
                  {supplier.email || 'N/A'}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-500 shrink-0" />
                <span className="text-gray-300">{supplier.phone || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-gray-500 shrink-0" />
                <a
                  href={supplier.website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-300 hover:text-white truncate underline"
                >
                  {supplier.website || 'Official Portal'}
                </a>
              </div>
            </div>
          </div>

          {/* Certifications */}
          <div>
            <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              Accreditations & Sustainable Standards
            </h3>
            <div className="flex flex-wrap gap-2">
              {supplier.certifications.map((cert) => (
                <span
                  key={cert}
                  className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md bg-[#1a1a1a] border border-[#333] text-gray-200"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {cert}
                </span>
              ))}
            </div>
          </div>

          {/* Supplied Catalog Items */}
          <div>
            <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Boxes className="w-4 h-4 text-amber-400" />
              Supplied Catalog Materials ({suppliedFabrics.length + suppliedMaterials.length})
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {suppliedFabrics.map((fab) => (
                <div
                  key={fab.id}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-[#161616] border border-[#222] text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0"
                      style={{ backgroundColor: fab.hexColor }}
                    />
                    <div>
                      <div className="text-white font-medium">{fab.name}</div>
                      <div className="text-[11px] text-gray-500 font-mono">
                        {fab.sku} • {fab.composition}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-white font-semibold font-mono">{fab.currentStockMeters}m</span>
                    <span className="text-[10px] text-gray-500 block">@ £{fab.costPerMeter}/m</span>
                  </div>
                </div>
              ))}

              {suppliedMaterials.map((mat) => (
                <div
                  key={mat.id}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-[#161616] border border-[#222] text-xs"
                >
                  <div>
                    <div className="text-white font-medium">{mat.name}</div>
                    <div className="text-[11px] text-gray-500 font-mono">
                      {mat.sku} • {mat.category}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-white font-semibold font-mono">
                      {mat.currentStock} {mat.unit}
                    </span>
                    <span className="text-[10px] text-gray-500 block">@ £{mat.unitCost}</span>
                  </div>
                </div>
              ))}

              {suppliedFabrics.length === 0 && suppliedMaterials.length === 0 && (
                <p className="text-xs text-gray-500 italic p-3 text-center">
                  No active catalog fabrics or materials mapped to this mill yet.
                </p>
              )}
            </div>
          </div>

          {/* Supplier PO History */}
          <div>
            <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              Recent Purchase Orders ({supplierPos.length})
            </h3>
            <div className="space-y-1.5">
              {supplierPos.map((po) => (
                <div
                  key={po.id}
                  className="flex items-center justify-between p-2.5 bg-[#161616] border border-[#222] rounded-lg text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-amber-300 font-medium">{po.poNumber}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-300">{new Date(po.issueDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-white font-bold font-mono">
                      £{po.totalAmount.toLocaleString()}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-medium capitalize ${
                        po.status === 'received'
                          ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-500/30'
                          : po.status === 'in_transit'
                          ? 'bg-amber-950/50 text-amber-400 border border-amber-500/30'
                          : 'bg-gray-800 text-gray-300'
                      }`}
                    >
                      {po.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#222] bg-[#161616]">
          <span className="text-xs text-gray-400">
            Payment Terms: <span className="text-white font-medium">{supplier.paymentTerms}</span>
          </span>
          <button
            onClick={() => {
              onClose();
              onDraftPo(supplier);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs rounded-lg transition-colors shadow-lg shadow-amber-500/20"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Draft PO with {supplier.name}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
