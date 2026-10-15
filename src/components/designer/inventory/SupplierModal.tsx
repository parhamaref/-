/**
 * @file SupplierModal.tsx
 * Modal for registering or editing a textile mill / trim artisan supplier.
 */

import React, { useState } from 'react';
import { X, Truck, Save, AlertCircle, Award } from 'lucide-react';
import { Supplier, SupplierTier } from '../../../types/inventory.types';

interface SupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (supplierData: any) => void;
  supplier?: Supplier | null;
}

export const SupplierModal: React.FC<SupplierModalProps> = ({
  isOpen,
  onClose,
  onSave,
  supplier,
}) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    name: supplier?.name || '',
    code: supplier?.code || `MIL-${Math.floor(10 + Math.random() * 90)}`,
    specialty: supplier?.specialty || 'Superfine Suiting & Noble Fibers',
    country: supplier?.country || 'Italy',
    city: supplier?.city || 'Biella',
    contactName: supplier?.contactName || '',
    email: supplier?.email || '',
    phone: supplier?.phone || '',
    website: supplier?.website || '',
    qualityRating: supplier?.qualityRating || 4.9,
    averageLeadTimeDays: supplier?.averageLeadTimeDays || 10,
    moqMeters: supplier?.moqMeters || 5.0,
    paymentTerms: supplier?.paymentTerms || 'Net 30 EOM',
    certifications: supplier?.certifications?.join(', ') || 'OEKO-TEX 100, RWS Certified Wool',
    tier: (supplier?.tier || 'Preferred Mill') as SupplierTier,
    activePoCount: supplier?.activePoCount || 0,
    totalSpendGbp: supplier?.totalSpendGbp || 0,
    currency: supplier?.currency || 'GBP',
    notes: supplier?.notes || '',
  });

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Supplier name is required.');
      return;
    }

    const certList = formData.certifications
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    onSave({
      ...formData,
      certifications: certList,
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
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-semibold text-white tracking-wide">
                {supplier ? 'Edit Mill Supplier' : 'Register Mill Supplier'}
              </h2>
              <p className="text-xs text-gray-400">
                Manage partner mills, lead time benchmarks, MOQs, and quality credentials
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
              <label className="block text-xs font-medium text-gray-300 mb-1">Company / Mill Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Scabal S.A."
                className="w-full bg-[#181818] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Mill Code</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full bg-[#181818] border border-[#333] rounded-lg px-3 py-2 text-sm text-amber-300 font-mono focus:outline-none focus:border-amber-400"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Specialty & Heritage</label>
            <input
              type="text"
              value={formData.specialty}
              onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
              placeholder="e.g. Savile Row Suiting & Cashmere Blends"
              className="w-full bg-[#181818] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Country</label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                placeholder="e.g. Italy & United Kingdom"
                className="w-full bg-[#181818] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">City / Region</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="e.g. Biella / Piedmont"
                className="w-full bg-[#181818] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Primary Representative</label>
              <input
                type="text"
                value={formData.contactName}
                onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                placeholder="e.g. Philippe De Smet"
                className="w-full bg-[#181818] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="trade@mill.com"
                className="w-full bg-[#181818] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+39 015 7711"
                className="w-full bg-[#181818] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Partnership Tier</label>
              <select
                value={formData.tier}
                onChange={(e) => setFormData({ ...formData, tier: e.target.value as any })}
                className="w-full bg-[#181818] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
              >
                <option value="Strategic Partner">Strategic Partner</option>
                <option value="Preferred Mill">Preferred Mill</option>
                <option value="Artisan Specialist">Artisan Specialist</option>
                <option value="Standard">Standard</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Avg Lead Time (Days)</label>
              <input
                type="number"
                value={formData.averageLeadTimeDays}
                onChange={(e) =>
                  setFormData({ ...formData, averageLeadTimeDays: parseInt(e.target.value) || 0 })
                }
                className="w-full bg-[#181818] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">MOQ (Meters / Pcs)</label>
              <input
                type="number"
                step="0.5"
                value={formData.moqMeters}
                onChange={(e) =>
                  setFormData({ ...formData, moqMeters: parseFloat(e.target.value) || 0 })
                }
                className="w-full bg-[#181818] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Payment Terms</label>
              <input
                type="text"
                value={formData.paymentTerms}
                onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                placeholder="e.g. Net 30 EOM, 50% Advance"
                className="w-full bg-[#181818] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Quality Appraisal Rating (1-5)</label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="5"
                value={formData.qualityRating}
                onChange={(e) =>
                  setFormData({ ...formData, qualityRating: parseFloat(e.target.value) || 5 })
                }
                className="w-full bg-[#181818] border border-[#333] rounded-lg px-3 py-2 text-sm text-amber-400 font-bold focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Certifications & Standards (comma separated)
            </label>
            <input
              type="text"
              value={formData.certifications}
              onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
              placeholder="e.g. OEKO-TEX 100, GOTS Organic, CITES Horn Ethical"
              className="w-full bg-[#181818] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Dossier Notes & Contracts</label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Exclusive weaving agreements, seasonal sample books, custom selvedge lettering..."
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
              <span>{supplier ? 'Update Supplier' : 'Register Supplier'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
