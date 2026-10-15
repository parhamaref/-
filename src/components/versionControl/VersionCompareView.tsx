/**
 * @file VersionCompareView.tsx
 * Side-by-Side Semantic Diff Inspector across Measurements, Design, Fabrics, and Approval.
 */

import React, { useState } from 'react';
import {
  Columns2,
  ArrowRight,
  RotateCcw,
  Ruler,
  Sparkles,
  ShoppingBag,
  FileCheck,
  CheckCircle2,
  PlusCircle,
  MinusCircle,
  Layers,
} from 'lucide-react';
import {
  VersionCommit,
  VersionComparisonResult,
  VersionDomainType,
} from '../../types/versionControl.types';

interface VersionCompareViewProps {
  commits: VersionCommit[];
  comparisonSourceId: string | null;
  comparisonTargetId: string | null;
  comparisonResult: VersionComparisonResult | null;
  onSetComparisonPair: (sourceId: string, targetId: string) => void;
  onRestoreToSource: (sourceCommitId: string) => void;
}

export const VersionCompareView: React.FC<VersionCompareViewProps> = ({
  commits,
  comparisonSourceId,
  comparisonTargetId,
  comparisonResult,
  onSetComparisonPair,
  onRestoreToSource,
}) => {
  const [activeDomainFilter, setActiveDomainFilter] = useState<'ALL' | VersionDomainType>('ALL');

  if (!comparisonResult || !comparisonResult.sourceCommit || !comparisonResult.targetCommit) {
    return (
      <div className="p-12 text-center text-neutral-500 font-mono text-xs">
        Select two versions above to generate a semantic comparison delta.
      </div>
    );
  }

  const { sourceCommit, targetCommit, diffs, diffsByDomain, totalModifications } = comparisonResult;

  const domains: { id: VersionDomainType; label: string; icon: React.ElementType }[] = [
    { id: 'measurements', label: 'Measurements', icon: Ruler },
    { id: 'design', label: 'Design Specifications', icon: Sparkles },
    { id: 'fabrics', label: 'Fabric Selection', icon: ShoppingBag },
    { id: 'approval', label: 'Approval Status', icon: FileCheck },
  ];

  const filteredDiffs = activeDomainFilter === 'ALL'
    ? diffs
    : diffsByDomain[activeDomainFilter] || [];

  return (
    <div className="space-y-6">
      {/* Version Pickers Header */}
      <div className="p-4 bg-[#111] border border-[#222] rounded-xs flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
        {/* Source Picker (Version A) */}
        <div className="flex-1 min-w-[240px]">
          <label className="block text-[10px] uppercase text-rose-400 font-bold mb-1 flex items-center gap-1.5">
            <MinusCircle className="w-3.5 h-3.5" /> Base Version (From)
          </label>
          <select
            value={comparisonSourceId || ''}
            onChange={(e) => onSetComparisonPair(e.target.value, comparisonTargetId || '')}
            className="w-full bg-black border border-[#333] text-neutral-200 px-3 py-1.5 rounded-xs focus:outline-hidden focus:border-amber-500"
          >
            {commits.map((c) => (
              <option key={c.id} value={c.id}>
                {c.versionTag} ({c.commitHash}) — {c.commitMessage.slice(0, 45)}...
              </option>
            ))}
          </select>
          <div className="text-[10px] text-neutral-500 mt-1">
            Author: {sourceCommit.author.name} • {sourceCommit.versionBadge}
          </div>
        </div>

        {/* Direction Indicator */}
        <div className="flex flex-col items-center justify-center px-2 text-neutral-500">
          <ArrowRight className="w-5 h-5 text-amber-400 hidden sm:block" />
        </div>

        {/* Target Picker (Version B) */}
        <div className="flex-1 min-w-[240px]">
          <label className="block text-[10px] uppercase text-emerald-400 font-bold mb-1 flex items-center gap-1.5">
            <PlusCircle className="w-3.5 h-3.5" /> Target Version (To)
          </label>
          <select
            value={comparisonTargetId || ''}
            onChange={(e) => onSetComparisonPair(comparisonSourceId || '', e.target.value)}
            className="w-full bg-black border border-[#333] text-neutral-200 px-3 py-1.5 rounded-xs focus:outline-hidden focus:border-amber-500"
          >
            {commits.map((c) => (
              <option key={c.id} value={c.id}>
                {c.versionTag} ({c.commitHash}) — {c.commitMessage.slice(0, 45)}...
              </option>
            ))}
          </select>
          <div className="text-[10px] text-neutral-500 mt-1">
            Author: {targetCommit.author.name} • {targetCommit.versionBadge}
          </div>
        </div>

        {/* Rollback to Source Button */}
        <div>
          <button
            onClick={() => onRestoreToSource(sourceCommit.id)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-600/20 border border-amber-600/40 text-amber-300 hover:bg-amber-600/30 text-xs font-bold uppercase rounded-xs transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Restore to {sourceCommit.versionTag}
          </button>
        </div>
      </div>

      {/* Delta Metrics Ribbon & Domain Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0d0d0d] border border-[#222] p-2.5 rounded-xs">
        <div className="flex flex-wrap items-center gap-1">
          <button
            onClick={() => setActiveDomainFilter('ALL')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-mono rounded-xs transition cursor-pointer ${
              activeDomainFilter === 'ALL'
                ? 'bg-neutral-800 text-white font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Layers className="w-3 h-3" /> All Domains ({totalModifications})
          </button>

          {domains.map((dom) => {
            const Icon = dom.icon;
            const count = diffsByDomain[dom.id]?.length || 0;
            return (
              <button
                key={dom.id}
                onClick={() => setActiveDomainFilter(dom.id)}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-mono rounded-xs transition cursor-pointer ${
                  activeDomainFilter === dom.id
                    ? 'bg-neutral-800 text-white font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Icon className="w-3 h-3 text-amber-400/80" />
                <span>{dom.label}</span>
                <span className="px-1.5 py-0.2 bg-black text-neutral-300 text-[10px] rounded-xs font-mono">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="text-neutral-400 font-mono text-xs">
          Showing <span className="text-white font-bold">{filteredDiffs.length}</span> changed properties
        </div>
      </div>

      {/* Diffs List Container */}
      <div className="space-y-4">
        {filteredDiffs.map((diff, index) => (
          <div
            key={index}
            className="bg-[#0f0f0f] border border-[#222] rounded-xs p-4 hover:border-neutral-700 transition"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-[#222]">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-neutral-900 border border-neutral-700 text-amber-400 font-mono text-[10px] uppercase rounded-xs">
                  {diff.domain}
                </span>
                <span className="font-serif text-sm font-semibold text-white tracking-wide">
                  {diff.label}
                </span>
                <span className="text-xs font-mono text-neutral-500">
                  ({diff.field})
                </span>
              </div>
              <span className="text-[10px] font-mono text-amber-300 uppercase bg-amber-950/40 px-2 py-0.5 rounded-xs border border-amber-900/40">
                MODIFIED
              </span>
            </div>

            {/* Split Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
              {/* Old State */}
              <div className="p-3 bg-rose-950/20 border border-rose-900/40 rounded-xs space-y-1">
                <div className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">
                  {sourceCommit.versionTag} ({sourceCommit.commitHash})
                </div>
                <div className="text-rose-200 break-words font-sans text-xs">
                  {String(diff.oldValue)}
                </div>
              </div>

              {/* New State */}
              <div className="p-3 bg-emerald-950/20 border border-emerald-900/40 rounded-xs space-y-1">
                <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                  {targetCommit.versionTag} ({targetCommit.commitHash})
                </div>
                <div className="text-emerald-200 break-words font-sans text-xs">
                  {String(diff.newValue)}
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredDiffs.length === 0 && (
          <div className="p-12 text-center text-neutral-500 font-mono text-xs bg-[#0a0a0a] border border-[#222] rounded-xs">
            <CheckCircle2 className="w-8 h-8 text-neutral-700 mx-auto mb-2" />
            No differences found between {sourceCommit.versionTag} and {targetCommit.versionTag} in this domain.
          </div>
        )}
      </div>
    </div>
  );
};
