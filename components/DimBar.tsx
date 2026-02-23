'use client';

import { FONTS, dimColor, dimBarColor } from '@/lib/game/constants';

// What happens when each dimension hits 0 — the player needs to know the stakes
const DEATH_LABELS: Record<string, string> = {
  Company: '',
  People: '→ board removal',
  Energy: '→ burnout',
  Ethics: '→ disgrace',
};

interface DimBarProps {
  label: string;
  value: number;
  hideValue?: boolean;
}

export function DimBar({ label, value, hideValue }: DimBarProps) {
  const barColor = dimBarColor(value);
  const textColor = dimColor(value);
  const isDanger = value <= 25 && value > 0;
  const deathLabel = DEATH_LABELS[label] || '';

  return (
    <div
      role="meter"
      aria-label={label}
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "5px 0",
      }}
    >
      {/* Label — shows death consequence when critical */}
      <span style={{
        fontSize: 10,
        color: isDanger && deathLabel ? "rgba(248,113,113,0.7)" : "rgba(255,255,255,0.3)",
        fontFamily: FONTS.mono,
        letterSpacing: "1.5px",
        textTransform: "uppercase",
        width: 60,
        flexShrink: 0,
        transition: "color 0.5s ease",
      }}>
        {label}
      </span>

      {/* Bar track */}
      <div style={{
        flex: 1,
        height: 3,
        background: "rgba(255,255,255,0.04)",
        borderRadius: 2,
        overflow: "hidden",
        position: "relative",
      }}>
        {/* Fill */}
        <div style={{
          position: "absolute",
          left: 0, top: 0, bottom: 0,
          width: `${value}%`,
          background: barColor,
          borderRadius: 2,
          transition: "width 0.6s ease, background 0.6s ease",
          ...(isDanger && deathLabel ? { animation: "pulse 2s ease-in-out infinite" } : {}),
        }} />
      </div>

      {/* Value + death warning — when critical, show what kills you */}
      <span style={{
        fontSize: isDanger && deathLabel ? 9 : 13,
        fontWeight: 500,
        color: isDanger && deathLabel ? "rgba(248,113,113,0.8)" : textColor,
        fontFamily: FONTS.mono,
        letterSpacing: isDanger && deathLabel ? "0.5px" : "-0.5px",
        transition: "color 0.5s ease, opacity 2s ease",
        width: isDanger && deathLabel ? 72 : 24,
        textAlign: "right",
        flexShrink: 0,
        opacity: hideValue ? 0 : 1,
      }}>
        {isDanger && deathLabel ? deathLabel : value}
      </span>
    </div>
  );
}
