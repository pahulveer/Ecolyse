import React, { useRef, useEffect, useState } from 'react';
import { playSelectSound } from '../../utils/soundEffects';
import { 
  WORLD_COASTLINES, 
  GENERATED_LAND_GRID, 
  getGeographicRegion, 
  type LatLon 
} from '../../data/worldMapData';

interface EarthCanvasProps {
  className?: string;
}

interface TelemetryPoint {
  id: string;
  lat: number;
  lon: number;
  label: string;
  shortLabel: string;
  metric: string;
  subtext: string;
  country: string;
  category: 'grid' | 'clean_tech' | 'transit' | 'monitoring' | 'sink';
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
}

// Previous authentic CO2e and climate data nodes
const TELEMETRY_NODES: TelemetryPoint[] = [
  {
    id: 'cea_delhi',
    lat: 28.6139,
    lon: 77.2090,
    label: 'National Grid (CEA v19)',
    shortLabel: 'CEA Grid',
    metric: '716.2 g CO₂e/kWh',
    subtext: 'Central Electricity Authority weighted national baseline v19 (CO₂ Database)',
    country: 'New Delhi, India',
    category: 'grid'
  },
  {
    id: 'bhadla_solar',
    lat: 27.5395,
    lon: 71.9161,
    label: 'Bhadla Solar Park',
    shortLabel: 'Bhadla Solar',
    metric: '2,245.0 MW Clean PV',
    subtext: 'World’s highest-capacity operational solar installation (5,700 hectares)',
    country: 'Rajasthan, India',
    category: 'clean_tech'
  },
  {
    id: 'bengaluru_metro',
    lat: 12.9716,
    lon: 77.5946,
    label: 'Namma Metro Transit',
    shortLabel: 'BLR Metro',
    metric: '18.4 g CO₂e/p-km',
    subtext: 'BMRCL 750V DC electrified urban rapid transit lifecycle LCA',
    country: 'Bengaluru, India',
    category: 'transit'
  },
  {
    id: 'mauna_loa',
    lat: 19.5362,
    lon: -155.5763,
    label: 'Mauna Loa Baseline',
    shortLabel: 'Mauna Loa',
    metric: '426.92 ppm CO₂',
    subtext: 'NOAA Global Monitoring Laboratory continuous infrared atmospheric record',
    country: 'Hawaii, USA',
    category: 'monitoring'
  },
  {
    id: 'amazon_sink',
    lat: -3.4653,
    lon: -62.2159,
    label: 'Amazon Biosphere Sink',
    shortLabel: 'Amazon Sink',
    metric: '-1.20 Gt CO₂e/yr',
    subtext: 'Primary planetary terrestrial intact biosphere carbon sequestration',
    country: 'Amazon Basin',
    category: 'sink'
  },
  {
    id: 'europe_grid',
    lat: 51.5074,
    lon: -0.1278,
    label: 'European Interconnect',
    shortLabel: 'UK/EU Grid',
    metric: '231.8 g CO₂e/kWh',
    subtext: 'ENTSO-E cross-border generation weighted carbon intensity',
    country: 'London, UK',
    category: 'grid'
  }
];

// Subdivide long coastline segments so lines curve smoothly with the spherical surface
function prepareSubdividedCoastlines(coastlines: LatLon[][], maxStepDeg = 3.0): LatLon[][] {
  return coastlines.map(polyline => {
    const res: LatLon[] = [];
    for (let i = 0; i < polyline.length; i++) {
      const p1 = polyline[i];
      res.push(p1);
      if (i < polyline.length - 1) {
        const p2 = polyline[i + 1];
        const dLat = p2[0] - p1[0];
        let dLon = p2[1] - p1[1];
        if (Math.abs(dLon) > 180) continue; // Meridian wrap
        const dist = Math.hypot(dLat, dLon);
        if (dist > maxStepDeg) {
          const steps = Math.ceil(dist / maxStepDeg);
          for (let s = 1; s < steps; s++) {
            const t = s / steps;
            res.push([p1[0] + dLat * t, p1[1] + dLon * t]);
          }
        }
      }
    }
    return res;
  });
}

