/**
 * Melatonin-Themed Smooth & Tickless Sound Engine for Ecolyse.
 * 
 * Features:
 * - Completely silent on hover (zero audio distraction while moving the cursor).
 * - 100% tickless audio on selection/clicks: zero transients, zero percussive clicks, zero high-pitched spikes.
 * - Pillowy 20-25ms soft fade-in attacks and velvety low-pass filtering (600Hz-700Hz).
 * - Gentle warm harmonic swells inspired by ambient Rhodes and singing bowls.
 */
import { useState, useEffect } from 'react';

// Singleton AudioContext reference
let audioCtx: AudioContext | null = null;
let isMuted: boolean = false;

// Initialize mute state from localStorage
if (typeof window !== 'undefined') {
  try {
    const saved = localStorage.getItem('ecolyse_sound_muted') ?? localStorage.getItem('carbonzero_sound_muted');
    if (saved !== null) {
      isMuted = saved === 'true';
    }
  } catch {
    // Ignore localStorage access errors
  }

  // Auto-unlock AudioContext on first user interaction so sounds play smoothly
  const unlockAudio = () => {
    try {
      if (!audioCtx) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          audioCtx = new AudioContextClass();
        }
      }
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
    } catch {
      // Ignore
    }
  };

  window.addEventListener('pointerdown', unlockAudio, { once: true, passive: true });
  window.addEventListener('keydown', unlockAudio, { once: true, passive: true });
  window.addEventListener('touchstart', unlockAudio, { once: true, passive: true });
}

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Hover sound is intentionally silent per user request.
 * Keeps cursor exploration calm, smooth, and distraction-free.
 */
export function playHoverSound(): void {
  // Silent on hover
}

/**
 * Subtle, smooth, 100% tickless warm ambient bloom when clicking an option.
 * Zero transient attack (22ms soft ramp), lowpass filtered at 620Hz, soothing to the ears.
 */
export function playSelectSound(): void {
  if (isMuted) return;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const t = ctx.currentTime;

    // Warm Bessel-like lowpass filter to remove any high-frequency edge or tick
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(620, t);
    filter.Q.setValueAtTime(0.7, t);

    // Pillowy master envelope: 22ms soft fade-in (zero click/tick), lush 180ms warm decay
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.linearRampToValueAtTime(0.042, t + 0.022);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.20);

    filter.connect(gain);
    gain.connect(ctx.destination);

    // Fundamental: Warm, soothing D4 (293.66Hz)
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(293.66, t);

    // Subtle overtone: Warm fifth A4 (440.00Hz) at lower volume for gentle harmonic depth
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(440.00, t);
    gain2.gain.setValueAtTime(0.35, t);

    osc1.connect(filter);
    osc2.connect(gain2);
    gain2.connect(filter);

    osc1.start(t);
    osc2.start(t);

    osc1.stop(t + 0.22);
    osc2.stop(t + 0.22);
  } catch {
    // Fail silently
  }
}

/**
 * Smooth, tickless binary toggle sound.
 * Soft 20ms attack, zero click, gentle warm harmonic shift.
 */
export function playToggleSound(active: boolean): void {
  if (isMuted) return;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // Gentle warm fifth: F4 (349Hz) to C5 (523Hz)
    if (active) {
      osc.frequency.setValueAtTime(349.23, t);
      osc.frequency.exponentialRampToValueAtTime(440.00, t + 0.12);
    } else {
      osc.frequency.setValueAtTime(440.00, t);
      osc.frequency.exponentialRampToValueAtTime(349.23, t + 0.12);
    }

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(580, t);
    filter.Q.setValueAtTime(0.7, t);

    // 20ms soft attack, 160ms decay — completely tickless
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.linearRampToValueAtTime(0.038, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.20);
  } catch {
    // Fail silently
  }
}

/**
 * Tickless, serene Melatonin two-tone ambient swell when advancing categories.
 * Gentle F4 (349Hz) -> A4 (440Hz), 24ms soft attack, warm 240ms decay.
 */
export function playNextSound(): void {
  if (isMuted) return;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    const notes = [293.66, 369.99, 440.00]; // D4, F#4, A4 (D Major warm chord)

    notes.forEach((freq, i) => {
      const startTime = t + i * 0.06;
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(650, startTime);
      filter.Q.setValueAtTime(0.7, startTime);

      // Pillowy 22ms attack, zero transients
      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(0.035, startTime + 0.022);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.22);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.24);
    });
  } catch {
    // Fail silently
  }
}

