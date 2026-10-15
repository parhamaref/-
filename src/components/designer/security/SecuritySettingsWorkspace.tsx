/**
 * @file SecuritySettingsWorkspace.tsx
 * Enterprise Security & Settings Workspace for Daniel’s Maison Atelier.
 * Unifies Two-Factor Authentication, Login History, Device Management,
 * Session Management, Activity Logs, Privacy Compliance, and Notification Preferences.
 */

import React from 'react';
import {
  Shield,
  ShieldCheck,
  History,
  Laptop,
  KeyRound,
  FileText,
  Lock,
  Bell,
  AlertTriangle,
  Radio,
  Server,
  CheckCircle2,
} from 'lucide-react';
import { useSecurityStore } from '../../../stores/securityStore';
import { SecurityWorkspaceTab } from '../../../types/security.types';
import { TwoFactorAuthView } from './TwoFactorAuthView';
import { LoginHistoryView } from './LoginHistoryView';
import { DeviceManagementView } from './DeviceManagementView';
import { SessionManagementView } from './SessionManagementView';
import { ActivityLogsView } from './ActivityLogsView';
import { PrivacySettingsView } from './PrivacySettingsView';
import { SecurityNotificationPreferencesView } from './SecurityNotificationPreferencesView';

export const SecuritySettingsWorkspace: React.FC = () => {
  const { activeTab, setActiveTab, twoFactor, devices, sessions, loginHistory, activityLogs } =
    useSecurityStore();

  const activeDevicesCount = devices.filter((d) => d.status === 'active').length;
  const otherSessionsCount = sessions.filter((s) => !s.isCurrent).length;
  const recentBlockedLogins = loginHistory.filter((l) => l.status === 'SUSPICIOUS_BLOCKED').length;

  const tabs: Array<{
    id: SecurityWorkspaceTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }> = [
    {
      id: '2fa',
      label: 'Two-Factor Auth',
      icon: ShieldCheck,
      badge: twoFactor.isEnabled ? 'Active' : 'Alert',
    },
    {
      id: 'login_history',
      label: 'Login History',
      icon: History,
      badge: recentBlockedLogins > 0 ? `${recentBlockedLogins} Blocked` : undefined,
    },
    {
      id: 'devices',
      label: 'Authorized Devices',
      icon: Laptop,
      badge: `${activeDevicesCount}`,
    },
    {
      id: 'sessions',
      label: 'Active Sessions',
      icon: KeyRound,
      badge: `${sessions.length}`,
    },
    {
      id: 'activity_logs',
      label: 'Activity Logs',
      icon: FileText,
      badge: `${activityLogs.length}`,
    },
    {
      id: 'privacy',
      label: 'Privacy & Retention',
      icon: Lock,
    },
    {
      id: 'notifications',
      label: 'Alert Channels',
      icon: Bell,
    },
  ];

  const renderActiveView = () => {
    switch (activeTab) {
      case '2fa':
        return <TwoFactorAuthView />;
      case 'login_history':
        return <LoginHistoryView />;
      case 'devices':
        return <DeviceManagementView />;
      case 'sessions':
        return <SessionManagementView />;
      case 'activity_logs':
        return <ActivityLogsView />;
      case 'privacy':
        return <PrivacySettingsView />;
      case 'notifications':
        return <SecurityNotificationPreferencesView />;
      default:
        return <TwoFactorAuthView />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fadeIn font-mono text-left">
      {/* Top Header Card */}
      <div className="border-b border-[#222] pb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-white text-[10px] uppercase tracking-widest mb-1.5">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>ATELIER SECURITY & GOVERNANCE VAULT</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-white uppercase tracking-wider font-bold">
              Security & Access Control
            </h2>
            <p className="text-xs text-neutral-400 font-sans mt-1 max-w-2xl leading-relaxed">
              Cryptographic authentication, multi-device management, real-time access radar,
              GDPR privacy compliance, and granular audit trails for Daniel’s Maison.
            </p>
          </div>

          {/* Quick Status Pill */}
          <div className="flex items-center gap-2 bg-[#121212] border border-[#262626] px-3.5 py-2 rounded-xl self-start md:self-auto">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <div className="text-left font-mono">
              <span className="text-[9px] text-neutral-400 uppercase tracking-widest block">
                Vault Status
              </span>
              <span className="text-xs text-emerald-400 font-bold">
                ENCRYPTED & PROTECTED
              </span>
            </div>
          </div>
        </div>

        {/* 4 Overview Metric Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mt-6">
          {/* Card 1: 2FA Status */}
          <div className="bg-[#0E0E0E] border border-[#222] p-4 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-neutral-400 text-[10px] uppercase tracking-wider">
              <span>Two-Factor Auth</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-white text-lg font-bold font-serif">
              {twoFactor.isEnabled ? 'Enforced' : 'Disabled'}
            </div>
            <div className="text-[10px] text-neutral-500 font-sans">
              Method: <span className="text-amber-400 font-mono uppercase">{twoFactor.method}</span>
            </div>
          </div>

          {/* Card 2: Active Sessions */}
          <div className="bg-[#0E0E0E] border border-[#222] p-4 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-neutral-400 text-[10px] uppercase tracking-wider">
              <span>Active Sessions</span>
              <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-white text-lg font-bold font-serif">
              {sessions.length} Tokens
            </div>
            <div className="text-[10px] text-neutral-500 font-sans">
              {otherSessionsCount} remote • 1 current studio
            </div>
          </div>

          {/* Card 3: Recognized Devices */}
          <div className="bg-[#0E0E0E] border border-[#222] p-4 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-neutral-400 text-[10px] uppercase tracking-wider">
              <span>Trusted Devices</span>
              <Laptop className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-white text-lg font-bold font-serif">
              {activeDevicesCount} Hardware Units
            </div>
            <div className="text-[10px] text-neutral-500 font-sans">
              London & Paris ateliers
            </div>
          </div>

          {/* Card 4: Threat Radar */}
          <div className="bg-[#0E0E0E] border border-[#222] p-4 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-neutral-400 text-[10px] uppercase tracking-wider">
              <span>Threat Radar</span>
              <Server className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <div className="text-emerald-400 text-lg font-bold font-serif">
              98.6% Clean
            </div>
            <div className="text-[10px] text-neutral-500 font-sans">
              {recentBlockedLogins} crawler IP blocked
            </div>
          </div>
        </div>
      </div>

      {/* Workspace Tabs Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-[#1E1E1E]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                isActive
                  ? 'bg-amber-500/10 border-amber-500/50 text-amber-300 shadow-md shadow-amber-500/5'
                  : 'bg-[#0E0E0E] border-[#222] text-neutral-400 hover:text-white hover:bg-[#151515]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-neutral-500'}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono uppercase ${
                    isActive
                      ? 'bg-amber-500/20 text-amber-200 border border-amber-500/30'
                      : 'bg-neutral-800 text-neutral-400'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Active Tab View Content */}
      <div className="pt-2">
        {renderActiveView()}
      </div>
    </div>
  );
};
