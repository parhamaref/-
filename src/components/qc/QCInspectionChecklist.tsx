/**
 * @file QCInspectionChecklist.tsx
 * Comprehensive Categorized Quality Inspection Checklist with tolerance meters and fast status toggles.
 */

import React, { useState } from 'react';
import {
  QCInspectionChecklistItem,
  QCChecklistCategory,
  QCCheckItemStatus,
} from '../../types/qualityControl.types';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Plus,
  Filter,
  Check,
  ChevronDown,
  Info,
} from 'lucide-react';

interface QCInspectionChecklistProps {
  checklist: QCInspectionChecklistItem[];
  onUpdateItem: (itemId: string, updates: Partial<QCInspectionChecklistItem>) => void;
  onAddItem: (item: Omit<QCInspectionChecklistItem, 'id'>) => void;
}

const CATEGORIES: QCChecklistCategory[] = [
  'Symmetry & Proportions',
  'Stitch & Seam Integrity',
  'Lining & Internal Canvas',
  'Pressing & Surface Finish',
  'Hardware & Embellishment',
  'Packaging & Presentation',
];

export const QCInspectionChecklist: React.FC<QCInspectionChecklistProps> = ({
  checklist,
  onUpdateItem,
  onAddItem,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<QCChecklistCategory | 'ALL'>('ALL');
  const [showAddForm, setShowAddForm] = useState(false);

  // New item form state
  const [newCategory, setNewCategory] = useState<QCChecklistCategory>('Symmetry & Proportions');
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newToleranceMm, setNewToleranceMm] = useState<number | undefined>(0.5);

  const filteredItems = checklist.filter((item) => {
    if (selectedCategory !== 'ALL' && item.category !== selectedCategory) return false;
    return true;
  });

  const passCount = checklist.filter((i) => i.status === 'Pass').length;
  const failCount = checklist.filter((i) => i.status === 'Fail').length;
  const flagCount = checklist.filter((i) => i.status === 'Flagged').length;
  const pendingCount = checklist.filter((i) => i.status === 'Pending').length;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddItem({
      category: newCategory,
      title: newTitle.trim(),
      description: newDescription.trim(),
      toleranceMm: newToleranceMm,
      status: 'Pending',
    });

    setNewTitle('');
    setNewDescription('');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Category Filter & Metrics Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0A0A0A] p-4 border border-[#222] rounded-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider rounded-xs transition-colors cursor-pointer ${
              selectedCategory === 'ALL'
                ? 'bg-white text-black font-bold'
                : 'bg-neutral-900 text-neutral-400 hover:text-white border border-[#222]'
            }`}
          >
            All Items ({checklist.length})
          </button>
          {CATEGORIES.map((cat) => {
            const count = checklist.filter((i) => i.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1.5 text-[9.5px] font-mono uppercase tracking-wider rounded-xs transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-neutral-200 text-black font-bold'
                    : 'bg-neutral-900/80 text-neutral-400 hover:text-white border border-[#222]'
                }`}
              >
                {cat.split(' ')[0]} ({count})
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3 text-[10px] font-mono">
          <span className="flex items-center gap-1 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" /> {passCount} Pass
          </span>
          <span className="flex items-center gap-1 text-rose-400">
            <XCircle className="w-3.5 h-3.5" /> {failCount} Fail
          </span>
          <span className="flex items-center gap-1 text-amber-400">
            <AlertTriangle className="w-3.5 h-3.5" /> {flagCount} Flagged
          </span>
          <span className="flex items-center gap-1 text-neutral-400">
            <Clock className="w-3.5 h-3.5" /> {pendingCount} Pending
          </span>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1 px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded-xs border border-white/20 transition-colors cursor-pointer ml-2"
          >
            <Plus className="w-3 h-3" /> Custom Point
          </button>
        </div>
      </div>

      {/* Add Custom Point Form */}
      {showAddForm && (
        <form
          onSubmit={handleAddSubmit}
          className="bg-[#0E0E0E] p-4 border border-amber-500/30 rounded-xs space-y-3 font-mono text-[11px] animate-fadeIn"
        >
          <div className="flex items-center justify-between border-b border-[#222] pb-2">
            <span className="text-amber-400 font-bold uppercase tracking-wider text-[10px]">
              Add Specialized Tailoring Inspection Criterion
            </span>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-neutral-500 hover:text-white"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-[9px] text-neutral-500 uppercase block mb-1">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as QCChecklistCategory)}
                className="w-full bg-black border border-[#333] text-white p-2 text-[10px] rounded-xs"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-[9px] text-neutral-500 uppercase block mb-1">Inspection Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Center chest canvas pad-stitch spacing"
                className="w-full bg-black border border-[#333] text-white p-2 text-[10px] rounded-xs"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="text-[9px] text-neutral-500 uppercase block mb-1">Standard / Protocol</label>
              <input
                type="text"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="e.g. Must maintain 6-8mm staggered hand pad spacing across haircloth"
                className="w-full bg-black border border-[#333] text-white p-2 text-[10px] rounded-xs"
              />
            </div>
            <div>
              <label className="text-[9px] text-neutral-500 uppercase block mb-1">Tolerance (± mm)</label>
              <input
                type="number"
                step="0.1"
                value={newToleranceMm || ''}
                onChange={(e) => setNewToleranceMm(parseFloat(e.target.value) || 0)}
                placeholder="0.5"
                className="w-full bg-black border border-[#333] text-white p-2 text-[10px] rounded-xs"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 border border-[#333] text-neutral-400 hover:text-white rounded-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-white text-black font-bold uppercase rounded-xs hover:bg-neutral-200"
            >
              Add to Active Protocol
            </button>
          </div>
        </form>
      )}

      {/* Checklist Table */}
      <div className="bg-[#070707] border border-[#222] rounded-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-[11px]">
            <thead>
              <tr className="border-b border-[#222] bg-[#0E0E0E] text-[9px] text-neutral-500 uppercase tracking-wider">
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4">CATEGORY</th>
                <th className="py-3 px-4">INSPECTION CRITERIA & TOLERANCE</th>
                <th className="py-3 px-4">INSPECTOR OBSERVATIONS</th>
                <th className="py-3 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A1A1A]">
              {filteredItems.map((item) => {
                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-white/[0.02] transition-colors ${
                      item.status === 'Fail'
                        ? 'bg-rose-950/10'
                        : item.status === 'Flagged'
                        ? 'bg-amber-950/10'
                        : ''
                    }`}
                  >
                    {/* Status Pill */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-xs text-[9px] font-bold uppercase tracking-wider ${
                          item.status === 'Pass'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : item.status === 'Fail'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                            : item.status === 'Flagged'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                            : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                        }`}
                      >
                        {item.status === 'Pass' && <CheckCircle2 className="w-3 h-3" />}
                        {item.status === 'Fail' && <XCircle className="w-3 h-3" />}
                        {item.status === 'Flagged' && <AlertTriangle className="w-3 h-3" />}
                        {item.status === 'Pending' && <Clock className="w-3 h-3" />}
                        {item.status}
                      </span>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 text-neutral-400 text-[9.5px] uppercase whitespace-nowrap">
                      {item.category}
                    </td>

                    {/* Title & Tolerance */}
                    <td className="py-3.5 px-4 max-w-md">
                      <div className="font-bold text-white text-[11px] flex items-center gap-2">
                        {item.title}
                        {item.toleranceMm !== undefined && (
                          <span className="font-mono text-[8.5px] bg-neutral-900 border border-neutral-700 text-neutral-300 px-1.5 py-0.2 rounded-xs">
                            ±{item.toleranceMm}mm
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-neutral-400 font-sans mt-0.5 leading-relaxed">
                        {item.description}
                      </p>
                    </td>

                    {/* Inspector Notes */}
                    <td className="py-3.5 px-4 min-w-[220px]">
                      <input
                        type="text"
                        defaultValue={item.notes || ''}
                        onBlur={(e) => {
                          if (e.target.value !== (item.notes || '')) {
                            onUpdateItem(item.id, { notes: e.target.value });
                          }
                        }}
                        placeholder="Log observation..."
                        className="w-full bg-black/60 border border-[#282828] text-neutral-300 hover:border-neutral-600 focus:border-white text-[10px] p-1.5 rounded-xs outline-none transition-colors"
                      />
                    </td>

                    {/* Fast Toggle Buttons */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1 bg-[#111] p-1 border border-[#222] rounded-xs">
                        <button
                          onClick={() => onUpdateItem(item.id, { status: 'Pass' })}
                          title="Mark Pass"
                          className={`p-1 rounded-xs transition-colors cursor-pointer ${
                            item.status === 'Pass'
                              ? 'bg-emerald-600 text-white'
                              : 'text-neutral-500 hover:text-emerald-400'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onUpdateItem(item.id, { status: 'Flagged' })}
                          title="Mark Flagged"
                          className={`p-1 rounded-xs transition-colors cursor-pointer ${
                            item.status === 'Flagged'
                              ? 'bg-amber-600 text-white'
                              : 'text-neutral-500 hover:text-amber-400'
                          }`}
                        >
                          <AlertTriangle className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onUpdateItem(item.id, { status: 'Fail' })}
                          title="Mark Fail"
                          className={`p-1 rounded-xs transition-colors cursor-pointer ${
                            item.status === 'Fail'
                              ? 'bg-rose-600 text-white'
                              : 'text-neutral-500 hover:text-rose-400'
                          }`}
                        >
                          <XCircle className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
