/**
 * @file DesignerHeader.tsx
 * Top status header with live atelier indicator, notifications popover, currency & mobile drawer trigger.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Bell,
  Search,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  X,
  SlidersHorizontal,
} from 'lucide-react';
import { useDesignerStore } from '../../stores/designerStore';
import { useAuth } from '../../contexts/AuthContext';
import { useNotificationStore } from '../../stores/notificationStore';

export const DesignerHeader: React.FC<{ onNavigateHome?: () => void }> = ({ onNavigateHome }) => {
  const {
    profile,
    unreadCount,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setMobileSidebarOpen,
    setActiveSection,
    activeSection,
  } = useDesignerStore();

  const { currentRole, currentUser } = useAuth();
  const {
    notifications: liveNotifications,
    unreadCount: liveUnreadCount,
    markAsRead: liveMarkAsRead,
    markAllAsRead: liveMarkAllAsRead,
  } = useNotificationStore();
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close notifications on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 bg-[#090909] border-b border-[#222] px-4 sm:px-6 flex items-center justify-between z-20 shrink-0">
      {/* Left: Mobile Menu Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="lg:hidden p-2 rounded-xs border border-[#2B2B2B] text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          aria-label="Open navigation drawer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest hidden sm:inline">
            ATELIER DASHBOARD /
          </span>
          <span className="font-serif text-sm sm:text-base font-bold uppercase tracking-wider text-white truncate max-w-[200px] sm:max-w-none">
            {activeSection.replace('-', ' ')}
          </span>
        </div>
      </div>

      {/* Right: Atelier Metrics, Notifications & Profile Badge */}
      <div className="flex items-center gap-2 sm:gap-4 font-mono">
        {/* Live Studio Status Pill */}
        <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-[9px] tracking-wider uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>STUDIO CRAFTING LIVE</span>
        </div>

        {/* Storefront Link (desktop) */}
        {onNavigateHome && (
          <button
            onClick={onNavigateHome}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xs border border-[#2B2B2B] text-neutral-400 hover:text-white hover:border-neutral-500 text-[10px] uppercase tracking-wider transition-colors cursor-pointer"
          >
            <span>CLIENT SALON</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        )}

        {/* Notifications Dropdown Area */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="p-2 rounded-xs border border-[#2B2B2B] text-neutral-300 hover:text-white hover:border-neutral-500 transition-colors relative cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {liveUnreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-black text-[9px] font-bold flex items-center justify-center">
                {liveUnreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#0E0E0E] border border-[#2B2B2B] rounded-sm shadow-2xl p-4 space-y-3 z-50 text-left animate-fadeIn">
              <div className="flex items-center justify-between border-b border-[#222] pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="font-serif text-xs font-bold uppercase tracking-wider text-white">
                    Atelier Alerts
                  </span>
                  {liveUnreadCount > 0 && (
                    <span className="text-[8px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 rounded-xs">
                      {liveUnreadCount} Unread
                    </span>
                  )}
                </div>
                {liveUnreadCount > 0 && (
                  <button
                    onClick={() => liveMarkAllAsRead()}
                    className="text-[8.5px] text-neutral-400 hover:text-white uppercase tracking-wider cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {liveNotifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      liveMarkAsRead(n.id);
                      if (n.eventType === 'order') setActiveSection('orders');
                      if (n.eventType === 'inventory') setActiveSection('inventory');
                      if (n.eventType === 'review') setActiveSection('reviews');
                      if (n.eventType === 'message') setActiveSection('messages');
                      if (n.eventType === 'payout') setActiveSection('earnings');
                    }}
                    className={`p-2.5 rounded-xs border text-left cursor-pointer transition-all ${
                      n.read
                        ? 'bg-black/30 border-[#222] opacity-75'
                        : 'bg-neutral-900/60 border-neutral-700 text-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-bold text-white block">{n.title}</span>
                      <span className="text-[8px] text-neutral-500 shrink-0">
                        {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-[9px] text-neutral-400 font-sans mt-0.5 line-clamp-2">
                      {n.message}
                    </p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  setNotifOpen(false);
                  setActiveSection('notifications');
                }}
                className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white text-[9.5px] uppercase tracking-widest text-center border border-[#2B2B2B] rounded-xs transition-colors cursor-pointer"
              >
                View Full Alert Log →
              </button>
            </div>
          )}
        </div>

        {/* User Persona & Role Badge */}
        <button
          onClick={() => setActiveSection('profile')}
          className="flex items-center gap-2.5 pl-2 border-l border-[#222] hover:opacity-80 transition-opacity cursor-pointer text-left"
          title="View Atelier Profile"
        >
          <div className="w-8 h-8 rounded-full border border-amber-500/40 bg-neutral-800 overflow-hidden shrink-0">
            <img src={profile.avatarUrl} alt={profile.designerName} className="w-full h-full object-cover" />
          </div>
          <div className="hidden xl:block text-left">
            <span className="text-[10px] font-bold text-white block leading-tight truncate max-w-[120px]">
              {profile.designerName}
            </span>
            <span className="text-[8px] text-amber-400 uppercase tracking-widest block leading-tight flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              {profile.brandName}
            </span>
          </div>
        </button>
      </div>
    </header>
  );
};
