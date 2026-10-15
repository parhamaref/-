/**
 * @file DesignerMobileDrawer.tsx
 * Full-screen mobile navigation drawer optimized for smartphones and tablets (touch-friendly targets 48px+).
 */

import React from 'react';
import {
  X,
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
  ExternalLink,
} from 'lucide-react';
import { DesignerNavSection } from '../../types/designer.types';
import { useDesignerStore } from '../../stores/designerStore';

const MOBILE_NAV_LINKS: { id: DesignerNavSection; label: string; icon: any; count?: string }[] = [
  { id: 'overview', label: '01 // OVERVIEW DASHBOARD', icon: LayoutDashboard },
  { id: 'profile', label: '02 // ATELIER PROFILE & DOSSIER', icon: Sparkles },
  { id: 'products', label: '03 // PRODUCTS & SILHOUETTES', icon: ShoppingBag },
  { id: 'customization', label: '04 // CUSTOMIZATION MATRIX', icon: Sliders },
  { id: 'measurements', label: '05 // MADE-TO-MEASURE RULES', icon: Ruler },
  { id: 'orders', label: '06 // BESPOKE ORDERS', icon: ClipboardList, count: '3' },
  { id: 'production', label: '07 // PRODUCTION STAGES', icon: Flame },
  { id: 'videos', label: '08 // PRODUCTION VIDEO PROOF', icon: Video },
  { id: 'messages', label: '09 // CLIENT CHAT', icon: MessageSquare, count: '1' },
  { id: 'inventory', label: '10 // FABRIC & RAW MATERIALS', icon: Boxes, count: 'Low' },
  { id: 'suppliers', label: '11 // MILL SUPPLIERS', icon: Truck },
  { id: 'reviews', label: '12 // VERIFIED REVIEWS', icon: Star },
  { id: 'analytics', label: '13 // PERFORMANCE ANALYTICS', icon: LineChart },
  { id: 'earnings', label: '14 // EARNINGS & PAYOUTS', icon: Wallet },
  { id: 'application', label: '15 // DESIGNER VERIFICATION', icon: FileText, count: 'Guild' },
  { id: 'media', label: '16 // MEDIA ASSET VAULT', icon: ImageIcon },
  { id: 'notifications', label: '17 // NOTIFICATION CENTER', icon: Bell, count: '2' },
  { id: 'security', label: '18 // SECURITY & 2FA', icon: Lock },
  { id: 'settings', label: '19 // ATELIER SETTINGS', icon: Settings },
];

export const DesignerMobileDrawer: React.FC<{ onNavigateHome?: () => void }> = ({ onNavigateHome }) => {
  const {
    isMobileSidebarOpen,
    setMobileSidebarOpen,
    activeSection,
    setActiveSection,
    profile,
  } = useDesignerStore();

  if (!isMobileSidebarOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex flex-col bg-[#070707]/98 backdrop-blur-xl animate-fadeIn font-mono">
      {/* Top Header */}
      <div className="h-16 px-4 border-b border-[#222] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xs border border-white/20 bg-neutral-900 overflow-hidden">
            <img src={profile.logoUrl} alt={profile.brandName} className="w-full h-full object-cover" />
          </div>
          <div>
            <span className="font-serif text-xs font-bold uppercase tracking-wider text-white block">
              {profile.brandName}
            </span>
            <span className="text-[8px] text-emerald-400 uppercase tracking-widest block">
              ● ATELIER PORTAL
            </span>
          </div>
        </div>

        <button
          onClick={() => setMobileSidebarOpen(false)}
          className="w-10 h-10 flex items-center justify-center border border-[#2B2B2B] rounded-xs text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          aria-label="Close navigation"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation List (Touch Targets min 48px) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {MOBILE_NAV_LINKS.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full min-h-[48px] px-4 py-3 rounded-xs border text-left flex items-center justify-between transition-colors cursor-pointer ${
                isActive
                  ? 'bg-white text-black font-bold border-white'
                  : 'bg-black/40 border-[#222] text-neutral-300 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-neutral-400'}`} />
                <span className="text-[10.5px] uppercase tracking-wider">{item.label}</span>
              </div>
              {item.count && (
                <span
                  className={`text-[8px] font-bold px-2 py-0.5 rounded-xs tracking-widest uppercase ${
                    isActive
                      ? 'bg-black text-white'
                      : 'bg-neutral-800 text-neutral-300 border border-neutral-700'
                  }`}
                >
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Return to Public Shop */}
      {onNavigateHome && (
        <div className="p-4 border-t border-[#222] bg-[#0A0A0A]">
          <button
            onClick={() => {
              setMobileSidebarOpen(false);
              onNavigateHome();
            }}
            className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 border border-[#2B2B2B] text-white text-[11px] uppercase tracking-widest font-bold rounded-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Return to Public Client Storefront</span>
          </button>
        </div>
      )}
    </div>
  );
};
