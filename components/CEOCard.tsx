'use client';

import { FONTS } from '@/lib/game/constants';
import { Ending } from '@/lib/game/types';
import { getTotalPlayerCount } from '@/lib/game/stats';

interface CEOCardProps {
  ending: Ending;
  companyName: string;
  valuation: number;
  weekLog: string[];
  rank: number;
  headline: string;
  mirror: string;
  onCopy?: () => void;
  onPlayAgain: () => void;
}

const gradients: Record<string, string> = {
  ipo: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0d4f4f 100%)",
  acquired: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
  board_removed: "linear-gradient(135deg, #1a0a2e 0%, #2d1b4e 50%, #1a0a2e 100%)",
  forced_sale: "linear-gradient(135deg, #2d1f0e 0%, #3d2b14 50%, #1a1108 100%)",
  burnout: "linear-gradient(135deg, #1f0a0a 0%, #3b1010 50%, #1a0505 100%)",
  bankrupt: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)",
  disgraced: "linear-gradient(135deg, #1a0a1f 0%, #2b0e35 50%, #0f0515 100%)",
  time_up: "linear-gradient(135deg, #0f1520 0%, #1a2030 50%, #0f1520 100%)",
};

const borderColors: Record<string, string> = {
  ipo: "rgba(59,130,246,0.4)",
  acquired: "rgba(99,179,237,0.3)",
  board_removed: "rgba(168,85,247,0.3)",
  forced_sale: "rgba(217,170,96,0.3)",
  burnout: "rgba(248,113,113,0.3)",
  bankrupt: "rgba(100,100,100,0.3)",
  disgraced: "rgba(192,132,252,0.3)",
  time_up: "rgba(148,163,184,0.3)",
};

export function CEOCard({ ending, companyName, valuation, weekLog, rank, headline, mirror, onCopy, onPlayAgain }: CEOCardProps) {
  const totalPlayers = getTotalPlayerCount();
  const shareText = `THE ROOM\n${ending.line}\n${weekLog.join("")}\n#${rank} of ${totalPlayers} players\n"${headline}"\nbehindtheroom.com`;

  return (
    <div style={{
      maxWidth: 400, margin: "0 auto", padding: "40px 20px",
      fontFamily: FONTS.body,
    }}>
      {/* The Card */}
      <div style={{
        background: gradients[ending.type] || gradients.time_up,
        borderRadius: 20,
        border: `1px solid ${borderColors[ending.type] || borderColors.time_up}`,
        padding: "32px 28px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03) inset",
        aspectRatio: "4/5",
        display: "flex",
        flexDirection: "column" as const,
        justifyContent: "space-between",
        position: "relative" as const,
        overflow: "hidden",
      }}>
        {/* Holographic shimmer effect */}
        <div style={{
          position: "absolute" as const, inset: 0,
          background: "linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.03) 50%, transparent 70%)",
          pointerEvents: "none" as const,
        }} />

        {/* Top: Game name + ending badge */}
        <div>
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "flex-start",
          }}>
            <div style={{
              fontFamily: FONTS.display,
              fontSize: 14,
              color: "rgba(255,255,255,0.35)",
              letterSpacing: "3px",
              textTransform: "uppercase" as const,
            }}>
              The Room
            </div>
            <div style={{
              background: "rgba(255,255,255,0.08)",
              borderRadius: 6,
              padding: "4px 10px",
              fontSize: 11,
              fontFamily: FONTS.mono,
              color: "rgba(255,255,255,0.5)",
              letterSpacing: "1px",
            }}>
              {ending.label}
            </div>
          </div>
        </div>

        {/* Center: Company name + result */}
        <div style={{ textAlign: "center" as const, position: "relative" as const, zIndex: 1 }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>{ending.emoji}</div>
          <div style={{
            fontFamily: FONTS.display,
            fontSize: "clamp(28px, 6vw, 38px)",
            fontWeight: 700,
            color: "#fff",
            lineHeight: 1.1,
            marginBottom: 12,
          }}>
            {companyName}
          </div>
          <div style={{
            fontSize: 15,
            color: "rgba(255,255,255,0.7)",
            lineHeight: 1.5,
            maxWidth: 280,
            margin: "0 auto",
          }}>
            {ending.line}
          </div>
        </div>

        {/* Bottom: Strip + rank + headline */}
        <div>
          {/* Journey strip */}
          <div style={{
            display: "flex", gap: 1.5, justifyContent: "center",
            marginBottom: 16, flexWrap: "wrap" as const,
          }}>
            {weekLog.map((w, i) => (
              <span key={i} style={{ fontSize: 8, lineHeight: 1 }}>{w}</span>
            ))}
          </div>

          {/* Valuation + Rank */}
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            marginBottom: 16,
          }}>
            <div style={{
              fontFamily: FONTS.mono,
              fontSize: 20,
              fontWeight: 700,
              color: "#fff",
            }}>
              ${valuation}M
            </div>
            <div style={{
              fontFamily: FONTS.mono,
              fontSize: 12,
              color: "rgba(255,255,255,0.4)",
            }}>
              #{rank} of {totalPlayers}
            </div>
          </div>

          {/* Headline */}
          <div style={{
            fontFamily: FONTS.display,
            fontSize: 13,
            color: "rgba(255,255,255,0.5)",
            fontStyle: "italic",
            lineHeight: 1.5,
            textAlign: "center" as const,
            borderTop: "1px solid rgba(255,255,255,0.06)",
            paddingTop: 14,
          }}>
            &ldquo;{headline}&rdquo;
          </div>
        </div>
      </div>

      {/* Mirror — below the card, private */}
      <div style={{
        textAlign: "center" as const,
        marginTop: 24,
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

      {/* Actions */}
      <div style={{
        display: "flex", gap: 12, marginTop: 32, justifyContent: "center",
      }}>
        <button
          onClick={() => {
            navigator.clipboard?.writeText(shareText);
            onCopy?.();
          }}
          style={{
            background: "#fff",
            color: "#0a0a0f",
            border: "none",
            padding: "14px 28px",
            fontSize: 15,
            fontWeight: 600,
            borderRadius: 50,
            cursor: "pointer",
            fontFamily: FONTS.body,
          }}
        >
          Share Result
        </button>
        <button
          onClick={onPlayAgain}
          style={{
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.15)",
            color: "#fff",
            padding: "14px 28px",
            fontSize: 15,
            borderRadius: 50,
            cursor: "pointer",
            fontFamily: FONTS.body,
          }}
        >
          Play Again
        </button>
      </div>

      <div style={{
        textAlign: "center" as const,
        marginTop: 16,
        fontSize: 12,
        color: "rgba(255,255,255,0.2)",
        fontFamily: FONTS.mono,
      }}>
        behindtheroom.com
      </div>
    </div>
  );
}
