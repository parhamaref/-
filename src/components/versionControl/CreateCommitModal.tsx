/**
 * @file CreateCommitModal.tsx
 * Modal to tag and commit a new version in the Daniel’s Maison VCS.
 */

import React, { useState } from 'react';
import {
  X,
  GitCommit,
  Tag,
  Check,
  Ruler,
  Sparkles,
  ShoppingBag,
  FileCheck,
} from 'lucide-react';
import {
  VersionDomainType,
  VersionTag,
  VersionAuthor,
  VersionCommit,
} from '../../types/versionControl.types';
import { VersionControlService } from '../../services/versionControlApi';
import { useVersionControlStore } from '../../stores/versionControlStore';

interface CreateCommitModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageId: string;
  headCommit: VersionCommit | null;
}

export const CreateCommitModal: React.FC<CreateCommitModalProps> = ({
  isOpen,
  onClose,
  packageId,
  headCommit,
}) => {
  const { setActivePackageId, showNotification } = useVersionControlStore();

  const [versionTag, setVersionTag] = useState(() => {
    if (!headCommit) return 'v1.0.0';
    const parts = headCommit.versionTag.replace('v', '').split('.').map(Number);
    return `v${parts[0] || 1}.${(parts[1] || 0) + 1}.0`;
  });

  const [versionBadge, setVersionBadge] = useState<VersionTag>('REVISED');
  const [commitMessage, setCommitMessage] = useState('');
  const [selectedDomains, setSelectedDomains] = useState<VersionDomainType[]>([
    'measurements',
    'design',
  ]);

  if (!isOpen) return null;

  const toggleDomain = (domain: VersionDomainType) => {
    if (selectedDomains.includes(domain)) {
      if (selectedDomains.length === 1) return; // Keep at least one
      setSelectedDomains(selectedDomains.filter((d) => d !== domain));
    } else {
      setSelectedDomains([...selectedDomains, domain]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commitMessage.trim()) return;

    const author: VersionAuthor = {
      id: 'usr-des-001',
      name: 'Daniel de Morvray',
      role: 'Lead Designer',
      email: 'daniel@maisondaniel.paris',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    };

    const newCommit = VersionControlService.createCommit({
      packageId,
      versionTag: versionTag.trim(),
      versionBadge,
      commitMessage: commitMessage.trim(),
      changedDomains: selectedDomains,
      author,
    });

    if (newCommit) {
      setActivePackageId(packageId);
      showNotification(`Created version commit ${newCommit.versionTag} (${newCommit.commitHash})`, 'success');
      onClose();
    } else {
      showNotification('Failed to create version commit', 'error');
    }
  };

  const domainOptions: { id: VersionDomainType; label: string; icon: React.ElementType }[] = [
    { id: 'measurements', label: 'Measurements', icon: Ruler },
    { id: 'design', label: 'Design Specifications', icon: Sparkles },
    { id: 'fabrics', label: 'Fabric Selection', icon: ShoppingBag },
    { id: 'approval', label: 'Approval State', icon: FileCheck },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg bg-[#0d0d0d] border border-[#333] rounded-xs shadow-2xl flex flex-col overflow-hidden text-neutral-100">
        {/* Header */}
        <div className="px-6 py-4 bg-[#141414] border-b border-[#222] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xs bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <GitCommit className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold tracking-wider uppercase text-white">
                COMMIT NEW VERSION TAG
              </h2>
              <p className="text-[11px] font-mono text-neutral-400">
                Record Atelier Revisions & Update Specification Head
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-xs transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 font-mono text-xs">
          {/* Version Tag & Badge */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase text-neutral-400 font-bold mb-1">
                Semantic Version Tag:
              </label>
              <input
                type="text"
                value={versionTag}
                onChange={(e) => setVersionTag(e.target.value)}
                required
                className="w-full bg-black border border-[#333] px-3 py-1.5 rounded-xs text-white font-bold focus:outline-hidden focus:border-amber-500"
                placeholder="e.g. v2.1.0"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase text-neutral-400 font-bold mb-1">
                Version Release Badge:
              </label>
              <select
                value={versionBadge}
                onChange={(e) => setVersionBadge(e.target.value as any)}
                className="w-full bg-black border border-[#333] px-3 py-1.5 rounded-xs text-neutral-200 focus:outline-hidden focus:border-amber-500"
              >
                <option value="REVISED">REVISED</option>
                <option value="CLIENT_APPROVED">CLIENT_APPROVED</option>
                <option value="DRAFT">DRAFT</option>
                <option value="STABLE">STABLE</option>
                <option value="PRODUCTION_LOCK">PRODUCTION_LOCK</option>
              </select>
            </div>
          </div>

          {/* Mutated Domains Selection */}
          <div>
            <label className="block text-[10px] uppercase text-neutral-400 font-bold mb-1.5">
              Select Modified Domains:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {domainOptions.map((opt) => {
                const Icon = opt.icon;
                const isChecked = selectedDomains.includes(opt.id);
                return (
                  <button
                    type="button"
                    key={opt.id}
                    onClick={() => toggleDomain(opt.id)}
                    className={`flex items-center gap-2 p-2 rounded-xs border text-left transition cursor-pointer ${
                      isChecked
                        ? 'bg-amber-500/10 border-amber-500/60 text-white'
                        : 'bg-black border-[#262626] text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isChecked ? 'text-amber-400' : 'text-neutral-500'}`} />
                    <span className="text-[11px] font-medium">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Commit Message */}
          <div>
            <label className="block text-[10px] uppercase text-neutral-400 font-bold mb-1">
              Commit Message / Technical Rationale:
            </label>
            <textarea
              rows={3}
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              required
              className="w-full bg-black border border-[#333] p-3 rounded-xs text-xs text-neutral-200 placeholder:text-neutral-600 focus:outline-hidden focus:border-amber-500 leading-relaxed"
              placeholder="e.g. Adjusted sleeve pitch by 5mm and switched chest canvas padding to floating horsehair..."
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-[#222]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-neutral-400 hover:text-white transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold uppercase rounded-xs transition shadow-lg shadow-amber-900/20 cursor-pointer"
            >
              <GitCommit className="w-4 h-4" /> Commit Version
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
