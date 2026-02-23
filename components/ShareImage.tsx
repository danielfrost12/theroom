'use client';

import { useRef, useCallback, useState } from 'react';
import { Ending, GameDimensions } from '@/lib/game/types';
import { buildShareUrl, ShareData } from '@/lib/share';
import { FONTS, weekDotColor } from '@/lib/game/constants';

interface ShareImageProps {
  ending: Ending;
  companyName: string;
  valuation: number;
  weekLog: string[];
  dims: GameDimensions;
  headline: string;
  archetype: string;
  pivotalMoments: string[];
  percentile: number;
  nearMiss: string | null;
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


export function ShareImage({
  ending, companyName, valuation, weekLog, dims, headline, archetype, pivotalMoments, percentile, nearMiss
}: ShareImageProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [generating, setGenerating] = useState(false);
  const [shared, setShared] = useState(false);
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
    if (!cardRef.current || generating) return;
    setGenerating(true);

    const shareInfo: ShareData = {
      companyName,
      endingType: ending.type,
      endingEmoji: ending.emoji,
      endingLabel: ending.label,
      endingLine: ending.line,
      valuation,
      weekLog: weekLog.join(''),
      dims,
      headline,
      rank: 0, // legacy field — kept for share URL compatibility
    };
    const shareUrl = buildShareUrl(shareInfo);

    try {
      const html2canvas = (await import('html2canvas-pro')).default;
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        logging: false,
      });

      // Convert to blob with a promise wrapper so we can properly await + catch
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((b) => resolve(b), 'image/png');
      });

      if (!blob) {
        setGenerating(false);
        return;
      }

      const file = new File([blob], 'theroom.png', { type: 'image/png' });

      if (navigator.share) {
        // Specific dare — near-miss makes the share personal and competitive
        const dareText = nearMiss
          ? `I built ${companyName}. ${weekLog.length} weeks. Better than ${percentile}% of players.\n${nearMiss}\nCan you do better?`
          : `I built ${companyName}. ${weekLog.length} weeks. Better than ${percentile}% of players. ${ending.line}\nCan you do better?`;
        const sharePayload: ShareData2 = {
          title: `${companyName} — ${ending.label}`,
          text: dareText,
          url: shareUrl,
        };
        try {
          if (navigator.canShare?.({ files: [file] })) {
            await navigator.share({ ...sharePayload, files: [file] });
          } else {
            await navigator.share(sharePayload);
          }
        } catch {
          // User cancelled share sheet or share failed — this is fine
        }
      } else {
        // Desktop fallback: copy share URL + dare text to clipboard, download image
        const dareText = nearMiss
          ? `I built ${companyName}. ${weekLog.length} weeks. Better than ${percentile}% of players.\n${nearMiss}\nCan you do better?`
          : `I built ${companyName}. ${weekLog.length} weeks. Better than ${percentile}% of players. ${ending.line}\nCan you do better?`;
        try {
          await navigator.clipboard.writeText(`${dareText}\n${shareUrl}`);
          setShared(true);
          setTimeout(() => setShared(false), 2500);
        } catch { /* clipboard may not be available */ }
        const link = document.createElement('a');
        link.download = `theroom-${companyName.toLowerCase().replace(/\s+/g, '-')}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      }
    } catch (err) {
      console.error('Share failed:', err);
    } finally {
      setGenerating(false);
    }
  }, [companyName, ending, valuation, weekLog, dims, headline, generating, percentile, nearMiss]);

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
                fontFamily: "'DM Sans', sans-serif",
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
              marginBottom: 12,
            }} />

            {/* Archetype */}
            <div style={{
              textAlign: "center" as const,
              marginBottom: 20,
            }}>
              <div style={{
                fontSize: 10,
                color: "rgba(255,255,255,0.3)",
                fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: "2.5px",
                textTransform: "uppercase" as const,
              }}>
                {archetype}
              </div>
            </div>

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
                fontFamily: "'DM Sans', sans-serif",
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
                marginBottom: 8,
              }}>
                FINAL VALUATION
              </div>

              {/* Percentile — social comparison that drives shares */}
              <div style={{
                fontSize: 11,
                color: percentile >= 80
                  ? "rgba(134,239,172,0.7)"
                  : percentile >= 50
                    ? "rgba(255,255,255,0.35)"
                    : "rgba(248,113,113,0.6)",
                fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: "0.5px",
                marginBottom: nearMiss ? 6 : 28,
              }}>
                Better than {percentile}% of players
              </div>

              {/* Near-miss — the sting that makes people share */}
              {nearMiss && (
                <div style={{
                  fontSize: 10,
                  color: "rgba(248,113,113,0.5)",
                  fontFamily: "'JetBrains Mono', monospace",
                  letterSpacing: "0.3px",
                  lineHeight: 1.4,
                  maxWidth: 300,
                  marginBottom: 28,
                }}>
                  {nearMiss}
                </div>
              )}
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
                    background: weekDotColor(w),
                    opacity: 0.9,
                  }} />
                ))}
              </div>
            </div>

            {/* Pivotal moments */}
            {pivotalMoments.length > 0 && (
              <div style={{
                borderTop: "1px solid rgba(255,255,255,0.04)",
                paddingTop: 12,
                marginBottom: 12,
              }}>
                <div style={{
                  fontSize: 8,
                  color: "rgba(255,255,255,0.2)",
                  fontFamily: "'JetBrains Mono', monospace",
                  letterSpacing: "1.5px",
                  textTransform: "uppercase" as const,
                  marginBottom: 6,
                  textAlign: "center" as const,
                }}>
                  DEFINING MOMENTS
                </div>
                {pivotalMoments.slice(0, 3).map((m, i) => (
                  <div key={i} style={{
                    fontSize: 10,
                    color: "rgba(255,255,255,0.3)",
                    fontFamily: "'DM Sans', sans-serif",
                    lineHeight: 1.4,
                    textAlign: "center" as const,
                    marginBottom: 2,
                  }}>
                    {m}
                  </div>
                ))}
              </div>
            )}

            {/* Headline quote */}
            <div style={{
              borderTop: "1px solid rgba(255,255,255,0.06)",
              paddingTop: 16,
              marginBottom: 16,
            }}>
              <div style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 12,
                color: "rgba(255,255,255,0.4)",
                fontStyle: "italic",
                lineHeight: 1.6,
                textAlign: "center" as const,
              }}>
                &ldquo;{headline}&rdquo;
              </div>
            </div>

            {/* Viral summary */}
            <div style={{
              textAlign: "center" as const,
              marginBottom: 12,
            }}>
              <div style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.3)",
                fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: "0.5px",
              }}>
                {weekLog.length} weeks. {dims.relationships > dims.company ? `Chose my people over ${companyName}.` : dims.integrity > dims.company ? "Chose the truth. It cost everything." : dims.energy < 35 ? "Gave everything. Had nothing left." : `Built ${companyName}. Paid the price.`}
              </div>
            </div>

            {/* CTA */}
            <div style={{
              textAlign: "center" as const,
              marginBottom: 16,
            }}>
              <div style={{
                fontFamily: "'DM Sans', sans-serif",
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

            {/* Footer — behindtheroom.com already in CTA above */}
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
          {generating ? "Generating..." : shared ? "Copied! ✓" : "Share"}
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
