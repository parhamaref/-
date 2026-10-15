/**
 * @file DigitalWardrobeWorkspace.tsx
 * Customer Master UI for the Daniel’s Maison Digital Wardrobe Management System.
 * Houses My Wardrobe Dashboard, Category Filters, Garment Library Grid,
 * Action Modals, and Atelier Service Trackers.
 */

import React, { useState } from 'react';
import {
  Layers,
  Sparkles,
  Scissors,
  ShieldCheck,
  Search,
  Filter,
  Download,
  Eye,
  ShoppingBag,
  Truck,
  Droplets,
  RefreshCw,
  Plus,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { useWardrobeStore } from '../../../stores/wardrobeStore';
import {
  WardrobeCategory,
  GarmentStatus,
  WardrobeItemFull,
  ServiceActionType,
} from '../../../types/wardrobe.types';
import { GarmentDetailModal } from './GarmentDetailModal';
import { WardrobeActionModal } from './WardrobeActionModal';
import { WardrobeServiceTrackerModal } from './WardrobeServiceTrackerModal';
import { RequestAlterationModal } from '../../alterations/RequestAlterationModal';

interface DigitalWardrobeWorkspaceProps {
  customerId?: string;
  customerName?: string;
  onNavigateHome?: () => void;
}

export const DigitalWardrobeWorkspace: React.FC<DigitalWardrobeWorkspaceProps> = ({
  customerId = 'cust_001',
  customerName = 'Lord Alistair Sterling-Fox',
}) => {
  const {
    filteredItems,
    metrics,
    filters,
    setFilters,
    serviceRequests,
    exportWardrobeInventoryCsv,
  } = useWardrobeStore();

  const [inspectingItem, setInspectingItem] = useState<WardrobeItemFull | null>(null);
  const [actionItem, setActionItem] = useState<WardrobeItemFull | null>(null);
  const [activeActionType, setActiveActionType] = useState<ServiceActionType | null>(null);
  const [alterationModalItemId, setAlterationModalItemId] = useState<string | null>(null);
  const [trackingRequestId, setTrackingRequestId] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string>('');

  const activeServiceRequests = serviceRequests.filter(
    (s) => s.status !== 'COMPLETED' && s.status !== 'CANCELLED'
  );

  const categories: Array<{ id: WardrobeCategory | 'ALL'; label: string; count: number }> = [
    { id: 'ALL', label: 'All Garments', count: metrics.totalGarments },
    { id: 'SUITS', label: 'Suits', count: metrics.categoryCounts.SUITS },
    { id: 'SHIRTS', label: 'Shirts', count: metrics.categoryCounts.SHIRTS },
    { id: 'COATS', label: 'Coats', count: metrics.categoryCounts.COATS },
    { id: 'DRESSES', label: 'Dresses', count: metrics.categoryCounts.DRESSES },
    { id: 'ACCESSORIES', label: 'Accessories', count: metrics.categoryCounts.ACCESSORIES },
  ];

  const handleLaunchGarmentAction = (item: WardrobeItemFull, type: ServiceActionType) => {
    if (type === 'REQUEST_ALTERATION') {
      setAlterationModalItemId(item.id);
      return;
    }
    setActionItem(item);
    setActiveActionType(type);
  };

  const handleActionSuccess = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 5000);
  };

  const trackingRequest = serviceRequests.find((s) => s.id === trackingRequestId) || null;

  return (
    <div className="space-y-8 animate-fadeIn font-mono text-left">
      {/* Dedicated Alteration Wizard Modal */}
      <RequestAlterationModal
        isOpen={Boolean(alterationModalItemId)}
        initialGarmentId={alterationModalItemId}
        onClose={() => setAlterationModalItemId(null)}
        onSuccess={() => handleActionSuccess('Bespoke alteration request submitted successfully under 6-stage workflow!')}
      />

      {/* Detail Modal */}
      <GarmentDetailModal
        item={inspectingItem}
        isOpen={Boolean(inspectingItem)}
        onClose={() => setInspectingItem(null)}
        onOpenActionModal={(type) => {
          if (inspectingItem) {
            handleLaunchGarmentAction(inspectingItem, type);
          }
        }}
      />

      {/* Action Modal */}
      <WardrobeActionModal
        item={actionItem}
        isOpen={Boolean(actionItem && activeActionType)}
        actionType={activeActionType}
        onClose={() => {
          setActionItem(null);
          setActiveActionType(null);
        }}
        onSuccess={handleActionSuccess}
      />

      {/* Service Tracker Modal */}
      <WardrobeServiceTrackerModal
        request={trackingRequest}
        isOpen={Boolean(trackingRequestId)}
        onClose={() => setTrackingRequestId(null)}
      />

      {/* Success Notification Toast */}
      {successToast && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs rounded-xl flex items-center gap-2.5 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
          <span className="font-sans leading-relaxed">{successToast}</span>
        </div>
      )}

      {/* Wardrobe Overview Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0E0E0E] border border-[#222] space-y-1">
          <div className="flex items-center justify-between text-neutral-400 text-[10px] uppercase tracking-wider">
            <span>Archive Pieces</span>
            <Layers className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-white text-xl sm:text-2xl font-bold font-serif">
            {metrics.totalGarments} Garments
          </div>
          <span className="text-[10px] text-neutral-500 font-sans block">
            Across 5 Bespoke Categories
          </span>
        </div>

        {/* Metric 2 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0E0E0E] border border-[#222] space-y-1">
          <div className="flex items-center justify-between text-neutral-400 text-[10px] uppercase tracking-wider">
            <span>Wardrobe Valuation</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-white text-xl sm:text-2xl font-bold font-serif">
            £{metrics.totalValuationGbp.toLocaleString()}
          </div>
          <span className="text-[10px] text-neutral-500 font-sans block">
            Certified Bespoke Replacement Value
          </span>
        </div>

        {/* Metric 3 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0E0E0E] border border-[#222] space-y-1">
          <div className="flex items-center justify-between text-neutral-400 text-[10px] uppercase tracking-wider">
            <span>In Atelier Service</span>
            <Scissors className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-amber-400 text-xl sm:text-2xl font-bold font-serif">
            {metrics.garmentsInAtelier} Active
          </div>
          <span className="text-[10px] text-neutral-500 font-sans block">
            Care, Alterations & Courier Dispatches
          </span>
        </div>

        {/* Metric 4 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0E0E0E] border border-[#222] space-y-1">
          <div className="flex items-center justify-between text-neutral-400 text-[10px] uppercase tracking-wider">
            <span>Lifetime Warranties</span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-emerald-400 text-xl sm:text-2xl font-bold font-serif">
            {metrics.activeWarrantiesCount} Registered
          </div>
          <span className="text-[10px] text-neutral-500 font-sans block">
            Complimentary Lifetime Stewardship
          </span>
        </div>
      </div>

      {/* Active Service Requests Strip */}
      {activeServiceRequests.length > 0 && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-[#141414] to-[#0E0E0E] border border-amber-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
              <Truck className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>Active Atelier Service Pipeline ({activeServiceRequests.length})</span>
            </div>
            <span className="text-[10px] text-neutral-400">Track White-Glove Custody</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {activeServiceRequests.map((req) => (
              <div
                key={req.id}
                className="p-3 rounded-xl bg-black/60 border border-neutral-800 flex items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5 overflow-hidden">
                  <span className="text-white font-bold block truncate">{req.garmentName}</span>
                  <span className="text-[10px] text-amber-300 font-mono block">
                    {req.actionType.replace(/_/g, ' ')} • Status: {req.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <button
                  onClick={() => setTrackingRequestId(req.id)}
                  className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-[10px] font-bold uppercase rounded-lg transition-colors shrink-0"
                >
                  View Timeline →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter & Search Toolbar */}
      <div className="space-y-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilters(cat.id, filters.status, filters.search)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border flex items-center gap-2 ${
                filters.category === cat.id
                  ? 'bg-amber-500/10 border-amber-500/50 text-amber-300 shadow-md shadow-amber-500/5'
                  : 'bg-[#0E0E0E] border-[#222] text-neutral-400 hover:text-white'
              }`}
            >
              <span>{cat.label}</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-neutral-800 text-neutral-400 font-mono">
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search, Status Dropdown, and CSV Export */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters(filters.category, filters.status, e.target.value)}
              placeholder="Filter by garment, mill, fabric, color, or tailor..."
              className="w-full pl-9 pr-4 py-2 bg-[#101010] border border-[#2B2B2B] rounded-xl text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-amber-500/60"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters(filters.category, e.target.value as any, filters.search)
              }
              className="bg-[#101010] border border-[#2B2B2B] px-3 py-2 rounded-xl text-xs text-neutral-300 focus:outline-none focus:border-amber-500/60"
            >
              <option value="ALL">All Garment Statuses</option>
              <option value="IN_WARDROBE">In Wardrobe</option>
              <option value="IN_ATELIER">In Atelier</option>
              <option value="ALTERATION_IN_PROGRESS">Alteration in Progress</option>
              <option value="CARE_IN_PROGRESS">Care Revival</option>
              <option value="DISPATCHED_RETURN">Courier Return</option>
            </select>

            <button
              onClick={exportWardrobeInventoryCsv}
              className="px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs rounded-xl flex items-center gap-1.5 border border-neutral-700 transition-colors"
              title="Export Wardrobe Inventory for Insurance Dossier"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Export Dossier (CSV)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Garments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-[#0E0E0E] border border-[#222] rounded-2xl text-neutral-500 space-y-2">
            <Layers className="w-10 h-10 mx-auto opacity-30 text-amber-400" />
            <p className="text-sm text-neutral-300 font-bold">No garments match the current criteria.</p>
            <p className="text-xs text-neutral-500 font-sans">
              Try adjusting your category filter or search keywords.
            </p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-[#0E0E0E] border border-[#222] hover:border-neutral-700 rounded-2xl overflow-hidden transition-all duration-300 group flex flex-col justify-between shadow-xl"
            >
              <div>
                {/* Photo Header */}
                <div className="aspect-[4/5] w-full relative overflow-hidden bg-black">
                  <img
                    src={item.primaryImageUrl}
                    alt={item.garmentName}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Category Pill */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full text-[9px] font-bold bg-black/70 backdrop-blur-md text-amber-300 border border-amber-500/30 uppercase tracking-widest">
                      {item.category}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider backdrop-blur-md border ${
                        item.status === 'IN_WARDROBE'
                          ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300'
                          : 'bg-amber-950/70 border-amber-500/40 text-amber-300 animate-pulse'
                      }`}
                    >
                      {item.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  {/* Overlay inspect trigger */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => setInspectingItem(item)}
                      className="px-4 py-2 bg-white text-black font-bold text-xs uppercase tracking-wider rounded-xl shadow-xl flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-all cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Inspect Dossier</span>
                    </button>
                  </div>
                </div>

                {/* Content Info */}
                <div className="p-5 space-y-3">
                  <div className="space-y-1">
                    <span className="text-[10px] text-neutral-500 uppercase tracking-widest block font-mono">
                      {item.originalOrderId} • {item.material.fabricMillName}
                    </span>
                    <h3 className="font-serif text-base font-bold text-white uppercase tracking-wider group-hover:text-amber-300 transition-colors line-clamp-1">
                      {item.garmentName}
                    </h3>
                    <p className="text-xs text-neutral-400 font-sans line-clamp-1">
                      {item.silhouetteStyle}
                    </p>
                  </div>

                  {/* Spec Strip */}
                  <div className="grid grid-cols-2 gap-2 text-[10px] text-neutral-400 font-mono pt-2 border-t border-[#1C1C1C]">
                    <div>
                      <span className="text-neutral-500 block">Cloth:</span>
                      <span className="text-neutral-200 truncate block">
                        {item.material.fabricName}
                      </span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block">Colorway:</span>
                      <div className="flex items-center gap-1.5 truncate">
                        <div
                          className="w-2.5 h-2.5 rounded-full shrink-0 border border-white/20"
                          style={{ backgroundColor: item.color.hexCode }}
                        />
                        <span className="text-neutral-200 truncate">
                          {item.color.primaryColorName}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons Bar */}
              <div className="p-4 bg-[#121212] border-t border-[#222] flex items-center justify-between gap-2">
                <button
                  onClick={() => setInspectingItem(item)}
                  className="px-3 py-1.5 bg-[#181818] hover:bg-[#252525] text-neutral-300 text-xs rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Dossier</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleLaunchGarmentAction(item, 'REQUEST_ALTERATION')}
                    className="p-1.5 text-neutral-400 hover:text-amber-400 hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                    title="Request Complimentary Alteration"
                  >
                    <Scissors className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleLaunchGarmentAction(item, 'REQUEST_CARE_SERVICE')}
                    className="p-1.5 text-neutral-400 hover:text-cyan-400 hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                    title="Request Seasonal Care Revival"
                  >
                    <Sparkles className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleLaunchGarmentAction(item, 'REORDER_SAME_ITEM')}
                    className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-[11px] uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                    title="Reorder exact silhouette & measurements"
                  >
                    Reorder
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
