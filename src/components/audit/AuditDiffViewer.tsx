/**
 * @file AuditDiffViewer.tsx
 * High-Precision Visual State Diff Inspector for Daniel’s Maison Audit Trail.
 * Supports Split Side-by-Side, Unified Diff, and Raw JSON snapshots.
 */

import React, { useState } from 'react';
import {
  Columns2,
  FileCode2,
  ListFilter,
  Copy,
  Check,
  PlusCircle,
  MinusCircle,
  ArrowRight,
} from 'lucide-react';
import { FieldDiff, AuditRecord } from '../../types/auditTrail.types';

interface AuditDiffViewerProps {
  record: AuditRecord;
  mode: 'split' | 'unified' | 'json';
  onModeChange: (mode: 'split' | 'unified' | 'json') => void;
}

export const AuditDiffViewer: React.FC<AuditDiffViewerProps> = ({
  record,
  mode,
  onModeChange,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyJson = () => {
    const payload = {
      recordId: record.id,
      sequenceNumber: record.sequenceNumber,
      timestamp: record.timestamp,
      action: record.actionType,
      oldValue: record.oldValue,
      newValue: record.newValue,
      diffs: record.diffs,
      tamperHash: record.tamperHash,
    };
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderValue = (val: any) => {
    if (val === null || val === undefined) {
      return <span className="text-neutral-500 italic">null / undefined</span>;
    }
    if (typeof val === 'boolean') {
      return <span className="font-mono text-amber-300 font-semibold">{val ? 'true' : 'false'}</span>;
    }
    if (typeof val === 'number') {
      return <span className="font-mono text-cyan-300 font-semibold">{val.toLocaleString()}</span>;
    }
    if (typeof val === 'object') {
      return <span className="font-mono text-neutral-300 text-xs">{JSON.stringify(val)}</span>;
    }
    return <span className="font-sans text-neutral-200">{String(val)}</span>;
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] border border-[#222] rounded-xs overflow-hidden">
      {/* Diff Toolbar Header */}
      <div className="px-4 py-3 bg-[#111] border-b border-[#222] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] uppercase tracking-wider text-neutral-400">
            State Delta Inspector
          </span>
          <span className="px-2 py-0.5 bg-neutral-800 text-neutral-300 text-[10px] font-mono rounded-xs border border-neutral-700">
            {record.diffs.length} {record.diffs.length === 1 ? 'Field Modified' : 'Fields Modified'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle Buttons */}
          <div className="flex items-center bg-black border border-[#333] rounded-xs p-0.5">
            <button
              onClick={() => onModeChange('split')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono rounded-xs transition cursor-pointer ${
                mode === 'split'
                  ? 'bg-neutral-800 text-white font-semibold shadow-xs'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Columns2 className="w-3.5 h-3.5" /> Split
            </button>
            <button
              onClick={() => onModeChange('unified')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono rounded-xs transition cursor-pointer ${
                mode === 'unified'
                  ? 'bg-neutral-800 text-white font-semibold shadow-xs'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" /> Unified
            </button>
            <button
              onClick={() => onModeChange('json')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono rounded-xs transition cursor-pointer ${
                mode === 'json'
                  ? 'bg-neutral-800 text-white font-semibold shadow-xs'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <FileCode2 className="w-3.5 h-3.5" /> Raw JSON
            </button>
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopyJson}
            className="flex items-center gap-1 px-2.5 py-1 bg-neutral-900 border border-[#333] hover:border-neutral-500 text-neutral-300 hover:text-white text-[11px] font-mono rounded-xs transition cursor-pointer"
            title="Copy diff payload to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-4 flex-1 overflow-y-auto">
        {mode === 'split' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] font-mono text-neutral-400 border-b border-[#222] pb-2">
              <div className="flex items-center gap-1.5 font-bold text-rose-400 uppercase">
                <MinusCircle className="w-3.5 h-3.5" /> Prior State (Old Value)
              </div>
              <div className="flex items-center gap-1.5 font-bold text-emerald-400 uppercase">
                <PlusCircle className="w-3.5 h-3.5" /> Subsequent State (New Value)
              </div>
            </div>

            {record.diffs.map((diff, index) => (
              <div
                key={index}
                className="bg-[#0f0f0f] border border-[#222] rounded-xs p-3 hover:border-neutral-700 transition"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-semibold text-white tracking-wide">
                    {diff.label} <span className="text-[10px] text-neutral-500">({diff.field})</span>
                  </span>
                  {diff.category && (
                    <span className="px-2 py-0.5 bg-neutral-800 text-neutral-400 text-[10px] font-mono rounded-xs">
                      {diff.category}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Old Value Box */}
                  <div className="p-2.5 bg-rose-950/20 border border-rose-900/40 rounded-xs text-xs font-sans text-rose-200 break-words">
                    {renderValue(diff.oldValue)}
                  </div>

                  {/* New Value Box */}
                  <div className="p-2.5 bg-emerald-950/20 border border-emerald-900/40 rounded-xs text-xs font-sans text-emerald-200 break-words">
                    {renderValue(diff.newValue)}
                  </div>
                </div>
              </div>
            ))}

            {record.diffs.length === 0 && (
              <div className="text-center py-10 text-neutral-500 font-mono text-xs">
                No granular property modifications detected for this event snapshot.
              </div>
            )}
          </div>
        )}

        {mode === 'unified' && (
          <div className="space-y-3 font-mono text-xs">
            {record.diffs.map((diff, index) => (
              <div
                key={index}
                className="bg-[#0d0d0d] border border-[#222] rounded-xs overflow-hidden"
              >
                <div className="px-3 py-1.5 bg-[#141414] border-b border-[#222] flex items-center justify-between text-[11px] text-neutral-400">
                  <span>
                    @@ {diff.field} ({diff.label}) @@
                  </span>
                  <span className="text-[10px] uppercase text-neutral-500">
                    {diff.changeType}
                  </span>
                </div>
                <div className="p-3 space-y-1">
                  <div className="flex items-start gap-2 text-rose-300 bg-rose-950/30 px-2 py-1 rounded-xs">
                    <span className="select-none text-rose-500">-</span>
                    <span className="break-words">{renderValue(diff.oldValue)}</span>
                  </div>
                  <div className="flex items-start gap-2 text-emerald-300 bg-emerald-950/30 px-2 py-1 rounded-xs">
                    <span className="select-none text-emerald-500">+</span>
                    <span className="break-words">{renderValue(diff.newValue)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {mode === 'json' && (
          <div className="space-y-4">
            <div>
              <div className="text-[10px] font-mono uppercase text-rose-400 mb-1 font-bold">
                Old Value Snapshot (JSON)
              </div>
              <pre className="p-3 bg-black border border-rose-900/30 text-rose-200/90 rounded-xs font-mono text-[11px] overflow-x-auto leading-relaxed max-h-60">
                {JSON.stringify(record.oldValue, null, 2)}
              </pre>
            </div>

            <div>
              <div className="text-[10px] font-mono uppercase text-emerald-400 mb-1 font-bold">
                New Value Snapshot (JSON)
              </div>
              <pre className="p-3 bg-black border border-emerald-900/30 text-emerald-200/90 rounded-xs font-mono text-[11px] overflow-x-auto leading-relaxed max-h-60">
                {JSON.stringify(record.newValue, null, 2)}
              </pre>
            </div>

            {record.metadata && Object.keys(record.metadata).length > 0 && (
              <div>
                <div className="text-[10px] font-mono uppercase text-cyan-400 mb-1 font-bold">
                  Contextual Metadata (JSON)
                </div>
                <pre className="p-3 bg-black border border-cyan-900/30 text-cyan-200/90 rounded-xs font-mono text-[11px] overflow-x-auto leading-relaxed max-h-40">
                  {JSON.stringify(record.metadata, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
