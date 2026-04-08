import type { Metadata } from 'next';
import { Be_Vietnam_Pro } from 'next/font/google';
import { SITE_URL } from '@/lib/site';
import './globals.css';

const be_vietnam_pro = Be_Vietnam_Pro({
  subsets: ['vietnamese', 'latin'],
  weight: ['400', '600', '700', '800', '900'],
  variable: '--font-be-vietnam-pro',
});

export const metadata: Metadata = {
  title: {
    default: 'XinChao - Survival Vietnamese for Travelers & Expats',
    template: '%s · XinChao',
  },
  description:
    "The Traveler's Lifebuoy. Survive the street food, negotiate like a local, and connect in Vietnam—offline-first.",
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: '/app-icon.png',
    apple: '/app-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en',
    url: SITE_URL,
    siteName: 'XinChao',
    title: 'XinChao - Survival Vietnamese for Travelers & Expats',
    description:
      "The Traveler's Lifebuoy. Survive the street food, negotiate like a local, and connect in Vietnam.",
  },
  twitter: {
    card: 'summary_large_image',
    title: 'XinChao - Survival Vietnamese',
    description:
      'Street-smart Vietnamese for travelers and expats. Offline survival packs, scan menus, bargain like a local.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={be_vietnam_pro.variable}>
      <body className="font-sans bg-brand-cream selection:bg-brand-red selection:text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
