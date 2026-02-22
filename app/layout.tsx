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
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Room',
    description: 'Build a company. See how the story ends.',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover' as const,
  themeColor: '#0a0a0f',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body>{children}</body>
    </html>
  );
}
