import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Abraj MIS Dashboard',
  description: 'Rig Operations Platform',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className="font-sans">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
