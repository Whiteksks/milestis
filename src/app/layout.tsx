import './globals.css';

import { FirebaseInitializer } from '@/lib/firebase';
import { ThemeProvider } from '@/components/theme/theme-provider';
import type { Metadata } from 'next';
import { Alice, Cormorant_Garamond, IBM_Plex_Mono } from 'next/font/google';
import Script from 'next/script';
import { headers } from 'next/headers';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_APP_URL ?? 'https://milestis.com'),
  title: {
    default: 'Milestis',
    template: '%s | Milestis',
  },
  description: 'Create your interactive photo book and share your story with the world.',
  robots: { index: true, follow: true },
  icons: {
    icon: [{ url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' }],
    shortcut: '/favicon.ico',
  },
  openGraph: {
    type: 'website',
    siteName: 'Milestis',
    title: 'Milestis',
    description: 'Create your interactive photo book and share your story with the world.',
    url: process.env.NEXT_APP_URL ?? 'https://milestis.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Milestis',
    description: 'Create your interactive photo book and share your story with the world.',
  },
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
  const headersList = await headers();
  const host = headersList.get('host') ?? '';
  const isPublishedSite = host.endsWith('.site');

  return (
    <html lang={locale ?? 'en'} suppressHydrationWarning>
      <head>
        {/* Iubenda temporarily disabled — was causing a stuck cookie banner
        {!isPublishedSite && (
          <Script
            id="iubenda-cookie-solution"
            strategy="afterInteractive"
            src="https://embeds.iubenda.com/widgets/f6bff847-fa8b-4753-8ce9-3dc2137f21d0.js"
          />
        )}
        */}
      </head>

      <body
        className={`${alice.variable} ${cormorantGaramond.variable} ${ibmPlexMono.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        {!isPublishedSite && <FirebaseInitializer />}

        <ThemeProvider
          attribute="class"
          themes={['light', 'dark', 'cozy', 'testtheme']}
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}