'use client';

import { FONTS, dimColor, dimBarColor } from '@/lib/game/constants';

interface DimBarProps {
  label: string;
  value: number;
}

export function DimBar({ label, value }: DimBarProps) {
  const barColor = dimBarColor(value);
  const textColor = dimColor(value);

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
        width: 60,
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
