import React, { useState, useEffect, useRef } from 'react';
import InteractiveLogo from './InteractiveLogo';

interface InteractiveLoaderProps {
  onEnter: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  alpha: number;
  maxAlpha: number;
  decay: number;
  color: string;
  wobbleSpeed: number;
  wobbleRange: number;
  wobbleStep: number;
}

interface MistBubble {
  id: number;
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  alpha: number;
  maxAlpha: number;
}

interface Shockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  speed: number;
}

export default function InteractiveLoader({ onEnter }: InteractiveLoaderProps) {
  // Cinematic phases
  const [stage, setStage] = useState<'initialize' | 'flare' | 'reveal' | 'ready'>('initialize');
  const [exitPhase, setExitPhase] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const loaderVideoRef = useRef<HTMLVideoElement | null>(null);
  const shockwavesRef = useRef<Shockwave[]>([]);
  const exitPhaseRef = useRef(false);

  const handleLoaderVideoMetadataLoaded = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    if (video) {
      video.muted = true;
      video.volume = 0;
      video.play().catch(() => {});
    }
  };

  // Play video smoothly using hardware acceleration and native looping
  useEffect(() => {
    const video = loaderVideoRef.current;
    if (video) {
      video.muted = true;
      video.volume = 0;
      video.play().catch(err => console.log('Loader video play failed:', err));
    }
  }, []);

  // Staggered cinematic entrance sequence
  useEffect(() => {
    // 1. Begin with simple organic ash storm (initialize)
    const flareTimer = setTimeout(() => {
      setStage('flare'); // Dramatic organic red flash sweeps behind screen, logo begins fading in
    }, 1000);

    const revealTimer = setTimeout(() => {
      setStage('reveal'); // Brand name expands outwards in sharp contrast from blur
    }, 2400);

    const readyTimer = setTimeout(() => {
      setStage('ready'); // Interactive "ENTER TO WORLD" button breathes into view
    }, 4200);

    return () => {
      clearTimeout(flareTimer);
      clearTimeout(revealTimer);
      clearTimeout(readyTimer);
    };
  }, []);

  // Transition on ENTER
  const handleExitWorld = () => {
    // Trigger stateful exit phase for 3D zoom out sequence
    exitPhaseRef.current = true;
    setExitPhase(true);

    setTimeout(() => {
      onEnter();
    }, 1600);
  };

  // High-performance canvas layout (Smoke Particles, embers, thermal shockwaves)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Initial embers
    const embers: Particle[] = [];
    const maxEmbers = 0;
    let particleIdCounter = 0;

    const createEmber = (isInit = false): Particle => {
      const isRed = Math.random();
      let color = '220, 38, 38'; // deep post-apocalyptic crimson
      if (isRed < 0.3) color = '239, 68, 68'; // hot spark red
      else if (isRed < 0.6) color = '244, 63, 94'; // rose blast
      else if (isRed < 0.85) color = '240, 240, 240'; // pure ash silver/white
      else color = '255, 60, 60'; // blinding intense red thermal core

      return {
        id: particleIdCounter++,
        x: Math.random() * w,
        y: isInit ? Math.random() * h : h + Math.random() * 80 + 20,
        size: Math.random() * 3.5 + 0.4,
        vx: (Math.random() - 0.5) * 1.6,
        vy: -(Math.random() * 2.5 + 0.6),
        alpha: Math.random() * 0.7 + 0.3,
        maxAlpha: Math.random() * 0.7 + 0.3,
        decay: Math.random() * 0.0035 + 0.0015,
        color,
        wobbleSpeed: Math.random() * 0.035 + 0.012,
        wobbleRange: Math.random() * 2.8 + 0.4,
        wobbleStep: Math.random() * Math.PI * 2,
      };
    };

    for (let i = 0; i < maxEmbers; i++) {
      embers.push(createEmber(true));
    }

    // Heavy mist clouds
    const mists: MistBubble[] = [];
    const maxMists = 28;
    let mistIdCounter = 0;

    for (let i = 0; i < maxMists; i++) {
      mists.push({
        id: mistIdCounter++,
        x: Math.random() * w,
        y: Math.random() * h,
        radius: Math.random() * 230 + 170,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.16,
        alpha: 0,
        maxAlpha: Math.random() * 0.075 + 0.025,
      });
    }

    // Interactive Shockwave Trigger on Mouse Down
    const handleMouseDownGlobal = (e: MouseEvent) => {
      // Generate two expansion sound waves
      shockwavesRef.current.push({
        x: e.clientX,
        y: e.clientY,
        radius: 0,
        maxRadius: Math.max(w, h) * 0.4,
        alpha: 0.8,
        speed: Math.max(w, h) * 0.015 + 4,
      });
    };
    window.addEventListener('mousedown', handleMouseDownGlobal);

    // Frame drawing
    const render = () => {
      // Clear canvas so the video underneath is visible
      ctx.clearRect(0, 0, w, h);

      // 1. Draw volumetric cinematic smoke
      for (let i = 0; i < mists.length; i++) {
        const m = mists[i];
        m.x += m.vx;
        m.y += m.vy;

        if (m.alpha < m.maxAlpha) {
          m.alpha += 0.0004; // slowly fade fog into existence
        }

        // Boundary safety wrapping
        if (m.x - m.radius > w) m.x = -m.radius;
        if (m.x + m.radius < 0) m.x = w + m.radius;
        if (m.y - m.radius > h) m.y = -m.radius;
        if (m.y + m.radius < 0) m.y = h + m.radius;

        const mistGrad = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.radius);
        mistGrad.addColorStop(0, `rgba(22, 12, 12, ${m.alpha})`);
        mistGrad.addColorStop(0.5, `rgba(10, 8, 8, ${m.alpha * 0.35})`);
        mistGrad.addColorStop(1, 'rgba(5, 5, 5, 0)');

        ctx.fillStyle = mistGrad;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Rising hot fire embers updating with draft physics
      for (let i = 0; i < embers.length; i++) {
        const p = embers[i];
        p.wobbleStep += p.wobbleSpeed;
        const drift = Math.sin(p.wobbleStep) * p.wobbleRange;

        // Accelerate particles exponentially if we are in exit/zoom phase
        const speedMultiplier = exitPhaseRef.current ? 9.5 : 1.0;
        p.x += (p.vx + drift * 0.2) * speedMultiplier;
        p.y += p.vy * speedMultiplier;
        
        // Embers live longer and blur larger on exit zoom to create depth
        if (exitPhaseRef.current) {
          p.size += 0.12; 
          p.alpha -= p.decay * 0.2;
        } else {
          p.alpha -= p.decay;
        }

        if (p.alpha <= 0 || p.y < -50 || p.x < -50 || p.x > w + 50) {
          embers[i] = createEmber(false);
          continue;
        }

        // Render soft glow halo representation
        ctx.beginPath();
        const glowRadius = p.size * 3.8;
        const glowGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowRadius);
        glowGrad.addColorStop(0, `rgba(${p.color}, ${p.alpha})`);
        glowGrad.addColorStop(0.6, `rgba(${p.color}, ${p.alpha * 0.25})`);
        glowGrad.addColorStop(1, 'rgba(5, 5, 5, 0)');

        ctx.fillStyle = glowGrad;
        ctx.arc(p.x, p.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        // Core high ignition bright center
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha * 0.95})`;
        ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. Render and expand user-triggered shockwaves
      const activeWaves = shockwavesRef.current;
      for (let i = activeWaves.length - 1; i >= 0; i--) {
        const wave = activeWaves[i];
        wave.radius += wave.speed * (exitPhaseRef.current ? 2.2 : 1.0);
        wave.alpha -= 0.015;

        if (wave.alpha <= 0 || wave.radius >= wave.maxRadius) {
          activeWaves.splice(i, 1);
          continue;
        }

        // Draw double shock rings
        ctx.strokeStyle = `rgba(239, 68, 68, ${wave.alpha * 0.38})`;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = `rgba(255, 255, 255, ${wave.alpha * 0.22})`;
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.arc(wave.x, wave.y, wave.radius * 0.9, 0, Math.PI * 2);
        ctx.stroke();
      }

      // 4. Subtle background digital decay grid overlay mapping
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.01)';
      ctx.lineWidth = 0.5;
      const step = 80;
      for (let x = 0; x < w; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousedown', handleMouseDownGlobal);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div 
      id="intro-loader-screen"
      className="fixed inset-0 z-50 bg-[#050505] flex items-center justify-center overflow-hidden select-none cursor-crosshair pb-12"
    >
      {/* Cinematic loop background video with exact size scaling matching home banner layout */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <video 
          ref={loaderVideoRef}
          src="https://fixlife.ir/wp-content/uploads/2026/10/namaye-posht-1.mp4"
          onLoadedMetadata={handleLoaderVideoMetadataLoaded}
          onCanPlay={() => setTimeout(() => setVideoPlaying(true), 0)}
          onLoadedData={() => setTimeout(() => setVideoPlaying(true), 0)}
          onPlaying={() => setTimeout(() => setVideoPlaying(true), 0)}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className={`w-full h-full object-cover scale-[1.18] translate-y-[4.5%] transition-opacity duration-[1200ms] ease-out ${videoPlaying ? 'opacity-100' : 'opacity-0'}`}
          style={{ pointerEvents: 'none' }}
        />
        {/* Soft environmental dark blend to preserve text visibility */}
        <div className="absolute inset-0 bg-[#050505]/40" />
      </div>

      {/* Cinematic Fog & Embers canvas */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full block pointer-events-none z-10" 
      />

      {/* Atmospheric Cinematic Scanline overlays */}
      <div className="absolute inset-0 w-full h-full pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_20%,rgba(5,5,5,0.85)_100%)] z-20" />
      <div className="absolute inset-0 w-full h-full opacity-[0.025] bg-[linear-gradient(rgba(18,10,10,0)_50%,rgba(0,0,0,0.3)_50%),linear-gradient(90deg,rgba(239,68,68,0.08),rgba(0,0,0,0),rgba(255,255,255,0.05))] bg-[size:100%_4px,3px_100%] pointer-events-none z-20" />

      {/* Primary Cinematic Container with 3D space warp exit layout */}
      <div 
        style={{
          transform: exitPhase 
            ? 'perspective(1000px) translate3d(0, 0, 480px) rotateX(15deg)' 
            : 'perspective(1000px) translate3d(0, 0, 0px) rotateX(0deg)',
          filter: exitPhase 
            ? 'blur(22px) brightness(2.5)' 
            : 'blur(0px) brightness(1.0)',
          opacity: exitPhase ? 0 : 1,
          transition: 'transform 1600ms cubic-bezier(0.16, 1, 0.3, 1), filter 1500ms ease-in, opacity 1400ms ease-in'
        }}
        className="relative z-20 flex flex-col items-center justify-center text-center px-6 max-w-4xl w-full"
      >
        
        {/* Sacred Geometry Emblem: Emerging from smoke flare */}
        <div 
          className={`transform transition-all duration-[3500ms] cubic-bezier(0.16, 1, 0.3, 1) hover:rotate-6 scale-[0.65] xs:scale-[0.8] sm:scale-100 ${
            stage !== 'initialize' 
              ? 'opacity-100 translate-y-0 filter drop-shadow-[0_0_40px_rgba(255,255,255,0.15)]' 
              : 'opacity-0 scale-90 translate-y-16 pointer-events-none'
          }`}
        >
          <InteractiveLogo size={250} animated={true} />
        </div>

        {/* Brand Core Typographic Manifestion */}
        <div className="mt-8 sm:mt-12 space-y-3 sm:space-y-4 px-2">
          <h1 
            style={{ transitionDelay: '300ms' }}
            className={`font-serif text-3xl xs:text-4xl sm:text-6xl lg:text-7xl text-[#F3F3F3] font-bold select-none transition-all duration-[3000ms] ease-out ${
              stage === 'reveal' || stage === 'ready'
                ? 'opacity-100 tracking-[0.16em] sm:tracking-[0.28em] filter blur-0 scale-100 drop-shadow-[0_0_25px_rgba(255,255,255,0.15)]' 
                : 'opacity-0 tracking-tighter filter blur-md scale-95 pointer-events-none'
            }`}
          >
            DANIEL’S MAISON
          </h1>
          
          <p 
            style={{ transitionDelay: '900ms' }}
            className={`font-mono text-[8px] sm:text-[11px] tracking-[0.35em] sm:tracking-[0.6em] text-[#8C8C8C] uppercase transition-all duration-[2500ms] leading-relaxed max-w-lg mx-auto ${
              stage === 'reveal' || stage === 'ready' 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-6 pointer-events-none'
            }`}
          >
            GARMENTS FROM THE ORIGIN OF CIVILIZATION
          </p>
        </div>

        {/* Cinematic DOORWAY button breathing into view */}
        <div className="mt-8 sm:mt-14 min-h-[5rem] flex items-center justify-center">
          <button
            id="btn-enter-archive"
            onClick={handleExitWorld}
            className={`group relative px-8 sm:px-14 py-3.5 sm:py-[18px] bg-black/95 border border-neutral-500 hover:border-white text-[#F3F3F3] hover:text-[#050505] text-[10px] sm:text-[12px] font-serif tracking-[0.35em] sm:tracking-[0.55em] uppercase rounded-sm cursor-pointer overflow-hidden transition-all duration-[1000ms] ${
              stage === 'ready' 
                ? 'opacity-100 translate-y-0 scale-100 shadow-[0_0_30px_rgba(255,255,255,0.05)] hover:shadow-[0_0_50px_rgba(255,255,255,0.2)] hover:bg-white' 
                : 'opacity-0 translate-y-6 scale-95 pointer-events-none'
            }`}
          >
            {/* Sliding hot red thermographic beam flare */}
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-neutral-800/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[1500ms] ease-out-in" />
            
            <span className="relative z-10 font-bold">ENTER TO WORLD</span>
          </button>
        </div>

        {/* Ambient instruction prompt */}
        <p 
          style={{ transitionDelay: '300ms' }}
          className={`text-[8.5px] font-mono tracking-[0.5em] text-neutral-600 transition-all duration-1000 uppercase ${
            stage === 'ready' ? 'opacity-85' : 'opacity-0'
          }`}
        >
          [ CLICK ANYWHERE TO GENERATE SHOCKWAVES ]
        </p>

      </div>
    </div>
  );
}
