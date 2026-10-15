/**
 * @file LoginHistoryView.tsx
 * Comprehensive audit trail of historical sign-ins and access attempts.
 * Tracks IP locations, browser and device footprints, risk scores, and anomaly warnings.
 */

import React, { useState } from 'react';
import {
  History,
  Search,
  Download,
  ShieldCheck,
  ShieldAlert,
  Smartphone,
  Laptop,
  Tablet,
  AlertTriangle,
  Globe,
  Filter,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from 'lucide-react';
import { useSecurityStore } from '../../../stores/securityStore';
import { LoginAttemptStatus } from '../../../types/security.types';

export const LoginHistoryView: React.FC = () => {
  const {
    filteredLoginHistory,
    loginFilters,
    setLoginFilters,
    exportLoginHistoryCsv,
  } = useSecurityStore();

  const [searchQuery, setSearchQuery] = useState(loginFilters.search);
  const [selectedStatus, setSelectedStatus] = useState<LoginAttemptStatus | 'ALL'>(
    loginFilters.status
  );

  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    setLoginFilters(q, selectedStatus);
  };

  const handleStatusChange = (status: LoginAttemptStatus | 'ALL') => {
    setSelectedStatus(status);
    setLoginFilters(searchQuery, status);
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'mobile':
        return <Smartphone className="w-4 h-4 text-purple-400" />;
      case 'tablet':
        return <Tablet className="w-4 h-4 text-cyan-400" />;
      default:
        return <Laptop className="w-4 h-4 text-amber-400" />;
    }
  };

  const getStatusBadge = (status: LoginAttemptStatus) => {
    switch (status) {
      case 'SUCCESS':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <CheckCircle2 className="w-3 h-3" />
            <span>SUCCESS</span>
          </span>
        );
      case 'CHALLENGE_MFA':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <ShieldCheck className="w-3 h-3" />
            <span>MFA PASSED</span>
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 border border-rose-500/30 text-rose-400">
            <XCircle className="w-3 h-3" />
            <span>FAILED</span>
          </span>
        );
      case 'SUSPICIOUS_BLOCKED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-950/80 border border-rose-600 text-rose-300">
            <ShieldAlert className="w-3 h-3" />
            <span>BLOCKED</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn font-mono text-left">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#222] pb-5">
        <div>
          <div className="flex items-center gap-2 text-white text-[10px] uppercase tracking-widest mb-1">
            <History className="w-3.5 h-3.5 text-amber-400" />
            <span>SECURITY AUDIT RADAR</span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl text-white font-bold uppercase tracking-wider">
            Login History & Access Radar
          </h3>
          <p className="text-xs text-neutral-400 font-sans mt-0.5">
            Real-time audit log of all atelier authorization attempts with IP geolocation and anomaly scores.
          </p>
        </div>

        <button
          onClick={exportLoginHistoryCsv}
          className="self-start sm:self-auto px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs rounded-xl flex items-center gap-2 border border-neutral-700 transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-amber-400" />
          <span>Export Audit (CSV)</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Filter by IP, City, Country, or Device..."
            className="w-full pl-9 pr-4 py-2.5 bg-[#101010] border border-[#2B2B2B] rounded-xl text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-amber-500/60"
          />
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
          {(['ALL', 'SUCCESS', 'CHALLENGE_MFA', 'FAILED', 'SUSPICIOUS_BLOCKED'] as const).map(
            (st) => (
              <button
                key={st}
                onClick={() => handleStatusChange(st)}
                className={`px-3 py-1.5 rounded-lg border transition-colors ${
                  selectedStatus === st
                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 font-bold'
                    : 'border-[#222] bg-[#0E0E0E] text-neutral-400 hover:text-white'
                }`}
              >
                {st === 'ALL'
                  ? 'All Logs'
                  : st === 'CHALLENGE_MFA'
                  ? 'MFA Passed'
                  : st === 'SUSPICIOUS_BLOCKED'
                  ? 'Blocked'
                  : st}
              </button>
            )
          )}
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-[#0E0E0E] border border-[#222] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#222] bg-[#141414] text-[10px] text-neutral-400 uppercase tracking-wider">
                <th className="py-3.5 px-4 font-normal">Timestamp</th>
                <th className="py-3.5 px-4 font-normal">Status</th>
                <th className="py-3.5 px-4 font-normal">Location & IP</th>
                <th className="py-3.5 px-4 font-normal">Device & Browser</th>
                <th className="py-3.5 px-4 font-normal">Risk Anomaly</th>
                <th className="py-3.5 px-4 font-normal">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1C1C1C]">
              {filteredLoginHistory.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-neutral-500 text-xs">
                    No login history records match the selected filter.
                  </td>
                </tr>
              ) : (
                filteredLoginHistory.map((item) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-[#141414] transition-colors ${
                      item.isCurrent ? 'bg-amber-500/5' : ''
                    }`}
                  >
                    {/* Timestamp */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="text-white font-mono">
                        {new Date(item.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </div>
                      <div className="text-[10px] text-neutral-500">
                        {new Date(item.timestamp).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                      {item.isCurrent && (
                        <span className="inline-block mt-1 text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold uppercase tracking-wider">
                          THIS SESSION
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getStatusBadge(item.status)}
                    </td>

                    {/* Location & IP */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-white font-bold">
                        <span className="text-base">{item.location.flag}</span>
                        <span>
                          {item.location.city}, {item.location.country}
                        </span>
                      </div>
                      <div className="text-[10px] text-neutral-400 font-mono flex items-center gap-1 mt-0.5">
                        <Globe className="w-3 h-3 text-neutral-600" />
                        <span>{item.ipAddress}</span>
                      </div>
                    </td>

                    {/* Device & Browser */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-white">
                        {getDeviceIcon(item.device.type)}
                        <span className="font-bold">{item.device.model}</span>
                      </div>
                      <div className="text-[10px] text-neutral-400 font-mono mt-0.5">
                        {item.device.os} • {item.device.browser}
                      </div>
                    </td>

                    {/* Risk Score */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2.5 h-2.5 rounded-full ${
                            item.riskScore > 60
                              ? 'bg-rose-500 animate-pulse'
                              : item.riskScore > 20
                              ? 'bg-amber-400'
                              : 'bg-emerald-400'
                          }`}
                        />
                        <span
                          className={`font-mono text-xs font-bold ${
                            item.riskScore > 60
                              ? 'text-rose-400'
                              : item.riskScore > 20
                              ? 'text-amber-400'
                              : 'text-emerald-400'
                          }`}
                        >
                          {item.riskScore}/100
                        </span>
                      </div>
                      <div className="text-[9px] text-neutral-500 uppercase tracking-widest mt-0.5">
                        {item.riskScore > 60
                          ? 'High Anomaly'
                          : item.riskScore > 20
                          ? 'Medium Risk'
                          : 'Low / Trusted'}
                      </div>
                    </td>

                    {/* Details / Reason */}
                    <td className="py-3.5 px-4 text-neutral-400 max-w-xs font-sans text-xs">
                      {item.failureReason ? (
                        <div className="text-rose-400/90 flex items-start gap-1 font-mono text-[11px]">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                          <span>{item.failureReason}</span>
                        </div>
                      ) : (
                        <span className="text-neutral-500 font-mono text-[11px]">
                          Auth Token verified via {item.mfaMethodUsed?.toUpperCase() || 'STANDARD'}
                        </span>
                      )}
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
