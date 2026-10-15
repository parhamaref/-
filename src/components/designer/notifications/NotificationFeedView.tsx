/**
 * @file NotificationFeedView.tsx
 * Live Atelier Notification Feed with multi-filter streams, bulk actions,
 * channel status badges, and deep inspection hooks for Daniel’s Maison.
 */

import React, { useState } from 'react';
import {
  Search,
  Filter,
  CheckCircle2,
  Trash2,
  Bell,
  Mail,
  Smartphone,
  Radio,
  ShoppingBag,
  Star,
  MessageSquare,
  DollarSign,
  Boxes,
  ArrowUpRight,
  Eye,
  EyeOff,
  Clock,
  Sparkles,
} from 'lucide-react';
import {
  AtelierNotificationItem,
  NotificationEventType,
  NotificationChannel,
} from '../../../types/notification.types';

interface NotificationFeedViewProps {
  notifications: AtelierNotificationItem[];
  onMarkAsRead: (id: string) => void;
  onMarkAsUnread: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
  onSelectNotification: (item: AtelierNotificationItem) => void;
  onNavigateSection: (section: string) => void;
}

export const NotificationFeedView: React.FC<NotificationFeedViewProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAsUnread,
  onMarkAllAsRead,
  onDelete,
  onClearAll,
  onSelectNotification,
  onNavigateSection,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [readFilter, setReadFilter] = useState<'all' | 'unread'>('all');
  const [eventFilter, setEventFilter] = useState<string>('ALL');
  const [channelFilter, setChannelFilter] = useState<string>('ALL');

  // Filter logic
  const filtered = notifications.filter((item) => {
    // Read filter
    if (readFilter === 'unread' && item.read) return false;

    // Event filter
    if (eventFilter !== 'ALL' && item.eventType !== eventFilter) return false;

    // Channel filter
    if (channelFilter !== 'ALL') {
      const hasChannel = item.channels.some(
        (c) => c.channel === channelFilter && c.enabled
      );
      if (!hasChannel) return false;
    }

    // Search query
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchMsg = item.message.toLowerCase().includes(q);
      const matchOrder = item.metadata?.orderId?.toLowerCase().includes(q);
      const matchClient = item.metadata?.clientName?.toLowerCase().includes(q);
      return matchTitle || matchMsg || Boolean(matchOrder) || Boolean(matchClient);
    }

    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

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
      default:
        return <Bell className="w-4 h-4 text-white" />;
    }
  };

  const getChannelIcon = (ch: NotificationChannel) => {
    switch (ch) {
      case 'in_app':
        return (
          <span title="In-App Feed">
            <Bell className="w-3 h-3 text-amber-400" />
          </span>
        );
      case 'email':
        return (
          <span title="Email Dispatched">
            <Mail className="w-3 h-3 text-sky-400" />
          </span>
        );
      case 'sms':
        return (
          <span title="SMS Sent">
            <Smartphone className="w-3 h-3 text-emerald-400" />
          </span>
        );
      case 'push':
        return (
          <span title="Web Push Sent">
            <Radio className="w-3 h-3 text-purple-400" />
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Controls & Search Toolbar */}
      <div className="p-5 rounded-2xl bg-[#0c0c0c] border border-[#222] space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search notifications by order, client, textile..."
              className="w-full bg-[#141414] border border-[#262626] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:border-amber-400 font-mono"
            />
          </div>

          {/* Bulk Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllAsRead}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141414] hover:bg-[#202020] border border-[#2a2a2a] text-neutral-300 font-mono text-xs transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Mark All Read</span>
            </button>
            <button
              onClick={onClearAll}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141414] hover:bg-rose-950/40 border border-[#2a2a2a] hover:border-rose-800 text-neutral-400 hover:text-rose-300 font-mono text-xs transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Feed</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#1c1c1c]">
          {/* Read vs Unread Filter */}
          <div className="flex items-center gap-1 p-1 bg-[#141414] border border-[#262626] rounded-xl font-mono text-xs">
            <button
              onClick={() => setReadFilter('all')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                readFilter === 'all'
                  ? 'bg-white text-black font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setReadFilter('unread')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                readFilter === 'unread'
                  ? 'bg-amber-400 text-black font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <span>Unread</span>
              {unreadCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] flex items-center justify-center font-bold">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          {/* Event Category Filter */}
          <div className="flex flex-wrap items-center gap-1 p-1 bg-[#141414] border border-[#262626] rounded-xl font-mono text-xs">
            {[
              { id: 'ALL', label: 'All Events' },
              { id: 'order', label: 'Orders' },
              { id: 'review', label: 'Reviews' },
              { id: 'message', label: 'Messages' },
              { id: 'payout', label: 'Payouts' },
              { id: 'inventory', label: 'Inventory' },
            ].map((ev) => (
              <button
                key={ev.id}
                onClick={() => setEventFilter(ev.id)}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  eventFilter === ev.id
                    ? 'bg-amber-400 text-black font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {ev.label}
              </button>
            ))}
          </div>

          {/* Channel Filter */}
          <div className="flex items-center gap-1 p-1 bg-[#141414] border border-[#262626] rounded-xl font-mono text-xs">
            {[
              { id: 'ALL', label: 'All Channels' },
              { id: 'in_app', label: 'In-App' },
              { id: 'email', label: 'Email' },
              { id: 'sms', label: 'SMS' },
              { id: 'push', label: 'Push' },
            ].map((ch) => (
              <button
                key={ch.id}
                onClick={() => setChannelFilter(ch.id)}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  channelFilter === ch.id
                    ? 'bg-neutral-200 text-black font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {ch.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Feed List Items */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-neutral-500 bg-[#0c0c0c] border border-[#222] rounded-2xl font-mono text-xs space-y-2">
            <Bell className="w-8 h-8 text-neutral-600 mx-auto" />
            <p className="text-white font-serif text-sm font-semibold">No Notifications Found</p>
            <p className="text-neutral-500">
              No alerts match the active filter. Use the Simulator to test live incoming events.
            </p>
          </div>
        ) : (
          filtered.map((item) => {
            const isUnread = !item.read;

            return (
              <div
                key={item.id}
                className={`p-5 rounded-2xl border transition-all duration-200 text-left relative overflow-hidden group ${
                  isUnread
                    ? 'bg-[#121212] border-amber-500/40 shadow-sm'
                    : 'bg-[#0c0c0c] border-[#222] hover:border-[#333]'
                }`}
              >
                {/* Unread Accent Edge Indicator */}
                {isUnread && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400" />
                )}

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  {/* Left Column: Icon + Content */}
                  <div
                    onClick={() => onSelectNotification(item)}
                    className="flex items-start gap-4 flex-1 cursor-pointer"
                  >
                    <div className="p-2.5 rounded-xl bg-[#181818] border border-[#2a2a2a] shrink-0 mt-0.5">
                      {getEventIcon(item.eventType)}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-serif text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                          {item.title}
                        </span>

                        {/* Priority indicator */}
                        <div className="flex items-center gap-1.5 text-[10px] font-mono">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              item.priority === 'critical'
                                ? 'bg-rose-500 animate-pulse'
                                : item.priority === 'urgent'
                                ? 'bg-amber-400'
                                : 'bg-emerald-400'
                            }`}
                          />
                          <span className="uppercase text-neutral-400">
                            {item.priority}
                          </span>
                        </div>

                        <span className="text-neutral-600 text-xs hidden sm:inline">·</span>

                        {/* Relative time */}
                        <span className="text-[10px] font-mono text-neutral-500">
                          {new Date(item.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>

                      <p className="text-xs text-neutral-300 font-sans leading-relaxed max-w-3xl">
                        {item.message}
                      </p>

                      {/* Dispatched Channels Delivery Badge Icons */}
                      <div className="flex items-center gap-3 pt-2 text-[10px] font-mono text-neutral-500">
                        <span>Dispatched to:</span>
                        <div className="flex items-center gap-2">
                          {item.channels
                            .filter((c) => c.enabled)
                            .map((ch) => (
                              <div
                                key={ch.channel}
                                className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#181818] border border-[#262626] text-neutral-300"
                              >
                                {getChannelIcon(ch.channel)}
                                <span className="capitalize">{ch.channel.replace('_', ' ')}</span>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center font-mono text-xs">
                    {/* Deep link button if actionUrl is present */}
                    {item.actionUrl && (
                      <button
                        onClick={() => onNavigateSection(item.actionUrl!)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-semibold transition-colors cursor-pointer"
                      >
                        <span>{item.actionLabel || 'Inspect'}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Toggle Read */}
                    <button
                      onClick={() =>
                        item.read ? onMarkAsUnread(item.id) : onMarkAsRead(item.id)
                      }
                      className="p-2 rounded-lg bg-[#141414] hover:bg-[#202020] border border-[#282828] text-neutral-400 hover:text-white transition-colors cursor-pointer"
                      title={item.read ? 'Mark as Unread' : 'Mark as Read'}
                    >
                      {item.read ? (
                        <EyeOff className="w-3.5 h-3.5" />
                      ) : (
                        <Eye className="w-3.5 h-3.5 text-amber-400" />
                      )}
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => onDelete(item.id)}
                      className="p-2 rounded-lg bg-[#141414] hover:bg-rose-950/40 border border-[#282828] hover:border-rose-800 text-neutral-500 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Delete Notification"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