/**
 * Tickless gentle descending warm swell when navigating back.
 */
export function playBackSound(): void {
  if (isMuted) return;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    const notes = [440.00, 369.99];

    notes.forEach((freq, i) => {
      const startTime = t + i * 0.055;
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, startTime);

      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(0.032, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.18);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.20);
    });
  } catch {
    // Fail silently
  }
}

let lastSliderPlayTime = 0;
let lastSliderValue: number | null = null;

/**
 * Proper smooth, tickless melodic audio for range sliders.
 * Emits a warm, lowpass-filtered sine droplet with pitch gracefully proportional
 * to the slider progress. Throttled to prevent audio stuttering during rapid dragging.
 */
export function playSliderSound(value: number = 50, min: number = 0, max: number = 100): void {
  if (isMuted) return;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    
    // Throttle to max ~25 events/sec (every 40ms) during rapid drag, while still responding instantly to single steps
    if (t - lastSliderPlayTime < 0.040) {
      return;
    }
    if (lastSliderValue === value && t - lastSliderPlayTime < 0.080) {
      return;
    }

    lastSliderPlayTime = t;
    lastSliderValue = value;

    const range = max - min || 1;
    const ratio = Math.max(0, Math.min(1, (value - min) / range));

    // Smooth, warm melodic pitch mapping: C4 (261Hz) up to D5 (587Hz)
    const baseFreq = 261.63 + ratio * 325.7;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    const gain2 = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    const masterGain = ctx.createGain();

    // Fundamental warm sine
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(baseFreq, t);

    // Subtle warm harmonic fifth (1.5x) for lo-fi Rhodes acoustic timbre
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(baseFreq * 1.5, t);

    gain1.gain.setValueAtTime(0.85, t);
    gain2.gain.setValueAtTime(0.18, t);

    // Deep lowpass filter to completely eliminate clicks, pops, and high-frequency edge
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(Math.min(650, baseFreq * 1.8), t);
    filter.Q.setValueAtTime(0.6, t);

    // Pillowy, 100% tickless envelope: 12ms soft linear fade-in, 75ms warm decay
    masterGain.gain.setValueAtTime(0.0001, t);
    masterGain.gain.linearRampToValueAtTime(0.038, t + 0.012);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.085);

    osc1.connect(gain1);
    osc2.connect(gain2);
    gain1.connect(filter);
    gain2.connect(filter);
    filter.connect(masterGain);
    masterGain.connect(ctx.destination);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 0.09);
    osc2.stop(t + 0.09);
  } catch {
    // Fail silently
  }
}

/** Backwards-compatible alias */
export const playSliderTick = playSliderSound;

/**
 * Deep, meditative singing-bowl fade when resetting values.
 */
export function playResetSound(): void {
  if (isMuted) return;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(329.63, t); // E4
    osc.frequency.exponentialRampToValueAtTime(220.00, t + 0.26); // A3

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(500, t);

    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.linearRampToValueAtTime(0.04, t + 0.028);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.30);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.32);
  } catch {
    // Fail silently
  }
}

/**
 * Sound mute state management
 */
export function getSoundMuted(): boolean {
  return isMuted;
}

export function setSoundMuted(muted: boolean): void {
  isMuted = muted;
  try {
    localStorage.setItem('ecolyse_sound_muted', String(muted));
    window.dispatchEvent(new CustomEvent('ecolyse_sound_change', { detail: { muted } }));
  } catch {
    // Ignore
  }
}

export function toggleSound(): boolean {
  setSoundMuted(!isMuted);
  if (!isMuted) {
    playSelectSound();
  }
  return isMuted;
}

/**
 * React hook to listen to mute state changes and trigger sounds
 */
export function useSoundState() {
  const [muted, setMuted] = useState<boolean>(() => getSoundMuted());

  useEffect(() => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<{ muted: boolean }>;
      if (customEvent.detail) {
        setMuted(customEvent.detail.muted);
      }
    };
    window.addEventListener('ecolyse_sound_change', handler);
    return () => window.removeEventListener('ecolyse_sound_change', handler);
  }, []);

  return {
    isMuted: muted,
    toggleSound,
    playHover: playHoverSound,
    playSelect: playSelectSound,
    playSlider: playSliderSound,
  };
}
