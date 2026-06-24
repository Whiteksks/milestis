import './globals.css';

import { FirebaseInitializer } from '@/lib/firebase';
import { ThemeProvider } from '@/components/theme/theme-provider';
import type { Metadata } from 'next';
import { Alice, Cormorant_Garamond, IBM_Plex_Mono } from 'next/font/google';
import Script from 'next/script';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_APP_URL ?? 'https://milestis.com'),
  title: {
    default: 'Milestis',
    template: '%s | Milestis',
  },
  description: 'Create your interactive photo book and share your story with the world.',
  robots: { index: false, follow: false },
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
    <html lang={locale ?? 'en'} suppressHydrationWarning>
      <head>
        <Script
          id="iubenda-cookie-solution"
          strategy="afterInteractive"
          src="https://embeds.iubenda.com/widgets/f6bff847-fa8b-4753-8ce9-3dc2137f21d0.js"
        />
      </head>

      <body
        className={`${alice.variable} ${cormorantGaramond.variable} ${ibmPlexMono.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <FirebaseInitializer />

        <ThemeProvider
          attribute="class"
          themes={['light', 'dark', 'cozy']}
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Script
          id="iubenda-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              var _iub = _iub || {};
              _iub.cons_instructions = _iub.cons_instructions || [];
              _iub.cons_instructions.push([
                "init",
                { api_key: "pvTSqMmlQs4Gnv7pVZu77irTq4IMsjD1" }
              ]);
            `,
          }}
        />
      </body>
    </html>
  );
}