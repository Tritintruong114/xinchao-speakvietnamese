import type { Metadata } from 'next';
import { Be_Vietnam_Pro } from 'next/font/google';
import { NavbarWrapper } from '../components/layout/NavbarWrapper';
import { FooterSection } from '../components/sections/FooterSection';
import './globals.css';

const be_vietnam_pro = Be_Vietnam_Pro({
  subsets: ['vietnamese', 'latin'],
  weight: ['400', '600', '700', '800', '900'],
  variable: '--font-be-vietnam-pro',
});

export const metadata: Metadata = {
  title: 'XinChao - Survival Vietnamese for Travelers & Expats',
  description: 'The Traveler\'s Lifebuoy. Survive the street food, negotiate like a local, and connect in Vietnam—100% Offline.',
  metadataBase: new URL('https://xinchao-app.com'), // Replace with actual domain later
  icons: {
    icon: '/favicon.png',
    apple: '/app-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={be_vietnam_pro.variable}>
      <head>
        <link rel="icon" href="/favicon.png" />
      </head>
      <body className="font-sans bg-brand-cream selection:bg-brand-red selection:text-white min-h-screen flex flex-col">
        <NavbarWrapper />
        <main className="flex-grow">
          {children}
        </main>
        <FooterSection />
      </body>
    </html>
  );
}
