/**
 * @file ProductPerformanceView.tsx
 * Garment Specimen & Silhouette Performance Analytics for Daniel’s Maison.
 * Highlights bestsellers, conversion rates, unit volume, gross margin %,
 * alteration/return rates, customer ratings, and category filters.
 */

import React, { useState } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  Star,
  TrendingUp,
  Percent,
  RotateCcw,
  Sparkles,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Package,
} from 'lucide-react';
import { ProductPerformanceMetric } from '../../../types/analytics.types';

interface ProductPerformanceViewProps {
  products: ProductPerformanceMetric[];
}

type SortField = 'revenue' | 'units' | 'conversion' | 'margin' | 'return' | 'rating';

export const ProductPerformanceView: React.FC<ProductPerformanceViewProps> = ({
  products,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [sortField, setSortField] = useState<SortField>('revenue');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  // Filter products
  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === 'ALL' || p.category.toUpperCase() === categoryFilter.toUpperCase();
    return matchesSearch && matchesCategory;
  });

  // Sort products
  const sorted = [...filtered].sort((a, b) => {
    let valA = 0;
    let valB = 0;
    switch (sortField) {
      case 'revenue':
        valA = a.totalRevenue;
        valB = b.totalRevenue;
        break;
      case 'units':
        valA = a.unitsSold;
        valB = b.unitsSold;
        break;
      case 'conversion':
        valA = a.conversionRate;
        valB = b.conversionRate;
        break;
      case 'margin':
        valA = a.grossMarginPct;
        valB = b.grossMarginPct;
        break;
      case 'return':
        valA = a.returnRate;
        valB = b.returnRate;
        break;
      case 'rating':
        valA = a.rating;
        valB = b.rating;
        break;
    }
    return sortAsc ? valA - valB : valB - valA;
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  // Top performers
  const topRevenueProduct = [...products].sort((a, b) => b.totalRevenue - a.totalRevenue)[0];
  const topConversionProduct = [...products].sort((a, b) => b.conversionRate - a.conversionRate)[0];
  const topMarginProduct = [...products].sort((a, b) => b.grossMarginPct - a.grossMarginPct)[0];
  const maxRevenue = Math.max(...products.map((p) => p.totalRevenue), 1);

  return (
    <div className="space-y-6 text-left">
      {/* Top Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {topRevenueProduct && (
          <div className="p-5 rounded-xl bg-[#0c0c0c] border border-amber-500/20 relative overflow-hidden">
            <span className="text-amber-400 font-mono text-[10px] uppercase tracking-widest block">
              ★ TOP REVENUE SILHOUETTE
            </span>
            <div className="mt-2 flex gap-4 items-center">
              <img
                src={topRevenueProduct.imageUrl}
                alt={topRevenueProduct.name}
                className="w-12 h-16 object-cover rounded-sm border border-[#222]"
              />
              <div>
                <h4 className="font-serif text-sm font-bold text-white truncate max-w-[180px]">
                  {topRevenueProduct.name}
                </h4>
                <div className="font-mono text-xs text-amber-300 font-semibold mt-0.5">
                  £{topRevenueProduct.totalRevenue.toLocaleString()} ({topRevenueProduct.unitsSold} units)
                </div>
                <span className="text-[10px] text-neutral-400 font-mono">
                  {topRevenueProduct.category} · {topRevenueProduct.conversionRate}% conversion
                </span>
              </div>
            </div>
          </div>
        )}

        {topConversionProduct && (
          <div className="p-5 rounded-xl bg-[#0c0c0c] border border-emerald-500/20 relative overflow-hidden">
            <span className="text-emerald-400 font-mono text-[10px] uppercase tracking-widest block">
              ⚡ HIGHEST CONVERTING ARTIFACT
            </span>
            <div className="mt-2 flex gap-4 items-center">
              <img
                src={topConversionProduct.imageUrl}
                alt={topConversionProduct.name}
                className="w-12 h-16 object-cover rounded-sm border border-[#222]"
              />
              <div>
                <h4 className="font-serif text-sm font-bold text-white truncate max-w-[180px]">
                  {topConversionProduct.name}
                </h4>
                <div className="font-mono text-xs text-emerald-300 font-semibold mt-0.5">
                  {topConversionProduct.conversionRate}% Conversion Rate
                </div>
                <span className="text-[10px] text-neutral-400 font-mono">
                  £{topConversionProduct.price} · {topConversionProduct.unitsSold} commissions
                </span>
              </div>
            </div>
          </div>
        )}

        {topMarginProduct && (
          <div className="p-5 rounded-xl bg-[#0c0c0c] border border-sky-500/20 relative overflow-hidden">
            <span className="text-sky-400 font-mono text-[10px] uppercase tracking-widest block">
              ✦ HIGHEST GROSS MARGIN
            </span>
            <div className="mt-2 flex gap-4 items-center">
              <img
                src={topMarginProduct.imageUrl}
                alt={topMarginProduct.name}
                className="w-12 h-16 object-cover rounded-sm border border-[#222]"
              />
              <div>
                <h4 className="font-serif text-sm font-bold text-white truncate max-w-[180px]">
                  {topMarginProduct.name}
                </h4>
                <div className="font-mono text-xs text-sky-300 font-semibold mt-0.5">
                  {topMarginProduct.grossMarginPct}% Gross Margin
                </div>
                <span className="text-[10px] text-neutral-400 font-mono">
                  {topMarginProduct.stockStatus} · 4.99★ rating
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="p-5 rounded-2xl bg-[#0c0c0c] border border-[#222] space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by silhouette, SKU, or textile..."
              className="w-full bg-[#141414] border border-[#262626] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:border-amber-400 font-mono"
            />
          </div>

          {/* Category Filter Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#141414] border border-[#262626] rounded-xl">
            {['ALL', 'Suiting', 'Outerwear', 'Eveningwear', 'Knitwear', 'Accessories'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-colors ${
                  categoryFilter.toUpperCase() === cat.toUpperCase()
                    ? 'bg-amber-400 text-black font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Performance Table */}
        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-[#222] text-neutral-400 text-[10px] uppercase tracking-wider">
                <th className="py-3 px-3">Garment Silhouette</th>
                <th
                  onClick={() => handleSort('revenue')}
                  className="py-3 px-3 text-right cursor-pointer hover:text-white"
                >
                  <div className="inline-flex items-center gap-1">
                    <span>Revenue</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('units')}
                  className="py-3 px-3 text-right cursor-pointer hover:text-white"
                >
                  <div className="inline-flex items-center gap-1">
                    <span>Units</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('conversion')}
                  className="py-3 px-3 text-right cursor-pointer hover:text-white"
                >
                  <div className="inline-flex items-center gap-1">
                    <span>Conversion</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('margin')}
                  className="py-3 px-3 text-right cursor-pointer hover:text-white"
                >
                  <div className="inline-flex items-center gap-1">
                    <span>Margin %</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('return')}
                  className="py-3 px-3 text-right cursor-pointer hover:text-white"
                >
                  <div className="inline-flex items-center gap-1">
                    <span>Alterations</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('rating')}
                  className="py-3 px-3 text-right cursor-pointer hover:text-white"
                >
                  <div className="inline-flex items-center gap-1">
                    <span>Rating</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-3 text-right">Production State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#181818]">
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-neutral-500">
                    No artifacts match current search filter.
                  </td>
                </tr>
              ) : (
                sorted.map((prod) => {
                  const revBarPct = Math.round((prod.totalRevenue / maxRevenue) * 100);
                  return (
                    <tr key={prod.id} className="hover:bg-[#141414] transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={prod.imageUrl}
                            alt={prod.name}
                            className="w-10 h-14 object-cover rounded-xs border border-[#222] shrink-0"
                          />
                          <div>
                            <span className="font-serif text-sm font-bold text-white block">
                              {prod.name}
                            </span>
                            <div className="flex items-center gap-2 text-[10px] text-neutral-400 font-mono mt-0.5">
                              <span>{prod.sku}</span>
                              <span>·</span>
                              <span>{prod.category}</span>
                              <span>·</span>
                              <span>£{prod.price.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Revenue with relative mini-bar */}
                      <td className="py-3 px-3 text-right">
                        <span className="font-bold text-amber-300 text-sm block">
                          £{prod.totalRevenue.toLocaleString()}
                        </span>
                        <div className="w-24 h-1.5 bg-[#222] rounded-full ml-auto mt-1 overflow-hidden">
                          <div
                            className="h-full bg-amber-400 rounded-full"
                            style={{ width: `${revBarPct}%` }}
                          />
                        </div>
                      </td>

                      <td className="py-3 px-3 text-right font-semibold text-white">
                        {prod.unitsSold}
                      </td>

                      <td className="py-3 px-3 text-right">
                        <span className="font-semibold text-emerald-400">
                          {prod.conversionRate}%
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right text-sky-300 font-semibold">
                        {prod.grossMarginPct}%
                      </td>

                      <td className="py-3 px-3 text-right">
                        <span
                          className={`text-xs ${
                            prod.returnRate <= 1.0 ? 'text-emerald-400' : 'text-amber-400'
                          }`}
                        >
                          {prod.returnRate}%
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right">
                        <div className="inline-flex items-center gap-1 text-amber-300 font-bold">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{prod.rating.toFixed(2)}</span>
                          <span className="text-[9px] text-neutral-500 font-normal">
                            ({prod.reviewsCount})
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-3 text-right">
                        <span className="text-[10px] font-mono text-neutral-300 px-2 py-0.5 rounded-sm bg-[#1c1c1c] border border-[#2e2e2e]">
                          {prod.stockStatus}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
