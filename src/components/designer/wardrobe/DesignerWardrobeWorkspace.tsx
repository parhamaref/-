/**
 * @file DesignerWardrobeWorkspace.tsx
 * Designer & Master Tailor Integration for the Digital Wardrobe Management System.
 * Enables designers to inspect all client garments, manage incoming alteration/repair/care/cleaning
 * service pipelines, assign artisans, update turnaround statuses, and log permanent garment adjustments.
 */

import React, { useState } from 'react';
import {
  Layers,
  Scissors,
  ShieldCheck,
  Sparkles,
  Droplets,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Truck,
  User,
  MapPin,
  Calendar,
  AlertCircle,
  Eye,
  Plus,
  X,
  FileText,
} from 'lucide-react';
import { useWardrobeStore } from '../../../stores/wardrobeStore';
import {
  WardrobeServiceRequest,
  ServiceRequestStatus,
  ServiceActionType,
  WardrobeItemFull,
} from '../../../types/wardrobe.types';
import { DesignerAlterationWorkbench } from '../../alterations/DesignerAlterationWorkbench';

export const DesignerWardrobeWorkspace: React.FC = () => {
  const {
    items,
    serviceRequests,
    updateServiceStatus,
    recordAlteration,
  } = useWardrobeStore();

  const [activeTab, setActiveTab] = useState<'requests' | 'alterations' | 'archive'>('alterations');
  const [statusFilter, setStatusFilter] = useState<ServiceRequestStatus | 'ALL'>('ALL');
  const [actionTypeFilter, setActionTypeFilter] = useState<ServiceActionType | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Status Update Modal state
  const [selectedRequest, setSelectedRequest] = useState<WardrobeServiceRequest | null>(null);
  const [newStatus, setNewStatus] = useState<ServiceRequestStatus>('IN_PROGRESS');
  const [statusNotes, setStatusNotes] = useState('');
  const [assignedTailor, setAssignedTailor] = useState('Master Tailor Henri Laurent');
  const [isUpdating, setIsUpdating] = useState(false);

  // Record Alteration Modal state
  const [alterationModalItem, setAlterationModalItem] = useState<WardrobeItemFull | null>(null);
  const [altServiceType, setAltServiceType] = useState('Waist & Side-Seam Suppression');
  const [altDescription, setAltDescription] = useState('Waist suppressed 1.0cm for enhanced taper.');
  const [altCost, setAltCost] = useState('0');
  const [altIsComplimentary, setAltIsComplimentary] = useState(true);

  // Filter service requests
  const filteredRequests = serviceRequests.filter((req) => {
    if (statusFilter !== 'ALL' && req.status !== statusFilter) return false;
    if (actionTypeFilter !== 'ALL' && req.actionType !== actionTypeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = req.garmentName.toLowerCase().includes(q);
      const matchPatron = req.customerName.toLowerCase().includes(q);
      const matchInst = req.specificInstructions.toLowerCase().includes(q);
      if (!matchName && !matchPatron && !matchInst) return false;
    }
    return true;
  });

  const pendingRequestsCount = serviceRequests.filter(
    (s) => s.status === 'SUBMITTED' || s.status === 'RECEIVED_AT_ATELIER' || s.status === 'IN_PROGRESS'
  ).length;

  const handleUpdateStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest) return;
    setIsUpdating(true);
    try {
      await updateServiceStatus(
        selectedRequest.id,
        newStatus,
        statusNotes,
        assignedTailor
      );
      setSelectedRequest(null);
      setStatusNotes('');
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error updating service status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRecordAlterationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!alterationModalItem) return;
    try {
      await recordAlteration(alterationModalItem.id, {
        serviceType: altServiceType,
        description: altDescription,
        tailorName: assignedTailor,
        atelierBranch: 'Mayfair Salon & Workshop, London',
        costGbp: Number(altCost),
        isComplimentary: altIsComplimentary,
      });
      setAlterationModalItem(null);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error recording alteration');
    }
  };

  const getActionBadge = (action: ServiceActionType) => {
    switch (action) {
      case 'REQUEST_ALTERATION':
        return (
          <span className="px-2 py-0.5 rounded text-[9.5px] font-bold bg-amber-500/10 border border-amber-500/30 text-amber-300">
            ALTERATION
          </span>
        );
      case 'REQUEST_REPAIR':
        return (
          <span className="px-2 py-0.5 rounded text-[9.5px] font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
            REPAIR
          </span>
        );
      case 'REQUEST_CARE_SERVICE':
        return (
          <span className="px-2 py-0.5 rounded text-[9.5px] font-bold bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
            CARE REVIVAL
          </span>
        );
      case 'REQUEST_CLEANING_SERVICE':
        return (
          <span className="px-2 py-0.5 rounded text-[9.5px] font-bold bg-blue-500/10 border border-blue-500/30 text-blue-300">
            ECO CLEANING
          </span>
        );
      case 'REORDER_SAME_ITEM':
        return (
          <span className="px-2 py-0.5 rounded text-[9.5px] font-bold bg-yellow-500/10 border border-yellow-500/30 text-yellow-300">
            REPEAT COMMISSION
          </span>
        );
      case 'REQUEST_RECREATION_MEASUREMENTS':
        return (
          <span className="px-2 py-0.5 rounded text-[9.5px] font-bold bg-purple-500/10 border border-purple-500/30 text-purple-300">
            RECREATION (NEW CLOTH)
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fadeIn font-mono text-left">
      {/* Update Status Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#121212] border border-[#2D2D2D] rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl text-left">
            <div className="flex items-center justify-between border-b border-[#222] pb-3">
              <div>
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest block">
                  ATELIER WORKSHOP COMMAND
                </span>
                <h4 className="font-serif text-base font-bold text-white uppercase tracking-wider">
                  Update Service Pipeline Milestone
                </h4>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="text-neutral-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs space-y-1">
              <span className="text-neutral-400 block">Garment:</span>
              <span className="text-white font-bold block">{selectedRequest.garmentName}</span>
              <span className="text-[11px] text-neutral-400 block">
                Patron: {selectedRequest.customerName} ({selectedRequest.pickupAddress})
              </span>
            </div>

            <form onSubmit={handleUpdateStatusSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1">
                  Transition Status To
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="w-full bg-[#181818] border border-[#333] px-3 py-2 rounded-xl text-amber-300 font-bold"
                >
                  <option value="SUBMITTED">SUBMITTED</option>
                  <option value="COURIER_PICKUP_SCHEDULED">COURIER PICKUP SCHEDULED</option>
                  <option value="RECEIVED_AT_ATELIER">RECEIVED AT ATELIER</option>
                  <option value="IN_PROGRESS">IN PROGRESS (UNDER NEEDLE)</option>
                  <option value="QUALITY_INSPECTION">QUALITY INSPECTION</option>
                  <option value="DISPATCHED_TO_CLIENT">DISPATCHED TO CLIENT</option>
                  <option value="COMPLETED">COMPLETED (RESTORE IN WARDROBE)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1">
                  Assigned Master Tailor / Artisan
                </label>
                <select
                  value={assignedTailor}
                  onChange={(e) => setAssignedTailor(e.target.value)}
                  className="w-full bg-[#181818] border border-[#333] px-3 py-2 rounded-xl text-white"
                >
                  <option value="Master Tailor Henri Laurent">Master Tailor Henri Laurent (Mayfair)</option>
                  <option value="Master Cutter Arthur Pendelton">Master Cutter Arthur Pendelton (Savile Row)</option>
                  <option value="Couturière Cecile Moreau">Couturière Cecile Moreau (Place Vendôme)</option>
                  <option value="Haute Couturière Vivienne St. Claire">Vivienne St. Claire (Couture)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1">
                  Milestone Audit Notes (Appended to Patron Timeline)
                </label>
                <textarea
                  rows={3}
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  placeholder="e.g. Garment underwent basted fitting adjustment. Seams hand-pad stitched and pressed."
                  className="w-full bg-[#181818] border border-[#333] p-3 rounded-xl text-white font-sans placeholder:text-neutral-600 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedRequest(null)}
                  className="px-4 py-2 border border-neutral-700 text-neutral-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
                >
                  {isUpdating ? 'Committing...' : 'Commit Milestone'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Alteration Modal */}
      {alterationModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#121212] border border-[#2D2D2D] rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl text-left">
            <div className="flex items-center justify-between border-b border-[#222] pb-3">
              <div>
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest block">
                  PERMANENT GARMENT DOSSIER
                </span>
                <h4 className="font-serif text-base font-bold text-white uppercase tracking-wider">
                  Log Permanent Alteration Record
                </h4>
              </div>
              <button
                onClick={() => setAlterationModalItem(null)}
                className="text-neutral-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-neutral-400 font-sans">
              Appending alteration to <strong className="text-white">{alterationModalItem.garmentName}</strong> for{' '}
              {alterationModalItem.customerName}.
            </p>

            <form onSubmit={handleRecordAlterationSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1">
                  Service / Alteration Type
                </label>
                <input
                  type="text"
                  value={altServiceType}
                  onChange={(e) => setAltServiceType(e.target.value)}
                  className="w-full bg-[#181818] border border-[#333] px-3 py-2 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1">
                  Technical Tailoring Description
                </label>
                <textarea
                  rows={3}
                  value={altDescription}
                  onChange={(e) => setAltDescription(e.target.value)}
                  className="w-full bg-[#181818] border border-[#333] p-3 rounded-xl text-white font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1">
                    Cost GBP
                  </label>
                  <input
                    type="number"
                    value={altCost}
                    onChange={(e) => setAltCost(e.target.value)}
                    className="w-full bg-[#181818] border border-[#333] px-3 py-2 rounded-xl text-white"
                  />
                </div>
                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    checked={altIsComplimentary}
                    onChange={(e) => setAltIsComplimentary(e.target.checked)}
                    className="w-4 h-4 accent-amber-500 rounded"
                  />
                  <span className="text-neutral-300">Complimentary Privilege</span>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAlterationModalItem(null)}
                  className="px-4 py-2 border border-neutral-700 text-neutral-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
                >
                  Save to Permanent Archive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="border-b border-[#222] pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-white text-[10px] uppercase tracking-widest mb-1.5">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>ATELIER STEWARDSHIP & CLIENT WARDROBE COMMAND</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-white uppercase tracking-wider font-bold">
            Client Wardrobe & Service Requests
          </h2>
          <p className="text-xs text-neutral-400 font-sans mt-1 max-w-2xl leading-relaxed">
            Manage incoming customer alterations, repairs, seasonal care, eco-cleaning, and sister garment recreations.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap sm:flex-nowrap items-center border border-[#2B2B2B] rounded-xl overflow-hidden text-xs bg-[#121212]">
          <button
            onClick={() => setActiveTab('alterations')}
            className={`px-4 py-2.5 font-bold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'alterations'
                ? 'bg-amber-400 text-black shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Scissors className="w-3.5 h-3.5" />
            <span>Alterations & Tailoring (6-Stage)</span>
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2.5 font-bold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'requests'
                ? 'bg-amber-400 text-black shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Service Pipeline ({pendingRequestsCount})</span>
          </button>
          <button
            onClick={() => setActiveTab('archive')}
            className={`px-4 py-2.5 font-bold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'archive'
                ? 'bg-amber-400 text-black shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Client Wardrobes ({items.length})</span>
          </button>
        </div>
      </div>

      {/* VIEW 0: BESPOKE ALTERATIONS & TAILORING WORKBENCH */}
      {activeTab === 'alterations' && <DesignerAlterationWorkbench />}

      {/* VIEW 1: SERVICE REQUESTS PIPELINE */}
      {activeTab === 'requests' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search requests by patron, garment, or instructions..."
                className="w-full pl-9 pr-4 py-2.5 bg-[#101010] border border-[#2B2B2B] rounded-xl text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-amber-500/60"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="bg-[#101010] border border-[#2B2B2B] px-3 py-2 rounded-xl text-neutral-300 focus:outline-none"
              >
                <option value="ALL">All Pipeline Statuses</option>
                <option value="SUBMITTED">Submitted</option>
                <option value="COURIER_PICKUP_SCHEDULED">Courier Scheduled</option>
                <option value="RECEIVED_AT_ATELIER">Received at Atelier</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="QUALITY_INSPECTION">Quality Inspection</option>
                <option value="COMPLETED">Completed</option>
              </select>

              <select
                value={actionTypeFilter}
                onChange={(e) => setActionTypeFilter(e.target.value as any)}
                className="bg-[#101010] border border-[#2B2B2B] px-3 py-2 rounded-xl text-neutral-300 focus:outline-none"
              >
                <option value="ALL">All Service Actions</option>
                <option value="REQUEST_ALTERATION">Alterations</option>
                <option value="REQUEST_REPAIR">Repairs</option>
                <option value="REQUEST_CARE_SERVICE">Care Revivals</option>
                <option value="REQUEST_CLEANING_SERVICE">Eco-Cleanings</option>
                <option value="REORDER_SAME_ITEM">Reorders</option>
                <option value="REQUEST_RECREATION_MEASUREMENTS">Recreations</option>
              </select>
            </div>
          </div>

          {/* Service Requests Table / Cards */}
          <div className="bg-[#0E0E0E] border border-[#222] rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#222] bg-[#141414] text-[10px] text-neutral-400 uppercase tracking-wider">
                    <th className="py-3.5 px-4 font-normal">Requested</th>
                    <th className="py-3.5 px-4 font-normal">Patron & Garment</th>
                    <th className="py-3.5 px-4 font-normal">Service Type</th>
                    <th className="py-3.5 px-4 font-normal">Status</th>
                    <th className="py-3.5 px-4 font-normal">Instructions & Location</th>
                    <th className="py-3.5 px-4 font-normal">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1C1C1C]">
                  {filteredRequests.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-neutral-500">
                        No service requests match the current filters.
                      </td>
                    </tr>
                  ) : (
                    filteredRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-[#141414] transition-colors">
                        {/* Requested Date */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="text-white font-mono">
                            {new Date(req.requestedDate).toLocaleDateString([], {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </div>
                          <span className="text-[10px] text-neutral-500 font-mono block">
                            {req.urgencyLevel}
                          </span>
                        </td>

                        {/* Patron & Garment */}
                        <td className="py-3.5 px-4 max-w-xs">
                          <div className="text-white font-bold truncate">{req.garmentName}</div>
                          <div className="text-[11px] text-neutral-400 font-sans truncate">
                            {req.customerName}
                          </div>
                        </td>

                        {/* Service Type */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {getActionBadge(req.actionType)}
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold font-mono">
                            {req.status.replace(/_/g, ' ')}
                          </span>
                          {req.assignedArtisanName && (
                            <span className="text-[9px] text-neutral-500 block mt-0.5 truncate">
                              {req.assignedArtisanName}
                            </span>
                          )}
                        </td>

                        {/* Instructions & Location */}
                        <td className="py-3.5 px-4 max-w-sm text-neutral-300 font-sans">
                          <p className="line-clamp-2 text-[11px]">{req.specificInstructions}</p>
                          <span className="text-[10px] text-neutral-500 font-mono block mt-0.5 truncate">
                            Pickup: {req.pickupAddress}
                          </span>
                        </td>

                        {/* Action */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <button
                            onClick={() => {
                              setSelectedRequest(req);
                              setNewStatus(req.status);
                            }}
                            className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-[10px] uppercase rounded-lg transition-colors cursor-pointer"
                          >
                            Update Milestone
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: CLIENT WARDROBES ARCHIVE */}
      {activeTab === 'archive' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-[#0E0E0E] border border-[#222] hover:border-neutral-700 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.primaryImageUrl}
                      alt={item.garmentName}
                      className="w-14 h-18 object-cover rounded-xl border border-neutral-800 shrink-0"
                    />
                    <div className="overflow-hidden">
                      <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                        {item.category} • {item.originalOrderId}
                      </span>
                      <h4 className="font-serif text-sm font-bold text-white truncate block">
                        {item.garmentName}
                      </h4>
                      <span className="text-xs text-neutral-400 font-sans block">
                        Patron: {item.customerName}
                      </span>
                    </div>
                  </div>

                  <div className="text-[11px] text-neutral-400 font-sans space-y-1 bg-[#141414] p-3 rounded-xl border border-[#252525]">
                    <div>
                      Cloth: <span className="text-white">{item.material.fabricName}</span>
                    </div>
                    <div>
                      Mill: <span className="text-white">{item.material.fabricMillName}</span>
                    </div>
                    <div>
                      Historical Alterations:{' '}
                      <span className="text-amber-400 font-bold">{item.alterations.length} records</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#1C1C1C]">
                  <span className="text-[10px] text-emerald-400 font-mono font-bold">
                    {item.status.replace(/_/g, ' ')}
                  </span>
                  <button
                    onClick={() => setAlterationModalItem(item)}
                    className="px-3 py-1.5 bg-[#181818] hover:bg-[#252525] border border-[#333] text-neutral-200 text-xs rounded-lg flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-amber-400" />
                    <span>Log Alteration</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
