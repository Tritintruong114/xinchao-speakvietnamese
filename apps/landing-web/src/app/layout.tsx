import type { Metadata } from 'next';
import { Be_Vietnam_Pro } from 'next/font/google';
import { SITE_DESCRIPTION_DEFAULT, SITE_DEFAULT_KEYWORDS } from '@/lib/seo';
import { SITE_NAME, SITE_URL } from '@/lib/site';
import './globals.css';

const be_vietnam_pro = Be_Vietnam_Pro({
  subsets: ['vietnamese', 'latin'],
  weight: ['400', '600', '700', '800', '900'],
  variable: '--font-be-vietnam-pro',
});

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — Survival Vietnamese for Travelers & Expats`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION_DEFAULT,
  keywords: SITE_DEFAULT_KEYWORDS,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  icons: {
    icon: [{ url: '/app-icon.png', type: 'image/png' }],
    apple: [{ url: '/app-icon.png', type: 'image/png' }],
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Survival Vietnamese for Travelers & Expats`,
    description: SITE_DESCRIPTION_DEFAULT,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — Survival Vietnamese`,
    description:
      'Street-smart Vietnamese for travelers and expats. Pocket survival packs, scan menus, bargain like a local.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  category: 'education',
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
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
