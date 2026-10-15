/**
 * @file AuditTrailExplorer.tsx
 * Security & Operational Audit Trail Explorer.
 * Searchable and filterable data log capturing state machine transitions,
 * inspector approvals, QC results, role shifts, and RBAC evaluations with user IDs and timestamps.
 */

import React, { useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getAuditLogs, clearAuditLogs, AuditLogEntry, DanielsModule, DanielsAction } from '../../utils/rbac';
import { UserRole } from '../../types/daniels.types';
import {
  ShieldAlert,
  Search,
  Filter,
  RefreshCw,
  Trash2,
  Download,
  CheckCircle2,
  Lock,
  Layers,
} from 'lucide-react';

export const AuditTrailExplorer: React.FC = () => {
  const { auditLogs, refreshAuditLogs } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('ALL');
  const [selectedModule, setSelectedModule] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // Combined audit logs (from memory store + active auth context)
  const logs = useMemo(() => {
    return getAuditLogs();
  }, [auditLogs]);

  // Filtered logs
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchSearch =
        searchTerm === '' ||
        log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.resourceId && log.resourceId.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (log.reason && log.reason.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchRole = selectedRole === 'ALL' || log.userRole === selectedRole;
      const matchModule = selectedModule === 'ALL' || log.module === selectedModule;
      const matchStatus = selectedStatus === 'ALL' || log.status === selectedStatus;

      return matchSearch && matchRole && matchModule && matchStatus;
    });
  }, [logs, searchTerm, selectedRole, selectedModule, selectedStatus]);

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(filteredLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `daniels_audit_trail_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 text-left font-mono animate-fadeIn">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-[#2B2B2B] pb-4">
        <div>
          <div className="flex items-center gap-2 text-neutral-400 text-[9px] uppercase tracking-widest mb-1">
            <Lock className="w-3.5 h-3.5 text-white" />
            <span>IMMUTABLE AUDIT TRAIL REPOSITORY</span>
          </div>
          <h2 className="font-serif text-2xl text-white uppercase font-bold tracking-wider">
            SECURITY & OPERATIONS AUDIT EXPLORER
          </h2>
          <p className="text-[10.5px] text-neutral-400 font-sans">
            Complete telemetry capture of state shifts, permissions evaluations, and role persona actions.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={refreshAuditLogs}
            className="p-2 border border-[#2B2B2B] hover:border-white text-neutral-300 hover:text-white rounded-xs transition-colors cursor-pointer"
            title="Refresh Audit Records"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleExportJSON}
            className="py-2 px-3 border border-[#2B2B2B] hover:border-white text-neutral-300 hover:text-white text-[9px] tracking-widest uppercase rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>EXPORT DOCKET</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0E0E0E] border border-[#2B2B2B] p-4 rounded-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-[10px]">
        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by User, Action, Order ID..."
            className="w-full bg-[#050505] border border-[#2B2B2B] focus:border-white pl-9 pr-3 py-2 rounded-xs text-white text-[10.5px] outline-none placeholder-neutral-700"
          />
        </div>

        {/* Role Filter */}
        <div>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full bg-[#050505] border border-[#2B2B2B] focus:border-white p-2 rounded-xs text-white text-[10px] outline-none"
          >
            <option value="ALL">ALL USER ROLES</option>
            <option value="Super Admin">Super Admin</option>
            <option value="Management">Management</option>
            <option value="Sales">Sales</option>
            <option value="Production">Production</option>
            <option value="QC">QC Inspector</option>
            <option value="Finance">Finance</option>
            <option value="Logistics">Logistics</option>
            <option value="Partner">Partner (Atelier)</option>
            <option value="Customer">Customer (Client)</option>
          </select>
        </div>

        {/* Module Filter */}
        <div>
          <select
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            className="w-full bg-[#050505] border border-[#2B2B2B] focus:border-white p-2 rounded-xs text-white text-[10px] outline-none"
          >
            <option value="ALL">ALL MODULE DOMAINS</option>
            <option value="Orders">Orders</option>
            <option value="Production">Production</option>
            <option value="QC">Quality Control (QC)</option>
            <option value="Finance">Finance & Invoices</option>
            <option value="Delivery">Delivery & Logistics</option>
            <option value="Customers">Customers & Profiles</option>
            <option value="Partners">Partners</option>
            <option value="Products">Products</option>
            <option value="Wardrobe">Wardrobe Vault</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full bg-[#050505] border border-[#2B2B2B] focus:border-white p-2 rounded-xs text-white text-[10px] outline-none"
          >
            <option value="ALL">ALL STATUSES (ALLOWED / DENIED)</option>
            <option value="ALLOWED">ALLOWED ONLY</option>
            <option value="DENIED">DENIED ONLY (SECURITY ALERTS)</option>
          </select>
        </div>
      </div>

      {/* Log Feed Table */}
      <div className="bg-[#0E0E0E] border border-[#2B2B2B] p-6 rounded-sm space-y-4">
        <div className="flex justify-between items-center text-[9px] text-neutral-500 border-b border-[#2B2B2B] pb-2">
          <span>CAPTURED AUDIT ENTRIES ({filteredLogs.length})</span>
          <span>STORAGE RETENTION: 500 IN-MEMORY CYCLES</span>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="py-12 text-center text-neutral-500 text-[10.5px]">
            No audit records matching specified query parameters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[10px] text-left">
              <thead>
                <tr className="border-b border-[#2B2B2B] text-neutral-500 text-[8.5px] uppercase tracking-wider">
                  <th className="py-2.5 pr-4">TIMESTAMP</th>
                  <th className="py-2.5 px-3">OPERATOR / USER</th>
                  <th className="py-2.5 px-3">ROLE</th>
                  <th className="py-2.5 px-3">MODULE & ACTION</th>
                  <th className="py-2.5 px-3">RESOURCE ID</th>
                  <th className="py-2.5 px-3">SECURITY VERDICT</th>
                  <th className="py-2.5 pl-3">DIAGNOSTIC REASON</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2B2B2B]/60">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 pr-4 text-neutral-400 font-mono text-[9px] shrink-0">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-white truncate max-w-[140px]">{log.userName}</div>
                      <div className="text-[8px] text-neutral-500 font-mono">{log.userId}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-neutral-300 font-bold uppercase text-[9px]">
                        {log.userRole}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-white font-bold">{log.module}</span>
                      <span className="text-neutral-500 text-[8.5px] block uppercase">
                        [{log.action}]
                      </span>
                    </td>
                    <td className="py-3 px-3 text-neutral-300 font-mono text-[9px]">
                      {log.resourceId || '—'}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-[8px] font-bold px-2 py-0.5 rounded-2xs uppercase tracking-widest ${
                          log.status === 'ALLOWED'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                    <td className="py-3 pl-3 text-neutral-400 font-sans text-[9.5px] max-w-[280px]">
                      {log.reason || 'Normal state progression.'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditTrailExplorer;
