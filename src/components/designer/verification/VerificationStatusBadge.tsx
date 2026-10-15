/**
 * @file VerificationStatusBadge.tsx
 * Status & Pillar Badges with luxury styling.
 */

import React from 'react';
import {
  VerificationStatus,
  PillarStatus,
} from '../../../types/designerVerification.types';
import {
  Clock,
  Search,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  HelpCircle,
} from 'lucide-react';

interface VerificationStatusBadgeProps {
  status: VerificationStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const VerificationStatusBadge: React.FC<VerificationStatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true,
}) => {
  const config = {
    Submitted: {
      label: 'Submitted',
      icon: Clock,
      bg: 'bg-amber-950/30 text-amber-300 border-amber-800/60',
      dot: 'bg-amber-400',
    },
    'Under Review': {
      label: 'Under Review',
      icon: Search,
      bg: 'bg-blue-950/40 text-blue-300 border-blue-700/60',
      dot: 'bg-blue-400 animate-pulse',
    },
    'More Information Required': {
      label: 'More Information Required',
      icon: AlertTriangle,
      bg: 'bg-orange-950/40 text-orange-300 border-orange-700/60',
      dot: 'bg-orange-400',
    },
    Approved: {
      label: 'Approved & Accredited',
      icon: ShieldCheck,
      bg: 'bg-emerald-950/40 text-emerald-300 border-emerald-600/70',
      dot: 'bg-emerald-400',
    },
    Rejected: {
      label: 'Rejected',
      icon: XCircle,
      bg: 'bg-rose-950/40 text-rose-300 border-rose-800/60',
      dot: 'bg-rose-400',
    },
  }[status];

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 tracking-wider gap-1.5',
    md: 'text-xs px-2.5 py-1 tracking-wider gap-2',
    lg: 'text-sm px-3.5 py-1.5 tracking-widest gap-2.5',
  }[size];

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center uppercase font-mono font-medium rounded-full border shadow-sm backdrop-blur-sm ${config.bg} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {showIcon && <Icon className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />}
      <span>{config.label}</span>
    </span>
  );
};

export const PillarStatusBadge: React.FC<{ status: PillarStatus; label?: string }> = ({
  status,
  label,
}) => {
  const map: Record<PillarStatus, { label: string; icon: any; cls: string }> = {
    verified: {
      label: 'Verified',
      icon: CheckCircle2,
      cls: 'bg-emerald-950/30 text-emerald-400 border-emerald-700/40',
    },
    pending: {
      label: 'Pending Audit',
      icon: Clock,
      cls: 'bg-blue-950/30 text-blue-300 border-blue-700/40',
    },
    flagged: {
      label: 'Clarification Needed',
      icon: AlertTriangle,
      cls: 'bg-orange-950/30 text-orange-400 border-orange-700/40',
    },
    rejected: {
      label: 'Rejected',
      icon: XCircle,
      cls: 'bg-rose-950/30 text-rose-400 border-rose-700/40',
    },
    unverified: {
      label: 'Unverified',
      icon: HelpCircle,
      cls: 'bg-neutral-900/60 text-neutral-400 border-neutral-700/40',
    },
  };

  const item = map[status];
  const Icon = item.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border ${item.cls}`}
    >
      <Icon className="w-3 h-3" />
      <span>{label || item.label}</span>
    </span>
  );
};
