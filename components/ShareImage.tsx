'use client';

import { useRef, useCallback, useState } from 'react';
import { Ending, GameDimensions } from '@/lib/game/types';
import { buildShareUrl, ShareData } from '@/lib/share';

interface ShareImageProps {
  ending: Ending;
  companyName: string;
  valuation: number;
  weekLog: string[];
  dims: GameDimensions;
  headline: string;
  rank: number;
  totalPlayers: string;
}

// Web Share API payload type
type ShareData2 = { title?: string; text?: string; url?: string; files?: File[] };

// Color palette for ending types
const ENDING_ACCENTS: Record<string, { primary: string; glow: string }> = {
  ipo: { primary: "rgba(134,239,172,0.95)", glow: "rgba(134,239,172,0.15)" },
  acquired: { primary: "rgba(147,197,253,0.95)", glow: "rgba(147,197,253,0.15)" },
  board_removed: { primary: "rgba(192,132,252,0.85)", glow: "rgba(192,132,252,0.12)" },
  forced_sale: { primary: "rgba(253,224,71,0.85)", glow: "rgba(253,224,71,0.10)" },
  burnout: { primary: "rgba(248,113,113,0.9)", glow: "rgba(248,113,113,0.12)" },
  bankrupt: { primary: "rgba(148,163,184,0.7)", glow: "rgba(148,163,184,0.08)" },
  disgraced: { primary: "rgba(192,132,252,0.8)", glow: "rgba(192,132,252,0.10)" },
  time_up: { primary: "rgba(148,163,184,0.8)", glow: "rgba(148,163,184,0.10)" },
};

// Week dot color based on emoji
function weekColor(emoji: string): string {
  if (emoji === "🟩" || emoji === "🏆") return "rgba(134,239,172,0.9)";
  if (emoji === "🟨") return "rgba(253,224,71,0.8)";
  if (emoji === "🟥") return "rgba(248,113,113,0.9)";
  if (emoji === "💀") return "rgba(248,113,113,1)";
  return "rgba(255,255,255,0.2)";
}


