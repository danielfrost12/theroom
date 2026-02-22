'use client';

import { FONTS } from '@/lib/game/constants';
import { Ending, GameDimensions } from '@/lib/game/types';
import { getTotalPlayerCount } from '@/lib/game/stats';
import { ShareImage } from './ShareImage';

interface CEOCardProps {
  ending: Ending;
  companyName: string;
  valuation: number;
  weekLog: string[];
  rank: number;
  headline: string;
  mirror: string;
  dims: GameDimensions;
  onPlayAgain: () => void;
}

// Week dot color for the visible card journey strip
function weekColor(emoji: string): string {
  if (emoji === "🟩" || emoji === "🏆") return "rgba(134,239,172,0.9)";
  if (emoji === "🟨") return "rgba(253,224,71,0.8)";
  if (emoji === "🟥") return "rgba(248,113,113,0.9)";
  if (emoji === "💀") return "rgba(248,113,113,1)";
  return "rgba(255,255,255,0.2)";
}

// Dimension color
function dimColor(value: number): string {
  if (value > 60) return "rgba(134,239,172,0.9)";
  if (value > 30) return "rgba(253,224,71,0.9)";
  return "rgba(248,113,113,0.95)";
}

export function CEOCard({ ending, companyName, valuation, weekLog, rank, headline, mirror, dims, onPlayAgain }: CEOCardProps) {
  const totalPlayers = getTotalPlayerCount();

  const dimEntries = [
    { label: "Company", value: dims.company },
    { label: "People", value: dims.relationships },
    { label: "Energy", value: dims.energy },
    { label: "Integrity", value: dims.integrity },
  ];

  return (
    <div style={{
      maxWidth: 440, margin: "0 auto",
      padding: "max(40px, env(safe-area-inset-top, 0px)) max(20px, env(safe-area-inset-right, 0px)) max(40px, env(safe-area-inset-bottom, 0px)) max(20px, env(safe-area-inset-left, 0px))",
      fontFamily: FONTS.body,
    }}>
      {/* The Card — Spotify Wrapped style */}
      <div style={{
        background: "#08080c",
        borderRadius: 24,
        border: "1px solid rgba(255,255,255,0.06)",
        padding: "36px 32px 28px",
        boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
        position: "relative" as const,
        overflow: "hidden",
      }}>
        {/* Subtle gradient atmosphere */}
        <div style={{
          position: "absolute" as const, inset: 0,
          background: ending.type === "ipo" || ending.type === "acquired"
            ? "radial-gradient(ellipse at 30% 15%, rgba(134,239,172,0.06) 0%, transparent 50%)"
            : ending.type === "burnout" || ending.type === "bankrupt"
              ? "radial-gradient(ellipse at 30% 15%, rgba(248,113,113,0.06) 0%, transparent 50%)"
              : "radial-gradient(ellipse at 30% 15%, rgba(148,163,184,0.04) 0%, transparent 50%)",
          pointerEvents: "none" as const,
        }} />

        {/* Noise texture */}
        <div style={{
          position: "absolute" as const, inset: 0,
          opacity: 0.03,
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          backgroundSize: "256px 256px",
          pointerEvents: "none" as const,
        }} />

        {/* Content */}
        <div style={{ position: "relative" as const, zIndex: 1 }}>
          {/* Header */}
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            marginBottom: 6,
          }}>
            <div style={{
              fontFamily: FONTS.display,
              fontSize: 12,
              color: "rgba(255,255,255,0.25)",
              letterSpacing: "3px",
              textTransform: "uppercase" as const,
            }}>
              The Room
            </div>
            <div style={{
              fontSize: 10,
              color: "rgba(255,255,255,0.3)",
              letterSpacing: "1.5px",
              fontFamily: FONTS.mono,
            }}>
              {ending.label}
            </div>
          </div>

          <div style={{
            height: 1,
            background: "rgba(255,255,255,0.06)",
            marginBottom: 36,
          }} />

          {/* Center */}
          <div style={{ textAlign: "center" as const, marginBottom: 36 }}>
            <div style={{
              fontSize: 44,
              marginBottom: 16,
              filter: "saturate(0.85)",
            }}>
              {ending.emoji}
            </div>
            <div style={{
              fontFamily: FONTS.display,
              fontSize: "clamp(30px, 7vw, 40px)",
              fontWeight: 700,
              color: "#fff",
              lineHeight: 1.1,
              marginBottom: 14,
              letterSpacing: "-0.5px",
            }}>
              {companyName}
            </div>
            <div style={{
              fontSize: 15,
              color: "rgba(255,255,255,0.5)",
              lineHeight: 1.6,
              maxWidth: 300,
              margin: "0 auto 28px",
            }}>
              {ending.line}
            </div>

            {/* Valuation */}
            <div style={{
              fontFamily: FONTS.mono,
              fontSize: 38,
              fontWeight: 700,
              color: "#fff",
              letterSpacing: "-1px",
              marginBottom: 4,
            }}>
              ${valuation}M
            </div>
            <div style={{
              fontSize: 10,
              color: "rgba(255,255,255,0.2)",
              letterSpacing: "2px",
              fontFamily: FONTS.mono,
              textTransform: "uppercase" as const,
            }}>
              Final Valuation
            </div>
          </div>

          {/* Journey strip — colored dots */}
          <div style={{
            display: "flex", gap: 3, justifyContent: "center",
            flexWrap: "wrap" as const,
            marginBottom: 20,
          }}>
            {weekLog.map((w, i) => (
              <div key={i} style={{
                width: 7,
                height: 7,
                borderRadius: 1.5,
                background: weekColor(w),
                opacity: 0.9,
              }} />
            ))}
          </div>

          {/* Dimension scores */}
          <div style={{
            display: "flex",
            gap: 20,
            justifyContent: "center",
            marginBottom: 20,
          }}>
            {dimEntries.map(d => (
              <div key={d.label} style={{ textAlign: "center" as const }}>
                <div style={{
                  fontFamily: FONTS.mono,
                  fontSize: 20,
                  fontWeight: 600,
                  color: dimColor(d.value),
                  marginBottom: 2,
                }}>
                  {d.value}
                </div>
                <div style={{
                  fontSize: 9,
                  color: "rgba(255,255,255,0.3)",
                  letterSpacing: "1px",
                  textTransform: "uppercase" as const,
                  fontFamily: FONTS.mono,
                }}>
                  {d.label}
                </div>
              </div>
            ))}
          </div>

          {/* Headline */}
          <div style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            paddingTop: 16,
            marginBottom: 12,
          }}>
            <div style={{
              fontFamily: FONTS.display,
              fontSize: 13,
              color: "rgba(255,255,255,0.4)",
              fontStyle: "italic",
              lineHeight: 1.6,
              textAlign: "center" as const,
            }}>
              &ldquo;{headline}&rdquo;
            </div>
          </div>

          {/* Footer */}
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <div style={{
              fontSize: 10,
              color: "rgba(255,255,255,0.2)",
              fontFamily: FONTS.mono,
            }}>
              #{rank} of {totalPlayers}
            </div>
            <div style={{
              fontSize: 10,
              color: "rgba(255,255,255,0.2)",
              fontFamily: FONTS.mono,
            }}>
              behindtheroom.com
            </div>
          </div>
        </div>
      </div>

      {/* Mirror — below the card, personal reflection */}
      <div style={{
        textAlign: "center" as const,
        marginTop: 28,
        padding: "0 20px",
      }}>
        <div style={{
          fontSize: 13,
          color: "rgba(255,255,255,0.3)",
          fontStyle: "italic",
          lineHeight: 1.6,
          fontFamily: FONTS.display,
        }}>
          {mirror}
        </div>
      </div>

      {/* Share + Play Again actions */}
      <div style={{ marginTop: 32 }}>
        <ShareImage
          ending={ending}
          companyName={companyName}
          valuation={valuation}
          weekLog={weekLog}
          dims={dims}
          headline={headline}
          rank={rank}
          totalPlayers={totalPlayers}
        />

        <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
          <button
            onClick={onPlayAgain}
            style={{
              background: "transparent",
              border: "none",
              color: "rgba(255,255,255,0.35)",
              padding: "14px 28px",
              fontSize: 14,
              borderRadius: 50,
              cursor: "pointer",
              fontFamily: FONTS.body,
              transition: "color 0.3s ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.35)"; }}
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
}
