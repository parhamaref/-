/**
 * @file ProtectedRoute.tsx
 * Role-Based Access Control route guard for the Designer Dashboard infrastructure.
 */

import React, { ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types/daniels.types';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
  children: ReactNode;
  fallback?: ReactNode;
  onRedirectHome?: () => void;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles = ['Designer', 'Super Admin', 'Management'],
  children,
  fallback,
  onRedirectHome,
}) => {
  const { currentUser, currentRole, switchRole } = useAuth();

  if (!currentUser || currentUser.status !== 'Active') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6 text-center">
        <div className="max-w-md bg-[#0E0E0E] border border-red-900/50 p-8 rounded-sm space-y-4 font-mono">
          <ShieldAlert className="w-10 h-10 text-red-500 mx-auto" />
          <h3 className="font-serif text-xl text-white uppercase tracking-wider">Authentication Required</h3>
          <p className="text-xs text-neutral-400">
            A valid designer cryptographic token or session is required to access the atelier workstation.
          </p>
          {onRedirectHome && (
            <button
              onClick={onRedirectHome}
              className="px-4 py-2 bg-white text-black text-xs font-bold uppercase tracking-widest rounded-xs hover:bg-neutral-200 cursor-pointer"
            >
              Return to Catalog
            </button>
          )}
        </div>
      </div>
    );
  }

  const isAuthorized = allowedRoles.includes(currentRole);

  if (!isAuthorized) {
    if (fallback) return <>{fallback}</>;

    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6 text-center animate-fadeIn">
        <div className="max-w-lg bg-[#0E0E0E] border border-[#2B2B2B] p-8 rounded-sm space-y-6 font-mono text-left">
          <div className="flex items-center gap-3 border-b border-[#2B2B2B] pb-4">
            <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-xs">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <span className="text-[10px] text-amber-400 uppercase tracking-widest block font-bold">
                SECURITY BARRIER // 403 FORBIDDEN
              </span>
              <h3 className="font-serif text-lg text-white uppercase tracking-wider">
                Restricted Atelier Portal
              </h3>
            </div>
          </div>

          <div className="space-y-2 text-xs text-neutral-400 font-sans leading-relaxed">
            <p>
              Your active persona is currently logged in as <strong className="text-white font-mono uppercase">{currentRole}</strong>.
            </p>
            <p>
              This sector requires one of the following verified credentials:
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {allowedRoles.map((r) => (
                <span key={r} className="px-2 py-0.5 bg-neutral-900 border border-neutral-700 text-neutral-200 text-[10px] font-mono rounded-xs">
                  {r}
                </span>
              ))}
            </div>
          </div>

          <div className="border-t border-[#2B2B2B] pt-4 flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => switchRole('Designer')}
              className="flex-1 py-2.5 px-4 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-mono text-[10px] font-bold uppercase tracking-widest rounded-xs transition-all cursor-pointer text-center"
            >
              Simulate Designer Role →
            </button>
            {onRedirectHome && (
              <button
                onClick={onRedirectHome}
                className="py-2.5 px-4 bg-transparent hover:bg-white/5 border border-[#2B2B2B] text-neutral-400 hover:text-white font-mono text-[10px] uppercase tracking-widest rounded-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return Home</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
