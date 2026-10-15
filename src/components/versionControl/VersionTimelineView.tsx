/**
 * @file VersionTimelineView.tsx
 * Interactive Git-Style Visual Commit & Branch Timeline for Daniel’s Maison VCS.
 */

import React from 'react';
import {
  GitCommit,
  GitBranch,
  Lock,
  CheckCircle2,
  Clock,
  User,
  ArrowRight,
  RotateCcw,
  Eye,
  FileCheck,
  Ruler,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import {
  VersionCommit,
  VersionTag,
  VersionDomainType,
} from '../../types/versionControl.types';

interface VersionTimelineViewProps {
  commits: VersionCommit[];
  selectedCommitId: string | null;
  onSelectCommit: (id: string) => void;
  onCompareWithHead: (commitId: string) => void;
  onRestoreCommit: (commitId: string) => void;
  domainFilter: 'ALL' | VersionDomainType;
}

export const VersionTimelineView: React.FC<VersionTimelineViewProps> = ({
  commits,
  selectedCommitId,
  onSelectCommit,
  onCompareWithHead,
  onRestoreCommit,
  domainFilter,
}) => {
  const filteredCommits = commits.filter((c) => {
    if (domainFilter === 'ALL') return true;
    return c.changedDomains.includes(domainFilter);
  });

  const getBadgeStyle = (badge: VersionTag) => {
    switch (badge) {
      case 'PRODUCTION_LOCK':
        return 'bg-purple-950/80 text-purple-300 border-purple-700/80';
      case 'CLIENT_APPROVED':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-700/80';
      case 'REVISED':
        return 'bg-amber-950/80 text-amber-300 border-amber-700/70';
      case 'DRAFT':
      default:
        return 'bg-neutral-800 text-neutral-300 border-neutral-700';
    }
  };

  const getDomainIcon = (domain: VersionDomainType) => {
    switch (domain) {
      case 'measurements':
        return Ruler;
      case 'design':
        return Sparkles;
      case 'fabrics':
        return ShoppingBag;
      case 'approval':
        return FileCheck;
    }
  };

  const formatTimestamp = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    } catch {
      return iso;
    }
  };

  return (
    <div className="relative pl-6 sm:pl-8 py-4 space-y-6">
      {/* Vertical Git Branch Line */}
      <div className="absolute left-3.5 sm:left-4.5 top-8 bottom-8 w-0.5 bg-gradient-to-b from-amber-500/80 via-neutral-700 to-neutral-800" />

      {filteredCommits.map((commit, index) => {
        const isSelected = selectedCommitId === commit.id;
        const isHead = commit.isCurrentHead;

        return (
          <div key={commit.id} className="relative flex items-start gap-4 group">
            {/* Git Node Circle */}
            <div
              onClick={() => onSelectCommit(commit.id)}
              className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center border-2 transition cursor-pointer shadow-md ${
                isHead
                  ? 'bg-amber-500 border-white text-black font-bold ring-4 ring-amber-500/20'
                  : isSelected
                  ? 'bg-neutral-900 border-amber-400 text-amber-400'
                  : 'bg-black border-neutral-600 text-neutral-400 group-hover:border-neutral-400'
              }`}
            >
              <GitCommit className="w-3.5 h-3.5" />
            </div>

            {/* Commit Card */}
            <div
              className={`flex-1 p-4 rounded-xs border transition cursor-pointer ${
                isSelected
                  ? 'bg-[#141414] border-amber-500/70 shadow-lg shadow-amber-950/20'
                  : 'bg-[#0c0c0c] border-[#222] hover:border-neutral-700 hover:bg-[#101010]'
              }`}
              onClick={() => onSelectCommit(commit.id)}
            >
              {/* Header row */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-white tracking-wider">
                    {commit.versionTag}
                  </span>
                  <span className="font-mono text-xs text-neutral-500 bg-neutral-900 px-1.5 py-0.5 rounded-xs border border-neutral-800">
                    {commit.commitHash}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-xs text-[10px] font-mono font-bold uppercase border ${getBadgeStyle(
                      commit.versionBadge
                    )}`}
                  >
                    {commit.versionBadge.replace('_', ' ')}
                  </span>
                  {isHead && (
                    <span className="px-2 py-0.5 bg-amber-500 text-black text-[10px] font-mono font-bold uppercase rounded-xs">
                      HEAD (ACTIVE)
                    </span>
                  )}
                  {commit.isSnapshotLocked && (
                    <span className="flex items-center gap-1 text-[10px] font-mono text-purple-400 bg-purple-950/50 px-2 py-0.5 rounded-xs border border-purple-800/50">
                      <Lock className="w-3 h-3" /> Sealed Vault
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-neutral-500 text-xs font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formatTimestamp(commit.timestamp)}</span>
                </div>
              </div>

              {/* Commit Message */}
              <p className="font-sans text-xs text-neutral-200 mb-3 leading-relaxed">
                {commit.commitMessage}
              </p>

              {/* Changed Domains Pill Tags */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-[10px] font-mono uppercase text-neutral-500">Mutated:</span>
                {commit.changedDomains.map((domain) => {
                  const Icon = getDomainIcon(domain);
                  return (
                    <span
                      key={domain}
                      className="flex items-center gap-1 px-2 py-0.5 bg-[#181818] border border-[#2c2c2c] text-neutral-300 text-[10px] font-mono rounded-xs capitalize"
                    >
                      <Icon className="w-3 h-3 text-amber-400/90" />
                      {domain}
                    </span>
                  );
                })}
              </div>

              {/* Footer: Author & Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#1c1c1c] text-xs font-mono">
                {/* Author */}
                <div className="flex items-center gap-2">
                  {commit.author.avatarUrl ? (
                    <img
                      src={commit.author.avatarUrl}
                      alt={commit.author.name}
                      className="w-5 h-5 rounded-full object-cover border border-neutral-700"
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-neutral-800 flex items-center justify-center text-[10px] text-neutral-400 font-bold">
                      {commit.author.name[0]}
                    </div>
                  )}
                  <span className="text-neutral-300 font-medium">{commit.author.name}</span>
                  <span className="text-neutral-500 text-[11px]">({commit.author.role})</span>
                </div>

                {/* Actions Toolbar */}
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  {!isHead && (
                    <button
                      onClick={() => onCompareWithHead(commit.id)}
                      className="flex items-center gap-1 px-2.5 py-1 bg-neutral-900 border border-neutral-700 hover:border-neutral-500 text-neutral-300 hover:text-white rounded-xs text-[11px] transition cursor-pointer"
                      title="Compare this commit with current HEAD"
                    >
                      <ArrowRight className="w-3 h-3" /> Compare vs HEAD
                    </button>
                  )}

                  {!isHead && (
                    <button
                      onClick={() => onRestoreCommit(commit.id)}
                      className="flex items-center gap-1 px-2.5 py-1 bg-amber-600/20 border border-amber-600/40 hover:bg-amber-600/30 text-amber-300 rounded-xs text-[11px] transition cursor-pointer"
                      title="Restore and make this older version active HEAD"
                    >
                      <RotateCcw className="w-3 h-3" /> Restore Version
                    </button>
                  )}

                  <button
                    onClick={() => onSelectCommit(commit.id)}
                    className="flex items-center gap-1 px-2 py-1 text-neutral-400 hover:text-white text-[11px] transition cursor-pointer"
                  >
                    <Eye className="w-3 h-3" /> Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {filteredCommits.length === 0 && (
        <div className="text-center py-12 text-neutral-500 font-mono text-xs">
          No version commits match the selected domain filter.
        </div>
      )}
    </div>
  );
};
