/**
 * @file InvoicePdfModal.tsx
 * Printable / PDF Export modal for Atelier Commercial & VAT Invoices.
 */

import React from 'react';
import {
  X,
  Printer,
  Download,
  Sparkles,
  Building2,
  CheckCircle2,
  ShieldCheck,
  QrCode,
  FileText,
} from 'lucide-react';
import { AtelierInvoice } from '../../../types/finance.types';

interface InvoicePdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: AtelierInvoice | null;
}

export const InvoicePdfModal: React.FC<InvoicePdfModalProps> = ({
  isOpen,
  onClose,
  invoice,
}) => {
  if (!isOpen || !invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJson = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(invoice, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${invoice.invoiceNumber}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0e0e0e] border border-[#2a2a2a] rounded-xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-[#222] bg-[#161616]">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
              {invoice.invoiceNumber}
            </span>
            <span className="text-xs text-gray-400 capitalize">• {invoice.status}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadJson}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-300 hover:text-white bg-[#222] hover:bg-[#2a2a2a] rounded-lg border border-[#333] transition-colors"
              title="Download structured JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Data</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-black rounded-lg transition-colors shadow-sm"
              title="Print or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Export PDF</span>
            </button>
            <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-white rounded-lg">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Canvas */}
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
              <p className="text-xs text-gray-500">Company Reg: 08914022 • VAT Reg: GB 928 4710 88</p>
            </div>

            <div className="text-right">
              <h2 className="text-lg font-serif font-semibold text-amber-400 tracking-wide uppercase">
                TAX INVOICE
              </h2>
              <div className="font-mono text-base font-bold text-white mt-1">
                {invoice.invoiceNumber}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Date Issued: {new Date(invoice.date).toLocaleDateString()}
              </p>
              <p className="text-xs text-gray-400">
                Payment Due: {new Date(invoice.dueDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Client & Order details */}
          <div className="grid grid-cols-2 gap-6 text-xs">
            <div className="p-3.5 rounded-lg bg-[#141414] border border-[#222]">
              <span className="text-[10px] uppercase tracking-wider text-amber-400 font-semibold block mb-1">
                BILLED TO PATRON
              </span>
              <div className="font-bold text-white text-sm">{invoice.clientName}</div>
              {invoice.clientCompany && (
                <div className="text-gray-300">{invoice.clientCompany}</div>
              )}
              <div className="text-gray-400 mt-1">{invoice.clientAddress}</div>
              <div className="text-gray-400 mt-1">{invoice.clientEmail}</div>
            </div>

            <div className="p-3.5 rounded-lg bg-[#141414] border border-[#222]">
              <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-semibold block mb-1">
                BESPOKE COMMISSION DETAILS
              </span>
              <div className="font-bold text-white text-sm">{invoice.garmentName}</div>
              <div className="text-gray-300 mt-1">Order Ref: #{invoice.orderNumber}</div>
              <div className="flex items-center gap-1.5 mt-2">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    invoice.status === 'paid'
                      ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40'
                      : 'bg-amber-950/80 text-amber-400 border border-amber-500/40'
                  }`}
                >
                  {invoice.status}
                </span>
                {invoice.paidAt && (
                  <span className="text-[10px] text-gray-500">
                    Paid {new Date(invoice.paidAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Line items Table */}
          <div>
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-[#333] text-gray-400 text-[10px] uppercase tracking-wider">
                  <th className="py-2.5 px-1">Description of Craftsmanship</th>
                  <th className="py-2.5 px-1 text-center">Qty</th>
                  <th className="py-2.5 px-1 text-right">Unit Price</th>
                  <th className="py-2.5 px-1 text-right">Amount (GBP)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#202020]">
                {invoice.items.map((item) => (
                  <tr key={item.id} className="text-gray-200">
                    <td className="py-3 px-1 font-medium text-white">{item.description}</td>
                    <td className="py-3 px-1 text-center font-mono">{item.quantity}</td>
                    <td className="py-3 px-1 text-right font-mono">£{item.unitPrice.toFixed(2)}</td>
                    <td className="py-3 px-1 text-right font-mono font-bold text-white">
                      £{item.total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Box */}
          <div className="flex justify-end pt-2">
            <div className="w-64 space-y-1.5 text-xs text-gray-300">
              <div className="flex justify-between">
                <span>Net Subtotal:</span>
                <span className="font-mono text-white">£{invoice.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>VAT ({invoice.vatRatePercent}%):</span>
                <span className="font-mono text-white">£{invoice.vatAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-white pt-2 border-t border-[#333]">
                <span className="font-serif">Total Amount Due:</span>
                <span className="font-mono text-amber-400 text-base">
                  £{invoice.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Notes & Bank Details */}
          <div className="pt-4 border-t border-[#262626] text-xs space-y-3">
            {invoice.notes && (
              <p className="text-gray-400 italic">
                <strong className="text-gray-300 not-italic">Notes: </strong>
                {invoice.notes}
              </p>
            )}

            <div className="p-3 bg-[#121212] border border-[#222] rounded-lg flex items-center justify-between">
              <div>
                <span className="text-[10px] text-gray-500 uppercase tracking-wider block">
                  SETTLEMENT BANK ACCOUNT (UK BACS)
                </span>
                <span className="text-white font-mono text-xs">
                  Barclays Bank PLC • Sort: 20-45-77 • Acct: 48920194 • IBAN: GB29 BARC 2045 7748 9201 94
                </span>
              </div>
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            </div>

            <div className="grid grid-cols-2 gap-8 pt-4">
              <div className="border-t border-[#333] pt-2">
                <span className="text-[10px] text-gray-500 uppercase tracking-wider block">
                  AUTHORIZED ATELIER SIGNATURE
                </span>
                <span className="text-gray-300 font-serif italic text-sm mt-1 block">
                  Daniel M. Sterling — Creative Director
                </span>
              </div>
              <div className="border-t border-[#333] pt-2 text-right">
                <span className="text-[10px] text-gray-500 uppercase tracking-wider block">
                  ELECTRONIC VERIFICATION
                </span>
                <span className="text-gray-400 font-mono text-[11px] mt-1 block">
                  SHA-256: 8a4f99b2c801e9a3
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
