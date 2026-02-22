'use client';

import { FONTS } from '@/lib/game/constants';

interface DimBarProps {
  label: string;
  value: number;
  icon: string;
}

export function DimBar({ label, value, icon }: DimBarProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
      <span style={{ fontSize: 14, width: 18, textAlign: "center" }}>{icon}</span>
      <span style={{
        fontSize: 11, color: "rgba(255,255,255,0.4)", width: 70,
        fontFamily: FONTS.mono, letterSpacing: 0.5,
      }}>{label}</span>
      <div style={{
        flex: 1, height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 2,
        overflow: "hidden",
      }}>
        <div style={{
          width: `${value}%`,
          height: "100%",
          background: value > 60 ? "rgba(134,239,172,0.7)" : value > 30 ? "rgba(253,224,71,0.7)" : "rgba(248,113,113,0.8)",
          borderRadius: 2,
          transition: "width 0.8s ease, background 0.5s ease",
        }} />
      </div>
      <span style={{
        fontSize: 11, color: "rgba(255,255,255,0.3)", width: 28, textAlign: "right",
        fontFamily: FONTS.mono,
      }}>{value}</span>
    </div>
  );
}
