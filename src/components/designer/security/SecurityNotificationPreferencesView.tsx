/**
 * @file SecurityNotificationPreferencesView.tsx
 * Security-specific dispatch matrix & emergency broadcast triggers.
 * Regulates channels (In-App, Email, SMS, Push) for logins, 2FA modifications,
 * and high-severity payout routing modifications.
 */

import React, { useState } from 'react';
import {
  Bell,
  Mail,
  Smartphone,
  ShieldAlert,
  Moon,
  Clock,
  Save,
  Check,
  AlertTriangle,
  Lock,
} from 'lucide-react';
import { useSecurityStore } from '../../../stores/securityStore';
import { SecurityNotificationPreferences } from '../../../types/security.types';

export const SecurityNotificationPreferencesView: React.FC = () => {
  const { notificationPrefs, updateNotificationPreferences } = useSecurityStore();

  const [formState, setFormState] = useState<SecurityNotificationPreferences>(notificationPrefs);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateNotificationPreferences(formState);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 animate-fadeIn font-mono text-left">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#222] pb-5">
        <div>
          <div className="flex items-center gap-2 text-white text-[10px] uppercase tracking-widest mb-1">
            <Bell className="w-3.5 h-3.5 text-amber-400" />
            <span>CRITICAL ALERT DISPATCH</span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl text-white font-bold uppercase tracking-wider">
            Security Notification Preferences
          </h3>
          <p className="text-xs text-neutral-400 font-sans mt-0.5">
            Configure real-time delivery channels for high-priority security and financial modification events.
          </p>
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5"
        >
          {saveSuccess ? (
            <>
              <Check className="w-4 h-4" />
              <span>Saved!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Preferences</span>
            </>
          )}
        </button>
      </div>

      {/* Channel Delivery Matrix */}
      <div className="bg-[#0E0E0E] border border-[#222] rounded-2xl p-6 space-y-5">
        <div className="border-b border-[#222] pb-4">
          <h4 className="font-serif text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-cyan-400" />
            <span>Active Dispatch Channels</span>
          </h4>
          <p className="text-xs text-neutral-400 font-sans mt-0.5">
            Enable or mute outbound pipelines for automated atelier security bulletins.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { key: 'in_app', label: 'In-App Hub', icon: Bell, desc: 'Real-time dashboard popovers.' },
            { key: 'email', label: 'Primary Email', icon: Mail, desc: 'Cryptographically signed email.' },
            { key: 'sms', label: 'Mobile SMS', icon: Smartphone, desc: 'Urgent carrier text messages.' },
            { key: 'push', label: 'Web / App Push', icon: Bell, desc: 'Instant browser notifications.' },
          ].map((ch) => {
            const isChecked = formState.notifyChannels[ch.key as keyof typeof formState.notifyChannels];
            const Icon = ch.icon;
            return (
              <div
                key={ch.key}
                onClick={() =>
                  setFormState({
                    ...formState,
                    notifyChannels: {
                      ...formState.notifyChannels,
                      [ch.key]: !isChecked,
                    },
                  })
                }
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isChecked
                    ? 'bg-amber-500/10 border-amber-500/40 text-white'
                    : 'bg-[#141414] border-[#252525] text-neutral-400 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className="w-4 h-4 text-amber-400" />
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}} // handled by parent div
                    className="w-4 h-4 accent-amber-500 cursor-pointer"
                  />
                </div>
                <div className="font-bold text-xs">{ch.label}</div>
                <div className="text-[10px] text-neutral-500 font-sans mt-1">{ch.desc}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Security Event Triggers List */}
      <div className="bg-[#0E0E0E] border border-[#222] rounded-2xl p-6 space-y-4">
        <div className="border-b border-[#222] pb-4">
          <h4 className="font-serif text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-400" />
            <span>High-Priority Security Triggers</span>
          </h4>
          <p className="text-xs text-neutral-400 font-sans mt-0.5">
            Select which events trigger immediate multi-channel dispatch alerts.
          </p>
        </div>

        <div className="divide-y divide-[#1A1A1A]">
          {[
            {
              key: 'alertOnNewLogin',
              label: 'Successful Sign-in from Recognized Device',
              desc: 'Dispatches notice on routine login (useful for keeping an activity timeline).',
            },
            {
              key: 'alertOnUnrecognizedDevice',
              label: 'Sign-in Attempt from Unrecognized Device or New City',
              desc: 'Immediate emergency alert if an unfamiliar browser or anomalous IP logs in.',
            },
            {
              key: 'alertOn2faChange',
              label: 'Modifications to Two-Factor Authentication or Backup Codes',
              desc: 'Dispatches urgent alert whenever 2FA is activated, modified, or deactivated.',
            },
            {
              key: 'alertOnPasswordChange',
              label: 'Master Account Password or Credential Reset',
              desc: 'Instant verification dispatched on any password rotation or security challenge.',
            },
            {
              key: 'alertOnPayoutAccountChange',
              label: 'Atelier Payout Bank Account or Stripe Route Modification',
              desc: 'Anti-fraud lock: multi-channel broadcast whenever destination IBAN or routing updates.',
            },
            {
              key: 'alertOnRoleChange',
              label: 'Team Permission or RBAC Atelier Role Elevation',
              desc: 'Notifies when cutter, accountant, or assistant roles are created or altered.',
            },
            {
              key: 'alertOnBulkExport',
              label: 'Bulk Data Export (Customer Dossiers or Financial CSVs)',
              desc: 'Monitors data exfiltration by logging any download exceeding 10 records.',
            },
          ].map((item) => {
            const checked = (formState as any)[item.key];
            return (
              <div
                key={item.key}
                className="py-3.5 flex items-start justify-between gap-4 first:pt-0 last:pb-0"
              >
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-white">{item.label}</div>
                  <div className="text-[11px] text-neutral-400 font-sans">{item.desc}</div>
                </div>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      [item.key]: e.target.checked,
                    })
                  }
                  className="mt-1 w-5 h-5 accent-amber-500 rounded cursor-pointer shrink-0"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Quiet Hours & Digest Frequency */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quiet Hours */}
        <div className="bg-[#0E0E0E] border border-[#222] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#222] pb-3">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Moon className="w-4 h-4 text-purple-400" />
              <span>Quiet Hours (Mute Non-Critical)</span>
            </div>
            <input
              type="checkbox"
              checked={formState.quietHoursEnabled}
              onChange={(e) =>
                setFormState({
                  ...formState,
                  quietHoursEnabled: e.target.checked,
                })
              }
              className="w-4 h-4 accent-amber-500 cursor-pointer"
            />
          </div>

          <p className="text-xs text-neutral-400 font-sans">
            During quiet hours, only <strong className="text-rose-400">CRITICAL</strong> security
            events will trigger SMS and Push. Routine informational logins will queue silently.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="text-[10px] text-neutral-500 uppercase tracking-wider block mb-1">
                From
              </label>
              <input
                type="time"
                value={formState.quietHoursStart}
                onChange={(e) =>
                  setFormState({ ...formState, quietHoursStart: e.target.value })
                }
                className="w-full bg-[#141414] border border-[#333] px-3 py-1.5 rounded-lg text-xs text-white"
              />
            </div>
            <div>
              <label className="text-[10px] text-neutral-500 uppercase tracking-wider block mb-1">
                To
              </label>
              <input
                type="time"
                value={formState.quietHoursEnd}
                onChange={(e) =>
                  setFormState({ ...formState, quietHoursEnd: e.target.value })
                }
                className="w-full bg-[#141414] border border-[#333] px-3 py-1.5 rounded-lg text-xs text-white"
              />
            </div>
          </div>
        </div>

        {/* Digest Frequency */}
        <div className="bg-[#0E0E0E] border border-[#222] rounded-2xl p-6 space-y-4">
          <div className="border-b border-[#222] pb-3">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Security Summary Digest</span>
            </div>
          </div>

          <p className="text-xs text-neutral-400 font-sans">
            Choose how frequently non-urgent audit logs are summarized into a consolidated email report.
          </p>

          <div className="space-y-2 pt-1">
            {[
              { id: 'INSTANT', label: 'Instant Delivery', desc: 'Send each event immediately.' },
              { id: 'DAILY_DIGEST', label: 'Daily Atelier Digest', desc: 'Consolidated summary sent every morning at 08:00 GMT.' },
              { id: 'WEEKLY_SECURITY_RECAP', label: 'Weekly Security Recap', desc: 'Sent Mondays covering all device access and logins.' },
            ].map((d) => (
              <label
                key={d.id}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                  formState.digestFrequency === d.id
                    ? 'bg-amber-500/10 border-amber-500/40 text-white'
                    : 'bg-[#141414] border-[#222] text-neutral-400'
                }`}
              >
                <div>
                  <div className="text-xs font-bold">{d.label}</div>
                  <div className="text-[10px] text-neutral-500 font-sans">{d.desc}</div>
                </div>
                <input
                  type="radio"
                  name="digestFreq"
                  checked={formState.digestFrequency === d.id}
                  onChange={() =>
                    setFormState({
                      ...formState,
                      digestFrequency: d.id as any,
                    })
                  }
                  className="accent-amber-500"
                />
              </label>
            ))}
          </div>
        </div>
      </div>
    </form>
  );
};
