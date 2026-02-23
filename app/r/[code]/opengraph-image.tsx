import { ImageResponse } from 'next/og';
import { decodeResult } from '@/lib/share';

export const runtime = 'edge';
export const alt = 'The Room — Game Result';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const ENDING_COLORS: Record<string, string> = {
  ipo: 'rgba(134,239,172,0.95)',
  acquired: 'rgba(147,197,253,0.95)',
  board_removed: 'rgba(192,132,252,0.85)',
  forced_sale: 'rgba(253,224,71,0.85)',
  burnout: 'rgba(248,113,113,0.9)',
  bankrupt: 'rgba(148,163,184,0.7)',
  disgraced: 'rgba(192,132,252,0.8)',
  time_up: 'rgba(148,163,184,0.8)',
};

const ENDING_GLOWS: Record<string, string> = {
  ipo: 'rgba(134,239,172,0.12)',
  acquired: 'rgba(147,197,253,0.12)',
  board_removed: 'rgba(192,132,252,0.08)',
  forced_sale: 'rgba(253,224,71,0.08)',
  burnout: 'rgba(248,113,113,0.10)',
  bankrupt: 'rgba(148,163,184,0.06)',
  disgraced: 'rgba(192,132,252,0.08)',
  time_up: 'rgba(148,163,184,0.06)',
};

export default async function Image({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const data = decodeResult(code);

  if (!data) {
    // Fallback: generic image if decode fails
    return new ImageResponse(
      (
        <div style={{
          width: '100%', height: '100%', display: 'flex',
          background: '#08080c', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ fontSize: 64, fontWeight: 700, color: '#fff' }}>The Room</div>
        </div>
      ),
      { ...size }
    );
  }

  const accent = ENDING_COLORS[data.endingType] || ENDING_COLORS.time_up;
  const glow = ENDING_GLOWS[data.endingType] || ENDING_GLOWS.time_up;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: '#08080c',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Gradient atmosphere */}
        <div
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            background: `radial-gradient(ellipse at 25% 30%, ${glow} 0%, transparent 50%)`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'radial-gradient(ellipse at 80% 80%, rgba(20,25,45,0.3) 0%, transparent 50%)',
          }}
        />

        {/* Content */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            padding: '60px 80px 48px',
          }}
        >
          {/* Header row */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16,
            }}
          >
            <div style={{
              fontSize: 16,
              color: 'rgba(255,255,255,0.25)',
              letterSpacing: '4px',
              textTransform: 'uppercase' as const,
            }}>
              The Room
            </div>
            <div style={{
              fontSize: 14,
              color: 'rgba(255,255,255,0.35)',
              letterSpacing: '2px',
            }}>
              {data.endingLabel}
            </div>
          </div>

          {/* Separator */}
          <div style={{
            height: 1,
            background: 'rgba(255,255,255,0.06)',
            marginBottom: 48,
          }} />

          {/* Main content — centered */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Emoji */}
            <div style={{ fontSize: 56, marginBottom: 24 }}>
              {data.endingEmoji}
            </div>

            {/* Company name */}
            <div style={{
              fontSize: 64,
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '-1.5px',
              lineHeight: 1.1,
              marginBottom: 16,
              textAlign: 'center' as const,
            }}>
              {data.companyName}
            </div>

            {/* Ending line */}
            <div style={{
              fontSize: 20,
              color: 'rgba(255,255,255,0.5)',
              lineHeight: 1.5,
              textAlign: 'center' as const,
              maxWidth: 700,
              marginBottom: 40,
            }}>
              {data.endingLine}
            </div>

            {/* Valuation */}
            <div style={{
              fontSize: 56,
              fontWeight: 700,
              color: accent,
              letterSpacing: '-1px',
              marginBottom: 8,
            }}>
              ${data.valuation}M
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{
              fontSize: 18,
              color: 'rgba(255,255,255,0.45)',
              fontStyle: 'italic',
            }}>
              Can you do better?
            </div>
            <div style={{
              fontSize: 16,
              color: 'rgba(255,255,255,0.2)',
              letterSpacing: '1px',
            }}>
              behindtheroom.com
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
