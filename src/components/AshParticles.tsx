import React, { useEffect, useRef } from 'react';

interface AshParticlesProps {
  colorTheme?: 'default' | 'red';
  densityMultiplier?: number;
}

export default function AshParticles({ colorTheme = 'red', densityMultiplier = 1 }: AshParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let particles: Array<{
      x: number;
      y: number;
      radius: number;
      speedX: number;
      speedY: number;
      alpha: number;
      decaySpeed: number;
      color: string;
    }> = [];

    // Particle factory settings
    const spawnParticle = (width: number, height: number, forceBottom: boolean = false) => {
      let colors = ['#8C8C8C', '#E5E5E5', '#6E6E6E', '#2B2B2B', '#DC2626', '#1E1E1E'];
      if (colorTheme === 'red') {
        colors = ['#EF4444', '#DC2626', '#F87171', '#EF4444', '#B91C1C', '#EF4444', '#FCA5A5'];
      }
      return {
        x: Math.random() * width,
        y: forceBottom ? height + 10 : Math.random() * height,
        radius: colorTheme === 'red' ? Math.random() * 3 + 0.8 : Math.random() * 2 + 0.5,
        speedX: Math.random() * 0.6 - 0.3,
        speedY: colorTheme === 'red' ? -(Math.random() * 1.2 + 0.4) : -(Math.random() * 0.6 + 0.1), // slowly drifting up
        alpha: Math.random() * 0.75 + 0.15,
        decaySpeed: Math.random() * 0.002 + 0.0005,
        color: colors[Math.floor(Math.random() * colors.length)]
      };
    };

    // Instantiate initial particle cluster
    const initParticles = (width: number, height: number) => {
      particles = [];
      const density = Math.min(Math.floor(((width * height) / 18000) * densityMultiplier), 180);
      for (let i = 0; i < density; i++) {
        particles.push(spawnParticle(width, height));
      }
    };

    // Render loop
    const animate = () => {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, idx) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.alpha -= p.decaySpeed;

        // Reset dead specs
        if (p.y < -10 || p.alpha <= 0 || p.x < -10 || p.x > canvas.width + 10) {
          particles[idx] = spawnParticle(canvas.width, canvas.height, true);
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        if (colorTheme === 'red') {
          ctx.shadowColor = '#EF4444';
          ctx.shadowBlur = 8;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animationId = requestAnimationFrame(animate);
    };

    // Set up standard ResizeObserver for precise container monitoring with fallback
    let resizeObserver: ResizeObserver | null = null;
    const handleFallbackResize = () => {
      if (!canvasRef.current || !containerRef.current) return;
      const width = containerRef.current.clientWidth || window.innerWidth;
      const height = containerRef.current.clientHeight || window.innerHeight;
      if (width > 0 && height > 0) {
        canvasRef.current.width = width;
        canvasRef.current.height = height;
        initParticles(width, height);
      }
    };

    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver((entries) => {
        if (!entries || entries.length === 0) return;
        requestAnimationFrame(() => {
          if (!canvasRef.current) return;
          const entry = entries[0];
          const { width, height } = entry.contentRect;
          if (width > 0 && height > 0) {
            canvasRef.current.width = width;
            canvasRef.current.height = height;
            initParticles(width, height);
          }
        });
      });
      resizeObserver.observe(container);
    } else {
      window.addEventListener('resize', handleFallbackResize);
      handleFallbackResize();
    }

    animate();

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      } else {
        window.removeEventListener('resize', handleFallbackResize);
      }
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      id="ambient-particle-container"
      className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0 bg-transparent"
    >
      <canvas ref={canvasRef} className="block w-full h-full bg-transparent" />
    </div>
  );
}
