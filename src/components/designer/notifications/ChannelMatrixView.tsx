/**
 * @file ChannelMatrixView.tsx
 * Interactive Channel-by-Event Preference Matrix for Daniel’s Maison.
 * Configures multi-channel routing (In-App, Email, SMS, Push Notification)
 * across New Orders, Reviews, Messages, Payout Status, and Inventory Alerts.
 */

import React from 'react';
import {
  Bell,
  Mail,
  Smartphone,
  Radio,
  Check,
  X,
  ShoppingBag,
  Star,
  MessageSquare,
  DollarSign,
  Boxes,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import {
  ChannelEventPreferences,
  NotificationChannel,
  NotificationEventType,
} from '../../../types/notification.types';

interface ChannelMatrixViewProps {
  preferences: ChannelEventPreferences[];
  onTogglePreference: (eventType: NotificationEventType, channel: NotificationChannel) => void;
}

export const ChannelMatrixView: React.FC<ChannelMatrixViewProps> = ({
  preferences,
  onTogglePreference,
}) => {
  const getEventIcon = (type: NotificationEventType) => {
    switch (type) {
      case 'order':
        return <ShoppingBag className="w-4 h-4 text-amber-400" />;
      case 'review':
        return <Star className="w-4 h-4 text-amber-300" />;
      case 'message':
        return <MessageSquare className="w-4 h-4 text-sky-400" />;
      case 'payout':
        return <DollarSign className="w-4 h-4 text-emerald-400" />;
      case 'inventory':
        return <Boxes className="w-4 h-4 text-rose-400" />;
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Channel Capabilities Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#0c0c0c] border border-[#222] space-y-2">
          <div className="flex items-center gap-2 text-white font-serif font-bold text-sm">
            <Bell className="w-4 h-4 text-amber-400" />
            <span>In-App Feed</span>
          </div>
          <p className="text-xs text-neutral-400 font-sans leading-relaxed">
            Instant floating toast notifications, top navigation badge counters, and persistent atelier activity feeds.
          </p>
          <span className="text-[10px] font-mono text-emerald-400 block pt-1">
            ● Always active & zero latency
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#0c0c0c] border border-[#222] space-y-2">
          <div className="flex items-center gap-2 text-white font-serif font-bold text-sm">
            <Mail className="w-4 h-4 text-sky-400" />
            <span>Email Delivery</span>
          </div>
          <p className="text-xs text-neutral-400 font-sans leading-relaxed">
            Itemized transactional email dossiers with printable PDF attachments and daily digest digests.
          </p>
          <span className="text-[10px] font-mono text-sky-400 block pt-1">
            ● SendGrid SMTP Gateway verified
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#0c0c0c] border border-[#222] space-y-2">
          <div className="flex items-center gap-2 text-white font-serif font-bold text-sm">
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span>SMS Cellular</span>
          </div>
          <p className="text-xs text-neutral-400 font-sans leading-relaxed">
            High-priority SMS alerts for urgent order biometrics, client salon requests, and balance clears.
          </p>
          <span className="text-[10px] font-mono text-amber-400 block pt-1">
            ● Twilio Gateway · Urgent priority
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#0c0c0c] border border-[#222] space-y-2">
          <div className="flex items-center gap-2 text-white font-serif font-bold text-sm">
            <Radio className="w-4 h-4 text-purple-400" />
            <span>Web Push</span>
          </div>
          <p className="text-xs text-neutral-400 font-sans leading-relaxed">
            Native desktop and mobile push notifications delivered even when atelier browser tab is in background.
          </p>
          <span className="text-[10px] font-mono text-purple-400 block pt-1">
            ● FCM Service Worker Active
          </span>
        </div>
      </div>

      {/* Main Channel-by-Event Routing Matrix Table */}
      <div className="p-6 rounded-2xl bg-[#0c0c0c] border border-[#222] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1c1c1c] pb-3">
          <div>
            <h3 className="font-serif text-base font-bold text-white uppercase tracking-wider">
              Event Routing & Channel Matrix
            </h3>
            <p className="text-xs text-neutral-400 font-sans mt-0.5">
              Click any channel button to toggle delivery for that specific event category.
            </p>
          </div>
          <span className="text-xs font-mono text-amber-400">
            5 Event Triggers · 4 Delivery Channels
          </span>
        </div>

        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-[#222] text-neutral-400 text-[10px] uppercase">
                <th className="py-3 px-4 w-1/3">Event Trigger</th>
                <th className="py-3 px-3 text-center">In-App</th>
                <th className="py-3 px-3 text-center">Email</th>
                <th className="py-3 px-3 text-center">SMS</th>
                <th className="py-3 px-3 text-center">Web Push</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#181818]">
              {preferences.map((pref) => (
                <tr key={pref.eventType} className="hover:bg-[#141414] transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] shrink-0 mt-0.5">
                        {getEventIcon(pref.eventType)}
                      </div>
                      <div>
                        <span className="font-serif text-sm font-bold text-white block">
                          {pref.label}
                        </span>
                        <p className="text-[11px] text-neutral-400 font-sans mt-0.5 leading-relaxed">
                          {pref.description}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* In-App Toggle */}
                  <td className="py-4 px-3 text-center">
                    <button
                      onClick={() => onTogglePreference(pref.eventType, 'in_app')}
                      className={`w-9 h-9 rounded-xl inline-flex items-center justify-center transition-all cursor-pointer ${
                        pref.in_app
                          ? 'bg-amber-400 text-black font-bold shadow-md shadow-amber-500/20'
                          : 'bg-[#181818] border border-[#262626] text-neutral-600 hover:text-neutral-400'
                      }`}
                      title={`Toggle In-App for ${pref.label}`}
                    >
                      {pref.in_app ? <Check className="w-4 h-4 stroke-[3]" /> : <X className="w-4 h-4" />}
                    </button>
                  </td>

                  {/* Email Toggle */}
                  <td className="py-4 px-3 text-center">
                    <button
                      onClick={() => onTogglePreference(pref.eventType, 'email')}
                      className={`w-9 h-9 rounded-xl inline-flex items-center justify-center transition-all cursor-pointer ${
                        pref.email
                          ? 'bg-sky-400 text-black font-bold shadow-md shadow-sky-500/20'
                          : 'bg-[#181818] border border-[#262626] text-neutral-600 hover:text-neutral-400'
                      }`}
                      title={`Toggle Email for ${pref.label}`}
                    >
                      {pref.email ? <Check className="w-4 h-4 stroke-[3]" /> : <X className="w-4 h-4" />}
                    </button>
                  </td>

                  {/* SMS Toggle */}
                  <td className="py-4 px-3 text-center">
                    <button
                      onClick={() => onTogglePreference(pref.eventType, 'sms')}
                      className={`w-9 h-9 rounded-xl inline-flex items-center justify-center transition-all cursor-pointer ${
                        pref.sms
                          ? 'bg-emerald-400 text-black font-bold shadow-md shadow-emerald-500/20'
                          : 'bg-[#181818] border border-[#262626] text-neutral-600 hover:text-neutral-400'
                      }`}
                      title={`Toggle SMS for ${pref.label}`}
                    >
                      {pref.sms ? <Check className="w-4 h-4 stroke-[3]" /> : <X className="w-4 h-4" />}
                    </button>
                  </td>

                  {/* Web Push Toggle */}
                  <td className="py-4 px-3 text-center">
                    <button
                      onClick={() => onTogglePreference(pref.eventType, 'push')}
                      className={`w-9 h-9 rounded-xl inline-flex items-center justify-center transition-all cursor-pointer ${
                        pref.push
                          ? 'bg-purple-400 text-black font-bold shadow-md shadow-purple-500/20'
                          : 'bg-[#181818] border border-[#262626] text-neutral-600 hover:text-neutral-400'
                      }`}
                      title={`Toggle Web Push for ${pref.label}`}
                    >
                      {pref.push ? <Check className="w-4 h-4 stroke-[3]" /> : <X className="w-4 h-4" />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
