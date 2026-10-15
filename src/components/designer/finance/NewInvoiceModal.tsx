/**
 * @file NewInvoiceModal.tsx
 * Modal for creating and dispatching a new bespoke VAT invoice to a client.
 */

import React, { useState } from 'react';
import {
  X,
  FileText,
  Plus,
  Trash2,
  Save,
  DollarSign,
  AlertCircle,
  Building2,
} from 'lucide-react';
import { AtelierInvoice, InvoiceLineItem } from '../../../types/finance.types';

interface NewInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveInvoice: (invoiceData: any) => void;
}

export const NewInvoiceModal: React.FC<NewInvoiceModalProps> = ({
  isOpen,
  onClose,
  onSaveInvoice,
}) => {
  if (!isOpen) return null;

  const todayStr = new Date().toISOString().split('T')[0];
  const dueStr = new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0];

  const [invoiceNumber, setInvoiceNumber] = useState(
    `INV-2026-${Math.floor(100 + Math.random() * 900)}`
  );
  const [date, setDate] = useState(todayStr);
  const [dueDate, setDueDate] = useState(dueStr);
  const [clientName, setClientName] = useState('');
  const [clientCompany, setClientCompany] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientAddress, setClientAddress] = useState('Mayfair, London');
  const [orderNumber, setOrderNumber] = useState(
    `DM-2026-${Math.floor(9400 + Math.random() * 100)}`
  );
  const [garmentName, setGarmentName] = useState('Bespoke Three-Piece Suit');
  const [vatRatePercent, setVatRatePercent] = useState(20);
  const [notes, setNotes] = useState('Payment terms: Net 14 days upon invoice dispatch.');
  const [error, setError] = useState<string | null>(null);

  const [items, setItems] = useState<InvoiceLineItem[]>([
    {
      id: 'item_1',
      description: 'Bespoke Jacket Tailoring (Hand-Stitched Canvas)',
      quantity: 1,
      unitPrice: 2200,
      total: 2200,
    },
    {
      id: 'item_2',
      description: 'Bespoke Trousers & Waistcoat Finishing',
      quantity: 1,
      unitPrice: 1100,
      total: 1100,
    },
  ]);

  const handleAddItem = () => {
    const newItem: InvoiceLineItem = {
      id: `item_${Date.now()}`,
      description: 'Custom Hand Embroidery / Fitting Adjustment',
      quantity: 1,
      unitPrice: 250,
      total: 250,
    };
    setItems([...items, newItem]);
  };

  const handleUpdateItem = (index: number, updates: Partial<InvoiceLineItem>) => {
    const updated = [...items];
    const target = { ...updated[index], ...updates };
    target.total = Math.round(target.quantity * target.unitPrice * 100) / 100;
    updated[index] = target;
    setItems(updated);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) {
      setError('An invoice must contain at least one line item.');
      return;
    }
    setError(null);
    setItems(items.filter((_, i) => i !== index));
  };

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const vatAmount = Math.round(((subtotal * vatRatePercent) / 100) * 100) / 100;
  const grandTotal = subtotal + vatAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) {
      setError('Client name is required.');
      return;
    }
    if (!clientEmail.trim()) {
      setError('Client email is required.');
      return;
    }

    onSaveInvoice({
      invoiceNumber,
      date: new Date(date).toISOString(),
      dueDate: new Date(dueDate).toISOString(),
      clientName,
      clientCompany,
      clientEmail,
      clientAddress,
      orderNumber,
      garmentName,
      currency: 'GBP',
      items,
      subtotal,
      vatRatePercent,
      vatAmount,
      totalAmount: grandTotal,
      status: 'pending',
      notes,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#111] border border-[#2a2a2a] rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#222] bg-[#161616]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-serif font-bold text-white tracking-wide">
                Issue Bespoke Client Invoice
              </h2>
              <p className="text-xs text-gray-400">
                Generate itemized UK VAT invoice with automatic ledger recording
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-lg flex items-center gap-2 text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-gray-300 font-medium mb-1">Invoice Number</label>
              <input
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="w-full bg-[#181818] border border-[#333] rounded px-3 py-2 text-amber-300 font-mono"
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 font-medium mb-1">Issue Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[#181818] border border-[#333] rounded px-3 py-2 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 font-medium mb-1">Payment Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-[#181818] border border-[#333] rounded px-3 py-2 text-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-300 font-medium mb-1">Client Full Name *</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Lord Julian Thorne"
                className="w-full bg-[#181818] border border-[#333] rounded px-3 py-2 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 font-medium mb-1">Client Email *</label>
              <input
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                placeholder="client@patron.com"
                className="w-full bg-[#181818] border border-[#333] rounded px-3 py-2 text-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-300 font-medium mb-1">Bespoke Garment Name</label>
              <input
                type="text"
                value={garmentName}
                onChange={(e) => setGarmentName(e.target.value)}
                className="w-full bg-[#181818] border border-[#333] rounded px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-gray-300 font-medium mb-1">Order Number</label>
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                className="w-full bg-[#181818] border border-[#333] rounded px-3 py-2 text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 font-medium mb-1">Billing Street Address</label>
            <input
              type="text"
              value={clientAddress}
              onChange={(e) => setClientAddress(e.target.value)}
              className="w-full bg-[#181818] border border-[#333] rounded px-3 py-2 text-white"
            />
          </div>

          {/* Line items Section */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-300 uppercase tracking-wider text-[11px]">
                Invoice Line Items
              </span>
              <button
                type="button"
                onClick={handleAddItem}
                className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-semibold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Line Item</span>
              </button>
            </div>

            <div className="space-y-2">
              {items.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-2.5 bg-[#181818] border border-[#2a2a2a] rounded-lg flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => handleUpdateItem(idx, { description: e.target.value })}
                    className="flex-1 bg-[#121212] border border-[#333] rounded px-2 py-1 text-white text-xs"
                    placeholder="Description"
                  />
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      handleUpdateItem(idx, { quantity: parseInt(e.target.value, 10) || 1 })
                    }
                    className="w-14 bg-[#121212] border border-[#333] rounded px-2 py-1 text-white text-xs text-center font-mono"
                  />
                  <input
                    type="number"
                    step="10"
                    value={item.unitPrice}
                    onChange={(e) =>
                      handleUpdateItem(idx, { unitPrice: parseFloat(e.target.value) || 0 })
                    }
                    className="w-24 bg-[#121212] border border-[#333] rounded px-2 py-1 text-white text-xs text-right font-mono"
                  />
                  <span className="w-24 text-right font-mono font-bold text-white text-xs">
                    £{item.total.toFixed(2)}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(idx)}
                    className="p-1 text-gray-400 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="p-3 bg-[#181818] border border-[#2a2a2a] rounded-lg space-y-1">
            <div className="flex justify-between text-gray-400">
              <span>Subtotal:</span>
              <span className="font-mono text-white">£{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>VAT ({vatRatePercent}%):</span>
              <span className="font-mono text-white">£{vatAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-white font-bold pt-1 border-t border-[#333] text-sm">
              <span>Grand Total Due:</span>
              <span className="font-mono text-amber-400">£{grandTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#222]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-lg shadow-md transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Issue & Transmit Invoice</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
