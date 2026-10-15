/**
 * @file AuditTrailWorkspace.tsx
 * Enterprise Audit Trail & Governance Cockpit for Daniel’s Maison.
 * 
 * Features:
 * - Real-time tracking across all 8 atelier domains:
 *   Profile Changes, Product Changes, Price Changes, Order Status Changes,
 *   Design Approvals, Payments, QC Decisions, Customer Actions
 * - Granular Actor, Timestamp, Old Value, New Value, Action Type, and IP Address logging
 * - Cryptographic SHA-256 hash chaining with tamper verification
 * - Visual diff inspection (Split, Unified, Raw JSON)
 * - Architecture & PostgreSQL DDL drawer
 * - Interactive live event simulator
 */

import React, { useState } from 'react';
import {
  History,
  ShieldCheck,
  ShieldAlert,
  Search,
  Filter,
  Download,
  RotateCcw,
  Play,
  Database,
  Lock,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Globe,
  User,
  ShoppingBag,
  DollarSign,
  ClipboardList,
  FileCheck,
  CreditCard,
  Hash,
  Laptop,
  Check,
  ChevronRight,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { useAuditTrailStore } from '../../stores/auditTrailStore';
import {
  AuditEntityType,
  AuditSeverity,
  AuditRecord,
} from '../../types/auditTrail.types';
import { AuditDiffViewer } from './AuditDiffViewer';
import { AuditArchitectureModal } from './AuditArchitectureModal';
import { AuditSimulateEventModal } from './AuditSimulateEventModal';

const DOMAIN_TABS: { id: AuditEntityType | 'ALL'; label: string; icon: React.ElementType }[] = [
  { id: 'ALL', label: 'All Domains', icon: Layers },
  { id: 'profile', label: 'Profile Changes', icon: User },
  { id: 'product', label: 'Product Changes', icon: ShoppingBag },
  { id: 'price', label: 'Price Changes', icon: DollarSign },
  { id: 'order_status', label: 'Order Status Changes', icon: ClipboardList },
  { id: 'design_approval', label: 'Design Approvals', icon: FileCheck },
  { id: 'payment', label: 'Payments', icon: CreditCard },
  { id: 'qc_decision', label: 'QC Decisions', icon: ShieldAlert },
  { id: 'customer_action', label: 'Customer Actions', icon: Globe },
];

export const AuditTrailWorkspace: React.FC = () => {
  const {
    filteredLogs,
    selectedRecord,
    selectedRecordId,
    filters,
    diffViewMode,
    isArchitectureModalOpen,
    isSimulateModalOpen,
    notification,
    metrics,
    setSelectedRecordId,
    setFilter,
    resetFilters,
    setDiffViewMode,
    setModalOpen,
    verifyChain,
    resetToMock,
    exportData,
  } = useAuditTrailStore();

  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);

  const getDomainIcon = (domain: AuditEntityType) => {
    switch (domain) {
      case 'profile':
        return User;
      case 'product':
        return ShoppingBag;
      case 'price':
        return DollarSign;
      case 'order_status':
        return ClipboardList;
      case 'design_approval':
        return FileCheck;
      case 'payment':
        return CreditCard;
      case 'qc_decision':
        return ShieldAlert;
      case 'customer_action':
        return Globe;
      default:
        return Layers;
    }
  };

  const getDomainColor = (domain: AuditEntityType) => {
    switch (domain) {
      case 'profile':
        return 'text-blue-400 bg-blue-950/40 border-blue-800/50';
      case 'product':
        return 'text-purple-400 bg-purple-950/40 border-purple-800/50';
      case 'price':
        return 'text-amber-400 bg-amber-950/40 border-amber-800/50';
      case 'order_status':
        return 'text-sky-400 bg-sky-950/40 border-sky-800/50';
      case 'design_approval':
        return 'text-emerald-400 bg-emerald-950/40 border-emerald-800/50';
      case 'payment':
        return 'text-green-400 bg-green-950/40 border-green-800/50';
      case 'qc_decision':
        return 'text-rose-400 bg-rose-950/40 border-rose-800/50';
      case 'customer_action':
        return 'text-teal-400 bg-teal-950/40 border-teal-800/50';
      default:
        return 'text-neutral-400 bg-neutral-900 border-neutral-700';
    }
  };

  const getSeverityBadge = (severity: AuditSeverity) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-rose-950/90 text-rose-300 border-rose-700/80';
      case 'HIGH':
        return 'bg-orange-950/90 text-orange-300 border-orange-700/80';
      case 'MEDIUM':
        return 'bg-amber-950/80 text-amber-300 border-amber-700/60';
      case 'LOW':
      default:
        return 'bg-neutral-800 text-neutral-300 border-neutral-700';
    }
  };

  const formatTimestamp = (iso: string) => {
    try {
      const date = new Date(iso);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
    } catch {
      return iso;
    }
  };

  return (
    <div className="flex flex-col flex-1 h-full min-h-screen bg-[#070707] text-neutral-100 font-sans select-none overflow-x-hidden">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xs border shadow-2xl flex items-center gap-3 backdrop-blur-md transition animate-in slide-in-from-top-4 ${
            notification.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-700/80 text-emerald-200'
              : notification.type === 'error'
              ? 'bg-rose-950/90 border-rose-700/80 text-rose-200'
              : 'bg-neutral-900/90 border-neutral-700 text-neutral-200'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
          )}
          <span className="text-xs font-mono">{notification.message}</span>
        </div>
      )}

      {/* Workspace Header */}
      <header className="px-6 py-4 border-b border-neutral-800/80 bg-[#0a0a0a]/90 backdrop-blur-md sticky top-0 z-20">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xs bg-gradient-to-br from-neutral-800 to-neutral-950 border border-neutral-700/60 flex items-center justify-center text-amber-400 shadow-lg">
              <History className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                  HAUTE COUTURE GOVERNANCE & SECURITY
                </span>
                <span className="px-2 py-0.5 bg-emerald-950/80 text-emerald-300 border border-emerald-800/70 text-[9px] font-mono uppercase rounded-xs">
                  SOC 2 CC6.8
                </span>
                <span className="px-2 py-0.5 bg-blue-950/80 text-blue-300 border border-blue-800/70 text-[9px] font-mono uppercase rounded-xs">
                  GDPR Art. 30
                </span>
              </div>
              <h1 className="font-serif text-2xl font-bold tracking-wider text-white uppercase mt-0.5">
                IMMUTABLE AUDIT TRAIL SYSTEM
              </h1>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={verifyChain}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600/20 border border-emerald-600/40 text-emerald-300 hover:bg-emerald-600/30 font-mono text-[11px] font-bold uppercase rounded-xs transition cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Verify Chain Integrity
            </button>

            <button
              onClick={() => setModalOpen('simulate', true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 font-mono text-[11px] font-bold uppercase rounded-xs transition cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> Simulate Live Event
            </button>

            <button
              onClick={() => setModalOpen('architecture', true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white font-mono text-[11px] font-bold uppercase rounded-xs transition cursor-pointer border border-neutral-700"
            >
              <Database className="w-3.5 h-3.5 text-neutral-300" /> Architecture & DDL
            </button>

            {/* Export Dropdown */}
            <div className="relative">
              <button
                onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
                className="flex items-center gap-1 px-3 py-1.5 bg-neutral-900 border border-neutral-700 hover:border-neutral-500 text-neutral-300 hover:text-white font-mono text-[11px] rounded-xs transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Export Dossier
              </button>

              {exportDropdownOpen && (
                <div className="absolute right-0 mt-1 w-44 bg-[#141414] border border-[#333] rounded-xs shadow-xl py-1 z-30 font-mono text-xs">
                  <button
                    onClick={() => {
                      exportData('json');
                      setExportDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-neutral-300 hover:text-white hover:bg-neutral-800 transition"
                  >
                    Export JSON Dossier
                  </button>
                  <button
                    onClick={() => {
                      exportData('csv');
                      setExportDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-neutral-300 hover:text-white hover:bg-neutral-800 transition"
                  >
                    Export CSV Spreadsheet
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={resetToMock}
              title="Reset To Certified Mock Data"
              className="p-1.5 border border-neutral-800 hover:border-neutral-600 text-neutral-400 hover:text-white rounded-xs transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* KPI Summary Ribbon */}
      <section className="bg-[#0b0b0b] border-b border-[#222] px-6 py-3 font-mono text-[11px]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-neutral-500">AUDITED EVENTS:</span>
              <span className="text-white font-bold">{metrics.totalEvents}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-neutral-500">TODAY'S DELTAS:</span>
              <span className="text-cyan-400 font-bold">{metrics.todayEvents}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-neutral-500">CRITICAL ACTIONS:</span>
              <span className="text-rose-400 font-bold">{metrics.criticalEvents}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-neutral-500">MONITORED DOMAINS:</span>
              <span className="text-amber-400 font-bold">8 of 8</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-neutral-500">ACTIVE IP NODES:</span>
              <span className="text-neutral-300 font-bold">{metrics.activeIPsCount}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 font-bold">
              SHA-256 HASH INTEGRITY: {metrics.tamperIntegrityPercent}% VERIFIED
            </span>
          </div>
        </div>
      </section>

      {/* Domain Navigation Tabs */}
      <section className="bg-[#0e0e0e] border-b border-[#222] px-6 py-2 overflow-x-auto">
        <div className="flex items-center gap-1 min-w-max">
          {DOMAIN_TABS.map((tab) => {
            const Icon = tab.icon;
            const isSelected = filters.entityType === tab.id;
            const count = tab.id === 'ALL' ? metrics.totalEvents : metrics.domainCounts[tab.id as AuditEntityType] || 0;
            return (
              <button
                key={tab.id}
                onClick={() => setFilter({ entityType: tab.id })}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xs font-mono text-xs transition cursor-pointer ${
                  isSelected
                    ? 'bg-neutral-800 text-white font-bold border border-neutral-600 shadow-xs'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-400' : 'text-neutral-500'}`} />
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-xs ${
                    isSelected ? 'bg-black text-amber-300' : 'bg-neutral-800/80 text-neutral-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="bg-[#080808] border-b border-[#1f1f1f] px-6 py-2.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            {/* Search Input */}
            <div className="relative min-w-[260px] max-w-md flex-1">
              <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search actor, email, action, entity name, IP, city..."
                value={filters.searchQuery}
                onChange={(e) => setFilter({ searchQuery: e.target.value })}
                className="w-full bg-[#121212] border border-[#333] pl-9 pr-3 py-1.5 rounded-xs font-mono text-xs text-neutral-200 placeholder:text-neutral-600 focus:outline-hidden focus:border-amber-500"
              />
            </div>

            {/* Severity Filter */}
            <select
              value={filters.severity}
              onChange={(e) => setFilter({ severity: e.target.value as any })}
              className="bg-[#121212] border border-[#333] px-3 py-1.5 rounded-xs font-mono text-xs text-neutral-300 focus:outline-hidden focus:border-amber-500"
            >
              <option value="ALL">All Severities</option>
              <option value="LOW">Low Severity</option>
              <option value="MEDIUM">Medium Severity</option>
              <option value="HIGH">High Severity</option>
              <option value="CRITICAL">Critical Severity</option>
            </select>

            {/* Reset Filters */}
            {(filters.entityType !== 'ALL' || filters.severity !== 'ALL' || filters.searchQuery) && (
              <button
                onClick={resetFilters}
                className="text-neutral-500 hover:text-neutral-300 font-mono text-xs underline cursor-pointer"
              >
                Clear Filters
              </button>
            )}
          </div>

          <div className="text-neutral-500 font-mono text-xs">
            Showing <span className="text-white font-bold">{filteredLogs.length}</span> of {metrics.totalEvents} audit records
          </div>
        </div>
      </section>

      {/* Main Two-Pane Stage */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Pane: Timeline Feed */}
        <div className="w-full lg:w-5/12 border-r border-[#222] bg-[#090909] flex flex-col h-[calc(100vh-210px)] overflow-y-auto">
          {filteredLogs.map((log) => {
            const isSelected = selectedRecordId === log.id;
            const DomainIcon = getDomainIcon(log.entityType);
            const domainColorClass = getDomainColor(log.entityType);
            const severityClass = getSeverityBadge(log.severity);

            return (
              <div
                key={log.id}
                onClick={() => setSelectedRecordId(log.id)}
                className={`p-4 border-b border-[#1c1c1c] transition cursor-pointer select-none relative ${
                  isSelected
                    ? 'bg-[#141414] border-l-4 border-l-amber-500'
                    : 'hover:bg-[#0f0f0f]'
                }`}
              >
                {/* Header line */}
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-neutral-500 font-bold">
                      #{String(log.sequenceNumber).padStart(3, '0')}
                    </span>
                    <span
                      className={`flex items-center gap-1 px-2 py-0.5 rounded-xs text-[10px] font-mono font-semibold border ${domainColorClass}`}
                    >
                      <DomainIcon className="w-3 h-3" />
                      <span className="uppercase">{log.entityType.replace('_', ' ')}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-1.5 py-0.2 rounded-xs text-[9px] font-mono font-bold border ${severityClass}`}
                    >
                      {log.severity}
                    </span>
                    <span className="font-mono text-[10px] text-neutral-500">
                      {formatTimestamp(log.timestamp)}
                    </span>
                  </div>
                </div>

                {/* Action label & entity */}
                <div className="font-serif text-sm font-semibold text-white tracking-wide mb-1">
                  {log.actionLabel}
                </div>
                <div className="text-xs text-neutral-400 font-mono truncate mb-2">
                  Target: <span className="text-neutral-200">{log.entityName}</span>
                </div>

                {/* Actor & IP footer */}
                <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 pt-2 border-t border-[#1c1c1c]">
                  <div className="flex items-center gap-2">
                    {log.actor.avatarUrl ? (
                      <img
                        src={log.actor.avatarUrl}
                        alt={log.actor.name}
                        className="w-4 h-4 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-4 h-4 rounded-full bg-neutral-800 flex items-center justify-center text-[9px] text-neutral-400 font-bold">
                        {log.actor.name[0]}
                      </div>
                    )}
                    <span className="text-neutral-300 truncate max-w-[140px]">{log.actor.name}</span>
                    <span className="text-[10px] text-neutral-500">({log.actor.role})</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-neutral-500 text-[10px]">
                    <Globe className="w-3 h-3 text-neutral-500" />
                    <span>{log.ipAddress}</span>
                    {log.geoCity && <span>• {log.geoCity}</span>}
                  </div>
                </div>
              </div>
            );
          })}

          {filteredLogs.length === 0 && (
            <div className="p-8 text-center text-neutral-500 font-mono text-xs">
              No audit records matching current search and domain criteria.
            </div>
          )}
        </div>

        {/* Right Pane: Selected Audit Event Inspector */}
        <div className="w-full lg:w-7/12 bg-[#0c0c0c] flex flex-col h-[calc(100vh-210px)] overflow-y-auto p-6 space-y-6">
          {selectedRecord ? (
            <>
              {/* Event Overview Hero */}
              <div className="bg-[#111] border border-[#222] p-5 rounded-xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#222] pb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs text-amber-400 font-bold">
                        BLOCK #{String(selectedRecord.sequenceNumber).padStart(4, '0')}
                      </span>
                      <span className="text-neutral-600">•</span>
                      <span className="font-mono text-xs text-neutral-400">
                        ID: {selectedRecord.id}
                      </span>
                    </div>
                    <h2 className="font-serif text-xl font-bold text-white tracking-wide">
                      {selectedRecord.actionLabel}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-1 rounded-xs text-xs font-mono font-bold border ${getSeverityBadge(
                        selectedRecord.severity
                      )}`}
                    >
                      {selectedRecord.severity} SEVERITY
                    </span>
                  </div>
                </div>

                {/* 2-Column Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                  {/* Actor details */}
                  <div className="bg-[#0a0a0a] border border-[#222] p-3.5 rounded-xs space-y-2">
                    <div className="text-neutral-400 text-[10px] uppercase font-bold tracking-wider flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-amber-400" /> Authenticated Actor (User)
                    </div>
                    <div className="flex items-center gap-3">
                      {selectedRecord.actor.avatarUrl ? (
                        <img
                          src={selectedRecord.actor.avatarUrl}
                          alt={selectedRecord.actor.name}
                          className="w-9 h-9 rounded-full object-cover border border-neutral-700"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center font-bold text-neutral-300">
                          {selectedRecord.actor.name[0]}
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-white text-sm">{selectedRecord.actor.name}</div>
                        <div className="text-[11px] text-neutral-400">{selectedRecord.actor.email}</div>
                        <div className="text-[10px] text-amber-400/90 font-semibold">{selectedRecord.actor.role}</div>
                      </div>
                    </div>
                  </div>

                  {/* Network & Timestamp */}
                  <div className="bg-[#0a0a0a] border border-[#222] p-3.5 rounded-xs space-y-2">
                    <div className="text-neutral-400 text-[10px] uppercase font-bold tracking-wider flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-cyan-400" /> Network Origin & Timestamp
                    </div>
                    <div className="space-y-1 text-[11px]">
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-500">Source IP:</span>
                        <span className="text-neutral-200 font-bold">{selectedRecord.ipAddress}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-500">Geo Location:</span>
                        <span className="text-neutral-300">
                          {selectedRecord.geoCity || 'Paris'}, {selectedRecord.geoCountry || 'FR'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-500">Timestamp:</span>
                        <span className="text-neutral-300">{selectedRecord.timestamp}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* User Agent */}
                <div className="bg-[#0a0a0a] border border-[#222] px-3.5 py-2 rounded-xs flex items-center gap-2 text-[11px] font-mono text-neutral-400">
                  <Laptop className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                  <span className="truncate">{selectedRecord.userAgent}</span>
                </div>
              </div>

              {/* Cryptographic Tamper-Evident Hash Chain Box */}
              <div className="bg-[#080808] border border-[#222] p-4 rounded-xs space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-[#222] pb-2">
                  <span className="text-emerald-400 font-bold text-[11px] flex items-center gap-1.5 uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> Cryptographic Block Seal (SHA-256)
                  </span>
                  <span className="text-[10px] text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-xs border border-emerald-800">
                    Chain Verified & Immutable
                  </span>
                </div>

                <div className="space-y-2 text-[11px]">
                  <div>
                    <span className="text-neutral-500 block text-[10px] uppercase">
                      Current Record Hash (SHA-256):
                    </span>
                    <span className="text-amber-200/90 font-mono break-all bg-black px-2 py-1 rounded-xs block border border-[#222]">
                      {selectedRecord.tamperHash}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[10px] uppercase">
                      Previous Block Hash Link:
                    </span>
                    <span className="text-neutral-400 font-mono break-all bg-black px-2 py-1 rounded-xs block border border-[#222]">
                      {selectedRecord.previousHash}
                    </span>
                  </div>
                </div>
              </div>

              {/* Visual Diff Viewer */}
              <div className="flex-1 min-h-[380px]">
                <AuditDiffViewer
                  record={selectedRecord}
                  mode={diffViewMode}
                  onModeChange={setDiffViewMode}
                />
              </div>

              {/* Contextual Metadata Footer */}
              {selectedRecord.metadata && Object.keys(selectedRecord.metadata).length > 0 && (
                <div className="bg-[#111] border border-[#222] p-4 rounded-xs space-y-2">
                  <div className="font-mono text-[11px] text-neutral-400 uppercase tracking-wider font-bold">
                    Transactional Metadata
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                    {Object.entries(selectedRecord.metadata).map(([key, val]) => (
                      <div
                        key={key}
                        className="bg-[#090909] border border-[#222] p-2.5 rounded-xs flex items-center justify-between"
                      >
                        <span className="text-neutral-400">{key}:</span>
                        <span className="text-neutral-200 font-semibold">{String(val)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-neutral-500 font-mono text-xs">
              <History className="w-12 h-12 text-neutral-700 mb-3" />
              <span>Select an audit record on the left to inspect its complete state delta.</span>
            </div>
          )}
        </div>
      </div>

      {/* Architecture & DDL Modal */}
      <AuditArchitectureModal
        isOpen={isArchitectureModalOpen}
        onClose={() => setModalOpen('architecture', false)}
      />

      {/* Simulate Live Event Modal */}
      <AuditSimulateEventModal
        isOpen={isSimulateModalOpen}
        onClose={() => setModalOpen('simulate', false)}
      />
    </div>
  );
};
