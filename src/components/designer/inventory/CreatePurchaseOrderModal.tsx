/**
 * @file CreatePurchaseOrderModal.tsx
 * Modal for creating and dispatching mill purchase orders with multi-line item builders.
 */

import React, { useState } from 'react';
import {
  X,
  ShoppingCart,
  Plus,
  Trash2,
  FileCheck,
  Calendar,
  Truck,
  AlertCircle,
} from 'lucide-react';
import {
  Supplier,
  FabricItem,
  MaterialItem,
  PurchaseOrderLineItem,
} from '../../../types/inventory.types';

interface CreatePurchaseOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  suppliers: Supplier[];
  fabrics: FabricItem[];
  materials: MaterialItem[];
  onSave: (poData: any) => void;
  preselectedSupplierId?: string;
  preselectedItem?: {
    itemType: 'fabric' | 'material';
    itemId: string;
    quantity?: number;
  };
}

export const CreatePurchaseOrderModal: React.FC<CreatePurchaseOrderModalProps> = ({
  isOpen,
  onClose,
  suppliers,
  fabrics,
  materials,
  onSave,
  preselectedSupplierId,
  preselectedItem,
}) => {
  if (!isOpen) return null;

  const initialSupplier =
    suppliers.find((s) => s.id === preselectedSupplierId) || suppliers[0];

  const [supplierId, setSupplierId] = useState<string>(initialSupplier?.id || '');
  const [poNumber, setPoNumber] = useState<string>(
    `PO-2026-${Math.floor(100 + Math.random() * 900)}`
  );

  const todayStr = new Date().toISOString().split('T')[0];
  const nextWeekStr = new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0];

  const [issueDate, setIssueDate] = useState<string>(todayStr);
  const [expectedDate, setExpectedDate] = useState<string>(nextWeekStr);
  const [carrier, setCarrier] = useState<string>('DHL Express CrossBorder');
  const [paymentStatus, setPaymentStatus] = useState<
    'unpaid' | 'deposit_paid' | 'paid' | 'net30_pending'
  >('net30_pending');
  const [notes, setNotes] = useState<string>('Bespoke atelier cutting rolls. Please notify upon shipment.');
  const [freightAndCustoms, setFreightAndCustoms] = useState<number>(150);
  const [tax, setTax] = useState<number>(120);

  // Initial line item
  const buildInitialItems = (): PurchaseOrderLineItem[] => {
    if (preselectedItem) {
      if (preselectedItem.itemType === 'fabric') {
        const fab = fabrics.find((f) => f.id === preselectedItem.itemId);
        if (fab) {
          return [
            {
              id: `poi_${Date.now()}`,
              itemType: 'fabric',
              itemId: fab.id,
              sku: fab.sku,
              name: fab.name,
              quantity: preselectedItem.quantity || 20,
              unit: 'meters',
              unitPrice: fab.costPerMeter,
              lineTotal: (preselectedItem.quantity || 20) * fab.costPerMeter,
            },
          ];
        }
      } else {
        const mat = materials.find((m) => m.id === preselectedItem.itemId);
        if (mat) {
          return [
            {
              id: `poi_${Date.now()}`,
              itemType: 'material',
              itemId: mat.id,
              sku: mat.sku,
              name: mat.name,
              quantity: preselectedItem.quantity || mat.reorderQuantity || 50,
              unit: mat.unit,
              unitPrice: mat.unitCost,
              lineTotal:
                (preselectedItem.quantity || mat.reorderQuantity || 50) * mat.unitCost,
            },
          ];
        }
      }
    }

    // Default to first fabric matching supplier or first fabric
    const matchingFab =
      fabrics.find((f) => f.supplierId === initialSupplier?.id) || fabrics[0];
    if (matchingFab) {
      return [
        {
          id: `poi_${Date.now()}`,
          itemType: 'fabric',
          itemId: matchingFab.id,
          sku: matchingFab.sku,
          name: matchingFab.name,
          quantity: 20,
          unit: 'meters',
          unitPrice: matchingFab.costPerMeter,
          lineTotal: 20 * matchingFab.costPerMeter,
        },
      ];
    }

    return [];
  };

  const [lineItems, setLineItems] = useState<PurchaseOrderLineItem[]>(buildInitialItems());
  const [error, setError] = useState<string | null>(null);

  // Add line item
  const handleAddLineItem = () => {
    const defaultFab = fabrics[0];
    if (!defaultFab) return;
    const newItem: PurchaseOrderLineItem = {
      id: `poi_${Date.now()}_${Math.random()}`,
      itemType: 'fabric',
      itemId: defaultFab.id,
      sku: defaultFab.sku,
      name: defaultFab.name,
      quantity: 10,
      unit: 'meters',
      unitPrice: defaultFab.costPerMeter,
      lineTotal: 10 * defaultFab.costPerMeter,
    };
    setLineItems([...lineItems, newItem]);
  };

  const handleUpdateItem = (index: number, updates: Partial<PurchaseOrderLineItem>) => {
    const updated = [...lineItems];
    const item = { ...updated[index], ...updates };
    item.lineTotal = Math.round(item.quantity * item.unitPrice * 100) / 100;
    updated[index] = item;
    setLineItems(updated);
  };

  const handleSelectItemChange = (index: number, selectedValue: string) => {
    const [type, id] = selectedValue.split(':');
    if (type === 'fabric') {
      const fab = fabrics.find((f) => f.id === id);
      if (fab) {
        handleUpdateItem(index, {
          itemType: 'fabric',
          itemId: fab.id,
          sku: fab.sku,
          name: fab.name,
          unit: 'meters',
          unitPrice: fab.costPerMeter,
          quantity: lineItems[index].quantity || 15,
        });
      }
    } else {
      const mat = materials.find((m) => m.id === id);
      if (mat) {
        handleUpdateItem(index, {
          itemType: 'material',
          itemId: mat.id,
          sku: mat.sku,
          name: mat.name,
          unit: mat.unit,
          unitPrice: mat.unitCost,
          quantity: lineItems[index].quantity || mat.reorderQuantity || 50,
        });
      }
    }
  };

  const handleRemoveLineItem = (index: number) => {
    if (lineItems.length <= 1) {
      setError('A purchase order must contain at least one line item.');
      return;
    }
    setError(null);
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const subtotal = lineItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const grandTotal = subtotal + freightAndCustoms + tax;

  const handleSubmit = (status: 'draft' | 'sent' | 'confirmed') => {
    if (lineItems.length === 0) {
      setError('Please add at least one line item.');
      return;
    }

    const selectedSupplier = suppliers.find((s) => s.id === supplierId) || suppliers[0];

    onSave({
      poNumber,
      supplierId,
      supplierName: selectedSupplier.name,
      supplierContact: `${selectedSupplier.contactName} (${selectedSupplier.email})`,
      issueDate: new Date(issueDate).toISOString(),
      expectedDate: new Date(expectedDate).toISOString(),
      status,
      items: lineItems,
      subtotal,
      freightAndCustoms,
      tax,
      totalAmount: grandTotal,
      currency: 'GBP',
      paymentStatus,
      carrier,
      trackingNumber: status === 'draft' ? '' : `DHL-${Math.floor(100000000 + Math.random() * 900000000)}`,
      notes,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#111] border border-[#2a2a2a] rounded-xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#222] bg-[#161616]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-semibold text-white tracking-wide">
                Draft Mill Purchase Order
              </h2>
              <p className="text-xs text-gray-400">
                Order fabric bolts and haberdashery sundries with verified commercial terms
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-lg flex items-center gap-2 text-red-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Supplier & Header Config */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Target Mill / Supplier *</label>
              <select
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}
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
              <label className="block text-xs font-medium text-gray-300 mb-1">PO Tracking Number</label>
              <input
                type="text"
                value={poNumber}
                onChange={(e) => setPoNumber(e.target.value)}
                className="w-full bg-[#181818] border border-[#333] rounded-lg px-3 py-2 text-sm text-amber-300 font-mono focus:outline-none focus:border-amber-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Expected Delivery Date</label>
              <input
                type="date"
                value={expectedDate}
                onChange={(e) => setExpectedDate(e.target.value)}
                className="w-full bg-[#181818] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Line items Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Order Line Items ({lineItems.length})
              </label>
              <button
                type="button"
                onClick={handleAddLineItem}
                className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-medium px-2 py-1 rounded hover:bg-amber-500/10 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-2">
              {lineItems.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="p-3 bg-[#181818] border border-[#2a2a2a] rounded-lg flex flex-col md:flex-row items-center gap-3 text-xs"
                >
                  <div className="flex-1 w-full">
                    <label className="block text-[10px] text-gray-400 mb-1">Select Cloth or Trim</label>
                    <select
                      value={`${item.itemType}:${item.itemId}`}
                      onChange={(e) => handleSelectItemChange(idx, e.target.value)}
                      className="w-full bg-[#141414] border border-[#333] rounded px-2.5 py-1.5 text-xs text-white"
                    >
                      <optgroup label="Fabrics (Meters)">
                        {fabrics.map((f) => (
                          <option key={f.id} value={`fabric:${f.id}`}>
                            [Fabric] {f.sku} - {f.name} (£{f.costPerMeter}/m)
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Haberdashery Trims">
                        {materials.map((m) => (
                          <option key={m.id} value={`material:${m.id}`}>
                            [Trim] {m.sku} - {m.name} (£{m.unitCost}/{m.unit})
                          </option>
                        ))}
                      </optgroup>
                    </select>
                  </div>

                  <div className="w-24">
                    <label className="block text-[10px] text-gray-400 mb-1">Qty ({item.unit})</label>
                    <input
                      type="number"
                      step="0.5"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleUpdateItem(idx, { quantity: parseFloat(e.target.value) || 0 })
                      }
                      className="w-full bg-[#141414] border border-[#333] rounded px-2 py-1.5 text-xs text-white font-semibold"
                    />
                  </div>

                  <div className="w-24">
                    <label className="block text-[10px] text-gray-400 mb-1">Unit Price (£)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={item.unitPrice}
                      onChange={(e) =>
                        handleUpdateItem(idx, { unitPrice: parseFloat(e.target.value) || 0 })
                      }
                      className="w-full bg-[#141414] border border-[#333] rounded px-2 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div className="w-28 text-right">
                    <label className="block text-[10px] text-gray-400 mb-1">Line Total</label>
                    <div className="font-mono font-bold text-white text-sm py-1">
                      £{item.lineTotal.toLocaleString()}
                    </div>
                  </div>

                  <div className="pt-4 md:pt-0">
                    <button
                      type="button"
                      onClick={() => handleRemoveLineItem(idx)}
                      className="p-1.5 text-gray-400 hover:text-red-400 rounded hover:bg-[#222]"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Logistics & Payment */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Freight Carrier</label>
              <input
                type="text"
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                className="w-full bg-[#181818] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Commercial Payment Terms</label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value as any)}
                className="w-full bg-[#181818] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
              >
                <option value="net30_pending">Net 30 EOM (Account Credit)</option>
                <option value="deposit_paid">50% Advance Deposit Paid</option>
                <option value="paid">Full Advance Wire Settled</option>
                <option value="unpaid">Proforma Invoice Pending</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Freight & Customs (£)</label>
              <input
                type="number"
                value={freightAndCustoms}
                onChange={(e) => setFreightAndCustoms(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#181818] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Commercial Delivery Instructions</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#181818] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Pricing Totals Box */}
          <div className="p-4 bg-[#181818] border border-[#2a2a2a] rounded-xl space-y-1.5 text-xs">
            <div className="flex justify-between text-gray-400">
              <span>Subtotal (Materials & Cloth):</span>
              <span className="font-mono text-white font-medium">£{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Air Freight & Import Customs:</span>
              <span className="font-mono text-white font-medium">£{freightAndCustoms.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>VAT / Customs Tariffs:</span>
              <span className="font-mono text-white font-medium">£{tax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-white font-bold pt-2 border-t border-[#333] text-sm">
              <span className="font-serif">Grand Purchase Total:</span>
              <span className="font-mono text-amber-400 text-base">£{grandTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#222] bg-[#161616]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-gray-400 hover:text-white"
          >
            Cancel
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSubmit('draft')}
              className="px-4 py-2 text-xs font-medium text-gray-300 hover:text-white bg-[#222] hover:bg-[#2c2c2c] rounded-lg transition-colors border border-[#333]"
            >
              Save as Draft
            </button>
            <button
              type="button"
              onClick={() => handleSubmit('sent')}
              className="flex items-center gap-2 px-5 py-2 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-black rounded-lg transition-colors shadow-lg shadow-amber-500/20"
            >
              <FileCheck className="w-4 h-4" />
              <span>Issue & Transmit to Mill</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
