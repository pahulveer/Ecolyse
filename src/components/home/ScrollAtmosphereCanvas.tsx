import React, { useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';

interface Particle {
  x: number;
  y: number;
  radius: number;
  baseVx: number;
  baseVy: number;
  alpha: number;
  phase: number;
  pulseSpeed: number;
  color: string;
}

export const ScrollAtmosphereCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { theme } = useTheme();
  const isLight = theme === 'light';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const resize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize, { passive: true });

    // Color palette tailored to theme
    const colors = isLight
      ? ['rgba(5, 150, 105, ', 'rgba(13, 148, 136, ', 'rgba(16, 185, 129, ']
      : ['rgba(52, 211, 153, ', 'rgba(45, 212, 191, ', 'rgba(110, 231, 183, '];

    const particleCount = 28;
    const particles: Particle[] = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.0 + 1.0,
      baseVx: (Math.random() - 0.5) * 0.3,
      baseVy: -Math.random() * 0.3 - 0.1,
      alpha: Math.random() * 0.35 + 0.15,
      phase: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.02 + 0.01,
      color: colors[Math.floor(Math.random() * colors.length)]
    }));

    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const delta = currentScrollY - lastScrollY;
          lastScrollY = currentScrollY;
          scrollVelocity = Math.max(-8, Math.min(8, scrollVelocity + delta * 0.05));
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth decay of scroll momentum
      scrollVelocity *= 0.90;

      // Draw lightweight glowing particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.phase += p.pulseSpeed;
        const pulse = Math.sin(p.phase);

        p.x += p.baseVx;
        p.y += p.baseVy - scrollVelocity;

        // Screen wrap-around
        if (p.x < -10) p.x = width + 10;
        else if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        else if (p.y > height + 10) p.y = -10;

        const currentAlpha = Math.max(0.08, p.alpha + pulse * 0.12);
        const currentRadius = p.radius + pulse * 0.3;

        // Single batch draw for 60fps performance
        ctx.fillStyle = `${p.color}${currentAlpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isLight]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: isLight ? 0.5 : 0.75, willChange: 'transform' }}
      aria-hidden="true"
    />
  );
};
