/**
 * @file ProtectedRoute.tsx
 * Route guard for views and sections, enforcing role requirements and data isolation.
 * Displays a 403 Forbidden view matching Daniel's Maison dark luxury aesthetic.
 */

import React, { ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { DanielsModule, DanielsAction, ResourceContext } from '../../utils/rbac';
import { UserRole } from '../../types/daniels.types';
import { ShieldAlert, ArrowLeft, RefreshCw, KeyRound } from 'lucide-react';

export interface ProtectedRouteProps {
  module: DanielsModule;
  action?: DanielsAction;
  resourceContext?: string | ResourceContext;
  resourceOwnerId?: string;
  requiredRoles?: UserRole[];
  fallback?: ReactNode;
  onNavigateBack?: () => void;
  children: ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  module,
  action = 'view' as DanielsAction,
  resourceContext,
  resourceOwnerId,
  requiredRoles,
  fallback,
  onNavigateBack,
  children,
}) => {
  const { currentUser, currentRole, hasAccess, setIsRoleSwitcherOpen } = useAuth();

  const effectiveAction: DanielsAction = (action || 'view') as DanielsAction;
  const effectiveContext = resourceContext || resourceOwnerId;

  // 1. Role-based fast filter if requiredRoles is provided
  if (requiredRoles && requiredRoles.length > 0) {
    if (!currentUser || !requiredRoles.includes(currentUser.role)) {
      if (fallback) return <>{fallback}</>;
      return (
        <AccessDeniedView
          module={module}
          action={effectiveAction}
          currentRole={currentRole}
          requiredRoles={requiredRoles}
          onOpenSwitcher={() => setIsRoleSwitcherOpen(true)}
          onBack={onNavigateBack}
        />
      );
    }
  }

  // 2. Complete RBAC & Data Isolation Evaluation
  const isAllowed = hasAccess(module, effectiveAction, effectiveContext);

  if (!isAllowed) {
    if (fallback) return <>{fallback}</>;
    return (
      <AccessDeniedView
        module={module}
        action={effectiveAction}
        currentRole={currentRole}
        requiredRoles={requiredRoles}
        onOpenSwitcher={() => setIsRoleSwitcherOpen(true)}
        onBack={onNavigateBack}
      />
    );
  }

  return <>{children}</>;
};

/**
 * High-fashion luxury 403 Forbidden view adhering to brand aesthetics.
 */
function AccessDeniedView({
  module,
  action,
  currentRole,
  requiredRoles,
  onOpenSwitcher,
  onBack,
}: {
  module: DanielsModule;
  action: DanielsAction;
  currentRole: UserRole;
  requiredRoles?: UserRole[];
  onOpenSwitcher: () => void;
  onBack?: () => void;
}) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6 text-center select-none font-mono">
      <div className="max-w-md w-full bg-[#0E0E0E] border border-[#2B2B2B] p-8 rounded-sm shadow-2xl space-y-6 text-left">
        {/* Header Icon + Code */}
        <div className="flex items-center justify-between border-b border-[#2B2B2B] pb-4">
          <div className="flex items-center gap-2.5 text-rose-400">
            <ShieldAlert className="w-5 h-5 text-rose-500 animate-pulse" />
            <span className="text-[11px] font-bold tracking-widest uppercase">
              SECURITY PROTOCOL 403
            </span>
          </div>
          <span className="text-[8.5px] text-neutral-500 uppercase tracking-widest">
            RESTRICTED ARCHIVE
          </span>
        </div>

        {/* Headline */}
        <div className="space-y-2">
          <h2 className="font-serif text-2xl text-white uppercase tracking-wider font-bold">
            ACCESS CIPHER DENIED
          </h2>
          <p className="text-[10px] text-neutral-400 font-sans leading-relaxed">
            Your current authorization credentials under role{' '}
            <span className="font-mono text-white font-bold uppercase underline">
              {currentRole}
            </span>{' '}
            do not grant privilege to execute <span className="text-white uppercase font-bold">{action}</span> on{' '}
            <span className="text-white uppercase font-bold">{module}</span>.
          </p>
        </div>

        {/* Diagnostic Metadata Block */}
        <div className="p-3 bg-black/60 border border-[#2B2B2B] rounded-xs space-y-1.5 text-[9px] text-neutral-400">
          <div className="flex justify-between">
            <span>TARGET MODULE:</span>
            <span className="text-white uppercase font-bold">{module}</span>
          </div>
          <div className="flex justify-between">
            <span>REQUESTED ACTION:</span>
            <span className="text-white uppercase font-bold">{action}</span>
          </div>
          {requiredRoles && (
            <div className="flex justify-between border-t border-[#2B2B2B]/60 pt-1">
              <span>REQUIRED TIERS:</span>
              <span className="text-neutral-300 truncate max-w-[200px]">
                {requiredRoles.join(', ')}
              </span>
            </div>
          )}
          <div className="flex justify-between text-[8px] text-neutral-500 border-t border-[#2B2B2B]/60 pt-1">
            <span>SECURITY AUDIT:</span>
            <span className="text-rose-400 font-bold">RECORD LOGGED</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={onOpenSwitcher}
            className="flex-1 py-2.5 px-4 bg-white hover:bg-neutral-200 text-black text-[9.5px] font-bold tracking-widest uppercase rounded-xs transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5" />
            SWITCH PERSONA
          </button>

          {onBack && (
            <button
              onClick={onBack}
              className="py-2.5 px-4 border border-[#2B2B2B] hover:border-white text-neutral-300 hover:text-white text-[9.5px] tracking-widest uppercase rounded-xs transition-colors duration-200 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              RETURN
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProtectedRoute;