export function ShareImage({
  ending, companyName, valuation, weekLog, dims, headline, rank, totalPlayers
}: ShareImageProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [generating, setGenerating] = useState(false);
  const accent = ENDING_ACCENTS[ending.type] || ENDING_ACCENTS.time_up;

  const handleDownload = useCallback(async () => {
    if (!cardRef.current || generating) return;
    setGenerating(true);

    try {
      const html2canvas = (await import('html2canvas-pro')).default;
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const link = document.createElement('a');
      link.download = `theroom-${companyName.toLowerCase().replace(/\s+/g, '-')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Share image generation failed:', err);
    } finally {
      setGenerating(false);
    }
  }, [companyName, generating]);

  const handleShare = useCallback(async () => {
    if (!cardRef.current) return;
    setGenerating(true);

    const shareData: ShareData = {
      companyName,
      endingType: ending.type,
      endingEmoji: ending.emoji,
      endingLabel: ending.label,
      endingLine: ending.line,
      valuation,
      weekLog: weekLog.join(''),
      dims,
      headline,
      rank,
    };
    const shareUrl = buildShareUrl(shareData);

    try {
      const html2canvas = (await import('html2canvas-pro')).default;
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        logging: false,
      });

      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], 'theroom.png', { type: 'image/png' });

        if (navigator.share) {
          // Share URL + text as primary, image as attachment if supported
          const sharePayload: ShareData2 = {
            title: `${companyName} — ${ending.label}`,
            text: `I built ${companyName}. ${ending.line}\nCan you do better?`,
            url: shareUrl,
          };
          // Try with image first, fall back to URL-only
          if (navigator.canShare?.({ files: [file] })) {
            try {
              await navigator.share({ ...sharePayload, files: [file] });
            } catch {
              // Some platforms fail with files — retry without
              await navigator.share(sharePayload);
            }
          } else {
            await navigator.share(sharePayload);
          }
        } else {
          // Desktop fallback: copy share URL to clipboard, download image
          try {
            await navigator.clipboard.writeText(`I built ${companyName}. ${ending.line}\nCan you do better?\n${shareUrl}`);
          } catch { /* clipboard may not be available */ }
          const link = document.createElement('a');
          link.download = `theroom-${companyName.toLowerCase().replace(/\s+/g, '-')}.png`;
          link.href = canvas.toDataURL('image/png');
          link.click();
        }
        setGenerating(false);
      }, 'image/png');
    } catch (err) {
      console.error('Share failed:', err);
      setGenerating(false);
    }
  }, [companyName, ending, valuation, weekLog, dims, headline, rank]);

  return (
    <>
      {/* Hidden render target for html2canvas */}
      <div style={{
        position: "absolute",
        left: "-9999px",
        top: 0,
      }}>
        <div
          ref={cardRef}
          style={{
            width: 440,
            height: 780,
            background: "#08080c",
            borderRadius: 24,
            overflow: "hidden",
            position: "relative",
            fontFamily: "'DM Sans', -apple-system, sans-serif",
          }}
        >
          {/* Gradient atmosphere */}
          <div style={{
            position: "absolute", inset: 0,
            background: `radial-gradient(ellipse at 30% 15%, ${accent.glow} 0%, transparent 50%), radial-gradient(ellipse at 70% 85%, rgba(255,255,255,0.02) 0%, transparent 50%)`,
          }} />

          {/* Noise texture */}
          <div style={{
            position: "absolute", inset: 0,
            opacity: 0.04,
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            backgroundRepeat: "repeat",
            backgroundSize: "256px 256px",
          }} />

          {/* Content */}
          <div style={{
            position: "relative", zIndex: 1,
            padding: "36px 32px 28px",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            boxSizing: "border-box",
          }}>
            {/* Header */}
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              marginBottom: 6,
            }}>
              <div style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.25)",
                letterSpacing: "3px",
                textTransform: "uppercase" as const,
                fontFamily: "'Playfair Display', serif",
              }}>
                The Room
              </div>
              <div style={{
                fontSize: 10,
                color: "rgba(255,255,255,0.3)",
                letterSpacing: "1.5px",
                fontFamily: "'JetBrains Mono', monospace",
              }}>
                {ending.label}
              </div>
            </div>

            {/* Thin separator */}
            <div style={{
              height: 1,
              background: "rgba(255,255,255,0.06)",
              marginBottom: 40,
            }} />

            {/* Center: Emoji + Company + Result */}
            <div style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center" as const,
            }}>
              <div style={{
                fontSize: 48,
                marginBottom: 20,
                filter: "saturate(0.85)",
              }}>
                {ending.emoji}
              </div>

              <div style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 36,
                fontWeight: 700,
                color: "#fff",
                lineHeight: 1.1,
                marginBottom: 14,
                letterSpacing: "-0.5px",
              }}>
                {companyName}
              </div>

              <div style={{
                fontSize: 14,
                color: "rgba(255,255,255,0.5)",
                lineHeight: 1.6,
                maxWidth: 320,
                marginBottom: 32,
              }}>
                {ending.line}
              </div>

              {/* Valuation — big */}
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 42,
                fontWeight: 700,
                color: accent.primary,
                letterSpacing: "-1px",
                marginBottom: 4,
              }}>
                ${valuation}M
              </div>
              <div style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.25)",
                letterSpacing: "1.5px",
                fontFamily: "'JetBrains Mono', monospace",
                marginBottom: 32,
              }}>
                FINAL VALUATION
              </div>
            </div>

            {/* Journey strip — colored dots */}
            <div style={{ marginBottom: 20 }}>
              <div style={{
                display: "flex",
                gap: 3,
                justifyContent: "center",
                flexWrap: "wrap" as const,
              }}>
                {weekLog.map((w, i) => (
                  <div key={i} style={{
                    width: 6,
                    height: 6,
                    borderRadius: 1,
                    background: weekColor(w),
                    opacity: 0.9,
                  }} />
                ))}
              </div>
            </div>

            {/* Headline quote */}
            <div style={{
              borderTop: "1px solid rgba(255,255,255,0.06)",
              paddingTop: 16,
              marginBottom: 16,
            }}>
              <div style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 12,
                color: "rgba(255,255,255,0.4)",
                fontStyle: "italic",
                lineHeight: 1.6,
                textAlign: "center" as const,
              }}>
                &ldquo;{headline}&rdquo;
              </div>
            </div>

            {/* CTA */}
            <div style={{
              textAlign: "center" as const,
              marginBottom: 16,
            }}>
              <div style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 14,
                color: "rgba(255,255,255,0.5)",
                fontStyle: "italic",
                marginBottom: 8,
              }}>
                Can you do better?
              </div>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 13,
                color: "rgba(255,255,255,0.6)",
                letterSpacing: "0.5px",
              }}>
                behindtheroom.com
              </div>
            </div>

            {/* Footer */}
            <div style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}>
              <div style={{
                fontSize: 10,
                color: "rgba(255,255,255,0.15)",
                fontFamily: "'JetBrains Mono', monospace",
              }}>
                #{rank} of {totalPlayers}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Buttons — rendered in the visible UI */}
      <div style={{
        display: "flex", gap: 12, justifyContent: "center",
      }}>
        <button
          onClick={handleShare}
          disabled={generating}
          style={{
            background: generating ? "rgba(255,255,255,0.08)" : "#fff",
            color: generating ? "rgba(255,255,255,0.4)" : "#0a0a0f",
            border: "none",
            padding: "14px 28px",
            fontSize: 15,
            fontWeight: 600,
            borderRadius: 50,
            cursor: generating ? "wait" : "pointer",
            fontFamily: "'DM Sans', sans-serif",
            transition: "all 0.3s ease",
          }}
        >
          {generating ? "Generating..." : "Share"}
        </button>
        <button
          onClick={handleDownload}
          disabled={generating}
          style={{
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.12)",
            color: generating ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.7)",
            padding: "14px 24px",
            fontSize: 15,
            borderRadius: 50,
            cursor: generating ? "wait" : "pointer",
            fontFamily: "'DM Sans', sans-serif",
            transition: "all 0.3s ease",
          }}
        >
          Save Image
        </button>
      </div>
    </>
  );
}
