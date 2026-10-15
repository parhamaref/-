/**
 * @file NotificationCenter.tsx
 * Master Atelier Notification Center for Daniel’s Maison.
 * Coordinates In-App, Email, SMS, and Web Push channels across New Orders,
 * Reviews, Messages, Payout Status, and Inventory Alerts.
 */

import React, { useState } from 'react';
import {
  Bell,
  Mail,
  Smartphone,
  Radio,
  Sliders,
  FileText,
  Zap,
  CheckCircle2,
  RefreshCw,
  Trash2,
  ShieldCheck,
  TrendingUp,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useNotificationStore } from '../../../stores/notificationStore';
import { useDesignerStore } from '../../../stores/designerStore';
import {
  AtelierNotificationItem,
  NotificationEventType,
} from '../../../types/notification.types';
import { NotificationFeedView } from './NotificationFeedView';
import { ChannelMatrixView } from './ChannelMatrixView';
import { ChannelSettingsView } from './ChannelSettingsView';
import { NotificationDetailModal } from './NotificationDetailModal';
import { NotificationSimulateModal } from './NotificationSimulateModal';

export type NotificationTab = 'feed' | 'matrix' | 'channels' | 'audit';

export const NotificationCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NotificationTab>('feed');
  const [selectedNotification, setSelectedNotification] = useState<AtelierNotificationItem | null>(null);
  const [isSimulateModalOpen, setIsSimulateModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const {
    notifications,
    unreadCount,
    preferences,
    contactSettings,
    auditLogs,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    deleteNotification,
    clearAll,
    togglePreference,
    updateContactSettings,
    simulateIncomingEvent,
    clearAuditLogs,
  } = useNotificationStore();

  const { setActiveSection } = useDesignerStore();

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleTestDispatch = (channel: 'email' | 'sms' | 'push' | 'in_app') => {
    simulateIncomingEvent('order', {
      title: `Test ${channel.toUpperCase()} Dispatch Ping`,
      message: `Verified delivery via Daniel’s Maison ${channel.replace('_', ' ').toUpperCase()} gateway.`,
      priority: 'normal',
    });
    showToast(`Test ping dispatched to ${channel.toUpperCase()}!`);
  };

  const handleSimulate = (eventType: NotificationEventType, options?: any) => {
    const item = simulateIncomingEvent(eventType, options);
    showToast(`Simulated event dispatched: "${item.title}"`);
  };

  return (
    <div className="space-y-8 animate-fadeIn text-left max-w-7xl 2xl:max-w-[1600px] mx-auto pb-16">
      {/* Top Header & Actions Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-[#222] pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Bell className="w-4 h-4" />
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold uppercase tracking-wide text-white">
              Atelier Notification Center
            </h1>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-xs font-bold border border-amber-500/30">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="text-xs text-neutral-400 font-sans mt-1.5 max-w-2xl">
            Unified multi-channel event router dispatching alerts across In-App, Email, SMS, and Web Push
            for New Orders, Reviews, Messages, Payout Status, and Inventory Deficits.
          </p>
        </div>

        {/* Global Header Actions */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Simulate Event Button */}
          <button
            onClick={() => setIsSimulateModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs font-mono uppercase tracking-wider transition-colors shadow-lg shadow-amber-500/20 cursor-pointer"
          >
            <Zap className="w-4 h-4" />
            <span>Simulate Live Event</span>
          </button>
        </div>
      </div>

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs font-mono flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-neutral-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top 4 Channel KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#0c0c0c] border border-[#222]">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-mono uppercase">
            <span>In-App Stream</span>
            <Bell className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-2xl font-bold text-white">
              {notifications.length} Total
            </span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 block mt-1">
            ● {unreadCount} awaiting review
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#0c0c0c] border border-[#222]">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-mono uppercase">
            <span>Email Gateway</span>
            <Mail className="w-4 h-4 text-sky-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-2xl font-bold text-sky-300">
              99.8%
            </span>
          </div>
          <span className="text-[10px] font-mono text-neutral-400 block mt-1 truncate">
            {contactSettings.emailAddress}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#0c0c0c] border border-[#222]">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-mono uppercase">
            <span>SMS Cellular</span>
            <Smartphone className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-2xl font-bold text-emerald-300">
              Active
            </span>
          </div>
          <span className="text-[10px] font-mono text-neutral-400 block mt-1 truncate">
            {contactSettings.phoneNumber}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#0c0c0c] border border-[#222]">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-mono uppercase">
            <span>Web Push Device</span>
            <Radio className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-2xl font-bold text-purple-300">
              Online
            </span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 block mt-1">
            ● FCM Service Worker Ready
          </span>
        </div>
      </div>

      {/* Tab Navigation Segmented Bar */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-[#222] pb-3 no-scrollbar">
        <button
          onClick={() => setActiveTab('feed')}
          className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-colors shrink-0 flex items-center gap-2 cursor-pointer ${
            activeTab === 'feed'
              ? 'bg-amber-400 text-black font-bold shadow-xs'
              : 'bg-[#121212] text-neutral-400 hover:text-white border border-[#262626]'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>Live Alert Feed ({notifications.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('matrix')}
          className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-colors shrink-0 flex items-center gap-2 cursor-pointer ${
            activeTab === 'matrix'
              ? 'bg-amber-400 text-black font-bold shadow-xs'
              : 'bg-[#121212] text-neutral-400 hover:text-white border border-[#262626]'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Channel Routing Matrix</span>
        </button>

        <button
          onClick={() => setActiveTab('channels')}
          className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-colors shrink-0 flex items-center gap-2 cursor-pointer ${
            activeTab === 'channels'
              ? 'bg-amber-400 text-black font-bold shadow-xs'
              : 'bg-[#121212] text-neutral-400 hover:text-white border border-[#262626]'
          }`}
        >
          <Radio className="w-3.5 h-3.5" />
          <span>Channel Endpoints & Setup</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-colors shrink-0 flex items-center gap-2 cursor-pointer ${
            activeTab === 'audit'
              ? 'bg-amber-400 text-black font-bold shadow-xs'
              : 'bg-[#121212] text-neutral-400 hover:text-white border border-[#262626]'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Outbound Delivery Audit Log ({auditLogs.length})</span>
        </button>
      </div>

      {/* Tab Body Rendering */}
      <div>
        {activeTab === 'feed' && (
          <NotificationFeedView
            notifications={notifications}
            onMarkAsRead={markAsRead}
            onMarkAsUnread={markAsUnread}
            onMarkAllAsRead={markAllAsRead}
            onDelete={deleteNotification}
            onClearAll={clearAll}
            onSelectNotification={(item) => setSelectedNotification(item)}
            onNavigateSection={(section) => setActiveSection(section as any)}
          />
        )}

        {activeTab === 'matrix' && (
          <ChannelMatrixView
            preferences={preferences}
            onTogglePreference={togglePreference}
          />
        )}

        {activeTab === 'channels' && (
          <ChannelSettingsView
            settings={contactSettings}
            onUpdateSettings={updateContactSettings}
            onTriggerTestDispatch={handleTestDispatch}
          />
        )}

        {activeTab === 'audit' && (
          <div className="p-6 rounded-2xl bg-[#0c0c0c] border border-[#222] space-y-4">
            <div className="flex items-center justify-between border-b border-[#1c1c1c] pb-3">
              <div>
                <h3 className="font-serif text-base font-bold text-white uppercase tracking-wider">
                  Outbound Multi-Channel Delivery Receipts
                </h3>
                <p className="text-xs text-neutral-400 font-sans mt-0.5">
                  Cryptographic transaction audit trail of dispatched alert payloads.
                </p>
              </div>
              <button
                onClick={clearAuditLogs}
                className="px-3 py-1.5 rounded-lg bg-[#181818] hover:bg-rose-950/40 border border-[#262626] hover:border-rose-800 text-neutral-400 hover:text-rose-300 font-mono text-xs transition-colors cursor-pointer"
              >
                Clear Log History
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-[#222] text-neutral-400 text-[10px] uppercase">
                    <th className="py-2.5 px-3">Event</th>
                    <th className="py-2.5 px-3">Channel</th>
                    <th className="py-2.5 px-3">Recipient Endpoint</th>
                    <th className="py-2.5 px-3">Delivery Status</th>
                    <th className="py-2.5 px-3 text-right">Latency</th>
                    <th className="py-2.5 px-3 text-right">Dispatched</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#181818]">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#141414] transition-colors">
                      <td className="py-3 px-3">
                        <span className="font-bold text-white uppercase text-[10px]">
                          {log.eventType}
                        </span>
                        <p className="text-[11px] text-neutral-400 truncate max-w-xs font-sans">
                          {log.summary}
                        </p>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-sm bg-[#181818] border border-[#2a2a2a] text-amber-300 text-[10px] uppercase">
                          {log.channel.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-neutral-300 truncate max-w-[200px]">
                        {log.recipient}
                      </td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span className="uppercase">{log.status}</span>
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right text-neutral-400">
                        {log.latencyMs}ms
                      </td>
                      <td className="py-3 px-3 text-right text-neutral-500">
                        {log.timestamp}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Inspect Notification Detail Modal */}
      <NotificationDetailModal
        notification={selectedNotification}
        onClose={() => setSelectedNotification(null)}
        onNavigateAction={(sec) => setActiveSection(sec as any)}
      />

      {/* Simulation Modal */}
      <NotificationSimulateModal
        isOpen={isSimulateModalOpen}
        onClose={() => setIsSimulateModalOpen(false)}
        onSimulate={handleSimulate}
      />
    </div>
  );
};
