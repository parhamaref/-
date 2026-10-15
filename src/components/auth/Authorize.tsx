/**
 * @file Authorize.tsx
 * Declarative component wrapper for conditional rendering based on RBAC permissions
 * and data isolation rules.
 */

import React, { ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { DanielsModule, DanielsAction, ResourceContext } from '../../utils/rbac';
import { Lock } from 'lucide-react';

export interface AuthorizeProps {
  module: DanielsModule;
  action?: DanielsAction;
  resourceContext?: string | ResourceContext;
  resourceOwnerId?: string;
  fallback?: ReactNode;
  showDeniedBanner?: boolean;
  children: ReactNode;
}

/**
 * Authorize component conditionally renders its children if the active user
 * possesses required privileges for the given module, action, and resource context.
 */
export const Authorize: React.FC<AuthorizeProps> = ({
  module,
  action = 'view' as DanielsAction,
  resourceContext,
  resourceOwnerId,
  fallback = null,
  showDeniedBanner = false,
  children,
}) => {
  const { hasAccess, currentRole } = useAuth();

  const effectiveAction: DanielsAction = (action || 'view') as DanielsAction;
  // Combine resourceContext or resourceOwnerId
  const effectiveContext = resourceContext || resourceOwnerId;
  const isAllowed = hasAccess(module, effectiveAction, effectiveContext);

  if (isAllowed) {
    return <>{children}</>;
  }

  if (showDeniedBanner) {
    return (
      <div className="p-3 bg-[#0E0E0E] border border-amber-900/50 rounded-sm text-amber-200 text-left font-mono text-[9.5px] flex items-center gap-3">
        <Lock className="w-4 h-4 text-amber-400 shrink-0" />
        <div>
          <span className="font-bold uppercase tracking-wider block">RESTRICTED SECTION</span>
          <span className="text-neutral-400">
            Current role ({currentRole}) lacks '{action}' privilege on '{module}'.
          </span>
        </div>
      </div>
    );
  }

  return <>{fallback}</>;
};

export default Authorize;
