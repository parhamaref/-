import React, { useState, useEffect, useRef } from 'react';
import { 
  ShoppingBag, Star, Shield, HardDrive, Cpu, 
  Send, Plus, Minus, Trash2, CheckCircle2,
  ChevronRight, ArrowLeft, Pause, Play
} from 'lucide-react';

// Subcomponents
import InteractiveLoader from './components/InteractiveLoader';
import Navigation from './components/Navigation';
import AshParticles from './components/AshParticles';
import ArchiveSec from './components/ArchiveSec';
import ArtifactDetail from './components/ArtifactDetail';
import CustomerPortal from './components/customer/CustomerPortal';
import PartnerWorkshopDashboard from './components/partner/PartnerWorkshopDashboard';
import AdminOperationsDashboard from './components/admin/AdminOperationsDashboard';
import { DesignerDashboardLayout } from './components/designer/DesignerDashboardLayout';
import { AboutUsStory } from './components/AboutUsStory';
import { CollectionPages } from './components/collections/CollectionPages';

// Types & Data
import { Artifact, CartItem, Currency, JournalPost } from './types';
import { ARTIFACTS_DATABASE, JOURNAL_COLLECTION, HERO_IMAGE_URL, MOOD_IMAGES } from './data/artifacts';
import { TRANSLATIONS, CURRENCIES } from './data/translations';

