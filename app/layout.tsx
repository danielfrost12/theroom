import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'The Room — A Startup CEO Simulation',
  description: 'Build a company. See how the story ends. 24 weeks of impossible decisions.',
  metadataBase: new URL('https://behindtheroom.com'),
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '16x16', type: 'image/x-icon' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/icon.svg',
  },
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
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        {/* Apple touch icon handled via metadata.icons */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body>{children}</body>
    </html>
  );
}
