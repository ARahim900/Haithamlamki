import type {Metadata, Viewport} from 'next';
import {GeistSans} from 'geist/font/sans';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: 'Abraj MIS',
  description: 'Rig Operations Management Platform — Abraj Energy Services',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Abraj MIS',
  },
  icons: {
    icon: '/icons/icon-192.png',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={GeistSans.className} style={{'--font-geist': GeistSans.style.fontFamily} as React.CSSProperties}>
      <head>
        <meta name="theme-color" content="#2D7A89" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
