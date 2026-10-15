import React, { useState } from 'react';
import { ShoppingBag, Star, Menu, X, ShieldAlert, Cpu, Sparkles, ChevronRight, Globe, Layers } from 'lucide-react';
import InteractiveLogo from './InteractiveLogo';
import { Currency } from '../types';
import { CURRENCIES } from '../data/translations';
import { useAuth } from '../contexts/AuthContext';

interface NavigationProps {
  activeSection: string;
  setActiveSection: (sec: string) => void;
  lang?: 'en';
  setLang?: (l: 'en') => void;
  currency?: Currency;
  setCurrency?: (curr: Currency) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  langDict: any;
}

export default function Navigation({
  activeSection,
  setActiveSection,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
}: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentRole, currentUser } = useAuth();

  const handleNavSelect = (sec: string) => {
    setActiveSection(sec);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCollectionsScroll = () => {
    setActiveSection('home');
    setMobileMenuOpen(false);
    setTimeout(() => {
      const el = document.getElementById('section-curated-specimens');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  return (
    <nav 
      id="main-navigation-bar"
      className={`${activeSection === 'home' ? 'absolute bg-transparent' : 'sticky bg-[#050505]/95 border-b border-[#2B2B2B] backdrop-blur-md'} top-0 left-0 w-full z-40 transition-all duration-300`}
    >
      {/* Main Bar Container - Responsive for mobile, tablet, laptop, AIO & 4K */}
      <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-3 sm:px-6 md:px-8 xl:px-12">
        <div className="flex items-center justify-between h-20 sm:h-24">
          
          {/* BRAND LOGO: SYMBOL + TYPOGRAPHY */}
          <button
            onClick={() => handleNavSelect('home')}
            className="flex items-center gap-2.5 sm:gap-3 group text-left cursor-pointer shrink-0"
          >
            {/* The brand icon symbol */}
            <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center border border-white/10 rounded-sm bg-black/45 group-hover:border-white/30 transition-colors duration-300">
              <InteractiveLogo size={28} animated={false} />
            </div>
            {/* The brand font/text name */}
            <div className="flex flex-col">
              <span className="font-serif text-[15px] sm:text-[18px] xl:text-[19px] tracking-[0.16em] sm:tracking-[0.22em] text-[#F3F3F3] group-hover:text-white transition-colors duration-300 font-bold leading-none">
                DANIEL’S MAISON
              </span>
              <span className="font-mono text-[5.5px] sm:text-[6.5px] tracking-[0.16em] sm:tracking-[0.2em] text-neutral-400 group-hover:text-neutral-300 transition-colors duration-300 uppercase leading-none mt-1">
                GARMENTS FROM THE ORIGIN OF CIVILIZATION
              </span>
            </div>
          </button>

          {/* DESKTOP NAVIGATION LINKS (Laptops, All-in-Ones, Desktop Monitors) */}
          <div className="hidden xl:flex items-center space-x-3.5 2xl:space-x-7">
            <button
              onClick={() => handleNavSelect('home')}
              className={`text-[10.5px] 2xl:text-[11.5px] font-sans tracking-[0.22em] uppercase transition-all duration-300 cursor-pointer ${
                activeSection === 'home' 
                  ? 'text-white font-bold drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]' 
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              HOME
            </button>
            <button
              onClick={() => handleNavSelect('archive')}
              className={`text-[10.5px] 2xl:text-[11.5px] font-sans tracking-[0.22em] uppercase transition-all duration-300 cursor-pointer ${
                activeSection === 'archive' 
                  ? 'text-white font-bold drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]' 
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              ARCHIVE
            </button>
            <button
              onClick={() => handleNavSelect('collections')}
              className={`text-[10.5px] 2xl:text-[11.5px] font-sans tracking-[0.22em] uppercase transition-all duration-300 cursor-pointer ${
                activeSection === 'collections'
                  ? 'text-white font-bold drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              COLLECTIONS
            </button>
            <button
              onClick={() => handleNavSelect('manifesto')}
              className={`text-[10.5px] 2xl:text-[11.5px] font-sans tracking-[0.22em] uppercase transition-all duration-300 cursor-pointer ${
                activeSection === 'manifesto' 
                  ? 'text-white font-bold drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]' 
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              ABOUT US
            </button>
            <button
              onClick={() => handleNavSelect('chronicles')}
              className={`text-[10.5px] 2xl:text-[11.5px] font-sans tracking-[0.22em] uppercase transition-all duration-300 cursor-pointer ${
                activeSection === 'chronicles' 
                  ? 'text-white font-bold drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]' 
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              JOURNAL
            </button>
            <button
              onClick={() => handleNavSelect('portal')}
              className={`text-[10.5px] 2xl:text-[11.5px] font-sans tracking-[0.22em] uppercase transition-all duration-300 cursor-pointer ${
                activeSection === 'portal' || activeSection === 'wardrobe'
                  ? 'text-white font-bold drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]' 
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              WARDROBE & SALON
            </button>
            {['Partner', 'Super Admin', 'Management', 'Production', 'QC'].includes(currentRole) && (
              <button
                onClick={() => handleNavSelect('workshop')}
                className={`text-[10.5px] 2xl:text-[11.5px] font-sans tracking-[0.22em] uppercase transition-all duration-300 cursor-pointer ${
                  activeSection === 'workshop' 
                    ? 'text-emerald-400 font-bold drop-shadow-[0_0_12px_rgba(52,211,153,0.4)]' 
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                ATELIER WORKSHOP
              </button>
            )}
            {['Designer', 'Partner', 'Super Admin', 'Management'].includes(currentRole) && (
              <button
                id="nav-designer-dashboard"
                onClick={() => handleNavSelect('designer')}
                className={`text-[10.5px] 2xl:text-[11.5px] font-sans tracking-[0.22em] uppercase transition-all duration-300 cursor-pointer ${
                  activeSection === 'designer' 
                    ? 'text-amber-400 font-bold drop-shadow-[0_0_12px_rgba(251,191,36,0.4)]' 
                    : 'text-neutral-400 hover:text-amber-300'
                }`}
              >
                DESIGNER STUDIO
              </button>
            )}
            {['Super Admin', 'Management', 'Sales', 'Production', 'QC', 'Finance', 'Logistics'].includes(currentRole) && (
              <button
                onClick={() => handleNavSelect('admin')}
                className={`text-[10.5px] 2xl:text-[11.5px] font-sans tracking-[0.22em] uppercase transition-all duration-300 cursor-pointer ${
                  activeSection === 'admin' 
                    ? 'text-white font-bold drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]' 
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                OPERATIONS
              </button>
            )}
            <button
              onClick={() => handleNavSelect('transceiver')}
              className={`text-[10.5px] 2xl:text-[11.5px] font-sans tracking-[0.22em] uppercase transition-all duration-300 cursor-pointer ${
                activeSection === 'transceiver' 
                  ? 'text-white font-bold drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]' 
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              CONTACT
            </button>
          </div>

          {/* MOBILE & TABLET HEADER BAR ACTIONS (Phones, iPads, Tablets) */}
          <div className="flex xl:hidden items-center gap-2">
            {/* Quick Mobile Cart Header Button */}
            <button
              onClick={onOpenCart}
              className="p-2 sm:p-2.5 border border-[#2B2B2B] bg-[#0E0E0E]/90 text-neutral-300 hover:text-white rounded-sm cursor-pointer relative"
              title="Cart"
              aria-label="Open cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-black font-mono text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile / Tablet Menu Hamburger (Minimum 44px touch target) */}
            <button
              id="mobile-menu-hamburger"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-10 h-10 flex items-center justify-center border border-[#2B2B2B] text-[#F3F3F3] bg-[#0E0E0E]/90 rounded-sm hover:bg-[#141414] hover:border-neutral-400 cursor-pointer transition-colors"
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Responsive Mobile & Tablet Drawer Menu */}
      {mobileMenuOpen && (
        <div 
          id="mobile-navigation-drawer" 
          className="xl:hidden bg-[#070707]/98 border-b border-[#2B2B2B] backdrop-blur-xl animate-[slideDown_0.25s_cubic-bezier(0.16,1,0.3,1)] max-h-[85vh] overflow-y-auto"
        >
          <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-5 font-mono">
            
            {/* Active Persona Banner for Mobile/Tablet context */}
            <div className="flex items-center justify-between p-3 bg-[#111111] border border-[#2B2B2B] rounded-sm text-[10px]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-neutral-400">ACTIVE ROLE:</span>
                <span className="text-white font-bold uppercase">{currentRole}</span>
              </div>
              <span className="text-neutral-500 text-[9px] uppercase">MAISON ACCESS</span>
            </div>

            {/* Main Navigation Links with Touch-friendly Area (44px+) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-left">
              {[
                { id: 'home', label: '01 // HOME', desc: 'Campaign Runway & Specimen Portals' },
                { id: 'archive', label: '02 // ARCHIVE', desc: 'Excavated Artifacts & Specs' },
                { id: 'manifesto', label: '03 // ABOUT US', desc: 'The Story Behind The Brand • Heritage & Philosophy' },
                { id: 'chronicles', label: '04 // JOURNAL', desc: 'Decay Lore & Expedition Logs' },
                { id: 'portal', label: '05 // DIGITAL WARDROBE & SALON', desc: 'Garments, Alterations, Measurements & Care' },
                { id: 'transceiver', label: '06 // CONTACT', desc: 'Encrypted Transceiver Terminal' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavSelect(item.id)}
                  className={`w-full min-h-[48px] p-3 rounded-sm border text-left flex items-center justify-between transition-all duration-200 cursor-pointer ${
                    activeSection === item.id 
                      ? 'bg-white/10 border-white text-white font-bold' 
                      : 'border-[#2B2B2B]/60 bg-black/40 text-neutral-400 hover:text-white hover:border-[#333]'
                  }`}
                >
                  <div>
                    <span className="text-[11px] tracking-wider uppercase block">{item.label}</span>
                    <span className="text-[8.5px] text-neutral-500 block font-sans">{item.desc}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-neutral-500" />
                </button>
              ))}

              {/* Collections shortcut */}
              <button
                onClick={() => handleNavSelect('collections')}
                className={`w-full min-h-[48px] p-3 rounded-sm border text-left flex items-center justify-between transition-all duration-200 cursor-pointer ${
                  activeSection === 'collections'
                    ? 'border-white bg-white/10 text-white font-bold'
                    : 'border-[#2B2B2B]/60 bg-black/40 text-neutral-400 hover:text-white'
                }`}
              >
                <div>
                  <span className="text-[11px] tracking-wider uppercase block">07 // COLLECTIONS</span>
                  <span className="text-[8.5px] text-neutral-500 block font-sans">Seasonal Haute-Couture Lookbooks</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-500" />
              </button>

              {/* Atelier Workshop (Role-guarded) */}
              {['Partner', 'Super Admin', 'Management', 'Production', 'QC'].includes(currentRole) && (
                <button
                  onClick={() => handleNavSelect('workshop')}
                  className={`w-full min-h-[48px] p-3 rounded-sm border text-left flex items-center justify-between transition-all duration-200 cursor-pointer ${
                    activeSection === 'workshop'
                      ? 'bg-emerald-500/15 border-emerald-400 text-emerald-400 font-bold'
                      : 'border-emerald-500/30 bg-emerald-950/20 text-emerald-300 hover:border-emerald-400'
                  }`}
                >
                  <div>
                    <span className="text-[11px] tracking-wider uppercase block">08 // ATELIER WORKSHOP</span>
                    <span className="text-[8.5px] text-emerald-400/70 block font-sans">Artisan Bench, Patterns & Rework</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
                </button>
              )}

              {/* Designer Studio (Role-guarded) */}
              {['Designer', 'Partner', 'Super Admin', 'Management'].includes(currentRole) && (
                <button
                  onClick={() => handleNavSelect('designer')}
                  className={`w-full min-h-[48px] p-3 rounded-sm border text-left flex items-center justify-between transition-all duration-200 cursor-pointer ${
                    activeSection === 'designer'
                      ? 'bg-amber-500/15 border-amber-400 text-amber-400 font-bold'
                      : 'border-amber-500/30 bg-amber-950/20 text-amber-300 hover:border-amber-400'
                  }`}
                >
                  <div>
                    <span className="text-[11px] tracking-wider uppercase block">09 // DESIGNER STUDIO</span>
                    <span className="text-[8.5px] text-amber-400/70 block font-sans">Products, Customization & Payouts</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
                </button>
              )}

              {/* Operations & Command (Role-guarded) */}
              {['Super Admin', 'Management', 'Sales', 'Production', 'QC', 'Finance', 'Logistics'].includes(currentRole) && (
                <button
                  onClick={() => handleNavSelect('admin')}
                  className={`w-full min-h-[48px] p-3 rounded-sm border text-left flex items-center justify-between transition-all duration-200 cursor-pointer ${
                    activeSection === 'admin'
                      ? 'bg-white/15 border-white text-white font-bold'
                      : 'border-neutral-700 bg-neutral-900/40 text-neutral-300 hover:border-white'
                  }`}
                >
                  <div>
                    <span className="text-[11px] tracking-wider uppercase block">09 // OPERATIONS COMMAND</span>
                    <span className="text-[8.5px] text-neutral-400 block font-sans">KPIs, Orders, QC & Logistics</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-white" />
                </button>
              )}
            </div>

            {/* Mobile / Tablet Localization & Preferences Drawer Bar */}
            <div className="pt-3 border-t border-[#2B2B2B] flex flex-wrap items-center justify-between gap-3 text-[10px]">
              
              {/* Currency & Language Indicators */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 bg-[#141414] border border-[#2B2B2B] px-2.5 py-1.5 rounded-sm">
                  <span className="text-neutral-500 uppercase text-[9px]">CURRENCY:</span>
                  <span className="text-white font-bold text-[10px]">GBP (£)</span>
                </div>
                <div className="flex items-center gap-1.5 bg-[#141414] border border-[#2B2B2B] px-2.5 py-1.5 rounded-sm">
                  <span className="text-neutral-500 uppercase text-[9px]">LANG:</span>
                  <span className="text-white font-bold text-[10px]">ENGLISH</span>
                </div>
              </div>

              {/* Quick Drawers Triggers */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenWishlist(); }}
                  className="px-3 py-2 border border-[#2B2B2B] bg-[#141414] rounded-sm text-neutral-400 hover:text-white flex items-center gap-1.5 cursor-pointer"
                >
                  <Star className="w-3.5 h-3.5" fill={wishlistCount > 0 ? '#FFFFFF' : 'none'} stroke={wishlistCount > 0 ? '#FFFFFF' : 'currentColor'} />
                  <span>LOGS ({wishlistCount})</span>
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenCart(); }}
                  className="px-3 py-2 border border-[#2B2B2B] bg-white text-black font-bold rounded-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-black" />
                  <span>INTAKE ({cartCount})</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </nav>
  );
}
