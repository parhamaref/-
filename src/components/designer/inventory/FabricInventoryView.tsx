/**
 * @file FabricInventoryView.tsx
 * Fabric Inventory module for managing textile bolts, yardage, reserves, and mill rolls.
 */

import React, { useState } from 'react';
import {
  Layers,
  Search,
  Filter,
  Plus,
  Sliders,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  ExternalLink,
  ChevronRight,
  TrendingDown,
  LayoutGrid,
  List,
  Edit2,
  Trash2,
  ShoppingCart,
} from 'lucide-react';
import { FabricItem, Supplier } from '../../../types/inventory.types';
import { FabricModal } from './FabricModal';
import { AdjustStockModal } from './AdjustStockModal';
import { FabricDetailModal } from './FabricDetailModal';
import { CreatePurchaseOrderModal } from './CreatePurchaseOrderModal';

interface FabricInventoryViewProps {
  fabrics: FabricItem[];
  suppliers: Supplier[];
  onAddFabric: (fab: any) => void;
  onUpdateFabric: (id: string, updates: Partial<FabricItem>) => void;
  onDeleteFabric: (id: string) => void;
  onAdjustStock: (
    id: string,
    delta: number,
    reason: 'delivery' | 'order_allocation' | 'sampling' | 'shrinkage' | 'manual_audit'
  ) => void;
  onCreatePo: (poData: any) => void;
  allMaterials?: any[];
}

