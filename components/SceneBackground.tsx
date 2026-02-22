'use client';

import { ReactNode, useMemo } from 'react';

interface SceneBackgroundProps {
  sceneKey: string;
  children: ReactNode;
  // Emotional state drives the atmosphere — optional, falls back to sceneKey mapping
  mood?: {
    energy: number;       // 0-100: cold/clinical → warm/alive
    tension: number;      // 0-100: calm → urgent
    relationships: number; // 0-100: isolated → connected
    integrity: number;    // 0-100: corrupted → clean
  };
}

// Compute a living gradient from emotional state
function moodToGradient(mood: { energy: number; tension: number; relationships: number; integrity: number }): {
  primary: string;
  secondary: string;
  position1: string;
  position2: string;
} {
  const { energy, tension, relationships, integrity } = mood;

  // Base warmth: energy drives warm vs cold
  // High energy = warm amber/honey. Low energy = cool steel-blue.
  // Values pushed significantly higher so the gradient is VISIBLE on dark backgrounds.
  const warmR = Math.round(40 + (energy / 100) * 80);   // 40-120 (was 15-50)
  const warmG = Math.round(25 + (energy / 100) * 45);   // 25-70  (was 10-32)
  const warmB = Math.round(10 + (1 - energy / 100) * 50); // 60-10 (was 38-8)

  // Tension adds red/urgency
  const tensionR = Math.round((tension / 100) * 25);     // 0-25 (was 0-15)
  const tensionShift = tension > 70 ? 0.15 : tension > 40 ? 0.08 : 0;

  // Low integrity = bruised purple undertone
  const intPurple = integrity < 40 ? Math.round((1 - integrity / 40) * 30) : 0;

  // Low relationships = isolating — gradient pulls to edges
  const relPosition = relationships < 35 ? "80% 70%" : relationships > 65 ? "35% 35%" : "50% 40%";

  // Primary light source — the warm glow in the room
  const r1 = Math.min(140, warmR + tensionR);
  const g1 = Math.max(10, warmG - Math.round(tensionShift * 100));
  const b1 = warmB + intPurple;
  const alpha1 = 0.18 + (tension / 100) * 0.14; // 0.18-0.32 — visible but not garish

  // Secondary ambient — slightly warmer than before, gives depth
  const r2 = Math.round(20 + (1 - energy / 100) * 15);
  const g2 = Math.round(22 + (relationships / 100) * 18);
  const b2 = Math.round(30 + (1 - integrity / 100) * 20);

  return {
    primary: `rgba(${r1},${g1},${b1},${alpha1.toFixed(2)})`,
    secondary: `rgba(${r2},${g2},${b2},0.12)`,
    position1: relPosition,
    position2: tension > 60 ? "70% 80%" : "50% 70%",
  };
}

// Fallback: map old scene keys to approximate moods for non-game screens
const SCENE_MOODS: Record<string, { energy: number; tension: number; relationships: number; integrity: number }> = {
  office_morning: { energy: 65, tension: 20, relationships: 60, integrity: 75 },
  office_night: { energy: 35, tension: 50, relationships: 45, integrity: 60 },
  coffee_shop: { energy: 55, tension: 15, relationships: 70, integrity: 70 },
  boardroom: { energy: 45, tension: 65, relationships: 50, integrity: 55 },
  apartment_night: { energy: 20, tension: 40, relationships: 25, integrity: 50 },
  rooftop: { energy: 60, tension: 30, relationships: 55, integrity: 65 },
  airport: { energy: 40, tension: 35, relationships: 40, integrity: 60 },
  bar: { energy: 30, tension: 55, relationships: 35, integrity: 25 },
  coworking: { energy: 70, tension: 20, relationships: 65, integrity: 70 },
  park_bench: { energy: 35, tension: 25, relationships: 25, integrity: 55 },
  hospital: { energy: 15, tension: 70, relationships: 30, integrity: 45 },
  elevator: { energy: 45, tension: 30, relationships: 50, integrity: 60 },
};

export function SceneBackground({ sceneKey, children, mood }: SceneBackgroundProps) {
  const effectiveMood = mood || SCENE_MOODS[sceneKey] || SCENE_MOODS.office_morning;

  const gradient = useMemo(() => {
    const g = moodToGradient(effectiveMood);
    return [
      `radial-gradient(ellipse at ${g.position1}, ${g.primary} 0%, transparent 60%)`,
      `radial-gradient(ellipse at ${g.position2}, ${g.secondary} 0%, transparent 50%)`,
    ].join(', ');
  }, [effectiveMood]);

  // Breathing animation speed — calmer when things are good, faster when tense
  const breathDuration = effectiveMood.tension > 60 ? 6 : effectiveMood.tension > 35 ? 10 : 16;

  // Dimension-as-atmosphere: the world gets darker as things deteriorate
  // Low average = darker gradient — but never fully gone. Even dying has light.
  const dimAvg = (effectiveMood.energy + effectiveMood.relationships + effectiveMood.integrity) / 3;
  const gradientOpacity = dimAvg > 60 ? 1.0 : dimAvg > 35 ? 0.8 : 0.55;

  // Vignette intensifies with isolation (low relationships) and corruption (low integrity)
  const vignetteStrength = Math.min(0.6,
    0.3 + (1 - effectiveMood.relationships / 100) * 0.15 + (1 - effectiveMood.integrity / 100) * 0.15
  );

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "#0a0a0f",
    }}>
      {/* Primary emotional gradient — breathes slowly, dims with deterioration */}
      <div style={{
        position: "absolute", inset: 0,
        background: gradient,
        transition: "background 4s ease, opacity 3s ease",
        animation: `breathe ${breathDuration}s ease-in-out infinite`,
        opacity: gradientOpacity,
      }} />

      {/* Subtle noise texture for depth */}
      <div style={{
        position: "absolute", inset: 0,
        opacity: 0.03,
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        backgroundRepeat: "repeat",
        backgroundSize: "256px 256px",
        pointerEvents: "none",
      }} />

      {/* Vignette — intensifies with isolation and moral compromise */}
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse at 50% 45%, transparent 25%, rgba(0,0,0,${vignetteStrength}) 100%)`,
        transition: "background 4s ease",
        pointerEvents: "none",
      }} />

      <div style={{
        position: "relative", zIndex: 1,
        width: "100%", height: "100%",
        overflowY: "auto",
      }}>
        {children}
      </div>
    </div>
  );
}
