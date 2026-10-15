/**
 * @file SupplierRegistryView.tsx
 * Mill and Haberdashery Supplier Registry module with partner dossiers, ratings, and lead times.
 */

import React, { useState } from 'react';
import {
  Truck,
  Search,
  Plus,
  Star,
  Clock,
  Award,
  Globe,
  Mail,
  Phone,
  FileText,
  ExternalLink,
  Edit2,
  Trash2,
  ShoppingCart,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { Supplier, FabricItem, MaterialItem, PurchaseOrder } from '../../../types/inventory.types';
import { SupplierModal } from './SupplierModal';
import { SupplierDetailModal } from './SupplierDetailModal';
import { CreatePurchaseOrderModal } from './CreatePurchaseOrderModal';

interface SupplierRegistryViewProps {
  suppliers: Supplier[];
  fabrics: FabricItem[];
  materials: MaterialItem[];
  purchaseOrders: PurchaseOrder[];
  onAddSupplier: (sup: any) => void;
  onUpdateSupplier: (id: string, updates: Partial<Supplier>) => void;
  onDeleteSupplier: (id: string) => void;
  onCreatePo: (poData: any) => void;
}

export const SupplierRegistryView: React.FC<SupplierRegistryViewProps> = ({
  suppliers,
  fabrics,
  materials,
  purchaseOrders,
  onAddSupplier,
  onUpdateSupplier,
  onDeleteSupplier,
  onCreatePo,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState('ALL');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [inspectingSupplier, setInspectingSupplier] = useState<Supplier | null>(null);
  const [draftingPoSupplier, setDraftingPoSupplier] = useState<Supplier | null>(null);

  const filteredSuppliers = suppliers.filter((supplier) => {
    const matchesSearch =
      supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.contactName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTier = tierFilter === 'ALL' || supplier.tier === tierFilter;

    return matchesSearch && matchesTier;
  });

  const totalSupplierSpend = suppliers.reduce((sum, s) => sum + s.totalSpendGbp, 0);
  const avgLeadTime = Math.round(
    suppliers.reduce((sum, s) => sum + s.averageLeadTimeDays, 0) / Math.max(1, suppliers.length)
  );

  return (
    <div className="space-y-6">
      {/* Top Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-[#141414] border border-[#222] rounded-xl">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>Partner Mills</span>
            <Truck className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-serif font-bold text-white">{suppliers.length}</div>
          <span className="text-[11px] text-gray-500">Accredited European & Asian mills</span>
        </div>

        <div className="p-4 bg-[#141414] border border-[#222] rounded-xl">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>Average Mill Lead Time</span>
            <Clock className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-white">
            {avgLeadTime} <span className="text-xs text-gray-400 font-normal">Days</span>
          </div>
          <span className="text-[11px] text-gray-500">Dispatch to London atelier</span>
        </div>

        <div className="p-4 bg-[#141414] border border-[#222] rounded-xl">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>Active Purchase Orders</span>
            <FileText className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-emerald-400">
            {purchaseOrders.filter((po) => po.status === 'confirmed' || po.status === 'in_transit').length}
          </div>
          <span className="text-[11px] text-gray-500">Currently in loom or transit</span>
        </div>

        <div className="p-4 bg-[#141414] border border-[#222] rounded-xl">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>Historic Mill Procurement</span>
            <span className="text-amber-400 font-mono text-xs">Total</span>
          </div>
          <div className="text-2xl font-serif font-bold text-amber-400">
            £{totalSupplierSpend.toLocaleString()}
          </div>
          <span className="text-[11px] text-gray-500">Cumulative cloth & trim orders</span>
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
              placeholder="Search partner mills, country, specialty..."
              className="w-full bg-[#181818] border border-[#2a2a2a] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="bg-[#181818] border border-[#2a2a2a] rounded-lg px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-amber-400"
          >
            <option value="ALL">All Partnership Tiers</option>
            <option value="Strategic Partner">Strategic Partner</option>
            <option value="Preferred Mill">Preferred Mill</option>
            <option value="Artisan Specialist">Artisan Specialist</option>
          </select>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-semibold rounded-lg transition-colors shadow-lg shadow-amber-500/20 self-end sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Register Mill Partner</span>
        </button>
      </div>

      {/* Supplier Dossier Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSuppliers.map((supplier) => {
          const suppliedCount =
            fabrics.filter((f) => f.supplierId === supplier.id).length +
            materials.filter((m) => m.supplierId === supplier.id).length;

          const activePos = purchaseOrders.filter(
            (po) => po.supplierId === supplier.id && (po.status === 'confirmed' || po.status === 'in_transit')
          ).length;

          return (
            <div
              key={supplier.id}
              className="bg-[#141414] border border-[#222] hover:border-[#333] rounded-xl p-5 flex flex-col justify-between space-y-4 transition-all group hover:shadow-xl"
            >
              {/* Header */}
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-serif font-bold text-sm">
                      {supplier.code.slice(0, 3)}
                    </div>
                    <div>
                      <h3
                        onClick={() => setInspectingSupplier(supplier)}
                        className="text-base font-serif font-bold text-white hover:text-amber-400 transition-colors cursor-pointer"
                      >
                        {supplier.name}
                      </h3>
                      <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-0.5">
                        <span>{supplier.city}, {supplier.country}</span>
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] px-2 py-0.5 rounded font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    {supplier.tier}
                  </span>
                </div>

                <p className="text-xs text-gray-300 line-clamp-2 mt-2">{supplier.specialty}</p>
              </div>

              {/* Metrics Badge Row */}
              <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-lg bg-[#181818] border border-[#222] text-xs">
                <div>
                  <span className="text-[10px] text-gray-500 block">Rating</span>
                  <div className="flex items-center gap-1 text-amber-400 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{supplier.qualityRating.toFixed(1)}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-gray-500 block">Lead Time</span>
                  <span className="font-mono text-white font-semibold">
                    {supplier.averageLeadTimeDays}d
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-gray-500 block">MOQ</span>
                  <span className="font-mono text-white font-semibold">{supplier.moqMeters}m</span>
                </div>
              </div>

              {/* Certifications Preview */}
              <div>
                <div className="flex flex-wrap gap-1.5">
                  {supplier.certifications.slice(0, 2).map((cert) => (
                    <span
                      key={cert}
                      className="text-[10px] px-2 py-0.5 rounded bg-black/60 border border-[#2a2a2a] text-gray-300"
                    >
                      {cert}
                    </span>
                  ))}
                  {supplier.certifications.length > 2 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/60 text-gray-500">
                      +{supplier.certifications.length - 2}
                    </span>
                  )}
                </div>
              </div>

              {/* Contact info & Total spend */}
              <div className="space-y-1 text-[11px] text-gray-400 border-t border-[#222] pt-3">
                <div className="flex items-center justify-between">
                  <span>Contact: {supplier.contactName}</span>
                  <span className="text-emerald-400 font-mono font-medium">
                    £{supplier.totalSpendGbp.toLocaleString()} spend
                  </span>
                </div>
                <div className="flex items-center justify-between text-gray-500">
                  <span>Catalog: {suppliedCount} items</span>
                  <span>{supplier.paymentTerms}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setEditingSupplier(supplier)}
                    className="p-1.5 rounded-lg bg-[#1c1c1c] hover:bg-[#252525] text-gray-400 hover:text-white border border-[#2e2e2e]"
                    title="Edit Supplier"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm(`Delete supplier ${supplier.name}?`)) {
                        onDeleteSupplier(supplier.id);
                      }
                    }}
                    className="p-1.5 rounded-lg bg-[#1c1c1c] hover:bg-rose-950/40 text-gray-400 hover:text-rose-400 border border-[#2e2e2e]"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setInspectingSupplier(supplier)}
                    className="px-3 py-1.5 rounded-lg bg-[#1c1c1c] hover:bg-[#282828] text-gray-300 hover:text-white text-xs font-medium border border-[#333] transition-colors"
                  >
                    Dossier
                  </button>

                  <button
                    onClick={() => setDraftingPoSupplier(supplier)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-semibold rounded-lg transition-colors shadow-md shadow-amber-500/20"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Draft PO</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modals */}
      <SupplierModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={onAddSupplier}
      />

      {editingSupplier && (
        <SupplierModal
          isOpen={!!editingSupplier}
          onClose={() => setEditingSupplier(null)}
          onSave={(data) => onUpdateSupplier(editingSupplier.id, data)}
          supplier={editingSupplier}
        />
      )}

      <SupplierDetailModal
        isOpen={!!inspectingSupplier}
        onClose={() => setInspectingSupplier(null)}
        supplier={inspectingSupplier}
        fabrics={fabrics}
        materials={materials}
        purchaseOrders={purchaseOrders}
        onDraftPo={(sup) => setDraftingPoSupplier(sup)}
      />

      {draftingPoSupplier && (
        <CreatePurchaseOrderModal
          isOpen={!!draftingPoSupplier}
          onClose={() => setDraftingPoSupplier(null)}
          suppliers={suppliers}
          fabrics={fabrics}
          materials={materials}
          onSave={onCreatePo}
          preselectedSupplierId={draftingPoSupplier.id}
        />
      )}
    </div>
  );
};
