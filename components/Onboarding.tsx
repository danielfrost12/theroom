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
      role={phase >= 4 ? "button" : undefined}
      tabIndex={phase >= 4 ? 0 : undefined}
      aria-label={phase >= 4 ? "Start the game" : undefined}
      onClick={phase >= 4 ? onStart : undefined}
      onKeyDown={phase >= 4 ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onStart(); } } : undefined}
      style={{
        position: "fixed", inset: 0, cursor: phase >= 4 ? "pointer" : "default",
        background: "#0a0a0f",
        overflow: "hidden",
        outline: "none",
        WebkitTapHighlightColor: "transparent",
        touchAction: "manipulation",
      }}
    >
      {/* Warm ambient gradient — the first thing you see should feel like a room, not a void */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at 30% 80%, rgba(90,55,20,0.3) 0%, transparent 55%)",
        opacity: phase >= 1 ? 1 : 0,
        transition: "opacity 3s ease",
      }} />

      {/* Second subtle light source — cool complement */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at 70% 20%, rgba(30,35,60,0.2) 0%, transparent 50%)",
        opacity: phase >= 2 ? 1 : 0,
        transition: "opacity 4s ease",
        pointerEvents: "none",
      }} />

      {/* Content — uses dvh to fit within visible viewport on mobile */}
      <div style={{
        position: "relative", zIndex: 1,
        display: "flex", flexDirection: "column",
        justifyContent: "flex-end",
        height: "100dvh",
        padding: "env(safe-area-inset-top, 0px) max(24px, env(safe-area-inset-right, 0px)) max(32px, env(safe-area-inset-bottom, 0px)) max(24px, env(safe-area-inset-left, 0px))",
        fontFamily: FONTS.body,
        boxSizing: "border-box",
      }}>
        {/* Phase 1: Ambient scene-setting text */}
        <div style={{
          opacity: phase >= 1 ? 1 : 0,
          transform: phase >= 1 ? "translateY(0)" : "translateY(12px)",
          transition: "all 1.5s ease",
          marginBottom: 20,
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
            {stats.isReturning
              ? "You know this feeling. The laptop. The choices. The weight."
              : "Monday morning. First day. The office smells like fresh paint and coffee."}
          </div>
        </div>

        {/* Phase 2: Title */}
        <div style={{
          opacity: phase >= 2 ? 1 : 0,
          transform: phase >= 2 ? "translateY(0)" : "translateY(12px)",
          transition: "all 1.2s ease",
          marginBottom: 12,
        }}>
          <h1 style={{
            fontFamily: FONTS.display,
            fontSize: "clamp(36px, 8vw, 56px)",
            fontWeight: 700,
            color: "#fff",
            letterSpacing: "-1.5px",
            lineHeight: 1.05,
          }}>
            The Room
          </h1>
          <p style={{
            fontSize: 15,
            color: "rgba(255,255,255,0.55)",
            fontWeight: 300,
            marginTop: 6,
            lineHeight: 1.4,
          }}>
            Build a company. See how the story ends.
          </p>
        </div>

        {/* Phase 3: Social proof */}
        <div style={{
          opacity: phase >= 3 ? 1 : 0,
          transform: phase >= 3 ? "translateY(0)" : "translateY(8px)",
          transition: "all 1s ease",
          marginBottom: 24,
        }}>
          <div style={{
            display: "flex", gap: 16, flexWrap: "wrap",
          }}>
            {stats.isReturning ? (
              <>
                {[
                  { n: stats.totalPlayers, label: "" },
                  { n: stats.avgWeeks, label: "" },
                  { n: `$${stats.bestValuation}M`, label: "best" },
                ].map((s, i) => (
                  <div key={i}>
                    <span style={{
                      fontFamily: FONTS.mono, fontSize: 14, fontWeight: 700, color: "#fff",
                    }}>{s.n}</span>
                    {s.label && (
                      <span style={{
                        fontSize: 11, color: "rgba(255,255,255,0.35)", marginLeft: 5,
                      }}>{s.label}</span>
                    )}
                  </div>
                ))}
              </>
            ) : (
              <>
                {[
                  { n: stats.totalPlayers, label: "CEOs played" },
                  { n: stats.avgWeeks, label: "avg lasted" },
                  { n: stats.ipoRate, label: "made it to IPO" },
                ].map((s, i) => (
                  <div key={i}>
                    <span style={{
                      fontFamily: FONTS.mono, fontSize: 14, fontWeight: 700, color: "#fff",
                    }}>{s.n}</span>
                    <span style={{
                      fontSize: 11, color: "rgba(255,255,255,0.35)", marginLeft: 5,
                    }}>{s.label}</span>
                  </div>
                ))}
              </>
            )}
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
              fontSize: 12,
              color: "rgba(255,255,255,0.40)",
              letterSpacing: "1px",
            }}>
              {stats.isReturning ? "TAP ANYWHERE TO TRY AGAIN" : "TAP ANYWHERE TO BEGIN"}
            </span>
          </div>
          <div style={{
            fontSize: 11,
            color: "rgba(255,255,255,0.20)",
            marginTop: 6,
            fontFamily: FONTS.mono,
          }}>
            ~10 min &middot; 24 weeks &middot; &infin; endings
          </div>
        </div>
      </div>
    </div>
  );
}
