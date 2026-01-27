import './globals.css';

import FirebaseInitializer from '@/lib/firebaseInitializer';
import type { Metadata } from 'next';
import { Alice, Cormorant_Garamond, IBM_Plex_Mono } from 'next/font/google';

export const metadata: Metadata = {
  title: 'Milestis',
  description: 'Create Your Interactive Photo Book',
};

const alice = Alice({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-sans',
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-serif',
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
});

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale?: string }>;
}) {
  const { locale } = await params;

  return (
    <html lang={locale ?? 'ru'} suppressHydrationWarning>
      <body
        className={`${alice.variable} ${cormorantGaramond.variable} ${ibmPlexMono.variable} font-sans antialiased`}
      >
        <FirebaseInitializer />
        {children}
      </body>
    </html>
  );
}
