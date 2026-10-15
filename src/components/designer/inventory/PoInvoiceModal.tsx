/**
 * @file PoInvoiceModal.tsx
 * Printable luxury purchase order dossier & commercial invoice document modal.
 */

import React from 'react';
import { X, Printer, Download, Sparkles, Building2, CheckCircle2 } from 'lucide-react';
import { PurchaseOrder } from '../../../types/inventory.types';

interface PoInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  purchaseOrder: PurchaseOrder | null;
}

export const PoInvoiceModal: React.FC<PoInvoiceModalProps> = ({
  isOpen,
  onClose,
  purchaseOrder,
}) => {
  if (!isOpen || !purchaseOrder) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0e0e0e] border border-[#2a2a2a] rounded-xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-[#222] bg-[#161616]">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
              {purchaseOrder.poNumber}
            </span>
            <span className="text-xs text-gray-400 capitalize">• {purchaseOrder.status.replace('_', ' ')}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-300 hover:text-white bg-[#222] hover:bg-[#2a2a2a] rounded-lg transition-colors border border-[#333]"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print PO</span>
            </button>
            <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-white rounded-lg">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Sheet */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-[#0a0a0a] text-white">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-[#262626] pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h1 className="text-xl font-serif font-bold tracking-widest uppercase">
                  DANIELS ATELIER
                </h1>
              </div>
              <p className="text-xs text-gray-400">Haute Bespoke Tailoring & Wardrobe House</p>
              <p className="text-xs text-gray-500">14 Savile Row, Mayfair, London W1S 3JN</p>
              <p className="text-xs text-gray-500">VAT Reg: GB 928 4710 88</p>
            </div>

            <div className="text-right">
              <h2 className="text-lg font-serif font-semibold text-amber-400 tracking-wide uppercase">
                COMMERCIAL PURCHASE ORDER
              </h2>
              <div className="font-mono text-base font-bold text-white mt-1">
                {purchaseOrder.poNumber}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Date Issued: {new Date(purchaseOrder.issueDate).toLocaleDateString()}
              </p>
              <p className="text-xs text-gray-400">
                Delivery Expected: {new Date(purchaseOrder.expectedDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Supplier vs Delivery Addresses */}
          <div className="grid grid-cols-2 gap-6 text-xs">
            <div className="p-3.5 rounded-lg bg-[#141414] border border-[#222]">
              <span className="text-[10px] uppercase tracking-wider text-amber-400 font-semibold block mb-1">
                VENDOR / TEXTILE MILL
              </span>
              <div className="font-bold text-white text-sm">{purchaseOrder.supplierName}</div>
              <div className="text-gray-300 mt-1">{purchaseOrder.supplierContact}</div>
              <div className="text-gray-400 mt-1">Payment: {purchaseOrder.paymentStatus}</div>
            </div>

            <div className="p-3.5 rounded-lg bg-[#141414] border border-[#222]">
              <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-semibold block mb-1">
                SHIP TO ATELIER WORKSHOP
              </span>
              <div className="font-bold text-white text-sm">Daniels Atelier Workshop Floor</div>
              <div className="text-gray-300 mt-1">Attn: Cutting Floor & Material Vault</div>
              <div className="text-gray-400 mt-1">
                Carrier: {purchaseOrder.carrier || 'DHL Express CrossBorder'}
              </div>
            </div>
          </div>

          {/* Line items Table */}
          <div>
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-[#333] text-gray-400 text-[10px] uppercase tracking-wider">
                  <th className="py-2 px-1">Item / Cloth SKU</th>
                  <th className="py-2 px-1">Description</th>
                  <th className="py-2 px-1 text-center">Qty</th>
                  <th className="py-2 px-1 text-right">Unit Price</th>
                  <th className="py-2 px-1 text-right">Line Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#202020]">
                {purchaseOrder.items.map((item) => (
                  <tr key={item.id} className="text-gray-200">
                    <td className="py-2.5 px-1 font-mono text-amber-300 font-medium">{item.sku}</td>
                    <td className="py-2.5 px-1 font-medium text-white">{item.name}</td>
                    <td className="py-2.5 px-1 text-center font-mono">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="py-2.5 px-1 text-right font-mono">£{item.unitPrice.toFixed(2)}</td>
                    <td className="py-2.5 px-1 text-right font-mono font-bold text-white">
                      £{item.lineTotal.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Summary */}
          <div className="flex justify-end pt-2">
            <div className="w-64 space-y-1.5 text-xs text-gray-300">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-mono text-white">£{purchaseOrder.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping & Insurance:</span>
                <span className="font-mono text-white">
                  £{purchaseOrder.freightAndCustoms.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>VAT & Duties:</span>
                <span className="font-mono text-white">£{purchaseOrder.tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-white pt-2 border-t border-[#333]">
                <span className="font-serif">Total Order Value:</span>
                <span className="font-mono text-amber-400 text-base">
                  £{purchaseOrder.totalAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Notes & Authorizations */}
          <div className="pt-4 border-t border-[#262626] text-xs space-y-3">
            {purchaseOrder.notes && (
              <p className="text-gray-400 italic">
                <strong className="text-gray-300 not-italic">Notes: </strong>
                {purchaseOrder.notes}
              </p>
            )}

            {purchaseOrder.receivingNotes && (
              <div className="p-2.5 rounded bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 text-[11px] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>
                  <strong>Received: </strong> {purchaseOrder.receivingNotes} (Inspector:{' '}
                  {purchaseOrder.receivedBy})
                </span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-8 pt-4">
              <div className="border-t border-[#333] pt-2">
                <span className="text-[10px] text-gray-500 uppercase tracking-wider block">
                  AUTHORIZED SIGNATURE (ATELIER)
                </span>
                <span className="text-gray-300 font-serif italic text-sm mt-1 block">
                  Daniel M. Sterling — Creative Director
                </span>
              </div>
              <div className="border-t border-[#333] pt-2">
                <span className="text-[10px] text-gray-500 uppercase tracking-wider block">
                  MILL ACCEPTANCE & SHIPMENT RECEIPT
                </span>
                <span className="text-gray-400 text-xs mt-1 block">Commercial Registry Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
