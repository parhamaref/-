/**
 * @file DesignerSidebar.tsx
 * High-density, luxury-themed responsive sidebar navigation for the Designer Dashboard.
 */

import React from 'react';
import {
  LayoutDashboard,
  Sparkles,
  ShoppingBag,
  Sliders,
  Ruler,
  ClipboardList,
  Flame,
  Video,
  MessageSquare,
  Boxes,
  Truck,
  Star,
  LineChart,
  Wallet,
  FileText,
  Bell,
  Image as ImageIcon,
  Lock,
  Settings,
  Layers,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Scissors,
  FileCheck,
  ShieldCheck,
  RotateCcw,
  History,
  GitBranch,
} from 'lucide-react';
import { DesignerNavSection } from '../../types/designer.types';
import { useDesignerStore } from '../../stores/designerStore';
import { useNotificationStore } from '../../stores/notificationStore';

interface NavItem {
  id: DesignerNavSection;
  label: string;
  badge?: string | number;
  icon: React.ComponentType<{ className?: string }>;
  group: 'CORE' | 'CATALOG' | 'WORKSHOP' | 'SUPPLY' | 'INSIGHTS' | 'SYSTEM';
}

const NAV_ITEMS: NavItem[] = [
  // CORE
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, group: 'CORE' },
  { id: 'profile', label: 'Atelier Dossier', icon: Sparkles, group: 'CORE' },

  // CATALOG
  { id: 'products', label: 'Products & Silhouettes', icon: ShoppingBag, group: 'CATALOG' },
  { id: 'collections', label: 'Seasonal Collections', badge: 'New', icon: Sparkles, group: 'CATALOG' },
  { id: 'customization', label: 'Customization Matrix', icon: Sliders, group: 'CATALOG' },
  { id: 'measurements', label: 'Made-to-Measure Rules', icon: Ruler, group: 'CATALOG' },

  // WORKSHOP
  { id: 'orders', label: 'Bespoke Orders', badge: '3', icon: ClipboardList, group: 'WORKSHOP' },
  { id: 'approvals', label: 'Design Approvals', badge: 'Gate', icon: FileCheck, group: 'WORKSHOP' },
  { id: 'versioning', label: 'Version Control (VCS)', badge: 'Git', icon: GitBranch, group: 'WORKSHOP' },
  { id: 'wardrobe', label: 'Client Wardrobes & Care', badge: '1', icon: Layers, group: 'WORKSHOP' },
  { id: 'alterations', label: 'Alterations & Tailoring', badge: '6-Stage', icon: Scissors, group: 'WORKSHOP' },
  { id: 'production', label: 'Production Stages', icon: Flame, group: 'WORKSHOP' },
  { id: 'qc', label: 'Quality Control (QC)', badge: 'Gate', icon: ShieldCheck, group: 'WORKSHOP' },
  { id: 'rework', label: 'Rework Management', badge: '5-Step', icon: RotateCcw, group: 'WORKSHOP' },
  { id: 'videos', label: 'Production Video Proof', icon: Video, group: 'WORKSHOP' },
  { id: 'messages', label: 'Client Communications', badge: '1', icon: MessageSquare, group: 'WORKSHOP' },

  // SUPPLY
  { id: 'inventory', label: 'Fabrics & Yardage', badge: 'Low', icon: Boxes, group: 'SUPPLY' },
  { id: 'suppliers', label: 'Mill Suppliers', icon: Truck, group: 'SUPPLY' },

  // INSIGHTS
  { id: 'reviews', label: 'Verified Reviews', badge: '4.9★', icon: Star, group: 'INSIGHTS' },
  { id: 'analytics', label: 'Sales & Conversion', icon: LineChart, group: 'INSIGHTS' },
  { id: 'earnings', label: 'Earnings & Payouts', icon: Wallet, group: 'INSIGHTS' },

  // SYSTEM
  { id: 'application', label: 'Designer Verification', badge: 'Guild', icon: ShieldCheck, group: 'SYSTEM' },
  { id: 'audit', label: 'Audit Trail & Governance', badge: 'SOC 2', icon: History, group: 'SYSTEM' },
  { id: 'media', label: 'Media Asset Vault', icon: ImageIcon, group: 'SYSTEM' },
  { id: 'notifications', label: 'Notification Hub', badge: '2', icon: Bell, group: 'SYSTEM' },
  { id: 'security', label: 'Security & Access', icon: Lock, group: 'SYSTEM' },
  { id: 'settings', label: 'Atelier Settings', icon: Settings, group: 'SYSTEM' },
];

