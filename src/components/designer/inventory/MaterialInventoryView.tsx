/**
 * @file MaterialInventoryView.tsx
 * Haberdashery & Material Trims module for buttons, linings, canvas, zippers, and hardware.
 */

import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  Plus,
  AlertTriangle,
  ShoppingCart,
  Edit2,
  Trash2,
  CheckCircle2,
  Sliders,
  FolderTree,
  PlusCircle,
  MinusCircle,
} from 'lucide-react';
import { MaterialItem, MaterialCategory, Supplier } from '../../../types/inventory.types';
import { MaterialModal } from './MaterialModal';
import { CreatePurchaseOrderModal } from './CreatePurchaseOrderModal';

interface MaterialInventoryViewProps {
  materials: MaterialItem[];
  suppliers: Supplier[];
  onAddMaterial: (mat: any) => void;
  onUpdateMaterial: (id: string, updates: Partial<MaterialItem>) => void;
  onDeleteMaterial: (id: string) => void;
  onAdjustStock: (id: string, delta: number) => void;
  onCreatePo: (poData: any) => void;
  allFabrics?: any[];
}

export const MaterialInventoryView: React.FC<MaterialInventoryViewProps> = ({
  materials,
  suppliers,
  onAddMaterial,
  onUpdateMaterial,
  onDeleteMaterial,
  onAdjustStock,
  onCreatePo,
  allFabrics = [],
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<MaterialItem | null>(null);
  const [reorderingMaterial, setReorderingMaterial] = useState<MaterialItem | null>(null);

  const categories: { label: string; value: string }[] = [
    { label: 'All Trims', value: 'ALL' },
    { label: 'Buttons', value: 'Buttons' },
    { label: 'Linings', value: 'Linings' },
    { label: 'Canvas & Interfacing', value: 'Canvas & Interfacing' },
    { label: 'Zippers & Fasteners', value: 'Zippers & Fasteners' },
    { label: 'Threads & Sundries', value: 'Threads & Sundries' },
    { label: 'Hardware', value: 'Hardware' },
  ];

  const filteredMaterials = materials.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.colorOrFinish.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.storageBin.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === 'ALL' || item.category === categoryFilter;

    let matchesStatus = true;
    if (statusFilter === 'low_stock') matchesStatus = item.currentStock <= item.minThreshold;
    if (statusFilter === 'in_stock') matchesStatus = item.currentStock > item.minThreshold;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalValuation = materials.reduce((sum, m) => sum + m.currentStock * m.unitCost, 0);
  const lowStockCount = materials.filter((m) => m.currentStock <= m.minThreshold).length;

  return (
    <div className="space-y-6">
      {/* Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-[#141414] border border-[#222] rounded-xl">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>Material Valuation</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-serif font-bold text-white">
            £{Math.round(totalValuation).toLocaleString()}
          </div>
          <span className="text-[11px] text-gray-500">Trims, linings & sundries</span>
        </div>

        <div className="p-4 bg-[#141414] border border-[#222] rounded-xl">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>Catalog Items</span>
            <span className="text-white font-mono text-xs">SKUs</span>
          </div>
          <div className="text-2xl font-mono font-bold text-white">{materials.length}</div>
          <span className="text-[11px] text-gray-500">Across 6 haberdashery categories</span>
        </div>

        <div className="p-4 bg-[#141414] border border-[#222] rounded-xl">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>Low Stock Items</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-amber-400">{lowStockCount}</div>
          <span className="text-[11px] text-gray-500">Requires replenishing order</span>
        </div>

        <div className="p-4 bg-[#141414] border border-[#222] rounded-xl">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>Safety Coverage</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-emerald-400">
            {Math.round(((materials.length - lowStockCount) / Math.max(1, materials.length)) * 100)}%
          </div>
          <span className="text-[11px] text-gray-500">Workshop readiness index</span>
        </div>
      </div>

      {/* Category Pills Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setCategoryFilter(cat.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              categoryFilter === cat.value
                ? 'bg-amber-500 text-black font-semibold shadow-md shadow-amber-500/20'
                : 'bg-[#181818] border border-[#2a2a2a] text-gray-300 hover:text-white hover:border-[#3a3a3a]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Controls Bar */}
      <div className="p-4 bg-[#141414] border border-[#222] rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex-1 flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by trim name, SKU, drawer bin..."
              className="w-full bg-[#181818] border border-[#2a2a2a] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#181818] border border-[#2a2a2a] rounded-lg px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-amber-400"
          >
            <option value="ALL">All Levels</option>
            <option value="in_stock">Healthy Stock</option>
            <option value="low_stock">Low Stock (≤ Threshold)</option>
          </select>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-semibold rounded-lg transition-colors shadow-lg shadow-amber-500/20 self-end sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Register Material</span>
        </button>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMaterials.map((item) => {
          const isLow = item.currentStock <= item.minThreshold;
          const available = Math.max(0, item.currentStock - item.reservedStock);
          const totalVal = item.currentStock * item.unitCost;
          const progressPercent = Math.min(
            100,
            Math.max(5, (item.currentStock / (item.minThreshold * 2.5)) * 100)
          );

          return (
            <div
              key={item.id}
              className="p-4 bg-[#141414] border border-[#222] hover:border-[#333] rounded-xl flex flex-col justify-between space-y-3.5 transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-black/60 border border-[#333] text-amber-300">
                      {item.sku}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#1f1f1f] text-gray-300">
                      {item.category}
                    </span>
                  </div>

                  {isLow ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-950/80 border border-amber-500 text-amber-300">
                      LOW ({item.currentStock} {item.unit})
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-400">
                      IN STOCK
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-semibold text-white line-clamp-1">{item.name}</h3>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  {item.supplierName} • {item.colorOrFinish}
                </p>
              </div>

              {/* Location & Unit cost */}
              <div className="p-2.5 bg-[#181818] border border-[#262626] rounded-lg flex items-center justify-between text-[11px]">
                <span className="text-gray-400">
                  Bin: <strong className="text-white font-mono">{item.storageBin}</strong>
                </span>
                <span className="text-gray-300 font-mono">
                  £{item.unitCost.toFixed(2)} / {item.unit}
                </span>
              </div>

              {/* Progress and Stock Gauge */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">
                    Stock:{' '}
                    <strong className="text-white font-mono">
                      {item.currentStock} {item.unit}
                    </strong>
                  </span>
                  <span className="text-[11px] font-mono text-gray-400">
                    {available} available ({item.reservedStock} res)
                  </span>
                </div>

                <div className="w-full h-1.5 bg-[#222] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isLow ? 'bg-amber-400' : 'bg-emerald-400'
                    }`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] text-gray-500">
                  <span>Threshold: {item.minThreshold}</span>
                  <span>Std Pack: +{item.reorderQuantity}</span>
                </div>
              </div>

              {/* Quick Adjust & Actions */}
              <div className="pt-2 border-t border-[#222] flex items-center justify-between">
                {/* Quick Stepper */}
                <div className="flex items-center gap-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-0.5">
                  <button
                    onClick={() => onAdjustStock(item.id, -1)}
                    className="p-1 text-gray-400 hover:text-white hover:bg-[#252525] rounded transition-colors"
                    title="Deduct 1"
                  >
                    <MinusCircle className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-mono text-xs px-1.5 text-white font-semibold">
                    {item.currentStock}
                  </span>
                  <button
                    onClick={() => onAdjustStock(item.id, 1)}
                    className="p-1 text-gray-400 hover:text-white hover:bg-[#252525] rounded transition-colors"
                    title="Add 1"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setReorderingMaterial(item)}
                    className="p-1.5 rounded-lg bg-[#1c1c1c] hover:bg-[#252525] text-emerald-400 border border-[#2e2e2e] transition-colors"
                    title="Draft PO with Mill"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setEditingMaterial(item)}
                    className="p-1.5 rounded-lg bg-[#1c1c1c] hover:bg-[#252525] text-gray-300 hover:text-white border border-[#2e2e2e] transition-colors"
                    title="Edit Item"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete material ${item.name}?`)) {
                        onDeleteMaterial(item.id);
                      }
                    }}
                    className="p-1.5 rounded-lg bg-[#1c1c1c] hover:bg-rose-950/40 text-gray-400 hover:text-rose-400 border border-[#2e2e2e] transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modals */}
      <MaterialModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={onAddMaterial}
        suppliers={suppliers}
      />

      {editingMaterial && (
        <MaterialModal
          isOpen={!!editingMaterial}
          onClose={() => setEditingMaterial(null)}
          onSave={(data) => onUpdateMaterial(editingMaterial.id, data)}
          material={editingMaterial}
          suppliers={suppliers}
        />
      )}

      {reorderingMaterial && (
        <CreatePurchaseOrderModal
          isOpen={!!reorderingMaterial}
          onClose={() => setReorderingMaterial(null)}
          suppliers={suppliers}
          fabrics={allFabrics}
          materials={materials}
          onSave={onCreatePo}
          preselectedSupplierId={reorderingMaterial.supplierId}
          preselectedItem={{
            itemType: 'material',
            itemId: reorderingMaterial.id,
            quantity: reorderingMaterial.reorderQuantity || 50,
          }}
        />
      )}
    </div>
  );
};
