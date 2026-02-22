import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'The Room — A Startup CEO Simulation';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
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
        {/* Warm gradient */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(ellipse at 25% 40%, rgba(45,30,15,0.5) 0%, transparent 60%)',
          }}
        />
        {/* Cool accent */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(ellipse at 80% 70%, rgba(20,25,45,0.4) 0%, transparent 50%)',
          }}
        />

        {/* Content */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            height: '100%',
            padding: '80px 80px 60px',
          }}
        >
          {/* Ambient line */}
          <div
            style={{
              fontSize: 22,
              color: 'rgba(255,255,255,0.45)',
              fontStyle: 'italic',
              lineHeight: 1.6,
              marginBottom: 32,
              fontFamily: 'serif',
            }}
          >
            Monday morning. First day. The office smells like fresh paint and coffee.
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '-2px',
              lineHeight: 1.05,
              marginBottom: 16,
              fontFamily: 'serif',
            }}
          >
            The Room
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: 26,
              color: 'rgba(255,255,255,0.5)',
              fontWeight: 300,
              lineHeight: 1.4,
              marginBottom: 40,
            }}
          >
            Build a company. See how the story ends.
          </div>

          {/* Stats bar */}
          <div
            style={{
              display: 'flex',
              gap: 48,
            }}
          >
            {[
              { n: '11,847', label: 'CEOs played' },
              { n: '~20 min', label: 'to play' },
              { n: '3%', label: 'made it to IPO' },
            ].map((s) => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontSize: 22, fontWeight: 700, color: '#ffffff' }}>
                  {s.n}
                </span>
                <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.35)' }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* URL watermark */}
        <div
          style={{
            position: 'absolute',
            bottom: 28,
            right: 40,
            fontSize: 14,
            color: 'rgba(255,255,255,0.15)',
            letterSpacing: '1px',
          }}
        >
          behindtheroom.com
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
