/**
 * @file ChannelSettingsView.tsx
 * Channel Endpoints & Configuration Settings for Daniel’s Maison.
 * Allows managing verified Email address, SMS phone number,
 * Web Push permissions & device tokens, and In-App audio chime preferences.
 */

import React, { useState } from 'react';
import {
  Mail,
  Smartphone,
  Radio,
  Bell,
  CheckCircle2,
  ShieldCheck,
  Save,
  Volume2,
  VolumeX,
  Moon,
  Send,
  Sparkles,
} from 'lucide-react';
import { NotificationContactSettings } from '../../../types/notification.types';

interface ChannelSettingsViewProps {
  settings: NotificationContactSettings;
  onUpdateSettings: (settings: Partial<NotificationContactSettings>) => void;
  onTriggerTestDispatch: (channel: 'email' | 'sms' | 'push' | 'in_app') => void;
}

export const ChannelSettingsView: React.FC<ChannelSettingsViewProps> = ({
  settings,
  onUpdateSettings,
  onTriggerTestDispatch,
}) => {
  const [formData, setFormData] = useState<NotificationContactSettings>(settings);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-left">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Email Channel Endpoint */}
        <div className="p-6 rounded-2xl bg-[#0c0c0c] border border-[#222] space-y-4">
          <div className="flex items-center justify-between border-b border-[#1c1c1c] pb-3">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-sky-400" />
              <h3 className="font-serif text-base font-bold text-white uppercase tracking-wider">
                Email Dispatch Gateway
              </h3>
            </div>
            {formData.emailVerified && (
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified</span>
              </span>
            )}
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div>
              <label className="text-neutral-400 block mb-1">Recipient Atelier Email</label>
              <input
                type="email"
                required
                value={formData.emailAddress}
                onChange={(e) => setFormData({ ...formData, emailAddress: e.target.value })}
                className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl px-3.5 py-2.5 text-white focus:outline-hidden focus:border-sky-400 font-mono"
              />
            </div>

            <div>
              <label className="text-neutral-400 block mb-1">Email Digest Frequency</label>
              <select
                value={formData.emailDigest}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    emailDigest: e.target.value as NotificationContactSettings['emailDigest'],
                  })
                }
                className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl px-3.5 py-2.5 text-white focus:outline-hidden focus:border-sky-400 font-mono"
              >
                <option value="instant">Instant Dispatch (Real-Time Transactional)</option>
                <option value="hourly">Hourly Summary Bundle</option>
                <option value="daily_digest">Daily Evening Digest (18:00 GMT)</option>
              </select>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => onTriggerTestDispatch('email')}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#181818] hover:bg-[#222] border border-[#333] text-sky-300 font-mono text-xs transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Test Email Ping</span>
              </button>
            </div>
          </div>
        </div>

        {/* SMS Cellular Endpoint */}
        <div className="p-6 rounded-2xl bg-[#0c0c0c] border border-[#222] space-y-4">
          <div className="flex items-center justify-between border-b border-[#1c1c1c] pb-3">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <h3 className="font-serif text-base font-bold text-white uppercase tracking-wider">
                SMS Cellular Gateway
              </h3>
            </div>
            {formData.phoneVerified && (
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified Carrier</span>
              </span>
            )}
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div>
              <label className="text-neutral-400 block mb-1">Primary Mobile (E.164 Format)</label>
              <input
                type="text"
                required
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl px-3.5 py-2.5 text-white focus:outline-hidden focus:border-emerald-400 font-mono"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#141414] border border-[#262626]">
              <div>
                <span className="text-white block font-semibold">Urgent Events Only</span>
                <span className="text-[11px] text-neutral-400 font-sans block mt-0.5">
                  Restricts SMS to urgent order biometrics and low fabric deficits.
                </span>
              </div>
              <input
                type="checkbox"
                checked={formData.smsUrgentOnly}
                onChange={(e) => setFormData({ ...formData, smsUrgentOnly: e.target.checked })}
                className="w-4 h-4 accent-emerald-400 cursor-pointer"
              />
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => onTriggerTestDispatch('sms')}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#181818] hover:bg-[#222] border border-[#333] text-emerald-300 font-mono text-xs transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Dispatch Test SMS Alert</span>
              </button>
            </div>
          </div>
        </div>

        {/* Web Push Notification Endpoint */}
        <div className="p-6 rounded-2xl bg-[#0c0c0c] border border-[#222] space-y-4">
          <div className="flex items-center justify-between border-b border-[#1c1c1c] pb-3">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-purple-400" />
              <h3 className="font-serif text-base font-bold text-white uppercase tracking-wider">
                Web Push Notifications
              </h3>
            </div>
            <span className="text-[10px] font-mono text-purple-300 px-2 py-0.5 rounded-sm bg-purple-500/10 border border-purple-500/20">
              {formData.pushPermission === 'granted' ? '● Permission Granted' : '● Default'}
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#141414] border border-[#262626]">
              <div>
                <span className="text-white block font-semibold">Browser Push Active</span>
                <span className="text-[11px] text-neutral-400 font-sans block mt-0.5">
                  Deliver notifications via system tray when browser tab is minimized.
                </span>
              </div>
              <input
                type="checkbox"
                checked={formData.pushEnabled}
                onChange={(e) => setFormData({ ...formData, pushEnabled: e.target.checked })}
                className="w-4 h-4 accent-purple-400 cursor-pointer"
              />
            </div>

            <div className="p-3 rounded-xl bg-[#141414] border border-[#262626] text-[11px] text-neutral-400 space-y-1">
              <span className="text-white font-bold block">Device Token Fingerprint:</span>
              <p className="font-mono text-[10px] text-neutral-500 truncate">
                fcm_token_daniels_atelier_macOS_chrome_v124_0x8849bf2910a
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => onTriggerTestDispatch('push')}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#181818] hover:bg-[#222] border border-[#333] text-purple-300 font-mono text-xs transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Trigger Test Browser Push</span>
              </button>
            </div>
          </div>
        </div>

        {/* In-App Experience & Quiet Hours */}
        <div className="p-6 rounded-2xl bg-[#0c0c0c] border border-[#222] space-y-4">
          <div className="flex items-center justify-between border-b border-[#1c1c1c] pb-3">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-400" />
              <h3 className="font-serif text-base font-bold text-white uppercase tracking-wider">
                In-App & Quiet Hours
              </h3>
            </div>
            <span className="text-[10px] font-mono text-amber-400">Audio & Ergonomics</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#141414] border border-[#262626]">
              <div className="flex items-center gap-2">
                {formData.inAppSoundEnabled ? (
                  <Volume2 className="w-4 h-4 text-amber-400" />
                ) : (
                  <VolumeX className="w-4 h-4 text-neutral-500" />
                )}
                <div>
                  <span className="text-white block font-semibold">Chime on New Event</span>
                  <span className="text-[11px] text-neutral-400 font-sans block mt-0.5">
                    Subtle bespoke acoustic chime when high-priority order arrives.
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={formData.inAppSoundEnabled}
                onChange={(e) =>
                  setFormData({ ...formData, inAppSoundEnabled: e.target.checked })
                }
                className="w-4 h-4 accent-amber-400 cursor-pointer"
              />
            </div>

            <div className="p-3 rounded-xl bg-[#141414] border border-[#262626] space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Moon className="w-4 h-4 text-neutral-400" />
                  <span className="text-white font-semibold">Quiet Hours (Silence SMS)</span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.quietHoursEnabled}
                  onChange={(e) =>
                    setFormData({ ...formData, quietHoursEnabled: e.target.checked })
                  }
                  className="w-4 h-4 accent-amber-400 cursor-pointer"
                />
              </div>

              {formData.quietHoursEnabled && (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="text-neutral-500 text-[10px] block">Start Time</label>
                    <input
                      type="time"
                      value={formData.quietHoursStart}
                      onChange={(e) =>
                        setFormData({ ...formData, quietHoursStart: e.target.value })
                      }
                      className="w-full bg-[#1c1c1c] border border-[#333] rounded-lg px-2.5 py-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-neutral-500 text-[10px] block">End Time</label>
                    <input
                      type="time"
                      value={formData.quietHoursEnd}
                      onChange={(e) =>
                        setFormData({ ...formData, quietHoursEnd: e.target.value })
                      }
                      className="w-full bg-[#1c1c1c] border border-[#333] rounded-lg px-2.5 py-1.5 text-white"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#222]">
        {saveSuccess && (
          <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4" />
            <span>Channel configurations successfully committed to storage</span>
          </span>
        )}
        <button
          type="submit"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs font-mono uppercase tracking-wider transition-colors shadow-lg shadow-amber-500/10 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Channel Preferences</span>
        </button>
      </div>
    </form>
  );
};
