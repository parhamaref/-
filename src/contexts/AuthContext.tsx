/**
 * @file AuthContext.tsx
 * Authentication context and useAuth() hook supporting simulation of all 9 DANIELS roles,
 * active permissions evaluation, and data isolation.
 */

import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { User, UserRole, Customer, Partner } from '../types/daniels.types';
import { MOCK_USERS, MOCK_CUSTOMERS, MOCK_PARTNERS } from '../mock/danielsMockData';
import {
  DanielsModule,
  DanielsAction,
  ResourceContext,
  hasPermission,
  AuditLogEntry,
  getAuditLogs,
} from '../utils/rbac';
import { ShieldCheck, UserCheck, ChevronDown, Check, SlidersHorizontal, Eye, Play, FileCheck } from 'lucide-react';
import { AcceptanceTestRunner } from '../components/qa/AcceptanceTestRunner';

interface AuthContextType {
  currentUser: User | null;
  currentRole: UserRole;
  setCurrentUser: (user: User) => void;
  switchRole: (role: UserRole) => void;
  hasAccess: (
    module: DanielsModule,
    action: DanielsAction,
    resourceContext?: string | ResourceContext
  ) => boolean;
  availableUsers: User[];
  customerData: Customer | null;
  partnerData: Partner | null;
  auditLogs: AuditLogEntry[];
  refreshAuditLogs: () => void;
  isRoleSwitcherOpen: boolean;
  setIsRoleSwitcherOpen: (open: boolean) => void;
  isTestRunnerOpen: boolean;
  setIsTestRunnerOpen: (open: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Default to Super Admin so initial developers/evaluators have full visibility,
  // but can smoothly switch to any role in real time.
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS[0]);
  const [isRoleSwitcherOpen, setIsRoleSwitcherOpen] = useState(false);
  const [isTestRunnerOpen, setIsTestRunnerOpen] = useState(false);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);

  const refreshAuditLogs = () => {
    setAuditLogs(getAuditLogs());
  };

  useEffect(() => {
    refreshAuditLogs();
  }, [currentUser]);

  // Role simulation switch
  const switchRole = (role: UserRole) => {
    const targetUser = MOCK_USERS.find((u) => u.role === role) || MOCK_USERS[0];
    setCurrentUser(targetUser);
    setIsRoleSwitcherOpen(false);
    refreshAuditLogs();
  };

  // Associated customer profile (if relevant)
  const customerData = useMemo(() => {
    if (!currentUser) return null;
    return (
      MOCK_CUSTOMERS.find(
        (c) => c.userId === currentUser.id || c.id === currentUser.id
      ) || null
    );
  }, [currentUser]);

  // Associated partner profile (if relevant)
  const partnerData = useMemo(() => {
    if (!currentUser) return null;
    return (
      MOCK_PARTNERS.find(
        (p) => p.userId === currentUser.id || p.id === currentUser.id
      ) || null
    );
  }, [currentUser]);

  // Pure wrapper around hasPermission without triggering setState during component render
  const hasAccess = (
    module: DanielsModule,
    action: DanielsAction,
    resourceContext?: string | ResourceContext
  ): boolean => {
    return hasPermission(currentUser, module, action, resourceContext);
  };

  const value = {
    currentUser,
    currentRole: currentUser?.role || 'Customer',
    setCurrentUser,
    switchRole,
    hasAccess,
    availableUsers: MOCK_USERS,
    customerData,
    partnerData,
    auditLogs,
    refreshAuditLogs,
    isRoleSwitcherOpen,
    setIsRoleSwitcherOpen,
    isTestRunnerOpen,
    setIsTestRunnerOpen,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      {/* Floating Role Switcher Widget adhering to Daniel's Maison luxury aesthetic */}
      <RoleSwitcherWidget
        currentUser={currentUser}
        isOpen={isRoleSwitcherOpen}
        onToggle={() => setIsRoleSwitcherOpen(!isRoleSwitcherOpen)}
        onSelectRole={switchRole}
        onOpenTests={() => {
          setIsRoleSwitcherOpen(false);
          setIsTestRunnerOpen(true);
        }}
      />

      {/* Global Acceptance Test Runner Modal */}
      {isTestRunnerOpen && (
        <div className="fixed inset-0 z-50 bg-[#050505]/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="w-full max-w-6xl max-h-[92vh] overflow-y-auto">
            <AcceptanceTestRunner onClose={() => setIsTestRunnerOpen(false)} />
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

/**
 * Role Switcher Floating Pill / Modal
 * Allows testing and demonstration of the 9 roles in the RBAC matrix.
 */
function RoleSwitcherWidget({
  currentUser,
  isOpen,
  onToggle,
  onSelectRole,
  onOpenTests,
}: {
  currentUser: User | null;
  isOpen: boolean;
  onToggle: () => void;
  onSelectRole: (role: UserRole) => void;
  onOpenTests: () => void;
}) {
  const allRoles: UserRole[] = [
    'Super Admin',
    'Management',
    'Sales',
    'Production',
    'QC',
    'Finance',
    'Logistics',
    'Partner',
    'Designer',
    'Customer',
  ];

  return (
    <aside aria-label="Role Switcher Controls" className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-40 font-mono">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={onToggle}
        className="group flex items-center gap-2 px-3 sm:px-3.5 py-2 bg-[#0E0E0E]/95 hover:bg-[#1A1A1A] border border-[#2B2B2B] hover:border-neutral-400 text-white rounded-sm shadow-2xl backdrop-blur-md transition-all duration-300 cursor-pointer"
        title="Simulate DANIELS RBAC Roles"
      >
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-[9.5px] sm:text-[10px] tracking-widest uppercase text-neutral-400 group-hover:text-white transition-colors">
          ROLE:
        </span>
        <span className="text-[10.5px] sm:text-[11px] font-bold tracking-wider text-white">
          {currentUser?.role || 'Guest'}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Role Picker Drawer / Dropdown */}
      {isOpen && (
        <div className="absolute bottom-12 left-0 w-[calc(100vw-2rem)] sm:w-80 max-w-[340px] bg-[#0E0E0E] border border-[#2B2B2B] rounded-sm p-4 shadow-2xl space-y-3 animate-fadeIn text-left">
          <div className="flex items-center justify-between border-b border-[#2B2B2B] pb-2.5">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-white" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-white">
                RBAC SIMULATOR
              </span>
            </div>
            <span className="text-[8px] text-neutral-500 uppercase tracking-widest">
              9 ACTIVE TIERS
            </span>
          </div>

          <p className="text-[9px] text-neutral-400 leading-normal font-sans">
            Select any persona to evaluate data isolation, operational limits, and view guards.
          </p>

          <div className="space-y-1 max-h-72 overflow-y-auto pr-1">
            {allRoles.map((role) => {
              const isSelected = currentUser?.role === role;
              const sampleUser = MOCK_USERS.find((u) => u.role === role);

              return (
                <button
                  type="button"
                  key={role}
                  onClick={() => onSelectRole(role)}
                  className={`w-full flex items-center justify-between p-2 rounded-xs border text-left transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-white/10 border-white text-white'
                      : 'bg-black/40 border-[#2B2B2B]/60 text-neutral-400 hover:text-white hover:border-[#2B2B2B]'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10.5px] font-bold tracking-wider uppercase">
                        {role}
                      </span>
                      {isSelected && <Check className="w-3 h-3 text-emerald-400" />}
                    </div>
                    <div className="text-[8px] text-neutral-500 truncate max-w-[200px]">
                      {sampleUser?.name} ({sampleUser?.email})
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="border-t border-[#2B2B2B] pt-2 space-y-2">
            <button
              type="button"
              onClick={onOpenTests}
              className="w-full py-2 px-3 bg-white/10 hover:bg-white hover:text-black border border-white/20 text-white rounded-xs text-[9.5px] font-bold tracking-widest uppercase transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer shadow-lg"
            >
              <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>RUN 10 ACCEPTANCE TESTS</span>
            </button>

            <div className="flex items-center justify-between text-[8px] text-neutral-500 uppercase pt-0.5">
              <span>ACTIVE USER: {currentUser?.name}</span>
              <span className="text-emerald-400 font-bold">STATUS: {currentUser?.status}</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
