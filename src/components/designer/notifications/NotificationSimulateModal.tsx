/**
 * @file NotificationSimulateModal.tsx
 * Interactive Event Dispatcher & Simulator Modal for Daniel’s Maison.
 * Allows triggering real-time simulations of New Orders, Reviews, Messages,
 * Payout Status, and Inventory Alerts across In-App, Email, SMS, and Push channels.
 */

import React, { useState } from 'react';
import {
  X,
  Zap,
  ShoppingBag,
  Star,
  MessageSquare,
  DollarSign,
  Boxes,
  Send,
  Sparkles,
  CheckCircle2,
  Radio,
} from 'lucide-react';
import { NotificationEventType, NotificationPriority } from '../../../types/notification.types';

interface NotificationSimulateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSimulate: (eventType: NotificationEventType, options?: any) => void;
}

export const NotificationSimulateModal: React.FC<NotificationSimulateModalProps> = ({
  isOpen,
  onClose,
  onSimulate,
}) => {
  const [selectedEvent, setSelectedEvent] = useState<NotificationEventType>('order');
  const [priority, setPriority] = useState<NotificationPriority>('urgent');
  const [customTitle, setCustomTitle] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [dispatchedSuccess, setDispatchedSuccess] = useState(false);

  if (!isOpen) return null;

  const eventTemplates = [
    {
      type: 'order' as const,
      label: 'New Bespoke Commission',
      icon: ShoppingBag,
      defaultTitle: 'New Bespoke Commission: #DM-2026-9520',
      defaultMessage: 'Private client in Zurich commissioned a double-breasted Tuxedo in Loro Piana Tasmanian Super 170s wool. 3D baste fitting requested.',
      defaultPriority: 'urgent' as const,
    },
    {
      type: 'review' as const,
      label: 'Client 5.0 ★ Video Review',
      icon: Star,
      defaultTitle: '5.0 ★ Client Video Review Uploaded',
      defaultMessage: 'Lord Alistair published an authenticated 4K unboxing and shoulder fitting review for the Metamorphic Drape Overcoat.',
      defaultPriority: 'normal' as const,
    },
    {
      type: 'message' as const,
      label: 'Urgent Salon Direct Message',
      icon: MessageSquare,
      defaultTitle: 'Urgent Client Salon Fitting Inquiry',
      defaultMessage: 'Patron requested a rush consultation regarding peak lapel width and bespoke monogramming before Friday runway dinner.',
      defaultPriority: 'urgent' as const,
    },
    {
      type: 'payout' as const,
      label: 'Stripe Payout Cleared (£7,850.00)',
      icon: DollarSign,
      defaultTitle: 'Stripe Balance Payout Cleared (£7,850.00)',
      defaultMessage: 'Weekly cleared marketplace payout of £7,850.00 successfully initiated to your Barclays UK business account.',
      defaultPriority: 'normal' as const,
    },
    {
      type: 'inventory' as const,
      label: 'Critical Fabric Deficit Alert',
      icon: Boxes,
      defaultTitle: 'Critical Deficit: Scabal Midnight Navy Bolt',
      defaultMessage: 'Remaining bolt balance at 3.8 meters (Threshold: 10.0m). Impacting 2 pending suiting cutting work orders.',
      defaultPriority: 'critical' as const,
    },
  ];

  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    const tmpl = eventTemplates.find((t) => t.type === selectedEvent);
    const title = customTitle || tmpl?.defaultTitle;
    const message = customMessage || tmpl?.defaultMessage;

    onSimulate(selectedEvent, {
      title,
      message,
      priority,
    });

    setDispatchedSuccess(true);
    setTimeout(() => {
      setDispatchedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
      <div className="relative w-full max-w-xl bg-[#0c0c0c] border border-[#2b2b2b] rounded-2xl shadow-2xl overflow-hidden text-left">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#222] bg-[#111]">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <span className="font-serif text-sm font-bold uppercase tracking-wider text-white">
              Event Dispatcher & Multi-Channel Simulator
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleDispatch} className="p-6 space-y-5">
          <p className="text-xs text-neutral-400 font-sans">
            Simulate an incoming operational event to test your real-time In-App, Email, SMS, and Push routing.
          </p>

          {/* Event Type Grid */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">
              Select Event Trigger
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {eventTemplates.map((t) => {
                const Icon = t.icon;
                const isSelected = selectedEvent === t.type;
                return (
                  <button
                    type="button"
                    key={t.type}
                    onClick={() => {
                      setSelectedEvent(t.type);
                      setPriority(t.defaultPriority);
                      setCustomTitle('');
                      setCustomMessage('');
                    }}
                    className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-400 text-white shadow-xs'
                        : 'bg-[#141414] border-[#262626] text-neutral-400 hover:text-white hover:border-[#333]'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        isSelected ? 'bg-amber-400 text-black' : 'bg-[#1c1c1c] text-neutral-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-serif text-xs font-bold block">{t.label}</span>
                      <span className="text-[9px] font-mono text-neutral-500 uppercase">
                        {t.type} event
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Priority selector */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">
              Event Priority
            </label>
            <div className="flex gap-2">
              {(['low', 'normal', 'urgent', 'critical'] as NotificationPriority[]).map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer ${
                    priority === p
                      ? p === 'critical'
                        ? 'bg-rose-500 text-white font-bold'
                        : p === 'urgent'
                        ? 'bg-amber-400 text-black font-bold'
                        : 'bg-white text-black font-bold'
                      : 'bg-[#141414] border border-[#262626] text-neutral-400 hover:text-white'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Optional Title Override */}
          <div className="space-y-1 font-mono text-xs">
            <label className="text-neutral-400 block text-[10px] uppercase">
              Custom Title (Optional)
            </label>
            <input
              type="text"
              placeholder={eventTemplates.find((t) => t.type === selectedEvent)?.defaultTitle}
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              className="w-full bg-[#141414] border border-[#262626] rounded-xl px-3.5 py-2 text-white focus:outline-hidden focus:border-amber-400 font-mono text-xs"
            />
          </div>

          {/* Optional Message Override */}
          <div className="space-y-1 font-mono text-xs">
            <label className="text-neutral-400 block text-[10px] uppercase">
              Custom Message (Optional)
            </label>
            <textarea
              rows={2}
              placeholder={eventTemplates.find((t) => t.type === selectedEvent)?.defaultMessage}
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="w-full bg-[#141414] border border-[#262626] rounded-xl px-3.5 py-2 text-white focus:outline-hidden focus:border-amber-400 font-mono text-xs"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-between border-t border-[#222]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-neutral-400 hover:text-white font-mono text-xs cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={dispatchedSuccess}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:bg-emerald-500 text-black font-bold text-xs font-mono uppercase tracking-wider transition-colors shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              {dispatchedSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Dispatched Across Channels!</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Trigger Multi-Channel Event</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
