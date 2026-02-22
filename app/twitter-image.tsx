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

        {/* Content — centered for Twitter card */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            padding: '60px 80px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: 80,
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '-2px',
              lineHeight: 1.05,
              marginBottom: 20,
              fontFamily: 'serif',
            }}
          >
            The Room
          </div>

          <div
            style={{
              fontSize: 28,
              color: 'rgba(255,255,255,0.5)',
              fontWeight: 300,
              lineHeight: 1.4,
              marginBottom: 40,
            }}
          >
            Build a company. See how the story ends.
          </div>

          <div
            style={{
              fontSize: 18,
              color: 'rgba(255,255,255,0.3)',
              letterSpacing: '1px',
            }}
          >
            24 weeks · ∞ endings · behindtheroom.com
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