export const FabricInventoryView: React.FC<FabricInventoryViewProps> = ({
  fabrics,
  suppliers,
  onAddFabric,
  onUpdateFabric,
  onDeleteFabric,
  onAdjustStock,
  onCreatePo,
  allMaterials = [],
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [weaveFilter, setWeaveFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingFabric, setEditingFabric] = useState<FabricItem | null>(null);
  const [adjustingFabric, setAdjustingFabric] = useState<FabricItem | null>(null);
  const [inspectingFabric, setInspectingFabric] = useState<FabricItem | null>(null);
  const [reorderingFabric, setReorderingFabric] = useState<FabricItem | null>(null);

  // Filter fabrics
  const filteredFabrics = fabrics.filter((fabric) => {
    const matchesSearch =
      fabric.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fabric.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fabric.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fabric.composition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fabric.colorName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesWeave = weaveFilter === 'ALL' || fabric.weave === weaveFilter;

    const available = fabric.currentStockMeters - fabric.reservedMeters;
    let matchesStatus = true;
    if (statusFilter === 'in_stock') matchesStatus = fabric.status === 'in_stock' && available >= 0;
    if (statusFilter === 'low_stock') matchesStatus = fabric.status === 'low_stock' && available >= 0;
    if (statusFilter === 'deficit') matchesStatus = available < 0;

    return matchesSearch && matchesWeave && matchesStatus;
  });

  // KPI Calculations
  const totalValuation = fabrics.reduce((sum, f) => sum + f.currentStockMeters * f.costPerMeter, 0);
  const totalMeters = fabrics.reduce((sum, f) => sum + f.currentStockMeters, 0);
  const totalReserved = fabrics.reduce((sum, f) => sum + f.reservedMeters, 0);
  const lowStockCount = fabrics.filter(
    (f) => f.currentStockMeters <= f.minReorderThresholdMeters || f.currentStockMeters - f.reservedMeters < 0
  ).length;

  return (
    <div className="space-y-6">
      {/* Top Metric Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-[#141414] border border-[#222] rounded-xl relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>Fabric Valuation</span>
            <Layers className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-serif font-bold text-white">
            £{Math.round(totalValuation).toLocaleString()}
          </div>
          <span className="text-[11px] text-gray-500">Across {fabrics.length} active bolts</span>
        </div>

        <div className="p-4 bg-[#141414] border border-[#222] rounded-xl relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>Total Yardage</span>
            <span className="text-emerald-400 font-mono text-xs">Physical</span>
          </div>
          <div className="text-2xl font-mono font-bold text-emerald-400">
            {totalMeters.toFixed(1)}m
          </div>
          <span className="text-[11px] text-gray-500">Continuous bolt roll balance</span>
        </div>

        <div className="p-4 bg-[#141414] border border-[#222] rounded-xl relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>Reserved Cloth</span>
            <span className="text-amber-400 font-mono text-xs">Allocated</span>
          </div>
          <div className="text-2xl font-mono font-bold text-amber-400">
            {totalReserved.toFixed(1)}m
          </div>
          <span className="text-[11px] text-gray-500">Reserved for bespoke orders</span>
        </div>

        <div className="p-4 bg-[#141414] border border-[#222] rounded-xl relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>Low Stock Bolts</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-rose-400">{lowStockCount}</div>
          <span className="text-[11px] text-gray-500">Below safety thresholds</span>
        </div>
      </div>

      {/* Control Bar: Search, Filters, View Modes & Add Action */}
      <div className="p-4 bg-[#141414] border border-[#222] rounded-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex-1 flex flex-col sm:flex-row items-center gap-3">
          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search fabric name, SKU, mill..."
              className="w-full bg-[#181818] border border-[#2a2a2a] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Weave Filter */}
          <select
            value={weaveFilter}
            onChange={(e) => setWeaveFilter(e.target.value)}
            className="w-full sm:w-auto bg-[#181818] border border-[#2a2a2a] rounded-lg px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-amber-400"
          >
            <option value="ALL">All Weave Types</option>
            <option value="Twill">Twill</option>
            <option value="Herringbone">Herringbone</option>
            <option value="Plain Weave">Plain Weave</option>
            <option value="Sateen">Sateen</option>
            <option value="Flannel">Flannel</option>
            <option value="Velvet">Velvet</option>
            <option value="Selvedge">Selvedge</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto bg-[#181818] border border-[#2a2a2a] rounded-lg px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-amber-400"
          >
            <option value="ALL">All Stock Statuses</option>
            <option value="in_stock">Healthy Stock</option>
            <option value="low_stock">Low Stock (≤ Reorder)</option>
            <option value="deficit">Critical Deficit</option>
          </select>
        </div>

        {/* View Toggle & Add Button */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          <div className="flex items-center bg-[#181818] border border-[#2a2a2a] rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded ${
                viewMode === 'grid' ? 'bg-[#2a2a2a] text-amber-400' : 'text-gray-400 hover:text-white'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded ${
                viewMode === 'table' ? 'bg-[#2a2a2a] text-amber-400' : 'text-gray-400 hover:text-white'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-semibold rounded-lg transition-colors shadow-lg shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Register Bolt</span>
          </button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFabrics.map((fabric) => {
            const available = fabric.currentStockMeters - fabric.reservedMeters;
            const isDeficit = available < 0;
            const isLow = fabric.currentStockMeters <= fabric.minReorderThresholdMeters;
            const progressPercent = Math.min(
              100,
              Math.max(5, (fabric.currentStockMeters / (fabric.minReorderThresholdMeters * 3)) * 100)
            );

            return (
              <div
                key={fabric.id}
                className="bg-[#141414] border border-[#222] hover:border-[#333] rounded-xl overflow-hidden flex flex-col transition-all group hover:shadow-xl"
              >
                {/* Swatch & Top Banner */}
                <div className="relative h-32 bg-[#1a1a1a] overflow-hidden">
                  <img
                    src={fabric.swatchImageUrl}
                    alt={fabric.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-70"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/40 to-transparent" />

                  {/* Status Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-black/80 border border-[#333] text-amber-300 font-medium">
                      {fabric.sku}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-gray-200 backdrop-blur-sm">
                      {fabric.weave}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    {isDeficit ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-950/80 border border-red-500 text-red-300 animate-pulse">
                        DEFICIT: {Math.abs(available).toFixed(1)}m
                      </span>
                    ) : isLow ? (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-950/80 border border-amber-500 text-amber-300">
                        LOW STOCK
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/50 text-emerald-400">
                        IN STOCK
                      </span>
                    )}
                  </div>

                  {/* Bottom Swatch info */}
                  <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm"
                        style={{ backgroundColor: fabric.hexColor }}
                      />
                      <span className="text-white font-medium drop-shadow truncate max-w-[150px]">
                        {fabric.colorName}
                      </span>
                    </div>
                    <span className="text-gray-300 text-[11px] drop-shadow font-mono">
                      {fabric.weightGsm} GSM • {fabric.widthCm}cm
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3
                      onClick={() => setInspectingFabric(fabric)}
                      className="text-sm font-semibold text-white hover:text-amber-400 transition-colors cursor-pointer line-clamp-1"
                    >
                      {fabric.name}
                    </h3>
                    <p className="text-[11px] text-gray-400 line-clamp-1 mt-0.5">
                      {fabric.supplierName} • {fabric.composition}
                    </p>
                  </div>

                  {/* Location & Batch */}
                  <div className="flex items-center justify-between text-[11px] text-gray-400 bg-[#181818] px-2.5 py-1.5 rounded-lg border border-[#222]">
                    <span className="flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                      {fabric.storageLocation}
                    </span>
                    <span className="font-mono text-gray-500 shrink-0">{fabric.batchLotNumber}</span>
                  </div>

                  {/* Stock Level Progress Gauge */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">
                        Roll Balance:{' '}
                        <strong className="text-white font-mono">{fabric.currentStockMeters}m</strong>
                      </span>
                      <span
                        className={`font-mono text-[11px] font-semibold ${
                          isDeficit ? 'text-red-400' : 'text-emerald-400'
                        }`}
                      >
                        {available >= 0 ? `${available.toFixed(1)}m free` : `-${Math.abs(available).toFixed(1)}m short`}
                      </span>
                    </div>

                    <div className="w-full h-1.5 bg-[#222] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isDeficit
                            ? 'bg-red-500'
                            : isLow
                            ? 'bg-amber-400'
                            : 'bg-emerald-400'
                        }`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-gray-500">
                      <span>Safety Buffer: {fabric.minReorderThresholdMeters}m</span>
                      <span>Reserved: {fabric.reservedMeters}m</span>
                    </div>
                  </div>

                  {/* Value and Actions Strip */}
                  <div className="pt-2 border-t border-[#222] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-gray-500 block">Unit Cost</span>
                      <span className="text-xs font-bold text-white font-mono">
                        £{fabric.costPerMeter}/m
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setAdjustingFabric(fabric)}
                        className="p-1.5 rounded-lg bg-[#1c1c1c] hover:bg-[#252525] text-gray-300 hover:text-white border border-[#2e2e2e] transition-colors"
                        title="Adjust Yardage"
                      >
                        <Sliders className="w-3.5 h-3.5 text-amber-400" />
                      </button>

                      <button
                        onClick={() => setReorderingFabric(fabric)}
                        className="p-1.5 rounded-lg bg-[#1c1c1c] hover:bg-[#252525] text-gray-300 hover:text-white border border-[#2e2e2e] transition-colors"
                        title="Draft PO with Mill"
                      >
                        <ShoppingCart className="w-3.5 h-3.5 text-emerald-400" />
                      </button>

                      <button
                        onClick={() => setEditingFabric(fabric)}
                        className="p-1.5 rounded-lg bg-[#1c1c1c] hover:bg-[#252525] text-gray-300 hover:text-white border border-[#2e2e2e] transition-colors"
                        title="Edit Bolt"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setInspectingFabric(fabric)}
                        className="px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-medium border border-amber-500/30 transition-colors"
                      >
                        Dossier
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-[#141414] border border-[#222] rounded-xl overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-[#262626] text-gray-400 text-[10px] uppercase tracking-wider bg-[#181818]">
                <th className="py-3 px-4">Fabric / SKU</th>
                <th className="py-3 px-3">Mill & Composition</th>
                <th className="py-3 px-3">Color / Weave</th>
                <th className="py-3 px-3 text-center">Stock / Res.</th>
                <th className="py-3 px-3 text-center">Available</th>
                <th className="py-3 px-3">Location</th>
                <th className="py-3 px-3 text-right">Cost / Valuation</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#202020]">
              {filteredFabrics.map((fabric) => {
                const available = fabric.currentStockMeters - fabric.reservedMeters;
                const isDeficit = available < 0;
                const totalVal = fabric.currentStockMeters * fabric.costPerMeter;

                return (
                  <tr key={fabric.id} className="hover:bg-[#181818] transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white truncate max-w-[180px]">
                        {fabric.name}
                      </div>
                      <div className="font-mono text-[10px] text-amber-300">{fabric.sku}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="text-gray-200">{fabric.supplierName}</div>
                      <div className="text-[10px] text-gray-500 truncate max-w-[180px]">
                        {fabric.composition}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-white/20 shrink-0"
                          style={{ backgroundColor: fabric.hexColor }}
                        />
                        <span className="text-gray-300">{fabric.colorName}</span>
                      </div>
                      <div className="text-[10px] text-gray-500">
                        {fabric.weave} • {fabric.weightGsm}gsm
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center font-mono">
                      <span className="text-white font-bold">{fabric.currentStockMeters}m</span>
                      <span className="text-gray-500 text-[10px] block">
                        ({fabric.reservedMeters}m res)
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold">
                      <span className={isDeficit ? 'text-red-400' : 'text-emerald-400'}>
                        {available.toFixed(1)}m
                      </span>
                    </td>
                    <td className="py-3 px-3 text-gray-400">{fabric.storageLocation}</td>
                    <td className="py-3 px-3 text-right font-mono">
                      <div className="text-white font-bold">£{Math.round(totalVal).toLocaleString()}</div>
                      <div className="text-gray-500 text-[10px]">£{fabric.costPerMeter}/m</div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setAdjustingFabric(fabric)}
                          className="p-1 text-gray-400 hover:text-amber-400 rounded hover:bg-[#252525]"
                          title="Adjust Yardage"
                        >
                          <Sliders className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setReorderingFabric(fabric)}
                          className="p-1 text-gray-400 hover:text-emerald-400 rounded hover:bg-[#252525]"
                          title="Draft PO"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setInspectingFabric(fabric)}
                          className="p-1 text-gray-400 hover:text-white rounded hover:bg-[#252525]"
                          title="Inspect"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      <FabricModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={onAddFabric}
        suppliers={suppliers}
      />

      {editingFabric && (
        <FabricModal
          isOpen={!!editingFabric}
          onClose={() => setEditingFabric(null)}
          onSave={(data) => onUpdateFabric(editingFabric.id, data)}
          fabric={editingFabric}
          suppliers={suppliers}
        />
      )}

      <AdjustStockModal
        isOpen={!!adjustingFabric}
        onClose={() => setAdjustingFabric(null)}
        fabric={adjustingFabric}
        onAdjust={onAdjustStock}
      />

      <FabricDetailModal
        isOpen={!!inspectingFabric}
        onClose={() => setInspectingFabric(null)}
        fabric={inspectingFabric}
        onAdjustStock={(fab) => setAdjustingFabric(fab)}
        onQuickReorder={(fab) => setReorderingFabric(fab)}
      />

      {reorderingFabric && (
        <CreatePurchaseOrderModal
          isOpen={!!reorderingFabric}
          onClose={() => setReorderingFabric(null)}
          suppliers={suppliers}
          fabrics={fabrics}
          materials={allMaterials}
          onSave={onCreatePo}
          preselectedSupplierId={reorderingFabric.supplierId}
          preselectedItem={{
            itemType: 'fabric',
            itemId: reorderingFabric.id,
            quantity: Math.max(reorderingFabric.minReorderThresholdMeters * 2, 25),
          }}
        />
      )}
    </div>
  );
};
