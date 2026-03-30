import type {Metadata, Viewport} from 'next';
import {GeistSans} from 'geist/font/sans';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: 'Abraj MIS Dashboard',
  description: 'Rig Operations Platform',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={GeistSans.className} style={{'--font-geist': GeistSans.style.fontFamily} as React.CSSProperties}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
