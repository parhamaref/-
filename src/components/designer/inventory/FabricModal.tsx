/**
 * @file FabricModal.tsx
 * Modal for creating or editing a fabric bolt entry in the Atelier Inventory.
 */

import React, { useState } from 'react';
import { X, Layers, Save, AlertCircle } from 'lucide-react';
import { FabricItem, Supplier } from '../../../types/inventory.types';

interface FabricModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (fabricData: any) => void;
  fabric?: FabricItem | null;
  suppliers: Supplier[];
}

export const FabricModal: React.FC<FabricModalProps> = ({
  isOpen,
  onClose,
  onSave,
  fabric,
  suppliers,
}) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    sku: fabric?.sku || `FAB-MIL-${Math.floor(100 + Math.random() * 900)}`,
    name: fabric?.name || '',
    supplierId: fabric?.supplierId || (suppliers[0]?.id || ''),
    millCode: fabric?.millCode || '',
    composition: fabric?.composition || '100% Super 150s Worsted Wool',
    weave: fabric?.weave || 'Twill',
    weightGsm: fabric?.weightGsm || 290,
    widthCm: fabric?.widthCm || 150,
    colorName: fabric?.colorName || 'Midnight Navy',
    hexColor: fabric?.hexColor || '#0c192c',
    currentStockMeters: fabric?.currentStockMeters || 20,
    reservedMeters: fabric?.reservedMeters || 0,
    minReorderThresholdMeters: fabric?.minReorderThresholdMeters || 10,
    costPerMeter: fabric?.costPerMeter || 120,
    currency: fabric?.currency || 'GBP',
    storageLocation: fabric?.storageLocation || 'Roll Bay 01 - Shelf A1',
    batchLotNumber: fabric?.batchLotNumber || `LOT-2026-${Math.floor(10 + Math.random() * 90)}`,
    inspectionStatus: fabric?.inspectionStatus || 'Passed',
    swatchImageUrl:
      fabric?.swatchImageUrl ||
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=400&q=80',
    shrinkageRatePercent: fabric?.shrinkageRatePercent || 1.5,
    leadTimeDays: fabric?.leadTimeDays || 10,
    notes: fabric?.notes || '',
  });

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Fabric name is required.');
      return;
    }
    const selectedSupplier = suppliers.find((s) => s.id === formData.supplierId);
    const supplierName = selectedSupplier ? selectedSupplier.name : 'Unknown Mill';

    onSave({
      ...formData,
      supplierName,
      status:
        formData.currentStockMeters <= 0
          ? 'out_of_stock'
          : formData.currentStockMeters <= formData.minReorderThresholdMeters
          ? 'low_stock'
          : 'in_stock',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#111] border border-[#2a2a2a] rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#222] bg-[#161616]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-semibold text-white tracking-wide">
                {fabric ? 'Edit Fabric Bolt' : 'Register New Fabric Bolt'}
              </h2>
              <p className="text-xs text-gray-400">
                Record technical cloth specifications, roll yardage, and mill attribution
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-lg flex items-center gap-2 text-red-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Fabric Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Scabal Super 150s Worsted Wool"
                className="w-full bg-[#181818] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">SKU / Item Code</label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="w-full bg-[#181818] border border-[#333] rounded-lg px-3 py-2 text-sm text-amber-300 font-mono focus:outline-none focus:border-amber-400"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Mill Supplier *</label>
              <select
                value={formData.supplierId}
                onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
                className="w-full bg-[#181818] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
              >
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.country})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Mill Article / Cloth Code</label>
              <input
                type="text"
                value={formData.millCode}
                onChange={(e) => setFormData({ ...formData, millCode: e.target.value })}
                placeholder="e.g. SCB-BE-7729"
                className="w-full bg-[#181818] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-300 mb-1">Fiber Composition</label>
              <input
                type="text"
                value={formData.composition}
                onChange={(e) => setFormData({ ...formData, composition: e.target.value })}
                placeholder="e.g. 85% Super 150s Wool, 15% Cashmere"
                className="w-full bg-[#181818] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Weave Pattern</label>
              <select
                value={formData.weave}
                onChange={(e) => setFormData({ ...formData, weave: e.target.value as any })}
                className="w-full bg-[#181818] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
              >
                <option value="Twill">Twill</option>
                <option value="Herringbone">Herringbone</option>
                <option value="Plain Weave">Plain Weave</option>
                <option value="Sateen">Sateen</option>
                <option value="Flannel">Flannel</option>
                <option value="Jacquard">Jacquard</option>
                <option value="Velvet">Velvet</option>
                <option value="Selvedge">Selvedge</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Weight (GSM)</label>
              <input
                type="number"
                value={formData.weightGsm}
                onChange={(e) => setFormData({ ...formData, weightGsm: Number(e.target.value) })}
                className="w-full bg-[#181818] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Bolt Width (cm)</label>
              <input
                type="number"
                value={formData.widthCm}
                onChange={(e) => setFormData({ ...formData, widthCm: Number(e.target.value) })}
                className="w-full bg-[#181818] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Color Name</label>
              <input
                type="text"
                value={formData.colorName}
                onChange={(e) => setFormData({ ...formData, colorName: e.target.value })}
                placeholder="e.g. Midnight Navy"
                className="w-full bg-[#181818] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Swatch Hex</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.hexColor}
                  onChange={(e) => setFormData({ ...formData, hexColor: e.target.value })}
                  className="w-9 h-9 rounded border border-[#333] bg-transparent cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={formData.hexColor}
                  onChange={(e) => setFormData({ ...formData, hexColor: e.target.value })}
                  className="w-full bg-[#181818] border border-[#333] rounded-lg px-2 py-2 text-xs font-mono text-white"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Current Stock (Meters)</label>
              <input
                type="number"
                step="0.5"
                value={formData.currentStockMeters}
                onChange={(e) =>
                  setFormData({ ...formData, currentStockMeters: parseFloat(e.target.value) || 0 })
                }
                className="w-full bg-[#181818] border border-[#333] rounded-lg px-3 py-2 text-sm text-emerald-400 font-semibold focus:outline-none focus:border-amber-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Safety Reorder Point (Meters)</label>
              <input
                type="number"
                step="0.5"
                value={formData.minReorderThresholdMeters}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    minReorderThresholdMeters: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full bg-[#181818] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Cost Per Meter (£)</label>
              <input
                type="number"
                step="0.5"
                value={formData.costPerMeter}
                onChange={(e) =>
                  setFormData({ ...formData, costPerMeter: parseFloat(e.target.value) || 0 })
                }
                className="w-full bg-[#181818] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Atelier Storage Location</label>
              <input
                type="text"
                value={formData.storageLocation}
                onChange={(e) => setFormData({ ...formData, storageLocation: e.target.value })}
                placeholder="e.g. Roll Bay 04 - Shelf B2"
                className="w-full bg-[#181818] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Batch / Lot Number</label>
              <input
                type="text"
                value={formData.batchLotNumber}
                onChange={(e) => setFormData({ ...formData, batchLotNumber: e.target.value })}
                placeholder="e.g. LOT-2026-X89"
                className="w-full bg-[#181818] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Cutter & Tailor Notes</label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Handfeel notes, steam shrinkage observations, bias grain handling..."
              className="w-full bg-[#181818] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Footer buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#222]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-gray-400 hover:text-white hover:bg-[#222] rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-black rounded-lg transition-colors shadow-lg shadow-amber-500/20"
            >
              <Save className="w-4 h-4" />
              <span>{fabric ? 'Update Fabric Bolt' : 'Save Fabric Bolt'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
