import './globals.css';

import { ThemeProvider } from '@/components/theme/theme-provider';
import type { Metadata } from 'next';
import { Alice, Cormorant_Garamond, IBM_Plex_Mono } from 'next/font/google';

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
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
    : {}),
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
  // `locale` here is only ever set for the `[locale]` tree's own layout
  // rendering pass, not reliably for this shared root layout (it sits above
  // that segment) — kept only for the `lang` attribute. Locale-only concerns
  // (FirebaseInitializer, Organization/WebSite JSON-LD) live in
  // `[locale]/layout.tsx` instead, which never renders for /sites/[slug].
  return (
    <html lang={locale ?? 'en'} suppressHydrationWarning>
      <body
        className={`${alice.variable} ${cormorantGaramond.variable} ${ibmPlexMono.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
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