export default function App() {
  const [welcomeOpen, setWelcomeOpen] = useState<boolean>(true);
  const [activeSection, setActiveSection] = useState<string>('home');
  const [lang] = useState<'en'>('en');
  const [currency] = useState<Currency>('GBP');
  const [homeWomensTab, setHomeWomensTab] = useState<'all' | 'dresses' | 'bodysuits' | 'tops-crop-tops' | 'jumpsuits' | 'skirts' | 'trousers-jeans' | 'shorts-sets' | 'hoodies-sweatshirts'>('all');
  
  // Drawer states
  const [cartOpen, setCartOpen] = useState<boolean>(false);
  const [wishlistOpen, setWishlistOpen] = useState<boolean>(false);

  // Cart & Wishlist storage
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Artifact[]>([]);

  // Selection states
  const [selectedProductDetail, setSelectedProductDetail] = useState<Artifact | null>(null);
  const [selectedJournalPost, setSelectedJournalPost] = useState<JournalPost | null>(null);

  // Home Page environment visualizer backdrop index
  const [activeEnvIdx, setActiveEnvIdx] = useState<number>(0);
  const envTitles = [
    { name: 'SECTOR-04 DECORUM', desc: 'Calcified soil layer with concrete columns' },
    { name: 'SALT DESERT DEBRIS', desc: 'Desolate white flatlands under acid storm clouds' },
    { name: 'TOKYO SCRAP OUTPOST', desc: 'Draped dark fabrics inside metal scaffoldings' }
  ];

  // Campaign Video Simulation state
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  const [videoPulse, setVideoPulse] = useState<number>(0);
  const [heroVideoReady, setHeroVideoReady] = useState<boolean>(false);

  // Transceiver / contact form state
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: 'ENCRYPTION CORES LEVEL III',
    message: ''
  });
  const [transceiverSuccess, setTransceiverSuccess] = useState<boolean>(false);
  const [transceiverSubmitting, setTransceiverSubmitting] = useState<boolean>(false);

  // Newsletter state
  const [newsEmail, setNewsEmail] = useState('');
  const [newsSuccess, setNewsSuccess] = useState<boolean>(false);

  // Checkout system
  const [checkoutRoute, setCheckoutRoute] = useState<'standard' | 'express'>('standard');
  const [checkoutStep, setCheckoutStep] = useState<'intake' | 'biometrics' | 'confirmed'>('intake');
  const [checkoutLoading, setCheckoutLoading] = useState<boolean>(false);

  // Video scrubbing via page scroll
  const heroVideoRef = useRef<HTMLVideoElement | null>(null);

  const handleVideoMetadataLoaded = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    if (video) {
      video.muted = true;
      video.volume = 0;
      video.play().catch(() => {});
      const scrollRange = Math.max(window.innerHeight * 1.8, 1200);
      const scrollProgress = window.scrollY / scrollRange;
      const clampedProgress = Math.min(Math.max(scrollProgress, 0), 1);
      if (video.duration && isFinite(video.duration)) {
        try {
          video.currentTime = clampedProgress * video.duration;
        } catch {}
      }
      // Ensure the video visibility fades in as soon as metadata is initialized
      setTimeout(() => {
        setHeroVideoReady(true);
      }, 0);
    }
  };

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout | null = null;
    let ticking = false;
    let isScrolling = false;

    // Ensure the video plays right away on mount
    const video = heroVideoRef.current;
    if (video) {
      video.play().catch(err => console.log('Video play failed or autoPlay blocked:', err));
    }

    const handleScroll = () => {
      isScrolling = true;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const videoElement = heroVideoRef.current;
          if (videoElement && videoElement.duration && isFinite(videoElement.duration)) {
            const scrollRange = Math.max(window.innerHeight * 1.8, 1200);
            const scrollProgress = window.scrollY / scrollRange;
            const clampedProgress = Math.min(Math.max(scrollProgress, 0), 1);
            
            // Pause while scrolling so manual seeking doesn't fight the play head
            if (!videoElement.paused) {
              videoElement.pause();
            }

            // Sync current playhead with scrolling progress
            try {
              videoElement.currentTime = clampedProgress * videoElement.duration;
            } catch {}

            // Clear any active stop-scroll timer
            if (scrollTimeout) {
              clearTimeout(scrollTimeout);
            }

            // Once the user stops scrolling, resume natural loop playback
            scrollTimeout = setTimeout(() => {
              isScrolling = false;
              if (videoElement) {
                videoElement.play().catch(() => {});
              }
            }, 150);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, []);

  // Animate pulse values during video play
  useEffect(() => {
    let interval: any;
    if (isVideoPlaying) {
      interval = setInterval(() => {
        setVideoPulse(prev => (prev + 1) % 100);
      }, 150);
    }
    return () => clearInterval(interval);
  }, [isVideoPlaying]);

  // Add item to shopping intake cart
  const handleAddToCart = (artifact: Artifact, size: string, color?: string) => {
    setCart(prev => {
      const existingIdx = prev.findIndex(item => 
        item.artifact.id === artifact.id && 
        item.selectedSize === size &&
        (color ? item.selectedColor === color : true)
      );
      if (existingIdx > -1) {
        const copy = [...prev];
        copy[existingIdx].quantity += 1;
        return copy;
      }
      return [...prev, { artifact, selectedSize: size, selectedColor: color, quantity: 1 }];
    });
  };

  // Adjust shopping cart items qty
  const handleUpdateCartQuantity = (idx: number, delta: number) => {
    setCart(prev => {
      const copy = [...prev];
      copy[idx].quantity += delta;
      if (copy[idx].quantity <= 0) {
        copy.splice(idx, 1);
      }
      return copy;
    });
  };

  const handleRemoveFromCart = (idx: number) => {
    setCart(prev => prev.filter((_, i) => i !== idx));
  };

  // Toggle target specimen details in Star Logs
  const handleToggleWishlist = (artifact: Artifact) => {
    setWishlist(prev => {
      const exists = prev.some(item => item.id === artifact.id);
      if (exists) {
        return prev.filter(item => item.id !== artifact.id);
      }
      return [...prev, artifact];
    });
  };

  const handleMoveWishlistToCart = (artifact: Artifact) => {
    handleAddToCart(artifact, artifact.sizes[0]);
    setWishlist(prev => prev.filter(item => item.id !== artifact.id));
  };

  // Human-friendly price allocation formatter in British Pound (£)
  const formatCost = (baseValue: number) => {
    const currData = CURRENCIES[currency] || { symbol: '£', rate: 1 };
    const converted = baseValue * currData.rate;
    return `${currData.symbol}${converted.toFixed(2)}`;
  };

  const getShippingCost = () => {
    return checkoutRoute === 'express' ? 120 : 45;
  };

  const getSubtotal = () => cart.reduce((sum, item) => sum + (item.artifact.priceCRDT * item.quantity), 0);
  const getTotal = () => getSubtotal() + getShippingCost();

  // Contact Transceiver submit trigger
  const handleTransceiverSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;
    setTransceiverSubmitting(true);
    setTimeout(() => {
      setTransceiverSubmitting(false);
      setTransceiverSuccess(true);
      setContactForm({ name: '', email: '', subject: 'ENCRYPTION CORES LEVEL III', message: '' });
      setTimeout(() => setTransceiverSuccess(false), 6000);
    }, 1500);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsEmail) return;
    setNewsSuccess(true);
    setNewsEmail('');
    setTimeout(() => setNewsSuccess(false), 5000);
  };

  // Secure checkout sequence
  const handleTriggerCheckout = () => {
    if (cart.length === 0) return;
    setCheckoutLoading(true);
    setTimeout(() => {
      setCheckoutLoading(false);
      setCheckoutStep('biometrics');
    }, 1200);
  };

  const handleConfirmBiometrics = () => {
    setCheckoutLoading(true);
    setTimeout(() => {
      setCheckoutLoading(false);
      setCheckoutStep('confirmed');
      setTimeout(() => {
        setCart([]);
        setCheckoutStep('intake');
        setCartOpen(false);
      }, 5000);
    }, 1600);
  };

  const d = TRANSLATIONS;

  return (
    <div className="min-h-screen bg-[#050505] text-[#F3F3F3] font-sans antialiased selection:bg-white/20 selection:text-white relative overflow-x-hidden flex flex-col justify-between">
      
      {/* Immersive organic falling ash layer once interactive gate is entered */}
      {!welcomeOpen && <AshParticles />}

      {welcomeOpen && (
        <InteractiveLoader onEnter={() => setWelcomeOpen(false)} />
      )}
          {/* Main fully-functional premium Navigation header */}
          <Navigation
            activeSection={activeSection}
            setActiveSection={(sec) => {
              setActiveSection(sec);
              setSelectedProductDetail(null);
              setSelectedJournalPost(null);
              setCartOpen(false);
              setWishlistOpen(false);
            }}
            lang={lang}
            currency={currency}
            cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
            wishlistCount={wishlist.length}
            onOpenCart={() => setCartOpen(true)}
            onOpenWishlist={() => setWishlistOpen(true)}
            langDict={d}
          />

          {/* Dynamic Content Frame */}
          <main className="flex-grow z-10 relative">

            {/* SECTION 1: HOME PAGE */}
            {activeSection === 'home' && (
              <div className="space-y-24 pb-24 animate-fadeIn">
                
                {/* Hero section */}
                <header className="relative h-[100vh] flex items-end justify-center text-center overflow-hidden border-b border-[#1E1E1E] pb-16">
                  <div className="absolute inset-0 z-0">
                    <video 
                      ref={heroVideoRef}
                      src="https://fixlife.ir/wp-content/uploads/2026/10/namaye-jolo-1.mp4"
                      onLoadedMetadata={handleVideoMetadataLoaded}
                      onCanPlay={() => setTimeout(() => setHeroVideoReady(true), 0)}
                      onLoadedData={() => setTimeout(() => setHeroVideoReady(true), 0)}
                      onPlaying={() => setTimeout(() => setHeroVideoReady(true), 0)}
                      autoPlay
                      muted
                      playsInline
                      loop
                      preload="auto"
                      className={`w-full h-full object-cover scale-[1.18] translate-y-[4.5%] transition-opacity duration-[1200ms] ease-out ${(!welcomeOpen && heroVideoReady) ? 'opacity-100' : 'opacity-0'}`}
                      style={{ pointerEvents: 'none' }}
                    />
                    {/* Natural ambient vignette blend - no heavy dimming layer */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-40" />
                    
                    {/* Glowing Red Embers/Particles directly on top of the true color video */}
                    <div className="absolute inset-0 z-1 opacity-90" style={{ mixBlendMode: 'screen' }}>
                      <AshParticles colorTheme="red" densityMultiplier={2.3} />
                    </div>
                  </div>

                  <div className="relative z-10 max-w-4xl px-4 space-y-6 select-none">
                    {/* Dual-line Subtitle with staggered delay */}
                    <div className="space-y-2">
                      <p 
                        className="font-sans text-[13px] sm:text-[15px] text-[#D1D1D1] tracking-[0.35em] uppercase leading-relaxed font-semibold drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] animate-fadeIn"
                        style={{ letterSpacing: '0.35em', marginRight: '-0.35em' }}
                      >
                        THE WORLD ENDED.
                      </p>
                      <p 
                        className="font-sans text-[13px] sm:text-[15px] text-[#D1D1D1] tracking-[0.35em] uppercase leading-relaxed font-semibold drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] animate-fadeIn [animation-delay:300ms]"
                        style={{ letterSpacing: '0.35em', marginRight: '-0.35em' }}
                      >
                        WE KEPT DESIGNING.
                      </p>
                    </div>

                    {/* Infinite soft pulse visual vertical line element */}
                    <div 
                      className="pt-6 flex justify-center text-[#F3F3F3] animate-pulse"
                    >
                      <span className="font-light text-2xl tracking-widest text-[#F3F3F3]/80">|</span>
                    </div>
                  </div>
                </header>

                {/* Curated Specimens Previews (3 items from storyboard #3) */}
                <section id="section-curated-specimens" className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 border-b border-[#2B2B2B]/40 pb-20 space-y-8">
                  <div className="text-center max-w-xl mx-auto space-y-2">
                    <span className="font-mono text-[9px] text-[#A3A3A3] tracking-wider block uppercase">// EXPLORE SPECIMENS</span>
                    <h2 className="font-serif text-2xl sm:text-4xl text-white uppercase tracking-widest font-bold">CURATED BRAND SPECIMENS</h2>
                    <p className="font-mono text-[10.5px] text-neutral-400 uppercase leading-relaxed text-justify">
                      Select baseline tactical designs extracted from sector caches to view detailed fitting metrics.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-[10px] max-w-5xl 2xl:max-w-6xl mx-auto">
                    {ARTIFACTS_DATABASE.slice(0, 3).map((art, idx) => {
                      const labelCodename = art.collection || (idx === 0 ? 'VOID WALKER' : idx === 1 ? 'SPINAL NOMAD' : 'DUST SURVIVOR');
                      return (
                        <div 
                          key={art.id}
                          onClick={() => {
                            setSelectedProductDetail(art);
                            setActiveSection('archive');
                          }}
                          className="group bg-[#0E0E0E] border border-[#2B2B2B] hover:border-white/50 p-6 rounded-sm text-center cursor-pointer transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.05)] flex flex-col justify-between"
                        >
                          <div className="flex justify-between text-neutral-500 border-b border-[#2B2B2B] pb-2 text-[8px]">
                            <span className="font-bold text-neutral-400">{art.code}</span>
                            <span>[INSPECT SPEC]</span>
                          </div>
                          
                          <div className="aspect-[3/4] flex items-center justify-center p-3 relative overflow-hidden my-4 bg-black/40 rounded-sm">
                            <img 
                              src={art.images.front} 
                              alt={art.name} 
                              referrerPolicy="no-referrer"
                              className="max-h-[85%] object-contain grayscale transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0"
                            />
                          </div>

                          <div className="space-y-1">
                            <h4 className="font-serif text-[15px] text-white uppercase font-bold tracking-wider leading-none mt-2 group-hover:text-white transition-colors">{art.name}</h4>
                            <span className="text-[9px] text-[#A3A3A3] truncate font-mono uppercase block">{labelCodename}</span>
                          </div>
                          
                          <div className="text-[8px] text-neutral-600 uppercase border-t border-[#2B2B2B]/60 pt-2 flex justify-between mt-4">
                            <span>INTEGRITY RATE</span>
                            <span className="text-white">{art.integrityScore.split(' ')[0]} Match</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>

                {/* NEW ARRIVALS: DANIEL MAISON WOMENSWEAR COLLECTION */}
                <section id="section-new-arrivals" className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 border-b border-[#2B2B2B]/40 pb-20 space-y-8">
                  <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#2B2B2B] pb-6 gap-4">
                    <div className="space-y-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                        <span className="font-mono text-[9px] text-rose-300 tracking-widest uppercase font-bold">
                          NEW ARRIVALS // ATELIER CAPSULE
                        </span>
                      </div>
                      <h2 className="font-serif text-2xl sm:text-4xl text-white uppercase tracking-widest font-bold">
                        DANIEL MAISON WOMENSWEAR COLLECTION
                      </h2>
                      <p className="font-mono text-[10.5px] text-neutral-400 uppercase leading-relaxed max-w-2xl">
                        Architectural Women's Dresses, fluid couture silhouettes, sculpting contour bodysuits, and elevated tops & crop tops.
                      </p>
                    </div>

                    {/* Subcategory Filter Tabs on Home */}
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => setHomeWomensTab('all')}
                        className={`font-mono text-[9.5px] tracking-wider uppercase px-3 py-1.5 rounded-xs border transition-colors cursor-pointer ${
                          homeWomensTab === 'all'
                            ? 'bg-white text-black font-bold border-white'
                            : 'border-[#2B2B2B] text-neutral-400 hover:text-white'
                        }`}
                      >
                        ALL ({ARTIFACTS_DATABASE.filter(a => a.category === 'womenswear').length})
                      </button>
                      <button
                        onClick={() => setHomeWomensTab('tops-crop-tops')}
                        className={`font-mono text-[9.5px] tracking-wider uppercase px-3 py-1.5 rounded-xs border transition-colors cursor-pointer ${
                          homeWomensTab === 'tops-crop-tops'
                            ? 'bg-white text-black font-bold border-white'
                            : 'border-[#2B2B2B] text-neutral-400 hover:text-white'
                        }`}
                      >
                        TOPS & CROP TOPS ({ARTIFACTS_DATABASE.filter(a => a.subcategory === 'tops-crop-tops').length})
                      </button>
                      <button
                        onClick={() => setHomeWomensTab('bodysuits')}
                        className={`font-mono text-[9.5px] tracking-wider uppercase px-3 py-1.5 rounded-xs border transition-colors cursor-pointer ${
                          homeWomensTab === 'bodysuits'
                            ? 'bg-white text-black font-bold border-white'
                            : 'border-[#2B2B2B] text-neutral-400 hover:text-white'
                        }`}
                      >
                        BODYSUITS ({ARTIFACTS_DATABASE.filter(a => a.subcategory === 'bodysuits').length})
                      </button>
                      <button
                        onClick={() => setHomeWomensTab('dresses')}
                        className={`font-mono text-[9.5px] tracking-wider uppercase px-3 py-1.5 rounded-xs border transition-colors cursor-pointer ${
                          homeWomensTab === 'dresses'
                            ? 'bg-white text-black font-bold border-white'
                            : 'border-[#2B2B2B] text-neutral-400 hover:text-white'
                        }`}
                      >
                        DRESSES ({ARTIFACTS_DATABASE.filter(a => a.subcategory === 'dresses').length})
                      </button>
                      <button
                        onClick={() => setHomeWomensTab('jumpsuits')}
                        className={`px-3 py-1 text-[10px] font-mono rounded-xs border transition-colors cursor-pointer ${
                          homeWomensTab === 'jumpsuits'
                            ? 'bg-white text-black font-bold border-white'
                            : 'border-[#2B2B2B] text-neutral-400 hover:text-white'
                        }`}
                      >
                        JUMPSUITS ({ARTIFACTS_DATABASE.filter(a => a.subcategory === 'jumpsuits').length})
                      </button>
                      <button
                        onClick={() => setHomeWomensTab('skirts')}
                        className={`px-3 py-1 text-[10px] font-mono rounded-xs border transition-colors cursor-pointer ${
                          homeWomensTab === 'skirts'
                            ? 'bg-white text-black font-bold border-white'
                            : 'border-[#2B2B2B] text-neutral-400 hover:text-white'
                        }`}
                      >
                        SKIRTS ({ARTIFACTS_DATABASE.filter(a => a.subcategory === 'skirts').length})
                      </button>
                      <button
                        onClick={() => setHomeWomensTab('trousers-jeans')}
                        className={`px-3 py-1 text-[10px] font-mono rounded-xs border transition-colors cursor-pointer ${
                          homeWomensTab === 'trousers-jeans'
                            ? 'bg-white text-black font-bold border-white'
                            : 'border-[#2B2B2B] text-neutral-400 hover:text-white'
                        }`}
                      >
                        TROUSERS & JEANS ({ARTIFACTS_DATABASE.filter(a => a.subcategory === 'trousers-jeans').length})
                      </button>
                      <button
                        onClick={() => setHomeWomensTab('shorts-sets')}
                        className={`px-3 py-1 text-[10px] font-mono rounded-xs border transition-colors cursor-pointer ${
                          homeWomensTab === 'shorts-sets'
                            ? 'bg-white text-black font-bold border-white'
                            : 'border-[#2B2B2B] text-neutral-400 hover:text-white'
                        }`}
                      >
                        SHORTS & SETS ({ARTIFACTS_DATABASE.filter(a => a.subcategory === 'shorts-sets').length})
                      </button>
                      <button
                        onClick={() => setHomeWomensTab('hoodies-sweatshirts')}
                        className={`px-3 py-1 text-[10px] font-mono rounded-xs border transition-colors cursor-pointer ${
                          homeWomensTab === 'hoodies-sweatshirts'
                            ? 'bg-white text-black font-bold border-white'
                            : 'border-[#2B2B2B] text-neutral-400 hover:text-white'
                        }`}
                      >
                        HOODIES & SWEATSHIRTS ({ARTIFACTS_DATABASE.filter(a => a.subcategory === 'hoodies-sweatshirts').length})
                      </button>
                      <button
                        onClick={() => setActiveSection('archive')}
                        className="font-mono text-[9.5px] text-neutral-300 hover:text-white uppercase tracking-widest px-3 py-1.5 border border-[#2B2B2B] hover:border-white rounded-xs transition-colors cursor-pointer"
                      >
                        ARCHIVE →
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 font-mono text-[10px] max-w-7xl mx-auto">
                    {ARTIFACTS_DATABASE
                      .filter(art => art.category === 'womenswear' && (homeWomensTab === 'all' || art.subcategory === homeWomensTab))
                      .map((art) => (
                      <div
                        key={art.id}
                        onClick={() => {
                          setSelectedProductDetail(art);
                          setActiveSection('archive');
                        }}
                        className="group bg-[#0E0E0E] border border-[#2B2B2B] hover:border-white/60 p-5 rounded-sm text-left cursor-pointer transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.06)] flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex justify-between items-center text-neutral-400 border-b border-[#2B2B2B] pb-2 text-[8.5px]">
                            <span className="font-bold text-white uppercase">{art.brand || 'DANIEL MAISON'}</span>
                            <span className="text-rose-300 bg-rose-950/50 border border-rose-800/40 px-1.5 py-0.5 rounded-xs font-semibold uppercase">
                              {art.subcategory || 'WOMENSWEAR'}
                            </span>
                          </div>

                          <div className="aspect-[3/4] flex items-center justify-center p-3 relative overflow-hidden my-3 bg-black/50 rounded-sm">
                            <img
                              src={art.images.front}
                              alt={art.name}
                              referrerPolicy="no-referrer"
                              className="max-h-[92%] object-contain transition-all duration-500 group-hover:scale-105"
                            />
                            <div className="absolute bottom-2 left-2 font-mono text-[7px] text-neutral-400 bg-black/70 px-1.5 py-0.5 rounded-xs border border-[#2B2B2B]">
                              SKU: {art.sku}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <h4 className="font-serif text-[14px] text-white uppercase font-bold tracking-wider leading-snug group-hover:text-white transition-colors line-clamp-1">
                              {art.name}
                            </h4>
                            <p className="font-sans text-[10.5px] text-neutral-400 line-clamp-2 mt-1">
                              {art.description.en}
                            </p>
                          </div>
                        </div>

                        <div className="border-t border-[#2B2B2B]/60 pt-3 mt-4 flex items-center justify-between">
                          <div>
                            <span className="text-[7.5px] text-neutral-500 block uppercase">PRICE</span>
                            <span className="font-mono text-base text-white font-bold">
                              £{art.priceCRDT.toFixed(2)}
                            </span>
                          </div>
                          <button className="px-3 py-1.5 border border-white text-white text-[8px] uppercase tracking-widest group-hover:bg-white group-hover:text-black transition-all font-bold">
                            EXPLORE SPEC
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Ecosystem Visualizer Section (Environmental backgrounds storyboard #6) */}
                <section className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
                  <div className="bg-[#0E0E0E] rounded-sm border border-[#2B2B2B] overflow-hidden grid grid-cols-1 lg:grid-cols-12">
                    <div className="lg:col-span-8 aspect-video relative bg-black">
                      <img 
                        src={ARTIFACTS_DATABASE[activeEnvIdx].images.campaign || HERO_IMAGE_URL} 
                        alt="Ecosystem backing display" 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover grayscale opacity-55 transition-all duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                      <div className="absolute bottom-6 left-6 text-left space-y-1 max-w-sm">
                        <span className="font-mono text-[8px] text-neutral-400 block">COURIER ENVIRONMENT PREVIEW // CALIBRATED</span>
                        <h4 className="font-serif text-xl text-white uppercase font-bold tracking-wider">{envTitles[activeEnvIdx].name}</h4>
                        <p className="font-mono text-[9px] text-neutral-400 uppercase leading-relaxed text-justify">{envTitles[activeEnvIdx].desc}</p>
                      </div>
                    </div>

                    <div className="lg:col-span-4 p-8 flex flex-col justify-between space-y-6">
                      <div className="space-y-4 text-left">
                        <span className="font-mono text-[9px] text-white uppercase tracking-widest block border-l-2 border-white pl-3">PERSPECTIVE RADAR</span>
                        <h3 className="font-serif text-xl sm:text-2xl text-white uppercase tracking-wider leading-tight">SAFE-ZONE LANDSCAPES</h3>
                        <p className="font-sans text-xs text-neutral-400 leading-relaxed text-justify">
                          Observe environmental backdrop variations recovered beneath geological layers. Shift safe-zones to customize your tactical models.
                        </p>
                      </div>

                      <div className="space-y-2">
                        {envTitles.map((env, idx) => (
                          <button
                            key={idx}
                            onClick={() => setActiveEnvIdx(idx)}
                            className={`w-full py-3 px-4 rounded-sm border font-mono text-[9.5px] uppercase flex justify-between items-center transition-all cursor-pointer ${
                              activeEnvIdx === idx 
                                ? 'bg-white/10 border-white text-white font-bold' 
                                : 'border-[#2B2B2B] text-neutral-500 hover:text-white hover:bg-[#141414]'
                            }`}
                          >
                            <span>0{idx+1} // {env.name}</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                {/* Video simulation loop (storyboard #9) */}
                <section className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 border-b border-[#2B2B2B]/40 pb-20">
                  <div className="relative rounded-sm border border-[#2B2B2B] p-6 sm:p-8 md:p-12 text-center space-y-6 overflow-hidden bg-[#0E0E0E]">
                    {/* Atmospheric ambient backdrop */}
                    <div 
                      className="absolute inset-0 opacity-15 pointer-events-none bg-cover bg-center blur-2xl scale-110"
                      style={{ backgroundImage: `url('https://fixlife.ir/wp-content/uploads/2026/10/%D9%86%D9%85%D8%A7%DB%8C-%DA%A9%D8%A7%D9%88%D8%B1-%D9%81%DB%8C%D9%84%D9%85.jpg')` }}
                    />

                    <div className="relative z-10 max-w-2xl mx-auto space-y-4">
                      <span className="font-mono text-[8px] text-emerald-500 tracking-wider block uppercase">● RECONSTRUCTED CINEMATICS MULTICAST v0.19</span>
                      <h3 className="font-serif text-2xl sm:text-3xl text-white uppercase tracking-widest font-bold">DANIEL’S MAISON COHORT RUNWAY FILM</h3>
                      <p className="font-mono text-[10px] text-neutral-400 leading-relaxed max-w-md mx-auto uppercase text-justify">
                        Watch heavy-defense fabrics tested across sub-zero storms. Enable cinematic play modes below.
                      </p>
                    </div>

                    <div className="aspect-video max-w-3xl mx-auto relative bg-black border border-[#2B2B2B] rounded-sm overflow-hidden flex items-center justify-center group shadow-2xl z-10">
                      {isVideoPlaying ? (
                        <video 
                          src="https://fixlife.ir/wp-content/uploads/2026/10/namaye-posht-1.mp4"
                          poster="https://fixlife.ir/wp-content/uploads/2026/10/%D9%86%D9%85%D8%A7%DB%8C-%DA%A9%D8%A7%D9%88%D8%B1-%D9%81%DB%8C%D9%84%D9%85.jpg"
                          autoPlay
                          loop
                          playsInline
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img 
                          src="https://fixlife.ir/wp-content/uploads/2026/10/%D9%86%D9%85%D8%A7%DB%8C-%DA%A9%D8%A7%D9%88%D8%B1-%D9%81%DB%8C%D9%84%D9%85.jpg" 
                          alt="DANIEL’S MAISON COHORT RUNWAY FILM" 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/35 pointer-events-none" />
                      
                      {/* Scan screen overlay lines */}
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.12)_50%)] bg-[length:100%_4px] pointer-events-none" />

                      <div className="absolute z-10 flex flex-col items-center gap-3">
                        <button
                          onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                          className="w-16 h-16 rounded-full border border-white/80 bg-black/70 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white hover:text-[#050505] transition-all transform hover:scale-110 cursor-pointer shadow-2xl"
                          aria-label={isVideoPlaying ? 'Pause Runway Film' : 'Play Runway Film'}
                        >
                          {isVideoPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5 animate-pulse" />}
                        </button>
                        <span className="font-mono text-[9px] text-neutral-200 font-bold tracking-widest uppercase bg-black/60 px-3 py-1 rounded-xs border border-white/10 backdrop-blur-xs">
                          {isVideoPlaying ? 'TRANSMITTING COHORT RECOVERY LIVE' : 'ACTIVATE COAXIAL FEED SCAN'}
                        </span>
                      </div>
                      
                      {isVideoPlaying && (
                        <div className="absolute top-4 left-4 px-2.5 py-1 bg-emerald-500/20 border border-emerald-500/40 rounded-xs text-[8.5px] text-emerald-300 font-bold tracking-widest uppercase backdrop-blur-xs animate-pulse">
                          ● TRANSMITTING STREAM {videoPulse}%
                        </div>
                      )}
                    </div>
                  </div>
                </section>

                {/* Brand Story & Heritage Feature Banner */}
                <section className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#121212] via-[#0a0a0a] to-[#141414] border border-amber-500/30 p-8 sm:p-12 md:p-16 text-left shadow-2xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
                    <div className="relative z-10 max-w-3xl space-y-6">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 font-mono text-[10px] tracking-[0.25em] uppercase">
                        <span>THE STORY BEHIND THE BRAND</span>
                      </div>

                      <h3 className="font-serif text-2xl sm:text-4xl lg:text-5xl text-white font-bold tracking-wide uppercase leading-tight">
                        A Legacy of Skill, Curiosity and Courage
                      </h3>

                      <p className="font-serif text-lg sm:text-xl text-neutral-300 leading-relaxed italic">
                        “At its heart, DANIELS is more than a fashion brand. It is the continuation of a family story that began with hardship, grew through knowledge and skill, and has now evolved into a vision for a new generation of luxury.”
                      </p>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-3 border-y border-white/10 text-center font-mono">
                        <div>
                          <div className="text-amber-400 text-lg sm:text-xl font-bold">1940s</div>
                          <div className="text-neutral-500 text-[9px] uppercase tracking-wider">Tailoring Roots</div>
                        </div>
                        <div>
                          <div className="text-amber-400 text-lg sm:text-xl font-bold">ITALY</div>
                          <div className="text-neutral-500 text-[9px] uppercase tracking-wider">Textile Mastery</div>
                        </div>
                        <div>
                          <div className="text-amber-400 text-lg sm:text-xl font-bold">SAVILE ROW</div>
                          <div className="text-neutral-500 text-[9px] uppercase tracking-wider">British Bespoke</div>
                        </div>
                        <div>
                          <div className="text-amber-400 text-lg sm:text-xl font-bold">TOGETHER</div>
                          <div className="text-neutral-500 text-[9px] uppercase tracking-wider">We Grow</div>
                        </div>
                      </div>

                      <div className="pt-2 flex flex-wrap gap-4 items-center">
                        <button
                          onClick={() => {
                            setActiveSection('manifesto');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="px-7 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs tracking-widest uppercase transition-all shadow-lg shadow-amber-500/20 cursor-pointer flex items-center gap-2"
                        >
                          <span>Read Daniel’s Full Story</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                        <span className="text-neutral-500 text-xs font-mono">Complete 13-Chapter Heritage Chronicle</span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Ambient dynamic footer */}
                <footer className="border-t border-[#2B2B2B]/40 pt-16 pb-8 max-w-4xl mx-auto text-center space-y-8 px-4">
                  <div className="bg-[#0E0E0E] border border-[#2B2B2B] border-dashed p-8 rounded-sm max-w-xl mx-auto space-y-4">
                    <span className="font-mono text-[8.5px] text-emerald-500 uppercase tracking-widest block font-bold">● COAXIAL ENCRYPTED PROFILE REGISTER</span>
                    <h4 className="font-serif text-lg text-white uppercase tracking-wider font-semibold">SUBSCRIBE TO DISPATCH CORRIDORS</h4>
                    
                    {newsSuccess ? (
                      <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px]">
                        TRANSMISSION REGISTERED WITH SAFE-ZONE DATABASE INDICES.
                      </div>
                    ) : (
                      <form onSubmit={handleNewsletterSubmit} className="flex gap-2 text-xs pt-1">
                        <input 
                          type="email" 
                          required
                          value={newsEmail}
                          onChange={(e) => setNewsEmail(e.target.value)}
                          placeholder="SECURE_COURIER@SAFEHOUSE.NET"
                          className="bg-black border border-[#2B2B2B] text-neutral-200 px-4 py-2 flex-grow outline-none focus:border-white font-mono rounded-sm"
                        />
                        <button type="submit" className="bg-[#F3F3F3] hover:bg-white text-black font-semibold font-mono tracking-widest uppercase px-5 py-2 cursor-pointer">
                          SYNC
                        </button>
                      </form>
                    )}
                  </div>

                  <div className="font-mono text-[9px] text-neutral-500 space-y-3">
                    <div>
                      <p className="font-serif text-white uppercase text-[18px] tracking-[0.2em] font-bold">DANIEL’S MAISON</p>
                      <p className="font-mono text-[8px] sm:text-[9.5px] tracking-[0.28em] sm:tracking-[0.4em] text-neutral-400 uppercase mt-1">
                        GARMENTS FROM THE ORIGIN OF CIVILIZATION
                      </p>
                    </div>
                    <div className="flex flex-wrap justify-center items-center gap-3 text-[8.5px] tracking-widest uppercase text-neutral-400">
                      <button onClick={() => { setActiveSection('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white cursor-pointer">HOME</button>
                      <span>•</span>
                      <button onClick={() => { setActiveSection('archive'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white cursor-pointer">ARCHIVE</button>
                      <span>•</span>
                      <button onClick={() => { setActiveSection('manifesto'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-amber-400 hover:text-amber-300 font-semibold cursor-pointer">ABOUT US — BRAND STORY</button>
                      <span>•</span>
                      <button onClick={() => { setActiveSection('chronicles'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white cursor-pointer">JOURNAL</button>
                      <span>•</span>
                      <button onClick={() => { setActiveSection('portal'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white cursor-pointer">CLIENT SALON</button>
                      <span>•</span>
                      <button onClick={() => { setActiveSection('transceiver'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white cursor-pointer">CONTACT</button>
                    </div>
                    <div className="pt-3 border-t border-[#222222]/80 space-y-2">
                      <p className="text-neutral-500">© 2026 DANIEL’S MAISON. FROM YESTERDAY’S HERITAGE, TO TOMORROW’S FUTURE. WE GROW TOGETHER.</p>
                      <p className="text-neutral-400 font-mono text-[8.5px] sm:text-[9.5px] tracking-[0.2em] sm:tracking-[0.28em] uppercase">
                        DESIGNER, ARCHITECT &amp; GRAPHIC ARTIST: <span className="text-amber-400 font-semibold tracking-widest">ENG. PARHAM AREF</span>
                      </p>
                    </div>
                  </div>
                </footer>

              </div>
            )}

            {/* SECTION 2: EXCAVATIONS / ARCHIVE CATALOG (storyboard #4 & #5 integrated) */}
            {activeSection === 'archive' && (
              <div className="animate-fadeIn">
                {selectedProductDetail ? (
                  <ArtifactDetail
                    artifact={selectedProductDetail}
                    lang={lang}
                    currency={currency}
                    onBack={() => setSelectedProductDetail(null)}
                    onAddToCart={handleAddToCart}
                    onToggleWishlist={handleToggleWishlist}
                    wishlistIds={wishlist.map(w => w.id)}
                    langDict={d}
                    onSelectRelated={(art) => setSelectedProductDetail(art)}
                  />
                ) : (
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <ArchiveSec
                      lang={lang}
                      currency={currency}
                      onSelectArtifact={(art) => setSelectedProductDetail(art)}
                      langDict={d}
                      onToggleWishlist={handleToggleWishlist}
                      wishlistIds={wishlist.map(w => w.id)}
                    />
                  </div>
                )}
              </div>
            )}

            {/* SECTION 3: CHRONICLES / JOURNAL LORE (storyboard #8 integrated) */}
            {activeSection === 'chronicles' && (
              <div className="animate-fadeIn">
                {selectedJournalPost ? (
                  <div className="py-16 px-4 max-w-3xl mx-auto space-y-8 text-left">
                    <button
                      onClick={() => setSelectedJournalPost(null)}
                      className="font-mono text-[10px] text-neutral-500 hover:text-white transition-colors uppercase flex items-center gap-1 cursor-pointer"
                    >
                      ← [BACK TO DIARY CHRONICLES]
                    </button>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center font-mono text-[9px] text-white">
                        <span className="font-bold border border-white/40 py-0.5 px-1.5 uppercase rounded-sm">{selectedJournalPost.category}</span>
                        <span>DATE FILED: {selectedJournalPost.date}</span>
                      </div>
                      <h1 className="font-serif text-2xl sm:text-3xl text-white uppercase tracking-wider font-bold leading-tight">{selectedJournalPost.title[lang]}</h1>
                      <div className="bg-[#0E0E0E] border border-[#2B2B2B] p-4 text-[9px] font-mono rounded-sm flex justify-between uppercase text-neutral-400">
                        <span>GEO COORDINATOR: {selectedJournalPost.coordinates}</span>
                        <span>AUTHOR: {selectedJournalPost.author}</span>
                      </div>
                    </div>

                    <p className="font-serif text-lg text-neutral-300 leading-relaxed first-letter:text-4xl first-letter:font-serif first-letter:text-white first-letter:mr-2 text-justify">
                      {selectedJournalPost.content[lang]}
                    </p>
                  </div>
                ) : (
                  <section className="py-16 max-w-4xl 2xl:max-w-5xl mx-auto px-4 space-y-8">
                    <div className="text-center space-y-1">
                      <span className="font-mono text-[9px] text-neutral-400 tracking-wider block uppercase">// PRESERVATION BULLETIN</span>
                      <h2 className="font-serif text-2xl sm:text-4xl text-white uppercase tracking-widest mt-1 font-bold">THE TACTICAL CHRONICLES Log</h2>
                    </div>

                    <div className="space-y-6">
                      {JOURNAL_COLLECTION.map((post) => (
                        <div 
                          key={post.id}
                          onClick={() => setSelectedJournalPost(post)}
                          className="bg-[#0E0E0E] border border-[#2B2B2B] p-6 rounded-sm hover:border-white/40 transition-all cursor-pointer text-left space-y-3"
                        >
                          <div className="flex justify-between items-center font-mono text-[8.5px] text-neutral-500">
                            <span className="text-neutral-400 font-bold uppercase">{post.category}</span>
                            <span>{post.date} // COORDINATES: {post.coordinates}</span>
                          </div>
                          <h3 className="font-serif text-lg text-white uppercase tracking-wide font-bold">{post.title[lang]}</h3>
                          <p className="font-sans text-xs text-neutral-400 line-clamp-2 leading-relaxed text-justify">{post.excerpt[lang]}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            )}

            {/* SECTION 4: ABOUT US — THE STORY BEHIND THE BRAND */}
            {activeSection === 'manifesto' && (
              <AboutUsStory
                onExploreCollections={() => {
                  setActiveSection('collections');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {/* SECTION 4B: SEASONAL COLLECTIONS & LOOKBOOKS */}
            {activeSection === 'collections' && (
              <CollectionPages
                onNavigateHome={() => setActiveSection('home')}
                onSelectProduct={(prod) => {
                  setActiveSection('portal');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {/* SECTION 5: CLIENT SALON & DIGITAL WARDROBE PORTAL */}
            {activeSection === 'portal' && (
              <CustomerPortal onNavigateHome={() => setActiveSection('home')} />
            )}
            {activeSection === 'wardrobe' && (
              <CustomerPortal initialTab="wardrobe" onNavigateHome={() => setActiveSection('home')} />
            )}

            {/* SECTION 5B: ATELIER WORKSHOP / PARTNER PORTAL */}
            {activeSection === 'workshop' && (
              <PartnerWorkshopDashboard onNavigateHome={() => setActiveSection('home')} />
            )}

            {/* SECTION 5C: OPERATIONS & PRODUCTION COMMAND / ADMIN PORTAL */}
            {activeSection === 'admin' && (
              <AdminOperationsDashboard onNavigateHome={() => setActiveSection('home')} />
            )}

            {/* SECTION 5D: DESIGNER DASHBOARD / ATELIER PORTAL */}
            {activeSection === 'designer' && (
              <DesignerDashboardLayout onNavigateHome={() => setActiveSection('home')} />
            )}

            {/* SECTION 6: TRANSCEIVER / SECURE COMM CONTACT TERMINAL (storyboard #10 integrated) */}
            {activeSection === 'transceiver' && (
              <section className="py-16 max-w-xl mx-auto px-4 animate-fadeIn">
                <div className="bg-[#0E0E0E] border border-[#2B2B2B] p-6 sm:p-10 md:p-12 rounded-sm space-y-6 font-mono text-[11px] text-left">
                  
                  <div className="border-b border-[#2B2B2B]/60 pb-4">
                    <span className="text-[9px] text-white tracking-widest uppercase block mb-1">COAXIAL COMMUNICATION SYSTEM</span>
                    <h3 className="font-serif text-2xl text-white uppercase tracking-widest font-bold">TRANSMIT COURIER DIRECT</h3>
                    <p className="text-[9.5px] text-neutral-500 uppercase mt-1 text-justify">Establish secure contact links to deliver carbonized jackets and fittings queries.</p>
                  </div>

                  {transceiverSuccess ? (
                    <div className="p-6 bg-white/10 border border-white/20 text-white rounded-sm text-center space-y-3">
                      <CheckCircle2 className="w-8 h-8 text-white mx-auto animate-bounce" />
                      <div className="uppercase font-bold tracking-widest text-[11px]">TRANSMISSION LINK REGISTERED</div>
                      <p className="text-[9.5px] text-neutral-400 leading-normal uppercase text-justify">
                        Nomad address synced successfully. Safe-house dispatcher drone will deliver telemetry codes in due time.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleTransceiverSubmit} className="space-y-4">
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-neutral-500 uppercase text-[9px] block">NOMAD CALLSIGN *</label>
                          <input 
                            type="text" 
                            required 
                            value={contactForm.name}
                            onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                            placeholder="E.G. COURIER ASH" 
                            className="w-full bg-[#050505] border border-[#2B2B2B] focus:border-white p-3 rounded-sm text-white tracking-widest placeholder-neutral-700 uppercase"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-neutral-500 uppercase text-[9px] block">RECEPTOR ADRESS *</label>
                          <input 
                            type="email" 
                            required 
                            value={contactForm.email}
                            onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                            placeholder="E.G. ADDR@SAFEHOUSE.NET" 
                            className="w-full bg-[#050505] border border-[#2B2B2B] focus:border-white p-3 rounded-sm text-white placeholder-neutral-700"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-neutral-500 uppercase text-[9px] block">SECURITY SERVICE PORTAL *</label>
                        <select 
                          value={contactForm.subject}
                          onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                          className="w-full bg-[#050505] border border-[#2B2B2B] focus:border-white p-3 rounded-sm text-neutral-300 outline-none cursor-pointer"
                        >
                          <option value="ENCRYPTION CORES LEVEL III">LEVEL III COAXIAL QUERY (STANDARD)</option>
                          <option value="SECURE SAFEHOUSE QUERY">SECURE SAFEHOUSE PORTAL DEPLOYMENT</option>
                          <option value="NOMAD BRAND CHIEF INBOUND">CREATIVE DIRECTOR DIRECT LINE</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-neutral-500 uppercase text-[9px] block">CRYPTOGRAPHIC TEXT *</label>
                        <textarea 
                          required 
                          rows={4}
                          value={contactForm.message}
                          onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                          placeholder="OUTLINE INTEL PROPOSALS OR MODULAR GARMENT PARAMETERS..." 
                          className="w-full bg-[#050505] border border-[#2B2B2B] focus:border-white p-3 rounded-sm text-white placeholder-neutral-700 font-sans leading-relaxed text-justify"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={transceiverSubmitting}
                        className="w-full py-3 bg-[#F3F3F3] hover:bg-white disabled:bg-neutral-800 disabled:text-neutral-500 text-[#050505] font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Send className="w-4 h-4 text-black" />
                        <span>{transceiverSubmitting ? 'TRANSMITTING COHORT RECOVERY...' : 'TRANSMIT SIGNAL'}</span>
                      </button>
                    </form>
                  )}
                </div>
              </section>
            )}

          </main>

          {/* ======================================================== */}
          {/* GLOBAL PERSISTENT BOTTOM DOCK: ON ALL PAGES              */}
          {/* SAVED TARGET SPECIMENS & STORAGE INTAKE HARNESS (CART)   */}
          {/* ======================================================== */}
          {!welcomeOpen && (
            <aside
              id="global-bottom-actions-dock"
              aria-label="Target Specimens & Storage Intake Harness"
              className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center gap-2 sm:gap-3 pointer-events-auto"
            >
              {/* Currency Indicator (GBP £) */}
              <div className="hidden xl:flex items-center gap-1.5 bg-[#0E0E0E]/95 border border-[#2B2B2B] px-3.5 py-2 rounded-full backdrop-blur-md shadow-2xl">
                <span className="font-mono text-[9px] text-neutral-500 uppercase">CURRENCY:</span>
                <span className="font-mono text-[10px] text-[#F3F3F3] font-bold">GBP (£)</span>
              </div>

              {/* SAVED TARGET SPECIMENS (Wishlist) */}
              <button
                id="dock-saved-target-specimens"
                onClick={() => setWishlistOpen(true)}
                className="group flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 border border-[#2B2B2B] hover:border-amber-400/80 bg-[#0E0E0E]/95 hover:bg-[#151515] backdrop-blur-md rounded-full text-neutral-300 hover:text-white transition-all duration-300 shadow-2xl cursor-pointer"
                title="SAVED TARGET SPECIMENS"
                aria-label="View Saved Target Specimens"
              >
                <Star
                  className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform"
                  fill={wishlist.length > 0 ? '#FBBF24' : 'none'}
                  stroke={wishlist.length > 0 ? '#FBBF24' : 'currentColor'}
                />
                <span className="font-mono text-[9px] sm:text-[10px] tracking-wider uppercase font-semibold text-neutral-200 group-hover:text-white">
                  <span className="inline sm:hidden">SPECIMENS</span>
                  <span className="hidden sm:inline">SAVED TARGET SPECIMENS</span>
                </span>
                <span
                  className={`font-mono text-[8.5px] font-bold px-1.5 py-0.5 rounded-full transition-colors ${
                    wishlist.length > 0
                      ? 'bg-amber-400 text-black'
                      : 'bg-neutral-800 text-neutral-400'
                  }`}
                >
                  {wishlist.length}
                </span>
              </button>

              {/* STORAGE INTAKE HARNESS (CART) */}
              <button
                id="dock-storage-intake-harness"
                onClick={() => setCartOpen(true)}
                className="group flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 border border-white/20 hover:border-white bg-[#F3F3F3] hover:bg-white text-black transition-all duration-300 rounded-full shadow-2xl cursor-pointer"
                title="STORAGE INTAKE HARNESS (CART)"
                aria-label="View Storage Intake Harness Cart"
              >
                <ShoppingBag className="w-4 h-4 text-black group-hover:scale-110 transition-transform" />
                <span className="font-mono text-[9px] sm:text-[10px] tracking-wider uppercase font-bold text-black">
                  <span className="inline sm:hidden">CART</span>
                  <span className="hidden sm:inline">STORAGE INTAKE HARNESS (CART)</span>
                </span>
                <span
                  className={`font-mono text-[8.5px] font-bold px-1.5 py-0.5 rounded-full transition-colors ${
                    cart.reduce((sum, item) => sum + item.quantity, 0) > 0
                      ? 'bg-black text-white'
                      : 'bg-neutral-300 text-neutral-800'
                  }`}
                >
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              </button>
            </aside>
          )}

          {/* STORAGE ALLOCATION DRAWER (Cart) */}
          {cartOpen && (
            <div id="cart-drawer-backdrop" className="fixed inset-0 z-50 bg-[#050505]/80 backdrop-blur-sm flex justify-end">
              <div className="flex-grow w-full h-full" onClick={() => setCartOpen(false)} />
              
              <div className="w-full sm:max-w-md h-screen bg-[#0E0E0E] border-l border-[#2B2B2B] p-5 sm:p-6 flex flex-col justify-between overflow-y-auto animate-slideLeft z-10 font-mono text-[10.5px]">
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-[#2B2B2B] pb-4">
                    <span className="font-serif text-lg text-white uppercase tracking-widest font-bold">
                      {d['cart.title'][lang]}
                    </span>
                    <button onClick={() => setCartOpen(false)} className="text-neutral-500 hover:text-white uppercase cursor-pointer">[CLOSE]</button>
                  </div>

                  {cart.length === 0 ? (
                    <div className="text-center py-20 text-neutral-500 border border-dashed border-[#2B2B2B] p-6 rounded-sm space-y-4">
                      <ShoppingBag className="w-8 h-8 text-neutral-600 mx-auto" />
                      <p className="uppercase tracking-widest">{d['cart.empty'][lang]}</p>
                      <p className="text-[8px] text-neutral-400 text-justify">Tactical tech-garrison awaiting core material key calibration.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {checkoutStep !== 'confirmed' && cart.map((item, idx) => (
                        <div key={idx} className="flex gap-4 p-3 bg-black border border-[#2B2B2B] rounded-sm relative">
                          <img src={item.artifact.images.front} alt="Cart preview" referrerPolicy="no-referrer" className="w-12 h-16 object-contain grayscale border border-[#2B2B2B]" />
                          <div className="flex-grow space-y-1 text-left">
                            <h4 className="font-serif text-xs text-white uppercase truncate font-bold">{item.artifact.name}</h4>
                            <div className="text-[8.5px] text-neutral-400 flex flex-wrap items-center gap-2">
                              <span>SIZE: <span className="text-white font-bold">{item.selectedSize}</span></span>
                              {item.selectedColor && (
                                <span>| COLOR: <span className="text-white font-bold">{item.selectedColor}</span></span>
                              )}
                            </div>
                            <div className="text-[10px] text-neutral-300 font-bold">{formatCost(item.artifact.priceCRDT)}</div>
                            <div className="flex items-center gap-2 pt-1">
                              <button onClick={() => handleUpdateCartQuantity(idx, -1)} className="p-0.5 border border-[#2B2B2B] bg-[#141414] hover:text-white cursor-pointer"><Minus className="w-3 h-3" /></button>
                              <span className="text-[#F3F3F3] font-bold">{item.quantity}</span>
                              <button onClick={() => handleUpdateCartQuantity(idx, 1)} className="p-0.5 border border-[#2B2B2B] bg-[#141414] hover:text-white cursor-pointer"><Plus className="w-3 h-3" /></button>
                              <button onClick={() => handleRemoveFromCart(idx)} className="ml-auto text-neutral-500 hover:text-rose-400 p-0.5 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                            </div>
                          </div>
                        </div>
                      ))}

                      {checkoutStep === 'biometrics' && (
                        <div className="border border-white/20 p-4 rounded-sm space-y-3 bg-black text-left">
                          <span className="text-emerald-500 font-bold uppercase tracking-widest block animate-pulse">● BIOMETRIC PATTERY RECOGNITION ACTIVE</span>
                          <p className="text-[8px] text-neutral-400 leading-normal uppercase text-justify">
                            Place secure geolocation safehouse coordinates keys to authenticate delivery allocation.
                          </p>
                          <input 
                            type="text" 
                            required 
                            placeholder="FITTING SEC ADDR CODE (E.G. SECTOR-04-A7)" 
                            className="w-full bg-[#141414] border border-[#2B2B2B]/80 text-[#F3F3F3] text-[9.5px] p-2.5 rounded-sm outline-none font-mono"
                          />
                          <button 
                            onClick={handleConfirmBiometrics}
                            className="w-full py-2.5 bg-emerald-500 text-black font-mono font-bold text-[10px] tracking-widest uppercase hover:bg-emerald-400 cursor-pointer"
                          >
                            NEURAL CONFIRM TRANSITION
                          </button>
                        </div>
                      )}

                      {checkoutStep === 'confirmed' && (
                        <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-center rounded-sm space-y-3">
                          <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto animate-bounce" />
                          <div className="uppercase font-bold tracking-widest">ALLOCATION MATRIX COMPLETE</div>
                          <p className="text-[8.5px] text-neutral-400 uppercase leading-normal text-justify">
                            Courier drone vector locked on coordinates safely. Dispatch logs logged with Sector Mainframe registry. Refitting in 5 seconds.
                          </p>
                        </div>
                      )}

                    </div>
                  )}
                </div>

                {cart.length > 0 && checkoutStep !== 'confirmed' && (
                  <div className="border-t border-[#2B2B2B] pt-4 space-y-3 text-left">
                    <div className="space-y-1.5 text-neutral-400 text-[10px] uppercase">
                      <div className="flex justify-between">
                        <span>SUBTOTAL VALUE:</span>
                        <span className="text-white font-bold">{formatCost(getSubtotal())}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>GRID SHIPPING FREIGHT:</span>
                        <span className="text-white font-bold">{formatCost(getShippingCost())}</span>
                      </div>
                      <div className="flex justify-between border-t border-[#2B2B2B]/40 pt-2 text-white font-bold text-xs">
                        <span>TOTAL SECURE ALLOCATION:</span>
                        <span className="text-white font-black">{formatCost(getTotal())}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => setCheckoutRoute(checkoutRoute === 'standard' ? 'express' : 'standard')}
                        className={`w-[120px] py-3 text-[8.5px] tracking-widest font-bold uppercase transition-all border cursor-pointer ${
                          checkoutRoute === 'express' 
                            ? 'bg-white/10 border-white text-white font-bold' 
                            : 'border-[#2B2B2B] text-neutral-500 hover:text-white'
                        }`}
                      >
                        {checkoutRoute === 'express' ? '✈ AIR CHUTE' : '🚚 DRONE CONTEXT'}
                      </button>

                      <button
                        onClick={checkoutStep === 'intake' ? handleTriggerCheckout : handleConfirmBiometrics}
                        disabled={checkoutLoading}
                        className="flex-grow py-3 bg-white hover:bg-neutral-200 hover:text-black text-black font-semibold uppercase tracking-widest text-[10px] flex items-center justify-center gap-1.5 cursor-pointer transition-colors duration-300"
                      >
                        <span>{checkoutLoading ? 'CRYPTO_LOADING...' : 'SECURE SYNC CORES'}</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}

          {/* SAVED TARGET SPECIMENS DRAWER (Wishlist) */}
          {wishlistOpen && (
            <div id="wishlist-drawer-backdrop" className="fixed inset-0 z-50 bg-[#050505]/80 backdrop-blur-sm flex justify-end">
              <div className="flex-grow w-full h-full" onClick={() => setWishlistOpen(false)} />
              
              <div className="w-full sm:max-w-md h-screen bg-[#0E0E0E] border-l border-[#2B2B2B] p-5 sm:p-6 flex flex-col justify-between overflow-y-auto animate-slideLeft z-10 font-mono text-[10.5px]">
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-[#2B2B2B] pb-4">
                    <span className="font-serif text-lg text-white uppercase tracking-widest font-bold">
                      {lang === 'en' ? 'SAVED TARGET SPECIMENS' : 'ESPECÍMENES ALVOS SALVOS'}
                    </span>
                    <button onClick={() => setWishlistOpen(false)} className="text-neutral-500 hover:text-white uppercase cursor-pointer">[CLOSE]</button>
                  </div>

                  {wishlist.length === 0 ? (
                    <div className="text-center py-20 text-neutral-500 border border-dashed border-[#2B2B2B] p-6 rounded-sm space-y-3">
                      <Star className="w-8 h-8 text-neutral-600 mx-auto" />
                      <p className="uppercase tracking-widest">SAVED CORES BLANK</p>
                      <p className="text-[8px] text-neutral-400 text-justify">Save tactical target designs from lookbooks to add tracking beacons here.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {wishlist.map((art) => (
                        <div key={art.id} className="flex gap-4 p-3 bg-black border border-[#2B2B2B] rounded-sm items-center relative">
                          <img src={art.images.front} alt="Wishlist model thumbnail" referrerPolicy="no-referrer" className="w-12 h-16 object-contain grayscale border border-[#2B2B2B]" />
                          <div className="flex-grow text-left space-y-1">
                            <span className="text-[8px] text-neutral-400 font-bold block">{art.code}</span>
                            <h4 className="font-serif text-xs text-white uppercase truncate font-bold">{art.name}</h4>
                            <div className="text-[10px] text-neutral-300 font-bold">{formatCost(art.priceCRDT)}</div>
                            
                            <div className="flex gap-2 pt-1.5">
                              <button 
                                onClick={() => handleMoveWishlistToCart(art)}
                                className="bg-white text-black px-2.5 py-1 text-[8.5px] uppercase font-bold tracking-widest hover:bg-neutral-200 transition-all duration-300 cursor-pointer"
                              >
                                INTAKE TRANSFER
                              </button>
                              <button 
                                onClick={() => handleToggleWishlist(art)}
                                className="border border-[#2B2B2B] text-neutral-500 px-2.5 py-1 text-[8.5px] uppercase hover:text-rose-400 cursor-pointer"
                              >
                                REMOVE
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="text-[8px] text-neutral-600 border-t border-[#2B2B2B] pt-4 text-center uppercase tracking-widest">
                  PSYЄRFAN DECAY BEACON SYSTEM delta-04
                </div>

              </div>
            </div>
          )}



    </div>
  );
}
