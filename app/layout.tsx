import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'The Room — A Startup CEO Simulation',
  description: 'Build a company. See how the story ends. 52 weeks of impossible decisions.',
  metadataBase: new URL('https://behindtheroom.com'),
  openGraph: {
    title: 'The Room — A Startup CEO Simulation',
    description: 'Build a company. See how the story ends.',
    url: 'https://behindtheroom.com',
    siteName: 'The Room',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Room',
    description: 'Build a company. See how the story ends.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