export const DesignerSidebar: React.FC<{ onNavigateHome?: () => void }> = ({ onNavigateHome }) => {
  const {
    activeSection,
    setActiveSection,
    isSidebarCollapsed,
    toggleSidebar,
    profile,
  } = useDesignerStore();
  const { unreadCount: notifUnreadCount } = useNotificationStore();

  const groups = ['CORE', 'CATALOG', 'WORKSHOP', 'SUPPLY', 'INSIGHTS', 'SYSTEM'] as const;

  return (
    <aside
      className={`hidden lg:flex flex-col bg-[#070707] border-r border-[#222] transition-all duration-300 z-30 select-none ${
        isSidebarCollapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Studio Header Brand Card */}
      <div className="p-4 border-b border-[#222] flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xs border border-white/20 bg-neutral-900 overflow-hidden shrink-0 flex items-center justify-center">
            {profile.logoUrl ? (
              <img src={profile.logoUrl} alt={profile.brandName} className="w-full h-full object-cover" />
            ) : (
              <span className="font-serif text-sm font-bold text-white">DM</span>
            )}
          </div>
          {!isSidebarCollapsed && (
            <div className="overflow-hidden">
              <span className="font-serif text-xs font-bold uppercase tracking-wider text-white block truncate">
                {profile.brandName}
              </span>
              <span className="font-mono text-[8px] text-emerald-400 uppercase tracking-widest block truncate">
                ● {profile.verificationStatus} ATELIER
              </span>
            </div>
          )}
        </div>

        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-xs border border-[#2B2B2B] text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isSidebarCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Navigation Groups List */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-5 font-mono text-[11px] scrollbar-thin scrollbar-thumb-neutral-800">
        {groups.map((grp) => {
          const items = NAV_ITEMS.filter((i) => i.group === grp);
          if (!items.length) return null;

          return (
            <div key={grp} className="space-y-1">
              {!isSidebarCollapsed && (
                <span className="px-3 text-[8.5px] uppercase tracking-widest text-neutral-500 font-bold block pb-1">
                  {grp}
                </span>
              )}
              {items.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    title={isSidebarCollapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xs transition-all text-left cursor-pointer group ${
                      isActive
                        ? 'bg-white text-black font-bold shadow-md shadow-black/40'
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-900/80 border border-transparent hover:border-neutral-800'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-105 ${isActive ? 'text-black' : 'text-neutral-400'}`} />
                    {!isSidebarCollapsed && (
                      <span className="truncate flex-1 tracking-wider text-[10.5px]">
                        {item.label}
                      </span>
                    )}
                    {!isSidebarCollapsed && (item.id === 'notifications' ? notifUnreadCount > 0 : Boolean(item.badge)) && (
                      <span
                        className={`text-[8px] font-bold px-1.5 py-0.2 rounded-xs tracking-widest uppercase ${
                          isActive
                            ? 'bg-black text-white'
                            : item.id === 'notifications'
                            ? 'bg-amber-400 text-black font-extrabold shadow-sm'
                            : item.badge === 'Low'
                            ? 'bg-rose-950/80 border border-rose-800 text-rose-300'
                            : 'bg-neutral-800 text-neutral-300'
                        }`}
                      >
                        {item.id === 'notifications' ? notifUnreadCount : item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Footer Return Action */}
      <div className="p-3 border-t border-[#222] bg-[#0A0A0A]">
        {onNavigateHome && (
          <button
            onClick={onNavigateHome}
            className={`w-full py-2 px-3 border border-[#2B2B2B] hover:border-neutral-500 rounded-xs text-neutral-400 hover:text-white text-[10px] font-mono uppercase tracking-widest flex items-center justify-center gap-2 transition-colors cursor-pointer ${
              isSidebarCollapsed ? 'px-0' : ''
            }`}
            title="Return to Public Storefront"
          >
            <ExternalLink className="w-3.5 h-3.5 shrink-0" />
            {!isSidebarCollapsed && <span>Client Storefront</span>}
          </button>
        )}
      </div>
    </aside>
  );
};
