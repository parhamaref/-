/**
 * @file NotificationDetailModal.tsx
 * Deep inspection modal for an atelier notification with multi-channel audit trail.
 */

import React from 'react';
import {
  X,
  Bell,
  Mail,
  Smartphone,
  Radio,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ExternalLink,
  ShieldCheck,
  Tag,
  AlertCircle,
  ShoppingBag,
  Star,
  MessageSquare,
  DollarSign,
  Boxes,
} from 'lucide-react';
import { AtelierNotificationItem } from '../../../types/notification.types';

interface NotificationDetailModalProps {
  notification: AtelierNotificationItem | null;
  onClose: () => void;
  onNavigateAction?: (section: string) => void;
}

export const NotificationDetailModal: React.FC<NotificationDetailModalProps> = ({
  notification,
  onClose,
  onNavigateAction,
}) => {
  if (!notification) return null;

  const getChannelIcon = (ch: string) => {
    switch (ch) {
      case 'in_app':
        return <Bell className="w-4 h-4 text-amber-400" />;
      case 'email':
        return <Mail className="w-4 h-4 text-sky-400" />;
      case 'sms':
        return <Smartphone className="w-4 h-4 text-emerald-400" />;
      case 'push':
        return <Radio className="w-4 h-4 text-purple-400" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <ShoppingBag className="w-5 h-5 text-amber-400" />;
      case 'review':
        return <Star className="w-5 h-5 text-amber-300" />;
      case 'message':
        return <MessageSquare className="w-5 h-5 text-sky-400" />;
      case 'payout':
        return <DollarSign className="w-5 h-5 text-emerald-400" />;
      case 'inventory':
        return <Boxes className="w-5 h-5 text-rose-400" />;
      default:
        return <Bell className="w-5 h-5 text-white" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#0c0c0c] border border-[#2b2b2b] rounded-2xl shadow-2xl overflow-hidden text-left">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#222] bg-[#111]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-black border border-[#2b2b2b]">
              {getEventIcon(notification.eventType)}
            </div>
            <div>
              <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block">
                {notification.eventType.toUpperCase()} ALERT · PRIORITY: {notification.priority.toUpperCase()}
              </span>
              <h3 className="font-serif text-base font-bold text-white truncate max-w-md">
                {notification.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Main Message */}
          <div className="p-4 rounded-xl bg-[#141414] border border-[#222] space-y-2">
            <span className="text-[10px] font-mono text-neutral-500 uppercase block">
              Event Details
            </span>
            <p className="text-sm text-neutral-200 font-sans leading-relaxed">
              {notification.message}
            </p>
            <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-500 pt-2 border-t border-[#1c1c1c]">
              <Clock className="w-3.5 h-3.5" />
              <span>Created: {new Date(notification.createdAt).toLocaleString()}</span>
            </div>
          </div>

          {/* Contextual Metadata if present */}
          {notification.metadata && Object.keys(notification.metadata).length > 0 && (
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">
                Contextual Identifiers
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
                {notification.metadata.orderId && (
                  <div className="p-3 rounded-lg bg-[#141414] border border-[#222]">
                    <span className="text-neutral-500 text-[10px] block">Order ID</span>
                    <span className="text-white font-bold">{notification.metadata.orderId}</span>
                  </div>
                )}
                {notification.metadata.clientName && (
                  <div className="p-3 rounded-lg bg-[#141414] border border-[#222]">
                    <span className="text-neutral-500 text-[10px] block">Client</span>
                    <span className="text-amber-300 font-bold">{notification.metadata.clientName}</span>
                  </div>
                )}
                {notification.metadata.amount && (
                  <div className="p-3 rounded-lg bg-[#141414] border border-[#222]">
                    <span className="text-neutral-500 text-[10px] block">Value</span>
                    <span className="text-emerald-400 font-bold">
                      £{notification.metadata.amount.toLocaleString()}
                    </span>
                  </div>
                )}
                {notification.metadata.rating && (
                  <div className="p-3 rounded-lg bg-[#141414] border border-[#222]">
                    <span className="text-neutral-500 text-[10px] block">Score</span>
                    <span className="text-amber-400 font-bold">
                      {notification.metadata.rating.toFixed(1)} ★
                    </span>
                  </div>
                )}
                {notification.metadata.fabricId && (
                  <div className="p-3 rounded-lg bg-[#141414] border border-[#222]">
                    <span className="text-neutral-500 text-[10px] block">Fabric Bolt</span>
                    <span className="text-rose-400 font-bold">{notification.metadata.fabricId}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Multi-Channel Delivery Audit Ledger */}
          <div className="space-y-3">
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">
              Multi-Channel Dispatch Receipts
            </span>

            <div className="divide-y divide-[#1c1c1c] rounded-xl bg-[#141414] border border-[#222] overflow-hidden">
              {notification.channels.map((ch) => (
                <div key={ch.channel} className="p-3.5 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-black border border-[#262626]">
                      {getChannelIcon(ch.channel)}
                    </div>
                    <div>
                      <span className="font-bold text-white uppercase block">
                        {ch.channel.replace('_', ' ')}
                      </span>
                      {ch.recipientAddress && (
                        <span className="text-[10px] text-neutral-400 font-mono block">
                          Recipient: {ch.recipientAddress}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    {ch.enabled ? (
                      <span className="inline-flex items-center gap-1 text-emerald-400 text-[11px] font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span className="uppercase">{ch.status}</span>
                      </span>
                    ) : (
                      <span className="text-neutral-500 text-[11px] uppercase">
                        Disabled (Skipped)
                      </span>
                    )}
                    {ch.dispatchedAt && (
                      <span className="text-[9px] text-neutral-500 block">
                        {ch.dispatchedAt}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#222] bg-[#111]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-neutral-400 hover:text-white font-mono text-xs cursor-pointer"
          >
            Close
          </button>

          {notification.actionUrl && onNavigateAction && (
            <button
              onClick={() => {
                onNavigateAction(notification.actionUrl!);
                onClose();
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs font-mono uppercase tracking-wider transition-colors shadow-lg shadow-amber-500/10 cursor-pointer"
            >
              <span>{notification.actionLabel || 'Go to Section'}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
