/**
 * @file DesignerSettingsView.tsx
 * Comprehensive settings module for the Designer Dashboard infrastructure.
 */

import React, { useState } from 'react';
import {
  Settings,
  Bell,
  Lock,
  Globe,
  Sliders,
  Check,
  Shield,
  Save,
  RefreshCw,
} from 'lucide-react';
import { useDesignerStore } from '../../stores/designerStore';

export const DesignerSettingsView: React.FC = () => {
  const { settings, updateSettings, profile, updateProfile, setActiveSection } = useDesignerStore();
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [formSettings, setFormSettings] = useState(settings);
  const [profileForm, setProfileForm] = useState({
    contactEmail: profile.contactEmail,
    phone: profile.phone,
    workingHours: profile.workingHours,
    leadDays: settings.standardLeadTimeDays,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      ...formSettings,
      standardLeadTimeDays: Number(profileForm.leadDays),
    });
    updateProfile({
      contactEmail: profileForm.contactEmail,
      phone: profileForm.phone,
      workingHours: profileForm.workingHours,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn font-mono text-left">
      {/* Header Banner */}
      <div className="border-b border-[#222] pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-white text-[10px] uppercase tracking-widest mb-1">
            <Settings className="w-3.5 h-3.5 text-emerald-400" />
            <span>INFRASTRUCTURE & CONFIGURATION</span>
          </div>
          <h2 className="font-serif text-2xl text-white uppercase tracking-wider font-bold">
            Atelier Settings
          </h2>
          <p className="text-xs text-neutral-400 font-sans mt-1">
            Configure order routing rules, notifications, lead times, and atelier security policies.
          </p>
        </div>

        {savedSuccess && (
          <div className="px-3 py-1.5 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-[10px] rounded-xs flex items-center gap-1.5 animate-fadeIn">
            <Check className="w-3.5 h-3.5" />
            <span>CHANGES COMMITTED & PERSISTED</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Section 1: Order Acceptance & Lead Time */}
        <div className="bg-[#0E0E0E] border border-[#222] p-6 rounded-sm space-y-5">
          <div className="flex items-center gap-2 border-b border-[#222] pb-3">
            <Sliders className="w-4 h-4 text-white" />
            <span className="text-xs font-bold uppercase tracking-wider text-white">
              Bespoke Production Preferences
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-neutral-400 mb-1.5">
                Standard Production Turnaround (Days)
              </label>
              <input
                type="number"
                min={3}
                max={90}
                value={profileForm.leadDays}
                onChange={(e) => setProfileForm({ ...profileForm, leadDays: Number(e.target.value) })}
                className="w-full bg-black border border-[#2B2B2B] focus:border-white px-3 py-2 text-white rounded-xs outline-none"
              />
              <span className="text-[9px] text-neutral-500 font-sans mt-1 block">
                Calculated on customer PDP as verified artisan lead-time.
              </span>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-neutral-400 mb-1.5">
                Atelier Working Hours
              </label>
              <input
                type="text"
                value={profileForm.workingHours}
                onChange={(e) => setProfileForm({ ...profileForm, workingHours: e.target.value })}
                className="w-full bg-black border border-[#2B2B2B] focus:border-white px-3 py-2 text-white rounded-xs outline-none"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={formSettings.autoAcceptOrders}
                onChange={(e) => setFormSettings({ ...formSettings, autoAcceptOrders: e.target.checked })}
                className="w-4 h-4 accent-emerald-500 rounded-xs"
              />
              <div className="text-xs">
                <span className="text-white group-hover:text-neutral-200 block font-bold">
                  Auto-Accept In-Tolerance Custom Orders
                </span>
                <span className="text-[9.5px] text-neutral-500 font-sans block">
                  Automatically move orders into "Production Queue" if measurements fall within standard deviation.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Section 2: Contact & Studio Dispatch */}
        <div className="bg-[#0E0E0E] border border-[#222] p-6 rounded-sm space-y-5">
          <div className="flex items-center gap-2 border-b border-[#222] pb-3">
            <Globe className="w-4 h-4 text-white" />
            <span className="text-xs font-bold uppercase tracking-wider text-white">
              Studio Communication Endpoints
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-neutral-400 mb-1.5">
                Official Dispatch Email
              </label>
              <input
                type="email"
                value={profileForm.contactEmail}
                onChange={(e) => setProfileForm({ ...profileForm, contactEmail: e.target.value })}
                className="w-full bg-black border border-[#2B2B2B] focus:border-white px-3 py-2 text-white rounded-xs outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-neutral-400 mb-1.5">
                Emergency Studio Phone
              </label>
              <input
                type="tel"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                className="w-full bg-black border border-[#2B2B2B] focus:border-white px-3 py-2 text-white rounded-xs outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Notification Channels */}
        <div className="bg-[#0E0E0E] border border-[#222] p-6 rounded-sm space-y-5">
          <div className="flex items-center gap-2 border-b border-[#222] pb-3">
            <Bell className="w-4 h-4 text-white" />
            <span className="text-xs font-bold uppercase tracking-wider text-white">
              Alert Subscriptions & Channels
            </span>
          </div>

          <div className="space-y-4 text-xs">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={formSettings.emailAlertsOnOrder}
                onChange={(e) => setFormSettings({ ...formSettings, emailAlertsOnOrder: e.target.checked })}
                className="w-4 h-4 accent-emerald-500 rounded-xs"
              />
              <div>
                <span className="text-white block font-bold">Email Dispatch on Incoming Orders</span>
                <span className="text-[9.5px] text-neutral-500 font-sans block">
                  Send immediate notifications when custom or ready-to-wear orders are received.
                </span>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={formSettings.smsAlertsOnUrgent}
                onChange={(e) => setFormSettings({ ...formSettings, smsAlertsOnUrgent: e.target.checked })}
                className="w-4 h-4 accent-emerald-500 rounded-xs"
              />
              <div>
                <span className="text-white block font-bold">SMS Urgent Priority Alerts</span>
                <span className="text-[9.5px] text-neutral-500 font-sans block">
                  Alert tailor via SMS if an alteration ticket or customer dispute requires resolution within 24h.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Section 4: Security & Two-Factor Authentication */}
        <div className="bg-[#0E0E0E] border border-[#222] p-6 rounded-sm space-y-5">
          <div className="flex items-center gap-2 border-b border-[#222] pb-3">
            <Lock className="w-4 h-4 text-white" />
            <span className="text-xs font-bold uppercase tracking-wider text-white">
              Atelier Security & Cryptographic Access
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div>
              <span className="text-white block font-bold">Hardware & Authenticator 2FA</span>
              <span className="text-[9.5px] text-neutral-500 font-sans block">
                Enforce TOTP multi-factor verification for payouts, invoice generation, and customer profile views.
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                setFormSettings({ ...formSettings, twoFactorEnabled: !formSettings.twoFactorEnabled });
              }}
              className={`px-3 py-1.5 rounded-xs border text-[10px] uppercase font-bold tracking-wider transition-colors cursor-pointer ${
                formSettings.twoFactorEnabled
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                  : 'bg-neutral-900 border-neutral-700 text-neutral-400'
              }`}
            >
              {formSettings.twoFactorEnabled ? '2FA ENABLED' : '2FA DISABLED'}
            </button>
          </div>

          <div className="pt-3 border-t border-[#1C1C1C] flex items-center justify-between">
            <span className="text-[10px] text-neutral-400">
              Manage authorized devices, active session tokens, audit logs, and privacy policies:
            </span>
            <button
              type="button"
              onClick={() => setActiveSection('security')}
              className="text-[10px] text-amber-400 hover:text-amber-300 uppercase tracking-wider font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>Open Security & Access Vault →</span>
            </button>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex justify-end pt-4 border-t border-[#222]">
          <button
            type="submit"
            className="px-6 py-3 bg-white text-black hover:bg-neutral-200 font-bold text-xs uppercase tracking-widest rounded-xs transition-colors flex items-center gap-2 cursor-pointer shadow-lg"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
