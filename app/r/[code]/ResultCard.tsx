'use client';

import { ShareData } from '@/lib/share';
import { FONTS, dimColor, weekDotColor } from '@/lib/game/constants';

// Split weekLog string back into emoji array — spread handles surrogate pairs correctly
function parseWeekLog(log: string): string[] {
  return [...log];
}

export function ResultCard({ data }: { data: ShareData }) {
  const weeks = parseWeekLog(data.weekLog);
  const dimEntries = [
    { label: 'Company', value: data.dims.company },
    { label: 'People', value: data.dims.relationships },
    { label: 'Energy', value: data.dims.energy },
    { label: 'Integrity', value: data.dims.integrity },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0f',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      fontFamily: "'DM Sans', sans-serif",
    }}>
      {/* The Card */}
      <div style={{
        maxWidth: 440,
        width: '100%',
        background: '#08080c',
        borderRadius: 24,
        border: '1px solid rgba(255,255,255,0.06)',
        padding: '36px 32px 28px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 6,
        }}>
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 12,
            color: 'rgba(255,255,255,0.25)',
            letterSpacing: '3px',
            textTransform: 'uppercase' as const,
          }}>
            The Room
          </div>
          <div style={{
            fontSize: 10,
            color: 'rgba(255,255,255,0.3)',
            letterSpacing: '1.5px',
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            {data.endingLabel}
          </div>
        </div>

        <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 36 }} />

        {/* Center */}
        <div style={{ textAlign: 'center' as const, marginBottom: 36 }}>
          <div style={{ fontSize: 44, marginBottom: 16, filter: 'saturate(0.85)' }}>
            {data.endingEmoji}
          </div>
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 'clamp(30px, 7vw, 40px)',
            fontWeight: 700,
            color: '#fff',
            lineHeight: 1.1,
            marginBottom: 14,
            letterSpacing: '-0.5px',
          }}>
            {data.companyName}
          </div>
          <div style={{
            fontSize: 15,
            color: 'rgba(255,255,255,0.5)',
            lineHeight: 1.6,
            maxWidth: 300,
            margin: '0 auto 28px',
          }}>
            {data.endingLine}
          </div>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 38,
            fontWeight: 700,
            color: '#fff',
            letterSpacing: '-1px',
            marginBottom: 4,
          }}>
            ${data.valuation}M
          </div>
          <div style={{
            fontSize: 10,
            color: 'rgba(255,255,255,0.2)',
            letterSpacing: '2px',
            fontFamily: "'JetBrains Mono', monospace",
            textTransform: 'uppercase' as const,
          }}>
            Final Valuation
          </div>
        </div>

        {/* Journey dots */}
        <div style={{
          display: 'flex', gap: 3, justifyContent: 'center',
          flexWrap: 'wrap' as const, marginBottom: 20,
        }}>
          {weeks.map((w, i) => (
            <div key={i} style={{
              width: 7, height: 7, borderRadius: 1.5,
              background: weekDotColor(w), opacity: 0.9,
            }} />
          ))}
        </div>

        {/* Dims */}
        <div style={{
          display: 'flex', gap: 20, justifyContent: 'center', marginBottom: 20,
        }}>
          {dimEntries.map(d => (
            <div key={d.label} style={{ textAlign: 'center' as const }}>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 20, fontWeight: 600,
                color: dimColor(d.value), marginBottom: 2,
              }}>
                {d.value}
              </div>
              <div style={{
                fontSize: 9, color: 'rgba(255,255,255,0.3)',
                letterSpacing: '1px', textTransform: 'uppercase' as const,
                fontFamily: "'JetBrains Mono', monospace",
              }}>
                {d.label}
              </div>
            </div>
          ))}
        </div>

        {/* Headline */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16 }}>
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13,
            color: 'rgba(255,255,255,0.4)',
            fontStyle: 'italic',
            lineHeight: 1.6,
            textAlign: 'center' as const,
          }}>
            &ldquo;{data.headline}&rdquo;
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ textAlign: 'center' as const, marginTop: 32 }}>
        <div style={{
          fontSize: 16,
          color: 'rgba(255,255,255,0.5)',
          marginBottom: 20,
          fontStyle: 'italic',
          fontFamily: "'DM Sans', sans-serif",
        }}>
          Can you do better?
        </div>
        <a
          href="/"
          style={{
            display: 'inline-block',
            background: '#fff',
            color: '#0a0a0f',
            padding: '16px 36px',
            borderRadius: 50,
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: 16,
            fontFamily: "'DM Sans', sans-serif",
            transition: 'transform 0.2s ease',
          }}
        >
          Play The Room
        </a>
      </div>
    </div>
  );
}
