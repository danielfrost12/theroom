'use client';

import { FONTS } from '@/lib/game/constants';

interface DimBarProps {
  label: string;
  value: number;
}

export function DimBar({ label, value }: DimBarProps) {
  // Color communicates health — gradient from red through amber to green
  const barColor = value > 60
    ? "rgba(134,239,172,0.6)"
    : value > 30
      ? "rgba(253,224,71,0.5)"
      : "rgba(248,113,113,0.6)";

  const textColor = value > 60
    ? "rgba(134,239,172,0.9)"
    : value > 30
      ? "rgba(253,224,71,0.85)"
      : "rgba(248,113,113,0.95)";

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
      {/* Label — abbreviated, quiet */}
      <span style={{
        fontSize: 10,
        color: "rgba(255,255,255,0.3)",
        fontFamily: FONTS.mono,
        letterSpacing: "1.5px",
        textTransform: "uppercase",
        width: 72,
        flexShrink: 0,
      }}>{label}</span>

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
        }} />
      </div>

      {/* Value — small, precise */}
      <span style={{
        fontSize: 13,
        fontWeight: 500,
        color: textColor,
        fontFamily: FONTS.mono,
        letterSpacing: "-0.5px",
        transition: "color 0.5s ease",
        width: 24,
        textAlign: "right",
        flexShrink: 0,
      }}>{value}</span>
    </div>
  );
}
