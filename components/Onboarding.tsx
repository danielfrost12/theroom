'use client';

import { useState, useEffect } from 'react';
import { FONTS } from '@/lib/game/constants';
import { getPlayerStats, getCollectionStats, getLastPlay } from '@/lib/game/stats';

interface OnboardingProps {
  onStart: () => void;
}

export function Onboarding({ onStart }: OnboardingProps) {
  const [phase, setPhase] = useState(0);
  const stats = getPlayerStats();
  const collection = stats.isReturning ? getCollectionStats() : null;
  const lastPlay = stats.isReturning ? getLastPlay() : null;

  useEffect(() => {
    const timers = stats.isReturning
      ? [
          setTimeout(() => setPhase(1), 400),
          setTimeout(() => setPhase(2), 1600),
          setTimeout(() => setPhase(3), 3000),
          setTimeout(() => setPhase(4), 4200),
        ]
      : [
          setTimeout(() => setPhase(1), 600),
          setTimeout(() => setPhase(2), 2200),
          setTimeout(() => setPhase(3), 4000),
          setTimeout(() => setPhase(4), 5800),
        ];
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // What haunts the returning player — specific regret from their last game
  const hauntLine = (() => {
    if (!lastPlay) return null;
    switch (lastPlay.ending) {
      case 'burnout':
        return "Last time, you didn't stop. You knew. Everyone knew.";
      case 'bankrupt':
        return `${lastPlay.companyName || 'Your company'} ran out of time. You always wonder if one more week would have changed it.`;
      case 'disgraced':
        return "You told yourself it was one small compromise. It wasn't.";
      case 'board_removed':
        return "They took it from you. The company you built. They said it was necessary.";
      case 'forced_sale':
        return "You signed it away. The term sheet felt like a death certificate.";
      case 'ipo':
        return `${lastPlay.companyName || 'Your company'} made it. But you left something behind to get there.`;
      case 'acquired':
        return "They bought it. Everyone celebrated. You felt nothing.";
      default:
        return "Time ran out. The story ended mid-sentence.";
    }
  })();

  return (
    <div
      role={phase >= 4 ? "button" : undefined}
      tabIndex={phase >= 4 ? 0 : undefined}
      aria-label={phase >= 4 ? "Start the game" : undefined}
      onClick={phase >= 4 ? onStart : undefined}
      onKeyDown={phase >= 4 ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onStart(); } } : undefined}
      style={{
        position: "fixed", top: "-5vh", left: 0,
        width: "100vw", height: "calc(100dvh + 10vh)",
        cursor: phase >= 4 ? "pointer" : "default",
        background: "#0a0a0f",
        overflow: "hidden",
        outline: "none",
        WebkitTapHighlightColor: "transparent",
        touchAction: "manipulation",
      }}
    >
      {/* Warm ambient gradient — the first thing you see should feel like a room, not a void */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        width: "100%", height: "100%",
        background: "radial-gradient(ellipse 80% 60% at 30% 75%, rgba(90,55,20,0.3) 0%, rgba(90,55,20,0.1) 40%, rgba(10,10,15,0) 70%)",
        opacity: phase >= 1 ? 1 : 0,
        transition: "opacity 3s ease",
      }} />

      {/* Second subtle light source — cool complement */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        width: "100%", height: "100%",
        background: "radial-gradient(ellipse 70% 50% at 70% 20%, rgba(30,35,60,0.2) 0%, rgba(30,35,60,0.05) 40%, rgba(10,10,15,0) 65%)",
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
        {/* --- FIRST-TIME PLAYER --- */}
        {!stats.isReturning && (
          <>
            {/* Phase 1: The flattery — then the dare */}
            <div style={{
              opacity: phase >= 1 ? 1 : 0,
              transform: phase >= 1 ? "translateY(0)" : "translateY(12px)",
              transition: "all 1.5s ease",
              marginBottom: 20,
            }}>
              <div style={{
                fontFamily: FONTS.display,
                fontSize: "clamp(15px, 3vw, 18px)",
                color: "rgba(255,255,255,0.5)",
                fontStyle: "italic",
                fontWeight: 300,
                lineHeight: 1.7,
                letterSpacing: "0.3px",
              }}>
                You&apos;d make a great founder. Everyone says so.
              </div>
              <div style={{
                fontFamily: FONTS.display,
                fontSize: "clamp(28px, 7vw, 42px)",
                color: "rgba(255,255,255,0.85)",
                fontWeight: 600,
                letterSpacing: "-0.5px",
                marginTop: 8,
                opacity: 0,
                animation: phase >= 1 ? "fadeUp 1s ease 1.2s forwards" : "none",
              }}>
                Prove it.
              </div>
            </div>

            {/* Phase 2: The turn */}
            <div style={{
              opacity: phase >= 2 ? 1 : 0,
              transform: phase >= 2 ? "translateY(0)" : "translateY(12px)",
              transition: "all 1.5s ease",
              marginBottom: 28,
            }}>
              <div style={{
                fontFamily: FONTS.display,
                fontSize: "clamp(15px, 3vw, 18px)",
                color: "rgba(255,238,210,0.8)",
                fontStyle: "italic",
                fontWeight: 300,
                lineHeight: 1.7,
              }}>
                24 weeks. 24 decisions. One ending you didn&apos;t see coming.
              </div>
            </div>

            {/* Phase 3: Title — appears like a name on a door */}
            <div style={{
              opacity: phase >= 3 ? 1 : 0,
              transform: phase >= 3 ? "translateY(0)" : "translateY(12px)",
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
                fontSize: 13,
                color: "rgba(255,255,255,0.35)",
                fontWeight: 300,
                marginTop: 8,
                lineHeight: 1.4,
                fontFamily: FONTS.mono,
                letterSpacing: "0.5px",
              }}>
                ~10 min &middot; &infin; endings
              </p>
            </div>
          </>
        )}

        {/* --- RETURNING PLAYER --- */}
        {stats.isReturning && collection && (
          <>
            {/* Phase 1: The haunt — specific memory from their last game */}
            <div style={{
              opacity: phase >= 1 ? 1 : 0,
              transform: phase >= 1 ? "translateY(0)" : "translateY(12px)",
              transition: "all 1.5s ease",
              marginBottom: 20,
            }}>
              <div style={{
                fontFamily: FONTS.display,
                fontSize: "clamp(14px, 2.5vw, 16px)",
                color: "rgba(255,238,210,0.6)",
                fontStyle: "italic",
                fontWeight: 300,
                lineHeight: 1.7,
                letterSpacing: "0.3px",
                textShadow: "0 1px 8px rgba(0,0,0,0.5)",
              }}>
                {hauntLine}
              </div>
            </div>

            {/* Phase 2: Title + personal record */}
            <div style={{
              opacity: phase >= 2 ? 1 : 0,
              transform: phase >= 2 ? "translateY(0)" : "translateY(12px)",
              transition: "all 1.2s ease",
              marginBottom: 16,
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
              <div style={{
                display: "flex", gap: 16, marginTop: 10, flexWrap: "wrap",
              }}>
                <div>
                  <span style={{
                    fontFamily: FONTS.mono, fontSize: 14, fontWeight: 700, color: "#fff",
                  }}>${stats.bestValuation}M</span>
                  <span style={{
                    fontSize: 11, color: "rgba(255,255,255,0.3)", marginLeft: 5,
                  }}>best</span>
                </div>
                <div>
                  <span style={{
                    fontFamily: FONTS.mono, fontSize: 14, fontWeight: 700, color: "#fff",
                  }}>{stats.totalPlayers}</span>
                </div>
              </div>
            </div>

            {/* Phase 3: Collection — what's still undiscovered */}
            <div style={{
              opacity: phase >= 3 ? 1 : 0,
              transform: phase >= 3 ? "translateY(0)" : "translateY(8px)",
              transition: "all 1s ease",
              marginBottom: 24,
            }}>
              {/* Archetypes */}
              {collection.archetypesRemaining.length > 0 && (
                <div style={{ marginBottom: 12 }}>
                  <div style={{
                    fontSize: 10, fontFamily: FONTS.mono, color: "rgba(255,255,255,0.2)",
                    letterSpacing: "1.5px", marginBottom: 6,
                  }}>
                    {collection.archetypesCollected.length} / 7 ARCHETYPES
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {collection.archetypesCollected.map(a => (
                      <span key={a} style={{
                        fontSize: 10, fontFamily: FONTS.mono,
                        color: "rgba(255,238,210,0.5)",
                        padding: "3px 8px",
                        borderRadius: 4,
                        background: "rgba(255,238,210,0.06)",
                      }}>{a.replace('The ', '')}</span>
                    ))}
                    {collection.archetypesRemaining.slice(0, 3).map((_, i) => (
                      <span key={i} style={{
                        fontSize: 10, fontFamily: FONTS.mono,
                        color: "rgba(255,255,255,0.12)",
                        padding: "3px 8px",
                        borderRadius: 4,
                        border: "1px dashed rgba(255,255,255,0.08)",
                      }}>?</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Endings discovered */}
              {collection.endingsRemaining.length > 0 && (
                <div style={{
                  fontSize: 11, fontFamily: FONTS.mono,
                  color: "rgba(255,255,255,0.2)",
                }}>
                  {collection.endingsCollected.length} / 8 endings discovered
                </div>
              )}
            </div>
          </>
        )}

        {/* Phase 4: Entry prompt — the same for everyone */}
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
        </div>
      </div>
    </div>
  );
}