const PREPARED_COASTLINES = prepareSubdividedCoastlines(WORLD_COASTLINES, 3.0);

export const EarthCanvas: React.FC<EarthCanvasProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Interaction State
  const rotationRef = useRef<number>(75);         // Longitude rotation accumulator
  const yawOffsetRef = useRef<number>(0);          // Cursor deflection yaw
  const pitchRef = useRef<number>(18);             // Latitude pitch angle
  const velocityRotRef = useRef<number>(0.11);     // Balanced, non-distracting ambient spin

  // Mouse & Drag State
  const mouseNormRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const mouseCanvasPosRef = useRef<{ x: number; y: number }>({ x: -1000, y: -1000 });
  const isHoveringCanvasRef = useRef<boolean>(false);
  const isDraggingRef = useRef<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number; rot: number; pitch: number }>({ x: 0, y: 0, rot: 0, pitch: 0 });

  // Visual effects
  const ripplesRef = useRef<Ripple[]>([]);
  const hoveredNodeRef = useRef<TelemetryPoint | null>(null);
  const satAngleRef = useRef<number>(0);

  const [activeTelemetry, setActiveTelemetry] = useState<TelemetryPoint | null>(null);
  const [isInteracting, setIsInteracting] = useState<boolean>(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    // Subtle cosmic background stars
    const stars = Array.from({ length: 50 }, () => ({
      x: (Math.random() - 0.5) * 580,
      y: (Math.random() - 0.5) * 580,
      size: Math.random() * 1.5 + 0.3,
      alpha: Math.random() * 0.5 + 0.15,
      pulseSpeed: Math.random() * 0.025 + 0.01,
      phase: Math.random() * Math.PI * 2
    }));

    let canvasWidth = 0;
    let canvasHeight = 0;
    let isCanvasVisible = true;

    let cachedRect: DOMRect | null = null;
    const updateCachedRect = () => {
      if (canvas) cachedRect = canvas.getBoundingClientRect();
    };

    const resize = () => {
      updateCachedRect();
      if (!cachedRect) return;
      canvasWidth = cachedRect.width;
      canvasHeight = cachedRect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = cachedRect.width * dpr;
      canvas.height = cachedRect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('scroll', updateCachedRect, { passive: true });

    // 60FPS Optimization: Zero layout reflow using IntersectionObserver
    const observer = new IntersectionObserver(([entry]) => {
      isCanvasVisible = entry.isIntersecting;
      if (entry.isIntersecting) updateCachedRect();
    }, { threshold: 0.02 });
    observer.observe(canvas);

    // Global cursor tracking with zero-layout-reflow cached rect
    const handleGlobalPointerMove = (e: PointerEvent) => {
      if (!cachedRect) updateCachedRect();
      if (!cachedRect) return;

      const canvasCenterX = cachedRect.left + cachedRect.width / 2;
      const canvasCenterY = cachedRect.top + cachedRect.height / 2;

      const normX = (e.clientX - canvasCenterX) / (window.innerWidth * 0.45);
      const normY = (e.clientY - canvasCenterY) / (window.innerHeight * 0.45);

      mouseNormRef.current = {
        x: Math.max(-1.0, Math.min(1.0, normX)),
        y: Math.max(-1.0, Math.min(1.0, normY))
      };

      mouseCanvasPosRef.current = {
        x: e.clientX - cachedRect.left,
        y: e.clientY - cachedRect.top
      };

      const dist = Math.hypot(e.clientX - canvasCenterX, e.clientY - canvasCenterY);
      isHoveringCanvasRef.current = dist < cachedRect.width * 0.5;
    };

    const handleGlobalPointerLeave = () => {
      mouseNormRef.current = { x: 0, y: 0 };
      mouseCanvasPosRef.current = { x: -1000, y: -1000 };
      isHoveringCanvasRef.current = false;
    };

    window.addEventListener('pointermove', handleGlobalPointerMove, { passive: true });
    window.addEventListener('pointerleave', handleGlobalPointerLeave);

    let lastTime = performance.now();

    const render = (time: number) => {
      // 60FPS: Instant bail without touching DOM when hidden or offscreen
      if (!isCanvasVisible || canvasWidth === 0 || canvasHeight === 0) {
        lastTime = time;
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      // True 60fps delta-time (frame-rate independent physics)
      const dt = Math.min((time - lastTime) / 1000, 0.05) || 0.016;
      lastTime = time;

      const width = canvasWidth;
      const height = canvasHeight;
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      // Proportioned radius so the globe sits balanced in the hero without dominating
      const radius = Math.min(width, height) * 0.31;

      // True 60FPS buttery-smooth rotation and deflection physics
      if (!isDraggingRef.current) {
        const lerpFactor = 1 - Math.exp(-6.5 * dt);
        const targetYaw = mouseNormRef.current.x * 22;
        yawOffsetRef.current += (targetYaw - yawOffsetRef.current) * lerpFactor;

        const targetPitch = 18 - mouseNormRef.current.y * 10;
        pitchRef.current += (targetPitch - pitchRef.current) * lerpFactor;

        const hoverSpeedMultiplier = isHoveringCanvasRef.current ? 1.25 : 1.0;
        // Constant 7.5 deg/sec ambient rotation locked to real time
        rotationRef.current += 7.5 * dt * hoverSpeedMultiplier;
      }

      const currentRot = rotationRef.current + yawOffsetRef.current;
      const currentPitch = pitchRef.current;
      const radPitch = (currentPitch * Math.PI) / 180;
      const cosPitch = Math.cos(radPitch);
      const sinPitch = Math.sin(radPitch);

      satAngleRef.current += 1.1 * dt;

      const parallaxX = mouseNormRef.current.x * 8;
      const parallaxY = mouseNormRef.current.y * 6;

      // -------------------------------------------------------------
      // 1. SUBTLE BACKGROUND PARTICLES & TASTEFUL AMBIENT AURA
      // -------------------------------------------------------------
      ctx.save();
      stars.forEach(star => {
        star.phase += star.pulseSpeed;
        const starAlpha = star.alpha * (0.6 + 0.4 * Math.sin(star.phase));
        ctx.fillStyle = `rgba(52, 211, 153, ${starAlpha})`;
        ctx.beginPath();
        ctx.arc(centerX + star.x + parallaxX * 0.2, centerY + star.y + parallaxY * 0.2, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Tamed, soft background halo so it doesn't distract from headline
      const auraGlow = ctx.createRadialGradient(
        centerX + parallaxX * 0.3, centerY + parallaxY * 0.3, radius * 0.9,
        centerX, centerY, radius * 1.35
      );
      auraGlow.addColorStop(0, 'rgba(16, 185, 129, 0.25)');
      auraGlow.addColorStop(0.4, 'rgba(6, 182, 212, 0.12)');
      auraGlow.addColorStop(0.75, 'rgba(16, 185, 129, 0.03)');
      auraGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = auraGlow;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.35, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // -------------------------------------------------------------
      // 2. BASE EARTH DISK WITH DEEP OCEAN GRADIENT
      // -------------------------------------------------------------
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.clip(); // Clip all continents & graticule inside Earth disk

      const sunAngle = Math.PI * 0.72 + mouseNormRef.current.x * 0.55;
      const sunElevation = Math.sin(Math.PI * 0.28 - mouseNormRef.current.y * 0.45);
      const sunOffsetX = Math.cos(sunAngle) * radius * 0.6;
      const sunOffsetY = -sunElevation * radius * 0.6;

      const oceanGrad = ctx.createRadialGradient(
        centerX + sunOffsetX, centerY + sunOffsetY, radius * 0.08,
        centerX, centerY, radius * 1.15
      );
      oceanGrad.addColorStop(0, '#042217');    // Balanced ocean highlight
      oceanGrad.addColorStop(0.35, '#021810');  // Dark oceanic emerald
      oceanGrad.addColorStop(0.75, '#010e08');  // Deep ocean
      oceanGrad.addColorStop(1, '#000503');     // Night shadow side

      ctx.fillStyle = oceanGrad;
      ctx.fillRect(centerX - radius, centerY - radius, radius * 2, radius * 2);

      // -------------------------------------------------------------
      // 3. 3D GRATICULE GRID (Parallels & Meridians)
      // -------------------------------------------------------------
      ctx.lineWidth = 1;

      // Parallels
      for (let lat = -60; lat <= 60; lat += 30) {
        const radLat = (lat * Math.PI) / 180;
        const yBase = -Math.sin(radLat);
        const rBase = Math.cos(radLat);

        ctx.beginPath();
        let first = true;
        for (let a = 0; a <= 360; a += 10) {
          const radA = (a * Math.PI) / 180;
          const x = rBase * Math.sin(radA);
          const z = rBase * Math.cos(radA);

          const yRot = yBase * cosPitch - z * sinPitch;
          const zRot = yBase * sinPitch + z * cosPitch;

          if (zRot > -0.05) {
            const px = centerX + x * radius;
            const py = centerY + yRot * radius;
            if (first) {
              ctx.moveTo(px, py);
              first = false;
            } else {
              ctx.lineTo(px, py);
            }
          } else {
            first = true;
          }
        }
        ctx.strokeStyle = 'rgba(52, 211, 153, 0.14)';
        ctx.stroke();
      }

      // Meridians
      for (let lon = 0; lon < 360; lon += 30) {
        ctx.beginPath();
        let first = true;
        for (let lat = -80; lat <= 80; lat += 10) {
          const radLat = (lat * Math.PI) / 180;
          const radLon = ((lon + currentRot) * Math.PI) / 180;

          const x = Math.cos(radLat) * Math.sin(radLon);
          const y = -Math.sin(radLat);
          const z = Math.cos(radLat) * Math.cos(radLon);

          const yRot = y * cosPitch - z * sinPitch;
          const zRot = y * sinPitch + z * cosPitch;

          if (zRot > 0.05) {
            const px = centerX + x * radius;
            const py = centerY + yRot * radius;
            if (first) {
              ctx.moveTo(px, py);
              first = false;
            } else {
              ctx.lineTo(px, py);
            }
          } else {
            first = true;
          }
        }
        ctx.strokeStyle = 'rgba(52, 211, 153, 0.14)';
        ctx.stroke();
      }

      // -------------------------------------------------------------
      // 4. DENSE CONTINENT LANDMASS PARTICLES (Batched 60FPS Render)
      // -------------------------------------------------------------
      ctx.save();
      // First pass: World continent particles
      ctx.fillStyle = 'rgba(52, 211, 153, 0.48)';
      ctx.beginPath();
      GENERATED_LAND_GRID.forEach(([lat, lon]) => {
        const isSubcontinent = lat >= 8 && lat <= 36 && lon >= 68 && lon <= 92;
        if (isSubcontinent) return;

        const radLat = (lat * Math.PI) / 180;
        const radLon = ((lon + currentRot) * Math.PI) / 180;
        const x = Math.cos(radLat) * Math.sin(radLon);
        const y = -Math.sin(radLat);
        const z = Math.cos(radLat) * Math.cos(radLon);

        const yRot = y * cosPitch - z * sinPitch;
        const zRot = y * sinPitch + z * cosPitch;

        if (zRot > 0.03) {
          const px = centerX + x * radius;
          const py = centerY + yRot * radius;
          const pSize = 1.05 * (0.85 + zRot * 0.5);
          ctx.moveTo(px + pSize, py);
          ctx.arc(px, py, pSize, 0, Math.PI * 2);
        }
      });
      ctx.fill();

      // Second pass: Indian subcontinent highlighted cluster
      ctx.fillStyle = 'rgba(167, 243, 208, 0.85)';
      ctx.beginPath();
      GENERATED_LAND_GRID.forEach(([lat, lon]) => {
        const isSubcontinent = lat >= 8 && lat <= 36 && lon >= 68 && lon <= 92;
        if (!isSubcontinent) return;

        const radLat = (lat * Math.PI) / 180;
        const radLon = ((lon + currentRot) * Math.PI) / 180;
        const x = Math.cos(radLat) * Math.sin(radLon);
        const y = -Math.sin(radLat);
        const z = Math.cos(radLat) * Math.cos(radLon);

        const yRot = y * cosPitch - z * sinPitch;
        const zRot = y * sinPitch + z * cosPitch;

        if (zRot > 0.03) {
          const px = centerX + x * radius;
          const py = centerY + yRot * radius;
          const pSize = 1.35 * (0.85 + zRot * 0.55);
          ctx.moveTo(px + pSize, py);
          ctx.arc(px, py, pSize, 0, Math.PI * 2);
        }
      });
      ctx.fill();
      ctx.restore();

      // -------------------------------------------------------------
      // 5. HARDWARE-ACCELERATED 60FPS VECTOR WORLD MAP COASTLINES
      // -------------------------------------------------------------
      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#6ee7b7';
      ctx.lineWidth = 1.3;

      PREPARED_COASTLINES.forEach(polyline => {
        ctx.beginPath();
        let inPath = false;

        for (let i = 0; i < polyline.length - 1; i++) {
          const p1 = polyline[i];
          const p2 = polyline[i + 1];

          if (Math.abs(p2[1] - p1[1]) > 180) {
            if (inPath) {
              ctx.stroke();
              inPath = false;
            }
            continue;
          }

          const radLat1 = (p1[0] * Math.PI) / 180;
          const radLon1 = ((p1[1] + currentRot) * Math.PI) / 180;
          const x1 = Math.cos(radLat1) * Math.sin(radLon1);
          const y1 = -Math.sin(radLat1);
          const z1 = Math.cos(radLat1) * Math.cos(radLon1);
          const yRot1 = y1 * cosPitch - z1 * sinPitch;
          const zRot1 = y1 * sinPitch + z1 * cosPitch;

          const radLat2 = (p2[0] * Math.PI) / 180;
          const radLon2 = ((p2[1] + currentRot) * Math.PI) / 180;
          const x2 = Math.cos(radLat2) * Math.sin(radLon2);
          const y2 = -Math.sin(radLat2);
          const z2 = Math.cos(radLat2) * Math.cos(radLon2);
          const yRot2 = y2 * cosPitch - z2 * sinPitch;
          const zRot2 = y2 * sinPitch + z2 * cosPitch;

          const px1 = centerX + x1 * radius;
          const py1 = centerY + yRot1 * radius;
          const px2 = centerX + x2 * radius;
          const py2 = centerY + yRot2 * radius;

          if (zRot1 >= 0 && zRot2 >= 0) {
            if (!inPath) {
              ctx.beginPath();
              ctx.moveTo(px1, py1);
              inPath = true;
            }
            ctx.lineTo(px2, py2);
          } else if (zRot1 >= 0 && zRot2 < 0) {
            const t = zRot1 / (zRot1 - zRot2);
            const midX = x1 + t * (x2 - x1);
            const midY = yRot1 + t * (yRot2 - yRot1);
            if (!inPath) {
              ctx.beginPath();
              ctx.moveTo(px1, py1);
            }
            ctx.lineTo(centerX + midX * radius, centerY + midY * radius);
            ctx.stroke();
            inPath = false;
          } else if (zRot1 < 0 && zRot2 >= 0) {
            const t = zRot2 / (zRot2 - zRot1);
            const midX = x2 + t * (x1 - x2);
            const midY = yRot2 + t * (yRot1 - yRot2);
            ctx.beginPath();
            ctx.moveTo(centerX + midX * radius, centerY + midY * radius);
            ctx.lineTo(px2, py2);
            inPath = true;
          }
        }

        if (inPath) {
          ctx.stroke();
        }
      });
      ctx.restore();

      // -------------------------------------------------------------
      // 6. ATMOSPHERIC FRESNEL RIM
      // -------------------------------------------------------------
      const fresnel = ctx.createRadialGradient(
        centerX, centerY, radius * 0.72,
        centerX, centerY, radius
      );
      fresnel.addColorStop(0, 'rgba(0, 0, 0, 0)');
      fresnel.addColorStop(0.75, 'rgba(16, 185, 129, 0.12)');
      fresnel.addColorStop(0.92, 'rgba(52, 211, 153, 0.38)');
      fresnel.addColorStop(1, 'rgba(167, 243, 208, 0.78)');

      ctx.fillStyle = fresnel;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();

      // -------------------------------------------------------------
      // 7. PRECISE REAL-TIME TARGETING RETICLE
      // -------------------------------------------------------------
      const mouseCanvasX = mouseCanvasPosRef.current.x;
      const mouseCanvasY = mouseCanvasPosRef.current.y;
      const distToCenter = Math.hypot(mouseCanvasX - centerX, mouseCanvasY - centerY);

      if (distToCenter < radius - 3) {
        ctx.save();
        ctx.strokeStyle = 'rgba(52, 211, 153, 0.8)';
        ctx.lineWidth = 1.2;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.arc(mouseCanvasX, mouseCanvasY, 11, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(mouseCanvasX, mouseCanvasY, 2, 0, Math.PI * 2);
        ctx.fill();

        const dx = (mouseCanvasX - centerX) / radius;
        const dy = (mouseCanvasY - centerY) / radius;
        const dzSq = Math.max(0, 1 - dx * dx - dy * dy);
        const dz = Math.sqrt(dzSq);

        const unpitchedY = dy * cosPitch + dz * sinPitch;
        const unpitchedZ = -dy * sinPitch + dz * cosPitch;
        const unpitchedX = dx;

        const cursorLat = -Math.asin(Math.max(-1, Math.min(1, unpitchedY))) * (180 / Math.PI);
        let cursorLon = (Math.atan2(unpitchedX, unpitchedZ) * (180 / Math.PI)) - currentRot;
        cursorLon = ((cursorLon + 180) % 360 + 360) % 360 - 180;

        const regionName = getGeographicRegion(cursorLat, cursorLon);
        const latStr = `${Math.abs(cursorLat).toFixed(2)}°${cursorLat >= 0 ? 'N' : 'S'}`;
        const lonStr = `${Math.abs(cursorLon).toFixed(2)}°${cursorLon >= 0 ? 'E' : 'W'}`;
        const coordText = `${latStr} ${lonStr} · ${regionName}`;

        ctx.font = 'bold 9px JetBrains Mono, monospace';
        const coordWidth = ctx.measureText(coordText).width + 14;
        let coordX = mouseCanvasX + 14;
        let coordY = mouseCanvasY - 9;
        if (coordX + coordWidth > width - 10) coordX = mouseCanvasX - coordWidth - 12;
        if (coordY < 12) coordY = 12;

        ctx.fillStyle = 'rgba(6, 17, 12, 0.92)';
        ctx.strokeStyle = 'rgba(52, 211, 153, 0.5)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(coordX, coordY, coordWidth, 18, 4);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#6ee7b7';
        ctx.fillText(coordText, coordX + 7, coordY + 12);
        ctx.restore();
      }

      // Shockwave Ripples
      ripplesRef.current.forEach((rip, idx) => {
        rip.radius += 2.2;
        rip.alpha -= 0.025;
        if (rip.alpha <= 0) {
          ripplesRef.current.splice(idx, 1);
          return;
        }
        ctx.strokeStyle = `rgba(52, 211, 153, ${rip.alpha})`;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
        ctx.stroke();
      });

      ctx.restore(); // End clipping inside Earth disk

      // -------------------------------------------------------------
      // 8. ORBITAL SATELLITE TELEMETRY TRACK
      // -------------------------------------------------------------
      ctx.save();
      const orbitA = radius * 1.22;
      const orbitB = radius * 0.50;
      const orbitAngle = Math.PI * 0.18 + mouseNormRef.current.x * 0.04;

      ctx.translate(centerX, centerY);
      ctx.rotate(orbitAngle);

      ctx.strokeStyle = 'rgba(52, 211, 153, 0.18)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]);
      ctx.beginPath();
      ctx.ellipse(0, 0, orbitA, orbitB, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      const satX = Math.cos(satAngleRef.current) * orbitA;
      const satY = Math.sin(satAngleRef.current) * orbitB;

      const satGlow = ctx.createRadialGradient(satX, satY, 0, satX, satY, 10);
      satGlow.addColorStop(0, '#ffffff');
      satGlow.addColorStop(0.35, '#34d399');
      satGlow.addColorStop(1, 'rgba(16, 185, 129, 0)');

      ctx.fillStyle = satGlow;
      ctx.beginPath();
      ctx.arc(satX, satY, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // -------------------------------------------------------------
      // 9. AUTHENTIC PREVIOUS CO2e TELEMETRY PINS ON GLOBE SURFACE
      // -------------------------------------------------------------
      let currentHovered: TelemetryPoint | null = null;

      TELEMETRY_NODES.forEach(node => {
        const radLat = (node.lat * Math.PI) / 180;
        const radLon = ((node.lon + currentRot) * Math.PI) / 180;

        const x = Math.cos(radLat) * Math.sin(radLon);
        const y = -Math.sin(radLat);
        const z = Math.cos(radLat) * Math.cos(radLon);

        const yRot = y * cosPitch - z * sinPitch;
        const zRot = y * sinPitch + z * cosPitch;

        if (zRot > 0.16) {
          const px = centerX + x * radius;
          const py = centerY + yRot * radius;

          const distToMouse = Math.hypot(px - mouseCanvasPosRef.current.x, py - mouseCanvasPosRef.current.y);
          const isNodeHovered = distToMouse < 24;

          if (isNodeHovered) {
            currentHovered = node;
          }

          const depthAlpha = Math.min(1, Math.max(0.15, (zRot - 0.16) / 0.32));
          ctx.save();
          ctx.globalAlpha = isNodeHovered ? 1.0 : depthAlpha;

          const pulseTime = Date.now() * 0.003 + node.lat;
          const pulse = (Math.sin(pulseTime) + 1) / 2;

          // Surface connecting vector
          ctx.strokeStyle = isNodeHovered ? 'rgba(52, 211, 153, 0.95)' : 'rgba(52, 211, 153, 0.5)';
          ctx.lineWidth = isNodeHovered ? 1.5 : 1;
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(px, py - 11);
          ctx.stroke();

          // Radar pulse ring
          ctx.strokeStyle = `rgba(52, 211, 153, ${(1 - pulse) * (isNodeHovered ? 0.95 : 0.65)})`;
          ctx.lineWidth = isNodeHovered ? 1.8 : 1.2;
          ctx.beginPath();
          ctx.arc(px, py - 11, 3.5 + pulse * (isNodeHovered ? 14 : 9), 0, Math.PI * 2);
          ctx.stroke();

          // Center solid point beacon
          ctx.fillStyle = isNodeHovered ? '#ffffff' : '#34d399';
          ctx.beginPath();
          ctx.arc(px, py - 11, isNodeHovered ? 4 : 3, 0, Math.PI * 2);
          ctx.fill();

          // Badge tag with short label + exact CO2e metric
          ctx.font = 'bold 9px JetBrains Mono, monospace';
          const prefixText = `${node.shortLabel} · `;
          const metricText = node.metric;
          const prefixWidth = ctx.measureText(prefixText).width;
          const metricWidth = ctx.measureText(metricText).width;
          const badgeWidth = prefixWidth + metricWidth + 16;
          const badgeHeight = 20;

          let tagX = px + 8;
          let tagY = py - 23;

          if (tagX + badgeWidth > width - 12) tagX = px - badgeWidth - 8;
          if (tagY < 12) tagY = py + 6;
          if (tagX < 12) tagX = 12;

          ctx.fillStyle = isNodeHovered ? 'rgba(8, 22, 15, 0.96)' : 'rgba(5, 14, 9, 0.86)';
          ctx.strokeStyle = isNodeHovered ? '#34d399' : 'rgba(16, 185, 129, 0.45)';
          ctx.lineWidth = isNodeHovered ? 1.5 : 1;
          ctx.beginPath();
          ctx.roundRect(tagX, tagY, badgeWidth, badgeHeight, 5);
          ctx.fill();
          ctx.stroke();

          // Prefix label
          ctx.fillStyle = isNodeHovered ? '#6ee7b7' : '#94a3b8';
          ctx.fillText(prefixText, tagX + 8, tagY + 13);

          // Metric value
          ctx.fillStyle = isNodeHovered ? '#ffffff' : '#a7f3d0';
          ctx.fillText(metricText, tagX + 8 + prefixWidth, tagY + 13);

          ctx.restore();
        }
      });

      hoveredNodeRef.current = currentHovered;
      animationFrameId = requestAnimationFrame(render);
    };

    render(performance.now());

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', updateCachedRect);
      window.removeEventListener('pointermove', handleGlobalPointerMove);
      window.removeEventListener('pointerleave', handleGlobalPointerLeave);
    };
  }, []);

  // -------------------------------------------------------------
  // MOUSE & TOUCH DRAG ROTATION
  // -------------------------------------------------------------
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.setPointerCapture(e.pointerId);

    isDraggingRef.current = true;
    setIsInteracting(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      rot: rotationRef.current,
      pitch: pitchRef.current
    };

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    ripplesRef.current.push({
      x: clickX,
      y: clickY,
      radius: 2,
      maxRadius: 60,
      alpha: 0.85
    });

    if (hoveredNodeRef.current) {
      playSelectSound();
      setActiveTelemetry(hoveredNodeRef.current);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isDraggingRef.current) {
      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;

      rotationRef.current = dragStartRef.current.rot + deltaX * 0.42;
      velocityRotRef.current = deltaX * 0.06;

      const newPitch = dragStartRef.current.pitch - deltaY * 0.24;
      pitchRef.current = Math.max(5, Math.min(35, newPitch));
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (canvas && canvas.hasPointerCapture(e.pointerId)) {
      canvas.releasePointerCapture(e.pointerId);
    }
    isDraggingRef.current = false;
    setTimeout(() => setIsInteracting(false), 200);
  };

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-[400px] sm:h-[450px] max-w-[480px] flex items-center justify-center select-none ${className}`}
    >
      {/* 3D Earth Canvas */}
      <canvas 
        ref={canvasRef} 
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className={`w-full h-full object-contain touch-none transition-transform duration-100 ${
          isInteracting ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        style={{ filter: 'drop-shadow(0 0 35px rgba(16, 185, 129, 0.22))' }}
      />

      {/* Subtle Precision Telemetry HUD Indicators */}
      <div className="absolute top-2 left-4 right-4 flex items-center justify-between pointer-events-none z-10 font-mono text-[10px]">
        <div className="flex items-center gap-1.5 bg-[#05110a]/75 backdrop-blur-md px-2.5 py-1 rounded-full border border-emerald-500/25 text-emerald-300">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>NOAA CO₂: <strong className="text-white">426.92 ppm</strong></span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 bg-[#05110a]/75 backdrop-blur-md px-2.5 py-1 rounded-full border border-emerald-500/25 text-emerald-300">
          <span>CEA Grid: <strong className="text-white">716.2 g/kWh</strong></span>
        </div>
      </div>

      {/* Interactive Telemetry Node Detail Modal */}
      {activeTelemetry && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-xs p-4 rounded-2xl bg-[#08140e]/95 backdrop-blur-xl border border-emerald-500/50 shadow-2xl shadow-black/80 z-30 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-start justify-between gap-2 border-b border-emerald-900/50 pb-2 mb-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold tracking-wider">
                  {activeTelemetry.country}
                </span>
                <span className="text-[9px] font-mono text-zinc-400">
                  {activeTelemetry.lat >= 0 ? `${activeTelemetry.lat.toFixed(4)}°N` : `${Math.abs(activeTelemetry.lat).toFixed(4)}°S`}, {activeTelemetry.lon >= 0 ? `${activeTelemetry.lon.toFixed(4)}°E` : `${Math.abs(activeTelemetry.lon).toFixed(4)}°W`}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white leading-tight">
                {activeTelemetry.label}
              </h4>
            </div>
            <button
              onClick={() => setActiveTelemetry(null)}
              className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-emerald-950/40 text-xs font-bold"
            >
              ✕
            </button>
          </div>

          <div className="my-2 p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-between">
            <span className="text-xs text-zinc-300 font-mono">Telemetry</span>
            <span className="text-sm font-extrabold font-mono text-emerald-300">
              {activeTelemetry.metric}
            </span>
          </div>

          <p className="text-xs text-zinc-300 leading-relaxed">
            {activeTelemetry.subtext}
          </p>

          <div className="mt-2 text-[10px] font-mono text-zinc-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>Live Georeferenced CEA/IPCC Data Node</span>
          </div>
        </div>
      )}
    </div>
  );
};
