import type {Metadata} from 'next';
import './globals.css';
import { GeistSans } from "geist/font/sans";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: 'Abraj MIS Dashboard',
  description: 'Rig Operations Platform',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={cn("font-sans", GeistSans.variable)}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
