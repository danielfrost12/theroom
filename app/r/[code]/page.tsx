import { Metadata } from 'next';
import { decodeResult } from '@/lib/share';
import { ResultCard } from './ResultCard';

interface Props {
  params: Promise<{ code: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  const data = decodeResult(code);
  if (!data) {
    return { title: 'The Room — A Startup CEO Simulation' };
  }

  const title = `${data.companyName} — ${data.endingLabel}`;
  const description = `${data.endingLine} Can you do better? Play The Room.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://behindtheroom.com/r/${code}`,
      siteName: 'The Room',
      type: 'website',
      images: [{
        url: `https://behindtheroom.com/r/${code}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: `${data.companyName} — ${data.endingLabel}`,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`https://behindtheroom.com/r/${code}/opengraph-image`],
    },
  };
}

export default async function SharePage({ params }: Props) {
  const { code } = await params;
  const data = decodeResult(code);

  if (!data) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0a0a0f',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'DM Sans', sans-serif",
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>?</div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16, marginBottom: 24 }}>
            This result link has expired or is invalid.
          </div>
          <a
            href="/"
            style={{
              background: '#fff',
              color: '#0a0a0f',
              padding: '14px 28px',
              borderRadius: 50,
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: 15,
            }}
          >
            Play The Room
          </a>
        </div>
      </div>
    );
  }

  return <ResultCard data={data} />;
}
