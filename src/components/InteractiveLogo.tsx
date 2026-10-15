import React, { useState, useEffect, useRef } from 'react';

interface InteractiveLogoProps {
  size?: number;
  animated?: boolean;
}

export default function InteractiveLogo({ size = 200, animated = true }: InteractiveLogoProps) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!animated) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calculate rotation offset based on distance from center
      const maxRotation = 18; // degrees
      const x = -((e.clientY - centerY) / window.innerHeight) * maxRotation;
      const y = ((e.clientX - centerX) / window.innerWidth) * maxRotation;

      setRotate({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [animated]);

  return (
    <div
      ref={containerRef}
      id="brand-logo-container"
      className="relative flex items-center justify-center cursor-pointer select-none"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        perspective: '1000px',
      }}
    >
      <div
        className="w-full h-full relative transition-transform duration-300 ease-out"
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Layer 1: Outer Celestial Orbit Ring */}
        <div 
          className="absolute inset-0 border border-white/10 rounded-full animate-[spin_40s_linear_infinite]"
          style={{ transform: 'translateZ(-40px)' }}
        />
        
        {/* Layer 2: Middle Iron Shard Ring */}
        <div 
          className="absolute inset-4 border border-[#2B2B2B] rounded-full animate-[spin_25s_linear_infinite_reverse]"
          style={{ transform: 'translateZ(-15px)' }}
        />

        {/* Layer 3: Central High-Fidelity Brand Logo Reconstruction */}
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full text-[#F3F3F3] fill-none"
          style={{ transform: 'translateZ(20px)' }}
        >
          {/* 1. Top Pointed Extension (Upper Half of Hexagon, hidden behind the square) */}
          <path 
            d="M 36.5 30 L 36.5 21.5 L 50 11 L 63.5 21.5 L 63.5 30" 
            stroke="currentColor" 
            strokeWidth="2.8" 
            strokeLinecap="square" 
            strokeLinejoin="miter" 
            fill="none" 
          />
          
          {/* 2. Bottom Pointed Extension (Lower Half of Hexagon, hidden behind the square) */}
          <path 
            d="M 36.5 70 L 36.5 78.5 L 50 89 L 63.5 78.5 L 63.5 70" 
            stroke="currentColor" 
            strokeWidth="2.8" 
            strokeLinecap="square" 
            strokeLinejoin="miter" 
            fill="none" 
          />
          
          {/* 3. Outer Frame: Perfect upright square outline */}
          <rect 
            x="30" 
            y="30" 
            width="40" 
            height="40" 
            stroke="currentColor" 
            strokeWidth="2.8" 
            strokeLinecap="square"
            strokeLinejoin="miter"
            fill="none" 
          />

          {/* 4. Central Symbol: Vertical diamond outline (height 1.4x its width) */}
          <polygon 
            points="50,33.2 62,50 50,66.8 38,50" 
            stroke="currentColor" 
            strokeWidth="1.8" 
            strokeLinejoin="miter"
            fill="none" 
          />

          {/* 5. Four-Point Compass Rose (Spikes as narrow triangular blades) */}
          {/* North Blade (Up, touching the peak of the diamond) */}
          <polygon 
            points="50,33.2 48.5,46.5 50,47.5" 
            stroke="currentColor" 
            strokeWidth="0.8"
            fill="currentColor"
            fillOpacity="0.15"
          />
          <polygon 
            points="50,33.2 51.5,46.5 50,47.5" 
            stroke="currentColor" 
            strokeWidth="0.8"
            fill="none"
          />

          {/* South Blade (Down, touching the bottom of the diamond) */}
          <polygon 
            points="50,66.8 48.5,53.5 50,52.5" 
            stroke="currentColor" 
            strokeWidth="0.8"
            fill="currentColor"
            fillOpacity="0.15"
          />
          <polygon 
            points="50,66.8 51.5,53.5 50,52.5" 
            stroke="currentColor" 
            strokeWidth="0.8"
            fill="none"
          />

          {/* East Blade (Right, touching the side of the diamond) */}
          <polygon 
            points="62,50 53.5,48.5 52.5,50" 
            stroke="currentColor" 
            strokeWidth="0.8"
            fill="currentColor"
            fillOpacity="0.15"
          />
          <polygon 
            points="62,50 53.5,51.5 52.5,50" 
            stroke="currentColor" 
            strokeWidth="0.8"
            fill="none"
          />

          {/* West Blade (Left, touching the side of the diamond) */}
          <polygon 
            points="38,50 46.5,48.5 47.5,50" 
            stroke="currentColor" 
            strokeWidth="0.8"
            fill="currentColor"
            fillOpacity="0.15"
          />
          <polygon 
            points="38,50 46.5,51.5 47.5,50" 
            stroke="currentColor" 
            strokeWidth="0.8"
            fill="none"
          />

          {/* 6. Four smaller diagonal spikes between the main directions */}
          {/* North-East Blade */}
          <polygon 
            points="56,44 50.5,45.5 54.5,49.5" 
            stroke="currentColor" 
            strokeWidth="0.8"
            fill="none" 
          />
          {/* South-East Blade */}
          <polygon 
            points="56,56 54.5,50.5 50.5,54.5" 
            stroke="currentColor" 
            strokeWidth="0.8"
            fill="none" 
          />
          {/* South-West Blade */}
          <polygon 
            points="44,56 49.5,54.5 45.5,50.5" 
            stroke="currentColor" 
            strokeWidth="0.8"
            fill="none" 
          />
          {/* North-West Blade */}
          <polygon 
            points="44,44 45.5,49.5 49.5,45.5" 
            stroke="currentColor" 
            strokeWidth="0.8"
            fill="none" 
          />

          {/* 7. Center: Small circular ring with small solid circle core */}
          <circle 
            cx="50" 
            cy="50" 
            r="3.5" 
            stroke="currentColor" 
            strokeWidth="1.2" 
            fill="#050505" 
          />
          <circle 
            cx="50" 
            cy="50" 
            r="1.3" 
            fill="currentColor" 
          />
        </svg>

        {/* Ambient dust cloud glow */}
        <div 
          className="absolute inset-8 bg-white/5 blur-2xl rounded-full pointer-events-none"
          style={{ transform: 'translateZ(-5px)' }}
        />
      </div>
    </div>
  );
}
