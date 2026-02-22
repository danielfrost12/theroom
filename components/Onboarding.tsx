'use client';

import { useState, useEffect } from 'react';
import { FONTS } from '@/lib/game/constants';
import { getPlayerStats } from '@/lib/game/stats';

interface OnboardingProps {
  onStart: () => void;
}

export function Onboarding({ onStart }: OnboardingProps) {
  const [phase, setPhase] = useState(0);
  const stats = getPlayerStats();

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 400),
      setTimeout(() => setPhase(2), 1800),
      setTimeout(() => setPhase(3), 3200),
      setTimeout(() => setPhase(4), 4600),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div
      onClick={phase >= 4 ? onStart : undefined}
      style={{
        position: "fixed", inset: 0, cursor: phase >= 4 ? "pointer" : "default",
        backgroundImage: "url(https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1400&q=85)",
        backgroundSize: "cover",
        backgroundPosition: "center 40%",
        overflow: "hidden",
      }}
    >
      {/* Light warm overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(180deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.65) 85%, rgba(0,0,0,0.82) 100%)",
      }} />

      {/* Subtle warm vignette */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.2) 100%)",
        opacity: phase >= 1 ? 1 : 0,
        transition: "opacity 3s ease",
        pointerEvents: "none",
      }} />

      {/* Content */}
      <div style={{
        position: "relative", zIndex: 1,
        display: "flex", flexDirection: "column",
        justifyContent: "flex-end",
        minHeight: "100vh",
        padding: "0 32px 60px",
        fontFamily: FONTS.body,
      }}>
        {/* Phase 1: Ambient scene-setting text */}
        <div style={{
          opacity: phase >= 1 ? 1 : 0,
          transform: phase >= 1 ? "translateY(0)" : "translateY(12px)",
          transition: "all 1.5s ease",
          marginBottom: 28,
        }}>
          <div style={{
            fontFamily: FONTS.display,
            fontSize: "clamp(14px, 2.5vw, 16px)",
            color: "rgba(255,255,255,0.75)",
            fontStyle: "italic",
            fontWeight: 300,
            lineHeight: 1.7,
            letterSpacing: "0.3px",
            textShadow: "0 1px 8px rgba(0,0,0,0.5)",
          }}>
            Monday morning. First day. The office smells like fresh paint and coffee.
          </div>
        </div>

        {/* Phase 2: Title */}
        <div style={{
          opacity: phase >= 2 ? 1 : 0,
          transform: phase >= 2 ? "translateY(0)" : "translateY(12px)",
          transition: "all 1.2s ease",
          marginBottom: 14,
        }}>
          <div style={{
            fontFamily: FONTS.display,
            fontSize: "clamp(38px, 8vw, 56px)",
            fontWeight: 700,
            color: "#fff",
            letterSpacing: "-1.5px",
            lineHeight: 1.05,
          }}>
            The Room
          </div>
          <div style={{
            fontSize: 16,
            color: "rgba(255,255,255,0.55)",
            fontWeight: 300,
            marginTop: 8,
            lineHeight: 1.4,
          }}>
            Build a company. See how the story ends.
          </div>
        </div>

        {/* Phase 3: Social proof */}
        <div style={{
          opacity: phase >= 3 ? 1 : 0,
          transform: phase >= 3 ? "translateY(0)" : "translateY(8px)",
          transition: "all 1s ease",
          marginBottom: 32,
        }}>
          <div style={{
            display: "flex", gap: 20, flexWrap: "wrap",
          }}>
            {[
              { n: stats.totalPlayers, label: "CEOs played" },
              { n: stats.avgWeeks, label: "avg lasted" },
              { n: stats.ipoRate, label: "made it to IPO" },
            ].map((s, i) => (
              <div key={i}>
                <span style={{
                  fontFamily: FONTS.mono, fontSize: 16, fontWeight: 700, color: "#fff",
                }}>{s.n}</span>
                <span style={{
                  fontSize: 12, color: "rgba(255,255,255,0.35)", marginLeft: 6,
                }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Phase 4: Entry prompt */}
        <div style={{
          opacity: phase >= 4 ? 1 : 0,
          transition: "opacity 1.2s ease",
        }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <div style={{
              width: 6, height: 6, borderRadius: "50%",
              background: "rgba(255,255,255,0.5)",
              animation: "pulse 2s infinite",
            }} />
            <span style={{
              fontFamily: FONTS.mono,
              fontSize: 13,
              color: "rgba(255,255,255,0.40)",
              letterSpacing: "1px",
            }}>
              TAP ANYWHERE TO BEGIN
            </span>
          </div>
          <div style={{
            fontSize: 11,
            color: "rgba(255,255,255,0.20)",
            marginTop: 8,
            fontFamily: FONTS.mono,
          }}>
            ~20 min &middot; 52 weeks &middot; &infin; endings
          </div>
        </div>
      </div>
    </div>
  );
}
