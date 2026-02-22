'use client';

import { ReactNode } from 'react';
import { UNSPLASH_SCENES } from '@/lib/game/constants';

interface SceneBackgroundProps {
  sceneKey: string;
  children: ReactNode;
}

export function SceneBackground({ sceneKey, children }: SceneBackgroundProps) {
  const url = UNSPLASH_SCENES[sceneKey] || UNSPLASH_SCENES.office_morning;
  const warmScenes = ["office_morning", "coffee_shop", "coworking", "rooftop"];
  const isWarm = warmScenes.includes(sceneKey);
  const overlay = isWarm
    ? "linear-gradient(180deg, rgba(10,8,5,0.40) 0%, rgba(8,6,4,0.50) 50%, rgba(5,5,5,0.65) 100%)"
    : "linear-gradient(135deg, rgba(10,10,15,0.82) 0%, rgba(15,12,20,0.78) 50%, rgba(10,10,15,0.85) 100%)";
  return (
    <div style={{
      position: "fixed", inset: 0,
      backgroundImage: `url(${url})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      transition: "background-image 2s ease",
    }}>
      <div style={{
        position: "absolute", inset: 0,
        background: overlay,
        backdropFilter: "blur(2px)",
        transition: "background 2s ease",
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
