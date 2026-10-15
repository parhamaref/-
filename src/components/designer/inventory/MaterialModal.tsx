/**
 * @file MaterialModal.tsx
 * Modal for creating or editing Haberdashery Trims, Linings, Buttons, and Hardware.
 */

import React, { useState } from 'react';
import { X, Sparkles, Save, AlertCircle } from 'lucide-react';
import { MaterialItem, MaterialCategory, MaterialUnit, Supplier } from '../../../types/inventory.types';

interface MaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (materialData: any) => void;
  material?: MaterialItem | null;
  suppliers: Supplier[];
}

export const MaterialModal: React.FC<MaterialModalProps> = ({
  isOpen,
  onClose,
  onSave,
  material,
  suppliers,
}) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    sku: material?.sku || `TRM-GEN-${Math.floor(100 + Math.random() * 900)}`,
    name: material?.name || '',
    category: (material?.category || 'Buttons') as MaterialCategory,
    supplierId: material?.supplierId || (suppliers[0]?.id || ''),
    unit: (material?.unit || 'pieces') as MaterialUnit,
    unitCost: material?.unitCost || 2.5,
    currency: material?.currency || 'GBP',
    currentStock: material?.currentStock || 50,
    reservedStock: material?.reservedStock || 0,
    minThreshold: material?.minThreshold || 20,
    reorderQuantity: material?.reorderQuantity || 100,
    storageBin: material?.storageBin || 'Drawer B-01',
    colorOrFinish: material?.colorOrFinish || 'Smoked Horn / Polished',
    photoUrl:
      material?.photoUrl ||
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=300&q=80',
    notes: material?.notes || '',
  });

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Material name is required.');
      return;
    }

    const selectedSupplier = suppliers.find((s) => s.id === formData.supplierId);
    const supplierName = selectedSupplier ? selectedSupplier.name : 'Unknown Supplier';

    onSave({
      ...formData,
      supplierName,
      status:
        formData.currentStock <= 0
          ? 'out_of_stock'
          : formData.currentStock <= formData.minThreshold
          ? 'low_stock'
          : 'in_stock',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#111] border border-[#2a2a2a] rounded-xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#222] bg-[#161616]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-semibold text-white tracking-wide">
                {material ? 'Edit Haberdashery Material' : 'Register New Haberdashery Item'}
              </h2>
              <p className="text-xs text-gray-400">
                Track trims, buttons, linings, floating canvas, and fasteners
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-lg flex items-center gap-2 text-red-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Item Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Genuine Horn Buttons 32L"
                className="w-full bg-[#181818] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">SKU / Code</label>
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
              <label className="block text-xs font-medium text-gray-300 mb-1">Material Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full bg-[#181818] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
              >
                <option value="Buttons">Buttons</option>
                <option value="Linings">Linings</option>
                <option value="Canvas & Interfacing">Canvas & Interfacing</option>
                <option value="Zippers & Fasteners">Zippers & Fasteners</option>
                <option value="Threads & Sundries">Threads & Sundries</option>
                <option value="Hardware">Hardware</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Supplier / Artisan</label>
              <select
                value={formData.supplierId}
                onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
                className="w-full bg-[#181818] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
              >
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Unit of Measure</label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value as any })}
                className="w-full bg-[#181818] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
              >
                <option value="pieces">Pieces</option>
                <option value="meters">Meters</option>
                <option value="spools">Spools</option>
                <option value="sets">Sets</option>
                <option value="gross">Gross (144 pcs)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Unit Cost (£)</label>
              <input
                type="number"
                step="0.1"
                value={formData.unitCost}
                onChange={(e) =>
                  setFormData({ ...formData, unitCost: parseFloat(e.target.value) || 0 })
                }
                className="w-full bg-[#181818] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Color / Finish</label>
              <input
                type="text"
                value={formData.colorOrFinish}
                onChange={(e) => setFormData({ ...formData, colorOrFinish: e.target.value })}
                placeholder="e.g. Matte Antique Brass"
                className="w-full bg-[#181818] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Current Stock</label>
              <input
                type="number"
                value={formData.currentStock}
                onChange={(e) =>
                  setFormData({ ...formData, currentStock: parseFloat(e.target.value) || 0 })
                }
                className="w-full bg-[#181818] border border-[#333] rounded-lg px-3 py-2 text-sm text-emerald-400 font-bold focus:outline-none focus:border-amber-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Reorder Point</label>
              <input
                type="number"
                value={formData.minThreshold}
                onChange={(e) =>
                  setFormData({ ...formData, minThreshold: parseFloat(e.target.value) || 0 })
                }
                className="w-full bg-[#181818] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Standard Reorder Pack</label>
              <input
                type="number"
                value={formData.reorderQuantity}
                onChange={(e) =>
                  setFormData({ ...formData, reorderQuantity: parseFloat(e.target.value) || 0 })
                }
                className="w-full bg-[#181818] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Storage Drawer / Bin</label>
              <input
                type="text"
                value={formData.storageBin}
                onChange={(e) => setFormData({ ...formData, storageBin: e.target.value })}
                placeholder="e.g. Drawer B-04"
                className="w-full bg-[#181818] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Item Photo / Asset URL</label>
              <input
                type="text"
                value={formData.photoUrl}
                onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                className="w-full bg-[#181818] border border-[#333] rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-amber-400 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Notes & Application Guide</label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="e.g. For tuxedo jacket front closures. Match with Gütermann thread Col. 910."
              className="w-full bg-[#181818] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#222]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-black rounded-lg transition-colors shadow-lg shadow-amber-500/20"
            >
              <Save className="w-4 h-4" />
              <span>{material ? 'Update Material' : 'Save Material'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
