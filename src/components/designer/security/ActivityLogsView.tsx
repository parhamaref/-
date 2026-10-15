/**
 * @file ActivityLogsView.tsx
 * Comprehensive audit trail of atelier operational and security actions.
 * Logs sensitive finance exports, 2FA state changes, API token rotations,
 * and pattern authorizations with cryptographic signatures.
 */

import React, { useState } from 'react';
import {
  FileText,
  Search,
  Download,
  Filter,
  Shield,
  DollarSign,
  Lock,
  Layers,
  Database,
  Eye,
  CheckCircle,
  AlertTriangle,
  XCircle,
  X,
  Code,
  Fingerprint,
} from 'lucide-react';
import { useSecurityStore } from '../../../stores/securityStore';
import {
  ActivityCategory,
  ActivitySeverity,
  ActivityLogEntry,
} from '../../../types/security.types';

export const ActivityLogsView: React.FC = () => {
  const {
    filteredActivityLogs,
    activityFilters,
    setActivityFilters,
    exportActivityLogsCsv,
  } = useSecurityStore();

  const [searchQuery, setSearchQuery] = useState(activityFilters.search);
  const [selectedCategory, setSelectedCategory] = useState<ActivityCategory | 'ALL'>(
    activityFilters.category
  );
  const [selectedSeverity, setSelectedSeverity] = useState<ActivitySeverity | 'ALL'>(
    activityFilters.severity
  );
  const [inspectingEntry, setInspectingEntry] = useState<ActivityLogEntry | null>(null);

  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    setActivityFilters(selectedCategory, selectedSeverity, q);
  };

  const handleCategoryChange = (cat: ActivityCategory | 'ALL') => {
    setSelectedCategory(cat);
    setActivityFilters(cat, selectedSeverity, searchQuery);
  };

  const handleSeverityChange = (sev: ActivitySeverity | 'ALL') => {
    setSelectedSeverity(sev);
    setActivityFilters(selectedCategory, sev, searchQuery);
  };

  const getCategoryIcon = (category: ActivityCategory) => {
    switch (category) {
      case 'SECURITY':
      case 'AUTH':
        return <Lock className="w-3.5 h-3.5 text-amber-400" />;
      case 'FINANCE':
        return <DollarSign className="w-3.5 h-3.5 text-emerald-400" />;
      case 'ORDERS':
        return <Layers className="w-3.5 h-3.5 text-cyan-400" />;
      case 'API':
        return <Code className="w-3.5 h-3.5 text-purple-400" />;
      default:
        return <Database className="w-3.5 h-3.5 text-neutral-400" />;
    }
  };

  const getSeverityBadge = (severity: ActivitySeverity) => {
    switch (severity) {
      case 'CRITICAL':
        return (
          <span className="text-[9px] px-2 py-0.5 rounded font-bold bg-rose-500/20 text-rose-300 border border-rose-500/50 uppercase tracking-widest">
            CRITICAL
          </span>
        );
      case 'WARNING':
        return (
          <span className="text-[9px] px-2 py-0.5 rounded font-bold bg-amber-500/20 text-amber-300 border border-amber-500/50 uppercase tracking-widest">
            WARNING
          </span>
        );
      case 'NOTICE':
        return (
          <span className="text-[9px] px-2 py-0.5 rounded font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 uppercase tracking-widest">
            NOTICE
          </span>
        );
      default:
        return (
          <span className="text-[9px] px-2 py-0.5 rounded font-bold bg-neutral-800 text-neutral-400 border border-neutral-700 uppercase tracking-widest">
            INFO
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn font-mono text-left">
      {/* Detail Inspection Modal */}
      {inspectingEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#121212] border border-[#2D2D2D] rounded-2xl max-w-xl w-full p-6 sm:p-8 space-y-5 relative shadow-2xl">
            <button
              onClick={() => setInspectingEntry(null)}
              className="absolute top-5 right-5 p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-[#222] pb-4">
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif text-base font-bold text-white uppercase tracking-wider">
                  Audit Event Payload Details
                </h4>
                <div className="text-[10px] text-neutral-400">
                  Event ID: <span className="font-mono text-amber-300">{inspectingEntry.id}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">
                  Action
                </span>
                <span className="text-white font-bold text-sm">{inspectingEntry.action}</span>
              </div>

              <div>
                <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">
                  Description
                </span>
                <p className="text-neutral-300 font-sans leading-relaxed">
                  {inspectingEntry.details}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-[#181818] p-3 rounded-xl border border-[#252525]">
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">
                    Actor
                  </span>
                  <span className="text-white font-bold">{inspectingEntry.actor.name}</span>
                  <span className="text-[10px] text-neutral-400 block">
                    {inspectingEntry.actor.role}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">
                    Origin IP & Timestamp
                  </span>
                  <span className="text-neutral-300 font-mono">{inspectingEntry.ipAddress}</span>
                  <span className="text-[10px] text-neutral-400 block">
                    {new Date(inspectingEntry.timestamp).toLocaleString('en-GB')}
                  </span>
                </div>
              </div>

              {inspectingEntry.metadata && (
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase tracking-wider block mb-1">
                    JSON Structured Metadata
                  </span>
                  <pre className="p-3 bg-[#0A0A0A] border border-[#222] rounded-xl text-[11px] text-emerald-400 overflow-x-auto font-mono">
                    {JSON.stringify(inspectingEntry.metadata, null, 2)}
                  </pre>
                </div>
              )}

              {inspectingEntry.verifiedSignature && (
                <div className="flex items-center gap-2 p-2.5 bg-neutral-900 border border-neutral-800 rounded-lg text-[10px] text-neutral-400">
                  <Fingerprint className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="truncate">
                    ED25519 Cryptographic Proof: {inspectingEntry.verifiedSignature}
                  </span>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setInspectingEntry(null)}
                className="px-5 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs rounded-xl"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#222] pb-5">
        <div>
          <div className="flex items-center gap-2 text-white text-[10px] uppercase tracking-widest mb-1">
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>IMMUTABLE AUDIT TRAIL</span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl text-white font-bold uppercase tracking-wider">
            Activity & Security Logs
          </h3>
          <p className="text-xs text-neutral-400 font-sans mt-0.5">
            Full audit log of administrative, financial, and access events across Daniel’s Maison.
          </p>
        </div>

        <button
          onClick={exportActivityLogsCsv}
          className="self-start sm:self-auto px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs rounded-xl flex items-center gap-2 border border-neutral-700 transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-amber-400" />
          <span>Export Logs (CSV)</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search actions, actors, or details..."
              className="w-full pl-9 pr-4 py-2 bg-[#101010] border border-[#2B2B2B] rounded-xl text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-amber-500/60"
            />
          </div>

          {/* Severity Filters */}
          <div className="flex items-center gap-1.5 text-[11px]">
            {(['ALL', 'CRITICAL', 'WARNING', 'NOTICE', 'INFO'] as const).map((sev) => (
              <button
                key={sev}
                onClick={() => handleSeverityChange(sev)}
                className={`px-2.5 py-1.5 rounded-lg border transition-colors ${
                  selectedSeverity === sev
                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 font-bold'
                    : 'border-[#222] bg-[#0E0E0E] text-neutral-400 hover:text-white'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
          <span className="text-neutral-500 uppercase tracking-widest mr-1">Category:</span>
          {(['ALL', 'AUTH', 'SECURITY', 'FINANCE', 'ORDERS', 'PRIVACY', 'API', 'SYSTEM'] as const).map(
            (cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-2.5 py-1 rounded-md border transition-colors ${
                  selectedCategory === cat
                    ? 'bg-neutral-200 text-black border-white font-bold'
                    : 'bg-[#121212] border-[#262626] text-neutral-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            )
          )}
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-[#0E0E0E] border border-[#222] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#222] bg-[#141414] text-[10px] text-neutral-400 uppercase tracking-wider">
                <th className="py-3 px-4 font-normal">Timestamp</th>
                <th className="py-3 px-4 font-normal">Severity</th>
                <th className="py-3 px-4 font-normal">Category</th>
                <th className="py-3 px-4 font-normal">Action & Summary</th>
                <th className="py-3 px-4 font-normal">Actor</th>
                <th className="py-3 px-4 font-normal">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1C1C1C]">
              {filteredActivityLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-neutral-500 text-xs">
                    No activity logs match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredActivityLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#141414] transition-colors">
                    {/* Timestamp */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="text-white font-mono">
                        {new Date(log.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                      <div className="text-[10px] text-neutral-500">
                        {new Date(log.timestamp).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                    </td>

                    {/* Severity */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      {getSeverityBadge(log.severity)}
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5 text-neutral-300 font-mono text-[11px]">
                        {getCategoryIcon(log.category)}
                        <span>{log.category}</span>
                      </div>
                    </td>

                    {/* Action & Summary */}
                    <td className="py-3 px-4 max-w-sm">
                      <div className="text-white font-bold text-xs truncate">{log.action}</div>
                      <p className="text-[11px] text-neutral-400 font-sans truncate mt-0.5">
                        {log.details}
                      </p>
                    </td>

                    {/* Actor */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="text-neutral-200 font-bold">{log.actor.name}</div>
                      <div className="text-[10px] text-neutral-500">{log.actor.role}</div>
                    </td>

                    {/* Inspect Button */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <button
                        onClick={() => setInspectingEntry(log)}
                        className="p-1.5 text-neutral-400 hover:text-amber-400 hover:bg-neutral-800 rounded-lg transition-colors"
                        title="Inspect Event Payload"
                      >
                        <Eye className="w-4 h-4" />
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
  );
};
