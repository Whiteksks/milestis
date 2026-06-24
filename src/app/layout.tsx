import './globals.css';

import { FirebaseInitializer } from '@/lib/firebase';
import { ThemeProvider } from '@/components/theme/theme-provider';
import type { Metadata } from 'next';
import { Alice, Cormorant_Garamond, IBM_Plex_Mono } from 'next/font/google';
// ПРАВИЛЬНЫЙ ИМПОРТ: из next/script, а не из 'vm'
import Script from 'next/script'; 

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_APP_URL ?? 'https://milestis.com'),
  title: {
    default: 'Milestis',
    template: '%s | Milestis',
  },
  description: 'Create your interactive photo book and share your story with the world.',
  robots: { index: false, follow: false },
  openGraph: {
    type: 'website',
    siteName: 'Milestis',
    title: 'Milestis — Interactive Photo Books',
    description: 'Create your interactive photo book and share your story with the world.',
    url: '/',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Milestis',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Milestis — Interactive Photo Books',
    description: 'Create your interactive photo book and share your story with the world.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
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

  return (
    <html lang={locale ?? 'ru'} suppressHydrationWarning>
      <body
        className={`${alice.variable} ${cormorantGaramond.variable} ${ibmPlexMono.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <FirebaseInitializer />
        <ThemeProvider
          attribute="class"
          themes={["light", "dark", "cozy"]}
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>

        {/* iubenda Cookie Banner */}
        <Script
          id="iubenda-cookie-solution"
          src="https://embeds.iubenda.com/widgets/f6bff847-fa8b-4753-8ce9-3dc2137f21d0.js"
          strategy="afterInteractive"
        />

        {/* iubenda Consent Database */}
        <Script
          id="iubenda-cons-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `var _iub = _iub || {}; _iub.cons_instructions = _iub.cons_instructions || []; _iub.cons_instructions.push(["init", {api_key: "pvTSqMmlQs4Gnv7pVZu77irTq4IMsjD1"}]);`,
          }}
        />
        <Script
          id="iubenda-cons"
          src="https://cdn.iubenda.com/cons/iubenda_cons.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}