'use client';

import { ReactNode } from 'react';

interface SceneBackgroundProps {
  sceneKey: string;
  children: ReactNode;
}

// Emotional gradients — the room changes with the state of the company.
// No photos. Color IS the atmosphere.
const SCENE_GRADIENTS: Record<string, string> = {
  // Morning optimism — warm dark with a hint of amber
  office_morning: "radial-gradient(ellipse at 30% 20%, rgba(45,30,15,0.4) 0%, rgba(10,10,12,1) 70%)",
  // Late night grind — deep blue-black, cold
  office_night: "radial-gradient(ellipse at 70% 80%, rgba(15,20,40,0.5) 0%, rgba(8,8,14,1) 70%)",
  // Coffee shop — warm, slightly lighter, social
  coffee_shop: "radial-gradient(ellipse at 50% 40%, rgba(40,28,15,0.35) 0%, rgba(12,10,10,1) 70%)",
  // Boardroom — cool, serious, grey-blue
  boardroom: "radial-gradient(ellipse at 50% 30%, rgba(20,25,35,0.45) 0%, rgba(10,10,15,1) 70%)",
  // Apartment alone at night — isolating, dark with warm edge
  apartment_night: "radial-gradient(ellipse at 80% 70%, rgba(35,20,10,0.3) 0%, rgba(6,6,8,1) 70%)",
  // Rooftop — expansive, deep navy, a glimpse of sky
  rooftop: "radial-gradient(ellipse at 50% 10%, rgba(20,30,50,0.4) 0%, rgba(8,10,18,1) 70%)",
  // Airport — sterile, cold white-blue glow
  airport: "radial-gradient(ellipse at 50% 50%, rgba(25,30,40,0.35) 0%, rgba(10,12,18,1) 70%)",
  // Integrity crisis — deep bruised purple-black
  bar: "radial-gradient(ellipse at 40% 60%, rgba(30,15,30,0.4) 0%, rgba(8,6,12,1) 70%)",
  // Coworking — energetic, slight green-teal warmth
  coworking: "radial-gradient(ellipse at 40% 30%, rgba(15,30,25,0.35) 0%, rgba(8,12,12,1) 70%)",
  // Park bench — solitary, muted green-grey
  park_bench: "radial-gradient(ellipse at 60% 50%, rgba(20,25,18,0.3) 0%, rgba(8,10,8,1) 70%)",
  // Hospital/crisis — harsh, slightly clinical
  hospital: "radial-gradient(ellipse at 50% 40%, rgba(25,25,30,0.4) 0%, rgba(10,10,14,1) 70%)",
  // Elevator — transitional, neutral
  elevator: "radial-gradient(ellipse at 50% 50%, rgba(20,20,22,0.35) 0%, rgba(10,10,12,1) 70%)",
};

export function SceneBackground({ sceneKey, children }: SceneBackgroundProps) {
  const gradient = SCENE_GRADIENTS[sceneKey] || SCENE_GRADIENTS.office_morning;

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "#0a0a0f",
    }}>
      {/* Emotional gradient layer */}
      <div style={{
        position: "absolute", inset: 0,
        background: gradient,
        transition: "background 3s ease",
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
